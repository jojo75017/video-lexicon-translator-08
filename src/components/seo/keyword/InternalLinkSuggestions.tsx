
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, Target, ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface InternalLinkSuggestionsProps {
  keywords: KeywordSuggestion[];
}

interface LinkSuggestion {
  sourceKeyword: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  relevanceScore: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  placement: 'header' | 'content' | 'sidebar' | 'footer';
}

const InternalLinkSuggestions: React.FC<InternalLinkSuggestionsProps> = ({ keywords }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const generateSuggestions = async () => {
    if (!siteUrl.trim()) {
      toast.error("Veuillez entrer l'URL de votre site");
      return;
    }

    if (keywords.length === 0) {
      toast.error("Aucun mot-clé disponible pour générer des suggestions");
      return;
    }

    setIsGenerating(true);

    // Simulation de génération de suggestions de liens internes
    setTimeout(() => {
      const mockSuggestions: LinkSuggestion[] = keywords.slice(0, 8).map((keyword, index) => {
        const priorities: LinkSuggestion['priority'][] = ['high', 'medium', 'low'];
        const placements: LinkSuggestion['placement'][] = ['content', 'sidebar', 'header', 'footer'];
        
        const priority = priorities[index % priorities.length];
        const placement = placements[index % placements.length];
        const relevanceScore = Math.floor(Math.random() * 30) + 70;

        return {
          sourceKeyword: keyword.keyword,
          targetUrl: `${siteUrl}/${keyword.keyword.toLowerCase().replace(/\s+/g, '-')}`,
          targetTitle: `Guide complet sur ${keyword.keyword}`,
          anchorText: keyword.keyword,
          relevanceScore,
          priority,
          reason: getReasonForSuggestion(keyword, priority),
          placement
        };
      });

      setSuggestions(mockSuggestions);
      setIsGenerating(false);
      toast.success(`${mockSuggestions.length} suggestions de liens générées`);
    }, 2000);
  };

  const getReasonForSuggestion = (keyword: KeywordSuggestion, priority: string): string => {
    const reasons = {
      high: [
        "Forte pertinence sémantique avec le contenu existant",
        "Opportunité d'améliorer le PageRank interne",
        "Mot-clé à fort potentiel de conversion"
      ],
      medium: [
        "Complément thématique intéressant",
        "Amélioration de l'expérience utilisateur",
        "Renforcement de la structure de contenu"
      ],
      low: [
        "Lien contextuel opportun",
        "Amélioration marginale du maillage",
        "Diversification des ancres de liens"
      ]
    };

    const priorityReasons = reasons[priority as keyof typeof reasons];
    return priorityReasons[Math.floor(Math.random() * priorityReasons.length)];
  };

  const getPriorityColor = (priority: LinkSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlacementIcon = (placement: LinkSuggestion['placement']) => {
    switch (placement) {
      case 'content': return <Target className="h-4 w-4" />;
      case 'sidebar': return <ExternalLink className="h-4 w-4" />;
      case 'header': return <Star className="h-4 w-4" />;
      case 'footer': return <Link className="h-4 w-4" />;
    }
  };

  const filteredSuggestions = selectedPriority === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.priority === selectedPriority);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-blue-500" />
          Suggestions de liens internes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">URL de votre site web</label>
          <Input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://votre-site.com"
            className="w-full"
          />
        </div>

        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'high', label: 'Haute priorité' },
            { key: 'medium', label: 'Moyenne' },
            { key: 'low', label: 'Basse' }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedPriority === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority(filter.key as any)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <Button 
          onClick={generateSuggestions}
          disabled={isGenerating || keywords.length === 0}
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>Génération en cours...</>
          ) : (
            <>
              <Link className="h-4 w-4" />
              Générer les suggestions
            </>
          )}
        </Button>

        {filteredSuggestions.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {filteredSuggestions.length} suggestion{filteredSuggestions.length > 1 ? 's' : ''} trouvée{filteredSuggestions.length > 1 ? 's' : ''}
            </div>
            
            {filteredSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getPlacementIcon(suggestion.placement)}
                    <h4 className="font-medium">{suggestion.targetTitle}</h4>
                  </div>
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Mot-clé source :</span>
                    <span className="font-medium ml-1">{suggestion.sourceKeyword}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Texte d'ancrage :</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs ml-1">
                      {suggestion.anchorText}
                    </code>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">URL cible :</span>
                    <span className="text-blue-600 ml-1 break-all">{suggestion.targetUrl}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Score de pertinence :</span>
                    <span className="font-medium ml-1">{suggestion.relevanceScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Emplacement :</span>
                    <span className="font-medium ml-1 capitalize">{suggestion.placement}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  <strong>Raison :</strong> {suggestion.reason}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Copier le lien
                  </Button>
                  <Button size="sm">
                    Implémenter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InternalLinkSuggestions;
