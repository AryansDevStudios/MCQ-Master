'use client';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Home, CheckCircle2, XCircle, Lightbulb, 
  Clock, RotateCcw, Trophy, ArrowRight, FileText 
} from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function ResultsView() {
  const { history, startQuiz, setView, isInstantMode, theme } = useQuiz();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-muted-foreground">No results found</h2>
        <Button onClick={() => setView('home')} variant="outline">Return Home</Button>
      </div>
    );
  }

  const attempt = history[0];
  const percentage = Math.round((attempt.score / attempt.total) * 100);
  const wrongCount = attempt.total - attempt.score;
  
  // Chart Configuration
  const chartData = [
    { name: 'Correct', value: attempt.score, color: theme === 'dark' ? '#10b981' : '#059669' }, // Emerald
    { name: 'Wrong', value: wrongCount, color: theme === 'dark' ? '#f43f5e' : '#e11d48' },   // Rose
  ];

  // Dynamic feedback message
  const getFeedbackMessage = () => {
    if (percentage === 100) return { title: "Perfect Score!", sub: "You're a master of this topic.", icon: Trophy };
    if (percentage >= 80) return { title: "Excellent Work!", sub: "Great understanding of the concepts.", icon: Sparkles };
    if (percentage >= 50) return { title: "Good Effort", sub: "You're getting there, keep practicing.", icon: CheckCircle2 };
    return { title: "Keep Learning", sub: "Review the material and try again.", icon: Clock };
  };

  const feedback = getFeedbackMessage();
  const FeedbackIcon = feedback.icon;
  
  const questionsWithStatus = attempt.quizData.questions.map((q, idx) => ({
    question: q,
    originalIndex: idx,
    isCorrect: attempt.userAnswers[idx] === q.correctAnswer,
  })).sort((a, b) => {
    if (a.isCorrect === b.isCorrect) return 0;
    return a.isCorrect ? 1 : -1;
  });


  return (
    <div className="max-w-4xl mx-auto w-full pb-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-10 space-y-2">
        <h1 className={cn(
            "text-4xl md:text-5xl font-bold bg-clip-text text-transparent",
             theme === 'dark' 
              ? "bg-gradient-to-b from-white to-zinc-500" 
              : "bg-gradient-to-b from-black/80 to-black/60"
          )}>
          Result Summary
        </h1>
        <p className="text-muted-foreground">
          Performance report for <span className="text-primary font-medium">"{attempt.quizTitle}"</span>
        </p>
      </div>

      {/* --- SCORE DASHBOARD --- */}
      <div className="grid md:grid-cols-5 gap-6 mb-10">
        
        {/* Main Score Card */}
        <div className="md:col-span-3 bg-card/70 backdrop-blur-xl border rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/5">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
           
           {/* Chart */}
           <div className="relative w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip cursor={false} content={() => null} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    cornerRadius={5}
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-bold text-foreground">{percentage}%</span>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Score</span>
              </div>
           </div>

           {/* Text Feedback */}
           <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border text-muted-foreground text-xs font-medium">
                 <FeedbackIcon className="w-3 h-3" /> Result Analysis
              </div>
              <h3 className="text-2xl font-bold text-foreground">{feedback.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feedback.sub}</p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-rows-3 gap-3">
           {/* Correct */}
           <div className="bg-card/70 backdrop-blur-md border rounded-2xl px-5 flex items-center justify-between group hover:bg-emerald-500/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                 <span className="text-sm font-medium text-muted-foreground">Correct</span>
              </div>
              <span className="text-xl font-mono font-bold text-foreground">{attempt.score}</span>
           </div>

           {/* Wrong */}
           <div className="bg-card/70 backdrop-blur-md border rounded-2xl px-5 flex items-center justify-between group hover:bg-rose-500/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><XCircle className="w-4 h-4" /></div>
                 <span className="text-sm font-medium text-muted-foreground">Incorrect</span>
              </div>
              <span className="text-xl font-mono font-bold text-foreground">{wrongCount}</span>
           </div>

           {/* Time */}
           <div className="bg-card/70 backdrop-blur-md border rounded-2xl px-5 flex items-center justify-between group hover:bg-amber-500/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Clock className="w-4 h-4" /></div>
                 <span className="text-sm font-medium text-muted-foreground">Time</span>
              </div>
              <span className="text-xl font-mono font-bold text-foreground">{attempt.timeSpent}</span>
           </div>
        </div>
      </div>

      {/* --- ACTIONS --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button 
          onClick={() => startQuiz(attempt.quizData, isInstantMode)} 
          size="lg" 
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-14 rounded-2xl text-base font-semibold shadow-lg shadow-black/5"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
        </Button>
        <Button 
          onClick={() => setView('home')} 
          variant="secondary" 
          size="lg" 
          className="flex-1 h-14 rounded-2xl text-base font-medium"
        >
          <Home className="w-4 h-4 mr-2" /> Back to Hub
        </Button>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

      {/* --- DETAILED REVIEW --- */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          Detailed Review
        </h3>

        <div className="grid gap-6">
          {questionsWithStatus.map(({ question: q, originalIndex: idx, isCorrect }) => {
            const userAns = attempt.userAnswers[idx];
            const note = attempt.questionNotes[idx];

            return (
              <div 
                key={idx} 
                className={cn(
                  "group rounded-2xl border p-6 transition-all duration-300",
                  isCorrect 
                    ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40" 
                    : "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
                )}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border",
                    isCorrect 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <MarkdownRenderer content={q.question} className="text-lg font-medium text-foreground" />
                  </div>
                </div>

                {/* Answers Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  
                  {/* User Answer */}
                  <div className={cn(
                    "p-4 rounded-xl border flex flex-col gap-1",
                    isCorrect 
                      ? "bg-emerald-500/5 border-emerald-500/10" 
                      : "bg-rose-500/5 border-rose-500/10"
                  )}>
                     <span className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1 flex items-center gap-1">
                        {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        Your Answer
                     </span>
                     <div className={cn("text-sm font-medium", isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                        {userAns !== undefined ? <MarkdownRenderer content={q.options[userAns]} /> : <span className="italic opacity-50">Skipped</span>}
                     </div>
                  </div>

                  {/* Correct Answer (if wrong) */}
                  {!isCorrect && (
                    <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex flex-col gap-1">
                       <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600/60 dark:text-emerald-500/60 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Correct Answer
                       </span>
                       <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          <MarkdownRenderer content={q.options[q.correctAnswer]} />
                       </div>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-300 block mb-1">Explanation</span>
                        <MarkdownRenderer content={q.explanation} className="text-sm text-blue-900/70 dark:text-blue-200/70 leading-relaxed" />
                      </div>
                    </div>
                  </div>
                )}

                {/* User Note */}
                {note && (
                  <div className="mt-4 mx-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-3 text-sm text-amber-800/80 dark:text-amber-200/80 italic">
                     <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                     <span>"{note}"</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
