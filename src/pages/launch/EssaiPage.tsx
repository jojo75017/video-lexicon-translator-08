import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Sparkles, Lock, BookOpen, Mail, CheckCircle2, PenLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useLaunchSettings from '@/hooks/useLaunchSettings';
import { V3_PLANS, formatPrice } from '@/data/v3Pricing';

interface OutlineItem {
  title: string;
  summary: string;
}

interface TrialResult {
  trialId: string;
  title: string;
  subtitle: string;
  outline: OutlineItem[];
  chapterTitle: string;
  chapter: string;
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

const LOCKED = [
  'Les chapitres 2 à 60, écrits dans la continuité du premier',
  'La correction professionnelle en 4 passes',
  'La couverture complète (recto, tranche, 4e de couverture)',
  'Les exports Word, PDF et EPUB prêts pour Amazon KDP',
  'La fiche Amazon : description, mots-clés, catégories',
  "L'audiolivre et les 10 langues",
];

export default function EssaiPage() {
  const [params] = useSearchParams();
  const { settings, loading: settingsLoading } = useLaunchSettings();

  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [language, setLanguage] = useState('fr');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<TrialResult | null>(null);

  const [email, setEmail] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    document.title = 'Écrivez votre premier chapitre gratuitement — EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "Donnez votre idée de livre : l'IA écrit gratuitement votre chapitre 1 et vous propose le sommaire complet. Premier mois offert, ouverture le 1er octobre 2026.",
      );
    }
  }, []);

  const trialOpen = settings.free_trial_open.enabled;
  const paragraphs = useMemo(
    () => (result?.chapter ?? '').split(/\n{2,}/).filter((p) => p.trim().length > 0),
    [result],
  );

  const generate = async () => {
    if (idea.trim().length < 10) {
      toast.error('Décrivez votre idée en une phrase au minimum.');
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('trial-chapter', {
        body: {
          action: 'generate',
          idea: idea.trim(),
          audience: audience.trim(),
          tone,
          language,
          utmSource: params.get('utm_source') ?? undefined,
          utmCampaign: params.get('utm_campaign') ?? undefined,
        },
      });
      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setResult(data as TrialResult);
      toast.success('Votre chapitre 1 est prêt.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'La génération a échoué.');
    } finally {
      setGenerating(false);
    }
  };

  const claim = async () => {
    if (!result) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setClaiming(true);
    try {
      const { data, error } = await supabase.functions.invoke('trial-chapter', {
        body: { action: 'claim', trialId: result.trialId, email: email.trim() },
      });
      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      setClaimed(true);
      toast.success('Chapitre envoyé — vérifiez votre boîte de réception.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "L'envoi a échoué.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-cream, #FBF8F3)' }}>
      {/* En-tête */}
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="v3-serif text-lg font-bold" style={{ color: 'var(--v3-ink, #2A2118)' }}>
            EbookStudio
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F2E1F]">
            Ouverture complète le 1<sup>er</sup> octobre 2026
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        {!result ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <section>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D1B]">
                <Sparkles className="h-3.5 w-3.5" /> Essai gratuit, sans carte bancaire
              </span>
              <h1
                className="v3-serif mt-4 text-4xl font-bold leading-tight md:text-5xl"
                style={{ color: 'var(--v3-ink, #2A2118)' }}
              >
                Votre premier chapitre écrit gratuitement, en quelques minutes
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5B5245]">
                Donnez simplement votre idée. Nos moteurs éditoriaux vous rendent un
                <strong> chapitre 1 complet (1 200 à 1 800 mots)</strong>, un titre, un sous-titre et le
                sommaire du livre entier. Vous lisez, vous jugez, et vous décidez ensuite.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <label className="block text-sm font-semibold text-[#2A2118]">
                  Votre idée de livre <span className="text-red-600">*</span>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Exemple : un guide pour aider les jeunes parents à retrouver un sommeil normal en 30 jours."
                    className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#2A2118]">
                    Public visé <span className="font-normal text-[#8A8072]">(facultatif)</span>
                    <input
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Jeunes parents débordés"
                      className="mt-2 w-full rounded-xl border border-black/15 px-3 py-2 text-sm font-normal focus:border-[#0F2E1F] focus:outline-none"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#2A2118]">
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
                </div>

                <label className="block text-sm font-semibold text-[#2A2118]">
                  Langue du livre
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

                <button
                  type="button"
                  onClick={generate}
                  disabled={generating || !trialOpen || settingsLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2E1F] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#14532D] disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Votre chapitre s'écrit…
                    </>
                  ) : (
                    <>
                      <PenLine className="h-5 w-5" /> Écrire mon chapitre 1 gratuitement
                    </>
                  )}
                </button>
                {!trialOpen && !settingsLoading && (
                  <p className="text-center text-sm text-red-700">
                    L'essai gratuit est momentanément fermé. Revenez très vite.
                  </p>
                )}
                <p className="text-center text-xs text-[#8A8072]">
                  Aucune carte bancaire. Aucun engagement. Votre chapitre reste le vôtre.
                </p>
              </div>
            </section>

            <aside className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="v3-serif text-xl font-bold text-[#2A2118]">Ce qui se passe ensuite</h2>
              <ol className="mt-4 space-y-4 text-sm text-[#5B5245]">
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#0F2E1F] text-xs font-bold text-white">
                    1
                  </span>
                  Vous lisez votre chapitre 1 et le sommaire complet du livre.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#0F2E1F] text-xs font-bold text-white">
                    2
                  </span>
                  Vous le recevez par email, en un clic, pour le garder.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#0F2E1F] text-xs font-bold text-white">
                    3
                  </span>
                  Pour écrire la suite, vous créez votre compte —{' '}
                  <strong>le premier mois est offert</strong>.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-[#2A2118]">
                    4
                  </span>
                  Votre studio complet s'ouvre le 1<sup>er</sup> octobre 2026.
                </li>
              </ol>

              <div className="mt-6 rounded-xl bg-[#FBF8F3] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6D1B]">
                  Les trois forfaits
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[#2A2118]">
                  {V3_PLANS.map((p) => (
                    <li key={p.id} className="flex justify-between gap-3">
                      <span>{p.name}</span>
                      <strong>{formatPrice(p.monthlyPrice)} / mois</strong>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-[#8A8072]">
                  Premier mois offert : première facture le 1<sup>er</sup> novembre 2026, résiliable en un
                  clic avant.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
            {/* Le chapitre */}
            <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A6D1B]">
                Votre chapitre 1 · {result.wordCount} mots
              </p>
              <h1 className="v3-serif mt-2 text-3xl font-bold leading-tight text-[#2A2118]">
                {result.title}
              </h1>
              {result.subtitle && (
                <p className="mt-1 text-base italic text-[#5B5245]">{result.subtitle}</p>
              )}
              <h2 className="v3-serif mt-7 text-xl font-bold text-[#0F2E1F]">
                {result.chapterTitle || 'Chapitre 1'}
              </h2>
              <div className="mt-4 space-y-4 text-[17px] leading-[1.75] text-[#2A2118]">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-[#0F2E1F]/15 bg-[#FBF8F3] p-5">
                {claimed ? (
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#0F2E1F]">
                    <CheckCircle2 className="h-5 w-5" /> Chapitre envoyé à {email}.
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#2A2118]">
                      Recevoir ce chapitre par email pour le garder
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
                        {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        Recevoir mon chapitre
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Sommaire + mur de conversion */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h2 className="v3-serif flex items-center gap-2 text-lg font-bold text-[#2A2118]">
                  <BookOpen className="h-4 w-4" /> Le sommaire de votre livre
                </h2>
                <ol className="mt-4 space-y-2 text-sm text-[#5B5245]">
                  {result.outline.map((c, i) => (
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
                        {i === 0 && ' — écrit ✓'}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border-2 border-[#D4AF37]/50 bg-[#0F2E1F] p-6 text-white shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                  Pour écrire la suite
                </p>
                <h2 className="v3-serif mt-2 text-2xl font-bold">Le premier mois est offert</h2>
                <ul className="mt-4 space-y-2 text-sm text-white/85">
                  {LOCKED.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <Lock className="mt-0.5 h-3.5 w-3.5 flex-none text-[#D4AF37]" />
                      {l}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/essai/inscription?trial=${result.trialId}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-bold text-[#2A2118] transition hover:brightness-110"
                >
                  Créer mon compte — 1<sup>er</sup> mois offert
                </Link>
                <p className="mt-3 text-center text-xs text-white/70">
                  Première facture le 1<sup>er</sup> novembre 2026 · résiliable en un clic
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
