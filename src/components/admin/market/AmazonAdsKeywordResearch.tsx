import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Megaphone, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { MARKETPLACES, callMarketAI } from './marketShared';

/** Outil 10 — Recherche Mots-clés Amazon Ads. */
const AmazonAdsKeywordResearch: React.FC = () => {
  const { apiKey } = useOpenAIConfig();
  const [marketplace, setMarketplace] = useState('fr');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!topic.trim()) { toast.error('Décrivez le sujet du livre'); return; }
    setLoading(true); setData(null);
    try { setData(await callMarketAI('ads-keywords', topic.trim(), marketplace, apiKey)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const copyList = (arr: string[]) => { navigator.clipboard.writeText(arr.join('\n')); toast.success('Copié'); };

  const block = (title: string, arr: string[], variant: any = 'secondary') => arr?.length > 0 && (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">{title} ({arr.length})</CardTitle>
        <Button size="sm" variant="ghost" onClick={() => copyList(arr)}><Copy className="h-3.5 w-3.5" /></Button>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">{arr.map((k, i) => <Badge key={i} variant={variant}>{k}</Badge>)}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-5 w-5" /> Mots-clés Amazon Ads</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="Sujet du livre — ex : développement personnel confiance" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {data.suggestedBid && <p className="text-sm text-muted-foreground">Enchère suggérée : <strong>{data.suggestedBid}</strong></p>}
          {block('Exact', data.exact)}
          {block('Phrase', data.phrase)}
          {block('Large (broad)', data.broad)}
          {block('Mots-clés négatifs', data.negative, 'outline')}
        </>
      )}
    </div>
  );
};

export default AmazonAdsKeywordResearch;
