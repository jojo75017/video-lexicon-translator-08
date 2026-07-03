import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-reset-token',
};

const OWNER_EMAIL = 'boubetgeorges@gmail.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const token = req.headers.get('x-reset-token');
    const expected = Deno.env.get('ADMIN_PASSWORD_RESET_TOKEN');
    if (!expected || token !== expected) {
      return new Response(
        JSON.stringify({ success: false, error: 'Non autorisé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === 'string' ? body.password : '';
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ success: false, error: 'Mot de passe trop court (min 8)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the owner user by paging through auth users
    let targetUser: { id: string; email?: string } | null = null;
    let page = 1;
    while (page <= 20 && !targetUser) {
      const { data, error } = await supabaseService.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const found = data.users.find((u) => (u.email ?? '').toLowerCase() === OWNER_EMAIL);
      if (found) targetUser = { id: found.id, email: found.email ?? undefined };
      if (data.users.length < 200) break;
      page++;
    }

    if (!targetUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'Compte propriétaire introuvable' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const { error: updateError } = await supabaseService.auth.admin.updateUserById(targetUser.id, {
      password,
      email_confirm: true,
    });
    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, email: targetUser.email }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('set-admin-password error:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
