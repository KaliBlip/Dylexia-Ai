import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test with a very simple, widely available model
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:nebius",
        messages: [
          {
            role: "system",
            content: "You are a patient, encouraging English learning assistant for children with dyslexia. Use simple, clear language and be very supportive."
          },
          {
            role: "user",
            content: "Hello, I'm a child with dyslexia. Can you help me learn English?"
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
        stream: false,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
    }

    const data = await response.json();
    console.log('Success response:', data);

    return NextResponse.json({
      success: true,
      status: response.status,
      data: data
    });

  } catch (error) {
    console.error('Exception:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
