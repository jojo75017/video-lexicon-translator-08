import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// PA-API 5.0 signing utilities
async function hmacSHA256(key: Uint8Array, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

async function sha256(message: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(message));
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function toHex(arr: Uint8Array): string {
  return [...arr].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getSignatureKey(key: string, dateStamp: string, region: string, service: string) {
  let k = await hmacSHA256(new TextEncoder().encode("AWS4" + key), dateStamp);
  k = await hmacSHA256(k, region);
  k = await hmacSHA256(k, service);
  k = await hmacSHA256(k, "aws4_request");
  return k;
}

interface PaApiRequest {
  operation: "SearchItems" | "GetItems" | "GetBrowseNodes";
  payload: Record<string, unknown>;
  marketplace?: string; // us, uk, de, fr
}

const MARKETPLACE_CONFIG: Record<string, { host: string; region: string }> = {
  us: { host: "webservices.amazon.com", region: "us-east-1" },
  uk: { host: "webservices.amazon.co.uk", region: "eu-west-1" },
  de: { host: "webservices.amazon.de", region: "eu-west-1" },
  fr: { host: "webservices.amazon.fr", region: "eu-west-1" },
};

async function callPaApi(accessKey: string, secretKey: string, partnerTag: string, request: PaApiRequest) {
  const marketplace = request.marketplace || "fr";
  const config = MARKETPLACE_CONFIG[marketplace] || MARKETPLACE_CONFIG.fr;
  const host = config.host;
  const region = config.region;
  const service = "ProductAdvertisingAPI";
  const path = "/paapi5/" + request.operation.toLowerCase();

  const body: Record<string, unknown> = {
    ...request.payload,
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: `www.amazon.${marketplace === "us" ? "com" : marketplace === "uk" ? "co.uk" : marketplace}`,
  };

  const bodyStr = JSON.stringify(body);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    host: host,
    "x-amz-date": amzDate,
    "x-amz-target": `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${request.operation}`,
    "content-encoding": "amz-1.0",
  };

  // Canonical request
  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers).sort().map(k => `${k}:${headers[k]}\n`).join("");
  const payloadHash = await sha256(bodyStr);
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`;

  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service);
  const signature = toHex(await hmacSHA256(signingKey, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`https://${host}${path}`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body: bodyStr,
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("PA-API error:", JSON.stringify(data));
    throw new Error(`PA-API ${response.status}: ${data?.Errors?.[0]?.Message || JSON.stringify(data)}`);
  }
  return data;
}

function extractBookData(item: any) {
  const info = item.ItemInfo || {};
  const offers = item.Offers?.Listings?.[0] || {};
  const browseNodes = item.BrowseNodeInfo?.BrowseNodes || [];
  
  return {
    asin: item.ASIN,
    title: info.Title?.DisplayValue || "N/A",
    author: info.ByLineInfo?.Contributors?.[0]?.Name || "Inconnu",
    price: offers.Price?.Amount || null,
    currency: offers.Price?.Currency || "EUR",
    rating: null, // PA-API v5 doesn't return rating directly
    reviewCount: null,
    bsr: item.BrowseNodeInfo?.WebsiteSalesRank?.SalesRank || null,
    categories: browseNodes.map((n: any) => n.DisplayValues?.DisplayValue).filter(Boolean),
    imageUrl: item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL || null,
    pages: info.TechnicalInfo?.Formats?.find((f: any) => f.Type === "Kindle eBook")?.PageCount || 
           info.ContentInfo?.PagesCount?.DisplayValue || null,
    publicationDate: info.ContentInfo?.PublicationDate?.DisplayValue || null,
    detailPageUrl: item.DetailPageURL || null,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessKey = Deno.env.get("AMAZON_ACCESS_KEY");
    const secretKey = Deno.env.get("AMAZON_SECRET_KEY");
    const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");

    if (!accessKey || !secretKey || !partnerTag) {
      return new Response(
        JSON.stringify({ error: "Amazon API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, keywords, asins, category, marketplace, maxResults } = await req.json();

    if (action === "search" && keywords) {
      const searchPayload: Record<string, unknown> = {
        Keywords: keywords,
        SearchIndex: category || "KindleStore",
        ItemCount: Math.min(maxResults || 10, 10),
        Resources: [
          "ItemInfo.Title",
          "ItemInfo.ByLineInfo",
          "ItemInfo.ContentInfo",
          "ItemInfo.TechnicalInfo",
          "Offers.Listings.Price",
          "Images.Primary.Large",
          "Images.Primary.Medium",
          "BrowseNodeInfo.BrowseNodes",
          "BrowseNodeInfo.WebsiteSalesRank",
        ],
        SortBy: "Relevance",
      };

      const data = await callPaApi(accessKey, secretKey, partnerTag, {
        operation: "SearchItems",
        payload: searchPayload,
        marketplace: marketplace || "fr",
      });

      const items = (data.SearchResult?.Items || []).map(extractBookData);

      return new Response(
        JSON.stringify({ 
          success: true, 
          items, 
          totalResults: data.SearchResult?.TotalResultCount || items.length 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "lookup" && asins && Array.isArray(asins)) {
      const lookupPayload: Record<string, unknown> = {
        ItemIds: asins.slice(0, 10),
        ItemIdType: "ASIN",
        Resources: [
          "ItemInfo.Title",
          "ItemInfo.ByLineInfo",
          "ItemInfo.ContentInfo",
          "ItemInfo.TechnicalInfo",
          "Offers.Listings.Price",
          "Images.Primary.Large",
          "Images.Primary.Medium",
          "BrowseNodeInfo.BrowseNodes",
          "BrowseNodeInfo.WebsiteSalesRank",
        ],
      };

      const data = await callPaApi(accessKey, secretKey, partnerTag, {
        operation: "GetItems",
        payload: lookupPayload,
        marketplace: marketplace || "fr",
      });

      const items = (data.ItemsResult?.Items || []).map(extractBookData);

      return new Response(
        JSON.stringify({ success: true, items }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'search' or 'lookup'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Amazon search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
