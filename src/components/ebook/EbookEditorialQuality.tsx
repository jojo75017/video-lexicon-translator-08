import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertTriangle, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface QualityAnalysis {
  clarteGlobale: {
    score: number;
    commentaire: string;
  };
  coherenceInterne: {
    score: number;
    commentaire: string;
  };
  valeurPercue: {
    score: number;
    commentaire: string;
  };
  utiliteLecteur: {
    score: number;
    commentaire: string;
  };
  pointsForts: string[];
  ameliorations: string[];
  ajustementsPrioritaires: string[];
}

export const EbookEditorialQuality: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<QualityAnalysis | null>(null);
  const [hasAutoLoadedContent, setHasAutoLoadedContent] = useState(false);
  const { apiKey: userGeminiKey } = useOpenAIConfig();
  
  const { getStepResult, hasStepResult } = useWorkflowResults();

  // Auto-load content from workflow results (P4 = chapters, P1 = editorial director)
  useEffect(() => {
    if (hasAutoLoadedContent) return;
    
    // Get title from P1 (Editorial Director)
    const p1Result = getStepResult('P1');
    if (p1Result?.result?.titreOptimise || p1Result?.result?.titre) {
      setTitle(p1Result.result.titreOptimise || p1Result.result.titre || '');
    }
    
    // Get content from P4 (Writing) - chapters
    const p4Result = getStepResult('P4');
    if (p4Result?.result) {
      let fullContent = '';
      
      // If result has chapters array
      if (Array.isArray(p4Result.result.chapters)) {
        fullContent = p4Result.result.chapters.map((ch: any, i: number) => {
          const chapterTitle = ch.title || ch.titre || `Chapitre ${i + 1}`;
          const chapterContent = ch.content || ch.contenu || '';
          return `## ${chapterTitle}\n\n${chapterContent}`;
        }).join('\n\n---\n\n');
      } else if (typeof p4Result.result === 'string') {
        fullContent = p4Result.result;
      } else if (p4Result.displayContent) {
        fullContent = p4Result.displayContent;
      }
      
      if (fullContent.length > 100) {
        setContent(fullContent);
        setHasAutoLoadedContent(true);
        toast.success('Contenu du livre chargé automatiquement depuis le workflow');
      }
    }
  }, [getStepResult, hasAutoLoadedContent]);

  const handleAnalyze = async () => {
    if (!title.trim()) {
      toast.error('Veuillez entrer le titre du contenu');
      return;
    }
    
    if (!content.trim() || content.length < 100) {
      toast.error('Le contenu est trop court pour une analyse de qualité. Ajoutez au moins un chapitre complet.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('editorial-quality', {
        body: { userApiKey: userGeminiKey, 
          title,
          content: content
        }
      });

      if (error) throw error;
      
      setAnalysis(data);
      toast.success('Analyse de qualité éditoriale générée !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReloadFromWorkflow = () => {

    setHasAutoLoadedContent(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/10 border-green-500/20';
    if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-blue-500/20 border border-teal-500/30 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Prompt 6 — Cohérence & Qualité
              </h2>
              <p className="text-sm text-muted-foreground">Analyse comme un éditeur exigeant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <Card className="border-2 border-teal-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-teal-500" />
            Contenu à analyser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Titre du contenu</label>
            <Input 
              placeholder="Ex: Guide complet du marketing digital"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-teal-500/30 focus:border-teal-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Contenu à évaluer</label>
            {hasStepResult('P4') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReloadFromWorkflow}
                className="text-xs text-teal-600"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Recharger du workflow
              </Button>
            )}
          </div>
          <Textarea 
            placeholder="Le contenu du livre sera chargé automatiquement depuis le workflow complet..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] border-teal-500/30 focus:border-teal-500"
          />
          {content && (
            <p className="text-xs text-muted-foreground">
              {content.length.toLocaleString()} caractères chargés
            </p>
          )}

          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !title.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyser la Qualité Éditoriale
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Clarté', data: analysis.clarteGlobale },
              { label: 'Cohérence', data: analysis.coherenceInterne },
              { label: 'Valeur Perçue', data: analysis.valeurPercue },
              { label: 'Utilité Lecteur', data: analysis.utiliteLecteur },
            ].map((item) => (
              <Card key={item.label} className={`border-2 ${getScoreBg(item.data.score)}`}>
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(item.data.score)}`}>
                    {item.data.score}/10
                  </div>
                  <p className="text-sm font-medium mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.data.commentaire}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Points forts */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Ce qui fonctionne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.pointsForts.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Améliorations */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="w-5 h-5" />
                Ce qui doit être amélioré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.ameliorations.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Ajustements prioritaires */}
          <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-teal-600">
                <Sparkles className="w-5 h-5" />
                Ajustements Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {analysis.ajustementsPrioritaires.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-teal-500/20">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
