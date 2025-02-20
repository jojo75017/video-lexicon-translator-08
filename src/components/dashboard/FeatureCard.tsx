
import React from 'react';
import { Card } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, onClick }: FeatureCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="feature-card glass-card fade-in p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 rounded-full animated-gradient transform transition-transform duration-500 hover:scale-110">
          <Icon className="h-8 w-8 text-white animate-pulse" />
        </div>
        
        <h3 className="text-xl font-semibold gradient-text">
          {title}
        </h3>
        
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
