import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

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
  const handleCategoryChange = (category: 'monde' | 'europe' | 'france' | 'all') => {
    setSelectedImageCategory(category);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Rechercher une image</Label>
          <div className="flex gap-2">
            <Input
              type="search"
              id="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>
        </div>

        <div>
          <Label>Catégorie</Label>
          <RadioGroup defaultValue={selectedImageCategory} className="flex flex-col space-y-1.5" onValueChange={handleCategoryChange}>
            <RadioGroupItem value="all" id="category-all" className="peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="category-all" className="cursor-pointer peer-data-[state=checked]:text-primary">
              Toutes les images
            </Label>

            <RadioGroupItem value="monde" id="category-monde" className="peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="category-monde" className="cursor-pointer peer-data-[state=checked]:text-primary">
              Monde
            </Label>

            <RadioGroupItem value="europe" id="category-europe" className="peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="category-europe" className="cursor-pointer peer-data-[state=checked]:text-primary">
              Europe
            </Label>

            <RadioGroupItem value="france" id="category-france" className="peer h-5 w-5 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <Label htmlFor="category-france" className="cursor-pointer peer-data-[state=checked]:text-primary">
              France
            </Label>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Label>Source de l'image</Label>
        <Select value={imageSource} onValueChange={setImageSource}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unsplash">Unsplash</SelectItem>
            <SelectItem value="pixabay">Pixabay</SelectItem>
            <SelectItem value="freepik">Freepik</SelectItem>
            <SelectItem value="pexels">Pexels</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" />
            Téléverser une image
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Téléverser une image</DialogTitle>
            <DialogDescription>
              Téléversez votre propre image pour personnaliser votre Pin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Image
              </Label>
              <Input type="file" id="picture" className="col-span-3" onChange={handleImageUpload} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => handleSelectImage(image)}
              onError={(e) => {
                e.currentTarget.src = image.fallbackUrl || '/placeholder.svg';
                toast.error(`Erreur de chargement de l'image: ${image.title}`);
              }}
            />
            {pin.image?.id === image.id && (
              <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-md"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesTab;
