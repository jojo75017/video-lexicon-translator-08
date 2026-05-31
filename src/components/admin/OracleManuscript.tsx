import React, { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Msg { role: 'user' | 'assistant'; content: string; }

const SUGGESTIONS = [
  'Résume mon manuscrit en 5 points.',
  'Liste les personnages et leurs rôles.',
  'Détecte les incohérences de timeline.',
  'Fais une fiche du personnage principal.',
];

const OracleManuscript: React.FC = () => {
  const [manuscript, setManuscript] = useState('');
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    if (manuscript.trim().length < 100) { toast.error('Colle ton manuscrit (min. 100 caractères).'); return; }
    const history = messages.slice();
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setQuestion('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('oracle-manuscript', {
        body: { manuscript: manuscript.trim(), question: text, history },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer as string }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    } catch (e: any) {
      toast.error(e?.message || "Échec d'ORACLE.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="space-y-3">
        <Textarea
          placeholder="Colle ton manuscrit complet (ou un long extrait) ici…"
          value={manuscript}
          onChange={(e) => setManuscript(e.target.value)}
          rows={8}
        />
        <Button
          onClick={() => {
            if (manuscript.trim().length < 100) { toast.error('Colle ton manuscrit (min. 100 caractères).'); return; }
            setReady(true);
          }}
          style={{ background: '#10B981', color: 'white' }}
        >
          <BookOpen className="h-4 w-4" /> <span className="ml-1.5">Charger le manuscrit</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-joy-ink/60">
        <span>Manuscrit chargé ({manuscript.trim().length.toLocaleString('fr-FR')} caractères)</span>
        <Button size="sm" variant="ghost" onClick={() => { setReady(false); setMessages([]); }}>Changer</Button>
      </div>

      <div ref={scrollRef} className="max-h-[40vh] space-y-3 overflow-y-auto rounded-xl border p-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm text-joy-ink/60"><Sparkles className="h-4 w-4" /> Pose une question à ton livre :</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border px-3 py-1 text-xs hover:bg-joy-cream/60">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm"
              style={m.role === 'user' ? { background: '#10B981', color: 'white' } : { background: 'hsl(var(--muted))' }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="flex items-center gap-1.5 text-sm text-joy-ink/60"><Loader2 className="h-4 w-4 animate-spin" /> ORACLE consulte le manuscrit…</p>}
      </div>

      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !loading) ask(question); }}
          placeholder="Pose ta question…"
        />
        <Button onClick={() => ask(question)} disabled={loading} style={{ background: '#10B981', color: 'white' }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default OracleManuscript;
