
interface SiteInfoProps {
  data: any;
}

export const SiteInfo = ({ data }: SiteInfoProps) => {
  return (
    <>
      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Titre du site</h4>
        <p className="text-sm">{data.title}</p>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Méta-données</h4>
        <div className="text-sm space-y-1">
          {data.meta.map((meta: any, index: number) => (
            <p key={index} className="flex gap-2">
              <span className="font-medium">{meta.name}:</span>
              <span>{meta.content}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Structure</h4>
        <div className="text-sm space-y-1">
          {data.headings.map((heading: any, index: number) => (
            <p key={index} className="flex gap-2">
              <span className="font-medium">{heading.level}:</span>
              <span>{heading.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          Liens trouvés ({data.links.length})
        </h4>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
          {data.links.map((link: any, index: number) => (
            <a 
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline text-blue-600 dark:text-blue-400"
            >
              {link.text || link.href}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-muted/10 p-4 rounded-lg">
        <h4 className="font-medium mb-2">
          Images ({data.images.length})
        </h4>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
          {data.images.map((img: any, index: number) => (
            <div key={index} className="flex gap-2">
              <span className="font-medium">Alt:</span>
              <span>{img.alt || 'Aucun texte alternatif'}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
