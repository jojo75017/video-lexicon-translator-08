
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Settings, Key, Loader2 } from "lucide-react";

interface KeywordSearchFormProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  isGenerating: boolean;
  isConfigured: boolean;
  onGenerate: () => void;
  onShowConfig: () => void;
}

const KeywordSearchForm: React.FC<KeywordSearchFormProps> = ({
  keyword,
  setKeyword,
  isGenerating,
  isConfigured,
  onGenerate,
  onShowConfig
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Générateur de Mots-Clés IA Avancé
          {isConfigured && (
            <Badge className="bg-green-100 text-green-800">
              ✓ OpenAI connecté
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez votre mot-clé principal..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onGenerate()}
            className="flex-1"
          />
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Générer avec IA
          </Button>
          <Button 
            variant="outline" 
            onClick={onShowConfig}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConfigured && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <Key className="h-4 w-4 inline mr-1" />
              Configurez votre clé OpenAI pour débloquer toutes les fonctionnalités IA
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordSearchForm;
