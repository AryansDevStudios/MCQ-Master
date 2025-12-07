'use client';
import { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizProvider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, Shuffle, FileEdit, ChevronLeft, ChevronRight, 
  CheckCircle2, XCircle, Lightbulb, Play, AlertCircle,
  MoreVertical, RefreshCw, Send
} from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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

  const [isNoteOpen, setIsNoteOpen] = useState(false);

  // Sync local note state with global if a note exists
  useEffect(() => {
    if (questionNotes[currentQuestionIndex]) {
      setIsNoteOpen(true);
    } else {
      setIsNoteOpen(false);
    }
  }, [currentQuestionIndex, questionNotes]);

  if (!activeQuiz) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">Loading your challenge...</p>
    </div>
  );

  const q = activeQuiz.questions[currentQuestionIndex];
  const isChecked = !!checkedQuestions[currentQuestionIndex];
  const isLast = currentQuestionIndex === activeQuiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 animate-in slide-in-from-right-4 duration-500 fade-in">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{activeQuiz.title}</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
               Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
             </span>
             <span className="text-muted-foreground/50 text-xs">•</span>
             <span className="text-muted-foreground text-xs font-medium">Keep going!</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Instant Mode Toggle */}
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border">
            <Label htmlFor="instant-mode" className="text-xs font-medium text-muted-foreground cursor-pointer">Instant Check</Label>
            <Switch 
              id="instant-mode" 
              checked={isInstantMode} 
              onCheckedChange={setIsInstantMode} 
              className="scale-75 data-[state=checked]:bg-emerald-500"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Clock className="w-4 h-4" />
            <span className="tabular-nums tracking-wider">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative group">
        {/* Glow Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-10 dark:opacity-20 blur transition duration-1000 group-hover:opacity-20 dark:group-hover:opacity-30" />
        
        <div className="relative bg-card/80 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
            
            {/* Progress Bar Line */}
            <div className="h-1 w-full bg-muted/50">
                <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-6 md:p-10">
                {/* Tools Row */}
                <div className="flex justify-end gap-2 mb-4">
                     <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsNoteOpen(!isNoteOpen)}
                        className={cn("h-8 w-8 rounded-full hover:bg-foreground/10 transition-colors", (isNoteOpen || questionNotes[currentQuestionIndex]) ? "text-primary bg-primary/10" : "text-muted-foreground")}
                        title="Add Note"
                     >
                        <FileEdit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost" 
                        size="icon"
                        onClick={handleShuffleOptions}
                        disabled={isChecked}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 disabled:opacity-30 transition-colors"
                        title="Shuffle Options"
                    >
                        <Shuffle className="w-4 h-4" />
                    </Button>
                </div>

                {/* Question Text */}
                <div className="mb-8 min-h-[60px]">
                    <MarkdownRenderer 
                        content={q.question} 
                        className="text-lg md:text-2xl text-foreground font-medium leading-relaxed" 
                    />
                </div>

                {/* Options List */}
                <div className="grid gap-3">
                    {q.options.map((opt, idx) => {
                        const isSelected = userAnswers[currentQuestionIndex] === idx;
                        const isCorrect = q.correctAnswer === idx;
                        
                        // Dynamic Styles based on state
                        let containerClass = "relative overflow-hidden group border transition-all duration-300 rounded-xl p-4 text-left md:hover:scale-[1.01]";
                        let indicatorClass = "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all";
                        
                        if (isChecked) {
                            if (isCorrect) {
                                containerClass += " bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                                indicatorClass += " bg-emerald-500 text-white";
                            } else if (isSelected) {
                                containerClass += " bg-red-500/10 border-red-500/50";
                                indicatorClass += " bg-red-500 text-white";
                            } else {
                                containerClass += " bg-muted/20 border-border opacity-50 grayscale";
                                indicatorClass += " bg-muted text-muted-foreground";
                            }
                        } else {
                            if (isSelected) {
                                containerClass += " bg-primary/10 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.15)] ring-1 ring-primary/50";
                                indicatorClass += " bg-primary text-primary-foreground";
                            } else {
                                containerClass += " bg-muted/40 border-border hover:bg-muted/60 hover:border-foreground/20";
                                indicatorClass += " bg-muted text-muted-foreground group-hover:bg-foreground/20 group-hover:text-foreground";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isChecked}
                                className={containerClass}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(indicatorClass, "flex-shrink-0 mt-0.5")}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <div className="flex-1 pt-1">
                                         <MarkdownRenderer 
                                            content={opt} 
                                            className={cn("text-base leading-relaxed transition-colors", (isChecked && isCorrect) ? "text-emerald-700 dark:text-emerald-200" : (isChecked && isSelected && !isCorrect) ? "text-red-700 dark:text-red-200" : "text-foreground/90")} 
                                        />
                                    </div>
                                    
                                    {/* Status Icons */}
                                    <div className="flex-shrink-0 w-6">
                                        {isChecked && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in spin-in-12 duration-300" />}
                                        {isChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500 animate-in zoom-in duration-300" />}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation Area */}
                {isChecked && isInstantMode && q.explanation && (
                    <div className="mt-8 animate-in slide-in-from-top-4 fade-in duration-500">
                         <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 overflow-hidden relative">
                             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                             <div className="flex items-start gap-3">
                                 <Lightbulb className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                 <div className="space-y-2">
                                     <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">Explanation</h4>
                                     <MarkdownRenderer content={q.explanation} className="text-sm text-blue-900/80 dark:text-blue-100/80 leading-relaxed" />
                                 </div>
                             </div>
                         </div>
                    </div>
                )}

                {/* Note Area */}
                {isNoteOpen && (
                    <div className="mt-6 pt-6 border-t border-border animate-in slide-in-from-top-2 fade-in">
                        <Label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider font-semibold">Your Notes</Label>
                        <Textarea
                            value={questionNotes[currentQuestionIndex] || ''}
                            onChange={(e) => setQuestionNotes(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                            className="w-full bg-muted/40 border-input rounded-xl p-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground min-h-[100px] resize-y"
                            placeholder="Write down your thoughts, calculations, or reminders for this question..."
                        />
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- BOTTOM NAVIGATION --- */}
      <div className="mt-8 flex items-center justify-between">
         
         <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0} 
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-12 px-6 rounded-full disabled:opacity-0"
         >
           <ChevronLeft className="w-5 h-5 mr-2" /> Previous
         </Button>

         <div className="flex gap-4">
            {/* Check Answer Button (Only in Instant Mode & Not Checked) */}
            {isInstantMode && !isChecked && (
                <Button 
                    onClick={handleCheckAnswer} 
                    className="bg-foreground hover:bg-foreground/90 text-background font-bold h-12 px-8 rounded-full shadow-lg shadow-black/10 transition-all"
                >
                    Check <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
            )}

            {/* Next / Submit Button */}
            {(isInstantMode ? isChecked : true) && (
                !isLast ? (
                    <Button 
                        onClick={handleNext} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                    >
                        Next Question <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                ) : (
                    <Button 
                        onClick={submitQuiz} 
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5"
                    >
                        Finish Quiz <Send className="w-4 h-4 ml-2" />
                    </Button>
                )
            )}
         </div>
      </div>

    </div>
  );
}
