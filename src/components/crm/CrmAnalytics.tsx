import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CrmContact } from '@/pages/CrmPage';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Mail, MousePointerClick, ArrowRightLeft } from 'lucide-react';

interface CrmAnalyticsProps {
  contacts: CrmContact[];
}

const COLORS = ['hsl(var(--primary))', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ef4444'];

export const CrmAnalytics: React.FC<CrmAnalyticsProps> = ({ contacts }) => {
  const [emailOpens, setEmailOpens] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [opensRes, prospectsRes, subsRes] = await Promise.all([
        supabase.from('email_opens').select('*'),
        supabase.from('sales_prospects').select('*'),
        supabase.from('subscribers').select('*'),
      ]);
      if (opensRes.data) setEmailOpens(opensRes.data);
      if (prospectsRes.data) setProspects(prospectsRes.data);
      if (subsRes.data) setSubscribers(subsRes.data);
    };
    load();
  }, []);

  // Pipeline conversion funnel
  const pipeline = useMemo(() => {
    const statuses = ['lead', 'qualified', 'negotiation', 'client', 'converted'];
    return statuses.map(s => ({
      name: s === 'lead' ? 'Lead' : s === 'qualified' ? 'Qualifié' : s === 'negotiation' ? 'Négociation' : s === 'client' ? 'Client' : 'Converti',
      count: contacts.filter(c => c.status === s).length,
    }));
  }, [contacts]);

  // Conversion rates
  const conversionRates = useMemo(() => {
    const total = contacts.length || 1;
    const clients = contacts.filter(c => c.status === 'client' || c.status === 'converted').length;
    const qualified = contacts.filter(c => ['qualified', 'negotiation', 'client', 'converted'].includes(c.status)).length;
    const lost = contacts.filter(c => c.status === 'lost').length;

    return {
      leadToQualified: total > 0 ? Math.round((qualified / total) * 100) : 0,
      leadToClient: total > 0 ? Math.round((clients / total) * 100) : 0,
      lostRate: total > 0 ? Math.round((lost / total) * 100) : 0,
    };
  }, [contacts]);

  // MRR calculation from subscribers
  const mrr = useMemo(() => {
    const activeSubs = subscribers.filter(s => s.status === 'active');
    let monthly = 0;
    activeSubs.forEach(s => {
      if (s.plan_tier === 'vip') monthly += 97 / 12; // VIP yearly
      else if (s.plan_type === 'lifetime') monthly += 47 / 24; // Lifetime amortized
      else if (s.plan_type === 'starter') monthly += 27;
    });
    return {
      mrr: Math.round(monthly),
      activeSubscribers: activeSubs.length,
      totalSubscribers: subscribers.length,
      arpu: activeSubs.length > 0 ? Math.round(monthly / activeSubs.length) : 0,
    };
  }, [subscribers]);

  // Temperature distribution (pie)
  const temperatureData = useMemo(() => [
    { name: '🔵 Chaud', value: contacts.filter(c => c.temperature === 'hot').length, color: '#3b82f6' },
    { name: '🟡 Tiède', value: contacts.filter(c => c.temperature === 'warm').length, color: '#f59e0b' },
    { name: '⚫ Froid', value: contacts.filter(c => c.temperature === 'cold').length, color: '#6b7280' },
  ].filter(d => d.value > 0), [contacts]);

  // Source distribution
  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    contacts.forEach(c => {
      const src = c.source || 'inconnu';
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [contacts]);

  // Email engagement
  const emailStats = useMemo(() => {
    const totalProspects = prospects.length || 1;
    const uniqueOpeners = new Set(emailOpens.map(o => o.prospect_email)).size;
    const openRate = Math.round((uniqueOpeners / totalProspects) * 100);

    // Opens by step
    const byStep: Record<number, number> = {};
    emailOpens.forEach(o => {
      byStep[o.email_step] = (byStep[o.email_step] || 0) + 1;
    });
    const stepData = Object.entries(byStep).map(([step, count]) => ({
      name: `Email ${step}`,
      ouvertures: count,
    })).sort((a, b) => a.name.localeCompare(b.name));

    return { openRate, uniqueOpeners, totalOpens: emailOpens.length, stepData };
  }, [emailOpens, prospects]);

  // Prospect pipeline (step distribution)
  const prospectSteps = useMemo(() => {
    const steps = [0, 1, 2, 3, 4, 5];
    return steps.map(s => ({
      name: s === 0 ? 'Nouveau' : `Step ${s}`,
      count: prospects.filter(p => (p.current_step || 0) === s).length,
    }));
  }, [prospects]);

  // Contact creation over time (last 30 days)
  const timelineData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days[d.toISOString().split('T')[0]] = 0;
    }
    contacts.forEach(c => {
      const day = c.created_at?.split('T')[0];
      if (day && days[day] !== undefined) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: date.slice(5), // MM-DD
      contacts: count,
    }));
  }, [contacts]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<Target className="h-5 w-5" />} label="Taux Lead → Client" value={`${conversionRates.leadToClient}%`} color="text-emerald-500" />
        <KpiCard icon={<ArrowRightLeft className="h-5 w-5" />} label="Taux Lead → Qualifié" value={`${conversionRates.leadToQualified}%`} color="text-blue-500" />
        <KpiCard icon={<DollarSign className="h-5 w-5" />} label="MRR Estimé" value={`${mrr.mrr}€`} color="text-emerald-600" />
        <KpiCard icon={<Mail className="h-5 w-5" />} label="Taux d'ouverture emails" value={`${emailStats.openRate}%`} color="text-amber-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<Users className="h-5 w-5" />} label="Contacts CRM" value={String(contacts.length)} color="text-primary" />
        <KpiCard icon={<Users className="h-5 w-5" />} label="Abonnés actifs" value={String(mrr.activeSubscribers)} color="text-emerald-500" />
        <KpiCard icon={<MousePointerClick className="h-5 w-5" />} label="Emails ouverts (unique)" value={String(emailStats.uniqueOpeners)} color="text-blue-500" />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="ARPU" value={`${mrr.arpu}€`} color="text-purple-500" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Entonnoir de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Répartition température</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {temperatureData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={temperatureData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {temperatureData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-12">Aucune donnée</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email engagement by step */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ouvertures emails par étape</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={emailStats.stepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ouvertures" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sources d'acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prospect steps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pipeline prospects (étapes email)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={prospectSteps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact creation timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Nouveaux contacts (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="contacts" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
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
