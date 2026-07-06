import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Repeat, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { MARKETPLACES, extractAsinKeywords } from './marketShared';

/** Outil 5 — Reverse ASIN : mots-clés extraits d'une fiche produit Amazon. */
const ReverseAsin: React.FC = () => {
  const [marketplace, setMarketplace] = useState('fr');
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!asin.trim()) { toast.error('Entrez un ASIN'); return; }
    setLoading(true); setData(null);
    try { setData(await extractAsinKeywords(asin.trim(), marketplace)); toast.success('Mots-clés extraits'); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const copyBackend = () => {
    const s = (data?.suggestedBackendKeywords || []).join(', ');
    navigator.clipboard.writeText(s); toast.success('Mots-clés backend copiés');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Repeat className="h-5 w-5" /> Reverse ASIN</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="ASIN concurrent — ex : B0CXXXXXXX" value={asin} onChange={(e) => setAsin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {data.phraseKeywords?.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm">Expressions clés</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">{data.phraseKeywords.slice(0, 30).map((k: any, i: number) => <Badge key={i} variant="secondary">{k.phrase}</Badge>)}</CardContent>
            </Card>
          )}
          {data.singleKeywords?.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm">Mots-clés uniques</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">{data.singleKeywords.slice(0, 40).map((k: any, i: number) => <Badge key={i} variant="outline">{k.word}</Badge>)}</CardContent>
            </Card>
          )}
          {data.suggestedBackendKeywords?.length > 0 && (
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm">Mots-clés backend suggérés</CardTitle>
                <Button size="sm" variant="ghost" onClick={copyBackend}><Copy className="h-3.5 w-3.5" /></Button>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">{data.suggestedBackendKeywords.map((k: string, i: number) => <Badge key={i}>{k}</Badge>)}</CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ReverseAsin;
