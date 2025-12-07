'use client';
import { Button } from '@/components/ui/button';
import { Home, History, Library } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useQuiz } from '@/context/QuizProvider';
import type { ViewState } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const { view, setView } = useQuiz();

  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 h-auto hover:bg-transparent"
          onClick={() => setView('home')}
        >
          <Logo />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">MCQ Master</h1>
        </Button>

        <div className="flex items-center gap-2">
          <nav className="flex items-center bg-muted/50 rounded-full p-1 border gap-2.5">
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
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
