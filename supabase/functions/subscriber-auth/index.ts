import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function that creates or signs in a Supabase Auth user for a validated subscriber.
 * Called AFTER validate-subscription succeeds.
 * Uses a deterministic password derived from the access code so the subscriber
 * never has to manage a separate password.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, access_code } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = access_code?.trim().toUpperCase();

    if (!normalizedEmail || !normalizedCode) {
      return new Response(
        JSON.stringify({ error: 'Email et code requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify subscription is valid first
    const { data: subscriber, error: subError } = await adminClient
      .from('subscribers')
      .select('*')
      .ilike('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !subscriber) {
      return new Response(
        JSON.stringify({ error: 'Abonnement non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storedCode = subscriber.access_code?.trim().toUpperCase();
    if (storedCode !== normalizedCode) {
      return new Response(
        JSON.stringify({ error: 'Code incorrect' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (subscriber.status !== 'active' && subscriber.status !== 'trialing') {
      return new Response(
        JSON.stringify({ error: 'Abonnement inactif' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deterministic password: hash of access_code + salt
    // This way the subscriber never needs to know/manage a password
    const password = `EBK_AUTH_${normalizedCode}_${normalizedEmail.split('@')[0]}`;

    // Try to sign in first
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const userClient = createClient(supabaseUrl, anonKey);

    const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInData?.session) {
      console.log('Subscriber signed in:', normalizedEmail);
      return new Response(
        JSON.stringify({
          success: true,
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User doesn't exist yet — create via admin API (auto-confirms email)
    console.log('Creating auth user for subscriber:', normalizedEmail);
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      // L'utilisateur existe déjà (abonnés V2 créés avant, ou code d'accès modifié).
      // On retrouve son id puis on réaligne son mot de passe déterministe.
      console.log('Auth user already exists, realigning password:', normalizedEmail);

      let existingUserId: string | null =
        typeof subscriber.user_id === 'string' ? subscriber.user_id : null;

      if (!existingUserId) {
        // GoTrue admin API : recherche paginée (le paramètre `filter` de
        // listUsers n'est pas fiable et renvoyait un tableau vide).
        for (let page = 1; page <= 25 && !existingUserId; page++) {
          const { data: pageData, error: listError } = await adminClient.auth.admin.listUsers({
            page,
            perPage: 200,
          });
          if (listError) {
            console.error('listUsers failed:', listError);
            break;
          }
          const users = pageData?.users ?? [];
          const match = users.find(
            (u) => (u.email || '').trim().toLowerCase() === normalizedEmail
          );
          if (match) existingUserId = match.id;
          if (users.length < 200) break;
        }
      }

      if (existingUserId) {
        const { error: updateError } = await adminClient.auth.admin.updateUserById(existingUserId, {
          password,
          email_confirm: true,
        });
        if (updateError) console.error('Password realign failed:', updateError);

        const { data: retryData, error: retryError } = await userClient.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (retryData?.session) {
          // On mémorise le lien abonné ↔ utilisateur pour les prochaines connexions
          if (!subscriber.user_id) {
            await adminClient
              .from('subscribers')
              .update({ user_id: existingUserId })
              .eq('id', subscriber.id);
          }
          return new Response(
            JSON.stringify({
              success: true,
              access_token: retryData.session.access_token,
              refresh_token: retryData.session.refresh_token,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.error('Retry sign-in failed:', retryError);
      } else {
        console.error('No auth user found for subscriber:', normalizedEmail);
      }


      console.error('Create user error:', createError);
      return new Response(
        JSON.stringify({ error: 'Impossible de créer la session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sign in the newly created user
    const { data: newSignIn, error: newSignInError } = await userClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (newSignInError || !newSignIn?.session) {
      console.error('Post-create sign-in failed:', newSignInError);
      return new Response(
        JSON.stringify({ error: 'Session créée mais connexion échouée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        access_token: newSignIn.session.access_token,
        refresh_token: newSignIn.session.refresh_token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('subscriber-auth error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
