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
  title = "⚙️ Configuration OpenAI",
  description = "Configurez votre clé API OpenAI pour utiliser l'IA avancée",
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
            <Label htmlFor="openai-api-key">Clé API OpenAI</Label>
            <Badge variant={getStatusVariant()} className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              id="openai-api-key"
              type="password"
              placeholder="sk-..."
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
              "Sans clé API, des données fictives seront utilisées"
            }
          </p>
        </div>

        {showModelSelection && (
          <div className="space-y-2">
            <Label htmlFor="openai-model">Modèle OpenAI</Label>
            <Select value={model} onValueChange={updateModel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Recommandé)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Vision)</SelectItem>
                <SelectItem value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini</SelectItem>
                <SelectItem value="o3-2025-04-16">O3 (Raisonnement)</SelectItem>
                <SelectItem value="o4-mini-2025-04-16">O4 Mini (Rapide)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {!hasValidApiKey() && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Mode démo</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Sans clé API valide, l'application utilisera des données fictives pour la démonstration.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};