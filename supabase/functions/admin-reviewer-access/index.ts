import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isDedicatedReviewer, reviewerSubscription, REVIEWER_KIND } from '../_shared/reviewerRules.ts';
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Content-Type': 'application/json' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return reply({ error: 'Méthode refusée' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !key || !anon) throw new Error('Configuration indisponible');
    const caller = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user }, error: authError } = await caller.auth.getUser();
    if (authError || !user) return reply({ error: 'Connexion requise' }, 401);
    const { data: admin, error: roleError } = await caller.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (roleError || admin !== true) return reply({ error: 'Administrateur requis' }, 403);
    const body = await req.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!/^[^\s@%_]+@[^\s@%_]+\.[^\s@%_]+$/.test(email)) return reply({ error: 'Email dédié valide requis (sans joker)' }, 400);
    const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: sub, error: subError } = await service.from('subscribers').select('id,user_id,status,expires_at').eq('email', email).maybeSingle();
    if (subError) throw subError;
    const target = sub?.user_id ? await service.auth.admin.getUserById(sub.user_id) : null;
    const owned = target?.data?.user;
    if (body.action === 'status') return reply({ exists: !!sub, dedicated: isDedicatedReviewer(owned?.app_metadata), status: sub?.status, expires_at: sub?.expires_at });
    if (body.action === 'revoke') {
      if (!sub || !owned || !isDedicatedReviewer(owned.app_metadata)) return reply({ error: 'Ce compte n’est pas un compte d’examen JVZoo' }, 409);
      const { error: revokeError } = await service.from('subscribers').update({ status: 'cancelled', expires_at: new Date().toISOString() }).eq('id', sub.id).eq('user_id', owned.id);
      if (revokeError) throw revokeError;
      const { error: banError } = await service.auth.admin.updateUserById(owned.id, { ban_duration: '876000h' });
      if (banError) throw banError;
      return reply({ success: true, status: 'cancelled' });
    }
    if (body.action !== 'create') return reply({ error: 'Action inconnue' }, 400);
    if (sub) return reply({ error: 'Cette adresse possède déjà un compte. Utilisez une adresse dédiée inutilisée.' }, 409);
    const code = String(body.access_code ?? '').trim().toUpperCase();
    if (!/^[A-Z0-9-]{16,64}$/.test(code)) return reply({ error: 'Code : 16 à 64 lettres, chiffres ou tirets.' }, 400);
    const expiry = new Date(String(body.expires_at));
    if (!Number.isFinite(expiry.getTime()) || expiry.getTime() <= Date.now()) return reply({ error: 'Expiration future requise' }, 400);
    // createUser never overwrites an existing identity, including an existing administrator.
    const { data: created, error: createError } = await service.auth.admin.createUser({ email, password: `EBK_AUTH_${code}_${email.split('@')[0]}`, email_confirm: true, app_metadata: { reviewer_kind: REVIEWER_KIND } });
    if (createError || !created.user) return reply({ error: 'Adresse déjà utilisée ou création impossible ; aucun compte existant modifié.' }, 409);
    const { error: insertError } = await service.from('subscribers').insert(reviewerSubscription(email, created.user.id, code, expiry.toISOString()));
    if (insertError) {
      await service.auth.admin.deleteUser(created.user.id);
      return reply({ error: 'Création annulée : accès Auteur non enregistré.' }, 500);
    }
    return reply({ success: true, status: 'active', expires_at: expiry.toISOString(), login_url: 'https://ebookstudio.fr/connexion-abonne' });
  } catch {
    return reply({ error: 'Opération impossible ; réessayez après vérification.' }, 500);
  }
});