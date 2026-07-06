import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { MARKETPLACES, callMarketAI } from './marketShared';

/** Outil 11 — Vérification de Marques Déposées. */
const TrademarkChecker: React.FC = () => {
  const { apiKey } = useOpenAIConfig();
  const [marketplace, setMarketplace] = useState('fr');
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!term.trim()) { toast.error('Entrez un titre ou un nom'); return; }
    setLoading(true); setData(null);
    try { setData(await callMarketAI('trademark', term.trim(), marketplace, apiKey)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const riskColor = (r: string) => r?.includes('faible') ? 'bg-emerald-100 text-emerald-700' : r?.includes('moyen') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Vérification de marques déposées</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="Titre / nom de série à vérifier" value={term} onChange={(e) => setTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Pré-analyse indicative — ne remplace pas un avis juridique ni une recherche officielle INPI/EUIPO.</p>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2">« {data.term} » <span className={`text-xs px-2 py-0.5 rounded-full ${riskColor(data.riskLevel)}`}>Risque {data.riskLevel}</span></CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.reasoning && <p className="text-muted-foreground">{data.reasoning}</p>}
            {data.recommendations?.length > 0 && (
              <div><p className="font-medium mb-1">Recommandations</p><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{data.recommendations.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div>
            )}
            {data.safeAlternatives?.length > 0 && (
              <div><p className="font-medium mb-1">Alternatives plus sûres</p><div className="flex flex-wrap gap-1.5">{data.safeAlternatives.map((x: string, i: number) => <Badge key={i} variant="outline">{x}</Badge>)}</div></div>
            )}
            <a href={data.officialCheck || 'https://www.tmdn.org/tmview/'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              Vérifier officiellement (TMview) <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrademarkChecker;
