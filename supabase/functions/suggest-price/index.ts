import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceData {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  analysis: string;
  factors: string[];
}

// Safe JSON parse with validation for price data
function safeParsePriceData(content: string): PriceData | null {
  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const parsed = JSON.parse(jsonStr);
    
    // Validate and sanitize the parsed data
    const suggestedPrice = typeof parsed.suggestedPrice === 'number' && parsed.suggestedPrice > 0
      ? Math.round(parsed.suggestedPrice * 100) / 100
      : null;
    
    if (suggestedPrice === null) {
      console.warn('Invalid suggestedPrice in response');
      return null;
    }
    
    return {
      suggestedPrice,
      minPrice: typeof parsed.minPrice === 'number' && parsed.minPrice > 0
        ? Math.round(parsed.minPrice * 100) / 100
        : Math.round(suggestedPrice * 0.8 * 100) / 100,
      maxPrice: typeof parsed.maxPrice === 'number' && parsed.maxPrice > 0
        ? Math.round(parsed.maxPrice * 100) / 100
        : Math.round(suggestedPrice * 1.2 * 100) / 100,
      analysis: typeof parsed.analysis === 'string'
        ? String(parsed.analysis).slice(0, 1000)
        : 'Price based on current market conditions.',
      factors: Array.isArray(parsed.factors)
        ? parsed.factors
            .filter((f: unknown) => typeof f === 'string')
            .map((f: string) => String(f).slice(0, 200))
            .slice(0, 10)
        : ['Market demand', 'Quality', 'Location']
    };
  } catch (e) {
    console.error('Failed to parse price data:', e);
    return null;
  }
}

// Input validation helper
function validateInput(value: unknown, maxLength: number, fieldName: string): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().slice(0, maxLength);
  // Remove potentially dangerous characters for prompt injection
  return trimmed.replace(/[<>{}[\]\\]/g, '');
}

function validateNumber(value: unknown, min: number, max: number): number | null {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num) || num < min || num > max) return null;
  return num;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize inputs
    const cropName = validateInput(body.cropName, 100, 'cropName');
    const category = validateInput(body.category, 50, 'category');
    const unit = validateInput(body.unit, 20, 'unit');
    const state = validateInput(body.state, 50, 'state');
    const district = validateInput(body.district, 50, 'district');
    const quantity = validateNumber(body.quantity, 0, 1000000);
    const isOrganic = Boolean(body.isOrganic);
    
    if (!cropName || !category || !unit || !state || !district) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (quantity === null) {
      return new Response(
        JSON.stringify({ error: 'Invalid quantity' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are an agricultural pricing expert for India. Suggest a fair market price in Indian Rupees (₹) per ${unit} for the following crop:

Crop: ${cropName}
Category: ${category}
Quantity: ${quantity} ${unit}
Location: ${district}, ${state}
Organic: ${isOrganic ? 'Yes' : 'No'}

Provide:
1. Suggested price per ${unit} (₹)
2. Price range (minimum to maximum)
3. Brief market analysis (2-3 sentences)
4. Factors affecting the price

Format your response as JSON with keys: suggestedPrice, minPrice, maxPrice, analysis, factors (array of strings).`;

    console.log('Requesting price suggestion for:', { cropName, category, state, district });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an agricultural pricing expert. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response received');

    // Parse and validate JSON response
    const priceData = safeParsePriceData(content);
    
    if (!priceData) {
      console.error('Failed to parse valid price data from AI response');
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(priceData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in suggest-price function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
