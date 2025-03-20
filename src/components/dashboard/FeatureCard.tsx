
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

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  className = '', 
  color = 'blue' 
}: FeatureCardProps) => {
  
  // Enhanced professional color palette with subtle gradients
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 hover:bg-blue-100 hover:from-blue-100 hover:to-blue-200',
    indigo: 'text-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100 hover:from-indigo-100 hover:to-indigo-200',
    violet: 'text-violet-700 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:border-violet-300 hover:bg-violet-100 hover:from-violet-100 hover:to-violet-200',
    purple: 'text-purple-700 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 hover:bg-purple-100 hover:from-purple-100 hover:to-purple-200',
    pink: 'text-pink-700 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:border-pink-300 hover:bg-pink-100 hover:from-pink-100 hover:to-pink-200',
    fuchsia: 'text-fuchsia-700 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-fuchsia-200 hover:border-fuchsia-300 hover:bg-fuchsia-100 hover:from-fuchsia-100 hover:to-fuchsia-200',
    rose: 'text-rose-700 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:border-rose-300 hover:bg-rose-100 hover:from-rose-100 hover:to-rose-200',
  };
  
  const colorClass = colorClasses[color] || colorClasses.blue;
  
  return (
    <div 
      className={`rounded-lg p-5 border transition-all duration-300 hover:shadow-lg ${colorClass} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-md bg-white/80 shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
