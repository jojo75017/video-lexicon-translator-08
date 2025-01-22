import React from 'react';
import { Card } from "@/components/ui/card";

interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
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
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analyse SEO</h2>
      <div className="grid gap-4 md:grid-cols-2">
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
            <li><span className="font-medium">Nombre de H1 :</span> {seoAnalysis.h1Count}</li>
            <li><span className="font-medium">Nombre d'images :</span> {seoAnalysis.imgCount}</li>
            <li><span className="font-medium">Images sans alt :</span> {seoAnalysis.imgWithoutAlt}</li>
            <li><span className="font-medium">Nombre de meta tags :</span> {seoAnalysis.metaTagsCount}</li>
            <li><span className="font-medium">Liens morts détectés :</span> {seoAnalysis.brokenLinks}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SeoResults;