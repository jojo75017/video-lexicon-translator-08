import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import {
  Mail, MailCheck, Eye, MousePointerClick, UserMinus, AlertTriangle,
  Users, CreditCard, TrendingUp, Euro, RefreshCw, Loader2, ExternalLink,
  BookMarked, FileText, Sparkles, Rocket,
} from 'lucide-react';

interface Metrics {
  emailsSent: number;
  emailsBounced: number;
  emailOpens: number;
  emailOpensUnique: number;
  emailClicks: number;
  unsubscribes: number;
  activeTrials: number;
  paidSubscribers: number;
  expired: number;
  revenue: number;
  orders: number;
  guidesDownloaded: number;
  documentsGenerated: number;
  // Today
  todayTrials: number;
  todaySent: number;
  todayOpens: number;
  todayClicks: number;
  todaySales: number;
  todayRevenue: number;
}

const EMPTY: Metrics = {
  emailsSent: 0, emailsBounced: 0, emailOpens: 0, emailOpensUnique: 0, emailClicks: 0,
  unsubscribes: 0, activeTrials: 0, paidSubscribers: 0, expired: 0, revenue: 0, orders: 0,
  guidesDownloaded: 0, documentsGenerated: 0,
  todayTrials: 0, todaySent: 0, todayOpens: 0, todayClicks: 0, todaySales: 0, todayRevenue: 0,
};

// Volume minimum d'envois avant d'afficher des alertes basées sur des taux
const MIN_VOLUME = 50;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const count = async (
  table: string,
  build?: (q: any) => any,
): Promise<number> => {
  let q = supabase.from(table as any).select('*', { count: 'exact', head: true });
  if (build) q = build(q);
  const { count: c } = await q;
  return c || 0;
};

const BusinessCenterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [m, setM] = useState<Metrics>(EMPTY);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const today = startOfToday();
    try {
      const [
        emailsSent, emailsBounced, emailClicks, unsubscribes,
        activeTrials, paidSubscribers, expired,
        todayTrials, todaySent, todayClicks,
        documentsGenerated, guidesDownloaded,
      ] = await Promise.all([
        count('email_send_log', (q) => q.eq('status', 'sent')),
        count('email_send_log', (q) => q.eq('status', 'error')),
        count('email_clicks'),
        count('sales_prospects', (q) => q.eq('unsubscribed', true)),
        count('subscribers', (q) => q.eq('status', 'trialing')),
        count('subscribers', (q) => q.eq('status', 'active')),
        count('subscribers', (q) => q.in('status', ['expired', 'trial_expired', 'cancelled'])),
        count('subscribers', (q) => q.eq('status', 'trialing').gte('created_at', today)),
        count('email_send_log', (q) => q.eq('status', 'sent').gte('created_at', today)),
        count('email_clicks', (q) => q.gte('clicked_at', today)),
        count('workflow_results'),
        count('capture_events').catch(() => 0),
      ]);

      // Opens (fetch to compute unique)
      const { data: opens } = await supabase.from('email_opens').select('prospect_email, opened_at');
      const emailOpens = opens?.length || 0;
      const uniqueSet = new Set((opens || []).map((o: any) => o.prospect_email));
      const todayOpens = (opens || []).filter((o: any) => o.opened_at >= today).length;

      // Revenue from paid funnel orders + v3 installment orders
      const { data: fo } = await supabase.from('funnel_orders').select('amount, status, paid_at');
      const paidOrders = (fo || []).filter((o: any) => o.status === 'paid');
      const revenue = paidOrders.reduce((s: number, o: any) => s + Number(o.amount || 0), 0);
      const todaySales = paidOrders.filter((o: any) => (o.paid_at || '') >= today).length;
      const todayRevenue = paidOrders
        .filter((o: any) => (o.paid_at || '') >= today)
        .reduce((s: number, o: any) => s + Number(o.amount || 0), 0);

      setM({
        emailsSent, emailsBounced,
        emailOpens, emailOpensUnique: uniqueSet.size, emailClicks,
        unsubscribes, activeTrials, paidSubscribers, expired,
        revenue, orders: paidOrders.length,
        guidesDownloaded, documentsGenerated,
        todayTrials, todaySent, todayOpens, todayClicks, todaySales, todayRevenue,
      });
    } catch (err) {
      console.error('BusinessCenter fetch error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openRate = m.emailsSent > 0 ? (m.emailOpensUnique / m.emailsSent) * 100 : 0;
  const clickRate = m.emailsSent > 0 ? (m.emailClicks / m.emailsSent) * 100 : 0;
  const clickToOpen = m.emailOpensUnique > 0 ? (m.emailClicks / m.emailOpensUnique) * 100 : 0;
  const bounceRate = (m.emailsSent + m.emailsBounced) > 0 ? (m.emailsBounced / (m.emailsSent + m.emailsBounced)) * 100 : 0;
  const totalContacts = m.paidSubscribers + m.activeTrials + m.expired;
  const conversionRate = totalContacts > 0 ? (m.paidSubscribers / totalContacts) * 100 : 0;

  // Health diagnostics — les alertes basées sur des taux ne s'affichent
  // qu'au-delà d'un volume significatif pour éviter les indicateurs trompeurs.
  const hasVolume = m.emailsSent >= MIN_VOLUME;
  const diagnostics: { tone: 'good' | 'warn' | 'bad'; text: string }[] = [];

  if (!hasVolume) {
    diagnostics.push({
      tone: 'good',
      text: `📊 Volume encore trop faible pour des statistiques fiables (${m.emailsSent} email${m.emailsSent > 1 ? 's' : ''} envoyé${m.emailsSent > 1 ? 's' : ''}). Les alertes s'activeront à partir de ${MIN_VOLUME} envois.`,
    });
  } else {
    if (m.todaySent > 0 && m.todayOpens === 0) {
      diagnostics.push({ tone: 'bad', text: "Des emails partent mais aucun n'est ouvert aujourd'hui. Vérifiez l'objet de vos emails." });
    }
    if (openRate > 0 && openRate < 15) {
      diagnostics.push({ tone: 'warn', text: `Taux d'ouverture faible (${openRate.toFixed(0)}%). Travaillez des objets plus accrocheurs.` });
    }
    if (m.emailOpensUnique > 20 && clickToOpen < 5) {
      diagnostics.push({ tone: 'warn', text: `Beaucoup d'ouvertures mais peu de clics (${clickToOpen.toFixed(0)}%). Améliorez votre appel à l'action.` });
    }
    if (bounceRate > 10) {
      diagnostics.push({ tone: 'warn', text: `Taux de rebond élevé (${bounceRate.toFixed(0)}%). Nettoyez votre liste d'emails.` });
    }
    if (conversionRate >= 5) {
      diagnostics.push({ tone: 'good', text: `Excellent taux de conversion (${conversionRate.toFixed(1)}%). Votre tunnel fonctionne bien !` });
    }
    if (diagnostics.length === 0) {
      diagnostics.push({ tone: 'good', text: 'Tous les indicateurs sont dans le vert. Continuez comme ça !' });
    }
  }

  // Synthèse "Aujourd'hui" (ligne vivante avec note étoilée)
  const todayActivity = m.todayTrials + m.todaySent + m.todayOpens + m.todayClicks + m.todaySales;
  let todaySummary: { stars: string; text: string; tone: 'good' | 'warn' | 'bad' };
  if (todayActivity === 0) {
    todaySummary = { stars: '', text: "Pas encore d'activité aujourd'hui — les données s'afficheront dès les premières inscriptions.", tone: 'warn' };
  } else if (m.todaySales > 0) {
    todaySummary = { stars: '⭐⭐⭐⭐⭐', text: 'Tunnel en bonne santé — au moins une vente aujourd\'hui !', tone: 'good' };
  } else if (m.todayTrials >= 3 && m.todayOpens === 0) {
    todaySummary = { stars: '⭐⭐', text: "Beaucoup d'inscriptions mais peu d'ouvertures. Vérifiez l'objet de vos emails.", tone: 'warn' };
  } else if (m.todayOpens > 0 && m.todayClicks === 0) {
    todaySummary = { stars: '⭐⭐⭐', text: "Des ouvertures mais peu de clics. Améliorez votre appel à l'action.", tone: 'warn' };
  } else {
    todaySummary = { stars: '⭐⭐⭐⭐', text: 'Bonne dynamique aujourd\'hui, continuez comme ça !', tone: 'good' };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const kpis = [
    { label: 'Chiffre d\'affaires', value: `${m.revenue.toLocaleString('fr-FR')} €`, icon: Euro, color: 'text-emerald-500' },
    { label: 'Ventes payantes', value: m.orders, icon: CreditCard, color: 'text-teal-500' },
    { label: 'Essais gratuits actifs', value: m.activeTrials, icon: Users, color: 'text-blue-500' },
    { label: 'Taux de conversion', value: `${conversionRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Emails envoyés', value: m.emailsSent, icon: Mail, color: 'text-indigo-500' },
    { label: 'Emails délivrés', value: m.emailsSent, icon: MailCheck, color: 'text-green-500' },
    { label: 'Taux d\'ouverture', value: `${openRate.toFixed(0)}%`, icon: Eye, color: 'text-orange-500' },
    { label: 'Taux de clic', value: `${clickRate.toFixed(1)}%`, icon: MousePointerClick, color: 'text-cyan-500' },
    { label: 'Désabonnements', value: m.unsubscribes, icon: UserMinus, color: 'text-rose-500' },
    { label: 'Rebonds (bounces)', value: m.emailsBounced, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Documents générés', value: m.documentsGenerated, icon: FileText, color: 'text-violet-500' },
    { label: 'Guides téléchargés', value: m.guidesDownloaded, icon: BookMarked, color: 'text-fuchsia-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminPanelNav />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2">📊 Business Center</h1>
            <p className="text-muted-foreground mt-1">Toute votre activité au même endroit — sans ouvrir Brevo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/essai-gratuit')} variant="outline" className="rounded-xl">
              <Rocket className="w-4 h-4 mr-2" />
              Voir le tunnel d'essai
              <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60" />
            </Button>
            <Button onClick={fetchAll} variant="outline" className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* ═══ SANTÉ DU BUSINESS (Aujourd'hui) ═══ */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Santé de votre business — Aujourd'hui
            </CardTitle>
            <CardDescription>Snapshot en temps réel de votre journée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Nouveaux essais', value: m.todayTrials, emoji: '👥' },
                { label: 'Emails envoyés', value: m.todaySent, emoji: '📧' },
                { label: 'Ouverts', value: m.todayOpens, emoji: '👀' },
                { label: 'Clics', value: m.todayClicks, emoji: '🖱️' },
                { label: 'Ventes', value: m.todaySales, emoji: '💳' },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl bg-card/70 border border-border p-4">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className={`text-3xl font-black ${s.value > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {diagnostics.map((d, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
                    d.tone === 'good' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : d.tone === 'warn' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  <span>{d.tone === 'good' ? '🟢' : d.tone === 'warn' ? '🟠' : '🔴'}</span>
                  <span>{d.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ═══ KPI GRID ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4">
                <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
                <p className="text-2xl font-black">
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString('fr-FR') : kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ═══ FUNNEL EMAIL ═══ */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Entonnoir email</CardTitle>
            <CardDescription>Du départ jusqu'au clic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Envoyés', value: m.emailsSent, pct: 100 },
              { label: 'Délivrés', value: m.emailsSent, pct: 100 - bounceRate },
              { label: `Ouverts (${openRate.toFixed(0)}%)`, value: m.emailOpensUnique, pct: openRate },
              { label: `Cliqués (${clickRate.toFixed(1)}%)`, value: m.emailClicks, pct: clickRate },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">{s.label}</span>
                  <span className="font-bold">{s.value.toLocaleString('fr-FR')}</span>
                </div>
                <Progress value={Math.max(0, Math.min(100, s.pct))} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ═══ CONVERSION ═══ */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-blue-500">{m.activeTrials}</p>
              <p className="text-sm text-muted-foreground">Essais gratuits actifs</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-emerald-500">{m.paidSubscribers}</p>
              <p className="text-sm text-muted-foreground">Abonnés payants</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-amber-500">{conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Taux de conversion global</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-4">
          Statistiques calculées directement depuis EbookStudio (base de données + envois Brevo via API). Aucune configuration Brevo requise.
        </p>
      </div>
    </div>
  );
};

export default BusinessCenterPage;
