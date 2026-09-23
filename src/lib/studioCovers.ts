/**
 * Passerelle entre le studio de couvertures (`cover_projects`, bucket privé `covers`)
 * et la bibliothèque de livres (`ebook_projects`).
 *
 * Lecture seule : aucune écriture en base, aucune URL publique, uniquement des URL signées.
 */
import { getSignedCoverUrl, listCoverProjects, type CoverProject } from '@/lib/coverProjects';

export interface StudioCover {
  id: string;
  projectName: string;
  bookTitle: string | null;
  coverType: CoverProject['cover_type'];
  /** Miniature signée temporaire (peut être nulle si la vignette n'existe pas encore). */
  thumbUrl: string | null;
  thumbPath: string | null;
  updatedAt: string;
}

/** TTL long pour une couverture que l'abonné rattache durablement à un livre (1 an). */
export const LONG_SIGNED_TTL = 60 * 60 * 24 * 365;

/** Normalise un titre : minuscules, sans accents, espaces compactés. */
export const normalizeTitle = (value?: string | null): string =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Charge les projets de couverture de l'abonné avec leurs miniatures signées. */
export async function loadStudioCovers(): Promise<StudioCover[]> {
  let rows: CoverProject[] = [];
  try {
    rows = await listCoverProjects();
  } catch {
    return [];
  }

  return await Promise.all(
    rows.map(async (p) => {
      // Repli sur l'illustration quand la miniature n'a pas encore été enregistrée :
      // une couverture visible ne doit jamais disparaître de la bibliothèque.
      const path = p.thumbnail_path || p.illustration_path;
      return {
        id: p.id,
        projectName: p.project_name,
        bookTitle: p.book_title,
        coverType: p.cover_type,
        thumbPath: path,
        thumbUrl: path ? await getSignedCoverUrl(path) : null,
        updatedAt: p.updated_at,
      };
    }),
  );
}

/** Index par titre normalisé : titre du livre puis nom du projet. */
export function indexCoversByTitle(covers: StudioCover[]): Record<string, StudioCover> {
  const index: Record<string, StudioCover> = {};
  // Les plus récents d'abord : on ne remplace jamais une entrée déjà posée.
  const sorted = [...covers].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  for (const cover of sorted) {
    if (!cover.thumbUrl) continue;
    for (const key of [normalizeTitle(cover.bookTitle), normalizeTitle(cover.projectName)]) {
      if (key && !index[key]) index[key] = cover;
    }
  }
  return index;
}

/** Palette éditoriale de repli, stable pour un livre donné (aucune image). */
const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg, #1F2A37 0%, #2F4858 50%, #16324F 100%)',
  'linear-gradient(160deg, #2A1810 0%, #4A2818 45%, #6B3820 100%)',
  'linear-gradient(160deg, #10322B 0%, #1C4E42 50%, #2C6B55 100%)',
  'linear-gradient(160deg, #2B2118 0%, #4A3A22 50%, #6E5427 100%)',
  'linear-gradient(160deg, #251B2E 0%, #3E2B4B 50%, #55396A 100%)',
  'linear-gradient(160deg, #17202A 0%, #26323F 50%, #3B4A5A 100%)',
];

export function fallbackGradientFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  return FALLBACK_GRADIENTS[hash % FALLBACK_GRADIENTS.length];
}
