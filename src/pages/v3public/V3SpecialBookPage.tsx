import journalH from '@/assets/livre-journal-hero.jpg';
import aquaH from '@/assets/livre-aquariophilie-hero.jpg';
import oiseauxH from '@/assets/livre-oiseaux-hero.jpg';
import sagaH from '@/assets/livre-saga-hero.jpg';
import universH from '@/assets/livre-univers-hero.jpg';
import jeuxH from '@/assets/livre-jeux-enigmes-hero.jpg';
import chercheH from '@/assets/livre-cherche-trouve-hero.jpg';
import histH from '@/assets/livre-histoires-illustrees-hero.jpg';
import documentaireHero from '@/assets/livre-documentaire-hero.jpg';
import atlasHero from '@/assets/livre-atlas-hero.jpg';
import encyclopedieHero from '@/assets/livre-encyclopedie-hero.jpg';
import agendaHero from '@/assets/livre-agenda-hero.jpg';
import scolaireHero from '@/assets/livre-scolaire-hero.jpg';
import bdHero from '@/assets/livre-bd-hero.jpg';
import coloriageHero from '@/assets/livre-coloriage-hero.jpg';
import voyageHero from '@/assets/livre-voyage-hero.jpg';
import cuisineHero from '@/assets/livre-cuisine-hero.jpg';
import romanHero from '@/assets/livre-roman-hero.jpg';
import { useParams, Navigate } from 'react-router-dom';
import V3AgentReturnBar from '@/components/v3public/V3AgentReturnBar';
import {
  SpecialAtlas,
  SpecialEncyclopedia,
  SpecialDocumentary,
  SpecialColoringBook,
  SpecialAgenda,
  SpecialScolaire,
  SpecialPedagogique,
  SpecialRecipeBook,
  SpecialTravelGuide,
  SpecialComicBook,
  SpecialDiary,
  SpecialAquarium,
  SpecialBirdSheet,
  SpecialMultiTome,
  SpecialUniverseVolumes,
} from '@/components/admin/SpecialBookModules';
import V3CreatePage from './V3CreatePage';
import V3PuzzleBookPage from './V3PuzzleBookPage';
import V3ChercheTrouvePage from './V3ChercheTrouvePage';
import V3ShortStoriesPage from './V3ShortStoriesPage';
import V3PracticalGuidesPage from './V3PracticalGuidesPage';

const MAP: Record<string, { title: string; Comp: React.FC }> = {
  'jeux-enigmes': { title: 'Livres de Jeux & Énigmes', Comp: V3PuzzleBookPage },
  'cherche-trouve': { title: 'Coloriages Cherche & Trouve', Comp: V3ChercheTrouvePage },
  'histoires-illustrees': { title: 'Histoires Courtes & Contes Illustrés', Comp: V3ShortStoriesPage },
  'guides-pratiques': { title: 'Guides pratiques', Comp: V3PracticalGuidesPage },
  roman: { title: 'Roman', Comp: V3CreatePage },
  cuisine: { title: 'Livre de cuisine', Comp: SpecialRecipeBook },
  voyage: { title: 'Guide de voyage', Comp: SpecialTravelGuide },
  coloriage: { title: 'Livre de coloriage', Comp: SpecialColoringBook },
  bd: { title: 'BD / Manga', Comp: SpecialComicBook },
  documentaire: { title: 'Documentaire', Comp: SpecialDocumentary },
  atlas: { title: 'Atlas', Comp: SpecialAtlas },
  encyclopedie: { title: 'Encyclopédie', Comp: SpecialEncyclopedia },
  agenda: { title: 'Agenda / Planner', Comp: SpecialAgenda },
  journal: { title: 'Journal intime', Comp: SpecialDiary },
  scolaire: { title: 'Manuel scolaire', Comp: SpecialScolaire },
  pedagogique: { title: 'Livre pédagogique', Comp: SpecialPedagogique },
  aquariophilie: { title: 'Aquariophilie', Comp: SpecialAquarium },
  oiseaux: { title: 'Fiches oiseaux', Comp: SpecialBirdSheet },
  saga: { title: 'Saga multi-tomes', Comp: SpecialMultiTome },
  univers: { title: 'Univers multi-volumes', Comp: SpecialUniverseVolumes },
};

const HEROES: Record<string, { src: string; alt: string }> = {
  roman: { src: romanHero, alt: "Roman ouvert sur un bureau à la lueur d'une lampe" },
  cuisine: { src: cuisineHero, alt: 'Livre de cuisine ouvert entouré de produits frais' },
  documentaire: { src: documentaireHero, alt: 'Livre documentaire ouvert avec photos de nature' },
  atlas: { src: atlasHero, alt: 'Atlas ouvert avec cartes du monde et globe' },
  encyclopedie: { src: encyclopedieHero, alt: 'Collection d’encyclopédies reliées' },
  agenda: { src: agendaHero, alt: 'Agenda ouvert avec stylo et café' },
  scolaire: { src: scolaireHero, alt: 'Manuel scolaire ouvert avec cahier et crayons' },
  pedagogique: { src: scolaireHero, alt: 'Livre pédagogique ouvert avec encadrés et schémas' },
  'journal': { src: journalH, alt: 'Journal intime ouvert à la bougie' },
  'aquariophilie': { src: aquaH, alt: 'Aquarium tropical et guide ouvert' },
  'oiseaux': { src: oiseauxH, alt: 'Guide des oiseaux ouvert avec jumelles' },
  'saga': { src: sagaH, alt: 'Saga en plusieurs tomes reliés' },
  'univers': { src: universH, alt: 'Livres ouverts sur un univers imaginaire' },
  'jeux-enigmes': { src: jeuxH, alt: 'Livre de jeux et d’énigmes ouvert' },
  'cherche-trouve': { src: chercheH, alt: 'Livre cherche et trouve avec loupe' },
  'histoires-illustrees': { src: histH, alt: 'Recueil de contes illustrés ouvert' },
  voyage: { src: voyageHero, alt: 'Guide de voyage ouvert avec carte, boussole et passeport' },
  bd: { src: bdHero, alt: 'Bande dessinée et manga ouverts sur un bureau de dessinateur' },
  coloriage: { src: coloriageHero, alt: 'Livre de coloriage ouvert avec crayons de couleur' },
};

export default function V3SpecialBookPage() {
  const { type = '' } = useParams();
  const entry = MAP[type];

  if (!entry) return <Navigate to="/v3/commence-ici" replace />;
  const { title, Comp } = entry;

  return (
    <div className="v3-special-readable container mx-auto px-4 py-6 max-w-7xl">
      <V3AgentReturnBar />
      {HEROES[type] && (
        <img src={HEROES[type].src} alt={HEROES[type].alt} width={1600} height={560} className="mt-4 w-full rounded-2xl object-cover" />
      )}
      <h1 className="text-3xl font-bold mb-6 mt-4">{title}</h1>
      <Comp />
    </div>
  );
}
