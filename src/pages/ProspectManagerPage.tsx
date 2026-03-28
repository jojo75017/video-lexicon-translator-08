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
  FileSpreadsheet, Zap, BarChart3
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';

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
}

const STEPS = [
  { step: 1, label: 'Curiosité', day: 'J+0' },
  { step: 2, label: 'Douleur', day: 'J+2' },
  { step: 3, label: 'Preuve', day: 'J+4' },
  { step: 4, label: 'Urgence', day: 'J+6' },
  { step: 5, label: 'Dernier appel', day: 'J+7' },
];

const ProspectManagerPage = () => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sending, setSending] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setLoading(false);
  }, []);

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

  const toggleAutoSend = async (id: string, value: boolean) => {
    await (supabase as any).from('sales_prospects').update({ auto_send: value }).eq('id', id);
    setProspects(prev => prev.map(p => p.id === id ? { ...p, auto_send: value } : p));
  };

  const toggleAllAutoSend = async (value: boolean) => {
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
            Import Excel, envoi automatique & manuel de la séquence de vente
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        <Tabs defaultValue="prospects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="prospects" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Users className="h-4 w-4 mr-2" /> Prospects
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <Send className="h-4 w-4 mr-2" /> Envoi Manuel
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
              <BarChart3 className="h-4 w-4 mr-2" /> Pipeline
            </TabsTrigger>
          </TabsList>

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
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
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
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Étape</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Auto</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Statut</th>
                        <th className="px-3 py-2 text-center text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prospects.map(p => (
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
                            <Badge variant="outline" className="border-gold/30 text-gold-light">
                              {p.current_step}/5
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={p.auto_send}
                              onChange={(e) => toggleAutoSend(p.id, e.target.checked)}
                              className="accent-gold h-4 w-4 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            {p.completed ? (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Terminé</Badge>
                            ) : p.unsubscribed ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Désinscrit</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Actif</Badge>
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
              </div>
            )}
          </TabsContent>

          {/* MANUAL SEND TAB */}
          <TabsContent value="send" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-gradient-gold text-lg">Envoi Manuel par Vague</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} prospect(s) sélectionné(s)`
                    : `Tous les prospects actifs (${active})`}
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
                        <span className="text-muted-foreground text-xs ml-2">({s.day})</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendManual(s.step)}
                      disabled={sending}
                      className="bg-gradient-to-r from-gold to-gold-dark text-black font-semibold hover:opacity-90"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {sending ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                        <span className="text-foreground">{s.label} ({s.day})</span>
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
    </div>
  );
};

export default ProspectManagerPage;
