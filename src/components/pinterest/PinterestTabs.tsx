
import React from 'react';
import { PinterestPin, PinterestImage } from '@/types/pinterest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentTab from './tabs/ContentTab';
import DesignTab from './tabs/DesignTab';
import ImagesTab from './tabs/ImagesTab';
import HashtagsTab from './tabs/HashtagsTab';
import EtiquettesTab from './tabs/EtiquettesTab';
import SpecialPromptButton from './tabs/SpecialPromptButton';
import { toast } from 'sonner';

interface PinterestTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedImageCategory: 'monde' | 'europe' | 'france' | 'all';
  setSelectedImageCategory: (category: 'monde' | 'europe' | 'france' | 'all') => void;
  imageSource: 'pixabay' | 'unsplash' | 'freepik' | 'pexels';
  setImageSource: (source: 'pixabay' | 'unsplash' | 'freepik' | 'pexels') => void;
  images: PinterestImage[];
  loading: boolean;
  handleSearch: () => void;
  handleSelectImage: (image: PinterestImage) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCustomHashtag: React.Dispatch<React.SetStateAction<string>>;
  customHashtag: string;
  handleAddHashtag: () => void;
  handleRemoveHashtag: (tag: string) => void;
  handleSelectHashtag: (tag: string) => void;
}

const PinterestTabs: React.FC<PinterestTabsProps> = ({
  activeTab,
  setActiveTab,
  pin,
  updatePin,
  searchQuery,
  setSearchQuery,
  selectedImageCategory,
  setSelectedImageCategory,
  imageSource,
  setImageSource,
  images,
  loading,
  handleSearch,
  handleSelectImage,
  handleImageUpload,
  setCustomHashtag,
  customHashtag,
  handleAddHashtag,
  handleRemoveHashtag,
  handleSelectHashtag
}) => {
  const handlePromptGenerated = (prompt: string) => {
    // Mettre à jour la description avec le prompt généré
    updatePin('description', prompt);
    toast.success("Le prompt a été intégré à la description!");
  };

  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="etiquettes">Étiquettes</TabsTrigger>
        </TabsList>
        
        <SpecialPromptButton 
          currentTitle={pin.title} 
          onPromptGenerated={handlePromptGenerated}
        />
      </div>
      
      <TabsContent value="design" className="space-y-4">
        <DesignTab pin={pin} updatePin={updatePin} />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-4">
        <ContentTab pin={pin} updatePin={updatePin} />
      </TabsContent>
      
      <TabsContent value="images" className="space-y-4">
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
      
      <TabsContent value="hashtags" className="space-y-4">
        <HashtagsTab 
          pin={pin}
          customHashtag={customHashtag}
          setCustomHashtag={setCustomHashtag}
          handleAddHashtag={handleAddHashtag}
          handleRemoveHashtag={handleRemoveHashtag}
          handleSelectHashtag={handleSelectHashtag}
        />
      </TabsContent>
      
      <TabsContent value="etiquettes" className="space-y-4">
        <EtiquettesTab 
          pin={pin}
          updatePin={updatePin}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PinterestTabs;
