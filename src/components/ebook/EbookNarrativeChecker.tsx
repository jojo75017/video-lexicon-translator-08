import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle2, Users, MapPin, Clock, Sparkles, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface Character {
  id: string;
  name: string;
  description: string;
}

interface NarrativeIssue {
  type: 'character' | 'location' | 'timeline' | 'object' | 'plot';
  severity: 'warning' | 'error';
  chapter: string;
  description: string;
  suggestion: string;
}

interface NarrativeAnalysis {
  issues: NarrativeIssue[];
  characters_mentioned: { name: string; chapters: string[] }[];
  locations_mentioned: { name: string; chapters: string[] }[];
  timeline_events: { event: string; chapter: string }[];
  overall_score: number;
}

interface EbookNarrativeCheckerProps {
  chapters: Chapter[];
  characters: Character[];
  preface: string;
  conclusion: string;
  title: string;
}

const EbookNarrativeChecker: React.FC<EbookNarrativeCheckerProps> = ({
  chapters,
  characters,
  preface,
  conclusion,
  title
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NarrativeAnalysis | null>(null);

  const analyzeNarrative = async () => {
    setIsAnalyzing(true);
    
    try {
      // Préparer le contenu pour l'analyse
      const content = {
        title,
        preface,
        conclusion,
        characters: characters.map(c => ({ name: c.name, description: c.description })),
        chapters: chapters.map(ch => ({
          title: ch.title,
          content: ch.subChapters?.map(sc => `${sc.title}: ${sc.content}`).join('\n\n') || ''
        }))
      };

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'narrative-analysis',
          content: JSON.stringify(content)
        }
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast.success('Analyse de cohérence terminée');
      }
    } catch (error) {
      console.error('Erreur analyse narrative:', error);
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'error' ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <Users className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'timeline': return <Clock className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'character': return 'Personnage';
      case 'location': return 'Lieu';
      case 'timeline': return 'Chronologie';
      case 'object': return 'Objet';
      case 'plot': return 'Intrigue';
      default: return type;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Vérificateur de Cohérence Narrative
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Analyse votre ebook pour détecter les incohérences de personnages, lieux, chronologie et intrigue.
        </p>

        <Button
          onClick={analyzeNarrative}
          disabled={isAnalyzing || chapters.length === 0}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Analyser la cohérence
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-4 mt-4">
            {/* Score global */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Score de cohérence</span>
              <div className="flex items-center gap-2">
                {analysis.overall_score >= 80 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span className={`text-lg font-bold ${
                  analysis.overall_score >= 80 ? 'text-green-500' : 
                  analysis.overall_score >= 60 ? 'text-yellow-500' : 'text-destructive'
                }`}>
                  {analysis.overall_score}/100
                </span>
              </div>
            </div>

            {/* Problèmes détectés */}
            {analysis.issues.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Problèmes détectés ({analysis.issues.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeIcon(issue.type)}
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(issue.type)}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                          {issue.severity === 'error' ? 'Erreur' : 'Attention'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{issue.chapter}</span>
                      </div>
                      <p className="text-sm">{issue.description}</p>
                      <p className="text-xs text-primary italic">💡 {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">Aucune incohérence majeure détectée</span>
              </div>
            )}

            {/* Personnages mentionnés */}
            {analysis.characters_mentioned.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Personnages mentionnés ({analysis.characters_mentioned.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.characters_mentioned.map((char, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {char.name} ({char.chapters.length} ch.)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Lieux mentionnés */}
            {analysis.locations_mentioned.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Lieux mentionnés ({analysis.locations_mentioned.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.locations_mentioned.map((loc, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {loc.name} ({loc.chapters.length} ch.)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {analysis.timeline_events.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Chronologie ({analysis.timeline_events.length} événements)
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
                  {analysis.timeline_events.map((event, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground shrink-0">{event.chapter}:</span>
                      <span>{event.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EbookNarrativeChecker;
