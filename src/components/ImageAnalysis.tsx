import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ImageAnalysis as ImageAnalysisType } from '@/types/seo';
import ImageList from './image-analysis/ImageList';
import { Button } from './ui/button';
import { Download, Copy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  images: ImageAnalysisType[];
}

const ImageAnalysis: React.FC<Props> = ({ images: initialImages }) => {
  const [images, setImages] = useState<ImageAnalysisType[]>(initialImages);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: 'loading' | 'success' | 'error' | null }>({});
  const [selectedImage, setSelectedImage] = useState<ImageAnalysisType | null>(null);
  const [newAltText, setNewAltText] = useState('');

  const imagesWithoutAlt = images.filter(img => !img.hasAlt);

  const setImageLoadingState = (url: string, state: 'loading' | 'success' | 'error' | null) => {
    setLoadingStates(prev => ({ ...prev, [url]: state }));
  };

  const handleImageClick = async (image: ImageAnalysisType) => {
    setSelectedImage(image);
    setNewAltText(image.alt || '');
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = formatUrl(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('URL copiée dans le presse-papier'))
      .catch(() => toast.error('Erreur lors de la copie de l\'URL'));
  };

  const handleSaveAlt = () => {
    if (selectedImage) {
      const updatedImages = images.map(img => {
        if (img.url === selectedImage.url) {
          return {
            ...img,
            alt: newAltText,
            hasAlt: newAltText.trim() !== ''
          };
        }
        return img;
      });
      
      setImages(updatedImages);
      toast.success('Balise alt mise à jour avec succès');
      setSelectedImage(null);
    }
  };

  const formatUrl = (url: string): string => {
    if (url.startsWith('data:image')) {
      const type = url.split(';')[0].split('/')[1];
      return `Image ${type.toUpperCase()}`;
    }

    try {
      const urlObject = new URL(url);
      return urlObject.pathname.split('/').pop() || url;
    } catch {
      return url.split('/').pop() || url;
    }
  };

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse des Images</h2>
      
      {imagesWithoutAlt.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-red-500">
            Images sans attribut alt ({imagesWithoutAlt.length})
          </h3>
          <ImageList
            images={imagesWithoutAlt}
            loadingStates={loadingStates}
            onImageClick={handleImageClick}
            formatUrl={formatUrl}
            onDownload={handleDownload}
            onCopyUrl={handleCopyUrl}
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-2">Toutes les images ({images.length})</h3>
        <ImageList
          images={images}
          loadingStates={loadingStates}
          onImageClick={handleImageClick}
          formatUrl={formatUrl}
          onDownload={handleDownload}
          onCopyUrl={handleCopyUrl}
        />
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Modifier l'image</DialogTitle>
            <DialogDescription>
              Visualisez l'image et modifiez sa description alt pour améliorer l'accessibilité
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="relative aspect-video">
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || "Image sans description"}
                  className="object-contain w-full h-full rounded-lg"
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="alt-text">Description alt</Label>
              <Input
                id="alt-text"
                value={newAltText}
                onChange={(e) => setNewAltText(e.target.value)}
                placeholder="Entrez une description pour l'image..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedImage(null)}>
                Annuler
              </Button>
              <Button onClick={handleSaveAlt}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ImageAnalysis;