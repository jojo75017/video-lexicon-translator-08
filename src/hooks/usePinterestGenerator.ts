
import { useState } from 'react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { pinterestDesigns, worldImages, europeImages, franceImages, allImages } from '@/data/pinterestImages';
import { searchImagesByKeyword, filterImagesByCategory } from '@/services/imageService';
import { toast } from 'sonner';

export const usePinterestGenerator = (initialPin: PinterestPin) => {
  const [pin, setPin] = useState<PinterestPin>(initialPin);
  const [activeTab, setActiveTab] = useState('content');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash' | 'freepik' | 'pexels'>('unsplash');
  const [images, setImages] = useState<PinterestImage[]>(allImages);
  const [loading, setLoading] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  const [instagramApiKey, setInstagramApiKey] = useState(localStorage.getItem('instagramApiKey') || '');

  const updatePin = (field: keyof PinterestPin, value: any) => {
    setPin(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    try {
      const searchResults = searchImagesByKeyword(allImages, searchQuery, selectedImageCategory);
      
      if (searchResults.length === 0) {
        toast.warning(`Aucune image trouvée pour "${searchQuery}"`);
        const fallbackImages = filterImagesByCategory(allImages, selectedImageCategory);
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
        filteredImages = worldImages;
        break;
      case 'europe':
        filteredImages = europeImages;
        break;
      case 'france':
        filteredImages = franceImages;
        break;
      case 'all':
      default:
        filteredImages = [...worldImages.slice(0, 5), ...europeImages.slice(0, 5), ...franceImages.slice(0, 5)];
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
  };

  const resetPin = () => {
    setPin(initialPin);
    updatePin('image', null);
    updatePin('uploadedImage', null);
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
    resetPin
  };
};

