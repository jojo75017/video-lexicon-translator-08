import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface OpenAIConfigPanelProps {
  title?: string;
  description?: string;
  showModelSelection?: boolean;
  compact?: boolean;
}

export const OpenAIConfigPanel: React.FC<OpenAIConfigPanelProps> = ({
  title = "🔑 Configuration Gemini 3 Flash",
  description = "Configurez votre clé API Gemini pour utiliser l'IA avancée",
  showModelSelection = true,
  compact = false
}) => {
  const {
    apiKey,
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
    if (isValid === true) return "Clé valide";
    if (isValid === false) return "Clé invalide";
    return "Non validée";
  };

  const getStatusVariant = () => {
    if (isValidating) return "secondary";
    if (isValid === true) return "default";
    if (isValid === false) return "destructive";
    return "outline";
  };

  return (
    <Card className={compact ? "" : ""}>
      <CardHeader className={compact ? "pb-3" : ""}>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="gemini-api-key">Clé API Gemini</Label>
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
              value={apiKey}
              onChange={(e) => updateApiKey(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => validateApiKey()}
              disabled={!apiKey || isValidating}
              size="sm"
              variant="outline"
            >
              Valider
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {apiKey ? 
              "Votre clé API est stockée localement et sécurisée" : 
              "Obtenez votre clé gratuite sur aistudio.google.com/apikey"
            }
          </p>
        </div>

        {showModelSelection && (
          <div className="space-y-2">
            <Label htmlFor="gemini-model">Modèle Gemini</Label>
            <Select value={model} onValueChange={updateModel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Recommandé)</SelectItem>
                <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (Premium)</SelectItem>
                <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Économique)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {!hasValidApiKey() && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Clé API requise</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Sans clé API valide, l'application utilisera des données fictives.{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">
                Créer une clé Gemini →
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
