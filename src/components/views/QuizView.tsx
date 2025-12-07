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
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium">Loading your challenge...</p>
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
          <h2 className="text-2xl font-bold text-white tracking-tight">{activeQuiz.title}</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
               Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
             </span>
             <span className="text-zinc-600 text-xs">•</span>
             <span className="text-zinc-500 text-xs font-medium">Keep going!</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Instant Mode Toggle */}
          <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
            <Label htmlFor="instant-mode" className="text-xs font-medium text-zinc-400 cursor-pointer">Instant Check</Label>
            <Switch 
              id="instant-mode" 
              checked={isInstantMode} 
              onCheckedChange={setIsInstantMode} 
              className="scale-75 data-[state=checked]:bg-emerald-500"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
            <Clock className="w-4 h-4" />
            <span className="tabular-nums tracking-wider">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative group">
        {/* Glow Effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-20 blur transition duration-1000 group-hover:opacity-30" />
        
        <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Progress Bar Line */}
            <div className="h-1 w-full bg-zinc-800">
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
                        className={cn("h-8 w-8 rounded-full hover:bg-white/10 transition-colors", (isNoteOpen || questionNotes[currentQuestionIndex]) ? "text-violet-400 bg-violet-500/10" : "text-zinc-500")}
                        title="Add Note"
                     >
                        <FileEdit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost" 
                        size="icon"
                        onClick={handleShuffleOptions}
                        disabled={isChecked}
                        className="h-8 w-8 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        title="Shuffle Options"
                    >
                        <Shuffle className="w-4 h-4" />
                    </Button>
                </div>

                {/* Question Text */}
                <div className="mb-8 min-h-[60px]">
                    <MarkdownRenderer 
                        content={q.question} 
                        className="text-lg md:text-2xl text-zinc-100 font-medium leading-relaxed" 
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
                                indicatorClass += " bg-emerald-500 text-black";
                            } else if (isSelected) {
                                containerClass += " bg-red-500/10 border-red-500/50";
                                indicatorClass += " bg-red-500 text-white";
                            } else {
                                containerClass += " bg-zinc-900/20 border-white/5 opacity-50 grayscale";
                                indicatorClass += " bg-zinc-800 text-zinc-500";
                            }
                        } else {
                            if (isSelected) {
                                containerClass += " bg-violet-600/20 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/50";
                                indicatorClass += " bg-violet-500 text-white";
                            } else {
                                containerClass += " bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60 hover:border-white/10";
                                indicatorClass += " bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200";
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
                                            className={cn("text-base leading-relaxed transition-colors", (isChecked && isCorrect) ? "text-emerald-100" : (isChecked && isSelected && !isCorrect) ? "text-red-100" : "text-zinc-300")} 
                                        />
                                    </div>
                                    
                                    {/* Status Icons */}
                                    <div className="flex-shrink-0 w-6">
                                        {isChecked && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in spin-in-12 duration-300" />}
                                        {isChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400 animate-in zoom-in duration-300" />}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation Area */}
                {isChecked && isInstantMode && q.explanation && (
                    <div className="mt-8 animate-in slide-in-from-top-4 fade-in duration-500">
                         <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-5 overflow-hidden relative">
                             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                             <div className="flex items-start gap-3">
                                 <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                 <div className="space-y-2">
                                     <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Explanation</h4>
                                     <MarkdownRenderer content={q.explanation} className="text-sm text-blue-100/80 leading-relaxed" />
                                 </div>
                             </div>
                         </div>
                    </div>
                )}

                {/* Note Area */}
                {isNoteOpen && (
                    <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-2 fade-in">
                        <Label className="text-xs text-zinc-500 mb-2 block uppercase tracking-wider font-semibold">Your Notes</Label>
                        <Textarea
                            value={questionNotes[currentQuestionIndex] || ''}
                            onChange={(e) => setQuestionNotes(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                            className="w-full bg-zinc-900/50 border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 placeholder:text-zinc-700 min-h-[100px] resize-y"
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
            className="text-zinc-400 hover:text-white hover:bg-white/5 h-12 px-6 rounded-full disabled:opacity-0"
         >
           <ChevronLeft className="w-5 h-5 mr-2" /> Previous
         </Button>

         <div className="flex gap-4">
            {/* Check Answer Button (Only in Instant Mode & Not Checked) */}
            {isInstantMode && !isChecked && (
                <Button 
                    onClick={handleCheckAnswer} 
                    className="bg-zinc-100 hover:bg-white text-zinc-900 font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all"
                >
                    Check <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
            )}

            {/* Next / Submit Button */}
            {(isInstantMode ? isChecked : true) && (
                !isLast ? (
                    <Button 
                        onClick={handleNext} 
                        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold h-12 px-8 rounded-full shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
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