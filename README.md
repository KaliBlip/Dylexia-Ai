# Dyslexia AI Learning Assistant

A Next.js application that provides a patient, encouraging English learning assistant for children with dyslexia, powered by Hugging Face's GPT-2 model.

## Features

- 🤖 **AI-Powered Learning**: Integrated with Hugging Face's GPT-2 model for intelligent responses
- 🎯 **Dyslexia-Friendly**: Designed specifically for children with dyslexia with simple, clear language
- 🎨 **Accessible UI**: Large text, clear contrast, and easy-to-use interface
- 🔊 **Voice Support**: Text-to-speech functionality for auditory learning
- 💬 **Interactive Chat**: Real-time conversation with the AI assistant
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Hugging Face API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Dylexia-Ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
# Hugging Face API Configuration
HF_API_KEY=your_huggingface_api_key_here

# Optional: Custom API URL (if using a different endpoint)
# HF_API_URL=https://api-inference.huggingface.co/models/gpt2
```

4. Get your Hugging Face API key:
   - Visit [Hugging Face](https://huggingface.co/settings/tokens)
   - Sign up for a free account
   - Generate an API token
   - Add it to your `.env.local` file

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The app uses a custom API route (`/api/gemma`) that:

- Implements the dyslexia-friendly prompt template
- Handles authentication with the Hugging Face API
- Provides error handling and response formatting
- Supports conversation context

### Prompt Template

The AI assistant is configured with a specialized prompt template that:
- Uses simple, clear language
- Breaks complex words into syllables
- Provides encouraging and positive responses
- Offers multiple explanations when needed
- Uses relatable examples
- Celebrates progress and small wins
- Never makes children feel bad about mistakes
- Provides hints before direct answers

## Deployment

The app is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

### Environment Variables for Production

Make sure to set the following environment variables in your deployment platform:

- `HF_API_KEY`: Your Hugging Face API key
- `HF_API_URL`: (Optional) Custom API endpoint

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Enhancing the AI prompt template

## License

This project is open source and available under the MIT License.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dd730781-9576s-projects/v0-no-content)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/P7aEAkKQZYx)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/dd730781-9576s-projects/v0-no-content](https://vercel.com/dd730781-9576s-projects/v0-no-content)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/P7aEAkKQZYx](https://v0.app/chat/projects/P7aEAkKQZYx)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
