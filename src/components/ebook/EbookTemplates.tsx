import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { ebookTemplates, EbookTemplate } from '@/data/ebookTemplates';
import { cn } from '@/lib/utils';

interface EbookTemplatesProps {
  onApplyTemplate: (templateType: string) => void;
}

export const EbookTemplates: React.FC<EbookTemplatesProps> = ({ onApplyTemplate }) => {
  return (
    <div className="space-y-8">
      {/* En-tête magazine */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-magazine text-white text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          15+ Templates Professionnels
        </div>
        <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-navy-deep">
          Choisissez votre Template
        </h1>
        <p className="text-lg text-gray-cool max-w-2xl mx-auto">
          Des structures professionnelles prêtes à l'emploi pour tous types d'ebooks
        </p>
      </div>

      {/* Grille de templates magazine style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.values(ebookTemplates).map((template: EbookTemplate) => (
          <Card 
            key={template.id} 
            className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Image de template */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
              <img 
                src={template.image} 
                alt={template.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badge catégorie */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                <span className="text-2xl">{template.icon}</span>
              </div>
              
              {/* Bouton CTA sur hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button 
                  onClick={() => onApplyTemplate(template.id)}
                  className="bg-white text-primary hover:bg-white/90 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Utiliser ce template
                </Button>
              </div>
            </div>

            {/* Contenu */}
            <CardHeader className="space-y-3">
              <CardTitle className="font-playfair text-xl text-navy-deep line-clamp-2">
                {template.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-cool line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Chapitres inclus */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Chapitres inclus
                </p>
                <ul className="space-y-1.5">
                  {template.chapters.slice(0, 3).map((chapter, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="line-clamp-1">{chapter.title}</span>
                    </li>
                  ))}
                  {template.chapters.length > 3 && (
                    <li className="text-xs text-gray-500 italic ml-3">
                      +{template.chapters.length - 3} autres chapitres
                    </li>
                  )}
                </ul>
              </div>

              {/* Bouton alternatif desktop */}
              <Button 
                onClick={() => onApplyTemplate(template.id)}
                variant="outline"
                className="w-full group-hover:hidden"
              >
                Sélectionner
              </Button>
            </CardContent>

            {/* Bordure colorée */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-1",
              template.borderColor.replace('border-l-', 'bg-')
            )} />
          </Card>
        ))}
      </div>
    </div>
  );
};