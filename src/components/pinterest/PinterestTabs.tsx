
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, PenTool, Image, Tag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DesignTab from './tabs/DesignTab';
import ContentTab from './tabs/ContentTab';
import ImagesTab from './tabs/ImagesTab';
import HashtagsTab from './tabs/HashtagsTab';
import { PinterestPin } from '@/types/pinterest';

interface PinterestTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pin: PinterestPin;
  updatePin: (field: keyof PinterestPin, value: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedImageCategory: 'monde' | 'europe' | 'france' | 'all';
  setSelectedImageCategory: (category: 'monde' | 'europe' | 'france' | 'all') => void;
  imageSource: 'pixabay' | 'unsplash';
  setImageSource: (source: 'pixabay' | 'unsplash') => void;
  images: any[];
  loading: boolean;
  handleSearch: () => void;
  handleSelectImage: (image: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCustomHashtag: (hashtag: string) => void;
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
  return (
    <>
      <Tabs 
        defaultValue="design" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="design" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Design</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <PenTool className="h-4 w-4" />
            <span className="hidden sm:inline">Contenu</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Hashtags</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="design">
          <DesignTab pin={pin} updatePin={updatePin} />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentTab pin={pin} updatePin={updatePin} />
        </TabsContent>
        
        <TabsContent value="images">
          <ImagesTab 
            pin={pin}
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
      </Tabs>
      
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (activeTab === 'design') setActiveTab('hashtags');
            else if (activeTab === 'content') setActiveTab('design');
            else if (activeTab === 'images') setActiveTab('content');
            else if (activeTab === 'hashtags') setActiveTab('images');
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Changer d'onglet
        </Button>
        
        <Button onClick={() => {}}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
    </>
  );
};

export default PinterestTabs;
