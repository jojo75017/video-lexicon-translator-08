import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Segment = 'actif' | 'dormant' | 'exclu';
const SEGMENTS: Segment[] = ['actif', 'dormant', 'exclu'];

/** Compteurs et filtre du segment de lancement des prospects. */
export default function ProspectSegmentsPanel() {
  const [counts, setCounts] = useState<Record<Segment, number | null>>({ actif: null, dormant: null, exclu: null });
  const [filter, setFilter] = useState<Segment>('actif');
  const [rows, setRows] = useState<{ email: string; first_name: string | null; status: string | null }[]>([]);

  useEffect(() => {
    SEGMENTS.forEach(async (s) => {
      const { count } = await supabase.from('sales_prospects').select('id', { count: 'exact', head: true }).eq('segment_lancement', s);
      setCounts((c) => ({ ...c, [s]: count ?? 0 }));
    });
  }, []);

  useEffect(() => {
    supabase.from('sales_prospects').select('email, first_name, status').eq('segment_lancement', filter)
      .order('email').limit(200).then(({ data }) => setRows(data ?? []));
  }, [filter]);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Segments de lancement</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {SEGMENTS.map((s) => (
            <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)} : {counts[s] ?? '…'}
            </Button>
          ))}
        </div>
        <div className="max-h-72 overflow-y-auto rounded-md border text-sm">
          {rows.map((r) => (
            <div key={r.email} className="flex justify-between border-b px-3 py-1.5 last:border-0">
              <span>{r.email}</span><span className="text-muted-foreground">{r.first_name || ''} {r.status === 'bounced' ? '· rejetée' : ''}</span>
            </div>
          ))}
          {rows.length === 200 && <p className="px-3 py-1.5 text-xs text-muted-foreground">200 premières adresses affichées.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
