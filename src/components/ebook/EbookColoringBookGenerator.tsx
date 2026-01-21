import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Loader2, Palette, Download, RefreshCw, Sparkles, Baby, ImagePlus, BookOpen, Wand2, FileDown, AlertTriangle, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, ImageRun, PageBreak, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import { useProjectSave } from '@/hooks/useProjectSave';
import { KdpQuickTools } from './KdpQuickTools';
import SpecializedAmazonPreview from './SpecializedAmazonPreview';

interface ColoringPage {
  id: string;
  title: string;
  imageUrl: string;
  suggestedColors: {
    element: string;
    color: string;
    hexCode: string;
  }[];
  prompt: string;
}

interface ColoringBookGeneratorProps {
  ebookTitle?: string;
}

const THEMES = [
  { value: 'animals', label: '🐾 Animaux', examples: 'Lion, éléphant, papillon...' },
  { value: 'fantasy', label: '🦄 Fantaisie', examples: 'Licornes, dragons, fées...' },
  { value: 'nature', label: '🌸 Nature', examples: 'Fleurs, arbres, paysages...' },
  { value: 'vehicles', label: '🚗 Véhicules', examples: 'Voitures, avions, bateaux...' },
  { value: 'seasons', label: '🍂 Saisons', examples: 'Noël, été, automne...' },
  { value: 'food', label: '🍕 Nourriture', examples: 'Fruits, gâteaux, légumes...' },
  { value: 'space', label: '🚀 Espace', examples: 'Planètes, fusées, astronautes...' },
  { value: 'ocean', label: '🐠 Océan', examples: 'Poissons, dauphins, coquillages...' },
  { value: 'dinosaurs', label: '🦕 Dinosaures', examples: 'T-Rex, Tricératops...' },
  { value: 'custom', label: '✏️ Personnalisé', examples: 'Votre propre thème' },
];

const AGE_GROUPS = [
  { value: '2-4', label: '2-4 ans', description: 'Formes très simples, gros contours' },
  { value: '4-6', label: '4-6 ans', description: 'Formes simples avec quelques détails' },
  { value: '6-8', label: '6-8 ans', description: 'Détails modérés, plus de complexité' },
  { value: '8-12', label: '8-12 ans', description: 'Détails élaborés, motifs complexes' },
];

const COMPLEXITY_LEVELS = [
  { value: 1, label: 'Très simple', description: '3-5 éléments à colorier' },
  { value: 2, label: 'Simple', description: '5-8 éléments à colorier' },
  { value: 3, label: 'Modéré', description: '8-12 éléments à colorier' },
  { value: 4, label: 'Détaillé', description: '12-20 éléments à colorier' },
  { value: 5, label: 'Complexe', description: '20+ éléments à colorier' },
];

// Formats de livres cartonnés pour enfants (Board Books)
const BOOK_FORMATS = [
  { 
    category: '📚 Cartonné (Board Book)',
    formats: [
      { value: '6x6', label: '15x15 cm (6x6")', description: 'Carré classique bébé', aspectRatio: '1:1' },
      { value: '7x7', label: '18x18 cm (7x7")', description: 'Carré grand format', aspectRatio: '1:1' },
      { value: '8x8', label: '20x20 cm (8x8")', description: 'Carré premium', aspectRatio: '1:1' },
      { value: '5x7', label: '13x18 cm (5x7")', description: 'Portrait compact', aspectRatio: '5:7' },
      { value: '8.5x8.5', label: '21.5x21.5 cm (8.5x8.5")', description: 'Grand carré KDP', aspectRatio: '1:1' },
    ]
  },
  {
    category: '📖 Broché / KDP',
    formats: [
      { value: '8.5x8.5-kdp', label: '8.5x8.5" KDP', description: 'Carré standard KDP', aspectRatio: '1:1' },
      { value: '8.5x11', label: '8.5x11" (Letter)', description: 'Portrait US standard', aspectRatio: '17:22' },
      { value: '8x10', label: '8x10"', description: 'Portrait populaire', aspectRatio: '4:5' },
      { value: 'a4', label: 'A4 (21x29.7 cm)', description: 'Format européen', aspectRatio: '210:297' },
    ]
  },
];

export const EbookColoringBookGenerator: React.FC<ColoringBookGeneratorProps> = ({ ebookTitle }) => {
  // Configuration OpenAI - utiliser la clé API utilisateur si disponible
  const { apiKey: userApiKey, isValid: isUserKeyValid } = useOpenAIConfig();
  const useOpenAI = Boolean(userApiKey) && isUserKeyValid === true;
  const { saveSpecializedProject } = useProjectSave();

  const [theme, setTheme] = useState('animals');
  const [customTheme, setCustomTheme] = useState('');
  const [ageGroup, setAgeGroup] = useState('4-6');
  const [complexity, setComplexity] = useState([2]);
  const [numberOfPages, setNumberOfPages] = useState(25); // Défaut: 25 pages (KDP minimum 24)
  const [bookFormat, setBookFormat] = useState('8.5x8.5-kdp'); // Format KDP par défaut
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPages, setGeneratedPages] = useState<ColoringPage[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isSavingProject, setIsSavingProject] = useState(false);

  const generateColorPalette = (theme: string, subject: string): { element: string; color: string; hexCode: string }[] => {
    // Génération intelligente de palettes de couleurs suggérées
    const palettes: Record<string, { element: string; color: string; hexCode: string }[]> = {
      animals: [
        { element: 'Fourrure / Corps', color: 'Marron clair', hexCode: '#D2691E' },
        { element: 'Yeux', color: 'Noir ou marron', hexCode: '#2F1810' },
        { element: 'Nez', color: 'Rose ou noir', hexCode: '#FFB6C1' },
        { element: 'Fond', color: 'Vert prairie', hexCode: '#90EE90' },
        { element: 'Ciel', color: 'Bleu clair', hexCode: '#87CEEB' },
      ],
      fantasy: [
        { element: 'Corne de licorne', color: 'Or / Doré', hexCode: '#FFD700' },
        { element: 'Crinière', color: 'Rose / Violet', hexCode: '#FF69B4' },
        { element: 'Corps magique', color: 'Blanc nacré', hexCode: '#FFFAFA' },
        { element: 'Étoiles', color: 'Jaune brillant', hexCode: '#FFFF00' },
        { element: 'Ailes', color: 'Bleu irisé', hexCode: '#ADD8E6' },
      ],
      nature: [
        { element: 'Feuilles', color: 'Vert forêt', hexCode: '#228B22' },
        { element: 'Fleurs', color: 'Rose / Rouge', hexCode: '#FF6B6B' },
        { element: 'Tronc d\'arbre', color: 'Marron', hexCode: '#8B4513' },
        { element: 'Soleil', color: 'Jaune', hexCode: '#FFD700' },
        { element: 'Ciel', color: 'Bleu', hexCode: '#87CEEB' },
      ],
      vehicles: [
        { element: 'Carrosserie', color: 'Rouge vif', hexCode: '#FF0000' },
        { element: 'Roues', color: 'Noir', hexCode: '#000000' },
        { element: 'Fenêtres', color: 'Bleu clair', hexCode: '#ADD8E6' },
        { element: 'Phares', color: 'Jaune', hexCode: '#FFFF00' },
        { element: 'Route', color: 'Gris', hexCode: '#808080' },
      ],
      seasons: [
        { element: 'Neige', color: 'Blanc', hexCode: '#FFFFFF' },
        { element: 'Feuilles d\'automne', color: 'Orange / Rouge', hexCode: '#FF8C00' },
        { element: 'Fleurs de printemps', color: 'Rose / Jaune', hexCode: '#FFB6C1' },
        { element: 'Soleil d\'été', color: 'Jaune doré', hexCode: '#FFD700' },
        { element: 'Ciel', color: 'Bleu variable', hexCode: '#87CEEB' },
      ],
      food: [
        { element: 'Fruits rouges', color: 'Rouge', hexCode: '#FF0000' },
        { element: 'Bananes', color: 'Jaune', hexCode: '#FFE135' },
        { element: 'Légumes verts', color: 'Vert', hexCode: '#32CD32' },
        { element: 'Gâteaux', color: 'Marron / Rose', hexCode: '#D2691E' },
        { element: 'Assiette', color: 'Blanc', hexCode: '#FFFFFF' },
      ],
      space: [
        { element: 'Fusée', color: 'Argent / Rouge', hexCode: '#C0C0C0' },
        { element: 'Planètes', color: 'Multicolore', hexCode: '#FF6347' },
        { element: 'Étoiles', color: 'Jaune / Blanc', hexCode: '#FFFF00' },
        { element: 'Espace', color: 'Bleu nuit / Noir', hexCode: '#191970' },
        { element: 'Astronaute', color: 'Blanc', hexCode: '#FFFFFF' },
      ],
      ocean: [
        { element: 'Eau', color: 'Bleu turquoise', hexCode: '#40E0D0' },
        { element: 'Poissons', color: 'Orange / Multicolore', hexCode: '#FF7F50' },
        { element: 'Coraux', color: 'Rose / Rouge', hexCode: '#FF7F50' },
        { element: 'Sable', color: 'Beige', hexCode: '#F5DEB3' },
        { element: 'Algues', color: 'Vert', hexCode: '#2E8B57' },
      ],
      dinosaurs: [
        { element: 'Corps du dinosaure', color: 'Vert / Marron', hexCode: '#228B22' },
        { element: 'Écailles', color: 'Vert foncé', hexCode: '#006400' },
        { element: 'Yeux', color: 'Jaune / Orange', hexCode: '#FFD700' },
        { element: 'Volcans', color: 'Rouge / Orange', hexCode: '#FF4500' },
        { element: 'Végétation', color: 'Vert jungle', hexCode: '#2F4F2F' },
      ],
      custom: [
        { element: 'Élément principal', color: 'Au choix', hexCode: '#808080' },
        { element: 'Fond', color: 'Au choix', hexCode: '#808080' },
        { element: 'Détails', color: 'Au choix', hexCode: '#808080' },
        { element: 'Accents', color: 'Au choix', hexCode: '#808080' },
      ],
    };

    return palettes[theme] || palettes.custom;
  };

  // Liste étendue de 30+ sujets variés par thème
  const EXTENDED_SUBJECTS: Record<string, string[]> = {
    animals: [
      'un lion majestueux avec une grande crinière', 'un éléphant adorable qui joue', 'un papillon aux ailes déployées', 
      'un chat joueur avec une pelote', 'un chien heureux qui court', 'une grenouille souriante sur un nénuphar',
      'un hibou sage sur une branche', 'un lapin mignon dans un jardin', 'un ours en peluche câlin',
      'une girafe avec son long cou', 'un zèbre avec ses rayures', 'un singe espiègle dans un arbre',
      'un panda qui mange du bambou', 'un koala endormi', 'un pingouin sur la glace',
      'un perroquet coloré', 'un flamant rose élégant', 'une coccinelle sur une feuille',
      'une abeille près d\'une fleur', 'un écureuil avec une noisette', 'un renard rusé',
      'un hérisson mignon', 'une chouette dans la nuit', 'un canard sur l\'eau',
      'un cheval qui galope', 'une vache dans un pré', 'un mouton laineux',
      'un cochon rose joyeux', 'un coq qui chante', 'une poule avec ses poussins',
      'un âne gentil', 'une chèvre qui broute', 'un lama souriant'
    ],
    fantasy: [
      'une licorne magique avec arc-en-ciel', 'un dragon amical qui crache des étoiles', 'une fée étincelante avec des ailes',
      'un château enchanté dans les nuages', 'une sirène gracieuse sous l\'eau', 'un phoenix majestueux en vol',
      'un lutin farceur', 'une princesse avec une couronne', 'un prince charmant sur son cheval',
      'un gnome de jardin', 'une sorcière gentille sur son balai', 'un troll rigolo sous un pont',
      'un pegase ailé', 'un elfe de la forêt', 'une baguette magique étoilée',
      'un champignon enchanté', 'une potion magique', 'un grimoire mystérieux',
      'une citrouille enchantée', 'un arc-en-ciel magique', 'des étoiles filantes',
      'une maison de fée', 'un jardin secret', 'une porte magique',
      'un trésor étincelant', 'une couronne royale', 'un miroir magique',
      'une lampe à génie', 'un tapis volant', 'une boule de cristal',
      'un chaudron de sorcière', 'une forêt enchantée', 'un nuage arc-en-ciel'
    ],
    nature: [
      'un bouquet de fleurs printanières', 'un arbre majestueux en été', 'un jardin fleuri avec papillons',
      'une montagne enneigée au soleil', 'un champ de tulipes colorées', 'une forêt avec champignons',
      'un lac paisible avec reflets', 'une cascade dans la jungle', 'un arc-en-ciel après la pluie',
      'un coucher de soleil sur la mer', 'des nuages en forme d\'animaux', 'un pré avec des marguerites',
      'un potager avec légumes', 'un verger avec fruits', 'une rivière qui coule',
      'des feuilles d\'automne', 'des flocons de neige', 'un orage avec éclairs',
      'une pleine lune', 'des étoiles scintillantes', 'un lever de soleil',
      'une plage avec coquillages', 'une île tropicale', 'un désert avec cactus',
      'une prairie avec coquelicots', 'un nid d\'oiseau', 'une toile d\'araignée avec rosée',
      'un rocher avec mousse', 'une grotte mystérieuse', 'un volcan endormi',
      'une oasis dans le désert', 'des dunes de sable', 'une aurore boréale'
    ],
    vehicles: [
      'une voiture de course rapide', 'un camion de pompiers rouge', 'un avion dans les nuages',
      'un bateau sur les vagues', 'une fusée spatiale décollant', 'un train à vapeur',
      'un hélicoptère en vol', 'un sous-marin sous l\'eau', 'une montgolfière colorée',
      'un vélo avec panier', 'une moto sportive', 'un tracteur dans un champ',
      'un bus scolaire jaune', 'une ambulance qui aide', 'un taxi en ville',
      'un camion poubelle', 'une grue de chantier', 'un bulldozer au travail',
      'un quad dans la boue', 'un jet ski sur l\'eau', 'un kayak sur la rivière',
      'un voilier au vent', 'un paquebot géant', 'un yacht de luxe',
      'un avion de chasse', 'un ULM léger', 'un dirigeable dans le ciel',
      'une trottinette électrique', 'un skateboard cool', 'des rollers rapides',
      'un chariot élévateur', 'une pelleteuse', 'un camion benne'
    ],
    seasons: [
      'un bonhomme de neige avec chapeau', 'des feuilles d\'automne qui tombent', 'des fleurs de printemps',
      'une plage d\'été avec parasol', 'Père Noël avec ses rennes', 'un sapin de Noël décoré',
      'des œufs de Pâques cachés', 'un lapin de Pâques', 'une citrouille d\'Halloween',
      'un fantôme mignon', 'une chauve-souris amicale', 'des bonbons d\'Halloween',
      'un feu d\'artifice coloré', 'une guirlande lumineuse', 'des cadeaux emballés',
      'un cerf-volant au printemps', 'un pique-nique d\'été', 'des châteaux de sable',
      'une bataille de boules de neige', 'une luge sur la colline', 'des patins à glace',
      'un épouvantail d\'automne', 'une récolte de pommes', 'des champignons d\'automne',
      'un parapluie sous la pluie', 'des bottes en caoutchouc', 'un imperméable jaune',
      'un thermomètre qui gèle', 'un soleil d\'été souriant', 'une fleur qui pousse',
      'un nid avec œufs', 'un papillon au printemps', 'une abeille butinant'
    ],
    food: [
      'une pizza appétissante', 'un gâteau d\'anniversaire avec bougies', 'une corbeille de fruits frais',
      'un sundae géant avec cerises', 'des cupcakes décorés', 'une glace en cornet',
      'un hamburger délicieux', 'des frites croustillantes', 'un hot-dog gourmand',
      'une tarte aux pommes', 'des cookies aux pépites', 'un donut glacé',
      'des bonbons colorés', 'une sucette géante', 'du pop-corn au caramel',
      'un bol de céréales', 'des crêpes avec fruits', 'des gaufres belges',
      'un sandwich au fromage', 'une salade fraîche', 'une soupe chaude',
      'des sushis japonais', 'des tacos mexicains', 'une paella espagnole',
      'des croissants français', 'une baguette de pain', 'un éclair au chocolat',
      'une mousse au chocolat', 'des macarons colorés', 'un tiramisu italien',
      'un smoothie aux fruits', 'un milk-shake vanille', 'un jus d\'orange frais'
    ],
    space: [
      'une fusée décollant vers les étoiles', 'un astronaute sur la lune', 'Saturne avec ses anneaux',
      'un alien amical vert', 'une station spatiale ISS', 'le soleil radieux',
      'la Terre vue de l\'espace', 'Mars la planète rouge', 'Jupiter la géante',
      'une comète traversant le ciel', 'une galaxie spirale', 'un trou noir mystérieux',
      'un rover sur Mars', 'un satellite en orbite', 'une navette spatiale',
      'un télescope spatial', 'une combinaison d\'astronaute', 'un casque spatial',
      'des météorites qui tombent', 'une pluie d\'étoiles filantes', 'une éclipse de lune',
      'une éclipse de soleil', 'la Voie lactée', 'une constellation d\'étoiles',
      'un vaisseau extraterrestre', 'une base lunaire', 'un drapeau sur la lune',
      'des cratères lunaires', 'une planète avec deux soleils', 'un robot spatial',
      'une fusée rétro vintage', 'un astronaute qui flotte', 'une capsule spatiale'
    ],
    ocean: [
      'un dauphin joueur sautant', 'un poisson clown dans une anémone', 'une tortue de mer nageant',
      'un poulpe amusant avec tentacules', 'un hippocampe élégant', 'une baleine majestueuse',
      'un requin amical', 'une étoile de mer colorée', 'un crabe sur le sable',
      'une méduse transparente', 'un phoque sur un rocher', 'une otarie joueuse',
      'un narval licorne des mers', 'un orque qui saute', 'un morse avec défenses',
      'une raie manta gracieuse', 'un poisson-globe gonflé', 'un poisson-ange tropical',
      'un corail coloré', 'une anémone de mer', 'des algues ondulantes',
      'un trésor englouti', 'un coffre de pirate', 'une épave de bateau',
      'une sirène sous l\'eau', 'un château de sable sous-marin', 'des bulles qui montent',
      'un plongeur avec masque', 'un sous-marin jaune', 'une ancre marine',
      'un phare sur la côte', 'un bateau de pêche', 'des filets de pêche'
    ],
    dinosaurs: [
      'un T-Rex souriant et amical', 'un Tricératops avec ses cornes', 'un Diplodocus au long cou',
      'un Ptéranodon en vol', 'un Stégosaure avec plaques', 'un Vélociraptor curieux',
      'un Ankylosaure blindé', 'un Brachiosaure géant', 'un Parasaurolophus à crête',
      'un Spinosaure avec voile', 'un Tyrannosaure bébé', 'un œuf de dinosaure qui éclot',
      'un nid de dinosaures', 'une empreinte de dinosaure', 'un fossile dans la roche',
      'un volcan préhistorique', 'une fougère géante', 'un marécage préhistorique',
      'un Pachycéphalosaure têtu', 'un Compsognathus minuscule', 'un Dilophosaure à crête',
      'un Iguanodon herbivore', 'un Carnotaure à cornes', 'un Mosasaure marin',
      'un Archaeopteryx à plumes', 'un Dimétrodon à voile', 'un Mammouth laineux',
      'un Smilodon à dents', 'un Mégalodon géant', 'un Quetzalcoatlus volant',
      'un paléontologue au travail', 'des os de dinosaure', 'un musée de dinosaures'
    ],
    custom: []
  };

  // Génération de palette dynamique basée sur le sujet spécifique
  const generateDynamicColorPalette = (subject: string): { element: string; color: string; hexCode: string }[] => {
    const subjectLower = subject.toLowerCase();
    
    // Détection des éléments dans le sujet pour palette personnalisée
    const colorMappings: { keywords: string[]; palette: { element: string; color: string; hexCode: string }[] }[] = [
      {
        keywords: ['lion', 'girafe', 'sable', 'désert'],
        palette: [
          { element: 'Corps / Fourrure', color: 'Jaune doré', hexCode: '#FFD700' },
          { element: 'Crinière / Taches', color: 'Orange foncé', hexCode: '#FF8C00' },
          { element: 'Yeux', color: 'Ambre', hexCode: '#FFBF00' },
          { element: 'Nez', color: 'Marron foncé', hexCode: '#654321' },
          { element: 'Fond / Savane', color: 'Beige', hexCode: '#F5DEB3' },
        ]
      },
      {
        keywords: ['éléphant', 'rhinocéros', 'hippopotame'],
        palette: [
          { element: 'Corps', color: 'Gris', hexCode: '#808080' },
          { element: 'Oreilles', color: 'Gris rosé', hexCode: '#C4AEAD' },
          { element: 'Défenses', color: 'Ivoire', hexCode: '#FFFFF0' },
          { element: 'Yeux', color: 'Marron', hexCode: '#8B4513' },
          { element: 'Fond', color: 'Vert savane', hexCode: '#9ACD32' },
        ]
      },
      {
        keywords: ['licorne', 'fée', 'magie', 'arc-en-ciel'],
        palette: [
          { element: 'Corps', color: 'Blanc nacré', hexCode: '#FFFAFA' },
          { element: 'Crinière', color: 'Rose magique', hexCode: '#FF69B4' },
          { element: 'Corne', color: 'Or scintillant', hexCode: '#FFD700' },
          { element: 'Ailes / Étoiles', color: 'Violet féerique', hexCode: '#9370DB' },
          { element: 'Arc-en-ciel', color: 'Multicolore', hexCode: '#FF6B6B' },
        ]
      },
      {
        keywords: ['dragon', 'feu', 'volcan'],
        palette: [
          { element: 'Écailles', color: 'Vert dragon', hexCode: '#228B22' },
          { element: 'Flammes', color: 'Orange feu', hexCode: '#FF4500' },
          { element: 'Yeux', color: 'Jaune lumineux', hexCode: '#FFFF00' },
          { element: 'Ailes', color: 'Rouge bordeaux', hexCode: '#8B0000' },
          { element: 'Ventre', color: 'Jaune pâle', hexCode: '#FFFACD' },
        ]
      },
      {
        keywords: ['océan', 'mer', 'eau', 'poisson', 'dauphin', 'baleine', 'tortue'],
        palette: [
          { element: 'Eau / Fond', color: 'Bleu océan', hexCode: '#006994' },
          { element: 'Poisson / Corps', color: 'Turquoise', hexCode: '#40E0D0' },
          { element: 'Coraux', color: 'Corail', hexCode: '#FF7F50' },
          { element: 'Sable', color: 'Sable doré', hexCode: '#F4A460' },
          { element: 'Bulles', color: 'Blanc transparent', hexCode: '#E0FFFF' },
        ]
      },
      {
        keywords: ['espace', 'fusée', 'astronaute', 'planète', 'étoile'],
        palette: [
          { element: 'Espace / Fond', color: 'Bleu nuit', hexCode: '#191970' },
          { element: 'Fusée', color: 'Argent métallique', hexCode: '#C0C0C0' },
          { element: 'Flammes', color: 'Orange vif', hexCode: '#FF4500' },
          { element: 'Étoiles', color: 'Jaune brillant', hexCode: '#FFFF00' },
          { element: 'Planètes', color: 'Rouge Mars', hexCode: '#CD5C5C' },
        ]
      },
      {
        keywords: ['fleur', 'jardin', 'rose', 'tulipe', 'marguerite'],
        palette: [
          { element: 'Pétales', color: 'Rose vif', hexCode: '#FF69B4' },
          { element: 'Tige / Feuilles', color: 'Vert feuille', hexCode: '#228B22' },
          { element: 'Cœur', color: 'Jaune pollen', hexCode: '#FFD700' },
          { element: 'Terre', color: 'Marron terre', hexCode: '#8B4513' },
          { element: 'Ciel', color: 'Bleu clair', hexCode: '#87CEEB' },
        ]
      },
      {
        keywords: ['dinosaure', 't-rex', 'tricératops', 'diplodocus'],
        palette: [
          { element: 'Corps', color: 'Vert dinosaure', hexCode: '#556B2F' },
          { element: 'Écailles', color: 'Vert foncé', hexCode: '#006400' },
          { element: 'Ventre', color: 'Vert clair', hexCode: '#90EE90' },
          { element: 'Yeux', color: 'Orange', hexCode: '#FFA500' },
          { element: 'Fond préhistorique', color: 'Marron', hexCode: '#A0522D' },
        ]
      },
      {
        keywords: ['gâteau', 'cupcake', 'bonbon', 'glace', 'sucette'],
        palette: [
          { element: 'Glaçage', color: 'Rose bonbon', hexCode: '#FFB6C1' },
          { element: 'Base / Biscuit', color: 'Marron doré', hexCode: '#D2691E' },
          { element: 'Décorations', color: 'Multicolore', hexCode: '#FF6B6B' },
          { element: 'Crème', color: 'Blanc crème', hexCode: '#FFFDD0' },
          { element: 'Cerises', color: 'Rouge cerise', hexCode: '#DC143C' },
        ]
      },
      {
        keywords: ['voiture', 'camion', 'bus', 'véhicule'],
        palette: [
          { element: 'Carrosserie', color: 'Rouge vif', hexCode: '#FF0000' },
          { element: 'Roues', color: 'Noir', hexCode: '#000000' },
          { element: 'Fenêtres', color: 'Bleu ciel', hexCode: '#87CEEB' },
          { element: 'Phares', color: 'Jaune', hexCode: '#FFFF00' },
          { element: 'Route', color: 'Gris asphalte', hexCode: '#696969' },
        ]
      },
      {
        keywords: ['noël', 'père noël', 'sapin', 'cadeau'],
        palette: [
          { element: 'Costume / Sapin', color: 'Rouge Noël', hexCode: '#C41E3A' },
          { element: 'Sapin', color: 'Vert sapin', hexCode: '#228B22' },
          { element: 'Étoile / Décos', color: 'Or', hexCode: '#FFD700' },
          { element: 'Neige', color: 'Blanc pur', hexCode: '#FFFFFF' },
          { element: 'Cadeaux', color: 'Multicolore', hexCode: '#FF69B4' },
        ]
      },
    ];

    // Chercher une correspondance
    for (const mapping of colorMappings) {
      if (mapping.keywords.some(keyword => subjectLower.includes(keyword))) {
        return mapping.palette;
      }
    }

    // Palette par défaut générique
    return [
      { element: 'Élément principal', color: 'Couleur au choix', hexCode: '#808080' },
      { element: 'Fond', color: 'Couleur claire', hexCode: '#F5F5F5' },
      { element: 'Détails', color: 'Couleur contrastée', hexCode: '#4A4A4A' },
      { element: 'Accents', color: 'Couleur vive', hexCode: '#FF6B6B' },
      { element: 'Ombres', color: 'Gris doux', hexCode: '#A9A9A9' },
    ];
  };

  const generateColoringPage = async (pageNumber: number, subject: string): Promise<ColoringPage | null> => {
    const selectedTheme = theme === 'custom' ? customTheme : THEMES.find(t => t.value === theme)?.label || theme;
    const ageInfo = AGE_GROUPS.find(a => a.value === ageGroup);
    const complexityInfo = COMPLEXITY_LEVELS.find(c => c.value === complexity[0]);

    const prompt = `Create a simple, child-friendly coloring book page for ages ${ageGroup}. 
Subject: ${subject}
Theme: ${selectedTheme}

CRITICAL REQUIREMENTS:
- BLACK AND WHITE LINE DRAWING ONLY - NO colors, NO shading, NO gradients
- Clean, bold black outlines on pure white background
- Line thickness appropriate for age ${ageGroup} (thicker for younger children)
- Complexity level: ${complexityInfo?.description}
- ${ageInfo?.description}
- Cute, friendly, non-scary appearance
- Clear, well-defined areas for coloring
- Simple shapes that children can color easily
- Professional coloring book quality
- NO text, NO watermarks
- High contrast black lines on white`;

    try {
      const { data, error } = await supabase.functions.invoke('generate-chapter-images', {
        body: {
          chapterTitle: subject,
          ebookTitle: ebookTitle || 'Livre de Coloriage',
          style: 'line art sketch',
          ratio: 'square',
          quality: 'high',
          colorScheme: 'monochrome',
          useOpenAI: useOpenAI,
          openaiApiKey: userApiKey || undefined,
          // Activer explicitement le mode livre de coloriage
          isColoringBook: true,
          coloringBookAgeGroup: ageGroup,
        },
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.url;
      if (!imageUrl) throw new Error('Aucune image générée');

      return {
        id: `page-${pageNumber}-${Date.now()}`,
        title: subject,
        imageUrl,
        suggestedColors: generateDynamicColorPalette(subject), // Palette dynamique !
        prompt,
      };
    } catch (error) {
      console.error(`Erreur génération page ${pageNumber}:`, error);
      return null;
    }
  };

  // Génération des sujets pour le nombre de pages demandé
  const generateSubjectsList = (): string[] => {
    if (customPrompt.trim()) {
      // Si prompt personnalisé, l'utiliser pour toutes les pages avec variations
      return Array.from({ length: numberOfPages }, (_, i) => `${customPrompt} (variation ${i + 1})`);
    }

    const themeSubjects = EXTENDED_SUBJECTS[theme] || [];
    if (theme === 'custom' && customTheme) {
      // Générer des variations pour thème personnalisé
      return Array.from({ length: numberOfPages }, (_, i) => `${customTheme} - scène ${i + 1}`);
    }

    // Mélanger les sujets et en prendre le nombre nécessaire
    const shuffled = [...themeSubjects].sort(() => Math.random() - 0.5);
    const subjects: string[] = [];
    
    for (let i = 0; i < numberOfPages; i++) {
      subjects.push(shuffled[i % shuffled.length]);
    }
    
    return subjects;
  };

  const handleGenerate = async () => {
    if (theme === 'custom' && !customTheme.trim()) {
      toast.error('Veuillez entrer un thème personnalisé');
      return;
    }

    setIsGenerating(true);
    setGeneratedPages([]);
    setCurrentProgress(0);

    const subjects = generateSubjectsList();
    const pages: ColoringPage[] = [];
    const BATCH_SIZE = 5; // Générer 5 pages en parallèle

    toast.info(`Génération de ${numberOfPages} pages en lots de ${BATCH_SIZE}...`);

    // Générer par lots de 5
    for (let batchStart = 0; batchStart < numberOfPages; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, numberOfPages);
      const batchSubjects = subjects.slice(batchStart, batchEnd);
      
      // Générer le lot en parallèle
      const batchPromises = batchSubjects.map((subject, idx) => 
        generateColoringPage(batchStart + idx, subject)
      );

      const batchResults = await Promise.all(batchPromises);
      
      // Ajouter les pages réussies
      batchResults.forEach(page => {
        if (page) {
          pages.push(page);
        }
      });

      setGeneratedPages([...pages]);
      setCurrentProgress((batchEnd / numberOfPages) * 100);

      // Petit délai entre les lots pour éviter le rate limiting
      if (batchEnd < numberOfPages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsGenerating(false);
    
    if (pages.length > 0) {
      toast.success(`${pages.length}/${numberOfPages} page(s) de coloriage générée(s) !`);
    } else {
      toast.error('Erreur lors de la génération');
    }
  };

  const regeneratePage = async (index: number) => {
    setIsGenerating(true);
    const currentPage = generatedPages[index];
    const newPage = await generateColoringPage(index, currentPage?.title || `Page ${index + 1}`);
    if (newPage) {
      const updatedPages = [...generatedPages];
      updatedPages[index] = newPage;
      setGeneratedPages(updatedPages);
      toast.success('Page régénérée !');
    }
    setIsGenerating(false);
  };

  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (generatedPages.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Création du PDF KDP en cours...');

    try {
      // Déterminer les dimensions du PDF selon le format
      const formatDimensions: Record<string, { width: number; height: number }> = {
        '6x6': { width: 152, height: 152 },
        '7x7': { width: 178, height: 178 },
        '8x8': { width: 203, height: 203 },
        '5x7': { width: 127, height: 178 },
        '8.5x8.5': { width: 216, height: 216 },
        '8.5x8.5-kdp': { width: 216, height: 216 },
        '8.5x11': { width: 216, height: 279 },
        '8x10': { width: 203, height: 254 },
        'a4': { width: 210, height: 297 },
      };

      const dimensions = formatDimensions[bookFormat] || { width: 203, height: 203 };
      const pdf = new jsPDF({
        orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [dimensions.width, dimensions.height],
      });

      const pageWidth = dimensions.width;
      const pageHeight = dimensions.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      // Titre spécifique au livre de coloriage (pas le titre générique de l'ebook)
      const coloringBookTitle = 'Mon Livre de Coloriage';
      // Supprimer les emojis du thème (non supportés par jsPDF)
      const rawThemeLabel = THEMES.find(t => t.value === theme)?.label || theme;
      const themeLabel = rawThemeLabel.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
      const currentYear = new Date().getFullYear();

      // ============================================
      // PAGE 1: PAGE DE TITRE (KDP obligatoire)
      // ============================================
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(coloringBookTitle, pageWidth / 2, pageHeight / 3, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'normal');
      pdf.text(themeLabel, pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text(`${generatedPages.length} dessins a colorier`, pageWidth / 2, pageHeight / 2, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Pour les ${ageGroup} ans`, pageWidth / 2, pageHeight / 2 + 15, { align: 'center' });

      // Décoration simple
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 20, pageHeight / 3 + 25, pageWidth - margin - 20, pageHeight / 3 + 25);

      // ============================================
      // PAGE 2: COPYRIGHT (KDP obligatoire)
      // ============================================
      pdf.addPage();
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const copyrightText = [
        `© ${currentYear} - Tous droits réservés`,
        '',
        coloringBookTitle,
        '',
        'Aucune partie de ce livre ne peut être reproduite,',
        'stockée dans un système de récupération, ou transmise',
        'sous quelque forme ou par quelque moyen que ce soit,',
        'électronique, mécanique, photocopie, enregistrement',
        'ou autre, sans l\'autorisation écrite préalable de l\'éditeur.',
        '',
        '---',
        '',
        `Format: ${BOOK_FORMATS.flatMap(c => c.formats).find(f => f.value === bookFormat)?.label || bookFormat}`,
        `Thème: ${themeLabel}`,
        `Tranche d\'âge: ${ageGroup} ans`,
        `Nombre de pages: ${generatedPages.length + 6} (dont pages légales)`,
        '',
        '---',
        '',
        'Créé avec EbookStudio Pro',
        'www.ebookstudio.fr',
      ];

      let copyrightY = pageHeight / 4;
      copyrightText.forEach(line => {
        pdf.text(line, pageWidth / 2, copyrightY, { align: 'center' });
        copyrightY += 7;
      });

      // ============================================
      // PAGE 3: PAGE TEST COULEURS (Guide pour enfants)
      // ============================================
      pdf.addPage();
      
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Teste tes Couleurs !', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Avant de commencer, essaie tes crayons ici :', pageWidth / 2, 30, { align: 'center' });

      // Collecter toutes les couleurs uniques du livre
      const allColorsForTest: Map<string, { element: string; color: string; hexCode: string }> = new Map();
      generatedPages.forEach(page => {
        page.suggestedColors.forEach(color => {
          const key = color.hexCode;
          if (!allColorsForTest.has(key)) {
            allColorsForTest.set(key, color);
          }
        });
      });

      // Dessiner des cercles à colorier avec les couleurs suggérées
      const colorsArray = Array.from(allColorsForTest.values()).slice(0, 12); // Max 12 couleurs
      const circleRadius = 12;
      const circlesPerRow = 3;
      let circleY = 50;
      let circleX = margin + 25;

      colorsArray.forEach((color, idx) => {
        // Cercle vide (contour)
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(1);
        pdf.circle(circleX, circleY, circleRadius, 'S');

        // Petit carré de référence couleur
        const hexColor = color.hexCode.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        
        pdf.setFillColor(r, g, b);
        pdf.rect(circleX + circleRadius + 5, circleY - 4, 8, 8, 'F');
        pdf.setDrawColor(50, 50, 50);
        pdf.rect(circleX + circleRadius + 5, circleY - 4, 8, 8, 'S');

        // Nom de la couleur
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(color.color, circleX + circleRadius + 16, circleY + 2);

        // Passer au suivant
        if ((idx + 1) % circlesPerRow === 0) {
          circleY += 35;
          circleX = margin + 25;
        } else {
          circleX += (contentWidth / circlesPerRow);
        }
      });

      // Instructions en bas
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Colorie chaque cercle avec la couleur indiquée !', pageWidth / 2, pageHeight - 20, { align: 'center' });

      // ============================================
      // PAGE 4: SOMMAIRE / TABLE DES MATIÈRES
      // ============================================
      pdf.addPage();
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📖 Sommaire', pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      let sommY = 35;
      const pagesPerColumn = Math.ceil(generatedPages.length / 2);
      
      generatedPages.forEach((page, idx) => {
        const colOffset = idx >= pagesPerColumn ? contentWidth / 2 : 0;
        const adjustedIdx = idx >= pagesPerColumn ? idx - pagesPerColumn : idx;
        const yOffset = sommY + (adjustedIdx * 8);
        
        if (yOffset < pageHeight - 30) {
          const pageNum = idx + 5; // Compte les pages légales avant
          pdf.text(`${idx + 1}. ${page.title.substring(0, 30)}${page.title.length > 30 ? '...' : ''}`, margin + colOffset, yOffset);
          pdf.text(`p.${pageNum}`, pageWidth - margin - colOffset - 10, yOffset, { align: 'right' });
        }
      });

      // ============================================
      // PAGES DE COLORIAGE
      // ============================================
      for (let i = 0; i < generatedPages.length; i++) {
        const page = generatedPages[i];
        pdf.addPage();

        try {
          const response = await fetch(page.imageUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          // Calculer les dimensions pour centrer l'image (laisser de la place pour les couleurs en bas)
          const colorSectionHeight = 25; // Espace pour les couleurs suggérées
          const imgSize = Math.min(contentWidth, contentHeight - colorSectionHeight - 10);
          const imgX = (pageWidth - imgSize) / 2;
          const imgY = margin - 5;

          pdf.addImage(base64, 'PNG', imgX, imgY, imgSize, imgSize);

          // ============================================
          // COULEURS SUGGÉRÉES SOUS L'IMAGE
          // ============================================
          const colorY = imgY + imgSize + 5;
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Couleurs suggerees :', margin, colorY);

          // Afficher les carrés de couleur avec les noms
          let colorX = margin;
          const colorRowY = colorY + 5;
          page.suggestedColors.slice(0, 5).forEach((color) => {
            const hexColor = color.hexCode.replace('#', '');
            const r = parseInt(hexColor.substring(0, 2), 16);
            const g = parseInt(hexColor.substring(2, 4), 16);
            const b = parseInt(hexColor.substring(4, 6), 16);
            
            // Carré de couleur
            pdf.setFillColor(r, g, b);
            pdf.rect(colorX, colorRowY, 5, 5, 'F');
            pdf.setDrawColor(100, 100, 100);
            pdf.rect(colorX, colorRowY, 5, 5, 'S');
            
            // Nom de la couleur
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.text(color.color.substring(0, 10), colorX + 6, colorRowY + 4);
            
            colorX += 35;
          });

          // Numéro de page discret en bas
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${i + 1}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        } catch (imgError) {
          console.error(`Erreur chargement image ${i}:`, imgError);
          pdf.setFontSize(12);
          pdf.text(`[Image non disponible: ${page.title}]`, pageWidth / 2, pageHeight / 2, { align: 'center' });
        }
      }

      // ============================================
      // ANNEXE: GUIDE DES COULEURS COMPLET
      // ============================================
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Guide des Couleurs', pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Retrouve ici toutes les couleurs utilisees dans ce livre !', pageWidth / 2, 30, { align: 'center' });

      // Afficher les couleurs par page
      let colorY = 45;
      generatedPages.forEach((page, pageIdx) => {
        if (colorY > pageHeight - 40) {
          pdf.addPage();
          colorY = 20;
        }

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Page ${pageIdx + 1}: ${page.title.substring(0, 40)}`, margin, colorY);
        colorY += 6;

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        
        let colorX = margin;
        page.suggestedColors.slice(0, 5).forEach((color) => {
          const hexColor = color.hexCode.replace('#', '');
          const r = parseInt(hexColor.substring(0, 2), 16);
          const g = parseInt(hexColor.substring(2, 4), 16);
          const b = parseInt(hexColor.substring(4, 6), 16);
          
          pdf.setFillColor(r, g, b);
          pdf.rect(colorX, colorY, 6, 6, 'F');
          pdf.setDrawColor(100, 100, 100);
          pdf.rect(colorX, colorY, 6, 6, 'S');
          
          pdf.text(color.element.substring(0, 12), colorX + 8, colorY + 5);
          colorX += 38;
        });
        colorY += 12;
      });

      // ============================================
      // À PROPOS DE L'AUTEUR (KDP recommandé)
      // ============================================
      pdf.addPage();
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('À Propos de ce Livre', pageWidth / 2, 25, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const aboutText = [
        `Ce livre de coloriage "${coloringBookTitle}" a ete concu`,
        `avec amour pour les enfants de ${ageGroup} ans.`,
        '',
        `Thème: ${themeLabel}`,
        `Contient ${generatedPages.length} dessins originaux`,
        '',
        '---',
        '',
        '💡 Conseils pour les parents:',
        '',
        '• Utilisez des crayons de couleur ou des feutres lavables',
        '• Laissez votre enfant choisir ses propres couleurs',
        '• Félicitez les efforts, pas seulement le résultat',
        '• Le coloriage développe la motricité fine',
        '• Coloriez ensemble pour un moment de partage',
        '',
        '---',
        '',
        '📧 Contact & Retours:',
        'Merci d\'avoir choisi ce livre !',
        'Vos avis nous aident à créer de meilleurs contenus.',
      ];

      let aboutY = 40;
      aboutText.forEach(line => {
        pdf.text(line, pageWidth / 2, aboutY, { align: 'center' });
        aboutY += 8;
      });

      // Pied de page final
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Créé avec EbookStudio Pro - www.ebookstudio.fr', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // ============================================
      // TÉLÉCHARGEMENT
      // ============================================
      const fileName = `livre-coloriage-kdp-${theme}-${Date.now()}.pdf`;
      pdf.save(fileName);

      const totalPages = generatedPages.length + 6; // 4 pages légales + guide couleurs + à propos
      toast.success(`PDF KDP exporté: ${totalPages} pages (${fileName})`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // ============================================
  // EXPORT WORD (DOCX) - Pour impression et modification
  // ============================================
  const exportToWord = async () => {
    if (generatedPages.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Création du fichier Word en cours...');

    try {
      const coloringBookTitle = 'Mon Livre de Coloriage';
      const rawThemeLabel = THEMES.find(t => t.value === theme)?.label || theme;
      const themeLabel = rawThemeLabel.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
      const currentYear = new Date().getFullYear();

      // Convertir les images en base64 pour Word
      const imageDataArray: { base64: string; width: number; height: number }[] = [];
      
      for (const page of generatedPages) {
        try {
          const response = await fetch(page.imageUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          // Extraire juste le base64 sans le préfixe data:image/...
          const base64Data = base64.split(',')[1];
          imageDataArray.push({ base64: base64Data, width: 500, height: 500 });
        } catch (err) {
          console.error('Erreur chargement image pour Word:', err);
          imageDataArray.push({ base64: '', width: 500, height: 500 });
        }
      }

      // Créer les sections du document
      const children: (Paragraph | Table)[] = [];

      // PAGE DE TITRE
      children.push(
        new Paragraph({
          text: coloringBookTitle,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: themeLabel,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: `${generatedPages.length} dessins à colorier`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: `Pour les ${ageGroup} ans`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // PAGE COPYRIGHT
      children.push(
        new Paragraph({
          text: `© ${currentYear} - Tous droits réservés`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: coloringBookTitle,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: "Aucune partie de ce livre ne peut être reproduite sans autorisation écrite préalable.",
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: `Format: ${BOOK_FORMATS.flatMap(c => c.formats).find(f => f.value === bookFormat)?.label || bookFormat}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `Thème: ${themeLabel} | Tranche d'âge: ${ageGroup} ans`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // PAGES DE COLORIAGE
      for (let i = 0; i < generatedPages.length; i++) {
        const page = generatedPages[i];
        const imgData = imageDataArray[i];

        // Titre de la page
        children.push(
          new Paragraph({
            text: page.title,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );

        // Image (si disponible)
        if (imgData.base64) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: Buffer.from(imgData.base64, 'base64'),
                  transformation: {
                    width: 450,
                    height: 450,
                  },
                  type: 'png',
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else {
          children.push(
            new Paragraph({
              text: '[Image non disponible]',
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          );
        }

        // Couleurs suggérées
        children.push(
          new Paragraph({
            text: 'Couleurs suggérées :',
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'Couleurs suggérées : ',
                bold: true,
              }),
              new TextRun({
                text: page.suggestedColors.slice(0, 5).map(c => `${c.element} (${c.color})`).join(' • '),
              }),
            ],
          })
        );

        // Saut de page
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      // PAGE À PROPOS
      children.push(
        new Paragraph({
          text: 'À Propos de ce Livre',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: `Ce livre de coloriage a été conçu pour les enfants de ${ageGroup} ans.`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: `Thème: ${themeLabel} | ${generatedPages.length} dessins originaux`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: 'Conseils pour les parents:',
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Conseils pour les parents:', bold: true })],
        }),
        new Paragraph({
          text: '• Utilisez des crayons de couleur ou des feutres lavables',
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: '• Laissez votre enfant choisir ses propres couleurs',
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: '• Le coloriage développe la motricité fine et la créativité',
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: 'Créé avec EbookStudio Pro',
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        })
      );

      // Créer le document
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720, // 0.5 inch
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children,
          },
        ],
      });

      // Exporter
      const blob = await Packer.toBlob(doc);
      const fileName = `livre-coloriage-${theme}-${Date.now()}.docx`;
      saveAs(blob, fileName);

      toast.success(`Document Word exporté: ${fileName}`);
    } catch (error) {
      console.error('Erreur export Word:', error);
      toast.error('Erreur lors de l\'export Word');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
            <Baby className="h-6 w-6" />
            Générateur de Livres de Coloriage
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              Pour Enfants
            </Badge>
          </CardTitle>
          <CardDescription>
            Créez des pages de coloriage avec des contours nets et des suggestions de couleurs pour guider les petits artistes 🎨
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Avertissement si pas de clé OpenAI */}
      {!useOpenAI && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  Clé OpenAI non configurée
                </p>
                <p className="text-sm text-muted-foreground">
                  Pour générer de vraies images de coloriage, ajoutez votre clé API OpenAI dans l'onglet <strong>Paramètres</strong>. 
                  Sans clé, des images placeholder seront affichées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-500" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Thème */}
            <div className="space-y-2">
              <Label>Thème des dessins</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un thème" />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex flex-col">
                        <span>{t.label}</span>
                        <span className="text-xs text-muted-foreground">{t.examples}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thème personnalisé */}
            {theme === 'custom' && (
              <div className="space-y-2">
                <Label>Votre thème personnalisé</Label>
                <Input
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="Ex: Princesses, Super-héros, Ferme..."
                />
              </div>
            )}

            {/* Tranche d'âge */}
            <div className="space-y-2">
              <Label>Tranche d'âge</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{age.label}</span>
                        <span className="text-xs text-muted-foreground">{age.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Complexité */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Niveau de complexité</Label>
                <Badge variant="outline">
                  {COMPLEXITY_LEVELS.find(c => c.value === complexity[0])?.label}
                </Badge>
              </div>
              <Slider
                value={complexity}
                onValueChange={setComplexity}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {COMPLEXITY_LEVELS.find(c => c.value === complexity[0])?.description}
              </p>
            </div>

            {/* Format du livre */}
            <div className="space-y-2">
              <Label>Format du livre</Label>
              <Select value={bookFormat} onValueChange={setBookFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_FORMATS.map((category) => (
                    <React.Fragment key={category.category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                        {category.category}
                      </div>
                      {category.formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{format.label}</span>
                            <span className="text-xs text-muted-foreground">{format.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                💡 Les formats cartonnés (Board Book) sont idéaux pour les 0-3 ans
              </p>
            </div>

            {/* Nombre de pages */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Nombre de pages de coloriage</Label>
                <Badge variant={numberOfPages >= 24 ? "default" : "destructive"} className={numberOfPages >= 24 ? "bg-green-500" : ""}>
                  {numberOfPages} pages {numberOfPages >= 24 ? '✓ KDP OK' : '⚠️ < 24'}
                </Badge>
              </div>
              <Slider
                value={[numberOfPages]}
                onValueChange={(v) => setNumberOfPages(v[0])}
                min={10}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="text-xs space-y-1">
                <p className={numberOfPages < 24 ? "text-destructive font-medium" : "text-muted-foreground"}>
                  {numberOfPages < 24 
                    ? `⚠️ KDP exige minimum 24 pages - il vous manque ${24 - numberOfPages} pages`
                    : `✅ Compatible KDP (${numberOfPages} pages + ~4 pages légales = ~${numberOfPages + 4} pages total)`
                  }
                </p>
                <p className="text-muted-foreground">
                  💰 Estimation: ~{(numberOfPages * 0.5).toFixed(1)}€ • 📖 Recommandé: 25-40 pages
                </p>
              </div>
            </div>

            {/* Prompt personnalisé */}
            <div className="space-y-2">
              <Label>Sujet spécifique (optionnel)</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Un chat jouant avec une pelote de laine..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-orange-500" />
              Palette de couleurs suggérée
            </CardTitle>
            <CardDescription>
              Couleurs recommandées pour ce thème
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generateColorPalette(theme, '').map((color, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{color.element}</p>
                    <p className="text-xs text-muted-foreground">{color.color}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {color.hexCode}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton de génération */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Génération en cours... {Math.round(currentProgress)}%
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Générer {numberOfPages} page(s) de coloriage
            </>
          )}
        </Button>
      </div>

      {/* Pages générées */}
      {generatedPages.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Pages générées ({generatedPages.length})
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={async () => {
                  setIsSavingProject(true);
                  const selectedTheme = THEMES.find(t => t.value === theme);
                  await saveSpecializedProject({
                    title: `Coloriage - ${selectedTheme?.label || theme}`,
                    project_type: 'coloring',
                    target_audience: ageGroup,
                    ebook_images: generatedPages.map(p => ({ url: p.imageUrl, title: p.title })),
                    number_of_chapters: generatedPages.length,
                    book_summary: customPrompt || `Livre de coloriage thème ${selectedTheme?.label || theme}`,
                  });
                  setIsSavingProject(false);
                }}
                disabled={isSavingProject || isExporting}
                variant="outline"
                className="border-violet-500 text-violet-600 hover:bg-violet-50"
              >
                {isSavingProject ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
              <Button
                onClick={exportToPDF}
                disabled={isExporting || isGenerating}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF (impression)
                  </>
                )}
              </Button>
              <Button
                onClick={exportToWord}
                disabled={isExporting || isGenerating}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Word (modifiable)
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedPages.map((page, index) => (
                <Card key={page.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-white">
                    <img
                      src={page.imageUrl}
                      alt={page.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => regeneratePage(index)}
                        disabled={isGenerating}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        asChild
                      >
                        <a href={page.imageUrl} download={`coloriage-${index + 1}.png`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-3">{page.title}</h4>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        🎨 Couleurs suggérées :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {page.suggestedColors.slice(0, 5).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="flex items-center gap-1.5 text-xs bg-muted rounded-full px-2 py-1"
                          >
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span>{color.element}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Conseils pour un livre de coloriage réussi
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• <strong>Livre cartonné (Board Book)</strong> : Idéal pour 0-3 ans, pages épaisses et résistantes, format carré recommandé</li>
                <li>• <strong>Impression</strong> : Papier épais 120-160 g/m² pour éviter que les feutres traversent</li>
                <li>• <strong>KDP Amazon</strong> : Format 8.5x8.5" carré, intérieur noir et blanc, couverture brillante</li>
                <li>• <strong>Page de test</strong> : Incluez une page avec tous les codes couleurs au début</li>
                <li>• <strong>Conseil pro</strong> : Les formats carrés (15x15, 20x20 cm) sont les plus populaires pour les tout-petits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulateur Amazon */}
      {generatedPages.length > 0 && (
        <SpecializedAmazonPreview
          productType="coloring"
          title={`Livre de Coloriage - ${THEMES.find(t => t.value === theme)?.label?.replace(/^[^\s]+\s/, '') || theme}`}
          authorName="Votre Nom"
          coverUrl={generatedPages[0]?.imageUrl}
          pageCount={generatedPages.length + 3}
          targetAudience={AGE_GROUPS.find(a => a.value === ageGroup)?.label}
          theme={theme === 'custom' ? customTheme : THEMES.find(t => t.value === theme)?.label}
        />
      )}

      {/* Outils KDP */}
      {generatedPages.length > 0 && (
        <KdpQuickTools
          productType="coloring"
          title={`Coloriage - ${THEMES.find(t => t.value === theme)?.label || theme}`}
          pageCount={generatedPages.length + 3}
          targetAudience={ageGroup}
          theme={theme === 'custom' ? customTheme : theme}
        />
      )}
    </div>
  );
};

export default EbookColoringBookGenerator;
