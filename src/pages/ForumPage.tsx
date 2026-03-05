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

// ─── New Post Dialog ───
function NewPostDialog({ categories, onCreated }: { categories: any[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [postType, setPostType] = useState('discussion');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim() || !categoryId) return;
    setCreating(true);
    const result = await createForumPost(categoryId, title, content, postType);
    setCreating(false);
    if (result) {
      setOpen(false);
      setTitle('');
      setContent('');
      onCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Plus className="w-4 h-4" /> Nouvelle Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer une discussion</DialogTitle>
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
          <Input placeholder="Titre de votre discussion" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Écrivez votre message..." value={content} onChange={e => setContent(e.target.value)} rows={5} />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={creating || !title.trim() || !content.trim() || !categoryId}>
            {creating ? 'Publication...' : 'Publier'}
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

// ─── Main Forum Page ───
export default function ForumPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || '';
  const activePostId = searchParams.get('post') || '';
  const { categories, loading: catsLoading } = useForumCategories();
  const { posts, loading: postsLoading, refetch } = useForumPosts(activeCategory);
  const [session, setSession] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

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
        <title>Communauté EbookStudio - Forum</title>
        <meta name="description" content="Rejoignez la communauté EbookStudio. Partagez vos résultats, posez vos questions et échangez avec d'autres auteurs KDP." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🏠 Communauté EbookStudio
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Échangez, partagez vos résultats et progressez ensemble avec la communauté des auteurs KDP.
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
          {session && <NewPostDialog categories={categories} onCreated={refetch} />}
          {session && <NotificationsPanel />}
        </div>

        {/* Categories */}
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
