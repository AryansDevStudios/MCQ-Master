'use server';

/**
 * @fileOverview Generates a quiz from a given topic, difficulty, question count, and style.
 *
 * - generateQuizFromTopic - A function that generates a quiz.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  questionCount: z.number().describe('The number of questions to generate.'),
  difficulty: z.string().describe('The difficulty level of the quiz (e.g., Easy, Medium, Hard).'),
  quizStyle: z.string().describe('The style of the quiz (e.g., General, Conceptual, Problem Solving).'),
  context: z.string().optional().describe('Context to use for generating the quiz questions.'),
});

export type GenerateQuizFromTopicInput = z.infer<typeof GenerateQuizFromTopicInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.number().describe('The index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('The explanation of why the answer is correct.'),
});

const GenerateQuizFromTopicOutputSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(QuestionSchema).describe('The questions in the quiz.'),
});

export type GenerateQuizFromTopicOutput = z.infer<typeof GenerateQuizFromTopicOutputSchema>;

export async function generateQuizFromTopic(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz on the topic of {{topic}} with {{questionCount}} questions. The difficulty level should be {{difficulty}} and the quiz style should be {{quizStyle}}.\n\n{% if context %}\nUse the following context to generate the quiz questions:\n{{context}}\n{% endif %}`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
