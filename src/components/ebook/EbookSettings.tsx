import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

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
  // Utiliser le hook centralisé pour la gestion de la clé API
  const {
    apiKey: configApiKey,
    model,
    isValidating,
    isValid,
    updateApiKey,
    updateModel,
    validateApiKey,
    hasValidApiKey
  } = useOpenAIConfig();

  const getStatusIcon = () => {
    if (isValidating) return <AlertCircle className="h-4 w-4 text-yellow-500 animate-spin" />;
    if (isValid === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isValid === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Key className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isValidating) return "Validation...";
    if (isValid === true) return "Clé valide ✓";
    if (isValid === false) return "Clé invalide";
    return "Non validée";
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (isValidating) return "secondary";
    if (isValid === true) return "default";
    if (isValid === false) return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Section Configuration OpenAI - EN PREMIER */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Key className="h-5 w-5" />
            🔑 Configuration Clé API OpenAI
          </CardTitle>
          <CardDescription className="text-orange-600 dark:text-orange-400">
            Votre clé personnelle est <strong>obligatoire</strong> pour utiliser le générateur. Les coûts (~0.50€ - 2€ par livre) sont facturés sur votre compte OpenAI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info sur les offres OpenAI */}
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Offre gratuite ou payante ? À vous de choisir !
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">🆓 Offre Gratuite (Tier 1)</p>
                    <p className="text-gray-600 dark:text-gray-400">Crédits limités, modèles standards, parfait pour tester</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-amber-300 dark:border-amber-700">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">⭐ Offre Payante (Tier 2+)</p>
                    <p className="text-amber-600 dark:text-amber-400">Meilleurs modèles, réponses plus riches, résultats supérieurs</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                  >
                    🔑 Créer ma clé API
                  </a>
                  <a 
                    href="https://platform.openai.com/settings/organization/billing/overview" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors"
                  >
                    📊 Voir mon tier actuel
                  </a>
                  <a 
                    href="https://platform.openai.com/settings/organization/billing/overview" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/60 transition-colors"
                  >
                    💳 Ajouter du crédit
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-api-key" className="font-medium">Clé API OpenAI</Label>
              <Badge variant={getStatusVariant()} className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-proj-..."
                value={configApiKey}
                onChange={(e) => updateApiKey(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button
                type="button"
                onClick={() => validateApiKey()}
                disabled={!configApiKey || isValidating}
                size="sm"
                variant="outline"
                className="shrink-0"
              >
                {isValidating ? 'Validation...' : 'Valider'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {configApiKey ? 
                "✓ Votre clé est stockée localement dans votre navigateur (sécurisée)" : 
                "⚠️ Obtenez votre clé sur platform.openai.com/api-keys"
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openai-model">Modèle OpenAI</Label>
            <Select value={model} onValueChange={updateModel}>
              <SelectTrigger id="openai-model">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Recommandé)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Vision)</SelectItem>
                <SelectItem value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini (Économique)</SelectItem>
                <SelectItem value="o3-2025-04-16">O3 (Raisonnement avancé)</SelectItem>
                <SelectItem value="o4-mini-2025-04-16">O4 Mini (Rapide)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!hasValidApiKey() && (
            <div className="bg-amber-100 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Clé API requise</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Sans clé API valide, le générateur de livre complet ne fonctionnera pas. 
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline font-medium hover:text-amber-900"
                >
                  Créer une clé API →
                </a>
              </p>
            </div>
          )}

          {hasValidApiKey() && (
            <div className="bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Clé API configurée et validée</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Vous pouvez maintenant utiliser le générateur de livre complet (14 étapes).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Paramètres de génération */}
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
              type="button"
              onClick={onAnalyzeImportedText}
              disabled={!importText || !hasValidApiKey() || isGenerating}
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
    </div>
  );
};