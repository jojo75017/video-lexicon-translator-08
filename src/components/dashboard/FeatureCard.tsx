
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

const FeatureCard = ({ icon: Icon, title, description, color, onClick }: FeatureCardProps) => {
  return (
    <Card 
      className={`relative group cursor-pointer overflow-hidden ${color}`}
      onClick={onClick}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
           style={{
             backgroundImage: `linear-gradient(to bottom right, ${color.includes('purple') ? '#9b87f5' : '#60a5fa'}15, transparent)`
           }} />
      
      {/* Content */}
      <div className="relative p-6 flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-xl bg-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
          <Icon className={`h-6 w-6 ${color.replace('border', 'text')}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{description}</p>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-lg" />
      </div>
    </Card>
  );
};

export default FeatureCard;
