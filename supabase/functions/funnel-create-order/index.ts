// Edge function: funnel-create-order — PayPal order creation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTS: Record<string, { label: string; amount: number }> = {
  // Offre de lancement en cours : paiement unique de 47 € (accès à vie).
  v3_lifetime: { label: "EbookStudio — Accès à vie", amount: 47 },
  main: { label: "EbookStudio — Accès à vie", amount: 47 },
  license_extended: { label: "Licence commerciale étendue", amount: 67 },
  templates_premium: { label: "Pack 50 templates premium", amount: 25 },
  // Tunnel Studio BD & Jeunesse (nouveauté V4)
  bd_comic_17: { label: "Studio BD & Jeunesse — accès à vie", amount: 17 },
  bd_comic_pro_47: { label: "Studio BD & Jeunesse Pro", amount: 47 },
  // Legacy aliases
  upsell_license: { label: "Licence commerciale étendue", amount: 67 },
  upsell_templates: { label: "Pack 50 templates premium", amount: 25 },
};

// Direct download links delivered after upsell payment
const TEMPLATES_PACK_URL = "https://drive.google.com/uc?export=download&id=177h1X9Up5ufQQOg0Ojc2WMPkVlGkXI4B";
const NICHES_GUIDE_URL = "https://ebookstudio.fr/lead-magnets/5-niches-rentables-2026.pdf";
const LICENSE_PDF_URL = "https://ebookstudio.fr/licence-etendue";
const NICHES_10_URL = "https://ebookstudio.fr/niches-600";

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function sendInstructions(email: string, firstName: string, productKey: string, product: { label: string; amount: number }, method: string) {
  if (!EMAIL_SENDING_ENABLED) return false;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return false;

  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const paymentBlock = `<p><strong>Paiement par PayPal :</strong></p>
         <p>Envoyez <strong>${product.amount} €</strong> à l'adresse : <a href="https://paypal.me/ebookstudio/${product.amount}">paypal.me/ebookstudio</a></p>
         <p>Précisez votre email <strong>${email}</strong> dans la note du paiement.</p>`;

  const isTemplatesPack = productKey === "templates_premium" || productKey === "upsell_templates";
  const isLicenseExtended = productKey === "license_extended" || productKey === "upsell_license";
  let downloadsBlock = "";
  if (isTemplatesPack) {
    downloadsBlock = `
    <div style="background:#fff;border:2px solid #FF9E2D;border-radius:12px;padding:20px;margin:24px 0">
      <h2 style="color:#FF9E2D;margin:0 0 12px;font-size:18px">🎁 Vos téléchargements immédiats</h2>
      <p style="margin:0 0 12px">Voici dès maintenant les fichiers de votre pack :</p>
      <p style="margin:8px 0">
        📘 <a href="${TEMPLATES_PACK_URL}" style="color:#008296;font-weight:bold">Télécharger le Pack 50 templates premium (PDF)</a>
      </p>
      <p style="margin:8px 0">
        🎁 <a href="${NICHES_GUIDE_URL}" style="color:#008296;font-weight:bold">Télécharger le Guide niches KDP rentables 2026 (cadeau offert)</a>
      </p>
      <p style="font-size:12px;color:#666;margin:12px 0 0">Conservez précieusement ces liens. Licence d'utilisation personnelle, revente interdite.</p>
    </div>`;
  } else if (isLicenseExtended) {
    downloadsBlock = `
    <div style="background:#fff;border:2px solid #008296;border-radius:12px;padding:20px;margin:24px 0">
      <h2 style="color:#008296;margin:0 0 12px;font-size:18px">🎁 Bonus inclus avec votre commande</h2>
      <p style="margin:0 0 12px">Voici vos accès privés (réservés aux acheteurs, non publics) :</p>
      <p style="margin:8px 0">
        📜 <a href="${LICENSE_PDF_URL}" style="color:#008296;font-weight:bold">Accéder à la Licence commerciale étendue</a>
      </p>
      <p style="margin:8px 0">
        🎯 <a href="${NICHES_10_URL}" style="color:#008296;font-weight:bold">Accéder au Guide des 10 niches KDP rentables 2026</a>
      </p>
      <p style="font-size:12px;color:#666;margin:12px 0 0">Ces liens sont personnels. Merci de ne pas les diffuser publiquement.</p>
    </div>`;
  }

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296">Votre commande EbookStudio</h1>
    <p>${greeting}</p>
    <p>Merci pour votre commande : <strong>${product.label}</strong> (${product.amount} €).</p>
    ${downloadsBlock}
    ${paymentBlock}
    <p>Dès réception, nous activons votre accès sous 24h ouvrées et vous recevez vos identifiants par email.</p>
    <p>Une question ? Répondez simplement à cet email.</p>
    <p>L'équipe EbookStudio</p>
  </div>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "EbookStudio <contact@ebookstudio.fr>",
      to: [email],
      subject: `Instructions de paiement — ${product.label}`,
      html,
    }),
  });
  return r.ok;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const product_key = String(body.product_key || "main");
    const payment_method = String(body.payment_method || "paypal");
    const ref_code = String(body.ref_code || "").trim().slice(0, 64) || null;

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const product = PRODUCTS[product_key];
    if (!product) {
      return new Response(JSON.stringify({ error: "Produit invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["paypal"].includes(payment_method)) {
      return new Response(JSON.stringify({ error: "Méthode de paiement invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: orderErr } = await supabase
      .from("funnel_orders")
      .insert({
        email,
        first_name: first_name || null,
        product_key,
        amount: product.amount,
        currency: "EUR",
        payment_method,
        status: "pending",
        ref_code,
      })
      .select("id")
      .single();
    if (orderErr) throw orderErr;

    // Mirror into payment_confirmations for the existing admin validation flow
    try {
      await supabase.from("payment_confirmations").insert({
        email,
        status: "pending",
      });
    } catch (e) {
      console.warn("payment_confirmations mirror failed:", (e as Error).message);
    }

    await sendInstructions(email, first_name, product_key, product, payment_method);

    return new Response(JSON.stringify({ ok: true, order_id: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("funnel-create-order error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
