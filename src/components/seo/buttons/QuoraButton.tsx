
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText, ExternalLink, ArrowRightCircle, Sparkles, X, Copy, Check, Settings, Star, BookOpen, Pencil, Save, Undo, Redo, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import QuoraLinkPopover from './QuoraLinkPopover';
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks, useFormatting } from './QuoraHooks';
import { popularQuestions } from './QuoraConstants';
import { generateQuoraContent } from '@/utils/seo/quoraGenerator';

export const QuoraButton = () => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [questionSource, setQuestionSource] = useState<"popular" | "custom">("popular");
  const quoraProfileUrl = "https://fr.quora.com/profile/Georges-Boubet";
  const [contentStyle, setContentStyle] = useState<'professional' | 'conversational' | 'expert' | 'storytelling'>('expert');
  const [keywordInput, setKeywordInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{title: string; question: string; answer: string; topics?: string[]} | null>(null);
  const [currentTab, setCurrentTab] = useState("create");
  const [isCopied, setIsCopied] = useState(false);

  const {
    activeTab,
    setActiveTab,
    textDetails,
    setTextDetails,
    textAnswer,
    setTextAnswer,
    textSources,
    setTextSources,
    selectedText,
    setSelectedText,
    showLinkPopover,
    setShowLinkPopover,
    linkUrl,
    setLinkUrl,
    open,
    setOpen,
    linkButtonRef,
    activeTextareaType,
    setActiveTextareaType,
    askForm,
    answerForm,
    handleQuoraSubmit,
    handleQuoraAnswerSubmit
  } = useQuoraHooks();

  const {
    handleTextSelection,
    applyFormatting: applyFormattingBase,
    handleApplyLink
  } = useFormatting(
    activeTextareaType,
    setActiveTextareaType,
    selectedText,
    setSelectedText,
    textDetails,
    setTextDetails,
    textAnswer,
    setTextAnswer,
    textSources,
    setTextSources,
    linkUrl
  );

  const applyFormatting = (fieldType: 'details' | 'answer' | 'sources', format: 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'list' | 'numbered-list' | 'quote') => {
    const shouldShowLinkPopover = applyFormattingBase(fieldType, format);
    if (shouldShowLinkPopover) {
      setShowLinkPopover(true);
    }
  };

  // Update the form when questionSource or selected/custom question changes
  useEffect(() => {
    let currentQuestion = "";
    
    if (questionSource === "popular") {
      currentQuestion = selectedQuestion;
    } else {
      currentQuestion = customQuestion;
    }
    
    if (currentQuestion) {
      if (activeTab === "answer") {
        answerForm.setValue("questionToAnswer", currentQuestion);
      } else {
        askForm.setValue("question", currentQuestion);
      }
    }
  }, [questionSource, selectedQuestion, customQuestion, activeTab, answerForm, askForm]);

  const handleQuestionSelect = (value: string) => {
    setSelectedQuestion(value);
    setQuestionSource("popular");
    setCustomQuestion(""); // Clear custom question when selecting from dropdown
  };

  const handleCustomQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomQuestion(value);
    setQuestionSource("custom");
    setSelectedQuestion(""); // Clear dropdown selection when typing custom question
  };

  const openQuoraProfile = () => {
    window.open(quoraProfileUrl, '_blank');
  };

  const handleGenerateContent = () => {
    if (!keywordInput.trim()) {
      toast.error("Veuillez saisir un mot-clé");
      return;
    }
    
    const content = generateQuoraContent(
      keywordInput.trim(),
      800,
      undefined,
      contentStyle
    );
    
    setGeneratedContent(content);
    toast.success("Contenu Quora généré avec succès!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copié dans le presse-papiers!");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const previewStyles = [
    { id: 'professional', label: 'Professionnel', description: 'Ton formel et informatif, données concrètes', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'conversational', label: 'Conversationnel', description: 'Ton amical et accessible, comme une discussion', icon: <MessageSquareText className="h-4 w-4" /> },
    { id: 'expert', label: 'Expert', description: 'Ton autoritaire, analyses pointues, données recherchées', icon: <Star className="h-4 w-4" /> },
    { id: 'storytelling', label: 'Storytelling', description: 'Récit personnel, expérience vécue, émotionnel', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex flex-row items-center gap-2 py-3 px-4 text-center border-[#b92b27] text-[#b92b27] hover:bg-[#b92b27]/10"
        onClick={openQuoraProfile}
      >
        <ExternalLink className="h-5 w-5" />
        <span>Mon Profil Quora</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="quora"
            className="flex flex-row items-center gap-2 py-3 px-4 text-center relative overflow-hidden group"
          >
            <MessageSquareText className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Utiliser Quora</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#b92b27]/80 to-[#8B5CF6]/80 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-300 animate-pulse" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#b92b27]">
              <MessageSquareText className="h-5 w-5" />
              Quora - Assistant de Publication
            </DialogTitle>
            <DialogDescription>
              Créez des questions ou réponses de haute qualité pour Quora et augmentez votre visibilité sur la plateforme
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Créer du contenu
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Assistant IA
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Outils avancés
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Questions populaires</label>
                  <Select 
                    onValueChange={handleQuestionSelect} 
                    value={questionSource === "popular" ? selectedQuestion : ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une question populaire..." />
                    </SelectTrigger>
                    <SelectContent>
                      {popularQuestions.map((question, index) => (
                        <SelectItem key={index} value={question}>
                          {question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Ou entrez votre propre question</label>
                  <Input
                    value={customQuestion}
                    onChange={handleCustomQuestionChange}
                    placeholder="Saisissez une question personnalisée..."
                    className="w-full"
                  />
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="ask">Poser une question</TabsTrigger>
                  <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="flex-1">
                  <TabsContent value="ask" className="space-y-4 p-1">
                    <QuoraQuestionForm
                      form={askForm}
                      textDetails={textDetails}
                      setTextDetails={setTextDetails}
                      handleTextSelection={handleTextSelection}
                      applyFormatting={applyFormatting}
                      onSubmit={handleQuoraSubmit}
                    />
                  </TabsContent>
                  
                  <TabsContent value="answer" className="space-y-4 p-1">
                    <QuoraAnswerForm
                      form={answerForm}
                      popularQuestions={popularQuestions}
                      textAnswer={textAnswer}
                      setTextAnswer={setTextAnswer}
                      textSources={textSources}
                      setTextSources={setTextSources}
                      handleTextSelection={handleTextSelection}
                      applyFormatting={applyFormatting}
                      onSubmit={handleQuoraAnswerSubmit}
                    />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Saisissez votre mot-clé principal</label>
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Ex: SEO, Marketing d'influence, Growth Hacking..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Style de contenu</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {previewStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col gap-1 ${
                          contentStyle === style.id 
                            ? 'border-[#b92b27] bg-[#b92b27]/5 shadow-sm' 
                            : 'border-gray-200 hover:border-[#b92b27]/30 hover:bg-[#b92b27]/5'
                        }`}
                        onClick={() => setContentStyle(style.id as any)}
                      >
                        <div className="flex items-center gap-2">
                          {style.icon}
                          <span className="font-medium">{style.label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{style.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateContent}
                  className="w-full bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] hover:from-[#a72724] hover:to-[#7849e0] text-white"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer du contenu Quora
                </Button>
              </div>
              
              {generatedContent && (
                <Card className="mt-4 border-[#b92b27]/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{generatedContent.title}</CardTitle>
                        <CardDescription>Question générée pour Quora</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${generatedContent.title}\n\n${generatedContent.question}\n\n${generatedContent.answer}`
                        )}
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1">Question:</h4>
                      <p className="text-sm">{generatedContent.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1 flex items-center justify-between">
                        <span>Réponse:</span>
                        <button 
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => {
                            setActiveTab("answer");
                            answerForm.setValue("questionToAnswer", generatedContent.question);
                            setTextAnswer(generatedContent.answer);
                            setCurrentTab("create");
                          }}
                        >
                          Utiliser dans l'éditeur
                        </button>
                      </h4>
                      <ScrollArea className="h-[200px] w-full rounded border p-2">
                        <div className="whitespace-pre-wrap text-sm">{generatedContent.answer}</div>
                      </ScrollArea>
                    </div>
                    
                    {generatedContent.topics && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-500 mb-1">Topics suggérés:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {generatedContent.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="bg-[#b92b27]/5 text-[#b92b27] border-[#b92b27]/20">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGeneratedContent(null)}
                    >
                      <X className="mr-2 h-3 w-3" />
                      Effacer
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#b92b27] to-[#8B5CF6] hover:from-[#a72724] hover:to-[#7849e0] text-white"
                      size="sm"
                      onClick={openQuoraProfile}
                    >
                      Publier sur Quora
                      <ArrowRightCircle className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Outils avancés pour Quora</CardTitle>
                  <CardDescription>Fonctionnalités supplémentaires pour maximiser votre impact sur Quora</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Save className="h-5 w-5 text-[#b92b27]" />
                        <h3 className="font-medium">Modèles enregistrés</h3>
                      </div>
                      <p className="text-sm text-gray-500">Accédez à vos modèles de réponses sauvegardés</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-5 w-5 text-[#b92b27]" />
                        <h3 className="font-medium">Préférences</h3>
                      </div>
                      <p className="text-sm text-gray-500">Personnalisez vos paramètres Quora</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Undo className="h-5 w-5 text-[#b92b27]" />
                        <h3 className="font-medium">Historique</h3>
                      </div>
                      <p className="text-sm text-gray-500">Consultez vos questions et réponses précédentes</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Redo className="h-5 w-5 text-[#b92b27]" />
                        <h3 className="font-medium">Analytics</h3>
                      </div>
                      <p className="text-sm text-gray-500">Suivez les performances de vos publications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <h3 className="font-medium">Bonnes pratiques Quora</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 items-start">
                    <div className="bg-[#b92b27] text-white rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <p>Répondez aux questions qui correspondent à votre expertise pour établir votre autorité</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="bg-[#b92b27] text-white rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <p>Utilisez des histoires personnelles pour rendre vos réponses mémorables et uniques</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="bg-[#b92b27] text-white rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <p>Incluez des données et statistiques pour renforcer la crédibilité de vos réponses</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="bg-[#b92b27] text-white rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                    <p>Publiez régulièrement pour maintenir une présence active et augmenter votre visibilité</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Use a conditional render for the link popover */}
          {showLinkPopover && (
            <QuoraLinkPopover
              open={showLinkPopover}
              onOpenChange={setShowLinkPopover}
              linkUrl={linkUrl}
              setLinkUrl={setLinkUrl}
              selectedText={selectedText}
              onApplyLink={() => handleApplyLink(linkUrl)}
              triggerRef={linkButtonRef}
            />
          )}
          
          <DialogFooter className="flex justify-between items-center border-t pt-2 mt-2">
            <div className="flex items-center">
              <Badge variant="outline" className="text-[#b92b27] border-[#b92b27]/20 bg-[#b92b27]/5">Quora</Badge>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="text-xs text-gray-500">Améliorez votre visibilité sur Quora</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoraButton;
