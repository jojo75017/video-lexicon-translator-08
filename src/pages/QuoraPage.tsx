
import React from 'react';
import { PageHeader } from "@/components/dashboard/PageHeader";
import TabNavigation from "@/components/dashboard/TabNavigation";
import QuoraButton from "@/components/seo/buttons/QuoraButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareText, Sparkles, ExternalLink, Settings, Book, Pen } from 'lucide-react';
import { generateQuoraContent } from '@/utils/seo/quoraGenerator';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const QuoraPage = () => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [generatedExample, setGeneratedExample] = React.useState<{
    title: string;
    question: string;
    answer: string;
    topics?: string[];
  } | null>(null);
  
  const handleGenerateExample = () => {
    const example = generateQuoraContent(
      "référencement SEO",
      800,
      undefined,
      'expert'
    );
    setGeneratedExample(example);
  };

  React.useEffect(() => {
    if (!generatedExample) {
      handleGenerateExample();
    }
  }, [generatedExample]);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader 
        title="Quora - Outil de Publication" 
        description="Créez, optimisez et publiez du contenu sur Quora pour augmenter votre visibilité"
        icon={<MessageSquareText className="h-8 w-8 text-[#b92b27]" />}
      />
      
      <TabNavigation />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="flex items-center gap-2 text-[#b92b27]">
                <MessageSquareText className="h-5 w-5" />
                Outils Quora
              </CardTitle>
              <CardDescription>
                Accédez rapidement à notre suite d'outils pour Quora
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center gap-3 border-[#b92b27]/20 hover:bg-[#b92b27]/5 hover:border-[#b92b27]/30"
                >
                  <Pen className="h-10 w-10 text-[#b92b27]" />
                  <div className="text-center">
                    <p className="font-medium">Créer une question</p>
                    <p className="text-sm text-gray-500 mt-1">Posez des questions engageantes</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center gap-3 border-[#b92b27]/20 hover:bg-[#b92b27]/5 hover:border-[#b92b27]/30"
                >
                  <Book className="h-10 w-10 text-[#b92b27]" />
                  <div className="text-center">
                    <p className="font-medium">Rédiger une réponse</p>
                    <p className="text-sm text-gray-500 mt-1">Créez des réponses de qualité</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center gap-3 border-[#b92b27]/20 hover:bg-[#b92b27]/5 hover:border-[#b92b27]/30"
                >
                  <Sparkles className="h-10 w-10 text-[#b92b27]" />
                  <div className="text-center">
                    <p className="font-medium">Assistant IA</p>
                    <p className="text-sm text-gray-500 mt-1">Générez du contenu automatiquement</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center gap-3 border-[#b92b27]/20 hover:bg-[#b92b27]/5 hover:border-[#b92b27]/30"
                >
                  <Settings className="h-10 w-10 text-[#b92b27]" />
                  <div className="text-center">
                    <p className="font-medium">Paramètres avancés</p>
                    <p className="text-sm text-gray-500 mt-1">Personnalisez votre expérience</p>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 flex justify-center">
                <QuoraButton />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="flex items-center gap-2 text-[#b92b27]">
                <MessageSquareText className="h-5 w-5" />
                Fonctionnalités Quora
              </CardTitle>
              <CardDescription>
                Explorez toutes les fonctionnalités disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="tools">Outils</TabsTrigger>
                  <TabsTrigger value="examples">Exemples</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <p className="text-gray-700">
                    Notre suite d'outils Quora vous permet d'optimiser votre présence sur la plateforme
                    et d'augmenter votre visibilité en tant qu'expert dans votre domaine.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border rounded-lg flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#b92b27]/10 rounded-full flex items-center justify-center">
                        <Pen className="h-5 w-5 text-[#b92b27]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Création de questions</h3>
                        <p className="text-sm text-gray-500">Formulez des questions pertinentes qui attirent l'attention</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#b92b27]/10 rounded-full flex items-center justify-center">
                        <Book className="h-5 w-5 text-[#b92b27]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Rédaction de réponses</h3>
                        <p className="text-sm text-gray-500">Créez des réponses informatives et convaincantes</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#b92b27]/10 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-[#b92b27]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Assistant IA</h3>
                        <p className="text-sm text-gray-500">Utilisez l'IA pour générer du contenu rapidement</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#b92b27]/10 rounded-full flex items-center justify-center">
                        <Settings className="h-5 w-5 text-[#b92b27]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Paramètres avancés</h3>
                        <p className="text-sm text-gray-500">Personnalisez votre expérience Quora</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tools" className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Pen className="h-4 w-4 text-[#b92b27]" />
                        Création de questions
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Notre outil vous aide à formuler des questions pertinentes qui génèrent de l'engagement.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                        <li>Suggestions de formulations optimisées</li>
                        <li>Analyse des questions populaires sur votre sujet</li>
                        <li>Ajout de contexte pour des réponses plus pertinentes</li>
                        <li>Gestion des balises pour une meilleure visibilité</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <Book className="h-4 w-4 text-[#b92b27]" />
                        Rédaction de réponses
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Créez des réponses structurées et informatives qui établissent votre expertise.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                        <li>Formatage Markdown pour des réponses bien structurées</li>
                        <li>Intégration de liens et de sources</li>
                        <li>Outils de mise en forme avancés</li>
                        <li>Sauvegarde de modèles de réponses</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="space-y-4">
                  {generatedExample && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-[#b92b27]">{generatedExample.title}</h3>
                        <p className="italic text-gray-700 mt-1">{generatedExample.question}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Réponse générée:</h4>
                        <ScrollArea className="h-[250px] w-full rounded border p-4">
                          <div className="whitespace-pre-wrap text-sm">{generatedExample.answer}</div>
                        </ScrollArea>
                      </div>
                      
                      {generatedExample.topics && (
                        <div className="pt-2">
                          <p className="text-sm font-medium text-gray-600 mb-1">Topics suggérés:</p>
                          <div className="flex flex-wrap gap-1">
                            {generatedExample.topics.map((topic, i) => (
                              <Badge key={i} variant="outline" className="bg-[#b92b27]/5 text-[#b92b27] border-[#b92b27]/20">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 flex justify-end">
                        <Button
                          onClick={handleGenerateExample}
                          className="bg-[#b92b27] hover:bg-[#a72724] text-white"
                          size="sm"
                        >
                          <Sparkles className="mr-2 h-3 w-3" />
                          Générer un autre exemple
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="flex items-center gap-2 text-[#b92b27]">
                <ExternalLink className="h-5 w-5" />
                Liens rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux ressources Quora
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open("https://fr.quora.com", "_blank")}
                >
                  <MessageSquareText className="h-4 w-4 mr-2 text-[#b92b27]" />
                  Accéder à Quora
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open("https://fr.quora.com/profile/Georges-Boubet", "_blank")}
                >
                  <MessageSquareText className="h-4 w-4 mr-2 text-[#b92b27]" />
                  Voir mon profil Quora
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open("https://fr.quora.com/partners", "_blank")}
                >
                  <MessageSquareText className="h-4 w-4 mr-2 text-[#b92b27]" />
                  Programme Partenaires Quora
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="flex items-center gap-2 text-[#b92b27]">
                <Sparkles className="h-5 w-5" />
                Conseils Quora
              </CardTitle>
              <CardDescription>
                Améliorez votre présence sur Quora
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-[#b92b27]/5 rounded-lg">
                  <p className="font-medium">Publiez régulièrement</p>
                  <p className="text-gray-600 mt-1">La cohérence est essentielle pour développer votre audience sur Quora.</p>
                </div>
                
                <div className="p-3 bg-[#b92b27]/5 rounded-lg">
                  <p className="font-medium">Utilisez des histoires personnelles</p>
                  <p className="text-gray-600 mt-1">Les expériences personnelles rendent vos réponses plus mémorables et crédibles.</p>
                </div>
                
                <div className="p-3 bg-[#b92b27]/5 rounded-lg">
                  <p className="font-medium">Incluez des images</p>
                  <p className="text-gray-600 mt-1">Les réponses avec des images obtiennent 2x plus de vues et d'upvotes.</p>
                </div>
                
                <div className="p-3 bg-[#b92b27]/5 rounded-lg">
                  <p className="font-medium">Citez des sources</p>
                  <p className="text-gray-600 mt-1">Les sources fiables renforcent votre crédibilité et l'autorité de vos réponses.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuoraPage;
