
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

  const handleQuestionSelect = (value: string) => {
    setSelectedQuestion(value);
    setQuestionSource("popular");
    
    if (activeTab === "answer") {
      // Si on est dans l'onglet "répondre", on met à jour le formulaire avec la question sélectionnée
      answerForm.setValue("questionToAnswer", value);
    } else {
      // Si on est dans l'onglet "poser une question", on adapte ce champ
      askForm.setValue("question", value);
    }
  };

  const handleCustomQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomQuestion(value);
    setQuestionSource("custom");
    
    if (activeTab === "answer") {
      answerForm.setValue("questionToAnswer", value);
    } else {
      askForm.setValue("question", value);
    }
  };

  return (
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
        </DialogHeader>
        
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Questions populaires</label>
            <Select onValueChange={handleQuestionSelect} value={questionSource === "popular" ? selectedQuestion : ""}>
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
              value={questionSource === "custom" ? customQuestion : ""}
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
  );
};

export default QuoraButton;
