import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Plane, Camera, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Globe, Mountain, Building, Palmtree,
  Compass, Sun, Users, Languages, Utensils, Hotel, HelpCircle, Copy, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

// Interface pour une fiche destination (800+ mots par fiche)
interface TravelSheet {
  id: number;
  destinationName: string;
  country: string;
  countryFlag: string;
  region: string;
  // Informations générales
  population: string;
  language: string;
  currency: string;
  climate: string;
  bestSeason: string;
  // Description riche
  description: string;         // 3-4 phrases sur l'ambiance et l'attrait
  history: string;             // Histoire et culture (2-3 phrases)
  // Gastronomie
  mainDish: string;            // Plat principal emblématique
  dishDescription: string;     // Description du plat (2-3 phrases)
  localSpecialties: string[];  // 3-4 spécialités locales
  // Hébergement
  accommodations: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  whereToStay: string;         // Conseils sur les quartiers où loger
  // Que visiter
  mustSee: string[];           // 5-6 lieux incontournables
  hiddenGems: string[];        // 2-3 trésors cachés
  activities: string[];        // 3-4 activités recommandées
  // Conseils pratiques
  travelTips: string;          // Conseils de voyage (2-3 phrases)
  transportation: string;      // Comment se déplacer
  // FAQ
  faq: {
    question: string;
    answer: string;
  }[];
  // Image
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

interface EbookTravelGuideGeneratorProps {
  ebookTitle?: string;
}

// Liste complète des pays du monde par continent
const worldCountries = {
  '🌍 Europe': [
    'France', 'Italie', 'Espagne', 'Allemagne', 'Grèce', 'Portugal', 'Belgique', 'Suisse',
    'Autriche', 'Pays-Bas', 'Pologne', 'Hongrie', 'République Tchèque', 'Croatie', 'Roumanie',
    'Irlande', 'Écosse', 'Danemark', 'Suède', 'Norvège', 'Finlande', 'Islande', 'Royaume-Uni'
  ],
  '🌎 Amérique du Nord': [
    'États-Unis', 'Canada', 'Mexique', 'Cuba', 'Costa Rica', 'Guatemala', 'Panama'
  ],
  '🌎 Amérique du Sud': [
    'Argentine', 'Brésil', 'Pérou', 'Chili', 'Colombie', 'Équateur', 'Bolivie', 'Uruguay'
  ],
  '🌏 Asie': [
    'Japon', 'Chine', 'Corée du Sud', 'Thaïlande', 'Vietnam', 'Inde', 'Indonésie',
    'Malaisie', 'Singapour', 'Philippines', 'Cambodge', 'Népal', 'Sri Lanka', 'Maldives'
  ],
  '🌏 Moyen-Orient': [
    'Turquie', 'Émirats Arabes Unis', 'Jordanie', 'Israël', 'Liban', 'Oman', 'Qatar'
  ],
  '🌍 Afrique': [
    'Maroc', 'Tunisie', 'Égypte', 'Sénégal', 'Kenya', 'Tanzanie', 'Afrique du Sud',
    'Madagascar', 'Maurice', 'Seychelles', 'Cap-Vert'
  ],
  '🌏 Océanie': [
    'Australie', 'Nouvelle-Zélande', 'Fidji', 'Polynésie Française', 'Nouvelle-Calédonie'
  ]
};

// Drapeaux par pays
const countryFlags: Record<string, string> = {
  'France': '🇫🇷', 'Italie': '🇮🇹', 'Espagne': '🇪🇸', 'Allemagne': '🇩🇪', 'Grèce': '🇬🇷',
  'Portugal': '🇵🇹', 'Belgique': '🇧🇪', 'Suisse': '🇨🇭', 'Autriche': '🇦🇹', 'Pays-Bas': '🇳🇱',
  'Pologne': '🇵🇱', 'Hongrie': '🇭🇺', 'République Tchèque': '🇨🇿', 'Croatie': '🇭🇷',
  'Roumanie': '🇷🇴', 'Irlande': '🇮🇪', 'Écosse': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Danemark': '🇩🇰',
  'Suède': '🇸🇪', 'Norvège': '🇳🇴', 'Finlande': '🇫🇮', 'Islande': '🇮🇸', 'Royaume-Uni': '🇬🇧',
  'États-Unis': '🇺🇸', 'Canada': '🇨🇦', 'Mexique': '🇲🇽', 'Cuba': '🇨🇺', 'Costa Rica': '🇨🇷',
  'Guatemala': '🇬🇹', 'Panama': '🇵🇦', 'Argentine': '🇦🇷', 'Brésil': '🇧🇷', 'Pérou': '🇵🇪',
  'Chili': '🇨🇱', 'Colombie': '🇨🇴', 'Équateur': '🇪🇨', 'Bolivie': '🇧🇴', 'Uruguay': '🇺🇾',
  'Japon': '🇯🇵', 'Chine': '🇨🇳', 'Corée du Sud': '🇰🇷', 'Thaïlande': '🇹🇭', 'Vietnam': '🇻🇳',
  'Inde': '🇮🇳', 'Indonésie': '🇮🇩', 'Malaisie': '🇲🇾', 'Singapour': '🇸🇬', 'Philippines': '🇵🇭',
  'Cambodge': '🇰🇭', 'Népal': '🇳🇵', 'Sri Lanka': '🇱🇰', 'Maldives': '🇲🇻',
  'Turquie': '🇹🇷', 'Émirats Arabes Unis': '🇦🇪', 'Jordanie': '🇯🇴', 'Israël': '🇮🇱',
  'Liban': '🇱🇧', 'Oman': '🇴🇲', 'Qatar': '🇶🇦', 'Maroc': '🇲🇦', 'Tunisie': '🇹🇳',
  'Égypte': '🇪🇬', 'Sénégal': '🇸🇳', 'Kenya': '🇰🇪', 'Tanzanie': '🇹🇿', 'Afrique du Sud': '🇿🇦',
  'Madagascar': '🇲🇬', 'Maurice': '🇲🇺', 'Seychelles': '🇸🇨', 'Cap-Vert': '🇨🇻',
  'Australie': '🇦🇺', 'Nouvelle-Zélande': '🇳🇿', 'Fidji': '🇫🇯', 'Polynésie Française': '🇵🇫',
  'Nouvelle-Calédonie': '🇳🇨'
};

const PHOTO_STYLES = [
  { id: 'realistic', label: '📷 Photo Réaliste', prompt: 'professional travel photography, high resolution, National Geographic style, vibrant colors, stunning landscape' },
  { id: 'cinematic', label: '🎬 Cinématique', prompt: 'cinematic travel photography, wide angle, dramatic lighting, movie quality, epic landscape' },
  { id: 'golden', label: '🌅 Heure Dorée', prompt: 'golden hour photography, warm sunset lighting, magical atmosphere, dreamy travel photo' },
  { id: 'aerial', label: '🚁 Vue Aérienne', prompt: 'aerial drone photography, stunning bird eye view, landscape perspective, travel magazine' },
];

const EbookTravelGuideGenerator: React.FC<EbookTravelGuideGeneratorProps> = ({ ebookTitle = '' }) => {
  // Configuration
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [authorName, setAuthorName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('tour-du-monde');
  const [numberOfSheets, setNumberOfSheets] = useState('20');
  const [photoStyle, setPhotoStyle] = useState('realistic');
  const [customInstructions, setCustomInstructions] = useState('');
  
  // State
  const [sheets, setSheets] = useState<TravelSheet[]>([]);
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

  // Parse JSON with fallback
  const cleanAndParseJSON = (content: string): any => {
    try {
      let cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*"destinations"[\s\S]*\}/);
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

  // Analyse du titre pour cohérence
  const analyzeTitle = (title: string): string => {
    const titleLower = title.toLowerCase();
    const countryKeywords: Record<string, string> = {
      'français': 'France', 'française': 'France', 'france': 'France', 'paris': 'France',
      'italien': 'Italie', 'italienne': 'Italie', 'italie': 'Italie', 'rome': 'Italie', 'venise': 'Italie',
      'espagnol': 'Espagne', 'espagnole': 'Espagne', 'espagne': 'Espagne', 'barcelone': 'Espagne', 'madrid': 'Espagne',
      'japonais': 'Japon', 'japonaise': 'Japon', 'japon': 'Japon', 'tokyo': 'Japon', 'kyoto': 'Japon',
      'thaïlandais': 'Thaïlande', 'thaïlandaise': 'Thaïlande', 'thaïlande': 'Thaïlande', 'bangkok': 'Thaïlande',
      'grec': 'Grèce', 'grecque': 'Grèce', 'grèce': 'Grèce', 'athènes': 'Grèce', 'santorin': 'Grèce',
      'marocain': 'Maroc', 'marocaine': 'Maroc', 'maroc': 'Maroc', 'marrakech': 'Maroc',
      'portugais': 'Portugal', 'portugaise': 'Portugal', 'portugal': 'Portugal', 'lisbonne': 'Portugal',
      'mexicain': 'Mexique', 'mexicaine': 'Mexique', 'mexique': 'Mexique',
      'indien': 'Inde', 'indienne': 'Inde', 'inde': 'Inde',
      'égyptien': 'Égypte', 'égyptienne': 'Égypte', 'égypte': 'Égypte', 'caire': 'Égypte',
      'turc': 'Turquie', 'turque': 'Turquie', 'turquie': 'Turquie', 'istanbul': 'Turquie',
      'australien': 'Australie', 'australienne': 'Australie', 'australie': 'Australie', 'sydney': 'Australie',
      'brésilien': 'Brésil', 'brésilienne': 'Brésil', 'brésil': 'Brésil', 'rio': 'Brésil',
      'vietnamien': 'Vietnam', 'vietnamienne': 'Vietnam', 'vietnam': 'Vietnam', 'hanoï': 'Vietnam',
      'croate': 'Croatie', 'croatie': 'Croatie', 'dubrovnik': 'Croatie',
      'islandais': 'Islande', 'islandaise': 'Islande', 'islande': 'Islande',
      'péruvien': 'Pérou', 'péruvienne': 'Pérou', 'pérou': 'Pérou', 'machu picchu': 'Pérou',
    };
    
    for (const [keyword, country] of Object.entries(countryKeywords)) {
      if (titleLower.includes(keyword)) {
        return country;
      }
    }
    return '';
  };

  // Generate travel sheets - BATCH MODE (5 fiches par appel pour éviter les timeouts)
  const generateTravelSheets = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour votre guide');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setSheets([]);
    
    try {
      const totalCount = parseInt(numberOfSheets);
      const BATCH_SIZE = 2; // 2 fiches par batch pour éviter absolument les timeouts
      const batches = Math.ceil(totalCount / BATCH_SIZE);
      
      // Analyse du titre pour cohérence
      const countryFromTitle = analyzeTitle(bookTitle);
      const finalCountry = countryFromTitle || (selectedCountry !== 'tour-du-monde' ? selectedCountry : '');
      
      const countryInstruction = finalCountry 
        ? `OBLIGATOIRE: TOUTES les destinations doivent être EXCLUSIVEMENT dans ${finalCountry}. NE PAS inclure de destinations d'autres pays.`
        : 'Variété des 5 continents avec des destinations emblématiques de différents pays.';

      let allDestinations: any[] = [];
      const alreadyGenerated: string[] = []; // Pour éviter les doublons

      for (let batch = 0; batch < batches; batch++) {
        const remaining = totalCount - allDestinations.length;
        const batchCount = Math.min(BATCH_SIZE, remaining);
        
        if (batchCount <= 0) break;

        const progressPercent = Math.round((batch / batches) * 35) + 5;
        setProgress(progressPercent);
        setCurrentStep(`Génération des fiches ${allDestinations.length + 1} à ${allDestinations.length + batchCount} sur ${totalCount}...`);

        // Instruction anti-doublons
        const excludeInstruction = alreadyGenerated.length > 0 
          ? `\n\n⚠️ NE PAS RÉPÉTER ces destinations déjà générées: ${alreadyGenerated.join(', ')}`
          : '';

        try {
          const { data, error } = await supabase.functions.invoke('generate-content', {
            body: {
              type: 'travel-sheets',
              prompt: `Tu es un expert en voyages internationaux et guide touristique professionnel.

TITRE DU GUIDE: "${bookTitle}"
${customInstructions ? `Instructions spéciales: ${customInstructions}` : ''}

⚠️ RÈGLE ABSOLUE - COHÉRENCE AVEC LE TITRE:
${countryInstruction}
${finalCountry ? `Les destinations DOIVENT toutes être en ${finalCountry}. Aucune exception.` : ''}
${excludeInstruction}

Génère exactement ${batchCount} FICHES DESTINATIONS COMPLÈTES (minimum 800 mots chacune).
Ce sont les fiches ${allDestinations.length + 1} à ${allDestinations.length + batchCount} d'un guide de ${totalCount} destinations.

IMPORTANT: Chaque fiche doit être TRÈS DÉTAILLÉE avec au moins 800 mots de contenu riche.
Retourne UNIQUEMENT du JSON valide, sans texte avant ni après.

Pour CHAQUE destination, fournis OBLIGATOIREMENT:
- destinationName: Nom de la ville/région/lieu (UNIQUE, pas de doublon)
- country: "${finalCountry || 'Pays d\'origine'}"
- region: La région spécifique
- population: Population approximative de la ville/région
- language: Langue(s) parlée(s)
- currency: Monnaie locale
- climate: Type de climat
- bestSeason: Meilleure période pour visiter
- description: Description immersive et captivante (4-5 phrases sur l'ambiance, les paysages, l'atmosphère)
- history: Histoire et contexte culturel (3-4 phrases sur le patrimoine, les traditions)
- mainDish: Le plat emblématique local
- dishDescription: Description appétissante du plat (3 phrases avec ingrédients et saveurs)
- localSpecialties: ["Spécialité 1", "Spécialité 2", "Spécialité 3"] - 3 autres spécialités culinaires
- accommodations: {"budget": "Nom et description hôtel économique", "midRange": "Nom et description hôtel milieu de gamme", "luxury": "Nom et description hôtel luxe"}
- whereToStay: Conseils sur les quartiers où loger (3-4 phrases)
- mustSee: ["Lieu 1 avec description courte", "Lieu 2...", ...] - 5-6 lieux incontournables
- hiddenGems: ["Trésor 1", "Trésor 2"] - 2-3 trésors cachés
- activities: ["Activité 1", "Activité 2", "Activité 3"] - 3-4 activités recommandées
- travelTips: Conseils pratiques essentiels (3-4 phrases)
- transportation: Comment se déplacer localement (2-3 phrases)
- faq: [{"question": "Question 1?", "answer": "Réponse détaillée 1"}, {"question": "Question 2?", "answer": "Réponse 2"}, {"question": "Question 3?", "answer": "Réponse 3"}] - EXACTEMENT 3 questions-réponses pertinentes

Format JSON strict:
{
  "destinations": [...]
}`
            }
          });

          if (error) {
            console.error(`Erreur batch ${batch + 1}:`, error);
            toast.warning(`Batch ${batch + 1} échoué, utilisation de destinations de secours`);
            const fallback = generateFallbackDestinations(batchCount, finalCountry);
            allDestinations = [...allDestinations, ...fallback];
          } else {
            const content = data?.content || data?.result || '';
            const parsed = cleanAndParseJSON(content);
            const destinations = parsed?.destinations || [];
            
            if (destinations.length > 0) {
              allDestinations = [...allDestinations, ...destinations];
              // Mémoriser les noms pour éviter les doublons
              destinations.forEach((d: any) => {
                if (d.destinationName) alreadyGenerated.push(d.destinationName);
              });
              toast.success(`Batch ${batch + 1}/${batches} : ${destinations.length} fiches générées`);
            } else {
              const fallback = generateFallbackDestinations(batchCount, finalCountry);
              allDestinations = [...allDestinations, ...fallback];
              toast.warning(`Batch ${batch + 1} vide, ${fallback.length} fiches de secours ajoutées`);
            }
          }
        } catch (batchError) {
          console.error(`Erreur batch ${batch + 1}:`, batchError);
          const fallback = generateFallbackDestinations(batchCount, finalCountry);
          allDestinations = [...allDestinations, ...fallback];
          toast.warning(`Erreur batch ${batch + 1}, ${fallback.length} fiches de secours`);
        }

        // Petite pause entre les batches pour éviter le rate limiting
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Convert to sheets with flags
      const generatedSheets: TravelSheet[] = allDestinations.slice(0, totalCount).map((dest: any, index: number) => ({
        id: index + 1,
        destinationName: dest.destinationName || `Destination ${index + 1}`,
        country: dest.country || finalCountry || 'International',
        countryFlag: countryFlags[dest.country] || '🌍',
        region: dest.region || 'Région à découvrir',
        population: dest.population || 'Information non disponible',
        language: dest.language || 'Langue locale',
        currency: dest.currency || 'Monnaie locale',
        climate: dest.climate || 'Climat tempéré',
        bestSeason: dest.bestSeason || 'Toute l\'année',
        description: dest.description || 'Une destination magnifique à découvrir.',
        history: dest.history || 'Riche en histoire et en culture.',
        mainDish: dest.mainDish || 'Spécialité locale',
        dishDescription: dest.dishDescription || 'Un plat savoureux aux saveurs authentiques.',
        localSpecialties: Array.isArray(dest.localSpecialties) ? dest.localSpecialties : ['Spécialité 1', 'Spécialité 2'],
        accommodations: dest.accommodations || { budget: 'Auberge locale', midRange: 'Hôtel confortable', luxury: 'Palace 5 étoiles' },
        whereToStay: dest.whereToStay || 'Le centre-ville offre les meilleures options.',
        mustSee: Array.isArray(dest.mustSee) ? dest.mustSee : ['Site principal', 'Monument historique'],
        hiddenGems: Array.isArray(dest.hiddenGems) ? dest.hiddenGems : ['Trésor caché'],
        activities: Array.isArray(dest.activities) ? dest.activities : ['Activité locale'],
        travelTips: dest.travelTips || 'Préparez bien votre voyage.',
        transportation: dest.transportation || 'Transport local disponible.',
        faq: Array.isArray(dest.faq) && dest.faq.length >= 3 ? dest.faq.slice(0, 3) : [
          { question: 'Quelle est la meilleure période?', answer: 'Consultez les saisons locales.' },
          { question: 'Quel budget prévoir?', answer: 'Dépend de votre style de voyage.' },
          { question: 'Comment se déplacer?', answer: 'Transport local recommandé.' }
        ],
      }));

      setSheets(generatedSheets);
      setProgress(40);
      
      // Generate images
      await generateSheetImages(generatedSheets);
      
      setProgress(100);
      setCurrentStep('Guide de voyage généré !');
      setActiveTab('sheets');
      toast.success(`🎉 ${generatedSheets.length} fiches destinations générées !`);
      
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback destinations generator
  const generateFallbackDestinations = (count: number, country: string) => {
    const fallbackData: any[] = [];
    const genericDestinations = [
      { name: 'Capitale historique', region: 'Centre' },
      { name: 'Côte sauvage', region: 'Littoral' },
      { name: 'Montagne majestueuse', region: 'Massif central' },
      { name: 'Village pittoresque', region: 'Campagne' },
      { name: 'Cité médiévale', region: 'Province' },
    ];
    
    for (let i = 0; i < count; i++) {
      const template = genericDestinations[i % genericDestinations.length];
      fallbackData.push({
        destinationName: `${template.name} de ${country || 'la région'}`,
        country: country || 'International',
        region: template.region,
        population: 'Plusieurs milliers d\'habitants',
        language: 'Langue locale',
        currency: 'Monnaie locale',
        climate: 'Climat agréable',
        bestSeason: 'Printemps et automne',
        description: `Une destination exceptionnelle offrant des paysages à couper le souffle et une culture riche.`,
        history: 'Un lieu chargé d\'histoire et de traditions séculaires.',
        mainDish: 'Spécialité traditionnelle locale',
        dishDescription: 'Un plat savoureux préparé selon des recettes ancestrales.',
        localSpecialties: ['Fromage local', 'Vin régional', 'Pâtisserie traditionnelle'],
        accommodations: {
          budget: 'Auberge de jeunesse accueillante',
          midRange: 'Hôtel 3 étoiles confortable',
          luxury: 'Hôtel de charme 5 étoiles'
        },
        whereToStay: 'Le centre historique est idéal pour séjourner.',
        mustSee: ['Place centrale', 'Cathédrale historique', 'Musée local', 'Parc naturel', 'Marché traditionnel'],
        hiddenGems: ['Ruelles secrètes', 'Point de vue panoramique'],
        activities: ['Randonnée', 'Dégustation locale', 'Visite guidée'],
        travelTips: 'Réservez vos hébergements à l\'avance en haute saison.',
        transportation: 'Location de voiture recommandée pour explorer la région.',
        faq: [
          { question: 'Quel budget prévoir par jour?', answer: 'Comptez entre 80 et 150€ par jour selon votre style.' },
          { question: 'La région est-elle sûre?', answer: 'Oui, c\'est une destination très sûre pour les touristes.' },
          { question: 'Faut-il parler la langue locale?', answer: 'Les bases suffisent, l\'anglais est souvent compris.' }
        ]
      });
    }
    return fallbackData;
  };

  // Generate images for all sheets using dedicated travel image function
  const generateSheetImages = async (sheetsToProcess: TravelSheet[]) => {
    setIsGeneratingImages(true);
    
    for (let i = 0; i < sheetsToProcess.length; i++) {
      const sheet = sheetsToProcess[i];
      setCurrentStep(`Image ${i + 1}/${sheetsToProcess.length}: ${sheet.destinationName}...`);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-travel-image', {
          body: {
            destinationName: sheet.destinationName,
            country: sheet.country,
            photoStyle: photoStyle
          }
        });

        if (error) {
          console.error(`Erreur image ${sheet.destinationName}:`, error);
          if (error.message?.includes('429') || error.message?.includes('402')) {
            toast.error(`Limite atteinte - images suivantes ignorées`);
            break;
          }
        } else if (data?.imageUrl) {
          setSheets(prev => prev.map(s => 
            s.id === sheet.id ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s
          ));
          toast.success(`Image générée: ${sheet.destinationName}`);
        }
      } catch (err) {
        console.error(`Erreur image ${sheet.destinationName}:`, err);
      }
      
      setProgress(40 + ((i + 1) / sheetsToProcess.length) * 55);
    }
    
    setIsGeneratingImages(false);
  };

  // Regenerate single image using dedicated travel image function
  const regenerateImage = async (sheetId: number) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (!sheet) return;
    
    setSheets(prev => prev.map(s => 
      s.id === sheetId ? { ...s, isGeneratingImage: true } : s
    ));
    
    toast.info(`Regénération de l'image pour ${sheet.destinationName}...`);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-travel-image', {
        body: {
          destinationName: sheet.destinationName,
          country: sheet.country,
          photoStyle: photoStyle
        }
      });

      if (!error && data?.imageUrl) {
        setSheets(prev => prev.map(s => 
          s.id === sheetId ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s
        ));
        toast.success('Image regénérée !');
      } else {
        throw new Error(error?.message || 'Échec génération');
      }
    } catch (err) {
      setSheets(prev => prev.map(s => 
        s.id === sheetId ? { ...s, isGeneratingImage: false } : s
      ));
      toast.error('Erreur lors de la regénération');
    }
  };

  // Generate cover
  const generateCover = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez d\'abord entrer un titre');
      return;
    }

    setIsGeneratingCover(true);
    try {
      const photoPrompt = PHOTO_STYLES.find(s => s.id === photoStyle)?.prompt || PHOTO_STYLES[0].prompt;
      
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: bookTitle,
          authorName: authorName,
          genre: 'travel',
          style: 'modern',
          customPrompt: `${photoPrompt}. 
Epic travel book cover showing beautiful destinations.
Professional travel photography, magazine quality, cinematic.
Must include the title "${bookTitle}" prominently displayed.
${authorName ? `Include author name: ${authorName}` : ''}`,
          showTitle: true,
          showAuthorName: !!authorName,
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setCoverImageUrl(data.imageUrl);
        toast.success('Couverture générée !');
      }
    } catch (err) {
      console.error('Erreur couverture:', err);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Copy sheet content
  const copySheet = async (sheet: TravelSheet) => {
    const content = `
${sheet.countryFlag} ${sheet.destinationName.toUpperCase()} - ${sheet.country}
${sheet.region}

📊 INFORMATIONS GÉNÉRALES
• Population: ${sheet.population}
• Langue: ${sheet.language}
• Monnaie: ${sheet.currency}
• Climat: ${sheet.climate}
• Meilleure saison: ${sheet.bestSeason}

📝 DESCRIPTION
${sheet.description}

📜 HISTOIRE & CULTURE
${sheet.history}

🍽️ GASTRONOMIE
Plat emblématique: ${sheet.mainDish}
${sheet.dishDescription}

Spécialités locales:
${sheet.localSpecialties.map(s => `• ${s}`).join('\n')}

🏨 HÉBERGEMENT
Budget: ${sheet.accommodations.budget}
Milieu de gamme: ${sheet.accommodations.midRange}
Luxe: ${sheet.accommodations.luxury}

📍 Où loger: ${sheet.whereToStay}

🏛️ INCONTOURNABLES
${sheet.mustSee.map(m => `• ${m}`).join('\n')}

💎 TRÉSORS CACHÉS
${sheet.hiddenGems.map(g => `• ${g}`).join('\n')}

🎯 ACTIVITÉS
${sheet.activities.map(a => `• ${a}`).join('\n')}

💡 CONSEILS PRATIQUES
${sheet.travelTips}

🚌 TRANSPORTS
${sheet.transportation}

❓ FAQ
${sheet.faq.map(f => `Q: ${f.question}\nR: ${f.answer}`).join('\n\n')}
    `.trim();
    
    await navigator.clipboard.writeText(content);
    setCopiedIndex(sheet.id);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Fiche copiée !');
  };

  // Export to PDF - Fixed for emoji support and cross-origin images
  const exportToPDF = async () => {
    if (sheets.length === 0) {
      toast.error('Générez d\'abord des fiches');
      return;
    }

    setIsExporting(true);
    toast.info('Création du PDF en cours...');
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Helper: Convert image URL to base64 for cross-origin support
      const loadImageAsBase64 = (url: string): Promise<string | null> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
              } else {
                resolve(null);
              }
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = url;
        });
      };

      // Cover page
      if (coverImageUrl) {
        const coverBase64 = await loadImageAsBase64(coverImageUrl);
        if (coverBase64) {
          pdf.addImage(coverBase64, 'JPEG', 0, 0, pageWidth, pageHeight);
        } else {
          // Fallback cover
          pdf.setFillColor(20, 60, 100);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(28);
          pdf.text(bookTitle, pageWidth / 2, pageHeight / 2, { align: 'center' });
          if (authorName) {
            pdf.setFontSize(16);
            pdf.text(authorName, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
          }
        }
      } else {
        pdf.setFillColor(20, 60, 100);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.text(bookTitle, pageWidth / 2, pageHeight / 2, { align: 'center' });
        if (authorName) {
          pdf.setFontSize(16);
          pdf.text(authorName, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
        }
      }

      // Generate each sheet as a page
      for (let sheetIdx = 0; sheetIdx < sheets.length; sheetIdx++) {
        const sheet = sheets[sheetIdx];
        pdf.addPage();
        let yPos = margin;

        // Header with flag and name (using text instead of emojis)
        pdf.setFillColor(235, 245, 255);
        pdf.rect(0, 0, pageWidth, 45, 'F');
        
        pdf.setFontSize(22);
        pdf.setTextColor(30, 60, 100);
        pdf.setFont('helvetica', 'bold');
        pdf.text(sheet.destinationName.toUpperCase(), margin, 22);
        
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${sheet.country} - ${sheet.region}`, margin, 35);
        
        yPos = 55;
        
        // Two-column layout
        const colWidth = (contentWidth - 10) / 2;
        const leftCol = margin;
        const rightCol = margin + colWidth + 10;

        // Left column - Image
        if (sheet.imageUrl) {
          const imgBase64 = await loadImageAsBase64(sheet.imageUrl);
          if (imgBase64) {
            pdf.addImage(imgBase64, 'JPEG', leftCol, yPos, colWidth, colWidth * 0.65);
            yPos += colWidth * 0.65 + 5;
          }
        }

        // Info box (without emojis)
        const infoBoxY = yPos;
        pdf.setFillColor(245, 250, 255);
        pdf.roundedRect(leftCol, infoBoxY, colWidth, 50, 3, 3, 'F');
        pdf.setDrawColor(200, 220, 240);
        pdf.roundedRect(leftCol, infoBoxY, colWidth, 50, 3, 3, 'S');
        
        pdf.setFontSize(9);
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'bold');
        pdf.text('INFOS PRATIQUES', leftCol + 5, infoBoxY + 8);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text(`Population: ${sheet.population}`, leftCol + 5, infoBoxY + 16);
        pdf.text(`Langue: ${sheet.language}`, leftCol + 5, infoBoxY + 23);
        pdf.text(`Monnaie: ${sheet.currency}`, leftCol + 5, infoBoxY + 30);
        pdf.text(`Climat: ${sheet.climate}`, leftCol + 5, infoBoxY + 37);
        pdf.text(`Meilleure saison: ${sheet.bestSeason}`, leftCol + 5, infoBoxY + 44);

        // Transport & Tips box below
        const tipsBoxY = infoBoxY + 55;
        pdf.setFillColor(255, 252, 245);
        pdf.roundedRect(leftCol, tipsBoxY, colWidth, 45, 3, 3, 'F');
        pdf.setDrawColor(230, 220, 200);
        pdf.roundedRect(leftCol, tipsBoxY, colWidth, 45, 3, 3, 'S');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CONSEILS PRATIQUES', leftCol + 5, tipsBoxY + 8);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        const tipsLines = pdf.splitTextToSize(sheet.travelTips, colWidth - 10);
        pdf.text(tipsLines.slice(0, 4), leftCol + 5, tipsBoxY + 16);
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('Transport:', leftCol + 5, tipsBoxY + 35);
        pdf.setFont('helvetica', 'normal');
        const transLines = pdf.splitTextToSize(sheet.transportation, colWidth - 10);
        pdf.text(transLines.slice(0, 2), leftCol + 25, tipsBoxY + 35);

        // Right column - Content
        let rightY = 55;
        
        // Description
        pdf.setFontSize(10);
        pdf.setTextColor(30, 60, 100);
        pdf.setFont('helvetica', 'bold');
        pdf.text('A DECOUVRIR', rightCol, rightY);
        rightY += 6;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(40, 40, 40);
        pdf.setFontSize(8);
        const descLines = pdf.splitTextToSize(sheet.description, colWidth);
        pdf.text(descLines.slice(0, 6), rightCol, rightY);
        rightY += Math.min(descLines.length, 6) * 4 + 5;

        // History
        if (sheet.history && rightY < 110) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 60, 100);
          pdf.text('HISTOIRE & CULTURE', rightCol, rightY);
          rightY += 6;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(8);
          const histLines = pdf.splitTextToSize(sheet.history, colWidth);
          pdf.text(histLines.slice(0, 4), rightCol, rightY);
          rightY += Math.min(histLines.length, 4) * 4 + 5;
        }

        // Main dish
        if (rightY < 145) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 60, 100);
          pdf.text(`GASTRONOMIE: ${sheet.mainDish}`, rightCol, rightY);
          rightY += 6;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(8);
          const dishLines = pdf.splitTextToSize(sheet.dishDescription, colWidth);
          pdf.text(dishLines.slice(0, 4), rightCol, rightY);
          rightY += Math.min(dishLines.length, 4) * 4 + 5;
        }

        // Must see
        if (rightY < 180) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 60, 100);
          pdf.text('INCONTOURNABLES', rightCol, rightY);
          rightY += 6;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(8);
          sheet.mustSee.slice(0, 5).forEach(m => {
            const truncated = m.length > 55 ? m.substring(0, 52) + '...' : m;
            pdf.text(`- ${truncated}`, rightCol, rightY);
            rightY += 4;
          });
          rightY += 3;
        }

        // Accommodations
        if (rightY < 210) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 60, 100);
          pdf.text('HEBERGEMENT', rightCol, rightY);
          rightY += 6;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(8);
          const budgetText = sheet.accommodations.budget.length > 50 
            ? sheet.accommodations.budget.substring(0, 47) + '...' 
            : sheet.accommodations.budget;
          const midText = sheet.accommodations.midRange.length > 50 
            ? sheet.accommodations.midRange.substring(0, 47) + '...' 
            : sheet.accommodations.midRange;
          const luxText = sheet.accommodations.luxury.length > 50 
            ? sheet.accommodations.luxury.substring(0, 47) + '...' 
            : sheet.accommodations.luxury;
          pdf.text(`Budget: ${budgetText}`, rightCol, rightY);
          rightY += 4;
          pdf.text(`Milieu de gamme: ${midText}`, rightCol, rightY);
          rightY += 4;
          pdf.text(`Luxe: ${luxText}`, rightCol, rightY);
          rightY += 8;
        }

        // FAQ at bottom
        const faqY = 238;
        pdf.setFillColor(250, 252, 255);
        pdf.roundedRect(margin, faqY, contentWidth, 48, 3, 3, 'F');
        pdf.setDrawColor(200, 215, 230);
        pdf.roundedRect(margin, faqY, contentWidth, 48, 3, 3, 'S');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 60, 100);
        pdf.text('QUESTIONS FREQUENTES', margin + 5, faqY + 8);
        
        let faqTextY = faqY + 15;
        pdf.setTextColor(40, 40, 40);
        
        sheet.faq.slice(0, 3).forEach((f) => {
          if (faqTextY < faqY + 45) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(8);
            const question = f.question.length > 90 ? f.question.substring(0, 87) + '...' : f.question;
            pdf.text(`Q: ${question}`, margin + 5, faqTextY);
            faqTextY += 4;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7);
            const answerLines = pdf.splitTextToSize(`R: ${f.answer}`, contentWidth - 10);
            pdf.text(answerLines.slice(0, 2), margin + 5, faqTextY);
            faqTextY += 9;
          }
        });

        // Page number
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`- ${sheetIdx + 1} -`, pageWidth / 2, pageHeight - 8, { align: 'center' });
      }

      pdf.save(`${bookTitle.replace(/[^a-zA-Z0-9]/g, '_')}_guide_voyage.pdf`);
      toast.success('PDF exporte avec succes !');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Count words in a sheet
  const countWords = (sheet: TravelSheet): number => {
    const allText = [
      sheet.description,
      sheet.history,
      sheet.dishDescription,
      sheet.localSpecialties.join(' '),
      sheet.whereToStay,
      sheet.mustSee.join(' '),
      sheet.hiddenGems.join(' '),
      sheet.activities.join(' '),
      sheet.travelTips,
      sheet.transportation,
      sheet.faq.map(f => `${f.question} ${f.answer}`).join(' '),
      sheet.accommodations.budget,
      sheet.accommodations.midRange,
      sheet.accommodations.luxury,
    ].join(' ');
    return allText.split(/\s+/).filter(w => w.length > 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Plane className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Générateur de Guides de Voyage
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  Fiches 800+ mots
                </Badge>
              </CardTitle>
              <CardDescription>
                Créez des fiches destinations ultra-complètes avec population, langue, gastronomie, hébergements et FAQ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      {isGenerating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium text-blue-700">{currentStep}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-blue-600 mt-2">{Math.round(progress)}% complété</p>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="cover" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Couverture
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2" disabled={sheets.length === 0}>
            <FileText className="h-4 w-4" />
            Fiches ({sheets.length})
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2" disabled={sheets.length === 0}>
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Titre du guide *</Label>
                  <Input
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Ex: Les plus belles destinations de France"
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Le titre détermine automatiquement le pays (ex: "destinations françaises" → France uniquement)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Nom de l'auteur</Label>
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Pays / Région</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectItem value="tour-du-monde">🌍 Tour du monde</SelectItem>
                      {Object.entries(worldCountries).map(([continent, countries]) => (
                        <React.Fragment key={continent}>
                          <SelectItem value={`header-${continent}`} disabled className="font-bold bg-muted">
                            {continent}
                          </SelectItem>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>
                              {countryFlags[country] || '🌍'} {country}
                            </SelectItem>
                          ))}
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nombre de fiches</Label>
                  <Select value={numberOfSheets} onValueChange={setNumberOfSheets}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 25, 30, 35, 40].map(n => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} fiches destinations
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style photo</Label>
                  <Select value={photoStyle} onValueChange={setPhotoStyle}>
                    <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label>Instructions personnalisées (optionnel)</Label>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Focus sur les destinations romantiques, privilégier les endroits peu touristiques..."
                  rows={3}
                />
              </div>

              <Button
                onClick={generateTravelSheets}
                disabled={isGenerating || !bookTitle.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Générer {numberOfSheets} fiches destinations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cover Tab */}
        <TabsContent value="cover">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Cover Preview - Simple image display */}
                <div className="flex flex-col items-center">
                  {coverImageUrl ? (
                    <div className="relative">
                      <img 
                        src={coverImageUrl} 
                        alt="Couverture du guide" 
                        className="max-h-[450px] w-auto rounded-lg shadow-2xl object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                      <div className="text-center p-6">
                        <Plane className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                        <h3 className="text-lg font-semibold text-blue-600">{bookTitle || 'Titre du guide'}</h3>
                        {authorName && <p className="mt-2 text-sm text-muted-foreground">{authorName}</p>}
                        <p className="mt-4 text-sm text-muted-foreground">Cliquez sur "Générer" pour créer votre couverture</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Générer la couverture</h3>
                  <p className="text-sm text-muted-foreground">
                    La couverture sera générée avec le titre et le style photo sélectionnés.
                  </p>
                  
                  <Button
                    onClick={generateCover}
                    disabled={isGeneratingCover || !bookTitle.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {isGeneratingCover ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        {coverImageUrl ? 'Regénérer la couverture' : 'Générer la couverture'}
                      </>
                    )}
                  </Button>
                  
                  {coverImageUrl && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = coverImageUrl;
                        link.download = `couverture-${bookTitle.replace(/\s+/g, '-')}.png`;
                        link.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger la couverture
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sheets Tab */}
        <TabsContent value="sheets">
          <div className="space-y-6">
            {sheets.map((sheet) => (
              <Card key={sheet.id} className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{sheet.countryFlag}</span>
                      <div>
                        <CardTitle className="text-xl">{sheet.destinationName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{sheet.country} • {sheet.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={countWords(sheet) >= 800 
                          ? "bg-green-100 text-green-700 border-green-300" 
                          : "bg-red-100 text-red-700 border-red-300"
                        }
                      >
                        {countWords(sheet)} mots {countWords(sheet) >= 800 ? '✓' : '⚠️'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copySheet(sheet)}
                      >
                        {copiedIndex === sheet.id ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left column - Image and quick info */}
                    <div className="space-y-4">
                      {/* Image */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                        {sheet.imageUrl ? (
                          <img 
                            src={sheet.imageUrl} 
                            alt={sheet.destinationName}
                            className="w-full h-full object-cover"
                          />
                        ) : sheet.isGeneratingImage ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-blue-300" />
                          </div>
                        )}
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2 opacity-90"
                          onClick={() => regenerateImage(sheet.id)}
                          disabled={sheet.isGeneratingImage}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${sheet.isGeneratingImage ? 'animate-spin' : ''}`} />
                          Regénérer
                        </Button>
                      </div>

                      {/* Quick info box */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Globe className="h-4 w-4" /> Infos pratiques
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-muted-foreground">Pop:</span>
                            <span className="font-medium truncate">{sheet.population}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">Langue:</span>
                            <span className="font-medium">{sheet.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">💰</span>
                            <span className="text-muted-foreground">Monnaie:</span>
                            <span className="font-medium">{sheet.currency}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <span className="text-muted-foreground">Saison:</span>
                            <span className="font-medium truncate">{sheet.bestSeason}</span>
                          </div>
                        </div>
                      </div>

                      {/* Main dish */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                          <Utensils className="h-4 w-4" /> Plat emblématique
                        </h4>
                        <p className="font-bold text-lg text-orange-700">{sheet.mainDish}</p>
                        <p className="text-sm text-muted-foreground mt-1">{sheet.dishDescription}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sheet.localSpecialties.map((spec, i) => (
                            <Badge key={i} variant="outline" className="bg-white text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right column - Detailed content */}
                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold mb-2">📝 Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{sheet.description}</p>
                      </div>

                      {/* History */}
                      <div>
                        <h4 className="font-semibold mb-2">📜 Histoire & Culture</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{sheet.history}</p>
                      </div>

                      {/* Must see */}
                      <div>
                        <h4 className="font-semibold mb-2">🏛️ Incontournables</h4>
                        <ul className="space-y-1">
                          {sheet.mustSee.map((place, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              <span>{place}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Accommodations */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <Hotel className="h-4 w-4" /> Hébergement
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <Badge className="bg-green-100 text-green-700 mb-1">Budget</Badge>
                            <p className="text-muted-foreground">{sheet.accommodations.budget}</p>
                          </div>
                          <div>
                            <Badge className="bg-blue-100 text-blue-700 mb-1">Milieu de gamme</Badge>
                            <p className="text-muted-foreground">{sheet.accommodations.midRange}</p>
                          </div>
                          <div>
                            <Badge className="bg-purple-100 text-purple-700 mb-1">Luxe</Badge>
                            <p className="text-muted-foreground">{sheet.accommodations.luxury}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-3 text-muted-foreground italic">{sheet.whereToStay}</p>
                      </div>

                      {/* FAQ */}
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4">
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <HelpCircle className="h-4 w-4" /> FAQ
                        </h4>
                        <div className="space-y-3">
                          {sheet.faq.map((item, i) => (
                            <div key={i}>
                              <p className="font-medium text-sm">Q: {item.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">R: {item.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card className="border-2 border-dashed border-amber-400/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  NOUVEAU 2026
                </Badge>
                <h3 className="text-xl font-bold">Exporter votre guide de voyage</h3>
                <p className="text-muted-foreground">
                  {sheets.length} fiches destinations prêtes à exporter
                </p>
                <Button
                  onClick={exportToPDF}
                  disabled={isExporting || sheets.length === 0}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Télécharger le PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EbookTravelGuideGenerator;
