
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link2Off, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LinkChecker from './LinkChecker';

interface BrokenLinkButtonProps {
  className?: string;
}

const BrokenLinkButton: React.FC<BrokenLinkButtonProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleOpenDialog} 
        variant="outline"
        className={`flex items-center gap-2 ${className}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Link2Off className="h-4 w-4" />
        )}
        Vérifier les liens cassés
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Vérificateur de liens cassés</DialogTitle>
            <DialogDescription>
              Vérifiez si les liens de votre site sont fonctionnels ou cassés.
            </DialogDescription>
          </DialogHeader>
          
          <LinkChecker />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrokenLinkButton;
