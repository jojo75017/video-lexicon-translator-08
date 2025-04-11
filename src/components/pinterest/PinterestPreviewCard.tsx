
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import PinterestPreview from './PinterestPreview';
import { PinterestPin } from '@/types/pinterest';

interface PinterestPreviewCardProps {
  pin: PinterestPin;
}

const PinterestPreviewCard: React.FC<PinterestPreviewCardProps> = ({ pin }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    try {
      toast.info("Génération de l'image en cours...");
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `pinterest-${pin.title.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = image;
      link.click();
      
      toast.success("Image téléchargée avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors de la génération de l'image");
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-4">Aperçu Pinterest</h2>
      <div className="flex justify-center">
        <div ref={previewRef}>
          <PinterestPreview pin={pin} />
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            toast.success("Lien copié!");
            // Simuler la copie d'un lien
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copier le lien
        </Button>
      </div>
    </Card>
  );
};

export default PinterestPreviewCard;
