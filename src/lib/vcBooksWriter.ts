/**
 * Robot d'écriture VC Books : rédige les pauses par tranches de 10 avec la
 * liste des titres déjà écrits, pour éviter les doublons. Clé de rédaction du
 * client (BYOK). Aucun contenu de secours : en cas d'échec, erreur claire.
 */
import { supabase } from '@/integrations/supabase/client';
import { getProvider, getProviderKey, getOpenRouterModel } from '@/services/aiWritingService';

export interface VCPause {
  title: string;
  text: string;
  encart: string;
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
      title: String(p?.title ?? '').trim(),
      text: String(p?.text ?? '').trim(),
      encart: String(p?.encart ?? '').trim(),
    }))
    .filter((p: VCPause) => p.title && p.text);
}

export function buildPausesPrompt(brief: VCBookBrief, from: number, count: number, seenTitles: string[]): string {
  return `LANGUE : français courant uniquement, orthographe impeccable, ponctuation française. Interdit : latin, pseudo-langues, mots inventés, anglicismes décoratifs.

LIVRE
- Titre : "${brief.title}"${brief.subtitle ? `\n- Sous-titre : ${brief.subtitle}` : ''}
- Thème : ${brief.theme || 'pauses humoristiques variées'}
${brief.description ? `- Description : ${brief.description}` : ''}

MISSION : écris les pauses n°${from} à n°${from + count - 1} (${count} pauses).
- Chaque pause : un titre court et accrocheur, un texte de 120 à 200 mots, et un "encart" d'une phrase (le saviez-vous, petite blague ou question quiz).
- Varie les formats : anecdote, record, quiz, devinette, top 3, fait étonnant.
- Ne reprends JAMAIS un sujet déjà traité :
${seenTitles.length ? seenTitles.slice(-80).map((t) => `  • ${t}`).join('\n') : '  (aucun pour l’instant)'}

Réponds uniquement en JSON :
{"pauses":[{"title":"...","text":"...","encart":"..."}]}`;
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
        prompt: buildPausesPrompt(brief, pauses.length + 1, count, pauses.map((p) => p.title)),
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
    const fresh = batch.filter((p) => { const k = norm(p.title); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, count);
    if (!fresh.length) throw new Error('Le moteur n’a renvoyé que des pauses en double. Relancez pour continuer.');
    pauses.push(...fresh);
    onProgress?.([...pauses]);
  }
  return pauses;
}
