import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Bot, KeyRound, Loader2, RotateCcw, Send } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  PROVIDER_LABELS,
  getProvider,
  getProviderKey,
  isAIConfigured,
  validateKeyFormat,
  callAIWriting,
} from '@/services/aiWritingService';

type Msg = { role: 'user' | 'assistant'; content: string };

const LS_KEY = 'v3:byok-chat';

const SYSTEM_PROMPT =
  "Tu es l'assistant d'écriture d'Ebookstudio. Tu discutes librement en français, comme ChatGPT : " +
  "tu réponds à toutes les questions, tu aides à trouver des idées de livres, des niches, des titres, " +
  "des plans, des textes de vente. Réponses claires, concrètes, sans latin ni mots inventés.";

const loadHistory = (): Msg[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Msg[]) : [];
  } catch {
    return [];
  }
};

/** Discussion libre avec le moteur IA de l'abonné (clé Gemini / OpenAI / Claude / OpenRouter). */
export default function V3ByokChatPage() {
  const [messages, setMessages] = useState<Msg[]>(() => loadHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const provider = getProvider();
  const configured = useMemo(() => {
    const key = getProviderKey(provider);
    return isAIConfigured() && !!key && validateKeyFormat(provider, key);
  }, [provider]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages.slice(-60)));
    } catch {
      /* noop */
    }
  }, [messages]);

  useEffect(() => {
    if (configured) inputRef.current?.focus();
  }, [configured]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    const transcript = history
      .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'} : ${m.content}`)
      .join('\n\n');

    try {
      const answer = await callAIWriting(
        `${transcript}\n\nAssistant :`,
        { systemPrompt: SYSTEM_PROMPT, temperature: 0.8, maxTokens: 4096 },
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      inputRef.current?.focus();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'La discussion a échoué.';
      toast.error(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Helmet>
        <title>Discuter avec votre IA — Ebookstudio</title>
        <meta
          name="description"
          content="Discutez librement avec ChatGPT, Gemini, Claude ou OpenRouter en utilisant votre propre clé enregistrée dans Ebookstudio."
        />
      </Helmet>

      <BackButton to="/v3" label="Retour à l'accueil" />

      <header className="mb-5 mt-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
          <Bot className="h-6 w-6" style={{ color: 'var(--v3-emerald)' }} />
          Discuter avec votre IA
        </h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--v3-muted)' }}>
          Une vraie discussion ouverte, avec votre propre clé. Moteur utilisé :{' '}
          <strong>{PROVIDER_LABELS[provider]}</strong>.{' '}
          <Link to="/v3/fonctionnalites/cles" className="underline">
            Changer de moteur ou de clé
          </Link>
        </p>
      </header>

      {!configured ? (
        <div className="rounded-2xl border bg-card p-6" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
          <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            <KeyRound className="h-5 w-5" /> Ajoutez d'abord votre clé
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Enregistrez votre clé Gemini, OpenAI, Claude ou OpenRouter : la discussion s'ouvre aussitôt,
            sur cette page. Votre clé reste dans votre navigateur.
          </p>
          <Link to="/v3/fonctionnalites/cles" className="mt-4 inline-block">
            <Button>Enregistrer ma clé</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
          <div ref={scrollRef} className="max-h-[52vh] min-h-[240px] space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--v3-muted)' }}>
                Posez votre première question : « Trouve-moi 5 idées de livres sur le jardinage »,
                « Aide-moi à écrire une introduction »…
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                {m.role === 'user' ? (
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {m.content}
                  </p>
                ) : (
                  <div className="prose prose-sm max-w-[95%] text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                <Loader2 className="h-4 w-4 animate-spin" /> L'IA réfléchit…
              </p>
            )}
          </div>

          <div className="border-t p-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              placeholder="Écrivez votre message… (Entrée pour envoyer)"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([])}
                disabled={isLoading || messages.length === 0}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Nouvelle discussion
              </Button>
              <Button onClick={() => void send(input)} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1.5 h-4 w-4" />
                )}
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
