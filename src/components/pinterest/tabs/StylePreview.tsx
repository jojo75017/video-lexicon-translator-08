
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
  // Obtenir des URL d'exemples selon le style
  const getStyleExampleImage = (): string => {
    switch (style) {
      case 'photo-realistic':
        return 'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=500&auto=format&fit=crop';
      case 'illustration':
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop';
      case 'digital-art':
        return 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=500&auto=format&fit=crop';
      case 'minimalistic':
        return 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=500&auto=format&fit=crop';
      case 'vintage':
        return 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=500&auto=format&fit=crop';
      case 'watercolor':
        return 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=500&auto=format&fit=crop';
      case 'sketch':
        return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop';
      case 'oil-painting':
        return 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?q=80&w=500&auto=format&fit=crop';
      case 'pop-art':
        return 'https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=500&auto=format&fit=crop';
      case 'anime':
        return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop';
    }
  };

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
      case 'watercolor':
        return 'bg-gradient-to-r from-blue-300 to-purple-300';
      case 'sketch':
        return 'bg-gradient-to-r from-gray-300 to-blue-200';
      case 'oil-painting':
        return 'bg-gradient-to-r from-amber-500 to-orange-600';
      case 'pop-art':
        return 'bg-gradient-to-r from-pink-500 to-yellow-500';
      case 'anime':
        return 'bg-gradient-to-r from-indigo-400 to-purple-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
      <div className="relative h-28">
        <div className={`absolute inset-0 ${getPreviewStyle()} opacity-80`}></div>
        <img 
          src={getStyleExampleImage()} 
          alt={`Style ${label}`} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-40 p-2 rounded">
            <h3 className="text-white font-bold text-center">{label}</h3>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Card>
  );
};

export default StylePreview;
