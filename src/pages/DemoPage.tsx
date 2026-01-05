import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, CheckCircle2, Mail, Gift, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEMO_STORAGE_KEY = "ebook_demo_count";
const EMAIL_CAPTURED_KEY = "ebook_demo_email_captured";
const MAX_DEMO_TRIES = 2;

const DemoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [numberOfChapters, setNumberOfChapters] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [captureEmail, setCaptureEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);

  const remainingTries = MAX_DEMO_TRIES - demoCount;
  const demoUsed = demoCount >= MAX_DEMO_TRIES;

  useEffect(() => {
    // Reset demo if ?reset=true in URL
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
        setGeneratedPlan(data.plan);
        const newCount = demoCount + 1;
        localStorage.setItem(DEMO_STORAGE_KEY, newCount.toString());
        setDemoCount(newCount);
        
        // Show email popup after first generation if email not already captured
        if (!emailCaptured) {
          setTimeout(() => setShowEmailPopup(true), 1500);
        }
        
        if (newCount >= MAX_DEMO_TRIES) {
          toast.success("Plan généré ! Vous avez utilisé vos 2 essais gratuits.");
        } else {
          toast.success(`Plan généré ! Il vous reste ${MAX_DEMO_TRIES - newCount} essai(s).`);
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
      
      // Save email to subscribers table
      const { error } = await supabase.from("subscribers").insert({
        email: emailLower,
        plan_type: "demo",
        status: "demo_lead"
      });

      if (error && !error.message.includes("duplicate")) {
        throw error;
      }

      // Send welcome email with KDP guide
      const { error: emailError } = await supabase.functions.invoke("send-welcome-email", {
        body: { email: emailLower }
      });

      if (emailError) {
        console.error("Welcome email error:", emailError);
        // Don't fail the whole flow if email fails
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
    "Voyage & Aventure",
    "Livres pour enfants (3-6 ans)",
    "Livres pour enfants (6-9 ans)",
    "Livres pour enfants (9-12 ans)",
    "Jeunesse / Young Adult",
    "Romance",
    "Thriller & Policier",
    "Science-Fiction",
    "Fantasy",
    "Horreur",
    "Biographie & Mémoires",
    "Histoire",
    "Guide pratique",
    "Éducation & Formation",
    "Spiritualité & Religion",
    "Art & Design",
    "Autre",
  ];

  const audiences = [
    "Grand public",
    "Enfants (3-6 ans)",
    "Enfants (6-9 ans)",
    "Enfants (9-12 ans)",
    "Adolescents (12-18 ans)",
    "Jeunes adultes (18-25 ans)",
    "Adultes (25-45 ans)",
    "Seniors (45+)",
    "Entrepreneurs débutants",
    "Entrepreneurs expérimentés",
    "Étudiants",
    "Professionnels en reconversion",
    "Parents",
    "Femmes",
    "Hommes",
    "Couples",
    "Managers & Cadres",
    "Indépendants & Freelances",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  🎁 Mode Démo Gratuit
                </p>
                <p className="text-sm text-muted-foreground">
                  {remainingTries > 0 
                    ? `${remainingTries} essai${remainingTries > 1 ? 's' : ''} gratuit${remainingTries > 1 ? 's' : ''} • Génération de plans uniquement`
                    : 'Essais épuisés • Passez à la version complète'
                  }
                </p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
              onClick={() => navigate('/offres')}
            >
              Débloquer tout <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Démo Gratuite
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Testez le Générateur d'Ebook
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Générez gratuitement un plan complet pour votre ebook. 
            <span className="text-primary font-medium"> {remainingTries > 0 ? `Il vous reste ${remainingTries} essai(s) gratuit(s).` : "Essais épuisés."}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Votre Ebook
              </CardTitle>
              <CardDescription>
                Remplissez les informations pour générer votre plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'ebook *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Les secrets de la productivité"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={demoUsed || isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre / Catégorie</Label>
                <Select value={genre} onValueChange={setGenre} disabled={demoUsed || isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Public cible</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience} disabled={demoUsed || isGenerating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un public" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapters">Nombre de chapitres</Label>
                <Select value={numberOfChapters} onValueChange={setNumberOfChapters} disabled={demoUsed || isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 10].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} chapitres
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={demoUsed || isGenerating || !title.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : demoUsed ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Essais utilisés (0/{MAX_DEMO_TRIES})
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer mon plan ({remainingTries}/{MAX_DEMO_TRIES} restant)
                  </>
                )}
              </Button>

              {demoUsed && !generatedPlan && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Vous avez utilisé vos 2 essais gratuits
                  </p>
                  <Button variant="outline" onClick={() => navigate("/offres")}>
                    Voir les offres
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Plan Généré
              </CardTitle>
              <CardDescription>
                Votre plan d'ebook apparaîtra ici
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>L'IA génère votre plan...</p>
                  <p className="text-sm">Cela peut prendre 10-20 secondes</p>
                </div>
              ) : generatedPlan ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedPlan}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPlan);
                        toast.success("Plan copié !");
                      }}
                    >
                      Copier le plan
                    </Button>
                    <Button onClick={() => navigate("/offres")}>
                      Débloquer toutes les fonctionnalités
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                  <p>Remplissez le formulaire et cliquez sur</p>
                  <p>"Générer mon plan" pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features preview */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Avec la version complète, vous aurez aussi :</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Génération illimitée",
              "Rédaction des chapitres",
              "Export PDF/EPUB",
              "Couvertures IA",
              "Outils Amazon KDP",
              "Formation incluse",
            ].map((feature) => (
              <Badge key={feature} variant="secondary" className="px-3 py-1">
                {feature}
              </Badge>
            ))}
          </div>
          <Button className="mt-6" size="lg" onClick={() => navigate("/offres")}>
            Voir les offres
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Email Capture Popup */}
        <Dialog open={showEmailPopup} onOpenChange={setShowEmailPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Gift className="w-6 h-6 text-primary" />
                🎉 Bravo, votre plan est prêt !
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Recevez <span className="font-semibold text-foreground">gratuitement</span> nos meilleures astuces pour écrire et vendre votre ebook sur Amazon KDP.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">📚 Guide KDP offert</Badge>
                <Badge variant="secondary" className="text-xs">💡 Astuces d'écriture</Badge>
                <Badge variant="secondary" className="text-xs">🚀 Stratégies de vente</Badge>
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
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                    disabled={isSubmittingEmail}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleEmailSubmit} 
                    disabled={isSubmittingEmail || !captureEmail.trim()}
                  >
                    {isSubmittingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                🔒 Pas de spam, désinscription en 1 clic
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEmailPopup(false)}
                className="text-muted-foreground"
              >
                Non merci
              </Button>
              <Button onClick={handleEmailSubmit} disabled={isSubmittingEmail || !captureEmail.trim()}>
                {isSubmittingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Recevoir les astuces
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DemoPage;
