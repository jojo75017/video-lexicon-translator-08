import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AddToSequenceRequest {
  email: string;
  sequenceName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sequenceName = 'welcome' }: AddToSequenceRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();

    // Vérifier si l'email est déjà dans la séquence
    const { data: existing } = await supabaseAdmin
      .from('email_sequences')
      .select('id, unsubscribed')
      .eq('email', normalizedEmail)
      .eq('sequence_name', sequenceName)
      .single();

    if (existing) {
      if (existing.unsubscribed) {
        return new Response(
          JSON.stringify({ success: false, error: 'Cet email s\'est désabonné' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ success: true, message: 'Déjà inscrit à la séquence' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ajouter à la séquence - premier email envoyé immédiatement
    const { error: insertError } = await supabaseAdmin
      .from('email_sequences')
      .insert({
        email: normalizedEmail,
        sequence_name: sequenceName,
        current_step: 0,
        subscribed_at: now.toISOString(),
        next_email_at: now.toISOString(), // Envoyer le premier email immédiatement
      });

    if (insertError) {
      console.error('Error inserting email sequence:', insertError);
      throw insertError;
    }

    console.log(`[SEQUENCE] Added ${normalizedEmail} to sequence ${sequenceName}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Ajouté à la séquence email' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in add-to-email-sequence:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);