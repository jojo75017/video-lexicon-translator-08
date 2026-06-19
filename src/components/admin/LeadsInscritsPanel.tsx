import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Users, Gift, Mail, RefreshCw, Flame } from 'lucide-react';

interface FunnelLead {
  id: string;
  email: string;
  first_name: string | null;
  lead_magnet: string | null;
  utm_source: string | null;
  created_at: string;
  lead_magnet_sent_at: string | null;
}

interface SequenceRow {
  email: string;
  sequence_name: string;
  current_step: number;
  completed: boolean;
  unsubscribed: boolean;
}

type Segment = 'expat' | 'general';
type SeqStatus = 'in_progress' | 'completed' | 'unsubscribed' | 'none';

const EXPAT_SEQUENCES = ['expat_funnel', 'expat_reactivation'];

const PERIODS = [
  { key: '7', label: '7 jours' },
  { key: '30', label: '30 jours' },
  { key: 'all', label: 'Tout' },
];

const LeadsInscritsPanel: React.FC = () => {
  const [leads, setLeads] = useState<FunnelLead[]>([]);
  const [sequences, setSequences] = useState<Record<string, SequenceRow>>({});
  const [openedSet, setOpenedSet] = useState<Set<string>>(new Set());
  const [clickedSet, setClickedSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [segmentFilter, setSegmentFilter] = useState<'all' | Segment>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | SeqStatus>('all');
  const [period, setPeriod] = useState('30');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const since = period === 'all'
      ? null
      : new Date(Date.now() - parseInt(period, 10) * 86400000).toISOString();

    let q = (supabase as any)
      .from('funnel_leads')
      .select('id, email, first_name, lead_magnet, utm_source, created_at, lead_magnet_sent_at')
      .order('created_at', { ascending: false });
    if (since) q = q.gte('created_at', since);
    const { data: leadData } = await q;
    setLeads((leadData || []) as FunnelLead[]);

    const { data: seqData } = await (supabase as any)
      .from('email_sequences')
      .select('email, sequence_name, current_step, completed, unsubscribed');
    const seqMap: Record<string, SequenceRow> = {};
    for (const row of (seqData || []) as SequenceRow[]) {
      seqMap[(row.email || '').toLowerCase().trim()] = row;
    }
    setSequences(seqMap);

    const { data: opens } = await (supabase as any)
      .from('email_opens')
      .select('prospect_email');
    setOpenedSet(new Set((opens || []).map((r: any) => (r.prospect_email || '').toLowerCase().trim())));

    const { data: clicks } = await (supabase as any)
      .from('email_clicks')
      .select('prospect_email');
    setClickedSet(new Set((clicks || []).map((r: any) => (r.prospect_email || '').toLowerCase().trim())));

    setLoading(false);
  }, [period]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getSegment = useCallback((lead: FunnelLead): Segment => {
    if (lead.lead_magnet === 'publier-kdp-etranger') return 'expat';
    const seq = sequences[lead.email.toLowerCase().trim()];
    if (seq && EXPAT_SEQUENCES.includes(seq.sequence_name)) return 'expat';
    return 'general';
  }, [sequences]);

  const getStatus = useCallback((lead: FunnelLead): SeqStatus => {
    const seq = sequences[lead.email.toLowerCase().trim()];
    if (!seq) return 'none';
    if (seq.unsubscribed) return 'unsubscribed';
    if (seq.completed) return 'completed';
    return 'in_progress';
  }, [sequences]);

  const enriched = useMemo(() => leads.map((l) => {
    const key = l.email.toLowerCase().trim();
    return {
      ...l,
      segment: getSegment(l),
      status: getStatus(l),
      seq: sequences[key],
      opened: openedSet.has(key),
      clicked: clickedSet.has(key),
    };
  }), [leads, getSegment, getStatus, sequences, openedSet, clickedSet]);

  const filtered = useMemo(() => enriched.filter((l) =>
    (segmentFilter === 'all' || l.segment === segmentFilter) &&
    (statusFilter === 'all' || l.status === statusFilter)
  ), [enriched, segmentFilter, statusFilter]);

  const total = enriched.length;
  const expatCount = enriched.filter((l) => l.segment === 'expat').length;
  const expatPct = total ? Math.round((expatCount / total) * 100) : 0;
  const inProgress = enriched.filter((l) => l.status === 'in_progress').length;
  const finishedNoBuy = enriched.filter((l) => l.status === 'completed').length;
  const hot = enriched.filter((l) => l.clicked).length;

  const statusBadge = (s: SeqStatus) => {
    switch (s) {
      case 'in_progress': return <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30">En cours</Badge>;
      case 'completed': return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/30">Terminée</Badge>;
      case 'unsubscribed': return <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/30">Désinscrit</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground">Pas de séquence</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-foreground/70" />
            <div className="text-2xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Inscrits</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border ring-1 ring-primary/30">
          <CardContent className="p-4 text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{expatPct}%</div>
            <div className="text-xs text-muted-foreground">🌍 Expatriés ({expatCount})</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Mail className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <div className="text-2xl font-bold text-foreground">{inProgress}</div>
            <div className="text-xs text-muted-foreground">Séquence en cours</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <Gift className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-foreground">{finishedNoBuy}</div>
            <div className="text-xs text-muted-foreground">Terminée sans achat</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border ring-1 ring-orange-500/40">
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-orange-500">{hot}</div>
            <div className="text-xs text-muted-foreground">🔥 Chauds (ont cliqué)</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground mr-1">Segment :</span>
        {(['all', 'expat', 'general'] as const).map((s) => (
          <Button key={s} size="sm" variant={segmentFilter === s ? 'default' : 'outline'} onClick={() => setSegmentFilter(s)}>
            {s === 'all' ? 'Tous' : s === 'expat' ? '🌍 Expatriés' : 'Général'}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground mx-1">Statut :</span>
        {([
          ['all', 'Tous'], ['in_progress', 'En cours'], ['completed', 'Terminée'], ['unsubscribed', 'Désinscrit'], ['none', 'Sans séq.'],
        ] as const).map(([s, label]) => (
          <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s as any)}>
            {label}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground mx-1">Période :</span>
        {PERIODS.map((p) => (
          <Button key={p.key} size="sm" variant={period === p.key ? 'default' : 'outline'} onClick={() => setPeriod(p.key)}>
            {p.label}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={fetchAll} className="ml-auto">
          <RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucun inscrit pour ces filtres.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Segment</th>
                  <th className="p-3 font-medium">Séquence</th>
                  <th className="p-3 font-medium">Étape</th>
                  <th className="p-3 font-medium">Statut</th>
                  <th className="p-3 font-medium">Engagement</th>
                  <th className="p-3 font-medium">Source</th>
                  <th className="p-3 font-medium">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 text-foreground">{l.email}</td>
                    <td className="p-3">
                      {l.segment === 'expat'
                        ? <Badge className="bg-primary/15 text-primary border-primary/30">🌍 Expatrié</Badge>
                        : <Badge variant="outline">Général</Badge>}
                    </td>
                    <td className="p-3 text-muted-foreground">{l.seq?.sequence_name || '—'}</td>
                    <td className="p-3 text-muted-foreground">{l.seq ? `${l.seq.current_step}` : '—'}</td>
                    <td className="p-3">{statusBadge(l.status)}</td>
                    <td className="p-3">
                      <span className="flex gap-1">
                        {l.clicked ? <span title="A cliqué">🔥</span> : l.opened ? <span title="A ouvert">👀</span> : <span className="text-muted-foreground">—</span>}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{l.utm_source || 'direct'}</td>
                    <td className="p-3 text-muted-foreground">{new Date(l.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsInscritsPanel;
