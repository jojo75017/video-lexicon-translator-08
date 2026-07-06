import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, Plus, Trash2, RefreshCw, Star } from 'lucide-react';
import { toast } from 'sonner';
import { MARKETPLACES, fetchAmazonBook, fmtEur, fmtNum } from './marketShared';

interface Snap { date: string; bsr: number | null; price: number | null; reviews: number | null; rating: number | null; }
interface Comp { id: string; asin: string; title: string; marketplace: string; history: Snap[]; }

const KEY = 'v3_competitor_tracker';
const load = (): Comp[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (d: Comp[]) => localStorage.setItem(KEY, JSON.stringify(d));

/** Outil 9 — Suivi de Concurrents : snapshots BSR / avis / prix dans le temps. */
const CompetitorTracker: React.FC = () => {
  const [items, setItems] = useState<Comp[]>(load);
  const [asin, setAsin] = useState('');
  const [marketplace, setMarketplace] = useState('fr');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => save(items), [items]);

  const add = async () => {
    if (!asin.trim()) { toast.error('Entrez un ASIN'); return; }
    const id = crypto.randomUUID();
    setBusy(id);
    try {
      const b = await fetchAmazonBook(asin.trim(), marketplace);
      setItems((p) => [{ id, asin: b.asin, title: b.title, marketplace, history: [{ date: new Date().toISOString(), bsr: b.bsr, price: b.price, reviews: b.reviews, rating: b.rating }] }, ...p]);
      setAsin('');
      toast.success('Concurrent ajouté');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  const refresh = async (item: Comp) => {
    setBusy(item.id);
    try {
      const b = await fetchAmazonBook(item.asin, item.marketplace);
      setItems((p) => p.map((x) => x.id === item.id ? { ...x, title: b.title || x.title, history: [...x.history, { date: new Date().toISOString(), bsr: b.bsr, price: b.price, reviews: b.reviews, rating: b.rating }].slice(-30) } : x));
      toast.success('Mis à jour');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5" /> Suivi de concurrents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <Input placeholder="ASIN concurrent" value={asin} onChange={(e) => setAsin(e.target.value)} />
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={add} disabled={!!busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {items.map((item) => {
        const last = item.history[item.history.length - 1];
        const prev = item.history[item.history.length - 2];
        const bsrTrend = last?.bsr && prev?.bsr ? prev.bsr - last.bsr : 0;
        return (
          <Card key={item.id}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => refresh(item)} disabled={busy === item.id}>{busy === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">BSR #{fmtNum(last?.bsr)}{bsrTrend !== 0 && <span className={bsrTrend > 0 ? 'text-emerald-600 ml-1' : 'text-rose-600 ml-1'}>{bsrTrend > 0 ? '▲' : '▼'}</span>}</Badge>
                <Badge variant="secondary">{fmtEur(last?.price)}</Badge>
                <Badge variant="secondary">{fmtNum(last?.reviews)} avis</Badge>
                {last?.rating != null && <Badge variant="secondary" className="gap-1">{last.rating} <Star className="h-3 w-3 fill-amber-500 text-amber-500" /></Badge>}
                <span className="text-muted-foreground self-center">{item.history.length} relevé(s) · {item.asin}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Ajoutez des ASIN concurrents pour suivre l'évolution de leur BSR, prix et avis.</p>}
    </div>
  );
};

export default CompetitorTracker;
