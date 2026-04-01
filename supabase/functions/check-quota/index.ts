import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Limites par plan - Tous les plans ont accès illimité
const PLAN_LIMITS = {
  // Anciens plans gardent aussi l'illimité (migration douce)
  starter: {
    ebook_plans: -1,   // illimité
    chapters: -1,
    subchapters: -1,
    covers: -1,
  },
  pro: {
    ebook_plans: -1,   // illimité
    chapters: -1,
    subchapters: -1,
    covers: -1,
  },
  lifetime: {
    ebook_plans: -1,   // illimité
    chapters: -1,
    subchapters: -1,
    covers: -1,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action } = await req.json();
    console.log('Quota check request:', { email, action });

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer l'abonnement de l'utilisateur
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .in('status', ['active', 'trialing'])
      .single();

    if (subError || !subscriber) {
      console.log('No active subscription found for:', email);
      return new Response(
        JSON.stringify({ 
          error: 'Aucun abonnement actif trouvé',
          code: 'NO_SUBSCRIPTION',
          hasSubscription: false
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const planType = subscriber.plan_type || 'starter';
    const limits = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.starter;

    // Calculer les quotas restants
    const quotas = {
      plan: planType,
      ebook_plans: {
        used: subscriber.ebook_plans_generated || 0,
        limit: limits.ebook_plans,
        remaining: limits.ebook_plans === -1 ? -1 : Math.max(0, limits.ebook_plans - (subscriber.ebook_plans_generated || 0)),
      },
      chapters: {
        used: subscriber.chapters_generated || 0,
        limit: limits.chapters,
        remaining: limits.chapters === -1 ? -1 : Math.max(0, limits.chapters - (subscriber.chapters_generated || 0)),
      },
      subchapters: {
        used: subscriber.subchapters_generated || 0,
        limit: limits.subchapters,
        remaining: limits.subchapters === -1 ? -1 : Math.max(0, limits.subchapters - (subscriber.subchapters_generated || 0)),
      },
      covers: {
        used: subscriber.covers_generated || 0,
        limit: limits.covers,
        remaining: limits.covers === -1 ? -1 : Math.max(0, limits.covers - (subscriber.covers_generated || 0)),
      },
    };

    // Si une action est spécifiée, vérifier si elle est autorisée
    if (action) {
      let canProceed = false;
      let quotaType = '';

      switch (action) {
        case 'ebook_plan':
          quotaType = 'ebook_plans';
          canProceed = quotas.ebook_plans.remaining === -1 || quotas.ebook_plans.remaining > 0;
          break;
        case 'chapter':
          quotaType = 'chapters';
          canProceed = quotas.chapters.remaining === -1 || quotas.chapters.remaining > 0;
          break;
        case 'subchapter':
          quotaType = 'subchapters';
          canProceed = quotas.subchapters.remaining === -1 || quotas.subchapters.remaining > 0;
          break;
        case 'cover':
          quotaType = 'covers';
          canProceed = quotas.covers.remaining === -1 || quotas.covers.remaining > 0;
          break;
        default:
          canProceed = true;
      }

      if (!canProceed) {
        console.log('Quota exceeded for:', action);
        return new Response(
          JSON.stringify({ 
            error: `Quota ${quotaType} épuisé. Passez à une offre supérieure pour continuer.`,
            code: 'QUOTA_EXCEEDED',
            quotaType,
            quotas,
            canProceed: false
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Quota check passed:', { email, plan: planType });
    return new Response(
      JSON.stringify({ 
        quotas,
        hasSubscription: true,
        canProceed: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-quota:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
