export type BookSiteTheme = 'clair' | 'litteraire' | 'doux' | 'sombre';

export const BOOK_SITE_THEMES: { id: BookSiteTheme; label: string; hint: string }[] = [
  { id: 'clair', label: 'Clair & moderne', hint: 'Guides, business, pratique' },
  { id: 'litteraire', label: 'Littéraire & papier', hint: 'Romans, sagas, histoire' },
  { id: 'doux', label: 'Doux & chaleureux', hint: 'Jeunesse, bien-être, romance' },
  { id: 'sombre', label: 'Cinéma & mystère', hint: 'Thriller, polar, fantasy' },
];

const RULES: [BookSiteTheme, RegExp][] = [
  ['sombre', /thriller|polar|policier|crime|meurtre|enqu[eê]te|myst[eè]re|horreur|fantasy|fantastique|vampire|sombre|suspense|noir|masqu/i],
  ['doux', /enfant|jeunesse|conte|album|b[ée]b[ée]|bien[- ]?[êe]tre|d[ée]veloppement personnel|romance|amour|m[ée]ditation|famille|cuisine|recette/i],
  ['clair', /guide|m[ée]thode|business|argent|marketing|entreprise|pratique|apprendre|comment|manuel|formation|productivit/i],
  ['litteraire', /roman|saga|historique|biographie|m[ée]moires|po[ée]sie|litt[ée]rat/i],
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
