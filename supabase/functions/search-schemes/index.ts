import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'en', limit = 20 } = await req.json();
    console.log('Search schemes request:', { query, language, limit });

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ results: [], message: 'Empty query' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

    // Extract results from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const searchResults = toolCall ? JSON.parse(toolCall.function.arguments).results : [];

    // Enrich results with full scheme data
    const enrichedResults = searchResults.map((result: any) => {
      const scheme = schemes?.find(s => s.id === result.scheme_id);
      return {
        ...result,
        scheme: scheme || null
      };
    }).filter((result: any) => result.scheme !== null);

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