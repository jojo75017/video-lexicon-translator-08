import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ImageAnalysis } from '@/types/seo';
import ImagePreview from './ImagePreview';

interface ImageListProps {
  images: ImageAnalysis[];
  loadingStates: { [key: string]: 'loading' | 'success' | 'error' | null };
  onImageClick: (url: string) => void;
  formatUrl: (url: string) => string;
}

const ImageList: React.FC<ImageListProps> = ({ 
  images, 
  loadingStates, 
  onImageClick, 
  formatUrl 
}) => {
  return (
    <div className="space-y-2">
      {images.map((img, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
          <Badge variant={img.hasAlt ? "default" : "destructive"}>
            {img.hasAlt ? 'Alt: ' + img.alt : 'Sans alt'}
          </Badge>
          <ImagePreview
            url={img.url}
            loadingState={loadingStates[img.url]}
            onClick={() => onImageClick(img.url)}
            fileName={formatUrl(img.url)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageList;