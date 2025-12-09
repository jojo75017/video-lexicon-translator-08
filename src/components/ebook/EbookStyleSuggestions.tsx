import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, Sparkles, AlertTriangle, CheckCircle, 
  RefreshCw, Loader2, Eye, EyeOff, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StyleSuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'tip' | 'success';
  category: string;
  original?: string;
  suggestion: string;
  explanation?: string;
  priority: 'high' | 'medium' | 'low';
}

interface EbookStyleSuggestionsProps {
  content: string;
  onApplySuggestion?: (original: string, replacement: string) => void;
  autoAnalyze?: boolean;
}

export const EbookStyleSuggestions: React.FC<EbookStyleSuggestionsProps> = ({
  content,
  onApplySuggestion,
  autoAnalyze = true
}) => {
  const [suggestions, setSuggestions] = useState<StyleSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    avgSentenceLength: 0,
    readabilityScore: 0
  });

  // Analyze content locally first for basic stats
  const analyzeBasicStats = useCallback((text: string) => {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
    
    // Simple readability score (Flesch-like approximation)
    const syllables = words.reduce((count, word) => {
      return count + (word.match(/[aeiouyàâäéèêëïîôùûü]/gi) || []).length;
    }, 0);
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - 1.015 * avgSentenceLength - 84.6 * (syllables / Math.max(1, words.length))
    ));

    setStats({
      words: words.length,
      sentences: sentences.length,
      avgSentenceLength,
      readabilityScore: Math.round(readabilityScore)
    });

    return { words, sentences, avgSentenceLength };
  }, []);

  // Local analysis for quick feedback
  const analyzeLocally = useCallback((text: string): StyleSuggestion[] => {
    const localSuggestions: StyleSuggestion[] = [];
    const { avgSentenceLength } = analyzeBasicStats(text);

    // Check for very long sentences
    const longSentences = text.split(/[.!?]+/).filter(s => s.split(/\s+/).length > 40);
    if (longSentences.length > 0) {
      localSuggestions.push({
        id: 'long-sentences',
        type: 'warning',
        category: 'Lisibilité',
        suggestion: `${longSentences.length} phrase(s) trop longue(s) détectée(s). Essayez de les diviser.`,
        explanation: 'Les phrases de plus de 40 mots sont difficiles à lire.',
        priority: 'high'
      });
    }

    // Check for repetitive words
    const words = text.toLowerCase().match(/\b[a-zàâäéèêëïîôùûüç]{4,}\b/g) || [];
    const wordCount: Record<string, number> = {};
    words.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
    
    const repeatedWords = Object.entries(wordCount)
      .filter(([word, count]) => count > 5 && !['pour', 'dans', 'avec', 'plus', 'comme', 'cette', 'sont', 'était', 'être', 'avoir'].includes(word))
      .slice(0, 3);

    if (repeatedWords.length > 0) {
      localSuggestions.push({
        id: 'repetitions',
        type: 'improvement',
        category: 'Vocabulaire',
        suggestion: `Mots répétés: ${repeatedWords.map(([w, c]) => `"${w}" (${c}x)`).join(', ')}`,
        explanation: 'Variez votre vocabulaire pour enrichir le texte.',
        priority: 'medium'
      });
    }

    // Check for passive voice patterns (French)
    const passivePatterns = text.match(/\b(est|sont|était|étaient|sera|seront|a été|ont été)\s+\w+[éi]e?s?\b/gi) || [];
    if (passivePatterns.length > 3) {
      localSuggestions.push({
        id: 'passive-voice',
        type: 'tip',
        category: 'Style',
        suggestion: `${passivePatterns.length} formes passives détectées. Privilégiez la voix active.`,
        explanation: 'La voix active rend le texte plus dynamique.',
        priority: 'low'
      });
    }

    // Check for weak words
    const weakWords = ['très', 'vraiment', 'beaucoup', 'assez', 'plutôt', 'un peu'];
    const foundWeakWords = weakWords.filter(w => 
      new RegExp(`\\b${w}\\b`, 'gi').test(text)
    );
    if (foundWeakWords.length > 2) {
      localSuggestions.push({
        id: 'weak-words',
        type: 'improvement',
        category: 'Impact',
        suggestion: `Évitez les mots faibles: ${foundWeakWords.join(', ')}`,
        explanation: 'Remplacez par des termes plus précis et impactants.',
        priority: 'medium'
      });
    }

    // Positive feedback
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) {
      localSuggestions.push({
        id: 'good-length',
        type: 'success',
        category: 'Structure',
        suggestion: 'Longueur de phrases optimale !',
        explanation: 'Vos phrases ont une longueur idéale pour la lecture.',
        priority: 'low'
      });
    }

    return localSuggestions;
  }, [analyzeBasicStats]);

  // AI-powered analysis for deeper suggestions
  const analyzeWithAI = useCallback(async (text: string) => {
    if (text.length < 100) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'style-analysis',
          prompt: `Analyse ce texte et donne 3-5 suggestions de style concrètes (amélioration du style, vocabulaire, rythme, cohérence narrative). Format JSON array avec: original (texte à améliorer si applicable), suggestion, category, priority (high/medium/low).

Texte à analyser:
${text.substring(0, 2000)}`,
        }
      });

      if (error) throw error;

      if (data?.content) {
        try {
          const parsed = JSON.parse(data.content);
          if (Array.isArray(parsed)) {
            const aiSuggestions: StyleSuggestion[] = parsed.map((s: any, i: number) => ({
              id: `ai-${i}`,
              type: 'improvement' as const,
              category: s.category || 'Style',
              original: s.original,
              suggestion: s.suggestion,
              explanation: s.explanation,
              priority: s.priority || 'medium'
            }));
            setSuggestions(prev => [...prev.filter(s => !s.id.startsWith('ai-')), ...aiSuggestions]);
          }
        } catch {
          // AI response wasn't valid JSON, ignore
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Debounced analysis
  useEffect(() => {
    if (!autoAnalyze || !content || content.length < 50) return;
    if (content === lastAnalyzedContent) return;

    const timer = setTimeout(() => {
      const localSuggestions = analyzeLocally(content);
      setSuggestions(localSuggestions);
      setLastAnalyzedContent(content);

      // Trigger AI analysis for longer content
      if (content.length > 300 && Math.abs(content.length - lastAnalyzedContent.length) > 200) {
        analyzeWithAI(content);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, autoAnalyze, analyzeLocally, analyzeWithAI, lastAnalyzedContent]);

  const handleRefresh = () => {
    const localSuggestions = analyzeLocally(content);
    setSuggestions(localSuggestions);
    analyzeWithAI(content);
    toast.success('Analyse en cours...');
  };

  const getTypeIcon = (type: StyleSuggestion['type']) => {
    switch (type) {
      case 'improvement': return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: StyleSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 80) return { label: 'Très facile', color: 'text-green-500' };
    if (score >= 60) return { label: 'Facile', color: 'text-emerald-500' };
    if (score >= 40) return { label: 'Moyen', color: 'text-amber-500' };
    if (score >= 20) return { label: 'Difficile', color: 'text-orange-500' };
    return { label: 'Très difficile', color: 'text-red-500' };
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Eye className="h-4 w-4 mr-2" />
        Suggestions
      </Button>
    );
  }

  const readability = getReadabilityLabel(stats.readabilityScore);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Suggestions de style
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isAnalyzing || content.length < 50}
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-3 text-xs mt-2">
          <span className="text-muted-foreground">
            {stats.words} mots
          </span>
          <span className="text-muted-foreground">
            {stats.sentences} phrases
          </span>
          <span className="text-muted-foreground">
            ~{stats.avgSentenceLength} mots/phrase
          </span>
          <span className={readability.color}>
            {readability.label} ({stats.readabilityScore}%)
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {content.length < 50 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Écrivez au moins 50 caractères pour obtenir des suggestions.
          </p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {isAnalyzing ? 'Analyse en cours...' : 'Aucune suggestion pour le moment.'}
          </p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto pr-4 space-y-3">
            {suggestions
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {getTypeIcon(suggestion.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority === 'high' ? 'Important' : 
                           suggestion.priority === 'medium' ? 'Moyen' : 'Optionnel'}
                        </Badge>
                      </div>
                      
                      {suggestion.original && (
                        <p className="text-xs text-muted-foreground line-through mb-1">
                          "{suggestion.original}"
                        </p>
                      )}
                      
                      <p className="text-sm">{suggestion.suggestion}</p>
                      
                      {suggestion.explanation && (
                        <p className="text-xs text-muted-foreground mt-1">
                          💡 {suggestion.explanation}
                        </p>
                      )}

                      {suggestion.original && onApplySuggestion && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7 text-xs"
                          onClick={() => onApplySuggestion(suggestion.original!, suggestion.suggestion)}
                        >
                          Appliquer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
