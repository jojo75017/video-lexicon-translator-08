
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UploadCloud, FolderOpen, Camera, Trash2 } from 'lucide-react';
import { PinterestPin } from '@/types/pinterest';
import { toast } from 'sonner';

interface LocalImagesTabProps {
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LocalImagesTab: React.FC<LocalImagesTabProps> = ({ 
  pin, 
  updatePin,
  handleImageUpload 
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    
    // Process each selected file
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image valide`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Save the image in state
          setUploadedImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    toast.success(`${files.length} image(s) chargée(s) depuis l'ordinateur`);
  };
  
  const handleSelectLocalImage = (imageUrl: string) => {
    updatePin('uploadedImage', imageUrl);
    updatePin('image', null);
    toast.success('Image locale sélectionnée');
  };
  
  const handleRemoveLocalImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    
    // If the removed image was selected, clear the selection
    if (pin.uploadedImage === uploadedImages[index]) {
      updatePin('uploadedImage', null);
    }
    
    toast.info('Image supprimée');
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="local-image-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md">
            <FolderOpen className="h-4 w-4" />
            <span>Charger depuis l'ordinateur</span>
          </div>
          <Input
            id="local-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleLocalImageUpload}
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
      </div>
      
      {uploadedImages.length > 0 ? (
        <ScrollArea className="h-[300px] w-full p-2 border rounded-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {uploadedImages.map((imageUrl, index) => (
              <div 
                key={`local-image-${index}`}
                className={`relative rounded-md overflow-hidden cursor-pointer transition-all 
                  hover:opacity-90 group border ${pin.uploadedImage === imageUrl ? 'ring-2 ring-primary' : ''}`}
              >
                <img 
                  src={imageUrl} 
                  alt={`Image locale ${index + 1}`}
                  className="w-full h-32 object-cover"
                  onClick={() => handleSelectLocalImage(imageUrl)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all p-2 flex flex-col justify-between">
                  <div className="flex items-end justify-end">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleRemoveLocalImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-[300px] border rounded-md flex flex-col items-center justify-center text-gray-500 p-4">
          <UploadCloud className="h-10 w-10 mb-2" />
          <p>Aucune image chargée depuis votre ordinateur</p>
          <p className="text-xs mt-2">Cliquez sur "Charger depuis l'ordinateur" pour ajouter des images</p>
        </div>
      )}
      
      {pin.uploadedImage && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image sélectionnée :</h3>
          <div className="relative group border rounded-md overflow-hidden h-[200px]">
            <img 
              src={pin.uploadedImage} 
              alt="Image sélectionnée"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => updatePin('uploadedImage', null)}
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

export default LocalImagesTab;
