import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Star, ExternalLink, BookOpen, TrendingUp, Database } from 'lucide-react';
import { toast } from 'sonner';
import {
  MARKETPLACES, MarketBook, fetchAmazonBook, searchAmazonNiche, fmtEur, fmtNum,
} from './marketShared';

/** Outil 1 — Base de Données Livres Amazon : fiche produit par ASIN + recherche par niche. */
const AmazonBookDatabase: React.FC = () => {
  const [marketplace, setMarketplace] = useState('fr');
  const [asin, setAsin] = useState('');
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<MarketBook | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const lookup = async () => {
    if (!asin.trim()) { toast.error('Entrez un ASIN (ex : B0XXXXXXXXX)'); return; }
    setLoading(true); setBook(null);
    try {
      const b = await fetchAmazonBook(asin.trim(), marketplace);
      setBook(b);
      toast.success('Fiche récupérée depuis Amazon');
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const search = async () => {
    if (!query.trim()) { toast.error('Entrez une niche ou un mot-clé'); return; }
    setLoading(true); setResults([]);
    try {
      const r = await searchAmazonNiche(query.trim(), marketplace);
      setResults(r);
      toast.success(`${r.length} livres trouvés`);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Marché :</span>
        <Select value={marketplace} onValueChange={setMarketplace}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="asin">
        <TabsList>
          <TabsTrigger value="asin"><Database className="h-4 w-4 mr-1" /> Fiche par ASIN</TabsTrigger>
          <TabsTrigger value="niche"><Search className="h-4 w-4 mr-1" /> Recherche par niche</TabsTrigger>
        </TabsList>

        <TabsContent value="asin" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Récupérer une fiche produit Amazon</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="ASIN — ex : B0CXXXXXXX" value={asin} onChange={(e) => setAsin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && lookup()} />
                <Input placeholder="Nom de l'auteur (optionnel)" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <Button onClick={lookup} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                Récupérer les données
              </Button>
              <p className="text-xs text-muted-foreground">
                Les données du livre (titre, prix, note, avis, BSR, pages, catégories) sont extraites automatiquement depuis Amazon. Vous n'avez rien à saisir d'autre que l'ASIN{author ? ' et l\'auteur' : ''}.
              </p>
            </CardContent>
          </Card>

          {book && <BookCard book={book} authorOverride={author} />}
        </TabsContent>

        <TabsContent value="niche" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Explorer une niche Amazon</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Ex : jardinage débutant, méditation, roman policier..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
                <Button onClick={search} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <Card key={i}>
                  <CardContent className="p-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                      {r.asin && <Badge variant="secondary" className="mt-1 text-[10px]">{r.asin}</Badge>}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { if (r.asin) { setAsin(r.asin); (document.querySelector('[value="asin"]') as HTMLElement)?.click(); } }}>
                      Analyser
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BookCard: React.FC<{ book: MarketBook; authorOverride?: string }> = ({ book, authorOverride }) => {
  const stat = (label: string, value: React.ReactNode) => (
    <div className="rounded-lg border p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-start gap-2">
          <BookOpen className="h-5 w-5 mt-0.5 shrink-0" />
          <span>{book.title}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          par {authorOverride?.trim() || book.author || 'Auteur inconnu'} · {book.asin}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stat('Prix', fmtEur(book.price))}
          {stat('Note', book.rating != null ? <span className="flex items-center gap-1">{book.rating} <Star className="h-4 w-4 text-amber-500 fill-amber-500" /></span> : '—')}
          {stat('Avis', fmtNum(book.reviews))}
          {stat('BSR', book.bsr != null ? `#${fmtNum(book.bsr)}` : '—')}
          {stat('Pages', fmtNum(book.pages))}
          {stat('Ventes/jour ~', book.estimatedDailySales != null ? fmtNum(Math.round(book.estimatedDailySales)) : '—')}
          {stat('Ventes/mois ~', fmtNum(book.estimatedMonthlySales))}
          {stat('Revenus/mois ~', fmtEur(book.estimatedMonthlyRevenue))}
        </div>

        {book.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {book.categories.map((c, i) => <Badge key={i} variant="secondary">{c}</Badge>)}
          </div>
        )}

        {book.description && (
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Description</p>
            <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-line">{book.description}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <a href={book.amazonUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            Voir sur Amazon <ExternalLink className="h-3 w-3" />
          </a>
          <span>· estimations basées sur le BSR (indicatif)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmazonBookDatabase;
