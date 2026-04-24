import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Comment optimiser mon titre KDP ?',
  'Trouve-moi 5 niches rentables 2026',
  'Comment écrire une description Amazon qui vend ?',
  'Plan d\'un ebook sur la productivité',
  'Quelle catégorie KDP choisir ?',
  'Stratégie de lancement BSR',
];

interface EbookbotChatProps {
  variant?: 'page' | 'floating';
  className?: string;
}

const EbookbotChat = ({ variant = 'page', className }: EbookbotChatProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: 'user', content: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ebookbot-chat`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newHistory }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error('Trop de questions, patiente quelques secondes 🙏');
        } else if (resp.status === 402) {
          toast.error('Crédits IA épuisés. Recharge ton workspace.');
        } else {
          toast.error('Erreur EBOOKBOT, réessaie.');
        }
        setMessages(prev => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No body');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';
      let started = false;
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              if (!started) {
                started = true;
                setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
              } else {
                setMessages(prev => prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantText } : m
                ));
              }
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('EBOOKBOT error', err);
        toast.error('Connexion impossible. Réessaie dans un instant.');
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput('');
    setIsLoading(false);
  };

  const isFloating = variant === 'floating';

  return (
    <div className={cn(
      'flex flex-col bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden',
      isFloating ? 'h-[560px]' : 'h-[640px]',
      className
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-md">🤖</div>
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-1.5">
              EBOOKBOT <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-orange-100 text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Copilote KDP • En ligne
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Nouvelle conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-orange-50/40 to-white space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-slate-700">
                👋 Salut ! Je suis <b className="text-orange-600">EBOOKBOT</b>, ton copilote KDP.
                Pose-moi tes questions sur :
              </p>
              <ul className="text-xs text-slate-600 mt-2 space-y-1">
                <li>🎯 Niches, BSR, mots-clés, catégories Amazon</li>
                <li>✍️ Structure & écriture d'ebook</li>
                <li>📈 Marketing, description Amazon, lancement</li>
                <li>🛠️ Comment utiliser EbookStudio</li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 px-1">Questions rapides</div>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-xs bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg px-3 py-2 transition text-slate-700"
                  >
                    💬 {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
            )}
            <div className={cn(
              'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm',
              m.role === 'user'
                ? 'bg-orange-500 text-white rounded-br-sm'
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
            )}>
              {m.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-strong:text-orange-700 prose-a:text-orange-600">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Pose ta question à EBOOKBOT…"
            disabled={isLoading}
            className="flex-1 border-slate-200 focus-visible:ring-orange-500"
          />
          <Button
            onClick={() => send(input)}
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <div className="text-[10px] text-slate-400 text-center mt-2">
          Propulsé par l'IA • Les réponses peuvent contenir des erreurs
        </div>
      </div>
    </div>
  );
};

export default EbookbotChat;
