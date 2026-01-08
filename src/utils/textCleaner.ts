/**
 * Utilitaire pour nettoyer le texte généré par IA
 * Supprime les artefacts JSON/échappement indésirables
 */

/**
 * Nettoie le texte généré pour supprimer les artefacts d'échappement JSON
 * @param text Le texte à nettoyer
 * @returns Le texte nettoyé
 */
export function cleanGeneratedText(text: string): string {
  if (!text || typeof text !== 'string') return text || '';
  
  let cleaned = text
    // Supprimer les guillemets échappés \" -> rien (pas de guillemet)
    .replace(/\\"/g, '')
    // Supprimer les backslashes échappés
    .replace(/\\\\/g, '')
    // Supprimer les retours à la ligne échappés \n -> nouvelle ligne
    .replace(/\\n/g, '\n')
    // Supprimer les tabulations échappées
    .replace(/\\t/g, '\t')
    // Supprimer les slashes échappés
    .replace(/\\\//g, '/')
    // Supprimer les patterns JSON résiduels
    .replace(/^\s*{\s*"[^"]*"\s*:\s*"/gm, '')
    .replace(/"\s*}\s*$/gm, '')
    .replace(/^\s*\[\s*"/gm, '')
    .replace(/"\s*\]\s*$/gm, '')
    .replace(/",\s*"[^"]*"\s*:\s*"/g, ' ')
    .replace(/":\s*"/g, ': ')
    .replace(/{\s*"/g, '')
    .replace(/"\s*}/g, '')
    // Supprimer les guillemets orphelins en début/fin de ligne
    .replace(/^"+/gm, '')
    .replace(/"+$/gm, '')
    // Supprimer les guillemets isolés
    .replace(/(?<!\w)"(?!\w)/g, '')
    // Nettoyer les doubles espaces
    .replace(/  +/g, ' ')
    // Nettoyer les espaces avant ponctuation
    .replace(/ ([.,;:!?])/g, '$1')
    // Supprimer les caractères de contrôle Unicode indésirables
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Nettoyer les lignes vides multiples
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Nettoie un chapitre entier (titre et contenu)
 * @param chapter L'objet chapitre à nettoyer
 * @returns Le chapitre avec le texte nettoyé
 */
export function cleanChapter<T extends { titre?: string; title?: string; contenu?: string; content?: string }>(chapter: T): T {
  if (!chapter) return chapter;
  
  return {
    ...chapter,
    titre: chapter.titre ? cleanGeneratedText(chapter.titre) : chapter.titre,
    title: chapter.title ? cleanGeneratedText(chapter.title) : chapter.title,
    contenu: chapter.contenu ? cleanGeneratedText(chapter.contenu) : chapter.contenu,
    content: chapter.content ? cleanGeneratedText(chapter.content) : chapter.content,
  };
}

/**
 * Nettoie un tableau de chapitres
 * @param chapters Tableau de chapitres à nettoyer
 * @returns Tableau de chapitres avec le texte nettoyé
 */
export function cleanChapters<T extends { titre?: string; title?: string; contenu?: string; content?: string }>(chapters: T[]): T[] {
  if (!chapters || !Array.isArray(chapters)) return chapters || [];
  return chapters.map(cleanChapter);
}
