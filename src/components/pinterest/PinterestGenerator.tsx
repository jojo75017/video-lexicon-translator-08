import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { pinterestDesigns } from '@/data/pinterestImages';
import { 
  searchPixabayImages, 
  searchUnsplashImages, 
  searchFreepikImages, 
  searchPexelsImages, 
  getPresetImagesByCategory, 
  generateContentFromImage 
} from '@/services/imageService';
import { toast } from 'sonner';
import PinterestPreviewCard from './PinterestPreviewCard';
import PinterestTabs from './PinterestTabs';
import SpecialPromptButton from './tabs/SpecialPromptButton';

const PinterestGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<'monde' | 'europe' | 'france' | 'all'>('all');
  const [imageSource, setImageSource] = useState<'pixabay' | 'unsplash' | 'freepik' | 'pexels'>('pixabay');
  const [images, setImages] = useState<PinterestImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  
  const [pin, setPin] = useState<PinterestPin>({
    title: 'Découvrez les merveilles de Paris',
    description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
    hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
    tags: ['voyage', 'france', 'architecture', 'europe'],
    callToAction: 'Découvrir',
    image: null,
    uploadedImage: null,
    design: pinterestDesigns[0]
  });

  const updatePin = (field: keyof PinterestPin, value: any) => {
    console.log(`Updating pin field "${field}" with value:`, value);
    setPin(prevPin => ({ ...prevPin, [field]: value }));
  };
  
  // Charger les images par défaut au montage du composant
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
        // Clear the existing image if there is one
        updatePin('image', null);
        // Set the uploaded image
        updatePin('uploadedImage', reader.result as string);
        
        // Auto-generate content based on the filename
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        const words = fileName.split(/[-_\s.]/); // Split by common separators
        
        // Generate a title from the filename
        const capitalizedWords = words.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        const title = `Découvrez ${capitalizedWords.join(' ')}`;
        updatePin('title', title);
        
        // Generate hashtags from the filename
        const newHashtags = [...pin.hashtags];
        words.forEach(word => {
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
          if (cleanWord.length > 2 && !newHashtags.includes(cleanWord)) {
            newHashtags.push(cleanWord);
          }
        });
        
        updatePin('hashtags', newHashtags.slice(0, 10));
        
        // Generate tags from the filename
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

  const handleGeneratedPrompt = (prompt: string) => {
    // Utiliser le prompt généré pour la recherche d'images
    setSearchQuery(prompt);
    setActiveTab('images');
    
    // Lancer automatiquement la recherche après une courte pause
    setTimeout(() => {
      handleSearch();
    }, 500);
    
    toast.success("Prompt généré! Recherche d'images en cours...");
  };

  const handleSelectImage = (image: PinterestImage) => {
    console.log("Image selected in handleSelectImage:", image);
    
    // Clear the uploaded image if there is one
    updatePin('uploadedImage', null);
    // Set the selected image
    updatePin('image', image);
    
    // Générer automatiquement du contenu basé sur l'image
    const generatedContent = generateContentFromImage(image);
    
    // Mettre à jour le titre et la description
    updatePin('title', generatedContent.title);
    updatePin('description', generatedContent.description);
    
    // Ajouter des hashtags basés sur l'image
    if (image.tags && image.tags.length > 0) {
      const newHashtags = [...pin.hashtags];
      
      // Ajouter jusqu'à 3 tags de l'image s'ils n'existent pas déjà
      image.tags.slice(0, 3).forEach(tag => {
        const cleanTag = tag.toLowerCase().replace(/[^\w\s]/g, '').trim();
        if (cleanTag && !newHashtags.includes(cleanTag)) {
          newHashtags.push(cleanTag);
        }
      });
      
      // Limiter à 10 hashtags maximum
      updatePin('hashtags', newHashtags.slice(0, 10));
      
      // Mettre à jour les étiquettes également
      const newTags = [...pin.tags];
      
      // Ajouter tous les tags de l'image s'ils n'existent pas déjà
      image.tags.forEach(tag => {
        const cleanTag = tag.toLowerCase().replace(/[^\w\s]/g, '').trim();
        if (cleanTag && !newTags.includes(cleanTag)) {
          newTags.push(cleanTag);
        }
      });
      
      // Limiter à 15 étiquettes maximum
      updatePin('tags', newTags.slice(0, 15));
    }
    
    toast.success(`Image "${image.title}" sélectionnée avec contenu généré`);
    
    // Passer automatiquement à l'onglet Contenu après la sélection d'une image
    setActiveTab('content');
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

  const handleDownload = async () => {
    // This function is now in PinterestPreviewCard
    // Keeping it here for the button in the tabs section
  };

  // Log the current pin state to help debugging
  useEffect(() => {
    console.log("Current pin state:", pin);
  }, [pin]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Création de Pin</h2>
          <SpecialPromptButton 
            currentTitle={pin.title} 
            onPromptGenerated={handleGeneratedPrompt}
          />
        </div>
        
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
          <Button variant="outline" onClick={() => handleDownload()}>
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
