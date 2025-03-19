
import { AlertCircle, Globe, Link2, Image, Search, Tag, Info, ChartBar, Settings, Hash } from "lucide-react";

interface SiteInfoProps {
  data: any;
}

export const SiteInfo = ({ data }: SiteInfoProps) => {
  // Safety checks to avoid errors if data is missing
  const hasMeta = data?.meta && Array.isArray(data.meta) && data.meta.length > 0;
  const hasHeadings = data?.headings && Array.isArray(data.headings) && data.headings.length > 0;
  const hasLinks = data?.links && Array.isArray(data.links) && data.links.length > 0;
  const hasImages = data?.images && Array.isArray(data.images) && data.images.length > 0;
  
  console.log("SiteInfo rendering with data:", {
    hasMeta,
    hasHeadings,
    hasLinks,
    hasImages,
    title: data?.title,
    dataObject: data
  });
  
  return (
    <>
      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100" id="seo" data-section="seo">
        <h4 className="font-medium mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2 text-blue-600" />
          Titre du site
        </h4>
        <p className="text-sm">{data?.title || "Titre non disponible"}</p>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="meta-data" data-section="seo">
        <h4 className="font-medium mb-2 flex items-center">
          <Tag className="w-4 h-4 mr-2 text-purple-600" />
          Méta-données
        </h4>
        <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
          {hasMeta ? (
            data.meta.map((meta: any, index: number) => (
              <p key={index} className="flex gap-2 items-start py-1 border-b border-gray-100 last:border-0">
                <span className="font-medium min-w-[80px]">{meta.name || "Sans nom"}:</span>
                <span className="text-gray-600">{meta.content || "Vide"}</span>
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune méta-donnée disponible</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="hierarchy" data-section="hierarchy">
        <h4 className="font-medium mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2 text-green-600" />
          Structure
        </h4>
        <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
          {hasHeadings ? (
            data.headings.map((heading: any, index: number) => (
              <div 
                key={index} 
                className={`py-1.5 px-3 rounded-md mb-1 ${
                  heading.level === "h1" ? 'bg-blue-50 font-bold' : 
                  heading.level === "h2" ? 'bg-blue-50/60 font-semibold ml-4' : 
                  heading.level === "h3" ? 'bg-blue-50/30 ml-8' : 
                  'bg-gray-50 ml-12'
                }`}
              >
                <span className="font-medium mr-2">{heading.level.toUpperCase()}:</span>
                <span>{heading.text}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune donnée de structure disponible</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="backlinks" data-section="backlinks">
        <h4 className="font-medium mb-2 flex items-center">
          <Link2 className="w-4 h-4 mr-2 text-blue-600" />
          Liens trouvés ({hasLinks ? data.links.length : 0})
        </h4>
        <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
          {hasLinks ? (
            data.links.map((link: any, index: number) => (
              <a 
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline text-blue-600 dark:text-blue-400 py-1 border-b border-gray-100 last:border-0"
              >
                {link.text || link.href}
              </a>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucun lien trouvé</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="images-section" data-section="images">
        <h4 className="font-medium mb-2 flex items-center">
          <Image className="w-4 h-4 mr-2 text-blue-600" />
          Images ({hasImages ? data.images.length : 0})
        </h4>
        <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
          {hasImages ? (
            data.images.map((img: any, index: number) => (
              <div key={index} className="flex flex-col gap-1 py-2 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Image #{index + 1}</span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {img.width}x{img.height}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-xs">Alt: </span>
                  <span className="text-xs">{img.alt || 'Aucun texte alternatif'}</span>
                </div>
                <div className="text-xs truncate">
                  <span className="font-medium">Source: </span>
                  <span className="text-gray-600">{img.src}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune image trouvée</p>
          )}
        </div>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="metrics" data-section="metrics">
        <h4 className="font-medium mb-2 flex items-center">
          <ChartBar className="w-4 h-4 mr-2 text-blue-600" />
          Métriques
        </h4>
        <div className="text-sm space-y-1">
          <p>Ces données seront disponibles après l'analyse d'un site.</p>
        </div>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="advanced" data-section="advanced">
        <h4 className="font-medium mb-2 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-blue-600" />
          Options avancées
        </h4>
        <div className="text-sm space-y-1">
          <p>Fonctionnalités avancées disponibles après l'analyse complète.</p>
        </div>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg shadow-sm border border-gray-100 mt-4" id="integrations" data-section="integrations">
        <h4 className="font-medium mb-2 flex items-center">
          <Hash className="w-4 h-4 mr-2 text-blue-600" />
          Intégrations
        </h4>
        <div className="text-sm space-y-1">
          <p>Connectez-vous à des outils externes pour des analyses plus approfondies.</p>
        </div>
      </div>
    </>
  );
};
