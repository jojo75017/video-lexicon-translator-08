
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wand, Sparkles } from 'lucide-react';
import ImagePromptGenerator from '../ImagePromptGenerator';
import { toast } from 'sonner';

interface SpecialPromptButtonProps {
  currentTitle?: string;
  onPromptGenerated?: (prompt: string) => void;
}

const SpecialPromptButton: React.FC<SpecialPromptButtonProps> = ({ 
  currentTitle = '', 
  onPromptGenerated 
}) => {
  const [open, setOpen] = useState(false);

  const handlePromptGenerated = (prompt: string) => {
    if (onPromptGenerated) {
      onPromptGenerated(prompt);
    }
    setOpen(false);
    toast.success("Prompt d'image généré avec succès!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
          size="sm"
        >
          <Wand className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Générateur de Prompts</span>
          <span className="sm:hidden">Prompts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Générateur de Prompts d'Images
          </DialogTitle>
        </DialogHeader>
        <ImagePromptGenerator 
          onPromptGenerated={handlePromptGenerated}
          initialTitle={currentTitle}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SpecialPromptButton;
