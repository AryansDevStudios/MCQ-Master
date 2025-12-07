'use server';

import { generateQuizFromTopic, type GenerateQuizFromTopicInput } from '@/ai/flows/generate-quiz-from-topic';

export async function generateQuizAction(input: GenerateQuizFromTopicInput) {
  try {
    const quiz = await generateQuizFromTopic(input);
    return { success: true, data: quiz };
  } catch (error) {
    console.error("Error generating quiz:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during quiz generation.";
    return { success: false, error: errorMessage };
  }
}
