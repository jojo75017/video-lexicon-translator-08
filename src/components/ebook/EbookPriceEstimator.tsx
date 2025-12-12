import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  BookOpen, 
  TrendingUp, 
  Calculator,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PageEstimate {
  pages: number;
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  royalty70: number;
  royalty35: number;
  printCost: number;
  printRoyalty: number;
  category: string;
}

const EbookPriceEstimator: React.FC = () => {
  // Estimations basées sur les standards KDP Amazon
  const estimates: PageEstimate[] = [
    {
      pages: 20,
      minPrice: 0.99,
      maxPrice: 2.99,
      recommendedPrice: 1.99,
      royalty70: 1.39, // 70% de 1.99
      royalty35: 0.70, // 35% de 1.99
      printCost: 2.15, // Coût impression minimal
      printRoyalty: 0.50,
      category: 'Court / Guide rapide'
    },
    {
      pages: 50,
      minPrice: 2.99,
      maxPrice: 4.99,
      recommendedPrice: 3.99,
      royalty70: 2.79,
      royalty35: 1.40,
      printCost: 2.85,
      printRoyalty: 1.50,
      category: 'Ebook standard'
    },
    {
      pages: 100,
      minPrice: 4.99,
      maxPrice: 7.99,
      recommendedPrice: 5.99,
      royalty70: 4.19,
      royalty35: 2.10,
      printCost: 3.85,
      printRoyalty: 3.00,
      category: 'Livre complet'
    },
    {
      pages: 150,
      minPrice: 5.99,
      maxPrice: 9.99,
      recommendedPrice: 7.99,
      royalty70: 5.59,
      royalty35: 2.80,
      printCost: 4.65,
      printRoyalty: 4.00,
      category: 'Ouvrage approfondi'
    },
    {
      pages: 200,
      minPrice: 7.99,
      maxPrice: 12.99,
      recommendedPrice: 9.99,
      royalty70: 6.99,
      royalty35: 3.50,
      printCost: 5.45,
      printRoyalty: 5.50,
      category: 'Ouvrage expert'
    },
    {
      pages: 300,
      minPrice: 9.99,
      maxPrice: 14.99,
      recommendedPrice: 12.99,
      royalty70: 9.09,
      royalty35: 4.55,
      printCost: 7.05,
      printRoyalty: 6.50,
      category: 'Roman / Manuel complet'
    },
    {
      pages: 400,
      minPrice: 12.99,
      maxPrice: 17.99,
      recommendedPrice: 14.99,
      royalty70: 10.49,
      royalty35: 5.25,
      printCost: 8.65,
      printRoyalty: 7.50,
      category: 'Ouvrage majeur'
    },
    {
      pages: 500,
      minPrice: 14.99,
      maxPrice: 19.99,
      recommendedPrice: 17.99,
      royalty70: 12.59,
      royalty35: 6.30,
      printCost: 10.25,
      printRoyalty: 8.50,
      category: 'Encyclopédie / Saga'
    }
  ];

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Estimations de Prix par Pages</CardTitle>
                <CardDescription>
                  Guide de tarification pour vos ebooks sur Amazon KDP
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Légende */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Royalties 70% (2.99€-9.99€)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Royalties 35% (autres prix)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Format Kindle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Format Broché (Print)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des estimations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Tableau des Estimations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Pages</th>
                    <th className="text-left py-3 px-4 font-semibold">Catégorie</th>
                    <th className="text-center py-3 px-4 font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        Prix Min
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Prix minimum recommandé
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold bg-primary/5">
                      <div className="flex items-center justify-center gap-1">
                        Prix Recommandé
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Prix optimal pour maximiser les ventes et revenus
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">Prix Max</th>
                    <th className="text-center py-3 px-4 font-semibold text-emerald-600">
                      <div className="flex items-center justify-center gap-1">
                        Royalties 70%
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Royalties si prix entre 2.99€ et 9.99€
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-amber-600">
                      <div className="flex items-center justify-center gap-1">
                        Royalties 35%
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Royalties pour prix hors zone 2.99€-9.99€
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-purple-600">
                      <div className="flex items-center justify-center gap-1">
                        Coût Print
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Coût d'impression KDP pour broché
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-purple-600">
                      <div className="flex items-center justify-center gap-1">
                        Royalties Print
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Royalties estimées pour version brochée
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((estimate, index) => (
                    <tr 
                      key={estimate.pages} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-bold">
                            {estimate.pages}
                          </Badge>
                          <span className="text-muted-foreground">pages</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{estimate.category}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">
                        {formatPrice(estimate.minPrice)}
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        <Badge className="bg-primary text-primary-foreground font-bold">
                          {formatPrice(estimate.recommendedPrice)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">
                        {formatPrice(estimate.maxPrice)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-emerald-600 font-semibold">
                          {formatPrice(estimate.royalty70)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-amber-600 font-medium">
                          {formatPrice(estimate.royalty35)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-purple-600 font-medium">
                          {formatPrice(estimate.printCost)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-purple-600 font-semibold">
                          {formatPrice(estimate.printRoyalty)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenus estimés par mois */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenus Mensuels Estimés (par ventes/mois)
            </CardTitle>
            <CardDescription>
              Simulation basée sur le prix recommandé avec royalties 70%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Pages</th>
                    <th className="text-center py-3 px-4 font-semibold">10 ventes/mois</th>
                    <th className="text-center py-3 px-4 font-semibold">25 ventes/mois</th>
                    <th className="text-center py-3 px-4 font-semibold">50 ventes/mois</th>
                    <th className="text-center py-3 px-4 font-semibold">100 ventes/mois</th>
                    <th className="text-center py-3 px-4 font-semibold bg-emerald-50 dark:bg-emerald-950/30">250 ventes/mois</th>
                    <th className="text-center py-3 px-4 font-semibold">500 ventes/mois</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((estimate, index) => (
                    <tr 
                      key={estimate.pages} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-muted/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-medium">{estimate.pages} pages</td>
                      <td className="py-4 px-4 text-center">
                        {formatPrice(estimate.royalty70 * 10)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {formatPrice(estimate.royalty70 * 25)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {formatPrice(estimate.royalty70 * 50)}
                      </td>
                      <td className="py-4 px-4 text-center font-medium">
                        {formatPrice(estimate.royalty70 * 100)}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
                        {formatPrice(estimate.royalty70 * 250)}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-primary">
                        {formatPrice(estimate.royalty70 * 500)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes importantes */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Info className="h-5 w-5" />
              Notes Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-900 dark:text-amber-100 text-sm space-y-2">
            <p>• <strong>Zone 70%</strong> : Disponible uniquement pour les prix entre 2.99€ et 9.99€ sur Amazon KDP.</p>
            <p>• <strong>Coûts Print</strong> : Basés sur un format 15x23cm, noir & blanc, couverture brillante. Varient selon le format.</p>
            <p>• <strong>Prix recommandés</strong> : Suggestions basées sur les standards du marché, ajustez selon votre niche.</p>
            <p>• <strong>Pages</strong> : Estimation à ~250 mots/page pour format Kindle standard.</p>
            <p>• <strong>TVA</strong> : Les royalties affichées sont avant déduction de la TVA (selon pays).</p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EbookPriceEstimator;
