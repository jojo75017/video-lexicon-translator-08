import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RefreshCw,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wifi,
} from "lucide-react";

type StripeEnv = "sandbox" | "live";

interface TxRow {
  id: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  created: string | null;
  method: string | null;
  environment: StripeEnv;
}

interface EnvSummary {
  environment: StripeEnv;
  available: boolean;
  totalAmount: number;
  succeededCount: number;
  pendingCount: number;
  averageAmount: number;
  currency: string;
  transactions: TxRow[];
  error?: string;
}

interface StripeResponse {
  sandbox: EnvSummary;
  live: EnvSummary;
}

interface InternalRow {
  id: string;
  email: string;
  amount: number | null;
  currency: string | null;
  status: string;
  created_at: string;
  source: "commande" | "confirmation";
}

const fmtMoney = (amount: number, currency = "eur") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency.toUpperCase() }).format(amount);

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—";

const EnvBadge: React.FC<{ env: StripeEnv }> = ({ env }) =>
  env === "live" ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
      LIVE
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
      TEST
    </span>
  );

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const ok = ["succeeded", "paid", "processed"].includes(status);
  const pending = ["pending", "en_attente"].includes(status);
  return (
    <Badge variant={ok ? "default" : pending ? "secondary" : "outline"}>
      {status}
    </Badge>
  );
};

const KeyStat: React.FC<{
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 rounded-lg border p-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const EnvSummaryCard: React.FC<{ summary: EnvSummary }> = ({ summary }) => {
  const env = summary.environment;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          Stripe <EnvBadge env={env} />
          {!summary.available && (
            <span className="text-xs font-normal text-muted-foreground">
              (indisponible)
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {env === "live"
            ? "Vrais paiements encaissés"
            : "Paiements de test (carte 4242…)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary.available ? (
          <div className="grid grid-cols-2 gap-3">
            <KeyStat label="Total encaissé" value={fmtMoney(summary.totalAmount, summary.currency)} icon={TrendingUp} />
            <KeyStat label="Paiements réussis" value={String(summary.succeededCount)} icon={CheckCircle2} />
            <KeyStat label="En attente" value={String(summary.pendingCount)} icon={Clock} />
            <KeyStat label="Montant moyen" value={fmtMoney(summary.averageAmount, summary.currency)} icon={CreditCard} />
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {env === "live"
                ? "Les paiements en direct ne sont pas encore activés. Terminez la mise en production Stripe pour encaisser de vrais paiements."
                : "Environnement de test indisponible."}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const GoLivePanel: React.FC<{ liveAvailable: boolean }> = ({ liveAvailable }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg">Statut mise en production</CardTitle>
      <CardDescription>État de l'activation des paiements en direct</CardDescription>
    </CardHeader>
    <CardContent>
      {liveAvailable ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">
            Paiements en direct actifs — ton compte Stripe encaisse de vrais paiements.
          </span>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-4 text-sm text-orange-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Mise en production non terminée.</p>
            <p className="mt-1">
              Tant que les clés en direct ne sont pas provisionnées, seuls les paiements de
              test fonctionnent. Termine les étapes go-live (vérification du compte, banque,
              installation de l'app) dans Stripe.
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export const AdminPaymentsDashboardPage: React.FC = () => {
  const [data, setData] = useState<StripeResponse | null>(null);
  const [internal, setInternal] = useState<InternalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInternal = useCallback(async () => {
    const [orders, confirmations] = await Promise.all([
      supabase
        .from("funnel_orders")
        .select("id,email,amount,currency,status,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("payment_confirmations")
        .select("id,email,status,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const rows: InternalRow[] = [];
    for (const o of orders.data ?? []) {
      rows.push({
        id: o.id,
        email: o.email,
        amount: o.amount,
        currency: o.currency,
        status: o.status,
        created_at: o.created_at,
        source: "commande",
      });
    }
    for (const c of confirmations.data ?? []) {
      rows.push({
        id: c.id,
        email: c.email,
        amount: null,
        currency: null,
        status: c.status,
        created_at: c.created_at,
        source: "confirmation",
      });
    }
    rows.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    setInternal(rows);
  }, []);

  const loadStripe = useCallback(async () => {
    const { data: resp, error } = await supabase.functions.invoke("get-stripe-payments", {
      body: {},
    });
    if (error) {
      toast.error("Impossible de charger les paiements Stripe");
      return;
    }
    setData(resp as StripeResponse);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadStripe(), loadInternal()]);
    setRefreshing(false);
  }, [loadStripe, loadInternal]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadStripe(), loadInternal()]);
      setLoading(false);
    })();
  }, [loadStripe, loadInternal]);

  // Realtime: refresh internal data when a new order/confirmation arrives.
  useEffect(() => {
    const channel = supabase
      .channel("payments-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "funnel_orders" },
        () => {
          toast.success("📬 Nouvelle commande reçue !", { duration: 8000 });
          loadInternal();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_confirmations" },
        () => {
          toast.success("📬 Nouvelle confirmation de paiement !", { duration: 8000 });
          loadInternal();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadInternal]);

  const stripeTxs = useMemo(() => {
    const all: TxRow[] = [];
    if (data?.sandbox?.transactions) all.push(...data.sandbox.transactions);
    if (data?.live?.transactions) all.push(...data.live.transactions);
    all.sort((a, b) => +new Date(b.created ?? 0) - +new Date(a.created ?? 0));
    return all;
  }, [data]);

  const liveAvailable = !!data?.live?.available;

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Chargement des paiements…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Paiements Stripe</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Wifi className="h-3.5 w-3.5 text-green-600" />
            Suivi temps réel — test vs live
          </p>
        </div>
        <Button onClick={refresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Chiffres clés par environnement */}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.sandbox && <EnvSummaryCard summary={data.sandbox} />}
        {data?.live && <EnvSummaryCard summary={data.live} />}
      </div>

      {/* Statut go-live */}
      <GoLivePanel liveAvailable={liveAvailable} />

      {/* Transactions Stripe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions Stripe</CardTitle>
          <CardDescription>Paiements réels remontés depuis Stripe (test et live)</CardDescription>
        </CardHeader>
        <CardContent>
          {stripeTxs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune transaction Stripe pour l'instant.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Env</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stripeTxs.map((t) => (
                  <TableRow key={`${t.environment}-${t.id}`}>
                    <TableCell><EnvBadge env={t.environment} /></TableCell>
                    <TableCell className="max-w-[180px] truncate">{t.email ?? "—"}</TableCell>
                    <TableCell className="font-medium">{fmtMoney(t.amount, t.currency)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell>{t.method ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{fmtDate(t.created)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Commandes & confirmations internes (temps réel) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commandes & confirmations (base)</CardTitle>
          <CardDescription>Suivi temps réel des commandes et confirmations enregistrées</CardDescription>
        </CardHeader>
        <CardContent>
          {internal.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune commande ni confirmation enregistrée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internal.map((r) => (
                  <TableRow key={`${r.source}-${r.id}`}>
                    <TableCell>
                      <Badge variant="outline">{r.source}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{r.email}</TableCell>
                    <TableCell className="font-medium">
                      {r.amount != null ? fmtMoney(r.amount, r.currency ?? "eur") : "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminPaymentsDashboardPage;
