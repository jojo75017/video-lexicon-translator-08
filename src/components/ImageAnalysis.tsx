import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ImageAnalysis as ImageAnalysisType } from '@/types/seo';
import ImageList from './image-analysis/ImageList';
import ImageViewer from './image-analysis/ImageViewer';
import { Button } from './ui/button';
import { Download, Copy } from 'lucide-react';

interface Props {
  images: ImageAnalysisType[];
}

const ImageAnalysis: React.FC<Props> = ({ images }) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: 'loading' | 'success' | 'error' | null }>({});
  const imagesWithoutAlt = images.filter(img => !img.hasAlt);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const setImageLoadingState = (url: string, state: 'loading' | 'success' | 'error' | null) => {
    setLoadingStates(prev => ({ ...prev, [url]: state }));
  };

  const handleImageClick = async (url: string, alt?: string) => {
    console.log("Tentative d'ouverture de l'image:", url);
    setImageLoadingState(url, 'loading');
    setSelectedImage(url);

    try {
      if (url.startsWith('data:image')) {
        console.log("Ouverture d'une image base64");
        openBase64Image(url, alt);
        setImageLoadingState(url, 'success');
      } else {
        console.log("Ouverture d'une image depuis une URL");
        await openExternalImage(url, alt);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'image:", error);
      setImageLoadingState(url, 'error');
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ouverture de l'image", {
        duration: 5000,
      });
    }
  };

  const openBase64Image = (url: string, alt?: string) => {
    const win = window.open();
    if (!win) {
      throw new Error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
    }
    const htmlContent = ImageViewer({ url, alt });
    win.document.write(typeof htmlContent === 'string' ? htmlContent : htmlContent.toString());
    win.document.close();
  };

  const openExternalImage = async (url: string, alt?: string) => {
    try {
      const validUrl = new URL(url);
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${validUrl.href}`;
      
      const response = await fetch(proxyUrl, { 
        method: 'HEAD',
        headers: {
          'Origin': window.location.origin
        }
      });
      
      if (!response.ok) {
        throw new Error(`L'image n'est pas accessible (${response.status})`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error("Le lien ne pointe pas vers une image valide");
      }

      const win = window.open('', '_blank');
      if (!win) {
        throw new Error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
      }
      const htmlContent = ImageViewer({ url: validUrl.href, alt });
      win.document.write(typeof htmlContent === 'string' ? htmlContent : htmlContent.toString());
      win.document.close();
      setImageLoadingState(url, 'success');
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'image:', error);
      throw new Error("Impossible d'accéder à l'image. Vérifiez l'URL et réessayez.");
    }
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
    </Card>
  );
};

export default ImageAnalysis;