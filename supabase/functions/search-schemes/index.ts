import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Safe JSON parse with validation for search results
function safeParseSearchResults(jsonStr: string): Array<{ scheme_id: string; relevance_score: number; match_reason: string }> {
  try {
    const parsed = JSON.parse(jsonStr);
    const results = parsed?.results;
    
    if (!Array.isArray(results)) {
      console.warn('Results is not an array, returning empty');
      return [];
    }
    
    // Validate and sanitize each result
    return results
      .filter((item: unknown) => {
        if (typeof item !== 'object' || item === null) return false;
        const r = item as Record<string, unknown>;
        return typeof r.scheme_id === 'string' && r.scheme_id.length > 0;
      })
      .map((item: Record<string, unknown>) => ({
        scheme_id: String(item.scheme_id).slice(0, 100),
        relevance_score: typeof item.relevance_score === 'number' 
          ? Math.min(100, Math.max(0, item.relevance_score)) 
          : 50,
        match_reason: typeof item.match_reason === 'string' 
          ? String(item.match_reason).slice(0, 500) 
          : 'No match reason provided'
      }));
  } catch (e) {
    console.error('Failed to parse search results:', e);
    return [];
  }
}

// Input validation helper
function sanitizeInput(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength).replace(/[<>{}[\]\\]/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    // Verify user
    const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Authenticated user:', user.id);

    const body = await req.json();
    
    // Validate and sanitize inputs
    const query = sanitizeInput(body.query, 500);
    const language = ['en', 'mr'].includes(body.language) ? body.language : 'en';
    const limit = Math.min(Math.max(1, parseInt(body.limit) || 20), 50);
    
    console.log('Search schemes request:', { query, language, limit });

    if (!query || query.length === 0) {
      return new Response(
        JSON.stringify({ results: [], message: 'Empty query' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get all active schemes
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: schemes, error: schemeError } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('is_active', true);

    if (schemeError) {
      console.error('Scheme fetch error:', schemeError);
      throw schemeError;
    }

    console.log(`Fetched ${schemes?.length || 0} schemes for search`);

    // Prepare schemes for AI analysis (use Marathi fields if language is 'mr')
    const schemesContext = schemes?.map(s => ({
      id: s.id,
      name: language === 'mr' ? s.scheme_name_mr : s.scheme_name,
      category: s.category,
      subcategory: s.subcategory,
      description: language === 'mr' ? s.description_mr : s.description,
      tags: s.tags,
      target: s.target_beneficiary,
      state: s.state
    }));

    const systemPrompt = `You are a semantic search engine for government schemes. 
Analyze the user's query and find the most relevant schemes.

User Query: "${query}"
Language: ${language === 'mr' ? 'Marathi' : 'English'}

Available Schemes:
${JSON.stringify(schemesContext, null, 2)}

Understand the intent behind the query. For example:
- "I need help with irrigation" → irrigation schemes
- "मला पाऊस विमा हवा आहे" → crop insurance schemes
- "subsidy for equipment" → machinery schemes

Return results in this exact JSON format:
{
  "results": [
    {
      "scheme_id": "uuid",
      "relevance_score": 95,
      "match_reason": "Brief explanation of why this matches"
    }
  ]
}

Return top ${limit} most relevant schemes.`;

    // Call Lovable AI for semantic search
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Search for: ${query}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "search_schemes",
            description: "Return search results with relevance scores",
            parameters: {
              type: "object",
              properties: {
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      scheme_id: { type: "string" },
                      relevance_score: { type: "number" },
                      match_reason: { type: "string" }
                    },
                    required: ["scheme_id", "relevance_score", "match_reason"]
                  }
                }
              },
              required: ["results"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "search_schemes" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required. Please add credits to your Lovable AI workspace.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI search response received');

    // Extract and validate results from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const searchResults = toolCall 
      ? safeParseSearchResults(toolCall.function.arguments)
      : [];

    // Enrich results with full scheme data
    const enrichedResults = searchResults.map((result) => {
      const scheme = schemes?.find(s => s.id === result.scheme_id);
      return {
        ...result,
        scheme: scheme || null
      };
    }).filter((result) => result.scheme !== null);

    console.log(`Returning ${enrichedResults.length} search results`);

    return new Response(
      JSON.stringify({ 
        results: enrichedResults,
        query,
        count: enrichedResults.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in search-schemes:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
