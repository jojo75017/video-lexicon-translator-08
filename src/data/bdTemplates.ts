// Templates de Bandes Dessinées Franco-Belges classiques
// Inspirés des grands maîtres : Hergé, Uderzo, Morris, Peyo, Franquin

export interface BDTemplate {
  id: string;
  title: string;
  style: string;
  icon: string;
  description: string;
  inspiration: string;
  genre: string;
  ageGroup: string;
  artStyle: string;
  colorMode: string;
  panelLayout: string;
  numberOfPages: number;
  mainCharacter: string;
  characterDescription: string;
  setting: string;
  storyTemplate: string;
  customPrompt: string;
  coverPrompt: string;
}

export const BD_ART_STYLES = [
  { 
    value: 'ligne-claire', 
    label: '✏️ Ligne Claire (Hergé)', 
    description: 'Style Tintin : traits nets uniformes, couleurs aplat, décors réalistes, pas d\'ombres portées',
    prompt: 'Ligne Claire style like Hergé/Tintin comics. Clean uniform black outlines of equal weight, flat solid colors without gradients, highly detailed realistic backgrounds, no hatching or crosshatching, no drop shadows, clear and precise drawing, European BD style, professional comic book quality'
  },
  { 
    value: 'uderzo', 
    label: '⚔️ Style Uderzo (Astérix)', 
    description: 'Style Astérix : personnages ronds et expressifs, décors détaillés, couleurs vives',
    prompt: 'French comic art style like Uderzo/Asterix. Round expressive characters with exaggerated features, big noses, dynamic poses, detailed period-accurate backgrounds, vibrant saturated colors, thick expressive outlines varying in weight, humorous character designs, European BD tradition'
  },
  { 
    value: 'morris', 
    label: '🤠 Style Morris (Lucky Luke)', 
    description: 'Style Lucky Luke : silhouettes allongées, Western cartoon, humour visuel',
    prompt: 'Franco-Belgian comic style like Morris/Lucky Luke. Elongated lanky character proportions, Western setting, clean cartoon lines, warm desert color palette, exaggerated comedic poses, simple but effective backgrounds, dynamic action sequences, classic BD humor style'
  },
  { 
    value: 'peyo', 
    label: '🍄 Style Peyo (Schtroumpfs)', 
    description: 'Style Schtroumpfs : petits personnages mignons, forêt enchantée, couleurs douces',
    prompt: 'Cute fantasy comic style like Peyo/Smurfs. Small adorable characters, enchanted forest settings, soft pastel colors, clean simple outlines, magical mushroom village aesthetic, gentle and whimsical atmosphere, child-friendly character designs'
  },
  { 
    value: 'franquin', 
    label: '💥 Style Franquin (Gaston)', 
    description: 'Style Gaston Lagaffe : énergie chaotique, expressions exagérées, gags visuels',
    prompt: 'Dynamic comic style like Franquin/Gaston Lagaffe or Spirou. Energetic chaotic compositions, wildly exaggerated expressions, physical comedy, detailed cluttered backgrounds, expressive thick-to-thin linework, slapstick action, European BD gag style'
  },
  { 
    value: 'bd-moderne', 
    label: '🎨 BD Moderne', 
    description: 'Style BD européenne contemporaine : aquarelle numérique, compositions cinématiques',
    prompt: 'Modern European graphic novel style. Digital watercolor textures, cinematic compositions and angles, atmospheric lighting, sophisticated color palettes, mix of detailed and minimal panels, contemporary Franco-Belgian BD aesthetic'
  },
];

export const BD_STORY_TEMPLATES = [
  {
    value: 'aventure-tintin',
    label: "🌍 Globe-Trotter (style Tintin)",
    description: "Un reporter/aventurier voyage dans un pays exotique et résout un mystère",
    structure: ['Découverte d\'un indice', 'Voyage vers l\'inconnu', 'Rencontre d\'alliés locaux', 'Piège du méchant', 'Course-poursuite', 'Révélation du complot', 'Affrontement final', 'Retour triomphal']
  },
  {
    value: 'village-gaulois',
    label: "⚔️ Village assiégé (style Astérix)",
    description: "Un petit village résiste à un envahisseur grâce à la ruse et l'humour",
    structure: ['Vie paisible au village', 'Arrivée de la menace', 'Le héros part en mission', 'Infiltration comique', 'Banquet interrompu', 'Le plan astucieux', 'Bataille épique', 'Grand banquet final']
  },
  {
    value: 'cowboy-solitaire',
    label: "🤠 Cowboy solitaire (style Lucky Luke)",
    description: "Un cow-boy rapide affronte des bandits dans le Far West",
    structure: ['Arrivée dans une ville en danger', 'Rencontre avec les bandits', 'Premier duel', 'Les bandits s\'échappent', 'Poursuite dans le désert', 'Le piège se referme', 'Duel final au soleil couchant', 'Le cow-boy repart seul']
  },
  {
    value: 'foret-enchantee',
    label: "🍄 Forêt enchantée (style Schtroumpfs)",
    description: "De petites créatures vivent des aventures dans une forêt magique",
    structure: ['Journée tranquille dans le village', 'Un personnage crée des problèmes', 'Le sage cherche une solution', 'Exploration de la forêt', 'Rencontre avec le méchant sorcier', 'Potion magique ou ruse', 'Le village est sauvé', 'Tout le monde danse']
  },
  {
    value: 'gaffeur',
    label: "💥 Le Gaffeur (style Gaston)",
    description: "Un personnage maladroit provoque des catastrophes en chaîne",
    structure: ['Le héros arrive au travail', 'Première invention ratée', 'Le patron s\'énerve', 'Tentative de réparation', 'Catastrophe en chaîne', 'Tout le bureau est sens dessus dessous', 'Solution accidentelle', 'Nouvelle idée catastrophique']
  },
  {
    value: 'enquete-policiere',
    label: "🔍 Enquête (style Blake & Mortimer)",
    description: "Deux amis enquêtent sur un mystère scientifique ou historique",
    structure: ['Découverte d\'un artefact mystérieux', 'Recherche dans les archives', 'Un ennemi dans l\'ombre', 'Piège mortel', 'Indice crucial', 'Révélation scientifique', 'Confrontation avec le cerveau', 'Le mystère est résolu']
  },
];

export const bdTemplates: Record<string, BDTemplate> = {
  'tintin-aventure': {
    id: 'tintin-aventure',
    title: 'Les Aventures du Reporter Intrépide',
    style: 'ligne-claire',
    icon: '🌍',
    description: 'Un jeune reporter globe-trotter et son fidèle compagnon voyagent à travers le monde pour démasquer des criminels.',
    inspiration: 'Tintin (Hergé)',
    genre: 'adventure',
    ageGroup: '7-10',
    artStyle: 'ligne-claire',
    colorMode: 'color',
    panelLayout: '4-panels',
    numberOfPages: 24,
    mainCharacter: 'Le Reporter',
    characterDescription: 'Jeune reporter courageux avec une houppe de cheveux caractéristique, chemise bleue, pantalon beige. Toujours accompagné de son petit chien blanc fidèle.',
    setting: 'Monde entier — villes exotiques, déserts, jungles, ports maritimes',
    storyTemplate: 'aventure-tintin',
    customPrompt: 'Un jeune reporter découvre un complot international lors d\'un voyage. Avec son fidèle chien, il traverse plusieurs pays pour résoudre le mystère. Style d\'aventure réaliste avec des moments de suspense et d\'humour.',
    coverPrompt: 'Ligne Claire comic book cover, young reporter with distinctive quiff hairstyle and small white dog, exotic adventure backdrop, clean uniform outlines, flat vivid colors, Hergé Tintin style'
  },
  'asterix-village': {
    id: 'asterix-village',
    title: 'Le Village Irréductible',
    style: 'uderzo',
    icon: '⚔️',
    description: 'Un petit village gaulois résiste encore et toujours à l\'envahisseur grâce à une potion magique et beaucoup d\'humour.',
    inspiration: 'Astérix (Goscinny & Uderzo)',
    genre: 'comedy',
    ageGroup: 'all-ages',
    artStyle: 'uderzo',
    colorMode: 'color',
    panelLayout: '6-panels',
    numberOfPages: 24,
    mainCharacter: 'Le Petit Guerrier',
    characterDescription: 'Petit guerrier malin avec un casque ailé, moustache blonde, tunique verte à ceinture. Accompagné de son grand ami costaud aimant les sangliers.',
    setting: 'Village gaulois fortifié, forêts gauloises, camps romains, Rome antique',
    storyTemplate: 'village-gaulois',
    customPrompt: 'Un petit guerrier gaulois malin et son ami géant protègent leur village contre les légions romaines. Humour basé sur les jeux de mots, les anachronismes et les bagarres comiques. Le druide prépare des potions magiques.',
    coverPrompt: 'French comic cover in Uderzo/Asterix style, small clever warrior with winged helmet and large strong friend, Gaulish village with wooden palisade, Roman soldiers in background, vibrant colors, humorous style'
  },
  'lucky-western': {
    id: 'lucky-western',
    title: 'Le Cow-Boy le Plus Rapide',
    style: 'morris',
    icon: '🤠',
    description: 'Un cow-boy solitaire qui tire plus vite que son ombre parcourt le Far West pour rétablir la justice.',
    inspiration: 'Lucky Luke (Morris)',
    genre: 'adventure',
    ageGroup: '7-10',
    artStyle: 'morris',
    colorMode: 'color',
    panelLayout: '4-panels',
    numberOfPages: 24,
    mainCharacter: 'Le Cow-Boy',
    characterDescription: 'Cow-boy élancé et longiligne, chapeau blanc, chemise jaune, gilet noir, jeans bleus. Monte un cheval blanc intelligent. Mâche toujours un brin d\'herbe.',
    setting: 'Far West américain — saloons, déserts, canyons, villes frontières poussiéreuses',
    storyTemplate: 'cowboy-solitaire',
    customPrompt: 'Un cow-boy solitaire arrive dans une ville terrorisée par des bandits. Avec son cheval intelligent et son tir ultra-rapide, il rétablit l\'ordre. Humour western avec des duels comiques et des personnages hauts en couleur.',
    coverPrompt: 'Franco-Belgian comic cover in Morris/Lucky Luke style, tall lanky cowboy with white hat on white horse, Wild West desert sunset backdrop, elongated cartoon proportions, clean lines, warm western colors'
  },
  'schtroumpfs-foret': {
    id: 'schtroumpfs-foret',
    title: 'Les Petits Êtres de la Forêt',
    style: 'peyo',
    icon: '🍄',
    description: 'De petites créatures bleues vivent dans des champignons et affrontent un méchant sorcier.',
    inspiration: 'Les Schtroumpfs (Peyo)',
    genre: 'fantasy',
    ageGroup: '4-7',
    artStyle: 'peyo',
    colorMode: 'color',
    panelLayout: '4-panels',
    numberOfPages: 16,
    mainCharacter: 'Le Petit Chef',
    characterDescription: 'Petite créature bleue avec un bonnet blanc, barbe blanche, pantalon blanc. Leader sage et bienveillant d\'un village de petits êtres bleus identiques portant des bonnets blancs.',
    setting: 'Village de champignons au cœur d\'une forêt enchantée, laboratoire du méchant sorcier',
    storyTemplate: 'foret-enchantee',
    customPrompt: 'De petites créatures bleues vivent paisiblement dans leur village de champignons. Mais un méchant sorcier et son chat essaient toujours de les capturer. Le vieux sage utilise la magie pour protéger le village.',
    coverPrompt: 'Cute fantasy comic cover in Peyo/Smurfs style, small blue creatures in mushroom village, enchanted forest, soft pastel colors, adorable character designs, child-friendly aesthetic'
  },
  'gaston-bureau': {
    id: 'gaston-bureau',
    title: 'Le Roi des Gaffes',
    style: 'franquin',
    icon: '💥',
    description: 'Un employé de bureau paresseux et inventeur provoque des catastrophes hilarantes.',
    inspiration: 'Gaston Lagaffe (Franquin)',
    genre: 'comedy',
    ageGroup: 'all-ages',
    artStyle: 'franquin',
    colorMode: 'color',
    panelLayout: '6-panels',
    numberOfPages: 12,
    mainCharacter: 'Le Gaffeur',
    characterDescription: 'Grand dadais dégingandé aux cheveux noirs en bataille, nez en trompette, pull-over vert trop large, jean délavé, espadrilles. Toujours endormi ou en train de bricoler des inventions farfelues.',
    setting: 'Bureau de rédaction d\'un journal, avec un chat de gouttière et des piles de courrier en retard',
    storyTemplate: 'gaffeur',
    customPrompt: 'Un employé de bureau inventeur et paresseux crée le chaos avec ses inventions ratées. Son patron furieux essaie de le contrôler. Chaque tentative de réparation empire la situation. Humour slapstick et gags en chaîne.',
    coverPrompt: 'Dynamic comic cover in Franquin/Gaston Lagaffe style, messy-haired office worker with chaotic inventions exploding, panicked colleagues, energetic chaotic composition, expressive linework, office comedy'
  },
  'blake-mortimer': {
    id: 'blake-mortimer',
    title: 'Le Secret du Professeur',
    style: 'ligne-claire',
    icon: '🔍',
    description: 'Un capitaine et un professeur enquêtent sur un mystère scientifique menaçant le monde.',
    inspiration: 'Blake & Mortimer (Edgar P. Jacobs)',
    genre: 'mystery',
    ageGroup: '10-14',
    artStyle: 'ligne-claire',
    colorMode: 'color',
    panelLayout: '6-panels',
    numberOfPages: 24,
    mainCharacter: 'Le Capitaine et le Professeur',
    characterDescription: 'Duo composé d\'un capitaine militaire britannique distingué (moustache, costume strict) et d\'un professeur scientifique roux avec nœud papillon. Élégants et cultivés.',
    setting: 'Londres années 50, laboratoires secrets, bases militaires souterraines, pyramides d\'Égypte',
    storyTemplate: 'enquete-policiere',
    customPrompt: 'Un capitaine et un professeur découvrent qu\'une arme secrète menace le monde. Ils doivent résoudre des énigmes scientifiques et historiques tout en échappant à un génie du mal. Suspense, science-fiction rétro et aventure.',
    coverPrompt: 'Ligne Claire comic cover in Edgar P. Jacobs/Blake & Mortimer style, distinguished British captain and red-haired professor, mysterious scientific laboratory, 1950s retro sci-fi atmosphere, dramatic lighting, detailed realistic backgrounds'
  },
  'spirou-aventure': {
    id: 'spirou-aventure',
    title: 'Le Groom Aventurier',
    style: 'franquin',
    icon: '🔔',
    description: 'Un groom d\'hôtel et son ami journaliste vivent des aventures à travers le monde.',
    inspiration: 'Spirou & Fantasio (Franquin)',
    genre: 'adventure',
    ageGroup: '7-10',
    artStyle: 'franquin',
    colorMode: 'color',
    panelLayout: '4-panels',
    numberOfPages: 24,
    mainCharacter: 'Le Groom',
    characterDescription: 'Jeune groom en uniforme rouge avec calot, dynamique et courageux. Son ami journaliste blond est plus peureux mais loyal. Accompagnés d\'un petit écureuil espiègle.',
    setting: 'Hôtel de luxe, puis aventures à travers jungles, îles et villes du monde entier',
    storyTemplate: 'aventure-tintin',
    customPrompt: 'Un groom d\'hôtel plein d\'énergie entraîne son ami journaliste peureux dans une aventure exotique. Avec leur écureuil espiègle, ils affrontent des méchants tout en découvrant des cultures fascinantes. Action, humour et amitié.',
    coverPrompt: 'Dynamic Franco-Belgian comic cover in Franquin/Spirou style, young bellhop in red uniform with blonde journalist friend and pet squirrel, exotic adventure setting, energetic composition, vibrant colors'
  },
  'boule-bill': {
    id: 'boule-bill',
    title: 'Le Garçon et son Chien',
    style: 'bd-moderne',
    icon: '🐶',
    description: 'Les aventures quotidiennes d\'un petit garçon et de son cocker espiègle.',
    inspiration: 'Boule & Bill (Roba)',
    genre: 'slice-of-life',
    ageGroup: '4-7',
    artStyle: 'bd-moderne',
    colorMode: 'color',
    panelLayout: '4-panels',
    numberOfPages: 12,
    mainCharacter: 'Le Garçon',
    characterDescription: 'Petit garçon joyeux avec une casquette rouge et un pull rayé. Son cocker roux est son meilleur ami — loyal, gourmand et farceur.',
    setting: 'Maison familiale avec jardin, parc, école, quartier résidentiel',
    storyTemplate: 'friendship',
    customPrompt: 'Un petit garçon et son chien cocker vivent des aventures quotidiennes hilarantes. Gags familiaux, bêtises au jardin, promenades chaotiques et amitié indéfectible entre un enfant et son animal.',
    coverPrompt: 'Charming Franco-Belgian comic cover, cheerful boy with red cap hugging his cocker spaniel dog, family garden setting, warm colors, cute humorous style, slice of life BD'
  },
};

export const getBDTemplate = (templateId: string): BDTemplate | undefined => {
  return bdTemplates[templateId];
};

export const getAllBDTemplates = (): BDTemplate[] => {
  return Object.values(bdTemplates);
};
