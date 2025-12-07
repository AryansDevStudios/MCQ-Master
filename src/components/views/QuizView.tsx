'use client';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Shuffle, FileText, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function QuizView() {
  const {
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    checkedQuestions,
    questionNotes,
    elapsedSeconds,
    isInstantMode,
    setIsInstantMode,
    setQuestionNotes,
    handleOptionSelect,
    handleCheckAnswer,
    handleNext,
    handlePrev,
    submitQuiz,
    handleShuffleOptions
  } = useQuiz();

  if (!activeQuiz) return <div className="text-center text-slate-400">Loading quiz...</div>;

  const q = activeQuiz.questions[currentQuestionIndex];
  const isChecked = !!checkedQuestions[currentQuestionIndex];
  const isLast = currentQuestionIndex === activeQuiz.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right-8 duration-300">
      <Card className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-dark-card p-4 rounded-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-200">{activeQuiz.title}</h3>
            <span className="text-xs text-primary font-mono">Q {currentQuestionIndex + 1}/{activeQuiz.questions.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5" title="Toggle Instant Evaluation Mode">
            <Label htmlFor="instant-mode-quiz" className="text-xs font-medium text-slate-400 uppercase tracking-wider">Instant</Label>
            <Switch id="instant-mode-quiz" checked={isInstantMode} onCheckedChange={setIsInstantMode} />
          </div>
          <div className="flex items-center gap-2 font-mono text-lg text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
            <Clock className="w-4 h-4" />
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </Card>

      <Card className="bg-dark-card p-6 md:p-8 rounded-2xl shadow-2xl relative mb-6">
        <CardContent className="p-0">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost" size="icon"
              onClick={() => {
                const newNotes = { ...questionNotes };
                if (questionNotes[currentQuestionIndex] === undefined) {
                    newNotes[currentQuestionIndex] = '';
                } else {
                    delete newNotes[currentQuestionIndex];
                }
                setQuestionNotes(newNotes);
              }}
              className="text-slate-400 hover:text-primary hover:bg-primary/10"
              title="Add Note"
            >
              <FileText className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost" size="icon"
              onClick={handleShuffleOptions}
              disabled={isChecked}
              className="text-slate-400 hover:text-primary disabled:opacity-30 hover:bg-primary/10"
              title="Shuffle Options"
            >
              <Shuffle className="w-5 h-5" />
            </Button>
          </div>
          <div className="mb-8 mt-2 pr-20">
            <MarkdownRenderer content={q.question} className="text-xl md:text-2xl text-slate-100 font-medium leading-relaxed" />
          </div>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQuestionIndex] === idx;
              const isCorrect = q.correctAnswer === idx;
              
              let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start justify-between group h-auto text-base";
              if (isChecked) {
                if (isCorrect) optionClass += " border-emerald-500 bg-emerald-500/10 text-emerald-100";
                else if (isSelected) optionClass += " border-red-500 bg-red-500/10 text-red-100";
                else optionClass += " border-white/5 opacity-60";
              } else {
                if (isSelected) optionClass += " border-primary bg-primary/20 text-white shadow-lg shadow-primary/10";
                else optionClass += " border-slate-700 bg-slate-800/20 hover:bg-slate-700/40 hover:border-slate-600 text-slate-300";
              }

              return (
                <Button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isChecked} className={cn(optionClass, 'justify-start')}>
                  <div className="flex items-start gap-4 w-full">
                    <span className={cn('flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mt-0.5', isSelected || (isChecked && isCorrect) ? 'bg-white/20' : 'bg-white/5')}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <MarkdownRenderer content={opt} className="text-lg text-left flex-1" />
                  </div>
                  {isChecked && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />}
                  {isChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />}
                </Button>
              );
            })}
          </div>

          {isChecked && isInstantMode && q.explanation && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2 text-blue-300 font-semibold">
                <Lightbulb className="w-4 h-4" /> Explanation
              </div>
              <MarkdownRenderer content={q.explanation} className="text-sm text-blue-100/90 leading-relaxed" />
            </div>
          )}

          {questionNotes[currentQuestionIndex] !== undefined && (
            <div className="mt-6 pt-4 border-t border-white/10 animate-in fade-in">
              <Label className="text-xs text-slate-400 mb-2 block">Personal Note</Label>
              <Textarea
                value={questionNotes[currentQuestionIndex]}
                onChange={(e) => setQuestionNotes(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                className="w-full bg-slate-900/50 border-white/10 rounded-lg p-3 text-sm text-slate-300 focus:border-primary"
                placeholder="Type your note here..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={handlePrev} disabled={currentQuestionIndex === 0} className="bg-white/5 border-white/10 hover:bg-white/10">
          <ChevronLeft className="w-5 h-5" /> Prev
        </Button>
        <div className="flex gap-3">
          {isInstantMode && !isChecked && (
            <Button onClick={handleCheckAnswer} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30">
              Check Answer
            </Button>
          )}
          {(isInstantMode ? isChecked : true) && (
            !isLast ? (
              <Button onClick={handleNext} className="bg-gradient-to-br from-primary to-purple-700 text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/50">
                Next <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button onClick={submitQuiz} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-500/20 hover:shadow-pink-500/30">
                Submit Quiz <CheckCircle2 className="w-5 h-5" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
