import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, RefreshCw, Users, ShoppingCart, TrendingUp, Mail } from 'lucide-react';
import { toast } from 'sonner';

type Period = '24h' | '7d' | '30d' | 'all';

const periodToDate = (p: Period): Date | null => {
  const now = Date.now();
  if (p === '24h') return new Date(now - 24 * 3600 * 1000);
  if (p === '7d') return new Date(now - 7 * 24 * 3600 * 1000);
  if (p === '30d') return new Date(now - 30 * 24 * 3600 * 1000);
  return null;
};

const fmtDate = (d?: string | null) =>
  d ? format(new Date(d), 'dd MMM yyyy HH:mm', { locale: fr }) : '—';

const downloadCSV = (filename: string, rows: any[]) => {
  if (!rows.length) {
    toast.info('Aucune donnée à exporter');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = r[h];
          if (v == null) return '';
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(','),
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function AdminFunnelPage() {
  const [period, setPeriod] = useState<Period>('7d');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [l, o, r, c, k] = await Promise.all([
        supabase.from('funnel_leads').select('*').order('created_at', { ascending: false }).limit(2000),
        supabase.from('funnel_orders').select('*').order('created_at', { ascending: false }).limit(2000),
        supabase.from('referrals').select('*').order('created_at', { ascending: false }).limit(2000),
        supabase.from('referral_codes').select('*'),
        supabase.from('affiliate_clicks').select('ref_code'),
      ]);
      if (l.error) throw l.error;
      if (o.error) throw o.error;
      if (r.error) throw r.error;
      if (c.error) throw c.error;
      if (k.error) throw k.error;
      setLeads(l.data || []);
      setOrders(o.data || []);
      setReferrals(r.data || []);
      setCodes(c.data || []);
      setClicks(k.data || []);
    } catch (e: any) {
      toast.error('Erreur de chargement : ' + (e?.message ?? 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const periodDate = periodToDate(period);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (periodDate && new Date(l.created_at) < periodDate) return false;
      if (search && !String(l.email || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [leads, periodDate, search]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (periodDate && new Date(o.created_at) < periodDate) return false;
      if (search && !String(o.email || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      return true;
    });
  }, [orders, periodDate, search, statusFilter]);

  // Stats leads
  const leadsStats = {
    total: leads.length,
    last7: leads.filter((l) => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 3600 * 1000)).length,
    withRef: leads.filter((l) => l.ref_code).length,
    sent: leads.filter((l) => l.lead_magnet_sent_at).length,
  };

  // Stats orders
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const ordersStats = {
    revenue: paidOrders.reduce((s, o) => s + Number(o.amount || 0), 0),
    revenue7: paidOrders
      .filter((o) => new Date(o.created_at) > new Date(Date.now() - 7 * 24 * 3600 * 1000))
      .reduce((s, o) => s + Number(o.amount || 0), 0),
    paidCount: paidOrders.length,
    pendingCount: orders.filter((o) => o.status === 'pending').length,
  };

  // Affiliates aggregation
  const affiliates = useMemo(() => {
    const map = new Map<string, any>();
    codes.forEach((c) => {
      map.set(c.code, {
        code: c.code,
        user_id: c.user_id,
        clicks: 0,
        orders: 0,
        commissionTotal: 0,
        commissionUnpaid: 0,
        commissionPaid: 0,
      });
    });
    clicks.forEach((c) => {
      const a = map.get(c.ref_code);
      if (a) a.clicks += 1;
    });
    referrals.forEach((r) => {
      // find code via referrer_id
      const code = codes.find((c) => c.user_id === r.referrer_id);
      if (!code) return;
      const a = map.get(code.code);
      if (!a) return;
      a.orders += 1;
      const amt = Number(r.commission_amount || 0);
      a.commissionTotal += amt;
      if (r.commission_paid) a.commissionPaid += amt;
      else a.commissionUnpaid += amt;
    });
    return Array.from(map.values()).sort((a, b) => b.commissionTotal - a.commissionTotal);
  }, [codes, clicks, referrals]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPanelNav />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tunnel & Affiliés</h1>
            <p className="text-sm text-muted-foreground">
              Inscriptions formulaire, commandes et commissions affiliés
            </p>
          </div>
          <Button variant="outline" onClick={fetchAll} disabled={loading} className="rounded-xl">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
        </div>

        {/* Filtres communs */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1">
              {(['24h', '7d', '30d', 'all'] as Period[]).map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={period === p ? 'default' : 'outline'}
                  onClick={() => setPeriod(p)}
                  className="rounded-lg"
                >
                  {p === 'all' ? 'Tout' : p}
                </Button>
              ))}
            </div>
            <Input
              placeholder="Rechercher par email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </Card>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">
              <Users className="mr-2 h-4 w-4" /> Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="mr-2 h-4 w-4" /> Commandes ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="affiliates">
              <TrendingUp className="mr-2 h-4 w-4" /> Affiliés ({affiliates.length})
            </TabsTrigger>
          </TabsList>

          {/* LEADS */}
          <TabsContent value="leads" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label="Total leads" value={leadsStats.total} />
              <StatCard label="Leads 7j" value={leadsStats.last7} />
              <StatCard label="Avec parrain" value={leadsStats.withRef} />
              <StatCard label="Guide envoyé" value={leadsStats.sent} icon={<Mail className="h-4 w-4" />} />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCSV(
                    `leads-${new Date().toISOString().slice(0, 10)}.csv`,
                    filteredLeads.map((l) => ({
                      email: l.email,
                      first_name: l.first_name,
                      created_at: l.created_at,
                      ref_code: l.ref_code,
                      utm_source: l.utm_source,
                      utm_campaign: l.utm_campaign,
                      lead_magnet_sent_at: l.lead_magnet_sent_at,
                    })),
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Parrain</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Guide</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        Aucun lead pour cette période
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.email}</TableCell>
                        <TableCell>{l.first_name || '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(l.created_at)}</TableCell>
                        <TableCell>
                          {l.ref_code ? <Badge variant="secondary">{l.ref_code}</Badge> : '—'}
                        </TableCell>
                        <TableCell className="text-sm">{l.utm_source || l.utm_campaign || '—'}</TableCell>
                        <TableCell>
                          {l.lead_magnet_sent_at ? (
                            <Badge className="bg-green-600">✓ Envoyé</Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ORDERS */}
          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label="CA total" value={`${ordersStats.revenue.toFixed(2)} €`} />
              <StatCard label="CA 7j" value={`${ordersStats.revenue7.toFixed(2)} €`} />
              <StatCard label="Payées" value={ordersStats.paidCount} />
              <StatCard label="En attente" value={ordersStats.pendingCount} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1">
                {(['all', 'paid', 'pending'] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(s)}
                    className="rounded-lg"
                  >
                    {s === 'all' ? 'Tous' : s === 'paid' ? 'Payés' : 'En attente'}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCSV(
                    `commandes-${new Date().toISOString().slice(0, 10)}.csv`,
                    filteredOrders.map((o) => ({
                      email: o.email,
                      first_name: o.first_name,
                      product_key: o.product_key,
                      amount: o.amount,
                      currency: o.currency,
                      status: o.status,
                      payment_method: o.payment_method,
                      ref_code: o.ref_code,
                      created_at: o.created_at,
                      paid_at: o.paid_at,
                    })),
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Affilié</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        Aucune commande pour cette période
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{o.product_key}</Badge>
                        </TableCell>
                        <TableCell>{Number(o.amount).toFixed(2)} {o.currency}</TableCell>
                        <TableCell>
                          {o.status === 'paid' ? (
                            <Badge className="bg-green-600">Payé</Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{o.payment_method}</TableCell>
                        <TableCell>{o.ref_code ? <Badge variant="secondary">{o.ref_code}</Badge> : '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(o.created_at)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* AFFILIATES */}
          <TabsContent value="affiliates" className="space-y-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead>Ventes</TableHead>
                    <TableHead>Commissions totales</TableHead>
                    <TableHead>À payer</TableHead>
                    <TableHead>Payées</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        Aucun affilié inscrit
                      </TableCell>
                    </TableRow>
                  ) : (
                    affiliates.map((a) => (
                      <TableRow key={a.code}>
                        <TableCell className="font-mono">{a.code}</TableCell>
                        <TableCell>{a.clicks}</TableCell>
                        <TableCell>{a.orders}</TableCell>
                        <TableCell className="font-semibold">{a.commissionTotal.toFixed(2)} €</TableCell>
                        <TableCell className="text-orange-600">{a.commissionUnpaid.toFixed(2)} €</TableCell>
                        <TableCell className="text-green-600">{a.commissionPaid.toFixed(2)} €</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
    </Card>
  );
}
