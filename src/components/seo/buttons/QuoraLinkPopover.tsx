
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

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
  const [localLinkUrl, setLocalLinkUrl] = useState(linkUrl);

  // Update local state when prop changes
  useEffect(() => {
    setLocalLinkUrl(linkUrl);
  }, [linkUrl]);

  const handleApplyLink = () => {
    if (!localLinkUrl || !localLinkUrl.trim()) {
      toast.error("Veuillez saisir une URL valide");
      return;
    }

    // Apply protocol if missing
    let finalUrl = localLinkUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setLinkUrl(finalUrl);
    onApplyLink();
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          title="Lien"
          ref={triggerRef}
          className="bg-white"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top">
        <div className="p-4 space-y-2">
          <h4 className="font-medium">Ajouter un lien</h4>
          <p className="text-sm text-gray-500">
            Texte sélectionné: {selectedText.text.length > 30 
              ? `${selectedText.text.substring(0, 30)}...` 
              : selectedText.text || "Aucun texte sélectionné"}
          </p>
          <div className="flex gap-2">
            <Input 
              placeholder="https://exemple.com" 
              value={localLinkUrl}
              onChange={(e) => setLocalLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyLink();
                }
              }}
            />
            <Button 
              onClick={handleApplyLink}
              disabled={!selectedText.text || selectedText.text.length === 0}
            >
              Appliquer
            </Button>
          </div>
          {(!selectedText.text || selectedText.text.length === 0) && (
            <p className="text-xs text-amber-500">
              Veuillez d'abord sélectionner du texte avant d'ajouter un lien.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuoraLinkPopover;
