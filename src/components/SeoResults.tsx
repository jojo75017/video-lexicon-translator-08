import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoAnalysis, ImageAnalysis as ImageAnalysisType, BacklinkInfo } from '@/types/seo';
import ImageAnalysis from './ImageAnalysis';
import { FileText, Link2, Shield, Gauge, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis: initialSeoAnalysis }: SeoResultsProps) => {
  const [seoAnalysis, setSeoAnalysis] = useState(initialSeoAnalysis);
  const [showBacklinks, setShowBacklinks] = useState(false);

  const handleUpdateImages = (updatedImages: ImageAnalysisType[]) => {
    setSeoAnalysis(prev => ({
      ...prev,
      imagesDetails: updatedImages,
      imgWithoutAlt: updatedImages.filter(img => !img.hasAlt).length
    }));
  };

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

  const getAuthorityScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const k = bytes / 1024;
    if (k < 1024) return k.toFixed(2) + ' KB';
    const m = k / 1024;
    return m.toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
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
              <li>
                <span className="font-medium">Position Google :</span>{' '}
                {seoAnalysis.googlePosition ? 
                  <Badge variant={seoAnalysis.googlePosition <= 10 ? "default" : "secondary"}>
                    {seoAnalysis.googlePosition}
                  </Badge> 
                  : 'Non disponible'}
              </li>
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

        <div className="mt-6">
          <h3 className="font-medium mb-2">Métriques SEO avancées</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Authority Score</div>
              <div className={`text-2xl font-bold ${getAuthorityScoreColor(seoAnalysis.authorityScore)}`}>
                {seoAnalysis.authorityScore}/100
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Trafic Organique</div>
              <div className="text-2xl font-bold text-blue-600">
                {seoAnalysis.organicTraffic.toLocaleString()} visites/mois
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Backlinks</div>
              <div className="text-2xl font-bold text-purple-600">
                {seoAnalysis.backlinks.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Ratio Texte/HTML</div>
              <div className="text-2xl font-bold text-emerald-600">
                {seoAnalysis.textToHtmlRatio}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenu
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div><span className="font-medium">Nombre de mots :</span> {seoAnalysis.wordCount}</div>
              <div><span className="font-medium">Liens internes :</span> {seoAnalysis.internalLinks}</div>
              <div><span className="font-medium">Liens externes :</span> {seoAnalysis.externalLinks}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Méta-données sociales
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-medium">Open Graph :</span>
                {seoAnalysis.socialMetaTags.ogTitle ? "✅" : "❌"} Titre
                {seoAnalysis.socialMetaTags.ogDescription ? "✅" : "❌"} Description
                {seoAnalysis.socialMetaTags.ogImage ? "✅" : "❌"} Image
              </div>
              <div>
                <span className="font-medium">Twitter Card :</span>
                {seoAnalysis.socialMetaTags.twitterCard ? "✅" : "❌"} Card
                {seoAnalysis.socialMetaTags.twitterTitle ? "✅" : "❌"} Titre
                {seoAnalysis.socialMetaTags.twitterImage ? "✅" : "❌"} Image
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>{seoAnalysis.securityHeaders.https ? "✅" : "❌"} HTTPS</div>
              <div>{seoAnalysis.securityHeaders.hsts ? "✅" : "❌"} HSTS</div>
              <div>{seoAnalysis.securityHeaders.xFrameOptions ? "✅" : "❌"} X-Frame-Options</div>
              <div>{seoAnalysis.securityHeaders.contentSecurityPolicy ? "✅" : "❌"} Content Security Policy</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Performance
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div><span className="font-medium">Taille totale :</span> {formatBytes(seoAnalysis.performance.totalSize * 1024)}</div>
              <div><span className="font-medium">Scripts :</span> {seoAnalysis.performance.scriptCount}</div>
              <div><span className="font-medium">Styles :</span> {seoAnalysis.performance.styleCount}</div>
              <div><span className="font-medium">Temps de réponse :</span> {Math.round(seoAnalysis.performance.responseTime)}ms</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Analyse des Backlinks</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Total Backlinks</div>
              <div className="text-2xl font-bold text-purple-600">
                {seoAnalysis.backlinks.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Backlinks DoFollow</div>
              <div className="text-2xl font-bold text-green-600">
                {seoAnalysis.doFollowBacklinks.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-1">Backlinks NoFollow</div>
              <div className="text-2xl font-bold text-orange-600">
                {seoAnalysis.noFollowBacklinks.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Top 10 Domaines Sources</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domaine</TableHead>
                    <TableHead className="text-right">Nombre de Backlinks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoAnalysis.topBacklinkDomains.map((domain, index) => (
                    <TableRow key={index}>
                      <TableCell>{domain.domain}</TableCell>
                      <TableCell className="text-right">{domain.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowBacklinks(!showBacklinks)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showBacklinks ? "Masquer les détails" : "Voir tous les backlinks"}
            </button>

            {showBacklinks && (
              <div className="mt-2 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Texte d'ancrage</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Autorité</TableHead>
                      <TableHead>Première détection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seoAnalysis.backlinkDetails.map((backlink, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <a
                            href={backlink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            {backlink.domain}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </TableCell>
                        <TableCell>{backlink.anchorText}</TableCell>
                        <TableCell>
                          <Badge variant={backlink.isDoFollow ? "default" : "secondary"}>
                            {backlink.isDoFollow ? "DoFollow" : "NoFollow"}
                          </Badge>
                        </TableCell>
                        <TableCell>{backlink.authority}/100</TableCell>
                        <TableCell>{formatDate(backlink.firstSeen)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
      
      <ImageAnalysis 
        images={seoAnalysis.imagesDetails} 
        onUpdateImages={handleUpdateImages}
      />
    </>
  );
};

export default SeoResults;
