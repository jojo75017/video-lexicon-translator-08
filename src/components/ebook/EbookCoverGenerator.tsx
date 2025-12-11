import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Download, Wand2, RefreshCw, Loader2, Sparkles, Image as ImageIcon, BookOpen, Ruler, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

interface EbookCoverGeneratorProps {
  ebookTitle: string;
  authorName: string;
  onCoverGenerated?: (coverUrl: string) => void;
}

type CoverStyle = 'professional' | 'minimalist' | 'artistic' | 'modern' | 'vintage' | 'fantasy' | 'thriller' | 'romance' | 'horror' | 'detective' | 'historical' | 'literary' | 'comedy' | 'adventure' | 'dystopian' | 'western' | 'spiritual' | 'cookbook';
type CoverGenre = 'non-fiction' | 'fiction' | 'business' | 'self-help' | 'fantasy' | 'romance' | 'thriller' | 'sci-fi' | 'children' | 'horror' | 'mystery' | 'historical' | 'biography' | 'cooking' | 'travel' | 'poetry' | 'health';
type BookFormat = '6x9' | '5x8' | '5.5x8.5' | '8.5x11' | '7x10' | '8x10';
type PaperType = 'white' | 'cream';
type BindingType = 'paperback' | 'hardcover';
type CoverType = 'front' | 'full';

const styleDescriptions: Record<CoverStyle, string> = {
  professional: 'Style professionnel et épuré, typographie claire, design corporate',
  minimalist: 'Design minimaliste, espace blanc, typographie simple et élégante',
  artistic: 'Artistique et créatif, illustrations détaillées, couleurs vibrantes',
  modern: 'Moderne et tendance, formes géométriques, gradients colorés',
  vintage: 'Style vintage rétro, textures anciennes, typographie classique',
  fantasy: 'Univers fantastique, éléments magiques, atmosphère mystérieuse',
  thriller: 'Sombre et intense, contrastes forts, ambiance suspense',
  romance: 'Doux et élégant, couleurs chaudes, atmosphère romantique',
  horror: 'Effrayant et sombre, atmosphère angoissante, éléments macabres',
  detective: 'Style policier noir, mystère, indices visuels, ambiance enquête',
  historical: 'Époque historique, textures anciennes, éléments période',
  literary: 'Littéraire et raffiné, typographie élégante, sobre et classique',
  comedy: 'Léger et coloré, illustrations amusantes, ambiance joyeuse',
  adventure: 'Dynamique et épique, paysages grandioses, action',
  dystopian: 'Futuriste sombre, décor post-apocalyptique, atmosphère oppressante',
  western: 'Far West américain, tons sépia, ambiance cowboy',
  spiritual: 'Spirituel et apaisant, lumière douce, symboles sacrés',
  cookbook: 'Culinaire appétissant, photos de plats, style gourmand'
};

const genreOptions: { value: CoverGenre; label: string }[] = [
  { value: 'non-fiction', label: '📚 Non-fiction' },
  { value: 'fiction', label: '📖 Fiction générale' },
  { value: 'business', label: '💼 Business' },
  { value: 'self-help', label: '🌟 Développement personnel' },
  { value: 'fantasy', label: '🧙 Fantasy' },
  { value: 'romance', label: '💕 Romance' },
  { value: 'thriller', label: '🔪 Thriller' },
  { value: 'sci-fi', label: '🚀 Science-fiction' },
  { value: 'children', label: '🧸 Jeunesse' },
  { value: 'horror', label: '👻 Horreur' },
  { value: 'mystery', label: '🔍 Policier / Mystère' },
  { value: 'historical', label: '🏰 Historique' },
  { value: 'biography', label: '👤 Biographie' },
  { value: 'cooking', label: '🍳 Cuisine' },
  { value: 'travel', label: '✈️ Voyage' },
  { value: 'poetry', label: '✒️ Poésie' },
  { value: 'health', label: '💪 Santé / Bien-être' }
];

const bookFormats: { value: BookFormat; label: string; width: number; height: number }[] = [
  { value: '6x9', label: '6" x 9" (Standard)', width: 6, height: 9 },
  { value: '5x8', label: '5" x 8" (Petit format)', width: 5, height: 8 },
  { value: '5.5x8.5', label: '5.5" x 8.5" (Digest)', width: 5.5, height: 8.5 },
  { value: '8.5x11', label: '8.5" x 11" (Lettre US)', width: 8.5, height: 11 },
  { value: '7x10', label: '7" x 10" (Textbook)', width: 7, height: 10 },
  { value: '8x10', label: '8" x 10" (Large)', width: 8, height: 10 },
];

// KDP spine calculation constants (in inches)
const SPINE_MULTIPLIERS = {
  white: 0.002252, // per page for white paper
  cream: 0.0025,   // per page for cream paper
};

const BLEED = 0.125; // 1/8 inch bleed on all sides

export const EbookCoverGenerator: React.FC<EbookCoverGeneratorProps> = ({
  ebookTitle,
  authorName,
  onCoverGenerated
}) => {
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('professional');
  const [genre, setGenre] = useState<CoverGenre>('non-fiction');
  const [customPrompt, setCustomPrompt] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [backCoverText, setBackCoverText] = useState('');
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  const [selectedCover, setSelectedCover] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variation, setVariation] = useState(1);
  
  // KDP specific options
  const [bookFormat, setBookFormat] = useState<BookFormat>('6x9');
  const [pageCount, setPageCount] = useState<number>(200);
  const [paperType, setPaperType] = useState<PaperType>('white');
  const [bindingType, setBindingType] = useState<BindingType>('paperback');
  const [coverType, setCoverType] = useState<CoverType>('front');

  // Calculate spine width based on page count and paper type
  const spineWidth = useMemo(() => {
    const multiplier = SPINE_MULTIPLIERS[paperType];
    return Math.max(0.0625, pageCount * multiplier); // Minimum 1/16 inch
  }, [pageCount, paperType]);

  // Get current format dimensions
  const currentFormat = bookFormats.find(f => f.value === bookFormat) || bookFormats[0];

  // Calculate full cover dimensions with bleed
  const coverDimensions = useMemo(() => {
    const frontWidth = currentFormat.width + BLEED;
    const backWidth = currentFormat.width + BLEED;
    const height = currentFormat.height + (BLEED * 2);
    const totalWidth = frontWidth + spineWidth + backWidth;

    // Convert to pixels at 300 DPI
    const dpi = 300;
    return {
      frontWidthIn: frontWidth,
      backWidthIn: backWidth,
      spineWidthIn: spineWidth,
      heightIn: height,
      totalWidthIn: totalWidth,
      frontWidthPx: Math.round(frontWidth * dpi),
      backWidthPx: Math.round(backWidth * dpi),
      spineWidthPx: Math.round(spineWidth * dpi),
      heightPx: Math.round(height * dpi),
      totalWidthPx: Math.round(totalWidth * dpi),
    };
  }, [currentFormat, spineWidth]);

  const generateCover = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre pour votre ebook');
      return;
    }

    setIsGenerating(true);
    toast.info(`Génération de la couverture ${coverType === 'full' ? 'complète' : 'avant'} en cours...`);

    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle,
          authorName: authorName || 'Auteur',
          subtitle,
          genre,
          style: coverStyle,
          customPrompt,
          variation,
          // KDP specifics
          coverType,
          bookFormat,
          pageCount,
          paperType,
          bindingType,
          spineWidth: spineWidth.toFixed(4),
          dimensions: coverDimensions,
          backCoverText
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedCovers(prev => [...prev, data.imageUrl]);
        setSelectedCover(generatedCovers.length);
        setVariation(prev => prev + 1);
        toast.success('Couverture générée avec succès !');
        
        if (onCoverGenerated) {
          onCoverGenerated(data.imageUrl);
        }
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Erreur génération couverture:', error);
      if (error.message?.includes('429') || error.message?.includes('Rate')) {
        toast.error('Limite de requêtes atteinte. Réessayez dans quelques instants.');
      } else if (error.message?.includes('402')) {
        toast.error('Crédits épuisés. Ajoutez des crédits à votre espace Lovable.');
      } else {
        toast.error(error.message || 'Erreur lors de la génération');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCover = (format: 'jpeg' | 'pdf' = 'jpeg') => {
    const coverUrl = generatedCovers[selectedCover];
    if (!coverUrl) return;

    if (format === 'pdf') {
      downloadAsPDF();
      return;
    }

    const link = document.createElement('a');
    link.href = coverUrl;
    const suffix = coverType === 'full' ? 'full_cover' : 'front_cover';
    link.download = `${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_${suffix}_${selectedCover + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Couverture JPEG téléchargée !');
  };

  const downloadAsPDF = async () => {
    const coverUrl = generatedCovers[selectedCover];
    if (!coverUrl) return;

    toast.info('Création du PDF en cours...');

    try {
      // Create image element to get dimensions
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Impossible de charger l\'image'));
        img.src = coverUrl;
      });

      // Calculate PDF dimensions based on cover type and format
      const dpi = 300;
      let pdfWidth: number;
      let pdfHeight: number;

      if (coverType === 'full') {
        // Full cover - use calculated dimensions
        pdfWidth = coverDimensions.totalWidthIn * 72; // Convert inches to points (72 points per inch)
        pdfHeight = coverDimensions.heightIn * 72;
      } else {
        // Front cover only
        pdfWidth = (currentFormat.width + BLEED) * 72;
        pdfHeight = (currentFormat.height + BLEED * 2) * 72;
      }

      // Create PDF with exact KDP dimensions
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });

      // Add image to fill the entire page
      pdf.addImage(coverUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Save PDF
      const suffix = coverType === 'full' ? 'full_cover' : 'front_cover';
      pdf.save(`${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_${suffix}_${selectedCover + 1}.pdf`);

      toast.success('Couverture PDF téléchargée !', {
        description: `Dimensions: ${coverType === 'full' ? coverDimensions.totalWidthIn.toFixed(2) : currentFormat.width}"x${coverType === 'full' ? coverDimensions.heightIn.toFixed(2) : currentFormat.height}" à 300 DPI`
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de la création du PDF');
    }
  };

  const currentCover = generatedCovers[selectedCover];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-purple-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Palette className="h-5 w-5 text-white" />
          </div>
          Générateur de Couverture KDP
          <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
        <CardDescription>
          Créez une couverture professionnelle aux dimensions exactes Amazon KDP
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="design" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="design">🎨 Design</TabsTrigger>
            <TabsTrigger value="kdp">📐 Dimensions KDP</TabsTrigger>
            <TabsTrigger value="preview">👁️ Aperçu</TabsTrigger>
          </TabsList>

          {/* Onglet Design */}
          <TabsContent value="design" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Type de couverture</Label>
                <Select value={coverType} onValueChange={(v) => setCoverType(v as CoverType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">📖 Couverture avant seule</SelectItem>
                    <SelectItem value="full">📚 Couverture complète (avant + tranche + dos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Genre du livre</Label>
                <Select value={genre} onValueChange={(value) => setGenre(value as CoverGenre)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genreOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Style de couverture</Label>
                <Select value={coverStyle} onValueChange={(value) => setCoverStyle(value as CoverStyle)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    <SelectItem value="professional">📊 Professionnel</SelectItem>
                    <SelectItem value="minimalist">⚪ Minimaliste</SelectItem>
                    <SelectItem value="artistic">🎨 Artistique</SelectItem>
                    <SelectItem value="modern">✨ Moderne</SelectItem>
                    <SelectItem value="vintage">📜 Vintage</SelectItem>
                    <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                    <SelectItem value="thriller">🔪 Thriller</SelectItem>
                    <SelectItem value="romance">💕 Romance</SelectItem>
                    <SelectItem value="horror">👻 Horreur</SelectItem>
                    <SelectItem value="detective">🔍 Policier / Détective</SelectItem>
                    <SelectItem value="historical">🏰 Historique</SelectItem>
                    <SelectItem value="literary">📖 Littéraire</SelectItem>
                    <SelectItem value="comedy">😄 Comédie</SelectItem>
                    <SelectItem value="adventure">⚔️ Aventure</SelectItem>
                    <SelectItem value="dystopian">🌆 Dystopie</SelectItem>
                    <SelectItem value="western">🤠 Western</SelectItem>
                    <SelectItem value="spiritual">🕊️ Spirituel</SelectItem>
                    <SelectItem value="cookbook">🍳 Cuisine</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {styleDescriptions[coverStyle]}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Sous-titre (optionnel)</Label>
                <Input
                  placeholder="Ex: Guide pratique pour..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {coverType === 'full' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Options couverture complète
                </h4>
                <div>
                  <Label className="text-sm font-medium">Texte de 4ème de couverture</Label>
                  <Textarea
                    placeholder="Résumé du livre, accroche marketing..."
                    value={backCoverText}
                    onChange={(e) => setBackCoverText(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      <strong>Photo de l'auteur :</strong> L'IA va générer un espace réservé pour votre photo. 
                      Vous devrez ajouter votre propre photo manuellement avec un logiciel de retouche (Canva, Photoshop...) après téléchargement.
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Personnalisation avancée (optionnel)</Label>
              <Textarea
                placeholder="Ex: Avec des éléments de nature, couleurs vertes et bleues, ambiance zen..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
          </TabsContent>

          {/* Onglet Dimensions KDP */}
          <TabsContent value="kdp" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Format du livre</Label>
                <Select value={bookFormat} onValueChange={(v) => setBookFormat(v as BookFormat)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bookFormats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Type de reliure</Label>
                <Select value={bindingType} onValueChange={(v) => setBindingType(v as BindingType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paperback">📖 Broché (Paperback)</SelectItem>
                    <SelectItem value="hardcover">📕 Relié (Hardcover)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Nombre de pages</Label>
                <Input
                  type="number"
                  min={24}
                  max={828}
                  value={pageCount}
                  onChange={(e) => setPageCount(Math.max(24, Math.min(828, parseInt(e.target.value) || 24)))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  KDP: minimum 24 pages, maximum 828 pages
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Type de papier</Label>
                <Select value={paperType} onValueChange={(v) => setPaperType(v as PaperType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">⬜ Papier blanc</SelectItem>
                    <SelectItem value="cream">🟨 Papier crème</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calcul des dimensions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 flex items-center gap-2 mb-3">
                <Ruler className="w-4 h-4" />
                Dimensions calculées pour KDP
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-muted-foreground text-xs">Largeur tranche</p>
                  <p className="font-bold text-purple-700">{spineWidth.toFixed(3)}"</p>
                  <p className="text-xs text-muted-foreground">{(spineWidth * 25.4).toFixed(1)} mm</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-muted-foreground text-xs">Hauteur totale</p>
                  <p className="font-bold text-purple-700">{coverDimensions.heightIn.toFixed(3)}"</p>
                  <p className="text-xs text-muted-foreground">{coverDimensions.heightPx} px</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-muted-foreground text-xs">Largeur totale</p>
                  <p className="font-bold text-purple-700">{coverDimensions.totalWidthIn.toFixed(3)}"</p>
                  <p className="text-xs text-muted-foreground">{coverDimensions.totalWidthPx} px</p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-muted-foreground text-xs">Fond perdu</p>
                  <p className="font-bold text-purple-700">{BLEED}" (3.175 mm)</p>
                  <p className="text-xs text-muted-foreground">sur tous les côtés</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Formule KDP tranche :</strong> Papier blanc = pages × 0.002252" | Papier crème = pages × 0.0025"
                    <br />Pour {pageCount} pages en papier {paperType === 'white' ? 'blanc' : 'crème'} = <strong>{spineWidth.toFixed(4)}"</strong>
                  </span>
                </p>
              </div>
            </div>

            {/* Schéma visuel */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <h4 className="font-medium text-gray-700 mb-3">Schéma de la couverture complète</h4>
              <div className="flex items-center justify-center gap-0 h-32">
                <div className="h-full bg-blue-100 border-2 border-blue-300 rounded-l-lg flex items-center justify-center px-4" 
                     style={{ width: '35%' }}>
                  <span className="text-xs text-blue-700 font-medium text-center">
                    4ème de couverture<br/>
                    {currentFormat.width}" + fond perdu
                  </span>
                </div>
                <div className="h-full bg-purple-200 border-y-2 border-purple-400 flex items-center justify-center"
                     style={{ width: '10%', minWidth: '40px' }}>
                  <span className="text-xs text-purple-700 font-medium writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                    Tranche {spineWidth.toFixed(2)}"
                  </span>
                </div>
                <div className="h-full bg-green-100 border-2 border-green-300 rounded-r-lg flex items-center justify-center px-4"
                     style={{ width: '35%' }}>
                  <span className="text-xs text-green-700 font-medium text-center">
                    Couverture avant<br/>
                    {currentFormat.width}" + fond perdu
                  </span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Hauteur totale: {currentFormat.height}" + {BLEED * 2}" fond perdu = {coverDimensions.heightIn}"
              </p>
            </div>
          </TabsContent>

          {/* Onglet Aperçu */}
          <TabsContent value="preview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Button 
                  onClick={generateCover}
                  disabled={isGenerating || !ebookTitle}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Générer {coverType === 'full' ? 'couverture complète' : 'couverture avant'}
                    </>
                  )}
                </Button>

                {generatedCovers.length > 0 && (
                  <Button 
                    onClick={generateCover}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Générer une variante ({generatedCovers.length})
                  </Button>
                )}

                {/* Info dimensions */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm">
                  <p className="font-medium text-purple-800 mb-1">Paramètres actuels:</p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• Format: {currentFormat.label}</li>
                    <li>• Type: {coverType === 'full' ? 'Couverture complète' : 'Avant seule'}</li>
                    <li>• Pages: {pageCount} ({paperType === 'white' ? 'blanc' : 'crème'})</li>
                    <li>• Tranche: {spineWidth.toFixed(3)}"</li>
                    {coverType === 'full' && (
                      <li>• Dimensions: {coverDimensions.totalWidthPx} x {coverDimensions.heightPx} px</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {currentCover ? (
                  <>
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <img 
                        src={currentCover} 
                        alt="Couverture générée"
                        className="w-full h-auto block"
                      />
                    </div>
                    
                    {generatedCovers.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {generatedCovers.map((cover, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCover(idx)}
                            className={`flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedCover === idx 
                                ? 'border-purple-500 ring-2 ring-purple-300' 
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <img src={cover} alt={`Variante ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => downloadCover('jpeg')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JPEG
                      </Button>
                      <Button 
                        onClick={() => downloadCover('pdf')}
                        variant="outline"
                        className="flex-1"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="border-2 border-dashed border-purple-200 rounded-xl h-80 flex flex-col items-center justify-center bg-purple-50/50">
                    <ImageIcon className="w-16 h-16 text-purple-300 mb-4" />
                    <p className="text-muted-foreground text-center px-4">
                      Votre couverture apparaîtra ici
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {coverType === 'full' 
                        ? `${coverDimensions.totalWidthPx} x ${coverDimensions.heightPx} px`
                        : `${coverDimensions.frontWidthPx} x ${coverDimensions.heightPx} px`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
