
import React, { useState } from 'react';
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
import { pinterestDesigns, callToActions } from '@/data/pinterestImages';
import { useSocialContent } from '@/hooks/useSocialContent';
import { Wand } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialPin = {
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
};

const PinterestGenerator: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openAIKey') || '');
  
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

  const handleSaveOpenAIKey = () => {
    localStorage.setItem('openAIKey', openAIKey);
    toast.success('Clé OpenAI sauvegardée');
  };

  // Function to handle Call to Action selection
  const handleCallToActionChange = (value: string) => {
    updatePin('callToAction', value);
    toast.success('Call to Action mis à jour');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/5 xl:w-2/3">
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <Label htmlFor="openai-key">Clé API OpenAI</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="openai-key"
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
            />
            <Button onClick={handleSaveOpenAIKey}>Sauvegarder</Button>
          </div>
        </div>

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
            
            {/* Add Call to Action picker in the design tab */}
            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
              <Label htmlFor="call-to-action" className="mb-2 block">Call to Action</Label>
              <Select value={pin.callToAction} onValueChange={handleCallToActionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un Call to Action" />
                </SelectTrigger>
                <SelectContent>
                  {callToActions.map((cta) => (
                    <SelectItem key={cta} value={cta}>
                      {cta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="hashtags">
            <HashtagsTab
              pin={pin}
              customHashtag={customHashtag}
              setCustomHashtag={setCustomHashtag}
              updatePin={updatePin}
            />
          </TabsContent>
          
          <TabsContent value="etiquettes">
            <EtiquettesTab pin={pin} updatePin={updatePin} />
          </TabsContent>
        </Tabs>

        
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
