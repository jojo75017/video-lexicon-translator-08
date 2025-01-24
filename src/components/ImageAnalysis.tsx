import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis as ImageAnalysisType } from '@/types/seo';
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Props {
  images: ImageAnalysisType[];
}

const ImageAnalysis: React.FC<Props> = ({ images }) => {
  const imagesWithoutAlt = images.filter(img => !img.hasAlt);

  const handleImageClick = (url: string) => {
    try {
      // Vérifier si l'URL est valide
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error("URL d'image invalide : " + url);
    }
  };

  const formatUrl = (url: string) => {
    try {
      // Essayer de créer une URL valide
      const urlObject = new URL(url);
      return urlObject.pathname.split('/').pop() || url;
    } catch {
      // Si l'URL n'est pas valide, retourner la dernière partie du chemin
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
                  <ExternalLink className="h-4 w-4" />
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
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ImageAnalysis;