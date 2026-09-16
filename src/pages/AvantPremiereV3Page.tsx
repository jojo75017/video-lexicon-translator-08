import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Mail,
  Play,
  ShieldCheck,
  Sparkles,
  Subtitles,
  X,
} from 'lucide-react';
import '@/styles/v3-public.css';
import { supabase } from '@/integrations/supabase/client';
import videoAsset from '@/assets/ebookstudio-v3-video.mp4.asset.json';
import coverRoman from '@/assets/cover-demo-roman.jpg';
import coverGuide from '@/assets/cover-demo-guide.jpg';
import coverNonFiction from '@/assets/cover-demo-nonfiction.jpg';
import apercuStudio from '@/assets/cover-studio-hero.jpg';
import apercuJeunesse from '@/assets/studio-jeunesse-hero.jpg';
import apercuBd from '@/assets/bd-studio-hero.jpg';
import heroBooks from '@/assets/commander-hero-books.jpg';

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

const ANCIEN = [
  'La page blanche, et un sommaire qu’on recommence dix fois.',
  'Des mois d’écriture le soir, sans savoir si le livre tient debout.',
  'Une couverture bricolée qui trahit l’amateur en une seconde.',
  'Des fichiers refusés par Amazon pour trois millimètres de marge.',
  'Un prestataire à plusieurs centaines d’euros pour un seul livre.',
];

const NOUVEAU = [
  'Vous racontez votre idée, le sommaire naît de vos réponses.',
  'Les chapitres s’écrivent dans votre ton, un par un, sous vos yeux.',
  'Lior relit le livre entier et corrige avant l’export.',
  'La couverture sort aux dimensions Kindle, broché et relié.',
  'Les fichiers partent chez Amazon du premier coup.',
];

const ETAPES = [
  { n: '1', titre: 'Racontez', texte: 'Votre sujet, votre public, votre ton. Le Génie pose les bonnes questions.' },
  { n: '2', titre: 'Validez le sommaire', texte: 'Vous ajoutez, retirez, réordonnez les chapitres jusqu’à ce que ça vous ressemble.' },
  { n: '3', titre: 'Laissez écrire', texte: 'Les agents rédigent chapitre par chapitre, puis Lior corrige tout le livre.' },
  { n: '4', titre: 'Habillez et publiez', texte: 'Couverture, quatrième, métadonnées, fichiers prêts pour Amazon KDP.' },
];

const INCLUS = [
  { titre: 'Écriture guidée', texte: 'Génie, sommaire assisté, 40 chapitres, 5 000 mots par chapitre.' },
  { titre: 'Correction finale', texte: 'Lior relit le livre entier, avant / après visible, vous gardez la main.' },
  { titre: 'Studio de couvertures', texte: 'Kindle, broché, relié : illustration, textes modifiables, dos et quatrième.' },
  { titre: 'Studio jeunesse', texte: 'Histoires par âge, coloriages, packs d’activités, supports de classe.' },
  { titre: 'Studio BD', texte: 'Scénario, planches, bulles : la bande dessinée prête à publier.' },
  { titre: 'Livre audio', texte: 'Votre texte lu à voix haute, prêt pour vos auditeurs.' },
  { titre: 'Traductions', texte: 'Ouvrez d’autres marchés sans repartir de zéro.' },
  { titre: 'Données KDP', texte: 'Niches, mots-clés, catégories, marges : les chiffres avant d’écrire.' },
  { titre: 'Exports', texte: 'Manuscrit, couverture et fiche produit au bon format, du premier coup.' },
];

const FAQ = [
  {
    q: 'Faut-il savoir écrire ?',
    r: 'Non. Vous racontez, vous validez, vous corrigez ce qui ne vous plaît pas. Le texte reste le vôtre : vous pouvez tout modifier.',
  },
  {
    q: 'Est-ce que ça marche dans mon domaine ?',
    r: 'Roman, guide pratique, développement personnel, jeunesse, bande dessinée, livres d’activités : le parcours est le même, seules vos réponses changent.',
  },
  {
    q: 'Amazon accepte-t-il ces livres ?',
    r: 'Oui, à condition de respecter leurs règles de publication, ce que les exports font par construction (dimensions, marges, fond perdu).',
  },
  {
    q: 'Que se passe-t-il le 1er octobre 2026 ?',
    r: 'La V3 s’ouvre à 8 h, heure de Paris. Si vous êtes sur la liste d’attente, vous recevez un message ce matin-là.',
  },
  {
    q: 'Et si je suis déjà abonné ?',
    r: 'Votre accès actuel est conservé : vous n’êtes jamais lésé, et vous choisissez vous-même quand passer sur la V3.',
  },
  {
    q: 'Est-ce que je peux voir avant de payer ?',
    r: 'C’est exactement l’objet de cette page : la visite filmée, des couvertures réelles, des aperçus d’écrans. Rien à installer, rien à payer pour regarder.',
  },
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

  const scrollToForm = () => {
    document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const ctaButton = (label: string) => (
    <button
      type="button"
      onClick={scrollToForm}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-sm px-7 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--v3-action-orange)', color: 'var(--v3-action-orange-text)' }}
    >
      {label} <ArrowRight className="h-4 w-4" />
    </button>
  );

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
          EbookStudio V3 · Auteurs, coachs, formateurs, experts
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl md:text-5xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
          Votre maison d’édition IA
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          De l’idée au livre publiable : le sommaire, les chapitres, la correction finale,
          la couverture Kindle, broché ou relié, et les fichiers prêts pour Amazon.
          Regardez la visite : vous n’avez rien à installer, rien à configurer.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {ctaButton('Je veux être prévenu à l’ouverture')}
          <a
            href="#video"
            className="inline-flex h-12 items-center gap-2 rounded-sm border px-6 text-[15px] font-semibold"
            style={{ borderColor: 'var(--v3-line)', color: 'var(--v3-editorial-ink)' }}
          >
            <Play className="h-4 w-4" /> Voir la visite (5 min)
          </a>
        </div>
        <div className="v3-gold-rule mx-auto mt-8 max-w-md" />
      </header>

      {/* 3 — La vidéo, élément central */}
      <section id="video" className="v3-shell pb-12">
        <div className="relative rounded-md p-2 md:p-3" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-gold)', boxShadow: '0 22px 50px -34px var(--v3-editorial-ink)' }}>
          <div className="rounded-sm px-4 py-4 md:px-7" style={{ border: '1px solid color-mix(in srgb, var(--v3-gold) 50%, transparent)' }}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--v3-line)' }}>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600)' }}>
                <Play className="h-3.5 w-3.5" /> La visite complète de la V3
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--v3-editorial-ink-soft)' }}>
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

      {/* 4 — Le problème */}
      <section className="w-full py-14" style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}>
        <div className="v3-shell">
          <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Votre livre est dans votre tête. Il n’y vaut rien.
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-md p-6" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
              <p className="text-[16px] font-semibold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
                « J’ai le sujet, mais la page reste blanche »
              </p>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                Vous savez de quoi parle votre livre. Vous ne savez pas par quel chapitre commencer,
                ni dans quel ordre. Alors vous remettez à la semaine prochaine.
              </p>
            </div>
            <div className="rounded-md p-6" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
              <p className="text-[16px] font-semibold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
                « Je sais quoi dire, mais je n’ai pas le temps »
              </p>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                Écrire, relire, corriger, faire la couverture, comprendre les marges d’Amazon :
                c’est un second métier. Vous en avez déjà un.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Ancienne méthode vs nouvelle voie */}
      <section className="v3-shell py-14">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-md p-6" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-muted)' }}>
              L’ancienne méthode
            </p>
            <ul className="mt-4 space-y-3">
              {ANCIEN.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                  <X className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#b4423a' }} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md p-6" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-gold)' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600)' }}>
              La nouvelle voie
            </p>
            <ul className="mt-4 space-y-3">
              {NOUVEAU.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-editorial-ink)' }}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-gold-600)' }} /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6 — Comment ça marche */}
      <section className="w-full py-14" style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}>
        <div className="v3-shell">
          <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Comment ça se passe, en quatre temps
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((e) => (
              <div key={e.n} className="rounded-md p-5" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: 'var(--v3-editorial-ink)', color: 'var(--v3-gold)' }}>
                  {e.n}
                </span>
                <p className="mt-3 text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>{e.titre}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Ce que vous voyez dans la vidéo */}
      <section className="v3-shell py-14">
        <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
          Ce que vous voyez dans la vidéo
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.titre} className="rounded-md p-5" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
              <p className="flex items-start gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--v3-gold-600)' }} />
                {p.titre}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{p.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8 — Preuves visuelles */}
      <section className="w-full py-14" style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}>
        <div className="v3-shell">
          <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Des couvertures et des écrans réels
          </h2>
          <p className="mt-2 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
            Rien de simulé : voici des couvertures produites dans le studio et des aperçus des outils.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-2xl">
            {[
              { src: coverRoman, alt: 'Exemple de couverture de roman créée avec EbookStudio' },
              { src: coverGuide, alt: 'Exemple de couverture de guide pratique créée avec EbookStudio' },
              { src: coverNonFiction, alt: 'Exemple de couverture de livre pratique créée avec EbookStudio' },
            ].map((v) => (
              <img key={v.alt} src={v.src} alt={v.alt} loading="lazy" className="w-full rounded-sm object-cover" style={{ aspectRatio: '2 / 3', border: '1px solid var(--v3-line)' }} />
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { src: apercuStudio, alt: 'Aperçu du studio de couvertures EbookStudio' },
              { src: apercuJeunesse, alt: 'Aperçu du studio jeunesse EbookStudio' },
              { src: apercuBd, alt: 'Aperçu du studio bande dessinée EbookStudio' },
            ].map((a) => (
              <img key={a.alt} src={a.src} alt={a.alt} loading="lazy" className="w-full rounded-sm object-cover" style={{ aspectRatio: '16 / 9', border: '1px solid var(--v3-line)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 — Ce que contient la V3 */}
      <section className="v3-shell py-14">
        <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
          Ce que contient la V3
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUS.map((i) => (
            <div key={i.titre} className="rounded-md p-5" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
              <p className="text-[15px] font-semibold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>{i.titre}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{i.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 — Qui est derrière */}
      <section className="w-full py-14" style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}>
        <div className="v3-shell grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
          <img src={heroBooks} alt="Livres publiés sur Amazon KDP" loading="lazy" className="w-full rounded-md object-cover" style={{ aspectRatio: '4 / 3', border: '1px solid var(--v3-line)' }} />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
              Qui est derrière EbookStudio
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
              Georges, auteur auto-édité depuis dix ans, avec un catalogue de thrillers, de romances et
              de livres jeunesse publiés sur Amazon KDP. EbookStudio est né de ses propres blocages :
              un outil pensé par un auteur, pour des auteurs.
            </p>
            <p className="mt-3 text-[14.5px] italic leading-relaxed v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
              « Transformer ses idées en ouvrages professionnels, sans se perdre dans la complexité technique. »
            </p>
          </div>
        </div>
      </section>

      {/* 11 — Inscription, puis l'offre en second */}
      <section id="inscription" className="v3-shell py-14">
        <div className="mx-auto max-w-2xl rounded-md p-7 text-center" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-gold)', boxShadow: '0 22px 50px -34px var(--v3-editorial-ink)' }}>
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
            <div className="mt-6 rounded-sm px-4 py-5" style={{ background: 'var(--v3-emerald-50)', border: '1px solid var(--v3-line)' }}>
              <p className="flex items-center justify-center gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--v3-emerald-600)' }} />
                C’est noté, vous êtes sur la liste.
              </p>
              <p className="mt-1 text-[13.5px]" style={{ color: 'var(--v3-muted)' }}>Vous serez prévenu le 1<sup>er</sup> octobre 2026 à l’ouverture.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="avant-premiere-email" className="sr-only">Votre adresse email</label>
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--v3-muted)' }} />
                <input id="avant-premiere-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" className="h-12 w-full rounded-sm pl-9 pr-3 text-[15px] outline-none" style={{ background: '#fff', border: '1px solid var(--v3-line)', color: 'var(--v3-ink)' }} />
              </div>
              <button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-sm px-6 text-[15px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-70" style={{ background: 'var(--v3-action-orange)', color: 'var(--v3-action-orange-text)' }}>
                {submitting ? 'Enregistrement…' : 'Je veux être prévenu à l’ouverture'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <div className="v3-gold-rule mx-auto mt-8" />
          <p className="mt-6 text-[14px]" style={{ color: 'var(--v3-muted)' }}>
            Vous préférez ne pas attendre : l’accès à vie est à 47 € jusqu’au 30/09/2026.
          </p>
          <Link to="/commander" className="mt-3 inline-flex items-center gap-2 text-[14.5px] font-semibold underline underline-offset-4" style={{ color: 'var(--v3-editorial-ink)' }}>
            <BookOpen className="h-4 w-4" /> Voir l’offre à 47 € <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 12 — FAQ */}
      <section className="w-full py-14" style={{ background: 'var(--v3-cream)', borderTop: '1px solid var(--v3-line)', borderBottom: '1px solid var(--v3-line)' }}>
        <div className="v3-shell">
          <h2 className="text-2xl md:text-3xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
            Les questions qu’on me pose
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-md p-5" style={{ background: 'var(--v3-ivory)', border: '1px solid var(--v3-line)' }}>
                <p className="text-[15px] font-semibold" style={{ color: 'var(--v3-editorial-ink)' }}>{f.q}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{f.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 — Dernier rappel */}
      <section className="v3-shell py-16 text-center">
        <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--v3-gold-600)' }}>
          <Clock className="h-4 w-4" /> Ouverture le 1<sup>er</sup> octobre 2026, à 8 h
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl md:text-4xl font-bold v3-serif" style={{ color: 'var(--v3-editorial-ink)' }}>
          Vous avez vu la maison. Laissez-nous vous ouvrir la porte.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px]" style={{ color: 'var(--v3-muted)' }}>
          Un seul email le jour de l’ouverture. Rien d’autre, jamais.
        </p>
        <div className="mt-7 flex justify-center">{ctaButton('Je veux être prévenu à l’ouverture')}</div>
      </section>

      {/* 14 — Rassurance et pied de page */}
      <footer className="w-full py-10" style={{ background: 'var(--v3-editorial-ink)', borderTop: '1px solid var(--v3-gold)' }}>
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
