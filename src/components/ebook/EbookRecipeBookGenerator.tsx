import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat, UtensilsCrossed, Clock, Users, Flame, Sparkles, Plus, Trash2, 
  Image as ImageIcon, Download, BookOpen, Leaf, AlertTriangle, Heart,
  Loader2, RefreshCw, Copy, Check, FileText, FileDown
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, PageBreak, AlignmentType, BorderStyle } from 'docx';

interface Recipe {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
  ingredients: string[];
  instructions: string[];
  tips: string;
  nutritionInfo?: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

interface EbookRecipeBookGeneratorProps {
  ebookTitle?: string;
}

const cuisineStyles = [
  { value: 'française', label: '🇫🇷 Cuisine Française' },
  { value: 'italienne', label: '🇮🇹 Cuisine Italienne' },
  { value: 'asiatique', label: '🥢 Cuisine Asiatique' },
  { value: 'méditerranéenne', label: '🫒 Méditerranéenne' },
  { value: 'américaine', label: '🇺🇸 Cuisine Américaine' },
  { value: 'végétarienne', label: '🥗 Végétarienne' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'healthy', label: '💪 Healthy / Fitness' },
  { value: 'desserts', label: '🍰 Pâtisserie & Desserts' },
  { value: 'rapide', label: '⚡ Recettes Rapides (-30min)' },
];

const recipeCategories = [
  { value: 'entree', label: '🥗 Entrées' },
  { value: 'plat', label: '🍽️ Plats principaux' },
  { value: 'dessert', label: '🍰 Desserts' },
  { value: 'aperitif', label: '🥂 Apéritifs' },
  { value: 'soupe', label: '🍲 Soupes & Potages' },
  { value: 'salade', label: '🥬 Salades' },
  { value: 'boisson', label: '🍹 Boissons' },
  { value: 'petit-dejeuner', label: '🥐 Petit-déjeuner' },
];

// Exemples de titres pour inspirer les utilisateurs
const exampleTitles = [
  { title: "Les Délices de Grand-Mère", style: "française" },
  { title: "Saveurs d'Italie", style: "italienne" },
  { title: "Voyage Culinaire en Asie", style: "asiatique" },
  { title: "Ma Cuisine Vegan au Quotidien", style: "vegan" },
  { title: "Recettes Fitness & Protéinées", style: "healthy" },
  { title: "Pâtisserie Maison Facile", style: "desserts" },
  { title: "30 Minutes Chrono", style: "rapide" },
  { title: "Recettes Méditerranéennes", style: "méditerranéenne" },
];

const EbookRecipeBookGenerator: React.FC<EbookRecipeBookGeneratorProps> = ({ ebookTitle = '' }) => {
  const [bookTitle, setBookTitle] = useState(ebookTitle || '');
  const [authorName, setAuthorName] = useState('');
  const [cuisineStyle, setCuisineStyle] = useState('française');
  const [numberOfRecipes, setNumberOfRecipes] = useState(10);
  const [numberOfPhotos, setNumberOfPhotos] = useState(10);
  const [includeNutrition, setIncludeNutrition] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [targetAudience, setTargetAudience] = useState('tous');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['entree', 'plat', 'dessert']);

  const applyExampleTitle = (example: { title: string; style: string }) => {
    setBookTitle(example.title);
    setCuisineStyle(example.style);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const generateRecipes = async () => {
    if (!bookTitle.trim()) {
      toast.error('Veuillez entrer un titre pour votre livre');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('Sélectionnez au moins une catégorie de recettes');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setRecipes([]);
    
    try {
      const recipesPerCategory = Math.ceil(numberOfRecipes / selectedCategories.length);
      const allRecipes: Recipe[] = [];
      
      for (let catIndex = 0; catIndex < selectedCategories.length; catIndex++) {
        const category = selectedCategories[catIndex];
        const categoryLabel = recipeCategories.find(c => c.value === category)?.label || category;
        
        setCurrentStep(`Génération des recettes ${categoryLabel}...`);
        setProgress((catIndex / selectedCategories.length) * 80);
        
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: {
            type: 'recipe-book',
            prompt: `Génère ${recipesPerCategory} recettes de la catégorie "${categoryLabel}" pour un livre de cuisine ${cuisineStyles.find(s => s.value === cuisineStyle)?.label || cuisineStyle}.

Titre du livre: "${bookTitle}"
Public cible: ${targetAudience}
${specialInstructions ? `Instructions spéciales: ${specialInstructions}` : ''}
${includeNutrition ? 'Inclure les informations nutritionnelles approximatives.' : ''}

Pour CHAQUE recette, fournis:
1. Un titre créatif et appétissant
2. Temps de préparation et de cuisson
3. Nombre de portions
4. Niveau de difficulté (facile/moyen/difficile)
5. Liste complète des ingrédients avec quantités précises
6. Instructions détaillées étape par étape (minimum 5 étapes)
7. Conseils et astuces du chef
${includeNutrition ? '8. Informations nutritionnelles (calories, protéines, glucides, lipides)' : ''}

Retourne les recettes au format JSON:
{
  "recipes": [
    {
      "title": "Nom de la recette",
      "prepTime": "15 min",
      "cookTime": "30 min",
      "servings": 4,
      "difficulty": "moyen",
      "ingredients": ["200g de farine", "3 oeufs", ...],
      "instructions": ["Étape 1: ...", "Étape 2: ...", ...],
      "tips": "Conseil du chef...",
      "nutritionInfo": "Calories: 350 | Protéines: 12g | Glucides: 45g | Lipides: 15g"
    }
  ]
}`,
          }
        });

        if (error) throw error;

        let parsedRecipes: any[] = [];
        try {
          const content = data?.content || data?.result || '';
          const jsonMatch = content.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            parsedRecipes = parsed.recipes || [];
          }
        } catch (parseError) {
          console.error('Erreur parsing recettes:', parseError);
        }

        const formattedRecipes: Recipe[] = parsedRecipes.map((r: any, index: number) => ({
          id: `${category}-${Date.now()}-${index}`,
          title: r.title || `Recette ${index + 1}`,
          category: category,
          prepTime: r.prepTime || '20 min',
          cookTime: r.cookTime || '30 min',
          servings: r.servings || 4,
          difficulty: r.difficulty || 'moyen',
          ingredients: r.ingredients || [],
          instructions: r.instructions || [],
          tips: r.tips || '',
          nutritionInfo: r.nutritionInfo,
        }));

        allRecipes.push(...formattedRecipes);
      }

      setRecipes(allRecipes);
      setProgress(100);
      setCurrentStep('Génération terminée !');
      toast.success(`${allRecipes.length} recettes générées avec succès !`);

      // Générer les images si demandé (nombre configurable)
      if (includeImages && allRecipes.length > 0) {
        const photosToGenerate = Math.min(allRecipes.length, numberOfPhotos);
        setCurrentStep(`Génération des ${photosToGenerate} photos...`);
        for (let i = 0; i < photosToGenerate; i++) {
          setCurrentStep(`Génération photo ${i + 1}/${photosToGenerate}...`);
          await generateRecipeImage(allRecipes[i].id, allRecipes[i].title);
        }
      }
    } catch (error) {
      console.error('Erreur génération recettes:', error);
      toast.error('Erreur lors de la génération des recettes');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRecipeImage = async (recipeId: string, recipeTitle: string) => {
    setRecipes(prev => prev.map(r => 
      r.id === recipeId ? { ...r, isGeneratingImage: true } : r
    ));

    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: recipeTitle, // Paramètre correct attendu par l'edge function
          authorName: '',
          genre: 'cooking',
          style: 'cookbook',
          customPrompt: `Photo culinaire professionnelle de "${recipeTitle}". 
Style: photographie gastronomique haute qualité, éclairage naturel doux, 
présentation soignée sur belle vaisselle, arrière-plan flou élégant,
couleurs vives et appétissantes, vue plongeante ou 3/4.
IMPORTANT: NO TEXT, NO WORDS, NO TITLE, NO LETTERS on the image. Only the food.`,
          showAuthorName: false,
          showTitle: false,
        }
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.coverUrl;
      if (imageUrl) {
        setRecipes(prev => prev.map(r => 
          r.id === recipeId ? { ...r, imageUrl, isGeneratingImage: false } : r
        ));
        toast.success(`Image générée pour "${recipeTitle}"`);
      } else {
        throw new Error('Aucune image retournée');
      }
    } catch (error) {
      console.error('Erreur génération image:', error);
      toast.error(`Erreur pour "${recipeTitle}"`);
      setRecipes(prev => prev.map(r => 
        r.id === recipeId ? { ...r, isGeneratingImage: false } : r
      ));
    }
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    toast.success('Recette supprimée');
  };

  const copyRecipeToClipboard = (recipe: Recipe) => {
    const text = `
# ${recipe.title}

⏱️ Préparation: ${recipe.prepTime} | Cuisson: ${recipe.cookTime}
👥 Portions: ${recipe.servings} | Difficulté: ${recipe.difficulty}

## Ingrédients
${recipe.ingredients.map(i => `- ${i}`).join('\n')}

## Instructions
${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

💡 Conseil: ${recipe.tips}
${recipe.nutritionInfo ? `\n📊 Nutrition: ${recipe.nutritionInfo}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Recette copiée !');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500';
      case 'moyen': return 'bg-amber-500';
      case 'difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryEmoji = (category: string) => {
    return recipeCategories.find(c => c.value === category)?.label.split(' ')[0] || '🍽️';
  };

  // ============= EXPORT PDF =============
  const exportToPDF = async () => {
    if (recipes.length === 0) {
      toast.error('Aucune recette à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Génération du PDF en cours...');

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // ===== PAGE DE TITRE =====
      pdf.setFillColor(255, 165, 0);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.setTextColor(255, 255, 255);
      pdf.text(bookTitle || 'Mon Livre de Recettes', pageWidth / 2, 35, { align: 'center' });

      if (authorName) {
        pdf.setFontSize(14);
        pdf.text(`par ${authorName}`, pageWidth / 2, 50, { align: 'center' });
      }

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.text(`${recipes.length} recettes`, pageWidth / 2, 80, { align: 'center' });
      pdf.text(`Style: ${cuisineStyles.find(s => s.value === cuisineStyle)?.label || cuisineStyle}`, pageWidth / 2, 90, { align: 'center' });

      // ===== TABLE DES MATIÈRES =====
      pdf.addPage();
      yPosition = margin;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(255, 140, 0);
      pdf.text('📖 Table des Matières', margin, yPosition);
      yPosition += 15;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      recipes.forEach((recipe, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        const emoji = getCategoryEmoji(recipe.category);
        pdf.text(`${emoji} ${index + 1}. ${recipe.title}`, margin, yPosition);
        yPosition += 8;
      });

      // ===== RECETTES =====
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        pdf.addPage();
        yPosition = margin;

        // Image si disponible
        if (recipe.imageUrl) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = recipe.imageUrl!;
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            
            const imgWidth = contentWidth;
            const imgHeight = (img.height / img.width) * imgWidth;
            pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, Math.min(imgHeight, 80));
            yPosition += Math.min(imgHeight, 80) + 10;
          } catch (e) {
            console.log('Impossible de charger l\'image pour le PDF');
          }
        }

        // Titre recette
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(255, 100, 0);
        const titleLines = pdf.splitTextToSize(recipe.title, contentWidth);
        pdf.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 8 + 5;

        // Métadonnées
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`⏱️ Préparation: ${recipe.prepTime} | 🔥 Cuisson: ${recipe.cookTime} | 👥 ${recipe.servings} portions | ${recipe.difficulty}`, margin, yPosition);
        yPosition += 10;

        // Ingrédients
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('🥕 Ingrédients:', margin, yPosition);
        yPosition += 7;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        recipe.ingredients.forEach(ing => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(`• ${ing}`, margin + 5, yPosition);
          yPosition += 6;
        });
        yPosition += 5;

        // Instructions
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('📝 Instructions:', margin, yPosition);
        yPosition += 7;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        recipe.instructions.forEach((step, idx) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          const stepLines = pdf.splitTextToSize(`${idx + 1}. ${step}`, contentWidth - 10);
          pdf.text(stepLines, margin + 5, yPosition);
          yPosition += stepLines.length * 5 + 3;
        });

        // Conseils
        if (recipe.tips) {
          yPosition += 5;
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.setFillColor(255, 248, 220);
          pdf.rect(margin, yPosition - 3, contentWidth, 15, 'F');
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(120, 90, 0);
          const tipLines = pdf.splitTextToSize(`💡 Conseil: ${recipe.tips}`, contentWidth - 10);
          pdf.text(tipLines, margin + 5, yPosition + 4);
          yPosition += 20;
        }

        // Nutrition
        if (recipe.nutritionInfo) {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(80, 80, 80);
          pdf.text(`❤️ ${recipe.nutritionInfo}`, margin, yPosition);
        }
      }

      // Sauvegarder
      const fileName = `${bookTitle || 'livre-recettes'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('PDF téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // ============= EXPORT WORD (DOCX) =============
  const exportToWord = async () => {
    if (recipes.length === 0) {
      toast.error('Aucune recette à exporter');
      return;
    }

    setIsExporting(true);
    toast.info('Génération du document Word en cours...');

    try {
      const children: any[] = [];

      // Page de titre
      children.push(
        new Paragraph({
          children: [new TextRun({ text: bookTitle || 'Mon Livre de Recettes', bold: true, size: 56, color: 'FF6600' })],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        })
      );

      if (authorName) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `par ${authorName}`, italics: true, size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        );
      }

      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${recipes.length} recettes • ${cuisineStyles.find(s => s.value === cuisineStyle)?.label || cuisineStyle}`, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 }
        })
      );

      // Table des matières
      children.push(
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({
          children: [new TextRun({ text: '📖 Table des Matières', bold: true, size: 36, color: 'FF8C00' })],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 }
        })
      );

      recipes.forEach((recipe, index) => {
        const emoji = getCategoryEmoji(recipe.category);
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${emoji} ${index + 1}. ${recipe.title}`, size: 24 })],
            spacing: { after: 100 }
          })
        );
      });

      // Recettes
      for (const recipe of recipes) {
        children.push(new Paragraph({ children: [new PageBreak()] }));

        // Titre
        children.push(
          new Paragraph({
            children: [new TextRun({ text: recipe.title, bold: true, size: 40, color: 'FF6400' })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          })
        );

        // Métadonnées
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `⏱️ Préparation: ${recipe.prepTime}  |  `, size: 20 }),
              new TextRun({ text: `🔥 Cuisson: ${recipe.cookTime}  |  `, size: 20 }),
              new TextRun({ text: `👥 ${recipe.servings} portions  |  `, size: 20 }),
              new TextRun({ text: recipe.difficulty, bold: true, size: 20 })
            ],
            spacing: { after: 300 }
          })
        );

        // Ingrédients
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '🥕 Ingrédients', bold: true, size: 28, color: '228B22' })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 }
          })
        );

        recipe.ingredients.forEach(ing => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${ing}`, size: 22 })],
              spacing: { after: 60 }
            })
          );
        });

        // Instructions
        children.push(
          new Paragraph({
            children: [new TextRun({ text: '📝 Instructions', bold: true, size: 28, color: '4169E1' })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );

        recipe.instructions.forEach((step, idx) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${idx + 1}. `, bold: true, size: 22 }),
                new TextRun({ text: step, size: 22 })
              ],
              spacing: { after: 100 }
            })
          );
        });

        // Conseil
        if (recipe.tips) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `💡 Conseil du chef: ${recipe.tips}`, italics: true, size: 20, color: '8B4513' })],
              shading: { fill: 'FFF8DC' },
              spacing: { before: 200, after: 100 }
            })
          );
        }

        // Nutrition
        if (recipe.nutritionInfo) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `❤️ ${recipe.nutritionInfo}`, size: 18, color: '808080' })],
              spacing: { before: 150 }
            })
          );
        }
      }

      // Créer le document
      const doc = new Document({
        sections: [{ properties: {}, children }]
      });

      // Télécharger
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle || 'livre-recettes'}_${new Date().toISOString().split('T')[0]}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Document Word téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur export Word:', error);
      toast.error('Erreur lors de l\'export Word');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <Card className="border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-red-500/5 to-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            📚 Générateur de Livre de Recettes IA
          </CardTitle>
          <CardDescription>
            Créez un livre de cuisine complet avec recettes, ingrédients, instructions et photos générées par IA
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Infos générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Informations du livre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Titre du livre de recettes</Label>
              <Input
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Cliquez sur un exemple ci-dessous ou tapez votre titre"
                className="mt-1"
              />
              {/* Exemples de titres cliquables */}
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1.5">💡 Exemples (cliquez pour utiliser) :</p>
                <div className="flex flex-wrap gap-1.5">
                  {exampleTitles.map((example, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer text-xs hover:bg-primary/10 transition-colors"
                      onClick={() => applyExampleTitle(example)}
                    >
                      {example.title}
                    </Badge>
                  ))}
                </div>
              </div>
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
              <Label>Style de cuisine</Label>
              <Select value={cuisineStyle} onValueChange={setCuisineStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineStyles.map(style => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Public cible</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous publics</SelectItem>
                  <SelectItem value="debutants">Débutants en cuisine</SelectItem>
                  <SelectItem value="confirmes">Cuisiniers confirmés</SelectItem>
                  <SelectItem value="familles">Familles avec enfants</SelectItem>
                  <SelectItem value="etudiants">Étudiants / Budget serré</SelectItem>
                  <SelectItem value="sportifs">Sportifs / Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Options de génération */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              Options de génération
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de recettes: {numberOfRecipes}</Label>
              <input
                type="range"
                min="5"
                max="30"
                value={numberOfRecipes}
                onChange={(e) => setNumberOfRecipes(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Catégories de recettes</Label>
              <div className="flex flex-wrap gap-2">
                {recipeCategories.map(cat => (
                  <Badge
                    key={cat.value}
                    variant={selectedCategories.includes(cat.value) ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleCategory(cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNutrition"
                checked={includeNutrition}
                onCheckedChange={(checked) => setIncludeNutrition(!!checked)}
              />
              <Label htmlFor="includeNutrition" className="flex items-center gap-2 cursor-pointer">
                <Leaf className="w-4 h-4 text-green-500" />
                Inclure les infos nutritionnelles
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeImages"
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(!!checked)}
              />
              <Label htmlFor="includeImages" className="flex items-center gap-2 cursor-pointer">
                <ImageIcon className="w-4 h-4 text-primary" />
                Générer les photos des recettes
              </Label>
            </div>

            {/* Slider nombre de photos - affiché seulement si includeImages est true */}
            {includeImages && (
              <div className="pl-6 border-l-2 border-primary/30">
                <Label>Nombre de photos à générer : {numberOfPhotos}</Label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={numberOfPhotos}
                  onChange={(e) => setNumberOfPhotos(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 photos</span>
                  <span>Toutes ({numberOfRecipes})</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ⚠️ Plus de photos = génération plus longue
                </p>
              </div>
            )}

            <div>
              <Label>Instructions spéciales (optionnel)</Label>
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="ex: Sans gluten, recettes de saison, utiliser des produits locaux..."
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
          onClick={generateRecipes}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {currentStep}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              🍳 Générer {numberOfRecipes} Recettes
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isGenerating && (
        <Card className="border-orange-500/30">
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

      {/* Recettes générées */}
      {recipes.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange-500" />
                {recipes.length} Recettes Générées
              </h2>
              <Badge variant="outline" className="text-lg px-4 py-1 mt-1">
                {bookTitle}
              </Badge>
            </div>
            
            {/* Boutons d'export */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportToPDF}
                disabled={isExporting}
                className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={exportToWord}
                disabled={isExporting}
                className="border-blue-500/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                Export Word
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {recipes.map((recipe, index) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center relative">
                    {recipe.imageUrl ? (
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : recipe.isGeneratingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="text-sm text-muted-foreground">Génération...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-5xl">{getCategoryEmoji(recipe.category)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateRecipeImage(recipe.id, recipe.title)}
                        >
                          <ImageIcon className="w-4 h-4 mr-1" />
                          Générer photo
                        </Button>
                      </div>
                    )}
                    <Badge className={`absolute top-2 left-2 ${getDifficultyColor(recipe.difficulty)} text-white`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{recipe.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {recipeCategories.find(c => c.value === recipe.category)?.label}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyRecipeToClipboard(recipe)}
                        >
                          {copiedId === recipe.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRecipe(recipe.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap gap-3 mb-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Prép: {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Flame className="w-4 h-4" />
                        Cuisson: {recipe.cookTime}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {recipe.servings} portions
                      </span>
                    </div>

                    {/* Ingrédients */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-sm mb-1">Ingrédients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 6).map((ing, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                        {recipe.ingredients.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipe.ingredients.length - 6} autres
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Instructions (aperçu) */}
                    <div className="mb-2">
                      <h4 className="font-semibold text-sm mb-1">Instructions:</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.instructions[0]}
                      </p>
                      <span className="text-xs text-primary">{recipe.instructions.length} étapes au total</span>
                    </div>

                    {/* Conseil */}
                    {recipe.tips && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-sm">
                        <span className="font-medium">💡 Conseil:</span> {recipe.tips}
                      </div>
                    )}

                    {/* Nutrition */}
                    {recipe.nutritionInfo && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3 text-red-500" />
                        {recipe.nutritionInfo}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Aide */}
      {recipes.length === 0 && !isGenerating && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Créez votre livre de recettes</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Configurez les options ci-dessus puis cliquez sur "Générer" pour créer 
                  automatiquement vos recettes avec ingrédients, instructions et photos.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">🍳 Recettes détaillées</Badge>
                <Badge variant="outline">📷 Photos IA</Badge>
                <Badge variant="outline">📊 Infos nutrition</Badge>
                <Badge variant="outline">💡 Conseils chef</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EbookRecipeBookGenerator;
