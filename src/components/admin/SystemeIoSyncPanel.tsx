import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CloudUpload, RefreshCw, CheckCircle, AlertCircle, Loader2, Tags } from 'lucide-react';

interface SyncLog {
  state: 'running' | 'done';
  updated_at: string;
  synced: number;
  failed: number;
  remaining: number;
  last_errors: { email: string; detail: string }[];
}

interface SyncStatus {
  running: boolean;
  synced_prospects: number;
  failed_prospects: number;
  synced_leads: number;
  log: SyncLog | null;
  retag_log: SyncLog | null;
}

/** Suivi de la synchronisation Systeme.io : progression, échecs, relance manuelle. */
const SystemeIoSyncPanel = () => {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [retagging, setRetagging] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('sync-systemeio-contacts', {
      body: { mode: 'status' },
    });
    setLoading(false);
    if (error) return;
    setStatus(data as SyncStatus);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Tant que la synchro tourne en arrière-plan, on rafraîchit le compteur.
  useEffect(() => {
    if (!status?.running) return;
    const timer = setInterval(fetchStatus, 15_000);
    return () => clearInterval(timer);
  }, [status?.running, fetchStatus]);

  const launch = async (mode: 'sync' | 'retag') => {
    if (mode === 'sync') setLaunching(true);
    else setRetagging(true);
    const { data, error } = await supabase.functions.invoke('sync-systemeio-contacts', {
      body: { mode },
    });
    if (mode === 'sync') setLaunching(false);
    else setRetagging(false);
    if (error) {
      toast.error("Impossible de lancer l'opération");
      return;
    }
    if (data?.already_running) {
      toast.info("Une synchronisation est déjà en cours");
    } else {
      toast.success(
        mode === 'retag'
          ? "Re-tagage lancé en arrière-plan (application des tags sur les contacts existants)"
          : "Synchronisation Systeme.io lancée en arrière-plan",
      );
    }
    fetchStatus();
  };

  const log = status?.log ?? null;
  const retagLog = status?.retag_log ?? null;
  const running = status?.running ?? false;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-gold-light" />
            Synchronisation Systeme.io
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            {running && (
              <Badge variant="outline" className="border-gold/50 text-gold-light">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                En cours…
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={fetchStatus} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => launch('retag')}
              disabled={retagging || running}
              className="border-gold/50 text-gold-light"
              title="Applique les tags (prospect, segment, lead magnet…) aux contacts déjà présents dans Systeme.io"
            >
              <Tags className="h-3 w-3 mr-1" />
              {retagging ? 'Lancement…' : 'Re-taguer'}
            </Button>
            <Button
              size="sm"
              onClick={() => launch('sync')}
              disabled={launching || running}
              className="bg-gradient-to-r from-gold to-gold-dark text-black font-semibold hover:opacity-90"
            >
              <CloudUpload className="h-3 w-3 mr-1" />
              {launching ? 'Lancement…' : 'Re-synchroniser'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Pousse prospects, leads et clients vers Systeme.io avec leurs tags (segment actif/froid,
          lead magnet, client). Les désabonnés ne sont jamais envoyés.
          La synchro tourne en arrière-plan par lots (limite API ~120 requêtes/min).
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-background/50 border border-border/50 p-3">
            <div className="text-2xl font-bold text-foreground">{status?.synced_prospects ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Prospects synchronisés</div>
          </div>
          <div className="rounded-lg bg-background/50 border border-border/50 p-3">
            <div className="text-2xl font-bold text-foreground">{status?.synced_leads ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Leads synchronisés</div>
          </div>
          <div className="rounded-lg bg-background/50 border border-border/50 p-3">
            <div className="text-2xl font-bold text-destructive">{status?.failed_prospects ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Échecs</div>
          </div>
          <div className="rounded-lg bg-background/50 border border-border/50 p-3">
            <div className="text-2xl font-bold text-foreground">
              {log ? (log.remaining >= 0 ? log.remaining : '…') : '—'}
            </div>
            <div className="text-xs text-muted-foreground">Restants (estimation)</div>
          </div>
        </div>

        {log && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {log.state === 'done' ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gold-light" />
            )}
            {log.state === 'done'
              ? `Synchro terminée — ${log.synced} réussis, ${log.failed} échecs`
              : `Synchro en cours — ${log.synced} réussis, ${log.failed} échecs pour l'instant`}
            {' · '}mis à jour {new Date(log.updated_at).toLocaleTimeString('fr-FR')}
          </div>
        )}

        {retagLog && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {retagLog.state === 'done' ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gold-light" />
            )}
            <Tags className="h-3.5 w-3.5 text-gold-light" />
            {retagLog.state === 'done'
              ? `Re-tagage terminé — ${retagLog.synced} contacts tagués, ${retagLog.failed} échecs`
              : `Re-tagage en cours — ${retagLog.synced} contacts tagués pour l'instant`}
            {' · '}mis à jour {new Date(retagLog.updated_at).toLocaleTimeString('fr-FR')}
          </div>
        )}

        {(log?.last_errors?.length ?? 0) > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              Dernières erreurs ({log!.last_errors.length})
            </div>
            {log!.last_errors.slice(0, 5).map((e) => (
              <div key={e.email} className="text-xs text-muted-foreground truncate">
                <span className="text-foreground">{e.email}</span> — {e.detail}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemeIoSyncPanel;
