import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Target, Lightbulb, AlertTriangle, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditorialAnalysis {
  promesseCentrale: string;
  angleEditorial: string;
  cibleIdeale: string;
  erreursCourantes: string[];
  visionGlobale: string;
}

interface EbookEditorialDirectorProps {
  onAnalysisComplete?: (analysis: EditorialAnalysis) => void;
}

export const EbookEditorialDirector = ({ onAnalysisComplete }: EbookEditorialDirectorProps) => {
  const [sujet, setSujet] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EditorialAnalysis | null>(null);

  const analyzeSubject = async () => {
    if (!sujet.trim()) {
      toast.error("Veuillez entrer un sujet à analyser");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("editorial-director", {
        body: { 
          sujet, 
          contexte: `Analyse automatique complète pour un ebook sur "${sujet}". Identifier le positionnement optimal, la cible idéale et les opportunités de différenciation.`
        },
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        onAnalysisComplete?.(data.analysis);
        toast.success("Analyse éditoriale terminée !");
      }
    } catch (error) {
      console.error("Erreur analyse:", error);
      toast.error("Erreur lors de l'analyse. Réessayez.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Directeur Éditorial IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Entrez juste le titre - l'analyse stratégique complète est générée automatiquement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sujet">Titre / Sujet de l'ebook *</Label>
            <Input
              id="sujet"
              placeholder="Ex: Comment automatiser son business avec l'IA en 2024"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="text-base"
              onKeyDown={(e) => e.key === 'Enter' && analyzeSubject()}
            />
          </div>

          <Button
            onClick={analyzeSubject}
            disabled={isAnalyzing || !sujet.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Lancer l'analyse éditoriale
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                <BookOpen className="h-5 w-5" />
                Promesse Centrale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.promesseCentrale}</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                <Lightbulb className="h-5 w-5" />
                Angle Éditorial Différenciant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.angleEditorial}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-400">
                <Target className="h-5 w-5" />
                Cible Idéale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.cibleIdeale}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400">
                <AlertTriangle className="h-5 w-5" />
                Erreurs Courantes du Marché
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.erreursCourantes.map((erreur, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-orange-500/50">
                    {erreur}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-primary" />
                Vision Globale de l'Ebook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.visionGlobale}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
