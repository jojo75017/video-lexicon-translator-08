import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Upload, Users, Send, Play, Pause, Trash2,
  Mail, CheckCircle, Clock, AlertCircle, RefreshCw,
  FileSpreadsheet, Zap, BarChart3, Globe, Copy, Route
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import LeadsInscritsPanel from '@/components/admin/LeadsInscritsPanel';
import TemplatePerformancePanel from '@/components/admin/TemplatePerformancePanel';
import AbKitPanel from '@/components/admin/AbKitPanel';
import CommunicationJourneyTracker from '@/components/admin/CommunicationJourneyTracker';
import { ACTIVE_EMAIL_CAMPAIGN } from '@/data/canonicalEmailCampaign';


interface Prospect {
  id: string;
  email: string;
  first_name: string;
  current_step: number;
  auto_send: boolean;
  status: string;
  unsubscribed: boolean;
  completed: boolean;
  last_email_sent_at: string | null;
  next_email_at: string | null;
  imported_at: string;
  source?: string;
  relance_sent_at?: string | null;
  relance_status?: string | null;
  relance_round?: number | null;
}

const STEPS = ACTIVE_EMAIL_CAMPAIGN.steps;
const EMAIL_SENDING_BLOCKED = ACTIVE_EMAIL_CAMPAIGN.sendingBlocked;

const ProspectManagerPage = () => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sending, setSending] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showClickedOnly, setShowClickedOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Map email -> { count, last } pour les ouvertures d'emails (preuve de réception/lecture)
  const [opensByEmail, setOpensByEmail] = useState<Record<string, { count: number; last: string }>>({});
  // Map email -> détail des ouvertures (date/heure + étape)
  const [openDetails, setOpenDetails] = useState<Record<string, { at: string; step: number }[]>>({});
  // Map email -> { count, urls } pour les clics sur les liens
  const [clicksByEmail, setClicksByEmail] = useState<Record<string, { count: number; urls: string[] }>>({});
  // Map email -> détail des clics (url + date/heure + étape)
  const [clickDetails, setClickDetails] = useState<Record<string, { url: string; at: string; step: number }[]>>({});
  // Ensemble des emails présents dans la table des abonnés
  const [subscriberSet, setSubscriberSet] = useState<Set<string>>(new Set());
  // Prospect dont on affiche la fiche détaillée dans le panneau
  const [detailEmail, setDetailEmail] = useState<string | null>(null);
  // Affichage progressif : éviter de monter 648+ lignes (17k nœuds DOM) d'un coup,
  // ce qui saturait la mémoire et rendait l'onglet Chrome instable.
  const PAGE_SIZE = 100;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeManagerTab, setActiveManagerTab] = useState('prospects');

  const fetchOpens = useCallback(async () => {
    // Pagination obligatoire : PostgREST plafonne à 1000 lignes par requête,
    // or la table email_opens dépasse largement ce seuil. Sans cela, la plupart
    // des ouvreurs ne sont pas détectés et la relance ne trouve personne.
    const pageSize = 1000;
    let from = 0;
    const rows: { prospect_email: string; opened_at: string; email_step: number }[] = [];
    while (true) {
      const { data, error } = await (supabase as any)
        .from('email_opens')
        .select('prospect_email, opened_at, email_step')
        .order('opened_at', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error || !data || data.length === 0) break;
      rows.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }
    const data = rows;
    const map: Record<string, { count: number; last: string }> = {};
    const details: Record<string, { at: string; step: number }[]> = {};
    for (const row of data as { prospect_email: string; opened_at: string; email_step: number }[]) {
      const key = (row.prospect_email || '').toLowerCase().trim();
      if (!key) continue;
      if (!map[key]) map[key] = { count: 0, last: row.opened_at };
      map[key].count += 1;
      if (row.opened_at > map[key].last) map[key].last = row.opened_at;
      if (!details[key]) details[key] = [];
      details[key].push({ at: row.opened_at, step: row.email_step });
    }
    setOpensByEmail(map);
    setOpenDetails(details);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('subscribers')
      .select('email');
    if (error || !data) return;
    const set = new Set<string>();
    for (const row of data as { email: string }[]) {
      const key = (row.email || '').toLowerCase().trim();
      if (key) set.add(key);
    }
    setSubscriberSet(set);
  }, []);

  const fetchClicks = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('email_clicks')
      .select('prospect_email, clicked_url, clicked_at, email_step')
      .order('clicked_at', { ascending: false });
    if (error || !data) return;
    const map: Record<string, { count: number; urls: string[] }> = {};
    const details: Record<string, { url: string; at: string; step: number }[]> = {};
    for (const row of data as { prospect_email: string; clicked_url: string; clicked_at: string; email_step: number }[]) {
      const key = (row.prospect_email || '').toLowerCase().trim();
      if (!key) continue;
      if (!map[key]) map[key] = { count: 0, urls: [] };
      map[key].count += 1;
      if (row.clicked_url && !map[key].urls.includes(row.clicked_url)) {
        map[key].urls.push(row.clicked_url);
      }
      if (!details[key]) details[key] = [];
      details[key].push({ url: row.clicked_url, at: row.clicked_at, step: row.email_step });
    }
    setClicksByEmail(map);
    setClickDetails(details);
  }, []);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('sales_prospects')
      .select('*')
      .order('imported_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      toast.error('Erreur de chargement');
    } else {
      setProspects(data || []);
    }
    fetchOpens();
    fetchClicks();
    fetchSubscribers();
    setLoading(false);
  }, [fetchOpens, fetchClicks, fetchSubscribers]);

  const hasOpened = useCallback(
    (email: string) => !!opensByEmail[(email || '').toLowerCase().trim()],
    [opensByEmail]
  );

  const hasClicked = useCallback(
    (email: string) => !!clicksByEmail[(email || '').toLowerCase().trim()],
    [clicksByEmail]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      const connected = !!data.session;
      setHasSession(connected);
      setAuthReady(true);

      if (connected) {
        fetchProspects();
      } else {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      // On ignore TOKEN_REFRESHED : cet événement se déclenche régulièrement
      // (rafraîchissement du jeton, retour d'onglet) et relancer fetchProspects
      // à chaque fois re-paginait des milliers d'ouvertures + re-rendait les
      // centaines de lignes, faisant saturer la mémoire et planter l'onglet.
      if (_event === 'TOKEN_REFRESHED') return;

      const connected = !!session;
      setHasSession(connected);
      setAuthReady(true);

      if (connected) {
        fetchProspects();
      } else {
        setProspects([]);
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchProspects]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      if (rows.length === 0) {
        toast.error('Fichier vide');
        setImporting(false);
        return;
      }

      // Map common column names
      const mapped = rows.map(row => ({
        email: row.email || row.Email || row.EMAIL || row['E-mail'] || row['e-mail'] || '',
        first_name: row.prenom || row.Prenom || row.Prénom || row.prénom ||
          row.first_name || row.FirstName || row.nom || row.Nom || row.Name || row.name || '',
      }));

      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('import-prospects', {
        body: { prospects: mapped, auto_send: false },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });

      if (error) throw error;

      toast.success(`✅ ${data.imported} prospects importés (${data.skipped} ignorés)`);
      fetchProspects();
    } catch (err: any) {
      console.error('Import error:', err);
      toast.error('Erreur lors de l\'import : ' + (err.message || ''));
    }
    setImporting(false);
    e.target.value = '';
  };

  const handleSendManual = async (step: number) => {
    if (EMAIL_SENDING_BLOCKED) {
      toast.error('Zéro envoi actif : le domaine email doit d’abord être validé.');
      return;
    }
    const ids = selectedIds.size > 0
      ? Array.from(selectedIds)
      : prospects.filter(p => p.status === 'active' && !p.unsubscribed && !p.completed).map(p => p.id);

    if (ids.length === 0) {
      toast.error('Aucun prospect à cibler');
      return;
    }

    setSending(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('send-sales-email', {
        body: { mode: 'manual', step, prospect_ids: ids },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });

      if (error) throw error;
      toast.success(`📧 ${data.sent} emails envoyés (étape ${step})`);
      fetchProspects();
    } catch (err: any) {
      toast.error('Erreur d\'envoi : ' + (err.message || ''));
    }
    setSending(false);
  };

  // Rapatrier les prospects vers le CRM (table crm_contacts) pour alimenter le pipeline
  const handleSyncToCrm = async () => {
    if (prospects.length === 0) {
      toast.error('Aucun prospect à rapatrier');
      return;
    }
    setSyncing(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) {
        toast.error('Session expirée, reconnecte-toi');
        setSyncing(false);
        return;
      }

      // Emails déjà présents dans le CRM (pour éviter les doublons)
      const { data: existing } = await (supabase as any)
        .from('crm_contacts')
        .select('email');
      const existingEmails = new Set(
        (existing || []).map((r: { email: string }) => (r.email || '').toLowerCase().trim())
      );

      const rows = prospects
        .filter(p => p.email && !existingEmails.has(p.email.toLowerCase().trim()))
        .map(p => {
          const key = p.email.toLowerCase().trim();
          const opens = opensByEmail[key];
          const clicks = clicksByEmail[key];
          const opened = opens?.count || 0;
          const clicked = clicks?.count || 0;
          let temperature = 'cold';
          if (clicked > 0) temperature = 'hot';
          else if (opened > 0) temperature = 'warm';
          return {
            user_id: userId,
            email: p.email,
            first_name: p.first_name || '',
            source: p.source || 'prospects_import',
            status: 'lead',
            temperature,
            total_emails_opened: opened,
            total_clicks: clicked,
            last_interaction_at: opens?.last || null,
            notes: `Importé depuis Prospects (étape ${p.current_step})`,
          };
        });

      if (rows.length === 0) {
        toast.info('Tous les prospects sont déjà dans le CRM ✅');
        setSyncing(false);
        return;
      }

      // Insertion par lots de 500
      let inserted = 0;
      for (let i = 0; i < rows.length; i += 500) {
        const batch = rows.slice(i, i + 500);
        const { error } = await (supabase as any).from('crm_contacts').insert(batch);
        if (error) throw error;
        inserted += batch.length;
      }
      toast.success(`✅ ${inserted} prospects rapatriés dans le CRM`);
    } catch (err: any) {
      toast.error('Erreur de rapatriement : ' + (err.message || ''));
    }
    setSyncing(false);
  };

  const toggleAutoSend = async (id: string, value: boolean) => {
    if (EMAIL_SENDING_BLOCKED && value) {
      toast.error('Auto-envoi bloqué tant que le domaine email n’est pas validé.');
      return;
    }
    await (supabase as any).from('sales_prospects').update({ auto_send: value }).eq('id', id);
    setProspects(prev => prev.map(p => p.id === id ? { ...p, auto_send: value } : p));
  };

  const toggleAllAutoSend = async (value: boolean) => {
    if (EMAIL_SENDING_BLOCKED && value) {
      toast.error('Auto-envoi bloqué tant que le domaine email n’est pas validé.');
      return;
    }
    const activeIds = prospects.filter(p => p.status === 'active' && !p.completed).map(p => p.id);
    if (activeIds.length === 0) return;
    await (supabase as any).from('sales_prospects').update({ auto_send: value }).in('id', activeIds);
    setProspects(prev => prev.map(p =>
      activeIds.includes(p.id) ? { ...p, auto_send: value } : p
    ));
    toast.success(value ? '🤖 Auto-envoi activé pour tous' : '⏸️ Auto-envoi désactivé');
  };

  const deleteProspect = async (id: string) => {
    await (supabase as any).from('sales_prospects').delete().eq('id', id);
    setProspects(prev => prev.filter(p => p.id !== id));
    toast.success('Prospect supprimé');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Stats
  const total = prospects.length;
  const active = prospects.filter(p => p.status === 'active' && !p.completed).length;
  const completed = prospects.filter(p => p.completed).length;
  const autoEnabled = prospects.filter(p => p.auto_send).length;
  const hotCount = prospects.filter(p => p.status === 'active' && !p.completed && hasOpened(p.email)).length;
  const clickCount = prospects.filter(p => hasClicked(p.email)).length;
  // Cliqueurs enregistrés au total (toutes sources : prospects, leads funnel, newsletter…)
  const totalClickers = Object.keys(clicksByEmail).length;
  // Cliqueurs présents dans email_clicks mais absents de la liste prospects
  const offListClickers = Math.max(0, totalClickers - clickCount);
  const stepDistribution = STEPS.map(s => ({
    ...s,
    count: prospects.filter(p => p.current_step === s.step).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdminPanelNav className="mb-6" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">
            📋 Gestion des Prospects
          </h1>
          <p className="text-muted-foreground">
            Campagne unique {ACTIVE_EMAIL_CAMPAIGN.price} · anciens automatismes arrêtés
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          <Pause className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Zéro envoi actif</p>
            <p className="text-sm text-muted-foreground">Tous les emails d’application et de campagne sont bloqués jusqu’à la validation du domaine email.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-card border-border ring-1 ring-orange-500/40">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-orange-400">{hotCount}</div>
              <div className="text-xs text-muted-foreground">🔥 Chauds (ont ouvert)</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border ring-1 ring-emerald-500/40">
            <CardContent className="p-4 text-center">
              <Mail className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-emerald-400">{clickCount}</div>
              <div className="text-xs text-muted-foreground">👆 Ont cliqué</div>
              {offListClickers > 0 && (
                <div className="text-[10px] text-muted-foreground mt-1">
                  {totalClickers} cliqueurs au total · {offListClickers} hors liste prospects
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-gold-light" />
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <div className="text-xs text-muted-foreground">Total prospects</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Play className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
              <div className="text-2xl font-bold text-foreground">{active}</div>
              <div className="text-xs text-muted-foreground">Actifs</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-foreground">{completed}</div>
              <div className="text-xs text-muted-foreground">Terminés (5/5)</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-amber-400" />
              <div className="text-2xl font-bold text-foreground">{autoEnabled}</div>
              <div className="text-xs text-muted-foreground">Auto-envoi ON</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeManagerTab} onValueChange={setActiveManagerTab} className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-card border border-border p-1 md:grid-cols-4 xl:grid-cols-7">
            <TabsTrigger value="prospects" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Users className="h-4 w-4 mr-2" /> Prospects
            </TabsTrigger>
            <TabsTrigger value="inscrits" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Globe className="h-4 w-4 mr-2" /> Inscrits
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Send className="h-4 w-4 mr-2" /> Envoi Manuel
            </TabsTrigger>
            <TabsTrigger value="abkit" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Copy className="h-4 w-4 mr-2" /> Kit GetResponse
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Mail className="h-4 w-4 mr-2" /> Templates
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <BarChart3 className="h-4 w-4 mr-2" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Route className="h-4 w-4 mr-2" /> Suivi global
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4">
            <CommunicationJourneyTracker onSelectTab={setActiveManagerTab} />
          </TabsContent>

          {/* KIT GETRESPONSE TAB */}
          <TabsContent value="abkit" className="space-y-4">
            <AbKitPanel />
          </TabsContent>


          {/* INSCRITS (leads lead-magnet) TAB */}
          <TabsContent value="inscrits" className="space-y-4">
            <LeadsInscritsPanel />
          </TabsContent>


          {/* PROSPECTS TAB */}
          <TabsContent value="prospects" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={importing}
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold/30 text-gold-light hover:bg-gold/10 transition cursor-pointer text-sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  {importing ? 'Import en cours...' : 'Importer Excel / CSV'}
                </div>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllAutoSend(true)}
                disabled={EMAIL_SENDING_BLOCKED}
                className="border-primary/20 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Play className="h-3 w-3 mr-1" /> Auto ON (tous)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllAutoSend(false)}
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                <Pause className="h-3 w-3 mr-1" /> Auto OFF (tous)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClickedOnly(v => !v)}
                className={showClickedOnly
                  ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }
              >
                <Mail className="h-3 w-3 mr-1" />
                {showClickedOnly ? '👆 Afficher tous' : `👆 Voir les ${clickCount} cliqueurs`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncToCrm}
                disabled={syncing}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Users className="h-3 w-3 mr-1" />
                {syncing ? 'Rapatriement...' : 'Rapatrier vers le CRM'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchProspects}
                className="ml-auto text-muted-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Format Excel : colonnes <code>email</code> et <code>prenom</code> (ou <code>first_name</code>, <code>nom</code>)
            </p>

            {!authReady || loading ? (
              <div className="text-center py-12 text-muted-foreground">Chargement...</div>
            ) : !hasSession ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Session admin non détectée. Reconnectez-vous via /admin-direct.</p>
              </div>
            ) : prospects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Aucun prospect. Importez un fichier Excel pour commencer.</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-card/80 border-b border-border">
                      <tr>
                        <th className="px-3 py-2 text-left text-muted-foreground font-medium">✓</th>
                        <th className="px-3 py-2 text-left text-muted-foreground font-medium">Email</th>
                        <th className="px-3 py-2 text-left text-muted-foreground font-medium">Prénom</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Reçu / Ouvert / Cliqué</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Étape</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Auto</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Statut</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prospects
                        .filter(p => !showClickedOnly || hasClicked(p.email))
                        .slice(0, visibleCount)
                        .map(p => (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-card/50">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(p.id)}
                              onChange={() => toggleSelect(p.id)}
                              className="accent-gold"
                            />
                          </td>
                          <td className="px-3 py-2 text-foreground">{p.email}</td>
                          <td className="px-3 py-2 text-foreground">{p.first_name || '—'}</td>
                          <td className="px-3 py-2 text-center">
                            {(() => {
                              const key = (p.email || '').toLowerCase().trim();
                              const o = opensByEmail[key];
                              const c = clicksByEmail[key];
                              const isSub = subscriberSet.has(key);
                              return (
                                <div className="flex flex-col items-center gap-1">
                                  {isSub && (
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                      ✅ Abonné
                                    </Badge>
                                  )}
                                  {o ? (
                                    <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30">
                                      🔥 Ouvert ×{o.count}
                                    </Badge>
                                  ) : p.current_step > 0 ? (
                                    <Badge variant="outline" className="text-muted-foreground">Envoyé</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">—</span>
                                  )}
                                  {c ? (
                                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                                      👆 Cliqué ×{c.count}
                                    </Badge>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground">Non cliqué</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setDetailEmail(p.email)}
                                    className="inline-flex items-center text-xs text-gold-light underline decoration-dotted hover:text-gold cursor-pointer"
                                  >
                                    📋 Voir la fiche
                                  </button>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Badge variant="outline" className="border-gold/30 text-gold-light">
                                {p.current_step}/5
                              </Badge>
                              {(p.relance_round ?? 0) > 0 && (
                                <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/30 text-[10px]">
                                  ✨ Relance {p.relance_round}/3
                                </Badge>
                              )}
                            </div>
                          </td>

                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={p.auto_send}
                              onChange={(e) => toggleAutoSend(p.id, e.target.checked)}
                              disabled={EMAIL_SENDING_BLOCKED}
                              className="accent-gold h-4 w-4 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            {p.completed ? (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Terminé</Badge>
                            ) : p.unsubscribed ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Désinscrit</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-primary/20">Actif</Badge>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteProspect(p.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(() => {
                  const total = prospects.filter(p => !showClickedOnly || hasClicked(p.email)).length;
                  if (visibleCount >= total) return null;
                  return (
                    <div className="flex items-center justify-center gap-3 py-3 border-t border-border bg-card/40">
                      <span className="text-xs text-muted-foreground">
                        {Math.min(visibleCount, total)} / {total} affichés
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Afficher plus
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisibleCount(total)}
                        className="text-muted-foreground"
                      >
                        Tout afficher ({total})
                      </Button>
                    </div>
                  );
                })()}
              </div>
            )}
          </TabsContent>

          {/* MANUAL SEND TAB */}
          <TabsContent value="send" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient-gold text-lg">Séquence unique — envoi contrôlé</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} prospect(s) sélectionné(s)`
                    : `Tous les prospects actifs (${active})`} · aucun envoi sans action explicite
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {STEPS.map(s => (
                  <div key={s.step} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-light font-bold text-sm">
                        {s.step}
                      </div>
                      <div>
                        <span className="text-foreground font-medium">{s.label}</span>
                        <span className="text-muted-foreground text-xs ml-2">({s.delay})</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendManual(s.step)}
                      disabled={sending || EMAIL_SENDING_BLOCKED}
                      className="bg-gradient-to-r from-gold to-gold-dark text-black font-semibold hover:opacity-90"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {EMAIL_SENDING_BLOCKED ? 'Bloqué' : sending ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TEMPLATES PERFORMANCE TAB */}
          <TabsContent value="templates" className="space-y-4">
            <TemplatePerformancePanel />
          </TabsContent>

          {/* PIPELINE TAB */}
          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient-gold text-lg">Pipeline de Conversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">0</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-foreground">Pas encore contactés</span>
                      <span className="text-gold-light font-bold">
                        {prospects.filter(p => p.current_step === 0).length}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
                        style={{ width: `${total ? (prospects.filter(p => p.current_step === 0).length / total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                {stepDistribution.map(s => (
                  <div key={s.step} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-light font-bold text-sm">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-foreground">{s.label} ({s.delay})</span>
                        <span className="text-gold-light font-bold">{s.count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
                          style={{ width: `${total ? (s.count / total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* FICHE PROSPECT */}
      {detailEmail && (() => {
        const key = (detailEmail || '').toLowerCase().trim();
        const prospect = prospects.find(p => (p.email || '').toLowerCase().trim() === key);
        const isSub = subscriberSet.has(key);
        const opens = openDetails[key] || [];
        const clicks = clickDetails[key] || [];
        const sentCount = prospect?.current_step || 0;
        const stepLabel = (s: number) => STEPS.find(x => x.step === s)?.label || `Étape ${s}`;
        // Construit la liste des emails envoyés à partir des étapes franchies
        const sentList = Array.from({ length: sentCount }, (_, i) => i + 1);
        // Timeline des événements (ouvertures + clics) triée du plus récent au plus ancien
        const events = [
          ...opens.map(o => ({ type: 'open' as const, at: o.at, step: o.step })),
          ...clicks.map(c => ({ type: 'click' as const, at: c.at, step: c.step, url: c.url })),
        ].sort((a, b) => (b.at || '').localeCompare(a.at || ''));
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setDetailEmail(null)}
          >
            <div
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-gold/30 bg-card p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gold-light font-semibold truncate pr-2">
                  📋 {detailEmail}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setDetailEmail(null)} className="text-muted-foreground">
                  ✕
                </Button>
              </div>

              {/* Statuts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {isSub ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">✅ Abonné</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Prospect</Badge>
                )}
                {clicks.length > 0 ? (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">👆 A cliqué ×{clicks.length}</Badge>
                ) : (
                  <Badge className="bg-red-500/15 text-red-400 border-red-500/30">Non cliqué</Badge>
                )}
                {opens.length > 0 && (
                  <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30">🔥 Ouvert ×{opens.length}</Badge>
                )}
                {prospect?.unsubscribed && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Désinscrit</Badge>
                )}
              </div>

              {/* Emails reçus */}
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  📧 Emails envoyés : {sentCount}
                </p>
                {sentCount === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun email envoyé pour l'instant.</p>
                ) : (
                  <ul className="space-y-1">
                    {sentList.map(s => (
                      <li key={s} className="flex items-center justify-between rounded-md border border-border/50 bg-background/50 px-3 py-1.5 text-xs">
                        <span className="text-foreground">Étape {s} · {stepLabel(s)}</span>
                        {s === sentCount && prospect?.last_email_sent_at && (
                          <span className="text-muted-foreground">
                            dernier envoi : {new Date(prospect.last_email_sent_at).toLocaleString('fr-FR')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {prospect?.next_email_at && !prospect.completed && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Prochain email prévu : {new Date(prospect.next_email_at).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>

              {/* Historique des interactions */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">🕒 Interactions (dates)</p>
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune ouverture ni clic enregistré.</p>
                ) : (
                  <ul className="space-y-2">
                    {events.map((e, i) => (
                      <li key={i} className="rounded-md border border-border/50 bg-background/50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className={e.type === 'click' ? 'border-emerald-500/40 text-emerald-400' : 'border-orange-500/40 text-orange-400'}>
                            {e.type === 'click' ? '👆 Clic' : '🔥 Ouverture'} · Étape {e.step ?? '—'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {e.at ? new Date(e.at).toLocaleString('fr-FR') : '—'}
                          </span>
                        </div>
                        {e.type === 'click' && (e as any).url && (
                          <a
                            href={(e as any).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block break-all text-xs text-emerald-400 hover:underline"
                          >
                            {(e as any).url}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProspectManagerPage;
