import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Award, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EbookUltimateVerdict = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isJudging, setIsJudging] = useState(false);
  const [verdict, setVerdict] = useState<{
    publiable: boolean;
    niveauGlobal: 'debutant' | 'intermediaire' | 'expert';
    risques: string[];
    pointsForts: string[];
    recommandationFinale: string;
    scoresDetailles: {
      clarte: number;
      valeur: number;
      structure: number;
      style: number;
      originalite: number;
    };
    certificat: string;
  } | null>(null);

  const getVerdict = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre de votre ebook');
      return;
    }

    setIsJudging(true);
    try {
      const { data, error } = await supabase.functions.invoke('ultimate-verdict', {
        body: { 
          title: title.trim(),
          content: content.trim() || undefined
        }
      });

      if (error) throw error;

      setVerdict(data.verdict);
      toast.success('Verdict éditeur rendu !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'évaluation');
    } finally {
      setIsJudging(false);
    }
  };

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'expert': return 'text-green-400 bg-green-500/20';
      case 'intermediaire': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-orange-400 bg-orange-500/20';
    }
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className={score >= 8 ? 'text-green-400' : score >= 6 ? 'text-yellow-400' : 'text-red-400'}>
          {score}/10
        </span>
      </div>
      <div className="h-2 bg-background/50 rounded overflow-hidden">
        <div 
          className={`h-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
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
              <strong>🏆 Effet Psychologique :</strong> Confiance maximale. Sensation de validation professionnelle. 
              Verdict final d'un éditeur senior sur la publiabilité de votre contenu.
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
            <Label htmlFor="content">Contenu à évaluer (optionnel)</Label>
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
            <div className="space-y-4 mt-6">
              {/* Verdict Principal */}
              <div className={`p-6 rounded-lg border-2 ${
                verdict.publiable 
                  ? 'bg-green-500/10 border-green-500/50' 
                  : 'bg-yellow-500/10 border-yellow-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {verdict.publiable ? (
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">
                        {verdict.publiable ? 'PUBLIABLE' : 'À AMÉLIORER'}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getNiveauColor(verdict.niveauGlobal)}`}>
                        Niveau {verdict.niveauGlobal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scores Détaillés */}
              {verdict.scoresDetailles && (
                <div className="p-4 bg-background/50 rounded-lg border">
                  <Label className="text-purple-400 mb-3 block">Scores Détaillés</Label>
                  <div className="grid gap-3">
                    <ScoreBar label="Clarté" score={verdict.scoresDetailles.clarte} />
                    <ScoreBar label="Valeur" score={verdict.scoresDetailles.valeur} />
                    <ScoreBar label="Structure" score={verdict.scoresDetailles.structure} />
                    <ScoreBar label="Style" score={verdict.scoresDetailles.style} />
                    <ScoreBar label="Originalité" score={verdict.scoresDetailles.originalite} />
                  </div>
                </div>
              )}

              {/* Points Forts */}
              {verdict.pointsForts && verdict.pointsForts.length > 0 && (
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <Label className="text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Points Forts
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {verdict.pointsForts.map((p, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risques */}
              {verdict.risques && verdict.risques.length > 0 && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Label className="text-red-400 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Risques Identifiés
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {verdict.risques.map((r, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommandation Finale */}
              <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Label className="text-purple-400">Recommandation Finale</Label>
                <p className="mt-1 text-sm">{verdict.recommandationFinale}</p>
              </div>

              {/* Certificat */}
              {verdict.certificat && (
                <div className="p-4 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-lg border border-amber-500/30 text-center">
                  <Award className="h-8 w-8 mx-auto text-amber-400 mb-2" />
                  <p className="text-sm italic">{verdict.certificat}</p>
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
