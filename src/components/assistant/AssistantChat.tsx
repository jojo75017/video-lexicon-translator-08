import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Send, Sparkles, Loader2, RotateCcw, ArrowRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ASSISTANT_QUICK_QUESTIONS,
  buildAssistantCatalog,
  findFaqAnswer,
  isAllowedAssistantRoute,
  type AssistantAction,
} from '@/data/assistantKnowledge';

type Msg = { role: 'user' | 'assistant'; content: string; actions?: AssistantAction[] };

interface AssistantChatProps {
  variant?: 'page' | 'floating';
  className?: string;
}

/**
 * Assistant Ebookstudio : chaque réponse est suivie de 1 à 3 boutons
 * qui ouvrent directement le bon onglet de la plateforme.
 */
const AssistantChat = ({ variant = 'page', className }: AssistantChatProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const localFallback = (question: string): Msg => {
    const faq = findFaqAnswer(question);
    if (faq) return { role: 'assistant', content: faq.answer, actions: faq.actions };
    return {
      role: 'assistant',
      content:
        "Je n'ai pas la réponse sous la main. Voici les deux endroits qui répondent à presque tout : l'atelier des outils et votre tableau de bord.",
      actions: [
        { label: 'Tous les outils', route: '/v3/outils' },
        { label: 'Mon tableau de bord', route: '/v3/hub' },
      ],
    };
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assistant-chat`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          catalog: buildAssistantCatalog(),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error('Trop de questions, patientez quelques secondes 🙏');
        setMessages((prev) => [...prev, localFallback(trimmed)]);
        return;
      }

      const data = await resp.json();
      const actions = (data?.actions ?? []).filter((a: AssistantAction) => isAllowedAssistantRoute(a.route));
      if (!data?.reply) {
        setMessages((prev) => [...prev, localFallback(trimmed)]);
        return;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, actions }]);
    } catch (err) {
      console.error('assistant error', err);
      setMessages((prev) => [...prev, localFallback(trimmed)]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const isFloating = variant === 'floating';

  return (
    <div
      className={cn(
        'flex flex-col bg-card rounded-2xl shadow-xl border overflow-hidden',
        isFloating ? 'h-[560px]' : 'h-[640px]',
        className,
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/15 grid place-items-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-1.5">
              Assistant Ebookstudio <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] opacity-80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Il vous emmène directement au bon onglet
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition"
            title="Nouvelle conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-muted/30">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <p className="text-sm text-foreground">
                👋 Bonjour ! Posez votre question : création de livre, correction, export, couverture,
                mots-clés Amazon, forfaits, erreurs du workflow…
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Je réponds en quelques lignes et je vous donne le bouton qui ouvre le bon outil.
              </p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
                Questions fréquentes
              </div>
              <div className="grid gap-1.5">
                {ASSISTANT_QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-xs bg-card hover:bg-accent border rounded-lg px-3 py-2 transition text-foreground"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className={cn('max-w-[86%] space-y-2')}>
              <div
                className={cn(
                  'rounded-2xl px-3.5 py-2.5 text-sm',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border text-foreground rounded-bl-sm shadow-sm',
                )}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>

              {m.role === 'assistant' && !!m.actions?.length && (
                <div className="flex flex-wrap gap-2">
                  {m.actions.map((a) => (
                    <Link
                      key={a.route + a.label}
                      to={a.route}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
                    >
                      {a.label}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-card border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-card p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Posez votre question…"
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={() => send(input)} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
