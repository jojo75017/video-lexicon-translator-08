
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UploadCloud, Search, Camera, ExternalLink, AlertCircle } from 'lucide-react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import ImageGallery from '../ImageGallery';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  console.log("Images dans ImagesTab:", images);
  console.log("Image sélectionnée dans ImagesTab:", pin.image);
  
  const hasImageErrors = images.some(img => !img.url || !img.url.startsWith('http'));

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md">
            <UploadCloud className="h-4 w-4" />
            <span>Charger une image</span>
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </Label>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" type="button">
                <Camera className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Format optimal: 1000x1500 pixels (ratio 2:3)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" asChild>
            <a href="https://free.theresanaiforthat.com/@taaft/image-generator/?ref=header" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Générateur de Prompts AI
            </a>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <a href="https://www.pexels.com/fr-fr/" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Photos Pexels
            </a>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <a href="https://fr.freepik.com/photos-gratuite" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Photos Freepik Gratuites
            </a>
          </Button>
        </div>
      </div>
      
      {hasImageErrors && (
        <Alert variant="destructive" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problème d'affichage</AlertTitle>
          <AlertDescription>
            Certaines images peuvent ne pas s'afficher correctement. Essayez de changer de source d'images ou de catégorie.
          </AlertDescription>
        </Alert>
      )}
      
      {pin.uploadedImage && (
        <div className="relative group border rounded-md overflow-hidden h-[200px]">
          <img 
            src={pin.uploadedImage} 
            alt="Image chargée"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                updatePin('uploadedImage', null);
                toast.success("Image supprimée");
              }}
            >
              Supprimer
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={selectedImageCategory} 
            onValueChange={(val: 'monde' | 'europe' | 'france' | 'all') => setSelectedImageCategory(val)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les images</SelectItem>
              <SelectItem value="monde">Pays du monde</SelectItem>
              <SelectItem value="europe">Pays d'Europe</SelectItem>
              <SelectItem value="france">Régions de France</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={imageSource} 
            onValueChange={(val: 'pixabay' | 'unsplash' | 'freepik' | 'pexels') => setImageSource(val)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pixabay">Pixabay</SelectItem>
              <SelectItem value="unsplash">Unsplash</SelectItem>
              <SelectItem value="freepik">Freepik</SelectItem>
              <SelectItem value="pexels">Pexels</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une image..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="secondary" 
              className="ml-2"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Rechercher'}
            </Button>
          </div>
        </div>
        
        <ImageGallery 
          images={images} 
          onSelectImage={(image) => {
            console.log("Image sélectionnée:", image);
            handleSelectImage(image);
          }}
          selectedImage={pin.image}
        />
      </div>
    </div>
  );
};

export default ImagesTab;
