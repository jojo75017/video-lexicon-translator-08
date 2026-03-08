import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, ArrowLeft, CheckCircle2, Mail, Gift, Crown, Zap, Star, BookMarked, FileText, Image, Download, Target, Rocket, Play } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEMO_STORAGE_KEY = "ebook_demo_count";
const EMAIL_CAPTURED_KEY = "ebook_demo_email_captured";
const MAX_DEMO_TRIES = 3;

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

  const parseAIPlan = (text: string): GeneratedPlan => {
    const chapters: GeneratedChapter[] = [];
    const summaryMatch = text.match(/(?:résumé|introduction|présentation)[:\s]*([^\n]+(?:\n[^\n#*]+)*)/i);
    const summary = summaryMatch?.[1]?.trim() || text.split('\n').slice(0, 2).join(' ').substring(0, 300);
    
    const lines = text.split('\n');
    let currentChapter: GeneratedChapter | null = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(chapitre\s*\d+|##?\s*|\d+[\.\)]\s*)/i.test(trimmed) && trimmed.length > 10) {
        if (currentChapter) chapters.push(currentChapter);
        const titleClean = trimmed.replace(/^(chapitre\s*\d+[:\s]*|##?\s*|\d+[\.\)]\s*)/i, '').trim();
        currentChapter = { title: titleClean || `Chapitre ${chapters.length + 1}`, description: '', subSections: [] };
      } else if (currentChapter) {
        if (/^[-•*]\s*|^\d+\.\d+|^[a-z]\)/i.test(trimmed) && trimmed.length > 5) {
          const subSection = trimmed.replace(/^[-•*]\s*|^\d+\.\d+\s*|^[a-z]\)\s*/i, '').trim();
          if (subSection && currentChapter.subSections.length < 4) currentChapter.subSections.push(subSection);
        } else if (trimmed.length > 20 && !currentChapter.description) {
          currentChapter.description = trimmed.substring(0, 150);
        }
      }
    }
    if (currentChapter) chapters.push(currentChapter);
    
    if (chapters.length === 0) {
      const numChaps = parseInt(numberOfChapters) || 5;
      for (let i = 0; i < numChaps; i++) {
        chapters.push({ title: `Chapitre ${i + 1}`, description: 'Contenu du chapitre généré par l\'IA', subSections: ['Section 1', 'Section 2', 'Section 3'] });
      }
    }
    
    const keywords = [title.split(' ')[0] || 'ebook', genre?.toLowerCase() || 'guide', 'amazon kdp', 'bestseller', targetAudience?.split(' ')[0]?.toLowerCase() || 'pratique'].filter(Boolean);
    
    return {
      summary: summary.substring(0, 300) + (summary.length > 300 ? '...' : ''),
      chapters: chapters.slice(0, parseInt(numberOfChapters) || 5),
      targetAudience: targetAudience || 'Grand public',
      estimatedPages: chapters.length * 15 + 20,
      kdpKeywords: keywords.slice(0, 5)
    };
  };

  const handleGenerate = async () => {
    if (!title.trim()) { toast.error("Veuillez entrer un titre"); return; }
    if (demoUsed) { toast.error("Essais gratuits utilisés"); return; }

    setIsGenerating(true);
    setGeneratedPlan(null);
    setRawPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke("demo-generate-plan", {
        body: { title, genre, targetAudience, numberOfChapters: parseInt(numberOfChapters) },
      });
      if (error) throw error;

      if (data?.plan) {
        setRawPlan(data.plan);
        setGeneratedPlan(parseAIPlan(data.plan));
        const newCount = demoCount + 1;
        localStorage.setItem(DEMO_STORAGE_KEY, newCount.toString());
        setDemoCount(newCount);
        if (!emailCaptured) setTimeout(() => setShowEmailPopup(true), 2000);
        toast.success(newCount >= MAX_DEMO_TRIES ? "🎉 Plan généré ! Essais utilisés." : `✨ Plan généré ! ${MAX_DEMO_TRIES - newCount} essai restant.`);
      } else throw new Error("Aucun plan généré");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!captureEmail.includes("@")) { toast.error("Email invalide"); return; }
    setIsSubmittingEmail(true);
    try {
      const emailLower = captureEmail.trim().toLowerCase();
      await supabase.from("subscribers").insert({ email: emailLower, plan_type: "demo", status: "demo_lead" });
      await supabase.functions.invoke("send-welcome-email", { body: { email: emailLower } });
      localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
      setEmailCaptured(true);
      setShowEmailPopup(false);
      toast.success("🎁 Guide envoyé par email !");
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
        setEmailCaptured(true);
        setShowEmailPopup(false);
      } else toast.error("Erreur");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const genres = ["Développement personnel", "Business & Entrepreneuriat", "Finance & Investissement", "Santé & Bien-être", "Cuisine & Recettes", "Guide pratique", "Livres pour enfants", "Romance", "Thriller & Policier", "Science-Fiction", "Fantasy", "Autre"];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className="font-bold text-lg">EbookStudio</span>
              <span className="text-cyan-400 font-bold ml-1">Pro</span>
            </div>
          </Link>
          <Button onClick={() => navigate('/offres')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl px-5">
            <Sparkles className="w-4 h-4 mr-2" />
            97€ à vie
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-2 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            {remainingTries > 0 ? `${remainingTries} essai${remainingTries > 1 ? 's' : ''} gratuit${remainingTries > 1 ? 's' : ''}` : 'Essais utilisés'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Testez <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">gratuitement</span> l'IA
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Entrez un titre et générez instantanément un plan structuré avec mots-clés Amazon KDP
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-800 sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  Créez votre Ebook
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Étape 1 — Entrez un titre et cliquez sur "Générer"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Titre de l'ebook *</Label>
                  <Input
                    placeholder="Ex: Créer un ebook KDP rentable avec l'IA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-lg py-5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Genre</Label>
                    <Select value={genre} onValueChange={setGenre} disabled={demoUsed || isGenerating}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-9">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        {genres.map((g) => (
                          <SelectItem key={g} value={g} className="text-white hover:bg-slate-800">{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Chapitres</Label>
                    <Select value={numberOfChapters} onValueChange={setNumberOfChapters} disabled={demoUsed || isGenerating}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        {[3, 5, 7, 10].map((n) => (
                          <SelectItem key={n} value={n.toString()} className="text-white hover:bg-slate-800">{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 rounded-xl shadow-lg shadow-cyan-500/20"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={demoUsed || isGenerating || !title.trim()}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Génération en cours…</>
                  ) : demoUsed ? (
                    <><Lock className="w-5 h-5 mr-2" />Essais utilisés</>
                  ) : (
                    <><Zap className="w-5 h-5 mr-2" />Générer mon plan gratuit</>
                  )}
                </Button>

                {demoUsed && (
                  <div className="text-center pt-4 border-t border-slate-800">
                    <p className="text-slate-400 text-sm mb-3">Vous avez vu la puissance de l'IA !</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl"
                      onClick={() => navigate("/offres")}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Débloquer tout pour 97€
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <Card className="bg-slate-900/50 border-slate-800 h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-slate-900 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">L'IA génère votre plan...</h3>
                  <p className="text-slate-400">Structure, chapitres et mots-clés KDP</p>
                </div>
              </Card>
            ) : generatedPlan ? (
              <div className="space-y-4">
                {/* Success Card */}
                <Card className="bg-slate-900/50 border-emerald-800/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold text-lg">Plan Généré avec Succès !</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      {/* Book Cover */}
                      <div className="w-32 h-44 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg shadow-2xl flex-shrink-0 flex flex-col items-center justify-center text-slate-900 p-3">
                        <BookMarked className="w-8 h-8 mb-2" />
                        <p className="text-xs text-center font-bold line-clamp-3">{title}</p>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                        <p className="text-slate-400 mb-4 line-clamp-2">{generatedPlan.summary}</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: FileText, value: generatedPlan.chapters.length, label: "Chapitres", color: "cyan" },
                            { icon: BookOpen, value: `~${generatedPlan.estimatedPages}`, label: "Pages", color: "emerald" },
                            { icon: Target, value: "5", label: "Mots-clés", color: "amber" },
                          ].map((stat, i) => (
                            <div key={i} className={`bg-${stat.color}-500/10 rounded-xl p-3 text-center`}>
                              <stat.icon className={`w-5 h-5 mx-auto text-${stat.color}-400 mb-1`} />
                              <p className={`text-lg font-bold text-${stat.color}-400`}>{stat.value}</p>
                              <p className="text-xs text-slate-500">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* KDP Keywords */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Mots-clés Amazon KDP
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPlan.kdpKeywords.map((kw, i) => (
                          <Badge key={i} className="bg-amber-500/10 text-amber-400 border-amber-500/30">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Chapters */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                        <BookMarked className="w-4 h-4" /> Structure des chapitres
                      </h4>
                      <div className="space-y-2">
                        {generatedPlan.chapters.map((chapter, i) => (
                          <div 
                            key={i} 
                            className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${
                              expandedChapter === i ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 hover:border-slate-700'
                            }`}
                            onClick={() => setExpandedChapter(expandedChapter === i ? null : i)}
                          >
                            <div className="p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{chapter.title}</p>
                              </div>
                              <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {chapter.subSections.length} sections
                              </Badge>
                            </div>
                            {expandedChapter === i && chapter.subSections.length > 0 && (
                              <div className="px-3 pb-3 border-t border-slate-800">
                                <ul className="space-y-1 mt-2">
                                  {chapter.subSections.map((sub, j) => (
                                    <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                                      <span className="text-cyan-400">•</span>
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

                {/* Upsell Card */}
                <Card className="bg-gradient-to-br from-amber-950/50 to-orange-950/50 border-amber-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Crown className="w-7 h-7 text-slate-900" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-white mb-2">Débloquez la suite pour 97€</h3>
                        <div className="grid sm:grid-cols-2 gap-2 mb-4">
                          {[
                            "✍️ Rédaction complète des chapitres",
                            "🎨 Couvertures générées par IA",
                            "📄 Export PDF / EPUB / Word",
                            "🎧 Audiobooks Azure Neural",
                            "🎓 Formation 18 modules incluse",
                            "♾️ Générations illimitées à vie",
                          ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">{f}</div>
                          ))}
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl"
                          size="lg"
                          onClick={() => navigate('/offres')}
                        >
                          <Rocket className="w-5 h-5 mr-2" />
                          Accéder à tout pour 97€
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800 border-dashed h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Votre ebook commence ici</h3>
                  <p className="text-slate-400 mb-6 max-w-sm">
                    Entrez un titre et cliquez sur "Générer" pour voir la magie de l'IA
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">📖 Plan structuré</Badge>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">🎯 Mots-clés KDP</Badge>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">📊 Estimation pages</Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Email Popup */}
      <Dialog open={showEmailPopup} onOpenChange={setShowEmailPopup}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gift className="w-6 h-6 text-emerald-400" />
              🎉 Votre plan est prêt !
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Recevez gratuitement "10 Niches KDP Rentables 2026"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={captureEmail}
                onChange={(e) => setCaptureEmail(e.target.value)}
                disabled={isSubmittingEmail}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button 
                onClick={handleEmailSubmit}
                disabled={isSubmittingEmail || !captureEmail.includes("@")}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold"
              >
                {isSubmittingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4 mr-1" />Recevoir</>}
              </Button>
            </div>
            <p className="text-xs text-slate-500 text-center">🔒 Pas de spam. Désinscription en 1 clic.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoPage;
