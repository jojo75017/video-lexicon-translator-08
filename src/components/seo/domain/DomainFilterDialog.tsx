
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minScore: number;
  setMinScore: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  domainLength: number[];
  setDomainLength: (value: number[]) => void;
  preferredExtensions: string[];
  setPreferredExtensions: (extensions: string[]) => void;
  includeNonLatin: boolean;
  setIncludeNonLatin: (include: boolean) => void;
  onGenerateWithFilters: () => void;
}

export const DomainFilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  minScore,
  setMinScore,
  maxPrice,
  setMaxPrice,
  domainLength,
  setDomainLength,
  preferredExtensions,
  setPreferredExtensions,
  includeNonLatin,
  setIncludeNonLatin,
  onGenerateWithFilters
}) => {
  const resetFilters = () => {
    setMinScore(60);
    setMaxPrice(100);
    setDomainLength([3, 20]);
    setPreferredExtensions(['.com', '.net', '.org']);
    setIncludeNonLatin(false);
  };

  const handleExtensionToggle = (ext: string) => {
    if (preferredExtensions.includes(ext)) {
      setPreferredExtensions(preferredExtensions.filter(e => e !== ext));
    } else {
      setPreferredExtensions([...preferredExtensions, ext]);
    }
  };

  const applyFilters = () => {
    toast.success("Filtres appliqués avec succès");
    onOpenChange(false);
    onGenerateWithFilters();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtres avancés pour les suggestions</DialogTitle>
          <DialogDescription>
            Personnalisez les critères pour générer des suggestions de domaines sur mesure.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Score minimum</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[minScore]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setMinScore(value[0])}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10 text-right">{minScore}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Prix maximum (€/an)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[maxPrice]}
                min={0}
                max={500}
                step={10}
                onValueChange={(value) => setMaxPrice(value[0])}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10 text-right">{maxPrice}€</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Longueur du nom (caractères)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={domainLength}
                min={1}
                max={30}
                step={1}
                onValueChange={setDomainLength}
                className="flex-1"
              />
              <span className="text-sm font-medium w-16 text-right">{domainLength[0]}-{domainLength[1]}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Extensions préférées</label>
            <div className="flex flex-wrap gap-2">
              {['.com', '.net', '.org', '.io', '.app', '.co', '.me', '.info'].map((ext) => (
                <Badge 
                  key={ext}
                  variant={preferredExtensions.includes(ext) ? "default" : "outline"}
                  className={`cursor-pointer ${preferredExtensions.includes(ext) ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                  onClick={() => handleExtensionToggle(ext)}
                >
                  {ext}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={resetFilters}
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={applyFilters}
          >
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DomainFilterDialog;
