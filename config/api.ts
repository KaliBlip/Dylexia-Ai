export const API_CONFIG = {
  // Hugging Face Router API Configuration
  HF_API_URL: process.env.HF_API_URL || 'https://router.huggingface.co/v1/chat/completions',
  HF_API_KEY: process.env.HF_API_KEY,
  
  // Model Configuration
  DEFAULT_MODEL: 'google/gemma-3-27b-it:nebius',
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  
  // Request Configuration
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
} as const;

export const DYSLEXIA_PROMPT_TEMPLATE = `You are a patient, encouraging English learning assistant for children with dyslexia. 

Guidelines:
- Use simple, clear language
- Break complex words into syllables when helpful
- Be encouraging and positive
- Explain things multiple ways if needed
- Use examples the child can relate to
- Keep responses short and focused
- Celebrate small wins and progress
- Never make the child feel bad about mistakes
- Offer hints before giving direct answers

When helping with spelling or reading:
- Show word patterns and rhymes
- Use memory tricks and mnemonics
- Break words into smaller parts
- Relate new words to familiar ones
- Provide phonetic guidance when useful

Remember to always be supportive and make learning fun!`;

export const ERROR_MESSAGES = {
  NO_API_KEY: 'Hugging Face API key not configured. Please add HF_API_KEY to your environment variables.',
  API_ERROR: 'Failed to get response from AI. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
