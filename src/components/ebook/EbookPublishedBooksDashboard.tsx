import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, BookOpen, TrendingUp, DollarSign, Star, 
  Edit2, Trash2, RefreshCw, BarChart3, Calendar,
  ArrowUp, ArrowDown, Minus, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from 'recharts';

interface PublishedBook {
  id: string;
  title: string;
  author_name: string;
  asin?: string;
  isbn?: string;
  publication_date?: string;
  price: number;
  pages: number;
  category?: string;
  cover_url?: string;
  status: string;
  created_at: string;
}

interface TrackingData {
  id: string;
  book_id: string;
  bsr: number;
  estimated_daily_sales: number;
  estimated_monthly_sales: number;
  estimated_monthly_revenue: number;
  reviews_count: number;
  rating: number;
  tracked_at: string;
}

const EbookPublishedBooksDashboard: React.FC = () => {
  const [books, setBooks] = useState<PublishedBook[]>([]);
  const [trackingHistory, setTrackingHistory] = useState<Record<string, TrackingData[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<PublishedBook | null>(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author_name: '',
    asin: '',
    price: 4.99,
    pages: 100,
    category: '',
    publication_date: ''
  });
  const [newTracking, setNewTracking] = useState({
    bsr: 0,
    reviews_count: 0,
    rating: 4.5
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Veuillez vous connecter');
        return;
      }

      const { data: booksData, error: booksError } = await supabase
        .from('published_books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;
      setBooks(booksData || []);

      // Load tracking history for each book
      if (booksData && booksData.length > 0) {
        const { data: trackingData, error: trackingError } = await supabase
          .from('book_tracking_history')
          .select('*')
          .in('book_id', booksData.map(b => b.id))
          .order('tracked_at', { ascending: true });

        if (trackingError) throw trackingError;

        const historyByBook: Record<string, TrackingData[]> = {};
        trackingData?.forEach(track => {
          if (!historyByBook[track.book_id]) {
            historyByBook[track.book_id] = [];
          }
          historyByBook[track.book_id].push(track);
        });
        setTrackingHistory(historyByBook);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const estimateSales = (bsr: number, price: number) => {
    let dailySales: number;
    if (bsr <= 100) dailySales = 100 + (100 - bsr) * 2;
    else if (bsr <= 500) dailySales = 50 + (500 - bsr) * 0.1;
    else if (bsr <= 1000) dailySales = 25 + (1000 - bsr) * 0.05;
    else if (bsr <= 5000) dailySales = 10 + (5000 - bsr) * 0.004;
    else if (bsr <= 10000) dailySales = 5 + (10000 - bsr) * 0.001;
    else if (bsr <= 50000) dailySales = 2 + (50000 - bsr) * 0.00008;
    else if (bsr <= 100000) dailySales = 1 + (100000 - bsr) * 0.00002;
    else dailySales = Math.max(0.1, 0.5 - (bsr - 100000) * 0.000001);
    
    const royaltyRate = price >= 2.99 ? 0.70 : 0.35;
    const monthlySales = dailySales * 30;
    const monthlyRevenue = monthlySales * price * royaltyRate;
    
    return { dailySales, monthlySales, monthlyRevenue };
  };

  const addBook = async () => {
    if (!newBook.title.trim()) {
      toast.error('Titre requis');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Veuillez vous connecter');
        return;
      }

      const { error } = await supabase
        .from('published_books')
        .insert({
          user_id: user.id,
          title: newBook.title.trim(),
          author_name: newBook.author_name.trim() || 'Auteur',
          asin: newBook.asin || null,
          price: newBook.price,
          pages: newBook.pages,
          category: newBook.category || null,
          publication_date: newBook.publication_date || null
        });

      if (error) throw error;

      toast.success('Livre ajouté !');
      setIsAddDialogOpen(false);
      setNewBook({ title: '', author_name: '', asin: '', price: 4.99, pages: 100, category: '', publication_date: '' });
      loadBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const addTracking = async () => {
    if (!selectedBook || newTracking.bsr < 1) {
      toast.error('BSR requis');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const estimates = estimateSales(newTracking.bsr, selectedBook.price);

      const { error } = await supabase
        .from('book_tracking_history')
        .insert({
          book_id: selectedBook.id,
          user_id: user.id,
          bsr: newTracking.bsr,
          estimated_daily_sales: Math.round(estimates.dailySales * 10) / 10,
          estimated_monthly_sales: Math.round(estimates.monthlySales),
          estimated_monthly_revenue: Math.round(estimates.monthlyRevenue * 100) / 100,
          reviews_count: newTracking.reviews_count,
          rating: newTracking.rating
        });

      if (error) throw error;

      toast.success('Données enregistrées !');
      setIsTrackDialogOpen(false);
      setNewTracking({ bsr: 0, reviews_count: 0, rating: 4.5 });
      loadBooks();
    } catch (error) {
      console.error('Error adding tracking:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!confirm('Supprimer ce livre et son historique ?')) return;

    try {
      const { error } = await supabase
        .from('published_books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
      toast.success('Livre supprimé');
      loadBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getLatestTracking = (bookId: string): TrackingData | null => {
    const history = trackingHistory[bookId];
    if (!history || history.length === 0) return null;
    return history[history.length - 1];
  };

  const getBsrTrend = (bookId: string): 'up' | 'down' | 'stable' => {
    const history = trackingHistory[bookId];
    if (!history || history.length < 2) return 'stable';
    const recent = history[history.length - 1].bsr;
    const previous = history[history.length - 2].bsr;
    if (recent < previous) return 'up'; // Lower BSR = better
    if (recent > previous) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Calculate totals
  const totalMonthlyRevenue = Object.values(trackingHistory).reduce((sum, history) => {
    const latest = history[history.length - 1];
    return sum + (latest?.estimated_monthly_revenue || 0);
  }, 0);

  const totalMonthlySales = Object.values(trackingHistory).reduce((sum, history) => {
    const latest = history[history.length - 1];
    return sum + (latest?.estimated_monthly_sales || 0);
  }, 0);

  // Prepare chart data
  const revenueChartData = books.map(book => {
    const latest = getLatestTracking(book.id);
    return {
      name: book.title.slice(0, 15) + (book.title.length > 15 ? '...' : ''),
      revenus: latest?.estimated_monthly_revenue || 0,
      ventes: latest?.estimated_monthly_sales || 0
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-400" />
            Mes Livres Publiés
          </h2>
          <p className="text-muted-foreground text-sm">
            Suivez les performances de vos ebooks sur Amazon KDP
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadBooks} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un livre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un livre publié</DialogTitle>
                <DialogDescription>
                  Entrez les informations de votre livre Amazon KDP
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Titre *</Label>
                  <Input
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Titre du livre"
                    maxLength={200}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Auteur</Label>
                    <Input
                      value={newBook.author_name}
                      onChange={(e) => setNewBook({ ...newBook, author_name: e.target.value })}
                      placeholder="Nom de l'auteur"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label>ASIN</Label>
                    <Input
                      value={newBook.asin}
                      onChange={(e) => setNewBook({ ...newBook, asin: e.target.value })}
                      placeholder="B0XXXXXXXX"
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newBook.price}
                      onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
                      min={0.99}
                      max={999}
                    />
                  </div>
                  <div>
                    <Label>Pages</Label>
                    <Input
                      type="number"
                      value={newBook.pages}
                      onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) || 0 })}
                      min={1}
                      max={10000}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Catégorie</Label>
                    <Input
                      value={newBook.category}
                      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      placeholder="Ex: Développement personnel"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label>Date publication</Label>
                    <Input
                      type="date"
                      value={newBook.publication_date}
                      onChange={(e) => setNewBook({ ...newBook, publication_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addBook} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le livre
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">{books.length}</div>
            <div className="text-xs text-muted-foreground">Livres publiés</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{Math.round(totalMonthlySales)}</div>
            <div className="text-xs text-muted-foreground">Ventes/mois estimées</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{totalMonthlyRevenue.toFixed(0)}€</div>
            <div className="text-xs text-muted-foreground">Revenus/mois estimés</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold">{(totalMonthlyRevenue * 12).toFixed(0)}€</div>
            <div className="text-xs text-muted-foreground">Revenus/an estimés</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique revenus */}
      {books.length > 0 && revenueChartData.some(d => d.revenus > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance par livre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenus" name="Revenus (€)" fill="#8b5cf6" />
                <Bar yAxisId="right" dataKey="ventes" name="Ventes" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Liste des livres */}
      <div className="space-y-4">
        {books.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore ajouté de livres publiés
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier livre
              </Button>
            </CardContent>
          </Card>
        ) : (
          books.map(book => {
            const latestTracking = getLatestTracking(book.id);
            const trend = getBsrTrend(book.id);
            const history = trackingHistory[book.id] || [];

            return (
              <Card key={book.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <Badge variant="outline">{book.price.toFixed(2)}€</Badge>
                        {latestTracking && getTrendIcon(trend)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        par {book.author_name} • {book.pages} pages
                        {book.category && ` • ${book.category}`}
                      </p>
                      {book.asin && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ASIN: {book.asin}
                        </p>
                      )}
                    </div>

                    {latestTracking ? (
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <div className="text-xs text-muted-foreground">BSR</div>
                          <div className="font-bold text-purple-400">
                            #{latestTracking.bsr.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <div className="text-xs text-muted-foreground">Ventes/mois</div>
                          <div className="font-bold text-green-400">
                            {Math.round(latestTracking.estimated_monthly_sales)}
                          </div>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <div className="text-xs text-muted-foreground">Revenus/mois</div>
                          <div className="font-bold text-blue-400">
                            {latestTracking.estimated_monthly_revenue.toFixed(0)}€
                          </div>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Star className="h-3 w-3" /> Note
                          </div>
                          <div className="font-bold text-amber-400">
                            {latestTracking.rating}/5
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        Aucune donnée de suivi
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBook(book);
                          setIsTrackDialogOpen(true);
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Tracker
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteBook(book.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* Graphique historique BSR */}
                  {history.length > 1 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Évolution BSR</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={history.map(h => ({
                          date: new Date(h.tracked_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                          bsr: h.bsr,
                          revenus: h.estimated_monthly_revenue
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis reversed tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="bsr" 
                            stroke="#8b5cf6" 
                            fill="#8b5cf6" 
                            fillOpacity={0.2}
                            name="BSR"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog pour tracker */}
      <Dialog open={isTrackDialogOpen} onOpenChange={setIsTrackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer les données</DialogTitle>
            <DialogDescription>
              {selectedBook?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Rang BSR actuel *</Label>
              <Input
                type="number"
                value={newTracking.bsr || ''}
                onChange={(e) => setNewTracking({ ...newTracking, bsr: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 15000"
                min={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre d'avis</Label>
                <Input
                  type="number"
                  value={newTracking.reviews_count || ''}
                  onChange={(e) => setNewTracking({ ...newTracking, reviews_count: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              <div>
                <Label>Note moyenne</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newTracking.rating}
                  onChange={(e) => setNewTracking({ ...newTracking, rating: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={5}
                />
              </div>
            </div>
            <Button onClick={addTracking} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookPublishedBooksDashboard;
