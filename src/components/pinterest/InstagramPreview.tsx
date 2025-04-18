
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Share, Map, Calendar } from 'lucide-react';

interface InstagramPreviewProps {
  pin: PinterestPin;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ pin }) => {
  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Obtenir la source de l'image
  const getImageSource = () => {
    if (pin.uploadedImage) return pin.uploadedImage;
    if (pin.image?.url) return pin.image.url;
    return 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=600&fit=crop';
  };

  // Générer un nombre aléatoire de likes entre 100 et 999
  const likes = Math.floor(Math.random() * 900) + 100;
  
  // Générer une durée aléatoire (1-24 heures)
  const hours = Math.floor(Math.random() * 24) + 1;
  
  // Extraire la localisation à partir de l'image ou du titre
  const getLocation = () => {
    if (pin.image?.region) return pin.image.region;
    if (pin.image?.country) return pin.image.country;
    
    // Essayer d'extraire une localisation du titre
    const titleWords = pin.title.split(' ');
    for (const word of titleWords) {
      if (word.length > 3 && !['les', 'des', 'une', 'avec', 'pour', 'vous', 'dans', 'votre'].includes(word.toLowerCase())) {
        return word;
      }
    }
    
    return 'Voir la localisation';
  };
  
  // Nom du compte Instagram basé sur les hashtags
  const getAccountName = () => {
    if (pin.hashtags.length > 0) {
      const mainTag = pin.hashtags[0];
      return mainTag.toLowerCase().replace(/[^a-z0-9]/g, '') + '_travel';
    }
    return 'voyage_discover';
  };

  return (
    <div className="w-[320px] border border-gray-300 rounded-md overflow-hidden bg-white shadow-md">
      {/* En-tête du post */}
      <div className="flex items-center p-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img 
                src={getImageSource()} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <span className="font-semibold text-sm">{getAccountName()}</span>
          <div className="flex items-center text-xs text-gray-600">
            <Map className="h-3 w-3 mr-1" />
            <span>{getLocation()}</span>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-800" />
      </div>

      {/* Image du post */}
      <div className="w-full aspect-square bg-gray-100">
        <img 
          src={getImageSource()} 
          alt={pin.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=600&fit=crop';
          }}
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <Heart className="h-6 w-6" />
            <MessageCircle className="h-6 w-6" />
            <Share className="h-6 w-6" />
          </div>
          <Bookmark className="h-6 w-6" />
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm mb-1">{likes} likes</div>

        {/* Légende */}
        <div className="text-sm">
          <span className="font-semibold mr-1">{getAccountName()}</span>
          {truncateText(pin.description, 125)}
        </div>

        {/* Hashtags */}
        <div className="text-sm text-blue-900 mt-1">
          {pin.hashtags.map(tag => `#${tag}`).join(' ')}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Il y a {hours} heure{hours > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
