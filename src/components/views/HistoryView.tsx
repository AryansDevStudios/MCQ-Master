'use client';
import { useState } from 'react';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { History, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import type { QuizAttempt } from '@/lib/types';

export function HistoryView() {
  const { history, setHistory, setView, clearHistory } = useQuiz();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  
  const handleViewResult = (attempt: QuizAttempt) => {
    const newHistory = [attempt, ...history.filter(h => h.id !== attempt.id)];
    setHistory(newHistory);
    setView('results');
  };

  const handleClear = () => {
    clearHistory();
    setIsClearConfirmOpen(false);
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground font-headline">History</h2>
        {history.length > 0 && (
          <AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500 hover:text-red-500">
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your quiz attempts. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes, clear history</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-2xl">
          <History className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground/80">No Attempts Yet</h3>
          <p className="text-muted-foreground">Your completed quizzes will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((attempt) => {
            const percent = Math.round((attempt.score / attempt.total) * 100);
            let scoreColor = "text-red-500";
            if (percent >= 70) scoreColor = "text-emerald-500";
            else if (percent >= 40) scoreColor = "text-yellow-500";

            return (
              <Card 
                key={attempt.id}
                onClick={() => handleViewResult(attempt)}
                className="flex flex-col md:flex-row md:items-center justify-between bg-card p-5 rounded-xl hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{attempt.quizTitle}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                     <span>{new Date(attempt.date).toLocaleDateString()}</span>
                     <span>{attempt.mode} Mode</span>
                     <span>{attempt.timeSpent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                   <div className="text-right">
                      <span className={cn("text-2xl font-bold", scoreColor)}>{percent}%</span>
                      <p className="text-xs text-muted-foreground uppercase">Score</p>
                   </div>
                   <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
