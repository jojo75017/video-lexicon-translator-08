import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Download, Wand2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface EbookCoverGeneratorProps {
  ebookTitle: string;
  authorName: string;
}

type CoverStyle = 'professional' | 'minimalist' | 'artistic' | 'modern' | 'vintage';

const styleDescriptions: Record<CoverStyle, string> = {
  professional: 'Style professionnel et épuré, typographie claire, design corporate',
  minimalist: 'Design minimaliste, espace blanc, typographie simple et élégante',
  artistic: 'Artistique et créatif, illustrations détaillées, couleurs vibrantes',
  modern: 'Moderne et tendance, formes géométriques, gradients colorés',
  vintage: 'Style vintage rétro, textures anciennes, typographie classique'
};

export const EbookCoverGenerator: React.FC<EbookCoverGeneratorProps> = ({
  ebookTitle,
  authorName
}) => {
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCover, setGeneratedCover] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCover = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre pour votre ebook');
      return;
    }

    toast.info('Génération de couverture disponible via la page de gestion');
  };

  const downloadCover = () => {
    if (!generatedCover) return;

    const link = document.createElement('a');
    link.href = generatedCover;
    link.download = `${ebookTitle.replace(/[^a-z0-9]/gi, '_')}_cover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Couverture téléchargée !');
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-purple-700">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Palette className="h-4 w-4 text-purple-700" />
          </div>
          Générateur de Couverture IA
        </CardTitle>
        <CardDescription>
          Créez une couverture professionnelle avec l'intelligence artificielle
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div>
            <Label>Style de couverture</Label>
            <Select value={coverStyle} onValueChange={(value) => setCoverStyle(value as CoverStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">📊 Professionnel</SelectItem>
                <SelectItem value="minimalist">⚪ Minimaliste</SelectItem>
                <SelectItem value="artistic">🎨 Artistique</SelectItem>
                <SelectItem value="modern">✨ Moderne</SelectItem>
                <SelectItem value="vintage">📜 Vintage</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {styleDescriptions[coverStyle]}
            </p>
          </div>

          <div>
            <Label>Personnalisation (optionnel)</Label>
            <Textarea
              placeholder="Ex: Avec des éléments de nature, couleurs vertes et bleues, ambiance zen..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={generateCover}
            disabled={isGenerating || !ebookTitle}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Générer la couverture
              </>
            )}
          </Button>
        </div>

        {generatedCover && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <img 
                src={generatedCover} 
                alt="Couverture générée"
                className="w-full h-auto"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={downloadCover}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button 
                onClick={generateCover}
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Régénérer
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                💡 <strong>Conseil :</strong> Pour Amazon KDP, utilisez une résolution de 2560x1600 pixels minimum. 
                Vous pouvez upscaler cette image avec des outils en ligne.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
