
import { useState, useEffect } from 'react';
import { PinterestPin } from '@/types/pinterest';
import { pinterestDesigns } from '@/data/pinterestImages';
import { toast } from 'sonner';
import { generateContentFromImage } from '@/services/imageService';

export const usePin = (initialPin: PinterestPin) => {
  const [pin, setPin] = useState<PinterestPin>(initialPin);
  
  const updatePin = (field: keyof PinterestPin, value: any) => {
    console.log(`Updating pin field "${field}" with value:`, value);
    setPin(prevPin => ({ ...prevPin, [field]: value }));
  };

  const handleSelectImage = (image: any) => {
    console.log("Image selected in handleSelectImage:", image);
    
    updatePin('uploadedImage', null);
    updatePin('image', image);
    
    const generatedContent = generateContentFromImage(image);
    updatePin('title', generatedContent.title);
    updatePin('description', generatedContent.description);
    
    if (image.tags && image.tags.length > 0) {
      const newHashtags = [...pin.hashtags];
      image.tags.slice(0, 3).forEach(tag => {
        const cleanTag = tag.toLowerCase().replace(/[^\w\s]/g, '').trim();
        if (cleanTag && !newHashtags.includes(cleanTag)) {
          newHashtags.push(cleanTag);
        }
      });
      
      updatePin('hashtags', newHashtags.slice(0, 10));
      
      const newTags = [...pin.tags];
      image.tags.forEach(tag => {
        const cleanTag = tag.toLowerCase().replace(/[^\w\s]/g, '').trim();
        if (cleanTag && !newTags.includes(cleanTag)) {
          newTags.push(cleanTag);
        }
      });
      
      updatePin('tags', newTags.slice(0, 15));
    }
    
    toast.success(`Image "${image.title}" sélectionnée avec contenu généré`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePin('image', null);
        updatePin('uploadedImage', reader.result as string);
        
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const words = fileName.split(/[-_\s.]/);
        
        const capitalizedWords = words.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        const title = `Découvrez ${capitalizedWords.join(' ')}`;
        updatePin('title', title);
        
        const newHashtags = [...pin.hashtags];
        words.forEach(word => {
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
          if (cleanWord.length > 2 && !newHashtags.includes(cleanWord)) {
            newHashtags.push(cleanWord);
          }
        });
        
        updatePin('hashtags', newHashtags.slice(0, 10));
        
        const newTags = [...pin.tags];
        words.forEach(word => {
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
          if (cleanWord.length > 2 && !newTags.includes(cleanWord)) {
            newTags.push(cleanWord);
          }
        });
        
        updatePin('tags', newTags.slice(0, 10));
        
        toast.success('Image chargée avec succès et contenu généré');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPin = () => {
    setPin({
      title: 'Découvrez les merveilles de Paris',
      description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
      hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
      tags: ['voyage', 'france', 'architecture', 'europe'],
      callToAction: 'Découvrir',
      image: null,
      uploadedImage: null,
      design: pinterestDesigns[0]
    });
    toast.success('Pin réinitialisé');
  };

  return {
    pin,
    updatePin,
    handleSelectImage,
    handleImageUpload,
    resetPin
  };
};
