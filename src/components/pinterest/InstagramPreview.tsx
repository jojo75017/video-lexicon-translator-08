
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Badge } from '@/components/ui/badge';

interface InstagramPreviewProps {
  pin: PinterestPin;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ pin }) => {
  const getImageSource = () => {
    if (pin.uploadedImage) return pin.uploadedImage;
    if (pin.image?.url) return pin.image.url;
    return '/placeholder.svg';
  };

  return (
    <div className="w-[300px] bg-white shadow-md mx-auto">
      <div className="p-3 flex items-center gap-2 border-b">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full"></div>
        <div className="text-sm font-semibold">votre_compte_instagram</div>
      </div>
      
      <div className="aspect-square bg-gray-200">
        <img 
          src={getImageSource()} 
          alt={pin.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-lg">
          <div className="flex gap-3">
            <span>❤️</span>
            <span>💬</span>
            <span>📤</span>
          </div>
          <span>🔖</span>
        </div>
        
        <p className="text-sm font-medium">132 j'aime</p>
        
        <div>
          <p className="text-sm">
            <span className="font-bold mr-1">votre_compte_instagram</span>
            {pin.description}
          </p>
          
          {pin.showHashtags && pin.hashtags.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {pin.hashtags.map(tag => `#${tag}`).join(' ')}
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">Voir les 23 commentaires</p>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
