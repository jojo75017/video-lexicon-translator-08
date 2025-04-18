
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PinterestPreviewCard from './PinterestPreviewCard';
import ContentTab from './tabs/ContentTab';
import ImagesTab from './tabs/ImagesTab';
import DesignTab from './tabs/DesignTab';
import HashtagsTab from './tabs/HashtagsTab';
import EtiquettesTab from './tabs/EtiquettesTab';
import PinHistoryPanel from './PinHistoryPanel';
import SpecialPromptButton from './tabs/SpecialPromptButton';
import { usePinterestGenerator } from '@/hooks/usePinterestGenerator';
import { pinterestDesigns } from '@/data/pinterestImages';
import { useSocialContent } from '@/hooks/useSocialContent';
import { Wand } from 'lucide-react';

const initialPin = {
  title: 'Découvrez les merveilles de Paris',
  description: 'Explorez la ville romantique avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. Un voyage inoubliable vous attend.',
  hashtags: ['paris', 'france', 'travel', 'eiffeltower'],
  tags: ['voyage', 'france', 'architecture', 'europe'],
  callToAction: 'Découvrir',
  image: null,
  uploadedImage: null,
  design: pinterestDesigns[0],
  showHashtags: true
};

const PinterestGenerator: React.FC = () => {
  const {
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
  } = usePinterestGenerator(initialPin);

  const { generateSocialContent } = useSocialContent({ updatePin, setActiveTab });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/5 xl:w-2/3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              <TabsTrigger value="etiquettes">Étiquettes</TabsTrigger>
            </TabsList>
            
            <SpecialPromptButton 
              currentTitle={pin.title} 
              onPromptGenerated={(prompt) => {
                updatePin('description', prompt);
                toast.success("Prompt d'image généré avec succès!");
              }}
            />
          </div>
          
          {/* Tabs Content */}
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
            />
          </TabsContent>
          
          <TabsContent value="etiquettes">
            <EtiquettesTab pin={pin} updatePin={updatePin} />
          </TabsContent>
        </Tabs>

        {/* Additional controls */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetPin}>
              Réinitialiser
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setHistoryVisible(!historyVisible)}
            >
              {historyVisible ? 'Masquer l\'historique' : 'Voir l\'historique'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-2/5 xl:w-1/3">
        <div className="sticky top-4">
          <PinterestPreviewCard pin={pin} />
          
          {historyVisible && (
            <div className="mt-6">
              <PinHistoryPanel 
                selectedPin={pin} 
                onSelect={(savedPin) => {
                  Object.keys(savedPin).forEach((key) => {
                    updatePin(key as keyof typeof pin, savedPin[key]);
                  });
                  toast.success("Pin restauré de l'historique");
                }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinterestGenerator;

