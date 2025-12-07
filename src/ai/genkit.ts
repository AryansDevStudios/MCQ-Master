import {genkit, type GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let keyIndex = 0;

function getApiKey(): string | undefined {
  const keyCount = parseInt(process.env.GEMINI_API_KEY_COUNT || '1', 10);
  if (keyCount === 0) return undefined;

  const apiKey = process.env[`GEMINI_API_KEY_${(keyIndex % keyCount) + 1}`];
  keyIndex++;
  return apiKey || process.env.GEMINI_API_KEY;
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
      requestMiddleware: (req, next) => {
        // This middleware is where we can implement more complex logic.
        // For now, the apiKey function handles simple round-robin rotation.
        return next(req);
      },
    }),
  ],
  model: 'googleai/gemini-2.5-flash-lite',
});
