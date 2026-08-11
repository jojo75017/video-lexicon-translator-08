import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Loader2, Lock, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Brief {
  title: string;
  subtitle: string;
  category: string;
  tone: string;
  description: string;
  chapters: number;
}

interface Chapter {
  numero: number;
  titre: string;
  objectif?: string;
}

const FREE_CHAPTERS = 8;
const OFFER_URL = '/commander';

export default function DemoGeniePage() {
  const [idea, setIdea] = useState('');
  const [step, setStep] = useState<'idea' | 'preview' | 'unlocked'>('idea');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = 'Testez le Génie sur votre idée de livre — Ebookstudio';
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "Décrivez votre idée de livre en une phrase : titre, sous-titre et sommaire chapitre par chapitre générés gratuitement.";
    if (meta) meta.setAttribute('content', content);
  }, []);

  const utm = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      landing_url: window.location.href,
    };
  }, []);

  const generate = async () => {
    if (idea.trim().length < 15) {
      toast.error('Décrivez votre livre en une phrase complète.');
      return;
    }
    setLoading(true);
    try {
      const { data: briefRes, error: briefErr } = await supabase.functions.invoke('v3-genie-brief', {
        body: { message: idea.trim() },
      });
      if (briefErr || !briefRes?.brief) {
        throw new Error(briefErr?.message || briefRes?.error || 'Génération indisponible');
      }
      const b = briefRes.brief as Brief;
      setBrief(b);

      const { data: outlineRes, error: outlineErr } = await supabase.functions.invoke('v3-generate-outline', {
        body: {
          title: b.title,
          subtitle: b.subtitle,
          category: b.category,
          tone: b.tone,
          description: b.description,
          chapters: b.chapters,
        },
      });
      if (outlineErr || !Array.isArray(outlineRes?.chapters) || outlineRes.chapters.length === 0) {
        throw new Error(outlineErr?.message || outlineRes?.error || 'Sommaire indisponible');
      }
      setChapters(outlineRes.chapters as Chapter[]);
      setStep('preview');
    } catch (e) {
      toast.error((e as Error).message || 'Réessayez dans quelques secondes.');
    } finally {
      setLoading(false);
    }
  };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Entrez un email valide.');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('demo-genie-capture', {
        body: {
          email: email.trim(),
          first_name: firstName.trim(),
          website,
          title: brief?.title,
          subtitle: brief?.subtitle,
          chapters,
          ...utm,
        },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setStep('unlocked');
      toast.success('Sommaire complet débloqué — il est aussi parti par email.');
    } catch (err) {
      toast.error((err as Error).message || 'Enregistrement impossible, réessayez.');
    } finally {
      setSending(false);
    }
  };

  // Le sommaire complet est offert : plus aucun chapitre masqué.
  // L'email n'est demandé que pour recevoir le PDF et le 1er chapitre rédigé.
  const visible = chapters;


  return (
    <div className="min-h-screen" style={{ background: '#FBF6EC', color: '#2A2118' }}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: '#C97A14' }}>
          Démonstration gratuite
        </p>
        <h1
          className="mt-3 text-4xl sm:text-5xl font-semibold leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Décrivez votre idée de livre.<br />Repartez avec son sommaire.
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed" style={{ color: '#6B6257' }}>
          Une phrase suffit. En moins de deux minutes, vous obtenez un titre, un sous-titre et un
          sommaire chapitre par chapitre. Aucun compte à créer pour commencer.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: 'rgba(0,0,0,.08)' }}>
          <label className="block text-sm font-medium">
            Votre idée de livre
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder="Ex. : un guide pour apprendre à gérer son budget quand on est jeune parent, avec des exemples concrets et des méthodes simples."
              className="mt-2 w-full rounded-xl border px-3 py-2.5 text-[15px] focus:outline-none"
              style={{ borderColor: 'rgba(0,0,0,.15)' }}
            />
          </label>
          <button
            onClick={generate}
            disabled={loading}
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-60"
            style={{ background: '#E8951E' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Le Génie travaille…' : 'Générer mon sommaire'}
          </button>
        </div>

        {brief && (
          <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: 'rgba(0,0,0,.08)' }}>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#C97A14' }}>
              Proposition du Génie
            </p>
            <h2 className="mt-2 text-2xl font-semibold" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              {brief.title}
            </h2>
            {brief.subtitle && <p className="text-sm mt-1" style={{ color: '#6B6257' }}>{brief.subtitle}</p>}
            <p className="mt-3 text-[15px] leading-relaxed">{brief.description}</p>

            <ol className="mt-6 space-y-2">
              {visible.map((c, i) => (
                <li key={`${c.numero}-${i}`} className="flex gap-3 text-[15px]">
                  <span className="w-6 shrink-0 font-semibold" style={{ color: '#C97A14' }}>{i + 1}.</span>
                  <span>
                    {c.titre}
                    {c.objectif && <span className="block text-xs mt-0.5" style={{ color: '#6B6257' }}>{c.objectif}</span>}
                  </span>
                </li>
              ))}
            </ol>

            {step === 'preview' && hidden > 0 && (
              <form onSubmit={unlock} className="mt-6 rounded-xl p-5" style={{ background: '#FFF3DF' }}>
                <p className="flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4" /> {hidden} chapitres restants
                </p>
                <p className="mt-1 text-sm" style={{ color: '#6B6257' }}>
                  Entrez votre email : le sommaire complet s'affiche immédiatement et vous le recevez aussi par email.
                </p>
                <div className="mt-3 grid sm:grid-cols-[1fr_1.4fr_auto] gap-2">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    className="rounded-lg border px-3 py-2.5 text-[15px] bg-white focus:outline-none"
                    style={{ borderColor: 'rgba(0,0,0,.15)' }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="rounded-lg border px-3 py-2.5 text-[15px] bg-white focus:outline-none"
                    style={{ borderColor: 'rgba(0,0,0,.15)' }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white disabled:opacity-60"
                    style={{ background: '#2A2118' }}
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Voir tout
                  </button>
                </div>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
              </form>
            )}

            {step === 'unlocked' && (
              <div className="mt-6 rounded-xl p-5" style={{ background: '#FFF3DF' }}>
                <p className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4" /> Sommaire complet débloqué
                </p>
                <p className="mt-1 text-sm" style={{ color: '#6B6257' }}>
                  Étape suivante : faire rédiger les {chapters.length} chapitres, corriger le manuscrit,
                  créer la couverture et exporter le fichier prêt pour Amazon KDP.
                </p>
                <a
                  href={OFFER_URL}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white"
                  style={{ background: '#E8951E' }}
                >
                  Écrire mon livre en entier — 47 € à vie <ArrowRight className="w-4 h-4" />
                </a>
                <p className="mt-2 text-xs" style={{ color: '#6B6257' }}>
                  Accès à vie à 47 € jusqu'au 30 septembre 2026. Ensuite, uniquement par abonnement.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
