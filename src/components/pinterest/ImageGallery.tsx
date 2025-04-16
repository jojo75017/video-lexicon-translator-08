
import React, { useState } from 'react';
import { PinterestImage } from '@/types/pinterest';
import { Globe, Map, ExternalLink, ImageOff, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  // Vérifier si le titre est cohérent avec la catégorie/pays
  const checkTitleConsistency = (image: PinterestImage): boolean => {
    if (!image.title || !image.category) return true;
    
    const lowerTitle = image.title.toLowerCase();
    
    if (image.category === 'france' && image.region) {
      return lowerTitle.includes(image.region.toLowerCase());
    }
    
    if (image.country) {
      return lowerTitle.includes(image.country.toLowerCase());
    }
    
    return true;
  };
  
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[600px] w-full p-2">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
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
                    className="w-full h-44 object-cover"
                    onError={() => handleImageError(image.url)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex flex-col items-center justify-center">
                    <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Image non disponible</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {image.category === 'monde' ? 'Pays du monde' : 
                             image.category === 'europe' ? 'Pays d\'Europe' : 
                             image.category === 'france' ? 'Régions de France' : 'Catégorie'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="flex space-x-1">
                      {!checkTitleConsistency(image) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="destructive" className="text-xs">
                                <Info className="h-3 w-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Le titre peut ne pas correspondre à l'image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {image.source && (
                        <Badge 
                          variant={
                            image.source === 'pixabay' ? 'default' : 
                            image.source === 'unsplash' ? 'secondary' :
                            image.source === 'freepik' ? 'destructive' : 'outline'
                          } 
                          className="text-xs"
                        >
                          {image.source === 'pixabay' ? 'Pixabay' : 
                           image.source === 'unsplash' ? 'Unsplash' :
                           image.source === 'freepik' ? 'Freepik' : 'Local'}
                        </Badge>
                      )}
                    </div>
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
