import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/v3/BackButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pin, MessageSquare, Heart, ShieldCheck } from 'lucide-react';

export default function V3CommunautePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [cat, setCat] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: p } = await supabase.from('forum_posts').select('*').eq('id', id).maybeSingle();
      setPost(p);
      if (p) {
        const { data: c } = await supabase.from('forum_categories').select('*').eq('id', (p as any).category_id).maybeSingle();
        setCat(c);
      }
      const { data: r } = await supabase.from('forum_replies').select('*').eq('post_id', id).order('created_at');
      setReplies((r as any) || []);
    })();
  }, [id]);

  if (!post) return <div className="p-8 text-center text-[#232F3E]/60">Chargement…</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <Link to="/communaute" className="text-sm text-[#008296] hover:underline">← Toutes les discussions</Link>
      </div>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {post.is_pinned && <Pin className="h-4 w-4 text-[#FF9E2D]" />}
            {cat && (
              <Badge style={{ background: `${cat.color}15`, color: cat.color }}>
                {cat.emoji} {cat.name}
              </Badge>
            )}
            <span className="text-xs text-[#232F3E]/50">
              par {post.author_name} · {new Date(post.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#232F3E]">{post.title}</h1>
          <p className="text-[#232F3E]/80 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          {post.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-1">
              {post.tags.map((t: string) => (
                <span key={t} className="text-[11px] px-2 py-0.5 bg-[#FAFAFA] border border-[#232F3E]/10 rounded text-[#232F3E]/60">#{t}</span>
              ))}
            </div>
          )}
          <div className="flex gap-4 pt-2 text-xs text-[#232F3E]/60 border-t border-[#232F3E]/10 mt-3">
            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{replies.length} réponses</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes_count}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#232F3E]">Réponses</h2>
        {replies.map((r) => {
          const isTeam = r.author_name?.startsWith('Équipe');
          return (
            <Card key={r.id} className={isTeam ? 'border-[#008296] border-2' : ''}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isTeam ? 'text-[#008296]' : 'text-[#232F3E]'}`}>{r.author_name}</span>
                  {isTeam && (
                    <Badge className="bg-[#008296] text-white text-[10px] gap-1"><ShieldCheck className="h-3 w-3" />Solution officielle</Badge>
                  )}
                  <span className="text-[11px] text-[#232F3E]/50">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className="text-sm text-[#232F3E]/80 whitespace-pre-wrap leading-relaxed">{r.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[#FAFAFA] border-dashed">
        <CardContent className="p-4 text-sm text-[#232F3E]/70 text-center">
          Pour poster une question ou répondre, <Link to="/v3/auth" className="text-[#008296] font-semibold hover:underline">connectez-vous</Link> à votre compte abonné.
        </CardContent>
      </Card>
    </div>
  );
}
