import { useParams, Navigate } from 'react-router-dom';
import BackButton from '@/components/v3/BackButton';
import {
  SpecialAtlas,
  SpecialEncyclopedia,
  SpecialDocumentary,
  SpecialColoringBook,
  SpecialAgenda,
  SpecialScolaire,
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

const MAP: Record<string, { title: string; Comp: React.FC }> = {
  'jeux-enigmes': { title: 'Livres de Jeux & Énigmes', Comp: V3PuzzleBookPage },
  'cherche-trouve': { title: 'Coloriages Cherche & Trouve', Comp: V3ChercheTrouvePage },
  'histoires-illustrees': { title: 'Histoires Courtes & Contes Illustrés', Comp: V3ShortStoriesPage },
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
  aquariophilie: { title: 'Aquariophilie', Comp: SpecialAquarium },
  oiseaux: { title: 'Fiches oiseaux', Comp: SpecialBirdSheet },
  saga: { title: 'Saga multi-tomes', Comp: SpecialMultiTome },
  univers: { title: 'Univers multi-volumes', Comp: SpecialUniverseVolumes },
};

export default function V3SpecialBookPage() {
  const { type = '' } = useParams();
  const entry = MAP[type];

  if (!entry) return <Navigate to="/v3/commence-ici" replace />;
  const { title, Comp } = entry;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <V3AgentReturnBar />
      <h1 className="text-3xl font-bold mb-6 mt-4">{title}</h1>
      <Comp />
    </div>
  );
}
