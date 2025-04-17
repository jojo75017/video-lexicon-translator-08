
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, History, Wand2, Facebook, Instagram, Hash } from 'lucide-react';
import { PinterestImage } from '@/types/pinterest';
import { pinterestDesigns } from '@/data/pinterestImages';
import { 
  searchPixabayImages, 
  searchUnsplashImages, 
  searchFreepikImages, 
  searchPexelsImages, 
  getPresetImagesByCategory 
} from '@/services/imageService';
import { toast } from 'sonner';
import PinterestPreviewCard from './PinterestPreviewCard';
import PinterestTabs from './PinterestTabs';
import SpecialPromptButton from './tabs/SpecialPromptButton';
import PinHistoryPanel from './PinHistoryPanel';
import { usePin } from '@/hooks/usePin';
import { usePinHistory } from '@/hooks/usePinHistory';

const PinterestGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash' | 'freepik' | 'pexels'>('pixabay');
  const [images, setImages] = useState<PinterestImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');

  const { pin, updatePin, handleSelectImage, handleImageUpload, resetPin } = usePin({
    title: 'Découvrez les merveilles de Paris',
    description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
    hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
    tags: ['voyage', 'france', 'architecture', 'europe'],
    callToAction: 'Découvrir',
    image: null,
    uploadedImage: null,
    design: pinterestDesigns[0]
  });

  const { 
    pinHistory, 
    showHistory, 
    setShowHistory, 
    saveToHistory, 
    restoreFromHistory 
  } = usePinHistory();

  useEffect(() => {
    loadPresetImages();
  }, [selectedImageCategory]);

  const loadPresetImages = async () => {
    setLoading(true);
    try {
      const presetImages = await getPresetImagesByCategory(selectedImageCategory);
      console.log(`Loaded ${presetImages.length} preset images for category ${selectedImageCategory}`);
      setImages(presetImages);
    } catch (error) {
      console.error("Erreur lors du chargement des images préréglées:", error);
      toast.error("Impossible de charger les images préréglées");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratedPrompt = (prompt: string) => {
    setSearchQuery(prompt);
    setActiveTab('images');
    setTimeout(() => handleSearch(), 500);
    toast.success("Prompt généré! Recherche d'images en cours...");
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
        searchResults = await searchPixabayImages(searchQuery, selectedImageCategory);
      } else if (imageSource === 'unsplash') {
        searchResults = await searchUnsplashImages(searchQuery);
      } else if (imageSource === 'freepik') {
        searchResults = await searchFreepikImages(searchQuery, selectedImageCategory);
      } else if (imageSource === 'pexels') {
        searchResults = await searchPexelsImages(searchQuery, selectedImageCategory);
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

  const handleRestoreFromHistory = (historicPin: any) => {
    const restoredPin = restoreFromHistory(historicPin);
    updatePin('title', restoredPin.title);
    updatePin('description', restoredPin.description);
    updatePin('hashtags', restoredPin.hashtags);
    updatePin('tags', restoredPin.tags);
    updatePin('callToAction', restoredPin.callToAction);
    updatePin('image', restoredPin.image);
    updatePin('uploadedImage', restoredPin.uploadedImage);
    updatePin('design', restoredPin.design);
    toast.success('Pin restauré depuis l\'historique');
  };
  
  const generateSocialContent = (platform: 'facebook' | 'instagram') => {
    const title = platform === 'facebook' 
      ? "Découvrez notre nouvelle collection"
      : "✨ Nouveau sur Instagram";
      
    const description = platform === 'facebook'
      ? "Nous sommes ravis de vous présenter notre dernière collection. Des designs uniques qui vous inspireront."
      : "Nouvelle collection disponible 🎉 Des pièces uniques qui vous ressemblent 💫";
      
    const hashtags = ['design', 'inspiration', 'nouveaute', 'collection', platform];
    
    updatePin('title', title);
    updatePin('description', description);
    updatePin('hashtags', hashtags);
    
    // Automatically switch to the content tab to show the generated content
    setActiveTab('content');
    
    toast.success(`Contenu ${platform} généré avec succès!`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Création de Pin</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              Historique
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetPin}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSocialContent('facebook')}
              className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSocialContent('instagram')}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-red-600"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
          </div>
        </div>

        {showHistory && (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <h3 className="font-medium">Historique des Pins</h3>
            <PinHistoryPanel
              pinHistory={pinHistory}
              onRestore={handleRestoreFromHistory}
            />
          </div>
        )}
        
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
          handleAddHashtag={(tag: string) => {
            if (tag && !pin.hashtags.includes(tag)) {
              updatePin('hashtags', [...pin.hashtags, tag]);
            }
          }}
          handleRemoveHashtag={(tag: string) => {
            updatePin('hashtags', pin.hashtags.filter(t => t !== tag));
          }}
          handleSelectHashtag={(tag: string) => {
            if (!pin.hashtags.includes(tag)) {
              updatePin('hashtags', [...pin.hashtags, tag]);
            }
          }}
        />
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button variant="default" onClick={() => saveToHistory(pin)}>
            <Upload className="mr-2 h-4 w-4" />
            Sauvegarder
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
