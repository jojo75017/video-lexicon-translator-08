import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
        🚀 Obtenez <span className="text-primary">100+ Prompts</span>
        <br />
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          Professionnels GRATUITS
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Téléchargez instantanément notre collection exclusive de prompts optimisés pour 
        <strong> booster votre productivité et multiplier vos résultats</strong> avec l'IA.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Badge className="bg-vibrant-blue/10 text-vibrant-blue border-vibrant-blue/20 px-4 py-2">
          ✨ 100+ Prompts Prêts à l'emploi
        </Badge>
        <Badge className="bg-vibrant-green/10 text-vibrant-green border-vibrant-green/20 px-4 py-2">
          🎯 Testés & Optimisés
        </Badge>
        <Badge className="bg-vibrant-purple/10 text-vibrant-purple border-vibrant-purple/20 px-4 py-2">
          💎 Valeur 197€ - GRATUIT
        </Badge>
      </div>
    </div>
  );
};