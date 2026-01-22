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
    .replace(/ ([.,;:!?])/g, '$1');
  
  // ✅ CRITIQUE: Boucle pour garantir que TOUS les mots collés sont corrigés
  // (parfois un seul passage ne suffit pas avec les patterns Unicode)
  let previousLength = 0;
  let iterations = 0;
  const maxIterations = 5;
  
  while (cleaned.length !== previousLength && iterations < maxIterations) {
    previousLength = cleaned.length;
    iterations++;
    
    cleaned = cleaned
      // Cas 1: Point/exclamation/interrogation suivi d'une lettre minuscule ou majuscule
      .replace(/\.([A-Za-zÀ-ÿ])/g, '. $1')
      .replace(/!([A-Za-zÀ-ÿ])/g, '! $1')
      .replace(/\?([A-Za-zÀ-ÿ])/g, '? $1')
      .replace(/…([A-Za-zÀ-ÿ])/g, '… $1')
      // Cas 2: Virgule/point-virgule/deux-points suivi d'une lettre
      .replace(/,([A-Za-zÀ-ÿ])/g, ', $1')
      .replace(/;([A-Za-zÀ-ÿ])/g, '; $1')
      .replace(/:([A-Za-zÀ-ÿ])/g, ': $1')
      // Cas 3: Ponctuation suivie d'un chiffre
      .replace(/\.(\d)/g, '. $1')
      .replace(/,(\d)/g, ', $1')
      // Cas 4: Guillemets après ponctuation puis mot
      .replace(/\."/g, '." ')
      .replace(/\."([A-Za-zÀ-ÿ])/g, '." $1')
      .replace(/\.»([A-Za-zÀ-ÿ])/g, '.» $1')
      .replace(/!"/g, '!" ')
      .replace(/!"([A-Za-zÀ-ÿ])/g, '!" $1')
      .replace(/\?"/g, '?" ')
      .replace(/\?"([A-Za-zÀ-ÿ])/g, '?" $1');
  }
  
  // Nettoyage final
  cleaned = cleaned
    // Supprimer les caractères de contrôle Unicode indésirables
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Nettoyer les doubles espaces (réapparus après corrections)
    .replace(/  +/g, ' ')
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

/**
 * Compte le nombre de "mots collés" (ponctuation suivie directement d'une lettre/chiffre)
 * @param text Le texte à analyser
 * @returns Le nombre de mots collés détectés
 */
export function countStuckWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Pattern pour détecter les mots collés après ponctuation
  const stuckWordsPattern = /([.!?…,;:])(?=[A-ZÀ-ÖØ-öø-ÿa-z0-9])/g;
  const matches = text.match(stuckWordsPattern);
  
  return matches ? matches.length : 0;
}

/**
 * Compte les mots collés dans tout le contenu d'un livre
 * @param chapters Tableau de chapitres
 * @param preface Préface du livre
 * @param conclusion Conclusion du livre
 * @returns Le nombre total de mots collés
 */
export function countAllStuckWords(
  chapters: Array<{ title?: string; content?: string; subChapters?: Array<{ title?: string; content?: string }> }>,
  preface: string = '',
  conclusion: string = ''
): number {
  let total = 0;
  
  // Compter dans la préface et conclusion
  total += countStuckWords(preface);
  total += countStuckWords(conclusion);
  
  // Compter dans chaque chapitre
  for (const chapter of chapters) {
    total += countStuckWords(chapter.title || '');
    total += countStuckWords(chapter.content || '');
    
    // Compter dans les sous-chapitres
    if (chapter.subChapters) {
      for (const sub of chapter.subChapters) {
        total += countStuckWords(sub.title || '');
        total += countStuckWords(sub.content || '');
      }
    }
  }
  
  return total;
}
