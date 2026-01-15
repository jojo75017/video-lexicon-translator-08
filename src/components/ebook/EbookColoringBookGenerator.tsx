import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Loader2, Palette, Download, RefreshCw, Sparkles, Baby, ImagePlus, BookOpen, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export const EbookColoringBookGenerator: React.FC<ColoringBookGeneratorProps> = ({ ebookTitle }) => {
  const [theme, setTheme] = useState('animals');
  const [customTheme, setCustomTheme] = useState('');
  const [ageGroup, setAgeGroup] = useState('4-6');
  const [complexity, setComplexity] = useState([2]);
  const [numberOfPages, setNumberOfPages] = useState(5);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPages, setGeneratedPages] = useState<ColoringPage[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

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

  const generateColoringPage = async (pageNumber: number): Promise<ColoringPage | null> => {
    const selectedTheme = theme === 'custom' ? customTheme : THEMES.find(t => t.value === theme)?.label || theme;
    const ageInfo = AGE_GROUPS.find(a => a.value === ageGroup);
    const complexityInfo = COMPLEXITY_LEVELS.find(c => c.value === complexity[0]);

    const subjects = {
      animals: ['un lion majestueux', 'un éléphant adorable', 'un papillon coloré', 'un chat joueur', 'un chien heureux', 'une grenouille souriante', 'un hibou sage', 'un lapin mignon'],
      fantasy: ['une licorne magique', 'un dragon amical', 'une fée étincelante', 'un château enchanté', 'une sirène gracieuse', 'un phoenix majestueux'],
      nature: ['un bouquet de fleurs', 'un arbre majestueux', 'un jardin fleuri', 'une montagne avec soleil', 'un champ de tulipes'],
      vehicles: ['une voiture de course', 'un camion de pompiers', 'un avion dans les nuages', 'un bateau sur l\'eau', 'une fusée spatiale'],
      seasons: ['un bonhomme de neige', 'des feuilles d\'automne', 'des fleurs de printemps', 'une plage d\'été', 'Père Noël avec cadeaux'],
      food: ['une pizza appétissante', 'un gâteau d\'anniversaire', 'une corbeille de fruits', 'un sundae géant', 'des cupcakes décorés'],
      space: ['une fusée dans l\'espace', 'un astronaute sur la lune', 'une planète avec anneaux', 'un alien amical', 'une station spatiale'],
      ocean: ['un dauphin joueur', 'un poisson clown', 'une tortue de mer', 'un poulpe amusant', 'un hippocampe élégant'],
      dinosaurs: ['un T-Rex souriant', 'un Tricératops amical', 'un Diplodocus géant', 'un Ptéranodon volant', 'un Stégosaure paisible'],
      custom: [customTheme || 'un dessin personnalisé'],
    };

    const themeSubjects = subjects[theme as keyof typeof subjects] || subjects.custom;
    const subject = customPrompt || themeSubjects[pageNumber % themeSubjects.length];

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
          aspectRatio: '1:1',
          quality: 'high',
          colorScheme: 'monochrome',
          useOpenAI: false,
          customPrompt: prompt,
        },
      });

      if (error) throw error;

      const imageUrl = data?.imageUrl || data?.url;
      if (!imageUrl) throw new Error('Aucune image générée');

      return {
        id: `page-${pageNumber}-${Date.now()}`,
        title: subject,
        imageUrl,
        suggestedColors: generateColorPalette(theme, subject),
        prompt,
      };
    } catch (error) {
      console.error(`Erreur génération page ${pageNumber}:`, error);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (theme === 'custom' && !customTheme.trim()) {
      toast.error('Veuillez entrer un thème personnalisé');
      return;
    }

    setIsGenerating(true);
    setGeneratedPages([]);
    setCurrentProgress(0);

    const pages: ColoringPage[] = [];

    for (let i = 0; i < numberOfPages; i++) {
      setCurrentProgress(((i + 1) / numberOfPages) * 100);
      const page = await generateColoringPage(i);
      if (page) {
        pages.push(page);
        setGeneratedPages([...pages]);
      }
      // Petit délai entre les générations
      if (i < numberOfPages - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsGenerating(false);
    
    if (pages.length > 0) {
      toast.success(`${pages.length} page(s) de coloriage générée(s) !`);
    } else {
      toast.error('Erreur lors de la génération');
    }
  };

  const regeneratePage = async (index: number) => {
    setIsGenerating(true);
    const newPage = await generateColoringPage(index);
    if (newPage) {
      const updatedPages = [...generatedPages];
      updatedPages[index] = newPage;
      setGeneratedPages(updatedPages);
      toast.success('Page régénérée !');
    }
    setIsGenerating(false);
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

            {/* Nombre de pages */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Nombre de pages</Label>
                <Badge variant="secondary">{numberOfPages} pages</Badge>
              </div>
              <Slider
                value={[numberOfPages]}
                onValueChange={(v) => setNumberOfPages(v[0])}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Estimation: {numberOfPages} crédits (~{numberOfPages * 0.5}€)
              </p>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Pages générées ({generatedPages.length})
            </CardTitle>
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
                <li>• Imprimez sur du papier épais (120-160 g/m²) pour éviter que les feutres traversent</li>
                <li>• Incluez une page de test des couleurs au début du livre</li>
                <li>• Ajoutez les codes couleurs à côté de chaque dessin pour guider les enfants</li>
                <li>• Pour KDP, utilisez le format 8.5x8.5" ou 8.5x11" en intérieur noir et blanc</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EbookColoringBookGenerator;
