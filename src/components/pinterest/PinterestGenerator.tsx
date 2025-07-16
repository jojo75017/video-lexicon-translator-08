
import React from 'react';
import { toast } from 'sonner';
import { usePinterestGenerator } from '@/hooks/usePinterestGenerator';
import { useSocialContent } from '@/hooks/useSocialContent';
import { pinterestDesigns, callToActions } from '@/data/pinterestImages';
import PinterestPreviewCard from './PinterestPreviewCard';
import PinHistoryPanel from './PinHistoryPanel';
import PinterestTabs from './PinterestTabs';
import ApiKeysSection from './ApiKeysSection';
import PinterestActions from './PinterestActions';

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
        <ApiKeysSection 
          instagramApiKey={instagramApiKey}
          setInstagramApiKey={setInstagramApiKey}
          handleSaveInstagramApiKey={handleSaveInstagramApiKey}
        />

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
        />
        
        <PinterestActions
          resetPin={resetPin}
          historyVisible={historyVisible}
          setHistoryVisible={setHistoryVisible}
        />
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
