import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Loader2, ReceiptText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listCoverProjects, type CoverProject } from '@/lib/coverProjects';

/**
 * /v3/paiements — lecture seule.
 * Liste les achats liés au studio de couverture (date, prix, statut) et
 * rattache chaque projet de couverture au paiement qui l'a débloqué
 * (le dernier paiement enregistré avant la création du projet).
 * Aucun changement de base, de sécurité ni de paiement : on lit uniquement
 * les fonctions existantes get_my_module_entitlements / get_my_funnel_orders.
 */

interface Payment {
  id: string;
  source: 'module' | 'commande';
  label: string;
  amount: number | null;
  currency: string;
  status: string;
  date: string | null;
}

const COVER_KEYWORDS = ['cover', 'couverture'];
const isCoverRelated = (v: string | null | undefined) =>
  !!v && COVER_KEYWORDS.some((k) => v.toLowerCase().includes(k));

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const fmtAmount = (amount: number | null, currency: string) =>
  amount === null
    ? '—'
    : amount.toLocaleString('fr-FR', {
        style: 'currency',
        currency: (currency || 'eur').toUpperCase(),
      });

const STATUS_LABEL: Record<string, string> = {
  paid: 'Payé',
  active: 'Actif',
  pending: 'En attente',
  failed: 'Échoué',
  refunded: 'Remboursé',
  canceled: 'Annulé',
  cancelled: 'Annulé',
};

const statusTone = (status: string): string => {
  const s = status.toLowerCase();
  if (s === 'paid' || s === 'active') return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700';
  if (s === 'pending') return 'border-amber-500/40 bg-amber-500/10 text-amber-700';
  return 'border-destructive/40 bg-destructive/10 text-destructive';
};

export default function PaiementsCouverturesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<CoverProject[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [mods, orders, projs] = await Promise.all([
          supabase.rpc('get_my_module_entitlements'),
          supabase.rpc('get_my_funnel_orders'),
          listCoverProjects(),
        ]);
        if (!alive) return;
        if (mods.error) throw mods.error;
        if (orders.error) throw orders.error;

        const fromModules: Payment[] = (mods.data ?? [])
          .filter((m) => isCoverRelated(m.module))
          .map((m) => ({
            id: m.id,
            source: 'module' as const,
            label: 'Cover Studio KDP Pro',
            amount: m.amount === null ? null : Number(m.amount),
            currency: m.currency ?? 'eur',
            status: m.status ?? 'pending',
            date: m.created_at,
          }));

        const fromOrders: Payment[] = (orders.data ?? [])
          .filter((o) => isCoverRelated(o.product_key))
          .map((o) => ({
            id: o.id,
            source: 'commande' as const,
            label: o.product_key,
            amount: o.amount === null ? null : Number(o.amount),
            currency: o.currency ?? 'eur',
            status: o.status ?? 'pending',
            date: o.paid_at ?? o.created_at,
          }));

        const all = [...fromModules, ...fromOrders].sort(
          (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
        );
        setPayments(all);
        setProjects(projs);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Chargement impossible.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** Projets rattachés à chaque paiement (dernier paiement avant création). */
  const projectsByPayment = useMemo(() => {
    const map = new Map<string, CoverProject[]>();
    const ordered = [...payments].sort(
      (a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
    );
    for (const p of projects) {
      const created = new Date(p.created_at).getTime();
      const match = [...ordered].reverse().find(
        (pay) => pay.date && new Date(pay.date).getTime() <= created,
      );
      const key = match?.id ?? '__unlinked__';
      map.set(key, [...(map.get(key) ?? []), p]);
    }
    return map;
  }, [payments, projects]);

  const unlinked = projectsByPayment.get('__unlinked__') ?? [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <Badge className="gap-1">
          <ReceiptText className="h-3 w-3" /> Mes paiements
        </Badge>
        <h1 className="text-2xl font-bold sm:text-3xl">Achats du studio de couverture</h1>
        <p className="text-muted-foreground">
          Date, prix et statut de chaque achat, avec les projets de couverture rattachés.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {payments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" /> Aucun achat enregistré
            </CardTitle>
            <CardDescription>
              Le module Cover Studio KDP Pro s'achète une seule fois (67 €).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/v3/cover-pro?checkout=1">
                Voir l'offre 67 € <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((pay) => {
            const linked = projectsByPayment.get(pay.id) ?? [];
            return (
              <Card key={`${pay.source}-${pay.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">{pay.label}</CardTitle>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusTone(pay.status)}`}
                    >
                      {STATUS_LABEL[pay.status.toLowerCase()] ?? pay.status}
                    </span>
                  </div>
                  <CardDescription>
                    {fmtDate(pay.date)} · {fmtAmount(pay.amount, pay.currency)} ·{' '}
                    {pay.source === 'module' ? 'Module' : 'Commande'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Projets rattachés ({linked.length})
                  </p>
                  {linked.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun projet créé après ce paiement.
                    </p>
                  ) : (
                    <ul className="divide-y rounded-lg border">
                      {linked.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{p.project_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.book_title || 'Sans titre'} · créé le {fmtDate(p.created_at)}
                            </p>
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/v3/mes-couvertures/${p.id}`}>Ouvrir l'éditeur</Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {unlinked.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Projets sans paiement rattaché</CardTitle>
            <CardDescription>
              Projets créés avant tout achat enregistré (essai, accès administrateur ou offre incluse).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y rounded-lg border">
              {unlinked.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.project_name}</p>
                    <p className="text-xs text-muted-foreground">créé le {fmtDate(p.created_at)}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/v3/mes-couvertures/${p.id}`}>Ouvrir l'éditeur</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Link to="/v3/mes-couvertures" className="inline-block text-sm underline">
        ← Retour à mes couvertures
      </Link>
    </div>
  );
}
