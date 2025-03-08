
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

const FeatureCard = ({ icon: Icon, title, description, onClick, className = '', color = 'blue' }: FeatureCardProps) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-300',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-300',
    violet: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-300',
    purple: 'text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-300',
    pink: 'text-pink-600 bg-pink-50 border-pink-200 hover:border-pink-300',
    fuchsia: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200 hover:border-fuchsia-300',
    rose: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-300',
  };
  
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg p-5 border transition-all duration-300 hover:shadow-md cursor-pointer ${colorClass} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-md ${color ? `bg-${color}-50` : 'bg-blue-50'}`}>
          <Icon className="h-5 w-5" />
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
