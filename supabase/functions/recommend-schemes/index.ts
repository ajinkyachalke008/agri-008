import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Safe JSON parse with validation
function safeParseRecommendations(jsonStr: string): Array<{ scheme_id: string; relevance_score: number; reason: string }> {
  try {
    const parsed = JSON.parse(jsonStr);
    const recommendations = parsed?.recommendations;
    
    if (!Array.isArray(recommendations)) {
      console.warn('Recommendations is not an array, returning empty');
      return [];
    }
    
    // Validate and sanitize each recommendation
    return recommendations
      .filter((rec: unknown) => {
        if (typeof rec !== 'object' || rec === null) return false;
        const r = rec as Record<string, unknown>;
        return typeof r.scheme_id === 'string' && r.scheme_id.length > 0;
      })
      .map((rec: Record<string, unknown>) => ({
        scheme_id: String(rec.scheme_id).slice(0, 100),
        relevance_score: typeof rec.relevance_score === 'number' 
          ? Math.min(100, Math.max(0, rec.relevance_score)) 
          : 50,
        reason: typeof rec.reason === 'string' 
          ? String(rec.reason).slice(0, 500) 
          : 'No reason provided'
      }));
  } catch (e) {
    console.error('Failed to parse recommendations:', e);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, limit = 10 } = await req.json();
    console.log('Recommend schemes request:', { userProfile, limit });

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

    console.log(`Fetched ${schemes?.length || 0} schemes`);

    // Prepare context for AI
    const schemesContext = schemes?.map(s => ({
      id: s.id,
      name: s.scheme_name,
      category: s.category,
      subcategory: s.subcategory,
      description: s.description,
      benefits: s.benefits,
      eligibility: s.eligibility_criteria,
      target: s.target_beneficiary,
      tags: s.tags,
      amount_range: s.amount_min && s.amount_max ? `₹${s.amount_min} - ₹${s.amount_max}` : null
    })).slice(0, 50); // Limit context size

    const systemPrompt = `You are an expert agricultural advisor helping farmers discover relevant government schemes. 
Analyze the farmer's profile and recommend the most suitable government schemes.

Farmer Profile:
${JSON.stringify(userProfile, null, 2)}

Available Schemes:
${JSON.stringify(schemesContext, null, 2)}

Provide recommendations in this exact JSON format:
{
  "recommendations": [
    {
      "scheme_id": "uuid",
      "relevance_score": 85,
      "reason": "This scheme matches your profile because..."
    }
  ]
}

Consider:
- Farmer's location (state, district)
- Farm size and crops grown
- Specific needs or problems mentioned
- Eligibility criteria match
- Target beneficiary categories
- Financial situation

Return top ${limit} most relevant schemes ranked by relevance score (0-100).`;

    // Call Lovable AI
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
          { role: 'user', content: `Recommend schemes for this farmer profile: ${JSON.stringify(userProfile)}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "recommend_schemes",
            description: "Return scheme recommendations with relevance scores",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      scheme_id: { type: "string" },
                      relevance_score: { type: "number" },
                      reason: { type: "string" }
                    },
                    required: ["scheme_id", "relevance_score", "reason"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_schemes" } }
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
    console.log('AI response received');

    // Extract and validate recommendations from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recommendations = toolCall 
      ? safeParseRecommendations(toolCall.function.arguments)
      : [];

    // Enrich recommendations with full scheme data
    const enrichedRecommendations = recommendations.map((rec) => {
      const scheme = schemes?.find(s => s.id === rec.scheme_id);
      return {
        ...rec,
        scheme: scheme || null
      };
    }).filter((rec) => rec.scheme !== null);

    console.log(`Returning ${enrichedRecommendations.length} recommendations`);

    return new Response(
      JSON.stringify({ recommendations: enrichedRecommendations }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in recommend-schemes:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
