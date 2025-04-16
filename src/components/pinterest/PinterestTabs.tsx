
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentTab from './tabs/ContentTab';
import ImagesTab from './tabs/ImagesTab';
import DesignTab from './tabs/DesignTab';
import HashtagsTab from './tabs/HashtagsTab';
import LocalImagesTab from './tabs/LocalImagesTab';
import { PinterestPin, PinterestImage } from '@/types/pinterest';

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
  customHashtag: string;
  setCustomHashtag: (hashtag: string) => void;
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
  customHashtag,
  setCustomHashtag,
  handleAddHashtag,
  handleRemoveHashtag,
  handleSelectHashtag
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="content">Contenu</TabsTrigger>
        <TabsTrigger value="design">Design</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="local">Images Locales</TabsTrigger>
        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="py-4">
        <ContentTab pin={pin} updatePin={updatePin} />
      </TabsContent>
      
      <TabsContent value="design" className="py-4">
        <DesignTab pin={pin} updatePin={updatePin} />
      </TabsContent>
      
      <TabsContent value="images" className="py-4">
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
      
      <TabsContent value="local" className="py-4">
        <LocalImagesTab 
          pin={pin}
          updatePin={updatePin}
          handleImageUpload={handleImageUpload}
        />
      </TabsContent>
      
      <TabsContent value="hashtags" className="py-4">
        <HashtagsTab 
          pin={pin}
          customHashtag={customHashtag}
          setCustomHashtag={setCustomHashtag}
          handleAddHashtag={handleAddHashtag}
          handleRemoveHashtag={handleRemoveHashtag}
          handleSelectHashtag={handleSelectHashtag}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PinterestTabs;
