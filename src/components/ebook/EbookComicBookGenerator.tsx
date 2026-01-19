import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Layout, Download, RefreshCw, Sparkles, MessageSquare, ImagePlus, BookOpen, Wand2, FileDown, Users, Zap, Lightbulb, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';
import jsPDF from 'jspdf';

interface ComicPanel {
  id: string;
  imageUrl: string;
  dialogue: string;
  character: string;
  action: string;
}

interface ComicPage {
  id: string;
  pageNumber: number;
  panels: ComicPanel[];
  layout: string;
}

interface ComicBookGeneratorProps {
  ebookTitle?: string;
}

// Fonction pour nettoyer les emojis des textes (incompatibles avec jsPDF/Helvetica)
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  // Supprime les emojis et caractères unicode spéciaux
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Symboles divers
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation selectors
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Drapeaux
    .replace(/🏴‍☠️|🧙|🦸|🚀|😂|🔍|🐾|🏠|⚔️|✏️|🎨|🎌|🇫🇷|🇺🇸|✨|🌈|⬛|📜/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const GENRES = [
  { value: 'adventure', label: '🏴‍☠️ Aventure', examples: 'Explorateurs, trésors, voyages...' },
  { value: 'fantasy', label: '🧙 Fantaisie', examples: 'Magie, créatures, quêtes...' },
  { value: 'superhero', label: '🦸 Super-héros', examples: 'Pouvoirs, combats, sauvetages...' },
  { value: 'scifi', label: '🚀 Science-Fiction', examples: 'Espace, robots, futur...' },
  { value: 'comedy', label: '😂 Comédie', examples: 'Gags, situations drôles...' },
  { value: 'mystery', label: '🔍 Mystère', examples: 'Enquêtes, indices, secrets...' },
  { value: 'animals', label: '🐾 Animaux', examples: 'Animaux anthropomorphes...' },
  { value: 'slice-of-life', label: '🏠 Tranche de vie', examples: 'Quotidien, école, amitié...' },
  { value: 'historical', label: '⚔️ Historique', examples: 'Époques passées, légendes...' },
  { value: 'custom', label: '✏️ Personnalisé', examples: 'Votre propre genre' },
];

const AGE_GROUPS = [
  { value: '4-7', label: '4-7 ans', description: 'Histoires très simples, dialogues courts' },
  { value: '7-10', label: '7-10 ans', description: 'Aventures accessibles, vocabulaire adapté' },
  { value: '10-14', label: '10-14 ans', description: 'Histoires plus complexes, suspense' },
  { value: 'all-ages', label: 'Tout public', description: 'Contenu familial universel' },
];

const PANEL_LAYOUTS = [
  { value: '4-panels', label: '4 cases', description: 'Standard BD (2x2)', grid: [2, 2], panelsPerPage: 4 },
  { value: '6-panels', label: '6 cases', description: 'Détaillé (2x3)', grid: [2, 2, 2], panelsPerPage: 6 },
  { value: '8-panels', label: '8 cases', description: 'Riche (2x4)', grid: [2, 2, 2, 2], panelsPerPage: 8 },
  { value: '2-panels', label: '2 cases', description: 'Panoramique', grid: [1, 1], panelsPerPage: 2 },
];

const ART_STYLES = [
  { value: 'cartoon', label: '🎨 Cartoon', description: 'Style simple et coloré' },
  { value: 'manga', label: '🎌 Manga', description: 'Style japonais expressif' },
  { value: 'franco-belge', label: '🇫🇷 Franco-belge', description: 'Style classique européen' },
  { value: 'american', label: '🇺🇸 Comics américain', description: 'Style super-héros' },
  { value: 'minimal', label: '✨ Minimaliste', description: 'Lignes épurées, moderne' },
];

const COLOR_MODES = [
  { value: 'color', label: '🌈 Couleur', description: 'Illustrations en couleurs vives' },
  { value: 'bw', label: '⬛ Noir & Blanc', description: 'Style classique économique' },
  { value: 'sepia', label: '📜 Sépia', description: 'Tons vintage et nostalgiques' },
  { value: 'limited', label: '🎨 Couleurs limitées', description: '2-3 couleurs principales' },
];

const STORY_TEMPLATES = [
  { 
    value: 'hero-journey', 
    label: "Le voyage du héros",
    description: "Un personnage ordinaire vit une aventure extraordinaire",
    structure: ['Introduction du héros', 'Appel à l\'aventure', 'Défis et alliés', 'Épreuve finale', 'Retour victorieux']
  },
  { 
    value: 'rescue', 
    label: "Mission sauvetage",
    description: "Un héros doit sauver quelqu'un ou quelque chose",
    structure: ['Situation de départ', 'Le problème survient', 'Le héros agit', 'Obstacles', 'Sauvetage réussi']
  },
  { 
    value: 'mystery', 
    label: "Le mystère à résoudre",
    description: "Un mystère doit être élucidé",
    structure: ['Découverte du mystère', 'Recherche d\'indices', 'Fausses pistes', 'Révélation', 'Résolution']
  },
  { 
    value: 'competition', 
    label: "Le grand défi",
    description: "Un personnage doit remporter un défi",
    structure: ['Présentation du défi', 'Préparation', 'La compétition', 'Moment de doute', 'Victoire']
  },
  { 
    value: 'friendship', 
    label: "Nouvelle amitié",
    description: "Deux personnages deviennent amis",
    structure: ['Rencontre maladroite', 'Malentendu', 'Épreuve commune', 'Compréhension mutuelle', 'Amitié scellée']
  },
];

export const EbookComicBookGenerator: React.FC<ComicBookGeneratorProps> = ({ ebookTitle }) => {
  const [genre, setGenre] = useState('adventure');
  const [customGenre, setCustomGenre] = useState('');
  const [ageGroup, setAgeGroup] = useState('7-10');
  const [artStyle, setArtStyle] = useState('cartoon');
  const [colorMode, setColorMode] = useState('color');
  const [panelLayout, setPanelLayout] = useState('4-panels');
  const [storyTemplate, setStoryTemplate] = useState('hero-journey');
  const [numberOfPages, setNumberOfPages] = useState(12);
  const [title, setTitle] = useState(ebookTitle || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mainCharacter, setMainCharacter] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [setting, setSetting] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  // Clé OpenAI utilisateur (fallback fiable si les crédits image internes sont épuisés)
  const { apiKey: userApiKey, isValid: isUserKeyValid } = useOpenAIConfig();
  const useOpenAI = Boolean(userApiKey) && isUserKeyValid === true;
  
  // Cohérence visuelle
  const [visualSeed, setVisualSeed] = useState<string>('');
  const [characterVisualRef, setCharacterVisualRef] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatedPages, setGeneratedPages] = useState<ComicPage[]>([]);
  const [scenario, setScenario] = useState<{ pages: { description: string; dialogues: { character: string; text: string }[] }[] } | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  // Suggestions de titres
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'scenario' | 'images'>('idle');

  const getLayoutDescription = (layout: string): string => {
    const layouts: Record<string, string> = {
      '2-panels': '2 grandes cases horizontales',
      '3-panels': '3 cases verticales (style manga)',
      '4-panels': '4 cases en grille 2x2',
      '6-panels': '6 cases en grille 2x3',
    };
    return layouts[layout] || '4 cases';
  };

  // Fallback amélioré avec vraie narration
  const buildFallbackScenario = () => {
    const selectedTemplate = STORY_TEMPLATES.find(t => t.value === storyTemplate);
    const selectedGenre = GENRES.find(g => g.value === genre);
    const heroName = (mainCharacter || 'Le héros').trim();
    const baseDesc = (customPrompt || setting || '').trim();
    const bookTitle = title || 'L\'Aventure';

    // Bibliothèque de scènes variées par étape narrative
    const sceneLibrary: Record<string, { descriptions: string[]; dialogues: { char: string; texts: string[] }[] }> = {
      'Introduction du héros': {
        descriptions: [
          `${heroName} se réveille dans son monde paisible. Le soleil brille et une nouvelle journée commence.`,
          `C'est un jour ordinaire pour ${heroName}. Mais quelque chose dans l'air semble différent aujourd'hui.`,
          `${heroName} regarde par la fenêtre, rêvant d'aventures lointaines.`
        ],
        dialogues: [{ char: heroName, texts: ["Quelle belle journée !", "Je sens que quelque chose va se passer...", "Aujourd'hui sera spécial !"] }]
      },
      'Appel à l\'aventure': {
        descriptions: [
          `Un mystérieux message arrive ! ${heroName} découvre qu'une mission importante l'attend.`,
          `Un vieil ami apparaît avec des nouvelles urgentes pour ${heroName}.`,
          `Une carte au trésor tombe entre les mains de ${heroName}. L'aventure commence !`
        ],
        dialogues: [{ char: heroName, texts: ["Une mission pour moi ?", "Je dois y aller !", "C'est le moment d'agir !"] }]
      },
      'Défis et alliés': {
        descriptions: [
          `${heroName} rencontre un nouvel ami qui accepte de l'aider dans sa quête.`,
          `Un obstacle se dresse sur le chemin. ${heroName} doit faire preuve d'intelligence.`,
          `${heroName} traverse un lieu mystérieux rempli de surprises.`
        ],
        dialogues: [{ char: heroName, texts: ["Ensemble, on est plus forts !", "Je n'abandonnerai pas !", "Il doit y avoir une solution..."] }]
      },
      'Épreuve finale': {
        descriptions: [
          `Le moment décisif approche. ${heroName} fait face au plus grand défi de l'aventure.`,
          `${heroName} rassemble tout son courage pour l'épreuve finale.`,
          `C'est maintenant ou jamais ! ${heroName} donne tout ce qu'il a.`
        ],
        dialogues: [{ char: heroName, texts: ["Je peux le faire !", "Pour mes amis !", "C'est ma destinée !"] }]
      },
      'Victoire et retour': {
        descriptions: [
          `${heroName} a réussi ! La joie et la fierté illuminent son visage.`,
          `Mission accomplie ! ${heroName} rentre chez lui, changé par cette aventure.`,
          `Tout le monde célèbre la victoire de ${heroName}. C'est un jour de fête !`
        ],
        dialogues: [{ char: heroName, texts: ["On a réussi !", "Quelle aventure incroyable !", "Je suis prêt pour la prochaine !"] }]
      }
    };

    // Structure par défaut
    const defaultSteps = ['Introduction du héros', 'Appel à l\'aventure', 'Défis et alliés', 'Épreuve finale', 'Victoire et retour'];
    const steps = selectedTemplate?.structure?.length ? selectedTemplate.structure : defaultSteps;

    const pages = Array.from({ length: numberOfPages }, (_, i) => {
      const stepIndex = Math.min(steps.length - 1, Math.floor((i / Math.max(1, numberOfPages - 1)) * steps.length));
      const step = steps[stepIndex];
      const pageNumber = i + 1;

      // Trouver la scène correspondante ou fallback
      const scene = sceneLibrary[step] || sceneLibrary[defaultSteps[Math.min(stepIndex, defaultSteps.length - 1)]];
      const descIndex = i % scene.descriptions.length;
      const dialogueIndex = i % scene.dialogues[0].texts.length;

      // Description variée avec contexte du titre
      const description = `Page ${pageNumber} — ${step}. ${scene.descriptions[descIndex]} ${baseDesc ? `(${baseDesc})` : ''} [Style: ${selectedGenre?.label || 'Aventure'}]`.trim();

      // Dialogues variés
      const dialogues = [
        { character: heroName, text: scene.dialogues[0].texts[dialogueIndex] },
      ];

      // Ajouter un second personnage occasionnellement
      if (i > 0 && i < numberOfPages - 1 && i % 3 === 0) {
        dialogues.push({ character: 'Ami', text: 'Je suis avec toi !' });
      }

      return { description, dialogues };
    });

    return { pages };
  };

  // Générer 10 idées de titres via IA
  const generateTitleIdeas = async () => {
    setIsGeneratingTitles(true);
    setTitleSuggestions([]);

    try {
      const selectedGenre = GENRES.find(g => g.value === genre);
      const selectedAge = AGE_GROUPS.find(a => a.value === ageGroup);

      const prompt = `Tu es un expert en bandes dessinées pour enfants. Génère exactement 10 titres accrocheurs et originaux pour une BD.

PARAMÈTRES:
- Genre: ${selectedGenre?.label || 'Aventure'}
- Public: ${selectedAge?.label || '7-10 ans'}
${mainCharacter ? `- Personnage principal suggéré: ${mainCharacter}` : ''}

CONSIGNES:
- Titres courts (3-6 mots max)
- Accrocheurs et mémorables
- Adaptés aux enfants
- Variés en style et thème

Réponds UNIQUEMENT avec un tableau JSON de 10 strings, sans explication:
["Titre 1", "Titre 2", ...]`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'comic-scenario',
          prompt,
        }
      });

      if (error) throw error;

      // Parser la réponse JSON
      const content = data?.content || data?.scenario || '';
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      
      if (jsonMatch) {
        const titles = JSON.parse(jsonMatch[0]);
        if (Array.isArray(titles) && titles.length > 0) {
          setTitleSuggestions(titles.slice(0, 10));
          toast.success('10 idées de titres générées !');
        } else {
          throw new Error('Format invalide');
        }
      } else {
        // Fallback: générer des titres par défaut
        const fallbackTitles = [
          "Les Aventures de Max",
          "L'Île aux Trésors Magiques",
          "Super Chat contre le Mal",
          "Le Mystère de la Forêt Enchantée",
          "Les Héros de l'École",
          "Mission Espace Infini",
          "Le Dragon et la Princesse",
          "L'Incroyable Voyage de Luna",
          "Les Détectives en Herbe",
          "Le Secret du Château"
        ];
        setTitleSuggestions(fallbackTitles);
        toast.info('Voici quelques idées de titres !');
      }
    } catch (err) {
      console.error('Erreur génération titres:', err);
      // Fallback en cas d'erreur
      const fallbackTitles = [
        "Les Aventures de Max",
        "L'Île aux Trésors Magiques",
        "Super Chat contre le Mal",
        "Le Mystère de la Forêt Enchantée",
        "Les Héros de l'École",
        "Mission Espace Infini",
        "Le Dragon et la Princesse",
        "L'Incroyable Voyage de Luna",
        "Les Détectives en Herbe",
        "Le Secret du Château"
      ];
      setTitleSuggestions(fallbackTitles);
      toast.info('Voici quelques idées de titres !');
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateScenario = async () => {
    // Objectif: avec JUSTE un titre, tout doit fonctionner - description auto-générée
    if (!title.trim()) {
      toast.error('Veuillez renseigner un titre pour votre BD');
      return;
    }

    setIsGeneratingScenario(true);

    try {
      const selectedTemplate = STORY_TEMPLATES.find(t => t.value === storyTemplate);
      const selectedGenre = GENRES.find(g => g.value === genre);
      const selectedAge = AGE_GROUPS.find(a => a.value === ageGroup);

      const heroName = (mainCharacter || 'Le héros').trim();
      
      // Auto-générer la description si non fournie
      const autoDescription = customPrompt?.trim() || `Une aventure captivante intitulée "${title}" dans un style ${selectedGenre?.label || 'aventure'} pour ${selectedAge?.label || 'enfants'}`;

      const prompt = `Tu es un scénariste de bandes dessinées pour enfants. Crée un scénario de BD en ${numberOfPages} pages.

INFORMATIONS:
- Titre: "${title}"
- Description: ${autoDescription}
- Genre: ${selectedGenre?.label || genre}
- Public: ${selectedAge?.label} (${selectedAge?.description})
- Personnage principal: ${heroName}
${characterDescription ? `- Description du personnage: ${characterDescription}` : ''}
${setting ? `- Univers/Décor: ${setting}` : ''}
- Structure narrative: ${selectedTemplate?.label} - ${selectedTemplate?.structure?.join(' → ')}

MISSION: À partir du titre "${title}", invente une histoire complète et captivante. Crée les personnages, les péripéties, les dialogues.

Pour chaque page, fournis:
1. Une description visuelle détaillée de la scène (pour générer l'image)
2. Les dialogues des personnages (bulles de texte)

IMPORTANT: Les dialogues doivent être courts et adaptés à l'âge cible. Maximum 2-3 bulles par page.

Réponds en JSON avec ce format exact:
{
  "pages": [
    {
      "description": "Description visuelle détaillée de la scène...",
      "dialogues": [
        { "character": "Nom du personnage", "text": "Ce qu'il dit..." }
      ]
    }
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'comic-scenario',
          prompt,
          // Passer la clé OpenAI utilisateur pour éviter les limites Lovable AI
          useOpenAI: useOpenAI,
          openaiApiKey: userApiKey || undefined,
        }
      });

      // Fallback sans IA si crédits épuisés / erreur
      if (error) {
        const status = (error as any)?.status;
        const message = (error as any)?.message || '';
        if (status === 402 || String(message).includes('Crédits')) {
          const fallback = buildFallbackScenario();
          setScenario(fallback);
          toast.warning('Crédits IA épuisés : scénario de base généré automatiquement.');
          return;
        }
        throw error;
      }

      let parsedScenario;
      try {
        const content = data.content || data.text || data;
        const jsonMatch = String(content).match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedScenario = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Format JSON invalide');
        }
      } catch {
        // Si l'IA renvoie un JSON imparfait, on ne bloque pas : on génère un scénario de base.
        const fallback = buildFallbackScenario();
        setScenario(fallback);
        toast.warning('Scénario IA difficile à parser : scénario de base généré automatiquement.');
        return;
      }

      setScenario(parsedScenario);
      toast.success(`Scénario de ${parsedScenario.pages.length} pages généré !`);

    } catch (error: any) {
      console.error('Erreur génération scénario:', error);
      toast.error('Erreur lors de la génération du scénario', {
        description: error?.message ? String(error.message) : undefined,
      });
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  // Générer une description visuelle cohérente du personnage avec détails précis
  const generateVisualReference = (): string => {
    if (characterVisualRef) return characterVisualRef;
    
    const selectedStyle = ART_STYLES.find(s => s.value === artStyle);
    const heroName = mainCharacter || 'Le héros';
    const heroDesc = characterDescription || 'personnage principal sympathique';
    
    // Créer une référence visuelle TRÈS détaillée pour cohérence
    const newRef = `
=== CHARACTER SHEET - MUST MATCH EXACTLY ON ALL PANELS ===
CHARACTER: ${heroName}
APPEARANCE: ${heroDesc}
ART STYLE: ${selectedStyle?.description || 'cartoon style'} - SAME STYLE ON ALL IMAGES
LINE WEIGHT: Medium, consistent black outlines
PROPORTIONS: Keep exact same head-to-body ratio
OUTFIT: Same clothing colors and design throughout
EXPRESSION STYLE: ${artStyle === 'manga' ? 'Large expressive eyes, anime style' : 'Western cartoon proportions'}
===`;
    
    setCharacterVisualRef(newRef);
    return newRef;
  };

  const getColorModePrompt = (): string => {
    const modes: Record<string, string> = {
      'color': 'Vibrant saturated colors, rich warm palette, cel-shaded coloring, consistent lighting from top-left',
      'bw': 'Pure black and white, strong contrast, detailed ink hatching, no gray tones, bold linework',
      'sepia': 'Warm sepia tones only (browns, creams, tans), vintage paper texture feel, nostalgic coloring',
      'limited': 'Duotone or tritone, 2-3 spot colors maximum on neutral gray/beige background, graphic novel style'
    };
    return modes[colorMode] || modes['color'];
  };

  const getArtStylePrompt = (): string => {
    const styles: Record<string, string> = {
      'cartoon': 'Disney/Pixar inspired cartoon style, rounded shapes, big eyes, exaggerated expressions, clean vector-like lines',
      'manga': 'Japanese manga style, screentones, speed lines, large expressive eyes, dynamic poses, thin precise linework',
      'franco-belge': 'Franco-Belgian BD style like Tintin or Asterix, ligne claire, flat colors, detailed backgrounds, realistic proportions',
      'american': 'American superhero comic style, dramatic shading, muscular forms, dynamic action poses, bold inking',
      'minimal': 'Minimalist illustration, simple geometric shapes, limited details, lots of white space, modern clean aesthetic'
    };
    return styles[artStyle] || styles['cartoon'];
  };

  const generateComicPage = async (pageIndex: number, pageScenario: { description: string; dialogues: { character: string; text: string }[] }): Promise<ComicPage | null> => {
    try {
      const selectedStyle = ART_STYLES.find(s => s.value === artStyle);
      const selectedGenre = GENRES.find(g => g.value === genre);
      const visualRef = generateVisualReference();
      const colorPrompt = getColorModePrompt();

      // Seed visuel pour cohérence
      const seedInfo = visualSeed ? `[SEED:${visualSeed}] ` : '';

      // Nombre de panels selon le layout choisi
      const selectedLayout = PANEL_LAYOUTS.find(l => l.value === panelLayout);
      const panelCount = selectedLayout?.panelsPerPage || 4;
      const panelPromises: Promise<{ imageUrl: string; dialogue: string; character: string; action: string } | null>[] = [];

      // Diviser la description en moments distincts selon le nombre de panels
      const baseMoments = [
        `Scene establishing shot: ${pageScenario.description} - Introduction of the scene, wide or medium angle`,
        `Action beat: ${pageScenario.description} - Main action, character close-up or medium shot`,
        `Dramatic moment: ${pageScenario.description} - Peak tension, dynamic angle or close-up on expression`,
        `Resolution: ${pageScenario.description} - Scene conclusion, reaction shot or establishing return`,
        `Character reaction: ${pageScenario.description} - Emotional close-up showing character feelings`,
        `Environment detail: ${pageScenario.description} - Background or setting establishing context`,
        `Secondary action: ${pageScenario.description} - Supporting action or secondary character`,
        `Transition: ${pageScenario.description} - Bridge to next scene, movement or time passing`
      ];
      const sceneMoments = baseMoments.slice(0, panelCount);

      const artStylePrompt = getArtStylePrompt();

      // Génération SÉQUENTIELLE des panels pour éviter les erreurs de rate-limit
      const panels: ComicPanel[] = [];
      
      for (let panelIndex = 0; panelIndex < panelCount; panelIndex++) {
        const dialogue = pageScenario.dialogues[panelIndex] || { character: mainCharacter, text: '' };
        
        // Construire le texte de la bulle de dialogue
        const dialogueText = dialogue.text ? dialogue.text.substring(0, 60) : '';
        const hasSpeechBubble = dialogueText.length > 0;
        
        // Prompt ultra-détaillé avec bulles de dialogue INTÉGRÉES dans l'image
        const imagePrompt = `${seedInfo}SINGLE COMIC PANEL WITH SPEECH BUBBLE - Panel ${panelIndex + 1} of ${panelCount}

=== MANDATORY STYLE RULES ===
${artStylePrompt}
${colorPrompt}
${visualRef}

=== THIS PANEL ===
${sceneMoments[panelIndex]}

${hasSpeechBubble ? `=== SPEECH BUBBLE (MUST BE INCLUDED) ===
- Draw a WHITE speech bubble with BLACK outline pointing to the character
- Inside the bubble, write in clear readable text: "${dialogueText}"
- Position the bubble in the TOP portion of the panel, not covering the character's face
- Use simple, clean comic book lettering style
- The bubble tail points toward the speaking character` : '=== NO DIALOGUE ===\n- This panel has no speech bubble, pure action scene'}

=== TECHNICAL REQUIREMENTS ===
- Single square illustration, professional comic art quality
- Child-friendly, age-appropriate content
- ${hasSpeechBubble ? 'INCLUDE the speech bubble with the exact text above' : 'No text in this panel'}
- Clean panel composition with clear focal point
- Consistent perspective and lighting with other panels
- Same exact character design as reference sheet above

=== CONSISTENCY CHECKLIST ===
✓ Same character proportions and outfit
✓ Same art style and line weight  
✓ Same color palette and saturation
✓ Same lighting direction (top-left)
✓ Same level of background detail
${hasSpeechBubble ? '✓ Speech bubble clearly readable with correct text' : ''}`;

        try {
          // Délai entre les appels pour éviter le rate-limiting (sauf premier panel)
          if (panelIndex > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

          const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-chapter-images', {
            body: {
              chapterTitle: `Page ${pageIndex + 1} Panel ${panelIndex + 1}`,
              ebookTitle: title || 'Bande Dessinée',
              style: artStylePrompt,
              ratio: 'square',
              quality: 'hd',
              colorScheme: colorMode === 'bw' ? 'monochrome' : colorMode,
              customPrompt: imagePrompt,
              seed: visualSeed || undefined,
              useOpenAI,
              openaiApiKey: useOpenAI ? userApiKey : undefined,
            }
          });

          if (imageError) throw imageError;

          const url = imageData?.imageUrl || imageData?.url || '';
          if (url.includes('placehold.co')) {
            toast.warning('Images de BD en mode dégradé. Ajoutez votre clé OpenAI dans Paramètres.', { duration: 4000 });
          }

          panels.push({
            id: `panel-${pageIndex}-${panelIndex}`,
            imageUrl: url,
            dialogue: dialogue.text,
            character: dialogue.character,
            action: sceneMoments[panelIndex]
          });

          // Mise à jour de progression par panel
          const progressPerPanel = 100 / (panelCount * scenario!.pages.length);
          setCurrentProgress(prev => Math.min(prev + progressPerPanel / 2, 95));

        } catch (err) {
          console.error(`Erreur panel ${panelIndex + 1}:`, err);
          // En cas d'erreur, ajouter un placeholder au lieu de rien
          panels.push({
            id: `panel-${pageIndex}-${panelIndex}`,
            imageUrl: '',
            dialogue: dialogue.text,
            character: dialogue.character,
            action: sceneMoments[panelIndex]
          });
        }
      }

      // Générer seed si première page
      if (pageIndex === 0 && !visualSeed) {
        setVisualSeed(`comic-${Date.now()}`);
      }

      return {
        id: `page-${pageIndex}`,
        pageNumber: pageIndex + 1,
        panels,
        layout: panelLayout
      };

    } catch (error) {
      console.error(`Erreur page ${pageIndex + 1}:`, error);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!scenario || scenario.pages.length === 0) {
      toast.error('Veuillez d\'abord générer le scénario');
      return;
    }

    setIsGenerating(true);
    setGeneratedPages([]);
    setCurrentProgress(0);

    const BATCH_SIZE = 3;
    const totalPages = scenario.pages.length;
    const allPages: ComicPage[] = [];

    toast.info(`Génération de ${totalPages} pages de BD...`);

    try {
      for (let batchStart = 0; batchStart < totalPages; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalPages);
        const batchPromises: Promise<ComicPage | null>[] = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batchPromises.push(generateComicPage(i, scenario.pages[i]));
        }

        const batchResults = await Promise.all(batchPromises);
        
        const successfulPages = batchResults.filter((p): p is ComicPage => p !== null);
        allPages.push(...successfulPages);
        setGeneratedPages([...allPages]);
        setCurrentProgress(Math.round((batchEnd / totalPages) * 100));
      }

      toast.success(`${allPages.length} pages de BD générées avec succès !`);

    } catch (error) {
      console.error('Erreur génération BD:', error);
      toast.error('Erreur lors de la génération des pages');
    } finally {
      setIsGenerating(false);
      setCurrentProgress(100);
      setGenerationStep('idle');
    }
  };

  // NOUVEAU: Générer tout en un clic (scénario + images)
  const handleGenerateAll = async () => {
    if (!title.trim()) {
      toast.error('Veuillez renseigner un titre pour votre BD');
      return;
    }

    setIsGeneratingAll(true);
    setGenerationStep('scenario');
    setGeneratedPages([]);
    setCurrentProgress(0);

    try {
      // Étape 1: Générer le scénario
      toast.info('🎬 Étape 1/2 : Écriture du scénario...');
      
      const selectedTemplate = STORY_TEMPLATES.find(t => t.value === storyTemplate);
      const selectedGenre = GENRES.find(g => g.value === genre);
      const selectedAge = AGE_GROUPS.find(a => a.value === ageGroup);
      const heroName = (mainCharacter || 'Le héros').trim();
      const autoDescription = customPrompt?.trim() || `Une aventure captivante intitulée "${title}" dans un style ${selectedGenre?.label || 'aventure'} pour ${selectedAge?.label || 'enfants'}`;

      const prompt = `Tu es un scénariste de bandes dessinées pour enfants. Crée un scénario de BD en ${numberOfPages} pages.

INFORMATIONS:
- Titre: "${title}"
- Description: ${autoDescription}
- Genre: ${selectedGenre?.label || genre}
- Public: ${selectedAge?.label} (${selectedAge?.description})
- Personnage principal: ${heroName}
${characterDescription ? `- Description du personnage: ${characterDescription}` : ''}
${setting ? `- Univers/Décor: ${setting}` : ''}
- Structure narrative: ${selectedTemplate?.label} - ${selectedTemplate?.structure?.join(' → ')}

MISSION: À partir du titre "${title}", invente une histoire complète et captivante. Crée les personnages, les péripéties, les dialogues.

Pour chaque page, fournis:
1. Une description visuelle détaillée de la scène (pour générer l'image)
2. Les dialogues des personnages (bulles de texte)

Réponds en JSON:
{
  "pages": [
    {
      "description": "Description visuelle...",
      "dialogues": [{ "character": "Nom", "text": "Ce qu'il dit" }]
    }
  ]
}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'comic-scenario', prompt }
      });

      let generatedScenario: { pages: { description: string; dialogues: { character: string; text: string }[] }[] };

      if (error || !data?.content) {
        console.warn('Scénario IA échoué, utilisation du fallback');
        generatedScenario = buildFallbackScenario();
      } else {
        try {
          let content = data.content;
          const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*"pages"[\s\S]*\}/);
          if (jsonMatch) {
            content = jsonMatch[1] || jsonMatch[0];
          }
          generatedScenario = JSON.parse(content);
        } catch {
          generatedScenario = buildFallbackScenario();
        }
      }

      if (!generatedScenario?.pages?.length) {
        generatedScenario = buildFallbackScenario();
      }

      setScenario(generatedScenario);
      toast.success(`✅ Scénario de ${generatedScenario.pages.length} pages prêt !`);

      // Étape 2: Générer les images
      setGenerationStep('images');
      toast.info('🎨 Étape 2/2 : Génération des illustrations...');

      const BATCH_SIZE = 3;
      const totalPages = generatedScenario.pages.length;
      const allPages: ComicPage[] = [];

      for (let batchStart = 0; batchStart < totalPages; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, totalPages);
        const batchPromises: Promise<ComicPage | null>[] = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batchPromises.push(generateComicPage(i, generatedScenario.pages[i]));
        }

        const batchResults = await Promise.all(batchPromises);
        const successfulPages = batchResults.filter((p): p is ComicPage => p !== null);
        allPages.push(...successfulPages);
        setGeneratedPages([...allPages]);
        setCurrentProgress(Math.round((batchEnd / totalPages) * 100));
      }

      toast.success(`🎉 BD complète générée : ${allPages.length} pages !`);

    } catch (error: any) {
      console.error('Erreur génération complète:', error);
      toast.error('Erreur lors de la génération', {
        description: error?.message || 'Veuillez réessayer'
      });
    } finally {
      setIsGeneratingAll(false);
      setGenerationStep('idle');
      setCurrentProgress(100);
    }
  };

  const exportToPDF = async () => {
    if (generatedPages.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    toast.info('Création du PDF en cours...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [215.9, 279.4] // Letter format
      });

      const pageWidth = 215.9;
      const pageHeight = 279.4;
      const margin = 15;

      // ===== PAGE DE TITRE =====
      pdf.setFillColor(45, 45, 60);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Titre
      pdf.setTextColor(255, 215, 0);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(title || 'Ma Bande Dessinée', pageWidth - 40);
      pdf.text(titleLines, pageWidth / 2, 80, { align: 'center' });

      // Sous-titre
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(16);
      pdf.text(`Une aventure de ${mainCharacter}`, pageWidth / 2, 110, { align: 'center' });

      // Genre et style (nettoyé des emojis)
      const selectedGenre = GENRES.find(g => g.value === genre);
      const selectedStyle = ART_STYLES.find(s => s.value === artStyle);
      const cleanGenre = cleanTextForPDF(selectedGenre?.label || '');
      const cleanStyle = cleanTextForPDF(selectedStyle?.label || '');
      pdf.setFontSize(12);
      pdf.text(`${cleanGenre} - ${cleanStyle}`, pageWidth / 2, 130, { align: 'center' });

      // ===== PAGE COPYRIGHT =====
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Mentions légales', margin, 40);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const copyrightText = [
        `© ${new Date().getFullYear()} - Tous droits réservés`,
        '',
        `Titre : ${title}`,
        `Créé avec EbookStudio Pro`,
        '',
        'Ce livre est une œuvre de fiction générée par intelligence artificielle.',
        'Toute ressemblance avec des personnes réelles serait fortuite.',
        '',
        `Nombre de pages : ${generatedPages.length + 4}`,
        `Genre : ${cleanTextForPDF(selectedGenre?.label || genre)}`,
        `Style artistique : ${cleanTextForPDF(selectedStyle?.label || artStyle)}`,
      ];
      let yPos = 55;
      copyrightText.forEach(line => {
        pdf.text(line, margin, yPos);
        yPos += 6;
      });

      // ===== PAGES DE BD - GRILLE DYNAMIQUE SELON LE LAYOUT =====
      const selectedLayout = PANEL_LAYOUTS.find(l => l.value === panelLayout);
      const panelsPerPage = selectedLayout?.panelsPerPage || 4;
      
      for (let i = 0; i < generatedPages.length; i++) {
        const page = generatedPages[i];
        pdf.addPage();

        // Calcul des dimensions selon le nombre de panels
        let cols = 2;
        let rows = Math.ceil(panelsPerPage / 2);
        
        const gap = 4;
        const panelWidth = (pageWidth - (margin * 2) - gap) / cols;
        const dialogueSpace = 15; // Espace pour les dialogues
        const panelHeight = (pageHeight - (margin * 2) - (rows * dialogueSpace) - ((rows - 1) * gap)) / rows;

        // Générer les positions pour chaque panel
        const positions: { x: number; y: number }[] = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (positions.length < panelsPerPage) {
              positions.push({
                x: margin + col * (panelWidth + gap),
                y: margin + row * (panelHeight + dialogueSpace + gap)
              });
            }
          }
        }

        // Dessiner les cases avec images et dialogues
        for (let panelIdx = 0; panelIdx < panelsPerPage; panelIdx++) {
          const panel = page.panels[panelIdx];
          const pos = positions[panelIdx];
          if (!pos) continue;

          // Bordure de la case
          pdf.setDrawColor(30, 30, 30);
          pdf.setLineWidth(1);
          pdf.rect(pos.x, pos.y, panelWidth, panelHeight, 'S');

          // Image dans la case
          if (panel?.imageUrl) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                setTimeout(reject, 10000); // Timeout 10s
                img.src = panel.imageUrl;
              });

              pdf.addImage(img, 'JPEG', pos.x + 1, pos.y + 1, panelWidth - 2, panelHeight - 2);
            } catch (imgError) {
              console.error(`Erreur image case ${panelIdx + 1}:`, imgError);
              pdf.setFillColor(245, 245, 245);
              pdf.rect(pos.x + 1, pos.y + 1, panelWidth - 2, panelHeight - 2, 'F');
              pdf.setFontSize(8);
              pdf.setTextColor(150, 150, 150);
              pdf.text('Image non disponible', pos.x + panelWidth / 2, pos.y + panelHeight / 2, { align: 'center' });
            }
          } else {
            // Placeholder si pas d'image
            pdf.setFillColor(250, 250, 250);
            pdf.rect(pos.x + 1, pos.y + 1, panelWidth - 2, panelHeight - 2, 'F');
          }

          // Bulle de dialogue sous la case (plus compacte pour les layouts denses)
          if (panel?.dialogue) {
            const bubbleY = pos.y + panelHeight + 1;
            const bubbleHeight = panelsPerPage > 4 ? 12 : 14;
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(pos.x, bubbleY, panelWidth, bubbleHeight, 2, 2, 'FD');
            
            pdf.setFontSize(panelsPerPage > 6 ? 6 : 7);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(50, 50, 150);
            pdf.text(`${cleanTextForPDF(panel.character)}:`, pos.x + 2, bubbleY + (panelsPerPage > 6 ? 4 : 5));
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(30, 30, 30);
            const maxDialogueWidth = panelWidth - 20;
            const dialogueLines = pdf.splitTextToSize(cleanTextForPDF(panel.dialogue), maxDialogueWidth);
            pdf.text(dialogueLines[0] || '', pos.x + 18, bubbleY + (panelsPerPage > 6 ? 4 : 5));
            if (dialogueLines[1] && panelsPerPage <= 6) {
              pdf.text(dialogueLines[1].substring(0, 30) + (dialogueLines[1].length > 30 ? '...' : ''), pos.x + 2, bubbleY + 10);
            }
          }
        }

        // Numéro de page en bas
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`- ${i + 1} -`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // ===== PAGE FIN =====
      pdf.addPage();
      pdf.setFillColor(45, 45, 60);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setTextColor(255, 215, 0);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FIN', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });

      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(14);
      pdf.text(`Merci d'avoir lu "${title}"`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('Créé avec EbookStudio Pro', pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });

      // Sauvegarde
      const fileName = `BD_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      pdf.save(fileName);

      toast.success(`BD exportée: ${generatedPages.length + 4} pages !`);

    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const regeneratePage = async (pageIndex: number) => {
    if (!scenario || !scenario.pages[pageIndex]) {
      toast.error('Scénario manquant pour cette page');
      return;
    }

    toast.info(`Régénération de la page ${pageIndex + 1}...`);

    const newPage = await generateComicPage(pageIndex, scenario.pages[pageIndex]);
    if (newPage) {
      const updatedPages = [...generatedPages];
      const existingIndex = updatedPages.findIndex(p => p.pageNumber === pageIndex + 1);
      if (existingIndex >= 0) {
        updatedPages[existingIndex] = newPage;
      } else {
        updatedPages.push(newPage);
      }
      setGeneratedPages(updatedPages);
      toast.success(`Page ${pageIndex + 1} régénérée !`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Générateur de Bandes Dessinées
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    2026
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Créez des BD complètes avec scénario IA et illustrations automatiques
                </CardDescription>
              </div>
            </div>
            
            {/* Compteur de pages */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={colorMode === 'bw' ? 'bg-gray-100 border-gray-400' : 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300'}>
                  {COLOR_MODES.find(c => c.value === colorMode)?.label || '🌈 Couleur'}
                </Badge>
                <Badge variant="outline" className="bg-amber-50 border-amber-300 text-amber-700">
                  {numberOfPages} pages BD
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Total PDF: ~{numberOfPages + 4} pages (avec légales)
              </p>
              {visualSeed && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Cohérence visuelle active
                </p>
              )}
            </div>
          </div>
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
                  Pour générer de vraies images de BD, ajoutez votre clé API OpenAI dans l'onglet <strong>Paramètres</strong>. 
                  Sans clé, des images placeholder seront affichées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche - Paramètres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-amber-500" />
              Configuration de l'histoire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Titre */}
            <div className="space-y-2">
              <Label>Titre de la BD *</Label>
              <div className="flex gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Les Aventures de Super Chat"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateTitleIdeas}
                  disabled={isGeneratingTitles}
                  className="shrink-0"
                >
                  {isGeneratingTitles ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Idées
                    </>
                  )}
                </Button>
              </div>
              
              {/* Suggestions de titres */}
              {titleSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {titleSuggestions.map((suggestion, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-amber-500/20 hover:border-amber-500 transition-colors text-xs"
                      onClick={() => {
                        setTitle(suggestion);
                        toast.success(`Titre sélectionné : ${suggestion}`);
                      }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Options essentielles VISIBLES - Couleur et Format */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-lg border border-amber-200/50">
              {/* Mode couleur - VISIBLE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="text-lg">🎨</span> Style couleur
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_MODES.map(mode => (
                    <Button
                      key={mode.value}
                      type="button"
                      variant={colorMode === mode.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorMode(mode.value)}
                      className={colorMode === mode.value 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                        : "hover:bg-amber-50"}
                    >
                      {mode.label.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Nombre de cases - VISIBLE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="text-lg">📐</span> Cases par page
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {PANEL_LAYOUTS.map(layout => (
                    <Button
                      key={layout.value}
                      type="button"
                      variant={panelLayout === layout.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPanelLayout(layout.value)}
                      className={panelLayout === layout.value 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
                        : "hover:bg-blue-50"}
                    >
                      {layout.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nombre de pages - VISIBLE */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <span className="text-lg">📖</span> Nombre de pages
                </Label>
                <Badge variant="secondary" className="text-lg font-bold">
                  {numberOfPages} pages
                </Badge>
              </div>
              <Slider
                value={[numberOfPages]}
                onValueChange={(val) => setNumberOfPages(val[0])}
                min={6}
                max={24}
                step={2}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6 pages (court)</span>
                <span>📚 {numberOfPages * (PANEL_LAYOUTS.find(l => l.value === panelLayout)?.panelsPerPage || 4)} images au total</span>
                <span>24 pages (long)</span>
              </div>
            </div>

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Personnaliser personnages, univers, style artistique…
                </p>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    {showAdvanced ? 'Masquer options' : '⚙️ Plus d\'options'}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="space-y-4 mt-4">
                {/* Genre */}
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map(g => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label} - {g.examples}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {genre === 'custom' && (
                    <Input
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="Décrivez votre genre..."
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Personnage principal */}
                <div className="space-y-2">
                  <Label>Personnage principal (optionnel)</Label>
                  <Input
                    value={mainCharacter}
                    onChange={(e) => setMainCharacter(e.target.value)}
                    placeholder="Ex: Luna (sinon on mettra 'Le héros')"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description du personnage</Label>
                  <Textarea
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="Ex: Un petit chat blanc avec des yeux bleus et un collier étoilé..."
                    rows={2}
                  />
                </div>

                {/* Univers */}
                <div className="space-y-2">
                  <Label>Univers / Décor</Label>
                  <Input
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    placeholder="Ex: Une ville fantastique dans les nuages"
                  />
                </div>

                {/* Public cible */}
                <div className="space-y-2">
                  <Label>Public cible</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGE_GROUPS.map(age => (
                        <SelectItem key={age.value} value={age.value}>
                          {age.label} - {age.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Petite description (optionnelle) */}
                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Optionnel : précisez une idée si vous voulez, sinon l'IA invente tout !"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Laissez vide = l'IA crée l'histoire à partir du titre
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60" />

                {/* Style et structure (options avancées) */}
                <div className="space-y-2">
                  <Label>Structure narrative</Label>
                  <Select value={storyTemplate} onValueChange={setStoryTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORY_TEMPLATES.map(template => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label} - {template.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {storyTemplate && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        {STORY_TEMPLATES.find(t => t.value === storyTemplate)?.structure?.join(' → ')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Style artistique</Label>
                  <Select value={artStyle} onValueChange={setArtStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ART_STYLES.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label} - {style.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mode couleur et disposition déjà visibles au-dessus - supprimés ici */}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>


      {/* Actions */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Bouton principal: Générer tout */}
            <Button
              onClick={handleGenerateAll}
              disabled={isGeneratingAll || isGenerating || isGeneratingScenario || !title.trim()}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold shadow-lg"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {generationStep === 'scenario' ? 'Scénario...' : `Images... ${currentProgress}%`}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  🚀 Générer tout en 1 clic
                </>
              )}
            </Button>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">ou étape par étape :</span>
              <Button
                onClick={generateScenario}
                disabled={isGeneratingScenario || isGenerating || isGeneratingAll}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {isGeneratingScenario ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <MessageSquare className="mr-1 h-3 w-3" />
                )}
                Scénario
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !scenario || isGeneratingAll}
                variant="outline"
                size="sm"
                className={scenario ? 'border-orange-300 text-orange-700 hover:bg-orange-50' : ''}
              >
                {isGenerating ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <ImagePlus className="mr-1 h-3 w-3" />
                )}
                Images
              </Button>
            </div>

            <Button
              onClick={exportToPDF}
              disabled={generatedPages.length === 0}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF ({generatedPages.length + 4} pages)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu du scénario */}
      {scenario && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Scénario généré ({scenario.pages.length} pages)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {scenario.pages.map((page, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Page {index + 1}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {page.description}
                  </p>
                  {page.dialogues.map((d, dIndex) => (
                    <div key={dIndex} className="text-xs mt-1">
                      <span className="font-medium text-amber-600">{d.character}:</span>{' '}
                      <span className="text-foreground">"{d.text}"</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Galerie des pages générées */}
      {generatedPages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layout className="h-5 w-5 text-orange-500" />
                Pages générées ({generatedPages.length})
              </CardTitle>
              <Badge variant="secondary">
                {PANEL_LAYOUTS.find(l => l.value === panelLayout)?.label || '4 cases'} par page
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedPages.map((page, index) => {
                const panelsPerPage = PANEL_LAYOUTS.find(l => l.value === panelLayout)?.panelsPerPage || 4;
                const cols = 2;
                const rows = Math.ceil(panelsPerPage / 2);
                
                return (
                  <div key={page.id} className="border border-border/50 rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-amber-500 text-white">
                        Page {page.pageNumber}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regeneratePage(index)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Régénérer
                      </Button>
                    </div>
                    
                    {/* Grille des panels */}
                    <div 
                      className="grid gap-2" 
                      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    >
                      {page.panels.slice(0, panelsPerPage).map((panel, panelIdx) => (
                        <div key={panel.id} className="relative group">
                          {panel.imageUrl ? (
                            <img
                              src={panel.imageUrl}
                              alt={`Panel ${panelIdx + 1}`}
                              className="w-full aspect-square object-cover rounded-md border-2 border-black shadow-md"
                            />
                          ) : (
                            <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-md border-2 border-dashed border-black">
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          {/* Badge numéro de case */}
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {panelIdx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info crédit */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">À propos du générateur de BD</p>
              <p className="mt-1">
                Ce module crée des bandes dessinées illustrées avec scénario IA. Chaque page est générée 
                individuellement avec cohérence stylistique. Le résultat est un "album illustré narratif" 
                parfait pour les enfants et compatible KDP.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookComicBookGenerator;
