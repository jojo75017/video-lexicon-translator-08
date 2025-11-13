import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Client with JWT to read current user
    const supabaseAuthed = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Service client to bypass RLS for one-time bootstrap
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabaseAuthed.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Non authentifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if an admin already exists
    const { data: existingAdmins, error: countError } = await supabaseService
      .from('user_roles')
      .select('id', { count: 'exact', head: false })
      .eq('role', 'admin');

    if (countError) {
      console.error('Count error:', countError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erreur lors de la vérification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const adminExists = (existingAdmins?.length ?? 0) > 0;
    if (adminExists) {
      // If a specific owner email logs in, ensure they are admin too (idempotent)
      const ownerEmail = 'boubetgeorges@gmail.com';
      if (user.email && user.email.toLowerCase() === ownerEmail) {
        const { data: hasAdminRole } = await supabaseService
          .from('user_roles')
          .select('id')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!hasAdminRole) {
          const { error: insertOwnerError } = await supabaseService
            .from('user_roles')
            .insert({ user_id: user.id, role: 'admin' });
          if (insertOwnerError) {
            console.error('Insert owner admin error:', insertOwnerError);
            return new Response(
              JSON.stringify({ success: false, error: 'Impossible d\'attribuer le rôle admin au propriétaire' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }
        }
        return new Response(
          JSON.stringify({ success: true, initialized: true, ensuredOwnerAdmin: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: false, initialized: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create first admin for the current authenticated user
    const { error: insertError } = await supabaseService
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Impossible de créer le premier admin' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user_id: user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Bootstrap admin error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});