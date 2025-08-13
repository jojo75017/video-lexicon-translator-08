
import { useState } from 'react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { pinterestDesigns, worldImages, europeImages, franceImages, allImages } from '@/data/pinterestImages';
import { searchImagesByKeyword, filterImagesByCategory } from '@/services/imageService';
import { generateContentFromImage, extractTagsFromImage } from '@/services/imageService';
import { toast } from 'sonner';

export const usePinterestGenerator = (initialPin: PinterestPin) => {
  const [pin, setPin] = useState<PinterestPin>(initialPin);
  const [activeTab, setActiveTab] = useState('content');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash' | 'freepik' | 'pexels'>('unsplash');
  const [images, setImages] = useState<PinterestImage[]>(allImages as unknown as PinterestImage[]);
  const [loading, setLoading] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  const [instagramApiKey, setInstagramApiKey] = useState(localStorage.getItem('instagramApiKey') || '');

  const updatePin = (field: keyof PinterestPin, value: any) => {
    console.log('Updating pin field:', field, 'with value:', value);
    setPin(prev => {
      const newPin = { ...prev, [field]: value };
      console.log('New pin state:', newPin);
      return newPin;
    });
  };

  const handleSearch = () => {
    setLoading(true);
    try {
      const searchResults = searchImagesByKeyword(allImages as unknown as PinterestImage[], searchQuery, selectedImageCategory);
      
      if (searchResults.length === 0) {
        toast.warning(`Aucune image trouvée pour "${searchQuery}"`);
        const fallbackImages = filterImagesByCategory(allImages as unknown as PinterestImage[], selectedImageCategory);
        setImages(fallbackImages);
      } else {
        setImages(searchResults);
        toast.success(`${searchResults.length} images trouvées`);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'images:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterImages = (category: 'monde' | 'europe' | 'france' | 'all') => {
    setLoading(true);
    
    let filteredImages: PinterestImage[] = [];
    
    switch (category) {
      case 'monde':
        filteredImages = worldImages as unknown as PinterestImage[];
        break;
      case 'europe':
        filteredImages = europeImages as unknown as PinterestImage[];
        break;
      case 'france':
        filteredImages = franceImages as unknown as PinterestImage[];
        break;
      case 'all':
      default:
        filteredImages = [...worldImages.slice(0, 5), ...europeImages.slice(0, 5), ...franceImages.slice(0, 5)] as unknown as PinterestImage[];
        break;
    }
    
    setImages(filteredImages);
    setLoading(false);
  };

  const handleSaveInstagramApiKey = () => {
    localStorage.setItem('instagramApiKey', instagramApiKey);
    toast.success('Clé API Instagram sauvegardée');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatePin('uploadedImage', event.target?.result as string);
        updatePin('image', null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImage = (image: PinterestImage) => {
    updatePin('image', image);
    updatePin('uploadedImage', null);
    
    // Auto-génération du contenu basé sur l'image
    try {
      const generatedContent = generateContentFromImage(image);
      const extractedTags = extractTagsFromImage(image);
      
      if (!pin.title) {
        updatePin('title', generatedContent.title);
      }
      
      if (!pin.description) {
        updatePin('description', generatedContent.description);
      }
      
      // Ajouter les tags extraits comme hashtags
      const newHashtags = extractedTags.map(tag => `#${tag}`).slice(0, 10);
      updatePin('hashtags', [...pin.hashtags, ...newHashtags].slice(0, 30));
      
      toast.success('Image sélectionnée et contenu généré !');
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
      toast.warning('Image sélectionnée, mais impossible de générer le contenu automatiquement');
    }
  };

  const resetPin = () => {
    setPin(initialPin);
    setSearchQuery('');
    setCustomHashtag('');
    setSelectedImageCategory('all');
    setImages(allImages as unknown as PinterestImage[]);
    toast.success('Pin réinitialisé');
  };

  const generateQuickContent = (theme: string) => {
    const templates = {
      'inspiration': {
        title: 'Inspiration du jour ✨',
        description: 'Découvrez cette inspiration incroyable qui va transformer votre journée ! 💫 Partagez votre motivation et inspirez les autres.',
        hashtags: ['#inspiration', '#motivation', '#lifestyle', '#positivevibes', '#mindset']
      },
      'diy': {
        title: 'DIY Créatif 🎨',
        description: 'Tutoriel DIY facile à réaliser ! Matériaux simples, résultat bluffant. Parfait pour un weekend créatif en famille.',
        hashtags: ['#diy', '#tuto', '#handmade', '#creative', '#crafting']
      },
      'cuisine': {
        title: 'Recette Délicieuse 🍴',
        description: 'Une recette simple et savoureuse qui va régaler toute la famille ! Ingrédients faciles à trouver, préparation rapide.',
        hashtags: ['#recette', '#cuisine', '#food', '#cooking', '#delicious']
      },
      'voyage': {
        title: 'Destination de Rêve ✈️',
        description: 'Découvrez cette destination incontournable ! Conseils, bons plans et spots secrets pour un voyage inoubliable.',
        hashtags: ['#voyage', '#travel', '#destination', '#adventure', '#wanderlust']
      }
    };

    const template = templates[theme as keyof typeof templates];
    if (template) {
      updatePin('title', template.title);
      updatePin('description', template.description);
      updatePin('hashtags', template.hashtags);
      toast.success(`Contenu ${theme} généré !`);
    }
  };

  return {
    pin,
    updatePin,
    activeTab,
    setActiveTab,
    historyVisible,
    setHistoryVisible,
    searchQuery,
    setSearchQuery,
    selectedImageCategory,
    setSelectedImageCategory,
    imageSource,
    setImageSource,
    images,
    loading,
    customHashtag,
    setCustomHashtag,
    instagramApiKey,
    setInstagramApiKey,
    handleSearch,
    handleFilterImages,
    handleSaveInstagramApiKey,
    handleImageUpload,
    handleSelectImage,
    resetPin,
    generateQuickContent
  };
};
