
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import PinterestPreview from './PinterestPreview';
import InstagramPreview from './InstagramPreview';
import { PinterestPin } from '@/types/pinterest';

interface PinterestPreviewCardProps {
  pin: PinterestPin;
}

const PinterestPreviewCard: React.FC<PinterestPreviewCardProps> = ({ pin }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewType, setPreviewType] = useState<'pinterest' | 'instagram'>('pinterest');

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
      link.download = `${previewType}-${pin.title.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`;
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Aperçu</h2>
        <div className="flex space-x-2">
          <Button 
            variant={previewType === 'pinterest' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewType('pinterest')}
          >
            Pinterest
          </Button>
          <Button 
            variant={previewType === 'instagram' ? 'default' : 'outline'} 
            size="sm"
            className={previewType === 'instagram' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white' : ''}
            onClick={() => setPreviewType('instagram')}
          >
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div ref={previewRef}>
          {previewType === 'pinterest' ? (
            <PinterestPreview pin={pin} />
          ) : (
            <InstagramPreview pin={pin} />
          )}
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
            const platformText = previewType === 'pinterest' ? 'Pinterest' : 'Instagram';
            navigator.clipboard.writeText(`${pin.title} - ${pin.hashtags.map(tag => `#${tag}`).join(' ')}`);
            toast.success(`Texte ${platformText} copié!`);
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copier le texte
        </Button>
      </div>
    </Card>
  );
};

export default PinterestPreviewCard;
