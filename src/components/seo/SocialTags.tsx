import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Twitter, Globe, AlertCircle, ImageIcon } from 'lucide-react';
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
    ogUrl: string | null;
    ogType: string | null;
    ogSiteName: string | null;
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
    
    // Vérification des longueurs de titre
    if (socialTags.ogTitle && socialTags.ogTitle.length > 60) {
      suggestions.push("Le titre Open Graph dépasse 60 caractères, ce qui pourrait être tronqué sur Facebook");
    }
    if (socialTags.twitterTitle && socialTags.twitterTitle.length > 70) {
      suggestions.push("Le titre Twitter dépasse 70 caractères, ce qui pourrait être tronqué");
    }

    // Vérification de la présence d'URL canonique
    if (!socialTags.ogUrl) {
      suggestions.push("L'URL canonique (og:url) est manquante");
    }

    // Vérification du type de contenu
    if (!socialTags.ogType) {
      suggestions.push("Le type de contenu (og:type) n'est pas spécifié");
    }

    // Vérification du site name
    if (!socialTags.ogSiteName) {
      suggestions.push("Le nom du site (og:site_name) n'est pas spécifié");
    }

    // Analyse des mots-clés dans les titres/descriptions
    if (socialTags.ogTitle) {
      const keywordsInTitle = socialTags.ogTitle.toLowerCase().split(' ');
      if (keywordsInTitle.length < 3) {
        suggestions.push("Le titre pourrait inclure plus de mots-clés pertinents");
      }
      if (keywordsInTitle.some(word => word.length > 15)) {
        suggestions.push("Évitez les mots trop longs dans le titre pour une meilleure lisibilité");
      }
    }

    // Recommandations pour l'engagement
    if (socialTags.ogDescription) {
      if (!socialTags.ogDescription.includes('?') && !socialTags.ogDescription.includes('!')) {
        suggestions.push("Ajoutez une question ou une exclamation dans la description pour augmenter l'engagement");
      }
      if (socialTags.ogDescription.length < 100) {
        suggestions.push("Une description plus longue pourrait augmenter l'engagement");
      }
    }

    return suggestions;
  };

  const missingTags = getMissingSocialTags();
  const suggestions = getSocialSuggestions();

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-blue-500" />
        Balises Sociales
      </h3>

      {missingTags.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Balises manquantes : {missingTags.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Open Graph
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              {socialTags.ogTitle && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">og:title</Badge>
                  <span className="text-sm">{socialTags.ogTitle}</span>
                </div>
              )}
              {socialTags.ogDescription && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">og:description</Badge>
                  <span className="text-sm">{socialTags.ogDescription}</span>
                </div>
              )}
              {socialTags.ogImage && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">og:image</Badge>
                  <span className="text-sm">{socialTags.ogImage}</span>
                </div>
              )}
            </div>

            {/* Prévisualisation Facebook */}
            {(socialTags.ogTitle || socialTags.ogDescription || socialTags.ogImage) && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b">
                  <h5 className="text-sm font-semibold mb-1">Prévisualisation Facebook</h5>
                </div>
                <div className="p-3">
                  {socialTags.ogImage ? (
                    <div className="aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                      <img 
                        src={socialTags.ogImage} 
                        alt="Open Graph preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/1200x630';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 mb-2 rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <h6 className="font-medium text-[13px] text-blue-900 mb-1">
                    {socialTags.ogTitle || 'Titre non défini'}
                  </h6>
                  <p className="text-xs text-gray-600">
                    {socialTags.ogDescription || 'Description non définie'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter Cards
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              {socialTags.twitterCard && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">twitter:card</Badge>
                  <span className="text-sm">{socialTags.twitterCard}</span>
                </div>
              )}
              {socialTags.twitterTitle && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">twitter:title</Badge>
                  <span className="text-sm">{socialTags.twitterTitle}</span>
                </div>
              )}
              {socialTags.twitterDescription && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">twitter:description</Badge>
                  <span className="text-sm">{socialTags.twitterDescription}</span>
                </div>
              )}
            </div>

            {/* Prévisualisation Twitter */}
            {(socialTags.twitterTitle || socialTags.twitterDescription || socialTags.twitterImage) && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b">
                  <h5 className="text-sm font-semibold mb-1">Prévisualisation Twitter</h5>
                </div>
                <div className="p-3">
                  {socialTags.twitterImage ? (
                    <div className="aspect-[2/1] bg-gray-100 mb-2 rounded overflow-hidden">
                      <img 
                        src={socialTags.twitterImage} 
                        alt="Twitter Card preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/1200x600';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[2/1] bg-gray-100 mb-2 rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <h6 className="font-medium text-[13px] text-gray-900 mb-1">
                    {socialTags.twitterTitle || 'Titre non défini'}
                  </h6>
                  <p className="text-xs text-gray-600">
                    {socialTags.twitterDescription || 'Description non définie'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions d'amélioration */}
      <div className="mt-6 space-y-2">
        {socialTags.ogDescription && socialTags.ogDescription.length > 200 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              La description Open Graph est trop longue ({socialTags.ogDescription.length} caractères). Idéalement, elle devrait faire moins de 200 caractères.
            </AlertDescription>
          </Alert>
        )}
        {socialTags.twitterDescription && socialTags.twitterDescription.length > 200 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              La description Twitter est trop longue ({socialTags.twitterDescription.length} caractères). Idéalement, elle devrait faire moins de 200 caractères.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Ajout des suggestions avancées après les prévisualisations */}
      <div className="mt-6 space-y-2">
        {suggestions.map((suggestion, index) => (
          <Alert key={index}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{suggestion}</AlertDescription>
          </Alert>
        ))}

        {socialTags.ogImage && (
          <Alert className="bg-blue-50">
            <AlertDescription className="space-y-2">
              <p className="font-medium">Dimensions recommandées pour les images :</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Facebook : 1200 x 630 pixels minimum</li>
                <li>Twitter : 1200 x 600 pixels minimum</li>
                <li>LinkedIn : 1200 x 627 pixels recommandé</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Bonnes pratiques par secteur */}
        <Alert className="bg-green-50">
          <AlertDescription className="space-y-2">
            <p className="font-medium">Bonnes pratiques selon votre secteur :</p>
            <div className="space-y-4">
              <div>
                <h6 className="font-medium text-sm">E-commerce</h6>
                <ul className="list-disc pl-4 text-sm">
                  <li>Incluez le prix et la disponibilité dans le titre</li>
                  <li>Mettez en avant les promotions dans la description</li>
                  <li>Utilisez des photos de produits de haute qualité</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-sm">Blog / Contenu</h6>
                <ul className="list-disc pl-4 text-sm">
                  <li>Commencez le titre avec des chiffres ou "Comment"</li>
                  <li>Incluez des citations percutantes dans la description</li>
                  <li>Ajoutez une image avec du texte superposé</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-sm">B2B / Services</h6>
                <ul className="list-disc pl-4 text-sm">
                  <li>Mentionnez des statistiques clés dans le titre</li>
                  <li>Incluez un appel à l'action dans la description</li>
                  <li>Utilisez des images professionnelles et sobres</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Recommandations d'engagement */}
        <Alert className="bg-yellow-50">
          <AlertDescription className="space-y-2">
            <p className="font-medium">Astuces pour augmenter l'engagement :</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Utilisez des verbes d'action dans vos titres</li>
              <li>Posez des questions ouvertes dans la description</li>
              <li>Incluez des émojis stratégiquement placés</li>
              <li>Mentionnez des chiffres ou statistiques impactants</li>
              <li>Créez un sentiment d'urgence ou d'exclusivité</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default SocialTags;
