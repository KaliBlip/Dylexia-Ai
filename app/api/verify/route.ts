import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test the basic API endpoint structure
    const testUrls = [
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small',
      'https://api-inference.huggingface.co/models/distilgpt2'
    ];

    const results = [];

    for (const url of testUrls) {
      try {
        console.log(`Testing URL: ${url}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`,
          },
          body: JSON.stringify({
            inputs: 'Hello',
            parameters: {
              max_new_tokens: 10,
              temperature: 0.7,
              do_sample: true,
              return_full_text: false,
            },
          }),
        });

        const result = {
          url,
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
          url,
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

  } catch (error) {
    return NextResponse.json({
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
