import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageGalleryProps {
  generatedImages: string[];
  selectedTitle: string;
  selectedDescription: string;
  selectedHashtags: string;
  selectedGeoRegion: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onHashtagsChange: (hashtags: string) => void;
  onGeoRegionChange: (geoRegion: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  generatedImages, 
  selectedTitle, 
  selectedDescription, 
  selectedHashtags,
  selectedGeoRegion,
  onTitleChange, 
  onDescriptionChange, 
  onHashtagsChange,
  onGeoRegionChange
}) => {
  const [copiedStates, setCopiedStates] = useState<boolean[]>(generatedImages.map(() => false));

  const handleCopyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        const newCopiedStates = [...copiedStates];
        newCopiedStates[index] = true;
        setCopiedStates(newCopiedStates);
        toast.success("Copié dans le presse-papier !");

        setTimeout(() => {
          const resetCopiedStates = [...copiedStates];
          resetCopiedStates[index] = false;
          setCopiedStates(resetCopiedStates);
        }, 3000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie: ', err);
        toast.error("Erreur lors de la copie");
      });
  }, [copiedStates]);

  useEffect(() => {
    setCopiedStates(generatedImages.map(() => false));
  }, [generatedImages]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {generatedImages.map((image, index) => (
        <Card key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Image #{index + 1}</CardTitle>
            <CardDescription className="text-sm text-gray-500">Visuel optimisé pour Pinterest</CardDescription>
          </CardHeader>

          <CardContent className="p-4">
            <img src={image} alt={`Generated Image ${index + 1}`} className="w-full h-auto rounded-md mb-3" />
            <div className="mb-3">
              <Label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700">Titre</Label>
              <Input 
                type="text" 
                id={`title-${index}`} 
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                value={selectedTitle}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">Description</Label>
              <Textarea 
                id={`description-${index}`} 
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                value={selectedDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor={`hashtags-${index}`} className="block text-sm font-medium text-gray-700">Hashtags</Label>
              <Input 
                type="text" 
                id={`hashtags-${index}`} 
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                value={selectedHashtags}
                onChange={(e) => onHashtagsChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`geoRegion-${index}`} className="block text-sm font-medium text-gray-700">Zone Géographique</Label>
              <Select onValueChange={onGeoRegionChange} defaultValue={selectedGeoRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="monde">Monde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="p-4 flex justify-end">
            <Button 
              variant="outline"
              onClick={() => handleCopyToClipboard(`${selectedTitle} ${selectedDescription} ${selectedHashtags}`, index)}
              disabled={copiedStates[index]}
            >
              {copiedStates[index] ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copier le texte
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ImageGallery;
