
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import QuoraLinkPopover from './QuoraLinkPopover';
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks, useFormatting } from './QuoraHooks';
import { popularQuestions } from './QuoraConstants';

export const QuoraButton = () => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [questionSource, setQuestionSource] = useState<"popular" | "custom">("popular");
  const quoraProfileUrl = "https://fr.quora.com/profile/Georges-Boubet";

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
            className="flex flex-row items-center gap-2 py-3 px-4 text-center"
          >
            <MessageSquareText className="h-5 w-5" />
            <span>Utiliser Quora</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Quora - Questions & Réponses</DialogTitle>
            <DialogDescription>
              Sélectionnez une question populaire ou saisissez votre propre question
            </DialogDescription>
          </DialogHeader>
          
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="ask">Poser une question</TabsTrigger>
              <TabsTrigger value="answer">Répondre à une question</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ask" className="space-y-4">
              <QuoraQuestionForm
                form={askForm}
                textDetails={textDetails}
                setTextDetails={setTextDetails}
                handleTextSelection={handleTextSelection}
                applyFormatting={applyFormatting}
                onSubmit={handleQuoraSubmit}
              />
            </TabsContent>
            
            <TabsContent value="answer" className="space-y-4">
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
          </Tabs>
          
          {/* This is a shared popover that appears when needed */}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoraButton;
