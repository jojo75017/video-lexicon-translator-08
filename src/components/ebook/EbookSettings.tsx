import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface EbookSettingsProps {
  apiKey: string;
  onUpdateApiKey: (newApiKey: string) => void;
  numberOfChapters: number;
  onUpdateNumberOfChapters: (number: number) => void;
  importText: string;
  onUpdateImportText: (text: string) => void;
  onAnalyzeImportedText: () => void;
  isGenerating: boolean;
  writingStyle: string;
  onUpdateWritingStyle: (style: string) => void;
  chapterLength: string;
  onUpdateChapterLength: (length: string) => void;
  detailLevel: string;
  onUpdateDetailLevel: (level: string) => void;
  tone: string;
  onUpdateTone: (tone: string) => void;
  narrativeFormat: string;
  onUpdateNarrativeFormat: (format: string) => void;
}

export const EbookSettings: React.FC<EbookSettingsProps> = ({
  apiKey,
  onUpdateApiKey,
  numberOfChapters,
  onUpdateNumberOfChapters,
  importText,
  onUpdateImportText,
  onAnalyzeImportedText,
  isGenerating,
  writingStyle,
  onUpdateWritingStyle,
  chapterLength,
  onUpdateChapterLength,
  detailLevel,
  onUpdateDetailLevel,
  tone,
  onUpdateTone,
  narrativeFormat,
  onUpdateNarrativeFormat
}) => {
  return (
    <Card className="border-2" style={{ borderColor: 'hsl(var(--gray-cool))' }}>
      <CardHeader style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue) / 0.1) 0%, hsl(var(--royal-purple) / 0.05) 100%)' }}>
        <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--cobalt-blue))' }}>
          <Settings className="h-5 w-5" />
          ⚙️ Paramètres avancés de génération
        </CardTitle>
        <CardDescription style={{ color: 'hsl(var(--cobalt-blue) / 0.8)' }}>
          Personnalisez le style et le format de votre ebook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="writing-style">📝 Style d'écriture</Label>
            <Select value={writingStyle} onValueChange={onUpdateWritingStyle}>
              <SelectTrigger id="writing-style">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narratif">Narratif</SelectItem>
                <SelectItem value="descriptif">Descriptif</SelectItem>
                <SelectItem value="dialogues">Riche en dialogues</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chapter-length">📏 Longueur des chapitres</Label>
            <Select value={chapterLength} onValueChange={onUpdateChapterLength}>
              <SelectTrigger id="chapter-length">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="court">Court (500-1000 mots)</SelectItem>
                <SelectItem value="moyen">Moyen (1000-2000 mots)</SelectItem>
                <SelectItem value="long">Long (2000-3000 mots)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="detail-level">🎯 Niveau de détail</Label>
            <Select value={detailLevel} onValueChange={onUpdateDetailLevel}>
              <SelectTrigger id="detail-level">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basique">Basique</SelectItem>
                <SelectItem value="détaillé">Détaillé</SelectItem>
                <SelectItem value="très détaillé">Très détaillé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tone">🎨 Ton général</Label>
            <Select value={tone} onValueChange={onUpdateTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sérieux">Sérieux</SelectItem>
                <SelectItem value="léger">Léger</SelectItem>
                <SelectItem value="humoristique">Humoristique</SelectItem>
                <SelectItem value="inspirant">Inspirant</SelectItem>
                <SelectItem value="professionnel">Professionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="narrative-format">📚 Format de narration</Label>
            <Select value={narrativeFormat} onValueChange={onUpdateNarrativeFormat}>
              <SelectTrigger id="narrative-format">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="première personne">Première personne (je)</SelectItem>
                <SelectItem value="troisième personne">Troisième personne (il/elle)</SelectItem>
                <SelectItem value="deuxième personne">Deuxième personne (tu/vous)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-4">
          <Label htmlFor="import">📄 Import et analyse de texte</Label>
          <Textarea
            id="import"
            placeholder="Collez ici un texte existant pour analyser sa structure et générer automatiquement des chapitres..."
            value={importText}
            onChange={(e) => onUpdateImportText(e.target.value)}
            rows={6}
            className="mt-2"
          />
          <Button 
            onClick={onAnalyzeImportedText}
            disabled={!importText || !apiKey || isGenerating}
            className="mt-2 w-full"
          >
            {isGenerating ? 'Analyse en cours...' : '🔍 Analyser et créer la structure'}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            L'IA analysera votre texte et proposera une structure de chapitres optimisée
          </p>
        </div>
      </CardContent>
    </Card>
  );
};