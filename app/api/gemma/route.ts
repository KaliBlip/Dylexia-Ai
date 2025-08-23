import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG, DYSLEXIA_PROMPT_TEMPLATE, ERROR_MESSAGES } from '@/config/api';

export async function POST(request: NextRequest) {
  try {
    if (!API_CONFIG.HF_API_KEY) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NO_API_KEY },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

    // Format the prompt for Hugging Face Router API (OpenAI-compatible)
    const messages = [
      {
        role: "system",
        content: DYSLEXIA_PROMPT_TEMPLATE
      },
      {
        role: "user",
        content: message
      }
    ];

    const response = await fetch(API_CONFIG.HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.HF_API_KEY}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.DEFAULT_MODEL,
        messages: messages,
        max_tokens: API_CONFIG.MAX_TOKENS,
        temperature: API_CONFIG.TEMPERATURE,
        top_p: API_CONFIG.TOP_P,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', {
        status: response.status,
        statusText: response.statusText,
        url: API_CONFIG.HF_API_URL,
        error: errorData
      });
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.API_ERROR,
          details: `Status: ${response.status} - ${errorData}`,
          url: API_CONFIG.HF_API_URL
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from OpenAI-compatible response
    let assistantMessage = '';
    if (data.choices && data.choices.length > 0) {
      assistantMessage = data.choices[0]?.message?.content || '';
    } else if (typeof data === 'string') {
      assistantMessage = data;
    } else {
      // Fallback for other response formats
      assistantMessage = data.generated_text || data.text || '';
    }
    
    // Clean up the response if needed
    if (assistantMessage.includes('Assistant:')) {
      assistantMessage = assistantMessage.split('Assistant:')[1]?.trim() || assistantMessage;
    }
    
    if (!assistantMessage) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.API_ERROR },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      response: assistantMessage,
      usage: { total_tokens: assistantMessage.length } // Approximate token count
    });

  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: ERROR_MESSAGES.TIMEOUT_ERROR },
          { status: 408 }
        );
      }
    }
    
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
