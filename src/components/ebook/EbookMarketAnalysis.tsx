import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users, Frown, Lightbulb, AlertTriangle, Key, Tag, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface MarketInsight {
  element: string;
  impact: "élevé" | "moyen" | "faible";
}

interface MarketAnalysis {
  nichePrincipale?: string;
  tailleMarche?: string;
  concurrenceNiveau?: string;
  opportunite?: string;
  motsClésKDP?: string[];
  justificationMotsCles?: string[];
  categoriesKDP?: string[];
  categoriesSecondaires?: string[];
  prixOptimal?: string;
  potentielVentes?: string;
  attentesLecteurs: MarketInsight[];
  frustrationsNonResolues: MarketInsight[];
  anglesSousExploites: MarketInsight[];
  erreursFrequentes: MarketInsight[];
}

interface EbookMarketAnalysisProps {
  onAnalysisComplete?: (analysis: MarketAnalysis) => void;
}

const impactColors = {
  "élevé": "bg-red-500/20 text-red-600 border-red-500/50",
  "moyen": "bg-amber-500/20 text-amber-600 border-amber-500/50",
  "faible": "bg-green-500/20 text-green-600 border-green-500/50"
};

export const EbookMarketAnalysis = ({ onAnalysisComplete }: EbookMarketAnalysisProps) => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  const [sujet, setSujet] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);

  const analyzeMarket = async () => {
    if (!sujet.trim()) {
      toast.error("Veuillez entrer un sujet à analyser");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-analysis", {
        body: { 
          sujet, 
          contexte: `Analyse de marché complète et automatique pour un ebook sur "${sujet}". Identifier toutes les opportunités et les pièges à éviter.`
        },
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        onAnalysisComplete?.(data.analysis);
        toast.success("Analyse de marché terminée !");
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
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6 text-emerald-500" />
            Analyse de Marché IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Entrez juste le titre - l'analyse complète du marché est générée automatiquement
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sujet-market">Titre / Sujet à analyser *</Label>
            <Input
              id="sujet-market"
              placeholder="Ex: Guide pratique du développement personnel pour entrepreneurs"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="text-base"
              onKeyDown={(e) => e.key === 'Enter' && analyzeMarket()}
            />
          </div>

          <Button
            onClick={analyzeMarket}
            disabled={isAnalyzing || !sujet.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyser le marché
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Mots-clés KDP - Section prioritaire */}
          {analysis.motsClésKDP && analysis.motsClésKDP.length > 0 && (
            <Card className="border-primary/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-400">
                  <Key className="h-5 w-5" />
                  🔑 7 Mots-clés KDP Stratégiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analysis.motsClésKDP.map((keyword, index) => (
                    <Badge 
                      key={index}
                      className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 px-3 py-1.5 text-sm font-medium"
                    >
                      {index + 1}. {keyword}
                    </Badge>
                  ))}
                </div>
                {analysis.justificationMotsCles && analysis.justificationMotsCles.length > 0 && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">Voir les justifications</summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {analysis.justificationMotsCles.map((justif, i) => (
                        <li key={i} className="list-disc">{justif}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </CardContent>
            </Card>
          )}

          {/* Résumé marché */}
          {(analysis.nichePrincipale || analysis.prixOptimal) && (
            <div className="grid gap-4 md:grid-cols-3">
              {analysis.nichePrincipale && (
                <Card className="border-primary/20 bg-violet-500/5">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-violet-600" />
                      <span className="text-xs font-medium text-violet-600">Niche</span>
                    </div>
                    <p className="text-sm font-medium">{analysis.nichePrincipale}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Concurrence: {analysis.concurrenceNiveau || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              )}
              {analysis.prixOptimal && (
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-600">Prix optimal</span>
                    </div>
                    <p className="text-sm font-medium">{analysis.prixOptimal}</p>
                  </CardContent>
                </Card>
              )}
              {analysis.categoriesKDP && analysis.categoriesKDP.length > 0 && (
                <Card className="border-blue-500/30 bg-blue-500/5">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Catégories KDP</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.categoriesKDP.map((cat, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Analyse détaillée */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                  Attentes des Lecteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.attentesLecteurs?.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] shrink-0 ${impactColors[insight.impact]}`}
                      >
                        {insight.impact}
                      </Badge>
                      <p className="text-sm leading-relaxed">{insight.element}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
                  <Frown className="h-5 w-5" />
                  Frustrations Non Résolues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.frustrationsNonResolues?.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] shrink-0 ${impactColors[insight.impact]}`}
                      >
                        {insight.impact}
                      </Badge>
                      <p className="text-sm leading-relaxed">{insight.element}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-400">
                  <Lightbulb className="h-5 w-5" />
                  Angles Sous-Exploités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.anglesSousExploites?.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] shrink-0 ${impactColors[insight.impact]}`}
                      >
                        {insight.impact}
                      </Badge>
                      <p className="text-sm leading-relaxed">{insight.element}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  Erreurs des Concurrents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.erreursFrequentes?.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] shrink-0 ${impactColors[insight.impact]}`}
                      >
                        {insight.impact}
                      </Badge>
                      <p className="text-sm leading-relaxed">{insight.element}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
