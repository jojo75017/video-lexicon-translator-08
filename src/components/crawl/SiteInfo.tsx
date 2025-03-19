
import { AlertCircle, Globe, Link2, Image } from "lucide-react";

interface SiteInfoProps {
  data: any;
}

export const SiteInfo = ({ data }: SiteInfoProps) => {
  // Vérifications de sécurité pour éviter les erreurs si les données sont manquantes
  const hasMeta = data?.meta && Array.isArray(data.meta) && data.meta.length > 0;
  const hasHeadings = data?.headings && Array.isArray(data.headings) && data.headings.length > 0;
  const hasLinks = data?.links && Array.isArray(data.links) && data.links.length > 0;
  const hasImages = data?.images && Array.isArray(data.images) && data.images.length > 0;
  
  return (
    <>
      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2 text-blue-600" />
          Titre du site
        </h4>
        <p className="text-sm">{data?.title || "Titre non disponible"}</p>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Méta-données</h4>
        <div className="text-sm space-y-1">
          {hasMeta ? (
            data.meta.map((meta: any, index: number) => (
              <p key={index} className="flex gap-2">
                <span className="font-medium">{meta.name}:</span>
                <span>{meta.content}</span>
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune méta-donnée disponible</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Structure</h4>
        <div className="text-sm space-y-1">
          {hasHeadings ? (
            data.headings.map((heading: any, index: number) => (
              <p key={index} className="flex gap-2">
                <span className="font-medium">{heading.level}:</span>
                <span>{heading.text}</span>
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune donnée de structure disponible</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <Link2 className="w-4 h-4 mr-2 text-blue-600" />
          Liens trouvés ({hasLinks ? data.links.length : 0})
        </h4>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
          {hasLinks ? (
            data.links.map((link: any, index: number) => (
              <a 
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline text-blue-600 dark:text-blue-400"
              >
                {link.text || link.href}
              </a>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucun lien trouvé</p>
          )}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <Image className="w-4 h-4 mr-2 text-blue-600" />
          Images ({hasImages ? data.images.length : 0})
        </h4>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
          {hasImages ? (
            data.images.map((img: any, index: number) => (
              <div key={index} className="flex gap-2">
                <span className="font-medium">Alt:</span>
                <span>{img.alt || 'Aucun texte alternatif'}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune image trouvée</p>
          )}
        </div>
      </div>
    </>
  );
};
