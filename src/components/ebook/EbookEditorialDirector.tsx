import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Target, Lightbulb, AlertTriangle, Eye, Sparkles, PenLine, Copy, Check, Trophy, TrendingUp, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface CibleIdealeObject {
  profil?: string;
  besoins?: string;
  frustrations?: string;
}

interface TitleSuggestion {
  titre: string;
  sousTitre?: string;
  scoreKdp: number;
  raison: string;
}

interface TitreOriginalScore {
  scoreKdp: number;
  forces: string;
  faiblesses: string;
}

interface MeilleurTitre {
  index: number;
  explication: string;
}

interface EditorialAnalysis {
  promesseCentrale: string;
  angleEditorial: string;
  cibleIdeale: string | CibleIdealeObject;
  erreursCourantes: string[];
  visionGlobale: string;
  suggestionsTitle?: TitleSuggestion[] | string[];
  meilleurTitre?: MeilleurTitre;
  titreOriginalScore?: TitreOriginalScore;
}

// Helper to render cibleIdeale whether it's a string or object
const renderCibleIdeale = (cible: string | CibleIdealeObject): React.ReactNode => {
  if (typeof cible === 'string') {
    return <p className="text-sm leading-relaxed">{cible}</p>;
  }
  
  return (
    <div className="space-y-2 text-sm">
      {cible.profil && (
        <div>
          <span className="font-medium text-purple-700 dark:text-purple-400">Profil : </span>
          <span>{cible.profil}</span>
        </div>
      )}
      {cible.besoins && (
        <div>
          <span className="font-medium text-purple-700 dark:text-purple-400">Besoins : </span>
          <span>{cible.besoins}</span>
        </div>
      )}
      {cible.frustrations && (
        <div>
          <span className="font-medium text-purple-700 dark:text-purple-400">Frustrations : </span>
          <span>{cible.frustrations}</span>
        </div>
      )}
    </div>
  );
};

interface EbookEditorialDirectorProps {
  onAnalysisComplete?: (analysis: EditorialAnalysis) => void;
  /** Permet de synchroniser le module avec le titre global du planner */
  subject?: string;
  onSubjectChange?: (next: string) => void;
}

export const EbookEditorialDirector = ({
  onAnalysisComplete,
  subject,
  onSubjectChange,
}: EbookEditorialDirectorProps) => {
  const [localSujet, setLocalSujet] = useState("");
  const sujet = subject ?? localSujet;
  const setSujet = onSubjectChange ?? setLocalSujet;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EditorialAnalysis | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getTitleText = (item: TitleSuggestion | string): string => {
    return typeof item === 'string' ? item : item.titre;
  };

  const copyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    toast.success("Titre copié !");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const useTitle = (title: string) => {
    setSujet(title);
    toast.success("Titre appliqué ! Relancez l'analyse pour affiner.");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

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
              {renderCibleIdeale(analysis.cibleIdeale)}
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

          {analysis.suggestionsTitle && analysis.suggestionsTitle.length > 0 && (
            <Card className="md:col-span-2 border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-700 dark:text-yellow-400">
                  <PenLine className="h-5 w-5" />
                  Suggestions de Titres Alternatifs
                  <Badge variant="outline" className="ml-auto text-xs">
                    Score KDP Amazon
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score du titre original */}
                {analysis.titreOriginalScore && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Votre titre actuel</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.titreOriginalScore.scoreKdp)}`}>
                        {analysis.titreOriginalScore.scoreKdp}/100
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full transition-all ${getProgressColor(analysis.titreOriginalScore.scoreKdp)}`}
                        style={{ width: `${analysis.titreOriginalScore.scoreKdp}%` }}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                        <span className="font-medium text-green-700 dark:text-green-400">✓ Forces : </span>
                        <span className="text-muted-foreground">{analysis.titreOriginalScore.forces}</span>
                      </div>
                      <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                        <span className="font-medium text-red-700 dark:text-red-400">✗ À améliorer : </span>
                        <span className="text-muted-foreground">{analysis.titreOriginalScore.faiblesses}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des suggestions avec scores */}
                <div className="space-y-2">
                  {analysis.suggestionsTitle.map((item, index) => {
                    const isString = typeof item === 'string';
                    const title = isString ? item : item.titre;
                    const sousTitre = isString ? null : item.sousTitre;
                    const fullTitle = sousTitre ? `${title} : ${sousTitre}` : title;
                    const score = isString ? null : item.scoreKdp;
                    const raison = isString ? null : item.raison;
                    const isBest = analysis.meilleurTitre?.index === index;

                    return (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-all ${
                          isBest 
                            ? 'bg-green-500/10 border-green-500/40 ring-2 ring-green-500/20' 
                            : 'bg-background/50 border-yellow-500/20 hover:border-yellow-500/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start gap-2">
                              {isBest && (
                                <Trophy className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className={`text-sm font-bold ${isBest ? 'text-green-700 dark:text-green-400' : ''}`}>
                                  {title}
                                </span>
                                {sousTitre && (
                                  <p className="text-xs text-muted-foreground">
                                    : {sousTitre}
                                  </p>
                                )}
                              </div>
                            </div>
                            {raison && (
                              <p className="text-xs text-muted-foreground pl-6 italic">{raison}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {score !== null && (
                              <div className="flex items-center gap-1 min-w-[60px]">
                                <TrendingUp className={`h-3 w-3 ${getScoreColor(score)}`} />
                                <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                                  {score}
                                </span>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyTitle(fullTitle, index)}
                              className="h-8 w-8 p-0"
                              title="Copier titre complet"
                            >
                              {copiedIndex === index ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant={isBest ? "default" : "outline"}
                              size="sm"
                              onClick={() => useTitle(fullTitle)}
                              className="h-8 text-xs"
                            >
                              {isBest ? "🏆 Utiliser" : "Utiliser"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explication du meilleur titre */}
                {analysis.meilleurTitre && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-start gap-2">
                      <Trophy className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          Recommandation KDP
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.meilleurTitre.explication}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
