import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Loader2, Download, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EbookAICoverStudioProps {
  ebookTitle?: string;
  authorName?: string;
  onCoverGenerated?: (url: string) => void;
}

const styles = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'minimalist', label: 'Minimaliste' },
  { value: 'artistic', label: 'Artistique' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'thriller', label: 'Thriller/Sombre' },
  { value: 'romance', label: 'Romance' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Moderne/Géométrique' },
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

export const EbookAICoverStudio: React.FC<EbookAICoverStudioProps> = ({
  ebookTitle = '',
  authorName = '',
  onCoverGenerated,
}) => {
  const [title, setTitle] = useState(ebookTitle);
  const [author, setAuthor] = useState(authorName);
  const [style, setStyle] = useState('professional');
  const [genre, setGenre] = useState('non-fiction');
  const [colorScheme, setColorScheme] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<{ url: string; desc: string }[]>([]);

  const generateCover = async () => {
    if (!title.trim()) { toast.error('Titre requis'); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
        body: { title, author, genre, style, colorScheme, description }
      });
      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Aucune image générée');
      
      setGeneratedCovers(prev => [{ url: data.imageUrl, desc: data.description || '' }, ...prev]);
      onCoverGenerated?.(data.imageUrl);
      toast.success('Couverture générée avec succès !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCover = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `couverture-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
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
            Générateur de Couverture IA
            <Badge className="bg-primary/10 text-primary border-primary/30">IMAGEN 3</Badge>
          </CardTitle>
          <CardDescription>
            Créez des couvertures KDP photoréalistes avec l'IA de dernière génération
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
                  {genres.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Style visuel</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {styles.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Palette de couleurs (optionnel)</Label>
              <Input value={colorScheme} onChange={(e) => setColorScheme(e.target.value)} placeholder="Ex: bleu nuit et or..." />
            </div>
            <div className="space-y-2">
              <Label>Description additionnelle (optionnel)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez des éléments spécifiques..." className="min-h-[80px]" />
            </div>
            <Button className="w-full" onClick={generateCover} disabled={isGenerating || !title.trim()}>
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Génération en cours...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Générer la couverture</>
              )}
            </Button>
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
                <p className="text-sm">Configurez les paramètres et cliquez sur Générer</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedCovers.map((cover, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted/20">
                    <img src={cover.url} alt={`Couverture ${i + 1}`} className="w-full aspect-[2/3] object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex gap-2 w-full">
                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => downloadCover(cover.url)}>
                          <Download className="h-3 w-3 mr-1" /> Télécharger
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => { onCoverGenerated?.(cover.url); toast.success('Couverture sélectionnée'); }}>
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
