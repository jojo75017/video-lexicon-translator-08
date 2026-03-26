import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { action, referral_code, referred_email, user_id } = await req.json();

    // Action 1: Get or create referral code for authenticated user
    if (action === "get_code") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check existing
      const { data: existing } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user_id)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ code: existing.code }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate new code
      const { data: newCode } = await supabase.rpc("generate_referral_code");

      const { error } = await supabase
        .from("referral_codes")
        .insert({ user_id, code: newCode });

      if (error) throw error;

      return new Response(JSON.stringify({ code: newCode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action 2: Track a referral click/signup
    if (action === "track") {
      if (!referral_code || !referred_email) {
        return new Response(JSON.stringify({ error: "referral_code and referred_email required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find referrer
      const { data: referrer } = await supabase
        .from("referral_codes")
        .select("user_id")
        .eq("code", referral_code)
        .maybeSingle();

      if (!referrer) {
        return new Response(JSON.stringify({ error: "Invalid referral code" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already referred
      const { data: existingRef } = await supabase
        .from("referrals")
        .select("id")
        .eq("referred_email", referred_email)
        .maybeSingle();

      if (existingRef) {
        return new Response(JSON.stringify({ message: "Already referred" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create referral
      const { error } = await supabase.from("referrals").insert({
        referrer_id: referrer.user_id,
        referred_email,
        status: "pending",
        commission_amount: 0,
      });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action 3: Convert referral (called when referred user pays)
    if (action === "convert") {
      if (!referred_email) {
        return new Response(JSON.stringify({ error: "referred_email required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Determine sale amount from request body (default 67€ Pro Lifetime)
      const { sale_amount: saleAmount = 67 } = await req.json().catch(() => ({ sale_amount: 67 }));

      // Get referrer's current converted count to determine commission tier
      const { data: referral } = await supabase
        .from("referrals")
        .select("referrer_id")
        .eq("referred_email", referred_email)
        .eq("status", "pending")
        .maybeSingle();

      let commission = 0;
      if (referral) {
        const { count } = await supabase
          .from("referrals")
          .select("id", { count: "exact", head: true })
          .eq("referrer_id", referral.referrer_id)
          .eq("status", "converted");

        const convertedCount = count ?? 0;

        if (saleAmount >= 97) {
          // Pro Lifetime: 30€ flat commission
          commission = 30;
        } else {
          // Fallback: 30€ commission
          commission = 30;
        }
      }

      const { error } = await supabase
        .from("referrals")
        .update({
          status: "converted",
          commission_amount: commission,
          converted_at: new Date().toISOString(),
          referred_user_id: user_id || null,
        })
        .eq("referred_email", referred_email)
        .eq("status", "pending");

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, commission }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action 4: Get stats
    if (action === "stats") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: stats } = await supabase.rpc("get_referral_stats", { p_user_id: user_id });

      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Referral error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
