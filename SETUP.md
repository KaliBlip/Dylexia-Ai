# Setup Guide for Dyslexia AI

This guide will help you set up the Hugging Face API integration for the Dyslexia AI Learning Assistant.

## Step 1: Get a Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Sign up for a free account
3. Navigate to Settings > Access Tokens
4. Create a new token with "read" permissions
5. Copy the generated token

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root directory of your project
2. Add the following content:

```bash
# Hugging Face API Configuration
HF_API_KEY=your_actual_api_key_here

# Optional: Custom API URL (if using a different endpoint)
# HF_API_URL=https://api-inference.huggingface.co/models/google/gemma-2b-it
```

3. Replace `your_actual_api_key_here` with the API token you obtained from Hugging Face

## Step 3: Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Step 4: Verify Connection

1. Open your browser and navigate to `http://localhost:3000`
2. Look for the API Status card at the top of the page
3. It should show "API Connected" with a green checkmark
4. If you see "API Key Missing", double-check your `.env.local` file

## Troubleshooting

### API Key Not Working
- Make sure the API token is correctly copied from Hugging Face
- Verify there are no extra spaces or characters in the `.env.local` file
- Ensure the file is named exactly `.env.local` (not `.env.local.txt`)

### Network Errors
- Check your internet connection
- Verify that the Gemma API service is available
- Try the "Test Connection" button in the API Status card

### Permission Errors
- Make sure you have access to the Gemma model on Hugging Face
- Check if your API token has the necessary permissions
- Verify your account is not suspended

## Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `HF_API_KEY` | Yes | Your Hugging Face API token | - |
| `HF_API_URL` | No | Custom API endpoint | `https://api-inference.huggingface.co/models/google/gemma-2b-it` |

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly
- Consider using environment variables in production deployments

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the environment variables in your deployment platform's settings
2. Set `HF_API_KEY` to your production API token
3. Optionally set `HF_API_URL` if using a custom endpoint
4. Redeploy your application

The API Status component will help you verify that everything is working correctly in production.
