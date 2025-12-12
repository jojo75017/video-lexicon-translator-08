import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  BookOpen, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  FileText,
  Layers,
  Calculator,
  Zap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KdpRequirement {
  pages: number;
  minChapters: number;
  minWordsPerChapter: number;
  totalWords: number;
  status: 'danger' | 'warning' | 'ok' | 'ideal';
  kdpStatus: string;
  recommendation: string;
  category: string;
}

const EbookPriceEstimator: React.FC = () => {
  const [customPages, setCustomPages] = useState<number>(100);

  // Calcul dynamique des exigences basé sur le nombre de pages
  const calculateRequirements = useMemo(() => {
    const pages = customPages;
    
    // Formules de calcul
    let minChapters: number;
    let minWordsPerChapter: number;
    let status: 'danger' | 'warning' | 'ok' | 'ideal';
    let kdpStatus: string;
    let recommendation: string;
    let category: string;

    if (pages < 24) {
      minChapters = Math.max(2, Math.floor(pages / 8));
      minWordsPerChapter = 1000;
      status = 'danger';
      kdpStatus = 'REJETÉ';
      recommendation = 'En dessous du minimum KDP (24 pages). Votre ebook sera rejeté.';
      category = 'Non publiable';
    } else if (pages < 30) {
      minChapters = 3;
      minWordsPerChapter = 1500;
      status = 'danger';
      kdpStatus = 'RISQUE ÉLEVÉ';
      recommendation = 'Très court - fort risque de rejet pour "contenu insuffisant"';
      category = 'Non recommandé';
    } else if (pages < 50) {
      minChapters = 4;
      minWordsPerChapter = 1800;
      status = 'warning';
      kdpStatus = 'LIMITE';
      recommendation = 'Minimum absolu - ajoutez du contenu si possible';
      category = 'Minimum KDP';
    } else if (pages < 75) {
      minChapters = 5;
      minWordsPerChapter = 2000;
      status = 'ok';
      kdpStatus = 'ACCEPTÉ';
      recommendation = 'Acceptable pour guides courts et ebooks pratiques';
      category = 'Guide court';
    } else if (pages < 100) {
      minChapters = 6;
      minWordsPerChapter = 2500;
      status = 'ok';
      kdpStatus = 'ACCEPTÉ';
      recommendation = 'Bon format pour ebooks pratiques et tutoriels';
      category = 'Ebook standard';
    } else if (pages < 150) {
      minChapters = 8;
      minWordsPerChapter = 2500;
      status = 'ideal';
      kdpStatus = 'IDÉAL';
      recommendation = 'Format parfait pour la plupart des genres';
      category = 'Livre complet';
    } else if (pages < 200) {
      minChapters = 10;
      minWordsPerChapter = 3000;
      status = 'ideal';
      kdpStatus = 'IDÉAL';
      recommendation = 'Excellent pour romans et guides approfondis';
      category = 'Ouvrage approfondi';
    } else if (pages < 300) {
      minChapters = 12;
      minWordsPerChapter = 3500;
      status = 'ideal';
      kdpStatus = 'IDÉAL';
      recommendation = 'Parfait pour romans et manuels complets';
      category = 'Roman / Manuel';
    } else {
      minChapters = Math.min(20, Math.floor(pages / 20));
      minWordsPerChapter = 4000;
      status = 'ideal';
      kdpStatus = 'IDÉAL';
      recommendation = 'Format idéal pour sagas et encyclopédies';
      category = 'Ouvrage majeur';
    }

    const totalWords = pages * 250; // ~250 mots par page
    const pagesPerChapter = Math.ceil(pages / minChapters);
    const wordsPerChapter = pagesPerChapter * 250;

    return {
      pages,
      minChapters,
      minWordsPerChapter,
      totalWords,
      status,
      kdpStatus,
      recommendation,
      category,
      pagesPerChapter,
      wordsPerChapter
    };
  }, [customPages]);

  // Exigences de référence
  const requirements: KdpRequirement[] = [
    { pages: 20, minChapters: 3, minWordsPerChapter: 1500, totalWords: 5000, status: 'danger', kdpStatus: 'RISQUE ÉLEVÉ', recommendation: 'Trop court - risque de rejet', category: 'Non recommandé' },
    { pages: 30, minChapters: 4, minWordsPerChapter: 1800, totalWords: 7500, status: 'warning', kdpStatus: 'LIMITE', recommendation: 'Minimum absolu', category: 'Minimum KDP' },
    { pages: 50, minChapters: 5, minWordsPerChapter: 2000, totalWords: 12500, status: 'ok', kdpStatus: 'ACCEPTÉ', recommendation: 'Guides courts', category: 'Guide court' },
    { pages: 75, minChapters: 6, minWordsPerChapter: 2500, totalWords: 18750, status: 'ok', kdpStatus: 'ACCEPTÉ', recommendation: 'Ebooks pratiques', category: 'Ebook standard' },
    { pages: 100, minChapters: 8, minWordsPerChapter: 2500, totalWords: 25000, status: 'ideal', kdpStatus: 'IDÉAL', recommendation: 'Format parfait', category: 'Livre complet' },
    { pages: 150, minChapters: 10, minWordsPerChapter: 3000, totalWords: 37500, status: 'ideal', kdpStatus: 'IDÉAL', recommendation: 'Romans et guides', category: 'Ouvrage approfondi' },
    { pages: 200, minChapters: 12, minWordsPerChapter: 3500, totalWords: 50000, status: 'ideal', kdpStatus: 'IDÉAL', recommendation: 'Romans et manuels', category: 'Roman / Manuel' },
    { pages: 300, minChapters: 15, minWordsPerChapter: 4000, totalWords: 75000, status: 'ideal', kdpStatus: 'IDÉAL', recommendation: 'Sagas et encyclopédies', category: 'Ouvrage majeur' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'ok': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'ideal': return <CheckCircle2 className="h-5 w-5 text-primary" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string, kdpStatus: string) => {
    const variants: Record<string, string> = {
      danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      ok: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      ideal: 'bg-primary/10 text-primary'
    };
    return <Badge className={variants[status]}>{kdpStatus}</Badge>;
  };

  const getStatusCardClass = (status: string) => {
    switch (status) {
      case 'danger': return 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30';
      case 'warning': return 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30';
      case 'ok': return 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30';
      case 'ideal': return 'border-primary/50 bg-primary/10';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Exigences KDP - Chapitres & Pages</CardTitle>
                <CardDescription>
                  Calculez le nombre de chapitres et mots requis pour votre ebook
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calculateur interactif */}
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculateur Interactif
            </CardTitle>
            <CardDescription>
              Entrez votre nombre de pages cible pour voir les exigences KDP
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Input et Slider */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="pages" className="text-lg font-semibold min-w-[140px]">
                  Nombre de pages :
                </Label>
                <Input
                  id="pages"
                  type="number"
                  min={10}
                  max={500}
                  value={customPages}
                  onChange={(e) => setCustomPages(Math.max(10, Math.min(500, parseInt(e.target.value) || 10)))}
                  className="w-24 text-center text-lg font-bold"
                />
              </div>
              <Slider
                value={[customPages]}
                onValueChange={(value) => setCustomPages(value[0])}
                min={10}
                max={500}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 pages</span>
                <span>100 pages</span>
                <span>200 pages</span>
                <span>300 pages</span>
                <span>500 pages</span>
              </div>
            </div>

            {/* Résultat du calcul */}
            <div className={`p-6 rounded-xl border-2 transition-all ${getStatusCardClass(calculateRequirements.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(calculateRequirements.status)}
                  <span className="text-2xl font-bold">{calculateRequirements.pages} pages</span>
                </div>
                {getStatusBadge(calculateRequirements.status, calculateRequirements.kdpStatus)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-background/80 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{calculateRequirements.minChapters}</div>
                  <div className="text-xs text-muted-foreground">Chapitres minimum</div>
                </div>
                <div className="text-center p-3 bg-background/80 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{calculateRequirements.pagesPerChapter}</div>
                  <div className="text-xs text-muted-foreground">Pages/chapitre</div>
                </div>
                <div className="text-center p-3 bg-background/80 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{calculateRequirements.wordsPerChapter.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Mots/chapitre</div>
                </div>
                <div className="text-center p-3 bg-background/80 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{calculateRequirements.totalWords.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total mots</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-background/80 rounded-lg">
                <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{calculateRequirements.category}</div>
                  <div className="text-sm text-muted-foreground">{calculateRequirements.recommendation}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerte importante */}
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Règles KDP à respecter</h3>
                <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• <strong>Minimum 24 pages</strong> pour les ebooks Kindle</li>
                  <li>• <strong>Minimum 72 pages</strong> pour les livres brochés (print)</li>
                  <li>• Contenu original et de qualité requise</li>
                  <li>• Évitez le contenu généré par IA sans révision humaine</li>
                  <li>• Chapitres trop courts = risque de rejet</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Légende */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Risque de blocage</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Limite acceptable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Accepté KDP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Format idéal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des exigences de référence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tableau de Référence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Pages</th>
                    <th className="text-center py-3 px-4 font-semibold bg-primary/5">Chapitres Min</th>
                    <th className="text-center py-3 px-4 font-semibold">Mots/Chapitre</th>
                    <th className="text-center py-3 px-4 font-semibold">Total Mots</th>
                    <th className="text-center py-3 px-4 font-semibold">Statut KDP</th>
                    <th className="text-left py-3 px-4 font-semibold">Catégorie</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req, index) => (
                    <tr 
                      key={req.pages} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer ${
                        req.pages === customPages ? 'ring-2 ring-primary' : ''
                      } ${
                        req.status === 'danger' ? 'bg-red-50/50 dark:bg-red-950/10' :
                        req.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/10' :
                        req.status === 'ideal' ? 'bg-primary/5' :
                        index % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                      onClick={() => setCustomPages(req.pages)}
                    >
                      <td className="py-4 px-4">{getStatusIcon(req.status)}</td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="font-bold">{req.pages}</Badge>
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        <span className="font-bold text-lg text-primary">{req.minChapters}</span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">{req.minWordsPerChapter.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{req.totalWords.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">{getStatusBadge(req.status, req.kdpStatus)}</td>
                      <td className="py-4 px-4"><span className="font-medium">{req.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 Cliquez sur une ligne pour charger les valeurs dans le calculateur
            </p>
          </CardContent>
        </Card>

        {/* Conseils */}
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Conseils pour Éviter le Blocage KDP
            </CardTitle>
          </CardHeader>
          <CardContent className="text-emerald-900 dark:text-emerald-100 text-sm space-y-2">
            <p>✅ <strong>Visez minimum 50 pages</strong> pour les ebooks et 100 pages pour le broché</p>
            <p>✅ <strong>5+ chapitres minimum</strong> avec contenu substantiel par chapitre</p>
            <p>✅ <strong>2000+ mots par chapitre</strong> pour un contenu de qualité</p>
            <p>✅ <strong>Ajoutez une introduction et conclusion</strong> détaillées</p>
            <p>✅ <strong>Incluez des sous-chapitres</strong> pour structurer le contenu</p>
            <p>✅ <strong>Relisez et éditez</strong> le contenu généré par IA</p>
            <p>✅ <strong>Ajoutez de la valeur unique</strong> : exemples, études de cas, exercices</p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EbookPriceEstimator;
