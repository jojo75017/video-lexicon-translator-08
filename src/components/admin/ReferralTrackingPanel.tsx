import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, MousePointerClick, UserPlus, Users } from 'lucide-react';

type Visit = { created_at: string; lead_magnet: string | null };
type Click = { ref_code: string; clicked_at: string; landing_path: string | null };
type Signup = { referred_email: string | null; status: string; created_at: string };

const RANGES = [
  { label: '7 jours', days: 7 },
  { label: '30 jours', days: 30 },
  { label: '90 jours', days: 90 },
] as const;

/**
 * Suivi du parrainage : visites de la page « Mon parrainage », clics sur les
 * liens de parrainage des abonnés et inscriptions issues de ces liens.
 * Lecture seule.
 */
export default function ReferralTrackingPanel() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [subscribers, setSubscribers] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    (async () => {
      setLoading(true);
      const [v, c, s, subs] = await Promise.all([
        supabase
          .from('capture_events')
          .select('created_at, lead_magnet')
          .eq('surface', 'parrainage')
          .eq('event_type', 'view')
          .gte('created_at', since)
          .order('created_at', { ascending: false }),
        supabase
          .from('affiliate_clicks')
          .select('ref_code, clicked_at, landing_path')
          .gte('clicked_at', since)
          .order('clicked_at', { ascending: false }),
        supabase
          .from('referrals')
          .select('referred_email, status, created_at')
          .gte('created_at', since)
          .order('created_at', { ascending: false }),
        supabase
          .from('subscribers')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),
      ]);
      if (cancelled) return;
      setVisits((v.data as Visit[]) || []);
      setClicks((c.data as Click[]) || []);
      setSignups((s.data as Signup[]) || []);
      setSubscribers(subs.count || 0);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [days]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    visits.forEach((v) => {
      const key = v.lead_magnet || 'direct';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [visits]);

  const byCode = useMemo(() => {
    const map = new Map<string, number>();
    clicks.forEach((c) => map.set(c.ref_code, (map.get(c.ref_code) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [clicks]);

  const converted = signups.filter((s) => s.status === 'converted').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Période :</span>
        {RANGES.map((r) => (
          <button
            key={r.days}
            type="button"
            onClick={() => setDays(r.days)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
              days === r.days
                ? 'border-[#008296] bg-[#008296] text-white'
                : 'border-[#232F3E]/15 bg-white text-[#232F3E]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<BarChart3 className="h-4 w-4" />}
          label="Visites de la page parrainage"
          value={loading ? '…' : String(visits.length)}
          hint={
            subscribers > 0 && !loading
              ? `sur ${subscribers} abonnés actifs`
              : 'ouvertures de /mon-parrainage'
          }
        />
        <Stat
          icon={<MousePointerClick className="h-4 w-4" />}
          label="Clics sur les liens de parrainage"
          value={loading ? '…' : String(clicks.length)}
          hint={`${byCode.length} lien(s) actif(s)`}
        />
        <Stat
          icon={<UserPlus className="h-4 w-4" />}
          label="Inscriptions via un lien"
          value={loading ? '…' : String(signups.length)}
          hint={`${converted} devenues clientes`}
        />
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Abonnés actifs"
          value={loading ? '…' : String(subscribers)}
          hint="base de référence"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#232F3E]/10 bg-white p-5">
          <h3 className="text-sm font-bold">D'où viennent les visites</h3>
          {loading ? (
            <p className="mt-2 text-sm text-[#232F3E]/60">Chargement…</p>
          ) : bySource.length === 0 ? (
            <p className="mt-2 text-sm text-[#232F3E]/60">
              Aucune visite enregistrée sur cette période.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {bySource.map(([src, n]) => (
                <li key={src} className="flex justify-between border-b border-dashed py-1">
                  <span>{src === 'direct' ? 'Accès direct / menu' : src}</span>
                  <span className="font-bold">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[#232F3E]/10 bg-white p-5">
          <h3 className="text-sm font-bold">Clics par lien de parrainage</h3>
          {loading ? (
            <p className="mt-2 text-sm text-[#232F3E]/60">Chargement…</p>
          ) : byCode.length === 0 ? (
            <p className="mt-2 text-sm text-[#232F3E]/60">Aucun clic sur cette période.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {byCode.map(([code, n]) => (
                <li key={code} className="flex justify-between border-b border-dashed py-1">
                  <span className="font-mono">{code}</span>
                  <span className="font-bold">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#232F3E]/10 bg-white p-5">
        <h3 className="text-sm font-bold">Dernières inscriptions via un lien</h3>
        {loading ? (
          <p className="mt-2 text-sm text-[#232F3E]/60">Chargement…</p>
        ) : signups.length === 0 ? (
          <p className="mt-2 text-sm text-[#232F3E]/60">
            Aucune inscription parrainée sur cette période.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5 text-sm">
            {signups.slice(0, 20).map((s, i) => (
              <li
                key={`${s.referred_email}-${i}`}
                className="flex flex-wrap justify-between gap-2 border-b border-dashed py-1"
              >
                <span>{s.referred_email || '—'}</span>
                <span className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      s.status === 'converted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status === 'converted' ? 'cliente' : 'en attente'}
                  </span>
                  <span className="text-[#232F3E]/60">
                    {new Date(s.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[#232F3E]/10 bg-white p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#008296]">
        {icon} {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-[#232F3E]/60">{hint}</p> : null}
    </div>
  );
}
