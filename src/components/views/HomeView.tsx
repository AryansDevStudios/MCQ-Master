'use client';
import { useState } from 'react';
import { 
  Sparkles, Code2, BookOpen, BarChart3, Layers, 
  BrainCircuit, ChevronDown, ChevronUp, ScrollText, 
  CheckCircle2, Loader2, FileJson, Play, 
  Wand2, Zap, GraduationCap, Microscope, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuiz } from '@/context/QuizProvider';
import type { Quiz } from '@/lib/types';
import { generateQuizAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- Types & Schema ---

const formSchema = z.object({
  topic: z.string().min(1, 'Please enter a topic.'),
  context: z.string().optional(),
  questionCount: z.coerce.number().min(1).max(30),
  difficulty: z.string(),
  quizStyle: z.string(),
});

// --- Helper Components ---

const SelectableCard = ({ 
  selected, 
  onClick, 
  icon: Icon, 
  label, 
  subLabel 
}: { 
  selected: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
  subLabel?: string 
}) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 overflow-hidden",
      selected 
        ? "bg-violet-600/20 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
        : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-800/40"
    )}
  >
    <div className={cn("mb-2 p-2 rounded-full transition-colors", selected ? "bg-violet-500 text-white" : "bg-white/5 text-zinc-400 group-hover:text-zinc-200")}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={cn("text-xs font-semibold tracking-wide", selected ? "text-violet-200" : "text-zinc-400")}>{label}</span>
    {subLabel && <span className="text-[10px] text-zinc-500 mt-1">{subLabel}</span>}
    {selected && <div className="absolute inset-0 border-2 border-violet-500/30 rounded-xl pointer-events-none" />}
  </div>
);

// --- Main Components ---

function AiGenerator() {
  const { startQuiz, saveQuizToStorage, addToast, isInstantMode, setIsInstantMode } = useQuiz();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [generatedQuizSummary, setGeneratedQuizSummary] = useState<Quiz | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      context: "",
      questionCount: 5,
      difficulty: "Medium",
      quizStyle: "General",
    },
  });

  const handleGenerateQuiz = async (values: z.infer<typeof formSchema>) => {
    if (!values.topic.trim() && !values.context?.trim()) {
      addToast('Please enter a topic or provide context', 'error');
      return;
    }
    setIsGenerating(true);
    setGeneratedQuizSummary(null);
    const result = await generateQuizAction(values);

    if (result.success && result.data) {
      const quiz = result.data;
      setGeneratedQuizSummary(quiz);
      saveQuizToStorage(quiz);
      addToast('Quiz generated successfully!', 'success');
    } else {
      addToast(result.error || 'Generation failed', 'error');
    }
    setIsGenerating(false);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateQuiz)} className="relative z-10">
          
          {/* Main Card */}
          <div className="bg-zinc-950/70 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header Gradient Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-600" />
            
            <div className="p-6 md:p-8 space-y-8">
              
              {/* TOPIC SECTION */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-violet-400" /> What do you want to learn?
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="e.g. Molecular Biology, React Hooks, World War II..."
                            className="w-full h-16 px-6 text-xl bg-zinc-900/50 border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-inner"
                            {...field}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors duration-300 pointer-events-none">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Context Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsContextOpen(!isContextOpen)}
                    className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-violet-400 transition-colors"
                  >
                    {isContextOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isContextOpen ? "Hide Source Material" : "Add Source Material (Optional)"}
                  </button>
                  
                  {isContextOpen && (
                    <FormField
                      control={form.control}
                      name="context"
                      render={({ field }) => (
                        <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                          <Textarea
                            placeholder="Paste your notes, article text, or documentation here to generate questions based specifically on this content..."
                            className="min-h-[120px] bg-zinc-900/50 border-zinc-800 rounded-xl text-zinc-300 text-sm focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                            {...field}
                          />
                        </div>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-white/5" />

              {/* SETTINGS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Difficulty */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs uppercase tracking-wider text-zinc-500 font-semibold pl-1">Difficulty Level</FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                          <SelectableCard
                            key={level}
                            selected={field.value === level}
                            onClick={() => field.onChange(level)}
                            icon={level === 'Easy' ? GraduationCap : level === 'Medium' ? Microscope : BrainCircuit}
                            label={level}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Length */}
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs uppercase tracking-wider text-zinc-500 font-semibold pl-1">Number of Questions</FormLabel>
                      <div className="bg-zinc-900/40 p-1.5 rounded-xl border border-white/5 flex gap-1 items-center">
                        {[5, 10, 15].map((num) => (
                          <Button
                            type="button"
                            key={num}
                            onClick={() => field.onChange(num)}
                            variant="ghost"
                            className={cn(
                              "flex-1 h-9 rounded-lg text-xs font-medium transition-all",
                              field.value === num 
                                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/10" 
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            )}
                          >
                            {num}
                          </Button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Input 
                          type="number" 
                          min="1" 
                          max="30" 
                          {...field} 
                          className="w-16 h-9 bg-transparent border-none text-center text-sm font-semibold focus-visible:ring-0 px-0 text-violet-400 placeholder:text-zinc-700"
                        />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Style */}
                <FormField
                  control={form.control}
                  name="quizStyle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 space-y-3">
                       <FormLabel className="text-xs uppercase tracking-wider text-zinc-500 font-semibold pl-1">Quiz Style</FormLabel>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'General', icon: Layers, sub: 'Standard Mix' }, 
                            { id: 'Conceptual', icon: BookOpen, sub: 'Deep Understanding' }, 
                            { id: 'Problem Solving', icon: Calculator, sub: 'Practical Application' }
                          ].map((style) => (
                            <SelectableCard
                              key={style.id}
                              selected={field.value === style.id}
                              onClick={() => field.onChange(style.id)}
                              icon={style.icon}
                              label={style.id}
                              subLabel={style.sub}
                            />
                          ))}
                        </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                 <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <Switch 
                      checked={isInstantMode} 
                      onCheckedChange={setIsInstantMode} 
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <Label className="text-sm text-zinc-300 font-normal cursor-pointer">Instant Feedback Mode</Label>
                 </div>

                 <Button 
                    type="submit" 
                    disabled={isGenerating} 
                    className="w-full sm:w-auto h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 transition-all font-semibold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                 >
                   {isGenerating ? (
                     <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating...</>
                   ) : (
                     <><Zap className="w-5 h-5 mr-2 fill-black" /> Generate Quiz</>
                   )}
                 </Button>
              </div>

            </div>
          </div>
        </form>
      </Form>
      
      {/* SUCCESS CARD */}
      {generatedQuizSummary && (
        <div className="animate-in slide-in-from-bottom-6 duration-700 fade-in">
          <div className="group relative bg-emerald-950/30 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shadow-inner ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{generatedQuizSummary.title}</h3>
                  <p className="text-emerald-200/60 text-sm flex items-center gap-2">
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">Ready to Play</span>
                    • {generatedQuizSummary.questions.length} Questions
                  </p>
                </div>
              </div>
              
              <div className="flex w-full sm:w-auto gap-3">
                <Button 
                  onClick={() => startQuiz(generatedQuizSummary, isInstantMode)} 
                  className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold h-11 px-6 rounded-xl"
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JsonEditor({ setHomeTab }: { setHomeTab: (tab: 'ai' | 'json') => void }) {
    const { startQuiz, saveQuizToStorage, addToast, isInstantMode, setIsInstantMode } = useQuiz();
    const [jsonInput, setJsonInput] = useState('');
    const [quizName, setQuizName] = useState('');

    const handleParseAndStart = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error('Invalid JSON: Missing "questions" array.');
            
            const quizToStart: Quiz = { 
                title: quizName || parsed.title || "Custom Quiz", 
                questions: parsed.questions 
            };
            saveQuizToStorage(quizToStart);
            startQuiz(quizToStart, isInstantMode);
        } catch (e) {
            addToast(e instanceof Error ? e.message : 'Invalid JSON data', 'error');
        }
    };
    
    const loadSample = () => {
        const sample = {
          title: "Physics: Forces",
          questions: [
            {
              question: "What is the unit of Force?",
              options: ["Joule", "Newton", "Watt", "Pascal"],
              correctAnswer: 1,
              explanation: "The Newton (N) is the SI unit of force."
            }
          ]
        };
        setJsonInput(JSON.stringify(sample, null, 2));
        setQuizName(sample.title);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300">
           <div className="grid lg:grid-cols-3 gap-6">
             
             {/* Sidebar: Settings & Help */}
             <div className="space-y-6">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-5">
                   <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                     <FileJson className="w-4 h-4 text-violet-400" /> Editor Settings
                   </h3>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="instant-mode-json" className="text-sm text-zinc-400">Instant Feedback</Label>
                        <Switch id="instant-mode-json" checked={isInstantMode} onCheckedChange={setIsInstantMode} />
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="grid grid-cols-2 gap-2">
                         <Button variant="secondary" onClick={loadSample} className="bg-white/5 hover:bg-white/10 text-xs h-8">Load Sample</Button>
                         <Button variant="outline" onClick={() => { setJsonInput(''); setQuizName(''); }} className="border-white/10 hover:bg-white/5 bg-transparent text-xs h-8">Clear</Button>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5">
                   <h4 className="text-blue-200 text-sm font-medium mb-2 flex items-center gap-2">
                      <Code2 className="w-4 h-4" /> Structure Guide
                   </h4>
                   <pre className="text-[10px] text-blue-200/60 font-mono overflow-x-auto p-2 bg-black/20 rounded-lg">
{`{
  "title": "String",
  "questions": [
    {
      "question": "String",
      "options": ["A","B","C","D"],
      "correctAnswer": 0,
      "explanation": "String"
    }
  ]
}`}
                   </pre>
                </div>
             </div>
             
             {/* Main Editor */}
             <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[400px]">
                    <div className="bg-zinc-900/50 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">quiz_data.json</span>
                    </div>
                    
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="flex-1 w-full h-full bg-transparent border-none rounded-none p-4 font-mono text-sm text-zinc-300 focus-visible:ring-0 leading-relaxed resize-none placeholder:text-zinc-700"
                        placeholder="// Paste your JSON here..."
                        spellCheck={false}
                    />
                </div>

                <div className="flex gap-3">
                   <Input 
                        placeholder="Quiz Title (Optional override)" 
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        className="bg-zinc-900/50 border-white/10 h-12"
                   />
                   <Button onClick={handleParseAndStart} className="bg-violet-600 hover:bg-violet-500 text-white h-12 px-6">
                        <Play className="w-4 h-4 fill-white mr-2" /> Run
                   </Button>
                </div>
             </div>
           </div>
        </div>
    );
}

// --- Main View ---

export function HomeView() {
  const [homeTab, setHomeTab] = useState<'ai' | 'json'>('ai');

  return (
    <div className="min-h-screen w-full text-zinc-100 flex flex-col items-center pt-8 pb-20 px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-700/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
         <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-fuchsia-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-5xl z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3 mr-2" /> AI-Powered Learning
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
            MCQ Master
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Generate comprehensive quizzes instantly with AI or code your own custom challenges.
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-2xl flex items-center relative gap-1 shadow-2xl">
            <button
              onClick={() => setHomeTab('ai')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                homeTab === 'ai' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Wand2 className="w-4 h-4" /> AI Generator
              {homeTab === 'ai' && (
                <div className="absolute inset-0 bg-zinc-800 rounded-xl -z-10 shadow-lg border border-white/5" />
              )}
            </button>
            <button
              onClick={() => setHomeTab('json')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                homeTab === 'json' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Code2 className="w-4 h-4" /> JSON Editor
              {homeTab === 'json' && (
                 <div className="absolute inset-0 bg-zinc-800 rounded-xl -z-10 shadow-lg border border-white/5" />
              )}
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="min-h-[400px]">
          {homeTab === 'ai' && <AiGenerator />}
          {homeTab === 'json' && <JsonEditor setHomeTab={setHomeTab} />}
        </div>

      </div>
    </div>
  );
}

    