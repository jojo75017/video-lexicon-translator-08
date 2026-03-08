import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, Users, MousePointerClick, TrendingUp, Send, Eye, 
  BarChart3, Heart, MessageSquare, Share2, ArrowUpRight, 
  RefreshCw, Target, Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react';

interface ProspectStats {
  total: number;
  active: number;
  completed: number;
  unsubscribed: number;
  byStep: Record<number, number>;
  autoSendActive: number;
}

interface SocialStats {
  totalPosts: number;
  published: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalClicks: number;
  byPlatform: Record<string, { posts: number; likes: number; comments: number; shares: number; clicks: number }>;
}

const STEP_LABELS: Record<number, string> = {
  0: 'Non contacté',
  1: 'Email 1 — Curiosité',
  2: 'Email 2 — Douleur',
  3: 'Email 3 — Preuve sociale',
  4: 'Email 4 — Urgence',
  5: 'Email 5 — Dernier appel',
};

const PLATFORM_COLORS: Record<string, string> = {
  facebook: 'bg-blue-500',
  linkedin: 'bg-sky-600',
  tiktok: 'bg-pink-500',
  pinterest: 'bg-red-500',
  x: 'bg-slate-600',
};

const UnifiedMarketingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [prospectStats, setProspectStats] = useState<ProspectStats>({ total: 0, active: 0, completed: 0, unsubscribed: 0, byStep: {}, autoSendActive: 0 });
  const [socialStats, setSocialStats] = useState<SocialStats>({ totalPosts: 0, published: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalClicks: 0, byPlatform: {} });
  const [recentProspects, setRecentProspects] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [emailOpens, setEmailOpens] = useState<{ total: number; byStep: Record<number, number>; uniqueEmails: number }>({ total: 0, byStep: {}, uniqueEmails: 0 });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch prospects
      const { data: prospects } = await supabase.from('sales_prospects').select('*');
      if (prospects) {
        const byStep: Record<number, number> = {};
        prospects.forEach(p => {
          const step = p.current_step || 0;
          byStep[step] = (byStep[step] || 0) + 1;
        });
        setProspectStats({
          total: prospects.length,
          active: prospects.filter(p => p.status === 'active' && !p.unsubscribed && !p.completed).length,
          completed: prospects.filter(p => p.completed).length,
          unsubscribed: prospects.filter(p => p.unsubscribed).length,
          byStep,
          autoSendActive: prospects.filter(p => p.auto_send).length,
        });
        setRecentProspects(prospects.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()).slice(0, 5));
      }

      // Fetch social posts
      const { data: posts } = await supabase.from('social_posts').select('*');
      if (posts) {
        const byPlatform: Record<string, { posts: number; likes: number; comments: number; shares: number; clicks: number }> = {};
        posts.forEach(p => {
          if (!byPlatform[p.platform]) byPlatform[p.platform] = { posts: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };
          byPlatform[p.platform].posts++;
          byPlatform[p.platform].likes += p.likes_count || 0;
          byPlatform[p.platform].comments += p.comments_count || 0;
          byPlatform[p.platform].shares += p.shares_count || 0;
          byPlatform[p.platform].clicks += p.clicks_count || 0;
        });
        setSocialStats({
          totalPosts: posts.length,
          published: posts.filter(p => p.status === 'published').length,
          totalLikes: posts.reduce((s, p) => s + (p.likes_count || 0), 0),
          totalComments: posts.reduce((s, p) => s + (p.comments_count || 0), 0),
          totalShares: posts.reduce((s, p) => s + (p.shares_count || 0), 0),
          totalClicks: posts.reduce((s, p) => s + (p.clicks_count || 0), 0),
          byPlatform,
        });
        setRecentPosts(posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
      }

      // Fetch email opens
      const { data: opens } = await supabase.from('email_opens').select('*');
      if (opens) {
        const byStep: Record<number, number> = {};
        const uniqueSet = new Set<string>();
        opens.forEach((o: any) => {
          byStep[o.email_step] = (byStep[o.email_step] || 0) + 1;
          uniqueSet.add(o.prospect_email);
        });
        setEmailOpens({ total: opens.length, byStep, uniqueEmails: uniqueSet.size });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const totalEngagement = socialStats.totalLikes + socialStats.totalComments + socialStats.totalShares;
  const emailsSent = Object.entries(prospectStats.byStep).reduce((sum, [step, count]) => sum + (Number(step) > 0 ? count * Number(step) : 0), 0);
  // Estimate: steps completed × prospects at that step
  const estimatedEmailsSent = Array.from({ length: 6 }, (_, i) => i).reduce((sum, step) => {
    return sum + (prospectStats.byStep[step] || 0) * step;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">📊 Tableau de Bord Marketing</h1>
            <p className="text-white/60 mt-1">Vue unifiée prospects, emails et réseaux sociaux</p>
          </div>
          <Button onClick={fetchAll} variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Prospects', value: prospectStats.total, icon: Users, color: 'text-blue-400' },
            { label: 'Emails envoyés', value: estimatedEmailsSent, icon: Send, color: 'text-emerald-400' },
            { label: 'Emails ouverts', value: emailOpens.total, icon: Eye, color: 'text-orange-400' },
            { label: 'Taux ouverture', value: estimatedEmailsSent > 0 ? `${Math.round((emailOpens.uniqueEmails / prospectStats.total) * 100)}%` : '—', icon: TrendingUp, color: 'text-amber-400', isText: true },
            { label: 'Engagement social', value: totalEngagement, icon: Heart, color: 'text-pink-400' },
            { label: 'Clics total', value: socialStats.totalClicks, icon: MousePointerClick, color: 'text-cyan-400' },
          ].map((kpi, i) => (
            <Card key={i} className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-2xl font-black">{kpi.value.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-white/50 mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="prospects" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="prospects">📋 Pipeline Email</TabsTrigger>
            <TabsTrigger value="social">📣 Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="clicks">🖱️ Clics & Conversions</TabsTrigger>
          </TabsList>

          {/* ═══ TAB PROSPECTS ═══ */}
          <TabsContent value="prospects" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-emerald-950/30 border-emerald-900/50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-3xl font-black text-emerald-400">{prospectStats.completed}</p>
                  <p className="text-sm text-white/60">Séquence terminée</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-900/50">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-black text-blue-400">{prospectStats.active}</p>
                  <p className="text-sm text-white/60">En cours de nurturing</p>
                </CardContent>
              </Card>
              <Card className="bg-red-950/30 border-red-900/50">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-3xl font-black text-red-400">{prospectStats.unsubscribed}</p>
                  <p className="text-sm text-white/60">Désinscrits</p>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline funnel */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Pipeline d'emails (5 étapes)</CardTitle>
                <CardDescription className="text-white/50">Distribution des prospects par étape</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[0, 1, 2, 3, 4, 5].map(step => {
                  const count = prospectStats.byStep[step] || 0;
                  const pct = prospectStats.total > 0 ? (count / prospectStats.total) * 100 : 0;
                  return (
                    <div key={step} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">{STEP_LABELS[step]}</span>
                        <span className="font-bold text-white">{count} <span className="text-white/40">({pct.toFixed(0)}%)</span></span>
                      </div>
                      <Progress value={pct} className="h-3" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent prospects */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Derniers prospects importés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentProspects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                      <div>
                        <p className="font-medium text-white">{p.email}</p>
                        <p className="text-xs text-white/50">{p.first_name || '—'} • Étape {p.current_step}/5</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.auto_send && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">Auto</Badge>}
                        <Badge variant="secondary" className="text-xs">
                          {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentProspects.length === 0 && <p className="text-white/40 text-center py-4">Aucun prospect</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB SOCIAL ═══ */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Posts publiés', value: socialStats.published, icon: Send, color: 'text-emerald-400' },
                { label: 'Likes', value: socialStats.totalLikes, icon: Heart, color: 'text-pink-400' },
                { label: 'Commentaires', value: socialStats.totalComments, icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Partages', value: socialStats.totalShares, icon: Share2, color: 'text-violet-400' },
              ].map((m, i) => (
                <Card key={i} className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-5">
                    <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
                    <p className="text-2xl font-black">{m.value}</p>
                    <p className="text-xs text-white/50">{m.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Platform breakdown */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Engagement par plateforme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(socialStats.byPlatform).map(([platform, stats]) => (
                  <div key={platform} className="p-4 rounded-xl bg-slate-800/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${PLATFORM_COLORS[platform] || 'bg-gray-500'}`} />
                      <span className="font-bold text-white capitalize">{platform}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">{stats.posts} posts</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-center text-sm">
                      <div><p className="text-pink-400 font-bold">{stats.likes}</p><p className="text-white/40 text-xs">Likes</p></div>
                      <div><p className="text-blue-400 font-bold">{stats.comments}</p><p className="text-white/40 text-xs">Commentaires</p></div>
                      <div><p className="text-violet-400 font-bold">{stats.shares}</p><p className="text-white/40 text-xs">Partages</p></div>
                      <div><p className="text-cyan-400 font-bold">{stats.clicks}</p><p className="text-white/40 text-xs">Clics</p></div>
                    </div>
                  </div>
                ))}
                {Object.keys(socialStats.byPlatform).length === 0 && (
                  <p className="text-white/40 text-center py-4">Aucun post enregistré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ TAB CLICKS ═══ */}
          <TabsContent value="clicks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-cyan-950/30 border-cyan-900/50">
                <CardContent className="p-6 text-center">
                  <MousePointerClick className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <p className="text-4xl font-black text-cyan-400">{socialStats.totalClicks}</p>
                  <p className="text-sm text-white/60 mt-1">Clics réseaux sociaux</p>
                </CardContent>
              </Card>
              <Card className="bg-emerald-950/30 border-emerald-900/50">
                <CardContent className="p-6 text-center">
                  <Mail className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-4xl font-black text-emerald-400">{estimatedEmailsSent}</p>
                  <p className="text-sm text-white/60 mt-1">Emails envoyés (estimés)</p>
                  <p className="text-xs text-white/40 mt-1">Les liens cliquables dans chaque email redirigent vers /offres et /demo</p>
                </CardContent>
              </Card>
            </div>

            {/* Top posts by clicks */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">🖱️ Posts avec le plus de clics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPosts
                    .sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0))
                    .slice(0, 5)
                    .map(post => (
                      <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[post.platform] || 'bg-gray-500'}`} />
                            <span className="text-xs text-white/50 capitalize">{post.platform}</span>
                            <Badge variant="secondary" className="text-xs">{post.status}</Badge>
                          </div>
                          <p className="text-sm text-white truncate">{post.content.substring(0, 80)}...</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-black text-cyan-400">{post.clicks_count || 0}</p>
                          <p className="text-xs text-white/40">clics</p>
                        </div>
                      </div>
                    ))}
                  {recentPosts.length === 0 && <p className="text-white/40 text-center py-4">Aucune donnée de clic</p>}
                </div>
              </CardContent>
            </Card>

            {/* Info about email links */}
            <Card className="bg-amber-950/20 border-amber-900/40">
              <CardContent className="p-6">
                <h3 className="font-bold text-amber-400 mb-2">📧 Liens dans les emails de vente</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Chaque email de la séquence de 5 étapes contient des liens cliquables vers :
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Démo gratuite</strong> → ebookstudio.fr/demo</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Page d'offres</strong> → ebookstudio.fr/offres</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Profil Amazon</strong> → amazon.fr/Mr-Georges-Boubet (preuve sociale)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span><strong>Lien de désinscription</strong> → inclus en bas de chaque email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedMarketingDashboard;
