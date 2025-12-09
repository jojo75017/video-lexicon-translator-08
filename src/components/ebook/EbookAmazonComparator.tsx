import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, BarChart3, TrendingUp, BookOpen, Star, DollarSign, Award } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';

interface CompetitorBook {
  id: string;
  title: string;
  author: string;
  bsr: number;
  price: number;
  reviews: number;
  rating: number;
  pages: number;
  isYourBook?: boolean;
}

const EbookAmazonComparator = () => {
  const [books, setBooks] = useState<CompetitorBook[]>([]);
  const [newBook, setNewBook] = useState<Partial<CompetitorBook>>({
    title: '',
    author: '',
    bsr: 0,
    price: 0,
    reviews: 0,
    rating: 0,
    pages: 0,
    isYourBook: false,
  });

  const addBook = () => {
    if (!newBook.title?.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }
    if (!newBook.bsr || newBook.bsr < 1) {
      toast.error('Veuillez entrer un rang BSR valide');
      return;
    }

    const book: CompetitorBook = {
      id: Date.now().toString(),
      title: newBook.title.trim().slice(0, 200),
      author: (newBook.author || 'Inconnu').trim().slice(0, 100),
      bsr: Math.min(Math.max(1, newBook.bsr || 1), 10000000),
      price: Math.min(Math.max(0, newBook.price || 0), 1000),
      reviews: Math.min(Math.max(0, newBook.reviews || 0), 100000),
      rating: Math.min(Math.max(0, newBook.rating || 0), 5),
      pages: Math.min(Math.max(0, newBook.pages || 0), 10000),
      isYourBook: newBook.isYourBook,
    };

    setBooks([...books, book]);
    setNewBook({
      title: '',
      author: '',
      bsr: 0,
      price: 0,
      reviews: 0,
      rating: 0,
      pages: 0,
      isYourBook: false,
    });
    toast.success('Livre ajouté à la comparaison');
  };

  const removeBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
    toast.success('Livre retiré');
  };

  const estimateSales = (bsr: number): number => {
    if (bsr <= 100) return 100 + (100 - bsr) * 2;
    if (bsr <= 500) return 50 + (500 - bsr) * 0.1;
    if (bsr <= 1000) return 25 + (1000 - bsr) * 0.05;
    if (bsr <= 5000) return 10 + (5000 - bsr) * 0.004;
    if (bsr <= 10000) return 5 + (10000 - bsr) * 0.001;
    if (bsr <= 50000) return 2 + (50000 - bsr) * 0.00008;
    if (bsr <= 100000) return 1 + (100000 - bsr) * 0.00002;
    return Math.max(0.1, 0.5 - (bsr - 100000) * 0.000001);
  };

  const bsrChartData = books.map(book => ({
    name: book.title.slice(0, 20) + (book.title.length > 20 ? '...' : ''),
    BSR: book.bsr,
    fill: book.isYourBook ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
  }));

  const salesChartData = books.map(book => {
    const dailySales = estimateSales(book.bsr);
    return {
      name: book.title.slice(0, 20) + (book.title.length > 20 ? '...' : ''),
      'Ventes/jour': Math.round(dailySales * 10) / 10,
      'Revenus/mois': Math.round(dailySales * 30 * book.price * 0.7),
      fill: book.isYourBook ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
    };
  });

  const priceChartData = books.map(book => ({
    name: book.title.slice(0, 20) + (book.title.length > 20 ? '...' : ''),
    Prix: book.price,
    fill: book.isYourBook ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
  }));

  const reviewsChartData = books.map(book => ({
    name: book.title.slice(0, 20) + (book.title.length > 20 ? '...' : ''),
    Avis: book.reviews,
    Note: book.rating,
    fill: book.isYourBook ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
  }));

  // Normalize data for radar chart (0-100 scale)
  const radarData = books.length > 0 ? [
    {
      metric: 'Rang BSR',
      ...Object.fromEntries(books.map(b => [
        b.title.slice(0, 15),
        Math.max(0, 100 - (Math.log10(b.bsr) / Math.log10(1000000)) * 100)
      ]))
    },
    {
      metric: 'Prix',
      ...Object.fromEntries(books.map(b => [
        b.title.slice(0, 15),
        Math.min(100, (b.price / 20) * 100)
      ]))
    },
    {
      metric: 'Avis',
      ...Object.fromEntries(books.map(b => [
        b.title.slice(0, 15),
        Math.min(100, (b.reviews / 1000) * 100)
      ]))
    },
    {
      metric: 'Note',
      ...Object.fromEntries(books.map(b => [
        b.title.slice(0, 15),
        (b.rating / 5) * 100
      ]))
    },
    {
      metric: 'Pages',
      ...Object.fromEntries(books.map(b => [
        b.title.slice(0, 15),
        Math.min(100, (b.pages / 500) * 100)
      ]))
    },
  ] : [];

  const getAnalysis = () => {
    if (books.length < 2) return null;

    const avgBsr = books.reduce((sum, b) => sum + b.bsr, 0) / books.length;
    const avgPrice = books.reduce((sum, b) => sum + b.price, 0) / books.length;
    const avgReviews = books.reduce((sum, b) => sum + b.reviews, 0) / books.length;
    const avgRating = books.reduce((sum, b) => sum + b.rating, 0) / books.length;
    
    const yourBook = books.find(b => b.isYourBook);
    const competitors = books.filter(b => !b.isYourBook);

    const insights: string[] = [];

    if (yourBook && competitors.length > 0) {
      if (yourBook.bsr < avgBsr) {
        insights.push('✅ Votre livre se classe mieux que la moyenne des concurrents');
      } else {
        insights.push('⚠️ Votre rang BSR est inférieur à la moyenne - améliorez votre visibilité');
      }

      if (yourBook.price < avgPrice * 0.8) {
        insights.push('💡 Votre prix est bas - envisagez une augmentation');
      } else if (yourBook.price > avgPrice * 1.2) {
        insights.push('💡 Votre prix est élevé - vérifiez la valeur perçue');
      }

      if (yourBook.reviews < avgReviews * 0.5) {
        insights.push('📢 Peu d\'avis - lancez une campagne de demande d\'avis');
      }
    }

    const bestBsr = Math.min(...books.map(b => b.bsr));
    const bestBook = books.find(b => b.bsr === bestBsr);
    insights.push(`🏆 Meilleur performer: "${bestBook?.title}" (BSR: ${bestBsr.toLocaleString()})`);

    return {
      avgBsr: Math.round(avgBsr),
      avgPrice: avgPrice.toFixed(2),
      avgReviews: Math.round(avgReviews),
      avgRating: avgRating.toFixed(1),
      insights,
    };
  };

  const analysis = getAnalysis();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparateur Amazon KDP
          </CardTitle>
          <CardDescription>
            Entrez les données de vos concurrents pour une analyse comparative
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <Label>Titre du livre</Label>
              <Input
                placeholder="Ex: Guide du marketing digital"
                value={newBook.title || ''}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                maxLength={200}
              />
            </div>
            <div>
              <Label>Auteur</Label>
              <Input
                placeholder="Nom de l'auteur"
                value={newBook.author || ''}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                maxLength={100}
              />
            </div>
            <div>
              <Label>Rang BSR</Label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                value={newBook.bsr || ''}
                onChange={(e) => setNewBook({ ...newBook, bsr: parseInt(e.target.value) || 0 })}
                min={1}
                max={10000000}
              />
            </div>
            <div>
              <Label>Prix (€)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Ex: 4.99"
                value={newBook.price || ''}
                onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
                min={0}
                max={1000}
              />
            </div>
            <div>
              <Label>Nombre d'avis</Label>
              <Input
                type="number"
                placeholder="Ex: 150"
                value={newBook.reviews || ''}
                onChange={(e) => setNewBook({ ...newBook, reviews: parseInt(e.target.value) || 0 })}
                min={0}
                max={100000}
              />
            </div>
            <div>
              <Label>Note /5</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 4.5"
                value={newBook.rating || ''}
                onChange={(e) => setNewBook({ ...newBook, rating: parseFloat(e.target.value) || 0 })}
                min={0}
                max={5}
              />
            </div>
            <div>
              <Label>Pages</Label>
              <Input
                type="number"
                placeholder="Ex: 200"
                value={newBook.pages || ''}
                onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) || 0 })}
                min={0}
                max={10000}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newBook.isYourBook || false}
                onChange={(e) => setNewBook({ ...newBook, isYourBook: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">C'est mon livre</span>
            </label>
            <Button onClick={addBook} className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Livres comparés ({books.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    book.isYourBook ? 'bg-primary/10 border-primary' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{book.title}</span>
                      {book.isYourBook && (
                        <Badge variant="default" className="text-xs">Mon livre</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-3 mt-1">
                      <span>BSR: {book.bsr.toLocaleString()}</span>
                      <span>Prix: {book.price.toFixed(2)}€</span>
                      <span>Avis: {book.reviews}</span>
                      <span>Note: {book.rating}/5</span>
                      <span>Pages: {book.pages}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBook(book.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {books.length >= 2 && (
        <>
          <Tabs defaultValue="bsr" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="bsr">BSR</TabsTrigger>
              <TabsTrigger value="sales">Ventes</TabsTrigger>
              <TabsTrigger value="price">Prix</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
            </TabsList>

            <TabsContent value="bsr">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparaison des rangs BSR</CardTitle>
                  <CardDescription>Plus le BSR est bas, mieux le livre se vend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bsrChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip formatter={(value: number) => value.toLocaleString()} />
                      <Bar dataKey="BSR" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estimation des ventes</CardTitle>
                  <CardDescription>Ventes journalières et revenus mensuels estimés (royalties 70%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="Ventes/jour" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="Revenus/mois" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="price">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparaison des prix</CardTitle>
                  <CardDescription>Prix de vente des différents livres</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}€`} />
                      <Bar dataKey="Prix" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avis et notes</CardTitle>
                  <CardDescription>Nombre d'avis et notes moyennes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reviewsChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#ffc658" domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="Avis" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="Note" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="radar">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vue radar</CardTitle>
                  <CardDescription>Comparaison multidimensionnelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {books.map((book, index) => (
                        <Radar
                          key={book.id}
                          name={book.title.slice(0, 15)}
                          dataKey={book.title.slice(0, 15)}
                          stroke={colors[index % colors.length]}
                          fill={colors[index % colors.length]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {analysis && (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analyse comparative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{analysis.avgBsr.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">BSR moyen</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <div className="text-xl font-bold">{analysis.avgPrice}€</div>
                    <div className="text-xs text-muted-foreground">Prix moyen</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-xl font-bold">{analysis.avgReviews}</div>
                    <div className="text-xs text-muted-foreground">Avis moyen</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                    <div className="text-xl font-bold">{analysis.avgRating}/5</div>
                    <div className="text-xs text-muted-foreground">Note moyenne</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Insights</h4>
                  {analysis.insights.map((insight, index) => (
                    <p key={index} className="text-sm">{insight}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {books.length === 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Ajoutez au moins 2 livres pour voir les comparaisons graphiques
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookAmazonComparator;
