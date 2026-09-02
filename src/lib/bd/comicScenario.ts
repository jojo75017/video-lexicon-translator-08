/**
 * Écriture du scénario de BD, page par page, avec mémoire narrative.
 *
 * Pourquoi : une seule requête pour 12 pages sature la réponse, l'IA tronque et
 * les cases finissent par se répéter. Ici on écrit par tranches de 3 pages en
 * réinjectant le résumé des pages précédentes, puis on refuse les doublons.
 * Aucun contenu de secours inventé : en cas d'échec on remonte une erreur claire.
 */

import { supabase } from '@/integrations/supabase/client';

export interface ComicScenarioPanel {
  description: string;
  character: string;
  dialogue: string;
}

export interface ComicScenarioPage {
  panels: ComicScenarioPanel[];
  summary?: string;
}

export interface BuildComicScenarioOptions {
  title: string;
  description: string;
  genre: string;
  audience: string;
  heroName: string;
  characterDescription?: string;
  setting?: string;
  structure?: string[];
  numberOfPages: number;
  panelCount: number;
  useOpenAI?: boolean;
  openaiApiKey?: string;
  onProgress?: (pagesDone: number, total: number) => void;
}

const CHUNK = 3;

const LANGUE_RULE = `LANGUE : français courant uniquement, orthographe et accents impeccables, ponctuation française (espace avant ! ? : ;).
Interdit : latin, faux latin, pseudo-langues, mots inventés, anglicismes décoratifs, fautes d'accord.`;

const stripJson = (raw: string): string => {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/);
  if (fenced) return fenced[1];
  const brace = raw.match(/\{[\s\S]*\}/);
  return brace ? brace[0] : raw;
};

const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Écrit un scénario cohérent, sans page ni dialogue dupliqué. */
export async function buildComicScenario(
  opts: BuildComicScenarioOptions,
): Promise<ComicScenarioPage[]> {
  const {
    title, description, genre, audience, heroName, characterDescription,
    setting, structure, numberOfPages, panelCount, useOpenAI, openaiApiKey, onProgress,
  } = opts;

  const pages: ComicScenarioPage[] = [];
  const seenDialogues = new Set<string>();
  const seenDescriptions = new Set<string>();

  for (let start = 0; start < numberOfPages; start += CHUNK) {
    const end = Math.min(start + CHUNK, numberOfPages);
    const count = end - start;

    const memory = pages.length
      ? pages
          .map((p, i) => `Page ${i + 1} : ${p.summary || p.panels.map((x) => x.description).join(' / ')}`)
          .join('\n')
      : '(début de l\'histoire)';

    const arcHint = structure?.length
      ? `Arc narratif global : ${structure.join(' → ')}. Nous sommes aux pages ${start + 1} à ${end} sur ${numberOfPages}.`
      : `Nous sommes aux pages ${start + 1} à ${end} sur ${numberOfPages}.`;

    const prompt = `Tu es scénariste professionnel de bande dessinée.

${LANGUE_RULE}

LIVRE
- Titre : "${title}"
- Pitch : ${description}
- Genre : ${genre}
- Public : ${audience}
- Héros : ${heroName}${characterDescription ? ` — ${characterDescription}` : ''}
${setting ? `- Univers : ${setting}` : ''}

${arcHint}

CE QUI S'EST DÉJÀ PASSÉ (à continuer, jamais à répéter) :
${memory}

MISSION : écris les pages ${start + 1} à ${end} (${count} pages), EXACTEMENT ${panelCount} cases par page.
RÈGLES STRICTES
- Chaque case fait avancer l'intrigue : nouveau lieu, nouvelle information, nouvelle réaction.
- Aucune description ni aucun dialogue réutilisé d'une case ou d'une page à l'autre.
- Dialogues naturels, 60 caractères maximum, alternance des personnages qui parlent.
- Descriptions visuelles concrètes (cadrage, décor, action, émotion), 1 à 2 phrases.
- Ajoute pour chaque page un "summary" d'une phrase résumant ce qui s'y passe.
${end === numberOfPages ? '- Ces pages closent l\'histoire par une fin claire et satisfaisante.' : ''}

Réponds uniquement en JSON :
{"pages":[{"summary":"...","panels":[{"description":"...","character":"...","dialogue":"..."}]}]}`;

    let chunkPages: ComicScenarioPage[] | null = null;
    let lastError = '';

    for (let attempt = 0; attempt < 2 && !chunkPages; attempt++) {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'comic-scenario',
          prompt: attempt === 0
            ? prompt
            : `${prompt}\n\nATTENTION : ta réponse précédente était invalide ou répétitive (${lastError}). Recommence avec du contenu entièrement nouveau et un JSON strictement valide.`,
          useOpenAI: useOpenAI || undefined,
          openaiApiKey: openaiApiKey || undefined,
        },
      });

      if (error) {
        lastError = (error as Error)?.message || 'appel IA échoué';
        continue;
      }

      try {
        const raw = String(data?.content ?? data?.text ?? '');
        const parsed = JSON.parse(stripJson(raw));
        const list: ComicScenarioPage[] = Array.isArray(parsed?.pages) ? parsed.pages : [];
        const clean = list
          .filter((p) => Array.isArray(p?.panels) && p.panels.length > 0)
          .slice(0, count)
          .map((p) => ({
            summary: typeof p.summary === 'string' ? p.summary : undefined,
            panels: p.panels.slice(0, panelCount).map((panel) => ({
              description: String(panel?.description || '').trim(),
              character: String(panel?.character || heroName).trim(),
              dialogue: String(panel?.dialogue || '').trim().slice(0, 60),
            })),
          }));

        if (clean.length !== count) {
          lastError = `${clean.length} page(s) reçue(s) au lieu de ${count}`;
          continue;
        }
        if (clean.some((p) => p.panels.length !== panelCount || p.panels.some((x) => !x.description))) {
          lastError = `cases manquantes (il en faut ${panelCount} par page)`;
          continue;
        }

        const dupes = clean.some((p) =>
          p.panels.some((x) => {
            const d = normalize(x.description);
            const t = normalize(x.dialogue);
            return (d && seenDescriptions.has(d)) || (t.length > 8 && seenDialogues.has(t));
          }),
        );
        if (dupes && attempt === 0) {
          lastError = 'contenu déjà utilisé dans les pages précédentes';
          continue;
        }

        chunkPages = clean;
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'JSON illisible';
      }
    }

    if (!chunkPages) {
      throw new Error(
        `Scénario interrompu aux pages ${start + 1}-${end} : ${lastError}. Réessayez ou vérifiez votre clé IA.`,
      );
    }

    chunkPages.forEach((p) =>
      p.panels.forEach((x) => {
        seenDescriptions.add(normalize(x.description));
        const t = normalize(x.dialogue);
        if (t.length > 8) seenDialogues.add(t);
      }),
    );

    pages.push(...chunkPages);
    onProgress?.(pages.length, numberOfPages);
  }

  return pages;
}
