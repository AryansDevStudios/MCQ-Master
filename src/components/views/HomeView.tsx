'use client';
import { useState } from 'react';
import { 
  Sparkles, Code2, BookOpen, Layers, 
  BrainCircuit, ChevronDown, ChevronUp, ScrollText, 
  CheckCircle2, Loader2, FileJson, Play, 
  Wand2, Zap, GraduationCap, Microscope, Calculator,
  Lightbulb
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
  withExplanations: z.boolean(),
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
        ? "bg-primary/10 border-primary/50 shadow-[0_0_20px_hsl(var(--primary)_/_0.15)]" 
        : "bg-muted/30 border-border hover:border-foreground/20 hover:bg-muted"
    )}
  >
    <div className={cn("mb-2 p-2 rounded-full transition-colors", selected ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-muted-foreground group-hover:text-foreground")}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={cn("text-xs font-semibold tracking-wide", selected ? "text-primary" : "text-muted-foreground")}>{label}</span>
    {subLabel && <span className="text-[10px] text-muted-foreground/80 mt-1">{subLabel}</span>}
    {selected && <div className="absolute inset-0 border-2 border-primary/30 rounded-xl pointer-events-none" />}
  </div>
);

// --- Main Components ---

function AiGenerator({ setHomeTab, setJsonInputForEditor }: { setHomeTab: (tab: 'ai' | 'json') => void, setJsonInputForEditor: (json: string) => void }) {
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
      withExplanations: true,
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
  
  const handleViewJson = () => {
    if (generatedQuizSummary) {
      setJsonInputForEditor(JSON.stringify(generatedQuizSummary, null, 2));
      setHomeTab('json');
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateQuiz)} className="relative z-10">
          
          {/* Main Card */}
          <div className="bg-card/70 backdrop-blur-2xl border rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
            
            {/* Header Gradient Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500" />
            
            <div className="p-6 md:p-8 space-y-8">
              
              {/* TOPIC SECTION */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-primary" /> What do you want to learn?
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="e.g. Molecular Biology, React Hooks, World War II..."
                            className="w-full h-16 px-6 text-xl bg-background/50 border-input rounded-2xl placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                            {...field}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
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
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
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
                            className="min-h-[120px] bg-background/50 border-input rounded-xl text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                            {...field}
                          />
                        </div>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-border" />

              {/* SETTINGS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Difficulty */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pl-1">Difficulty Level</FormLabel>
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
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pl-1">Number of Questions</FormLabel>
                      <div className="bg-muted/40 p-1.5 rounded-xl border flex gap-1 items-center">
                        {[5, 10, 15].map((num) => (
                          <Button
                            type="button"
                            key={num}
                            onClick={() => field.onChange(num)}
                            variant="ghost"
                            className={cn(
                              "flex-1 h-9 rounded-lg text-xs font-medium transition-all",
                              field.value === num 
                                ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                                : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                            )}
                          >
                            {num}
                          </Button>
                        ))}
                        <div className="w-px h-6 bg-border mx-1" />
                        <Input 
                          type="number" 
                          min="1" 
                          max="30" 
                          {...field} 
                          className="w-16 h-9 bg-transparent border-none text-center text-sm font-semibold focus-visible:ring-0 px-0 text-primary placeholder:text-muted-foreground"
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
                       <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pl-1">Quiz Style</FormLabel>
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
              <div className="grid sm:grid-cols-2 gap-4 items-center pt-4">
                 <div className="flex items-center gap-3 bg-muted/40 px-4 py-2 rounded-full border">
                    <Switch 
                      id="instant-mode-ai"
                      checked={isInstantMode} 
                      onCheckedChange={setIsInstantMode} 
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <Label htmlFor="instant-mode-ai" className="text-sm text-foreground/80 font-normal cursor-pointer">Instant Feedback</Label>
                 </div>
                 <FormField
                  control={form.control}
                  name="withExplanations"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 bg-muted/40 px-4 py-2 rounded-full border">
                      <FormControl>
                        <Switch
                          id="with-explanations"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </FormControl>
                      <FormLabel htmlFor="with-explanations" className="text-sm text-foreground/80 font-normal cursor-pointer flex-1">
                        Include Explanations
                      </FormLabel>
                    </FormItem>
                  )}
                />

                 <div className="sm:col-span-2 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isGenerating} 
                        className="w-full sm:w-auto h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold rounded-full shadow-lg shadow-black/10 dark:shadow-black/20"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating...</>
                      ) : (
                        <><Zap className="w-5 h-5 mr-2 fill-current" /> Generate Quiz</>
                      )}
                    </Button>
                 </div>
              </div>

            </div>
          </div>
        </form>
      </Form>
      
      {/* SUCCESS CARD */}
      {generatedQuizSummary && (
        <div className="animate-in slide-in-from-bottom-6 duration-700 fade-in">
          <div className="group relative bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500 shadow-inner ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{generatedQuizSummary.title}</h3>
                  <p className="text-emerald-500/80 dark:text-emerald-400/70 text-sm flex items-center gap-2">
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">Ready to Play</span>
                    • {generatedQuizSummary.questions.length} Questions
                  </p>
                </div>
              </div>
              
              <div className="flex w-full sm:w-auto gap-3">
                <Button 
                  onClick={handleViewJson}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-transparent border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500 font-bold h-11 px-6 rounded-xl"
                >
                  <Code2 />
                  View JSON
                </Button>
                <Button 
                  onClick={() => startQuiz(generatedQuizSummary, isInstantMode)} 
                  className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white dark:text-emerald-950 font-bold h-11 px-6 rounded-xl"
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

function JsonEditor({ setHomeTab, jsonInput, setJsonInput }: { setHomeTab: (tab: 'ai' | 'json') => void; jsonInput: string; setJsonInput: (json: string) => void; }) {
    const { startQuiz, saveQuizToStorage, addToast, isInstantMode, setIsInstantMode } = useQuiz();
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
            },
            {
              question: "What is Force?",
              options: ["A push or pull", "Energy", "Power", "Work"],
              correctAnswer: 0
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
                <div className="bg-card/50 backdrop-blur-xl border rounded-2xl p-5 space-y-5">
                   <h3 className="font-semibold text-foreground/80 flex items-center gap-2">
                     <FileJson className="w-4 h-4 text-primary" /> Editor Settings
                   </h3>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="instant-mode-json" className="text-sm text-muted-foreground">Instant Feedback</Label>
                        <Switch id="instant-mode-json" checked={isInstantMode} onCheckedChange={setIsInstantMode} />
                      </div>
                      <div className="h-px bg-border" />
                      <div className="grid grid-cols-2 gap-2">
                         <Button variant="secondary" onClick={loadSample} className="text-xs h-8">Load Sample</Button>
                         <Button variant="outline" onClick={() => { setJsonInput(''); setQuizName(''); }} className="text-xs h-8">Clear</Button>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5">
                   <h4 className="text-blue-500 dark:text-blue-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <Code2 className="w-4 h-4" /> Structure Guide
                   </h4>
                   <pre className="text-[10px] text-blue-500/70 dark:text-blue-400/60 font-mono overflow-x-auto p-2 bg-black/5 dark:bg-black/20 rounded-lg">
{`{
  "title": "String",
  "questions": [
    {
      "question": "String",
      "options": ["A","B","C","D"],
      "correctAnswer": 0,
      "explanation?": "String"
    }
  ]
}`}
                   </pre>
                </div>
             </div>
             
             {/* Main Editor */}
             <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-background border rounded-2xl overflow-hidden shadow-lg shadow-black/5 flex-1 flex flex-col min-h-[400px]">
                    <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/80" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">quiz_data.json</span>
                    </div>
                    
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="flex-1 w-full h-full bg-transparent border-none rounded-none p-4 font-mono text-sm focus-visible:ring-0 leading-relaxed resize-none placeholder:text-muted-foreground"
                        placeholder="// Paste your JSON here..."
                        spellCheck={false}
                    />
                </div>

                <div className="flex gap-3">
                   <Input 
                        placeholder="Quiz Title (Optional override)" 
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        className="bg-card h-12"
                   />
                   <Button onClick={handleParseAndStart} className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6">
                        <Play className="w-4 h-4 fill-current mr-2" /> Run
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
  const [jsonInputForEditor, setJsonInputForEditor] = useState('');
  const { theme } = useQuiz();

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-8 pb-20 px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-700/10 blur-[120px] rounded-full" />
         <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-fuchsia-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-5xl z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3 mr-2" /> AI-Powered Learning
          </div>
          <h1 className={cn(
            "text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent",
            theme === 'dark' 
              ? "bg-gradient-to-b from-white via-white to-zinc-500" 
              : "bg-gradient-to-b from-black/80 via-black/80 to-black/50"
          )}>
            MCQ Master
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate comprehensive quizzes instantly with AI or code your own custom challenges.
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 bg-muted/80 backdrop-blur-md border rounded-2xl flex items-center relative gap-1 shadow-lg shadow-black/5">
            <button
              onClick={() => setHomeTab('ai')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                homeTab === 'ai' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wand2 className="w-4 h-4" /> AI Generator
              {homeTab === 'ai' && (
                <div className="absolute inset-0 bg-background rounded-xl -z-10 shadow-md border" />
              )}
            </button>
            <button
              onClick={() => setHomeTab('json')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                homeTab === 'json' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="w-4 h-4" /> JSON Editor
              {homeTab === 'json' && (
                 <div className="absolute inset-0 bg-background rounded-xl -z-10 shadow-md border" />
              )}
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="min-h-[400px]">
          {homeTab === 'ai' && <AiGenerator setHomeTab={setHomeTab} setJsonInputForEditor={setJsonInputForEditor} />}
          {homeTab === 'json' && <JsonEditor setHomeTab={setHomeTab} jsonInput={jsonInputForEditor} setJsonInput={setJsonInputForEditor} />}
        </div>

      </div>
    </div>
  );
}
