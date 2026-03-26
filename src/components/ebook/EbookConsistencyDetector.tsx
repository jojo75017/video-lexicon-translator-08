import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, AlertTriangle, CheckCircle2, Users, MapPin, RefreshCw } from 'lucide-react';
import { Chapter } from '@/hooks/useSubscriptionGeneration';

interface ConsistencyIssue {
  type: 'name-variant' | 'missing-reference' | 'frequency-drop';
  entity: string;
  variant?: string;
  chapters: string[];
  severity: 'warning' | 'error' | 'info';
  message: string;
}

interface EbookConsistencyDetectorProps {
  chapters: Chapter[];
  characters?: Array<{ name: string }>;
}

// Common French name patterns to detect variants
function extractEntities(text: string): { names: string[]; places: string[] } {
  const names: string[] = [];
  const places: string[] = [];

  // Capitalized words that appear multiple times (likely proper nouns)
  const capitalizedWords = text.match(/\b[A-ZÀ-ÖÙ-Ü][a-zà-öù-ü]{2,}\b/g) || [];
  const wordCounts = new Map<string, number>();
  capitalizedWords.forEach(w => {
    // Skip common French words
    const skip = ['Dans', 'Pour', 'Avec', 'Cette', 'Mais', 'Plus', 'Tout', 'Elle', 'Leur', 'Nous', 'Vous', 'Très', 'Aussi', 'Bien', 'Encore', 'Donc', 'Puis', 'Après', 'Avant', 'Sans', 'Sous', 'Comme', 'Entre', 'Vers', 'Depuis', 'Pendant', 'Selon', 'Contre', 'Chez', 'Chapitre', 'Introduction', 'Conclusion'];
    if (!skip.includes(w)) {
      wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }
  });

  wordCounts.forEach((count, word) => {
    if (count >= 2) {
      names.push(word);
    }
  });

  return { names, places };
}

function findVariants(name: string, allText: string): string[] {
  const variants: string[] = [];
  const lowerName = name.toLowerCase();
  
  // Check for common typo patterns
  const patterns = [
    // Missing accent
    name.replace(/é/g, 'e'),
    name.replace(/è/g, 'e'),
    name.replace(/ê/g, 'e'),
    name.replace(/à/g, 'a'),
    name.replace(/ô/g, 'o'),
    // Double letter variants
    name.replace(/([a-z])\1/g, '$1'),
    name.replace(/([a-z])(?!\1)/g, (m, c) => c + c).slice(0, name.length + 2),
  ];

  patterns.forEach(variant => {
    if (variant !== name && variant.length > 2) {
      const regex = new RegExp(`\\b${variant}\\b`, 'gi');
      if (regex.test(allText)) {
        variants.push(variant);
      }
    }
  });

  return [...new Set(variants)];
}

function analyzeConsistency(chapters: Chapter[], knownCharacters: string[]): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  
  // Build full text and per-chapter text
  const chapterTexts = chapters.map(ch => {
    const subContent = ch.subChapters.map(sc => sc.content || '').join(' ');
    return { title: ch.title, text: (ch.content || '') + ' ' + subContent };
  });
  
  const fullText = chapterTexts.map(ct => ct.text).join(' ');

  // Extract entities from full text
  const { names } = extractEntities(fullText);
  const allEntities = [...new Set([...names, ...knownCharacters])];

  // Check each entity
  allEntities.forEach(entity => {
    if (entity.length < 3) return;

    // Find chapters where entity appears
    const presentIn = chapterTexts
      .filter(ct => new RegExp(`\\b${entity}\\b`, 'gi').test(ct.text))
      .map(ct => ct.title);

    // Check for variants (typos)
    const variants = findVariants(entity, fullText);
    variants.forEach(variant => {
      const variantChapters = chapterTexts
        .filter(ct => new RegExp(`\\b${variant}\\b`, 'gi').test(ct.text))
        .map(ct => ct.title);

      if (variantChapters.length > 0) {
        issues.push({
          type: 'name-variant',
          entity,
          variant,
          chapters: variantChapters,
          severity: 'warning',
          message: `"${entity}" apparaît aussi comme "${variant}" dans ${variantChapters.length} chapitre(s)`,
        });
      }
    });

    // Check frequency drops (entity appears in first half but not second half)
    if (presentIn.length >= 2 && chapters.length >= 4) {
      const midpoint = Math.floor(chapters.length / 2);
      const firstHalf = chapterTexts.slice(0, midpoint);
      const secondHalf = chapterTexts.slice(midpoint);
      
      const inFirst = firstHalf.some(ct => new RegExp(`\\b${entity}\\b`, 'gi').test(ct.text));
      const inSecond = secondHalf.some(ct => new RegExp(`\\b${entity}\\b`, 'gi').test(ct.text));

      if (inFirst && !inSecond && presentIn.length >= 3) {
        issues.push({
          type: 'frequency-drop',
          entity,
          chapters: presentIn,
          severity: 'info',
          message: `"${entity}" disparaît dans la seconde moitié du manuscrit`,
        });
      }
    }
  });

  return issues;
}

export const EbookConsistencyDetector: React.FC<EbookConsistencyDetectorProps> = ({
  chapters,
  characters = [],
}) => {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const knownNames = characters.map(c => c.name).filter(Boolean);

  const issues = useMemo(() => {
    if (!hasAnalyzed) return [];
    return analyzeConsistency(chapters, knownNames);
  }, [chapters, knownNames, hasAnalyzed]);

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;
  const score = Math.max(0, 100 - errorCount * 15 - warningCount * 5 - infoCount * 2);

  const totalWords = chapters.reduce((acc, ch) => {
    const sub = ch.subChapters.reduce((s, sc) => s + (sc.content?.split(/\s+/).filter(Boolean).length || 0), 0);
    return acc + (ch.content?.split(/\s+/).filter(Boolean).length || 0) + sub;
  }, 0);

  const severityConfig = {
    error: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Erreur' },
    warning: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertTriangle, label: 'Attention' },
    info: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Search, label: 'Info' },
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            Détecteur de Cohérence
            <Badge className="bg-primary/10 text-primary border-primary/30">Noms & Lieux</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Analyse les noms de personnages et lieux pour détecter les incohérences, variantes orthographiques
            et disparitions dans le manuscrit.
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Chapitres :</span>{' '}
              <strong>{chapters.length}</strong>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Mots :</span>{' '}
              <strong>{totalWords.toLocaleString()}</strong>
            </div>
          </div>

          <Button onClick={() => setHasAnalyzed(true)} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            {hasAnalyzed ? 'Relancer l\'analyse' : 'Analyser la cohérence'}
          </Button>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <>
          {/* Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Score de cohérence</span>
                <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {score}/100
                </span>
              </div>
              <Progress value={score} className="h-2" />
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                {errorCount > 0 && <span className="text-red-500">⚠ {errorCount} erreur(s)</span>}
                {warningCount > 0 && <span className="text-amber-500">⚡ {warningCount} attention</span>}
                {infoCount > 0 && <span className="text-blue-500">ℹ {infoCount} info(s)</span>}
                {issues.length === 0 && (
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Aucune incohérence détectée
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Issues list */}
          {issues.length > 0 && (
            <div className="space-y-2">
              {issues.map((issue, i) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                return (
                  <Card key={i} className={`${config.bg} border-0`}>
                    <CardContent className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{issue.message}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {issue.chapters.slice(0, 3).map((ch, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {ch}
                              </Badge>
                            ))}
                            {issue.chapters.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{issue.chapters.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${config.color}`}>
                          {config.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EbookConsistencyDetector;
