import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CrmHeader } from '@/components/crm/CrmHeader';
import { CrmStats } from '@/components/crm/CrmStats';
import { CrmContactList } from '@/components/crm/CrmContactList';
import { CrmContactDialog } from '@/components/crm/CrmContactDialog';
import { CrmActivityPanel } from '@/components/crm/CrmActivityPanel';
import { CrmKanban } from '@/components/crm/CrmKanban';
import { CrmAnalytics } from '@/components/crm/CrmAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import LeadsInscritsPanel from '@/components/admin/LeadsInscritsPanel';
import AdminPaymentsDashboardPage from '@/pages/admin/AdminPaymentsDashboardPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, RefreshCw, UserPlus } from 'lucide-react';

export interface CrmContact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  temperature: string;
  tags: string[];
  notes: string;
  last_interaction_at: string | null;
  total_emails_opened: number;
  total_clicks: number;
  lifetime_value: number;
  created_at: string;
  updated_at: string;
}

export interface CrmActivity {
  id: string;
  contact_id: string;
  activity_type: string;
  description: string;
  metadata: any;
  created_at: string;
}

interface FunnelLeadRow {
  id: string;
  email: string;
  first_name: string | null;
  lead_magnet: string | null;
  utm_source: string | null;
  ab_variant: string | null;
  created_at: string;
}

interface SequenceRow {
  email: string;
  sequence_name: string;
  current_step: number;
  completed: boolean;
  unsubscribed: boolean;
}

const CrmPage: React.FC = () => {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemperature, setFilterTemperature] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [funnelLeads, setFunnelLeads] = useState<FunnelLeadRow[]>([]);
  const [leadSequences, setLeadSequences] = useState<Record<string, SequenceRow>>({});
  const [syncingLeads, setSyncingLeads] = useState(false);
  const [guideClicks, setGuideClicks] = useState(0);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error('Erreur chargement contacts');
      console.error(error);
    } else {
      setContacts((data as any[]) || []);
    }
    setLoading(false);
  }, []);

  const fetchActivities = useCallback(async (contactId: string) => {
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error) {
      setActivities((data as any[]) || []);
    }
  }, []);

  const fetchFunnelLeads = useCallback(async () => {
    const { data: leadsData } = await (supabase as any)
      .from('funnel_leads')
      .select('id, email, first_name, lead_magnet, utm_source, ab_variant, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    setFunnelLeads((leadsData || []) as FunnelLeadRow[]);

    const { data: seqData } = await (supabase as any)
      .from('email_sequences')
      .select('email, sequence_name, current_step, completed, unsubscribed');

    const seqMap: Record<string, SequenceRow> = {};
    for (const row of (seqData || []) as SequenceRow[]) {
      seqMap[(row.email || '').toLowerCase().trim()] = row;
    }
    setLeadSequences(seqMap);

    const { count: clickCount } = await (supabase as any)
      .from('email_clicks')
      .select('id', { count: 'exact', head: true });
    setGuideClicks(clickCount || 0);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetchContacts();
        fetchFunnelLeads();
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchContacts();
        fetchFunnelLeads();
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchContacts, fetchFunnelLeads]);

  const importFromProspects = async () => {
    const { data: prospects, error } = await supabase
      .from('sales_prospects')
      .select('*');

    if (error || !prospects) {
      toast.error('Erreur import prospects');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get existing emails to avoid duplicates
    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));

    // Get email opens data
    const { data: opens } = await supabase.from('email_opens').select('*');
    const opensByEmail = new Map<string, number>();
    opens?.forEach(o => {
      const count = opensByEmail.get(o.prospect_email) || 0;
      opensByEmail.set(o.prospect_email, count + 1);
    });

    const newContacts = prospects
      .filter(p => !existingEmails.has(p.email.toLowerCase()))
      .map(p => {
        const emailOpens = opensByEmail.get(p.email) || 0;
        const isHot = emailOpens > 0 || (p.current_step && p.current_step >= 2);
        return {
          user_id: session.user.id,
          email: p.email,
          first_name: p.first_name || '',
          last_name: '',
          source: p.source || 'prospect_import',
          status: p.completed ? 'converted' : p.unsubscribed ? 'lost' : 'lead',
          temperature: isHot ? 'hot' : 'cold',
          total_emails_opened: emailOpens,
          tags: [p.source || 'prospect'].filter(Boolean),
          notes: `Importé depuis prospects. Step: ${p.current_step || 0}`,
          last_interaction_at: p.last_email_sent_at,
        };
      });

    if (newContacts.length === 0) {
      toast.info('Aucun nouveau prospect à importer');
      return;
    }

    const { error: insertError } = await supabase
      .from('crm_contacts')
      .insert(newContacts as any);

    if (insertError) {
      toast.error('Erreur lors de l\'import');
      console.error(insertError);
    } else {
      toast.success(`${newContacts.length} prospects importés !`);
      fetchContacts();
    }
  };

  const importFromSubscribers = async () => {
    const { data: subs, error } = await supabase
      .from('subscribers')
      .select('*');

    if (error || !subs) {
      toast.error('Erreur import abonnés');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()));

    const newContacts = subs
      .filter(s => !existingEmails.has(s.email.toLowerCase()))
      .map(s => ({
        user_id: session.user.id,
        email: s.email,
        first_name: '',
        last_name: '',
        source: 'subscriber',
        status: 'client',
        temperature: 'hot',
        tags: [s.plan_type, s.plan_tier].filter(Boolean),
        notes: `Abonné ${s.plan_type} (${s.plan_tier}). Code: ${s.access_code || 'N/A'}`,
        lifetime_value: s.plan_tier === 'vip' ? 67 : s.plan_type === 'lifetime' ? 67 : 0,
      }));

    if (newContacts.length === 0) {
      toast.info('Aucun nouvel abonné à importer');
      return;
    }

    const { error: insertError } = await supabase
      .from('crm_contacts')
      .insert(newContacts as any);

    if (insertError) {
      toast.error('Erreur import');
      console.error(insertError);
    } else {
      toast.success(`${newContacts.length} abonnés importés !`);
      fetchContacts();
    }
  };

  const syncLeadMagnetsToCrm = async () => {
    setSyncingLeads(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session admin non détectée');
        return;
      }

      const existingEmails = new Set(contacts.map(c => (c.email || '').toLowerCase().trim()));

      const [{ data: opens }, { data: clicks }] = await Promise.all([
        (supabase as any).from('email_opens').select('prospect_email'),
        (supabase as any).from('email_clicks').select('prospect_email'),
      ]);

      const openCounts = new Map<string, number>();
      for (const row of (opens || []) as { prospect_email: string }[]) {
        const key = (row.prospect_email || '').toLowerCase().trim();
        if (key) openCounts.set(key, (openCounts.get(key) || 0) + 1);
      }

      const clickCounts = new Map<string, number>();
      for (const row of (clicks || []) as { prospect_email: string }[]) {
        const key = (row.prospect_email || '').toLowerCase().trim();
        if (key) clickCounts.set(key, (clickCounts.get(key) || 0) + 1);
      }

      const rows = funnelLeads
        .filter(lead => !existingEmails.has((lead.email || '').toLowerCase().trim()))
        .map(lead => {
          const key = (lead.email || '').toLowerCase().trim();
          const seq = leadSequences[key];
          const isExpat = lead.lead_magnet === 'publier-kdp-etranger' || seq?.sequence_name?.startsWith('expat');
          const opened = openCounts.get(key) || 0;
          const clicked = clickCounts.get(key) || 0;
          const temperature = clicked > 0 ? 'hot' : opened > 0 || isExpat ? 'warm' : 'cold';

          return {
            user_id: session.user.id,
            email: lead.email,
            first_name: lead.first_name || '',
            last_name: '',
            source: lead.utm_source || lead.lead_magnet || 'lead_magnet',
            status: seq?.completed ? 'qualified' : 'lead',
            temperature,
            tags: ['inscrit', isExpat ? 'expatrié' : 'général', lead.lead_magnet || 'guide'].filter(Boolean),
            notes: `Inscrit via guide ${lead.lead_magnet || 'général'} · Séquence ${seq?.sequence_name || 'non démarrée'} · Étape ${seq?.current_step || 0}`,
            total_emails_opened: opened,
            total_clicks: clicked,
            last_interaction_at: lead.created_at,
          };
        });

      if (rows.length === 0) {
        toast.info('Tous les inscrits sont déjà visibles dans le CRM ✅');
        return;
      }

      const { error } = await (supabase as any).from('crm_contacts').insert(rows);
      if (error) throw error;

      toast.success(`✅ ${rows.length} inscrit(s) ajoutés au CRM`);
      fetchContacts();
      fetchFunnelLeads();
    } catch (err: any) {
      toast.error('Erreur synchro CRM : ' + (err.message || ''));
    } finally {
      setSyncingLeads(false);
    }
  };

  const updateContact = async (id: string, updates: Partial<CrmContact>) => {
    const { error } = await supabase
      .from('crm_contacts')
      .update(updates as any)
      .eq('id', id);

    if (error) {
      toast.error('Erreur mise à jour');
    } else {
      toast.success('Contact mis à jour');
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, ...updates } : null);
      }
    }
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from('crm_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur suppression');
    } else {
      toast.success('Contact supprimé');
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setShowActivityPanel(false);
      }
    }
  };

  const addActivity = async (contactId: string, type: string, description: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('crm_activities')
      .insert({
        contact_id: contactId,
        user_id: session.user.id,
        activity_type: type,
        description,
      } as any);

    if (!error) {
      // Update last_interaction_at
      await supabase
        .from('crm_contacts')
        .update({ last_interaction_at: new Date().toISOString() } as any)
        .eq('id', contactId);

      fetchActivities(contactId);
      fetchContacts();
    }
  };

  const openContactDetail = (contact: CrmContact) => {
    setSelectedContact(contact);
    setShowActivityPanel(true);
    fetchActivities(contact.id);
  };

  const filteredContacts = contacts.filter(c => {
    const matchSearch = !searchQuery ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTemp = filterTemperature === 'all' || c.temperature === filterTemperature;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;

    return matchSearch && matchTemp && matchStatus;
  });

  // Stats
  const stats = {
    total: contacts.length,
    hot: contacts.filter(c => c.temperature === 'hot').length,
    warm: contacts.filter(c => c.temperature === 'warm').length,
    cold: contacts.filter(c => c.temperature === 'cold').length,
    leads: contacts.filter(c => c.status === 'lead').length,
    clients: contacts.filter(c => c.status === 'client').length,
    converted: contacts.filter(c => c.status === 'converted').length,
    lost: contacts.filter(c => c.status === 'lost').length,
    totalRevenue: contacts.reduce((sum, c) => sum + (c.lifetime_value || 0), 0),
  };

  const contactEmails = new Set(contacts.map(c => (c.email || '').toLowerCase().trim()));
  const hiddenLeadCount = funnelLeads.filter(l => !contactEmails.has((l.email || '').toLowerCase().trim())).length;
  const expatLeadCount = funnelLeads.filter(l => {
    const key = (l.email || '').toLowerCase().trim();
    return l.lead_magnet === 'publier-kdp-etranger' || leadSequences[key]?.sequence_name?.startsWith('expat');
  }).length;
  const latestLeads = funnelLeads.slice(0, 5);

  const now = Date.now();
  const leads30d = funnelLeads.filter(l => {
    const t = l.created_at ? new Date(l.created_at).getTime() : 0;
    return now - t <= 30 * 24 * 3600 * 1000;
  }).length;
  const engagedLeads = Object.values(leadSequences).filter(s => (s.current_step || 0) > 0).length;
  const clickRate = funnelLeads.length > 0 ? Math.round((guideClicks / funnelLeads.length) * 100) : 0;

  // Comparatif test A/B (popup + sticky) : inscrits par variante
  const variantA = funnelLeads.filter(l => l.ab_variant === 'A').length;
  const variantB = funnelLeads.filter(l => l.ab_variant === 'B').length;
  const variantTracked = variantA + variantB;
  const variantAShare = variantTracked > 0 ? Math.round((variantA / variantTracked) * 100) : 0;
  const variantBShare = variantTracked > 0 ? Math.round((variantB / variantTracked) * 100) : 0;
  const abWinner = variantTracked === 0 ? null : variantA === variantB ? 'égalité' : variantA > variantB ? 'A' : 'B';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <AdminPanelNav className="mb-6" />
      </div>

      <CrmHeader
        onImportProspects={importFromProspects}
        onImportSubscribers={importFromSubscribers}
        onAddContact={() => setShowAddDialog(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CrmStats stats={stats} />

        <Card className="border-primary/30 bg-card">
          <CardContent className="p-4">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Conversion visiteurs → abonnés</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-2xl font-bold text-foreground">{funnelLeads.length}</p>
                <p className="text-xs text-muted-foreground">Inscrits (total)</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-2xl font-bold text-primary">{leads30d}</p>
                <p className="text-xs text-muted-foreground">Inscrits (30 jours)</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-2xl font-bold text-foreground">{expatLeadCount}</p>
                <p className="text-xs text-muted-foreground">🌍 Expatriés</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-2xl font-bold text-foreground">{clickRate}%</p>
                <p className="text-xs text-muted-foreground">{guideClicks} clics guide · {engagedLeads} relancés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card">
          <CardContent className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Test A/B — popup &amp; bandeau</h2>
              {abWinner && abWinner !== 'égalité' && (
                <Badge className="bg-primary/15 text-primary border-primary/30">Variante {abWinner} en tête</Badge>
              )}
              {abWinner === 'égalité' && <Badge variant="outline">Égalité pour l'instant</Badge>}
            </div>
            {variantTracked === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune inscription attribuée à une variante pour l'instant. Les nouveaux inscrits via le popup ou le bandeau seront répartis automatiquement entre la variante A (offre actuelle) et la variante B (nouvelle promesse).
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Variante A · « niches rentables »</span>
                    <span className="text-2xl font-bold text-foreground">{variantA}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${variantAShare}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{variantAShare}% des inscrits attribués</p>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Variante B · « 1er ebook en 7 jours »</span>
                    <span className="text-2xl font-bold text-foreground">{variantB}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${variantBShare}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{variantBShare}% des inscrits attribués</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card ring-1 ring-primary/10">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">Inscrits visibles dans le CRM</h2>
                    <Badge className="bg-primary/15 text-primary border-primary/30">{funnelLeads.length} inscrits</Badge>
                    <Badge variant="outline">🌍 {expatLeadCount} expatriés</Badge>
                    {hiddenLeadCount > 0 && (
                      <Badge className="bg-orange-500/15 text-orange-500 border-orange-500/30">{hiddenLeadCount} à rapatrier</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Les visiteurs qui téléchargent les guides apparaissent ici, puis peuvent être ajoutés en contacts CRM.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={fetchFunnelLeads}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
                </Button>
                <Button size="sm" onClick={syncLeadMagnetsToCrm} disabled={syncingLeads || funnelLeads.length === 0}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {syncingLeads ? 'Synchro…' : 'Ajouter au CRM'}
                </Button>
              </div>
            </div>

            {funnelLeads.length === 0 ? (
              <div className="mt-4 rounded-md border border-dashed border-border bg-background/40 p-6 text-center">
                <Globe className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Aucun inscrit pour le moment</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Les visiteurs qui téléchargent un guide (lead magnet) apparaîtront ici automatiquement.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                {latestLeads.map((lead) => {
                  const key = (lead.email || '').toLowerCase().trim();
                  const seq = leadSequences[key];
                  const inCrm = contactEmails.has(key);
                  const isExpat = lead.lead_magnet === 'publier-kdp-etranger' || seq?.sequence_name?.startsWith('expat');
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => setSearchQuery(lead.email)}
                      className="rounded-md border border-border bg-background/50 p-3 text-left transition hover:bg-muted/40"
                    >
                      <div className="truncate text-sm font-medium text-foreground">{lead.email}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant={isExpat ? 'default' : 'outline'} className="text-xs">
                          {isExpat ? '🌍 Expatrié' : 'Général'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {inCrm ? 'Dans CRM' : 'À ajouter'}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="kanban">📋 Pipeline</TabsTrigger>
            <TabsTrigger value="list">📃 Liste</TabsTrigger>
            <TabsTrigger value="inscrits">🌍 Inscrits</TabsTrigger>
            <TabsTrigger value="paiements">💳 Paiements</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-4">
            <div className="flex gap-6">
              <div className={`flex-1 ${showActivityPanel ? 'max-w-[65%]' : ''}`}>
                <CrmKanban
                  contacts={filteredContacts}
                  onUpdateContact={updateContact}
                  onSelectContact={openContactDetail}
                />
              </div>
              {showActivityPanel && selectedContact && (
                <div className="w-[35%]">
                  <CrmActivityPanel
                    contact={selectedContact}
                    activities={activities}
                    onClose={() => { setShowActivityPanel(false); setSelectedContact(null); }}
                    onAddActivity={addActivity}
                    onUpdateContact={updateContact}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="flex gap-6">
              <div className={`flex-1 ${showActivityPanel ? 'max-w-[60%]' : ''}`}>
                <CrmContactList
                  contacts={filteredContacts}
                  loading={loading}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterTemperature={filterTemperature}
                  onFilterTemperatureChange={setFilterTemperature}
                  filterStatus={filterStatus}
                  onFilterStatusChange={setFilterStatus}
                  onSelectContact={openContactDetail}
                  onUpdateContact={updateContact}
                  onDeleteContact={deleteContact}
                  selectedContactId={selectedContact?.id}
                />
              </div>
              {showActivityPanel && selectedContact && (
                <div className="w-[40%]">
                  <CrmActivityPanel
                    contact={selectedContact}
                    activities={activities}
                    onClose={() => { setShowActivityPanel(false); setSelectedContact(null); }}
                    onAddActivity={addActivity}
                    onUpdateContact={updateContact}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <CrmAnalytics contacts={contacts} />
          </TabsContent>

          <TabsContent value="inscrits" className="mt-4">
            <LeadsInscritsPanel />
          </TabsContent>
        </Tabs>
      </div>

      <CrmContactDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={async (contact) => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const { error } = await supabase
            .from('crm_contacts')
            .insert({ ...contact, user_id: session.user.id } as any);

          if (error) {
            toast.error('Erreur création contact');
          } else {
            toast.success('Contact ajouté');
            setShowAddDialog(false);
            fetchContacts();
          }
        }}
      />
    </div>
  );
};

export default CrmPage;
