import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, ArrowLeft, CheckCircle2, Mail, Gift, Crown, Zap, Star, BookMarked, FileText, Image, Download, Target } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEMO_STORAGE_KEY = "ebook_demo_count";
const EMAIL_CAPTURED_KEY = "ebook_demo_email_captured";
const MAX_DEMO_TRIES = 2;

interface GeneratedChapter {
  title: string;
  description: string;
  subSections: string[];
}

interface GeneratedPlan {
  summary: string;
  chapters: GeneratedChapter[];
  targetAudience: string;
  estimatedPages: number;
  kdpKeywords: string[];
}

const DemoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [numberOfChapters, setNumberOfChapters] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [rawPlan, setRawPlan] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [captureEmail, setCaptureEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  const remainingTries = MAX_DEMO_TRIES - demoCount;
  const demoUsed = demoCount >= MAX_DEMO_TRIES;

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      localStorage.removeItem(EMAIL_CAPTURED_KEY);
      setDemoCount(0);
      setEmailCaptured(false);
      toast.success("Démo réinitialisée !");
      navigate("/demo", { replace: true });
      return;
    }
    
    const count = parseInt(localStorage.getItem(DEMO_STORAGE_KEY) || "0");
    setDemoCount(count);
    setEmailCaptured(localStorage.getItem(EMAIL_CAPTURED_KEY) === "true");
  }, [searchParams, navigate]);

  // Parse AI response into structured format
  const parseAIPlan = (text: string): GeneratedPlan => {
    const chapters: GeneratedChapter[] = [];
    
    // Extract summary (first paragraph or before chapters)
    const summaryMatch = text.match(/(?:résumé|introduction|présentation)[:\s]*([^\n]+(?:\n[^\n#*]+)*)/i);
    const summary = summaryMatch?.[1]?.trim() || text.split('\n').slice(0, 2).join(' ').substring(0, 300);
    
    // Extract chapters using common patterns
    const chapterRegex = /(?:chapitre\s*\d+|^\d+[\.\)]\s*|##?\s*)(.*?)(?=chapitre\s*\d+|^\d+[\.\)]\s*|##?\s*|$)/gis;
    const lines = text.split('\n');
    
    let currentChapter: GeneratedChapter | null = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect chapter titles
      if (/^(chapitre\s*\d+|##?\s*|\d+[\.\)]\s*)/i.test(trimmed) && trimmed.length > 10) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        const titleClean = trimmed.replace(/^(chapitre\s*\d+[:\s]*|##?\s*|\d+[\.\)]\s*)/i, '').trim();
        currentChapter = {
          title: titleClean || `Chapitre ${chapters.length + 1}`,
          description: '',
          subSections: []
        };
      } else if (currentChapter) {
        // Detect sub-sections (bullets or numbered lists)
        if (/^[-•*]\s*|^\d+\.\d+|^[a-z]\)/i.test(trimmed) && trimmed.length > 5) {
          const subSection = trimmed.replace(/^[-•*]\s*|^\d+\.\d+\s*|^[a-z]\)\s*/i, '').trim();
          if (subSection && currentChapter.subSections.length < 4) {
            currentChapter.subSections.push(subSection);
          }
        } else if (trimmed.length > 20 && !currentChapter.description) {
          currentChapter.description = trimmed.substring(0, 150);
        }
      }
    }
    
    if (currentChapter) {
      chapters.push(currentChapter);
    }
    
    // Fallback if parsing failed
    if (chapters.length === 0) {
      const numChaps = parseInt(numberOfChapters) || 5;
      for (let i = 0; i < numChaps; i++) {
        chapters.push({
          title: `Chapitre ${i + 1}`,
          description: 'Contenu du chapitre généré par l\'IA',
          subSections: ['Section 1', 'Section 2', 'Section 3']
        });
      }
    }
    
    // Generate fake KDP keywords
    const keywords = [
      title.split(' ')[0] || 'ebook',
      genre?.toLowerCase() || 'guide',
      'amazon kdp',
      'bestseller',
      targetAudience?.split(' ')[0]?.toLowerCase() || 'pratique'
    ].filter(Boolean);
    
    return {
      summary: summary.substring(0, 300) + (summary.length > 300 ? '...' : ''),
      chapters: chapters.slice(0, parseInt(numberOfChapters) || 5),
      targetAudience: targetAudience || 'Grand public',
      estimatedPages: chapters.length * 15 + 20,
      kdpKeywords: keywords.slice(0, 5)
    };
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Veuillez entrer un titre pour votre ebook");
      return;
    }

    if (demoUsed) {
      toast.error("Vous avez utilisé vos 2 essais gratuits");
      return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);
    setRawPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke("demo-generate-plan", {
        body: {
          title,
          genre,
          targetAudience,
          numberOfChapters: parseInt(numberOfChapters),
        },
      });

      if (error) throw error;

      if (data?.plan) {
        setRawPlan(data.plan);
        const parsed = parseAIPlan(data.plan);
        setGeneratedPlan(parsed);
        
        const newCount = demoCount + 1;
        localStorage.setItem(DEMO_STORAGE_KEY, newCount.toString());
        setDemoCount(newCount);
        
        if (!emailCaptured) {
          setTimeout(() => setShowEmailPopup(true), 2000);
        }
        
        if (newCount >= MAX_DEMO_TRIES) {
          toast.success("🎉 Plan généré ! Vous avez utilisé vos 2 essais gratuits.");
        } else {
          toast.success(`✨ Plan généré ! Il vous reste ${MAX_DEMO_TRIES - newCount} essai.`);
        }
      } else {
        throw new Error("Aucun plan généré");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message?.includes("429") || error.status === 429) {
        toast.error("Service temporairement surchargé, réessayez dans quelques instants");
      } else if (error.message?.includes("402") || error.status === 402) {
        toast.error("Service temporairement indisponible");
      } else {
        toast.error(error.message || "Erreur lors de la génération");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!captureEmail.trim() || !captureEmail.includes("@")) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    setIsSubmittingEmail(true);
    try {
      const emailLower = captureEmail.trim().toLowerCase();
      
      const { error } = await supabase.from("subscribers").insert({
        email: emailLower,
        plan_type: "demo",
        status: "demo_lead"
      });

      if (error && !error.message.includes("duplicate")) {
        throw error;
      }

      const { error: emailError } = await supabase.functions.invoke("send-welcome-email", {
        body: { email: emailLower }
      });

      if (emailError) {
        console.error("Welcome email error:", emailError);
      }

      localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
      setEmailCaptured(true);
      setShowEmailPopup(false);
      toast.success("🎁 Merci ! Votre guide KDP a été envoyé par email !");
    } catch (error: any) {
      console.error("Email capture error:", error);
      if (error.message?.includes("duplicate")) {
        localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
        setEmailCaptured(true);
        setShowEmailPopup(false);
        toast.success("Email déjà enregistré !");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const genres = [
    "Développement personnel",
    "Business & Entrepreneuriat",
    "Finance & Investissement",
    "Santé & Bien-être",
    "Cuisine & Recettes",
    "Guide pratique",
    "Livres pour enfants",
    "Romance",
    "Thriller & Policier",
    "Science-Fiction",
    "Fantasy",
    "Autre",
  ];

  const audiences = [
    "Grand public",
    "Débutants",
    "Entrepreneurs",
    "Étudiants",
    "Parents",
    "Professionnels",
    "Adolescents",
    "Seniors",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-emerald-50 dark:from-violet-950/20 dark:via-background dark:to-emerald-950/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiIGN4PSIzMCIgY3k9IjMwIiByPSIyOSIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Testez Gratuitement l'IA
                </h1>
                <p className="text-white/80">
                  {remainingTries > 0 
                    ? `🎁 ${remainingTries} génération${remainingTries > 1 ? 's' : ''} gratuite${remainingTries > 1 ? 's' : ''} restante${remainingTries > 1 ? 's' : ''}`
                    : '⚡ Passez à la version complète'
                  }
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-white text-violet-700 hover:bg-white/90 font-semibold shadow-lg"
              onClick={() => navigate('/offres')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Débloquer tout pour 37€
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form - Left Side */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-violet-200 dark:border-violet-800 shadow-lg sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="w-6 h-6 text-violet-600" />
                  Créez votre Ebook
                </CardTitle>
                <CardDescription>
                  👇 Étape 1 — Entrez un titre et cliquez sur "Générer mon plan gratuit"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-medium">Titre de l'ebook *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Créer un ebook KDP rentable avec l'IA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="text-lg py-5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Genre</Label>
                    <Select value={genre} onValueChange={setGenre} disabled={demoUsed || isGenerating}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Chapitres</Label>
                    <Select value={numberOfChapters} onValueChange={setNumberOfChapters} disabled={demoUsed || isGenerating}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 7, 10].map((n) => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg py-6 shadow-lg shadow-violet-500/25 animate-[pulse_3s_ease-in-out_infinite]"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={demoUsed || isGenerating || !title.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      L'IA travaille...
                    </>
                  ) : demoUsed ? (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Essais utilisés
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      ⚡ Générer mon plan gratuit
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  ✨ Génération instantanée — aucune compétence technique requise.
                </p>

                {demoUsed && (
                  <div className="text-center pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      ✨ Vous avez vu ce que l'IA peut faire !
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                      onClick={() => navigate("/offres")}
                    >
                      Débloquer la rédaction complète
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result - Right Side (Visual Preview) */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <Card className="border-2 h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">L'IA génère votre plan...</h3>
                  <p className="text-muted-foreground">Structure, chapitres et mots-clés KDP</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge variant="secondary" className="animate-pulse">📚 Analyse du marché</Badge>
                    <Badge variant="secondary" className="animate-pulse delay-75">✍️ Structuration</Badge>
                    <Badge variant="secondary" className="animate-pulse delay-150">🎯 Optimisation</Badge>
                  </div>
                </div>
              </Card>
            ) : generatedPlan ? (
              <div className="space-y-4">
                {/* Book Preview Card */}
                <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="font-semibold text-lg">Plan Généré avec Succès !</span>
                      </div>
                      <Badge className="bg-white/20 text-white">IA Premium</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Book Title & Stats */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      {/* Book Cover Mockup */}
                      <div className="w-32 h-44 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-lg shadow-2xl flex-shrink-0 flex flex-col items-center justify-center text-white p-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDJsMiA2aDZsLTUgNCAyIDYtNS00LTUgNCAyLTYtNS00aDZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9zdmc+')] opacity-50" />
                        <BookMarked className="w-8 h-8 mb-2 opacity-80" />
                        <p className="text-xs text-center font-medium line-clamp-3">{title}</p>
                        <div className="absolute bottom-2 w-full px-2">
                          <div className="h-1 bg-white/30 rounded" />
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{title}</h2>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{generatedPlan.summary}</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-violet-100 dark:bg-violet-900/30 rounded-lg p-3 text-center">
                            <FileText className="w-5 h-5 mx-auto text-violet-600 mb-1" />
                            <p className="text-lg font-bold text-violet-700 dark:text-violet-300">{generatedPlan.chapters.length}</p>
                            <p className="text-xs text-muted-foreground">Chapitres</p>
                          </div>
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
                            <BookOpen className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">~{generatedPlan.estimatedPages}</p>
                            <p className="text-xs text-muted-foreground">Pages</p>
                          </div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                            <Target className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">5</p>
                            <p className="text-xs text-muted-foreground">Mots-clés</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* KDP Keywords */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Mots-clés Amazon KDP suggérés
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPlan.kdpKeywords.map((kw, i) => (
                          <Badge key={i} className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Chapters */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <BookMarked className="w-4 h-4" /> Structure des chapitres
                      </h4>
                      <div className="space-y-2">
                        {generatedPlan.chapters.map((chapter, i) => (
                          <div 
                            key={i} 
                            className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
                              expandedChapter === i ? 'border-violet-300 bg-violet-50/50 dark:bg-violet-900/20' : 'border-border hover:border-violet-200'
                            }`}
                            onClick={() => setExpandedChapter(expandedChapter === i ? null : i)}
                          >
                            <div className="p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{chapter.title}</p>
                                {chapter.description && expandedChapter !== i && (
                                  <p className="text-xs text-muted-foreground truncate">{chapter.description}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {chapter.subSections.length} sections
                              </Badge>
                            </div>
                            {expandedChapter === i && chapter.subSections.length > 0 && (
                              <div className="px-3 pb-3 pt-0 border-t bg-white/50 dark:bg-black/20">
                                <ul className="space-y-1 mt-2">
                                  {chapter.subSections.map((sub, j) => (
                                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-violet-500">•</span>
                                      <span>{sub}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Locked Features Preview */}
                <Card className="border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">🔓 Débloquez la suite pour 37€</h3>
                        <div className="grid sm:grid-cols-2 gap-2 mb-4">
                          {[
                            { icon: "✍️", text: "Rédaction complète des chapitres" },
                            { icon: "🎨", text: "Couvertures générées par IA" },
                            { icon: "📄", text: "Export PDF / EPUB / Word" },
                            { icon: "📊", text: "Outils Amazon KDP Premium" },
                            { icon: "🎓", text: "Formations audio incluses" },
                            { icon: "♾️", text: "Générations illimitées à vie" },
                          ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span>{f.icon}</span>
                              <span>{f.text}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          size="lg"
                          onClick={() => navigate('/offres')}
                        >
                          <Crown className="w-5 h-5 mr-2" />
                          Accéder à tout pour 37€
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-2 border-dashed h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Votre ebook apparaîtra ici</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Entrez un titre et cliquez sur "Générer" pour voir la magie de l'IA en action
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">📖 Plan structuré</Badge>
                    <Badge variant="secondary">🎯 Mots-clés KDP</Badge>
                    <Badge variant="secondary">📊 Estimation pages</Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Email Capture Popup */}
        <Dialog open={showEmailPopup} onOpenChange={setShowEmailPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Gift className="w-6 h-6 text-emerald-500" />
                🎉 Votre plan est prêt !
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Recevez <span className="font-semibold text-foreground">gratuitement</span> notre guide "10 Niches KDP Rentables 2025"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">📚 Guide PDF offert</Badge>
                <Badge variant="secondary" className="text-xs">💡 Niches rentables</Badge>
                <Badge variant="secondary" className="text-xs">🚀 Stratégies 2025</Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capture-email">Votre email</Label>
                <div className="flex gap-2">
                  <Input
                    id="capture-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={captureEmail}
                    onChange={(e) => setCaptureEmail(e.target.value)}
                    disabled={isSubmittingEmail}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    disabled={isSubmittingEmail || !captureEmail.includes("@")}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isSubmittingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-1" />
                        Recevoir
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                🔒 Pas de spam. Désinscription en 1 clic.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DemoPage;
