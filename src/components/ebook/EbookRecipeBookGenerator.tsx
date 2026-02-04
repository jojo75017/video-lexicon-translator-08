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

// Interface pour une fiche recette
interface RecipeSheet {
  id: number;
  country: string;
  countryFlag: string;
  dishName: string;
  description: string;
  ingredients: string[];
  steps: string[];
  winePairing: string;
  wineReason: string;
  cookingTime: string;
  difficulty: string;
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

      // Determine countries to use
      const countryContext = selectedCountry === 'tour-du-monde' 
        ? 'des pays du monde entier (variété des 5 continents)'
        : `de ${selectedCountry}`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'recipe-sheets',
          prompt: `Tu es un chef étoilé et sommelier expert. Génère exactement ${count} fiches recettes traditionnelles ${countryContext}.

Titre du livre: "${bookTitle}"
${customInstructions ? `Instructions spéciales: ${customInstructions}` : ''}

IMPORTANT: Retourne UNIQUEMENT du JSON valide, sans texte avant ni après.

Pour CHAQUE recette, fournis:
- country: Le pays d'origine
- dishName: Le nom authentique du plat
- description: Une description appétissante (2-3 phrases)
- ingredients: Liste de 6-8 ingrédients clés
- steps: 4-5 étapes de préparation concises
- winePairing: Le nom du vin ou boisson recommandé
- wineReason: Pourquoi cet accord fonctionne (1 phrase)
- cookingTime: Temps de préparation et cuisson
- difficulty: Facile, Moyen ou Difficile

Varie les pays, les types de plats (entrées, plats, desserts) et les saveurs.
Inclus des recettes emblématiques et authentiques.

Format JSON strict:
{
  "recipes": [
    {
      "country": "France",
      "dishName": "Coq au Vin",
      "description": "Un grand classique de la cuisine bourguignonne...",
      "ingredients": ["Poulet fermier", "Vin rouge Bourgogne", "Lardons", "Champignons", "Oignons grelots", "Thym frais"],
      "steps": ["Mariner le poulet dans le vin rouge", "Faire revenir les lardons", "Braiser 2 heures à feu doux", "Servir avec des pommes de terre"],
      "winePairing": "Bourgogne Pinot Noir",
      "wineReason": "La finesse du vin complète parfaitement la sauce au vin rouge",
      "cookingTime": "Préparation: 30 min | Cuisson: 2h",
      "difficulty": "Moyen"
    }
  ]
}`
        }
      });

      if (error) throw error;

      const content = data?.content || data?.result || '';
      const parsed = cleanAndParseJSON(content);
      
      let recipes = parsed?.recipes || [];
      
      // Pad with fallback recipes if needed
      if (recipes.length < count) {
        const fallbackRecipes = generateFallbackRecipes(count - recipes.length);
        recipes = [...recipes, ...fallbackRecipes];
        toast.warning(`${fallbackRecipes.length} fiches de secours ajoutées`);
      }

      // Convert to sheets with flags
      const generatedSheets: RecipeSheet[] = recipes.slice(0, count).map((recipe: any, index: number) => ({
        id: index + 1,
        country: recipe.country || 'International',
        countryFlag: countryFlags[recipe.country] || '🌍',
        dishName: recipe.dishName || `Recette ${index + 1}`,
        description: recipe.description || 'Délicieuse recette traditionnelle.',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : ['Ingrédients variés'],
        steps: Array.isArray(recipe.steps) ? recipe.steps : ['Préparer les ingrédients', 'Cuisiner', 'Servir'],
        winePairing: recipe.winePairing || 'Vin rouge ou blanc',
        wineReason: recipe.wineReason || 'Accord harmonieux',
        cookingTime: recipe.cookingTime || '45 min',
        difficulty: recipe.difficulty || 'Moyen',
      }));

      setSheets(generatedSheets);
      setProgress(40);
      
      // Generate images
      await generateSheetImages(generatedSheets);
      
      setProgress(100);
      setCurrentStep('Livre de recettes généré !');
      setActiveTab('sheets');
      toast.success(`${generatedSheets.length} fiches recettes générées !`);
      
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback recipes generator
  const generateFallbackRecipes = (count: number) => {
    const fallbackData = [
      { country: 'France', dishName: 'Ratatouille', description: 'Légumes du soleil mijotés à la provençale', winePairing: 'Côtes de Provence Rosé' },
      { country: 'Italie', dishName: 'Risotto alla Milanese', description: 'Riz crémeux au safran', winePairing: 'Barbera d\'Alba' },
      { country: 'Japon', dishName: 'Ramen Tonkotsu', description: 'Bouillon de porc onctueux', winePairing: 'Bière japonaise Asahi' },
      { country: 'Mexique', dishName: 'Tacos al Pastor', description: 'Porc mariné à l\'ananas', winePairing: 'Margarita classique' },
      { country: 'Inde', dishName: 'Butter Chicken', description: 'Poulet dans une sauce tomate crémeuse', winePairing: 'Gewürztraminer' },
      { country: 'Maroc', dishName: 'Tajine d\'Agneau', description: 'Agneau aux pruneaux et amandes', winePairing: 'Vin gris de Boulaouane' },
      { country: 'Thaïlande', dishName: 'Pad Thai', description: 'Nouilles sautées aux crevettes', winePairing: 'Riesling demi-sec' },
      { country: 'Grèce', dishName: 'Moussaka', description: 'Gratin d\'aubergines et viande', winePairing: 'Naoussa rouge' },
      { country: 'Pérou', dishName: 'Ceviche', description: 'Poisson mariné au citron vert', winePairing: 'Pisco Sour' },
      { country: 'Espagne', dishName: 'Paella Valenciana', description: 'Riz safrané aux fruits de mer', winePairing: 'Albariño' },
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      const base = fallbackData[i % fallbackData.length];
      result.push({
        ...base,
        ingredients: ['Ingrédient 1', 'Ingrédient 2', 'Ingrédient 3', 'Ingrédient 4'],
        steps: ['Étape 1', 'Étape 2', 'Étape 3'],
        wineReason: 'Accord parfait',
        cookingTime: '45 min',
        difficulty: 'Moyen'
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

        if (!error && data?.imageUrl) {
          updatedSheets[i] = { ...updatedSheets[i], imageUrl: data.imageUrl };
          setSheets([...updatedSheets]);
        }
      } catch (err) {
        console.error(`Erreur image ${i + 1}:`, err);
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

      if (!error && data?.imageUrl) {
        setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false } : s));
        toast.success('Image régénérée !');
      } else {
        throw new Error('Pas d\'image');
      }
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

      if (error) throw error;

      if (data?.imageUrl) {
        setCoverImageUrl(data.imageUrl);
        toast.success('Couverture générée !');
      }
    } catch (error) {
      console.error('Erreur couverture:', error);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Copy sheet to clipboard
  const copySheet = async (sheet: RecipeSheet, index: number) => {
    const text = `${sheet.countryFlag} ${sheet.country.toUpperCase()}

🍽️ ${sheet.dishName}

${sheet.description}

📝 INGRÉDIENTS
${sheet.ingredients.map(i => `• ${i}`).join('\n')}

👨‍🍳 PRÉPARATION
${sheet.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

🍷 ACCORD VIN
${sheet.winePairing}
${sheet.wineReason}

⏱️ ${sheet.cookingTime} | ${sheet.difficulty}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success('Fiche copiée !');
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

      // Recipe sheets - one per page
      for (const sheet of sheets) {
        pdf.addPage();
        
        let yPos = margin;
        
        // Country header
        pdf.setFillColor(245, 245, 220);
        pdf.rect(margin, yPos, contentWidth, 12, 'F');
        pdf.setTextColor(139, 69, 19);
        pdf.setFontSize(14);
        pdf.text(`${sheet.countryFlag} ${sheet.country}`, margin + 5, yPos + 8);
        yPos += 18;
        
        // Dish name
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text(sheet.dishName, margin, yPos);
        yPos += 10;
        
        // Difficulty and time
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`${sheet.difficulty} | ${sheet.cookingTime}`, margin, yPos);
        yPos += 10;
        
        // Image
        if (sheet.imageUrl) {
          try {
            const response = await fetch(sheet.imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            await new Promise<void>((resolve) => {
              reader.onloadend = () => {
                const base64 = reader.result as string;
                pdf.addImage(base64, 'PNG', margin, yPos, contentWidth, 60);
                resolve();
              };
              reader.readAsDataURL(blob);
            });
            yPos += 65;
          } catch {
            yPos += 5;
          }
        }
        
        // Description
        pdf.setFontSize(11);
        pdf.setTextColor(60, 60, 60);
        const descLines = pdf.splitTextToSize(sheet.description, contentWidth);
        pdf.text(descLines, margin, yPos);
        yPos += descLines.length * 5 + 8;
        
        // Ingredients
        pdf.setFontSize(12);
        pdf.setTextColor(139, 69, 19);
        pdf.text('INGRÉDIENTS', margin, yPos);
        yPos += 6;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        sheet.ingredients.forEach(ing => {
          pdf.text(`• ${ing}`, margin + 3, yPos);
          yPos += 5;
        });
        yPos += 5;
        
        // Steps
        pdf.setFontSize(12);
        pdf.setTextColor(139, 69, 19);
        pdf.text('PRÉPARATION', margin, yPos);
        yPos += 6;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        sheet.steps.forEach((step, i) => {
          const stepLines = pdf.splitTextToSize(`${i + 1}. ${step}`, contentWidth - 5);
          pdf.text(stepLines, margin + 3, yPos);
          yPos += stepLines.length * 5;
        });
        yPos += 5;
        
        // Wine pairing
        pdf.setFillColor(245, 230, 230);
        pdf.rect(margin, yPos, contentWidth, 20, 'F');
        pdf.setTextColor(139, 69, 19);
        pdf.setFontSize(11);
        pdf.text(`🍷 ${sheet.winePairing}`, margin + 5, yPos + 7);
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const wineLines = pdf.splitTextToSize(sheet.wineReason, contentWidth - 10);
        pdf.text(wineLines, margin + 5, yPos + 14);
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

        {/* Sheets Tab */}
        <TabsContent value="sheets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheets.map((sheet, index) => (
              <Card key={sheet.id} className="border-orange-200/50 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                {sheet.imageUrl ? (
                  <div className="relative h-40 overflow-hidden">
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
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                    {sheet.isGeneratingImage ? (
                      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-orange-300" />
                    )}
                  </div>
                )}
                
                <CardContent className="p-4">
                  {/* Country badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{sheet.countryFlag}</span>
                    <Badge variant="outline" className="text-xs">{sheet.country}</Badge>
                    <Badge variant="secondary" className="text-xs ml-auto">{sheet.difficulty}</Badge>
                  </div>
                  
                  {/* Dish name */}
                  <h3 className="font-bold text-lg text-orange-800 dark:text-orange-400 mb-1">
                    {sheet.dishName}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {sheet.description}
                  </p>
                  
                  {/* Wine pairing */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-1 text-orange-700 dark:text-orange-400">
                      <Wine className="w-3 h-3" />
                      <span className="text-xs font-medium">{sheet.winePairing}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
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
                      Copier
                    </Button>
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
