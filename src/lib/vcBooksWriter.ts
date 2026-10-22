/**
 * Robot d'écriture VC Books : rédige les pauses par tranches de 10 avec la
 * liste des titres déjà écrits, pour éviter les doublons. Clé de rédaction du
 * client (BYOK). Aucun contenu de secours : en cas d'échec, erreur claire.
 */
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey, getOpenRouterModel } from '@/services/aiWritingService';

/**
 * Une pause = une page du modèle « Petit Cabinet » : PAUSE 001 / 100, rubrique
 * (groupe de 10), titre, 3 paragraphes, encart gris (sourire ou indice),
 * question, puis réponse regroupée en fin de livre.
 */
export interface VCPause {
  section?: string;
  kind?: 'curiosite' | 'jeu';
  title: string;
  text: string;
  encart: string;
  question?: string;
  answer?: string;
}

/** Les 60 % premières pauses sont des curiosités, les suivantes des jeux (mots, calculs, logique). */
export function pauseKind(index: number, total: number): 'curiosite' | 'jeu' {
  return index < Math.round(total * 0.6) ? 'curiosite' : 'jeu';
}

export interface VCBookBrief {
  title: string;
  subtitle: string;
  theme: string;
  description: string;
}

export const VC_PAUSES_MIN = 10;
export const VC_PAUSES_MAX = 200;
const CHUNK = 10;

/** Nombre de pauses proposé à partir des pages visées (environ 1 pause par page utile). */
export function defaultPauseCount(targetPages: number): number {
  const n = Math.round((targetPages || 0) * 0.8);
  return Math.min(VC_PAUSES_MAX, Math.max(VC_PAUSES_MIN, n));
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export function parsePauses(raw: string): VCPause[] {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : (raw.match(/\{[\s\S]*\}/)?.[0] ?? raw);
  const parsed = JSON.parse(body);
  const list = Array.isArray(parsed?.pauses) ? parsed.pauses : [];
  return list
    .map((p: Record<string, unknown>) => ({
      section: String(p?.section ?? '').trim(),
      title: String(p?.title ?? '').trim(),
      text: String(p?.text ?? '').trim(),
      encart: String(p?.encart ?? '').trim(),
      question: String(p?.question ?? '').trim(),
      answer: String(p?.answer ?? '').trim(),
    }))
    .filter((p: VCPause) => p.title && p.text);
}

export function buildPausesPrompt(brief: VCBookBrief, from: number, count: number, seenTitles: string[], total = 100, usedSections: string[] = []): string {
  const kind = pauseKind(from - 1, total);
  const kindRules = kind === 'curiosite'
    ? `TYPE : CURIOSITÉS (faits vrais et vérifiables : animaux, ciel, plantes, science de la maison, Terre, histoire des objets… selon le thème).
- "encart" = « Le sourire du cabinet » : une petite scène humoristique imaginaire de 2 à 3 phrases (guichet, formulaire, client…), bienveillante.`
    : `TYPE : JEUX (jeux de mots, anagrammes, petits calculs, logique, observation), avec une vraie solution unique.
- "encart" = « Un petit coup de pouce » : commence par « Indice facultatif : », puis 1 à 2 phrases avec une touche d'humour.`;
  return `LANGUE : français courant uniquement, orthographe impeccable, ponctuation française. Interdit : latin, pseudo-langues, mots inventés, anglicismes décoratifs.

LIVRE (modèle « Le Petit Cabinet des grandes curiosités » : pauses de culture générale aux toilettes)
- Titre : "${brief.title}"${brief.subtitle ? `\n- Sous-titre : ${brief.subtitle}` : ''}
- Thème : ${brief.theme || 'culture générale, faits insolites, humour et petits défis'}
${brief.description ? `- Description : ${brief.description}` : ''}

MISSION : écris les pauses n°${from} à n°${from + count - 1} sur ${total}.
Ces ${count} pauses forment UNE rubrique : donne-lui un nom court et drôle (ex. « Les animaux ont leurs méthodes », « Les nombres gardent leur calme ») et répète-le dans "section" pour chacune.
${usedSections.length ? `Rubriques déjà utilisées (ne pas reprendre) : ${usedSections.join(' ; ')}` : ''}
${kindRules}

CHAQUE PAUSE :
- "title" : titre court, malicieux (ex. « Le poulpe et son service cardiologie »).
- "text" : exactement 3 paragraphes séparés par une ligne vide, 180 à 240 mots au total, ton complice et précis ; le 3e paragraphe nuance ou corrige une idée reçue.
- "question" : une question de fin (choix multiple, vrai/faux ou énigme) liée au texte.
- "answer" : la réponse en 1 à 2 phrases, commençant par la bonne réponse (ex. « Le cuivre. L'hémocyanine… »).
Ne reprends JAMAIS un sujet déjà traité :
${seenTitles.length ? seenTitles.slice(-80).map((t) => `  • ${t}`).join('\n') : '  (aucun pour l’instant)'}

Réponds uniquement en JSON :
{"pauses":[{"section":"...","title":"...","text":"...","encart":"...","question":"...","answer":"..."}]}`;
}

export async function writeVCPauses(
  brief: VCBookBrief,
  total: number,
  existing: VCPause[],
  onProgress?: (pauses: VCPause[]) => void,
  signal?: { stopped: boolean },
): Promise<VCPause[]> {
  const provider = getProvider();
  const userKey = getProviderKey(provider);
  if (!userKey) throw new Error('Enregistrez votre clé de rédaction dans « Choisir mon IA · Clés API » avant de lancer le robot.');
  const model = provider === 'openrouter' ? getOpenRouterModel() : undefined;
  const pauses = [...existing];
  const seen = new Set(pauses.map((p) => norm(p.title)));

  while (pauses.length < total) {
    if (signal?.stopped) break;
    const count = Math.min(CHUNK, total - pauses.length);
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        type: 'vc-books-pauses',
        prompt: buildPausesPrompt(brief, pauses.length + 1, count, pauses.map((p) => p.title), total, [...new Set(pauses.map((p) => p.section).filter(Boolean) as string[])]),
        provider, model, userApiKey: userKey,
      },
    });
    if (error) {
      let msg = (error as Error).message || 'appel IA échoué';
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.clone === 'function') {
        const d = await ctx.clone().json().catch(() => null);
        if (typeof d?.error === 'string') msg = d.error;
      }
      throw new Error(`Rédaction interrompue à la pause ${pauses.length + 1} : ${msg}`);
    }
    if (data?.error) throw new Error(`Rédaction interrompue à la pause ${pauses.length + 1} : ${data.error}`);
    let batch: VCPause[];
    try { batch = parsePauses(String(data?.content ?? '')); }
    catch { throw new Error(`Réponse illisible du moteur à la pause ${pauses.length + 1}. Relancez pour continuer.`); }
    const start = pauses.length;
    const fresh = batch.filter((p) => { const k = norm(p.title); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, count).map((p, k) => ({ ...p, kind: pauseKind(start + k, total) }));
    if (!fresh.length) throw new Error('Le moteur n’a renvoyé que des pauses en double. Relancez pour continuer.');
    pauses.push(...fresh);
    onProgress?.([...pauses]);
  }
  return pauses;
}
