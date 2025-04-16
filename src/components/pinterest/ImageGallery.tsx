
import React, { useState } from 'react';
import { PinterestImage } from '@/types/pinterest';
import { Globe, Map, ExternalLink, ImageOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ImageGalleryProps {
  images: PinterestImage[];
  onSelectImage: (image: PinterestImage) => void;
  selectedImage: PinterestImage | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onSelectImage, selectedImage }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  const handleImageError = (imageUrl: string) => {
    console.error("Erreur de chargement d'image:", imageUrl);
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(imageUrl);
      return newSet;
    });
  };
  
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[520px] w-full p-2">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div 
                key={`${image.id || `image-${index}`}-${index}`}
                className={`relative rounded-md overflow-hidden cursor-pointer transition-all 
                  hover:opacity-90 group border ${selectedImage?.id === image.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onSelectImage(image)}
              >
                {!failedImages.has(image.url) ? (
                  <img 
                    src={image.url} 
                    alt={image.title || 'Image sans titre'}
                    className="w-full h-40 object-cover"
                    onError={() => handleImageError(image.url)}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex flex-col items-center justify-center">
                    <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Image non disponible</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-white bg-opacity-75 text-xs">
                      {image.category === 'monde' ? (
                        <Globe className="h-3 w-3 mr-1" />
                      ) : image.category === 'france' ? (
                        <Map className="h-3 w-3 mr-1" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {image.country || image.region || image.category}
                    </Badge>
                    
                    {image.source && (
                      <Badge 
                        variant={
                          image.source === 'pixabay' ? 'default' : 
                          image.source === 'unsplash' ? 'secondary' :
                          image.source === 'freepik' ? 'destructive' : 'outline'
                        } 
                        className="text-xs ml-1"
                      >
                        {image.source === 'pixabay' ? 'Pixabay' : 
                         image.source === 'unsplash' ? 'Unsplash' :
                         image.source === 'freepik' ? 'Freepik' : 'Local'}
                      </Badge>
                    )}
                  </div>
                  <div className="invisible group-hover:visible">
                    <p className="text-xs text-white bg-black bg-opacity-60 p-1 rounded">
                      {image.title || 'Sans titre'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-500">
            Aucune image correspondant à votre recherche
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ImageGallery;
