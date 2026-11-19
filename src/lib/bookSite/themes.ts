export type BookSiteTheme = 'clair' | 'litteraire' | 'doux' | 'sombre' | 'jeunesse' | 'policier' | 'western' | 'fantasy' | 'sf' | 'horreur' | 'aventure' | 'bienetre';

export const BOOK_SITE_THEMES: { id: BookSiteTheme; label: string; hint: string; emoji: string }[] = [
  { id: 'jeunesse', label: 'Jeunesse', hint: 'Contes, albums, enfants', emoji: '🧸' },
  { id: 'sombre', label: 'Thriller', hint: 'Suspense, nuit, néons', emoji: '🔪' },
  { id: 'doux', label: 'Romance', hint: 'Amour, émotion', emoji: '🌹' },
  { id: 'policier', label: 'Policier', hint: 'Enquête, film noir', emoji: '🕵️' },
  { id: 'western', label: 'Western', hint: 'Désert, cow-boys, justiciers', emoji: '🤠' },
  { id: 'fantasy', label: 'Fantasy', hint: 'Magie, royaumes', emoji: '🐉' },
  { id: 'sf', label: 'Science-fiction', hint: 'Espace, futur', emoji: '🚀' },
  { id: 'horreur', label: 'Horreur', hint: 'Frissons, fantômes', emoji: '👻' },
  { id: 'aventure', label: 'Aventure', hint: 'Jungle, trésors', emoji: '🗺️' },
  { id: 'litteraire', label: 'Historique', hint: 'Sagas, romans d’époque', emoji: '📜' },
  { id: 'bienetre', label: 'Bien-être', hint: 'Développement personnel', emoji: '🌿' },
  { id: 'clair', label: 'Guide pratique', hint: 'Business, méthode', emoji: '💼' },
];

const RULES: [BookSiteTheme, RegExp][] = [
  ['jeunesse', /enfant|jeunesse|conte|album|b[ée]b[ée]|3[- ]?6 ans|histoires? du soir|doudou/i],
  ['western', /western|cow-?boy|far[- ]?west|shérif|sh[ée]rif|zorro|cuervo|justicier|ranch|apache|mexique/i],
  ['horreur', /horreur|zombie|fant[ôo]me|hant[ée]|d[ée]mon|vampire|terreur/i],
  ['sf', /science[- ]?fiction|espace|galax|plan[èe]te|robot|futur|cyber|vaisseau|androïde/i],
  ['fantasy', /fantasy|dragon|magie|sorci|elfe|royaume|fantastique|mage/i],
  ['policier', /policier|enqu[eê]te|d[ée]tective|inspecteur|commissaire|meurtre|crime|polar/i],
  ['sombre', /thriller|suspense|myst[eè]re|secr[eè]te?|complot|noir|traque|amn[ée]sie/i],
  ['doux', /romance|amour|passion|c[œo]ur|mariage|coup de foudre/i],
  ['aventure', /aventure|tr[ée]sor|jungle|exp[ée]dition|pirate|voyage|[îi]le/i],
  ['bienetre', /bien[- ]?[êe]tre|d[ée]veloppement personnel|m[ée]ditation|confiance|bonheur|sant[ée]|yoga/i],
  ['clair', /guide|m[ée]thode|business|argent|marketing|entreprise|pratique|apprendre|comment|manuel|formation|productivit|cuisine|recette/i],
  ['litteraire', /roman|saga|historique|biographie|m[ée]moires|po[ée]sie|litt[ée]rat|si[eè]cle|guerre/i],
];

/** Picks a theme from the book's own words; never black by default. */
export function detectBookSiteTheme(text: string): BookSiteTheme {
  for (const [theme, re] of RULES) if (re.test(text)) return theme;
  return 'clair';
}

export function slugifyTitle(title: string): string {
  const s = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/g, '');
  return s.length >= 3 && s !== 'el-cuervo' ? s : `livre-${s || 'sans-titre'}`;
}

/** First paragraphs of the first written chapter, capped for a public excerpt. */
export function firstExcerpt(chapters: unknown, max = 1800): { title: string; text: string } {
  const list = Array.isArray(chapters) ? chapters : [];
  for (const raw of list) {
    const c = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    const body = String(c.content || c.contenu || '').replace(/<[^>]+>/g, ' ').trim();
    if (!body) continue;
    const paras = body.split(/\n\s*\n|\n/).map((p) => p.trim()).filter((p) => p.length > 40 && !/^(acte|partie|chapitre)\b/i.test(p));
    let text = '';
    for (const p of paras) { if ((text + p).length > max) break; text += (text ? '\n\n' : '') + p; }
    return { title: String(c.title || c.titre || 'Chapitre 1'), text: text || body.slice(0, max) };
  }
  return { title: '', text: '' };
}
