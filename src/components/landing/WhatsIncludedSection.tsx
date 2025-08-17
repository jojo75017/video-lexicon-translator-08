import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const includedItems = [
  "25 Prompts Business & Entrepreneuriat",
  "25 Prompts Marketing & Copywriting", 
  "25 Prompts Développement Personnel",
  "25 Prompts Voyage & Aventure",
  "Templates prêts à copier-coller",
  "Guide d'utilisation avancée"
];

export const WhatsIncludedSection: React.FC = () => {
  return (
    <Card className="mb-12 bg-gradient-success/10 border-success/20">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-foreground">
          🎁 Ce que vous recevez (Valeur 197€)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {includedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};