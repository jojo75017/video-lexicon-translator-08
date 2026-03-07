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
      {/* Section Configuration Gemini */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Key className="h-5 w-5" />
            🔑 Configuration Clé API Gemini 3 Flash
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            Votre clé personnelle est <strong>obligatoire</strong> pour utiliser le générateur. Les coûts (~0,20€ - 0,50€ par livre) sont facturés sur votre compte Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info sur Gemini */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Gemini 3 Flash — Plus rapide et moins cher qu'OpenAI !
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">🆓 Offre Gratuite</p>
                    <p className="text-gray-600 dark:text-gray-400">Clé API gratuite sur Google AI Studio, crédits généreux pour démarrer</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-300 dark:border-blue-700">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">⭐ Usage intensif</p>
                    <p className="text-blue-600 dark:text-blue-400">~0,20€ à 0,50€ par ebook complet, facturation directe Google</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <a 
                    href="https://aistudio.google.com/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                  >
                    🔑 Créer ma clé API Gemini
                  </a>
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-3 py-1.5 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800/60 transition-colors"
                  >
                    📊 Google AI Studio
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gemini-api-key" className="font-medium">Clé API Gemini</Label>
              <Badge variant={getStatusVariant()} className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input
                id="gemini-api-key"
                type="password"
                placeholder="AIza..."
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
            {isValid === true ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-lg p-3 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎉</span>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    <p className="font-semibold mb-1">Clé validée ! Tout est automatique maintenant :</p>
                    <ul className="space-y-0.5 text-green-600 dark:text-green-400">
                      <li>✓ Vos générations utilisent Gemini 3 Flash</li>
                      <li>✓ La facturation va directement sur votre compte Google</li>
                      <li>✓ Aucune autre configuration nécessaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {configApiKey ? 
                  "✓ Votre clé est stockée localement dans votre navigateur (sécurisée)" : 
                  "⚠️ Obtenez votre clé gratuite sur aistudio.google.com/apikey"
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gemini-model">Modèle Gemini</Label>
            <Select value={model} onValueChange={updateModel}>
              <SelectTrigger id="gemini-model">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Recommandé)</SelectItem>
                <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (Premium)</SelectItem>
                <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Économique)</SelectItem>
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
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline font-medium hover:text-amber-900"
                >
                  Créer une clé API Gemini →
                </a>
              </p>
            </div>
          )}

          {hasValidApiKey() && (
            <div className="bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Clé API Gemini configurée et validée</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Vous pouvez maintenant utiliser le générateur de livre complet (14 étapes).
              </p>
            </div>
          )}

          {/* Guide pas-à-pas */}
          <div className="border-t pt-4 mt-4">
            <details className="group">
              <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
                <span className="text-lg">📖</span>
                Guide pas-à-pas : Créer et configurer votre clé API Gemini
                <span className="ml-auto text-xs text-blue-500 group-open:hidden">▼ Voir le guide</span>
                <span className="ml-auto text-xs text-blue-500 hidden group-open:inline">▲ Masquer</span>
              </summary>
              
              <div className="mt-4 space-y-4 text-sm">
                {/* Étape 1 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Accéder à Google AI Studio</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Rendez-vous sur{' '}
                        <a 
                          href="https://aistudio.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700"
                        >
                          aistudio.google.com
                        </a>
                        {' '}et connectez-vous avec votre compte Google (Gmail).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Créer une clé API</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Cliquez sur{' '}
                        <a 
                          href="https://aistudio.google.com/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700"
                        >
                          « Get API Key »
                        </a>
                        {' '}puis sur <strong>« Create API Key »</strong>. C'est 100% gratuit !
                      </p>
                    </div>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Copier la clé</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Copiez la clé générée (commence par <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">AIza...</code>).
                      </p>
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded p-2 text-xs text-amber-700 dark:text-amber-300">
                        ⚠️ <strong>Important :</strong> Vous pouvez retrouver cette clé à tout moment sur aistudio.google.com/apikey
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étape 4 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Coller votre clé ci-dessus</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Collez votre clé (commence par <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">AIza...</code>) dans le champ ci-dessus et cliquez sur <strong>"Valider"</strong>.
                      </p>
                      <div className="bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded p-2 text-xs text-green-700 dark:text-green-300">
                        ✅ <strong>C'est tout !</strong> Votre clé est stockée localement et sécurisée. Vous pouvez maintenant générer vos livres.
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ rapide */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <span>❓</span> Questions fréquentes
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">Combien ça coûte par livre ?</p>
                      <p className="text-blue-600 dark:text-blue-400">Entre 0,20€ et 0,50€ selon la longueur du livre. Beaucoup moins cher qu'OpenAI !</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">Ma clé est-elle sécurisée ?</p>
                      <p className="text-blue-600 dark:text-blue-400">Oui, elle est stockée uniquement dans votre navigateur (localStorage), jamais sur nos serveurs.</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300">La clé Gemini est-elle gratuite ?</p>
                      <p className="text-blue-600 dark:text-blue-400">Oui ! Google offre des crédits gratuits généreux. Pour un usage intensif, les coûts restent très faibles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
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
