import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  FileText,
  Layers
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
  // Exigences KDP pour éviter le blocage
  const requirements: KdpRequirement[] = [
    {
      pages: 20,
      minChapters: 3,
      minWordsPerChapter: 1500,
      totalWords: 5000,
      status: 'danger',
      kdpStatus: 'RISQUE ÉLEVÉ',
      recommendation: 'Trop court - risque de rejet pour "contenu insuffisant"',
      category: 'Non recommandé'
    },
    {
      pages: 30,
      minChapters: 4,
      minWordsPerChapter: 1800,
      totalWords: 7500,
      status: 'warning',
      kdpStatus: 'LIMITE',
      recommendation: 'Minimum absolu - ajoutez du contenu si possible',
      category: 'Minimum KDP'
    },
    {
      pages: 50,
      minChapters: 5,
      minWordsPerChapter: 2000,
      totalWords: 12500,
      status: 'ok',
      kdpStatus: 'ACCEPTÉ',
      recommendation: 'Acceptable pour guides courts et ebooks pratiques',
      category: 'Guide court'
    },
    {
      pages: 75,
      minChapters: 6,
      minWordsPerChapter: 2500,
      totalWords: 18750,
      status: 'ok',
      kdpStatus: 'ACCEPTÉ',
      recommendation: 'Bon format pour ebooks pratiques et tutoriels',
      category: 'Ebook standard'
    },
    {
      pages: 100,
      minChapters: 8,
      minWordsPerChapter: 2500,
      totalWords: 25000,
      status: 'ideal',
      kdpStatus: 'IDÉAL',
      recommendation: 'Format parfait pour la plupart des genres',
      category: 'Livre complet'
    },
    {
      pages: 150,
      minChapters: 10,
      minWordsPerChapter: 3000,
      totalWords: 37500,
      status: 'ideal',
      kdpStatus: 'IDÉAL',
      recommendation: 'Excellent pour romans et guides approfondis',
      category: 'Ouvrage approfondi'
    },
    {
      pages: 200,
      minChapters: 12,
      minWordsPerChapter: 3500,
      totalWords: 50000,
      status: 'ideal',
      kdpStatus: 'IDÉAL',
      recommendation: 'Parfait pour romans et manuels complets',
      category: 'Roman / Manuel'
    },
    {
      pages: 300,
      minChapters: 15,
      minWordsPerChapter: 4000,
      totalWords: 75000,
      status: 'ideal',
      kdpStatus: 'IDÉAL',
      recommendation: 'Format idéal pour sagas et encyclopédies',
      category: 'Ouvrage majeur'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'ok':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'ideal':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, kdpStatus: string) => {
    const variants: Record<string, string> = {
      danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      ok: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      ideal: 'bg-primary/10 text-primary'
    };
    return (
      <Badge className={variants[status]}>
        {kdpStatus}
      </Badge>
    );
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
                  Nombre minimum de chapitres et pages pour éviter le blocage Amazon KDP
                </CardDescription>
              </div>
            </div>
          </CardHeader>
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

        {/* Tableau des exigences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tableau des Exigences par Nombre de Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Pages</th>
                    <th className="text-center py-3 px-4 font-semibold bg-primary/5">
                      <div className="flex items-center justify-center gap-1">
                        Chapitres Min
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Nombre minimum de chapitres recommandé
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        Mots/Chapitre
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Nombre de mots minimum par chapitre
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">Total Mots</th>
                    <th className="text-center py-3 px-4 font-semibold">Statut KDP</th>
                    <th className="text-left py-3 px-4 font-semibold">Catégorie</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req, index) => (
                    <tr 
                      key={req.pages} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                        req.status === 'danger' ? 'bg-red-50/50 dark:bg-red-950/10' :
                        req.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/10' :
                        req.status === 'ideal' ? 'bg-primary/5' :
                        index % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        {getStatusIcon(req.status)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="font-bold">
                          {req.pages}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        <span className="font-bold text-lg text-primary">
                          {req.minChapters}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium">
                        {req.minWordsPerChapter.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">
                        {req.totalWords.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(req.status, req.kdpStatus)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{req.category}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recommandations détaillées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recommandations par Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div 
                  key={req.pages}
                  className={`p-4 rounded-lg border ${
                    req.status === 'danger' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' :
                    req.status === 'warning' ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20' :
                    req.status === 'ideal' ? 'border-primary/30 bg-primary/5' :
                    'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{req.pages} pages</span>
                    {getStatusBadge(req.status, req.kdpStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground">{req.recommendation}</p>
                  <div className="mt-2 text-xs space-y-1">
                    <p>→ {req.minChapters} chapitres minimum</p>
                    <p>→ {req.minWordsPerChapter.toLocaleString()} mots/chapitre</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils pour éviter le blocage */}
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
