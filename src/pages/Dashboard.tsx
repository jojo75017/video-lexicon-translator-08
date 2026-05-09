import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';
import { SubscribersTable } from '@/components/admin/SubscribersTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Users, TrendingUp, Clock, FileText, Headphones,
  BarChart3, ArrowRight, RefreshCw, Zap, Activity, Crown, Sparkles, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { supabase } from '@/integrations/supabase/client';

interface Subscriber {
  id: string;
  email: string;
  access_code: string | null;
  plan_type: string;
  plan_tier: string;
  status: string;
  created_at: string;
  expires_at: string | null;
}

interface DashboardStats {
  totalProjects: number;
  totalSubscribers: number;
  activeSubscribers: number;
  totalAudiobooks: number;
  totalWorkflowResults: number;
  recentProjects: Array<{ id: string; title: string; updated_at: string; author_name: string | null }>;
  recentSubscribers: Array<{ id: string; email: string; plan_tier: string; status: string; created_at: string }>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0, totalSubscribers: 0, activeSubscribers: 0,
    totalAudiobooks: 0, totalWorkflowResults: 0, recentProjects: [], recentSubscribers: [],
  });
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projectsRes, subscribersRes, audiobooksRes, workflowRes, recentProjectsRes, recentSubsRes] = await Promise.all([
        supabase.from('ebook_projects').select('id', { count: 'exact', head: true }),
        supabase.from('subscribers').select('id, status', { count: 'exact' }),
        supabase.from('audiobooks').select('id', { count: 'exact', head: true }),
        supabase.from('workflow_results').select('id', { count: 'exact', head: true }),
        supabase.from('ebook_projects').select('id, title, updated_at, author_name').order('updated_at', { ascending: false }).limit(5),
        supabase.from('subscribers').select('id, email, plan_tier, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      const activeCount = subscribersRes.data?.filter(s => s.status === 'active').length ?? 0;
      setStats({
        totalProjects: projectsRes.count ?? 0, totalSubscribers: subscribersRes.count ?? 0,
        activeSubscribers: activeCount, totalAudiobooks: audiobooksRes.count ?? 0,
        totalWorkflowResults: workflowRes.count ?? 0,
        recentProjects: recentProjectsRes.data ?? [], recentSubscribers: recentSubsRes.data ?? [],
      });
    } catch (err) { console.error('Dashboard fetch error:', err); }
    finally { setLoading(false); }
  };

  const fetchAllSubscribers = async () => {
    setLoadingSubs(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('id, email, access_code, plan_type, plan_tier, status, created_at, expires_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllSubscribers(data || []);
    } catch (err) { console.error('Subscribers fetch error:', err); }
    finally { setLoadingSubs(false); }
  };

  useEffect(() => { fetchStats(); fetchAllSubscribers(); }, []);

  const handleResumeGenerator = () => {
    try { localStorage.setItem('ebook_planner_active_tab', 'workflow-dashboard'); } catch {}
    navigate('/ebook-planner');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return `Il y a ${Math.floor(diffH / 24)}j`;
  };

  const getPlanBadge = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-joy-sun text-joy-ink border-joy-ink/10';
      case 'pro': return 'bg-joy-lavender text-joy-ink border-joy-ink/10';
      default: return 'bg-joy-mint text-joy-ink border-joy-ink/10';
    }
  };

  const kpiCards = [
    { label: 'Projets ebook', value: stats.totalProjects, icon: FileText, bg: 'bg-joy-peach', border: 'border-[hsl(var(--joy-peach))]' },
    { label: 'Abonnés actifs', value: stats.activeSubscribers, icon: Activity, bg: 'bg-joy-mint', border: 'border-[hsl(var(--joy-mint))]' },
    { label: 'Total abonnés', value: stats.totalSubscribers, icon: Users, bg: 'bg-joy-lavender', border: 'border-[hsl(var(--joy-lavender))]' },
    { label: 'Audiobooks', value: stats.totalAudiobooks, icon: Headphones, bg: 'bg-joy-sun', border: 'border-[hsl(var(--joy-sun))]' },
    { label: 'Résultats IA', value: stats.totalWorkflowResults, icon: Zap, bg: 'bg-[hsl(var(--joy-bubblegum)/0.4)]', border: 'border-[hsl(var(--joy-bubblegum))]' },
  ];

  const quickActions = [
    { label: 'Générateur', icon: BookOpen, path: '/ebook-planner', bg: 'bg-joy-peach' },
    { label: 'Abonnés', icon: Crown, path: '/admin', bg: 'bg-joy-sun' },
    { label: 'Marketing', icon: BarChart3, path: '/dashboard-marketing', bg: 'bg-joy-mint' },
    { label: 'Offres', icon: Sparkles, path: '/offres', bg: 'bg-joy-lavender' },
  ];

  return (
    <div className="relative min-h-screen bg-joy-cream text-joy-ink overflow-x-hidden">
      {/* Blobs décoratifs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-joy-peach/60 blur-3xl animate-joy-float" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-joy-mint/50 blur-3xl animate-joy-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-joy-sun/40 blur-3xl animate-joy-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl space-y-6">
          <AdminPanelNav className="mb-2" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-joy-ink">
                Ton <span className="px-2 rounded-2xl bg-joy-sun inline-block -rotate-1">studio</span> ✨
              </h1>
              <p className="text-joy-ink/70 mt-2 text-base">Voilà ce qui se passe aujourd'hui 🌈</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchStats}
                disabled={loading}
                className="rounded-full border-2 border-joy-ink/20 bg-white hover:bg-joy-cream font-bold text-joy-ink"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                onClick={handleResumeGenerator}
                className="bg-joy-ink text-joy-cream hover:bg-joy-ink/90 font-black rounded-full px-5 shadow-joy"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Générateur
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpiCards.map((kpi) => (
              <div
                key={kpi.label}
                className={`relative overflow-hidden border-2 ${kpi.border} ${kpi.bg} rounded-3xl p-4 shadow-joy transition-all hover:shadow-joy-lg hover:-rotate-1`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-joy-ink/70 uppercase tracking-wider">{kpi.label}</p>
                    <p className="text-4xl font-black tracking-tight text-joy-ink">{kpi.value}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/70 text-joy-ink">
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs : Vue d'ensemble | Mes Abonnés */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white rounded-full p-1 shadow-joy h-auto">
              <TabsTrigger
                value="overview"
                className="gap-2 rounded-full font-bold data-[state=active]:bg-joy-ink data-[state=active]:text-joy-cream data-[state=active]:shadow-none text-joy-ink/60 py-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger
                value="subscribers"
                className="gap-2 rounded-full font-bold data-[state=active]:bg-joy-ink data-[state=active]:text-joy-cream data-[state=active]:shadow-none text-joy-ink/60 py-2"
              >
                <Crown className="h-4 w-4" /> Mes Abonnés
                <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-joy-sun text-joy-ink border-0">
                  {allSubscribers.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Projects */}
                <div className="bg-white rounded-3xl border-2 border-[hsl(var(--joy-peach))] shadow-joy p-5">
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2.5 text-base font-black text-joy-ink">
                      <div className="p-2 rounded-2xl bg-joy-peach">
                        <FileText className="h-4 w-4 text-joy-ink" />
                      </div>
                      Projets récents
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/ebook-planner')} className="text-xs text-joy-ink/70 hover:text-joy-ink hover:bg-joy-cream rounded-full">
                      Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  {stats.recentProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-sm text-joy-ink/60">Aucun projet pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stats.recentProjects.map((project) => (
                        <div key={project.id} className="group flex items-center justify-between p-3 rounded-2xl border-2 border-transparent hover:border-[hsl(var(--joy-peach))] hover:bg-joy-cream/50 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-joy-peach flex items-center justify-center text-joy-ink font-black text-sm">
                              {project.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-joy-ink">{project.title}</p>
                              <p className="text-xs text-joy-ink/60">
                                {project.author_name || 'Auteur non défini'} · {formatDate(project.updated_at)}
                              </p>
                            </div>
                          </div>
                          <Clock className="h-3.5 w-3.5 text-joy-ink/40 group-hover:text-joy-ink/70 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Subscribers */}
                <div className="bg-white rounded-3xl border-2 border-[hsl(var(--joy-mint))] shadow-joy p-5">
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2.5 text-base font-black text-joy-ink">
                      <div className="p-2 rounded-2xl bg-joy-mint">
                        <Users className="h-4 w-4 text-joy-ink" />
                      </div>
                      Derniers abonnés
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-xs text-joy-ink/70 hover:text-joy-ink hover:bg-joy-cream rounded-full">
                      Gérer <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  {stats.recentSubscribers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-sm text-joy-ink/60">Aucun abonné pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stats.recentSubscribers.map((sub) => (
                        <div key={sub.id} className="group flex items-center justify-between p-3 rounded-2xl border-2 border-transparent hover:border-[hsl(var(--joy-mint))] hover:bg-joy-cream/50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-joy-lavender flex items-center justify-center text-xs font-black text-joy-ink">
                              {sub.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-joy-ink">{sub.email}</p>
                              <p className="text-xs text-joy-ink/60">{formatDate(sub.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge className={`text-[10px] px-2 py-0.5 border font-bold ${getPlanBadge(sub.plan_tier)}`}>
                              {sub.plan_tier === 'vip' && <Crown className="h-3 w-3 mr-1" />}
                              {sub.plan_tier.toUpperCase()}
                            </Badge>
                            <div className={`w-2.5 h-2.5 rounded-full ${sub.status === 'active' ? 'bg-joy-mint border-2 border-joy-ink/30' : 'bg-joy-ink/20'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border-2 border-[hsl(var(--joy-lavender))] shadow-joy p-5">
                <div className="flex items-center gap-2.5 text-base font-black text-joy-ink pb-4">
                  <div className="p-2 rounded-2xl bg-joy-lavender">
                    <TrendingUp className="h-4 w-4 text-joy-ink" />
                  </div>
                  Actions rapides
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-joy-ink/10 ${action.bg} transition-all hover:shadow-joy hover:-rotate-2`}
                    >
                      <action.icon className="h-7 w-7 text-joy-ink transition-transform group-hover:scale-110" />
                      <span className="text-sm font-bold text-joy-ink">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscribers" className="mt-4">
              <div className="bg-white rounded-3xl border-2 border-joy-ink/10 shadow-joy p-2 md:p-3">
                <SubscribersTable
                  subscribers={allSubscribers}
                  loading={loadingSubs}
                  onRefresh={fetchAllSubscribers}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <SubscriberActivityPopup />
    </div>
  );
};

export default Dashboard;
