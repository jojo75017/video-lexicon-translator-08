import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Check, Upload, ImageIcon, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';

/**
 * Ebookstudio-Génie — dialogue guidé.
 * L'abonné répond à quelques questions dans une conversation, la fiche du livre est
 * remplie au fur et à mesure, puis on enchaîne sur le Sommaire IA (dialogue) : une fois
 * le sommaire validé, le workflow rédige le livre, exporte et génère la couverture.
 */

type StepId = 'idea' | 'title' | 'author' | 'category' | 'tone' | 'size' | 'images' | 'done';

const CATEGORIES = [
  'Roman', 'Thriller / Policier', 'Romance', 'Fantasy / Fantastique', 'Science-fiction',
  'Développement personnel', 'Business / Entrepreneuriat', 'Santé / Bien-être',
  'Cuisine / Recettes', 'Voyage / Guide', 'Enfants / Jeunesse', 'Histoire / Culture', 'Autre',
];
const TONES = ['Inspirant', 'Pédagogique', 'Émotionnel', 'Direct', 'Humoristique', 'Premium', 'Romanesque', 'Expert'];
const SIZES = [
  { label: 'Court — 12 chapitres × 1 200 mots', chapters: 12, wordsPerChapter: 1200 },
  { label: 'Standard — 20 chapitres × 1 500 mots', chapters: 20, wordsPerChapter: 1500 },
  { label: 'Long — 30 chapitres × 2 000 mots', chapters: 30, wordsPerChapter: 2000 },
];

const QUESTIONS: Record<Exclude<StepId, 'done'>, string> = {
  idea: 'Parlez-moi de votre livre : le sujet, pour qui, et ce que le lecteur va y gagner.',
  title: 'Parfait. Quel titre voulez-vous donner à ce livre ? (modifiable plus tard)',
  author: 'Sous quel nom d’auteur doit-il être publié ?',
  category: 'Dans quelle catégorie Amazon KDP le classons-nous ?',
  tone: 'Quel ton dois-je adopter pour l’écriture ?',
  size: 'Quelle longueur visez-vous ?',
  images: 'Souhaitez-vous des images/illustrations à l’intérieur du livre ?',
};

type Props = {
  /** Idée pré-remplie (query param ?idea=). */
  initialIdea?: string;
  /** Appelé quand la fiche est complète : on enchaîne sur le Sommaire IA guidé. */
  onReady: () => void;
};

export default function V3GenieDialog({ initialIdea = '', onReady }: Props) {
  const [brief, setBrief] = useState<BookBrief>({});
  const [step, setStep] = useState<StepId>('idea');
  const [input, setInput] = useState(initialIdea);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const existing = readBookBrief() || {};
    setBrief(existing);
    // On reprend là où l'abonné s'était arrêté.
    if (!(existing.description || '').trim() && !initialIdea) setStep('idea');
    else if (!(existing.title || '').trim()) setStep('title');
    else if (!(existing.author || '').trim()) setStep('author');
    else if (!(existing.category || '').trim()) setStep('category');
    else if (!(existing.tone || '').trim()) setStep('tone');
    else if (!existing.chapters) setStep('size');
    else if (existing.wantsIllustrations === undefined) setStep('images');
    else setStep('done');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); inputRef.current?.focus(); }, [step]);

  const patch = (values: Partial<BookBrief>) => {
    setBrief((prev) => {
      const next = { ...prev, ...values };
      writeBookBrief(next);
      return next;
    });
  };

  const nextOf: Record<Exclude<StepId, 'done'>, StepId> = {
    idea: 'title', title: 'author', author: 'category', category: 'tone', tone: 'size', size: 'images', images: 'done',
  };

  const submitText = () => {
    const text = input.trim();
    if (!text) return;
    if (step === 'idea') patch({ description: text });
    if (step === 'title') patch({ title: text });
    if (step === 'author') patch({ author: text });
    setInput('');
    setStep((s) => (s === 'done' ? s : nextOf[s]));
  };

  const chooseCategory = (value: string) => { patch({ category: value }); setStep('tone'); };
  const chooseTone = (value: string) => { patch({ tone: value }); setStep('size'); };
  const chooseSize = (s: typeof SIZES[number]) => { patch({ chapters: s.chapters, wordsPerChapter: s.wordsPerChapter }); setStep('images'); };
  const chooseImages = (value: boolean) => { patch({ wantsIllustrations: value }); setStep('done'); };

  const restart = () => { setStep('idea'); setInput(''); };

  /** Fil de la conversation : réponses déjà données. */
  const transcript = useMemo(() => {
    const rows: Array<{ q: string; a: string }> = [];
    if ((brief.description || '').trim()) rows.push({ q: QUESTIONS.idea, a: brief.description! });
    if ((brief.title || '').trim()) rows.push({ q: QUESTIONS.title, a: brief.title! });
    if ((brief.author || '').trim()) rows.push({ q: QUESTIONS.author, a: brief.author! });
    if ((brief.category || '').trim()) rows.push({ q: QUESTIONS.category, a: brief.category! });
    if ((brief.tone || '').trim()) rows.push({ q: QUESTIONS.tone, a: brief.tone! });
    if (brief.chapters) rows.push({ q: QUESTIONS.size, a: `${brief.chapters} chapitres × ${brief.wordsPerChapter || 1500} mots` });
    if (brief.wantsIllustrations !== undefined) {
      rows.push({ q: QUESTIONS.images, a: brief.wantsIllustrations ? 'Oui, avec illustrations IA' : 'Non, texte uniquement' });
    }
    return rows;
  }, [brief]);

  const isTextStep = step === 'idea' || step === 'title' || step === 'author';
  const stepIndex = Math.min(transcript.length, 7);

  return (
    <div
      className="rounded-[24px] border p-4 md:p-5"
      style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: 'linear-gradient(180deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--v3-gold, #c9a84c)', color: '#1a1408' }}>
          <Sparkles className="h-3 w-3" /> Dernière nouveauté IA
        </span>
        <span className="text-[11px]" style={{ color: 'var(--v3-muted)' }}>
          Étape {Math.min(stepIndex + (step === 'done' ? 0 : 1), 7)}/7 · rédaction 100 % en français
        </span>
      </div>

      {/* Progression du parcours complet */}
      <ol className="mt-3 flex flex-wrap gap-2 text-[11px]">
        {[
          { label: '1. Fiche du livre', done: step === 'done' },
          { label: '2. Sommaire IA validé', done: Boolean(brief.outlineValidated) },
          { label: '3. Rédaction (workflow)', done: false },
          { label: '4. Export + couverture', done: false },
        ].map((s) => (
          <li key={s.label} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1"
            style={{ borderColor: s.done ? 'var(--v3-gold, #c9a84c)' : 'rgba(0,0,0,0.12)', color: 'var(--v3-muted)' }}>
            {s.done ? <Check className="h-3 w-3" /> : null} {s.label}
          </li>
        ))}
      </ol>

      {/* Conversation */}
      <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {transcript.map((row, i) => (
          <div key={i} className="space-y-1">
            <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>🧞 {row.q}</p>
            <p className="ml-4 rounded-2xl bg-white/85 px-3 py-2 text-sm" style={{ color: 'var(--v3-ink)' }}>{row.a}</p>
          </div>
        ))}

        {step !== 'done' && (
          <p className="text-sm font-semibold" style={{ color: 'var(--v3-ink)' }}>
            🧞 {QUESTIONS[step]}
          </p>
        )}
        <div ref={endRef} />
      </div>

      {/* Saisie / choix */}
      {isTextStep && (
        <div className="mt-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || step !== 'idea')) { e.preventDefault(); submitText(); } }}
            rows={step === 'idea' ? 4 : 2}
            placeholder={step === 'idea' ? 'Ex. : un guide pratique pour débuter sur Amazon KDP en 30 jours…' : 'Votre réponse…'}
            className="w-full resize-none rounded-2xl border bg-white/90 p-3 text-sm outline-none"
            style={{ borderColor: 'rgba(0,0,0,0.10)', color: 'var(--v3-ink)' }}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" onClick={submitText} disabled={!input.trim()} className="v3-btn v3-btn-primary disabled:opacity-50">
              <Wand2 className="h-4 w-4" /> Envoyer au Génie <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/v3/create?import=1" className="v3-btn v3-btn-ghost text-xs">
              <Upload className="w-3.5 h-3.5" /> Importer un document (.docx, .pdf, URL)
            </Link>
          </div>
        </div>
      )}

      {step === 'category' && (
        <ChoiceRow options={CATEGORIES} onPick={chooseCategory} />
      )}
      {step === 'tone' && (
        <ChoiceRow options={TONES} onPick={chooseTone} />
      )}
      {step === 'size' && (
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {SIZES.map((s) => (
            <button key={s.label} type="button" onClick={() => chooseSize(s)}
              className="rounded-2xl border bg-white/90 px-3 py-3 text-left text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      {step === 'images' && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => chooseImages(true)} className="v3-btn v3-btn-primary">
            <ImageIcon className="h-4 w-4" /> Oui, avec illustrations IA
          </button>
          <button type="button" onClick={() => chooseImages(false)} className="v3-btn v3-btn-outline">
            Non, texte uniquement
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="mt-4 rounded-2xl border bg-white/90 p-4" style={{ borderColor: 'rgba(0,0,0,0.10)' }}>
          <p className="text-sm" style={{ color: 'var(--v3-ink)' }}>
            🧞 J’ai tout ce qu’il me faut : <strong>{brief.title}</strong> — {brief.category} · {brief.tone} ·{' '}
            {brief.chapters} chapitres × {brief.wordsPerChapter} mots ·{' '}
            {brief.wantsIllustrations ? 'avec illustrations' : 'sans illustration'}.
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--v3-muted)' }}>
            On construit maintenant le sommaire ensemble. Dès que vous le validez, le workflow rédige les chapitres avec
            vos informations, puis enchaîne l’export (PDF/Word) et la couverture{brief.wantsIllustrations ? ' et les illustrations' : ''}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onReady} className="v3-btn v3-btn-primary">
              <Sparkles className="h-4 w-4" /> Construire mon sommaire avec l’IA <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={restart} className="v3-btn v3-btn-ghost text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Reprendre le dialogue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChoiceRow({ options, onPick }: { options: string[]; onPick: (value: string) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onPick(option)}
          className="rounded-full border bg-white/90 px-3 py-1.5 text-[12px] font-semibold transition hover:opacity-80"
          style={{ borderColor: 'rgba(0,0,0,0.12)', color: 'var(--v3-ink)' }}>
          {option}
        </button>
      ))}
    </div>
  );
}
