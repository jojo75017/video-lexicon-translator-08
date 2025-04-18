
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UploadCloud, Search, Camera, ExternalLink, AlertCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { PinterestPin, PinterestImage, FRANCE_LOCATIONS, EUROPE_LOCATIONS, WORLD_LOCATIONS } from '@/types/pinterest';
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
  const [failedImages, setFailedImages] = useState<number>(0);
  const [inconsistentImages, setInconsistentImages] = useState<number>(0);
  const [filteredImages, setFilteredImages] = useState<PinterestImage[]>(images);
  
  // Filter images based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredImages(images);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = images.filter(img => {
      const titleMatch = img.title.toLowerCase().includes(query);
      const countryMatch = img.country && img.country.toLowerCase().includes(query);
      const regionMatch = img.region && img.region.toLowerCase().includes(query);
      
      // Check for French regions
      const isFrenchRegion = FRANCE_LOCATIONS.some(loc => 
        loc.toLowerCase().includes(query)
      );
      
      // Check for European countries
      const isEuropeanCountry = EUROPE_LOCATIONS.some(loc => 
        loc.toLowerCase().includes(query)
      );
      
      // Check for worldwide locations
      const isWorldLocation = WORLD_LOCATIONS.some(loc => 
        loc.toLowerCase().includes(query)
      );
      
      return titleMatch || countryMatch || regionMatch || 
             (img.category === 'france' && isFrenchRegion) ||
             (img.category === 'europe' && isEuropeanCountry) ||
             (img.category === 'monde' && isWorldLocation);
    });
    
    setFilteredImages(filtered);
    
    if (filtered.length === 0) {
      console.log(`No images found for query: ${query}`);
    } else {
      console.log(`Found ${filtered.length} images for query: ${query}`);
    }
  }, [searchQuery, images]);
  
  // Vérifier les problèmes d'images
  useEffect(() => {
    const checkImages = () => {
      let failed = 0;
      let inconsistent = 0;
      
      images.forEach(img => {
        if (!img.url || !img.url.startsWith('http')) {
          failed++;
        }
        
        // Vérifier la cohérence entre titre et catégorie
        if (img.title && img.category) {
          const lowerTitle = img.title.toLowerCase();
          let isConsistent = false;
          
          if (img.country && lowerTitle.includes(img.country.toLowerCase())) {
            isConsistent = true;
          } else if (img.region && lowerTitle.includes(img.region.toLowerCase())) {
            isConsistent = true;
          } else if (img.category === 'france' && 
                    FRANCE_LOCATIONS.some(loc => lowerTitle.includes(loc))) {
            isConsistent = true;
          } else if (img.category === 'europe' && 
                    EUROPE_LOCATIONS.some(loc => lowerTitle.includes(loc))) {
            isConsistent = true;
          } else if (img.category === 'monde' && 
                    WORLD_LOCATIONS.some(loc => lowerTitle.includes(loc))) {
            isConsistent = true;
          }
          
          if (!isConsistent) {
            inconsistent++;
          }
        }
      });
      
      setFailedImages(failed);
      setInconsistentImages(inconsistent);
    };
    
    checkImages();
  }, [images]);
  
  // Images de sources fiables pour recommandations
  const reliableSources = [
    {
      name: 'Unsplash',
      url: 'https://unsplash.com/fr',
      icon: <ExternalLink className="h-4 w-4 mr-2" />
    },
    {
      name: 'Pexels',
      url: 'https://www.pexels.com/fr-fr/',
      icon: <ExternalLink className="h-4 w-4 mr-2" />
    }
  ];

  // Fonction pour corriger automatiquement le titre d'une image sélectionnée
  const fixImageTitle = () => {
    if (!pin.image) return;
    
    const { category, country, region } = pin.image;
    let newTitle = pin.image.title;
    
    if (country) {
      // Ajouter le pays au début du titre s'il n'y est pas déjà
      if (!newTitle.toLowerCase().includes(country.toLowerCase())) {
        newTitle = `${country} - ${newTitle}`;
      }
    } else if (region && category === 'france') {
      // Ajouter la région au début du titre s'il n'y est pas déjà
      if (!newTitle.toLowerCase().includes(region.toLowerCase())) {
        newTitle = `${region} - ${newTitle}`;
      }
    } else {
      // Ajouter une localisation basée sur la catégorie
      if (category === 'france' && !FRANCE_LOCATIONS.some(loc => newTitle.toLowerCase().includes(loc))) {
        newTitle = `France - ${newTitle}`;
      } else if (category === 'europe' && !EUROPE_LOCATIONS.some(loc => newTitle.toLowerCase().includes(loc))) {
        newTitle = `Europe - ${newTitle}`;
      } else if (category === 'monde' && !WORLD_LOCATIONS.some(loc => newTitle.toLowerCase().includes(loc))) {
        newTitle = `Destination internationale - ${newTitle}`;
      }
    }
    
    // Mettre à jour l'image avec le nouveau titre
    if (newTitle !== pin.image.title) {
      const updatedImage = { ...pin.image, title: newTitle, verified: true };
      updatePin('image', updatedImage);
      toast.success("Titre de l'image corrigé pour correspondre à la localisation");
    }
  };

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
          {reliableSources.map((source, index) => (
            <Button key={index} variant="outline" size="sm" asChild>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                {source.icon}
                {source.name}
              </a>
            </Button>
          ))}
        </div>
      </div>
      
      {inconsistentImages > 0 && (
        <Alert className="my-2 border-amber-400 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Incohérences détectées</AlertTitle>
          <AlertDescription className="text-amber-700">
            {inconsistentImages} image(s) ont des titres qui ne correspondent pas à leur localisation (pays/région).
            {pin.image && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fixImageTitle}
                  className="bg-amber-100"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" /> Corriger le titre de l'image sélectionnée
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {failedImages > 0 && (
        <Alert className="my-2 border-yellow-400 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Problèmes d'affichage d'images détectés</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Certaines images ({failedImages}) peuvent ne pas s'afficher correctement. Essayez d'utiliser Unsplash ou Pexels comme source d'images plus fiable.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setImageSource('unsplash')}
                className="mr-2"
              >
                <RefreshCcw className="h-3 w-3 mr-1" /> Utiliser Unsplash
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setImageSource('pexels')}
              >
                <RefreshCcw className="h-3 w-3 mr-1" /> Utiliser Pexels
              </Button>
            </div>
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
              <SelectItem value="unsplash">Unsplash</SelectItem>
              <SelectItem value="pexels">Pexels</SelectItem>
              <SelectItem value="freepik">Freepik</SelectItem>
              <SelectItem value="pixabay">Pixabay</SelectItem>
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
          images={filteredImages.length > 0 ? filteredImages : images} 
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
