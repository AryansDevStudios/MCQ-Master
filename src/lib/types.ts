export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  date: string;
  quizTitle: string;
  score: number;
  total: number;
  timeSpent: string; // MM:SS
  mode: 'Instant' | 'Normal';
  quizData: Quiz;
  userAnswers: Record<number, number>; // index -> optionIndex
  questionNotes: Record<number, string>;
}

export type ViewState = 'home' | 'quiz' | 'results' | 'library' | 'history';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
