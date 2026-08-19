/**
 * « J'ai oublié une info » : la précision de l'auteur est réinjectée dans le
 * chapitre par la plume IA. Rien n'est supprimé, rien n'est résumé — le texte
 * garde sa longueur et ses faits, l'information manquante est simplement
 * intégrée à l'endroit qui convient.
 */
import { supabase } from '@/integrations/supabase/client';
import { readBookBrief } from '@/lib/v3/bookBrief';

export async function enrichChapterWithInfo(
  chapterTitle: string,
  chapterText: string,
  missingInfo: string,
): Promise<string> {
  const info = String(missingInfo || '').trim();
  const text = String(chapterText || '').trim();
  if (!info) throw new Error('Écrivez d’abord l’information à ajouter.');
  if (!text) throw new Error('Ce chapitre est vide : rien à enrichir.');

  const brief = readBookBrief() || {};

  const guidance = [
    `INFORMATION OUBLIÉE PAR L'AUTEUR, À INTÉGRER AU CHAPITRE : « ${info} ».`,
    'RÈGLES ABSOLUES : tu conserves TOUT le texte existant (aucune coupe, aucun résumé, aucune reformulation globale).',
    'Tu insères cette information à l’endroit le plus naturel du récit, développée en une ou plusieurs phrases cohérentes avec le style du chapitre.',
    'Le chapitre final doit être au moins aussi long que l’original et se terminer par une phrase complète terminée par un point.',
    'Tu écris uniquement en français : aucun latin, aucune pseudo-langue, aucun mot inventé.',
  ].join('\n');

  const { data, error } = await supabase.functions.invoke('book-chapter-write', {
    body: {
      task: 'polissage',
      existing: text,
      guidance,
      sheet: {
        title: brief.title || '',
        subtitle: brief.subtitle || '',
        genre: brief.category || '',
        tone: brief.tone || '',
        target_audience: brief.audience || '',
      },
      chapter: { title: chapterTitle, word_target: brief.wordsPerChapter || 2500 },
    },
  });

  if (error) throw new Error(error.message || 'La plume IA n’a pas répondu.');
  if ((data as any)?.error) throw new Error(String((data as any).error));

  const content = String((data as any)?.content || '').trim();
  if (content.length < Math.min(400, Math.round(text.length * 0.5))) {
    throw new Error('La réponse est revenue incomplète : réessayez dans un instant.');
  }
  return content;
}
