import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Sparkles, Lock, BookOpen, Mail, CheckCircle2, PenLine, Rocket, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useLaunchSettings from '@/hooks/useLaunchSettings';

interface OutlineItem {
  title: string;
  summary: string;
}

interface OutlineResult {
  trialId: string;
  title: string;
  subtitle: string;
  outline: OutlineItem[];
}

interface ChapterResult {
  chapterTitle: string;
  excerpt: string[];
  totalParagraphs: number;
  wordCount: number;
}

const TONES = [
  'Chaleureux et accessible',
  'Professionnel et direct',
  'Narratif et immersif',
  'Pédagogique, pas à pas',
];

const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'Anglais' },
  { code: 'es', label: 'Espagnol' },
  { code: 'de', label: 'Allemand' },
  { code: 'it', label: 'Italien' },
  { code: 'pt', label: 'Portugais' },
  { code: 'nl', label: 'Néerlandais' },
];

const EXAMPLES = [
  'Un guide pour aider les jeunes parents à retrouver un sommeil normal en 30 jours.',
  "Un roman policier dans un village breton où le boulanger disparaît la nuit de Noël.",
  'Un livre de recettes simples pour cuisiner sain en moins de 20 minutes le soir.',
];

const LOCKED = [
  'Les chapitres 2 à 60, écrits dans la continuité du premier',
  'La correction professionnelle en 4 passes',
  'La couverture complète (recto, tranche, 4e de couverture)',
  'Les exports Word, PDF et EPUB prêts pour Amazon KDP',
  'La fiche Amazon : description, mots-clés, catégories',
  "L'audiolivre et les 10 langues",
];

/** Chaque marche du tunnel est enregistrée pour voir précisément où ça casse. */
async function track(eventType: string, params: URLSearchParams) {
  try {
    await supabase.from('capture_events').insert({
      event_type: eventType,
      surface: 'essai',
      page_path: '/essai',
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    });
  } catch {
    /* le tracking ne doit jamais bloquer le visiteur */
  }
}

export default function EssaiPage() {
  const [params] = useSearchParams();
  const { settings, loading: settingsLoading } = useLaunchSettings();

  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState('fr');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [outlineResult, setOutlineResult] = useState<OutlineResult | null>(null);
  const [chapter, setChapter] = useState<ChapterResult | null>(null);
  const [chapterLoading, setChapterLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [fullChapter, setFullChapter] = useState<string | null>(null);

  const wallSeen = useRef(false);

  useEffect(() => {
    document.title = 'Votre chapitre 1 écrit gratuitement — EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "Donnez votre idée de livre : vous recevez immédiatement le titre, le sommaire complet et le début du chapitre 1, écrits pour vous. Gratuit, sans carte bancaire.",
      );
    }
    void track('view', params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trialOpen = settings.free_trial_open.enabled;

  const fullParagraphs = useMemo(
    () => (fullChapter ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    [fullChapter],
  );

  const invoke = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke('trial-chapter', { body });
    if (error) throw new Error(error.message);
    if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
    return data;
  };

  const generate = async () => {
    if (idea.trim().length < 10) {
      toast.error('Décrivez votre idée en une phrase au minimum.');
      return;
    }
    setGenerating(true);
    void track('generate_click', params);
    try {
      const data = (await invoke({
        action: 'outline',
        idea: idea.trim(),
        audience: audience.trim(),
        tone,
        language,
        utmSource: params.get('utm_source') ?? undefined,
        utmCampaign: params.get('utm_campaign') ?? undefined,
      })) as OutlineResult;
      setOutlineResult(data);
      void track('outline_shown', params);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Le chapitre s'écrit en arrière-plan pendant qu'il lit son sommaire.
      setChapterLoading(true);
      try {
        const ch = (await invoke({ action: 'chapter', trialId: data.trialId })) as ChapterResult;
        setChapter(ch);
        if (!wallSeen.current) {
          wallSeen.current = true;
          void track('wall_shown', params);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "L'écriture du chapitre a échoué.");
      } finally {
        setChapterLoading(false);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'La génération a échoué.');
    } finally {
      setGenerating(false);
    }
  };

  const claim = async () => {
    if (!outlineResult) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setClaiming(true);
    try {
      const data = (await invoke({
        action: 'claim',
        trialId: outlineResult.trialId,
        email: email.trim(),
      })) as { chapter?: string; chapterTitle?: string; wordCount?: number };
      try {
        localStorage.setItem('ebs_lead_email', email.trim().toLowerCase());
        localStorage.setItem('ebs_reader_unlocked', '1');
      } catch {
        /* navigation privée */
      }
      setFullChapter(data.chapter ?? '');
      setClaimed(true);
      void track('email_captured', params);
      toast.success('Chapitre débloqué — il part aussi dans votre boîte de réception.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "L'envoi a échoué.");
    } finally {
      setClaiming(false);
    }
  };

  const commanderUrl = (() => {
    const q = new URLSearchParams(params);
    q.set('src', 'essai');
    return `/commander?${q.toString()}`;
  })();

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      {/* En-tête minimal : le visiteur reste dans son livre, rien d'autre. */}
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="v3-serif text-lg font-bold" style={{ color: 'var(--v3-ink, #2A2118)' }}>
            EbookStudio
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F2E1F]">
            Essai gratuit — sans carte bancaire
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {!outlineResult ? (
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D1B]">
              <Sparkles className="h-3.5 w-3.5" /> Gratuit, aucune inscription pour commencer
            </span>
            <h1
              className="v3-serif mt-4 text-4xl font-bold leading-tight md:text-5xl"
              style={{ color: 'var(--v3-ink, #2A2118)' }}
            >
              Donnez votre idée. Voyez votre livre commencer.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#5B5245]">
              Une phrase suffit. Vous recevez immédiatement le titre, le sous-titre, le{' '}
              <strong>sommaire complet</strong> et le début de votre <strong>chapitre 1</strong>, écrits
              pour vous. Vous lisez avant de décider quoi que ce soit.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <label className="block text-sm font-semibold text-[#2A2118]">
                Votre idée de livre
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  autoFocus
                  placeholder="Exemple : un guide pour aider les jeunes parents à retrouver un sommeil normal en 30 jours."
                  className="mt-2 w-full rounded-xl border border-black/15 px-3 py-3 text-base font-normal focus:border-[#0F2E1F] focus:outline-none"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-[#8A8072]">Pas d'idée précise ?</span>
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdea(ex)}
                    className="rounded-full border border-black/10 bg-[#FBF8F3] px-3 py-1 text-xs text-[#5B5245] transition hover:border-[#0F2E1F]/40 hover:text-[#0F2E1F]"
                  >
                    Exemple {i + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={generating || !trialOpen || settingsLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#14532D] disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Votre livre démarre…
                  </>
                ) : (
                  <>
                    <PenLine className="h-5 w-5" /> Voir mon livre commencer
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-center gap-1 text-xs font-semibold text-[#8A6D1B]"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition ${showAdvanced ? 'rotate-180' : ''}`} />
                Affiner (public, ton, langue) — facultatif
              </button>

              {showAdvanced && (
                <div className="grid gap-4 border-t border-black/5 pt-4 sm:grid-cols-3">
                  <label className="block text-xs font-semibold text-[#2A2118]">
                    Public visé
                    <input
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Jeunes parents débordés"
                      className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#2A2118]">
                    Ton du livre
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                    >
                      {TONES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-[#2A2118]">
                    Langue
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {!trialOpen && !settingsLoading && (
                <p className="text-center text-sm text-red-700">
                  L'essai gratuit est momentanément fermé. Revenez très vite.
                </p>
              )}
              <p className="text-center text-xs text-[#8A8072]">
                Aucune carte bancaire. Aucun engagement. Votre livre reste le vôtre.
              </p>
              <p className="text-center text-xs text-[#8A8072]">
                Vous cherchez plutôt un sujet qui se vend ?{' '}
                <a href="/cadeau?src=essai" className="font-semibold text-[#0F2E1F] underline underline-offset-2">
                  Voir les 5 niches Amazon offertes
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* Le livre */}
            <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D1B]">
                Votre livre {chapter ? `· chapitre 1, ${chapter.wordCount} mots` : ''}
              </p>
              <h1 className="v3-serif mt-2 text-3xl font-bold leading-tight text-[#2A2118]">
                {outlineResult.title}
              </h1>
              {outlineResult.subtitle && (
                <p className="mt-1 text-base italic text-[#5B5245]">{outlineResult.subtitle}</p>
              )}

              <h2 className="v3-serif mt-7 text-xl font-bold text-[#0F2E1F]">
                {chapter?.chapterTitle || outlineResult.outline[0]?.title || 'Chapitre 1'}
              </h2>

              {chapterLoading && !chapter && (
                <p className="mt-4 flex items-center gap-2 text-sm text-[#8A8072]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Votre chapitre 1 s'écrit en ce moment…
                </p>
              )}

              {claimed && fullChapter ? (
                <div className="mt-4 space-y-4 text-[17px] leading-[1.75] text-[#2A2118]">
                  {fullParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                chapter && (
                  <>
                    <div className="mt-4 space-y-4 text-[17px] leading-[1.75] text-[#2A2118]">
                      {chapter.excerpt.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>

                    {/* Mur doux : on montre avant de demander. */}
                    <div className="relative mt-2">
                      <div
                        aria-hidden
                        className="select-none space-y-4 text-[17px] leading-[1.75] text-[#2A2118] blur-[5px]"
                      >
                        <p>
                          La suite du chapitre continue ici sur {Math.max(1, chapter.totalParagraphs - 2)} paragraphes,
                          avec le développement complet et la fin qui donne envie de lire le chapitre suivant.
                        </p>
                        <p>
                          Elle a été écrite pour votre idée, dans votre ton, et elle vous appartient
                          entièrement dès que vous l'ouvrez.
                        </p>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-white/40 to-white" />
                    </div>

                    <div className="mt-2 rounded-xl border border-[#0F2E1F]/15 bg-[#FBF8F3] p-5">
                      <p className="text-base font-bold text-[#2A2118]">
                        Lire mon chapitre 1 en entier
                      </p>
                      <p className="mt-1 text-sm text-[#5B5245]">
                        Votre email, et le chapitre complet s'affiche tout de suite. Vous le recevez
                        aussi par mail pour le garder.
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vous@exemple.com"
                          className="flex-1 rounded-xl border border-black/15 px-3 py-2.5 text-sm focus:border-[#0F2E1F] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={claim}
                          disabled={claiming}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#14532D] disabled:opacity-60"
                        >
                          {claiming ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          Débloquer mon chapitre
                        </button>
                      </div>
                    </div>
                  </>
                )
              )}

              {claimed && (
                <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0F2E1F]">
                  <CheckCircle2 className="h-5 w-5" /> Chapitre envoyé à {email}.
                </p>
              )}
            </section>

            {/* Sommaire, puis offre seulement après livraison */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h2 className="v3-serif flex items-center gap-2 text-lg font-bold text-[#2A2118]">
                  <BookOpen className="h-4 w-4" /> Le sommaire de votre livre
                </h2>
                <ol className="mt-4 space-y-2 text-sm text-[#5B5245]">
                  {outlineResult.outline.map((c, i) => (
                    <li
                      key={i}
                      className={
                        i === 0
                          ? 'rounded-lg bg-[#0F2E1F]/5 p-2 font-semibold text-[#0F2E1F]'
                          : 'flex items-start gap-2 p-2'
                      }
                    >
                      {i > 0 && <Lock className="mt-0.5 h-3.5 w-3.5 flex-none text-[#B8AFA0]" />}
                      <span>
                        {c.title}
                        {i === 0 && (chapter ? ' — écrit ✓' : ' — en cours…')}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {claimed && (
                <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#FFFDF7] p-6 shadow-lg">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7A5A00]">
                    Pour écrire la suite
                  </p>
                  <h2 className="v3-serif mt-2 text-2xl font-bold leading-tight text-[#18261E]">
                    L'accès à vie à 47 € — jusqu'au 30 septembre 2026
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm font-medium text-[#263D30]">
                    {LOCKED.map((l) => (
                      <li key={l} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#147A4A]" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={commanderUrl}
                    onClick={() => void track('commander_click', params)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#14532D]"
                  >
                    <Rocket className="h-4 w-4" /> Écrire les chapitres 2 à 60
                  </a>
                  <p className="mt-3 text-center text-xs font-medium text-[#5B5245]">
                    Paiement unique de 47 € · aucun abonnement. Après le 30 septembre 2026 :
                    abonnement mensuel 27 € ou 47 €, sans engagement.
                  </p>
                </div>
              )}

            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
