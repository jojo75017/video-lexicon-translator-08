import React from 'react';
import EbookAtlas from '@/components/ebook/EbookAtlas';
import EbookEncyclopedia from '@/components/ebook/EbookEncyclopedia';
import EbookDocumentaryGenerator from '@/components/ebook/EbookDocumentaryGenerator';
import { EbookColoringBookGenerator } from '@/components/ebook/EbookColoringBookGenerator';
import EbookAgendaGenerator from '@/components/ebook/EbookAgendaGenerator';
import EbookScolaireGenerator from '@/components/ebook/EbookScolaireGenerator';
import EbookPedagogiqueGenerator from '@/components/ebook/EbookPedagogiqueGenerator';
import EbookRecipeBookGenerator from '@/components/ebook/EbookRecipeBookGenerator';
import EbookTravelGuideGenerator from '@/components/ebook/EbookTravelGuideGenerator';
import { EbookComicBookGenerator } from '@/components/ebook/EbookComicBookGenerator';
import EbookDiaryGenerator from '@/components/ebook/EbookDiaryGenerator';
import EbookAquariumGenerator from '@/components/ebook/EbookAquariumGenerator';
import EbookBirdSheetGenerator from '@/components/ebook/EbookBirdSheetGenerator';
import { EbookMultiTomeHub } from '@/components/ebook/EbookMultiTomeHub';
import EbookUniverseVolumesGenerator from '@/components/ebook/EbookUniverseVolumesGenerator';
import ProBookShell from '@/components/ebook/pro/ProBookShell';

const CONFIG_KEY = 'edition_book_config_v1';

/** Lit le titre du livre en cours depuis la fiche du workflow d'édition. */
function useCurrentBookTitle(): string {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return '';
    const cfg = JSON.parse(raw);
    return typeof cfg?.title === 'string' ? cfg.title : '';
  } catch {
    return '';
  }
}

/**
 * Modules « Livres spéciaux » — réintègrent les onglets de types de livres de la V2
 * (Atlas, Encyclopédie, Documentaire, Coloriage, Agenda, Scolaire, Pédagogique,
 * Cuisine, Voyage, BD, Journal, Aquariophilie, Fiches oiseaux, Multi-tomes)
 * à l'intérieur des parcours V3 et V4, pour offrir plus de choix de livres.
 */

export const SpecialAtlas: React.FC = () => (
  <ProBookShell module="atlas"><EbookAtlas /></ProBookShell>
);
export const SpecialEncyclopedia: React.FC = () => (
  <ProBookShell module="encyclopedia"><EbookEncyclopedia /></ProBookShell>
);

export const SpecialDocumentary: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="documentary">
      <EbookDocumentaryGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialColoringBook: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="coloring">
      <EbookColoringBookGenerator ebookTitle={t || 'Mon livre de coloriage'} />
    </ProBookShell>
  );
};
export const SpecialAgenda: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="agenda">
      <EbookAgendaGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialScolaire: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="scolaire">
      <EbookScolaireGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialPedagogique: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="pedagogique">
      <EbookPedagogiqueGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialRecipeBook: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="recipe">
      <EbookRecipeBookGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialTravelGuide: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="travel">
      <EbookTravelGuideGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialComicBook: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="comic">
      <EbookComicBookGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialDiary: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="diary">
      <EbookDiaryGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialAquarium: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="aquarium">
      <EbookAquariumGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialBirdSheet: React.FC = () => {
  const t = useCurrentBookTitle();
  return (
    <ProBookShell module="bird">
      <EbookBirdSheetGenerator ebookTitle={t} />
    </ProBookShell>
  );
};
export const SpecialMultiTome: React.FC = () => (
  <ProBookShell module="multitome"><EbookMultiTomeHub /></ProBookShell>
);
export const SpecialUniverseVolumes: React.FC = () => (
  <ProBookShell module="universe"><EbookUniverseVolumesGenerator /></ProBookShell>
);

/** Métadonnées des livres spéciaux — utilisées pour l'affichage en cartes. */
export type SpecialBookMeta = { id: string; emoji: string; title: string; subtitle: string };

export const SPECIAL_BOOK_MODULES: SpecialBookMeta[] = [
  { id: 'special-recipe-book', emoji: '🍳', title: 'Livre de cuisine', subtitle: 'Recettes, menus, fiches techniques' },
  { id: 'special-travel-guide', emoji: '🧳', title: 'Guide de voyage', subtitle: 'Itinéraires, bonnes adresses, cartes' },
  { id: 'special-coloring-book', emoji: '🎨', title: 'Livre de coloriage', subtitle: 'Pages à colorier générées par IA' },
  { id: 'special-comic-book', emoji: '💥', title: 'BD / Manga', subtitle: 'Planches, cases et bulles' },
  { id: 'special-documentary', emoji: '🎬', title: 'Documentaire', subtitle: 'Livre documentaire richement illustré' },
  { id: 'special-atlas', emoji: '🗺️', title: 'Atlas', subtitle: 'Cartes et fiches géographiques' },
  { id: 'special-encyclopedia', emoji: '📖', title: 'Encyclopédie', subtitle: 'Articles thématiques structurés' },
  { id: 'special-agenda', emoji: '📅', title: 'Agenda / Planner', subtitle: 'Planificateurs et pages datées' },
  { id: 'special-diary', emoji: '📔', title: 'Journal intime', subtitle: 'Journaux et carnets guidés' },
  { id: 'special-scolaire', emoji: '🏫', title: 'Manuel scolaire', subtitle: 'Cours, exercices, corrigés' },
  { id: 'special-pedagogique', emoji: '🧠', title: 'Livre pédagogique', subtitle: 'Contenus éducatifs progressifs' },
  { id: 'special-aquarium', emoji: '🐠', title: 'Aquariophilie', subtitle: 'Fiches poissons et bacs' },
  { id: 'special-bird-sheet', emoji: '🐦', title: 'Fiches oiseaux', subtitle: 'Guide ornithologique illustré' },
  { id: 'special-multi-tome', emoji: '📚', title: 'Saga multi-tomes', subtitle: 'Série cohérente sur plusieurs tomes' },
  { id: 'special-universe-volumes', emoji: '🌌', title: 'Univers multi-volumes', subtitle: 'Ajoute des volumes à ton univers (bible, règles, timeline, personnages)' },
];
