import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Sparkles, Loader2, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEMO_STORAGE_KEY = "ebook_demo_used";

const DemoPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [numberOfChapters, setNumberOfChapters] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [demoUsed, setDemoUsed] = useState(false);

  useEffect(() => {
    const used = localStorage.getItem(DEMO_STORAGE_KEY);
    if (used === "true") {
      setDemoUsed(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Veuillez entrer un titre pour votre ebook");
      return;
    }

    if (demoUsed) {
      toast.error("Vous avez déjà utilisé votre essai gratuit");
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
        localStorage.setItem(DEMO_STORAGE_KEY, "true");
        setDemoUsed(true);
        toast.success("Plan généré avec succès !");
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
            <span className="text-primary font-medium"> Essai limité à 1 génération.</span>
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
                    Essai utilisé
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer mon plan
                  </>
                )}
              </Button>

              {demoUsed && !generatedPlan && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Vous avez déjà utilisé votre essai gratuit
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
      </div>
    </div>
  );
};

export default DemoPage;
