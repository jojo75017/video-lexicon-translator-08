
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { Loader2, Search, Upload, Image as ImageIcon, FolderOpen } from 'lucide-react';
import LocalImagesTab from './LocalImagesTab';

interface ImagesTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedImageCategory: 'monde' | 'europe' | 'france' | 'all';
  setSelectedImageCategory: (category: 'monde' | 'europe' | 'france' | 'all') => void;
  imageSource: 'pixabay' | 'unsplash' | 'freepik' | 'pexels';
  setImageSource: (source: 'pixabay' | 'unsplash' | 'freepik' | 'pexels') => void;
  images: PinterestImage[];
  loading: boolean;
  handleSearch: () => void;
  handleSelectImage: (image: PinterestImage) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({
  pin,
  updatePin,
  searchQuery,
  setSearchQuery,
  selectedImageCategory,
  setSelectedImageCategory,
  imageSource,
  setImageSource,
  images,
  loading,
  handleSearch,
  handleSelectImage,
  handleImageUpload
}) => {
  const [activeImageTab, setActiveImageTab] = useState<string>('stock');
  
  // Helper function to get the image URL (handles both src and url properties)
  const getImageUrl = (image: PinterestImage): string => {
    return image.src || image.url || '';
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="stock" value={activeImageTab} onValueChange={setActiveImageTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="stock">Images Stock</TabsTrigger>
          <TabsTrigger value="local">Mes Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher des images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedImageCategory} onValueChange={(value: any) => setSelectedImageCategory(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="monde">Monde</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={imageSource} onValueChange={(value: any) => setImageSource(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsplash">Unsplash</SelectItem>
                  <SelectItem value="pixabay">Pixabay</SelectItem>
                  <SelectItem value="pexels">Pexels</SelectItem>
                  <SelectItem value="freepik">Freepik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {images.length > 0 ? (
            <ScrollArea className="h-[400px] w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative rounded-md overflow-hidden cursor-pointer transition-all 
                      hover:opacity-90 border ${pin.image === image ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                      {image.title}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
              <ImageIcon className="h-16 w-16 mb-2 opacity-20" />
              <p>Aucune image trouvée</p>
              <p className="text-sm">Essayez une autre recherche ou catégorie</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="local">
          <LocalImagesTab
            pin={pin}
            updatePin={updatePin}
            handleImageUpload={handleImageUpload}
          />
        </TabsContent>
      </Tabs>
      
      {pin.image && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image sélectionnée :</h3>
          <div className="relative group border rounded-md overflow-hidden h-[200px]">
            <img 
              src={getImageUrl(pin.image)} 
              alt={pin.image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => updatePin('image', null)}
              >
                Supprimer la sélection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesTab;
