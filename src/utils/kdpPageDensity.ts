/**
 * Densité mots/page réaliste par format KDP.
 *
 * Source de vérité unique pour toutes les estimations de pages affichées
 * dans l'application (tableaux, dashboards, estimateurs de prix, etc.).
 *
 * Les valeurs correspondent à une mise en page roman standard
 * (police ~11pt, interligne standard, marges KDP officielles).
 */
import type { KdpFormatId } from '@/lib/bookperfect/exporters';

export type { KdpFormatId };

export const KDP_PAGE_DENSITY: Record<KdpFormatId, number> = {
  '5x8': 240,
  '5.5x8.5': 280,
  '6x9': 305,
  a5: 300,
  a4: 480,
};

export const DEFAULT_KDP_FORMAT: KdpFormatId = '6x9';

export const KDP_FORMAT_STORAGE_KEY = 'kdp_page_format';

export const KDP_FORMAT_OPTIONS: Array<{ id: KdpFormatId; label: string }> = [
  { id: '5x8', label: '5 × 8 pouces' },
  { id: '5.5x8.5', label: '5,5 × 8,5 pouces' },
  { id: '6x9', label: '6 × 9 pouces' },
  { id: 'a5', label: 'A5 (lecture)' },
  { id: 'a4', label: 'A4 (travail)' },
];

/** Retourne la densité mots/page pour un format donné (défaut sécurisé). */
export function getWordsPerPage(formatId: KdpFormatId = DEFAULT_KDP_FORMAT): number {
  return KDP_PAGE_DENSITY[formatId] ?? KDP_PAGE_DENSITY[DEFAULT_KDP_FORMAT];
}

/** Estime le nombre de pages KDP pour un nombre de mots et un format. */
export function estimatePages(words: number, formatId: KdpFormatId = DEFAULT_KDP_FORMAT): number {
  const density = getWordsPerPage(formatId);
  if (!words || words <= 0) return 0;
  return Math.ceil(words / density);
}

/** Libellé court « 6×9 — ~305 mots/page » pour l'UI. */
export function formatDensityLabel(formatId: KdpFormatId): string {
  const opt = KDP_FORMAT_OPTIONS.find((o) => o.id === formatId);
  return `${opt?.label ?? formatId} — ~${getWordsPerPage(formatId)} mots/page`;
}
