
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Tag, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSeoTitle } from '@/utils/seo/generators/titleGenerator';
import { generateBothDescriptions } from '@/utils/seo/generators/descriptionGenerator';

const KeywordMetaPage = () => {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [activeTab, setActiveTab] = useState('short');
  
  const handleGenerate = () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    // Génération du titre
    const generatedTitle = generateSeoTitle(keyword);
    setTitle(generatedTitle);
    
    // Génération des descriptions (courte et longue)
    const { short, long } = generateBothDescriptions(keyword);
    setShortDescription(short);
    setLongDescription(long);
    
    toast.success("Suggestions générées avec succès");
  };

  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Title & Meta Description
          </h2>
          
          <div className="space-y-6">
            {/* Input pour le mot-clé */}
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot-clé principal
              </label>
              <div className="flex gap-2">
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Entrez votre mot-clé principal"
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={!keyword.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Générer
                </Button>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title Tag
                </label>
                <span className={`text-xs ${title.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                  {title.length}/60
                </span>
              </div>
              <Textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez votre balise title ici"
                className="min-h-[80px]"
              />
            </div>
            
            {/* Description avec onglets pour courte/longue */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="short" className="text-xs px-2 py-1 h-7">
                      Courte (155)
                    </TabsTrigger>
                    <TabsTrigger value="long" className="text-xs px-2 py-1 h-7">
                      Longue (500)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="mt-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="short" className="mt-0 pt-0">
                    <div className="flex justify-end mb-1">
                      <span className={`text-xs ${shortDescription.length > 155 ? 'text-red-500' : 'text-gray-500'}`}>
                        {shortDescription.length}/155
                      </span>
                    </div>
                    <Textarea
                      id="short-description"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Entrez votre meta description courte ici"
                      className="min-h-[100px]"
                    />
                  </TabsContent>
                  
                  <TabsContent value="long" className="mt-0 pt-0">
                    <div className="flex justify-end mb-1">
                      <span className={`text-xs ${longDescription.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                        {longDescription.length}/500
                      </span>
                    </div>
                    <Textarea
                      id="long-description"
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      placeholder="Entrez votre meta description longue ici"
                      className="min-h-[150px]"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Prévisualisation */}
            {(title || shortDescription || longDescription) && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Prévisualisation dans Google:</h3>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-blue-600 text-lg truncate">{title || "Titre de votre page"}</div>
                  <div className="text-green-700 text-xs">www.votresite.com › page</div>
                  <div className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {activeTab === 'short' ? shortDescription : 
                     (longDescription.length > 155 ? longDescription.substring(0, 155) + "..." : longDescription)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Conseils */}
            <Alert variant="default" className="bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Conseils:</strong> Utilisez votre mot-clé principal en début de titre et gardez une longueur entre 50-60 caractères. Pour la description courte, maintenez 120-155 caractères. La description longue (500 caractères) est utile pour les réseaux sociaux et certaines plateformes.
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default KeywordMetaPage;
