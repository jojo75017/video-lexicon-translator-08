import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2, Lightbulb, AlertTriangle, Sparkles, CheckCircle2, ArrowRight,
  Search, TrendingUp, DollarSign, BarChart3, Target, Key
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface NicheAnalysis {
  scoreRentabilite: number;
  scoreDetails: {
    demande: number;
    concurrence: number;
    margeBeneficiaire: number;
    potentielCroissance: number;
  };
  niveauConcurrence: {
    niveau: string;
    nombreLivresEstime: string;
    saturation: string;
    difficulteDentree: string;
    analyse: string;
  };
  forces: Array<{ text: string }>;
  pointsAttention: Array<{ text: string }>;
  demarquer: Array<{ text: string }>;
  motsClesKdp: Array<{
    keyword: string;
    volumeEstime: string;
    difficulte: string;
    pertinence: number;
  }>;
  estimationRevenus: {
    prixRecommande: string;
    ventesEstimeesParMois: string;
    revenuMensuelEstime: string;
    potentielAnnuel: string;
    commentaire: string;
  };
}

const getScoreColor = (score: number) => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

const getVolumeBadge = (vol: string) => {
  if (vol === 'Élevé') return 'bg-green-500/15 text-green-600 border-green-500/30';
  if (vol === 'Moyen') return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
  return 'bg-muted text-muted-foreground border-border';
};

const getDiffBadge = (diff: string) => {
  if (diff === 'Faible') return 'bg-green-500/15 text-green-600 border-green-500/30';
  if (diff === 'Moyenne') return 'bg-amber-500/15 text-amber-600 border-amber-500/30';
  return 'bg-red-500/15 text-red-600 border-red-500/30';
};

const EbookNicheAnalysis: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NicheAnalysis | null>(null);

  const analyzeNiche = async () => {
    if (!niche.trim()) {
      toast.error('Veuillez entrer une niche à analyser');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-niche', {
        body: { userApiKey: userGeminiKey, niche: niche.trim() }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      toast.success('Analyse complète terminée !');
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || "Erreur lors de l'analyse de la niche");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Analyse de Niche Avancée</h2>
              <p className="text-sm text-muted-foreground font-normal mt-0.5">
                Score de rentabilité, concurrence, mots-clés KDP et estimation de revenus
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Investissement immobilier pour débutants"
              className="flex-1 bg-background/80"
              onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && analyzeNiche()}
            />
            <Button
              onClick={analyzeNiche}
              disabled={isAnalyzing || !niche.trim()}
              className="shrink-0"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Analyser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {analysis && (
        <div className="grid gap-6">

          {/* Score global + Détails */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Score de rentabilité */}
            <Card className="border-primary/20 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        strokeWidth="8"
                        strokeDasharray={`${(analysis.scoreRentabilite / 100) * 327} 327`}
                        strokeLinecap="round"
                        className={getScoreBg(analysis.scoreRentabilite)}
                        style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(analysis.scoreRentabilite)}`}>
                        {analysis.scoreRentabilite}%
                      </span>
                      <span className="text-xs text-muted-foreground">Rentabilité</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Score global de la niche</p>
                </div>
              </CardContent>
            </Card>

            {/* Détails du score */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Détails du Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Demande', value: analysis.scoreDetails.demande, icon: TrendingUp },
                  { label: 'Concurrence', value: analysis.scoreDetails.concurrence, icon: Target },
                  { label: 'Marge bénéficiaire', value: analysis.scoreDetails.margeBeneficiaire, icon: DollarSign },
                  { label: 'Potentiel croissance', value: analysis.scoreDetails.potentielCroissance, icon: Sparkles },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{item.label}</span>
                      </div>
                      <span className={`font-semibold ${getScoreColor(item.value)}`}>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Concurrence + Revenus */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Niveau de concurrence */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-amber-500" />
                  Niveau de Concurrence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Niveau</p>
                    <p className="font-semibold text-sm">{analysis.niveauConcurrence.niveau}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Livres existants</p>
                    <p className="font-semibold text-sm">{analysis.niveauConcurrence.nombreLivresEstime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Saturation</p>
                    <p className="font-semibold text-sm">{analysis.niveauConcurrence.saturation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Difficulté d'entrée</p>
                    <p className="font-semibold text-sm">{analysis.niveauConcurrence.difficulteDentree}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.niveauConcurrence.analyse}</p>
              </CardContent>
            </Card>

            {/* Estimation revenus */}
            <Card className="shadow-sm border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Estimation de Revenus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                    <p className="text-xs text-muted-foreground">Prix recommandé</p>
                    <p className="font-bold text-green-600 text-sm">{analysis.estimationRevenus.prixRecommande}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                    <p className="text-xs text-muted-foreground">Ventes / mois</p>
                    <p className="font-bold text-green-600 text-sm">{analysis.estimationRevenus.ventesEstimeesParMois}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                    <p className="text-xs text-muted-foreground">Revenu mensuel</p>
                    <p className="font-bold text-green-600 text-sm">{analysis.estimationRevenus.revenuMensuelEstime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
                    <p className="text-xs text-muted-foreground">Potentiel annuel</p>
                    <p className="font-bold text-green-600 text-sm">{analysis.estimationRevenus.potentielAnnuel}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.estimationRevenus.commentaire}</p>
              </CardContent>
            </Card>
          </div>

          {/* Mots-clés KDP */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-5 w-5 text-blue-500" />
                Mots-clés KDP Suggérés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.motsClesKdp.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-sm font-medium truncate">{kw.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-xs ${getVolumeBadge(kw.volumeEstime)}`}>
                        Vol: {kw.volumeEstime}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDiffBadge(kw.difficulte)}`}>
                        Diff: {kw.difficulte}
                      </Badge>
                      <span className={`text-xs font-semibold min-w-[32px] text-right ${getScoreColor(kw.pertinence)}`}>
                        {kw.pertinence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forces */}
          <Card className="border-green-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-green-500/15">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                </div>
                Forces de ton idée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.forces.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Points d'attention */}
          <Card className="border-amber-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-amber-500/15">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                Points d'attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.pointsAttention.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-500 font-bold text-sm mt-0.5 shrink-0">!</span>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comment se démarquer */}
          <Card className="border-blue-500/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2.5 text-lg">
                <div className="p-1.5 rounded-lg bg-blue-500/15">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                Comment te démarquer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.demarquer.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <ArrowRight className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EbookNicheAnalysis;
