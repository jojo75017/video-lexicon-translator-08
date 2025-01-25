import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis as ImageAnalysisType } from '@/types/seo';
import { ExternalLink, Image, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  images: ImageAnalysisType[];
}

const ImageAnalysis: React.FC<Props> = ({ images }) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: 'loading' | 'success' | 'error' | null }>({});
  const imagesWithoutAlt = images.filter(img => !img.hasAlt);

  const setImageLoadingState = (url: string, state: 'loading' | 'success' | 'error' | null) => {
    setLoadingStates(prev => ({ ...prev, [url]: state }));
  };

  const handleImageClick = async (url: string) => {
    console.log("Tentative d'ouverture de l'image:", url);
    setImageLoadingState(url, 'loading');

    try {
      if (url.startsWith('data:image')) {
        console.log("Ouverture d'une image base64");
        openBase64Image(url);
        setImageLoadingState(url, 'success');
      } else {
        console.log("Ouverture d'une image depuis une URL");
        await openExternalImage(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture de l'image:", error);
      setImageLoadingState(url, 'error');
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ouverture de l'image", {
        duration: 5000,
      });
    }
  };

  const openBase64Image = (url: string) => {
    const win = window.open();
    if (!win) {
      throw new Error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Aperçu de l'image</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f1f5f9;
              font-family: system-ui, -apple-system, sans-serif;
            }
            img {
              max-width: 100%;
              max-height: 80vh;
              object-fit: contain;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            .controls {
              margin-top: 20px;
              display: flex;
              gap: 10px;
            }
            button {
              padding: 8px 16px;
              border-radius: 6px;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            button:hover {
              background: #1d4ed8;
            }
            .image-info {
              margin-top: 10px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <img src="${url}" alt="Aperçu de l'image" />
          <div class="image-info">
            Format: ${url.split(';')[0].split('/')[1].toUpperCase()}
          </div>
          <div class="controls">
            <button onclick="window.close()">Fermer</button>
            <button onclick="document.querySelector('img').requestFullscreen()">
              Plein écran
            </button>
            <button onclick="const img = document.querySelector('img'); img.style.transform = img.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)'">
              Rotation
            </button>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  const openExternalImage = async (url: string) => {
    const validUrl = new URL(url);
    const response = await fetch(validUrl.href, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new Error(`L'image n'est pas accessible (${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error("Le lien ne pointe pas vers une image valide");
    }

    const win = window.open(validUrl.href, '_blank');
    if (!win) {
      throw new Error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
    }
    setImageLoadingState(url, 'success');
  };

  const formatUrl = (url: string) => {
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

  const renderLoadingState = (url: string) => {
    const state = loadingStates[url];
    if (state === 'loading') return <Loader2 className="h-4 w-4 animate-spin" />;
    if (state === 'success') return <Check className="h-4 w-4 text-green-500" />;
    if (state === 'error') return <X className="h-4 w-4 text-red-500" />;
    return url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />;
  };

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse des Images</h2>
      
      {imagesWithoutAlt.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-red-500">
            Images sans attribut alt ({imagesWithoutAlt.length})
          </h3>
          <div className="space-y-2">
            {imagesWithoutAlt.map((img, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <Badge variant="destructive">Sans alt</Badge>
                <Button 
                  variant="link"
                  onClick={() => handleImageClick(img.url)}
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                >
                  {formatUrl(img.url)}
                  {renderLoadingState(img.url)}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-2">Toutes les images ({images.length})</h3>
        <div className="space-y-2">
          {images.map((img, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Badge variant={img.hasAlt ? "default" : "destructive"}>
                {img.hasAlt ? 'Alt: ' + img.alt : 'Sans alt'}
              </Badge>
              <Button 
                variant="link"
                onClick={() => handleImageClick(img.url)}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
              >
                {formatUrl(img.url)}
                {renderLoadingState(img.url)}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ImageAnalysis;