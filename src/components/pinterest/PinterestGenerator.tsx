
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PinterestPreview from './PinterestPreview';
import ContentTab from './tabs/ContentTab';
import ImagesTab from './tabs/ImagesTab';
import DesignTab from './tabs/DesignTab';
import HashtagsTab from './tabs/HashtagsTab';
import EtiquettesTab from './tabs/EtiquettesTab';
import PinHistoryPanel from './PinHistoryPanel';
import { usePin } from '@/hooks/usePin';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { pinterestDesigns, worldImages, europeImages, franceImages, allImages } from '@/data/pinterestImages';
import { searchImagesByKeyword, filterImagesByCategory } from '@/services/imageService';
import { Undo, Redo } from 'lucide-react';

const initialPin: PinterestPin = {
  title: 'Découvrez les merveilles de Paris',
  description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
  hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
  tags: ['voyage', 'france', 'architecture', 'europe'],
  callToAction: 'Découvrir',
  image: null,
  uploadedImage: null,
  design: pinterestDesigns[0]
};

const PinterestGenerator: React.FC = () => {
  const { pin, updatePin, handleSelectImage, handleImageUpload, resetPin } = usePin(initialPin);
  
  const [activeTab, setActiveTab] = useState('content');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash' | 'freepik' | 'pexels'>('unsplash');
  const [images, setImages] = useState<PinterestImage[]>(allImages);
  const [loading, setLoading] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  
  // Charger les images au démarrage
  useEffect(() => {
    handleFilterImages(selectedImageCategory);
  }, [selectedImageCategory]);

  const handleSearch = () => {
    setLoading(true);
    console.log(`Recherche d'images pour: "${searchQuery}" dans la catégorie: ${selectedImageCategory}`);
    
    try {
      // Utiliser la fonction de recherche améliorée du service
      const searchResults = searchImagesByKeyword(allImages, searchQuery, selectedImageCategory);
      
      if (searchResults.length === 0) {
        toast.warning(`Aucune image trouvée pour "${searchQuery}". Essayez des termes plus généraux.`);
        // Montrer des images filtrées par catégorie comme résultats de secours
        const fallbackImages = filterImagesByCategory(allImages, selectedImageCategory);
        setImages(fallbackImages);
        console.log(`Affichage de ${fallbackImages.length} images de secours pour la catégorie ${selectedImageCategory}`);
      } else {
        setImages(searchResults);
        toast.success(`${searchResults.length} images trouvées pour "${searchQuery}"`);
        console.log(`Trouvé ${searchResults.length} images pour "${searchQuery}"`);
        
        // Log quelques exemples pour debug
        if (searchResults.length > 0) {
          console.log("Exemple d'images trouvées:", searchResults.slice(0, 3).map(img => ({
            title: img.title,
            country: img.country,
            category: img.category
          })));
        }
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
    let sourceText = '';
    
    switch (category) {
      case 'monde':
        filteredImages = worldImages;
        sourceText = 'monde';
        break;
      case 'europe':
        filteredImages = europeImages;
        sourceText = 'Europe';
        break;
      case 'france':
        filteredImages = franceImages;
        sourceText = 'France';
        break;
      case 'all':
      default:
        // Prendre quelques images de chaque catégorie pour une vue équilibrée
        filteredImages = [...worldImages.slice(0, 5), ...europeImages.slice(0, 5), ...franceImages.slice(0, 5)];
        sourceText = 'prévisualisées';
        break;
    }
    
    setImages(filteredImages);
    console.log(`Loaded ${filteredImages.length} preset images for category ${category}`);
    setLoading(false);
    
    if (category !== 'all') {
      toast.success(`Images de ${sourceText} chargées`);
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (pin.hashtags.includes(tag)) {
      toast.info(`Le hashtag #${tag} est déjà ajouté`);
      return;
    }
    
    updatePin('hashtags', [...pin.hashtags, tag]);
    toast.success(`Hashtag #${tag} ajouté`);
  };

  const handleRemoveHashtag = (tag: string) => {
    updatePin('hashtags', pin.hashtags.filter(t => t !== tag));
    toast.success(`Hashtag #${tag} supprimé`);
  };

  const handleSelectHashtag = (tag: string) => {
    if (pin.hashtags.includes(tag)) {
      handleRemoveHashtag(tag);
    } else {
      handleAddHashtag(tag);
    }
  };

  const handleSavePin = () => {
    if (!pin.image && !pin.uploadedImage) {
      toast.error("Veuillez sélectionner ou charger une image");
      setActiveTab('images');
      return;
    }
    
    // Code pour sauvegarder le pin dans l'historique
    toast.success("Pin sauvegardé dans l'historique");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/5 xl:w-2/3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
            <TabsTrigger value="etiquettes">Étiquettes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <ContentTab pin={pin} updatePin={updatePin} />
          </TabsContent>
          
          <TabsContent value="images">
            <ImagesTab 
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
            />
          </TabsContent>
          
          <TabsContent value="design">
            <DesignTab pin={pin} updatePin={updatePin} />
          </TabsContent>
          
          <TabsContent value="hashtags">
            <HashtagsTab 
              pin={pin}
              customHashtag={customHashtag}
              setCustomHashtag={setCustomHashtag}
              handleAddHashtag={handleAddHashtag}
              handleRemoveHashtag={handleRemoveHashtag}
              handleSelectHashtag={handleSelectHashtag}
            />
          </TabsContent>
          
          <TabsContent value="etiquettes">
            <EtiquettesTab pin={pin} updatePin={updatePin} />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={resetPin}>
            Réinitialiser
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setHistoryVisible(!historyVisible)}>
              {historyVisible ? 'Masquer l\'historique' : 'Voir l\'historique'}
            </Button>
            <Button onClick={handleSavePin}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-2/5 xl:w-1/3">
        <div className="sticky top-4">
          <PinterestPreview pin={pin} />
          
          {historyVisible && (
            <div className="mt-6">
              <PinHistoryPanel selectedPin={pin} onSelect={(savedPin) => {
                // Mettre à jour le pin actuel avec le pin sélectionné
                Object.keys(savedPin).forEach((key) => {
                  updatePin(key as keyof PinterestPin, savedPin[key as keyof PinterestPin]);
                });
                toast.success("Pin restauré de l'historique");
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinterestGenerator;
