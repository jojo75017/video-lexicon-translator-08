import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { MARKETPLACES, callMarketAI } from './marketShared';

/** Outil 3 — Recherche de Mots-clés Amazon. */
const KeywordExplorerAmazon: React.FC = () => {
  const { apiKey } = useOpenAIConfig();
  const [marketplace, setMarketplace] = useState('fr');
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    if (!seed.trim()) { toast.error('Entrez un mot-clé de départ'); return; }
    setLoading(true); setData(null);
    try {
      const d = await callMarketAI('keyword-explorer', seed.trim(), marketplace, apiKey);
      setData(d);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const compColor = (c: string) => c?.includes('faible') ? 'text-emerald-600' : c?.includes('moyen') ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-5 w-5" /> Recherche de mots-clés</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{MARKETPLACES.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input className="flex-1 min-w-[200px]" placeholder="Mot-clé de départ — ex : recette cétogène" value={seed} onChange={(e) => setSeed(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && run()} />
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          <Card>
            <CardHeader><CardTitle className="text-sm">Mots-clés & concurrence</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground border-b">
                    <th className="py-2">Mot-clé</th><th>Volume</th><th>Concurrence</th><th>Score</th>
                  </tr></thead>
                  <tbody>
                    {(data.keywords || []).map((k: any, i: number) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{k.keyword}</td>
                        <td>{k.volume}</td>
                        <td className={compColor(k.competition)}>{k.competition}</td>
                        <td><Badge variant="secondary">{k.score}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {data.longtail?.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm">Longue traîne</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">{data.longtail.map((k: string, i: number) => <Badge key={i} variant="outline">{k}</Badge>)}</CardContent>
            </Card>
          )}
          {data.questions?.length > 0 && (
            <Card><CardHeader><CardTitle className="text-sm">Questions des lecteurs</CardTitle></CardHeader>
              <CardContent><ul className="list-disc pl-5 text-sm space-y-1">{data.questions.map((q: string, i: number) => <li key={i}>{q}</li>)}</ul></CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default KeywordExplorerAmazon;
