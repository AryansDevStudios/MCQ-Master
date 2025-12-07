'use client';
import { useState } from 'react';
import { Sparkles, Code, BookOpen, BarChart3, Layers, BrainCircuit, ChevronDown, ChevronUp, ScrollText, CheckCircle2, Loader2, FileText, Settings2, Play, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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


const formSchema = z.object({
  topic: z.string().min(1, 'Please enter a topic.'),
  context: z.string().optional(),
  questionCount: z.coerce.number().min(1, 'At least 1 question.').max(50, 'Max 50 questions.'),
  difficulty: z.string(),
  quizStyle: z.string(),
});

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

  const questionCount = form.watch('questionCount');

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
    <div className="max-w-2xl mx-auto animate-in slide-in-from-left-8 duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateQuiz)} className="space-y-6">
          <Card className="bg-dark-card p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-primary/80 uppercase tracking-wider ml-1 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Quiz Topic
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g. Quantum Physics, React Hooks"
                          className="w-full bg-slate-900/50 border-white/10 rounded-2xl px-5 py-4 h-auto text-lg text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
                          {...field}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Button type="button" variant="ghost" onClick={() => setIsContextOpen(!isContextOpen)} className="flex items-center gap-2 text-sm font-semibold text-primary/70 uppercase tracking-wider ml-1 hover:text-primary transition-colors p-0 h-auto">
                    <ScrollText className="w-4 h-4" /> Source Context (Optional)
                    {isContextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                {isContextOpen && (
                  <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-top-2 duration-200">
                        <FormControl>
                          <Textarea
                            placeholder="Paste article, notes, or text here..."
                            className="w-full h-32 bg-slate-900/50 border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-300 placeholder-slate-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> Difficulty
                      </FormLabel>
                      <FormControl>
                        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                          {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => (
                            <Button type="button" key={level} onClick={() => field.onChange(level)} className={cn('flex-1 py-2 text-xs font-medium rounded-lg transition-all h-auto', field.value === level ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white bg-transparent hover:bg-white/5')}>
                              {level}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Questions
                      </FormLabel>
                      <div className="bg-slate-900/50 p-1 rounded-xl border border-white/5 flex gap-1">
                        {[5, 10, 15, 20].map((num) => (
                          <Button type="button" key={num} onClick={() => field.onChange(num)} className={cn('flex-1 py-2 text-xs font-medium rounded-lg transition-all h-auto', field.value === num ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white bg-transparent hover:bg-white/5')}>
                            {num}
                          </Button>
                        ))}
                        <div className="w-16 relative">
                          <Input type="number" min="1" max="50" {...field} className={cn('w-full h-full text-center text-xs font-medium rounded-lg bg-transparent border-none focus:outline-none ring-0 focus-visible:ring-0', ![5, 10, 15, 20].includes(questionCount) ? 'text-primary' : 'text-slate-500')} />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quizStyle"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                       <FormLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                          <BrainCircuit className="w-3 h-3" /> Quiz Style
                       </FormLabel>
                       <FormControl>
                        <div className="flex gap-2">
                          {['General', 'Conceptual', 'Problem Solving'].map((s) => (
                            <Button type="button" key={s} onClick={() => field.onChange(s)} variant="outline" className={cn('flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all h-auto', field.value === s ? 'bg-primary/10 border-primary text-primary-foreground' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-transparent')}>
                              {s}
                            </Button>
                          ))}
                        </div>
                       </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 mt-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', isInstantMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400')}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Instant Evaluation</p>
                    <p className="text-xs text-slate-500">Check answers & explanations immediately</p>
                  </div>
                </div>
                <Switch checked={isInstantMode} onCheckedChange={setIsInstantMode} />
              </div>
            </div>
          </Card>
          <Button type="submit" disabled={isGenerating} size="lg" className="w-full h-14 text-lg bg-gradient-to-br from-primary to-purple-700 text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/50">
            {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> Generating...</> : 'Generate Quiz'}
          </Button>
        </form>
      </Form>
      
      {generatedQuizSummary && (
        <Card className="mt-6 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 p-6 rounded-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-start justify-between p-0 mb-6">
            <div>
              <CardTitle className="text-xl font-bold text-emerald-100">{generatedQuizSummary.title}</CardTitle>
              <p className="text-emerald-200/60 text-sm mt-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {generatedQuizSummary.questions.length} Questions Ready
              </p>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => startQuiz(generatedQuizSummary, isInstantMode)} size="lg" className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-emerald-500/50">
                Start Quiz Now
              </Button>
              <Button variant="secondary" size="lg" className="flex-1 bg-white/5 border-white/10 text-slate-100 hover:bg-white/10 hover:border-slate-400">
                <Code className="w-4 h-4" /> View in Editor
              </Button>
            </div>
          </CardContent>
        </Card>
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
            if (!parsed.questions || !Array.isArray(parsed.questions) || !parsed.title) throw new Error('Invalid JSON format. Must include title and questions array.');
            
            const quizToStart: Quiz = { ...parsed, title: quizName || parsed.title };
            saveQuizToStorage(quizToStart);
            startQuiz(quizToStart, isInstantMode);
        } catch (e) {
            addToast(e instanceof Error ? e.message : 'Invalid JSON data', 'error');
        }
    };
    
    const loadSample = () => {
        const sample = {
          title: "Math & Physics Challenge",
          questions: [
            {
              question: "Solve for \\( x \\): \\( x^2 - 4 = 0 \\)",
              options: ["2", "-2", "\\( \\pm 2 \\)", "0"],
              correctAnswer: 2,
              explanation: "The equation is \\(x^2 = 4\\). Taking the square root of both sides gives \\(x = \\pm 2\\)."
            },
            {
              question: "What is **Newton's Second Law**?",
              options: ["\\( F = ma \\)", "\\( E = mc^2 \\)", "\\( V = IR \\)", "None"],
              correctAnswer: 0,
              explanation: "Newton's Second Law states that Force equals mass times acceleration (\\(F=ma\\))."
            }
          ]
        };
        setJsonInput(JSON.stringify(sample, null, 2));
        setQuizName(sample.title);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300">
           <div className="grid md:grid-cols-3 gap-6">
             <div className="md:col-span-1 space-y-4">
                <Card className="bg-dark-card p-5 rounded-2xl">
                   <CardHeader className="p-0 mb-4">
                     <CardTitle className="font-semibold text-slate-200 text-lg flex items-center gap-2"><Settings2 className="w-4 h-4" /> Settings</CardTitle>
                   </CardHeader>
                   <CardContent className="p-0 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <Label htmlFor="instant-mode-json" className="text-sm text-slate-300">Instant Mode</Label>
                        <Switch id="instant-mode-json" checked={isInstantMode} onCheckedChange={setIsInstantMode} />
                      </div>
                      <Button variant="secondary" onClick={loadSample} className="w-full text-sm bg-white/5 border-white/10 hover:bg-white/10">Load Sample</Button>
                      <Button variant="outline" onClick={() => { setJsonInput(''); setQuizName(''); }} className="w-full text-sm border-white/10 hover:bg-white/10">Clear</Button>
                   </CardContent>
                </Card>
                <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl">
                   <p className="text-xs text-primary/80 leading-relaxed flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                     <span><strong>Tip:</strong> Use LaTeX like `\\( E=mc^2 \\)` for math and Markdown for styling.</span>
                   </p>
                </div>
             </div>
             
             <Card className="md:col-span-2 bg-dark-card p-6 rounded-2xl shadow-xl flex flex-col">
                <Label className="text-sm font-semibold text-slate-400 mb-3 flex justify-between">
                    <span>JSON Data</span>
                    <span className="text-xs font-normal opacity-50">Editor Mode</span>
                </Label>
                <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{\n  "title": "My Quiz",\n  "questions": []\n}'
                    className="flex-1 min-h-[300px] bg-slate-900/50 border-white/10 rounded-xl p-4 font-mono text-sm text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y leading-relaxed"
                />
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
                    <Input 
                        type="text" 
                        placeholder="Quiz Name (Optional override)" 
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        className="w-full bg-slate-900/50 border-white/10 rounded-xl px-4 py-3 h-auto text-sm text-white focus:border-primary transition-colors"
                    />
                    <Button onClick={handleParseAndStart} className="w-full bg-gradient-to-br from-primary to-purple-700 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50">
                        Start Custom Quiz <Play className="w-4 h-4" />
                    </Button>
                </div>
             </Card>
           </div>
        </div>
    );
}

export function HomeView() {
  const [homeTab, setHomeTab] = useState<'ai' | 'json'>('ai');

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-300 font-headline">
          Master Your Knowledge
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Create AI-powered quizzes tailored to your needs or design your own with JSON.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 p-1.5 rounded-full border border-white/10 flex relative">
          <Button
            onClick={() => setHomeTab('ai')}
            variant="ghost"
            className={cn('flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 h-auto', homeTab === 'ai' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white')}
          >
            <Sparkles className="w-4 h-4" />
            AI Generator
          </Button>
          <Button
            onClick={() => setHomeTab('json')}
            variant="ghost"
            className={cn('flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 h-auto', homeTab === 'json' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white')}
          >
            <Code className="w-4 h-4" />
            JSON Editor
          </Button>
        </div>
      </div>
      
      {homeTab === 'ai' && <AiGenerator />}
      {homeTab === 'json' && <JsonEditor setHomeTab={setHomeTab} />}
    </div>
  );
}
