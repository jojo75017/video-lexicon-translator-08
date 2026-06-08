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
    <div className="rounded-2xl border border-[#008296]/20 bg-white p-5 md:p-6 shadow-sm">
      <div className="mb-5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008296] bg-[#008296]/10 px-3 py-1 rounded-full">
          🚀 Parcours débutant
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-[#232F3E] mt-2">
          Publiez votre livre en 6 étapes simples
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez les étapes dans l'ordre, de l'idée jusqu'à la publication sur Amazon. Pas besoin de réfléchir : cliquez et avancez.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ETAPES.map((etape) => {
          const Icon = etape.icon;
          return (
            <button
              key={etape.num}
              type="button"
              onClick={() => handleClick(etape)}
              className="group text-left rounded-xl border border-[#232F3E]/10 bg-[#FAFAFA] hover:bg-white hover:border-[#FF9E2D] hover:shadow-md transition-all p-4 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#008296] text-white font-bold text-sm shrink-0">
                  {etape.num}
                </span>
                <Icon className="w-5 h-5 text-[#008296]" />
              </div>
              <h3 className="font-bold text-[#232F3E] text-sm">{etape.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex-1">{etape.description}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF9E2D] mt-3 group-hover:gap-2.5 transition-all">
                {etape.cta}
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ParcoursDebutant;
