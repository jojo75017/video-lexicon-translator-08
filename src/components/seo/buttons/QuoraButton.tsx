
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquareText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoraLinkPopover from './QuoraLinkPopover';
import QuoraQuestionForm from './QuoraQuestionForm';
import QuoraAnswerForm from './QuoraAnswerForm';
import { useQuoraHooks, useFormatting } from './QuoraHooks';
import { popularQuestions } from './QuoraConstants';

export const QuoraButton = () => {
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
