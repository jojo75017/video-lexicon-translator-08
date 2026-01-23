import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Shield, 
  Zap, 
  BookOpen,
  MessageSquare,
  GraduationCap,
  Newspaper,
  Mic,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookHumanizerProps {
  initialContent?: string;
  onContentHumanized?: (content: string) => void;
}

const intensityOptions = [
  { value: 'light', label: 'Léger', description: 'Modifications subtiles, structure préservée', icon: Zap },
  { value: 'medium', label: 'Modéré', description: 'Réécriture significative, style amélioré', icon: RefreshCw },
  { value: 'strong', label: 'Intense', description: 'Transformation complète, anti-détection maximale', icon: Shield }
];

const styleOptions = [
  { value: 'natural', label: 'Naturel', icon: BookOpen },
  { value: 'conversational', label: 'Conversationnel', icon: MessageSquare },
  { value: 'academic', label: 'Académique', icon: GraduationCap },
  { value: 'journalistic', label: 'Journalistique', icon: Newspaper },
  { value: 'storytelling', label: 'Narratif', icon: Mic }
];

const EbookHumanizer: React.FC<EbookHumanizerProps> = ({ 
  initialContent = '', 
  onContentHumanized 
}) => {
  const [originalContent, setOriginalContent] = useState(initialContent);
  const [humanizedContent, setHumanizedContent] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [style, setStyle] = useState('natural');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    originalLength: number;
    humanizedLength: number;
    originalWords: number;
    humanizedWords: number;
    changePercentage: number;
  } | null>(null);

  const handleHumanize = async () => {
    if (!originalContent.trim() || originalContent.length < 50) {
      toast.error('Contenu trop court', {
        description: 'Veuillez entrer au moins 50 caractères à humaniser.'
      });
      return;
    }

    setIsProcessing(true);
    setHumanizedContent('');
    setStats(null);

    try {
      const { data, error } = await supabase.functions.invoke('humanize-content', {
        body: { 
          content: originalContent,
          intensity,
          style
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error('Erreur', { description: data.error });
        return;
      }

      setHumanizedContent(data.humanizedContent);
      setStats(data.stats);
      
      toast.success('Contenu humanisé !', {
        description: `${data.stats.changePercentage}% de modifications appliquées`
      });

      if (onContentHumanized) {
        onContentHumanized(data.humanizedContent);
      }

    } catch (err: any) {
      console.error('Humanization error:', err);
      toast.error('Erreur lors de l\'humanisation', {
        description: err.message || 'Veuillez réessayer'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(humanizedContent);
    setCopied(true);
    toast.success('Copié dans le presse-papiers');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToOriginal = () => {
    setOriginalContent(humanizedContent);
    setHumanizedContent('');
    setStats(null);
    toast.info('Contenu humanisé appliqué. Vous pouvez l\'humaniser à nouveau.');
  };

  return (
    <Card className="border-2 border-dashed border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Humaniseur IA
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                  2026
                </Badge>
              </CardTitle>
              <CardDescription>
                Transformez votre contenu IA en texte authentiquement humain
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avertissement */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Pourquoi humaniser ?</strong> Amazon et d'autres plateformes utilisent des détecteurs d'IA. 
            Un contenu trop "parfait" peut être signalé et impacter vos ventes ou votre compte.
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Intensité de l'humanisation</label>
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {intensityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        - {opt.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Style d'écriture cible</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contenu original */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Contenu original (IA)</label>
            <span className="text-xs text-muted-foreground">
              {originalContent.split(/\s+/).filter(Boolean).length} mots
            </span>
          </div>
          <Textarea
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
            placeholder="Collez ici le contenu généré par IA que vous souhaitez humaniser..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Bouton d'action */}
        <Button
          onClick={handleHumanize}
          disabled={isProcessing || originalContent.length < 50}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Humanisation en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Humaniser le contenu
            </>
          )}
        </Button>

        {/* Résultats */}
        {humanizedContent && (
          <div className="space-y-4 pt-4 border-t">
            {/* Statistiques */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Modifications</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
                      {stats.changePercentage}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm font-medium">Mots (avant)</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                      {stats.originalWords}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm font-medium">Mots (après)</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200 mt-1">
                      {stats.humanizedWords}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contenu humanisé */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Contenu humanisé
                </label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copié' : 'Copier'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleApplyToOriginal}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Réappliquer
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 min-h-[200px]">
                <p className="text-sm whitespace-pre-wrap">{humanizedContent}</p>
              </div>
            </div>

            {/* Score anti-détection */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score anti-détection estimé</span>
                <Badge className="bg-green-600">
                  {intensity === 'strong' ? '95%+' : intensity === 'medium' ? '85%+' : '75%+'}
                </Badge>
              </div>
              <Progress 
                value={intensity === 'strong' ? 95 : intensity === 'medium' ? 85 : 75} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Ce score est une estimation. Testez avec des outils comme Originality.ai ou GPTZero pour confirmation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EbookHumanizer;
