
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageAnalysis } from '@/types/seo';
import { Edit2, ExternalLink, Copy, AlertCircle, ImageOff } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageDetailsProps {
  images: ImageAnalysis[];
  onImageClick: (image: ImageAnalysis) => void;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ images, onImageClick }) => {
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
  };

  const imagesWithoutAlt = images.filter(img => !img.hasAlt);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Images ({images.length})</h2>
      
      {imagesWithoutAlt.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {imagesWithoutAlt.length} image{imagesWithoutAlt.length > 1 ? 's' : ''} sans attribut alt détectée{imagesWithoutAlt.length > 1 ? 's' : ''}.
            Cela peut impacter l'accessibilité de votre site.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {images.map((img, index) => {
          const [imageError, setImageError] = React.useState(false);

          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                !img.hasAlt 
                  ? 'bg-red-50/50 hover:bg-red-50 border-red-200' 
                  : 'bg-white/50 hover:bg-white/80 border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 shrink-0 relative">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <ImageOff className="h-8 w-8 text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      alt={img.alt || "Image sans description"}
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={img.hasAlt ? "default" : "destructive"}>
                      {img.hasAlt ? 'Alt présent' : 'Sans alt'}
                    </Badge>
                    {img.hasAlt ? (
                      <span className="text-sm text-gray-600 truncate">
                        {img.alt}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600">
                        Description alternative manquante
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate mb-2">
                    {new URL(img.url).pathname}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={img.hasAlt ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => onImageClick(img)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      {img.hasAlt ? 'Modifier alt' : 'Ajouter alt'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyUrl(img.url)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copier URL
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(img.url, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ImageDetails;
