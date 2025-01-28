import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoAnalysis } from '@/types/seo';
import { FileText } from 'lucide-react';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse SEO</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium mb-2">Balises principales</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Titre :</span> {seoAnalysis.title || 'Non défini'}</li>
            <li><span className="font-medium">Description :</span> {seoAnalysis.description || 'Non définie'}</li>
            <li>
              <span className="font-medium">Mots-clés :</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {seoAnalysis.keywords?.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                )) || 'Non définis'}
              </div>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Structure</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Nombre de H1 :</span> {seoAnalysis.h1Count || 0}</li>
            <li><span className="font-medium">Nombre de H2 :</span> {seoAnalysis.h2Count || 0}</li>
            <li><span className="font-medium">Nombre de H3 :</span> {seoAnalysis.h3Count || 0}</li>
            <li><span className="font-medium">Nombre d'images :</span> {seoAnalysis.imgCount || 0}</li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contenu
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div><span className="font-medium">Nombre de mots :</span> {seoAnalysis.wordCount || 0}</div>
          <div><span className="font-medium">Liens internes :</span> {seoAnalysis.internalLinks || 0}</div>
          <div><span className="font-medium">Liens externes :</span> {seoAnalysis.externalLinks || 0}</div>
        </div>
      </div>
    </Card>
  );
};

export default SeoResults;