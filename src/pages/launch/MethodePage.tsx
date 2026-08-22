import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Check,
  Clock,
  PenLine,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { FicheCountdown } from '@/components/launch/FicheShell';
import { trackCaptureEvent } from '@/lib/captureTracking';
import MethodeProbleme from '@/components/launch/methode/MethodeProbleme';
import MethodeAvantApres from '@/components/launch/methode/MethodeAvantApres';
import MethodeValeur from '@/components/launch/methode/MethodeValeur';
import MethodeFaq, { faqJsonLd } from '@/components/launch/methode/MethodeFaq';
import mockup from '@/assets/methode-hero-mockup.jpg';

const ETAPES = [
  {
    icon: BookOpen,
    title: 'Plan',
    text: "Vous donnez votre idée. Le sommaire se construit avec vous, chapitre par chapitre. Vous validez avant qu'une seule ligne ne soit écrite.",
  },
  {
    icon: PenLine,
    title: 'Écrire',
    text: 'Les chapitres sont rédigés dans votre style, puis relus quatre fois : dictée réparée, orthographe, style, fins de chapitre.',
  },
  {
    icon: Palette,
    title: 'Habiller',
    text: 'Couverture avant, dos et quatrième de couverture au format KDP exact, calculé selon le nombre de pages de votre livre.',
  },
  {
    icon: Rocket,
    title: 'Publier',
    text: 'Manuscrit, couverture, description, 7 mots-clés et catégories : vous remplissez le formulaire Amazon et vous publiez.',
  },
];

const PROMESSES = [
  'Un manuscrit complet, corrigé et mis en page',
  'Une couverture prête à téléverser sur KDP',
  'La fiche Amazon avec titre, description et mots-clés',
  'Une version audio naturelle de votre livre',
  'Des traductions dans 10 langues',
  'Un accès à vie, sans abonnement',
];

const NON_PROMESSES = [
  "Ce n'est pas une formation de 600 pages",
  "Ce n'est pas un logiciel à apprendre pendant des semaines",
  "Ce ne sont pas des promesses de revenus garantis",
];

function MethodeCta({ label, className = '' }: { label: string; className?: string }) {
  const [params] = useSearchParams();
  const qs = new URLSearchParams();
  qs.set('src', params.get('src') || 'methode');
  const email = params.get('email');
  if (email) qs.set('email', email);
  const suffix = qs.toString();

  return (
    <Link
      to={`/commander?${suffix}`}
      onClick={() => trackCaptureEvent('methode', 'click')}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition hover:brightness-110 ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--ds-orange) 0%, var(--ds-orange-deep) 100%)',
      }}
    >
      <Rocket className="h-5 w-5" />
      {label}
    </Link>
  );
}

/** Page de vente long format « système KDP multimodèle » : un seul bouton,
 *  un seul prix, un ton honnête. Pas de pop-up, pas de porte de lecture. */
export default function MethodePage() {
  useEffect(() => {
    document.title = 'Publiez votre livre sur Amazon en quelques soirées | EbookStudio';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        "Le système EbookStudio combine 15 agents d'IA, un sommaire interactif, une correction professionnelle et une couverture KDP. Accès à vie 47 €.",
      );
    }
    trackCaptureEvent('methode', 'view').catch(() => {});
  }, []);

  return (
    <div className="dark-sales min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Header minimal */}
      <header className="border-b border-[var(--ds-border)] bg-[var(--ds-bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="text-lg font-bold tracking-tight text-[var(--ds-text)]">EbookStudio</span>
          <FicheCountdown dark />
        </div>
      </header>

      {/* 1 — Hero */}
      <section className="ds-section mx-auto max-w-5xl px-5 pt-10 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
          style={{ background: 'var(--ds-orange-soft)', color: 'var(--ds-orange)' }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Système de publication KDP multimodèle
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
          Publiez votre livre sur Amazon en quelques soirées,{' '}
          <span style={{ color: 'var(--ds-gold)' }}>même si vous ne savez pas écrire.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ds-text-muted)]">
          Un atelier unique qui combine 15 agents d'IA, un sommaire interactif, une correction
          professionnelle et une couverture prête pour KDP.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MethodeCta label="Obtenir l'accès complet à 47 €" />
          <p className="text-sm text-[var(--ds-text-muted)]">
            <ShieldCheck className="mr-1 inline h-4 w-4 text-[var(--ds-success)]" />
            30 jours satisfait ou remboursé
          </p>
        </div>

        <p className="mt-3 text-xs text-[var(--ds-text-muted)]">
          Paiement unique · pas d'abonnement · accès conservé · V3 incluse
        </p>

        <div className="mx-auto mt-12 max-w-md">
          <img
            src={mockup}
            alt="Mockup d'un livre premium créé avec EbookStudio"
            width={1024}
            height={1024}
            className="ds-glow w-full rounded-2xl"
            loading="eager"
          />
        </div>
      </section>

      {/* 2 — Le problème */}
      <MethodeProbleme />

      {/* 3 — Ancienne méthode vs nouvelle voie */}
      <MethodeAvantApres />

      {/* 4 — Les 4 étapes */}
      <section className="ds-section mx-auto max-w-5xl px-5">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-[var(--ds-gold)]">
          Le processus
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold md:text-3xl">
          De votre idée à votre livre en 4 étapes
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ETAPES.map((e, i) => (
            <div key={e.title} className="ds-card p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: 'var(--ds-orange-soft)', color: 'var(--ds-orange)' }}
                >
                  {i + 1}
                </span>
                <e.icon className="h-5 w-5" style={{ color: 'var(--ds-gold)' }} />
                <h3 className="text-lg font-bold">{e.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — Promesses honnêtes */}
      <section className="ds-section mx-auto max-w-4xl px-5">
        <div className="ds-card p-6 md:p-10">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Ce que le système fait — et ce qu'il ne fait pas
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--ds-success)]">
                Ce que vous recevez
              </p>
              <ul className="space-y-3">
                {PROMESSES.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-success)]" />
                    <span className="text-[var(--ds-text)]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                Ce que nous ne promettons pas
              </p>
              <ul className="space-y-3">
                {NON_PROMESSES.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-[var(--ds-text-muted)]">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Ce que tu reçois / valeur */}
      <MethodeValeur />

      {/* 7 — Garantie */}
      <section className="ds-section mx-auto max-w-4xl px-5">
        <div className="ds-card flex gap-4 p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(34,197,94,0.12)' }}
          >
            <ShieldCheck className="h-6 w-6 text-[var(--ds-success)]" />
          </span>
          <p className="text-sm leading-relaxed text-[var(--ds-text-muted)]">
            <strong className="text-[var(--ds-text)]">30 jours satisfait ou remboursé.</strong>{' '}
            Si l'atelier ne correspond pas à ce que vous attendiez, un simple email suffit : remboursement
            intégral, sans justification. À 47 €, la vraie question n'est pas le risque financier. C'est :{' '}
            <span className="text-[var(--ds-text)]">est-ce que vous voulez enfin voir votre livre en ligne ?</span>
          </p>
        </div>
      </section>

      {/* 8 — FAQ */}
      <MethodeFaq />

      {/* 9 — Rappel final */}
      <section className="ds-section border-t border-[var(--ds-border)] bg-[var(--ds-bg-soft)]">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Votre livre est déjà dans votre tête.</h2>
          <p className="mt-4 text-[var(--ds-text-muted)]">
            Dans quelques soirées, il peut être en ligne. Ou rester une idée de plus.
          </p>
          <div className="mt-6 flex flex-wrap items-baseline justify-center gap-3">
            <span className="text-4xl font-black" style={{ color: 'var(--ds-gold)' }}>
              47 €
            </span>
            <span className="text-lg line-through text-[var(--ds-text-muted)]">59 €</span>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ background: 'var(--ds-orange-soft)', color: 'var(--ds-orange)' }}
            >
              -20 %
            </span>
          </div>
          <div className="mt-6 flex justify-center">
            <FicheCountdown dark />
          </div>
          <div className="mt-6 flex justify-center">
            <MethodeCta label="Je prends l'accès à vie à 47 €" />
          </div>
          <p className="mt-4 text-xs text-[var(--ds-text-muted)]">
            <Clock className="mr-1 inline h-3.5 w-3.5" />
            Après le 31 août, l'accès à vie ne sera plus disponible qu'en abonnement mensuel.
          </p>
        </div>
      </section>
    </div>
  );
}
