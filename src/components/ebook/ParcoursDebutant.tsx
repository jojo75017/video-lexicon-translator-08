import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bot, Download, Tag, Image as ImageIcon, Rocket, ArrowRight, ChevronDown } from 'lucide-react';
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (etape: Etape) => {
    if (etape.action === 'tab') onNavigateToTab(etape.target);
    else if (etape.action === 'route') navigate(etape.target);
    else window.open(etape.target, '_blank', 'noopener,noreferrer');
  };

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative overflow-hidden rounded-xl border-2 border-primary bg-gradient-hero p-5 md:p-7 shadow-xl ring-4 ring-primary/15">
      <div className="mb-6 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black uppercase text-primary-foreground shadow-md">
          🚀 Votre parcours — le chemin simple en 6 clics
        </span>
        <h2 className="mt-4 text-3xl font-black leading-tight text-foreground md:text-4xl">
          Publier mon livre sur Amazon KDP
        </h2>
        <p className="mt-2 text-base font-semibold text-foreground/80 md:text-lg">
          Faites les étapes dans l'ordre : niche → workflow → export → mots-clés → couverture → publication.
        </p>
      </div>

      <div className="space-y-3">
        {ETAPES.map((etape, i) => {
          const Icon = etape.icon;
          const isOpen = openIndex === i;
          return (
            <div
              key={etape.num}
              className="rounded-xl border-2 border-border bg-card shadow-md overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent/30 transition-colors"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground shadow-md">
                  {etape.num}
                </span>
                <Icon className="h-6 w-6 text-primary shrink-0" />
                <span className="flex-1 text-lg font-black text-card-foreground">
                  {etape.title}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-border bg-card/50">
                  <div className="pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground sm:max-w-xl">
                      {etape.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleClick(etape)}
                      className="inline-flex items-center gap-2 self-start sm:self-center rounded-lg bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-md hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                    >
                      {etape.cta}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ParcoursDebutant;
