import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users, Frown, Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MarketInsight {
  element: string;
  impact: "élevé" | "moyen" | "faible";
}

interface MarketAnalysis {
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
  const [sujet, setSujet] = useState("");
  const [contexte, setContexte] = useState("");
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
        body: { sujet, contexte },
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

  const renderInsights = (insights: MarketInsight[], icon: React.ReactNode, title: string, colorClass: string) => (
    <Card className={`border-${colorClass}/30 bg-${colorClass}/5`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight, index) => (
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
  );

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6 text-emerald-500" />
            Analyse de Marché IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Consultant en édition numérique : identifiez les opportunités et évitez les pièges du marché
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sujet-market">Sujet à analyser *</Label>
            <Input
              id="sujet-market"
              placeholder="Ex: Guide pratique du développement personnel pour entrepreneurs"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contexte-market">Contexte additionnel (optionnel)</Label>
            <Textarea
              id="contexte-market"
              placeholder="Précisez le marché cible, la région, le format envisagé..."
              value={contexte}
              onChange={(e) => setContexte(e.target.value)}
              rows={3}
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
                {analysis.attentesLecteurs.map((insight, index) => (
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
                {analysis.frustrationsNonResolues.map((insight, index) => (
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

          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-700 dark:text-purple-400">
                <Lightbulb className="h-5 w-5" />
                Angles Sous-Exploités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.anglesSousExploites.map((insight, index) => (
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
                {analysis.erreursFrequentes.map((insight, index) => (
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
      )}
    </div>
  );
};
