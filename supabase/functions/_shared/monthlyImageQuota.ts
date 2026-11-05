import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Plafond mensuel couvertures + images (formules 19/29/59 €). Admins et clients à vie : aucun plafond.
export type ImageQuota = { limited: boolean; exceeded: boolean; limit: number; userId: string | null };

const svc = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

export async function userIdFromAuth(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const c = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
  const { data } = await c.auth.getUser();
  return data?.user?.id ?? null;
}

export async function checkImageQuota(userId: string | null): Promise<ImageQuota> {
  if (!userId) return { limited: false, exceeded: false, limit: 0, userId };
  const { data } = await svc().rpc('monthly_quota_status', { _user_id: userId });
  const q = Array.isArray(data) ? data[0] : null;
  if (!q?.plan) return { limited: false, exceeded: false, limit: 0, userId };
  return { limited: true, exceeded: q.covers_used >= q.covers_limit, limit: q.covers_limit, userId };
}

export async function logImage(q: ImageQuota, source: string) {
  if (!q.limited || !q.userId) return;
  await svc().from('cover_generation_log').insert({ user_id: q.userId, source });
}

export const quotaMessage = (limit: number) =>
  `Vous avez utilisé vos ${limit} couvertures et images de ce mois. Elles reviennent le 1er du mois prochain, ou passez à la formule supérieure.`;
