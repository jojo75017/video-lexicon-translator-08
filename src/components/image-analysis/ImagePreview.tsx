import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Image, Loader2, Check, X } from "lucide-react";

interface ImagePreviewProps {
  url: string;
  loadingState: 'loading' | 'success' | 'error' | null;
  onClick: () => void;
  fileName: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url, loadingState, onClick, fileName }) => {
  const renderIcon = () => {
    if (loadingState === 'loading') return <Loader2 className="h-4 w-4 animate-spin" />;
    if (loadingState === 'success') return <Check className="h-4 w-4 text-green-500" />;
    if (loadingState === 'error') return <X className="h-4 w-4 text-red-500" />;
    return url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />;
  };

  return (
    <Button 
      variant="link"
      onClick={onClick}
      className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
    >
      {fileName}
      {renderIcon()}
    </Button>
  );
};

export default ImagePreview;