import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ebookTemplates, EbookTemplate } from '@/data/ebookTemplates';

interface EbookTemplatesProps {
  onApplyTemplate: (templateType: string) => void;
}

export const EbookTemplates: React.FC<EbookTemplatesProps> = ({ onApplyTemplate }) => {
  return (
    <div className="space-y-4">
      {/* Header compact */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          Choisissez votre Template
        </h2>
        <p className="text-sm text-muted-foreground">
          Des structures professionnelles prêtes à l'emploi pour tous types d'ebooks
        </p>
      </div>

      {/* Templates en grille compacte */}
      <div className="grid grid-cols-3 gap-2">
        {Object.values(ebookTemplates).slice(0, 6).map((template: EbookTemplate) => (
          <button
            key={template.id}
            onClick={() => onApplyTemplate(template.id)}
            className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Image */}
            <img 
              src={template.image} 
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badge */}
            <div className="absolute top-1 left-1 text-lg">
              {template.icon}
            </div>
            
            {/* Titre sur hover */}
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs text-white font-medium line-clamp-2">
                {template.title.split(':')[0]}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Liste compacte des templates restants */}
      <div className="space-y-1.5">
        {Object.values(ebookTemplates).slice(6).map((template: EbookTemplate) => (
          <Button
            key={template.id}
            variant="ghost"
            onClick={() => onApplyTemplate(template.id)}
            className="w-full h-auto py-2 px-3 justify-start text-left hover:bg-primary/10"
          >
            <span className="text-lg mr-2">{template.icon}</span>
            <span className="text-sm truncate flex-1">{template.title.split(':')[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};