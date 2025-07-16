
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmojiTab from "@/components/seo/analysis/EmojiTab";
import HashtagsTab from "@/components/seo/analysis/HashtagsTab";

interface TitleEnhancementTabsProps {
  title: string;
  description: string;
  selectedKeyword: string;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateDescription: (newDescription: string) => void;
}

const TitleEnhancementTabs: React.FC<TitleEnhancementTabsProps> = ({
  title,
  description,
  selectedKeyword,
  onUpdateTitle,
  onUpdateDescription,
}) => {
  const [activeTab, setActiveTab] = useState("emojis");

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium mb-2 text-blue-800">Enrichir votre contenu</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="emojis" className="flex-1">Emojis pour titre</TabsTrigger>
          <TabsTrigger value="hashtags" className="flex-1">Hashtags pour description</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emojis">
          <EmojiTab 
            fieldValue={title}
            onInsert={onUpdateTitle}
            maxLength={60}
          />
        </TabsContent>
        
        <TabsContent value="hashtags">
          <HashtagsTab 
            fieldValue={description}
            onInsert={onUpdateDescription}
            maxLength={155}
            keywordToUse={selectedKeyword}  // Passer le mot-clé pour générer des hashtags pertinents
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TitleEnhancementTabs;
