import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  FileText, 
  Headphones, 
  BarChart3,
  ArrowRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminPanelNav } from '@/components/admin/AdminPanelNav';
import { supabase } from '@/integrations/supabase/client';

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
    totalProjects: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalAudiobooks: 0,
    totalWorkflowResults: 0,
    recentProjects: [],
    recentSubscribers: [],
  });
  const [loading, setLoading] = useState(true);

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
        totalProjects: projectsRes.count ?? 0,
        totalSubscribers: subscribersRes.count ?? 0,
        activeSubscribers: activeCount,
        totalAudiobooks: audiobooksRes.count ?? 0,
        totalWorkflowResults: workflowRes.count ?? 0,
        recentProjects: recentProjectsRes.data ?? [],
        recentSubscribers: recentSubsRes.data ?? [],
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleResumeGenerator = () => {
    try { localStorage.setItem('ebook_planner_active_tab', 'workflow-dashboard'); } catch {}
    navigate('/ebook-planner');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `Il y a ${diffD}j`;
  };

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-yellow-500/20 text-yellow-400';
      case 'pro': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-6">
      <div className="container mx-auto max-w-7xl">
        <AdminPanelNav className="mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              📊 Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-2">Vue d'ensemble de votre activité EbookStudio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button size="lg" onClick={handleResumeGenerator}>
              <BookOpen className="h-4 w-4 mr-2" />
              Reprendre le générateur
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projets ebook</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Abonnés actifs</p>
                  <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total abonnés</p>
                  <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Audiobooks</p>
                  <p className="text-2xl font-bold">{stats.totalAudiobooks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Résultats IA</p>
                  <p className="text-2xl font-bold">{stats.totalWorkflowResults}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two columns: Recent Projects + Recent Subscribers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Projets récents
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/ebook-planner')}>
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recentProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun projet pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.author_name || 'Auteur non défini'} · {formatDate(project.updated_at)}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Subscribers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Derniers abonnés
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                Gérer <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recentSubscribers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun abonné pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentSubscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium text-sm">{sub.email}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(sub.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getPlanColor(sub.plan_tier)}`}>
                          {sub.plan_tier.toUpperCase()}
                        </Badge>
                        <Badge variant={sub.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {sub.status === 'active' ? '✅' : '⏸️'} {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate('/ebook-planner')}>
                <BookOpen className="h-6 w-6" />
                <span className="text-xs">Générateur</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate('/admin')}>
                <Users className="h-6 w-6" />
                <span className="text-xs">Abonnés</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate('/dashboard-marketing')}>
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Marketing</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => navigate('/offres')}>
                <Zap className="h-6 w-6" />
                <span className="text-xs">Offres</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriberActivityPopup />
    </div>
  );
};

export default Dashboard;
