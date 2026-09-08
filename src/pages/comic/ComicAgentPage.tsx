import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Palette, UserCheck, Brush, Puzzle, Megaphone, Languages,
  Check, Clock, Gift, ShieldCheck, ChevronDown, Play, Sparkles, ArrowRight,
} from 'lucide-react';
import SeoHead from '@/components/funnel/SeoHead';
import { COMIC_AGENT, COMIC_BONUS_TOTAL } from '@/data/comicAgentOffer';
import comicAgentVideo from '@/assets/comic-agent-video.mp4.asset.json';
import heroAlbum from '@/assets/comic/hero-album.jpg';
import album2 from '@/assets/comic/album-2.jpg';
import album3 from '@/assets/comic/album-3.jpg';
import bd1 from '@/assets/comic/bd-1.jpg';
import bd2 from '@/assets/comic/bd-2.jpg';
import bd3 from '@/assets/comic/bd-3.jpg';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Palette, UserCheck, Brush, Puzzle, Megaphone, Languages,
};

const GALLERY = [
  { src: heroAlbum, alt: 'Illustration jeunesse aquarelle : enfant lisant avec un renard et un lapin' },
  { src: bd1, alt: 'Planche BD franco-belge : aventurier en écharpe rouge dans la jungle' },
  { src: album2, alt: 'Illustration jeunesse aquarelle : chevalier enfant et dragon' },
  { src: bd2, alt: 'Planche BD franco-belge : héroïne sur une colline avec moulin' },
  { src: album3, alt: 'Illustration jeunesse aquarelle : petit astronaute et robot' },
  { src: bd3, alt: 'Planche BD franco-belge : détective enfant et son chien' },
];

/** Petit compte à rebours jusqu'à la fin de l'exclusivité de lancement. */
function useCountdown(endISO: string) {
  const target = useMemo(() => new Date(endISO).getTime(), [endISO]);
  const compute = () => {
    const diff = target - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  };
  const [t, setT] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return t;
}

const pad = (n: number) => String(n).padStart(2, '0');

function Countdown({ endISO }: { endISO: string }) {
  const t = useCountdown(endISO);
  if (!t) {
    return (
      <p className="text-sm font-semibold text-amber-700">
        L’offre de lancement est terminée — le tarif habituel s’applique.
      </p>
    );
  }
  const box = (value: number, label: string) => (
    <span className="inline-flex min-w-[64px] flex-col items-center rounded-lg border border-primary-foreground/30 bg-primary-foreground px-3 py-2 text-primary shadow-sm">
      <span className="text-2xl font-black leading-none tabular-nums">{pad(value)}</span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>
    </span>
  );
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center justify-center gap-2">
        {box(t.days, 'jours')}
        <span className="font-black text-primary-foreground/60">:</span>
        {box(t.hours, 'heures')}
        <span className="font-black text-primary-foreground/60">:</span>
        {box(t.minutes, 'min')}
        <span className="font-black text-primary-foreground/60">:</span>
        {box(t.seconds, 'sec')}
      </div>
      <span className="text-[11px] font-semibold text-primary-foreground/90">
        Fin de l’offre : 31 décembre 2026
      </span>
    </div>
  );
}

/** Bouton d'achat extérieur — ouverture dans un nouvel onglet. */
function BuyButton({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <a
      href={COMIC_AGENT.funnelUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 ${
        compact ? 'py-3 text-sm' : 'py-4 text-base'
      }`}
    >
      <ArrowRight className="h-4 w-4" /> {label}
    </a>
  );
}

export default function ComicAgentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead
        title="Ebook Comic Agent — créez et vendez des BD avec l’IA (47 €)"
        description="Suite IA complète pour créer bandes dessinées et livres illustrés enfants sans savoir dessiner : 7 modules + 891 € de bonus. 47 € au lieu de 97 € jusqu’au 31 décembre 2026."
        canonical="/comic-agent"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Ebook Comic Agent',
          description: 'Suite IA complète pour créer et vendre des bandes dessinées et livres illustrés enfants sans savoir dessiner.',
          brand: { '@type': 'Brand', name: 'Ebook Comic Agent' },
          offers: {
            '@type': 'Offer',
            price: String(COMIC_AGENT.price),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: COMIC_AGENT.funnelUrl,
          },
        }}
      />

      {/* Bandeau exclusivité + compte à rebours */}
      <div className="w-full bg-primary px-4 py-3 text-center text-primary-foreground">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">
            <Sparkles className="mr-1 inline h-4 w-4" /> En exclusivité — lancement · jusqu’au {COMIC_AGENT.endLabel}
          </span>
          <Countdown endISO={COMIC_AGENT.endISO} />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* HERO */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Play className="h-3.5 w-3.5" /> Offre partenaire — Ebook Comic Agent
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
            {COMIC_AGENT.headline.split('—')[0]}
            <span className="block text-primary">{COMIC_AGENT.headline.split('—')[1]}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">{COMIC_AGENT.tagline}</p>

          <div className="mx-auto mt-8 max-w-2xl">
            <BuyButton label={`Profiter de l’offre 47 €`} />
            <p className="mt-2 text-xs text-muted-foreground">Paiement unique · accès à vie · {COMIC_AGENT.publisherLabel}</p>
          </div>
        </section>

        {/* VIDÉO */}
        <section className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted">
            <video
              className="aspect-video w-full"
              src={comicAgentVideo.url}
              controls
              playsInline
              preload="metadata"
              poster={heroAlbum}
              aria-label="Présentation d’Ebook Comic Agent"
            />
          </div>
        </section>

        {/* LE PROBLÈME / LA SOLUTION */}
        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold">Le problème</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Créer un livre illustré pour enfants prend des mois : écrire l’histoire, dessiner chaque
              page, coloriser, créer la couverture, puis savoir publier sur Amazon ou Etsy — sans parler
              de la traduction pour vendre à l’international. Et sans savoir dessiner, c’était mort.
            </p>
          </article>
          <article className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
            <h2 className="text-xl font-bold text-primary">La solution</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Ebook Comic Agent, une suite IA qui fait tout à votre place : de la première idée de
              scénario jusqu’à la mise en vente sur Amazon KDP et Etsy. L’IA génère les illustrations,
              les dialogues et les couvertures. Et vous gardez 100 % des droits, licence commerciale incluse,
              zéro redevance.
            </p>
          </article>
        </section>

        {/* GALERIE D'EXEMPLES */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Exemples de rendus</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Albums jeunesse (3-7 ans) et planches BD franco-belges générés par l’IA.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GALLERY.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="aspect-square w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </section>

        {/* MODULES */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Les 7 modules</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMIC_AGENT.modules.map((m) => {
              const Icon = ICONS[m.icon] ?? Sparkles;
              return (
                <article key={m.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* BONUS */}
        <section className="mt-8 rounded-2xl border border-border bg-muted p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Gift className="h-6 w-6 text-primary" /> Bonus de lancement inclus
          </h2>
          <ul className="mt-4 space-y-3">
            {COMIC_AGENT.bonuses.map((b) => (
              <li key={b.title} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong>{b.title}</strong> — {b.desc}{' '}
                  <span className="font-semibold text-primary">({b.value} €)</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold">
            Total : {COMIC_BONUS_TOTAL} € de bonus, inclus gratuitement.
          </p>
        </section>

        {/* POUR QUI ? */}
        <section className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold">Pour qui ?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {COMIC_AGENT.audience.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Déjà adopté par {COMIC_AGENT.claimCreators}.
          </p>
        </section>

        {/* OFFRE / PRIX */}
        <section id="commander" className="mt-14 rounded-2xl border-2 border-primary bg-card p-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <Clock className="h-3.5 w-3.5" /> Offre de lancement
          </span>
          <div className="mt-4 flex items-end justify-center gap-3">
            <span className="text-6xl font-black text-primary">{COMIC_AGENT.price} €</span>
            <span className="pb-2 text-lg text-muted-foreground line-through">{COMIC_AGENT.regularPrice} €</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Paiement unique · accès à vie · garantie {COMIC_AGENT.guaranteeDays} jours
          </p>
          <div className="mt-6 flex justify-center">
            <BuyButton label={`Obtenir l’accès à 47 €`} />
          </div>
          <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-xl border border-border bg-muted p-4 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <span>
              Garantie satisfait ou remboursé {COMIC_AGENT.guaranteeDays} jours — {COMIC_AGENT.publisherLabel}.
            </span>
          </div>
        </section>

        {/* RAPPEL AVANT FAQ */}
        <section className="mt-10 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
          <h2 className="text-xl font-bold">Licence commerciale 100 % des droits</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous publiez et vendez librement les livres créés. Aucune redevance, aucune limite de tirage.
          </p>
          <div className="mt-5 flex justify-center">
            <BuyButton label={`Je crée ma BD à 47 €`} compact />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {COMIC_AGENT.faq.map((item, i) => (
              <div key={item.q} className="bg-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* BAS DE PAGE */}
        <section className="mt-14 text-center">
          <p className="text-xs text-muted-foreground">
            {COMIC_AGENT.publisherLabel}. Cette page présente une offre partenaire indépendante des
            abonnements et produits EbookStudio.
          </p>
          <Link to="/v3" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            ← Retour à EbookStudio
          </Link>
        </section>
      </main>
    </div>
  );
}
