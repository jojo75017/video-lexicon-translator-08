import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChefHat, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Globe, Wine, Copy, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

const RECIPE_HISTORY_STORAGE_KEY = 'recipe_generator:last_dish_names:v1';

// Fallback images (historique). NOTE: le projet privilégie la génération IA; pas de fallback stock côté UI.
const PEXELS_API_KEY = '563492ad6f91700001000001b3c9c2fb1df54302850f8185e752c274';
const fetchPexelsFoodImage = async (query: string): Promise<string | null> => {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      `${query} food dish`
    )}&per_page=1`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
    if (!res.ok) return null;
    const json = await res.json();
    const photo = json?.photos?.[0];
    return photo?.src?.large2x || photo?.src?.large || photo?.src?.original || null;
  } catch {
    return null;
  }
};

// Compteur de mots pour une fiche recette
const countSheetWords = (sheet: { description: string; history: string; ingredients: string[]; steps: string[]; chefTips: string; variations: string; servingSuggestion: string }): number => {
  const parts = [sheet.description || '', sheet.history || '', ...(sheet.ingredients || []), ...(sheet.steps || []), sheet.chefTips || '', sheet.variations || '', sheet.servingSuggestion || ''];
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
};

const normalizeDishName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const readDishHistory = (scopeKey: string): string[] => {
  try {
    const raw = localStorage.getItem(RECIPE_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = parsed?.[scopeKey];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

const writeDishHistory = (scopeKey: string, dishNames: string[]) => {
  try {
    const raw = localStorage.getItem(RECIPE_HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[scopeKey] = dishNames;
    localStorage.setItem(RECIPE_HISTORY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // no-op
  }
};

const pickUnique = (pool: string[], count: number) => {
  const copy = [...pool];
  // Fisher–Yates shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
};

// Rotation “sans doublons” sur un pool: prend les prochains items non utilisés.
// Si le pool est épuisé, on repart du début (mais ça n'arrive qu'après ~18 générations Vietnam).
const pickNextFromPool = (pool: string[], used: string[], count: number) => {
  const usedNorm = new Set(used.map(normalizeDishName));
  const available = pool.filter((d) => !usedNorm.has(normalizeDishName(d)));
  const chosen = available.slice(0, Math.min(count, available.length));
  if (chosen.length >= count) return chosen;
  // Pool épuisé: compléter avec le début du pool (rotation)
  const remaining = count - chosen.length;
  return [...chosen, ...pool.slice(0, remaining)];
};

// Pool “large” pour forcer une sélection différente même si le modèle tend à répéter.
const VIETNAM_DISH_POOL = [
  'Phở Bò',
  'Phở Gà',
  'Bánh Mì',
  'Bún Chả',
  'Gỏi Cuốn',
  'Cơm Tấm',
  'Bánh Xèo',
  'Bún Bò Huế',
  'Cao Lầu',
  'Mì Quảng',
  'Chả Cá Lã Vọng',
  'Bánh Cuốn',
  'Bún Riêu',
  'Hủ Tiếu',
  'Bánh Bèo',
  'Bún Thịt Nướng',
  'Cà Phê Sữa Đá (version dessert/boisson)',
  'Chè Ba Màu (dessert)',
  // Extension du pool (pour éviter les répétitions quand l'utilisateur génère 20+ fiches)
  'Bánh Khọt',
  'Bò Lúc Lắc',
  'Bún Mắm',
  'Bánh Canh',
  'Bún Cá',
  'Bún Đậu Mắm Tôm',
  'Bánh Giò',
  'Bánh Ít Trần',
  'Xôi Gà',
  'Xôi Xéo',
  'Cơm Gà Hội An',
  'Cơm Chiên Dương Châu',
  'Cháo Lòng',
  'Cháo Gà',
  'Canh Chua Cá',
  'Cá Kho Tộ',
  'Thịt Kho Tàu',
  'Nem Rán (Chả Giò)',
  'Bún Nem',
  'Bánh Bột Lọc',
  'Bánh Da Lợn (dessert)',
  'Chè Đậu Đỏ (dessert)',
  'Chè Chuối (dessert)',
  'Sữa Chua Nếp Cẩm (dessert)',
  'Bánh Flan Caramel (dessert)',
  'Trà Đá (boisson)',
  'Bò Kho',
  'Miến Gà',
  'Miến Lươn',
  'Bún Bò Nam Bộ',
  'Bún Thang',
  'Chả Giò Chay',
  'Bún Chay',
];

// Interface pour une fiche recette (500+ mots par fiche)
interface RecipeSheet {
  id: number;
  country: string;
  countryFlag: string;
  dishName: string;
  description: string;           // Description riche (3-4 phrases)
  history: string;               // Histoire et origine du plat (2-3 phrases)
  ingredients: string[];         // 10-12 ingrédients avec quantités
  steps: string[];               // 8-10 étapes détaillées
  chefTips: string;              // Conseils du chef (2-3 phrases)
  variations: string;            // Variantes régionales (2 phrases)
  winePairing: string;
  wineReason: string;
  servingSuggestion: string;     // Suggestion de présentation
  cookingTime: string;
  difficulty: string;
  portions: string;              // Nombre de portions
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

interface EbookRecipeBookGeneratorProps {
  ebookTitle?: string;
}

// Liste complète des pays du monde par continent
const worldCountries = {
  '🌍 Europe': [
    'France', 'Italie', 'Espagne', 'Allemagne', 'Grèce', 'Portugal', 'Belgique', 'Suisse',
    'Autriche', 'Pays-Bas', 'Pologne', 'Hongrie', 'République Tchèque', 'Croatie', 'Roumanie',
    'Bulgarie', 'Irlande', 'Écosse', 'Danemark', 'Suède', 'Norvège', 'Finlande', 'Islande',
    'Serbie', 'Ukraine', 'Russie', 'Turquie'
  ],
  '🌎 Amérique du Nord': [
    'États-Unis', 'Canada', 'Mexique', 'Cuba', 'Jamaïque', 'Haïti', 'Porto Rico',
    'République Dominicaine', 'Guatemala', 'Honduras', 'Salvador', 'Nicaragua', 'Costa Rica', 'Panama'
  ],
  '🌎 Amérique du Sud': [
    'Argentine', 'Brésil', 'Pérou', 'Chili', 'Colombie', 'Venezuela', 'Équateur',
    'Bolivie', 'Uruguay', 'Paraguay'
  ],
  '🌏 Asie': [
    'Japon', 'Chine', 'Corée du Sud', 'Thaïlande', 'Vietnam', 'Inde', 'Indonésie',
    'Malaisie', 'Singapour', 'Philippines', 'Cambodge', 'Laos', 'Myanmar', 'Népal',
    'Sri Lanka', 'Pakistan', 'Bangladesh', 'Mongolie', 'Taïwan'
  ],
  '🌏 Moyen-Orient': [
    'Liban', 'Turquie', 'Iran', 'Israël', 'Jordanie', 'Syrie', 'Irak', 'Arabie Saoudite',
    'Émirats Arabes Unis', 'Yémen', 'Oman', 'Koweït', 'Qatar', 'Bahreïn'
  ],
  '🌍 Afrique': [
    'Maroc', 'Tunisie', 'Algérie', 'Égypte', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria',
    'Éthiopie', 'Kenya', 'Tanzanie', 'Afrique du Sud', 'Madagascar', 'Cameroun',
    'Ghana', 'Mali', 'Mauritanie'
  ],
  '🌏 Océanie': [
    'Australie', 'Nouvelle-Zélande', 'Fidji', 'Polynésie Française', 'Nouvelle-Calédonie',
    'Papouasie-Nouvelle-Guinée', 'Samoa', 'Tonga', 'Vanuatu'
  ]
};

// Drapeaux par pays
const countryFlags: Record<string, string> = {
  'France': '🇫🇷', 'Italie': '🇮🇹', 'Espagne': '🇪🇸', 'Allemagne': '🇩🇪', 'Grèce': '🇬🇷',
  'Portugal': '🇵🇹', 'Belgique': '🇧🇪', 'Suisse': '🇨🇭', 'Autriche': '🇦🇹', 'Pays-Bas': '🇳🇱',
  'Pologne': '🇵🇱', 'Hongrie': '🇭🇺', 'République Tchèque': '🇨🇿', 'Croatie': '🇭🇷',
  'Roumanie': '🇷🇴', 'Bulgarie': '🇧🇬', 'Irlande': '🇮🇪', 'Écosse': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Danemark': '🇩🇰',
  'Suède': '🇸🇪', 'Norvège': '🇳🇴', 'Finlande': '🇫🇮', 'Islande': '🇮🇸', 'Serbie': '🇷🇸',
  'Ukraine': '🇺🇦', 'Russie': '🇷🇺', 'Turquie': '🇹🇷', 'États-Unis': '🇺🇸', 'Canada': '🇨🇦',
  'Mexique': '🇲🇽', 'Cuba': '🇨🇺', 'Jamaïque': '🇯🇲', 'Haïti': '🇭🇹', 'Porto Rico': '🇵🇷',
  'République Dominicaine': '🇩🇴', 'Guatemala': '🇬🇹', 'Honduras': '🇭🇳', 'Salvador': '🇸🇻',
  'Nicaragua': '🇳🇮', 'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Argentine': '🇦🇷', 'Brésil': '🇧🇷',
  'Pérou': '🇵🇪', 'Chili': '🇨🇱', 'Colombie': '🇨🇴', 'Venezuela': '🇻🇪', 'Équateur': '🇪🇨',
  'Bolivie': '🇧🇴', 'Uruguay': '🇺🇾', 'Paraguay': '🇵🇾', 'Japon': '🇯🇵', 'Chine': '🇨🇳',
  'Corée du Sud': '🇰🇷', 'Thaïlande': '🇹🇭', 'Vietnam': '🇻🇳', 'Inde': '🇮🇳', 'Indonésie': '🇮🇩',
  'Malaisie': '🇲🇾', 'Singapour': '🇸🇬', 'Philippines': '🇵🇭', 'Cambodge': '🇰🇭', 'Laos': '🇱🇦',
  'Myanmar': '🇲🇲', 'Népal': '🇳🇵', 'Sri Lanka': '🇱🇰', 'Pakistan': '🇵🇰', 'Bangladesh': '🇧🇩',
  'Mongolie': '🇲🇳', 'Taïwan': '🇹🇼', 'Liban': '🇱🇧', 'Iran': '🇮🇷', 'Israël': '🇮🇱',
  'Jordanie': '🇯🇴', 'Syrie': '🇸🇾', 'Irak': '🇮🇶', 'Arabie Saoudite': '🇸🇦',
  'Émirats Arabes Unis': '🇦🇪', 'Yémen': '🇾🇪', 'Oman': '🇴🇲', 'Koweït': '🇰🇼', 'Qatar': '🇶🇦',
  'Bahreïn': '🇧🇭', 'Maroc': '🇲🇦', 'Tunisie': '🇹🇳', 'Algérie': '🇩🇿', 'Égypte': '🇪🇬',
  'Sénégal': '🇸🇳', 'Côte d\'Ivoire': '🇨🇮', 'Nigeria': '🇳🇬', 'Éthiopie': '🇪🇹', 'Kenya': '🇰🇪',
  'Tanzanie': '🇹🇿', 'Afrique du Sud': '🇿🇦', 'Madagascar': '🇲🇬', 'Cameroun': '🇨🇲',
  'Ghana': '🇬🇭', 'Mali': '🇲🇱', 'Mauritanie': '🇲🇷', 'Australie': '🇦🇺', 'Nouvelle-Zélande': '🇳🇿',
  'Fidji': '🇫🇯', 'Polynésie Française': '🇵🇫', 'Nouvelle-Calédonie': '🇳🇨',
  'Papouasie-Nouvelle-Guinée': '🇵🇬', 'Samoa': '🇼🇸', 'Tonga': '🇹🇴', 'Vanuatu': '🇻🇺'
};

const PHOTO_STYLES = [
  { id: 'gourmet', label: '🍽️ Gastronomique', prompt: 'professional food photography, michelin star presentation, elegant plating, soft natural lighting, shallow depth of field, magazine quality' },
  { id: 'rustic', label: '🏡 Rustique', prompt: 'rustic food photography, wooden table, natural ingredients, warm lighting, authentic homestyle cooking, traditional ceramics' },
  { id: 'modern', label: '✨ Moderne', prompt: 'minimalist food photography, clean white background, elegant composition, modern plating, high contrast, contemporary style' },
  { id: 'colorful', label: '🎨 Coloré', prompt: 'vibrant food photography, colorful fresh ingredients, bright lighting, appetizing presentation, saturated colors, energetic mood' },
];

const EbookRecipeBookGenerator: React.FC<EbookRecipeBookGeneratorProps> = ({ ebookTitle = '' }) => {
  // Configuration
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [authorName, setAuthorName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('tour-du-monde');
  const [numberOfSheets, setNumberOfSheets] = useState('20');
  const [photoStyle, setPhotoStyle] = useState('gourmet');
  const [customInstructions, setCustomInstructions] = useState('');
  const [lastGeneratedDishNames, setLastGeneratedDishNames] = useState<string[]>([]);
  
  // State
  const [sheets, setSheets] = useState<RecipeSheet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Cover state
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // Get all countries as a flat array
  const getAllCountries = (): string[] => {
    return Object.values(worldCountries).flat();
  };

  // Parse JSON with fallback
  const cleanAndParseJSON = (content: string): any => {
    try {
      // Remove markdown blocks
      let cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      // Try direct parse
      return JSON.parse(cleaned);
    } catch {
      // Try to find JSON object
      const jsonMatch = content.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  const getInvokeStatus = (error: unknown): number | undefined => {
    const anyErr = error as any;
    return anyErr?.context?.status ?? anyErr?.status;
  };

  // Generate recipe sheets
  const generateRecipeSheets = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour votre livre');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setSheets([]);
    
    try {
      const count = parseInt(numberOfSheets);
      setCurrentStep('Génération des fiches recettes...');
      setProgress(10);

      // Nonce pour éviter des sorties identiques entre 2 générations (même prompt / même top)
      // Important: sert uniquement à pousser l'IA à varier la sélection, ne doit pas être affiché.
      const variationNonce = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Analyse du titre pour extraire le contexte
      const titleLower = bookTitle.toLowerCase();
      let countryFromTitle = '';
      let themeFromTitle = '';
      
      // Détection du pays dans le titre
      const countryKeywords: Record<string, string> = {
        'français': 'France', 'française': 'France', 'france': 'France',
        'italien': 'Italie', 'italienne': 'Italie', 'italie': 'Italie',
        'espagnol': 'Espagne', 'espagnole': 'Espagne', 'espagne': 'Espagne',
        'japonais': 'Japon', 'japonaise': 'Japon', 'japon': 'Japon',
        'chinois': 'Chine', 'chinoise': 'Chine', 'chine': 'Chine',
        'thaïlandais': 'Thaïlande', 'thaïlandaise': 'Thaïlande', 'thaï': 'Thaïlande',
        'indien': 'Inde', 'indienne': 'Inde', 'inde': 'Inde',
        'mexicain': 'Mexique', 'mexicaine': 'Mexique', 'mexique': 'Mexique',
        'marocain': 'Maroc', 'marocaine': 'Maroc', 'maroc': 'Maroc',
        'grec': 'Grèce', 'grecque': 'Grèce', 'grèce': 'Grèce',
        'libanais': 'Liban', 'libanaise': 'Liban', 'liban': 'Liban',
        'vietnamien': 'Vietnam', 'vietnamienne': 'Vietnam', 'vietnam': 'Vietnam',
        'coréen': 'Corée du Sud', 'coréenne': 'Corée du Sud', 'corée': 'Corée du Sud',
        'américain': 'États-Unis', 'américaine': 'États-Unis',
        'brésilien': 'Brésil', 'brésilienne': 'Brésil', 'brésil': 'Brésil',
        'péruvien': 'Pérou', 'péruvienne': 'Pérou', 'pérou': 'Pérou',
        'portugais': 'Portugal', 'portugaise': 'Portugal', 'portugal': 'Portugal',
        'allemand': 'Allemagne', 'allemande': 'Allemagne', 'allemagne': 'Allemagne',
        'belge': 'Belgique', 'belgique': 'Belgique',
        'suisse': 'Suisse',
        'tunisien': 'Tunisie', 'tunisienne': 'Tunisie', 'tunisie': 'Tunisie',
        'algérien': 'Algérie', 'algérienne': 'Algérie', 'algérie': 'Algérie',
      };
      
      for (const [keyword, country] of Object.entries(countryKeywords)) {
        if (titleLower.includes(keyword)) {
          countryFromTitle = country;
          break;
        }
      }

      // Determine the final country context
      let finalCountry = selectedCountry !== 'tour-du-monde' ? selectedCountry : countryFromTitle || '';

      // Historique persistant (survivant à un refresh)
      const historyScopeKey = `${normalizeDishName(bookTitle)}|${normalizeDishName(finalCountry || 'global')}`;
      const persistedHistory = readDishHistory(historyScopeKey);
      const inMemoryHistory = lastGeneratedDishNames;
      const mergedHistory = Array.from(
        new Set([...persistedHistory, ...inMemoryHistory].map((x) => x.trim()).filter(Boolean))
      );
      
      const countryInstruction = finalCountry 
        ? `OBLIGATOIRE: TOUTES les recettes doivent être EXCLUSIVEMENT des plats traditionnels de ${finalCountry}. NE PAS inclure de recettes d'autres pays.`
        : 'Variété des 5 continents avec des plats emblématiques de différents pays.';

      const excludeDishesInstruction = mergedHistory.length
        ? `\n\n🚫 EXCLUSION (pour forcer une nouvelle sélection):\n- NE PAS générer (ni variantes) ces plats déjà utilisés: ${mergedHistory.join(', ')}\n- Choisir des classiques différents, toujours 100% ${finalCountry || 'cohérents avec le titre'}.`
        : '';

      // Forçage “hard” pour le Vietnam: on impose une short-list de plats à utiliser (différente à chaque run)
      const requiredVietnamDishes =
        finalCountry === 'Vietnam'
          ? pickNextFromPool(VIETNAM_DISH_POOL, mergedHistory, count)
          : [];

      const requiredDishesInstruction = requiredVietnamDishes.length
        ? `\n\n✅ LISTE OBLIGATOIRE (anti-répétition):\n- Utilise EXACTEMENT ces plats (un par fiche, tous différents): ${requiredVietnamDishes.join(
            ', '
          )}\n- Ne pas remplacer par d'autres plats, ne pas fusionner, ne pas faire de variantes.`
        : '';

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'recipe-sheets',
          prompt: `Tu es un chef étoilé Michelin et sommelier expert reconnu mondialement.

ID DE VARIATION (ne pas afficher, juste pour varier la sélection): ${variationNonce}

TITRE DU LIVRE: "${bookTitle}"
${customInstructions ? `Instructions spéciales du client: ${customInstructions}` : ''}

⚠️ RÈGLE ABSOLUE - COHÉRENCE AVEC LE TITRE:
${countryInstruction}
${finalCountry ? `Tous les ${count} plats DOIVENT être des plats 100% ${finalCountry.toLowerCase() === 'france' ? 'français' : `de ${finalCountry}`}. Aucune exception.` : ''}

Génère exactement ${count} FICHES RECETTES COMPLÈTES ET UNIQUES (minimum 300 mots chacune).

🚫 RÈGLE ANTI-DOUBLONS CRITIQUE:
- CHAQUE recette DOIT être un plat DIFFÉRENT avec un nom UNIQUE
- NE JAMAIS répéter le même plat, même avec une variante
- Varier OBLIGATOIREMENT les catégories: soupes, viandes, poissons, riz, nouilles, desserts
${finalCountry === 'Vietnam' ? `- Pour le VIETNAM, inclure des plats VARIÉS comme: Phở Bò, Bánh Mì, Bún Chả, Gỏi Cuốn, Cơm Tấm, Bánh Xèo, Chả Cá, Bún Bò Huế, Cao Lầu, Mì Quảng (tous DIFFÉRENTS!)` : ''}
${excludeDishesInstruction}
 ${requiredDishesInstruction}

🍷 ACCORD METS-VIN OBLIGATOIRE:
Pour CHAQUE recette, fournis un accord vin PRÉCIS avec:
- winePairing: L'appellation exacte du vin (ex: "Saint-Émilion Grand Cru 2018" ou "Meursault 1er Cru")
- wineReason: Explication détaillée de pourquoi cet accord fonctionne (les arômes, la complémentarité, les tanins, l'acidité)

IMPORTANT: Chaque fiche doit être DÉTAILLÉE avec au moins 300 mots de contenu.
Retourne UNIQUEMENT du JSON valide, sans texte avant ni après.

Pour CHAQUE recette, fournis OBLIGATOIREMENT:
- country: "${finalCountry || 'Le pays d\'origine'}"
- dishName: Le nom authentique et traditionnel du plat
- description: Description gourmande (3-4 phrases sur saveurs, textures, arômes)
- history: Histoire du plat (2-3 phrases sur origine et tradition)
- ingredients: Liste de 8-10 ingrédients avec quantités précises
- steps: 8-10 étapes de préparation claires et détaillées
- chefTips: 2-3 conseils de chef pour réussir le plat
- variations: Variantes régionales (2 phrases)
- winePairing: Vin recommandé (appellation précise)
- wineReason: Explication de l'accord (2 phrases)
- servingSuggestion: Présentation du plat (1-2 phrases)
- cookingTime: Temps détaillé (préparation + repos + cuisson)
- difficulty: Facile, Moyen ou Difficile
- portions: Nombre de personnes

${finalCountry ? `RAPPEL: Les ${count} recettes doivent TOUTES être des classiques de la cuisine ${finalCountry.toLowerCase() === 'france' ? 'française' : `de ${finalCountry}`} (ex: ${finalCountry === 'France' ? 'Coq au Vin, Boeuf Bourguignon, Cassoulet, Blanquette de Veau, Pot-au-Feu, Ratatouille, Bouillabaisse, Quiche Lorraine, Gratin Dauphinois, Tarte Tatin' : 'plats traditionnels emblématiques'}).` : 'Varie les pays (5 continents), les types de plats (entrées, plats, desserts) et les profils de saveurs.'}

Format JSON strict:
{
  "recipes": [
    {
      "country": "${finalCountry || 'Pays'}",
      "dishName": "Nom du plat traditionnel",
      "description": "Description détaillée...",
      "history": "Histoire et origine...",
      "ingredients": ["Ingrédient 1 avec quantité", "Ingrédient 2..."],
      "steps": ["Étape 1 détaillée...", "Étape 2..."],
      "chefTips": "Conseils du chef...",
      "variations": "Variantes régionales...",
      "winePairing": "Appellation précise du vin",
      "wineReason": "Explication de l'accord...",
      "servingSuggestion": "Présentation...",
      "cookingTime": "Préparation: X min | Cuisson: X min",
      "difficulty": "Moyen",
      "portions": "4 personnes"
    }
  ]
}`
        }
      });

      if (error) throw error;

      const content = data?.content || data?.result || '';
      const parsed = cleanAndParseJSON(content);
      
      let recipes = parsed?.recipes || [];

      // Sécurisation: si l'utilisateur a demandé Vietnam, on force les plats et le pays.
      // (évite les sorties hors-sujet + rend la sélection vraiment anti-doublons)
      if (finalCountry === 'Vietnam' && requiredVietnamDishes.length) {
        recipes = Array.isArray(recipes) ? recipes : [];
        recipes = recipes.slice(0, count);
        recipes = Array.from({ length: Math.min(count, requiredVietnamDishes.length) }).map((_, i) => {
          const base = recipes[i] || {};
          return {
            ...base,
            country: 'Vietnam',
            dishName: requiredVietnamDishes[i],
          };
        });
      }

      // Mémoriser les plats pour éviter de proposer la même sélection au prochain clic "Générer"
      // (utile quand l'utilisateur regen plusieurs fois pour obtenir un autre "top")
      try {
        const dishNames = recipes
          .map((r: any) => (typeof r?.dishName === 'string' ? r.dishName.trim() : ''))
          .filter(Boolean);
        if (dishNames.length) {
          const nextHistory = Array.from(new Set([...mergedHistory, ...dishNames]));
          setLastGeneratedDishNames(nextHistory);
          writeDishHistory(historyScopeKey, nextHistory.slice(-80));
        }
      } catch {
        // no-op
      }
      
      // Pad with fallback recipes if needed
      if (recipes.length < count) {
        const remaining = count - recipes.length;
        const fallbackRecipes = generateFallbackRecipes({
          count: remaining,
          finalCountry,
          // pour Vietnam: compléter avec la liste obligatoire déjà calculée
          requiredDishNames:
            finalCountry === 'Vietnam' && requiredVietnamDishes.length
              ? requiredVietnamDishes.slice(recipes.length)
              : undefined,
        });
        recipes = [...recipes, ...fallbackRecipes];
        toast.warning(`${fallbackRecipes.length} fiches de secours ajoutées`);
      }

      // Convert to sheets with flags
      const generatedSheets: RecipeSheet[] = recipes.slice(0, count).map((recipe: any, index: number) => ({
        id: index + 1,
        country: recipe.country || 'International',
        countryFlag: countryFlags[recipe.country] || '🌍',
        dishName: recipe.dishName || `Recette ${index + 1}`,
        description: recipe.description || 'Délicieuse recette traditionnelle aux saveurs authentiques.',
        history: recipe.history || 'Recette traditionnelle transmise de génération en génération.',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : ['Ingrédients variés selon disponibilité'],
        steps: Array.isArray(recipe.steps) ? recipe.steps : ['Préparer les ingrédients', 'Cuisiner selon la tradition', 'Servir chaud'],
        chefTips: recipe.chefTips || 'Utilisez des ingrédients frais et de saison pour un résultat optimal.',
        variations: recipe.variations || 'Ce plat peut être adapté selon les goûts de chacun.',
        winePairing: recipe.winePairing || 'Vin rouge ou blanc selon préférence',
        wineReason: recipe.wineReason || 'Accord harmonieux qui sublime les saveurs du plat.',
        servingSuggestion: recipe.servingSuggestion || 'Servir dans un plat de présentation réchauffé.',
        cookingTime: recipe.cookingTime || '45 min',
        difficulty: recipe.difficulty || 'Moyen',
        portions: recipe.portions || '4 personnes',
      }));

      // Afficher les fiches immédiatement (ne pas bloquer l'UI sur la génération d'images)
      setSheets(generatedSheets);
      setActiveTab('sheets');
      setProgress(60);
      setCurrentStep('Fiches générées — génération des images en arrière-plan…');
      toast.success(`${generatedSheets.length} fiches recettes générées !`);

      // Génération d'images en tâche de fond (peut échouer si crédits épuisés)
      void generateSheetImages(generatedSheets);
      
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback recipes generator
  const generateFallbackRecipes = (args: {
    count: number;
    finalCountry?: string;
    requiredDishNames?: string[];
  }) => {
    const { count, finalCountry, requiredDishNames } = args;

    // Fallback Vietnam (respect strict du pays demandé)
    if ((finalCountry || '').toLowerCase() === 'vietnam') {
      const names = (requiredDishNames && requiredDishNames.length)
        ? requiredDishNames
        : pickUnique(VIETNAM_DISH_POOL, count);

      return names.slice(0, count).map((dishName) => ({
        country: 'Vietnam',
        dishName,
        description:
          `Un grand classique de la cuisine vietnamienne, aux saveurs équilibrées entre fraîcheur, umami et herbes aromatiques. La recette met en valeur des ingrédients simples et très parfumés.`,
        history:
          `Plat emblématique au Vietnam, souvent associé à la cuisine de rue et aux recettes familiales transmises. Il existe de nombreuses variations régionales selon le Nord, le Centre et le Sud.`,
        winePairing: 'Riesling sec (Alsace) ou Gewürztraminer sec',
        chefTips:
          `Travaille les bouillons/sauces avec patience, utilise des herbes très fraîches, et ajuste l’équilibre salé-acide-sucré en fin de cuisson.`,
        variations:
          `Selon les régions, on change les herbes, la base (riz/nouilles) et l’intensité des condiments. Variante possible avec une version plus légère ou plus relevée.`,
        servingSuggestion:
          `Servir bien chaud (ou très frais selon la recette) avec herbes, citron vert et condiments à part pour personnaliser.`,
        ingredients: [
          '500g de protéine principale (au choix)',
          '200g de nouilles/riz (selon la recette)',
          '2 oignons ou échalotes',
          '3 gousses d’ail',
          'Gingembre frais',
          'Sauce de poisson (nuoc-mâm) ou sauce soja',
          'Sucre (ou sucre de coco)',
          'Citron vert',
          'Herbes fraîches (coriandre, menthe, basilic thaï)',
          'Piment (optionnel)',
        ],
        steps: [
          'Préparer et peser tous les ingrédients (mise en place)',
          'Préparer la base aromatique (ail, gingembre, oignon)',
          'Lancer la cuisson principale (bouillon/sauce/poêlée)',
          'Cuire l’accompagnement (riz/nouilles) selon indication',
          'Assembler les éléments et rectifier l’assaisonnement',
          'Ajuster l’équilibre salé-acide-sucré',
          'Ajouter les herbes fraîches au dernier moment',
          'Dresser proprement et servir immédiatement',
        ],
        wineReason:
          `Un blanc aromatique et sec accompagne parfaitement les herbes, l’acidité du citron vert et les épices, sans écraser la finesse des saveurs vietnamiennes.`,
        cookingTime: 'Préparation: 25 min | Cuisson: 35 min',
        difficulty: 'Moyen',
        portions: '4 personnes',
      }));
    }

    const fallbackData = [
      { 
        country: 'France', 
        dishName: 'Ratatouille Provençale', 
        description: 'Les légumes du soleil mijotés lentement à la provençale, créant une symphonie de saveurs méditerranéennes. Chaque légume conserve sa texture tout en absorbant les arômes de l\'huile d\'olive et des herbes de Provence.',
        history: 'Originaire de Nice au 18ème siècle, ce plat paysan est devenu un symbole de la cuisine provençale.',
        winePairing: 'Côtes de Provence Rosé',
        chefTips: 'Coupez tous les légumes en dés réguliers et faites-les revenir séparément avant de les réunir.',
        variations: 'En Catalogne, on ajoute des anchois et des câpres.',
        servingSuggestion: 'Servir tiède ou froid avec un filet d\'huile d\'olive.'
      },
      { 
        country: 'Italie', 
        dishName: 'Risotto alla Milanese', 
        description: 'Le riz crémeux au safran, emblème de la cuisine milanaise, offre une texture onctueuse incomparable. Les fils de safran apportent une couleur dorée et un parfum subtil.',
        history: 'Créé au 16ème siècle par un apprenti verrier qui utilisait le safran pour colorer le verre.',
        winePairing: 'Barbera d\'Alba',
        chefTips: 'Utilisez du riz Carnaroli et ajoutez le bouillon louche par louche.',
        variations: 'À Venise, on y ajoute des fruits de mer.',
        servingSuggestion: 'Servir immédiatement, le risotto n\'attend pas.'
      },
      { 
        country: 'Japon', 
        dishName: 'Ramen Tonkotsu', 
        description: 'Le bouillon de porc onctueux mijoté pendant 12 heures, créant une texture laiteuse et des saveurs profondes. Les nouilles fraîches absorbent parfaitement ce nectar umami.',
        history: 'Né à Fukuoka dans les années 1940, ce style de ramen est devenu culte dans le monde entier.',
        winePairing: 'Bière japonaise Asahi ou Saké froid',
        chefTips: 'Le secret est la cuisson très longue des os de porc à feu vif.',
        variations: 'À Tokyo, on préfère un bouillon plus clair à base de sauce soja.',
        servingSuggestion: 'Servir brûlant avec les garnitures disposées harmonieusement.'
      },
      { 
        country: 'Mexique', 
        dishName: 'Tacos al Pastor', 
        description: 'Le porc mariné aux épices et à l\'ananas, inspiré des shawarma libanais. La viande caramélisée et l\'acidité du fruit créent un équilibre parfait.',
        history: 'Créé par les immigrés libanais à Mexico dans les années 1930, fusionnant traditions moyen-orientales et mexicaines.',
        winePairing: 'Margarita classique ou Cerveza Corona',
        chefTips: 'La marinade doit contenir du achiote pour la couleur rouge caractéristique.',
        variations: 'À Guadalajara, on utilise parfois du bœuf au lieu du porc.',
        servingSuggestion: 'Servir sur tortillas de maïs avec oignon, coriandre et salsa verde.'
      },
      { 
        country: 'Inde', 
        dishName: 'Butter Chicken', 
        description: 'Le poulet tendre nappé d\'une sauce tomate crémeuse aux épices douces. Ce plat emblématique de Delhi offre un équilibre parfait entre richesse et subtilité aromatique.',
        history: 'Inventé dans les années 1950 au restaurant Moti Mahal de Delhi à partir de restes de tandoori.',
        winePairing: 'Gewürztraminer ou Lassi à la mangue',
        chefTips: 'Marinez le poulet dans le yaourt et les épices pendant au moins 4 heures.',
        variations: 'Au Royaume-Uni, la version est souvent plus épicée.',
        servingSuggestion: 'Servir avec du riz basmati et du naan fraîchement cuit.'
      },
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      const base = fallbackData[i % fallbackData.length];
      result.push({
        ...base,
        ingredients: ['500g de protéine principale', '2 oignons émincés', '3 gousses d\'ail', 'Épices traditionnelles', 'Herbes fraîches', 'Huile d\'olive', 'Sel et poivre', '200ml de sauce', 'Légumes de saison', 'Accompagnement traditionnel'],
        steps: [
          'Préparer et découper tous les ingrédients en avance',
          'Mariner la protéine pendant au moins 2 heures',
          'Faire revenir les aromates dans l\'huile',
          'Ajouter les épices et faire griller 30 secondes',
          'Incorporer la protéine et saisir à feu vif',
          'Ajouter les liquides et laisser mijoter',
          'Cuire à feu doux jusqu\'à tendreté parfaite',
          'Goûter et ajuster l\'assaisonnement',
          'Laisser reposer 5 minutes avant de servir'
        ],
        wineReason: 'L\'accord parfait entre les arômes du plat et les notes du vin.',
        cookingTime: 'Préparation: 30 min | Cuisson: 45 min',
        difficulty: 'Moyen',
        portions: '4 personnes'
      });
    }
    return result;
  };

  // Generate images for all sheets
  const generateSheetImages = async (sheetsToProcess: RecipeSheet[]) => {
    setIsGeneratingImages(true);
    const style = PHOTO_STYLES.find(s => s.id === photoStyle)?.prompt || '';
    
    const updatedSheets = [...sheetsToProcess];
    
    for (let i = 0; i < updatedSheets.length; i++) {
      setCurrentStep(`Photo ${i + 1}/${updatedSheets.length}: ${updatedSheets[i].dishName}...`);
      setProgress(40 + (i / updatedSheets.length) * 55);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-front-cover', {
          body: {
            ebookTitle: updatedSheets[i].dishName,
            authorName: '',
            genre: 'cooking',
            style: 'cookbook',
            customPrompt: `${style}. 
Beautiful food photograph of "${updatedSheets[i].dishName}" from ${updatedSheets[i].country} cuisine.
Traditional authentic dish, professional culinary photography, appetizing presentation.
NO TEXT, NO WORDS, NO TITLE, NO LETTERS on the image.
Pure food photography only, high resolution, cookbook quality.`,
            showAuthorName: false,
            showTitle: false,
          }
        });

        if (error) {
          const status = getInvokeStatus(error);
          if (status === 402) {
            toast.error("Crédits images épuisés — images non générées.");
            break;
          }
          if (status === 429) {
            toast.error('Trop de requêtes image — réessayez dans quelques instants.');
            break;
          }
        }

        if (!error && data?.imageUrl) {
          updatedSheets[i] = { ...updatedSheets[i], imageUrl: data.imageUrl };
          setSheets([...updatedSheets]);
        }
      } catch (err) {
        console.error(`Erreur image ${i + 1}:`, err);
        const status = getInvokeStatus(err);
        if (status === 402) {
          toast.error("Crédits images épuisés — images non générées.");
          break;
        }
        if (status === 429) {
          toast.error('Trop de requêtes image — réessayez dans quelques instants.');
          break;
        }
      }
    }
    
    setIsGeneratingImages(false);
  };

  // Regenerate single image
  const regenerateImage = async (sheetId: number) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (!sheet) return;
    
    toast.info(`Regénération de l'image pour ${sheet.dishName}...`);
    
    const style = PHOTO_STYLES.find(s => s.id === photoStyle)?.prompt || '';
    
    setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, isGeneratingImage: true } : s));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: sheet.dishName,
          authorName: '',
          genre: 'cooking',
          style: 'cookbook',
          customPrompt: `${style}. 
Beautiful food photograph of "${sheet.dishName}" from ${sheet.country} cuisine.
Traditional authentic dish, professional culinary photography, appetizing presentation.
NO TEXT, NO WORDS, NO TITLE, NO LETTERS on the image.
Pure food photography only.`,
          showAuthorName: false,
          showTitle: false,
        }
      });

      if (error) {
        const status = getInvokeStatus(error);
        if (status === 402) {
          toast.error("Crédits images épuisés — impossible de régénérer l'image.");
          setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, isGeneratingImage: false } : s));
          return;
        }
        if (status === 429) {
          toast.error("Trop de requêtes image — réessayez dans quelques instants.");
          setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, isGeneratingImage: false } : s));
          return;
        }
      }

      if (!error && data?.imageUrl) {
        setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s));
        toast.success('Image régénérée !');
        return;
      }

      throw new Error('Pas d\'image');
    } catch (err) {
      console.error('Erreur régénération:', err);
      setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, isGeneratingImage: false } : s));
      toast.error('Erreur lors de la régénération');
    }
  };

  // Generate cover
  const generateCover = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    setIsGeneratingCover(true);
    toast.info('Génération de la couverture...');

    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: bookTitle,
          authorName: authorName || '',
          genre: 'cookbook',
          style: 'modern',
          customPrompt: `Professional cookbook cover for "${bookTitle}".
World cuisine theme with elegant food photography. Multiple gourmet dishes from around the world.
Wine glasses, elegant table setting, warm inviting colors, magazine quality.
Include stylish title "${bookTitle}" in elegant typography.
${authorName ? `Author: ${authorName}` : ''}`,
          showAuthorName: !!authorName,
          showTitle: true,
        }
      });

      if (error) {
        const status = getInvokeStatus(error);
        if (status === 402) throw new Error('Crédits images épuisés');
        if (status === 429) throw new Error('Trop de requêtes');
        throw error;
      }

      if (data?.imageUrl) {
        setCoverImageUrl(data.imageUrl);
        toast.success('Couverture générée !');
      }
    } catch (error) {
      console.error('Erreur couverture:', error);
      const msg = error instanceof Error ? error.message : 'Erreur lors de la génération de la couverture';
      toast.error(msg);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Copy sheet to clipboard (300+ words)
  const copySheet = async (sheet: RecipeSheet, index: number) => {
    const text = `${sheet.countryFlag} ${sheet.country.toUpperCase()}

🍽️ ${sheet.dishName}
⏱️ ${sheet.cookingTime} | ${sheet.difficulty} | ${sheet.portions}

${sheet.description}

📜 HISTOIRE & ORIGINE
${sheet.history}

📝 INGRÉDIENTS
${sheet.ingredients.map(i => `• ${i}`).join('\n')}

👨‍🍳 PRÉPARATION
${sheet.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

💡 CONSEILS DU CHEF
${sheet.chefTips}

🌍 VARIANTES RÉGIONALES
${sheet.variations}

🍷 ACCORD METS-VINS
${sheet.winePairing}
${sheet.wineReason}

🍽️ PRÉSENTATION
${sheet.servingSuggestion}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success('Fiche complète copiée ! (300+ mots)');
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    if (sheets.length === 0) {
      toast.error('Aucune fiche à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Génération du PDF...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Cover page
      if (coverImageUrl) {
        try {
          const response = await fetch(coverImageUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              const base64 = reader.result as string;
              pdf.addImage(base64, 'PNG', 0, 0, pageWidth, pageHeight);
              resolve();
            };
            reader.readAsDataURL(blob);
          });
        } catch {
          // Fallback title page
          pdf.setFillColor(139, 69, 19);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(32);
          pdf.text(bookTitle, pageWidth / 2, pageHeight / 2, { align: 'center' });
        }
      } else {
        // Title page without cover
        pdf.setFillColor(139, 69, 19);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(32);
        pdf.text(bookTitle, pageWidth / 2, pageHeight / 2, { align: 'center' });
        if (authorName) {
          pdf.setFontSize(18);
          pdf.text(authorName, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
        }
      }

      // Recipe sheets - one per page with 300+ words content
      for (const sheet of sheets) {
        pdf.addPage();
        
        let yPos = margin;
        const leftColumnWidth = 55; // For image and wine
        const rightColumnStart = margin + leftColumnWidth + 5;
        const rightColumnWidth = contentWidth - leftColumnWidth - 5;
        
        // Country header
        pdf.setFillColor(245, 245, 220);
        pdf.rect(margin, yPos, contentWidth, 12, 'F');
        pdf.setTextColor(139, 69, 19);
        pdf.setFontSize(14);
        pdf.text(`${sheet.countryFlag} ${sheet.country}`, margin + 5, yPos + 8);
        pdf.setFontSize(9);
        pdf.text(`${sheet.portions}`, margin + contentWidth - 20, yPos + 8);
        yPos += 16;
        
        // Dish name and time
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(18);
        const titleLines = pdf.splitTextToSize(sheet.dishName, contentWidth);
        pdf.text(titleLines, margin, yPos);
        yPos += titleLines.length * 7 + 2;
        
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`${sheet.difficulty} | ${sheet.cookingTime}`, margin, yPos);
        yPos += 8;
        
        // Left column - Image
        const leftColStartY = yPos;
        if (sheet.imageUrl) {
          try {
            const response = await fetch(sheet.imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            await new Promise<void>((resolve) => {
              reader.onloadend = () => {
                const base64 = reader.result as string;
                pdf.addImage(base64, 'PNG', margin, yPos, leftColumnWidth, 45);
                resolve();
              };
              reader.readAsDataURL(blob);
            });
          } catch {
            // Skip image on error
          }
        }
        
        // Right column - Description & History
        let rightYPos = leftColStartY;
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        const descLines = pdf.splitTextToSize(sheet.description, rightColumnWidth);
        pdf.text(descLines, rightColumnStart, rightYPos);
        rightYPos += descLines.length * 4 + 3;
        
        // History (italic style)
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const historyLines = pdf.splitTextToSize(`📜 ${sheet.history}`, rightColumnWidth);
        pdf.text(historyLines, rightColumnStart, rightYPos);
        rightYPos += historyLines.length * 4 + 5;
        
        // Move yPos to after left column image
        yPos = Math.max(leftColStartY + 50, rightYPos);
        
        // Wine pairing box (under image)
        pdf.setFillColor(245, 230, 245);
        pdf.rect(margin, yPos, leftColumnWidth, 25, 'F');
        pdf.setTextColor(128, 0, 128);
        pdf.setFontSize(9);
        pdf.text('🍷 Accord Mets-Vins', margin + 3, yPos + 6);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        const wineName = pdf.splitTextToSize(sheet.winePairing, leftColumnWidth - 6);
        pdf.text(wineName, margin + 3, yPos + 12);
        const wineReason = pdf.splitTextToSize(sheet.wineReason, leftColumnWidth - 6);
        pdf.text(wineReason.slice(0, 2), margin + 3, yPos + 18);
        
        // Ingredients (next to wine box)
        let ingYPos = yPos;
        pdf.setFontSize(11);
        pdf.setTextColor(139, 69, 19);
        pdf.text('📝 INGRÉDIENTS', rightColumnStart, ingYPos);
        ingYPos += 5;
        
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        const ingCols = Math.ceil(sheet.ingredients.length / 2);
        const halfWidth = rightColumnWidth / 2;
        sheet.ingredients.forEach((ing, i) => {
          const col = i < ingCols ? 0 : 1;
          const row = i < ingCols ? i : i - ingCols;
          const ingText = pdf.splitTextToSize(`• ${ing}`, halfWidth - 2);
          pdf.text(ingText[0], rightColumnStart + col * halfWidth, ingYPos + row * 4);
        });
        
        yPos = Math.max(yPos + 28, ingYPos + Math.ceil(sheet.ingredients.length / 2) * 4 + 5);
        
        // Steps
        pdf.setFontSize(11);
        pdf.setTextColor(139, 69, 19);
        pdf.text('👨‍🍳 PRÉPARATION', margin, yPos);
        yPos += 5;
        
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        sheet.steps.forEach((step, i) => {
          if (yPos > pageHeight - 30) return; // Prevent overflow
          const stepLines = pdf.splitTextToSize(`${i + 1}. ${step}`, contentWidth - 8);
          pdf.text(stepLines, margin + 5, yPos);
          yPos += stepLines.length * 4;
        });
        yPos += 4;
        
        // Chef tips & Variations (side by side)
        if (yPos < pageHeight - 25) {
          const boxWidth = (contentWidth - 5) / 2;
          
          // Chef tips
          pdf.setFillColor(255, 250, 240);
          pdf.rect(margin, yPos, boxWidth, 18, 'F');
          pdf.setTextColor(180, 120, 0);
          pdf.setFontSize(8);
          pdf.text('💡 Conseils du Chef', margin + 2, yPos + 4);
          pdf.setFontSize(7);
          pdf.setTextColor(80, 80, 80);
          const tipsLines = pdf.splitTextToSize(sheet.chefTips, boxWidth - 4);
          pdf.text(tipsLines.slice(0, 3), margin + 2, yPos + 9);
          
          // Variations
          pdf.setFillColor(240, 255, 240);
          pdf.rect(margin + boxWidth + 5, yPos, boxWidth, 18, 'F');
          pdf.setTextColor(0, 128, 0);
          pdf.setFontSize(8);
          pdf.text('🌍 Variantes', margin + boxWidth + 7, yPos + 4);
          pdf.setFontSize(7);
          pdf.setTextColor(80, 80, 80);
          const varLines = pdf.splitTextToSize(sheet.variations, boxWidth - 4);
          pdf.text(varLines.slice(0, 3), margin + boxWidth + 7, yPos + 9);
          
          yPos += 20;
        }
        
        // Serving suggestion
        if (yPos < pageHeight - 15) {
          pdf.setFillColor(255, 248, 240);
          pdf.rect(margin, yPos, contentWidth, 10, 'F');
          pdf.setTextColor(139, 69, 19);
          pdf.setFontSize(8);
          pdf.text(`🍽️ Présentation: ${sheet.servingSuggestion}`, margin + 3, yPos + 6);
        }
      }

      pdf.save(`${bookTitle.replace(/\s+/g, '-').toLowerCase()}-recettes.pdf`);
      toast.success('PDF exporté !');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  // Download cover
  const downloadCover = async () => {
    if (!coverImageUrl) return;
    
    try {
      const link = document.createElement('a');
      if (coverImageUrl.startsWith('data:')) {
        link.href = coverImageUrl;
      } else {
        const response = await fetch(coverImageUrl);
        const blob = await response.blob();
        link.href = URL.createObjectURL(blob);
      }
      link.download = `couverture-${bookTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Couverture téléchargée !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <ChefHat className="w-7 h-7 text-orange-500" />
          Générateur de Fiches Recettes
        </h2>
        <p className="text-sm text-muted-foreground">
          Créez jusqu'à 40 fiches recettes illustrées avec accords mets-vins
        </p>
      </div>

      {/* Progress */}
      {(isGenerating || isGeneratingImages) && (
        <Card className="border-orange-200/50 bg-orange-50/50 dark:bg-orange-900/10">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-orange-700 dark:text-orange-400">{currentStep}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="config" className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-1.5" disabled={sheets.length === 0}>
            <FileText className="w-4 h-4" />
            Fiches ({sheets.length})
          </TabsTrigger>
          <TabsTrigger value="cover" className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Couverture
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-1.5" disabled={sheets.length === 0}>
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Config */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="border-orange-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Titre du livre *</label>
                    <Input
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Les Saveurs du Monde"
                      className="border-orange-200"
                    />
                  </div>
                  
                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Auteur</label>
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Chef Jean Dupont"
                      className="border-orange-200"
                    />
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Origine des recettes</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        <SelectItem value="tour-du-monde">🌍 Tour du Monde</SelectItem>
                        {Object.entries(worldCountries).map(([continent, countries]) => (
                          <React.Fragment key={continent}>
                            <SelectItem value={continent} disabled className="font-semibold text-orange-600">
                              {continent}
                            </SelectItem>
                            {countries.map(country => (
                              <SelectItem key={country} value={country} className="pl-6">
                                {countryFlags[country] || '🌍'} {country}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of sheets */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nombre de fiches</label>
                    <Select value={numberOfSheets} onValueChange={setNumberOfSheets}>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 fiches</SelectItem>
                        <SelectItem value="10">10 fiches</SelectItem>
                        <SelectItem value="15">15 fiches</SelectItem>
                        <SelectItem value="20">20 fiches</SelectItem>
                        <SelectItem value="25">25 fiches</SelectItem>
                        <SelectItem value="30">30 fiches</SelectItem>
                        <SelectItem value="40">40 fiches (max)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Photo style */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Style des photos</label>
                    <Select value={photoStyle} onValueChange={setPhotoStyle}>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PHOTO_STYLES.map(style => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom instructions */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Instructions (optionnel)</label>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Ex: Recettes végétariennes, sans gluten..."
                      className="min-h-[80px] border-orange-200"
                    />
                  </div>

                  {/* Generate button */}
                  <Button
                    onClick={generateRecipeSheets}
                    disabled={isGenerating || !bookTitle.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer {numberOfSheets} Fiches
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-2">
              <Card className="border-orange-200/50 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Aperçu du format fiche</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Sample sheet preview */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🇫🇷</span>
                      <Badge variant="outline" className="bg-white/80">FRANCE</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-orange-800 dark:text-orange-400 mb-2">Coq au Vin</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Un grand classique de la cuisine bourguignonne, mijoté dans un vin rouge corsé avec des champignons et des lardons.
                    </p>
                    
                    <div className="bg-white/60 dark:bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium mb-2">
                        <Wine className="w-4 h-4" />
                        Accord Vin
                      </div>
                      <p className="text-sm font-medium">Bourgogne Pinot Noir</p>
                      <p className="text-xs text-muted-foreground">La finesse du vin complète la sauce</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>⏱️ Préparation: 30 min | Cuisson: 2h</span>
                      <Badge variant="secondary">Moyen</Badge>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Chaque fiche inclut: photo, ingrédients, étapes, accord vin
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sheets Tab - Full detailed view */}
        <TabsContent value="sheets" className="mt-6">
          <div className="space-y-6">
            {sheets.map((sheet, index) => (
              <Card key={sheet.id} className="border-orange-200/50 overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: Image */}
                    <div className="lg:col-span-1">
                      {sheet.imageUrl ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden">
                          <img 
                            src={sheet.imageUrl} 
                            alt={sheet.dishName}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => regenerateImage(sheet.id)}
                            disabled={sheet.isGeneratingImage}
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            {sheet.isGeneratingImage ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center">
                          {sheet.isGeneratingImage ? (
                            <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-orange-300" />
                          )}
                        </div>
                      )}
                      
                      {/* Wine pairing box */}
                      <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200/50">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold mb-2">
                          <Wine className="w-5 h-5" />
                          Accord Mets-Vins
                        </div>
                        <p className="font-bold text-purple-800 dark:text-purple-300">{sheet.winePairing}</p>
                        <p className="text-sm text-muted-foreground mt-1">{sheet.wineReason}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copySheet(sheet, index)}
                          className="flex-1"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          Copier la fiche
                        </Button>
                      </div>
                    </div>

                    {/* Right column: Content */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{sheet.countryFlag}</span>
                            <Badge variant="outline" className="bg-orange-50">{sheet.country}</Badge>
                            <Badge variant="secondary">{sheet.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs">{sheet.portions}</Badge>
{(() => {
                              const wc = countSheetWords(sheet);
                              return (
                                <Badge 
                                  variant={wc >= 300 ? 'default' : 'destructive'} 
                                >
                                  {wc} mots {wc < 300 && '⚠️'}
                                </Badge>
                              );
                            })()}
                          </div>
                          <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-400">
                            {sheet.dishName}
                          </h3>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <span className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                            ⏱️ {sheet.cookingTime}
                          </span>
                        </div>
                      </div>

                      {/* Description & History */}
                      <div className="space-y-2">
                        <p className="text-muted-foreground leading-relaxed">{sheet.description}</p>
                        <p className="text-sm text-muted-foreground italic bg-orange-50/50 dark:bg-orange-900/10 p-3 rounded-lg border-l-4 border-orange-300">
                          📜 {sheet.history}
                        </p>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          📝 Ingrédients
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {sheet.ingredients.map((ing, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-orange-500">•</span>
                              <span>{ing}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Steps */}
                      <div>
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                          👨‍🍳 Préparation
                        </h4>
                        <div className="space-y-2">
                          {sheet.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                              <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-400">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chef Tips & Variations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200/50">
                          <h5 className="font-medium text-amber-700 dark:text-amber-400 text-sm mb-1">💡 Conseils du Chef</h5>
                          <p className="text-xs text-muted-foreground">{sheet.chefTips}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50">
                          <h5 className="font-medium text-green-700 dark:text-green-400 text-sm mb-1">🌍 Variantes</h5>
                          <p className="text-xs text-muted-foreground">{sheet.variations}</p>
                        </div>
                      </div>

                      {/* Serving Suggestion */}
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 p-3 rounded-lg border border-orange-200/30">
                        <h5 className="font-medium text-orange-700 dark:text-orange-400 text-sm mb-1">🍽️ Présentation</h5>
                        <p className="text-sm text-muted-foreground">{sheet.servingSuggestion}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cover Tab */}
        <TabsContent value="cover" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cover preview with 3D mockup */}
            <Card className="border-orange-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  Couverture 3D
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {coverImageUrl ? (
                  <div className="relative" style={{ perspective: '1200px' }}>
                    <div 
                      className="relative shadow-2xl"
                      style={{
                        transform: 'rotateY(-15deg)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Book cover */}
                      <img 
                        src={coverImageUrl} 
                        alt="Couverture"
                        className="max-h-[400px] w-auto rounded-r-md"
                        style={{ 
                          boxShadow: '20px 20px 60px rgba(0,0,0,0.4), -5px -5px 20px rgba(255,255,255,0.1)'
                        }}
                      />
                      {/* Book spine */}
                      <div 
                        className="absolute top-0 left-0 h-full w-8"
                        style={{
                          background: 'linear-gradient(to right, #1a1a1a, #333)',
                          transform: 'rotateY(-90deg) translateX(-16px)',
                          transformOrigin: 'left',
                          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                        }}
                      />
                      {/* Pages effect */}
                      <div 
                        className="absolute top-1 bottom-1 -right-3 w-3"
                        style={{
                          background: 'linear-gradient(to right, #f5f5f0, #fff)',
                          transform: 'rotateY(90deg) translateX(8px)',
                          transformOrigin: 'left',
                          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                    {/* Shadow */}
                    <div 
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-orange-300 mb-2" />
                      <p className="text-sm text-muted-foreground">Générez votre couverture</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Cover actions */}
            <Card className="border-orange-200/50">
              <CardHeader className="pb-3">
                <CardTitle>Actions Couverture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateCover}
                  disabled={isGeneratingCover || !bookTitle.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {isGeneratingCover ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {coverImageUrl ? 'Regénérer la couverture' : 'Générer la couverture'}
                    </>
                  )}
                </Button>
                
                {coverImageUrl && (
                  <Button
                    onClick={downloadCover}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger la couverture
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="mt-6">
          <Card className="border-orange-200/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-500" />
                Exporter votre livre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Contenu de l'export :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Couverture avec mockup 3D</li>
                  <li>✓ {sheets.length} fiches recettes avec photos</li>
                  <li>✓ Ingrédients et étapes de préparation</li>
                  <li>✓ Accords mets-vins pour chaque recette</li>
                </ul>
              </div>
              
              <Button
                onClick={exportToPDF}
                disabled={isExporting || sheets.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Exporter en PDF ({sheets.length} fiches)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookRecipeBookGenerator;
