import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Award, Loader2, CheckCircle2, AlertTriangle, Shield, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface Verdict {
  publiable: boolean;
  verdictEditorial: string;
  niveauGlobal: 'debutant' | 'intermediaire' | 'expert';
  risques: string[];
  pointsForts: string[];
  recommandationFinale: string;
  scoresDetailles: {
    coherence: number;
    valeur: number;
    credibilite: number;
  };
  certificat: string;
}

const EbookUltimateVerdict = () => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isJudging, setIsJudging] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const getVerdict = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsJudging(true);
    try {
      const { data, error } = await supabase.functions.invoke('ultimate-verdict', {
        body: { userApiKey: userGeminiKey, 
          title: title.trim(),
          content: content.trim() || undefined
        }
      });

      if (error) throw error;

      setVerdict(data.verdict);
      toast.success('Verdict éditorial rendu !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'évaluation');
    } finally {
      setIsJudging(false);
    }
  };

  const getNiveauLabel = (niveau: string) => {
    switch (niveau) {
      case 'expert': return 'Niveau Expert';
      case 'intermediaire': return 'Niveau Intermédiaire';
      default: return 'Niveau Débutant';
    }
  };

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'expert': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'intermediaire': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      default: return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    }
  };

  const ScoreIndicator = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
    <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border">
      <Icon className={`h-5 w-5 mb-2 ${score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-amber-400' : 'text-red-400'}`} />
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className={`text-2xl font-bold ${score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
        {score}/10
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <span className="text-purple-400 text-sm font-mono">P14</span>
              <h2 className="text-xl">Verdict Éditeur Ultime</h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>🏆 Fiabilité Éditoriale :</strong> Verdict final d'un éditeur senior. 
              Structure, cohérence, valeur et crédibilité évaluées pour publication.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'ebook</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Maîtriser le Marketing Digital en 2024"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu à évaluer (optionnel - pour un verdict plus précis)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez le contenu final à évaluer..."
              className="min-h-[150px] bg-background/50"
            />
          </div>

          <Button 
            onClick={getVerdict} 
            disabled={isJudging || !title.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isJudging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Évaluation en cours...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Obtenir le Verdict Final
              </>
            )}
          </Button>

          {verdict && (
            <div className="space-y-6 mt-8">
              {/* VERDICT ÉDITORIAL PRINCIPAL */}
              <div className={`p-8 rounded-xl border-2 text-center ${
                verdict.publiable 
                  ? 'bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/50' 
                  : 'bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/50'
              }`}>
                <div className="flex justify-center mb-4">
                  {verdict.publiable ? (
                    <div className="p-4 rounded-full bg-emerald-500/20">
                      <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-full bg-amber-500/20">
                      <AlertTriangle className="h-12 w-12 text-amber-400" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-muted-foreground mb-2">VERDICT ÉDITORIAL</h3>
                
                <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                  {verdict.verdictEditorial}
                </p>

                <div className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium border ${getNiveauColor(verdict.niveauGlobal)}`}>
                  {getNiveauLabel(verdict.niveauGlobal)}
                </div>
              </div>

              {/* Scores de Fiabilité */}
              <div className="grid grid-cols-3 gap-4">
                <ScoreIndicator label="Cohérence" score={verdict.scoresDetailles.coherence} icon={BookOpen} />
                <ScoreIndicator label="Valeur" score={verdict.scoresDetailles.valeur} icon={Sparkles} />
                <ScoreIndicator label="Crédibilité" score={verdict.scoresDetailles.credibilite} icon={Shield} />
              </div>

              {/* Points Forts */}
              {verdict.pointsForts && verdict.pointsForts.length > 0 && (
                <div className="p-5 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <Label className="text-emerald-400 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4" />
                    Points Forts Identifiés
                  </Label>
                  <ul className="space-y-2">
                    {verdict.pointsForts.map((p, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risques / Ajustements */}
              {verdict.risques && verdict.risques.length > 0 && (
                <div className="p-5 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <Label className="text-amber-400 flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    Ajustements Recommandés
                  </Label>
                  <ul className="space-y-2">
                    {verdict.risques.map((r, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">→</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommandation Finale */}
              <div className="p-5 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Label className="text-purple-400 mb-2 block">Recommandation Finale</Label>
                <p className="text-sm leading-relaxed">{verdict.recommandationFinale}</p>
              </div>

              {/* Certificat de Validation */}
              {verdict.certificat && (
                <div className="p-6 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl border border-amber-500/30 text-center">
                  <Award className="h-10 w-10 mx-auto text-amber-400 mb-3" />
                  <p className="text-sm italic text-muted-foreground max-w-xl mx-auto">
                    {verdict.certificat}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookUltimateVerdict;
