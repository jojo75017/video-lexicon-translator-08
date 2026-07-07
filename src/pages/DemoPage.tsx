import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, ArrowLeft, CheckCircle2, Mail, Gift, Crown, Zap, Star, BookMarked, FileText, Target, Rocket, Clock, Shield, Users, ChevronRight, Heart } from "lucide-react";
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
  const [, setRawPlan] = useState<string | null>(null);
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
        chapters.push({ title: `Chapitre ${i + 1}`, description: "Contenu du chapitre généré par l'IA", subSections: ['Section 1', 'Section 2', 'Section 3'] });
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
        toast.success(newCount >= MAX_DEMO_TRIES ? "🎉 Plan généré !" : `✨ Plan généré ! ${MAX_DEMO_TRIES - newCount} essai restant.`);
      } else throw new Error("Aucun plan généré");
    } catch (error: unknown) {
      console.error("Generation error:", error);
      const msg = error instanceof Error ? error.message : "Erreur lors de la génération";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!captureEmail.includes("@")) { toast.error("Email invalide"); return; }
    setIsSubmittingEmail(true);
    try {
      const emailLower = captureEmail.trim().toLowerCase();
      const { error } = await supabase.functions.invoke("capture-demo-lead", { body: { email: emailLower } });
      if (error) throw error;
      localStorage.setItem(EMAIL_CAPTURED_KEY, "true");
      setEmailCaptured(true);
      setShowEmailPopup(false);
      toast.success("🎁 Guide envoyé par email !");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("duplicate")) {
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
    <div className="min-h-screen bg-joy-cream text-joy-ink overflow-x-hidden">
      <Helmet>
        <title>Démo Gratuite - Génère ton plan d'ebook en 30 secondes | Ebookstudio Pro V2</title>
        <meta name="description" content="Teste gratuitement notre IA : un plan d'ebook structuré avec chapitres et mots-clés Amazon KDP, en 30 secondes. Sans inscription." />
        <link rel="canonical" href="https://ebookstudio.fr/demo" />
      </Helmet>

      {/* Blobs décoratifs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-joy-peach/40 blur-3xl animate-joy-float" />
        <div className="absolute top-40 -right-32 w-[460px] h-[460px] rounded-full bg-joy-mint/40 blur-3xl animate-joy-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-[380px] h-[380px] rounded-full bg-joy-lavender/40 blur-3xl animate-joy-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-joy-cream/85 backdrop-blur-xl border-b-2 border-joy-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/offres')} className="text-joy-ink/70 hover:text-joy-ink hover:bg-joy-peach/30 rounded-2xl gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <Link to="/offres" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-joy-peach flex items-center justify-center shadow-joy animate-joy-wiggle">
                <BookOpen className="w-5 h-5 text-joy-ink" />
              </div>
              <span className="font-black text-lg text-joy-ink">Ebookstudio Pro V2</span>
            </Link>
          </div>
          <Button onClick={() => navigate('/offres')} className="bg-joy-ink hover:bg-joy-ink/90 text-joy-cream font-black rounded-full px-5 shadow-joy">
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge className="bg-joy-sun text-joy-ink border-0 px-4 py-2 mb-6 text-sm font-bold rounded-full shadow-joy animate-joy-pop">
            <Zap className="w-4 h-4 mr-1.5" />
            {remainingTries > 0 ? '1 essai gratuit • 3 chapitres • Sans inscription' : 'Essai utilisé - passe à la version complète'}
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 leading-[1.05] text-joy-ink">
            Regarde ton ebook{" "}
            <span className="relative inline-block">
              <span className="relative z-10">prendre vie</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-joy-peach/70 -z-0 rounded-full" />
            </span>
            {" "}en 30 secondes
          </h1>
          <p className="text-joy-ink/70 text-lg md:text-xl max-w-3xl mx-auto mb-6 leading-relaxed">
            Tape ton sujet, et notre IA structure pour toi un plan complet : chapitres, sous-sections, mots-clés Amazon KDP. <span className="font-semibold text-joy-ink">Zéro inscription, zéro carte bancaire.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-joy-ink/60">
            <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> +2 400 ebooks créés</div>
            <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-joy-sun text-joy-sun" /> 4.9/5</div>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> ~30s</div>
            <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Aucune carte</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-2 border-joy-ink/10 rounded-3xl sticky top-24 shadow-joy-lg overflow-hidden">
              <div className="bg-joy-mint p-5 border-b-2 border-joy-ink/10">
                <h3 className="font-black text-xl text-joy-ink flex items-center gap-2">
                  <BookOpen className="w-6 h-6" /> Ton ebook démarre ici
                </h3>
                <p className="text-joy-ink/70 text-sm mt-1">Remplis 3 champs, on s'occupe du reste 🪄</p>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-joy-ink font-bold">Titre de ton ebook *</Label>
                  <Input
                    placeholder="Ex : Le jeûne intermittent pour débutants"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="bg-joy-cream border-2 border-joy-ink/15 text-joy-ink placeholder:text-joy-ink/40 text-base py-5 rounded-2xl focus-visible:ring-joy-peach focus-visible:border-joy-peach"
                  />
                  <p className="text-xs text-joy-ink/50">💡 Plus c'est précis, meilleur sera le plan</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-joy-ink font-bold text-sm">Genre / Catégorie</Label>
                  <Select value={genre} onValueChange={setGenre} disabled={demoUsed || isGenerating}>
                    <SelectTrigger className="bg-joy-cream border-2 border-joy-ink/15 text-joy-ink rounded-2xl py-5">
                      <SelectValue placeholder="Choisir un genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-joy-ink/10 rounded-2xl">
                      {genres.map((g) => (
                        <SelectItem key={g} value={g} className="text-joy-ink hover:bg-joy-peach/20">{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-joy-ink font-bold text-sm">Public cible (optionnel)</Label>
                  <Input
                    placeholder="Ex : Entrepreneurs débutants"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    disabled={demoUsed || isGenerating}
                    className="bg-joy-cream border-2 border-joy-ink/15 text-joy-ink placeholder:text-joy-ink/40 rounded-2xl py-5"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-joy-lavender/40 rounded-2xl border-2 border-joy-ink/10">
                  <BookMarked className="w-4 h-4 text-joy-ink" />
                  <span className="text-sm text-joy-ink font-medium">3 chapitres en démo</span>
                  <Badge className="ml-auto bg-joy-ink text-joy-cream border-0 text-xs rounded-full">Démo</Badge>
                </div>

                <Button
                  className="w-full py-7 text-lg font-black bg-joy-peach hover:bg-joy-peach/90 text-joy-ink rounded-2xl shadow-joy-lg hover:shadow-joy hover:scale-[1.02] transition-all"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={demoUsed || isGenerating || !title.trim()}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> L'IA structure ton livre…</>
                  ) : demoUsed ? (
                    <><Lock className="w-5 h-5 mr-2" /> Essai utilisé</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> Lancer la magie ✨</>
                  )}
                </Button>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-joy-ink/60 font-medium">
                    <span>Essais utilisés</span>
                    <span>{demoCount}/{MAX_DEMO_TRIES}</span>
                  </div>
                  <div className="h-2 bg-joy-ink/10 rounded-full overflow-hidden">
                    <div className="h-full bg-joy-peach rounded-full transition-all duration-500" style={{ width: `${(demoCount / MAX_DEMO_TRIES) * 100}%` }} />
                  </div>
                </div>

                {demoUsed && (
                  <div className="text-center pt-4 border-t-2 border-joy-ink/10 space-y-3">
                    <p className="text-joy-ink text-sm font-bold">🚀 Tu as vu ce que l'IA peut faire !</p>
                    <Button className="w-full bg-joy-sun hover:bg-joy-sun/90 text-joy-ink font-black rounded-2xl py-6 shadow-joy" onClick={() => navigate("/offres")}>
                      <Crown className="w-5 h-5 mr-2" /> Tout débloquer pour 67€
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <Card className="bg-white border-2 border-joy-ink/10 rounded-3xl h-full flex items-center justify-center min-h-[500px] shadow-joy">
                <div className="text-center p-8">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-joy-peach/40 rounded-full animate-ping" />
                    <div className="relative w-24 h-24 bg-joy-peach rounded-full flex items-center justify-center shadow-joy-lg animate-joy-wiggle">
                      <Sparkles className="w-12 h-12 text-joy-ink" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-joy-ink mb-2">L'IA réfléchit pour toi…</h3>
                  <p className="text-joy-ink/70 mb-4">Structure, chapitres, mots-clés KDP - tout arrive</p>
                  <div className="flex flex-col gap-2 text-sm text-joy-ink/70 max-w-xs mx-auto">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-joy-mint" /> Analyse du sujet</div>
                    <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-joy-peach animate-spin" /> Structuration des chapitres</div>
                    <div className="flex items-center gap-2 opacity-50"><Clock className="w-4 h-4" /> Optimisation Amazon</div>
                  </div>
                </div>
              </Card>
            ) : generatedPlan ? (
              <div className="space-y-4">
                <Card className="bg-white border-2 border-joy-mint/50 rounded-3xl overflow-hidden shadow-joy-lg">
                  <div className="bg-joy-mint p-4 flex items-center gap-3 border-b-2 border-joy-ink/10">
                    <div className="w-10 h-10 rounded-full bg-joy-cream flex items-center justify-center animate-joy-pop">
                      <CheckCircle2 className="w-6 h-6 text-joy-ink" />
                    </div>
                    <span className="font-black text-lg text-joy-ink">Ton plan est prêt !</span>
                    <Badge className="bg-joy-ink text-joy-cream border-0 ml-auto rounded-full"><Clock className="w-3 h-3 mr-1" /> ~30s</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="w-32 h-44 bg-joy-peach rounded-2xl shadow-joy-lg flex-shrink-0 flex flex-col items-center justify-center text-joy-ink p-3 animate-joy-float border-4 border-white">
                        <BookMarked className="w-8 h-8 mb-2" />
                        <p className="text-xs text-center font-black line-clamp-3">{title}</p>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-joy-ink mb-2">{title}</h2>
                        <p className="text-joy-ink/70 mb-4 line-clamp-3">{generatedPlan.summary}</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: FileText, value: generatedPlan.chapters.length, label: "Chapitres", bg: "bg-joy-mint/40" },
                            { icon: BookOpen, value: `~${generatedPlan.estimatedPages}`, label: "Pages", bg: "bg-joy-sun/40" },
                            { icon: Target, value: generatedPlan.kdpKeywords.length, label: "Mots-clés", bg: "bg-joy-lavender/40" },
                          ].map((stat, i) => (
                            <div key={i} className={`${stat.bg} rounded-2xl p-3 text-center border-2 border-joy-ink/10`}>
                              <stat.icon className="w-5 h-5 mx-auto text-joy-ink mb-1" />
                              <p className="text-lg font-black text-joy-ink">{stat.value}</p>
                              <p className="text-xs text-joy-ink/70 font-medium">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-black text-joy-ink mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Mots-clés Amazon KDP optimisés
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedPlan.kdpKeywords.map((kw, i) => (
                          <Badge key={i} className="bg-joy-sun text-joy-ink border-0 rounded-full px-3 py-1 font-medium">{kw}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-joy-ink mb-3 flex items-center gap-2">
                        <BookMarked className="w-4 h-4" /> Structure détaillée des chapitres
                      </h4>
                      <div className="space-y-2">
                        {generatedPlan.chapters.map((chapter, i) => (
                          <div
                            key={i}
                            className={`border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${
                              expandedChapter === i ? 'border-joy-peach bg-joy-peach/10' : 'border-joy-ink/10 hover:border-joy-peach/40 bg-joy-cream/50'
                            }`}
                            onClick={() => setExpandedChapter(expandedChapter === i ? null : i)}
                          >
                            <div className="p-3 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-joy-peach flex items-center justify-center text-joy-ink text-sm font-black flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-joy-ink truncate">{chapter.title}</p>
                                {chapter.description && expandedChapter !== i && (
                                  <p className="text-xs text-joy-ink/60 truncate">{chapter.description}</p>
                                )}
                              </div>
                              <Badge className="bg-joy-ink/10 text-joy-ink border-0 rounded-full text-xs">{chapter.subSections.length} sections</Badge>
                              <ChevronRight className={`w-4 h-4 text-joy-ink/50 transition-transform ${expandedChapter === i ? 'rotate-90' : ''}`} />
                            </div>
                            {expandedChapter === i && (
                              <div className="px-3 pb-3 border-t-2 border-joy-ink/10">
                                {chapter.description && <p className="text-sm text-joy-ink/80 mt-2 mb-2">{chapter.description}</p>}
                                {chapter.subSections.length > 0 && (
                                  <ul className="space-y-1 mt-2">
                                    {chapter.subSections.map((sub, j) => (
                                      <li key={j} className="text-sm text-joy-ink/80 flex items-start gap-2">
                                        <span className="text-joy-peach mt-0.5">●</span>
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

                <Card className="bg-joy-lavender/30 border-2 border-joy-ink/10 rounded-3xl shadow-joy">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-joy-sun flex items-center justify-center flex-shrink-0 animate-joy-wiggle">
                        <Crown className="w-7 h-7 text-joy-ink" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl text-joy-ink mb-1">Tu veux la version complète ?</h3>
                        <p className="text-joy-ink/70 text-sm mb-4">67€ à vie - pas d'abonnement, pas de limites.</p>
                        <div className="grid sm:grid-cols-2 gap-2 mb-4 text-sm text-joy-ink">
                          {["✍️ Rédaction complète des chapitres", "🎨 Couvertures IA", "📄 Export PDF / EPUB / Word", "🎧 Audiobooks voix neurale", "🎓 Formation 18 modules", "♾️ Générations illimitées"].map((f, i) => (
                            <div key={i}>{f}</div>
                          ))}
                        </div>
                        <Button className="bg-joy-peach hover:bg-joy-peach/90 text-joy-ink font-black rounded-2xl shadow-joy" size="lg" onClick={() => navigate('/offres')}>
                          <Rocket className="w-5 h-5 mr-2" /> Tout débloquer pour 67€ <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-white border-2 border-dashed border-joy-ink/20 rounded-3xl flex items-center justify-center min-h-[300px] shadow-joy">
                  <div className="text-center p-8">
                    <motion.div className="w-24 h-24 bg-joy-peach/40 rounded-3xl mx-auto mb-6 flex items-center justify-center" animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                      <BookOpen className="w-12 h-12 text-joy-ink" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-joy-ink mb-2">Ton ebook commence ici 👈</h3>
                    <p className="text-joy-ink/70 mb-6 max-w-sm mx-auto">
                      Tape un titre à gauche et clique sur <span className="text-joy-ink font-bold">"Lancer la magie"</span> pour voir l'IA en action.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["📖 Plan structuré", "🎯 Mots-clés KDP", "📊 Estimation pages", "📝 Résumé"].map((b, i) => (
                        <Badge key={i} className="bg-joy-mint/40 text-joy-ink border-0 rounded-full px-3 py-1 font-medium">{b}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="bg-white border-2 border-joy-ink/10 rounded-3xl shadow-joy">
                  <CardContent className="p-6">
                    <h3 className="font-black text-joy-ink text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-joy-peach" /> Comment ça marche ?
                    </h3>
                    <div className="grid gap-4">
                      {[
                        { step: "1", title: "Tape ton titre", desc: "Décris le sujet de ton ebook. Plus c'est clair, mieux c'est.", bg: "bg-joy-mint" },
                        { step: "2", title: "L'IA structure ton livre", desc: "En quelques secondes : plan, chapitres, sous-sections.", bg: "bg-joy-sun" },
                        { step: "3", title: "Récupère ton plan complet", desc: "Structure, mots-clés KDP et estimation du volume.", bg: "bg-joy-lavender" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-full ${item.bg} flex items-center justify-center text-joy-ink text-base font-black flex-shrink-0 shadow-joy`}>{item.step}</div>
                          <div>
                            <p className="font-black text-joy-ink">{item.title}</p>
                            <p className="text-sm text-joy-ink/70">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div className="text-center py-16 mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Heart className="w-12 h-12 text-joy-peach mx-auto mb-4 fill-joy-peach animate-joy-wiggle" />
          <h2 className="text-3xl md:text-4xl font-black text-joy-ink mb-3">
            Prêt à publier ton premier ebook ?
          </h2>
          <p className="text-joy-ink/70 max-w-lg mx-auto mb-6">
            Rejoins +2 400 créateurs qui utilisent Ebookstudio Pro V2 pour publier sur Amazon KDP.
          </p>
          <Button size="lg" className="bg-joy-peach hover:bg-joy-peach/90 text-joy-ink font-black rounded-2xl px-10 py-7 text-lg shadow-joy-lg hover:scale-105 transition-transform" onClick={() => navigate('/offres')}>
            <Crown className="w-5 h-5 mr-2" /> Tout débloquer pour 67€
          </Button>
          <p className="text-xs text-joy-ink/50 mt-3">Paiement unique • Accès à vie • Garantie 30 jours</p>
        </motion.div>
      </div>

      {/* Email Popup */}
      <Dialog open={showEmailPopup} onOpenChange={setShowEmailPopup}>
        <DialogContent className="bg-joy-cream border-2 border-joy-ink/10 text-joy-ink sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black">
              <Gift className="w-6 h-6 text-joy-peach" /> 🎉 Ton plan est prêt !
            </DialogTitle>
            <DialogDescription className="text-joy-ink/70">
              Reçois en cadeau notre guide <span className="font-bold text-joy-ink">"10 Niches KDP Rentables 2026"</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="ton@email.com"
                value={captureEmail}
                onChange={(e) => setCaptureEmail(e.target.value)}
                disabled={isSubmittingEmail}
                className="bg-white border-2 border-joy-ink/15 text-joy-ink placeholder:text-joy-ink/40 rounded-2xl"
              />
              <Button onClick={handleEmailSubmit} disabled={isSubmittingEmail || !captureEmail.includes("@")} className="bg-joy-peach hover:bg-joy-peach/90 text-joy-ink font-black rounded-2xl">
                {isSubmittingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4 mr-1" /> Recevoir</>}
              </Button>
            </div>
            <p className="text-xs text-joy-ink/50 text-center">🔒 Pas de spam. Désinscription en 1 clic.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoPage;
