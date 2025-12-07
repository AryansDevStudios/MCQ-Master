'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Quiz, QuizAttempt, ViewState, Toast } from '@/lib/types';

const LOCAL_STORAGE_SAVED_KEY = 'mcq_saved_quizzes';
const LOCAL_STORAGE_HISTORY_KEY = 'mcq_history';
const LOCAL_STORAGE_THEME_KEY = 'mcq_theme';

type Theme = 'light' | 'dark';

interface QuizContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  
  theme: Theme;
  toggleTheme: () => void;

  savedQuizzes: Quiz[];
  history: QuizAttempt[];
  
  activeQuiz: Quiz | null;
  userAnswers: Record<number, number>;
  questionNotes: Record<number, string>;
  currentQuestionIndex: number;
  isInstantMode: boolean;
  checkedQuestions: Record<number, boolean>;
  
  elapsedSeconds: number;
  isTimerRunning: boolean;

  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;

  saveQuizToStorage: (quiz: Quiz) => void;
  deleteQuizFromStorage: (quizTitle: string) => void;
  clearHistory: () => void;

  startQuiz: (quiz: Quiz, instantMode?: boolean) => void;
  handleOptionSelect: (optionIndex: number) => void;
  handleCheckAnswer: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleShuffleOptions: () => void;
  submitQuiz: () => void;
  setIsInstantMode: (isInstant: boolean) => void;
  setQuestionNotes: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setHistory: React.Dispatch<React.SetStateAction<QuizAttempt[]>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [view, setView] = useState<ViewState>('home');
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Data State
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  
  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionNotes, setQuestionNotes] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInstantMode, setIsInstantMode] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  
  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // UI State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Effects ---

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      const hist = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      
      if (saved) setSavedQuizzes(JSON.parse(saved));
      if (hist) setHistory(JSON.parse(hist));
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setTheme(storedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }

    } catch (e) {
      console.error("Failed to load from local storage", e);
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  
  // --- Actions ---

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
        return newTheme;
    });
  };

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const saveQuizToStorage = useCallback((quiz: Quiz) => {
    setSavedQuizzes(prev => {
      const updated = [quiz, ...prev.filter(q => q.title !== quiz.title)];
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(updated));
      return updated;
    });
    addToast('Quiz saved to library', 'success');
  }, [addToast]);

  const deleteQuizFromStorage = useCallback((quizTitle: string) => {
    setSavedQuizzes(prev => {
      const updated = prev.filter(q => q.title !== quizTitle);
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(updated));
      return updated;
    });
    addToast('Quiz deleted', 'info');
  }, [addToast]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify([]));
    addToast('History cleared', 'success');
  }, [addToast]);

  // --- Quiz Logic ---

  const startQuiz = useCallback((quiz: Quiz, instantMode: boolean = false) => {
    setActiveQuiz(JSON.parse(JSON.stringify(quiz))); // Deep copy
    setUserAnswers({});
    setQuestionNotes({});
    setCheckedQuestions({});
    setCurrentQuestionIndex(0);
    setIsInstantMode(instantMode);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setView('quiz');
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    if (checkedQuestions[currentQuestionIndex]) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleCheckAnswer = () => {
    if (userAnswers[currentQuestionIndex] === undefined) {
      addToast('Please select an option first', 'error');
      return;
    }
    setCheckedQuestions(prev => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleShuffleOptions = () => {
    if (!activeQuiz || checkedQuestions[currentQuestionIndex]) return;
    
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const originalOptions = [...currentQ.options];
    const correctOptionText = originalOptions[currentQ.correctAnswer];
    
    const shuffled = [...originalOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const newCorrectIndex = shuffled.indexOf(correctOptionText);
    
    const newQuestions = [...activeQuiz.questions];
    newQuestions[currentQuestionIndex] = {
      ...currentQ,
      options: shuffled,
      correctAnswer: newCorrectIndex
    };
    
    setActiveQuiz({ ...activeQuiz, questions: newQuestions });
    
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestionIndex];
    setUserAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    setIsTimerRunning(false);
    
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      quizTitle: activeQuiz.title,
      score: correctCount,
      total: activeQuiz.questions.length,
      timeSpent: `${m}:${s}`,
      mode: isInstantMode ? 'Instant' : 'Normal',
      quizData: activeQuiz,
      userAnswers,
      questionNotes
    };

    setHistory(prev => {
      const updatedHistory = [attempt, ...prev];
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    setView('results');
  };

  return (
    <QuizContext.Provider value={{
      view, setView,
      theme, toggleTheme,
      savedQuizzes, history,
      activeQuiz, userAnswers, questionNotes, currentQuestionIndex,
      isInstantMode, checkedQuestions, elapsedSeconds, isTimerRunning,
      toasts, addToast, saveQuizToStorage, deleteQuizFromStorage, clearHistory,
      startQuiz, handleOptionSelect, handleCheckAnswer, handleNext, handlePrev,
      handleShuffleOptions, submitQuiz, setIsInstantMode, setQuestionNotes,
      setHistory
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
