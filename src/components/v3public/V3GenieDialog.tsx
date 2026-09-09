import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Sparkles, Wand2, ArrowRight, Check, Upload, FileText, RotateCcw, Loader2, Mic, Pencil, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey } from '@/services/aiWritingService';
import {
  appendSourceText, dedupeFactMemory, listSourcePassages, mergeRespectingLocks, readBookBrief, resetBookProject, writeBookBrief, type BookBrief,
} from '@/lib/v3/bookBrief';
import { saveBookDraftToCloud } from '@/lib/v3/bookDraftCloud';
import { currentInterviewStep } from '@/lib/v3/genieInterview';

import {
  clearLocalThread,
  clearRemoteThread,
  countTextWords,
  describeBriefChanges,
  loadRemoteThread,
  makeMessage,
  readLocalThread,
  rebuildSourceText,
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
  /** 'biography' = entretien « Le récit de votre vie » (chronologie stricte). */
  mode?: 'book' | 'biography';
  /** Le livre en cours et son état de sauvegarde, affichés juste sous la saisie. */
  progressContent?: ReactNode;
};

export default function V3GenieDialog({ initialIdea = '', onReady, mode = 'book', progressContent }: Props) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [input, setInput] = useState(initialIdea);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [showThread, setShowThread] = useState(false);
  const [collapseOld, setCollapseOld] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = readBookBrief() || {};
    setBrief(stored);
    const local = readLocalThread();
    setMessages(local);
    // Récupération du récit : la matière brute est reconstruite depuis tous les
    // messages de l'auteur (idempotent), afin que rien de ce qu'il a raconté
    // ne soit perdu, même si un ancien enregistrement était vide.
    const restore = (thread: GenieMessage[], base: BookBrief) => {
      const rebuilt = rebuildSourceText(thread, base.sourceText);
      if (rebuilt && rebuilt !== (base.sourceText || '')) {
        const next = { ...base, sourceText: rebuilt };
        setBrief(next);
        writeBookBrief(next);
        return next;
      }
      return base;
    };
    const afterLocal = restore(local, stored);
    // Reprise multi-appareils : le fil serveur fait foi s'il est plus complet.
    loadRemoteThread(stored.projectId || null).then((remote) => {
      if (!remote.length) return;
      setMessages((current) => (remote.length >= current.length ? remote : current));
      restore(remote, readBookBrief() || afterLocal);
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
    // Matière brute : les mots exacts de l'auteur, accumulés et jamais résumés.
    // On les enregistre AVANT l'appel IA : même en cas de panne, rien n'est perdu.
    const nextSourceText = appendSourceText(previousBrief.sourceText, text);
    const isBiography = mode === 'biography';
    // Biographie : l'étape racontée est marquée pour passer à la période suivante.
    const currentStep = currentInterviewStep({ ...previousBrief, mode: isBiography ? 'biography' : previousBrief.mode });
    const toldSteps = isBiography && !currentStep.choice
      ? Array.from(new Set([...(previousBrief.biographySteps || []), currentStep.id]))
      : previousBrief.biographySteps;
    const briefWithSource: BookBrief = {
      ...previousBrief,
      mode: isBiography ? 'biography' : previousBrief.mode,
      biographySteps: toldSteps,
      sourceText: nextSourceText,
    };
    setBrief(briefWithSource);
    writeBookBrief(briefWithSource);
    const userMessage = makeMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    const draftResult = await saveBookDraftToCloud(briefWithSource, { messages: [...messages, userMessage], activeStep: 1 });
    const linkedBrief = {
      ...briefWithSource,
      projectId: draftResult.projectId || briefWithSource.projectId,
      pendingPolishIndex: listSourcePassages(nextSourceText).length,
    };
    setBrief(linkedBrief);
    writeBookBrief(linkedBrief);
    if (draftResult.error && draftResult.error !== 'not-authenticated') {
      toast.error('Votre texte reste sur cet appareil. La sauvegarde du compte sera retentée.');
    }
    void saveRemoteMessage(userMessage, linkedBrief, linkedBrief.projectId || null);
    setInput('');
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('v3-genie-brief', {
        body: {
          message: text,
          userApiKey,
          author: (brief.author || '').trim(),
          history,
          sourceText: nextSourceText,
          kind: mode === 'biography' ? 'biography' : 'book',
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const b = (data as any)?.brief || {};
      // Les réglages verrouillés par l'auteur ne sont jamais remplacés par l'IA.
      const proposed = mergeRespectingLocks(briefWithSource, {
        title: b.title || previousBrief.title || '',
        subtitle: b.subtitle || previousBrief.subtitle || '',
        chapters: b.chapters || previousBrief.chapters || 20,
        wordsPerChapter: b.wordsPerChapter || previousBrief.wordsPerChapter || 2500,
      });
      const latestBrief = readBookBrief() || linkedBrief;
      const nextBrief: BookBrief = {
        ...latestBrief,
        author: b.author || brief.author || '',
        category: b.category || previousBrief.category || '',
        tone: b.tone || previousBrief.tone || 'Inspirant',
        description: b.description || previousBrief.description || '',
        chapters: previousBrief.chapters || 20,
        wordsPerChapter: previousBrief.wordsPerChapter || 2500,
        wantsIllustrations: Boolean(b.wantsIllustrations),
        cibleProfil: b.cibleProfil || brief.cibleProfil || '',
        promesseCentrale: b.promesseCentrale || brief.promesseCentrale || '',
        factMemory: Array.from(new Set([...(latestBrief.factMemory || []), ...(Array.isArray(b.factMemory) ? b.factMemory.map(String) : [])])),
        outlineValidated: false,
        ...proposed,
      };
      setBrief(nextBrief);
      writeBookBrief(nextBrief);
      const nextQuestions = Array.isArray((data as any)?.questions) ? (data as any).questions : [];
      setQuestions(nextQuestions);
      const changes = describeBriefChanges(previousBrief, nextBrief);
      const sourceWords = countTextWords(nextSourceText);
      // Une seule copie du récit : elle vit dans la colonne de droite.
      // Ici, le Génie répond court : ce qui a changé + sa prochaine question.
      const reply = [
        `C’est noté : « ${nextBrief.title} »${nextBrief.subtitle ? ` — ${nextBrief.subtitle}` : ''}. Vos mots sont conservés intégralement (${sourceWords} mots de matière) et seront développés, jamais résumés.`,
        nextQuestions.length ? `Question : ${nextQuestions[0]}` : '',
      ].filter(Boolean).join('\n\n');

      const assistantMessage = makeMessage('assistant', reply, { changes: changes || undefined, outline: nextBrief.outline });
      pushMessage(assistantMessage, nextBrief);
      void saveBookDraftToCloud(nextBrief, { messages: [...messages, userMessage, assistantMessage], activeStep: 1 });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
    } catch (e: any) {
      toast.error(e?.message || 'Le Génie est indisponible pour le moment.');
      pushMessage(
        makeMessage('assistant', 'Je n’ai pas pu traiter ce message : votre texte est conservé, réessayez dans quelques secondes.'),
        briefWithSource,
      );
    } finally {
      setLoading(false);
    }
  };


  const refine = async (extra: string) => {
    // La réponse reste un vrai passage du récit, sans préfixe technique ajouté au livre.
    await ask(extra.trim());
  };

  /**
   * Réponse à une question du Génie : par défaut elle NE va PAS dans le livre.
   * Elle rejoint les informations que le Génie doit respecter.
   */
  const rememberAnswer = async (answer: string) => {
    const text = answer.trim();
    if (!text) return;
    const current = readBookBrief() || brief;
    const next: BookBrief = {
      ...current,
      factMemory: dedupeFactMemory([...(current.factMemory || []), text]),
    };
    setBrief(next);
    writeBookBrief(next);
    setQuestions([]);
    await saveBookDraftToCloud(next, { messages, activeStep: 1 });
    toast.success('C’est noté : le Génie retient cette information, sans l’ajouter à votre livre.');
  };


  // Les questions du Génie viennent uniquement du texte de l'auteur : deux au maximum.
  const askedQuestions = questions.slice(0, 2);
  const sourceWordCount = countTextWords(brief.sourceText || '');


  const eraseEverything = () => {
    if (!window.confirm('Effacer ce livre et repartir de zéro ? Vos livres déjà enregistrés ne sont pas supprimés.')) return;
    resetBookProject();
    clearLocalThread();
    void clearRemoteThread(brief.projectId || null);
    setMessages([]);
    setBrief({});
    setQuestions([]);
    setInput('');
    
    toast.success('Nouveau départ : la fiche, le sommaire et la conversation sont vides.');
    setTimeout(() => inputRef.current?.focus(), 80);
  };

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
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            Étape 1 sur 3 · J’écris{sourceWordCount > 0 ? ` · ${sourceWordCount} mots conservés` : ''}
          </span>
          <button type="button" onClick={eraseEverything} className="v3-btn v3-btn-ghost text-[11px]">
            <RotateCcw className="h-3 w-3" /> Effacer ce livre
          </button>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
        {mode === 'biography'
          ? 'Racontez votre vie dans l’ordre qui vous vient. Le Génie lit ce que vous écrivez, le corrige sans jamais le résumer, puis vous pose une question née de vos propres phrases.'
          : 'Écrivez ou collez votre texte. Le Génie le corrige sans jamais le résumer, puis vous pose une question née de vos propres phrases.'}
      </p>



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
                onClick={eraseEverything}
                className="v3-btn v3-btn-ghost text-[11px]"
              >
                <RotateCcw className="h-3 w-3" /> Effacer ce livre
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
            {loading ? 'Enregistrement et analyse…' : 'Enregistrer mon texte'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {progressContent}

      {(brief.factMemory || []).length > 0 && (
        <details className="mt-4 rounded-2xl border bg-white p-3" style={{ borderColor: 'rgba(15,107,74,0.35)' }}>
          <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-wider" style={{ color: '#0f6b4a' }}>
            Ce que le Génie retient de vous ({(brief.factMemory || []).length} informations)
          </summary>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
            Ces informations ne sont pas dans votre livre : elles empêchent simplement le Génie de changer
            ou d’oublier vos prénoms, liens familiaux, lieux, dates et faits.
          </p>
          <div className="mt-2 max-h-64 space-y-1.5 overflow-y-auto pr-1">
            {(brief.factMemory || []).map((fact, index) => (
              <input key={`${index}-${fact}`} value={fact} onChange={(event) => {
                const facts = [...(brief.factMemory || [])]; facts[index] = event.target.value; patch({ factMemory: facts });
              }} onBlur={() => void saveBookDraftToCloud(readBookBrief() || brief, { messages, activeStep: 1 })}
                className="w-full rounded-lg border px-2.5 py-1.5 text-xs" style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }} />
            ))}
          </div>
        </details>
      )}

      {/* La question du Génie : elle vient de votre texte, jamais d'un questionnaire */}
      {askedQuestions.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8a6d1f' }}>
            Le Génie a lu votre texte et vous demande
          </div>
          {askedQuestions.map((q) => (
            <RefineRow key={q} question={q} disabled={loading} onRemember={rememberAnswer} onSend={refine}
              onSkip={() => setQuestions((prev) => prev.filter((item) => item !== q))} />
          ))}
        </div>
      )}




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
              <Field label="Mots par chapitre" type="number" value={String(brief.wordsPerChapter || 2500)}
                onChange={(v) => patch({ wordsPerChapter: Math.min(3500, Math.max(800, Number(v) || 2500)) })} />

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

function RefineRow({ question, disabled, onSend, onSkip }: {
  question: string; disabled?: boolean; onSend: (v: string) => void; onSkip?: () => void;
}) {
  const [value, setValue] = useState('');
  return (
    <div className="rounded-2xl border bg-white p-3" style={{ borderColor: 'rgba(201,168,76,0.55)' }}>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--v3-ink)' }}>🧞 {question}</p>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3}
        placeholder="Votre réponse — elle entre directement dans votre livre, avec vos mots."
        className="mt-2 w-full resize-none rounded-xl border bg-white px-2.5 py-2 text-[13px] outline-none"
        style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }} />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" disabled={disabled || value.trim().length < 10} onClick={() => onSend(value)}
          className="v3-btn v3-btn-primary text-xs disabled:opacity-50">Ajouter au récit</button>
        {onSkip && (
          <button type="button" onClick={onSkip} className="v3-btn v3-btn-ghost text-xs">Je n’ai rien à ajouter</button>
        )}
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
