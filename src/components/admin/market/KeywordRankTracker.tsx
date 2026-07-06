import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LineChart, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { MARKETPLACES, searchAmazonNiche } from './marketShared';

interface Snapshot { date: string; position: number | null; }
interface TrackedKw { id: string; keyword: string; asin: string; marketplace: string; history: Snapshot[]; }

const KEY = 'v3_keyword_rank_tracker';
const load = (): TrackedKw[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (d: TrackedKw[]) => localStorage.setItem(KEY, JSON.stringify(d));

/** Outil 4 — Rank Tracker : suit la position d'un livre sur un mot-clé Amazon. */
const KeywordRankTracker: React.FC = () => {
  const [items, setItems] = useState<TrackedKw[]>(load);
  const [keyword, setKeyword] = useState('');
  const [asin, setAsin] = useState('');
  const [marketplace, setMarketplace] = useState('fr');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => save(items), [items]);

  const check = async (kw: string, targetAsin: string, mkt: string): Promise<number | null> => {
    const results = await searchAmazonNiche(kw, mkt);
    const idx = results.findIndex((r) => (r.asin || '').toUpperCase() === targetAsin.toUpperCase());
    return idx >= 0 ? idx + 1 : null;
  };

  const add = async () => {
    if (!keyword.trim() || !asin.trim()) { toast.error('Mot-clé et ASIN requis'); return; }
    const id = crypto.randomUUID();
    setBusy(id);
    try {
      const pos = await check(keyword.trim(), asin.trim(), marketplace);
      setItems((p) => [{ id, keyword: keyword.trim(), asin: asin.trim().toUpperCase(), marketplace, history: [{ date: new Date().toISOString(), position: pos }] }, ...p]);
      setKeyword(''); setAsin('');
      toast.success(pos ? `Position actuelle : #${pos}` : 'Livre hors du top résultats');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  const refresh = async (item: TrackedKw) => {
    setBusy(item.id);
    try {
      const pos = await check(item.keyword, item.asin, item.marketplace);
      setItems((p) => p.map((x) => x.id === item.id ? { ...x, history: [...x.history, { date: new Date().toISOString(), position: pos }].slice(-30) } : x));
      toast.success(pos ? `#${pos}` : 'Hors top');
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><LineChart className="h-5 w-5" /> Rank Tracker mots-clés</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
            <Input placeholder="Mot-clé suivi" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <Input placeholder="Votre ASIN" value={asin} onChange={(e) => setAsin(e.target.value)} />
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
        const trend = last?.position && prev?.position ? prev.position - last.position : 0;
        return (
          <Card key={item.id}>
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{item.keyword}</p>
                <p className="text-xs text-muted-foreground">{item.asin} · {item.marketplace.toUpperCase()} · {item.history.length} relevé(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={last?.position ? 'default' : 'secondary'}>{last?.position ? `#${last.position}` : 'Hors top'}</Badge>
                {trend !== 0 && <span className={`text-xs ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{trend > 0 ? `▲${trend}` : `▼${-trend}`}</span>}
                <Button size="icon" variant="ghost" onClick={() => refresh(item)} disabled={busy === item.id}>{busy === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</Button>
                <Button size="icon" variant="ghost" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Ajoutez un mot-clé et votre ASIN pour suivre votre position dans le temps.</p>}
    </div>
  );
};

export default KeywordRankTracker;
