import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('Admin check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Accès refusé - Admin requis' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, subscriberId, data } = await req.json();

    console.log('Admin action:', action, 'for subscriber:', subscriberId);

    // Use service role for admin operations
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, supabaseServiceRole);

    let result;

    switch (action) {
      case 'toggle_status': {
        const { data: subscriber } = await adminClient
          .from('subscribers')
          .select('status')
          .eq('id', subscriberId)
          .single();

        const newStatus = subscriber?.status === 'active' ? 'inactive' : 'active';
        
        result = await adminClient
          .from('subscribers')
          .update({ status: newStatus })
          .eq('id', subscriberId);
        
        console.log(`Status toggled to ${newStatus} for subscriber ${subscriberId}`);
        break;
      }

      case 'reset_quotas': {
        result = await adminClient
          .from('subscribers')
          .update({
            ebook_plans_generated: 0,
            chapters_generated: 0,
            subchapters_generated: 0,
            covers_generated: 0
          })
          .eq('id', subscriberId);
        
        console.log(`Quotas reset for subscriber ${subscriberId}`);
        break;
      }

      case 'update_plan': {
        if (!data.plan_type) {
          throw new Error('Plan type requis');
        }
        
        result = await adminClient
          .from('subscribers')
          .update({ plan_type: data.plan_type })
          .eq('id', subscriberId);
        
        console.log(`Plan updated to ${data.plan_type} for subscriber ${subscriberId}`);
        break;
      }

      case 'set_expiration': {
        result = await adminClient
          .from('subscribers')
          .update({ expires_at: data.expires_at })
          .eq('id', subscriberId);
        
        console.log(`Expiration date set to ${data.expires_at} for subscriber ${subscriberId}`);
        break;
      }

      default:
        throw new Error('Action non reconnue');
    }

    if (result?.error) {
      throw result.error;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Action effectuée avec succès' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
