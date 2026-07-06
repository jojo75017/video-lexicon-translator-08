import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { MARKETPLACES, callMarketAI } from './marketShared';

/** Outil 6 — Analyse & Score de Niche. */
const NicheScorecard: React.FC = () => {
  const { apiKey } = useOpenAIConfig();
  const [marketplace, setMarketplace] = useState('fr');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!niche.trim()) { toast.error('Entrez une niche'); return; }
    setLoading(true); setData(null);
    try { setData(await callMarketAI('niche-score', niche.trim(), marketplace, apiKey)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const bar = (label: string, val: number, invert = false) => {
    const good = invert ? 100 - val : val;
    const color = good >= 66 ? 'text-emerald-600' : good >= 40 ? 'text-amber-600' : 'text-rose-600';
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm"><span>{label}</span><span className={`font-semibold ${color}`}>{val}/100</span></div>
        <Progress value={val} />
      </div>
    );
  };

  const list = (title: string, arr: string[]) => arr?.length > 0 && (
    <div><p className="text-sm font-medium mb-1">{title}</p><ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">{arr.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gauge className="h-5 w-5" /> Score de niche</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="Niche à évaluer" value={niche} onChange={(e) => setNiche(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2">{data.niche} <Badge>{data.profitability}/100 rentabilité</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {bar('Rentabilité', data.profitability)}
            {bar('Demande', data.demand)}
            {bar('Concurrence (moins = mieux)', data.competition)}
            {bar('Barrière à l\'entrée', data.barrier)}
            {data.verdict && <p className="text-sm bg-muted p-3 rounded-lg">{data.verdict}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {list('Opportunités', data.opportunities)}
              {list('Risques', data.risks)}
              {list('Angles suggérés', data.suggestedAngles)}
              {data.keywords?.length > 0 && (
                <div><p className="text-sm font-medium mb-1">Mots-clés</p><div className="flex flex-wrap gap-1.5">{data.keywords.map((k: string, i: number) => <Badge key={i} variant="outline">{k}</Badge>)}</div></div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NicheScorecard;
