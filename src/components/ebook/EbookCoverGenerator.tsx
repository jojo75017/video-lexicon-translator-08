import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Download, Wand2, RefreshCw, Loader2, Sparkles, Image as ImageIcon, BookOpen, Ruler, Info, FileText, Upload, X, User, Type, PaintBucket, Lightbulb, Copy, Check, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

interface EbookCoverGeneratorProps {
  ebookTitle: string;
  authorName: string;
  onCoverGenerated?: (coverUrl: string) => void;
}

type CoverStyle = 'professional' | 'minimalist' | 'artistic' | 'modern' | 'vintage' | 'fantasy' | 'thriller' | 'romance' | 'horror' | 'detective' | 'historical' | 'literary' | 'comedy' | 'adventure' | 'dystopian' | 'western' | 'spiritual' | 'cookbook' | 'garden';
type CoverGenre = 'non-fiction' | 'fiction' | 'business' | 'self-help' | 'fantasy' | 'romance' | 'thriller' | 'sci-fi' | 'children' | 'horror' | 'mystery' | 'historical' | 'biography' | 'cooking' | 'travel' | 'poetry' | 'health' | 'gardening' | 'garden-bio' | 'permaculture' | 'potager' | 'bricolage';
type BookFormat = '6x9' | '5x8' | '5.5x8.5' | '8.5x11' | '7x10' | '8x10' | '4.25x6.87' | '4.72x7.48' | '5.12x7.87' | '4.33x7.09' | '5.51x8.27';
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
  cookbook: 'Culinaire appétissant, photos de plats, style gourmand',
  garden: 'Nature verdoyante, plantes, fleurs, ambiance jardin naturel'
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
  { value: 'health', label: '💪 Santé / Bien-être' },
  { value: 'gardening', label: '🌱 Jardinage' },
  { value: 'garden-bio', label: '🌿 Jardin Bio' },
  { value: 'permaculture', label: '🌾 Permaculture' },
  { value: 'potager', label: '🥕 Potager' },
  { value: 'bricolage', label: '🔨 Bricolage' }
];

const bookFormats: { value: BookFormat; label: string; width: number; height: number; category?: string }[] = [
  { value: '4.25x6.87', label: '📖 Poche Standard (11x17.5cm)', width: 4.25, height: 6.87, category: 'poche' },
  { value: '4.72x7.48', label: '📖 Poche Large (12x19cm)', width: 4.72, height: 7.48, category: 'poche' },
  { value: '5.12x7.87', label: '📖 Format Folio (13x20cm)', width: 5.12, height: 7.87, category: 'poche' },
  { value: '4.33x7.09', label: '📖 Livre de Poche (11x18cm)', width: 4.33, height: 7.09, category: 'poche' },
  { value: '5.51x8.27', label: '📖 Semi-Poche (14x21cm)', width: 5.51, height: 8.27, category: 'poche' },
  { value: '5x8', label: '📕 5" x 8" (Petit format KDP)', width: 5, height: 8, category: 'kdp' },
  { value: '5.5x8.5', label: '📕 5.5" x 8.5" (Digest)', width: 5.5, height: 8.5, category: 'kdp' },
  { value: '6x9', label: '📕 6" x 9" (Standard KDP)', width: 6, height: 9, category: 'kdp' },
  { value: '7x10', label: '📗 7" x 10" (Textbook)', width: 7, height: 10, category: 'grand' },
  { value: '8x10', label: '📗 8" x 10" (Large)', width: 8, height: 10, category: 'grand' },
  { value: '8.5x11', label: '📗 8.5" x 11" (Lettre US)', width: 8.5, height: 11, category: 'grand' },
];

const SPINE_MULTIPLIERS = { white: 0.002252, cream: 0.0025 };
const BLEED = 0.125;

interface AiPromptResult {
  prompt: string;
  promptFr: string;
  conceptTitle: string;
  moodboard: string[];
  colorPalette: string[];
  photographyStyle: string;
  lightingSetup: string;
}

export const EbookCoverGenerator: React.FC<EbookCoverGeneratorProps> = ({
  ebookTitle: initialTitle,
  authorName: initialAuthor,
  onCoverGenerated
}) => {
  // Editable fields
  const [title, setTitle] = useState(initialTitle || '');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState(initialAuthor || '');
  
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('professional');
  const [genre, setGenre] = useState<CoverGenre>('non-fiction');
  const [customPrompt, setCustomPrompt] = useState('');
  const [backCoverText, setBackCoverText] = useState('');
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  const [selectedCover, setSelectedCover] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variation, setVariation] = useState(1);
  
  // AI Prompt
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [aiPromptResult, setAiPromptResult] = useState<AiPromptResult | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  
  // KDP options
  const [bookFormat, setBookFormat] = useState<BookFormat>('6x9');
  const [pageCount, setPageCount] = useState<number>(200);
  const [paperType, setPaperType] = useState<PaperType>('white');
  const [bindingType, setBindingType] = useState<BindingType>('paperback');
  const [coverType, setCoverType] = useState<CoverType>('front');
  
  // Author photo
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  const authorPhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Advanced customization
  const [authorNamePosition, setAuthorNamePosition] = useState<string>('bottom');
  const [authorNameStyle, setAuthorNameStyle] = useState<string>('elegant');
  const [colorScheme, setColorScheme] = useState<string>('auto');
  const [titlePosition, setTitlePosition] = useState<string>('center');
  const [showAuthorOnCover, setShowAuthorOnCover] = useState<boolean>(true);

  const handleAuthorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('La photo ne doit pas dépasser 5 Mo'); return; }
      const reader = new FileReader();
      reader.onload = (event) => { setAuthorPhoto(event.target?.result as string); toast.success('Photo ajoutée'); };
      reader.readAsDataURL(file);
    }
  };

  const removeAuthorPhoto = () => { setAuthorPhoto(null); if (authorPhotoInputRef.current) authorPhotoInputRef.current.value = ''; };

  const spineWidth = useMemo(() => Math.max(0.0625, pageCount * SPINE_MULTIPLIERS[paperType]), [pageCount, paperType]);
  const currentFormat = bookFormats.find(f => f.value === bookFormat) || bookFormats[0];

  const coverDimensions = useMemo(() => {
    const frontWidth = currentFormat.width + BLEED;
    const backWidth = currentFormat.width + BLEED;
    const height = currentFormat.height + (BLEED * 2);
    const totalWidth = frontWidth + spineWidth + backWidth;
    const dpi = 300;
    return {
      frontWidthIn: frontWidth, backWidthIn: backWidth, spineWidthIn: spineWidth,
      heightIn: height, totalWidthIn: totalWidth,
      frontWidthPx: Math.round(frontWidth * dpi), backWidthPx: Math.round(backWidth * dpi),
      spineWidthPx: Math.round(spineWidth * dpi), heightPx: Math.round(height * dpi),
      totalWidthPx: Math.round(totalWidth * dpi),
    };
  }, [currentFormat, spineWidth]);

  // AI Prompt Generation
  const generateAiPrompt = async () => {
    if (!title) { toast.error('Entrez un titre pour générer le prompt'); return; }
    setIsGeneratingPrompt(true);
    toast.info('🎨 Création du concept artistique...');
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-prompt', {
        body: { title, subtitle, authorName: author, genre, style: coverStyle }
      });
      if (error) throw error;
      setAiPromptResult(data);
      setCustomPrompt(data.prompt || '');
      toast.success('✨ Concept artistique généré !');
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      toast.error(error.message || 'Erreur lors de la génération du prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const copyPrompt = () => {
    if (customPrompt) {
      navigator.clipboard.writeText(customPrompt);
      setPromptCopied(true);
      toast.success('Prompt copié !');
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  const generateCover = async () => {
    if (!title) { toast.error('Veuillez entrer un titre'); return; }
    setIsGenerating(true);
    toast.info(`Génération de la couverture ${coverType === 'full' ? 'complète' : 'avant'} en cours...`);
    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle: title, authorName: author || 'Auteur', subtitle, genre,
          style: coverStyle, customPrompt, variation, coverType, bookFormat,
          pageCount, paperType, bindingType, spineWidth: spineWidth.toFixed(4),
          dimensions: coverDimensions, backCoverText, authorNamePosition,
          authorNameStyle, colorScheme, titlePosition, showAuthorOnCover
        }
      });
      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedCovers(prev => [...prev, data.imageUrl]);
        setSelectedCover(generatedCovers.length);
        setVariation(prev => prev + 1);
        toast.success('Couverture générée avec succès !');
        if (onCoverGenerated) onCoverGenerated(data.imageUrl);
      } else if (data?.error) throw new Error(data.error);
    } catch (error: any) {
      console.error('Erreur génération couverture:', error);
      if (error.message?.includes('429')) toast.error('Limite de requêtes atteinte. Réessayez dans quelques instants.');
      else if (error.message?.includes('402')) toast.error('Crédits épuisés.');
      else toast.error(error.message || 'Erreur lors de la génération');
    } finally { setIsGenerating(false); }
  };

  const compositeWithAuthorPhoto = async (coverUrl: string): Promise<string> => {
    if (!authorPhoto || coverType !== 'full') return coverUrl;
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not available')); return; }
      const coverImg = new Image();
      coverImg.crossOrigin = 'anonymous';
      coverImg.onload = () => {
        canvas.width = coverImg.width; canvas.height = coverImg.height;
        ctx.drawImage(coverImg, 0, 0);
        const authorImg = new Image();
        authorImg.onload = () => {
          const backCoverWidth = coverImg.width * 0.45;
          const photoSize = Math.min(backCoverWidth * 0.25, coverImg.height * 0.18);
          const photoX = backCoverWidth * 0.15;
          const photoY = coverImg.height * 0.65;
          ctx.save(); ctx.beginPath();
          ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
          ctx.closePath(); ctx.clip();
          ctx.drawImage(authorImg, photoX, photoY, photoSize, photoSize);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'white'; ctx.lineWidth = Math.max(4, photoSize * 0.04); ctx.stroke();
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        authorImg.onerror = () => resolve(coverUrl);
        authorImg.src = authorPhoto;
      };
      coverImg.onerror = () => reject(new Error('Failed to load cover'));
      coverImg.src = coverUrl;
    });
  };

  const downloadCover = async (format: 'jpeg' | 'pdf' = 'jpeg') => {
    const coverUrl = generatedCovers[selectedCover];
    if (!coverUrl) return;
    if (format === 'pdf') { downloadAsPDF(); return; }
    try {
      toast.info('Préparation...');
      const finalUrl = await compositeWithAuthorPhoto(coverUrl);
      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_')}_${coverType}_${selectedCover + 1}.jpg`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast.success('Couverture JPEG téléchargée !');
    } catch { toast.error('Erreur téléchargement'); }
  };

  const downloadAsPDF = async () => {
    const coverUrl = generatedCovers[selectedCover];
    if (!coverUrl) return;
    toast.info('Création du PDF...');
    try {
      const finalUrl = await compositeWithAuthorPhoto(coverUrl);
      const img = new Image(); img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(); img.src = finalUrl; });
      const pdfWidth = coverType === 'full' ? coverDimensions.totalWidthIn * 72 : (currentFormat.width + BLEED) * 72;
      const pdfHeight = coverType === 'full' ? coverDimensions.heightIn * 72 : (currentFormat.height + BLEED * 2) * 72;
      const pdf = new jsPDF({ orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait', unit: 'pt', format: [pdfWidth, pdfHeight] });
      pdf.addImage(finalUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_')}_${coverType}_${selectedCover + 1}.pdf`);
      toast.success('PDF KDP téléchargé !');
    } catch { toast.error('Erreur PDF'); }
  };

  const currentCover = generatedCovers[selectedCover];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-primary/20 to-card p-8 text-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Camera className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Studio de Couverture KDP</h2>
              <p className="text-purple-200 text-sm">Créez des couvertures photoréalistes dignes des plus grands éditeurs</p>
            </div>
            <Badge className="ml-auto bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Pro
            </Badge>
          </div>
        </div>
      </div>

      {/* Book Identity Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/80 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-1" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Identité du Livre
          </CardTitle>
          <CardDescription>Renseignez les informations de votre livre pour générer la couverture parfaite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-sm font-semibold text-slate-700">Titre du livre *</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Les Secrets de la Réussite Entrepreneuriale"
                className="mt-1.5 h-12 text-base font-medium border-2 border-slate-200 focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700">Sous-titre (optionnel)</Label>
              <Input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Ex: Guide pratique en 10 étapes"
                className="mt-1.5 border-2 border-slate-200 focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700">Nom de l'auteur *</Label>
              <Input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="mt-1.5 border-2 border-slate-200 focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700">Genre</Label>
              <Select value={genre} onValueChange={v => setGenre(v as CoverGenre)}>
                <SelectTrigger className="mt-1.5 border-2 border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>{genreOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700">Style visuel</Label>
              <Select value={coverStyle} onValueChange={v => setCoverStyle(v as CoverStyle)}>
                <SelectTrigger className="mt-1.5 border-2 border-slate-200"><SelectValue /></SelectTrigger>
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
                  <SelectItem value="detective">🔍 Policier</SelectItem>
                  <SelectItem value="historical">🏰 Historique</SelectItem>
                  <SelectItem value="literary">📖 Littéraire</SelectItem>
                  <SelectItem value="comedy">😄 Comédie</SelectItem>
                  <SelectItem value="adventure">⚔️ Aventure</SelectItem>
                  <SelectItem value="dystopian">🌆 Dystopie</SelectItem>
                  <SelectItem value="western">🤠 Western</SelectItem>
                  <SelectItem value="spiritual">🕊️ Spirituel</SelectItem>
                  <SelectItem value="cookbook">🍳 Cuisine</SelectItem>
                  <SelectItem value="garden">🌿 Jardin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{styleDescriptions[coverStyle]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Prompt Generator */}
      <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 h-1" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-violet-600" />
            Directeur Artistique IA
          </CardTitle>
          <CardDescription>L'IA analyse votre titre et crée un concept visuel unique pour votre couverture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={generateAiPrompt}
            disabled={isGeneratingPrompt || !title}
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-purple-500/25 transition-all"
            size="lg"
          >
            {isGeneratingPrompt ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Création du concept artistique...</>
            ) : (
              <><Wand2 className="h-5 w-5 mr-2" />Générer le Prompt de Couverture IA</>
            )}
          </Button>

          {aiPromptResult && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Concept Header */}
              <div className="bg-white rounded-xl p-5 border border-violet-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-violet-900 text-lg">{aiPromptResult.conceptTitle}</h4>
                    <p className="text-sm text-violet-600 mt-1">{aiPromptResult.promptFr}</p>
                  </div>
                  <Badge className="bg-violet-100 text-violet-700 border-violet-200">Concept IA</Badge>
                </div>
                
                {/* Moodboard & Colors */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Moodboard</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiPromptResult.moodboard?.map((word, i) => (
                        <Badge key={i} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 text-xs">{word}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Palette</p>
                    <div className="flex gap-2">
                      {aiPromptResult.colorPalette?.map((color, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-lg shadow-sm border border-white" style={{ backgroundColor: color }} />
                          <span className="text-[10px] text-slate-400">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photography & Lighting */}
                <div className="grid md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-violet-100">
                  <div className="flex items-start gap-2">
                    <Camera className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Style photo</p>
                      <p className="text-sm text-slate-700">{aiPromptResult.photographyStyle}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Éclairage</p>
                      <p className="text-sm text-slate-700">{aiPromptResult.lightingSetup}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Prompt */}
              <div className="relative">
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                  <Type className="w-4 h-4 text-violet-500" />
                  Prompt de couverture (modifiable)
                </Label>
                <Textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  rows={6}
                  className="mt-1 text-sm font-mono bg-card text-green-300 border-border rounded-xl"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyPrompt}
                  className="absolute top-8 right-2 text-slate-400 hover:text-foreground hover:bg-slate-700"
                >
                  {promptCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {!aiPromptResult && (
            <div className="relative">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-violet-500" />
                Prompt personnalisé (optionnel)
              </Label>
              <Textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Ex: Fond doré élégant avec des motifs géométriques, ambiance luxueuse et sophistiquée..."
                rows={3}
                className="mt-1.5"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-none bg-slate-100 h-12">
              <TabsTrigger value="settings" className="text-sm font-medium">⚙️ Paramètres</TabsTrigger>
              <TabsTrigger value="kdp" className="text-sm font-medium">📐 Dimensions KDP</TabsTrigger>
              <TabsTrigger value="preview" className="text-sm font-medium">👁️ Aperçu & Export</TabsTrigger>
            </TabsList>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type de couverture</Label>
                  <Select value={coverType} onValueChange={v => setCoverType(v as CoverType)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">📖 Couverture avant seule</SelectItem>
                      <SelectItem value="full">📚 Complète (avant + tranche + dos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Palette de couleurs</Label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">🎯 Automatique</SelectItem>
                      <SelectItem value="dark">🌙 Sombre</SelectItem>
                      <SelectItem value="light">☀️ Clair</SelectItem>
                      <SelectItem value="warm">🔥 Chaud</SelectItem>
                      <SelectItem value="cold">❄️ Froid</SelectItem>
                      <SelectItem value="nature">🌿 Nature</SelectItem>
                      <SelectItem value="monochrome">⚫ Monochrome</SelectItem>
                      <SelectItem value="pastel">🎨 Pastel</SelectItem>
                      <SelectItem value="vibrant">💥 Vibrant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Typography Controls */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border space-y-4">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <PaintBucket className="w-4 h-4 text-slate-500" />
                  Typographie & Positionnement
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-medium">Position du titre</Label>
                    <Select value={titlePosition} onValueChange={setTitlePosition}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">📍 En haut</SelectItem>
                        <SelectItem value="center">📍 Centré</SelectItem>
                        <SelectItem value="bottom">📍 En bas</SelectItem>
                        <SelectItem value="overlay">🎬 Superposé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Position nom auteur</Label>
                    <Select value={authorNamePosition} onValueChange={setAuthorNamePosition}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom">📍 En bas</SelectItem>
                        <SelectItem value="top">📍 En haut</SelectItem>
                        <SelectItem value="below-title">📍 Sous le titre</SelectItem>
                        <SelectItem value="signature">✍️ Signature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Style du nom</Label>
                    <Select value={authorNameStyle} onValueChange={setAuthorNameStyle}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elegant">✨ Élégant</SelectItem>
                        <SelectItem value="bold">💪 Gras</SelectItem>
                        <SelectItem value="script">✒️ Script</SelectItem>
                        <SelectItem value="minimal">◻️ Minimal</SelectItem>
                        <SelectItem value="serif">📖 Serif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="showAuthor" checked={showAuthorOnCover} onChange={e => setShowAuthorOnCover(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  <Label htmlFor="showAuthor" className="text-sm cursor-pointer">Afficher le nom d'auteur sur la couverture</Label>
                </div>
              </div>

              {coverType === 'full' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2"><BookOpen className="w-4 h-4" />Options couverture complète</h4>
                  <div>
                    <Label className="text-sm font-medium">Texte de 4ème de couverture</Label>
                    <Textarea placeholder="Résumé, accroche marketing..." value={backCoverText} onChange={e => setBackCoverText(e.target.value)} rows={4} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" />Photo de l'auteur (optionnel)</Label>
                    <input type="file" ref={authorPhotoInputRef} accept="image/*" onChange={handleAuthorPhotoUpload} className="hidden" />
                    {authorPhoto ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border mt-2">
                        <img src={authorPhoto} alt="Auteur" className="w-16 h-16 rounded-full object-cover border-2 border-purple-200" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-700">Photo ajoutée ✓</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeAuthorPhoto} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => authorPhotoInputRef.current?.click()} className="w-full border-dashed mt-2"><Upload className="w-4 h-4 mr-2" />Ajouter votre photo</Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* KDP Dimensions Tab */}
            <TabsContent value="kdp" className="p-6 space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <Label className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4" />Format du livre</Label>
                <Select value={bookFormat} onValueChange={v => setBookFormat(v as BookFormat)}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <div className="px-2 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100 border-b">📚 LIVRES DE POCHE</div>
                    {bookFormats.filter(f => f.category === 'poche').map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    <div className="px-2 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 border-b border-t mt-1">📕 FORMATS KDP STANDARDS</div>
                    {bookFormats.filter(f => f.category === 'kdp').map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    <div className="px-2 py-1.5 text-xs font-semibold text-green-700 bg-green-100 border-b border-t mt-1">📗 GRANDS FORMATS</div>
                    {bookFormats.filter(f => f.category === 'grand').map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Reliure</Label>
                  <Select value={bindingType} onValueChange={v => setBindingType(v as BindingType)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paperback">📖 Broché</SelectItem>
                      <SelectItem value="hardcover">📕 Relié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pages</Label>
                  <Input type="number" min={24} max={828} value={pageCount} onChange={e => setPageCount(Math.max(24, Math.min(828, parseInt(e.target.value) || 24)))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Papier</Label>
                  <Select value={paperType} onValueChange={v => setPaperType(v as PaperType)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">⬜ Blanc</SelectItem>
                      <SelectItem value="cream">🟨 Crème</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calculated dimensions */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-3"><Ruler className="w-4 h-4" />Dimensions calculées</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {[
                    { label: 'Tranche', val: `${spineWidth.toFixed(3)}"`, sub: `${(spineWidth * 25.4).toFixed(1)} mm` },
                    { label: 'Hauteur', val: `${coverDimensions.heightIn.toFixed(3)}"`, sub: `${coverDimensions.heightPx} px` },
                    { label: 'Largeur totale', val: `${coverDimensions.totalWidthIn.toFixed(3)}"`, sub: `${coverDimensions.totalWidthPx} px` },
                    { label: 'Fond perdu', val: `${BLEED}" (3.175mm)`, sub: 'tous les côtés' },
                  ].map((d, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-muted-foreground text-xs">{d.label}</p>
                      <p className="font-bold text-slate-800">{d.val}</p>
                      <p className="text-xs text-muted-foreground">{d.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual schema */}
              <div className="bg-white rounded-xl p-4 border">
                <h4 className="font-medium text-slate-600 mb-3">Schéma de la couverture</h4>
                <div className="flex items-center justify-center gap-0 h-28">
                  <div className="h-full bg-blue-100 border-2 border-blue-300 rounded-l-lg flex items-center justify-center px-4" style={{ width: '35%' }}>
                    <span className="text-xs text-blue-700 font-medium text-center">4ème de couverture</span>
                  </div>
                  <div className="h-full bg-purple-200 border-y-2 border-purple-400 flex items-center justify-center" style={{ width: '10%', minWidth: '35px' }}>
                    <span className="text-[10px] text-purple-700 font-medium" style={{ writingMode: 'vertical-rl' }}>Tranche</span>
                  </div>
                  <div className="h-full bg-green-100 border-2 border-green-300 rounded-r-lg flex items-center justify-center px-4" style={{ width: '35%' }}>
                    <span className="text-xs text-green-700 font-medium text-center">Couverture avant</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preview & Export Tab */}
            <TabsContent value="preview" className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={generateCover}
                  disabled={isGenerating || !title}
                  className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white shadow-xl shadow-orange-500/25"
                  size="lg"
                >
                  {isGenerating ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Génération en cours...</>
                  ) : (
                    <><Wand2 className="h-5 w-5 mr-2" />{generatedCovers.length > 0 ? `Nouvelle variante (${generatedCovers.length + 1})` : 'Générer la Couverture'}</>
                  )}
                </Button>
                {generatedCovers.length > 0 && (
                  <Button onClick={() => { setGeneratedCovers([]); setSelectedCover(0); setVariation(1); }} variant="outline" className="h-14">
                    <RefreshCw className="h-4 w-4 mr-2" />Reset
                  </Button>
                )}
              </div>

              {/* Dimension badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="bg-slate-50">📐 {currentFormat.label}</Badge>
                <Badge variant="outline" className="bg-slate-50">📄 {pageCount} pages</Badge>
                <Badge variant="outline" className="bg-slate-50">📏 Tranche: {spineWidth.toFixed(3)}"</Badge>
                {coverType === 'full' && <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">📚 Complète</Badge>}
              </div>

              {currentCover ? (
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* 3D Mockup */}
                    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl border shadow-inner min-h-[420px]">
                      <div style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}>
                        <div
                          style={{ position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateY(-28deg) rotateX(3deg)', transition: 'transform 0.5s ease' }}
                          className="hover:[transform:rotateY(-8deg)_rotateX(2deg)] cursor-pointer"
                        >
                          <div style={{ width: '260px', height: '380px', position: 'relative', transformStyle: 'preserve-3d', transform: 'translateZ(15px)', borderRadius: '0 6px 6px 0', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.15)' }}>
                            <img src={currentCover} alt="Couverture KDP" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)' }} />
                          </div>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '30px', height: '380px', background: 'linear-gradient(to right, #1a1a2e, #2d2d44, #1a1a2e)', transform: 'rotateY(-90deg) translateX(-15px)', transformOrigin: 'left center', borderRadius: '6px 0 0 6px' }} />
                          <div style={{ position: 'absolute', top: '4px', right: '-12px', width: '24px', height: '372px', background: 'repeating-linear-gradient(to right, #fafaf8, #f5f5f0 1px, #fafaf8 1px, #fafaf8 3px)', transform: 'rotateY(90deg) translateX(12px)', transformOrigin: 'left center', borderRadius: '0 3px 3px 0' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '260px', height: '5px', background: 'linear-gradient(to right, #2d2d44, #3d3d55, #2d2d44)', transform: 'rotateX(-90deg) translateY(2.5px)', transformOrigin: 'bottom center' }} />
                        </div>
                      </div>
                      <div className="mt-4" style={{ width: '180px', height: '20px', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, transparent 70%)', filter: 'blur(8px)' }} />
                      <p className="text-xs text-muted-foreground mt-2 italic">Survolez pour pivoter</p>
                    </div>

                    {/* Full resolution + downloads */}
                    <div className="space-y-3">
                      <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-black/5">
                        <img src={currentCover} alt="Couverture HD" className="w-full h-auto block" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => downloadCover('jpeg')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                          <Download className="h-4 w-4 mr-2" />JPEG HD
                        </Button>
                        <Button onClick={() => downloadCover('pdf')} className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md">
                          <FileText className="h-4 w-4 mr-2" />PDF KDP
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  {generatedCovers.length > 1 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />Galerie ({generatedCovers.length} variantes)
                      </h4>
                      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1">
                        {generatedCovers.map((cover, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCover(idx)}
                            className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedCover === idx ? 'border-orange-500 ring-2 ring-orange-300 shadow-lg scale-105' : 'border-gray-200 hover:border-orange-300 shadow-sm'}`}
                            style={{ width: '80px', height: '120px' }}
                          >
                            <img src={cover} alt={`Variante ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl h-96 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50/50 to-orange-50/30">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-10 h-10 text-amber-400" />
                  </div>
                  <p className="text-muted-foreground text-center font-medium">Votre couverture professionnelle apparaîtra ici</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {coverType === 'full'
                      ? `${coverDimensions.totalWidthPx} × ${coverDimensions.heightPx} px • Complète`
                      : `${coverDimensions.frontWidthPx} × ${coverDimensions.heightPx} px • Avant`
                    }
                  </p>
                  <p className="text-xs text-amber-500 mt-1">Qualité impression 300 DPI</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
