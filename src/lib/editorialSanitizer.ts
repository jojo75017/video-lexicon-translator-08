/**
 * Filtre éditorial appliqué à chaque chapitre généré : retire les scories
 * de machine (actes, parties, balises, consignes IA, préambules) et applique
 * la typographie des livres (aucun tiret cadratin ni demi-cadratin).
 */
const SCAFFOLD_LINE = /^\s*(?:#{1,6}\s*)?(?:\*\*)?\s*(?:ACTE|Acte|PARTIE|Partie)\s+(?:[IVXLC]+|\d+|premier|première|un|deux|trois)\b[^\n]*$/gm;
const PLACEHOLDER = /\[(?:[^\]\n]{0,60}?(?:nom|auteur|insérer|inserer|titre|personnage|lieu|date|à compléter|a completer|placeholder)[^\]\n]{0,60})\]/gi;
const AI_NOTE = /\((?:\s*)(?:note|consigne|remarque|indication|NB)\b[^)]{0,400}\)/gi;
const PREAMBLE = /^\s*(?:voici|voilà)\b[^\n]{0,160}(?:chapitre|texte|contenu|suite)[^\n]*:?\s*\n+/i;
const HEADING_CHAPTER = /^\s*(?:#{1,6}\s*)?(?:\*\*)?\s*chapitre\s+(?:\d+|[IVXLC]+)\b[^\n]*\n+/i;

export function sanitizeEditorialContent(raw: string): string {
  if (!raw) return '';
  let t = raw.replace(/\r\n/g, '\n');
  t = t.replace(PREAMBLE, '').replace(HEADING_CHAPTER, '');
  t = t.replace(SCAFFOLD_LINE, '\u0000').replace(/\u0000\n?/g, '');
  t = t.replace(PLACEHOLDER, '');
  t = t.replace(AI_NOTE, '');
  t = t.replace(/^\s*#{1,6}\s+/gm, '').replace(/\*\*(.+?)\*\*/g, '$1');
  // Dialogues : tiret en début de ligne → tiret simple ; incises → virgules
  t = t.replace(/^[ \t]*[—–][ \t]*/gm, '- ');
  t = t.replace(/\s*[—–]\s*/g, ', ');
  t = t.replace(/[ \t]{2,}/g, ' ').replace(/ +([,.])/g, '$1').replace(/,\s*,/g, ',');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

/** Mémoire de continuité : la fin exacte du chapitre précédent, pas son début. */
export function buildContinuityMemory(previousContent: string, maxChars = 1400): string {
  const clean = sanitizeEditorialContent(previousContent);
  if (clean.length <= maxChars) return clean;
  const tail = clean.slice(-maxChars);
  const cut = tail.search(/[.!?…]\s/);
  return '…' + (cut > -1 && cut < 300 ? tail.slice(cut + 2) : tail);
}

export const NO_REDISCOVERY_RULE = `\n\n⛔ FAITS ACQUIS (RÈGLE ABSOLUE) :
- Tout ce qui a été découvert, révélé ou décidé dans les chapitres précédents est ACQUIS : un lieu secret, un passage, un costume, une identité ou une vérité ne se découvre qu'UNE SEULE FOIS dans tout le livre.
- Ne rejoue jamais une scène déjà racontée, ne redémarre pas l'histoire, ne réintroduis ni le décor ni les personnages.
- Les personnages gardent ce qu'ils savent, leurs blessures, leurs choix et leur évolution psychologique.
- N'écris aucune mention d'acte, de partie, de plan, de note ou de consigne : uniquement le texte du livre.`;
