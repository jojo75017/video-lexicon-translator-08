import { supabase } from '@/integrations/supabase/client';
import { buildManuscriptFromText } from './buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';

export async function importFromUrl(url: string): Promise<Manuscript> {
  const { data, error } = await supabase.functions.invoke('import-from-url', { body: { url } });
  if (error) throw new Error(error.message || "Impossible de récupérer l'article.");
  const text: string = data?.content || '';
  const title: string | undefined = data?.title;
  if (!text) throw new Error("Aucun contenu lisible trouvé à cette URL.");
  return buildManuscriptFromText(text, title ? `${title}.md` : 'article.md', title);
}
