import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DollarSign, TrendingUp, BarChart3, BookOpen, Calculator, Plus, Trash2, PiggyBank } from 'lucide-react';
import { toast } from 'sonner';

interface BookEntry {
  id: string;
  title: string;
  price: number;
  pages: number;
  salesPerDay: number;
  format: 'ebook' | 'paperback' | 'hardcover';
  enrolledKU: boolean;
  kuPagesRead: number;
}

function calculateRoyalty(book: BookEntry) {
  const { price, salesPerDay, format, enrolledKU, kuPagesRead } = book;
  
  let royaltyRate = 0;
  let printCost = 0;

  if (format === 'ebook') {
    royaltyRate = price >= 2.99 && price <= 9.99 ? 0.70 : 0.35;
  } else if (format === 'paperback') {
    // Simplified printing cost: fixed + per page
    printCost = 0.85 + (book.pages * 0.012);
    royaltyRate = 0.60;
  } else {
    printCost = 6.50 + (book.pages * 0.012);
    royaltyRate = 0.60;
  }

  const perSaleRoyalty = format === 'ebook'
    ? price * royaltyRate
    : Math.max(0, (price * royaltyRate) - printCost);

  const dailyRevenue = perSaleRoyalty * salesPerDay;
  const kuRevenue = enrolledKU ? kuPagesRead * 0.004 * salesPerDay : 0; // ~$0.004 per KENP page

  return {
    perSale: perSaleRoyalty,
    daily: dailyRevenue + kuRevenue,
    monthly: (dailyRevenue + kuRevenue) * 30,
    yearly: (dailyRevenue + kuRevenue) * 365,
    printCost,
    kuMonthly: kuRevenue * 30,
  };
}

export const EbookRoyaltyDashboard: React.FC = () => {
  const [books, setBooks] = useState<BookEntry[]>([
    { id: '1', title: 'Mon Premier Livre', price: 4.99, pages: 200, salesPerDay: 3, format: 'ebook', enrolledKU: true, kuPagesRead: 150 },
  ]);
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const exchangeRate = currency === 'EUR' ? 0.92 : 1;

  const addBook = () => {
    setBooks(prev => [...prev, {
      id: `book-${Date.now()}`,
      title: `Livre ${prev.length + 1}`,
      price: 4.99, pages: 200, salesPerDay: 1,
      format: 'ebook', enrolledKU: false, kuPagesRead: 0,
    }]);
  };

  const updateBook = (id: string, field: keyof BookEntry, value: any) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBook = (id: string) => setBooks(prev => prev.filter(b => b.id !== id));

  const totals = useMemo(() => {
    return books.reduce((acc, book) => {
      const r = calculateRoyalty(book);
      return {
        daily: acc.daily + r.daily,
        monthly: acc.monthly + r.monthly,
        yearly: acc.yearly + r.yearly,
        kuMonthly: acc.kuMonthly + r.kuMonthly,
      };
    }, { daily: 0, monthly: 0, yearly: 0, kuMonthly: 0 });
  }, [books]);

  const fmt = (n: number) => `${(n * exchangeRate).toFixed(2)} ${currency === 'EUR' ? '€' : '$'}`;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10"><DollarSign className="h-6 w-6 text-primary" /></div>
            Dashboard Revenus & Royalties KDP
            <Badge className="bg-primary/10 text-primary border-primary/30">FINANCE</Badge>
          </CardTitle>
          <CardDescription>Calculez vos revenus KDP en temps réel : ebooks, paperback, Kindle Unlimited</CardDescription>
        </CardHeader>
      </Card>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="pt-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <div className="text-2xl font-black text-green-600 dark:text-green-400">{fmt(totals.daily)}</div>
            <div className="text-xs text-muted-foreground">/ jour</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="pt-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{fmt(totals.monthly)}</div>
            <div className="text-xs text-muted-foreground">/ mois</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="pt-4 text-center">
            <PiggyBank className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{fmt(totals.yearly)}</div>
            <div className="text-xs text-muted-foreground">/ an</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardContent className="pt-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{fmt(totals.kuMonthly)}</div>
            <div className="text-xs text-muted-foreground">KU / mois</div>
          </CardContent>
        </Card>
      </div>

      {/* Currency switch */}
      <div className="flex justify-end">
        <Select value={currency} onValueChange={(v: any) => setCurrency(v)}>
          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
            <SelectItem value="USD">🇺🇸 USD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Books */}
      <div className="space-y-4">
        {books.map((book) => {
          const royalty = calculateRoyalty(book);
          return (
            <Card key={book.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-4 space-y-4">
                <div className="flex gap-3 items-center">
                  <Input value={book.title} onChange={e => updateBook(book.id, 'title', e.target.value)} className="font-semibold flex-1" />
                  <Badge variant="outline">{fmt(royalty.monthly)}/mois</Badge>
                  <Button variant="ghost" size="icon" onClick={() => removeBook(book.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Prix</Label>
                    <Input type="number" step="0.01" value={book.price} onChange={e => updateBook(book.id, 'price', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pages</Label>
                    <Input type="number" value={book.pages} onChange={e => updateBook(book.id, 'pages', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ventes/jour</Label>
                    <Input type="number" value={book.salesPerDay} onChange={e => updateBook(book.id, 'salesPerDay', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Format</Label>
                    <Select value={book.format} onValueChange={v => updateBook(book.id, 'format', v)}>
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ebook">📱 eBook</SelectItem>
                        <SelectItem value="paperback">📖 Paperback</SelectItem>
                        <SelectItem value="hardcover">📕 Hardcover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pages KU lues</Label>
                    <Input type="number" value={book.kuPagesRead} onChange={e => updateBook(book.id, 'kuPagesRead', parseInt(e.target.value) || 0)} disabled={!book.enrolledKU} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={book.enrolledKU} onChange={e => updateBook(book.id, 'enrolledKU', e.target.checked)} className="rounded" />
                    Kindle Unlimited
                  </label>
                  <span>Royalty/vente: <strong className="text-foreground">{fmt(royalty.perSale)}</strong></span>
                  {royalty.printCost > 0 && <span>Coût impression: {fmt(royalty.printCost)}</span>}
                  <span>Jour: <strong className="text-foreground">{fmt(royalty.daily)}</strong></span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button onClick={addBook} variant="outline" className="w-full"><Plus className="h-4 w-4 mr-2" /> Ajouter un livre</Button>
      </div>

      {/* Projection */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Projection 12 mois</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[3, 6, 9, 12].map(months => (
              <div key={months} className="space-y-1">
                <div className="text-xs text-muted-foreground">{months} mois</div>
                <div className="text-lg font-bold">{fmt(totals.monthly * months)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookRoyaltyDashboard;
