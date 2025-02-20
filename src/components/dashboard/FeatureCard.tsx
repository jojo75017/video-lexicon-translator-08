
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
      className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-white rounded-xl shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-100 rounded-lg transition-colors duration-300" />
    </Card>
  );
};

export default FeatureCard;
