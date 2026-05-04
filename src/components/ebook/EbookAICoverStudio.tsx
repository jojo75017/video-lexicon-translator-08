import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Palette, Loader2, Download, Sparkles, Image as ImageIcon, Smartphone, BookOpen, Upload, X, Type,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookAICoverStudioProps {
  ebookTitle?: string;
  authorName?: string;
  initialDescription?: string;
  onCoverGenerated?: (url: string) => void;
}

const styles = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'minimalist', label: 'Minimaliste' },
  { value: 'photo', label: 'Photo réaliste' },
  { value: 'illustrated', label: 'Illustré' },
  { value: 'typographic', label: 'Typographique fort' },
  { value: 'dark', label: 'Sombre / Premium' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'romance', label: 'Romance' },
  { value: 'vintage', label: 'Vintage' },
];

const genres = [
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'business', label: 'Business' },
  { value: 'self-help', label: 'Développement Personnel' },
  { value: 'fantasy', label: 'Fantasy/SF' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'children', label: 'Jeunesse' },
  { value: 'cooking', label: 'Cuisine' },
];

type CoverFormat = 'kindle' | 'paperback';

interface GeneratedCover {
  url: string;
  desc: string;
  format: CoverFormat;
}

export const EbookAICoverStudio: React.FC<EbookAICoverStudioProps> = ({
  ebookTitle = '',
  authorName = '',
  initialDescription = '',
  onCoverGenerated,
}) => {
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(authorName);
  const [format, setFormat] = useState<CoverFormat>('kindle');
  const [style, setStyle] = useState('professional');
  const [genre, setGenre] = useState('non-fiction');
  const [colorScheme, setColorScheme] = useState('');
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<GeneratedCover[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialDescription.trim()) setDescription(initialDescription);
  }, [initialDescription]);

  const handleReferenceUpload = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image de référence trop lourde (max 4 Mo)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setReferenceImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generateCover = async () => {
    if (!title.trim()) {
      toast.error('Titre requis');
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
        body: {
          title,
          author,
          genre,
          style,
          colorScheme,
          description,
          format,
          kdpBrief: initialDescription, // brief from KDP calculator if any
          referenceImage,
        },
      });
      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Aucune image générée');

      setGeneratedCovers((prev) => [
        { url: data.imageUrl, desc: data.description || '', format },
        ...prev,
      ]);
      onCoverGenerated?.(data.imageUrl);
      toast.success(
        format === 'kindle'
          ? 'Couverture Kindle générée !'
          : 'Couverture Broché complète générée !'
      );
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCover = (cover: GeneratedCover, index: number) => {
    const link = document.createElement('a');
    link.href = cover.url;
    link.download = `couverture-${cover.format}-${index + 1}-${title.replace(/\s+/g, '-').toLowerCase() || 'livre'}.png`;
    link.click();
    toast.success('Téléchargement lancé');
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            Studio Couverture IA
            <Badge className="bg-primary/10 text-primary border-primary/30">PRO Bestseller</Badge>
          </CardTitle>
          <CardDescription>
            Générez la couverture <strong>Kindle</strong> ou <strong>Broché complet</strong> (face + dos + 4ème) avec qualité best-seller Amazon.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format toggle */}
            <div className="space-y-2">
              <Label>Format de couverture</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('kindle')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === 'kindle'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Kindle eBook</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Face seule, ratio 1.6:1</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('paperback')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    format === 'paperback'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Broché complet</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Face + dos + 4ème</p>
                </button>
              </div>
              {format === 'paperback' && !initialDescription && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1">
                  <Type className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Astuce : passez par <strong>Format & Tranche KDP</strong> pour calculer le dos avant de générer.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Titre du livre</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mon livre..." />
            </div>
            <div className="space-y-2">
              <Label>Nom d'auteur</Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Jean Dupont" />
            </div>
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {genres.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Style visuel</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {styles.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Palette de couleurs (optionnel)</Label>
              <Input value={colorScheme} onChange={(e) => setColorScheme(e.target.value)} placeholder="Ex: bleu nuit et or..." />
            </div>
            <div className="space-y-2">
              <Label>Description / concept (optionnel)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez l'ambiance, les éléments visuels souhaités..." className="min-h-[70px]" />
            </div>

            {/* Reference image */}
            <div className="space-y-2">
              <Label>Couverture d'inspiration (optionnel)</Label>
              {referenceImage ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted/20">
                  <img src={referenceImage} alt="Référence" className="w-full h-32 object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setReferenceImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Importer une couverture inspirante</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleReferenceUpload(f);
                  e.target.value = '';
                }}
              />
            </div>

            <Button className="w-full" onClick={generateCover} disabled={isGenerating || !title.trim()}>
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération en cours...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Générer la couverture</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Modèle Pro Bestseller (Gemini 3 Pro Image) — quelques secondes par génération
            </p>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Couvertures générées ({generatedCovers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCovers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Palette className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg">Aucune couverture générée</p>
                <p className="text-sm">Choisissez le format Kindle ou Broché et lancez une génération</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedCovers.map((cover, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted/20">
                    <Badge className="absolute top-2 left-2 z-10 bg-background/90 text-foreground border">
                      {cover.format === 'kindle' ? '📱 Kindle' : '📖 Broché complet'}
                    </Badge>
                    <img
                      src={cover.url}
                      alt={`Couverture ${i + 1}`}
                      className={`w-full object-contain bg-muted ${
                        cover.format === 'kindle' ? 'aspect-[1/1.6]' : 'aspect-[1.6/1]'
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex gap-2 w-full">
                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => downloadCover(cover, i)}>
                          <Download className="h-3 w-3 mr-1" /> Télécharger
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            onCoverGenerated?.(cover.url);
                            toast.success('Couverture sélectionnée');
                          }}
                        >
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookAICoverStudio;
