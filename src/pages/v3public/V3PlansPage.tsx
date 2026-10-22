import { Button } from '@/components/ui/button';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Crown, Feather, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';
import { usePageMeta } from '@/hooks/usePageMeta';
import plansHero from '@/assets/plans/plans-hero.jpg';
import plansFooter from '@/assets/plans/plans-footer.jpg';
import vcRobot from '@/assets/plans/vc-books-robot.png';

type Level = 0 | 1 | 2; // 0 = Starter, 1 = Auteur, 2 = Édition

interface Row { label: string; detail?: string; min: Level; badge?: string }
interface Family { title: string; emoji: string; rows: Row[] }

const FAMILIES: Family[] = [
  {
    title: 'Écrire & créer', emoji: '✍️',
    rows: [
      { label: 'Écrire un livre (rédaction guidée)', min: 0 },
      { label: 'Livres illimités', min: 0 },
      { label: 'Sommaire & chapitres (jusqu’à 40)', min: 0 },
      { label: 'Je raconte un livre', min: 1 },
      { label: 'Guides pratiques (5 spécialités & personas)', min: 1 },
      { label: 'Histoires courtes & micro-séries', min: 1 },
      { label: 'VC Books — livres humoristiques', detail: 'Avec son robot dédié', min: 1, badge: 'Bientôt' },
      { label: 'Correction éditoriale', min: 1 },
      { label: 'HumanizeAI (texte naturel)', min: 1 },
      { label: 'Avatars lecteurs', min: 1 },
    ],
  },
  {
    title: 'Couvertures', emoji: '🎨',
    rows: [
      { label: 'Couverture ebook simple 2D', detail: 'Face avant : titre, auteur, visuel', min: 0 },
      { label: 'Studio Couverture Broché KDP', detail: 'Tranche calculée, 4e de couverture, PDF 300 DPI', min: 2 },
    ],
  },
  {
    title: 'Publier sur Amazon', emoji: '🚀',
    rows: [
      { label: 'Exports PDF, Word (DOCX) & EPUB', min: 0 },
      { label: 'Ebookstudio KDP — fiche de base', detail: 'Titre, sous-titre, description, mots-clés, catégories', min: 0 },
      { label: 'Guide KDP pas à pas', min: 0 },
      { label: 'Fiches KDP enrichies', min: 1 },
      { label: 'Recherche de niches avancée', min: 1 },
      { label: 'Traducteur 10 langues', min: 0 },
      { label: 'KDP étranger (publication multi-pays)', min: 1 },
      { label: 'Amazon Spy & audit de marché', min: 2 },
    ],
  },
  {
    title: 'Studios & formats spéciaux', emoji: '🎬',
    rows: [
      { label: 'BD Studio', min: 1 },
      { label: 'Studio Album illustré jeunesse', min: 2 },
      { label: 'Audiolivres & voix off', min: 2 },
    ],
  },
  {
    title: 'Marketing & outils d’éditeur', emoji: '📣',
    rows: [
      { label: 'Outils de lancement', min: 1 },
      { label: 'Brand Book & présentation pro', min: 2 },
    ],
  },
  {
    title: 'Bonus & accompagnement', emoji: '🎁',
    rows: [
      { label: '5 niches Amazon offertes', min: 0 },
      { label: 'Tutoriels vidéo', min: 0 },
      { label: 'Bibliothèque « Mes livres »', min: 0 },
    ],
  },
];

const PLANS = [
  {
    name: 'Starter', price: '27 €', period: 'à vie', Icon: Rocket,
    color: '#008296', soft: 'rgba(0,130,150,0.10)',
    tagline: 'Créez et publiez votre premier ebook, sans abonnement.',
    cta: { label: 'Acheter Starter', to: '/paiement-offre?plan=starter27_1x' },
  },
  {
    name: 'Auteur', price: '97 €', period: 'paiement unique', Icon: Feather,
    color: '#0b6e4c', soft: 'rgba(11,110,76,0.10)', popular: true,
    tagline: 'Tous les genres de livres, la BD, la correction et les outils d’auteur.',
    cta: { label: 'Choisir Auteur', to: '/paiement-offre?plan=auteur97_1x' },
  },
  {
    name: 'Édition', price: '197 €', period: 'à vie', Icon: Crown,
    color: '#b8860b', soft: 'rgba(184,134,11,0.12)',
    tagline: 'Publiez comme un éditeur : broché KDP, albums illustrés, audio.',
    cta: { label: 'Choisir Édition', to: '/paiement-offre?plan=edition247_1x' },
  },
];

function Cell({ row, level }: { row: Row; level: Level }) {
  const ok = level >= row.min;
  return (
    <td className="px-3 py-3 text-center align-middle" style={{ borderTop: '1px solid var(--v3-line, #e5e0d0)' }}>
      {ok
        ? <Check className="mx-auto h-5 w-5" style={{ color: '#0b6e4c' }} aria-label="Inclus" />
        : <Lock className="mx-auto h-4 w-4" style={{ color: '#b08968' }} aria-label="Réservé à une offre supérieure" />}
    </td>
  );
}

export default function V3PlansPage() {
  usePageMeta({
    title: 'Comparer les 3 plans EbookStudio — Starter 27 €, Auteur 97 €, Édition 197 €',
    description: 'Grille complète des onglets et outils inclus dans chaque plan EbookStudio : Starter, Auteur et Édition. Livres illimités dès 27 € à vie.',
  });

  return (
    <main className="min-h-screen" style={{ background: '#FAFAFA', color: '#232F3E' }}>
      {/* ── Bannière ── */}
      <header className="relative overflow-hidden">
        <img src={plansHero} alt="Un bureau d’auteur avec un livre en cours de création" width={1600} height={704}
          className="h-64 w-full object-cover sm:h-80" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(35,47,62,0.35), rgba(35,47,62,0.65))' }}>
          <div className="px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF9E2D' }}>Un seul paiement, pas d’abonnement</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-5xl">Les 3 plans EbookStudio</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Starter pour créer et publier votre premier ebook, Auteur pour écrire tous les genres, Édition pour publier comme un professionnel.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <BackButton className="mb-6" />

        {/* ── Les 3 cartes ── */}
        <section aria-label="Les trois offres" className="grid gap-6 md:grid-cols-3">
          {PLANS.map(p => (
            <article key={p.name} className="relative flex flex-col rounded-2xl bg-white p-6 shadow-sm"
              style={{ border: p.popular ? `2px solid ${p.color}` : '1px solid #e5e0d0' }}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ background: p.color }}>Le plus choisi</span>
              )}
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: p.soft }}>
                  <p.Icon className="h-6 w-6" style={{ color: p.color }} />
                </span>
                <h2 className="text-xl font-bold">EbookStudio {p.name}</h2>
              </div>
              <p className="mt-4 text-4xl font-extrabold" style={{ color: p.color }}>{p.price}
                <span className="ml-2 text-sm font-medium text-neutral-500">{p.period}</span>
              </p>
              <p className="mt-2 flex-1 text-sm text-neutral-600">{p.tagline}</p>
              <Button asChild className="mt-5"><Link to={p.cta.to}>
                {p.cta.label} <ArrowRight className="h-4 w-4" />
              </Link></Button>
              {p.name !== 'Starter' && <p className="mt-2 text-center text-xs text-muted-foreground">Comptant, en 2 ou 3 fois — sans frais</p>}
            </article>
          ))}
        </section>

        {/* ── Encart VC Books ── */}
        <section aria-label="VC Books" className="mt-12 overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: '1px solid #e5e0d0' }}>
          <div className="grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <img src={vcRobot} alt="Le robot VC Books, assis en train de lire un livre" width={816} height={816}
              loading="lazy" className="mx-auto h-40 w-40 object-contain sm:h-48 sm:w-48" />
            <div>
              <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: 'rgba(0,130,150,0.10)', color: '#008296' }}>
                <Sparkles className="h-3.5 w-3.5" /> Nouveau — bientôt disponible
              </p>
              <h2 className="mt-3 text-2xl font-bold">VC Books : les livres qui se lisent… aux petits coins</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Une collection de livres humoristiques à feuilleter confortablement installé, créée avec son propre robot spécial WC.
                Anecdotes, quiz, histoires courtes et jeux : le cadeau insolite parfait. Inclus dans les plans <strong>Auteur</strong> et <strong>Édition</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ── Tableau comparatif ── */}
        <section aria-label="Comparaison détaillée" className="mt-12">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Tout ce que contient chaque plan</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-neutral-600">
            Chaque plan inclut tout ce qui est dans les plans précédents. Un cadenas 🔒 signifie que l’outil s’ouvre avec le plan supérieur.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm" style={{ border: '1px solid #e5e0d0' }}>
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr style={{ background: '#232F3E' }}>
                  <th className="px-4 py-4 text-left text-white">Onglets & outils</th>
                  {PLANS.map(p => (
                    <th key={p.name} className="px-3 py-4 text-center text-white" style={{ width: 110 }}>
                      <span className="block text-base font-bold" style={{ color: '#ffffff' }}>{p.name}</span>
                      <span className="block text-xs font-medium" style={{ color: '#FF9E2D' }}>{p.price} {p.period}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map(f => (
                  <Fragment key={f.title}>
                    <tr style={{ background: 'var(--v3-cream, #f6f1e7)' }}>
                      <td colSpan={4} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#008296' }}>
                        {f.emoji} {f.title}
                      </td>
                    </tr>
                    {f.rows.map(r => (
                      <tr key={r.label}>
                        <td className="px-4 py-3" style={{ borderTop: '1px solid var(--v3-line, #e5e0d0)' }}>
                          <span className="font-medium">{r.label}</span>
                          {r.badge && <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: '#FF9E2D' }}>{r.badge}</span>}
                          {r.detail && <span className="block text-xs text-neutral-500">{r.detail}</span>}
                        </td>
                        <Cell row={r} level={0} />
                        <Cell row={r} level={1} />
                        <Cell row={r} level={2} />
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Image + réassurance ── */}
        <section aria-label="Pourquoi EbookStudio" className="mt-12 overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: '1px solid #e5e0d0' }}>
          <img src={plansFooter} alt="Une bibliothèque de livres publiés et un trophée" width={1600} height={608}
            loading="lazy" className="h-48 w-full object-cover sm:h-64" />
          <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
            {[
              { t: 'Paiement unique', d: 'Aucun abonnement caché : vous payez une fois et vous gardez votre accès.' },
              { t: 'Droits conservés', d: 'Déjà client ? Vos achats et avantages acquis ne changent jamais.' },
              { t: 'Évolution libre', d: 'Commencez avec Starter, passez à Auteur ou Édition quand vous voulez.' },
            ].map(b => (
              <div key={b.t}>
                <h3 className="font-bold" style={{ color: '#008296' }}>{b.t}</h3>
                <p className="mt-1 text-sm text-neutral-600">{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Une question sur les offres ? <Link to="/v3/forfaits" className="font-semibold underline" style={{ color: '#008296' }}>Voir la page des forfaits</Link>
          {' '}ou <Link to="/starter" className="font-semibold underline" style={{ color: '#008296' }}>découvrir Starter à 27 €</Link>.
        </p>
      </div>
    </main>
  );
}
