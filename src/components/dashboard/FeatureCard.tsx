
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  onClick: () => void;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, onClick, className = '' }: FeatureCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md hover:border-blue-300 cursor-pointer ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
