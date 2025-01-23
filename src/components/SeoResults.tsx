import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeadingStructure {
  text: string;
  level: number;
  position: number;
}

interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingStructure[];
  imgCount: number;
  imgWithoutAlt: number;
  metaTagsCount: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: number;
}

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const getStatusColor = (count: number, type: string) => {
    if (type === 'h1' && count !== 1) return 'text-red-500';
    if (type === 'img' && count > 0) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusExplanation = (count: number, type: string) => {
    if (type === 'h1') {
      if (count === 0) return "❌ Aucun H1 trouvé - Important pour le SEO";
      if (count > 1) return "❌ Plusieurs H1 trouvés - Un seul H1 est recommandé";
      return "✅ Parfait - Un seul H1 présent";
    }
    if (type === 'img') {
      if (count === 0) return "✅ Toutes les images ont des attributs alt";
      return `❌ ${count} images sans attribut alt - Important pour l'accessibilité`;
    }
    return "";
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse SEO</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium mb-2">Balises principales</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Titre :</span> {seoAnalysis.title}</li>
            <li><span className="font-medium">Description :</span> {seoAnalysis.description || 'Non définie'}</li>
            <li><span className="font-medium">URL Canonique :</span> {seoAnalysis.canonicalUrl || 'Non définie'}</li>
            <li><span className="font-medium">Meta Robots :</span> {seoAnalysis.robotsMeta || 'Non définie'}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2">Statistiques</h3>
          <ul className="space-y-2">
            <li className={getStatusColor(seoAnalysis.h1Count, 'h1')}>
              <span className="font-medium">Nombre de H1 :</span> {seoAnalysis.h1Count}
              <div className="text-sm mt-1">{getStatusExplanation(seoAnalysis.h1Count, 'h1')}</div>
            </li>
            <li><span className="font-medium">Nombre de H2 :</span> {seoAnalysis.h2Count || 0}</li>
            <li><span className="font-medium">Nombre de H3 :</span> {seoAnalysis.h3Count || 0}</li>
            <li><span className="font-medium">Nombre d'images :</span> {seoAnalysis.imgCount}</li>
            <li className={getStatusColor(seoAnalysis.imgWithoutAlt, 'img')}>
              <span className="font-medium">Images sans alt :</span> {seoAnalysis.imgWithoutAlt}
              <div className="text-sm mt-1">{getStatusExplanation(seoAnalysis.imgWithoutAlt, 'img')}</div>
            </li>
            <li><span className="font-medium">Nombre de meta tags :</span> {seoAnalysis.metaTagsCount}</li>
            <li><span className="font-medium">Liens morts détectés :</span> {seoAnalysis.brokenLinks}</li>
          </ul>
        </div>
      </div>

      {seoAnalysis.headings && seoAnalysis.headings.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Structure des titres</h3>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            {seoAnalysis.headings.map((heading, index) => (
              <div 
                key={index}
                style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
                className="flex items-center gap-2"
              >
                <Badge variant={heading.level === 1 ? "default" : "secondary"}>
                  H{heading.level}
                </Badge>
                <span>{heading.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SeoResults;