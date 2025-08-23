import { NextRequest, NextResponse } from 'next/server';

const MODELS_TO_TEST = [
  'microsoft/DialoGPT-medium',
  'microsoft/DialoGPT-small',
  'distilgpt2'
];

export async function GET(request: NextRequest) {
  const results = [];
  
  for (const model of MODELS_TO_TEST) {
    try {
      console.log(`Testing model: ${model}`);
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: {
            max_new_tokens: 20,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      const result = {
        model,
        status: response.status,
        ok: response.ok,
        error: null,
        data: null
      };

      if (response.ok) {
        try {
          const data = await response.json();
          result.data = data;
        } catch (e) {
          result.error = 'Failed to parse JSON response';
        }
      } else {
        result.error = await response.text();
      }

      results.push(result);
      
    } catch (error) {
      results.push({
        model,
        status: 'ERROR',
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      });
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: results.length,
      working: results.filter(r => r.ok).length,
      failed: results.filter(r => !r.ok).length
    }
  });
}
