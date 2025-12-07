'use client';
import { Button } from '@/components/ui/button';
import { Home, History, Library } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useQuiz } from '@/context/QuizProvider';
import type { ViewState } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Header() {
  const { view, setView } = useQuiz();

  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 h-auto hover:bg-transparent"
          onClick={() => setView('home')}
        >
          <Logo />
          <h1 className="text-xl font-bold tracking-tight text-white font-headline">MCQ Master</h1>
        </Button>

        <nav className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setView(item.id)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all h-9',
                view === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
