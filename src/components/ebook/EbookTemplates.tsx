import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ebookTemplates, EbookTemplate } from '@/data/ebookTemplates';

interface EbookTemplatesProps {
  onApplyTemplate: (templateType: string) => void;
}

export const EbookTemplates: React.FC<EbookTemplatesProps> = ({ onApplyTemplate }) => {
  const allTemplates = Object.values(ebookTemplates);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Choisissez votre Template
        </h2>
        <p className="text-sm text-muted-foreground">
          {allTemplates.length} structures professionnelles prêtes à l'emploi
        </p>
      </div>

      {/* Templates en grille - 12 premiers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allTemplates.slice(0, 12).map((template: EbookTemplate) => (
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
            
            {/* Overlay permanent léger */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            
            {/* Badge */}
            <div className="absolute top-2 left-2 text-xl">
              {template.icon}
            </div>
            
            {/* Titre toujours visible */}
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-xs text-white font-medium line-clamp-2 drop-shadow-lg">
                {template.title.split(':')[0]}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Templates restants en liste */}
      {allTemplates.length > 12 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Autres templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allTemplates.slice(12).map((template: EbookTemplate) => (
              <Button
                key={template.id}
                variant="outline"
                onClick={() => onApplyTemplate(template.id)}
                className="w-full h-auto py-3 px-3 justify-start text-left hover:bg-primary/10"
              >
                <span className="text-lg mr-2">{template.icon}</span>
                <span className="text-sm truncate flex-1">{template.title.split(':')[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};