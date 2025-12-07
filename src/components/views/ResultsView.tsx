'use client';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Home, CheckCircle2, XCircle, Lightbulb, AlertCircle } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Separator } from '../ui/separator';

export function ResultsView() {
  const { history, startQuiz, setView, isInstantMode, setHistory } = useQuiz();

  if (history.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">No results to display.</h2>
        <Button onClick={() => setView('home')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  const attempt = history[0];
  const percentage = Math.round((attempt.score / attempt.total) * 100);
  
  const chartData = [
    { name: 'Correct', value: attempt.score, fill: 'hsl(var(--chart-1))' },
    { name: 'Wrong', value: attempt.total - attempt.score, fill: 'hsl(var(--chart-2))' },
  ];
  const chartConfig = {
    correct: { label: "Correct", color: "hsl(var(--chart-1))" },
    wrong: { label: "Wrong", color: "hsl(var(--chart-2))" },
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 font-headline">Quiz Complete!</h2>
        <p className="text-slate-400">Here's how you performed on "{attempt.quizTitle}"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-dark-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-center relative overflow-hidden gap-6">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="w-48 h-48 relative">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={5} stroke="none">
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-white">{percentage}%</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{attempt.score}</div>
              <div className="text-xs text-slate-500 uppercase">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{attempt.total - attempt.score}</div>
              <div className="text-xs text-slate-500 uppercase">Wrong</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{attempt.timeSpent}</div>
              <div className="text-xs text-slate-500 uppercase">Time</div>
            </div>
          </div>
        </Card>

        <Card className="bg-dark-card p-6 rounded-2xl flex flex-col justify-center gap-4">
          <CardHeader className="p-0"><CardTitle className="text-lg">Next Steps</CardTitle></CardHeader>
          <CardContent className="p-0 flex flex-col gap-4">
            <Button onClick={() => startQuiz(attempt.quizData, isInstantMode)} size="lg" className="w-full bg-gradient-to-br from-primary to-purple-700 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50">
              <Sparkles className="w-4 h-4" /> Retry Quiz
            </Button>
            <Button onClick={() => setView('home')} variant="secondary" size="lg" className="w-full bg-white/5 border-white/10 hover:bg-white/10">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8 bg-white/10" />

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white font-headline">Detailed Review</h3>
        {attempt.quizData.questions.map((q, idx) => {
          const userAns = attempt.userAnswers[idx];
          const isCorrect = userAns === q.correctAnswer;
          const note = attempt.questionNotes[idx];

          return (
            <Card key={idx} className={`p-6 rounded-xl ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex gap-3 mb-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-red-950'}`}>
                  {idx + 1}
                </span>
                <MarkdownRenderer content={q.question} className="text-slate-200" />
              </div>
              
              <div className="pl-9 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  <span className="text-slate-400">Your Answer:</span>
                  <span className={`font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {userAns !== undefined ? <MarkdownRenderer content={q.options[userAns]} /> : 'Skipped'}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400">Correct Answer:</span>
                    <span className="font-medium text-emerald-400">
                      <MarkdownRenderer content={q.options[q.correctAnswer]} />
                    </span>
                  </div>
                )}
                {q.explanation && (
                  <div className="mt-3 p-3 bg-blue-500/10 rounded-lg text-sm text-blue-200/90 border border-blue-500/20 flex gap-2">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <span className="font-semibold text-blue-300">Explanation: </span>
                      <MarkdownRenderer content={q.explanation} className="inline" />
                    </div>
                  </div>
                )}
                {note && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg text-sm text-slate-300 italic border border-white/5">
                    Note: {note}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
