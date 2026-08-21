import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import V3ScreenFrame from './V3ScreenFrame';
import shotStudio from '@/assets/v3-showcase/studio.jpg';
import shotSommaire from '@/assets/v3-showcase/sommaire.jpg';
import shotWorkflow from '@/assets/v3-showcase/workflow.jpg';
import shotCover from '@/assets/v3-showcase/cover.jpg';
import shotCorrection from '@/assets/v3-showcase/correction.jpg';
import shotLivres from '@/assets/v3-showcase/livres.jpg';

const STEPS = [
  {
    n: 1,
    title: 'Vous décrivez votre idée',
    text:
      "Une phrase suffit. La V3 propose titre, sous-titre, catégorie, ton et synopsis ; vous corrigez ce que vous voulez. Vous pouvez aussi dialoguer avec le Génie, qui vous pose les bonnes questions une par une.",
    img: shotStudio,
    alt: 'Fiche de départ du livre avec assistant IA et étapes guidées',
    to: '/v3/lancer',
    cta: 'Ouvrir la fiche de départ',
  },
  {
    n: 2,
    title: 'Vous validez le sommaire',
    text:
      "Le plan est proposé chapitre par chapitre. Vous ajoutez, supprimez, réécrivez, choisissez le nombre exact de chapitres. Rien n'est écrit avant que ce plan vous convienne : c'est ce qui évite les doublons et les chapitres inutiles.",
    img: shotSommaire,
    alt: 'Générateur de table des matières éditable',
    to: '/v3/outils/sommaire-ultime',
    cta: 'Voir le générateur de sommaire',
  },
  {
    n: 3,
    title: 'Les 15 agents écrivent',
    text:
      "La rédaction démarre : chaque chapitre est écrit avec la mémoire de l'univers (personnages, lieux, ton), puis humanisé pour supprimer les tournures mécaniques. Vous voyez le livre se remplir en direct, à côté.",
    img: shotWorkflow,
    alt: 'Pipeline des 15 agents avec avancement agent par agent',
    to: '/v3/workflow',
    cta: 'Voir le pipeline P1 → P15',
  },
  {
    n: 4,
    title: 'Vous habillez le livre',
    text:
      "Cover Studio Pro compose la couverture : formats Kindle, broché avec dos et tranche, carré illustré, hardcover avec rabats. Export PDF print-ready avec bleed 3 mm, prêt pour l'impression Amazon.",
    img: shotCover,
    alt: 'Cover Studio Pro : choix des formats Kindle, broché KDP, carré Kids et hardcover',
    to: '/v3/cover-studio-pro',
    cta: 'Ouvrir Cover Studio Pro',
  },
  {
    n: 5,
    title: 'La correction professionnelle',
    text:
      "Le manuscrit passe en correction chapitre par chapitre : réparation des phrases coupées, suppression des mots latins et des tournures artificielles, cohérence et tenue éditoriale. Vous relisez chaque correction avant de l'accepter.",
    img: shotCorrection,
    alt: 'Écran « Corriger mon livre » avec import Word, PDF, article web ou texte collé',
    to: '/v3/corriger',
    cta: 'Ouvrir la correction',
  },
  {
    n: 6,
    title: 'Vous publiez sur Amazon KDP',
    text:
      "Depuis « Mes livres » : export Word, PDF ou EPUB, données KDP (description commerciale, mots-clés, catégories BISAC) et dossier prêt à téléverser. Vous n'avez plus qu'à copier-coller dans KDP.",
    img: shotLivres,
    alt: 'Liste « Mes livres » avec les boutons Corriger, Exporter, Données KDP et Ouvrir le livre',
    to: '/v3/mes-livres',
    cta: 'Voir mes livres et exports',
  },
];

export default function V3HowItWorksSteps() {
  return (
    <section id="v3-etapes" className="scroll-mt-24" style={{ background: 'var(--v3-cream)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="max-w-3xl">
          <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
            Le parcours complet
          </div>
          <h2 className="v3-serif mt-2 text-3xl md:text-4xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
            Comment ça marche, étape par étape
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
            Six étapes, de l’idée au fichier prêt pour Amazon. Chaque étape est un écran réel de l’application,
            que vous pouvez ouvrir dès maintenant.
          </p>
        </div>

        <ol className="mt-10 space-y-10 list-none p-0">
          {STEPS.map((s) => (
            <li key={s.n} className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full text-[15px] font-bold"
                    style={{ background: 'var(--v3-emerald)', color: 'var(--v3-gold)' }}
                  >
                    {s.n}
                  </span>
                  <h3 className="v3-serif text-[22px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                  {s.text}
                </p>
                <Link
                  to={s.to}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: 'var(--v3-gold-600)' }}
                >
                  {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <V3ScreenFrame src={s.img} alt={s.alt} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
