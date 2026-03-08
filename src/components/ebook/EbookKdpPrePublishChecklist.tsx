import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, Shield, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CheckItem {
  id: string;
  category: string;
  label: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  autoCheck?: (ctx: CheckContext) => boolean;
}

interface CheckContext {
  title: string;
  chapters: any[];
  authorName: string;
  description: string;
  keywords: string;
  coverUrl?: string;
}

interface CheckResult {
  id: string;
  passed: boolean;
  manual: boolean;
}

const CHECKLIST_ITEMS: CheckItem[] = [
  // MANUSCRIT
  { id: 'title-length', category: 'Manuscrit', label: 'Titre < 200 caractères', description: 'Amazon rejette les titres trop longs', severity: 'critical', autoCheck: (ctx) => ctx.title.length > 0 && ctx.title.length <= 200 },
  { id: 'title-no-promo', category: 'Manuscrit', label: 'Titre sans mention promotionnelle', description: 'Pas de "Gratuit", "Promo", "Best-seller" dans le titre', severity: 'critical', autoCheck: (ctx) => !/gratuit|promo|best.?seller|free|discount/i.test(ctx.title) },
  { id: 'chapters-exist', category: 'Manuscrit', label: 'Au moins 3 chapitres rédigés', description: 'Un ebook KDP doit avoir du contenu substantiel', severity: 'critical', autoCheck: (ctx) => ctx.chapters.filter(c => c.content && c.content.length > 100).length >= 3 },
  { id: 'word-count', category: 'Manuscrit', label: 'Minimum 5 000 mots au total', description: 'En dessous, risque de rejet ou mauvais classement', severity: 'warning', autoCheck: (ctx) => { const total = ctx.chapters.reduce((sum: number, c: any) => sum + (c.content?.split(/\s+/).length || 0), 0); return total >= 5000; } },
  { id: 'no-empty-chapters', category: 'Manuscrit', label: 'Aucun chapitre vide', description: 'Tous les chapitres doivent avoir du contenu', severity: 'critical', autoCheck: (ctx) => ctx.chapters.every((c: any) => c.content && c.content.trim().length > 50) },
  { id: 'author-name', category: 'Manuscrit', label: 'Nom d\'auteur défini', description: 'Obligatoire pour la publication KDP', severity: 'critical', autoCheck: (ctx) => ctx.authorName.trim().length >= 2 },
  
  // FORMAT
  { id: 'no-emoji', category: 'Format', label: 'Pas d\'émojis dans le texte', description: 'Les émojis causent des erreurs de rendu Kindle', severity: 'warning', autoCheck: (ctx) => !ctx.chapters.some((c: any) => /[\u{1F600}-\u{1F9FF}]/u.test(c.content || '')) },
  { id: 'no-color-text', category: 'Format', label: 'Texte sans couleur spéciale', description: 'Le Kindle noir & blanc ne rend pas les couleurs', severity: 'info' },
  { id: 'font-size-ok', category: 'Format', label: 'Taille de police 11-14pt', description: 'Standard KDP pour la lisibilité', severity: 'info' },
  { id: 'margins-ok', category: 'Format', label: 'Marges conformes (0.25" min)', description: 'Amazon requiert des marges minimales', severity: 'critical' },
  { id: 'page-size', category: 'Format', label: 'Format 6x9 pouces validé', description: 'Le format le plus populaire sur KDP', severity: 'info' },
  
  // MÉTADONNÉES
  { id: 'description-exists', category: 'Métadonnées', label: 'Description KDP rédigée', description: 'Indispensable pour le référencement Amazon', severity: 'critical', autoCheck: (ctx) => ctx.description.trim().length >= 100 },
  { id: 'description-length', category: 'Métadonnées', label: 'Description < 4 000 caractères', description: 'Limite Amazon stricte', severity: 'critical', autoCheck: (ctx) => ctx.description.length <= 4000 },
  { id: 'keywords-7', category: 'Métadonnées', label: '7 mots-clés backend définis', description: 'Chaque champ ≤ 50 caractères, sans marque', severity: 'warning', autoCheck: (ctx) => { const kws = ctx.keywords.split(',').filter(k => k.trim()); return kws.length >= 5; } },
  { id: 'keywords-no-brand', category: 'Métadonnées', label: 'Mots-clés sans termes interdits', description: 'Pas de "kindle", "ebook", "amazon", noms de marque', severity: 'critical', autoCheck: (ctx) => !/kindle|ebook|amazon|audible/i.test(ctx.keywords) },
  { id: 'categories-2', category: 'Métadonnées', label: '2 catégories BISAC sélectionnées', description: 'Maximise la visibilité sur Amazon', severity: 'warning' },
  { id: 'description-html', category: 'Métadonnées', label: 'HTML autorisé uniquement (b, i, br, h2)', description: 'Amazon rejette les balises non autorisées', severity: 'warning', autoCheck: (ctx) => !/<(?!\/?(b|i|br|h[1-6]|p|ul|ol|li)\b)[^>]+>/i.test(ctx.description) },
  
  // COUVERTURE
  { id: 'cover-exists', category: 'Couverture', label: 'Couverture créée', description: 'Obligatoire pour toute publication KDP', severity: 'critical', autoCheck: (ctx) => !!ctx.coverUrl },
  { id: 'cover-resolution', category: 'Couverture', label: 'Résolution 2560x1600 px min', description: 'DPI minimum 300 pour impression', severity: 'critical' },
  { id: 'cover-ratio', category: 'Couverture', label: 'Ratio 1.6:1 (hauteur/largeur)', description: 'Standard Amazon pour les ebooks', severity: 'warning' },
  { id: 'cover-no-price', category: 'Couverture', label: 'Pas de prix sur la couverture', description: 'Amazon interdit l\'affichage du prix', severity: 'critical' },
  { id: 'cover-no-review', category: 'Couverture', label: 'Pas de faux avis sur la couverture', description: 'Interdit par les conditions KDP', severity: 'critical' },
  
  // LÉGAL
  { id: 'copyright-page', category: 'Légal', label: 'Page de copyright incluse', description: 'Protège vos droits d\'auteur', severity: 'warning' },
  { id: 'isbn-optional', category: 'Légal', label: 'ISBN (optionnel pour ebook)', description: 'Amazon fournit un ASIN gratuit', severity: 'info' },
  { id: 'no-plagiarism', category: 'Légal', label: 'Contenu original vérifié', description: 'Le plagiat entraîne la suspension du compte', severity: 'critical' },
];

interface EbookKdpPrePublishChecklistProps {
  ebookTitle?: string;
  chapters?: any[];
  authorName?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
}

export const EbookKdpPrePublishChecklist: React.FC<EbookKdpPrePublishChecklistProps> = ({
  ebookTitle = '',
  chapters = [],
  authorName = '',
  kdpDescription = '',
  kdpKeywords = '',
}) => {
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  
  const ctx: CheckContext = {
    title: ebookTitle,
    chapters,
    authorName,
    description: kdpDescription,
    keywords: kdpKeywords,
  };

  const runAutoChecks = () => {
    const newResults: Record<string, CheckResult> = { ...results };
    CHECKLIST_ITEMS.forEach(item => {
      if (item.autoCheck) {
        newResults[item.id] = { id: item.id, passed: item.autoCheck(ctx), manual: false };
      }
    });
    setResults(newResults);
    toast.success('Vérification automatique terminée');
  };

  const toggleManual = (id: string) => {
    setResults(prev => ({
      ...prev,
      [id]: { id, passed: !prev[id]?.passed, manual: true }
    }));
  };

  useEffect(() => {
    // Auto-run on mount
    const saved = localStorage.getItem('kdp-checklist-results');
    if (saved) {
      try { setResults(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(results).length > 0) {
      localStorage.setItem('kdp-checklist-results', JSON.stringify(results));
    }
  }, [results]);

  const categories = [...new Set(CHECKLIST_ITEMS.map(i => i.category))];
  const totalItems = CHECKLIST_ITEMS.length;
  const passedItems = CHECKLIST_ITEMS.filter(i => results[i.id]?.passed).length;
  const score = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;
  const criticalFails = CHECKLIST_ITEMS.filter(i => i.severity === 'critical' && results[i.id] && !results[i.id].passed);

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = () => {
    if (score >= 95) return { label: '✅ PRÊT À PUBLIER', variant: 'default' as const };
    if (score >= 80) return { label: '⚠️ PRESQUE PRÊT', variant: 'secondary' as const };
    return { label: '❌ NON PRÊT', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-7 w-7 text-primary" />
                Checklist Pré-Publication KDP
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {totalItems} points de contrôle — Vérifiez tout avant de publier sur Amazon
              </p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-black ${getScoreColor()}`}>{score}%</div>
              <Badge variant={getScoreBadge().variant}>{getScoreBadge().label}</Badge>
            </div>
          </div>
          <Progress value={score} className="mt-4 h-3" />
          <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> {passedItems} validés</span>
            <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-500" /> {totalItems - passedItems} restants</span>
            {criticalFails.length > 0 && (
              <span className="flex items-center gap-1 text-red-500 font-medium"><AlertTriangle className="h-4 w-4" /> {criticalFails.length} critiques</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={runAutoChecks} className="gap-2">
              <Sparkles className="h-4 w-4" /> Vérification Automatique
            </Button>
            <Button variant="outline" onClick={() => { setResults({}); localStorage.removeItem('kdp-checklist-results'); toast.info('Checklist réinitialisée'); }} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.map(cat => {
        const items = CHECKLIST_ITEMS.filter(i => i.category === cat);
        const catPassed = items.filter(i => results[i.id]?.passed).length;
        return (
          <Card key={cat}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cat}</CardTitle>
                <Badge variant={catPassed === items.length ? 'default' : 'secondary'}>
                  {catPassed}/{items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map(item => {
                const result = results[item.id];
                const isPassed = result?.passed;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleManual(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      isPassed
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40'
                        : result
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : result ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${isPassed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.label}
                        </span>
                        <Badge variant={item.severity === 'critical' ? 'destructive' : item.severity === 'warning' ? 'secondary' : 'outline'} className="text-[10px] px-1.5 py-0">
                          {item.severity === 'critical' ? '🔴 Critique' : item.severity === 'warning' ? '🟡 Important' : '🔵 Info'}
                        </Badge>
                        {item.autoCheck && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Auto</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
