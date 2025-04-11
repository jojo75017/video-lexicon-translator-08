import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { pinterestDesigns } from '@/data/pinterestImages';
import { searchPixabayImages, searchUnsplashImages, getPresetImagesByCategory } from '@/services/imageService';
import { toast } from 'sonner';
import PinterestPreviewCard from './PinterestPreviewCard';
import PinterestTabs from './PinterestTabs';

const PinterestGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash'>('pixabay');
  const [images, setImages] = useState<PinterestImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [customHashtag, setCustomHashtag] = useState('');
  
  const [pin, setPin] = useState<PinterestPin>({
    title: 'Découvrez les merveilles de Paris',
    description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
    hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
    callToAction: 'Découvrir',
    image: null,
    uploadedImage: null,
    design: pinterestDesigns[0]
  });

  const updatePin = (field: keyof PinterestPin, value: any) => {
    setPin({ ...pin, [field]: value });
  };
  
  // Charger les images par défaut au montage du composant
  useEffect(() => {
    loadPresetImages();
  }, [selectedImageCategory]);
  
  const loadPresetImages = async () => {
    setLoading(true);
    try {
      const presetImages = await getPresetImagesByCategory(selectedImageCategory);
      setImages(presetImages);
    } catch (error) {
      console.error("Erreur lors du chargement des images préréglées:", error);
      toast.error("Impossible de charger les images préréglées");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHashtag = () => {
    if (customHashtag && !pin.hashtags.includes(customHashtag)) {
      const updatedHashtags = [...pin.hashtags, customHashtag];
      updatePin('hashtags', updatedHashtags);
      setCustomHashtag('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    const updatedHashtags = pin.hashtags.filter(t => t !== tag);
    updatePin('hashtags', updatedHashtags);
  };

  const handleSelectHashtag = (tag: string) => {
    if (!pin.hashtags.includes(tag)) {
      const updatedHashtags = [...pin.hashtags, tag];
      updatePin('hashtags', updatedHashtags);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePin('uploadedImage', reader.result as string);
        updatePin('image', null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImage = (image: PinterestImage) => {
    updatePin('image', image);
    updatePin('uploadedImage', null);
    toast.success(`Image "${image.title}" sélectionnée`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning("Veuillez entrer un terme de recherche");
      return;
    }
    
    setLoading(true);
    try {
      let searchResults: PinterestImage[] = [];
      
      if (imageSource === 'pixabay') {
        searchResults = await searchPixabayImages(searchQuery);
      } else {
        searchResults = await searchUnsplashImages(searchQuery);
      }
      
      if (searchResults.length === 0) {
        toast.info("Aucun résultat trouvé. Essayez d'autres termes de recherche.");
      } else {
        setImages(searchResults);
        toast.success(`${searchResults.length} images trouvées`);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'images:", error);
      toast.error("Erreur lors de la recherche d'images");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    // This function is now in PinterestPreviewCard
    // Keeping it here for the button in the tabs section
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-6">
        <PinterestTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pin={pin}
          updatePin={updatePin}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedImageCategory={selectedImageCategory}
          setSelectedImageCategory={setSelectedImageCategory}
          imageSource={imageSource}
          setImageSource={setImageSource}
          images={images}
          loading={loading}
          handleSearch={handleSearch}
          handleSelectImage={handleSelectImage}
          handleImageUpload={handleImageUpload}
          setCustomHashtag={setCustomHashtag}
          customHashtag={customHashtag}
          handleAddHashtag={handleAddHashtag}
          handleRemoveHashtag={handleRemoveHashtag}
          handleSelectHashtag={handleSelectHashtag}
        />
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 sticky top-4">
        <PinterestPreviewCard pin={pin} />
      </div>
    </div>
  );
};

export default PinterestGenerator;
