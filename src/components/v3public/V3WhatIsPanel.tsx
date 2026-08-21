import V3ScreenFrame from './V3ScreenFrame';
import shotStudio from '@/assets/v3-showcase/studio.jpg';
import shotSommaire from '@/assets/v3-showcase/sommaire.jpg';
import shotWorkflow from '@/assets/v3-showcase/workflow.jpg';

const BLOCS = [
  {
    tag: 'Le studio complet',
    title: 'Une seule fiche à remplir, tout le reste est proposé',
    text:
      "Vous décrivez votre idée en une phrase. La V3 propose le titre, le sous-titre, la catégorie KDP, le ton, le format, les personnages et le sommaire complet. Vous gardez la main : chaque champ reste modifiable, rien n'est figé.",
    points: [
      'Un seul champ obligatoire : votre idée',
      'Cinq étapes guidées : fiche, style, sommaire, personnages, titre',
      'Chapitres longs de 2 500 à 3 500 mots',
    ],
    img: shotStudio,
    alt: 'Écran « Remplissez votre fiche, les 15 agents écrivent » avec l’assistant IA et les cinq étapes guidées',
    caption: 'Écran réel : la fiche de départ du livre.',
  },
  {
    tag: 'Le sommaire, d’abord',
    title: 'On construit la table des matières avant d’écrire une ligne',
    text:
      "Genre, public, style, nombre de chapitres, niveau de créativité : le sommaire est généré puis éditable ligne par ligne. C'est lui qui garantit un livre cohérent, sans chapitres en double ni remplissage — et il s'injecte directement dans la rédaction.",
    points: [
      'De 10 à 60 chapitres, à votre main',
      'Édition ligne par ligne, historique et épinglés',
      'Injecté tel quel dans le moteur de rédaction',
    ],
    img: shotSommaire,
    alt: 'Générateur ultime de table des matières avec thème, genre, public cible et nombre de chapitres',
    caption: 'Écran réel : le générateur de sommaire.',
  },
  {
    tag: 'Les 15 agents',
    title: 'Votre livre n’est pas écrit par un seul robot',
    text:
      "Quinze agents spécialisés se relaient : cadrage, marché, architecture, rédaction, style, correction, métadonnées KDP, verdict final. Vous suivez l'avancement agent par agent et vous reprenez exactement là où vous vous étiez arrêté.",
    points: [
      'Pipeline visible P1 → P15',
      'Reprise possible à tout moment',
      'Chaque agent a un rôle précis, pas une promesse floue',
    ],
    img: shotWorkflow,
    alt: 'Pipeline éditorial des 15 agents : Zyro l’éditeur, Jano le marché, Kiro l’architecte, Alia le romancier',
    caption: 'Écran réel : le pipeline des 15 agents.',
  },
];

export default function V3WhatIsPanel() {
  return (
    <section id="v3-quoi" className="max-w-7xl mx-auto px-5 md:px-8 py-14 scroll-mt-24">
      <div className="max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
          La V3, sans jargon
        </div>
        <h2 className="v3-serif mt-2 text-3xl md:text-4xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Qu’est-ce que la V3, concrètement ?
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          Ce n’est pas un générateur de texte. C’est une maison d’édition en ligne : elle cadre votre projet,
          construit le plan avec vous, écrit, corrige, habille et prépare le dossier Amazon KDP.
          Voici les écrans que vous utiliserez vraiment.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {BLOCS.map((b, i) => (
          <article
            key={b.tag}
            className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>figure]:order-first' : ''}`}
          >
            <div>
              <span className="v3-chip">{b.tag}</span>
              <h3 className="v3-serif mt-3 text-2xl font-semibold" style={{ color: 'var(--v3-ink)' }}>
                {b.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                {b.text}
              </p>
              <ul className="mt-4 space-y-2">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>
                    <span
                      className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--v3-gold)' }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <V3ScreenFrame src={b.img} alt={b.alt} caption={b.caption} />
          </article>
        ))}
      </div>
    </section>
  );
}
