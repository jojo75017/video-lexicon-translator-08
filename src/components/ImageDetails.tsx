import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageAnalysis } from '@/types/seo';
import { Edit2, ExternalLink, Copy } from 'lucide-react';
import { toast } from "sonner";

interface ImageDetailsProps {
  images: ImageAnalysis[];
  onImageClick: (image: ImageAnalysis) => void;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ images, onImageClick }) => {
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiée dans le presse-papier");
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Images ({images.length})</h2>
      <div className="grid gap-4">
        {images.map((img, index) => (
          <div 
            key={index}
            className="p-4 bg-white/50 hover:bg-white/80 rounded-lg border border-gray-200 transition-all"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 shrink-0">
                <img
                  src={img.url}
                  alt={img.alt || "Image sans description"}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={img.hasAlt ? "default" : "destructive"}>
                    {img.hasAlt ? 'Alt présent' : 'Sans alt'}
                  </Badge>
                  {img.hasAlt && (
                    <span className="text-sm text-gray-600 truncate">
                      {img.alt}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate mb-2">
                  {new URL(img.url).pathname}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
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
        ))}
      </div>
    </Card>
  );
};

export default ImageDetails;