
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
      className={`group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 ${color}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`p-3 rounded-xl transform transition-all duration-300 group-hover:scale-110 ${color.replace('border', 'bg').replace('500', '100')}`}>
          <Icon className={`h-6 w-6 ${color.replace('border', 'text').replace('500', '600')}`} />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 hidden lg:block">{description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;
