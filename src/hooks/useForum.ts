import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string;
  color: string;
  sort_order: number;
}

export interface ForumPost {
  id: string;
  category_id: string;
  user_id: string;
  author_name: string;
  author_avatar_url: string | null;
  title: string;
  content: string;
  post_type: string;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  category?: ForumCategory;
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_avatar_url: string | null;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface ForumNotification {
  id: string;
  post_id: string | null;
  reply_id: string | null;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useForumCategories() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order');
      setCategories((data as any[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { categories, loading };
}

export function useForumPosts(categorySlug?: string) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('forum_posts')
      .select('*, forum_categories(*)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (categorySlug) {
      // First get category id
      const { data: cat } = await supabase
        .from('forum_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data } = await query;
    setPosts(
      ((data as any[]) || []).map((p: any) => ({
        ...p,
        category: p.forum_categories,
      }))
    );
    setLoading(false);
  }, [categorySlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('forum-posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => {
        fetchPosts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
}

export function useForumReplies(postId: string) {
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReplies = useCallback(async () => {
    const { data } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at');
    setReplies((data as any[]) || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  useEffect(() => {
    const channel = supabase
      .channel(`forum-replies-${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_replies', filter: `post_id=eq.${postId}` }, () => {
        fetchReplies();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [postId, fetchReplies]);

  return { replies, loading, refetch: fetchReplies };
}

export function useForumNotifications() {
  const [notifications, setNotifications] = useState<ForumNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from('forum_notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    const notifs = (data as any[]) || [];
    setNotifications(notifs);
    setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel('forum-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await supabase.from('forum_notifications').update({ is_read: true } as any).eq('id', id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('forum_notifications').update({ is_read: true } as any).eq('user_id', session.user.id).eq('is_read', false);
    fetchNotifications();
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications };
}

export async function createForumPost(categoryId: string, title: string, content: string, postType = 'discussion') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { toast.error('Vous devez être connecté'); return null; }

  const authorName = session.user.email?.split('@')[0] || 'Membre';
  const { data, error } = await supabase.from('forum_posts').insert({
    category_id: categoryId,
    user_id: session.user.id,
    author_name: authorName,
    title,
    content,
    post_type: postType,
  } as any).select().single();

  if (error) { toast.error('Erreur lors de la création du post'); return null; }
  toast.success('Discussion créée !');
  return data;
}

export async function createForumReply(postId: string, content: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { toast.error('Vous devez être connecté'); return null; }

  const authorName = session.user.email?.split('@')[0] || 'Membre';
  const { data, error } = await supabase.from('forum_replies').insert({
    post_id: postId,
    user_id: session.user.id,
    author_name: authorName,
    content,
  } as any).select().single();

  if (error) { toast.error('Erreur lors de la réponse'); return null; }
  return data;
}

export async function togglePostLike(postId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { toast.error('Vous devez être connecté'); return; }

  const { data: existing } = await supabase
    .from('forum_likes')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    await supabase.from('forum_likes').delete().eq('id', (existing as any).id);
  } else {
    await supabase.from('forum_likes').insert({ user_id: session.user.id, post_id: postId } as any);
  }
}

export async function checkUserLikedPost(postId: string): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data } = await supabase
    .from('forum_likes')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .maybeSingle();
  return !!data;
}
