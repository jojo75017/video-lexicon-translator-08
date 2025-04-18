
import { useState } from 'react';
import { PinterestPin } from '@/types/pinterest';
import { pinterestDesigns } from '@/data/pinterestImages';
import { toast } from 'sonner';
import { generateContentFromImage, generateGlobalDescriptionFromTitle } from '@/services/imageService';

export const usePin = (initialPin: PinterestPin) => {
  const [pin, setPin] = useState<PinterestPin>(initialPin);
  
  const updatePin = (field: keyof PinterestPin, value: any) => {
    console.log(`Updating pin field "${field}" with value:`, value);
    
    // Mettre à jour directement le champ sans logique spéciale
    setPin(prevPin => ({ ...prevPin, [field]: value }));
    
    // Si le titre est mis à jour, proposer de mettre à jour la description globale, mais ne pas le faire automatiquement
    if (field === 'title' && value) {
      console.log("Title updated, global description could be updated manually");
    }
  };

  const handleSelectImage = (image: any) => {
    console.log("Image selected in handleSelectImage:", image);
    
    updatePin('uploadedImage', null);
    updatePin('image', image);
    
    // Sauvegarder le titre personnalisé actuel
    const currentTitle = pin.title;
    const isDefaultTitle = currentTitle === initialPin.title;
    
    // Seulement générer un nouveau titre si l'utilisateur n'a pas déjà personnalisé le titre
    if (isDefaultTitle) {
      const generatedContent = generateContentFromImage(image);
      updatePin('title', generatedContent.title);
      
      // Mettre à jour la description si elle est vide ou à sa valeur par défaut
      if (!pin.description || pin.description === initialPin.description) {
        updatePin('description', generatedContent.description);
      }
      
      // Mettre à jour la description globale avec un contenu basé sur le titre généré
      if (!pin.globalDescription || pin.globalDescription === initialPin.globalDescription) {
        const detailedDescription = generateGlobalDescriptionFromTitle(generatedContent.title);
        updatePin('globalDescription', detailedDescription);
      }
    } else {
      // Conserver le titre personnalisé, mais mettre à jour description si nécessaire
      if (!pin.description || pin.description === initialPin.description) {
        const generatedContent = generateContentFromImage(image);
        updatePin('description', generatedContent.description);
      }
    }
    
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
        
        // Sauvegarder le titre personnalisé actuel
        const currentTitle = pin.title;
        const isDefaultTitle = currentTitle === initialPin.title;
        
        // Seulement générer un nouveau titre si l'utilisateur n'a pas déjà personnalisé le titre
        if (isDefaultTitle) {
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          const words = fileName.split(/[-_\s.]/);
          
          const capitalizedWords = words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          );
          const title = `Découvrez ${capitalizedWords.join(' ')}`;
          updatePin('title', title);
        }
        
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const words = fileName.split(/[-_\s.]/);
        
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
      title: 'Découvrez les tendances créatives du moment',
      description: 'Des idées inspirantes pour stimuler votre créativité et donner vie à vos projets. Chaque détail compte pour créer quelque chose d\'unique et original.',
      globalDescription: 'Explorez notre collection d\'idées créatives qui vous aideront à développer votre imagination et à concrétiser vos projets. Que vous soyez débutant ou expert, vous trouverez l\'inspiration pour vos créations, avec des conseils pratiques et des astuces professionnelles pour obtenir des résultats exceptionnels. Découvrez comment transformer des concepts simples en œuvres remarquables grâce à nos méthodes éprouvées et nos recommandations personnalisées.',
      hashtags: ['créativité', 'inspiration', 'design', 'artisanat'],
      tags: ['créatif', 'inspiration', 'idées', 'projets', 'design'],
      callToAction: 'Découvrir',
      image: null,
      uploadedImage: null,
      design: pinterestDesigns[0],
      showHashtags: true
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
