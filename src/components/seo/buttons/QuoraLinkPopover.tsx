
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuoraLinkPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkUrl: string;
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  selectedText: { start: number; end: number; text: string };
  onApplyLink: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const QuoraLinkPopover: React.FC<QuoraLinkPopoverProps> = ({
  open,
  onOpenChange,
  linkUrl,
  setLinkUrl,
  selectedText,
  onApplyLink,
  triggerRef
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button ref={triggerRef} variant="outline" className="hidden">
          Ajouter un lien
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h3 className="font-medium">Ajouter un lien</h3>
          <p className="text-sm text-gray-500">Texte sélectionné: {selectedText.text}</p>
          <div className="flex items-center space-x-2">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1"
            />
            <Button size="sm" onClick={onApplyLink}>
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuoraLinkPopover;
