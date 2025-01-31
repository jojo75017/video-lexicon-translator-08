import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoAnalysis } from '@/types/seo';
import { FileText, Tag } from 'lucide-react';
import ImageDetails from './ImageDetails';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  console.log("Mots-clés reçus:", seoAnalysis.keywords); // Pour déboguer

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Analyse SEO</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Balises principales</h3>
            <ul className="space-y-4">
              <li><span className="font-medium">Titre :</span> {seoAnalysis.title || 'Non défini'}</li>
              <li><span className="font-medium">Description :</span> {seoAnalysis.description || 'Non définie'}</li>
              <li>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">Mots-clés :</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(seoAnalysis.keywords) && seoAnalysis.keywords.length > 0 ? (
                    seoAnalysis.keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">Aucun mot-clé défini</span>
                  )}
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

      <ImageDetails 
        images={seoAnalysis.imagesDetails} 
        onImageClick={handleImageClick}
      />
    </div>
  );
};

export default SeoResults;