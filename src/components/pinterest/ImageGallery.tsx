
import React from 'react';
import { PinterestImage } from '@/types/pinterest';
import { Globe, Map, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ImageGalleryProps {
  images: PinterestImage[];
  onSelectImage: (image: PinterestImage) => void;
  selectedImage: PinterestImage | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onSelectImage, selectedImage }) => {
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[300px] w-full p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.length > 0 ? (
            images.map(image => (
              <div 
                key={image.id}
                className={`relative rounded-md overflow-hidden cursor-pointer transition-all 
                  hover:opacity-90 group border ${selectedImage?.id === image.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onSelectImage(image)}
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-32 object-cover"
                />
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
                      <Badge variant={image.source === 'pixabay' ? 'default' : 'secondary'} className="text-xs ml-1">
                        {image.source === 'pixabay' ? 'Pixabay' : 'Unsplash'}
                      </Badge>
                    )}
                  </div>
                  <div className="invisible group-hover:visible">
                    <p className="text-xs text-white bg-black bg-opacity-50 p-1 rounded">
                      {image.title}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-32 flex items-center justify-center text-gray-500">
              Aucune image correspondant à votre recherche
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImageGallery;
