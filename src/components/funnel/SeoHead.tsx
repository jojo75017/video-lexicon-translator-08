import { Helmet } from 'react-helmet';

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

const SITE = 'https://ebookstudio.fr';

const SeoHead = ({ title, description, canonical, ogImage, jsonLd, noindex }: SeoHeadProps) => {
  const url = canonical ? (canonical.startsWith('http') ? canonical : `${SITE}${canonical}`) : undefined;
  const image = ogImage || `${SITE}/og-image.png`;
  return (
    <Helmet>
      <title>{title.slice(0, 60)}</title>
      <meta name="description" content={description.slice(0, 160)} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;
