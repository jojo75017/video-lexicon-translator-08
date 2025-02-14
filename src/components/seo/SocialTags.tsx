
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Twitter, Globe, AlertCircle, ImageIcon, Hash, Smile, Meh, Frown } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SocialTagsProps {
  socialTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
  };
}

const SocialTags = ({ socialTags }: SocialTagsProps) => {
  const validateImageDimensions = async (imageUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValidFacebook = img.width >= 1200 && img.height >= 630;
        const isValidTwitter = img.width >= 1200 && img.height >= 600;
        resolve(isValidFacebook && isValidTwitter);
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };

  const getMissingSocialTags = () => {
    const missing = [];
    if (!socialTags.ogTitle) missing.push('og:title');
    if (!socialTags.ogDescription) missing.push('og:description');
    if (!socialTags.ogImage) missing.push('og:image');
    if (!socialTags.twitterCard) missing.push('twitter:card');
    if (!socialTags.twitterTitle) missing.push('twitter:title');
    if (!socialTags.twitterDescription) missing.push('twitter:description');
    return missing;
  };

  const getSocialSuggestions = () => {
    const suggestions = [];
    
    if (socialTags.ogTitle && socialTags.ogTitle.length > 60) {
      suggestions.push("Le titre Open Graph dépasse 60 caractères, ce qui pourrait être tronqué sur Facebook");
    }
    if (socialTags.twitterTitle && socialTags.twitterTitle.length > 70) {
      suggestions.push("Le titre Twitter dépasse 70 caractères, ce qui pourrait être tronqué");
    }

    return suggestions;
  };

  const getSentimentScore = (text: string | null): { score: number; sentiment: 'positive' | 'neutral' | 'negative' } => {
    if (!text) return { score: 0, sentiment: 'neutral' };
    
    const positiveWords = ['excellent', 'incroyable', 'meilleur', 'super', 'génial', 'extraordinaire', 'fantastique', 'gratuit', 'nouveau', 'exclusif', 'offre', 'promotion', 'réduction', 'succès', 'innovation', 'leader', 'expert', 'premium', 'qualité', 'performant'];
    const negativeWords = ['mauvais', 'problème', 'erreur', 'difficile', 'compliqué', 'cher', 'pire', 'échec', 'défaut', 'bug', 'panne', 'risque', 'danger', 'confusion', 'lent'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
      score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  };

  const getHashtagSuggestions = (text: string | null): string[] => {
    if (!text) return [];
    
    const commonWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'en', 'dans', 'par', 'pour', 'sur'];
    const words = text.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .map(word => word.replace(/[^a-zà-ÿ]/g, ''));
    
    const uniqueWords = Array.from(new Set(words));
    return uniqueWords
      .slice(0, 5)
      .map(word => `#${word}`);
  };

  const getPopularHashtags = (): string[] => {
    // Hashtags populaires par catégorie
    const marketingHashtags = ['#marketing', '#digital', '#socialmedia', '#strategie', '#marque'];
    const techHashtags = ['#tech', '#innovation', '#digital', '#startup', '#technologie'];
    const businessHashtags = ['#business', '#entrepreneur', '#success', '#leadership', '#innovation'];
    const ecommerceHashtags = ['#ecommerce', '#shopping', '#vente', '#promotion', '#offre'];
    
    // Sélection aléatoire de 3 hashtags de chaque catégorie
    const allHashtags = [...marketingHashtags, ...techHashtags, ...businessHashtags, ...ecommerceHashtags];
    return allHashtags
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  };

  const titleSentiment = getSentimentScore(socialTags.ogTitle);
  const descriptionSentiment = getSentimentScore(socialTags.ogDescription);
  const generatedHashtags = [
    ...getHashtagSuggestions(socialTags.ogTitle),
    ...getHashtagSuggestions(socialTags.ogDescription)
  ].slice(0, 8);
  const popularHashtags = getPopularHashtags();

  return (
    <Card className="p-6 space-y-6">
      {/* Analyse du sentiment */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Analyse du sentiment</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h5 className="text-sm font-medium mb-2">Titre</h5>
            <div className="flex items-center gap-2">
              {titleSentiment.sentiment === 'positive' && <Smile className="h-5 w-5 text-green-500" />}
              {titleSentiment.sentiment === 'neutral' && <Meh className="h-5 w-5 text-yellow-500" />}
              {titleSentiment.sentiment === 'negative' && <Frown className="h-5 w-5 text-red-500" />}
              <Badge 
                variant="outline" 
                className={`
                  ${titleSentiment.sentiment === 'positive' ? 'bg-green-50 text-green-700' : ''}
                  ${titleSentiment.sentiment === 'neutral' ? 'bg-yellow-50 text-yellow-700' : ''}
                  ${titleSentiment.sentiment === 'negative' ? 'bg-red-50 text-red-700' : ''}
                `}
              >
                {titleSentiment.sentiment === 'positive' ? 'Positif' : titleSentiment.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
              </Badge>
            </div>
          </Card>

          <Card className="p-4">
            <h5 className="text-sm font-medium mb-2">Description</h5>
            <div className="flex items-center gap-2">
              {descriptionSentiment.sentiment === 'positive' && <Smile className="h-5 w-5 text-green-500" />}
              {descriptionSentiment.sentiment === 'neutral' && <Meh className="h-5 w-5 text-yellow-500" />}
              {descriptionSentiment.sentiment === 'negative' && <Frown className="h-5 w-5 text-red-500" />}
              <Badge 
                variant="outline"
                className={`
                  ${descriptionSentiment.sentiment === 'positive' ? 'bg-green-50 text-green-700' : ''}
                  ${descriptionSentiment.sentiment === 'neutral' ? 'bg-yellow-50 text-yellow-700' : ''}
                  ${descriptionSentiment.sentiment === 'negative' ? 'bg-red-50 text-red-700' : ''}
                `}
              >
                {descriptionSentiment.sentiment === 'positive' ? 'Positif' : descriptionSentiment.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
              </Badge>
            </div>
          </Card>
        </div>

        {(titleSentiment.sentiment === 'neutral' || descriptionSentiment.sentiment === 'neutral') && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Essayez d'utiliser un langage plus positif pour augmenter l'engagement
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Hashtags générés */}
      <div>
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Hashtags suggérés
        </h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium mb-2">Basés sur votre contenu :</h5>
            <div className="flex flex-wrap gap-2">
              {generatedHashtags.length > 0 ? (
                generatedHashtags.map((hashtag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                  >
                    {hashtag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">
                  Aucun hashtag suggéré. Ajoutez plus de contenu descriptif.
                </span>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium mb-2">Hashtags populaires :</h5>
            <div className="flex flex-wrap gap-2">
              {popularHashtags.map((hashtag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                >
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Alert className="mt-4 bg-purple-50">
          <AlertDescription className="space-y-2">
            <p>Conseils d'utilisation :</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Utilisez 3-5 hashtags pertinents par publication</li>
              <li>Placez les hashtags en fin de publication</li>
              <li>Alternez entre hashtags populaires et spécifiques</li>
              <li>Évitez les hashtags trop génériques</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default SocialTags;
