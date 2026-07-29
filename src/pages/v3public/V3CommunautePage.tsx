import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/v3/BackButton';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Pin, Search } from 'lucide-react';

interface Category { id: string; name: string; slug: string; description: string | null; emoji: string; color: string; }
interface Post {
  id: string; category_id: string; author_name: string; title: string; content: string;
  likes_count: number; replies_count: number; is_pinned: boolean; tags: string[]; created_at: string;
}

export default function V3CommunautePage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from('forum_categories').select('*').order('sort_order'),
        supabase.from('forum_posts').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(300),
      ]);
      setCats((c as any) || []);
      setPosts((p as any) || []);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCat) list = list.filter(p => p.category_id === activeCat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s) || p.tags?.some(t => t.toLowerCase().includes(s)));
    }
    return list;
  }, [posts, activeCat, q]);

  const countByCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of posts) m[p.category_id] = (m[p.category_id] || 0) + 1;
    return m;
  }, [posts]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <BackButton />
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#232F3E]">Communauté EbookStudio</h1>
        <p className="text-[#232F3E]/70">
          Plus de {posts.length} questions et réponses des auteurs et de l'équipe EbookStudio, organisées par thème KDP.
          Lecture libre pour tout le monde — participation réservée aux abonnés.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#232F3E]/40" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une question, un mot-clé, un module…"
          className="pl-9 h-11"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCat(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition ${!activeCat ? 'bg-[#008296] text-white border-[#008296]' : 'bg-white text-[#232F3E] border-[#232F3E]/20 hover:border-[#008296]'}`}
        >
          Toutes ({posts.length})
        </button>
        {cats.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${activeCat === c.id ? 'text-white border-transparent' : 'bg-white text-[#232F3E] border-[#232F3E]/20 hover:border-[#008296]'}`}
            style={activeCat === c.id ? { background: c.color || '#008296' } : {}}
          >
            {c.emoji} {c.name} ({countByCat[c.id] || 0})
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(p => {
          const cat = cats.find(c => c.id === p.category_id);
          return (
            <Link key={p.id} to={`/communaute/post/${p.id}`}>
              <Card className="hover:border-[#008296] transition">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {p.is_pinned && <Pin className="h-3.5 w-3.5 text-[#FF9E2D]" />}
                        {cat && (
                          <Badge variant="secondary" className="text-[10px]" style={{ background: `${cat.color}15`, color: cat.color }}>
                            {cat.emoji} {cat.name}
                          </Badge>
                        )}
                        <span className="text-[11px] text-[#232F3E]/50">
                          par {p.author_name} · {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-[#232F3E] leading-snug">{p.title}</h3>
                      <p className="text-sm text-[#232F3E]/70 line-clamp-2">{p.content}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap pt-0.5">
                          {p.tags.slice(0, 4).map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[#FAFAFA] border border-[#232F3E]/10 rounded text-[#232F3E]/60">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-[#232F3E]/60 shrink-0">
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{p.replies_count}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[#232F3E]/50 py-12">Aucun résultat pour ces filtres.</p>
        )}
      </div>
    </div>
  );
}
