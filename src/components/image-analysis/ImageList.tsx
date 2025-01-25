import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis } from '@/types/seo';
import ImagePreview from './ImagePreview';
import { Button } from "@/components/ui/button";
import { Download, Copy } from 'lucide-react';

interface ImageListProps {
  images: ImageAnalysis[];
  loadingStates: { [key: string]: 'loading' | 'success' | 'error' | null };
  onImageClick: (url: string, alt?: string) => void;
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
        <div key={index} className="flex items-center justify-between gap-2 p-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
          <div className="flex items-center gap-2 flex-grow">
            <Badge variant={img.hasAlt ? "default" : "destructive"}>
              {img.hasAlt ? 'Alt: ' + img.alt : 'Sans alt'}
            </Badge>
            <ImagePreview
              url={img.url}
              loadingState={loadingStates[img.url]}
              onClick={() => onImageClick(img.url, img.alt)}
              fileName={formatUrl(img.url)}
            />
          </div>
          <div className="flex gap-2">
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