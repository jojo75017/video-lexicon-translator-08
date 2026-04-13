import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, ArrowLeft, CheckCircle2, Mail, Gift, Crown, Zap, Star, BookMarked, FileText, Image, Download, Target, Rocket, Play, Users, Clock, Shield, TrendingUp, Headphones, Palette, Layers, ChevronRight, Quote, Timer, Award, BarChart3 } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DEMO_STORAGE_KEY = "ebook_demo_count";
const EMAIL_CAPTURED_KEY = "ebook_demo_email_captured";
const MAX_DEMO_TRIES = 1;

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
  const [numberOfChapters] = useState("3");
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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Helmet>
        <title>Démo Gratuite — Testez le Générateur d'Ebook IA | EbookStudio</title>
        <meta name="description" content="Testez gratuitement notre IA : générez un plan d'ebook structuré avec chapitres et mots-clés Amazon KDP en 30 secondes. Sans inscription." />
        <meta property="og:title" content="Démo Gratuite — Générateur d'Ebook IA" />
        <meta property="og:description" content="Générez un plan d'ebook complet gratuitement avec l'IA. Chapitres, sous-sections et mots-clés KDP en 30 secondes." />
        <link rel="canonical" href="https://video-lexicon-translator-08.lovable.app/demo" />
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/offres')} className="text-muted-foreground hover:text-white hover:bg-muted rounded-xl gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <Link to="/offres" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <span className="font-bold text-lg">EbookStudio</span>
                <span className="text-cyan-400 font-bold ml-1">Pro</span>
              </div>
            </Link>
          </div>
          <Button onClick={() => navigate('/offres')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl px-5">
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-400 border-primary/20 px-4 py-2 mb-6 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            {remainingTries > 0 ? '1 essai gratuit • 3 chapitres • Sans inscription' : 'Essai utilisé — Passez à la version complète'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">
            Créez un ebook complet en{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              moins de 60 minutes
            </span>
          </h1>
          <p className="text-foreground text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
            Notre IA analyse votre sujet, structure un plan professionnel avec chapitres détaillés, 
            et génère les mots-clés Amazon KDP pour maximiser vos ventes.{' '}
            <span className="text-white font-semibold">Testez gratuitement ci-dessous.</span>
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>+2 400 ebooks créés</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>4.9/5 satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Résultat en ~30 secondes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Aucune carte requise</span>
            </div>
          </div>
        </motion.div>

        {/* What You'll Get - Before the form */}
        <motion.div 
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "Plan structuré", desc: "Chapitres & sous-sections", color: "cyan" },
              { icon: Target, label: "Mots-clés KDP", desc: "Optimisés pour Amazon", color: "emerald" },
              { icon: BarChart3, label: "Estimation pages", desc: "Volume automatique", color: "amber" },
              { icon: BookMarked, label: "Résumé du livre", desc: "Pitch professionnel", color: "purple" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 text-center hover:border-border transition-colors">
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <p className="font-semibold text-white text-sm">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  Créez votre Ebook
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Remplissez le formulaire et laissez l'IA faire le reste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Titre de l'ebook *</Label>
                  <Input
                    placeholder="Ex: Les secrets du marketing digital en 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="bg-muted border-border text-white placeholder:text-slate-500 text-lg py-5"
                  />
                  <p className="text-xs text-slate-500">Astuce : un titre précis donne un meilleur plan</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Genre / Catégorie</Label>
                  <Select value={genre} onValueChange={setGenre} disabled={demoUsed || isGenerating}>
                    <SelectTrigger className="bg-muted border-border text-white">
                      <SelectValue placeholder="Choisir un genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {genres.map((g) => (
                        <SelectItem key={g} value={g} className="text-white hover:bg-muted">{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Public cible (optionnel)</Label>
                  <Input
                    placeholder="Ex: Entrepreneurs débutants"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="bg-muted border-border text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Chapitres fixés à 3 en démo */}
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                  <BookMarked className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-foreground">3 chapitres générés</span>
                  <Badge className="ml-auto bg-muted text-muted-foreground border-border text-xs">Démo</Badge>
                </div>
                <p className="text-xs text-slate-500">💡 La version complète permet jusqu'à 20 chapitres avec rédaction intégrale</p>

                <Button
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 rounded-xl shadow-lg shadow-cyan-500/20"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={demoUsed || isGenerating || !title.trim()}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />L'IA structure votre livre…</>
                  ) : demoUsed ? (
                    <><Lock className="w-5 h-5 mr-2" />Essais gratuits utilisés</>
                  ) : (
                    <><Zap className="w-5 h-5 mr-2" />Générer mon plan gratuitement</>
                  )}
                </Button>

                {/* Progress bar essais */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Essais utilisés</span>
                    <span>{demoCount}/{MAX_DEMO_TRIES}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(demoCount / MAX_DEMO_TRIES) * 100}%` }}
                    />
                  </div>
                </div>

                {demoUsed && (
                  <div className="text-center pt-4 border-t border-border space-y-3">
                    <p className="text-foreground text-sm font-medium">🚀 Vous avez vu la puissance de l'IA !</p>
                    <p className="text-slate-500 text-xs">Débloquez la rédaction complète, les couvertures IA, l'export et bien plus encore.</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl py-5"
                      onClick={() => navigate("/offres")}
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Débloquer tout pour 67€ à vie
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <Card className="bg-card border-border h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-slate-900 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">L'IA analyse votre sujet...</h3>
                  <p className="text-muted-foreground mb-4">Structure, chapitres, sous-sections et mots-clés KDP</p>
                  <div className="flex flex-col gap-2 text-sm text-slate-500 max-w-xs mx-auto">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Analyse du sujet et du genre</div>
                    <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> Structuration des chapitres</div>
                    <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4" /> Optimisation mots-clés Amazon</div>
                  </div>
                </div>
              </Card>
            ) : generatedPlan ? (
              <div className="space-y-4">
                {/* Success Card */}
                <Card className="bg-card border-emerald-800/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold text-lg">Plan Généré avec Succès !</span>
                      <Badge className="bg-white/20 text-white border-0 ml-auto">
                        <Timer className="w-3 h-3 mr-1" /> ~30s
                      </Badge>
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
                        <p className="text-muted-foreground mb-4 line-clamp-3">{generatedPlan.summary}</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: FileText, value: generatedPlan.chapters.length, label: "Chapitres", color: "cyan" },
                            { icon: BookOpen, value: `~${generatedPlan.estimatedPages}`, label: "Pages estimées", color: "emerald" },
                            { icon: Target, value: generatedPlan.kdpKeywords.length, label: "Mots-clés KDP", color: "amber" },
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
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Mots-clés Amazon KDP optimisés
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPlan.kdpKeywords.map((kw, i) => (
                          <Badge key={i} className="bg-amber-500/10 text-amber-400 border-amber-500/30">{kw}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Ces mots-clés sont sélectionnés pour maximiser la visibilité sur Amazon KDP</p>
                    </div>
                    
                    {/* Chapters */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <BookMarked className="w-4 h-4" /> Structure détaillée des chapitres
                      </h4>
                      <div className="space-y-2">
                        {generatedPlan.chapters.map((chapter, i) => (
                          <div 
                            key={i} 
                            className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${
                              expandedChapter === i ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-border hover:border-border'
                            }`}
                            onClick={() => setExpandedChapter(expandedChapter === i ? null : i)}
                          >
                            <div className="p-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{chapter.title}</p>
                                {chapter.description && expandedChapter !== i && (
                                  <p className="text-xs text-slate-500 truncate">{chapter.description}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                                {chapter.subSections.length} sections
                              </Badge>
                              <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${expandedChapter === i ? 'rotate-90' : ''}`} />
                            </div>
                            {expandedChapter === i && (
                              <div className="px-3 pb-3 border-t border-border">
                                {chapter.description && (
                                  <p className="text-sm text-muted-foreground mt-2 mb-2">{chapter.description}</p>
                                )}
                                {chapter.subSections.length > 0 && (
                                  <ul className="space-y-1 mt-2">
                                    {chapter.subSections.map((sub, j) => (
                                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-cyan-400 mt-0.5">•</span>
                                        <span>{sub}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Locked Features Preview */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      Fonctionnalités disponibles dans la version complète
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { icon: FileText, label: "Rédaction complète", desc: "Chaque chapitre rédigé en entier par l'IA", locked: true },
                        { icon: Palette, label: "Couverture IA", desc: "Générée automatiquement en haute définition", locked: true },
                        { icon: Download, label: "Export multi-format", desc: "PDF, EPUB, Word — prêt pour KDP", locked: true },
                        { icon: Headphones, label: "Audiobook", desc: "Narration vocale Azure Neural réaliste", locked: true },
                        { icon: Image, label: "Illustrations IA", desc: "Images générées pour enrichir le livre", locked: true },
                        { icon: Layers, label: "Séries & tomes", desc: "Créez des séries cohérentes multi-tomes", locked: true },
                      ].map((feat, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <feat.icon className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                              {feat.label}
                              <Lock className="w-3 h-3 text-slate-600" />
                            </p>
                            <p className="text-xs text-slate-600">{feat.desc}</p>
                          </div>
                        </div>
                      ))}
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
                        <h3 className="font-bold text-xl text-white mb-1">Passez à la version complète</h3>
                        <p className="text-muted-foreground text-sm mb-4">Accès à vie pour 67€ — pas d'abonnement, pas de limites</p>
                        <div className="grid sm:grid-cols-2 gap-2 mb-4">
                          {[
                            "✍️ Rédaction complète des chapitres",
                            "🎨 Couvertures générées par IA",
                            "📄 Export PDF / EPUB / Word",
                            "🎧 Audiobooks voix neurale",
                            "🎓 Formation 18 modules incluse",
                            "♾️ Générations illimitées à vie",
                          ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-foreground">{f}</div>
                          ))}
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl"
                          size="lg"
                          onClick={() => navigate('/offres')}
                        >
                          <Rocket className="w-5 h-5 mr-2" />
                          Accéder à tout pour 67€
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Empty State - Before Generation */
              <div className="space-y-6">
                <Card className="bg-card border-border border-dashed flex items-center justify-center min-h-[300px]">
                  <div className="text-center p-8">
                    <motion.div 
                      className="w-20 h-20 bg-cyan-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <BookOpen className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">Votre ebook commence ici</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Entrez un titre à gauche et cliquez sur <span className="text-cyan-400 font-medium">"Générer"</span> pour voir la puissance de l'IA en action
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge className="bg-muted text-foreground border-border">📖 Plan structuré</Badge>
                      <Badge className="bg-muted text-foreground border-border">🎯 Mots-clés KDP</Badge>
                      <Badge className="bg-muted text-foreground border-border">📊 Estimation pages</Badge>
                      <Badge className="bg-muted text-foreground border-border">📝 Résumé du livre</Badge>
                    </div>
                  </div>
                </Card>

                {/* How it works */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      Comment ça fonctionne ?
                    </h3>
                    <div className="grid gap-4">
                      {[
                        { step: "1", title: "Entrez votre titre", desc: "Décrivez le sujet de votre ebook. Plus c'est précis, meilleur sera le résultat.", icon: BookOpen },
                        { step: "2", title: "L'IA structure votre livre", desc: "En quelques secondes, l'intelligence artificielle analyse votre sujet, crée un plan avec chapitres et sous-sections.", icon: Sparkles },
                        { step: "3", title: "Obtenez votre plan complet", desc: "Visualisez la structure, les mots-clés KDP optimisés et l'estimation du nombre de pages.", icon: CheckCircle2 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Proof */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                      <Quote className="w-5 h-5 text-amber-400" />
                      Ce que disent nos utilisateurs
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { name: "Marie L.", text: "J'ai publié mon premier ebook en 3 jours grâce à cet outil. Les mots-clés KDP m'ont permis d'avoir 15 ventes dès la première semaine.", rating: 5 },
                        { name: "Thomas B.", text: "Impressionnant. Le plan généré était tellement bien structuré que je n'ai eu qu'à rédiger les chapitres. Un gain de temps énorme.", rating: 5 },
                        { name: "Sophie R.", text: "La fonctionnalité audiobook est incroyable. Mon ebook se vend à la fois en format écrit et audio sur Amazon.", rating: 5 },
                        { name: "Julien M.", text: "J'ai testé la démo et j'ai été convaincu en 30 secondes. L'investissement de 67€ est rentabilisé dès le premier ebook vendu.", rating: 5 },
                      ].map((review, i) => (
                        <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                          <div className="flex items-center gap-1 mb-2">
                            {Array(review.rating).fill(0).map((_, j) => (
                              <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm text-foreground mb-2 italic">"{review.text}"</p>
                          <p className="text-xs text-slate-500 font-medium">— {review.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* What's included in full version */}
                <Card className="bg-gradient-to-br from-cyan-950/30 to-emerald-950/30 border-cyan-800/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      La démo, c'est 5% de la puissance
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Avec la version complète, vous passez du plan à un ebook publié sur Amazon en moins d'une heure.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Rédaction IA", desc: "Chapitres entiers rédigés automatiquement", icon: FileText },
                        { label: "Couverture Pro", desc: "Design professionnel généré par IA", icon: Palette },
                        { label: "Audiobook", desc: "Voix neurale réaliste intégrée", icon: Headphones },
                      ].map((item, i) => (
                        <div key={i} className="bg-card rounded-xl p-4 border border-border/50 text-center">
                          <item.icon className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
                          <p className="font-semibold text-white text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-xl"
                      onClick={() => navigate('/offres')}
                    >
                      Voir toutes les fonctionnalités <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Bottom FAQ Section */}
        <motion.div 
          className="mt-16 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { q: "La démo est-elle vraiment gratuite ?", a: "Oui, 100% gratuit. Vous pouvez générer 1 plan complet de 3 chapitres sans carte bancaire ni inscription. L'IA structure votre ebook avec chapitres, sous-sections et mots-clés Amazon KDP." },
              { q: "Quelle est la qualité du contenu généré ?", a: "Notre IA utilise les derniers modèles de langage (Gemini 3 Flash) pour produire du contenu professionnel, structuré et optimisé pour le marché Amazon KDP." },
              { q: "Combien de temps faut-il pour créer un ebook complet ?", a: "Avec la version complète, un ebook de 10 chapitres peut être entièrement rédigé, illustré et exporté en PDF/EPUB en moins de 60 minutes." },
              { q: "Est-ce que 67€ c'est un paiement unique ?", a: "Oui, c'est un accès à vie. Pas d'abonnement, pas de frais cachés. Vous payez une fois et vous générez autant d'ebooks que vous voulez, pour toujours." },
              { q: "Puis-je vendre les ebooks créés ?", a: "Absolument. Vous êtes propriétaire de tout le contenu généré. Vous pouvez le publier sur Amazon KDP, le vendre sur votre site, ou le distribuer comme bon vous semble." },
              { q: "L'audiobook est-il inclus ?", a: "Oui, la version complète inclut la génération d'audiobooks avec des voix neurales Azure ultra-réalistes. Vous pouvez vendre votre livre en format audio sur Audible/Amazon." },
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2 text-sm">{faq.q}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center py-12 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Prêt à créer votre premier ebook ?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Rejoignez +2 400 créateurs qui utilisent EbookStudio Pro pour publier sur Amazon KDP et générer des revenus passifs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl px-8 py-6 text-lg"
              onClick={() => navigate('/offres')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Débloquer tout pour 67€
            </Button>
            <p className="text-xs text-slate-600">Paiement unique • Accès à vie • Garantie 30 jours</p>
          </div>
        </motion.div>
      </div>

      {/* Email Popup */}
      <Dialog open={showEmailPopup} onOpenChange={setShowEmailPopup}>
        <DialogContent className="bg-card border-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gift className="w-6 h-6 text-emerald-400" />
              🎉 Votre plan est prêt !
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Recevez gratuitement notre guide <span className="text-white font-medium">"10 Niches KDP Rentables 2026"</span> avec des stratégies concrètes pour vos premiers revenus.
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
                className="bg-muted border-border text-white placeholder:text-slate-500"
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
