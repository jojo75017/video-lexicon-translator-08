
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Badge } from '@/components/ui/badge';

interface PinterestPreviewProps {
  pin: PinterestPin;
}

const PinterestPreview: React.FC<PinterestPreviewProps> = ({ pin }) => {
  // Obtenir la source de l'image
  const getImageSource = () => {
    if (pin.uploadedImage) return pin.uploadedImage;
    if (pin.image?.url) return pin.image.url;
    return '/placeholder.svg';
  };

  return (
    <div className="w-[300px] bg-white rounded-lg overflow-hidden shadow-md mx-auto">
      <div className="relative">
        <div className="aspect-[2/3] bg-gray-200">
          <img 
            src={getImageSource()} 
            alt={pin.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* Overlay avec le design sélectionné */}
        {pin.design.overlayStyle !== 'none' && (
          <div 
            className={`absolute inset-0 ${
              pin.design.overlayStyle === 'gradient' 
                ? `bg-gradient-to-b from-transparent via-transparent to-${pin.design.primaryColor}/70` 
                : pin.design.overlayStyle === 'solid' 
                ? `bg-${pin.design.primaryColor}/30` 
                : ''
            }`}
          />
        )}
        
        {/* Frame style */}
        {pin.design.overlayStyle === 'frame' && (
          <div className={`absolute inset-0 border-8 border-${pin.design.primaryColor}`} />
        )}
      </div>
      
      <div className="p-4">
        <h2 
          className={`text-lg font-bold mb-2 font-${pin.design.titleFont} text-${pin.design.textColor}`}
        >
          {pin.title}
        </h2>
        
        <p 
          className={`text-sm mb-3 font-${pin.design.descriptionFont} text-${pin.design.textColor}`}
        >
          {pin.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {pin.hashtags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-xs bg-${pin.design.secondaryColor}/20 text-${pin.design.accentColor} border-${pin.design.secondaryColor}`}
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        <button 
          className={`w-full py-2 px-4 rounded-full bg-${pin.design.primaryColor} text-white font-medium text-sm`}
        >
          {pin.callToAction}
        </button>
      </div>
    </div>
  );
};

export default PinterestPreview;
