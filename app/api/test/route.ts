import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        inputs: 'Hello, how are you?',
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'API test failed', 
        status: response.status, 
        details: errorText 
      });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      response: data 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
