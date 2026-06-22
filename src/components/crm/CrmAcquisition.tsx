import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { Eye, MousePointerClick, UserPlus, Percent, RefreshCw, Download, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

type Period = '24h' | '7d' | '30d' | 'all';

const periodToDate = (p: Period): Date | null => {
  const now = Date.now();
  if (p === '24h') return new Date(now - 24 * 3600 * 1000);
  if (p === '7d') return new Date(now - 7 * 24 * 3600 * 1000);
  if (p === '30d') return new Date(now - 30 * 24 * 3600 * 1000);
  return null;
};

const downloadCSV = (filename: string, rows: any[]) => {
  if (!rows.length) { toast.info('Aucune donnée à exporter'); return; }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => {
      const v = r[h];
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    }).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const fmtDate = (d?: string | null) =>
  d ? format(new Date(d), 'dd MMM HH:mm', { locale: fr }) : '—';

export const CrmAcquisition: React.FC = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const [events, setEvents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const since = periodToDate(period);
      let evQ = supabase.from('capture_events').select('*').order('created_at', { ascending: false }).limit(20000);
      let ldQ = supabase.from('funnel_leads').select('*').order('created_at', { ascending: false }).limit(20000);
      if (since) {
        evQ = evQ.gte('created_at', since.toISOString());
        ldQ = ldQ.gte('created_at', since.toISOString());
      }
      const [ev, ld] = await Promise.all([evQ, ldQ]);
      if (ev.error) throw ev.error;
      if (ld.error) throw ld.error;
      setEvents(ev.data || []);
      setLeads(ld.data || []);
    } catch (e: any) {
      toast.error('Erreur de chargement : ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [period]);

  // Realtime : nouvelles vues/clics
  useEffect(() => {
    const channel = supabase
      .channel('capture_events_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'capture_events' },
        (payload) => setEvents((prev) => [payload.new, ...prev]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const views = useMemo(() => events.filter(e => e.event_type === 'view'), [events]);
  const clicks = useMemo(() => events.filter(e => e.event_type === 'click'), [events]);

  const totalViews = views.length;
  const totalClicks = clicks.length;
  const totalLeads = leads.length;
  const clickRate = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;
  const convRate = totalViews ? Math.round((totalLeads / totalViews) * 1000) / 10 : 0;

  // Entonnoir par surface
  const bySurface = useMemo(() => {
    const surfaces = ['popup', 'sticky', 'demo', 'inline', 'cadeau'];
    return surfaces.map(s => {
      const v = views.filter(e => e.surface === s).length;
      const c = clicks.filter(e => e.surface === s).length;
      return { name: s, vues: v, clics: c };
    }).filter(d => d.vues > 0 || d.clics > 0);
  }, [views, clicks]);

  // Comparatif A/B
  const abData = useMemo(() => {
    const calc = (variant: 'A' | 'B') => {
      const v = views.filter(e => e.ab_variant === variant).length;
      const l = leads.filter(e => e.ab_variant === variant).length;
      return { variant, vues: v, inscrits: l, taux: v ? Math.round((l / v) * 1000) / 10 : 0 };
    };
    return [calc('A'), calc('B')];
  }, [views, leads]);

  const abWinner = useMemo(() => {
    const [a, b] = abData;
    if (a.vues < 5 && b.vues < 5) return null;
    if (a.taux === b.taux) return null;
    return a.taux > b.taux ? 'A' : 'B';
  }, [abData]);

  // Inscrits par jour (30 jours)
  const timeline = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      days[d.toISOString().split('T')[0]] = 0;
    }
    leads.forEach(l => {
      const day = l.created_at?.split('T')[0];
      if (day && days[day] !== undefined) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date: date.slice(5), inscrits: count }));
  }, [leads]);

  // Répartition par source UTM
  const sources = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.utm_source || 'direct';
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [leads]);

  // Répartition par lead magnet
  const magnets = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => {
      const m = l.lead_magnet || 'non précisé';
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Filtres période */}
      <div className="flex flex-wrap items-center gap-2">
        {(['24h', '7d', '30d', 'all'] as Period[]).map(p => (
          <Button key={p} size="sm" variant={period === p ? 'default' : 'outline'} onClick={() => setPeriod(p)}>
            {p === '24h' ? '24 h' : p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : 'Tout'}
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={fetchAll} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadCSV('inscrits.csv', leads)}>
          <Download className="h-4 w-4 mr-1" /> Export inscrits
        </Button>
      </div>

      {/* Entonnoir KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<Eye className="h-5 w-5" />} label="Vues (popup + bandeau)" value={String(totalViews)} color="text-blue-500" />
        <KpiCard icon={<MousePointerClick className="h-5 w-5" />} label="Clics formulaire" value={`${totalClicks} · ${clickRate}%`} color="text-amber-500" />
        <KpiCard icon={<UserPlus className="h-5 w-5" />} label="Inscrits" value={String(totalLeads)} color="text-emerald-500" />
        <KpiCard icon={<Percent className="h-5 w-5" />} label="Taux conversion global" value={`${convRate}%`} color="text-primary" />
      </div>

      {/* Comparatif A/B */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Comparatif A/B
            {abWinner && (
              <Badge className="gap-1"><Trophy className="h-3 w-3" /> Variante {abWinner} gagne</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {abData.map(d => (
              <div key={d.variant} className={`rounded-lg border p-4 ${abWinner === d.variant ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="text-sm font-semibold mb-2">Variante {d.variant}</div>
                <div className="text-2xl font-bold">{d.taux}%</div>
                <div className="text-xs text-muted-foreground">{d.inscrits} inscrits · {d.vues} vues</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entonnoir par surface + Inscrits par jour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Vues vs clics par élément</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bySurface}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clics" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Inscrits par jour (30 j)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="inscrits" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sources + Lead magnets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Sources d'inscription (UTM)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Inscrits par guide</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={magnets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Liste brute des inscrits récents */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Derniers inscrits</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Variante</th>
                <th className="py-2 pr-4">Guide</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 50).map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{l.email}</td>
                  <td className="py-2 pr-4">{l.utm_source || 'direct'}</td>
                  <td className="py-2 pr-4">{l.ab_variant ? <Badge variant="outline">{l.ab_variant}</Badge> : '—'}</td>
                  <td className="py-2 pr-4">{l.lead_magnet || '—'}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{fmtDate(l.created_at)}</td>
                </tr>
              ))}
              {!leads.length && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Aucun inscrit sur la période</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <Card>
    <CardContent className="pt-4 pb-3 px-4">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

export default CrmAcquisition;
