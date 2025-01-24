import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis as ImageAnalysisType } from '@/types/seo';
import { ExternalLink, Image } from "lucide-react";
import { toast } from "sonner";

interface Props {
  images: ImageAnalysisType[];
}

const ImageAnalysis: React.FC<Props> = ({ images }) => {
  const imagesWithoutAlt = images.filter(img => !img.hasAlt);

  const handleImageClick = (url: string) => {
    // Vérifier si c'est une image en base64
    if (url.startsWith('data:image')) {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Aperçu de l'image</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #f1f5f9;
                }
                img {
                  max-width: 100%;
                  max-height: 100vh;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="Aperçu de l'image" />
            </body>
          </html>
        `);
        win.document.close(); // Important pour finaliser le chargement
      } else {
        toast.error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
      }
    } else {
      try {
        // Pour les URLs normales, on vérifie d'abord si l'URL est valide
        const validUrl = new URL(url);
        const win = window.open(validUrl.href, '_blank');
        if (!win) {
          toast.error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.");
        }
      } catch (error) {
        toast.error("URL d'image invalide : " + url);
      }
    }
  };

  const formatUrl = (url: string) => {
    // Si c'est une image en base64
    if (url.startsWith('data:image')) {
      const type = url.split(';')[0].split('/')[1];
      return `Image ${type.toUpperCase()}`;
    }

    try {
      // Pour les URLs normales
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
          <div className="space-y-2">
            {imagesWithoutAlt.map((img, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <Badge variant="destructive">Sans alt</Badge>
                <button 
                  onClick={() => handleImageClick(img.url)}
                  className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {formatUrl(img.url)}
                  {img.url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                </button>
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
              <button 
                onClick={() => handleImageClick(img.url)}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {formatUrl(img.url)}
                {img.url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ImageAnalysis;