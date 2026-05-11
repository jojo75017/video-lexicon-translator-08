import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTS: Record<string, { label: string; amount: number }> = {
  main: { label: "EbookStudio — Accès annuel", amount: 67 },
  upsell_license: { label: "Licence commerciale", amount: 47 },
  upsell_templates: { label: "Pack 50 templates premium", amount: 27 },
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function sendInstructions(email: string, firstName: string, product: string, amount: number, method: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return false;

  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const paymentBlock =
    method === "paypal"
      ? `<p><strong>Paiement par PayPal :</strong></p>
         <p>Envoyez <strong>${amount} €</strong> à l'adresse : <a href="https://paypal.me/ebookstudio">paypal.me/ebookstudio</a></p>
         <p>Précisez votre email <strong>${email}</strong> dans la note.</p>`
      : `<p><strong>Paiement par virement :</strong></p>
         <p>IBAN : <code>FR76 XXXX XXXX XXXX XXXX XXXX XXX</code><br/>
         BIC : <code>XXXXXXXX</code><br/>
         Montant : <strong>${amount} €</strong><br/>
         Référence : votre email <strong>${email}</strong></p>`;

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296">Votre commande EbookStudio</h1>
    <p>${greeting}</p>
    <p>Merci pour votre commande : <strong>${product}</strong> (${amount} €).</p>
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
      subject: `Instructions de paiement — ${product}`,
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
    if (!["paypal", "virement"].includes(payment_method)) {
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

    await sendInstructions(email, first_name, product.label, product.amount, payment_method);

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
