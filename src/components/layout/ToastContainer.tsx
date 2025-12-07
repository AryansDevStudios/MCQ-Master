'use client';
import { useQuiz } from '@/context/QuizProvider';
import { CheckCircle2, FileText, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts } = useQuiz();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border animate-in slide-in-from-right-10 duration-300',
            {
              'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-100 border-l-4 border-l-emerald-500': toast.type === 'success',
              'bg-red-500/10 text-red-700 dark:bg-red-900/80 dark:text-red-100 border-l-4 border-l-red-500': toast.type === 'error',
              'bg-primary/10 text-primary dark:bg-slate-800/90 dark:text-white border-l-4 border-l-primary': toast.type === 'info',
            }
          )}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5" />}
          {toast.type === 'info' && <FileText className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
