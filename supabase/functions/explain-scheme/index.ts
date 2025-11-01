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
    const { schemeId, question, language = 'en', userContext } = await req.json();
    console.log('Explain scheme request:', { schemeId, question, language });

    if (!schemeId || !question) {
      return new Response(
        JSON.stringify({ error: 'Missing schemeId or question' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get scheme details
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: scheme, error: schemeError } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('id', schemeId)
      .single();

    if (schemeError || !scheme) {
      console.error('Scheme fetch error:', schemeError);
      return new Response(
        JSON.stringify({ error: 'Scheme not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare scheme data in appropriate language
    const schemeData = language === 'mr' ? {
      name: scheme.scheme_name_mr,
      description: scheme.description_mr,
      benefits: scheme.benefits_mr,
      eligibility: scheme.eligibility_criteria_mr,
      application: scheme.application_process_mr,
      documents: scheme.required_documents_mr,
      category: scheme.category,
      scheme_type: scheme.scheme_type,
      target: scheme.target_beneficiary,
      amount_range: scheme.amount_min && scheme.amount_max ? `₹${scheme.amount_min} - ₹${scheme.amount_max}` : null,
      contact: scheme.contact_info
    } : {
      name: scheme.scheme_name,
      description: scheme.description,
      benefits: scheme.benefits,
      eligibility: scheme.eligibility_criteria,
      application: scheme.application_process,
      documents: scheme.required_documents,
      category: scheme.category,
      scheme_type: scheme.scheme_type,
      target: scheme.target_beneficiary,
      amount_range: scheme.amount_min && scheme.amount_max ? `₹${scheme.amount_min} - ₹${scheme.amount_max}` : null,
      contact: scheme.contact_info
    };

    const systemPrompt = `You are a helpful agricultural advisor explaining government schemes to farmers.
Language: ${language === 'mr' ? 'Marathi' : 'English'}

Scheme Details:
${JSON.stringify(schemeData, null, 2)}

${userContext ? `Farmer Context:\n${JSON.stringify(userContext, null, 2)}\n` : ''}

Answer the farmer's question about this scheme in a clear, friendly, and practical way.
- Use simple language
- Be specific and actionable
- Reference exact requirements from the scheme data
- If asked about eligibility, check against farmer's context if provided
- If asked how to apply, provide step-by-step guidance
- Answer in ${language === 'mr' ? 'Marathi' : 'English'}`;

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
          { role: 'user', content: question }
        ],
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
    const answer = aiData.choices?.[0]?.message?.content || 'Unable to generate answer';

    console.log('Generated answer for scheme question');

    return new Response(
      JSON.stringify({ 
        answer,
        scheme: schemeData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in explain-scheme:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});