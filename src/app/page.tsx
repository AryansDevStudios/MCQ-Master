'use client';
import { useQuiz } from '@/context/QuizProvider';
import { HomeView } from '@/components/views/HomeView';
import { QuizView } from '@/components/views/QuizView';
import { ResultsView } from '@/components/views/ResultsView';
import { LibraryView } from '@/components/views/LibraryView';
import { HistoryView } from '@/components/views/HistoryView';

export default function Home() {
  const { view } = useQuiz();

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView />;
      case 'quiz':
        return <QuizView />;
      case 'results':
        return <ResultsView />;
      case 'library':
        return <LibraryView />;
      case 'history':
        return <HistoryView />;
      default:
        return <HomeView />;
    }
  };

  return <>{renderView()}</>;
}
