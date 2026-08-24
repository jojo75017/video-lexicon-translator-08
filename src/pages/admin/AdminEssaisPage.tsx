import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, RefreshCw, TimerOff, BadgeCheck, AlertTriangle } from 'lucide-react';

/** Suivi des essais gratuits 7 jours + file de reprise Systeme.io. */
interface TrialRow {
  id: string;
  email: string;
  first_name: string | null;
  started_at: string;
  ends_at: string;
  status: string;
  systemeio_synced_at: string | null;
  systemeio_attempts: number;
  systemeio_last_error: string | null;
  client_tag_synced_at: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  actif: 'Actif',
  expire: 'Expiré',
  converti: 'Converti',
};

const AdminEssaisPage: React.FC = () => {
  const [rows, setRows] = useState<TrialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'tous' | 'actif' | 'expire' | 'converti' | 'erreur'>('tous');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('free_trials')
      .select('id,email,first_name,started_at,ends_at,status,systemeio_synced_at,systemeio_attempts,systemeio_last_error,client_tag_synced_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) toast.error('Chargement impossible');
    setRows((data as TrialRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const act = async (id: string, action: 'retry' | 'expire' | 'convert') => {
    setBusyId(id);
    try {
      const { data, error } = await supabase.functions.invoke('trials-maintenance', {
        body: { action, id },
      });
      if (error) throw error;
      if (action === 'retry') {
        toast[data?.ok ? 'success' : 'error'](
          data?.ok ? 'Contact envoyé à Systeme.io' : 'Nouvel échec — réessai automatique programmé',
        );
      } else {
        toast.success(action === 'expire' ? 'Essai expiré' : 'Essai marqué converti');
      }
      await load();
    } catch {
      toast.error('Action impossible');
    } finally {
      setBusyId(null);
    }
  };

  const runMaintenance = async () => {
    setBusyId('cron');
    try {
      const { data, error } = await supabase.functions.invoke('trials-maintenance', { body: {} });
      if (error) throw error;
      toast.success(`Maintenance : ${data.expired} expirés · ${data.retrySuccess}/${data.retried} renvoyés · ${data.converted} convertis`);
      await load();
    } catch {
      toast.error('Maintenance impossible');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'tous') return rows;
    if (filter === 'erreur') return rows.filter((r) => !r.systemeio_synced_at);
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const counts = useMemo(() => ({
    total: rows.length,
    actif: rows.filter((r) => r.status === 'actif').length,
    expire: rows.filter((r) => r.status === 'expire').length,
    converti: rows.filter((r) => r.status === 'converti').length,
    erreur: rows.filter((r) => !r.systemeio_synced_at).length,
  }), [rows]);

  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—');

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Essais gratuits 7 jours</h1>
          <p className="text-sm text-muted-foreground">
            {counts.total} essais · {counts.actif} actifs · {counts.expire} expirés · {counts.converti} convertis ·{' '}
            {counts.erreur} non synchronisés Systeme.io
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-lg border px-3 py-2 text-sm">
            <RefreshCw className="mr-1 inline h-4 w-4" /> Rafraîchir
          </button>
          <button
            onClick={runMaintenance}
            disabled={busyId === 'cron'}
            className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
          >
            {busyId === 'cron' ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}
            Lancer la maintenance
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {(['tous', 'actif', 'expire', 'converti', 'erreur'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-sm ${filter === f ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {f === 'erreur' ? 'Sync en échec' : STATUS_LABEL[f] ?? 'Tous'}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Contact</th>
              <th className="p-3">Début</th>
              <th className="p-3">Fin</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Systeme.io</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Chargement…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aucun essai.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.first_name || '—'}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </td>
                <td className="p-3">{fmt(r.started_at)}</td>
                <td className="p-3">{fmt(r.ends_at)}</td>
                <td className="p-3">{STATUS_LABEL[r.status] ?? r.status}</td>
                <td className="p-3">
                  {r.systemeio_synced_at ? (
                    <span className="text-emerald-600">Envoyé {fmt(r.systemeio_synced_at)}</span>
                  ) : (
                    <span className="text-amber-600">
                      <AlertTriangle className="mr-1 inline h-4 w-4" />
                      En attente ({r.systemeio_attempts} essais)
                      {r.systemeio_last_error ? ` · ${r.systemeio_last_error}` : ''}
                    </span>
                  )}
                  {r.client_tag_synced_at && (
                    <div className="text-xs text-muted-foreground">Tag client posé</div>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {!r.systemeio_synced_at && (
                      <button
                        onClick={() => act(r.id, 'retry')}
                        disabled={busyId === r.id}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        <RefreshCw className="mr-1 inline h-3 w-3" /> Réessayer l’envoi
                      </button>
                    )}
                    {r.status === 'actif' && (
                      <button
                        onClick={() => act(r.id, 'expire')}
                        disabled={busyId === r.id}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        <TimerOff className="mr-1 inline h-3 w-3" /> Forcer l’expiration
                      </button>
                    )}
                    {r.status !== 'converti' && (
                      <button
                        onClick={() => act(r.id, 'convert')}
                        disabled={busyId === r.id}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        <BadgeCheck className="mr-1 inline h-3 w-3" /> Marquer converti
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminEssaisPage;
