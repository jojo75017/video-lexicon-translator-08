import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
}

export const EbookSettings: React.FC<EbookSettingsProps> = ({
  apiKey,
  onUpdateApiKey,
  numberOfChapters,
  onUpdateNumberOfChapters,
  importText,
  onUpdateImportText,
  onAnalyzeImportedText,
  isGenerating
}) => {
  return (
    <Card className="border-2" style={{ borderColor: 'hsl(var(--gray-cool))' }}>
      <CardHeader style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue) / 0.1) 0%, hsl(var(--royal-purple) / 0.05) 100%)' }}>
        <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--cobalt-blue))' }}>
          <Settings className="h-5 w-5" />
          ⚙️ Configuration API et Paramètres
        </CardTitle>
        <CardDescription style={{ color: 'hsl(var(--cobalt-blue) / 0.8)' }}>
          Configurez votre clé API OpenAI et les paramètres avancés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="apikey">Clé API OpenAI</Label>
          <Input
            id="apikey"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => onUpdateApiKey(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Chaque abonné doit entrer sa propre clé. Elle reste locale à son navigateur.
          </p>
        </div>
        
        <div>
          <Label htmlFor="chapters">Nombre de chapitres pour la génération automatique</Label>
          <Input
            id="chapters"
            type="number"
            min="3"
            max="20"
            value={numberOfChapters}
            onChange={(e) => onUpdateNumberOfChapters(parseInt(e.target.value) || 8)}
            className="mt-1"
          />
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