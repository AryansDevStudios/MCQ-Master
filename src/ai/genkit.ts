import {genkit, type GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let keyIndex = 0;

function getApiKey(): string | undefined {
  const keyCount = parseInt(process.env.GEMINI_API_KEY_COUNT || '1', 10);
  if (keyCount === 0) return process.env.GEMINI_API_KEY;
  if (keyCount === 1) return process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1;

  const currentKeyIndex = (keyIndex % keyCount) + 1;
  const apiKey = process.env[`GEMINI_API_KEY_${currentKeyIndex}`];
  keyIndex++;
  
  return apiKey;
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey,
      clientOptions: {
        retry: {
          // This retry is for transient network errors, not for quota issues.
          // The key rotation handles the quota issues.
          maxAttempts: 3,
        },
      },
    }),
  ],
  model: 'googleai/gemini-2.5-flash-lite',
});
