
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Badge } from '@/components/ui/badge';

interface PinterestPreviewProps {
  pin: PinterestPin;
}

const PinterestPreview: React.FC<PinterestPreviewProps> = ({ pin }) => {
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
        
        {pin.design.overlayStyle !== 'none' && (
          <div 
            className={`absolute inset-0 ${
              pin.design.overlayStyle === 'gradient' 
                ? 'bg-gradient-to-b from-transparent via-transparent to-black/50' 
                : pin.design.overlayStyle === 'solid' 
                ? 'bg-black/30' 
                : ''
            }`}
            style={{
              background: pin.design.overlayStyle === 'gradient' 
                ? `linear-gradient(to bottom, transparent, transparent, ${pin.design.primaryColor}70)` 
                : pin.design.overlayStyle === 'solid' 
                ? `${pin.design.primaryColor}30` 
                : 'transparent'
            }}
          />
        )}
        
        {pin.design.overlayStyle === 'frame' && (
          <div className="absolute inset-0 border-8 border-solid" style={{ borderColor: pin.design.primaryColor }} />
        )}
        
        {/* Call to action button - Now using design.accentColor for button background */}
        <div className="absolute bottom-6 right-4 left-4">
          <button 
            className="w-full py-3 px-6 rounded-full text-base font-semibold shadow-lg"
            style={{
              backgroundColor: pin.design.accentColor || pin.design.primaryColor, // Use accent color as button background
              color: pin.design.textColor
            }}
          >
            {pin.callToAction}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h2 
          className="text-lg font-bold mb-2"
          style={{
            fontFamily: pin.design.titleFont,
            color: pin.design.textColor
          }}
        >
          {pin.title}
        </h2>
        
        <p 
          className="text-sm mb-3"
          style={{
            fontFamily: pin.design.descriptionFont,
            color: pin.design.textColor
          }}
        >
          {pin.description}
        </p>
        
        {(pin.showHashtags === undefined || pin.showHashtags) && pin.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pin.hashtags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                style={{
                  backgroundColor: `${pin.design.secondaryColor}20`,
                  color: pin.design.accentColor,
                  borderColor: pin.design.secondaryColor
                }}
                className="text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinterestPreview;
