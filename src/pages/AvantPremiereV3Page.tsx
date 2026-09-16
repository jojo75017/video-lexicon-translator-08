import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, BookOpen, CheckCircle2, Mail, Play, ShieldCheck, Sparkles, Subtitles } from 'lucide-react';
import '@/styles/v3-public.css';
import { supabase } from '@/integrations/supabase/client';
import videoAsset from '@/assets/ebookstudio-v3-video.mp4.asset.json';
import coverRoman from '@/assets/cover-demo-roman.jpg';
import coverGuide from '@/assets/cover-demo-guide.jpg';
import coverNonFiction from '@/assets/cover-demo-nonfiction.jpg';
import apercuStudio from '@/assets/cover-studio-hero.jpg';
import apercuJeunesse from '@/assets/studio-jeunesse-hero.jpg';

/** Lead magnet dédié à l'avant-première (aucune nouvelle table). */
const LEAD_MAGNET = 'avant-premiere-v3';

const POINTS = [
  {
    titre: 'Le sommaire construit avec vous',
    texte: "Vous racontez votre idée, le Génie pose des questions et bâtit le sommaire chapitre par chapitre.",
  },
  {
    titre: '16 agents, jusqu’à Lior le relecteur',
    texte: "Chaque agent fait un métier : structure, rédaction, cohérence, puis Lior corrige le livre entier avant l’export.",
  },
  {
    titre: 'Couvertures Kindle, broché et relié',
    texte: "Illustration générée, titres modifiables, dos et quatrième de couverture aux bonnes dimensions Amazon.",
  },
  {
    titre: 'Studio jeunesse et bande dessinée',
    texte: "Histoires par âge, coloriages, planches BD, packs d’activités prêts à publier.",
  },
  {
    titre: 'Exports prêts pour Amazon',
    texte: "Manuscrit, couverture et métadonnées sortent au bon format, sans bricolage de dernière minute.",
  },
  {
    titre: 'Livre audio et traductions',
    texte: "Votre livre lu à voix haute et traduit pour ouvrir d’autres marchés.",
  },
];

const VISUELS = [
  { src: coverRoman, alt: 'Exemple de couverture de roman créée avec EbookStudio' },
  { src: coverGuide, alt: 'Exemple de couverture de guide pratique créée avec EbookStudio' },
  { src: coverNonFiction, alt: 'Exemple de couverture de livre pratique créée avec EbookStudio' },
];

const APERCUS = [
  { src: apercuStudio, alt: 'Aperçu du studio de couvertures EbookStudio' },
  { src: apercuJeunesse, alt: 'Aperçu du studio jeunesse EbookStudio' },
];

export default function AvantPremiereV3Page() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Merci d’indiquer une adresse email valide.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: email.trim().toLowerCase(),
          lead_magnet: LEAD_MAGNET,
          landing_url: typeof window !== 'undefined' ? window.location.href : null,
        },
      });
      if (error) throw error;
      setDone(true);
    } catch {
      toast.error('Une erreur est survenue, réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="v3pub min-h-screen">
      {/* 1 — Bandeau d'avant-première */}
      <div
        className="w-full px-4 py-2.5 text-center"
        style={{ background: 'var(--v3-editorial-ink)', borderBottom: '1px solid var(--v3-gold)' }}
      >
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--v3-gold)' }}>
          Avant-première · Ouverture le 1<sup>er</sup> octobre 2026
        </p>
      </div>

      {/* 2 — Titre et promesse */}
      <header className="v3-shell pt-12 pb-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--v3-gold-600)' }}>
          EbookStudio V3
        </p>
        <h1
          className="mx-auto mt-3 max-w-3xl text-4xl md:text-5xl font-bold v3-serif"
          style={{ color: 'var(--v3-editorial-ink)' }}
        >
          Votre maison d’édition IA
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          De l’idée au livre publiable : le sommaire, les chapitres, la correction finale,
          la couverture Kindle, broché ou relié, et les fichiers prêts pour Amazon.
          Regardez la visite : vous n’avez rien à installer, rien à configurer.
        </p>
        <div className="v3-gold-rule mx-auto mt-8 max-w-md" />
      </header>

      {/* 3 — La vidéo, élément central */}
      <section className="v3-shell pb-12">
        <div
          className="relative rounded-md p-2 md:p-3"
          style={{
            background: 'var(--v3-ivory)',
            border: '1px solid var(--v3-gold)',
            boxShadow: '0 22px 50px -34px var(--v3-editorial-ink)',
          }}
        >
          <div
            className="rounded-sm px-4 py-4 md:px-7"
            style={{ border: '1px solid color-mix(in srgb, var(--v3-gold) 50%, transparent)' }}
          >
            <div
              className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              <p
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--v3-gold-600)' }}
              >
                <Play className="h-3.5 w-3.5" /> La visite complète de la V3
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: 'var(--v3-editorial-ink-soft)' }}
              >
                <Subtitles className="h-3 w-3" /> 5 min 12 · Voix française et sous-titres
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-sm" style={{ background: 'var(--v3-editorial-ink)' }}>
              <video src={videoAsset.url} controls playsInline preload="metadata" className="aspect-video w-full">
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Ce que vous voyez dans la vidéo */}
      <section className="v3-shell pb-12">
        <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
          Ce que vous voyez dans la vidéo
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.titre}
              className="rounded-md p-5"
              style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}
            >
              <p className="flex items-start gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-gold-600)' }} />
                {p.titre}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                {p.texte}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — Preuves visuelles */}
      <section
        className="w-full py-12"
        style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}
      >
        <div className="v3-shell">
          <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Des couvertures et des écrans réels
          </h2>
          <p className="mt-2 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
            Rien de simulé : voici des couvertures produites dans le studio et deux aperçus des outils.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-2xl">
            {VISUELS.map((v) => (
              <img
                key={v.alt}
                src={v.src}
                alt={v.alt}
                loading="lazy"
                className="w-full rounded-sm object-cover"
                style={{ aspectRatio: '2 / 3', border: '1px solid var(--v3-line)' }}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {APERCUS.map((a) => (
              <img
                key={a.alt}
                src={a.src}
                alt={a.alt}
                loading="lazy"
                className="w-full rounded-sm object-cover"
                style={{ aspectRatio: '16 / 9', border: '1px solid var(--v3-line)' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6 et 7 — Inscription, puis l'offre en second */}
      <section className="v3-shell py-14">
        <div
          className="mx-auto max-w-2xl rounded-md p-7 text-center"
          style={{
            background: 'var(--v3-ivory)',
            border: '1px solid var(--v3-gold)',
            boxShadow: '0 22px 50px -34px var(--v3-editorial-ink)',
          }}
        >
          <p className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600)' }}>
            <Sparkles className="h-3.5 w-3.5" /> Liste d’attente
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Soyez prévenu dès l’ouverture
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px]" style={{ color: 'var(--v3-muted)' }}>
            Laissez votre email : vous recevrez un seul message le jour de l’ouverture,
            le 1<sup>er</sup> octobre 2026. Aucun paiement, aucune carte bancaire.
          </p>

          {done ? (
            <div
              className="mt-6 rounded-sm px-4 py-5"
              style={{ background: 'var(--v3-emerald-50)', border: '1px solid var(--v3-line)' }}
            >
              <p className="flex items-center justify-center gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--v3-emerald-600)' }} />
                C’est noté, vous êtes sur la liste.
              </p>
              <p className="mt-1 text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>
                Vous serez prévenu le 1<sup>er</sup> octobre 2026 à l’ouverture.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="avant-premiere-email" className="sr-only">
                Votre adresse email
              </label>
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--v3-muted)' }} />
                <input
                  id="avant-premiere-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  className="h-12 w-full rounded-sm pl-9 pr-3 text-[15px] outline-none"
                  style={{ background: '#fff', border: '1px solid var(--v3-line)', color: 'var(--v3-ink)' }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm px-6 text-[15px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                style={{ background: 'var(--v3-action-orange)', color: 'var(--v3-action-orange-text)' }}
              >
                {submitting ? 'Enregistrement…' : 'Je veux être prévenu à l’ouverture'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <div className="v3-gold-rule mx-auto mt-8" />

          <p className="mt-6 text-[14px]" style={{ color: 'var(--v3-muted)' }}>
            Vous préférez ne pas attendre : l’accès à vie est à 47 € jusqu’au 30/09/2026.
          </p>
          <Link
            to="/commander"
            className="mt-3 inline-flex items-center gap-2 text-[14.5px] font-semibold underline underline-offset-4"
            style={{ color: 'var(--v3-editorial-ink)' }}
          >
            <BookOpen className="h-4 w-4" /> Voir l’offre à 47 €
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 8 — Rassurance et pied de page */}
      <footer
        className="w-full py-10"
        style={{ background: 'var(--v3-editorial-ink)', borderTop: '1px solid var(--v3-gold)' }}
      >
        <div className="v3-shell text-center">
          <p className="flex items-center justify-center gap-2 text-[13.5px] font-semibold" style={{ color: 'var(--v3-gold)' }}>
            <ShieldCheck className="h-4 w-4" /> Garantie 7 jours sur l’offre · Aucun prélèvement pour la liste d’attente
          </p>
          <p className="mt-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
            EbookStudio — la V3 ouvre le 1<sup>er</sup> octobre 2026 à 8 h (heure de Paris).
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link to="/mentions-legales" className="underline underline-offset-4">Mentions légales</Link>
            <Link to="/cgv" className="underline underline-offset-4">CGV</Link>
            <Link to="/politique-confidentialite" className="underline underline-offset-4">Confidentialité</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
