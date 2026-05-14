// Helper centralisé : ajoute automatiquement la clé OpenRouter (BYOK) si l'abonné
// l'a configurée dans les Réglages avancés. Compatible drop-in avec
// `supabase.functions.invoke` pour toute fonction acceptant `openrouterKey`.
import { supabase } from '@/integrations/supabase/client';
import { getOpenRouterImageKey } from '@/lib/ebookExportOptions';

export async function invokeImageFunction<T = any>(
  functionName: string,
  body: Record<string, any> = {},
): Promise<{ data: T | null; error: any }> {
  const openrouterKey = getOpenRouterImageKey();
  const merged = openrouterKey ? { ...body, openrouterKey } : body;
  return await (supabase.functions.invoke(functionName, { body: merged }) as any);
}
