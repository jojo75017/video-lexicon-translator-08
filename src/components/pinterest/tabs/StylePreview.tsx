
import React from 'react';
import { Card } from '@/components/ui/card';

interface StylePreviewProps {
  style: string;
  label: string;
  description: string;
}

const StylePreview: React.FC<StylePreviewProps> = ({
  style,
  label,
  description
}) => {
  const getPreviewStyle = () => {
    switch (style) {
      case 'photo-realistic':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'illustration':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'digital-art':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      case 'minimalistic':
        return 'bg-gradient-to-r from-gray-200 to-gray-400';
      case 'vintage':
        return 'bg-gradient-to-r from-amber-200 to-yellow-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className={`p-4 ${getPreviewStyle()} text-white hover:scale-105 transition-transform cursor-pointer`}>
      <h3 className="font-bold mb-1">{label}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </Card>
  );
};

export default StylePreview;
