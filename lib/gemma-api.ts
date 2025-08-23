export interface GemmaResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GemmaError {
  error: string;
}

export async function callGemmaAPI(message: string): Promise<GemmaResponse> {
  try {
    const response = await fetch('/api/gemma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData: GemmaError = await response.json();
      throw new Error(errorData.error || 'Failed to get response from AI');
    }

    const data: GemmaResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Gemma API:', error);
    throw error;
  }
}
