import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Download, Wand2, RefreshCw, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookCoverGeneratorProps {
  ebookTitle: string;
  authorName: string;
  onCoverGenerated?: (coverUrl: string) => void;
}

type CoverStyle = 'professional' | 'minimalist' | 'artistic' | 'modern' | 'vintage' | 'fantasy' | 'thriller' | 'romance';
type CoverGenre = 'non-fiction' | 'fiction' | 'business' | 'self-help' | 'fantasy' | 'romance' | 'thriller' | 'sci-fi' | 'children';

const styleDescriptions: Record<CoverStyle, string> = {
  professional: 'Style professionnel et épuré, typographie claire, design corporate',
  minimalist: 'Design minimaliste, espace blanc, typographie simple et élégante',
  artistic: 'Artistique et créatif, illustrations détaillées, couleurs vibrantes',
  modern: 'Moderne et tendance, formes géométriques, gradients colorés',
  vintage: 'Style vintage rétro, textures anciennes, typographie classique',
  fantasy: 'Univers fantastique, éléments magiques, atmosphère mystérieuse',
  thriller: 'Sombre et intense, contrastes forts, ambiance suspense',
  romance: 'Doux et élégant, couleurs chaudes, atmosphère romantique'
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
  { value: 'children', label: '🧸 Jeunesse' }
];

export const EbookCoverGenerator: React.FC<EbookCoverGeneratorProps> = ({
  ebookTitle,
  authorName,
  onCoverGenerated
}) => {
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('professional');
  const [genre, setGenre] = useState<CoverGenre>('non-fiction');
  const [customPrompt, setCustomPrompt] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  const [selectedCover, setSelectedCover] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variation, setVariation] = useState(1);

  const generateCover = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre pour votre ebook');
      return;
    }

    setIsGenerating(true);
    toast.info('Génération de la couverture en cours... (30-60 secondes)');

    try {
      const { data, error } = await supabase.functions.invoke('generate-front-cover', {
        body: {
          ebookTitle,
          authorName: authorName || 'Auteur',
          subtitle,
          genre,
          style: coverStyle,
          customPrompt,
          variation
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

  const downloadCover = () => {
    const coverUrl = generatedCovers[selectedCover];
    if (!coverUrl) return;

    const link = document.createElement('a');
    link.href = coverUrl;
    link.download = `${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_cover_${selectedCover + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Couverture téléchargée !');
  };

  const currentCover = generatedCovers[selectedCover];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-purple-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Palette className="h-5 w-5 text-white" />
          </div>
          Générateur de Couverture IA
          <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
        <CardDescription>
          Créez une couverture professionnelle pour Amazon KDP avec l'intelligence artificielle
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Options de génération */}
          <div className="space-y-4">
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
                <SelectContent>
                  <SelectItem value="professional">📊 Professionnel</SelectItem>
                  <SelectItem value="minimalist">⚪ Minimaliste</SelectItem>
                  <SelectItem value="artistic">🎨 Artistique</SelectItem>
                  <SelectItem value="modern">✨ Moderne</SelectItem>
                  <SelectItem value="vintage">📜 Vintage</SelectItem>
                  <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                  <SelectItem value="thriller">🔪 Thriller</SelectItem>
                  <SelectItem value="romance">💕 Romance</SelectItem>
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

            <div>
              <Label className="text-sm font-medium">Personnalisation avancée (optionnel)</Label>
              <Textarea
                placeholder="Ex: Avec des éléments de nature, couleurs vertes et bleues, ambiance zen, illustration centrale d'une montagne..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

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
                  Générer une couverture
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
                Générer une variante ({generatedCovers.length} générée{generatedCovers.length > 1 ? 's' : ''})
              </Button>
            )}
          </div>

          {/* Prévisualisation */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Prévisualisation</Label>
            
            {currentCover ? (
              <div className="space-y-4">
                <div className="border-2 border-purple-200 rounded-xl overflow-hidden bg-gray-100 shadow-xl">
                  <img 
                    src={currentCover} 
                    alt="Couverture générée"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Miniatures des couvertures générées */}
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
                    onClick={downloadCover}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PNG
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Conseil KDP :</strong> Pour Amazon, utilisez une résolution de 2560x1600 pixels minimum. 
                    Vous pouvez upscaler cette image avec des outils comme Upscayl ou Let's Enhance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-purple-200 rounded-xl h-80 flex flex-col items-center justify-center bg-purple-50/50">
                <ImageIcon className="w-16 h-16 text-purple-300 mb-4" />
                <p className="text-muted-foreground text-center px-4">
                  Votre couverture apparaîtra ici après génération
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: 1024x1536 (ratio livre)
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
