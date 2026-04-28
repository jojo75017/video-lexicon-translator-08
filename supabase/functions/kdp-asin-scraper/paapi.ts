// Amazon Product Advertising API 5.0 — GetItems
// Signature AWS Signature V4 pour Deno

const MARKETPLACE_HOSTS: Record<string, { host: string; region: string; marketplace: string }> = {
  fr: { host: 'webservices.amazon.fr', region: 'eu-west-1', marketplace: 'www.amazon.fr' },
  us: { host: 'webservices.amazon.com', region: 'us-east-1', marketplace: 'www.amazon.com' },
  uk: { host: 'webservices.amazon.co.uk', region: 'eu-west-1', marketplace: 'www.amazon.co.uk' },
  de: { host: 'webservices.amazon.de', region: 'eu-west-1', marketplace: 'www.amazon.de' },
  es: { host: 'webservices.amazon.es', region: 'eu-west-1', marketplace: 'www.amazon.es' },
  it: { host: 'webservices.amazon.it', region: 'eu-west-1', marketplace: 'www.amazon.it' },
};

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return toHex(hash);
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function getSigningKey(secret: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmac(new TextEncoder().encode(`AWS4${secret}`), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  return kSigning;
}

export async function paapiGetItems(
  asins: string[],
  marketplace: string,
): Promise<any | null> {
  const accessKey = Deno.env.get('AMAZON_ACCESS_KEY');
  const secretKey = Deno.env.get('AMAZON_SECRET_KEY');
  const partnerTag = Deno.env.get('AMAZON_PARTNER_TAG');

  if (!accessKey || !secretKey || !partnerTag) {
    console.warn('PA-API: clés Amazon manquantes');
    return null;
  }

  const cfg = MARKETPLACE_HOSTS[marketplace] || MARKETPLACE_HOSTS.fr;
  const service = 'ProductAdvertisingAPI';
  const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
  const path = '/paapi5/getitems';
  const endpoint = `https://${cfg.host}${path}`;

  const payload = JSON.stringify({
    ItemIds: asins,
    Resources: [
      'BrowseNodeInfo.BrowseNodes',
      'BrowseNodeInfo.BrowseNodes.SalesRank',
      'BrowseNodeInfo.WebsiteSalesRank',
      'CustomerReviews.Count',
      'CustomerReviews.StarRating',
      'ItemInfo.ByLineInfo',
      'ItemInfo.ContentInfo',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Images.Primary.Large',
      'Offers.Listings.Price',
    ],
    PartnerTag: partnerTag,
    PartnerType: 'Associates',
    Marketplace: cfg.marketplace,
  });

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = await sha256Hex(payload);

  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=utf-8\n` +
    `host:${cfg.host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${target}\n`;
  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateStamp}/${cfg.region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

  const signingKey = await getSigningKey(secretKey, dateStamp, cfg.region, service);
  const signature = toHex(await hmac(signingKey, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-encoding': 'amz-1.0',
        'content-type': 'application/json; charset=utf-8',
        'host': cfg.host,
        'x-amz-date': amzDate,
        'x-amz-target': target,
        'authorization': authorization,
      },
      body: payload,
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('PA-API error', response.status, text.slice(0, 500));
      return null;
    }

    return JSON.parse(text);
  } catch (e) {
    console.error('PA-API fetch failed', e);
    return null;
  }
}

export interface PaapiBookData {
  title?: string;
  author?: string;
  price?: number | null;
  rating?: number | null;
  reviews?: number | null;
  bsr?: number | null;
  pages?: number | null;
  categories?: string[];
  imageUrl?: string | null;
}

export function parsePaapiItem(item: any): PaapiBookData {
  const data: PaapiBookData = { categories: [] };

  data.title = item?.ItemInfo?.Title?.DisplayValue;

  const contributors = item?.ItemInfo?.ByLineInfo?.Contributors;
  if (Array.isArray(contributors) && contributors.length > 0) {
    data.author = contributors.map((c: any) => c?.Name).filter(Boolean).join(', ');
  } else if (item?.ItemInfo?.ByLineInfo?.Brand?.DisplayValue) {
    data.author = item.ItemInfo.ByLineInfo.Brand.DisplayValue;
  }

  const priceObj = item?.Offers?.Listings?.[0]?.Price;
  if (priceObj?.Amount) data.price = Number(priceObj.Amount);

  if (item?.CustomerReviews?.StarRating?.Value) {
    data.rating = Number(item.CustomerReviews.StarRating.Value);
  }
  if (item?.CustomerReviews?.Count != null) {
    data.reviews = Number(item.CustomerReviews.Count);
  }

  const pages = item?.ItemInfo?.ContentInfo?.PagesCount?.DisplayValue;
  if (pages) data.pages = Number(pages);

  data.imageUrl = item?.Images?.Primary?.Large?.URL || null;

  // BSR : WebsiteSalesRank (rang global) ou rangs par BrowseNode
  const websiteRank = item?.BrowseNodeInfo?.WebsiteSalesRank?.SalesRank;
  if (websiteRank) data.bsr = Number(websiteRank);

  const browseNodes = item?.BrowseNodeInfo?.BrowseNodes || [];
  for (const node of browseNodes) {
    if (node?.DisplayName) data.categories!.push(String(node.DisplayName));
    if (!data.bsr && node?.SalesRank) data.bsr = Number(node.SalesRank);
    // remonter les ancêtres pour la catégorie principale
    let ancestor = node?.Ancestor;
    while (ancestor) {
      if (ancestor?.DisplayName) data.categories!.push(String(ancestor.DisplayName));
      ancestor = ancestor?.Ancestor;
    }
  }
  data.categories = [...new Set(data.categories)].slice(0, 8);

  return data;
}
