import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { getAllBDTemplates, BDTemplate } from '@/data/bdTemplates';

interface BDTemplatesSelectorProps {
  onApplyTemplate: (template: BDTemplate) => void;
}

export const BDTemplatesSelector: React.FC<BDTemplatesSelectorProps> = ({ onApplyTemplate }) => {
  const templates = getAllBDTemplates();

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Templates BD Franco-Belges
          <Badge className="bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs">
            Nouveau
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Styles classiques inspirés de Tintin, Astérix, Lucky Luke, Schtroumpfs…
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onApplyTemplate(template)}
              className="group relative flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-left"
            >
              <span className="text-3xl">{template.icon}</span>
              <div className="text-center">
                <p className="text-xs font-semibold line-clamp-2">{template.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  Style {template.inspiration}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {template.numberOfPages}p
              </Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
