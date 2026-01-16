import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Admin email permanent (ne dépend pas de la session)
const PERMANENT_ADMIN_EMAIL = 'boubetgeorges@gmail.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Parse request body for email-based check
    let emailToCheck: string | null = null;
    try {
      const body = await req.json();
      emailToCheck = body?.email?.toLowerCase()?.trim() || null;
    } catch {
      // No body or invalid JSON - continue with session-based check
    }

    // METHOD 1: Email-based permanent admin check (no session required)
    if (emailToCheck) {
      console.log('Checking permanent admin by email:', emailToCheck);
      
      if (emailToCheck === PERMANENT_ADMIN_EMAIL) {
        // Verify in database using service role
        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data: hasRole, error: roleError } = await adminClient
          .rpc('has_role', { _email: emailToCheck, _role: 'admin' });
        
        if (roleError) {
          console.error('Error checking role by email:', roleError);
        }
        
        if (hasRole === true) {
          console.log('Permanent admin confirmed by email:', emailToCheck);
          return new Response(
            JSON.stringify({ isAdmin: true, permanent: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ isAdmin: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // METHOD 2: Session-based admin check (original logic)
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User error:', userError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Non authentifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('Checking admin status for user:', user.id);

    // Check admin role via SECURITY DEFINER function to bypass RLS safely
    const { data: hasRole, error: hasRoleError } = await supabaseClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (hasRoleError) {
      console.error('has_role RPC error:', hasRoleError);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Erreur lors de la vérification du rôle' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const isAdmin = hasRole === true;
    console.log('Admin status:', isAdmin);

    return new Response(
      JSON.stringify({ isAdmin }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Check admin error:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
