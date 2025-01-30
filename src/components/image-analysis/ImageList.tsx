import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis } from '@/types/seo';
import { Button } from "@/components/ui/button";
import { Download, Copy, Image, Edit2 } from 'lucide-react';

interface ImageListProps {
  images: ImageAnalysis[];
  loadingStates: { [key: string]: 'loading' | 'success' | 'error' | null };
  onImageClick: (image: ImageAnalysis) => void;
  formatUrl: (url: string) => string;
  onDownload: (url: string) => void;
  onCopyUrl: (url: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ 
  images, 
  loadingStates, 
  onImageClick, 
  formatUrl,
  onDownload,
  onCopyUrl
}) => {
  return (
    <div className="space-y-2">
      {images.map((img, index) => (
        <div key={index} className="flex items-center justify-between gap-2 p-2 bg-white/50 hover:bg-white/80 transition-colors rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            <Badge 
              variant={img.hasAlt ? "default" : "destructive"}
              className="shrink-0"
            >
              {img.hasAlt ? 'Alt: ' + img.alt : 'Sans alt'}
            </Badge>
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={img.url} 
                alt={img.alt || "Image sans description"} 
                className="w-8 h-8 object-cover rounded"
              />
              <span className="truncate text-sm text-gray-600">
                {formatUrl(img.url)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onImageClick(img)}
              title="Modifier la description alt"
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(img.url)}
              title="Télécharger l'image"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopyUrl(img.url)}
              title="Copier l'URL"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;