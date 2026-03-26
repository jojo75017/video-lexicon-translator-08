import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Copy, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface RewriteResult {
  texteReecrit: string;
  modificationsApportees: string[];
  scoreNaturalite: number;
  suggestions: string[];
}

const EbookNaturalRewrite = () => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();

  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);

  const rewriteText = async () => {
    if (!text.trim()) {
      toast.error("Veuillez entrer un texte à réécrire");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('natural-rewrite', {
        body: { userApiKey: userGeminiKey, 
          text, 
          style: 'conversationnel',
          preserveStructure: true
        }
      });

      if (error) throw error;
      setResult(data);
      toast.success("Texte réécrit naturellement !");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erreur lors de la réécriture");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copié !");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très naturel';
    if (score >= 70) return 'Naturel';
    if (score >= 60) return 'Acceptable';
    return 'À améliorer';
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Réécriture Naturelle
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Collez votre texte - il sera automatiquement réécrit pour être fluide et sans trace IA
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-to-rewrite">Texte à réécrire *</Label>
            <Textarea
              id="text-to-rewrite"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le texte à transformer..."
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {text.length} caractères • {text.split(/\s+/).filter(w => w).length} mots
            </p>
          </div>

          <Button 
            onClick={rewriteText} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Réécriture en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Réécrire naturellement
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.scoreNaturalite > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Score de naturalité</span>
                  <span className={`font-bold ${getScoreColor(result.scoreNaturalite)}`}>
                    {result.scoreNaturalite}% - {getScoreLabel(result.scoreNaturalite)}
                  </span>
                </div>
                <Progress value={result.scoreNaturalite} className="h-2" />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Texte réécrit
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(result.texteReecrit)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap text-sm">
                {result.texteReecrit}
              </div>
            </CardContent>
          </Card>

          {result.modificationsApportees && result.modificationsApportees.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Modifications apportées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.modificationsApportees.map((mod, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Suggestions d'amélioration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EbookNaturalRewrite;
