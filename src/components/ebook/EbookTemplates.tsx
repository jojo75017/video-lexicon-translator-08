import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { ebookTemplates, EbookTemplate } from '@/data/ebookTemplates';

interface EbookTemplatesProps {
  onApplyTemplate: (templateType: string) => void;
}

export const EbookTemplates: React.FC<EbookTemplatesProps> = ({ onApplyTemplate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Templates d'Ebook
        </CardTitle>
        <CardDescription>
          Utilisez ces templates prédéfinis pour démarrer rapidement votre ebook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(ebookTemplates).map((template: EbookTemplate) => (
            <Card key={template.id} className={`border-l-4 ${template.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex gap-4">
                  <div className="w-20 h-28 rounded overflow-hidden border bg-muted">
                    <img 
                      src={template.image} 
                      alt={`Template ${template.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {template.icon} Template {template.id}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={() => onApplyTemplate(template.id)}
                        variant="outline"
                        size="sm"
                      >
                        Utiliser ce template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">
                  <strong>Chapitres inclus :</strong>
                  <ul className="mt-2 space-y-1">
                    {template.chapters.slice(0, 5).map((chapter, index) => (
                      <li key={index} className="ml-4">• {chapter.title}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};