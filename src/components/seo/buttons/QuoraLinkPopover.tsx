
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from 'lucide-react';

interface QuoraLinkPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  selectedText: { start: number; end: number; text: string };
  onApplyLink: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

const QuoraLinkPopover = ({
  open,
  onOpenChange,
  linkUrl,
  setLinkUrl,
  selectedText,
  onApplyLink,
  triggerRef
}: QuoraLinkPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          title="Lien"
          ref={triggerRef}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top">
        <div className="p-4 space-y-2">
          <h4 className="font-medium">Ajouter un lien</h4>
          <p className="text-sm text-gray-500">Texte sélectionné: {selectedText.text}</p>
          <div className="flex gap-2">
            <Input 
              placeholder="https://exemple.com" 
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button onClick={onApplyLink}>Appliquer</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuoraLinkPopover;
