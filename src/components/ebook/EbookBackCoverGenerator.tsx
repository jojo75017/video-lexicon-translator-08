import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, Download, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '@/hooks/useSubscriptionGeneration';
import { supabase } from '@/integrations/supabase/client';

interface EbookBackCoverGeneratorProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  isGenerating: boolean;
  onGenerate: (tone: string, audience: string, highlights: string) => Promise<string | null>;
}

export const EbookBackCoverGenerator: React.FC<EbookBackCoverGeneratorProps> = ({
  ebookTitle,
  authorName,
  chapters,
  isGenerating,
  onGenerate
}) => {
  const [tone, setTone] = useState<string>('professionnel');
  const [audience, setAudience] = useState<string>('grand-public');
  const [highlights, setHighlights] = useState<string>('');
  const [generatedVersions, setGeneratedVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [shortVersion, setShortVersion] = useState<string>('');
  const [authorBio, setAuthorBio] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverStyle, setCoverStyle] = useState<string>('moderne');

  const handleGenerate = async () => {
    console.log('[BackCover] handleGenerate called', { ebookTitle, authorName, chaptersLength: chapters.length });
    
    if (!ebookTitle || !authorName || chapters.length === 0) {
      console.log('[BackCover] Missing data:', { ebookTitle, authorName, chaptersLength: chapters.length });
      toast.error('Veuillez remplir le titre, l\'auteur et ajouter des chapitres');
      return;
    }

    console.log('[BackCover] Starting generation with:', { tone, audience, highlights });
    const versions: string[] = [];
    
    for (let i = 0; i < 3; i++) {
      console.log(`[BackCover] Generating version ${i + 1}/3`);
      const result = await onGenerate(tone, audience, highlights);
      console.log(`[BackCover] Version ${i + 1} result:`, result ? 'Success' : 'Failed');
      if (result) {
        versions.push(result);
      }
    }

    console.log('[BackCover] Total versions generated:', versions.length);
    if (versions.length > 0) {
      setGeneratedVersions(versions);
      setSelectedVersion(0);
      
      // Générer version courte et bio
      const short = versions[0].substring(0, 500) + '...';
      setShortVersion(short);
      setAuthorBio(`${authorName} est l'auteur de "${ebookTitle}". Expert dans son domaine, il partage son expertise à travers cet ouvrage.`);
      
      toast.success(`${versions.length} versions générées !`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier !');
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Téléchargement en cours...');
  };

  const handleGenerateCover = async () => {
    if (!ebookTitle || !authorName) {
      toast.error('Veuillez remplir le titre et l\'auteur');
      return;
    }

    setIsGeneratingCover(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-image', {
        body: {
          ebookTitle,
          authorName,
          style: coverStyle,
          genre: 'non-fiction'
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setCoverImage(data.imageUrl);
        toast.success('Couverture générée !');
      }
    } catch (error) {
      console.error('Error generating cover:', error);
      toast.error('Erreur lors de la génération de la couverture');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const selectedText = selectedVersion !== null ? generatedVersions[selectedVersion] : '';
  const charCount = selectedText.length;

  return (
    <div className="space-y-6">
      {/* Génération de couverture */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            Générateur de Couverture IA
          </CardTitle>
          <CardDescription>
            Créez une image de couverture professionnelle avec l'IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverStyle">Style de couverture</Label>
              <Select value={coverStyle} onValueChange={setCoverStyle}>
                <SelectTrigger id="coverStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderne">Moderne</SelectItem>
                  <SelectItem value="minimaliste">Minimaliste</SelectItem>
                  <SelectItem value="elegant">Élégant</SelectItem>
                  <SelectItem value="dynamique">Dynamique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateCover}
                disabled={isGeneratingCover || !ebookTitle || !authorName}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isGeneratingCover ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer Couverture
                  </>
                )}
              </Button>
            </div>
          </div>

          {coverImage && (
            <div className="mt-4 space-y-2">
              <Label>Aperçu de la couverture</Label>
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={coverImage}
                  alt="Couverture générée"
                  className="w-full rounded-lg shadow-lg border-2 border-purple-200"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Générateur de 4ème de Couverture IA
          </CardTitle>
          <CardDescription>
            Créez une description professionnelle optimisée pour Amazon KDP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Ton de la description</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                  <SelectItem value="inspirant">Inspirant</SelectItem>
                  <SelectItem value="academique">Académique</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Public cible</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="grand-public">Grand Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlights">Points forts à mettre en avant (optionnel)</Label>
            <Textarea
              id="highlights"
              placeholder="Ex: Méthodes innovantes, cas pratiques, exercices..."
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !ebookTitle || !authorName || chapters.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer 3 Versions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Versions générées */}
      {generatedVersions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Versions Générées</CardTitle>
            <CardDescription>
              Sélectionnez la version qui vous convient le mieux
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {generatedVersions.map((_, index) => (
                <Button
                  key={index}
                  variant={selectedVersion === index ? "default" : "outline"}
                  onClick={() => setSelectedVersion(index)}
                  size="sm"
                >
                  Version {index + 1}
                </Button>
              ))}
            </div>

            {selectedVersion !== null && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description complète (KDP)</Label>
                    <span className={`text-sm ${charCount > 2000 ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {charCount} / 2000 caractères
                    </span>
                  </div>
                  <Textarea
                    value={selectedText}
                    onChange={(e) => {
                      const newVersions = [...generatedVersions];
                      newVersions[selectedVersion] = e.target.value;
                      setGeneratedVersions(newVersions);
                    }}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedText)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadAsText(selectedText, `4eme-couverture-${ebookTitle}.txt`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Version courte (500 caractères)</Label>
                  <Textarea
                    value={shortVersion}
                    onChange={(e) => setShortVersion(e.target.value)}
                    rows={4}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(shortVersion)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Bio de l'auteur (150 caractères)</Label>
                  <Textarea
                    value={authorBio}
                    onChange={(e) => setAuthorBio(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(authorBio)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conseils KDP */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Conseils Amazon KDP</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• La description doit faire <strong>maximum 2000 caractères</strong></p>
          <p>• Utilisez un <strong>hook accrocheur</strong> dans les 2 premières phrases</p>
          <p>• Mettez en avant les <strong>bénéfices</strong> pour le lecteur, pas les fonctionnalités</p>
          <p>• Incluez un <strong>appel à l'action</strong> clair en fin de description</p>
          <p>• Utilisez des <strong>mots-clés pertinents</strong> naturellement dans le texte</p>
          <p>• La version courte est idéale pour les <strong>réseaux sociaux</strong></p>
        </CardContent>
      </Card>
    </div>
  );
};