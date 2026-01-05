import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, LayoutGrid, BookOpen, GraduationCap, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChapterStructure {
  numero: number;
  titre: string;
  objectif: string;
  justification: string;
  sousSections: string[];
}

interface ContentArchitecture {
  introduction: {
    elements: string[];
    justification: string;
  };
  chapitres: ChapterStructure[];
  conclusion: {
    elements: string[];
    justification: string;
  };
  bonusSuggeres: string[];
}

interface EbookContentArchitectProps {
  onArchitectureComplete?: (architecture: ContentArchitecture) => void;
  onApplyStructure?: (chapters: Array<{ title: string; subChapters: string[] }>) => void;
}

export const EbookContentArchitect = ({ onArchitectureComplete, onApplyStructure }: EbookContentArchitectProps) => {
  const [sujet, setSujet] = useState("");
  const [objectif, setObjectif] = useState("");
  const [nombreChapitres, setNombreChapitres] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [architecture, setArchitecture] = useState<ContentArchitecture | null>(null);

  const generateArchitecture = async () => {
    if (!sujet.trim()) {
      toast.error("Veuillez entrer le sujet de votre ebook");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-architect", {
        body: { sujet, objectif, nombreChapitres },
      });

      if (error) throw error;

      if (data?.architecture) {
        setArchitecture(data.architecture);
        onArchitectureComplete?.(data.architecture);
        toast.success("Architecture éditoriale générée !");
      }
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyToProject = () => {
    if (!architecture) return;
    
    const chapters = architecture.chapitres.map(ch => ({
      title: `Chapitre ${ch.numero}: ${ch.titre}`,
      subChapters: ch.sousSections
    }));
    
    onApplyStructure?.(chapters);
    toast.success("Structure appliquée au projet !");
  };

  return (
    <div className="space-y-6">
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LayoutGrid className="h-6 w-6 text-violet-500" />
            Architecte de Contenu IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Structure professionnelle optimisée pour la compréhension, la progression pédagogique et l'engagement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sujet-arch">Sujet de l'ebook *</Label>
            <Input
              id="sujet-arch"
              placeholder="Ex: Maîtriser le marketing digital pour les entrepreneurs"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectif-arch">Objectif principal du lecteur (optionnel)</Label>
            <Textarea
              id="objectif-arch"
              placeholder="Que doit être capable de faire le lecteur après lecture ?"
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapitres-arch">Nombre de chapitres souhaité</Label>
            <Input
              id="chapitres-arch"
              type="number"
              min={3}
              max={20}
              value={nombreChapitres}
              onChange={(e) => setNombreChapitres(parseInt(e.target.value) || 8)}
              className="w-32"
            />
          </div>

          <Button
            onClick={generateArchitecture}
            disabled={isGenerating || !sujet.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conception en cours...
              </>
            ) : (
              <>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Générer l'architecture
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {architecture && (
        <div className="space-y-4">
          {/* Bouton appliquer */}
          {onApplyStructure && (
            <Button onClick={applyToProject} className="w-full" variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Appliquer cette structure au projet
            </Button>
          )}

          {/* Introduction */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {architecture.introduction.elements.map((el, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {el}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                💡 {architecture.introduction.justification}
              </p>
            </CardContent>
          </Card>

          {/* Chapitres */}
          <div className="grid gap-3">
            {architecture.chapitres.map((chapitre) => (
              <Card key={chapitre.numero} className="border-violet-500/20">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-600 flex items-center justify-center text-sm font-bold">
                        {chapitre.numero}
                      </span>
                      {chapitre.titre}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {chapitre.objectif}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {chapitre.sousSections.map((ss, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {ss}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ✓ {chapitre.justification}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conclusion */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                <Heart className="h-5 w-5" />
                Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {architecture.conclusion.elements.map((el, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {el}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                💡 {architecture.conclusion.justification}
              </p>
            </CardContent>
          </Card>

          {/* Bonus suggérés */}
          {architecture.bonusSuggeres.length > 0 && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
                  <Sparkles className="h-5 w-5" />
                  Bonus Suggérés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {architecture.bonusSuggeres.map((bonus, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-amber-500/50">
                      🎁 {bonus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
