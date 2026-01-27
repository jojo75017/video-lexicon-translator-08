import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Globe, 
  BarChart3, 
  Plus,
  Trash2,
  RefreshCw,
  Star,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import Flag from 'react-world-flags';

interface BookBsr {
  id: string;
  asin: string;
  title: string;
  bsr: {
    us: number | null;
    uk: number | null;
    de: number | null;
    fr: number | null;
  };
  previousBsr?: {
    us: number | null;
    uk: number | null;
    de: number | null;
    fr: number | null;
  };
  price: {
    us: number | null;
    uk: number | null;
    de: number | null;
    fr: number | null;
  };
  lastUpdated: string;
}

interface Country {
  code: 'us' | 'uk' | 'de' | 'fr';
  name: string;
  flag: string;
  currency: string;
  amazonDomain: string;
}

const countries: Country[] = [
  { code: 'us', name: 'États-Unis', flag: 'US', currency: '$', amazonDomain: 'amazon.com' },
  { code: 'uk', name: 'Royaume-Uni', flag: 'GB', currency: '£', amazonDomain: 'amazon.co.uk' },
  { code: 'de', name: 'Allemagne', flag: 'DE', currency: '€', amazonDomain: 'amazon.de' },
  { code: 'fr', name: 'France', flag: 'FR', currency: '€', amazonDomain: 'amazon.fr' },
];

const EbookBsrTracker: React.FC = () => {
  const [books, setBooks] = useState<BookBsr[]>([
    {
      id: '1',
      asin: 'B0EXAMPLE1',
      title: 'Mon Premier Ebook KDP',
      bsr: { us: 45230, uk: 12450, de: 8920, fr: 5670 },
      previousBsr: { us: 52000, uk: 13200, de: 9500, fr: 6100 },
      price: { us: 4.99, uk: 3.99, de: 4.49, fr: 4.49 },
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      asin: 'B0EXAMPLE2',
      title: 'Guide Complet du Self-Publishing',
      bsr: { us: 89450, uk: 34200, de: 15600, fr: 9800 },
      previousBsr: { us: 75000, uk: 32000, de: 14200, fr: 8500 },
      price: { us: 9.99, uk: 7.99, de: 8.99, fr: 8.99 },
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [newBook, setNewBook] = useState({
    asin: '',
    title: '',
    bsr: { us: '', uk: '', de: '', fr: '' },
    price: { us: '', uk: '', de: '', fr: '' }
  });

  const [activeCountry, setActiveCountry] = useState<'us' | 'uk' | 'de' | 'fr'>('us');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getBsrTrend = (current: number | null, previous: number | null) => {
    if (!current || !previous) return 'stable';
    if (current < previous) return 'up'; // Lower BSR = better
    if (current > previous) return 'down';
    return 'stable';
  };

  const getBsrChange = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    return previous - current;
  };

  const formatBsr = (bsr: number | null) => {
    if (!bsr) return '—';
    return bsr.toLocaleString('fr-FR');
  };

  const estimateDailySales = (bsr: number | null) => {
    if (!bsr) return '—';
    // Formule approximative basée sur les estimations KDP
    if (bsr <= 1000) return '25-50+';
    if (bsr <= 5000) return '10-25';
    if (bsr <= 10000) return '5-10';
    if (bsr <= 50000) return '1-5';
    if (bsr <= 100000) return '0.5-1';
    return '< 0.5';
  };

  const handleAddBook = () => {
    if (!newBook.asin || !newBook.title) {
      toast.error('ASIN et titre requis');
      return;
    }

    const book: BookBsr = {
      id: Date.now().toString(),
      asin: newBook.asin,
      title: newBook.title,
      bsr: {
        us: newBook.bsr.us ? parseInt(newBook.bsr.us) : null,
        uk: newBook.bsr.uk ? parseInt(newBook.bsr.uk) : null,
        de: newBook.bsr.de ? parseInt(newBook.bsr.de) : null,
        fr: newBook.bsr.fr ? parseInt(newBook.bsr.fr) : null,
      },
      price: {
        us: newBook.price.us ? parseFloat(newBook.price.us) : null,
        uk: newBook.price.uk ? parseFloat(newBook.price.uk) : null,
        de: newBook.price.de ? parseFloat(newBook.price.de) : null,
        fr: newBook.price.fr ? parseFloat(newBook.price.fr) : null,
      },
      lastUpdated: new Date().toISOString()
    };

    setBooks(prev => [...prev, book]);
    setNewBook({ 
      asin: '', 
      title: '', 
      bsr: { us: '', uk: '', de: '', fr: '' },
      price: { us: '', uk: '', de: '', fr: '' }
    });
    toast.success('Livre ajouté au tracker');
  };

  const handleRemoveBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    toast.success('Livre retiré du tracker');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulation d'une mise à jour (dans un cas réel, on ferait un appel API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBooks(prev => prev.map(book => ({
      ...book,
      previousBsr: { ...book.bsr },
      bsr: {
        us: book.bsr.us ? book.bsr.us + Math.floor(Math.random() * 2000 - 1000) : null,
        uk: book.bsr.uk ? book.bsr.uk + Math.floor(Math.random() * 1000 - 500) : null,
        de: book.bsr.de ? book.bsr.de + Math.floor(Math.random() * 500 - 250) : null,
        fr: book.bsr.fr ? book.bsr.fr + Math.floor(Math.random() * 300 - 150) : null,
      },
      lastUpdated: new Date().toISOString()
    })));
    
    setIsRefreshing(false);
    toast.success('BSR mis à jour');
  };

  const getTotalEstimatedRevenue = (book: BookBsr) => {
    let total = 0;
    countries.forEach(country => {
      const bsr = book.bsr[country.code];
      const price = book.price[country.code];
      if (bsr && price) {
        let dailySales = 0;
        if (bsr <= 1000) dailySales = 37;
        else if (bsr <= 5000) dailySales = 17;
        else if (bsr <= 10000) dailySales = 7;
        else if (bsr <= 50000) dailySales = 3;
        else if (bsr <= 100000) dailySales = 0.75;
        else dailySales = 0.25;
        
        total += dailySales * price * 0.7 * 30; // 70% royalties, 30 jours
      }
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Tracker BSR Multi-Pays
          </h2>
          <p className="text-muted-foreground">
            Suivez le classement de vos livres sur 4 marketplaces Amazon
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-primary hover:bg-primary/90"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Mise à jour...' : 'Actualiser'}
        </Button>
      </div>

      {/* Tabs par pays */}
      <Tabs value={activeCountry} onValueChange={(v) => setActiveCountry(v as any)}>
        <TabsList className="grid grid-cols-4 w-full bg-muted/50">
          {countries.map(country => (
            <TabsTrigger 
              key={country.code} 
              value={country.code}
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Flag code={country.flag} className="w-5 h-4 rounded-sm object-cover" />
              <span className="hidden sm:inline">{country.name}</span>
              <span className="sm:hidden">{country.code.toUpperCase()}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {countries.map(country => (
          <TabsContent key={country.code} value={country.code} className="mt-6">
            {/* Stats globales du pays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200/50 dark:border-violet-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Livres trackés</p>
                      <p className="text-2xl font-bold">{books.filter(b => b.bsr[country.code]).length}</p>
                    </div>
                    <Globe className="w-8 h-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/50 dark:border-emerald-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Meilleur BSR</p>
                      <p className="text-2xl font-bold">
                        #{formatBsr(Math.min(...books.map(b => b.bsr[country.code] || Infinity).filter(b => b !== Infinity)))}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rev. estimé/mois</p>
                      <p className="text-2xl font-bold">
                        {country.currency}{books.reduce((acc, book) => {
                          const bsr = book.bsr[country.code];
                          const price = book.price[country.code];
                          if (!bsr || !price) return acc;
                          let dailySales = 0;
                          if (bsr <= 1000) dailySales = 37;
                          else if (bsr <= 5000) dailySales = 17;
                          else if (bsr <= 10000) dailySales = 7;
                          else if (bsr <= 50000) dailySales = 3;
                          else if (bsr <= 100000) dailySales = 0.75;
                          else dailySales = 0.25;
                          return acc + (dailySales * price * 0.7 * 30);
                        }, 0).toFixed(0)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des livres */}
            <div className="space-y-4">
              {books.map(book => {
                const bsr = book.bsr[country.code];
                const previousBsr = book.previousBsr?.[country.code];
                const price = book.price[country.code];
                const trend = getBsrTrend(bsr, previousBsr);
                const change = getBsrChange(bsr, previousBsr);

                return (
                  <Card key={book.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Flag code={country.flag} className="w-6 h-4 rounded-sm" />
                            <h3 className="font-semibold">{book.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {book.asin}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-muted-foreground">BSR Actuel</p>
                              <p className="text-xl font-bold flex items-center gap-2">
                                #{formatBsr(bsr)}
                                {trend === 'up' && (
                                  <span className="flex items-center text-emerald-500 text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    +{formatBsr(change)}
                                  </span>
                                )}
                                {trend === 'down' && (
                                  <span className="flex items-center text-red-500 text-sm">
                                    <TrendingDown className="w-4 h-4" />
                                    {formatBsr(change)}
                                  </span>
                                )}
                                {trend === 'stable' && (
                                  <Minus className="w-4 h-4 text-muted-foreground" />
                                )}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-muted-foreground">Prix</p>
                              <p className="text-xl font-bold">
                                {price ? `${country.currency}${price.toFixed(2)}` : '—'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-muted-foreground">Ventes/jour est.</p>
                              <p className="text-xl font-bold text-emerald-600">
                                {estimateDailySales(bsr)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-muted-foreground">Rev./mois est.</p>
                              <p className="text-xl font-bold text-amber-600">
                                {price && bsr ? `${country.currency}${((() => {
                                  let dailySales = 0;
                                  if (bsr <= 1000) dailySales = 37;
                                  else if (bsr <= 5000) dailySales = 17;
                                  else if (bsr <= 10000) dailySales = 7;
                                  else if (bsr <= 50000) dailySales = 3;
                                  else if (bsr <= 100000) dailySales = 0.75;
                                  else dailySales = 0.25;
                                  return (dailySales * price * 0.7 * 30).toFixed(0);
                                })())}` : '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBook(book.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>Dernière MàJ: {new Date(book.lastUpdated).toLocaleString('fr-FR')}</span>
                        <a 
                          href={`https://www.${country.amazonDomain}/dp/${book.asin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Voir sur Amazon
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Ajouter un nouveau livre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un livre à tracker
          </CardTitle>
          <CardDescription>
            Entrez les informations de votre livre pour suivre son BSR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ASIN</Label>
              <Input
                placeholder="B0XXXXXXXXX"
                value={newBook.asin}
                onChange={(e) => setNewBook(prev => ({ ...prev, asin: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Titre du livre</Label>
              <Input
                placeholder="Mon Super Ebook"
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.map(country => (
              <div key={country.code} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flag code={country.flag} className="w-4 h-3 rounded-sm" />
                  BSR {country.code.toUpperCase()}
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 45000"
                  value={newBook.bsr[country.code]}
                  onChange={(e) => setNewBook(prev => ({ 
                    ...prev, 
                    bsr: { ...prev.bsr, [country.code]: e.target.value }
                  }))}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.map(country => (
              <div key={country.code} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flag code={country.flag} className="w-4 h-3 rounded-sm" />
                  Prix ({country.currency})
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 4.99"
                  value={newBook.price[country.code]}
                  onChange={(e) => setNewBook(prev => ({ 
                    ...prev, 
                    price: { ...prev.price, [country.code]: e.target.value }
                  }))}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleAddBook} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter au Tracker
          </Button>
        </CardContent>
      </Card>

      {/* Vue comparative */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Vue Comparative Multi-Pays
          </CardTitle>
          <CardDescription>
            Comparez les performances de vos livres sur tous les marchés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Livre</th>
                  {countries.map(country => (
                    <th key={country.code} className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Flag code={country.flag} className="w-5 h-4 rounded-sm" />
                        <span className="font-semibold">{country.code.toUpperCase()}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 font-semibold">Rev. Total</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-xs text-muted-foreground">{book.asin}</div>
                    </td>
                    {countries.map(country => {
                      const bsr = book.bsr[country.code];
                      const trend = getBsrTrend(bsr, book.previousBsr?.[country.code]);
                      return (
                        <td key={country.code} className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono">#{formatBsr(bsr)}</span>
                            {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                            {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-right py-3 px-4 font-bold text-amber-600">
                      €{getTotalEstimatedRevenue(book).toFixed(0)}/mois
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookBsrTracker;
