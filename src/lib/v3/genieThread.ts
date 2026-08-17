/**
 * Mémoire de conversation du Génie (fil de discussion) et versions du sommaire.
 * Stockage double : Supabase quand l'abonné est connecté (reprise multi-appareils),
 * localStorage en secours pour ne jamais perdre l'échange en cours.
 */
import { supabase } from '@/integrations/supabase/client';
import { appendSourceText } from '@/lib/v3/bookBrief';
import type { BookBrief, BriefOutlineChapter } from '@/lib/v3/bookBrief';

const db = supabase as any;

export const GENIE_THREAD_KEY = 'v3_genie_thread_v1';

export type GenieMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Résumé court de ce que l'IA a modifié dans la fiche à ce tour. */
  changes?: string;
  outline?: BriefOutlineChapter[];
  createdAt: string;
};

export type OutlineVersion = {
  id: string;
  version: number;
  bookTitle: string;
  chapters: BriefOutlineChapter[];
  createdAt: string;
};

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `m_${Date.now()}_${Math.round(Math.random() * 1e6)}`;

/* ------------------------------------------------------------------ */
/* Fil local                                                           */
/* ------------------------------------------------------------------ */

export function readLocalThread(): GenieMessage[] {
  try {
    const raw = localStorage.getItem(GENIE_THREAD_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? (list as GenieMessage[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalThread(messages: GenieMessage[]) {
  try {
    // Conserver un fil long pour pouvoir reconstruire un récit complet, y
    // compris après de nombreux échanges avec le Génie.
    localStorage.setItem(GENIE_THREAD_KEY, JSON.stringify(messages.slice(-500)));
  } catch {
    /* quota / navigation privée */
  }
}

export function clearLocalThread() {
  try {
    localStorage.removeItem(GENIE_THREAD_KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Fil serveur                                                         */
/* ------------------------------------------------------------------ */

export function makeMessage(
  role: GenieMessage['role'],
  content: string,
  extra?: { changes?: string; outline?: BriefOutlineChapter[] },
): GenieMessage {
  return {
    id: uid(),
    role,
    content,
    changes: extra?.changes,
    outline: extra?.outline,
    createdAt: new Date().toISOString(),
  };
}

/** Charge le fil enregistré côté serveur (le plus récent en dernier). */
export async function loadRemoteThread(projectId?: string | null): Promise<GenieMessage[]> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return [];
    let query = db
      .from('book_conversations')
      .select('id,role,content,changes,outline_snapshot,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(500);
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error || !Array.isArray(data)) return [];
    return data.map((row: any) => ({
      id: row.id,
      role: row.role === 'assistant' ? 'assistant' : 'user',
      content: String(row.content || ''),
      changes: row.changes || undefined,
      outline: Array.isArray(row.outline_snapshot) ? row.outline_snapshot : undefined,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

/** Enregistre un message côté serveur (silencieux si non connecté). */
export async function saveRemoteMessage(
  message: GenieMessage,
  brief: BookBrief,
  projectId?: string | null,
) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;
    await db.from('book_conversations').insert({
      user_id: userId,
      project_id: projectId || null,
      role: message.role,
      content: message.content,
      changes: message.changes || null,
      brief_snapshot: brief || {},
      outline_snapshot: message.outline || brief.outline || [],
    });
  } catch {
    /* on n'interrompt jamais le dialogue pour une erreur d'enregistrement */
  }
}

/** Efface le fil serveur du projet courant (ou tout le fil sans projet). */
export async function clearRemoteThread(projectId?: string | null) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;
    let query = db.from('book_conversations').delete().eq('user_id', userId);
    if (projectId) query = query.eq('project_id', projectId);
    await query;
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Reconstruction de la matière brute depuis le fil                    */
/* ------------------------------------------------------------------ */

/** Retire les préfixes techniques pour ne garder que les mots de l'auteur. */
function authorWords(content: string): string {
  return String(content || '')
    .replace(/^\s*Précision de l['’]auteur\s*:\s*/i, '')
    .trim();
}

/**
 * Reconstruit la matière brute (mots exacts de l'auteur) à partir de tous ses
 * messages, dans l'ordre chronologique. Idempotent : les passages déjà présents
 * ne sont jamais dupliqués. Les réponses très courtes (choix de langue, de ton…)
 * sont ignorées : ce ne sont pas du récit.
 */
export function rebuildSourceText(messages: GenieMessage[], existing?: string): string {
  let out = String(existing || '').trim();
  for (const m of messages) {
    if (m.role !== 'user') continue;
    const text = authorWords(m.content);
    if (text.length < 40) continue;
    out = appendSourceText(out, text);
  }
  return out;
}

/** Nombre de mots réels d'un texte. */
export function countTextWords(text: string): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

/* ------------------------------------------------------------------ */
/* Différences de fiche : « ce que l'IA a changé »                     */
/* ------------------------------------------------------------------ */

const LABELS: Array<[keyof BookBrief, string]> = [
  ['title', 'Titre'],
  ['subtitle', 'Sous-titre'],
  ['author', 'Auteur'],
  ['category', 'Catégorie'],
  ['tone', 'Ton'],
  ['chapters', 'Nombre de chapitres'],
  ['wordsPerChapter', 'Mots par chapitre'],
  ['promesseCentrale', 'Promesse centrale'],
  ['cibleProfil', 'Lecteur visé'],
];

export function describeBriefChanges(before: BookBrief, after: BookBrief): string {
  const parts: string[] = [];
  for (const [key, label] of LABELS) {
    const a = before[key];
    const b = after[key];
    const sa = a == null ? '' : String(a).trim();
    const sb = b == null ? '' : String(b).trim();
    if (!sb || sa === sb) continue;
    parts.push(sa ? `${label} : « ${short(sa)} » → « ${short(sb)} »` : `${label} : « ${short(sb)} »`);
  }
  const beforeDesc = String(before.description || '').trim();
  const afterDesc = String(after.description || '').trim();
  if (afterDesc && afterDesc !== beforeDesc) parts.push('Synopsis reformulé');
  if (Boolean(before.wantsIllustrations) !== Boolean(after.wantsIllustrations)) {
    parts.push(after.wantsIllustrations ? 'Illustrations IA activées' : 'Illustrations IA désactivées');
  }
  return parts.join(' · ');
}

function short(value: string, max = 42) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

/* ------------------------------------------------------------------ */
/* Versions du sommaire                                                */
/* ------------------------------------------------------------------ */

export async function loadOutlineVersions(projectId?: string | null): Promise<OutlineVersion[]> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return [];
    let query = db
      .from('book_outline_versions')
      .select('id,version,book_title,chapters,created_at')
      .eq('user_id', userId)
      .order('version', { ascending: false })
      .limit(20);
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error || !Array.isArray(data)) return [];
    return data.map((row: any) => ({
      id: row.id,
      version: Number(row.version) || 1,
      bookTitle: String(row.book_title || ''),
      chapters: Array.isArray(row.chapters) ? row.chapters : [],
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

/** Enregistre une nouvelle version du sommaire ; renvoie la version créée. */
export async function saveOutlineVersion(
  chapters: BriefOutlineChapter[],
  opts: { projectId?: string | null; bookTitle?: string },
): Promise<OutlineVersion | null> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId || !chapters.length) return null;
    const existing = await loadOutlineVersions(opts.projectId);
    const nextVersion = (existing[0]?.version || 0) + 1;
    const { data, error } = await db
      .from('book_outline_versions')
      .insert({
        user_id: userId,
        project_id: opts.projectId || null,
        book_title: opts.bookTitle || '',
        version: nextVersion,
        chapters,
      })
      .select()
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      version: Number(data.version) || nextVersion,
      bookTitle: String(data.book_title || ''),
      chapters: Array.isArray(data.chapters) ? data.chapters : chapters,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}
