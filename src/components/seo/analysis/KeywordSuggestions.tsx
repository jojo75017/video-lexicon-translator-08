import React from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlignLeft, Tag, TrendingUp, BarChart2, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import EmojiTab from './EmojiTab';
import HashtagsTab from './HashtagsTab';

interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
  onGenerateClick?: () => void;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  generatedKeywords,
  onGenerateClick
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = React.useState('');
  const [currentDescription, setCurrentDescription] = React.useState('');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copié dans le presse-papiers!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // On prend le 1er titre/desc générés pour prévisualisation
  React.useEffect(() => {
    if (generatedKeywords.length > 0) {
      setCurrentTitle(generatedKeywords[0].suggestedTitle || "");
      setCurrentDescription(generatedKeywords[0].suggestedDescription || "");
    }
  }, [generatedKeywords]);

  return (
    <Card className="border border-gray-200 rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-600" />
          Suggestions SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Obtenez des suggestions de mots-clés, titres et descriptions pour améliorer votre référencement.
          </p>
          <Button
            onClick={onGenerateClick}
            className="bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Générer des suggestions
          </Button>
        </div>

        {generatedKeywords.length > 0 && (
          <Tabs defaultValue="keywords" className="mt-4">
            <TabsList className="mb-4 grid grid-cols-5 w-full">
              <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
              <TabsTrigger value="titles">Balises Title</TabsTrigger>
              <TabsTrigger value="descriptions">Meta Descriptions</TabsTrigger>
              <TabsTrigger value="emojis">Emojis</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
            </TabsList>

            {/* Onglet Mots-clés */}
            <TabsContent value="keywords">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-2 rounded-md">
                    <span>{keyword.keyword}</span>
                    <span className="text-gray-500 text-sm">
                      {keyword.searchVolume} recherches
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Titres */}
            <TabsContent value="titles">
              
              <div className="space-y-3">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {keyword.suggestedTitle?.length || 0}/60
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(keyword.suggestedTitle || "", index)}
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3 bg-blue-50 rounded text-sm mt-1 whitespace-pre-wrap">
                      {keyword.suggestedTitle || "Non disponible"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Descriptions */}
            <TabsContent value="descriptions">
              
              <div className="space-y-3">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <AlignLeft className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {keyword.suggestedDescription?.length || 0}/155
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(keyword.suggestedDescription || "", index)}
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3 bg-green-50 rounded text-sm mt-1 whitespace-pre-wrap">
                      {keyword.suggestedDescription || "Non disponible"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Nouvel onglet Emojis */}
            <TabsContent value="emojis">
              <EmojiTab
                fieldValue={currentTitle}
                onInsert={setCurrentTitle}
                maxLength={60}
              />
              <div className="mt-4">
                <label className="text-xs text-gray-600">Aperçu du titre avec emojis :</label>
                <div className="p-3 bg-blue-50 rounded">{currentTitle}</div>
              </div>
            </TabsContent>

            {/* Nouvel onglet Hashtags */}
            <TabsContent value="hashtags">
              <HashtagsTab
                fieldValue={currentDescription}
                onInsert={setCurrentDescription}
                maxLength={155}
              />
              <div className="mt-4">
                <label className="text-xs text-gray-600">Aperçu description + hashtags :</label>
                <div className="p-3 bg-green-50 rounded">{currentDescription}</div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordSuggestions;
