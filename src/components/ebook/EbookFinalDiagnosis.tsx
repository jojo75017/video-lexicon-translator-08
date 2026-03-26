import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Award, CheckCircle2, AlertCircle, Target, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface Diagnosis {
  verdictGlobal: 'pret' | 'a_ameliorer';
  verdictMessage: string;
  scoreClarte: number;
  scoreValeurPercue: number;
  scoreMoyen: number;
  ameliorationsPrioritaires: {
    titre: string;
    description: string;
    impact: 'critique' | 'important' | 'recommande';
  }[];
  recommandationsFinales: string[];
  conclusionEditoriale: string;
}

export const EbookFinalDiagnosis: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  const handleDiagnose = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre du livre');
      return;
    }

    setIsLoading(true);
    setDiagnosis(null);

    try {
      const { data, error } = await supabase.functions.invoke('final-diagnosis', {
        body: { userApiKey: userGeminiKey, 
          title,
          author: author || 'Auteur'
        }
      });

      if (error) throw error;
      
      setDiagnosis(data);
      toast.success('Diagnostic final généré !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du diagnostic');
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

    switch (impact) {
      case 'critique': return 'bg-red-500/10 border-red-500/30 text-red-600';
      case 'important': return 'bg-orange-500/10 border-orange-500/30 text-orange-600';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-600';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'critique': return '🔴 Critique';
      case 'important': return '🟠 Important';
      default: return '🔵 Recommandé';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-fuchsia-500/20 border border-purple-500/30 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Prompt 8 — Diagnostic Final
              </h2>
              <p className="text-sm text-muted-foreground">Verdict éditorial complet avant publication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="border-2 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-500" />
            Informations du livre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Titre du livre *</label>
              <Input 
                placeholder="Ex: Maîtriser le marketing digital"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Nom de l'auteur</label>
              <Input 
                placeholder="Ex: Jean Dupont"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleDiagnose} 
            disabled={isLoading || !title.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Diagnostic en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Lancer le Diagnostic Final
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {diagnosis && (
        <div className="space-y-6 animate-fade-in">
          {/* Verdict Principal */}
          <Card className={`border-2 ${
            diagnosis.verdictGlobal === 'pret' 
              ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
              : 'border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/10'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  diagnosis.verdictGlobal === 'pret' 
                    ? 'bg-green-500' 
                    : 'bg-orange-500'
                }`}>
                  {diagnosis.verdictGlobal === 'pret' ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${
                    diagnosis.verdictGlobal === 'pret' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {diagnosis.verdictGlobal === 'pret' ? '✅ PRÊT À PUBLIER' : '⚠️ À AMÉLIORER'}
                  </h3>
                  <p className="text-muted-foreground mt-1">{diagnosis.verdictMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-purple-500/20 text-center p-4">
              <div className="text-3xl font-bold text-purple-500">{diagnosis.scoreClarte}/10</div>
              <p className="text-sm text-muted-foreground mt-1">Clarté</p>
            </Card>
            <Card className="border-fuchsia-500/20 text-center p-4">
              <div className="text-3xl font-bold text-fuchsia-500">{diagnosis.scoreValeurPercue}/10</div>
              <p className="text-sm text-muted-foreground mt-1">Valeur Perçue</p>
            </Card>
            <Card className="border-violet-500/20 text-center p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <div className="text-3xl font-bold text-violet-500">{diagnosis.scoreMoyen}/10</div>
              <p className="text-sm text-muted-foreground mt-1">Score Global</p>
            </Card>
          </div>

          {/* 3 Améliorations Prioritaires */}
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                3 Améliorations Prioritaires Avant Publication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnosis.ameliorationsPrioritaires.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 ${getImpactColor(item.impact)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white text-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.titre}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-background/50">
                          {getImpactLabel(item.impact)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Recommandations Finales</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {diagnosis.recommandationsFinales.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Conclusion */}
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Conclusion Éditoriale
              </h4>
              <p className="text-muted-foreground italic">{diagnosis.conclusionEditoriale}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
