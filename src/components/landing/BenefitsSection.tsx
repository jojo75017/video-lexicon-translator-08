import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Target, Gift } from 'lucide-react';

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-vibrant-blue" />,
    title: "100+ Prompts Professionnels",
    description: "Collection complète de prompts testés et optimisés"
  },
  {
    icon: <Target className="w-5 h-5 text-vibrant-purple" />,
    title: "Résultats Garantis",
    description: "Prompts créés par des experts pour des résultats maximaux"
  },
  {
    icon: <Gift className="w-5 h-5 text-vibrant-green" />,
    title: "Bonus Exclusifs",
    description: "Accès à des prompts premium et des templates avancés"
  }
];

export const BenefitsSection: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, index) => (
        <Card key={index} className="text-center glow-effect border-border/50">
          <CardContent className="pt-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              {benefit.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm">{benefit.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};