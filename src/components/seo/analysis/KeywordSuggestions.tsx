
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlignLeft, Tag, TrendingUp, BarChart2, Copy, Check, Smile, Hash } from 'lucide-react';
import { toast } from "sonner";
import EmojiTab from './EmojiTab';
import HashtagsTab from './HashtagsTab';

interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
  onGenerateClick?: () => void;
  fieldValue?: string;
  onInsert?: (val: string) => void;
  maxLength?: number;
  descriptionValue?: string;
  onInsertDescription?: (val: string) => void;
  maxLengthDescription?: number;
  descriptionType?: 'short' | 'long';
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  generatedKeywords,
  onGenerateClick,
  fieldValue = '',
  onInsert = () => {},
  maxLength = 60,
  descriptionValue = '',
  onInsertDescription = () => {},
  maxLengthDescription = 155,
  descriptionType = 'short'
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = React.useState('');
  const [currentDescription, setCurrentDescription] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('keywords');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copié dans le presse-papiers!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // On prend le 1er titre/desc générés pour prévisualisation ou utilise les valeurs fournies
  React.useEffect(() => {
    if (fieldValue) {
      setCurrentTitle(fieldValue);
    } else if (generatedKeywords.length > 0) {
      setCurrentTitle(generatedKeywords[0].suggestedTitle || "");
    }
    
    if (descriptionValue) {
      setCurrentDescription(descriptionValue);
    } else if (generatedKeywords.length > 0) {
      const firstKeyword = generatedKeywords[0];
      if (descriptionType === 'short') {
        setCurrentDescription(firstKeyword.suggestedShortDescription || 
                             firstKeyword.suggestedDescription || "");
      } else {
        setCurrentDescription(firstKeyword.suggestedLongDescription || 
                             firstKeyword.suggestedDescription || "");
      }
    }
  }, [generatedKeywords, fieldValue, descriptionValue, descriptionType]);

  const handleEmojiInsert = (newValue: string) => {
    setCurrentTitle(newValue);
    if (onInsert) {
      onInsert(newValue);
    }
  };

  const handleHashtagInsert = (newValue: string) => {
    setCurrentDescription(newValue);
    if (onInsertDescription) {
      onInsertDescription(newValue);
    }
  };

  // Fonction pour obtenir la description appropriée selon le type
  const getDescription = (keyword: KeywordSuggestion) => {
    if (descriptionType === 'short') {
      return keyword.suggestedShortDescription || keyword.suggestedDescription || "Non disponible";
    } else {
      return keyword.suggestedLongDescription || keyword.suggestedDescription || "Non disponible";
    }
  };
  
  // Fonction pour obtenir la longueur de la description
  const getDescriptionLength = (keyword: KeywordSuggestion) => {
    const description = getDescription(keyword);
    return description.length;
  };

  console.log("KeywordSuggestions rendu avec", generatedKeywords.length, "mots-clés");
  console.log("État actuel - titre:", currentTitle, "description:", currentDescription);
  console.log("Props:", { fieldValue, maxLength, descriptionValue, maxLengthDescription, activeTab, descriptionType });

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

        <Tabs 
          defaultValue="keywords" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-4"
        >
          <TabsList className="mb-4 grid grid-cols-5 w-full">
            <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
            <TabsTrigger value="titles">Balises Title</TabsTrigger>
            <TabsTrigger value="descriptions">Meta Descriptions</TabsTrigger>
            <TabsTrigger value="emojis">
              <Smile className="h-4 w-4 mr-1" /> Emojis
            </TabsTrigger>
            <TabsTrigger value="hashtags">
              <Hash className="h-4 w-4 mr-1" /> Hashtags
            </TabsTrigger>
          </TabsList>

          {/* Onglet Mots-clés */}
          <TabsContent value="keywords">
            {generatedKeywords.length > 0 ? (
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
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucun mot-clé généré pour le moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Titres */}
          <TabsContent value="titles">
            {generatedKeywords.length > 0 ? (
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
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucun titre généré pour le moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Descriptions */}
          <TabsContent value="descriptions">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Meta descriptions</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={descriptionType === 'short' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => descriptionType === 'long' && onInsertDescription && onInsertDescription(currentDescription)}
                >
                  Courte (155)
                </Badge>
                <Badge 
                  variant={descriptionType === 'long' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => descriptionType === 'short' && onInsertDescription && onInsertDescription(currentDescription)}
                >
                  Longue (500)
                </Badge>
              </div>
            </div>
            
            {generatedKeywords.length > 0 ? (
              <div className="space-y-3">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <AlignLeft className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-auto text-xs ${
                          getDescriptionLength(keyword) > maxLengthDescription ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {getDescriptionLength(keyword)}/{maxLengthDescription}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(getDescription(keyword), index)}
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3 bg-green-50 rounded text-sm mt-1 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {getDescription(keyword)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucune description générée pour le moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Emojis */}
          <TabsContent value="emojis">
            <EmojiTab
              fieldValue={currentTitle}
              onInsert={handleEmojiInsert}
              maxLength={maxLength}
            />
            <div className="mt-4">
              <label className="text-xs text-gray-600">Aperçu du titre avec emojis :</label>
              <div className="p-3 bg-blue-50 rounded">{currentTitle || "Entrez un titre ou générez des suggestions"}</div>
            </div>
          </TabsContent>

          {/* Onglet Hashtags */}
          <TabsContent value="hashtags">
            <HashtagsTab
              fieldValue={currentDescription}
              onInsert={handleHashtagInsert}
              maxLength={maxLengthDescription}
            />
            <div className="mt-4">
              <label className="text-xs text-gray-600">Aperçu description + hashtags :</label>
              <div className="p-3 bg-green-50 rounded">{currentDescription || "Entrez une description ou générez des suggestions"}</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KeywordSuggestions;

