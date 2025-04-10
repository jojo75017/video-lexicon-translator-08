
import React from 'react';
import { PinterestPin } from '@/types/pinterest';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PinterestPreviewProps {
  pin: PinterestPin;
}

const PinterestPreview: React.FC<PinterestPreviewProps> = ({ pin }) => {
  const getOverlayStyle = () => {
    const { overlayStyle, primaryColor, secondaryColor } = pin.design;
    
    if (overlayStyle === 'none') return {};
    
    if (overlayStyle === 'gradient') {
      return {
        background: `linear-gradient(to bottom, transparent 50%, ${primaryColor}cc 100%)`
      };
    }
    
    if (overlayStyle === 'solid') {
      return {
        background: `${primaryColor}66`
      };
    }
    
    if (overlayStyle === 'frame') {
      return {
        boxShadow: `inset 0 0 0 10px ${secondaryColor}cc`
      };
    }
    
    return {};
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-lg"
      style={{ 
        width: '300px',
        height: '450px',
        backgroundColor: pin.design.primaryColor,
      }}
    >
      {/* Image principale */}
      <div className="absolute inset-0">
        {pin.image ? (
          <img 
            src={pin.image.url} 
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        ) : pin.uploadedImage ? (
          <img 
            src={pin.uploadedImage} 
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-400">Aucune image sélectionnée</p>
          </div>
        )}
        
        {/* Overlay sur l'image */}
        <div 
          className="absolute inset-0"
          style={getOverlayStyle()}
        ></div>
      </div>
      
      {/* Contenu textuel */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <div 
          className="flex flex-col space-y-2"
          style={{ 
            textShadow: pin.design.overlayStyle === 'none' ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          <h2 
            className="text-lg font-bold leading-tight"
            style={{ 
              color: pin.design.textColor,
              fontFamily: pin.design.titleFont || 'sans-serif'
            }}
          >
            {pin.title}
          </h2>
          
          <p 
            className="text-xs line-clamp-3"
            style={{ 
              color: pin.design.textColor,
              fontFamily: pin.design.descriptionFont || 'sans-serif'
            }}
          >
            {pin.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {pin.hashtags.slice(0, 5).map(tag => (
              <span 
                key={tag} 
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: `${pin.design.accentColor}cc`,
                  color: pin.design.textColor
                }}
              >
                #{tag}
              </span>
            ))}
            {pin.hashtags.length > 5 && (
              <span 
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ 
                  backgroundColor: `${pin.design.accentColor}cc`,
                  color: pin.design.textColor
                }}
              >
                +{pin.hashtags.length - 5}
              </span>
            )}
          </div>
          
          <button 
            className="mt-2 text-sm font-semibold rounded-full px-4 py-1.5 text-center"
            style={{ 
              backgroundColor: pin.design.accentColor,
              color: pin.design.primaryColor
            }}
          >
            {pin.callToAction}
          </button>
        </div>
      </div>
      
      {/* Interface Pinterest simulée */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
        <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-md">
          <Heart className="h-4 w-4 text-gray-600" />
        </div>
        <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-md">
          <MessageCircle className="h-4 w-4 text-gray-600" />
        </div>
        <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-md">
          <Share2 className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      {/* Badge Pinterest */}
      <div className="absolute top-3 left-3 z-20">
        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-white shadow-md">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#E60023">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.217-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PinterestPreview;
