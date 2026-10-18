/**
 * Type de livre choisi dans « Écrire un livre ».
 * Transmis à tous les robots par la ligne « TYPE DE LIVRE : … » :
 * le moteur de rédaction l'utilise pour interdire la fiction dans les guides.
 */
export type BookTypeId = 'roman' | 'guide' | 'documentaire' | 'professionnel' | 'biographie';

export const BOOK_TYPES: { id: BookTypeId; label: string; hint: string }[] = [
  { id: 'roman', label: 'Roman / Fiction', hint: 'Histoire, personnages, dialogues' },
  { id: 'guide', label: 'Guide pratique / Tutoriel', hint: 'Étapes, matériel, checklists, sans personnages' },
  { id: 'documentaire', label: 'Documentaire / Livre informatif', hint: 'Faits vérifiés, chapitres thématiques' },
  { id: 'professionnel', label: 'Livre professionnel / Formation', hint: 'Méthodes, plans d’action, cas concrets' },
  { id: 'biographie', label: 'Biographie / Témoignage', hint: 'Faits et personnes réels, chronologie' },
];

const KEY = 'v3_book_type_v1';

export function readBookType(): BookTypeId {
  try {
    const v = localStorage.getItem(KEY) as BookTypeId | null;
    if (v && BOOK_TYPES.some((t) => t.id === v)) return v;
  } catch { /* ignore */ }
  return 'roman';
}

export function writeBookType(id: BookTypeId) {
  try { localStorage.setItem(KEY, id); } catch { /* ignore */ }
}

export function bookTypeLabel(id: BookTypeId): string {
  return BOOK_TYPES.find((t) => t.id === id)?.label || 'Roman / Fiction';
}

export function isFictionType(id: BookTypeId): boolean {
  return id === 'roman';
}

/** Consignes ajoutées à la création du sommaire selon le type. */
export function outlineRulesFor(id: BookTypeId): string {
  if (id === 'roman') return '';
  if (id === 'guide') {
    return `- C'EST UN GUIDE PRATIQUE, PAS UN ROMAN : aucun personnage, aucune intrigue, aucun suspense ;
- titres descriptifs et utiles (ex. « Comment préparer sa terre avant les premières plantations »), jamais de titres romanesques ;
- progression pédagogique logique, du plus simple au plus avancé ;
- chaque objectif dit ce que le lecteur saura faire à la fin du chapitre.`;
  }
  return `- CE N'EST PAS UN ROMAN (${bookTypeLabel(id)}) : aucun personnage inventé, aucune intrigue ;
- titres informatifs et précis, progression logique et thématique.`;
}

/** Repère un sommaire romanesque proposé pour un livre non-fiction. */
export function looksLikeFictionOutline(titles: string[]): boolean {
  const pattern = /(myst[eè]re|secret|promesse|appel de|fissure|ombre|aveu|t[ée]moin|trahison|pi[eè]ge|v[ée]rit[ée]|destin|mal[ée]diction|lettre oubli|silence)/i;
  const hits = titles.filter((t) => pattern.test(t)).length;
  return titles.length > 0 && hits / titles.length >= 0.3;
}
