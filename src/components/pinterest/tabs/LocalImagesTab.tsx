
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, ImageOff } from 'lucide-react';
import { PinterestPin } from '@/types/pinterest';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-center space-y-4">
          <h3 className="font-medium">Importer une image depuis votre ordinateur</h3>
          <p className="text-sm text-gray-500">
            Formats acceptés: JPG, PNG, GIF. Taille maximum: 5MB
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Sélectionner une image
          </Button>
        </div>
      </Card>
      
      {pin.uploadedImage ? (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image téléchargée:</h3>
          <div className="relative group border rounded-md overflow-hidden h-[200px]">
            <img 
              src={pin.uploadedImage} 
              alt="Image téléchargée"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => updatePin('uploadedImage', null)}
              >
                Supprimer l'image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 border rounded-md">
          <ImageOff className="h-16 w-16 mb-2 opacity-20" />
          <p>Aucune image téléchargée</p>
          <p className="text-sm">Cliquez sur "Sélectionner une image" ci-dessus</p>
        </div>
      )}
    </div>
  );
};

export default LocalImagesTab;
