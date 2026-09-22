import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Gift, MousePointerClick, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { supabase } from '@/integrations/supabase/client';

/**
 * Tableau de bord du tunnel de la page d'avant-première V3 (/v3).
 * Lecture seule : visites → clics « Réserver ma place » → réservations email.
 */

const RESERVATION_SOURCE = 'v3-reservation';

type DayRow = { jour: string; visites: number; clics: number; reservations: number };

const dayKey = (iso: string) => iso.slice(0, 10);

const formatDay = (key: string) => {
  const [y, m, d] = key.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};

const rate = (numerator: number, denominator: number) =>
  denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)} %` : '—';

export default function AdminTunnelV3Page() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visites, setVisites] = useState(0);
  const [clics, setClics] = useState(0);
  const [reservations, setReservations] = useState(0);
  const [jours, setJours] = useState<DayRow[]>([]);
  const [majLe, setMajLe] = useState<Date | null>(null);

  const charger = useCallback(async (silencieux = false) => {
    setLoading(true);
    try {
      const [{ data: events, error: evErr }, { data: leads, error: leadErr }] = await Promise.all([
        supabase
          .from('capture_events')
          .select('event_type, created_at')
          .eq('surface', 'v3')
          .in('event_type', ['page_view', 'reserve_open'])
          .order('created_at', { ascending: false })
          .limit(5000),
        supabase
          .from('funnel_leads')
          .select('created_at')
          .eq('source' as never, RESERVATION_SOURCE)
          .order('created_at', { ascending: false })
          .limit(5000),
      ]);
      if (evErr) throw evErr;
      if (leadErr) throw leadErr;

      const parJour = new Map<string, DayRow>();
      const ligne = (key: string) => {
        const existing = parJour.get(key);
        if (existing) return existing;
        const created: DayRow = { jour: key, visites: 0, clics: 0, reservations: 0 };
        parJour.set(key, created);
        return created;
      };

      let nbVisites = 0;
      let nbClics = 0;
      (events || []).forEach((e) => {
        const row = ligne(dayKey(e.created_at as string));
        if (e.event_type === 'page_view') {
          nbVisites += 1;
          row.visites += 1;
        } else {
          nbClics += 1;
          row.clics += 1;
        }
      });

      const nbReservations = (leads || []).length;
      (leads || []).forEach((l) => {
        ligne(dayKey((l as { created_at: string }).created_at)).reservations += 1;
      });

      setVisites(nbVisites);
      setClics(nbClics);
      setReservations(nbReservations);
      setJours(
        Array.from(parJour.values())
          .sort((a, b) => (a.jour < b.jour ? 1 : -1))
          .slice(0, 14),
      );
    } catch (e) {
      console.error('Tunnel V3 — chargement impossible', e);
      toast.error('Impossible de charger les chiffres du tunnel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void charger();
  }, [charger]);

  const etapes = useMemo(
    () => [
      {
        icon: Eye,
        label: 'Visites de la page /v3',
        valeur: visites,
        detail: 'Pages vues de l’avant-première',
      },
      {
        icon: MousePointerClick,
        label: 'Clics « Réserver ma place »',
        valeur: clics,
        detail: 'Ouvertures du formulaire',
      },
      {
        icon: Gift,
        label: 'Réservations (emails)',
        valeur: reservations,
        detail: 'Inscriptions venues de /v3',
      },
    ],
    [visites, clics, reservations],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <AdminPanelNav />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-foreground md:text-2xl">
            <TrendingUp className="h-5 w-5" /> Tunnel de l’avant-première V3
          </h1>
          <p className="text-sm text-muted-foreground">
            Où ça bloque entre le trafic de la page /v3 et les réservations. Lecture seule.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <Button onClick={() => void charger()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Rafraîchir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {etapes.map((etape, index) => (
          <Card key={etape.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Étape {index + 1}
              </p>
              <etape.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{etape.valeur}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{etape.label}</p>
            <p className="text-xs text-muted-foreground">{etape.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm font-semibold text-foreground">Visites → clics</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{rate(clics, visites)}</p>
          <p className="text-xs text-muted-foreground">
            Part des visiteurs qui ouvrent le formulaire de réservation.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-foreground">Clics → réservations</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{rate(reservations, clics)}</p>
          <p className="text-xs text-muted-foreground">
            Part des formulaires ouverts qui aboutissent à un email laissé.
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">Évolution par jour (14 derniers jours actifs)</p>
          <Badge variant="secondary">{jours.length} jours</Badge>
        </div>
        {jours.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {loading ? 'Chargement…' : 'Aucun chiffre pour le moment. Les visites s’enregistrent dès la prochaine ouverture de la page /v3.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">Jour</th>
                  <th className="py-2 pr-3">Visites</th>
                  <th className="py-2 pr-3">Clics</th>
                  <th className="py-2 pr-3">Réservations</th>
                  <th className="py-2">Visites → réservations</th>
                </tr>
              </thead>
              <tbody>
                {jours.map((j) => (
                  <tr key={j.jour} className="border-b border-border/50">
                    <td className="py-2 pr-3 font-medium text-foreground">{formatDay(j.jour)}</td>
                    <td className="py-2 pr-3 tabular-nums">{j.visites}</td>
                    <td className="py-2 pr-3 tabular-nums">{j.clics}</td>
                    <td className="py-2 pr-3 tabular-nums">{j.reservations}</td>
                    <td className="py-2 tabular-nums">{rate(j.reservations, j.visites)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
