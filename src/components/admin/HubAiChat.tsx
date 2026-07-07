import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Send, Loader2, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const INK = '#2A2118';

type Msg = { role: 'user' | 'assistant'; content: string };

const SYSTEM = `Tu es l'assistant IA d'EbookStudio, expert Amazon KDP et auto-édition.
Tu réponds en français, de façon claire, concrète et actionnable.
Aide l'auteur sur : idées de livres, niches rentables, rédaction, mise en forme, publication KDP,
prix/royalties, mots-clés, couvertures, marketing et vente. Utilise du markdown (titres, listes) quand c'est utile.`;

const SUGGESTIONS = [
  'Quelle niche KDP est rentable en ce moment ?',
  'Comment fixer le prix de mon ebook ?',
  'Aide-moi à trouver un titre accrocheur',
  'Comment publier mon livre sur Amazon KDP ?',
];

/** Panneau de conversation IA du Hub V3 — vraie discussion (multi-tours) avec l'IA. */
const HubAiChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-hub-ai', handleOpen);
    return () => window.removeEventListener('open-hub-ai', handleOpen);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const history = [...messages, { role: 'user', content: q } as Msg];
    setMessages(history);
    setInput('');
    setLoading(true);
    try {
      const transcript = history
        .map((m) => `${m.role === 'user' ? 'Auteur' : 'Assistant'} : ${m.content}`)
        .join('\n\n');
      const prompt = `${transcript}\n\nAssistant :`;
      const reply = await callAIWriting(prompt, { systemPrompt: SYSTEM, temperature: 0.7 });
      setMessages((m) => [...m, { role: 'assistant', content: reply.trim() }]);
    } catch (e: any) {
      toast.error(e?.message || "Échec de la réponse de l'IA.");
      setMessages((m) => m.slice(0, -1));
      setInput(q);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9998] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[80vh] flex flex-col rounded-2xl border bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      style={{ borderColor: '#eadfc9' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${AMBER_DEEP}, ${AMBER})` }}>
        <div className="flex items-center gap-2 text-white">
          <Bot className="h-5 w-5" />
          <span className="font-semibold text-sm">Assistant IA · EbookStudio</span>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-white/90 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ background: '#FBF6EC' }}>
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: INK }}>
              👋 Posez votre question sur la création, la publication ou la vente de votre livre.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-xs px-3 py-2 rounded-lg border bg-white transition-colors hover:bg-[#FFF3DF]"
                  style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm ${m.role === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm bg-white border'}`}
              style={m.role === 'user' ? { background: AMBER } : { borderColor: '#eadfc9', color: INK }}>
              {m.role === 'assistant'
                ? <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-li:my-0.5"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white border flex items-center gap-2 text-sm" style={{ borderColor: '#eadfc9', color: '#9a8666' }}>
              <Loader2 className="h-4 w-4 animate-spin" /> L'IA réfléchit…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2" style={{ borderColor: '#eadfc9' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Écrivez votre question…"
          className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
          style={{ borderColor: '#eadfc9' }}
          autoFocus
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          className="grid h-10 w-10 place-items-center rounded-xl text-white disabled:opacity-50"
          style={{ background: AMBER }} aria-label="Envoyer">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default HubAiChat;
