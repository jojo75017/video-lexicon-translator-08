
import React, { useState } from 'react';
import { PinterestImage } from '@/types/pinterest';
import { Globe, Map, ExternalLink, ImageOff, Info, AlertTriangle } from 'lucide-react';
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
    
    if (image.country) {
      return lowerTitle.includes(image.country.toLowerCase());
    }
    
    if (image.category === 'france' && image.region) {
      return lowerTitle.includes(image.region.toLowerCase());
    }
    
    return true;
  };

  // Utiliser une image de secours fiable en cas d'erreur
  const getBackupImageUrl = (category: 'monde' | 'europe' | 'france') => {
    const backupImages = {
      'monde': 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop',
      'europe': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
      'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
    };
    
    return backupImages[category] || backupImages['monde'];
  };
  
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[700px] w-full p-2">
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
                  <img 
                    src={getBackupImageUrl(image.category)}
                    alt={image.title || 'Image de remplacement'}
                    className="w-full h-44 object-cover"
                  />
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
                                <AlertTriangle className="h-3 w-3" />
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
                            image.source === 'freepik' ? 'destructive' :
                            image.source === 'pexels' ? 'outline' : 'outline'
                          } 
                          className="text-xs"
                        >
                          {image.source === 'pixabay' ? 'Pixabay' : 
                           image.source === 'unsplash' ? 'Unsplash' :
                           image.source === 'freepik' ? 'Freepik' :
                           image.source === 'pexels' ? 'Pexels' : 'Local'}
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
