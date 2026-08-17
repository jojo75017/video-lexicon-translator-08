import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Check, Upload, FileText, RotateCcw, Loader2, Mic, Pencil, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import { readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import {
  clearLocalThread,
  clearRemoteThread,
  describeBriefChanges,
  loadRemoteThread,
  makeMessage,
  readLocalThread,
  saveRemoteMessage,
  writeLocalThread,
  type GenieMessage,
} from '@/lib/v3/genieThread';


/**
 * Ebookstudio-Génie — une seule boîte de dialogue.
 * L'abonné écrit librement ce qu'il veut écrire (comme Designrr / Wordgenie) ;
 * l'IA en déduit toute la fiche du livre (titre, catégorie, ton, longueur, images),
 * l'abonné ajuste si besoin, puis on enchaîne sur le Sommaire IA → workflow → export.
 */

const CATEGORIES = [
  'Roman', 'Thriller / Policier', 'Romance', 'Fantasy / Fantastique', 'Science-fiction',
  'Développement personnel', 'Business / Entrepreneuriat', 'Santé / Bien-être',
  'Cuisine / Recettes', 'Voyage / Guide', 'Enfants / Jeunesse', 'Histoire / Culture', 'Autre',
];
const TONES = ['Inspirant', 'Pédagogique', 'Émotionnel', 'Direct', 'Humoristique', 'Premium', 'Romanesque', 'Expert'];

const EXAMPLES = [
  'Un guide pratique pour débuter sur Amazon KDP en 30 jours, pour débutants complets.',
  'Un thriller psychologique dans un village breton où une journaliste enquête sur sa propre famille.',
  'Un livre de recettes minceur méditerranéennes, 30 plats simples avec photos.',
];

type Props = {
  /** Idée pré-remplie (query param ?idea=). */
  initialIdea?: string;
  /** Appelé quand la fiche est prête : on enchaîne sur le Sommaire IA guidé. */
  onReady: () => void;
};

export default function V3GenieDialog({ initialIdea = '', onReady }: Props) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [input, setInput] = useState(initialIdea);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [showThread, setShowThread] = useState(true);
  const [collapseOld, setCollapseOld] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = readBookBrief() || {};
    setBrief(stored);
    setMessages(readLocalThread());
    // Reprise multi-appareils : le fil serveur fait foi s'il est plus complet.
    loadRemoteThread(stored.projectId || null).then((remote) => {
      if (remote.length) {
        setMessages((local) => (remote.length >= local.length ? remote : local));
      }
    });
  }, []);

  useEffect(() => {
    if (messages.length) writeLocalThread(messages);
  }, [messages]);

  const ready = Boolean((brief.title || '').trim() && brief.chapters);

  const visibleMessages = collapseOld && messages.length > 6 ? messages.slice(-6) : messages;

  const patch = (values: Partial<BookBrief>) => {
    setBrief((prev) => {
      const next = { ...prev, ...values };
      writeBookBrief(next);
      return next;
    });
  };

  const pushMessage = (message: GenieMessage, briefSnapshot: BookBrief) => {
    setMessages((prev) => [...prev, message]);
    void saveRemoteMessage(message, briefSnapshot, briefSnapshot.projectId || null);
    setTimeout(() => threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  };

  const ask = async (message: string) => {
    const text = message.trim();
    if (text.length < 10) {
      toast.error('Décrivez votre livre en une ou deux phrases.');
      return;
    }
    setLoading(true);
    setQuestions([]);
    const previousBrief = brief;
    const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }));
    pushMessage(makeMessage('user', text), previousBrief);
    setInput('');
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('v3-genie-brief', {
        body: { message: text, userApiKey, author: (brief.author || '').trim(), history },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const b = (data as any)?.brief || {};
      const nextBrief: BookBrief = {
        ...previousBrief,
        title: b.title || '',
        subtitle: b.subtitle || '',
        author: b.author || brief.author || '',
        category: b.category || '',
        tone: b.tone || 'Inspirant',
        description: b.description || text,
        chapters: b.chapters || 20,
        wordsPerChapter: b.wordsPerChapter || 1500,
        wantsIllustrations: Boolean(b.wantsIllustrations),
        cibleProfil: b.cibleProfil || brief.cibleProfil || '',
        promesseCentrale: b.promesseCentrale || brief.promesseCentrale || '',
        outlineValidated: false,
      };
      setBrief(nextBrief);
      writeBookBrief(nextBrief);
      const nextQuestions = Array.isArray((data as any)?.questions) ? (data as any).questions : [];
      setQuestions(nextQuestions);
      const changes = describeBriefChanges(previousBrief, nextBrief);
      const reply = [
        `Voilà ce que j’ai compris : « ${nextBrief.title} »${nextBrief.subtitle ? ` — ${nextBrief.subtitle}` : ''}.`,
        nextBrief.description || '',
        nextQuestions.length ? `Question : ${nextQuestions[0]}` : '',
      ].filter(Boolean).join('\n\n');
      pushMessage(makeMessage('assistant', reply, { changes: changes || undefined, outline: nextBrief.outline }), nextBrief);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
    } catch (e: any) {
      toast.error(e?.message || 'Le Génie est indisponible pour le moment.');
      pushMessage(
        makeMessage('assistant', 'Je n’ai pas pu traiter ce message. Reformulez-le ou réessayez dans quelques secondes.'),
        previousBrief,
      );
    } finally {
      setLoading(false);
    }
  };


  const refine = async (extra: string) => {
    const base = (brief.description || '').trim();
    await ask(`${base}\n\nPrécision de l'auteur : ${extra.trim()}`);
  };

  const steps = useMemo(() => ([
    { label: '1. Votre idée', done: ready },
    { label: '2. Sommaire IA validé', done: Boolean(brief.outlineValidated) },
    { label: '3. Rédaction (workflow)', done: false },
    { label: '4. Export + couverture', done: false },
  ]), [ready, brief.outlineValidated]);

  return (
    <div
      className="rounded-[24px] border p-4 md:p-6"
      style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: 'linear-gradient(180deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--v3-gold, #c9a84c)', color: '#1a1408' }}>
          <Sparkles className="h-3 w-3" /> Dernière nouveauté IA
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          Rédaction 100 % en français · une seule question, l’IA fait le reste
        </span>
      </div>

      <ol className="mt-3 flex flex-wrap gap-2 text-[11px]">
        {steps.map((s) => (
          <li key={s.label} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1"
            style={{ borderColor: s.done ? 'var(--v3-gold, #c9a84c)' : 'rgba(0,0,0,0.12)', color: 'var(--v3-muted)' }}>
            {s.done ? <Check className="h-3 w-3" /> : null} {s.label}
          </li>
        ))}
      </ol>

      {/* Fil de conversation : tout ce que vous avez dit et ce que le Génie a corrigé */}
      {messages.length > 0 && (
        <div className="mt-5 rounded-3xl border bg-white/85 p-3" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              <MessageSquare className="h-3.5 w-3.5" /> Notre conversation ({messages.length} messages)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const text = messages
                    .map((m) => `${m.role === 'assistant' ? 'Ebookstudio-Génie' : 'Vous'} : ${m.content}${m.changes ? `\n(Modifié : ${m.changes})` : ''}`)
                    .join('\n\n');
                  void navigator.clipboard.writeText(text).then(
                    () => toast.success('Conversation copiée.'),
                    () => toast.error('Copie impossible sur ce navigateur.'),
                  );
                }}
                className="v3-btn v3-btn-ghost text-[11px]"
              >
                Copier la conversation
              </button>
              {messages.length > 6 && (
                <button type="button" onClick={() => setCollapseOld((v) => !v)} className="v3-btn v3-btn-ghost text-[11px]">
                  {collapseOld ? 'Voir tous les échanges' : 'Replier les anciens tours'}
                </button>
              )}
              <button type="button" onClick={() => setShowThread((v) => !v)} className="v3-btn v3-btn-ghost text-[11px]">
                {showThread ? 'Masquer' : 'Afficher'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm('Effacer toute la conversation avec le Génie ?')) return;
                  setMessages([]);
                  clearLocalThread();
                  void clearRemoteThread(brief.projectId || null);
                }}
                className="v3-btn v3-btn-ghost text-[11px]"
              >
                <RotateCcw className="h-3 w-3" /> Repartir de zéro
              </button>
            </div>
          </div>

          {showThread && (
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {collapseOld && messages.length > 6 && (
                <p className="text-center text-[11px]" style={{ color: 'var(--v3-muted)' }}>
                  {messages.length - 6} échange(s) plus ancien(s) repliés
                </p>
              )}
              {visibleMessages.map((m) => (

                <div
                  key={m.id}
                  className="rounded-2xl border p-2.5 text-xs leading-relaxed"
                  style={{
                    borderColor: m.role === 'assistant' ? 'rgba(201,168,76,0.55)' : 'rgba(0,0,0,0.10)',
                    background: m.role === 'assistant' ? 'rgba(201,168,76,0.08)' : '#ffffff',
                    color: 'var(--v3-ink)',
                  }}
                >
                  <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>
                    {m.role === 'assistant' ? <Sparkles className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {m.role === 'assistant' ? 'Ebookstudio-Génie' : 'Vous'}
                    <span className="font-normal normal-case">
                      · {new Date(m.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.changes && (
                    <div className="mt-2 rounded-xl border px-2 py-1.5 text-[11px]" style={{ borderColor: 'rgba(201,168,76,0.5)', color: 'var(--v3-muted)' }}>
                      ✏️ Modifié : {m.changes}
                    </div>
                  )}
                </div>
              ))}
              <div ref={threadEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Boîte de saisie unique */}

      <div className="mt-5 rounded-3xl border bg-white/90 p-3 shadow-sm" style={{ borderColor: 'rgba(201,168,76,0.55)' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); ask(input); } }}
          rows={3}
          disabled={loading}
          placeholder="Parlez-moi de vous et de ce sur quoi vous aimeriez écrire…"
          className="w-full resize-none bg-transparent px-2 py-2 text-sm outline-none"
          style={{ color: 'var(--v3-ink)' }}
        />
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            <Mic className="mr-1 inline h-3 w-3" /> Écrivez librement : sujet, lecteur, promesse.
          </span>
          <button type="button" onClick={() => ask(input)} disabled={loading || input.trim().length < 10}
            className="v3-btn v3-btn-primary disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? 'Le Génie prépare votre fiche…' : 'Envoyer au Génie'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!ready && (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => setInput(ex)}
              className="rounded-full border bg-white/80 px-3 py-1.5 text-[11px] transition hover:opacity-80"
              style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-muted)' }}>
              {ex.length > 62 ? `${ex.slice(0, 62)}…` : ex}
            </button>
          ))}
        </div>
      )}

      {/* Autres voies */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
        Ou choisissez une autre voie :
        <Link to="/v3/create?import=1" className="v3-btn v3-btn-ghost text-xs">
          <Upload className="h-3.5 w-3.5" /> Importer un document (.docx, .pdf, URL)
        </Link>
        <Link to="/v3/corriger" className="v3-btn v3-btn-ghost text-xs">
          <FileText className="h-3.5 w-3.5" /> Corriger un livre existant
        </Link>
      </div>

      {/* Fiche déduite par le Génie */}
      {ready && (
        <div ref={resultRef} className="mt-5 rounded-2xl border bg-white/92 p-4" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
          <p className="text-sm" style={{ color: 'var(--v3-ink)' }}>
            🧞 Voilà ce que j’ai compris : <strong>{brief.title}</strong>
            {brief.subtitle ? ` — ${brief.subtitle}` : ''}
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{brief.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {[
              brief.category,
              brief.tone,
              `${brief.chapters} chapitres × ${brief.wordsPerChapter} mots`,
              brief.wantsIllustrations ? 'avec illustrations IA' : 'texte uniquement',
              brief.author ? `par ${brief.author}` : null,
            ].filter(Boolean).map((chip) => (
              <span key={String(chip)} className="rounded-full border px-2.5 py-1"
                style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--v3-ink)' }}>{chip}</span>
            ))}
          </div>

          {questions.length > 0 && (
            <div className="mt-3 space-y-2">
              {questions.map((q) => (
                <RefineRow key={q} question={q} disabled={loading} onSend={refine} />
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onReady} className="v3-btn v3-btn-primary">
              <Sparkles className="h-4 w-4" /> Construire mon sommaire avec l’IA <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setEditing((v) => !v)} className="v3-btn v3-btn-outline text-xs">
              <Pencil className="h-3.5 w-3.5" /> Ajuster la fiche
            </button>
            <button type="button" onClick={() => { setBrief({}); writeBookBrief({}); setQuestions([]); setInput(''); inputRef.current?.focus(); }}
              className="v3-btn v3-btn-ghost text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Repartir de zéro
            </button>
          </div>

          {editing && (
            <div className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-2" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <Field label="Titre" value={brief.title || ''} onChange={(v) => patch({ title: v })} />
              <Field label="Auteur" value={brief.author || ''} onChange={(v) => patch({ author: v })} />
              <Select label="Catégorie" value={brief.category || ''} options={CATEGORIES} onChange={(v) => patch({ category: v })} />
              <Select label="Ton" value={brief.tone || ''} options={TONES} onChange={(v) => patch({ tone: v })} />
              <Field label="Chapitres" type="number" value={String(brief.chapters || 20)}
                onChange={(v) => patch({ chapters: Math.min(40, Math.max(3, Number(v) || 20)) })} />
              <Field label="Mots par chapitre" type="number" value={String(brief.wordsPerChapter || 1500)}
                onChange={(v) => patch({ wordsPerChapter: Math.min(3000, Math.max(600, Number(v) || 1500)) })} />
              <label className="flex items-center gap-2 text-xs md:col-span-2" style={{ color: 'var(--v3-ink)' }}>
                <input type="checkbox" checked={Boolean(brief.wantsIllustrations)}
                  onChange={(e) => patch({ wantsIllustrations: e.target.checked })} />
                Ajouter des illustrations IA à l’intérieur du livre
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RefineRow({ question, disabled, onSend }: { question: string; disabled?: boolean; onSend: (v: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="rounded-2xl border bg-white/80 p-2.5" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
      <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>🧞 {question}</p>
      <div className="mt-2 flex gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Votre réponse…"
          className="flex-1 rounded-xl border bg-white px-2.5 py-1.5 text-xs outline-none"
          style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }} />
        <button type="button" disabled={disabled || !value.trim()} onClick={() => onSend(value)}
          className="v3-btn v3-btn-outline text-xs disabled:opacity-50">Affiner</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-xs" style={{ color: 'var(--v3-muted)' }}>
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border bg-white px-2.5 py-2 text-sm outline-none"
        style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }} />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs" style={{ color: 'var(--v3-muted)' }}>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border bg-white px-2.5 py-2 text-sm outline-none"
        style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }}>
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
