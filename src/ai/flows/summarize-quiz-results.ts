// SummarizeQuizResults Story: As a user, I want to receive a summary of my quiz results using generative AI to highlight key areas for improvement based on my incorrect answers, so that I can more efficiently focus my studying efforts.

'use server';

/**
 * @fileOverview Summarizes quiz results using generative AI to highlight key areas for improvement.
 *
 * - summarizeQuizResults - A function that handles the quiz results summarization.
 * - SummarizeQuizResultsInput - The input type for the summarizeQuizResults function.
 * - SummarizeQuizResultsOutput - The return type for the summarizeQuizResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuizResultsInputSchema = z.object({
  quizTitle: z.string().describe('The title of the quiz.'),
  questions: z.array(
    z.object({
      question: z.string(),
      correctAnswer: z.number(),
    })
  ).describe('An array of quiz questions with their correct answers.'),
  userAnswers: z.record(z.string(), z.number()).describe('A map of question index to the user\'s answer.'),
});

export type SummarizeQuizResultsInput = z.infer<typeof SummarizeQuizResultsInputSchema>;

const SummarizeQuizResultsOutputSchema = z.object({
  summary: z.string().describe('A summary of the quiz results highlighting areas for improvement.'),
});

export type SummarizeQuizResultsOutput = z.infer<typeof SummarizeQuizResultsOutputSchema>;

export async function summarizeQuizResults(input: SummarizeQuizResultsInput): Promise<SummarizeQuizResultsOutput> {
  return summarizeQuizResultsFlow(input);
}

const summarizeQuizResultsPrompt = ai.definePrompt({
  name: 'summarizeQuizResultsPrompt',
  input: {schema: SummarizeQuizResultsInputSchema},
  output: {schema: SummarizeQuizResultsOutputSchema},
  prompt: `You are an AI quiz summarizer. Given the quiz title, questions, and user's answers, provide a summary of the results highlighting key areas for improvement.

Quiz Title: {{{quizTitle}}}

Questions:
{{#each questions}}
  {{@index}}: {{{question}}}
{{/each}}

User Answers:
{{#each userAnswers}}
  {{@key}}: {{{this}}}
{{/each}}

Summary:`,
});

const summarizeQuizResultsFlow = ai.defineFlow(
  {
    name: 'summarizeQuizResultsFlow',
    inputSchema: SummarizeQuizResultsInputSchema,
    outputSchema: SummarizeQuizResultsOutputSchema,
  },
  async input => {
    const {output} = await summarizeQuizResultsPrompt(input);
    return output!;
  }
);
