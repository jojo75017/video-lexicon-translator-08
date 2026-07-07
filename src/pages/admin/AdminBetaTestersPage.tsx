import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, RefreshCw, Loader2, ShieldCheck, ShieldOff, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

// Bêta-testeurs conservés (accès maintenu) — doit rester synchro avec
// l'edge function revoke-beta-access.
const EXCLUDED = new Set(['rachel.mlm63@gmail.com']);

interface BetaTester {
  email: string;
  code: string;
  used_at: string | null;
  status: string | null; // statut abonné, null si introuvable
  excluded: boolean;
}

const statusBadge = (status: string | null) => {
  const active = status === 'active' || status === 'trialing';
  if (status == null) {
    return (
      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
        Introuvable
      </span>
    );
  }
  return (
    <span
      className={
        active
          ? 'text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#008296]/10 text-[#008296] border border-[#008296]/30'
          : 'text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border'
      }
    >
      {status}
    </span>
  );
};

const AdminBetaTestersPage: React.FC = () => {
  const [testers, setTesters] = useState<BetaTester[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTesters = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Emails des codes bêta utilisés
      const { data: codes, error: codesErr } = await supabase
        .from('beta_promo_codes')
        .select('code, used_by_email, used_at')
        .eq('status', 'used');
      if (codesErr) throw codesErr;

      const byEmail = new Map<string, BetaTester>();
      for (const c of codes ?? []) {
        const email = (c.used_by_email ?? '').trim().toLowerCase();
        if (!email || !email.includes('@')) continue;
        // garde la première occurrence (email unique)
        if (!byEmail.has(email)) {
          byEmail.set(email, {
            email,
            code: c.code,
            used_at: c.used_at,
            status: null,
            excluded: EXCLUDED.has(email),
          });
        }
      }

      const emails = Array.from(byEmail.keys());
      if (emails.length > 0) {
        // 2. Statut abonné
        const { data: subs, error: subsErr } = await supabase
          .from('subscribers')
          .select('email, status')
          .in('email', emails);
        if (subsErr) throw subsErr;
        for (const s of subs ?? []) {
          const email = (s.email ?? '').trim().toLowerCase();
          const t = byEmail.get(email);
          if (t) t.status = s.status;
        }
      }

      setTesters(Array.from(byEmail.values()).sort((a, b) => a.email.localeCompare(b.email)));
    } catch (err: any) {
      console.error(err);
      toast.error('Impossible de charger la liste des bêta-testeurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTesters();
  }, [fetchTesters]);

  const toCut = useMemo(
    () =>
      testers.filter(
        (t) => !t.excluded && (t.status === 'active' || t.status === 'trialing')
      ),
    [testers]
  );
  const keptCount = testers.filter((t) => t.excluded).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-6">
        <AdminPanelNav />

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#008296]/10 p-2.5">
            <Users className="h-6 w-6 text-[#008296]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Liste des bêta-testeurs</h1>
            <p className="text-sm text-muted-foreground">
              Vérifiez qui sera coupé avant d'envoyer les emails de clôture depuis « Codes Bêta ».
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{testers.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Bêta-testeurs</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-destructive">{toCut.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Seront coupés</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#008296]">{keptCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Conservés</div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={fetchTesters} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Chargement...
            </div>
          ) : testers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Aucun bêta-testeur.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Statut abonné</TableHead>
                  <TableHead>Sera coupé ?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testers.map((t) => {
                  const willCut = !t.excluded && (t.status === 'active' || t.status === 'trialing');
                  return (
                    <TableRow key={t.email}>
                      <TableCell className="font-medium">{t.email}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{t.code}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell>
                        {t.excluded ? (
                          <span className="inline-flex items-center gap-1 text-[#008296] text-sm font-medium">
                            <Star className="h-4 w-4" /> Conservé
                          </span>
                        ) : willCut ? (
                          <span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
                            <ShieldOff className="h-4 w-4" /> Oui
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                            <ShieldCheck className="h-4 w-4" /> Déjà inactif
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminBetaTestersPage;
