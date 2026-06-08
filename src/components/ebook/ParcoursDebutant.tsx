import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bot, Download, Tag, Image as ImageIcon, Rocket, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ParcoursDebutantProps {
  onNavigateToTab: (tabId: string) => void;
}

interface Etape {
  num: number;
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  action: 'tab' | 'route' | 'external';
  target: string;
}

const ETAPES: Etape[] = [
  {
    num: 1,
    title: 'Trouver ma niche / mon titre',
    description: "Espionnez Amazon avec KDSpy pour trouver une idée qui se vend et un bon titre de livre.",
    cta: 'Ouvrir KDSpy',
    icon: Search,
    action: 'route',
    target: '/kdp-keywords?tab=spy',
  },
  {
    num: 2,
    title: 'Lancer le Workflow IA',
    description: "Les 15 agents IA rédigent automatiquement tout votre livre à partir de votre titre.",
    cta: 'Lancer le Workflow',
    icon: Bot,
    action: 'tab',
    target: 'complete-workflow',
  },
  {
    num: 3,
    title: 'Exporter pour KDP',
    description: "Téléchargez votre manuscrit au bon format (PDF / EPUB) prêt pour Amazon.",
    cta: "Exporter mon livre",
    icon: Download,
    action: 'tab',
    target: 'export',
  },
  {
    num: 4,
    title: 'Description & 7 mots-clés',
    description: "Générez la description Amazon et les 7 mots-clés qui feront remonter votre livre.",
    cta: 'Créer ma fiche KDP',
    icon: Tag,
    action: 'tab',
    target: 'kdp',
  },
  {
    num: 5,
    title: 'Créer ma couverture',
    description: "Générez une couverture professionnelle avec l'IA (1re + dos + 4e de couverture).",
    cta: 'Créer ma couverture',
    icon: ImageIcon,
    action: 'tab',
    target: 'images-cover',
  },
  {
    num: 6,
    title: 'Publier sur Amazon KDP',
    description: "Uploadez votre livre et votre couverture sur Amazon KDP. Bravo, vous êtes publié !",
    cta: 'Aller sur Amazon KDP',
    icon: Rocket,
    action: 'external',
    target: 'https://kdp.amazon.com/fr_FR/',
  },
];

export const ParcoursDebutant: React.FC<ParcoursDebutantProps> = ({ onNavigateToTab }) => {
  const navigate = useNavigate();

  const handleClick = (etape: Etape) => {
    if (etape.action === 'tab') onNavigateToTab(etape.target);
    else if (etape.action === 'route') navigate(etape.target);
    else window.open(etape.target, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-primary bg-gradient-hero p-5 md:p-7 shadow-xl ring-4 ring-primary/15">
      <div className="absolute right-4 top-4 hidden rounded-full bg-primary px-4 py-2 text-sm font-black uppercase text-primary-foreground shadow-lg md:block">
        Commencez ici
      </div>

      <div className="mb-6 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black uppercase text-primary-foreground shadow-md">
          🚀 Parcours débutant — pour ne pas se perdre
        </span>
        <h2 className="mt-4 text-3xl font-black leading-tight text-foreground md:text-4xl">
          Publier mon livre sur Amazon KDP : le chemin simple en 6 clics
        </h2>
        <p className="mt-2 text-base font-semibold text-foreground/80 md:text-lg">
          Faites les étapes dans l'ordre : niche → workflow → export → mots-clés → couverture → publication.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ETAPES.map((etape) => {
          const Icon = etape.icon;
          return (
            <button
              key={etape.num}
              type="button"
              onClick={() => handleClick(etape)}
              className="group flex h-full min-h-[168px] flex-col rounded-xl border-2 border-border bg-card p-5 text-left shadow-md transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground shadow-md">
                  {etape.num}
                </span>
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-black leading-snug text-card-foreground">{etape.title}</h3>
              <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-muted-foreground">{etape.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-base font-black text-primary transition-all group-hover:gap-3">
                {etape.cta}
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ParcoursDebutant;
