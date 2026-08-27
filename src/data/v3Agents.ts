/**
 * Les agents-personnages Ebookstudio V3.
 * Un agent = une catégorie de livre (ou un métier de la maison d'édition).
 * Identité 100 % maison : prénoms français, palette émeraude/or, aucune reprise
 * de grilles d'agents existantes ailleurs.
 */
export type AgentFilter = 'fiction' | 'enfants' | 'pratique' | 'publier' | 'vendre';

export interface V3Agent {
  id: string;
  num: string;
  name: string;
  role: string;
  mission: string;
  deliverables: string[];
  filter: AgentFilter;
  route: string;
  /** Avatar robot plutôt que personnage */
  robot?: boolean;
  accent: string;
}

export const AGENT_FILTERS: { id: AgentFilter | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous les agents' },
  { id: 'fiction', label: 'Fiction & récits' },
  { id: 'enfants', label: 'Enfants' },
  { id: 'pratique', label: 'Pratique & savoir' },
  { id: 'publier', label: 'Publier' },
  { id: 'vendre', label: 'Vendre' },
];

export const V3_AGENTS: V3Agent[] = [
  {
    id: 'camille', num: '01', name: 'Camille', role: 'Architecte du sommaire',
    mission: 'Elle construit le plan de votre livre chapitre par chapitre, avec vous.',
    deliverables: ['Sommaire stratégique', 'Objectif par chapitre', 'Nombre de chapitres calibré'],
    filter: 'fiction', route: '/v3/outils/sommaire-ultime', accent: '#0F766E',
  },
  {
    id: 'victor', num: '02', name: 'Victor', role: 'Romancier',
    mission: 'Il écrit vos romans et récits longs, d’une seule voix, sans latin ni remplissage.',
    deliverables: ['Roman complet', 'Style cohérent', 'Fins de chapitre propres'],
    filter: 'fiction', route: '/v3/create', accent: '#1D4ED8',
  },
  {
    id: 'noemie', num: '03', name: 'Noémie', role: 'Conteuse jeunesse',
    mission: 'Histoires du soir, contes illustrés et lectures 3-7 ans.',
    deliverables: ['20 histoires courtes', 'Illustrations assorties', 'Export KDP'],
    filter: 'enfants', route: '/v3/livres/histoires-illustrees', accent: '#DB2777',
  },
  {
    id: 'basile', num: '04', name: 'Basile', role: 'Auteur business & méthode',
    mission: 'Guides pratiques, méthodes, développement professionnel.',
    deliverables: ['Livre méthode', 'Exercices', 'Promesse de couverture'],
    filter: 'pratique', route: '/v3/create', accent: '#065F46',
  },
  {
    id: 'margaux', num: '05', name: 'Margaux', role: 'Cheffe cuisine',
    mission: 'Livres de recettes, menus, régimes, cuisine de niche.',
    deliverables: ['30 recettes structurées', 'Ingrédients & étapes', 'Fiche KDP cuisine'],
    filter: 'pratique', route: '/v3/livres/cuisine', accent: '#C2410C',
  },
  {
    id: 'leandre', num: '06', name: 'Léandre', role: 'Guide de voyage',
    mission: 'Guides de destination, itinéraires, carnets de voyage.',
    deliverables: ['Itinéraires jour par jour', 'Bons plans', 'Cartes & encadrés'],
    filter: 'pratique', route: '/v3/livres/voyage', accent: '#0369A1',
  },
  {
    id: 'prune', num: '07', name: 'Prune', role: 'Atelier coloriage',
    mission: 'Coloriages, cherche-et-trouve, cahiers d’activités.',
    deliverables: ['Planches à colorier', 'Cherche & trouve', 'PDF prêt à imprimer'],
    filter: 'enfants', route: '/v3/livres/coloriage', accent: '#9333EA',
  },
  {
    id: 'gaspard', num: '08', name: 'Gaspard', role: 'Chasseur de niches',
    mission: 'Il repère les niches Amazon rentables avant d’écrire une ligne.',
    deliverables: ['Niches chiffrées', 'Concurrence analysée', 'Angle unique'],
    filter: 'vendre', route: '/v3/outils/espion-concurrents', accent: '#B45309',
  },
  {
    id: 'iris', num: '09', name: 'Iris', role: 'Directrice artistique',
    mission: 'Couvertures pro, dos, quatrième de couverture, mockups.',
    deliverables: ['Couverture KDP', 'Dos calculé', 'Mockup 3D'],
    filter: 'publier', route: '/v3/cover-studio-pro', accent: '#BE123C',
  },
  {
    id: 'aurele', num: '10', name: 'Aurèle', role: 'Correcteur éditorial',
    mission: 'Correction en 4 passes, niveau maison d’édition.',
    deliverables: ['Orthographe & style', 'Cohérence', 'Phrases terminées'],
    filter: 'publier', route: '/v3/corriger', accent: '#374151',
  },
  {
    id: 'solene', num: '11', name: 'Solène', role: 'Responsable marketing KDP',
    mission: 'Fiche produit, description, mots-clés, catégories.',
    deliverables: ['Description KDP', '7 mots-clés', '2 catégories'],
    filter: 'vendre', route: '/v3/donnees-kdp', accent: '#7C3AED',
  },
  {
    id: 'timothee', num: '12', name: 'Timothée', role: 'Traducteur & voix',
    mission: 'Votre livre en 10 langues, et sa version audio.',
    deliverables: ['Traduction fidèle', 'Version audio', 'Export multi-marchés'],
    filter: 'publier', route: '/v3/outils/traduction', accent: '#0891B2',
  },
  {
    id: 'hugo', num: '13', name: 'Hugo', role: 'Dessinateur BD / Manga',
    mission: 'Scénario découpé en planches et cases illustrées.',
    deliverables: ['Scénario', 'Planches', 'Personnages constants'],
    filter: 'fiction', route: '/v3/livres/bd', accent: '#4338CA',
  },
  {
    id: 'ariane', num: '14', name: 'Ariane', role: 'Atlas & encyclopédie',
    mission: 'Ouvrages de référence, fiches, cartes, entrées classées.',
    deliverables: ['Fiches structurées', 'Index', 'Illustrations documentaires'],
    filter: 'pratique', route: '/v3/livres/atlas', accent: '#047857',
  },
  {
    id: 'felix', num: '15', name: 'Félix', role: 'Documentaire & scolaire',
    mission: 'Documentaires grand public et manuels scolaires.',
    deliverables: ['Chapitres pédagogiques', 'Exercices', 'Corrigés'],
    filter: 'pratique', route: '/v3/livres/documentaire', accent: '#1E40AF',
  },
  {
    id: 'clemence', num: '16', name: 'Clémence', role: 'Agenda & journal',
    mission: 'Planners, agendas, journaux à remplir, carnets guidés.',
    deliverables: ['Gabarits de pages', 'Rubriques guidées', 'PDF imprimable'],
    filter: 'pratique', route: '/v3/livres/agenda', accent: '#A16207',
  },
  {
    id: 'oscar', num: '17', robot: true, name: 'Oscar', role: 'Maître du jeu',
    mission: 'Livres de jeux, énigmes, sudokus, mots mêlés.',
    deliverables: ['Grilles & énigmes', 'Solutions', 'Niveaux progressifs'],
    filter: 'enfants', route: '/v3/livres/jeux-enigmes', accent: '#EA580C',
  },
  {
    id: 'thea', num: '18', name: 'Théa', role: 'Fiches nature',
    mission: 'Oiseaux, aquariophilie, animaux, plantes : fiches illustrées.',
    deliverables: ['Fiches espèces', 'Photos/illustrations', 'Conseils pratiques'],
    filter: 'pratique', route: '/v3/livres/oiseaux', accent: '#15803D',
  },
  {
    id: 'nathan', num: '19', name: 'Nathan', role: 'Gardien des sagas',
    mission: 'Sagas multi-tomes et univers cohérents, avec mémoire.',
    deliverables: ['Bible d’univers', 'Plan des tomes', 'Continuité vérifiée'],
    filter: 'fiction', route: '/v3/livres/saga', accent: '#6D28D9',
  },
  {
    id: 'zoe', num: '20', robot: true, name: 'Zoé', role: 'Cheffe d’orchestre',
    mission: 'Elle lance les 15 agents du workflow, de la niche au fichier KDP.',
    deliverables: ['Livre complet', 'Couverture', 'Métadonnées KDP'],
    filter: 'publier', route: '/v3/workflow', accent: '#0F766E',
  },
];
