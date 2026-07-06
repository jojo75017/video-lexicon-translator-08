import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, MessageSquareText, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { MARKETPLACES, callMarketAI } from './marketShared';

/** Outil 8 — Analyse d'Avis Concurrents. */
const CompetitorReviewAnalyzer: React.FC = () => {
  const { apiKey } = useOpenAIConfig();
  const [marketplace, setMarketplace] = useState('fr');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!niche.trim()) { toast.error('Entrez une niche ou un titre concurrent'); return; }
    setLoading(true); setData(null);
    try { setData(await callMarketAI('review-analysis', niche.trim(), marketplace, apiKey)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const list = (title: string, arr: string[], Icon: any, color: string) => arr?.length > 0 && (
    <Card>
      <CardHeader><CardTitle className={`text-sm flex items-center gap-2 ${color}`}><Icon className="h-4 w-4" /> {title}</CardTitle></CardHeader>
      <CardContent><ul className="list-disc pl-5 text-sm space-y-1">{arr.map((x, i) => <li key={i}>{x}</li>)}</ul></CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquareText className="h-5 w-5" /> Analyse d'avis concurrents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="Niche ou titre concurrent" value={niche} onChange={(e) => setNiche(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {data.summary && <p className="text-sm text-muted-foreground italic">{data.summary}</p>}
          {list('Ce que les lecteurs adorent', data.loved, ThumbsUp, 'text-emerald-600')}
          {list('Ce qu\'ils reprochent', data.complaints, ThumbsDown, 'text-rose-600')}
          {list('Manques à combler (votre opportunité)', data.gaps, Lightbulb, 'text-amber-600')}
          {list('Comment vous différencier', data.differentiation, Lightbulb, 'text-primary')}
        </>
      )}
    </div>
  );
};

export default CompetitorReviewAnalyzer;
