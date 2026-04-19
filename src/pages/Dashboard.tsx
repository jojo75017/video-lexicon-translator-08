import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'pro': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const kpiCards = [
    { label: 'Projets ebook', value: stats.totalProjects, icon: FileText, gradient: 'from-blue-500/20 to-blue-600/5', iconBg: 'bg-blue-500/15 text-blue-400', border: 'border-blue-500/20' },
    { label: 'Abonnés actifs', value: stats.activeSubscribers, icon: Activity, gradient: 'from-emerald-500/20 to-emerald-600/5', iconBg: 'bg-emerald-500/15 text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'Total abonnés', value: stats.totalSubscribers, icon: Users, gradient: 'from-purple-500/20 to-purple-600/5', iconBg: 'bg-purple-500/15 text-purple-400', border: 'border-purple-500/20' },
    { label: 'Audiobooks', value: stats.totalAudiobooks, icon: Headphones, gradient: 'from-orange-500/20 to-orange-600/5', iconBg: 'bg-orange-500/15 text-orange-400', border: 'border-orange-500/20' },
    { label: 'Résultats IA', value: stats.totalWorkflowResults, icon: Zap, gradient: 'from-cyan-500/20 to-cyan-600/5', iconBg: 'bg-cyan-500/15 text-cyan-400', border: 'border-primary/20' },
  ];

  const quickActions = [
    { label: 'Générateur', icon: BookOpen, path: '/ebook-planner', gradient: 'from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10', iconColor: 'text-primary' },
    { label: 'Abonnés', icon: Crown, path: '/admin', gradient: 'from-yellow-500/10 to-yellow-500/5 hover:from-yellow-500/20 hover:to-yellow-500/10', iconColor: 'text-yellow-400' },
    { label: 'Marketing', icon: BarChart3, path: '/dashboard-marketing', gradient: 'from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10', iconColor: 'text-emerald-400' },
    { label: 'Offres', icon: Sparkles, path: '/offres', gradient: 'from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10', iconColor: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl space-y-6">
        <AdminPanelNav className="mb-2" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tableau de bord
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Centre de pilotage EbookStudio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading} className="border-border/50 backdrop-blur-sm">
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button onClick={handleResumeGenerator} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20">
              <BookOpen className="h-4 w-4 mr-2" />
              Générateur
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label} className={`relative overflow-hidden border ${kpi.border} bg-gradient-to-br ${kpi.gradient} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                    <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Projects */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Projets récents
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/ebook-planner')} className="text-xs text-muted-foreground hover:text-foreground">
                Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucun projet pour le moment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentProjects.map((project) => (
                    <div key={project.id} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {project.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.author_name || 'Auteur non défini'} · {formatDate(project.updated_at)}
                          </p>
                        </div>
                      </div>
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Subscribers */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                Derniers abonnés
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-xs text-muted-foreground hover:text-foreground">
                Gérer <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.recentSubscribers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Aucun abonné pour le moment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentSubscribers.map((sub) => (
                    <div key={sub.id} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{sub.email}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(sub.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`text-[10px] px-2 py-0.5 border ${getPlanColor(sub.plan_tier)}`}>
                          {sub.plan_tier === 'vip' && <Crown className="h-3 w-3 mr-1" />}
                          {sub.plan_tier.toUpperCase()}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-muted-foreground/30'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-secondary/10">
                <TrendingUp className="h-4 w-4 text-secondary" />
              </div>
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/30 bg-gradient-to-br ${action.gradient} transition-all hover:shadow-md hover:scale-[1.02]`}
                >
                  <action.icon className={`h-7 w-7 ${action.iconColor} transition-transform group-hover:scale-110`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriberActivityPopup />
    </div>
  );
};

export default Dashboard;
