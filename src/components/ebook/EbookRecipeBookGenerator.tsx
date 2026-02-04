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
  ChefHat, UtensilsCrossed, Sparkles, Image as ImageIcon, Download, BookOpen,
  Loader2, RefreshCw, FileText, Globe, Wine, Utensils
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

interface RecipePage {
  id: string;
  pageNumber: number;
  recipe1: {
    country: string;
    name: string;
    description: string;
    ingredients: string;
    winePairing: string;
    imageUrl?: string;
    isGeneratingImage?: boolean;
  };
  recipe2: {
    country: string;
    name: string;
    description: string;
    ingredients: string;
    winePairing: string;
    imageUrl?: string;
    isGeneratingImage?: boolean;
  };
}

interface EbookRecipeBookGeneratorProps {
  ebookTitle?: string;
}

// Liste complète des pays du monde par continent (même que voyage)
const worldCountries = {
  '🌍 Europe': [
    'Allemagne', 'Autriche', 'Belgique', 'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 
    'Espagne', 'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 
    'Islande', 'Italie', 'Lettonie', 'Lituanie', 'Luxembourg', 'Malte', 'Monaco',
    'Monténégro', 'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République Tchèque',
    'Roumanie', 'Royaume-Uni', 'Serbie', 'Slovaquie', 'Slovénie', 'Suède', 'Suisse', 'Ukraine'
  ],
  '🌎 Amérique du Nord': [
    'Canada', 'États-Unis', 'Mexique', 'Costa Rica', 'Cuba', 'Guatemala', 'Haïti',
    'Honduras', 'Jamaïque', 'Nicaragua', 'Panama', 'République Dominicaine', 'Salvador'
  ],
  '🌎 Amérique du Sud': [
    'Argentine', 'Bolivie', 'Brésil', 'Chili', 'Colombie', 'Équateur', 'Guyana',
    'Paraguay', 'Pérou', 'Suriname', 'Uruguay', 'Venezuela'
  ],
  '🌏 Asie': [
    'Arabie Saoudite', 'Bangladesh', 'Cambodge', 'Chine', 'Corée du Sud', 'Émirats Arabes Unis',
    'Inde', 'Indonésie', 'Israël', 'Japon', 'Jordanie', 'Kazakhstan', 'Laos', 'Liban',
    'Malaisie', 'Maldives', 'Mongolie', 'Myanmar', 'Népal', 'Oman', 'Ouzbékistan',
    'Pakistan', 'Philippines', 'Qatar', 'Singapour', 'Sri Lanka', 'Taïwan', 'Thaïlande',
    'Turquie', 'Vietnam'
  ],
  '🌍 Afrique': [
    'Afrique du Sud', 'Algérie', 'Bénin', 'Botswana', 'Cameroun', 'Cap-Vert', 'Côte d\'Ivoire',
    'Égypte', 'Éthiopie', 'Ghana', 'Kenya', 'Madagascar', 'Mali', 'Maroc', 'Maurice',
    'Mozambique', 'Namibie', 'Nigeria', 'Ouganda', 'Rwanda', 'Sénégal', 'Seychelles',
    'Tanzanie', 'Tunisie', 'Zambie', 'Zimbabwe'
  ],
  '🌏 Océanie': [
    'Australie', 'Fidji', 'Nouvelle-Calédonie', 'Nouvelle-Zélande', 'Papouasie-Nouvelle-Guinée',
    'Polynésie Française', 'Samoa', 'Tonga', 'Vanuatu'
  ]
};

const cuisineThemes = [
  { value: 'tour-du-monde', label: '🌍 Tour du Monde Culinaire' },
  { value: 'gastronomie', label: '🍽️ Haute Gastronomie' },
  { value: 'traditionnel', label: '👵 Recettes Traditionnelles' },
  { value: 'street-food', label: '🍜 Street Food du Monde' },
  { value: 'festif', label: '🎉 Cuisine des Fêtes' },
];

const photoStyles = [
  { value: 'gourmet', label: '🍽️ Photo Gastronomique' },
  { value: 'rustic', label: '🏡 Style Rustique' },
  { value: 'modern', label: '✨ Minimaliste Moderne' },
  { value: 'colorful', label: '🎨 Couleurs Vives' },
];

const exampleBooks = [
  { title: "Les Saveurs du Monde", region: "Tour du monde", theme: "tour-du-monde" },
  { title: "Voyage Culinaire en Europe", region: "Europe", theme: "traditionnel" },
  { title: "Gastronomie d'Asie", region: "Asie", theme: "gastronomie" },
  { title: "Street Food International", region: "Tous continents", theme: "street-food" },
  { title: "Festins des 5 Continents", region: "Monde", theme: "festif" },
];

const EbookRecipeBookGenerator: React.FC<EbookRecipeBookGeneratorProps> = ({ ebookTitle = '' }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [selectedCountry, setSelectedCountry] = useState('tour-du-monde');
  const [authorName, setAuthorName] = useState('');
  const [cuisineTheme, setCuisineTheme] = useState('tour-du-monde');
  const [photoStyle, setPhotoStyle] = useState('gourmet');
  const [numberOfPages, setNumberOfPages] = useState(20);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [pages, setPages] = useState<RecipePage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeTab, setActiveTab] = useState('cover');
  
  // Cover state
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const applyExample = (example: { title: string; region: string; theme: string }) => {
    setBookTitle(example.title);
    setCuisineTheme(example.theme);
  };

  const getPhotoStylePrompt = (style: string): string => {
    const styles: Record<string, string> = {
      'gourmet': 'professional food photography, michelin star presentation, elegant plating, soft natural lighting, shallow depth of field, magazine quality',
      'rustic': 'rustic food photography, wooden table, natural ingredients, warm lighting, authentic presentation, homestyle cooking',
      'modern': 'minimalist food photography, clean white background, elegant composition, modern plating, high contrast',
      'colorful': 'vibrant food photography, colorful ingredients, bright lighting, appetizing presentation, saturated colors',
    };
    return styles[style] || styles['gourmet'];
  };

  const generateWorldCuisineBook = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour votre livre');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setPages([]);
    
    try {
      // Total recipes needed: 2 per page × numberOfPages
      const totalRecipes = numberOfPages * 2;
      
      setCurrentStep('Génération des recettes du monde...');
      setProgress(10);

      // Determine which countries to include
      const regionToUse = selectedCountry === 'tour-du-monde' ? 'les pays du monde entier' : selectedCountry;
      
      // Generate recipes list with wine pairings
      const { data: planData, error: planError } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'world-cuisine-book',
          prompt: `Tu es un chef étoilé et sommelier expert. Génère ${totalRecipes} recettes emblématiques de ${regionToUse} avec leurs accords mets-vins.

Titre du livre: "${bookTitle}"
Thème culinaire: ${cuisineThemes.find(t => t.value === cuisineTheme)?.label || cuisineTheme}
${specialInstructions ? `Instructions spéciales: ${specialInstructions}` : ''}

Pour CHAQUE recette, fournis:
1. Le pays d'origine
2. Le nom du plat traditionnel
3. Une description appétissante de 2-3 phrases
4. Les ingrédients principaux (5-7 ingrédients clés)
5. L'accord vin/boisson recommandé (nom du vin, région, et pourquoi il s'accorde bien)

Varie les pays et les types de plats: entrées, plats principaux, desserts, spécialités locales.
Inclus des recettes de différents continents pour un vrai tour du monde.

Retourne au format JSON:
{
  "recipes": [
    {
      "country": "France",
      "name": "Coq au Vin",
      "description": "Un classique de la cuisine bourguignonne...",
      "ingredients": "Poulet, vin rouge, lardons, champignons, oignons grelots, thym",
      "winePairing": "Bourgogne Pinot Noir - La finesse du vin complète la sauce au vin rouge"
    }
  ]
}`
        }
      });

      if (planError) throw planError;

      let recipes: { country: string; name: string; description: string; ingredients: string; winePairing: string }[] = [];
      try {
        const content = planData?.content || planData?.result || '';
        const jsonMatch = content.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recipes = parsed.recipes || [];
        }
      } catch (parseError) {
        console.error('Erreur parsing recettes:', parseError);
        throw new Error('Erreur lors de la génération des recettes');
      }

      if (recipes.length < totalRecipes) {
        // Pad with generic recipes if needed
        while (recipes.length < totalRecipes) {
          recipes.push({
            country: 'International',
            name: `Spécialité ${recipes.length + 1}`,
            description: 'Une délicieuse recette à découvrir.',
            ingredients: 'Ingrédients variés',
            winePairing: 'Vin blanc ou rouge selon préférence'
          });
        }
      }

      setProgress(30);
      setCurrentStep('Organisation des pages...');

      // Create pages with 2 recipes each
      const generatedPages: RecipePage[] = [];
      for (let i = 0; i < numberOfPages; i++) {
        const rec1Index = i * 2;
        const rec2Index = i * 2 + 1;
        generatedPages.push({
          id: `page-${Date.now()}-${i}`,
          pageNumber: i + 1,
          recipe1: {
            country: recipes[rec1Index]?.country || 'International',
            name: recipes[rec1Index]?.name || `Recette ${rec1Index + 1}`,
            description: recipes[rec1Index]?.description || 'Description à venir...',
            ingredients: recipes[rec1Index]?.ingredients || 'Ingrédients variés',
            winePairing: recipes[rec1Index]?.winePairing || 'À accorder selon vos goûts',
          },
          recipe2: {
            country: recipes[rec2Index]?.country || 'International',
            name: recipes[rec2Index]?.name || `Recette ${rec2Index + 1}`,
            description: recipes[rec2Index]?.description || 'Description à venir...',
            ingredients: recipes[rec2Index]?.ingredients || 'Ingrédients variés',
            winePairing: recipes[rec2Index]?.winePairing || 'À accorder selon vos goûts',
          }
        });
      }

      setPages(generatedPages);
      setProgress(40);
      
      // Generate images for all recipes (2 per page)
      const totalImages = numberOfPages * 2;
      setCurrentStep(`Génération des ${totalImages} photos culinaires...`);
      
      for (let pageIndex = 0; pageIndex < generatedPages.length; pageIndex++) {
        const page = generatedPages[pageIndex];
        
        // Generate image for recipe 1
        const img1Index = pageIndex * 2;
        setCurrentStep(`Photo ${img1Index + 1}/${totalImages}: ${page.recipe1.name}...`);
        await generateRecipeImage(page.id, 'recipe1', page.recipe1.name, page.recipe1.country);
        setProgress(40 + ((img1Index + 1) / totalImages) * 55);
        
        // Generate image for recipe 2
        const img2Index = pageIndex * 2 + 1;
        setCurrentStep(`Photo ${img2Index + 1}/${totalImages}: ${page.recipe2.name}...`);
        await generateRecipeImage(page.id, 'recipe2', page.recipe2.name, page.recipe2.country);
        setProgress(40 + ((img2Index + 1) / totalImages) * 55);
      }

      setProgress(100);
      setCurrentStep('Livre de recettes généré !');
      toast.success(`Livre créé avec ${numberOfPages} pages et ${totalImages} recettes avec accords vins !`);
      
    } catch (error) {
      console.error('Erreur génération livre:', error);
      toast.error('Erreur lors de la génération du livre');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRecipeImage = async (
    pageId: string, 
    recipeKey: 'recipe1' | 'recipe2', 
    recipeName: string,
    countryName: string
  ) => {
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          [recipeKey]: { ...p[recipeKey], isGeneratingImage: true }
        };
      }
      return p;
    }));

    try {
      const photoPrompt = getPhotoStylePrompt(photoStyle);
      
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: recipeName,
          authorName: '',
          genre: 'cooking',
          style: 'cookbook',
          customPrompt: `${photoPrompt}. 
Beautiful food photograph of "${recipeName}" from ${countryName} cuisine.
Professional culinary photography, appetizing presentation, authentic traditional dish.
NO TEXT, NO WORDS, NO TITLE, NO LETTERS, NO WATERMARK on the image.
Pure food photography only, high resolution, cookbook quality.`,
          showAuthorName: false,
          showTitle: false,
        }
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.coverUrl;
      if (imageUrl) {
        setPages(prev => prev.map(p => {
          if (p.id === pageId) {
            return {
              ...p,
              [recipeKey]: { ...p[recipeKey], imageUrl, isGeneratingImage: false }
            };
          }
          return p;
        }));
      } else {
        throw new Error('Aucune image retournée');
      }
    } catch (error) {
      console.error('Erreur génération image:', error);
      setPages(prev => prev.map(p => {
        if (p.id === pageId) {
          return {
            ...p,
            [recipeKey]: { ...p[recipeKey], isGeneratingImage: false }
          };
        }
        return p;
      }));
    }
  };

  const regenerateImage = async (pageId: string, recipeKey: 'recipe1' | 'recipe2') => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const recipe = page[recipeKey];
    toast.info(`Regénération de l'image pour ${recipe.name}...`);
    await generateRecipeImage(pageId, recipeKey, recipe.name, recipe.country);
  };

  // Generate cover image
  const generateCover = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour le livre');
      return;
    }

    setIsGeneratingCover(true);
    toast.info('Génération de la couverture...');

    try {
      const themeLabel = cuisineThemes.find(t => t.value === cuisineTheme)?.label || cuisineTheme;
      
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: bookTitle,
          authorName: authorName || '',
          genre: 'cookbook',
          style: 'modern',
          customPrompt: `Professional cookbook cover design for "${bookTitle}".
Theme: ${themeLabel} - World cuisine and wine pairings.
Create a stunning, elegant food photography cover with multiple dishes from around the world.
Include wine glasses, elegant table setting, gourmet presentation.
Warm, inviting colors with professional lighting. Magazine quality.
IMPORTANT: Include elegant title "${bookTitle}" in stylish typography.
${authorName ? `Author name: ${authorName}` : ''}`,
          showAuthorName: !!authorName,
          showTitle: true,
        }
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.coverUrl;
      if (imageUrl) {
        setCoverImageUrl(imageUrl);
        toast.success('Couverture générée !');
        setActiveTab('cover');
      } else {
        throw new Error('Aucune image retournée');
      }
    } catch (error) {
      console.error('Erreur génération couverture:', error);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Download cover
  const downloadCover = async () => {
    if (!coverImageUrl) return;
    
    try {
      if (coverImageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = coverImageUrl;
        link.download = `couverture-${bookTitle.replace(/\s+/g, '-').toLowerCase() || 'recettes-monde'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(coverImageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `couverture-${bookTitle.replace(/\s+/g, '-').toLowerCase() || 'recettes-monde'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      toast.success('Couverture téléchargée !');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  // Export PDF (same format as Travel Guide)
  const exportToPDF = async () => {
    if (pages.length === 0) {
      toast.error('Aucune page à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Génération du PDF en cours...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // ===== COVER PAGE =====
      pdf.setFillColor(139, 69, 19); // Warm brown
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative gold accent
      pdf.setFillColor(218, 165, 32); // Gold
      pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      const titleLines = pdf.splitTextToSize(bookTitle || 'Recettes du Monde', contentWidth);
      pdf.text(titleLines, pageWidth / 2, 80, { align: 'center' });

      pdf.setFontSize(18);
      pdf.setTextColor(218, 165, 32);
      pdf.text('Recettes & Accords Vins', pageWidth / 2, 110, { align: 'center' });

      if (authorName) {
        pdf.setFontSize(14);
        pdf.setTextColor(200, 200, 200);
        pdf.text(`par ${authorName}`, pageWidth / 2, 130, { align: 'center' });
      }

      pdf.setFontSize(12);
      pdf.setTextColor(60, 30, 10);
      pdf.text(`${pages.length} pages • ${pages.length * 2} recettes du monde`, pageWidth / 2, pageHeight - 15, { align: 'center' });

      // ===== TABLE OF CONTENTS =====
      pdf.addPage();
      pdf.setFillColor(250, 245, 240);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(139, 69, 19);
      pdf.text('🍽️ Sommaire', margin, 28);

      let yPos = 55;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      
      pages.forEach((page) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = margin + 10;
        }
        pdf.text(`Page ${page.pageNumber}:`, margin, yPos);
        pdf.setFont('helvetica', 'bold');
        const rec1Text = pdf.splitTextToSize(`${page.recipe1.country} - ${page.recipe1.name}`, contentWidth / 2 - 10);
        pdf.text(rec1Text[0], margin + 25, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 6;
        pdf.setFont('helvetica', 'bold');
        const rec2Text = pdf.splitTextToSize(`${page.recipe2.country} - ${page.recipe2.name}`, contentWidth / 2 - 10);
        pdf.text(rec2Text[0], margin + 25, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 10;
      });

      // ===== CONTENT PAGES =====
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        pdf.addPage();

        // Page header
        pdf.setFillColor(139, 69, 19);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Page ${page.pageNumber} • Recettes du Monde`, pageWidth / 2, 13, { align: 'center' });

        const halfWidth = (contentWidth - 10) / 2;
        const imageHeight = 50;
        const textStartY = 28;

        // Recipe 1 (left side)
        const leftX = margin;
        let leftY = textStartY;

        // Image 1
        if (page.recipe1.imageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = page.recipe1.imageUrl!;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            pdf.addImage(imgData, 'JPEG', leftX, leftY, halfWidth, imageHeight);
            leftY += imageHeight + 3;
          } catch (e) {
            console.log('Image 1 non chargée');
            leftY += 3;
          }
        }

        // Country flag + Name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(139, 69, 19);
        pdf.text(`🌍 ${page.recipe1.country}`, leftX, leftY);
        leftY += 5;

        // Recipe name
        pdf.setFontSize(11);
        pdf.setTextColor(60, 30, 10);
        const name1Lines = pdf.splitTextToSize(page.recipe1.name, halfWidth);
        pdf.text(name1Lines, leftX, leftY);
        leftY += name1Lines.length * 4.5 + 2;

        // Description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        const desc1Lines = pdf.splitTextToSize(page.recipe1.description, halfWidth);
        pdf.text(desc1Lines.slice(0, 3), leftX, leftY);
        leftY += Math.min(desc1Lines.length, 3) * 3.5 + 3;

        // Ingredients
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 60, 20);
        pdf.text('🥕 Ingrédients:', leftX, leftY);
        leftY += 3.5;
        pdf.setFont('helvetica', 'normal');
        const ing1Lines = pdf.splitTextToSize(page.recipe1.ingredients, halfWidth);
        pdf.text(ing1Lines.slice(0, 2), leftX, leftY);
        leftY += Math.min(ing1Lines.length, 2) * 3 + 3;

        // Wine pairing
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(128, 0, 32); // Wine color
        pdf.text('🍷 Accord vin:', leftX, leftY);
        leftY += 3.5;
        pdf.setFont('helvetica', 'italic');
        const wine1Lines = pdf.splitTextToSize(page.recipe1.winePairing, halfWidth);
        pdf.text(wine1Lines.slice(0, 2), leftX, leftY);

        // Recipe 2 (right side)
        const rightX = margin + halfWidth + 10;
        let rightY = textStartY;

        // Image 2
        if (page.recipe2.imageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = page.recipe2.imageUrl!;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            pdf.addImage(imgData, 'JPEG', rightX, rightY, halfWidth, imageHeight);
            rightY += imageHeight + 3;
          } catch (e) {
            console.log('Image 2 non chargée');
            rightY += 3;
          }
        }

        // Country + Name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(139, 69, 19);
        pdf.text(`🌍 ${page.recipe2.country}`, rightX, rightY);
        rightY += 5;

        pdf.setFontSize(11);
        pdf.setTextColor(60, 30, 10);
        const name2Lines = pdf.splitTextToSize(page.recipe2.name, halfWidth);
        pdf.text(name2Lines, rightX, rightY);
        rightY += name2Lines.length * 4.5 + 2;

        // Description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);
        const desc2Lines = pdf.splitTextToSize(page.recipe2.description, halfWidth);
        pdf.text(desc2Lines.slice(0, 3), rightX, rightY);
        rightY += Math.min(desc2Lines.length, 3) * 3.5 + 3;

        // Ingredients
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 60, 20);
        pdf.text('🥕 Ingrédients:', rightX, rightY);
        rightY += 3.5;
        pdf.setFont('helvetica', 'normal');
        const ing2Lines = pdf.splitTextToSize(page.recipe2.ingredients, halfWidth);
        pdf.text(ing2Lines.slice(0, 2), rightX, rightY);
        rightY += Math.min(ing2Lines.length, 2) * 3 + 3;

        // Wine pairing
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(128, 0, 32);
        pdf.text('🍷 Accord vin:', rightX, rightY);
        rightY += 3.5;
        pdf.setFont('helvetica', 'italic');
        const wine2Lines = pdf.splitTextToSize(page.recipe2.winePairing, halfWidth);
        pdf.text(wine2Lines.slice(0, 2), rightX, rightY);

        // Page footer
        pdf.setFillColor(218, 165, 32);
        pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(60, 30, 10);
        pdf.text(`${bookTitle || 'Recettes du Monde'} - Accords Mets & Vins`, pageWidth / 2, pageHeight - 4, { align: 'center' });
      }

      // Save PDF
      const fileName = `${(bookTitle || 'recettes-monde').replace(/[^a-zA-Z0-9]/g, '_')}_Gastronomie.pdf`;
      const blob = pdf.output('blob');
      saveAs(blob, fileName);
      toast.success('PDF téléchargé !');

    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <ChefHat className="w-10 h-10 text-amber-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Générateur de Livre de Recettes du Monde
          </h1>
          <Wine className="w-10 h-10 text-red-700" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Créez un livre de cuisine gastronomique avec des recettes de tous les pays du monde et leurs accords mets-vins parfaits. Format 20 pages, 2 recettes par page.
        </p>
      </div>

      {/* Exemples rapides */}
      <Card className="border-amber-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Exemples de livres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exampleBooks.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors px-3 py-1.5"
                onClick={() => applyExample(example)}
              >
                {example.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du livre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Informations du livre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre du livre *</Label>
              <Input
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="ex: Saveurs du Monde"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Auteur</Label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Votre nom"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Thème culinaire</Label>
              <Select value={cuisineTheme} onValueChange={setCuisineTheme}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineThemes.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Style photo</Label>
              <Select value={photoStyle} onValueChange={setPhotoStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {photoStyles.map(style => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sélection pays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-blue-500" />
              Sélection de la région (optionnel)
            </CardTitle>
            <CardDescription>
              Laissez vide pour un tour du monde complet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pays / Région spécifique</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="🌍 Tour du monde (tous les pays)" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="tour-du-monde">🌍 Tour du monde (tous les pays)</SelectItem>
                  {Object.entries(worldCountries).map(([continent, countries]) => (
                    <React.Fragment key={continent}>
                      <SelectItem value={`continent-${continent}`} disabled className="font-bold text-primary">
                        {continent}
                      </SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country} className="pl-6">
                          {country}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nombre de pages : {numberOfPages}</Label>
              <input
                type="range"
                min="10"
                max="30"
                value={numberOfPages}
                onChange={(e) => setNumberOfPages(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 pages (20 recettes)</span>
                <span>30 pages (60 recettes)</span>
              </div>
            </div>

            <div>
              <Label>Instructions spéciales (optionnel)</Label>
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="ex: Focus sur les plats végétariens, inclure des desserts, privilégier les recettes festives..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton de génération */}
      <div className="flex justify-center">
        <Button
          onClick={generateWorldCuisineBook}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 hover:from-amber-700 hover:via-orange-600 hover:to-red-700 text-white px-10 py-6 text-lg shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {currentStep}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              🍳 Générer {numberOfPages * 2} Recettes + Accords Vins
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isGenerating && (
        <Card className="border-amber-500/30">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {pages.length > 0 && (
        <div className="space-y-4">
          {/* Header avec export */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-amber-600" />
                {pages.length * 2} Recettes du Monde
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {bookTitle}
                </Badge>
                <Badge className="bg-red-700 text-white">
                  <Wine className="w-3 h-3 mr-1" />
                  Avec Accords Vins
                </Badge>
              </div>
            </div>
            
            {/* Export buttons */}
            <Card className="border-2 border-dashed border-amber-400/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    Export PDF Gastronomie
                  </Button>
                  <Button
                    onClick={generateCover}
                    disabled={isGeneratingCover}
                    variant="outline"
                    className="border-red-500 text-red-600"
                  >
                    {isGeneratingCover ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4 mr-2" />
                    )}
                    Générer Couverture
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cover" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Couverture
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Recettes
                <Badge variant="secondary" className="ml-1 text-xs">{pages.length * 2}</Badge>
              </TabsTrigger>
              <TabsTrigger value="wines" className="flex items-center gap-2">
                <Wine className="w-4 h-4" />
                Accords Vins
              </TabsTrigger>
            </TabsList>

            {/* Tab Couverture */}
            <TabsContent value="cover" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Generation */}
                <Card className="border-2 border-dashed border-amber-400/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Générer la Couverture
                    </CardTitle>
                    <CardDescription>
                      Créez une couverture professionnelle pour votre livre gastronomique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={generateCover}
                      disabled={isGeneratingCover || !bookTitle.trim()}
                      className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
                    >
                      {isGeneratingCover ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Générer la Couverture
                        </>
                      )}
                    </Button>
                    
                    {coverImageUrl && (
                      <Button
                        onClick={generateCover}
                        variant="outline"
                        className="w-full"
                        disabled={isGeneratingCover}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regénérer
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* 3D Mockup Preview */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Aperçu Mockup 3D
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coverImageUrl ? (
                      <div className="space-y-4">
                        {/* 3D Book Mockup Effect */}
                        <div className="relative flex justify-center items-center py-10">
                          <div 
                            className="relative transform transition-all duration-500 hover:scale-105"
                            style={{
                              perspective: '1200px',
                            }}
                          >
                            {/* Shadow */}
                            <div 
                              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-6 bg-black/20 blur-xl rounded-full"
                              style={{
                                transform: 'translateX(-50%) rotateX(80deg)',
                              }}
                            />
                            
                            <div 
                              className="relative"
                              style={{
                                transform: 'rotateY(-20deg) rotateX(5deg)',
                                transformStyle: 'preserve-3d',
                              }}
                            >
                              {/* Spine */}
                              <div 
                                className="absolute left-0 top-0 bottom-0 w-5 rounded-l-sm"
                                style={{
                                  background: 'linear-gradient(to right, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
                                  transform: 'rotateY(-90deg) translateZ(2px)',
                                  transformOrigin: 'left center',
                                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)',
                                }}
                              />
                              
                              {/* Cover */}
                              <div className="relative">
                                <img
                                  src={coverImageUrl}
                                  alt="Couverture du livre"
                                  className="w-52 h-[300px] object-cover rounded-r-md"
                                  style={{
                                    boxShadow: '10px 10px 30px rgba(0,0,0,0.4), -2px 0 10px rgba(0,0,0,0.2)',
                                  }}
                                />
                                
                                {/* Pages effect */}
                                <div className="absolute right-0 top-1 bottom-1 w-2 flex flex-col">
                                  {[...Array(8)].map((_, i) => (
                                    <div 
                                      key={i}
                                      className="flex-1"
                                      style={{
                                        background: i % 2 === 0 ? '#f5f5f0' : '#e8e8e3',
                                        boxShadow: 'inset 1px 0 1px rgba(0,0,0,0.05)',
                                      }}
                                    />
                                  ))}
                                </div>
                                
                                {/* Glossy overlay */}
                                <div 
                                  className="absolute inset-0 rounded-r-md pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button onClick={downloadCover} className="w-full" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger la couverture
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border-2 border-dashed">
                        <div className="text-center text-muted-foreground">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Générez la couverture pour voir l'aperçu</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Recettes */}
            <TabsContent value="recipes" className="mt-4">
              <div className="space-y-6">
                {pages.map((page) => (
                  <Card key={page.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 py-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>📖 Page {page.pageNumber}</span>
                        <Badge variant="secondary">{page.recipe1.country} & {page.recipe2.country}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recipe 1 */}
                        <div className="space-y-3">
                          {page.recipe1.imageUrl ? (
                            <div className="relative group">
                              <img
                                src={page.recipe1.imageUrl}
                                alt={page.recipe1.name}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => regenerateImage(page.id, 'recipe1')}
                                disabled={page.recipe1.isGeneratingImage}
                              >
                                <RefreshCw className={`w-3 h-3 ${page.recipe1.isGeneratingImage ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                          ) : page.recipe1.isGeneratingImage ? (
                            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 opacity-30" />
                            </div>
                          )}
                          <div>
                            <Badge variant="outline" className="mb-1">🌍 {page.recipe1.country}</Badge>
                            <h4 className="font-bold text-lg">{page.recipe1.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{page.recipe1.description}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                              <strong>🥕</strong> {page.recipe1.ingredients}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1 italic">
                              <strong>🍷</strong> {page.recipe1.winePairing}
                            </p>
                          </div>
                        </div>

                        {/* Recipe 2 */}
                        <div className="space-y-3">
                          {page.recipe2.imageUrl ? (
                            <div className="relative group">
                              <img
                                src={page.recipe2.imageUrl}
                                alt={page.recipe2.name}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => regenerateImage(page.id, 'recipe2')}
                                disabled={page.recipe2.isGeneratingImage}
                              >
                                <RefreshCw className={`w-3 h-3 ${page.recipe2.isGeneratingImage ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                          ) : page.recipe2.isGeneratingImage ? (
                            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 opacity-30" />
                            </div>
                          )}
                          <div>
                            <Badge variant="outline" className="mb-1">🌍 {page.recipe2.country}</Badge>
                            <h4 className="font-bold text-lg">{page.recipe2.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{page.recipe2.description}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                              <strong>🥕</strong> {page.recipe2.ingredients}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1 italic">
                              <strong>🍷</strong> {page.recipe2.winePairing}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Accords Vins */}
            <TabsContent value="wines" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wine className="w-5 h-5 text-red-700" />
                    Guide des Accords Mets-Vins
                  </CardTitle>
                  <CardDescription>
                    Tous les accords vins recommandés pour vos {pages.length * 2} recettes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pages.map((page) => (
                      <div key={page.id} className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">Page {page.pageNumber}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 border">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🍷</span>
                              <div>
                                <p className="font-medium text-sm">{page.recipe1.name}</p>
                                <p className="text-xs text-muted-foreground">({page.recipe1.country})</p>
                                <p className="text-sm text-red-700 dark:text-red-400 mt-1 italic">
                                  {page.recipe1.winePairing}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 border">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🍷</span>
                              <div>
                                <p className="font-medium text-sm">{page.recipe2.name}</p>
                                <p className="text-xs text-muted-foreground">({page.recipe2.country})</p>
                                <p className="text-sm text-red-700 dark:text-red-400 mt-1 italic">
                                  {page.recipe2.winePairing}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EbookRecipeBookGenerator;
