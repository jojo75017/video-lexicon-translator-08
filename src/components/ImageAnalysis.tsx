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
    console.log("Tentative d'ouverture de l'image:", url);

    // Vérifier si c'est une image en base64
    if (url.startsWith('data:image')) {
      console.log("Ouverture d'une image base64");
      const win = window.open();
      if (win) {
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
                }
                button:hover {
                  background: #1d4ed8;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="Aperçu de l'image" />
              <div class="controls">
                <button onclick="window.close()">Fermer</button>
                <button onclick="document.querySelector('img').requestFullscreen()">Plein écran</button>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      } else {
        console.error("Impossible d'ouvrir la fenêtre");
        toast.error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.", {
          duration: 5000,
        });
      }
    } else {
      console.log("Ouverture d'une image depuis une URL");
      try {
        const validUrl = new URL(url);
        // Tester si l'image existe avant de l'ouvrir
        fetch(validUrl.href, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              const win = window.open(validUrl.href, '_blank');
              if (!win) {
                toast.error("Impossible d'ouvrir la fenêtre. Vérifiez que les popups sont autorisés.", {
                  duration: 5000,
                });
              }
            } else {
              throw new Error(`L'image n'est pas accessible (${response.status})`);
            }
          })
          .catch(error => {
            console.error("Erreur lors de la vérification de l'image:", error);
            toast.error(`Erreur: ${error.message}`, {
              duration: 5000,
            });
          });
      } catch (error) {
        console.error("URL invalide:", error);
        toast.error(`URL d'image invalide : ${url}`, {
          duration: 5000,
        });
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