import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  MessageSquare, Heart, Clock, Pin, Plus, ArrowLeft, Send, Bell, BellDot,
  Trophy, Users, TrendingUp, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import {
  useForumCategories, useForumPosts, useForumReplies, useForumNotifications,
  createForumPost, createForumReply, togglePostLike, checkUserLikedPost,
  type ForumPost
} from '@/hooks/useForum';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-500',
  purple: 'from-purple-500 to-violet-500',
  green: 'from-green-500 to-emerald-500',
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-rose-500',
};

const colorBgMap: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
  amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
};

// ─── Post Detail View ───
function PostDetail({ post, onBack }: { post: ForumPost; onBack: () => void }) {
  const { replies, loading } = useForumReplies(post.id);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    checkUserLikedPost(post.id).then(setLiked);
  }, [post.id]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSending(true);
    await createForumReply(post.id, replyContent);
    setReplyContent('');
    setSending(false);
  };

  const handleLike = async () => {
    await togglePostLike(post.id);
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>

      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-bold">
                  {post.author_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
                <p className="text-sm text-muted-foreground">
                  par <span className="font-medium">{post.author_name}</span> · {formatDistanceToNow(new Date(post.created_at), { locale: fr, addSuffix: true })}
                </p>
              </div>
            </div>
            {post.post_type === 'result' && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Trophy className="w-3 h-3 mr-1" /> Résultat
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={handleLike} disabled={!session} className={liked ? 'text-red-500' : ''}>
              <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-red-500' : ''}`} /> {likesCount}
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> {replies.length} réponses
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-3">
        {replies.map((reply, i) => (
          <motion.div key={reply.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-l-4 border-l-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-muted text-xs font-bold">
                      {reply.author_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reply.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.created_at), { locale: fr, addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reply input */}
      {session ? (
        <Card>
          <CardContent className="pt-4">
            <Textarea
              placeholder="Écrire une réponse..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleReply} disabled={sending || !replyContent.trim()} className="gap-2">
                <Send className="w-4 h-4" /> Répondre
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-4 text-center text-muted-foreground">
            <p>Connectez-vous pour répondre à cette discussion.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── New Post Dialog (contrôlé, avec tags) ───
function NewPostDialog({
  categories,
  onCreated,
  open,
  onOpenChange,
  defaultCategoryId,
}: {
  categories: any[];
  onCreated: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCategoryId?: string;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // Préselectionne la catégorie quand le dialog s'ouvre depuis une carte
  useEffect(() => {
    if (open) setCategoryId(defaultCategoryId || '');
  }, [open, defaultCategoryId]);

  const addTag = (raw: string) => {
    const clean = raw.trim().replace(/^#/, '').slice(0, 24);
    if (!clean) return;
    setTags(prev => (prev.includes(clean) || prev.length >= 5 ? prev : [...prev, clean]));
    setTagInput('');
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim() || !categoryId) return;
    setCreating(true);
    const result = await createForumPost(categoryId, title.trim(), content.trim(), postType, tags);
    setCreating(false);
    if (result) {
      onOpenChange(false);
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      onCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouveau sujet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="discussion">💬 Discussion</SelectItem>
              <SelectItem value="question">❓ Question</SelectItem>
              <SelectItem value="result">🏆 Partage de résultat</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Input placeholder="Titre du sujet" value={title} maxLength={140} onChange={e => setTitle(e.target.value)} />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">{title.length}/140</p>
          </div>
          <Textarea placeholder="Description : décrivez votre sujet ou votre blocage…" value={content} maxLength={5000} onChange={e => setContent(e.target.value)} rows={5} />
          <div>
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="text-muted-foreground hover:text-foreground">×</button>
                </Badge>
              ))}
              <input
                className="flex-1 min-w-[120px] bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={tags.length >= 5 ? 'Max 5 tags' : 'Ajouter un tag puis Entrée…'}
                value={tagInput}
                disabled={tags.length >= 5}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                onBlur={() => addTag(tagInput)}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Jusqu'à 5 tags pour aider les membres à trouver votre sujet.</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={creating || !title.trim() || !content.trim() || !categoryId}>
            {creating ? 'Publication...' : 'Publier le sujet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// ─── Notifications Panel ───
function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useForumNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          {unreadCount > 0 ? <BellDot className="w-4 h-4 text-red-500" /> : <Bell className="w-4 h-4" />}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>Tout marquer lu</Button>
            )}
          </div>
        </DialogHeader>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucune notification</p>
          ) : notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${n.is_read ? 'bg-muted/30' : 'bg-primary/5 border border-primary/20'}`}
            >
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(n.created_at), { locale: fr, addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Liens directs vers l'outil qui résout le blocage (deeplinks par rubrique)
const categoryToolLinks: Record<string, { label: string; to: string }> = {
  'kdp-publication': { label: 'Ouvrir le Planner KDP', to: '/ebook-planner' },
  'ecriture-ia': { label: 'Créer un ebook avec l\'IA', to: '/creer-ebook-ia' },
  'marketing-ventes': { label: 'Recherche de mots-clés', to: '/kdp-keywords' },
  'resultats-succes': { label: 'Explorer les niches', to: '/niches' },
  'questions-aide': { label: 'Demander à l\'assistant IA', to: '/ebookbot' },
  'compte-conformite': { label: 'Guide conformité & FAQ', to: '/faq' },
  'page-amazon': { label: 'Optimiser la fiche Amazon', to: '/kdp-keywords' },
  'paiements-royalties': { label: 'Calculer mes redevances', to: '/word-count' },
  'couverture-mise-en-forme': { label: 'Couverture KDP exacte', to: '/couverture-kdp' },
  'audiobooks-voix': { label: 'Studio Audiobook', to: '/formation-audio' },
};

const cardAccentMap: Record<string, string> = {
  blue: 'hover:border-blue-400/60 hover:shadow-blue-500/10',
  purple: 'hover:border-purple-400/60 hover:shadow-purple-500/10',
  green: 'hover:border-green-400/60 hover:shadow-green-500/10',
  amber: 'hover:border-amber-400/60 hover:shadow-amber-500/10',
  red: 'hover:border-red-400/60 hover:shadow-red-500/10',
};

// ─── Category Hub (cartes façon forum KDP officiel) ───
function CategoryHub({
  categories,
  counts,
  onSelect,
  onDeeplink,
  onNewTopic,
  canPost,
}: {
  categories: any[];
  counts: Record<string, number>;
  onSelect: (slug: string) => void;
  onDeeplink: (to: string) => void;
  onNewTopic: (categoryId: string) => void;
  canPost: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => {
        const link = categoryToolLinks[cat.slug];
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card
              className={`h-full cursor-pointer border transition-all hover:shadow-lg ${cardAccentMap[cat.color] || cardAccentMap.blue}`}
              onClick={() => onSelect(cat.slug)}
            >
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[cat.color] || colorMap.blue} text-xl shadow-sm`}>
                    {cat.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground leading-tight">{cat.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {counts[cat.id] || 0} discussion{(counts[cat.id] || 0) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                {cat.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-1">{cat.description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); onSelect(cat.slug); }}>
                    <MessageSquare className="h-3.5 w-3.5" /> Voir les fils
                  </Button>
                  {canPost && (
                    <Button size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); onNewTopic(cat.id); }}>
                      <Plus className="h-3.5 w-3.5" /> Nouveau sujet
                    </Button>
                  )}
                  {link && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-primary"
                      onClick={(e) => { e.stopPropagation(); onDeeplink(link.to); }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" /> {link.label}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Forum Page ───
export default function ForumPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || '';
  const activePostId = searchParams.get('post') || '';
  const { categories, loading: catsLoading } = useForumCategories();
  const { posts, loading: postsLoading, refetch } = useForumPosts(activeCategory);
  const [session, setSession] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostCat, setNewPostCat] = useState<string | undefined>(undefined);

  const openNewTopic = (categoryId?: string) => {
    setNewPostCat(categoryId);
    setNewPostOpen(true);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    supabase
      .from('forum_posts')
      .select('category_id')
      .then(({ data }) => {
        const map: Record<string, number> = {};
        ((data as any[]) || []).forEach((p) => {
          if (p.category_id) map[p.category_id] = (map[p.category_id] || 0) + 1;
        });
        setCounts(map);
      });
  }, [posts.length]);

  const activePost = posts.find(p => p.id === activePostId);
  const filteredPosts = search
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const totalPosts = posts.length;
  const totalReplies = posts.reduce((sum, p) => sum + p.replies_count, 0);

  if (activePost) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet><title>Forum - {activePost.title}</title></Helmet>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <PostDetail post={activePost} onBack={() => setSearchParams(prev => { prev.delete('post'); return prev; })} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Communauté Ebookstudio Pro V2 - Forum</title>
        <meta name="description" content="Rejoignez la communauté Ebookstudio Pro V2. Partagez vos résultats, posez vos questions et échangez avec d'autres auteurs KDP." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Retour Planner */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ebook-planner')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour Planner
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Communauté Premium · Solutions KDP</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🏠 Centre d'entraide KDP
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trouvez vite une solution : choisissez une rubrique façon KDP, lisez les fils,
            et accédez directement à l'outil qui débloque votre situation.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {totalPosts} discussions</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {totalReplies} réponses</span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="🔍 Rechercher une discussion..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          {session && (
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80" onClick={() => openNewTopic(undefined)}>
              <Plus className="w-4 h-4" /> Nouveau sujet
            </Button>
          )}
          {session && <NotificationsPanel />}
        </div>

        {session && (
          <NewPostDialog
            categories={categories}
            onCreated={refetch}
            open={newPostOpen}
            onOpenChange={setNewPostOpen}
            defaultCategoryId={newPostCat}
          />
        )}

        {/* Category Hub (vue d'accueil façon forum KDP) */}
        {!activeCategory && !search && (
          <CategoryHub
            categories={categories}
            counts={counts}
            onSelect={(slug) => setSearchParams({ cat: slug })}
            onDeeplink={(to) => navigate(to)}
            onNewTopic={(categoryId) => openNewTopic(categoryId)}
            canPost={!!session}
          />
        )}


        {/* Categories tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!activeCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchParams({})}
          >
            Toutes
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchParams({ cat: cat.slug })}
              className="gap-1"
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground">
          {activeCategory
            ? (categories.find(c => c.slug === activeCategory)?.name || 'Discussions')
            : search ? 'Résultats de recherche' : 'Discussions récentes'}
        </h2>


        {/* Posts */}
        {postsLoading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Aucune discussion pour le moment.</p>
              {session && <p className="text-sm text-muted-foreground mt-1">Soyez le premier à créer une discussion !</p>}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/30"
                    onClick={() => setSearchParams(prev => { prev.set('post', post.id); return prev; })}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-9 h-9 mt-0.5">
                          <AvatarFallback className={`bg-gradient-to-br ${colorMap[post.category?.color || 'blue'] || colorMap.blue} text-white text-xs font-bold`}>
                            {post.author_name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500" />}
                            <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                            {post.post_type === 'result' && (
                              <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                                <Trophy className="w-3 h-3 mr-0.5" /> Résultat
                              </Badge>
                            )}
                            {post.post_type === 'question' && (
                              <Badge variant="outline" className="text-red-500 border-red-300 text-[10px]">❓ Question</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{post.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{post.author_name}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(post.created_at), { locale: fr, addSuffix: true })}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes_count}</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.replies_count}</span>
                            {post.category && (
                              <Badge variant="secondary" className="text-[10px]">{post.category.emoji} {post.category.name}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* CTA for non-logged-in */}
        {!session && (
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="py-6 text-center">
              <h3 className="font-bold text-lg mb-2">Rejoignez la discussion !</h3>
              <p className="text-sm text-muted-foreground mb-4">Connectez-vous pour poster, répondre et liker les discussions.</p>
              <Button onClick={() => window.location.href = '/subscription'} className="gap-2">
                <Users className="w-4 h-4" /> S'inscrire / Se connecter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
