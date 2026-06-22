import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TxRow {
  id: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  created: string | null;
  method: string | null;
  environment: StripeEnv;
}

interface EnvSummary {
  environment: StripeEnv;
  available: boolean;
  totalAmount: number;
  succeededCount: number;
  pendingCount: number;
  averageAmount: number;
  currency: string;
  transactions: TxRow[];
  error?: string;
}

const ZERO_DECIMAL = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);
const THREE_DECIMAL = new Set(["bhd", "jod", "kwd", "omr", "tnd"]);

function toMajor(amount: number | null | undefined, currency: string): number {
  const v = amount ?? 0;
  const c = (currency ?? "").toLowerCase();
  if (ZERO_DECIMAL.has(c)) return v;
  if (THREE_DECIMAL.has(c)) return v / 1000;
  return v / 100;
}

function isoFromUnix(s: number | null | undefined): string | null {
  return s ? new Date(s * 1000).toISOString() : null;
}

async function loadEnv(env: StripeEnv): Promise<EnvSummary> {
  const base: EnvSummary = {
    environment: env,
    available: false,
    totalAmount: 0,
    succeededCount: 0,
    pendingCount: 0,
    averageAmount: 0,
    currency: "eur",
    transactions: [],
  };
  try {
    const stripe = createStripeClient(env);
    const charges = await stripe.charges.list({ limit: 100 });
    const txs: TxRow[] = charges.data.map((ch: any) => ({
      id: ch.id,
      email: ch.billing_details?.email ?? ch.receipt_email ?? null,
      amount: toMajor(ch.amount, ch.currency),
      currency: ch.currency,
      status: ch.status,
      created: isoFromUnix(ch.created),
      method: ch.payment_method_details?.type ?? null,
      environment: env,
    }));

    const succeeded = txs.filter((t) => t.status === "succeeded");
    const pending = txs.filter((t) => t.status === "pending");
    const total = succeeded.reduce((sum, t) => sum + t.amount, 0);

    return {
      ...base,
      available: true,
      transactions: txs,
      succeededCount: succeeded.length,
      pendingCount: pending.length,
      totalAmount: Math.round(total * 100) / 100,
      averageAmount: succeeded.length ? Math.round((total / succeeded.length) * 100) / 100 : 0,
      currency: txs[0]?.currency ?? "eur",
    };
  } catch (e) {
    // Live keys may not be provisioned yet — surface gracefully.
    return { ...base, available: false, error: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleError || isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [sandbox, live] = await Promise.all([
      loadEnv("sandbox"),
      loadEnv("live"),
    ]);

    return new Response(JSON.stringify({ sandbox, live }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-stripe-payments error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
