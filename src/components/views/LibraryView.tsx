'use client';
import { useState } from 'react';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Library, FileText, Trash2 } from 'lucide-react';
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

export function LibraryView() {
  const { savedQuizzes, startQuiz, deleteQuizFromStorage } = useQuiz();
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if(quizToDelete) {
      deleteQuizFromStorage(quizToDelete);
      setQuizToDelete(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white font-headline">Your Library</h2>
      </div>
      
      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => !open && setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        {savedQuizzes.length === 0 ? (
          <div className="text-center py-20 bg-dark-card border border-white/5 rounded-2xl">
            <Library className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">Your Library is Empty</h3>
            <p className="text-slate-400">Create or generate a quiz to save it here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedQuizzes.map((quiz) => (
              <Card 
                key={quiz.title} 
                className="group bg-dark-card p-5 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div onClick={() => startQuiz(quiz)}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="flex flex-row justify-between items-start p-0 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardTitle className="font-semibold text-base text-slate-100 mb-1 line-clamp-2 group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                    <p className="text-sm text-slate-400">{quiz.questions.length} Questions</p>
                  </CardContent>
                </div>
                 <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); setQuizToDelete(quiz.title); }}
                      className="absolute top-2 right-2 p-2 h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                </AlertDialogTrigger>
              </Card>
            ))}
          </div>
        )}
      </AlertDialog>
    </div>
  );
}
