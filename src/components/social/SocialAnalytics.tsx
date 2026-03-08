import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { PLATFORM_CONFIG, SocialPlatform } from '@/data/socialPostTemplates';
import { BarChart3, TrendingUp, ThumbsUp, MessageCircle, Share2, MousePointerClick, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TrackedPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  scheduled_date: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  clicks_count: number;
  notes: string | null;
}

const SocialAnalytics: React.FC = () => {
  const [posts, setPosts] = useState<TrackedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('scheduled_date', { ascending: false });
    
    if (!error && data) {
      setPosts(data as TrackedPost[]);
    }
    setLoading(false);
  };

  const updateMetrics = async (id: string) => {
    const { error } = await supabase
      .from('social_posts')
      .update({
        likes_count: editValues.likes ?? 0,
        comments_count: editValues.comments ?? 0,
        shares_count: editValues.shares ?? 0,
        clicks_count: editValues.clicks ?? 0,
        status: 'published',
      })
      .eq('id', id);

    if (!error) {
      toast.success('Métriques mises à jour !');
      setEditingId(null);
      fetchPosts();
    }
  };

  const markAsPublished = async (id: string) => {
    await supabase.from('social_posts').update({ status: 'published' }).eq('id', id);
    fetchPosts();
    toast.success('Marqué comme publié');
  };

  // Stats
  const totalPosts = posts.length;
  const published = posts.filter(p => p.status === 'published').length;
  const totalLikes = posts.reduce((s, p) => s + (p.likes_count || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.comments_count || 0), 0);
  const totalShares = posts.reduce((s, p) => s + (p.shares_count || 0), 0);
  const totalClicks = posts.reduce((s, p) => s + (p.clicks_count || 0), 0);

  const platformStats = (Object.keys(PLATFORM_CONFIG) as SocialPlatform[]).map(p => ({
    platform: p,
    count: posts.filter(post => post.platform === p).length,
    likes: posts.filter(post => post.platform === p).reduce((s, post) => s + (post.likes_count || 0), 0),
    engagement: posts.filter(post => post.platform === p).reduce((s, post) => 
      s + (post.likes_count || 0) + (post.comments_count || 0) + (post.shares_count || 0), 0),
  })).filter(s => s.count > 0);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-foreground">{totalPosts}</div>
            <div className="text-xs text-muted-foreground">Posts total</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{published}</div>
            <div className="text-xs text-muted-foreground">Publiés</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalLikes + totalComments + totalShares}</div>
            <div className="text-xs text-muted-foreground">Engagement total</div>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{totalClicks}</div>
            <div className="text-xs text-muted-foreground">Clics</div>
          </CardContent>
        </Card>
      </div>

      {/* Platform breakdown */}
      {platformStats.length > 0 && (
        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Par plateforme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformStats.map(s => (
                <div key={s.platform} className="flex items-center gap-3">
                  <Badge className={`${PLATFORM_CONFIG[s.platform].color} border-0 w-24 justify-center`}>
                    {PLATFORM_CONFIG[s.platform].label}
                  </Badge>
                  <div className="flex-1 bg-background/50 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gold/60 rounded-full transition-all"
                      style={{ width: `${totalPosts ? (s.count / totalPosts) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-20 text-right">{s.count} posts</span>
                  <span className="text-sm text-muted-foreground w-24 text-right">❤️ {s.likes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts list with editable metrics */}
      {posts.length === 0 ? (
        <Card className="bg-card/60">
          <CardContent className="py-12 text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucun post suivi pour le moment.</p>
            <p className="text-sm mt-1">Utilisez le calendrier pour planifier des posts, puis notez vos performances ici.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Posts ({posts.length})</h3>
          {posts.map(post => (
            <Card key={post.id} className="bg-card/60 border-border/40">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${PLATFORM_CONFIG[post.platform as SocialPlatform]?.color || 'bg-muted'} border-0 text-xs`}>
                        {PLATFORM_CONFIG[post.platform as SocialPlatform]?.label || post.platform}
                      </Badge>
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'} className="text-xs">
                        {post.status === 'published' ? '✅ Publié' : post.status === 'scheduled' ? '📅 Planifié' : '📝 Brouillon'}
                      </Badge>
                      {post.scheduled_date && (
                        <span className="text-xs text-muted-foreground">{post.scheduled_date}</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 truncate">{post.content.substring(0, 100)}...</p>
                  </div>

                  {editingId === post.id ? (
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="❤️" className="w-16 h-8 text-xs" value={editValues.likes || ''} onChange={e => setEditValues(v => ({ ...v, likes: Number(e.target.value) }))} />
                      <Input type="number" placeholder="💬" className="w-16 h-8 text-xs" value={editValues.comments || ''} onChange={e => setEditValues(v => ({ ...v, comments: Number(e.target.value) }))} />
                      <Input type="number" placeholder="🔄" className="w-16 h-8 text-xs" value={editValues.shares || ''} onChange={e => setEditValues(v => ({ ...v, shares: Number(e.target.value) }))} />
                      <Input type="number" placeholder="🔗" className="w-16 h-8 text-xs" value={editValues.clicks || ''} onChange={e => setEditValues(v => ({ ...v, clicks: Number(e.target.value) }))} />
                      <Button size="sm" onClick={() => updateMetrics(post.id)}><Save className="h-3 w-3" /></Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {post.likes_count}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.comments_count}</span>
                      <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> {post.shares_count}</span>
                      <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> {post.clicks_count}</span>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(post.id); setEditValues({ likes: post.likes_count, comments: post.comments_count, shares: post.shares_count, clicks: post.clicks_count }); }}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      {post.status !== 'published' && (
                        <Button size="sm" variant="ghost" onClick={() => markAsPublished(post.id)}>✅</Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialAnalytics;
