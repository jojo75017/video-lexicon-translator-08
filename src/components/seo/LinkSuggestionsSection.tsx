
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkSuggestion } from '@/types/seo/InternalLinks';
import { Link2, ArrowRight, Target, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface LinkSuggestionsSectionProps {
  suggestions: LinkSuggestion[];
  siteUrl?: string;
}

const LinkSuggestionsSection: React.FC<LinkSuggestionsSectionProps> = ({
  suggestions = [],
  siteUrl = ""
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  const generateLinkHtml = (suggestion: LinkSuggestion) => {
    return `<a href="${suggestion.targetUrl}" title="${suggestion.targetTitle}">${suggestion.anchorText}</a>`;
  };

  const getTruncatedUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      if (path.length <= maxLength - urlObj.hostname.length) {
        return urlObj.hostname + path;
      }
      return urlObj.hostname + path.substring(0, maxLength - urlObj.hostname.length - 3) + "...";
    } catch {
      return url.substring(0, maxLength - 3) + "...";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlacementIcon = (placement: string) => {
    switch (placement) {
      case 'content': return <Target className="h-3 w-3" />;
      case 'sidebar': return <ExternalLink className="h-3 w-3" />;
      default: return <Link2 className="h-3 w-3" />;
    }
  };

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-600" />
            Suggestions de liens internes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune suggestion de lien disponible pour le moment.</p>
            <p className="text-sm mt-2">Analysez un site pour obtenir des recommandations de liens internes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Link2 className="h-5 w-5 text-blue-600" />
          Suggestions de liens internes ({suggestions.length})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Liens recommandés pour améliorer votre maillage interne et le référencement
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority === 'high' ? 'Priorité haute' : 
                       suggestion.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getPlacementIcon(suggestion.placement)}
                      {suggestion.placement === 'content' ? 'Dans le contenu' :
                       suggestion.placement === 'sidebar' ? 'Dans la sidebar' :
                       suggestion.placement === 'header' ? 'Dans l\'en-tête' : 'Dans le pied de page'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-gray-600">De:</span>
                    <span className="font-medium truncate max-w-xs" title={suggestion.sourceTitle}>
                      {suggestion.sourceTitle}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Vers:</span>
                    <span className="font-medium truncate max-w-xs" title={suggestion.targetTitle}>
                      {suggestion.targetTitle}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Texte d'ancrage:</span>{" "}
                    <span className="italic text-blue-600">"{suggestion.anchorText}"</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{suggestion.reason}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Pertinence: {Math.round(suggestion.contextualRelevance)}%</span>
                    <span>Valeur SEO: {Math.round(suggestion.seoValue)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-500">
                    <strong>URL source:</strong> {getTruncatedUrl(suggestion.sourceUrl)}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>URL cible:</strong> {getTruncatedUrl(suggestion.targetUrl)}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateLinkHtml(suggestion))}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copier le HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(suggestion.anchorText)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copier le texte
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {suggestions.length > 5 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Conseil:</strong> Commencez par implémenter les suggestions de priorité haute. 
              Intégrez les liens naturellement dans votre contenu existant pour un meilleur impact SEO.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkSuggestionsSection;
