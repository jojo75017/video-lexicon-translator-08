/**
 * Utilitaire pour nettoyer le texte généré par IA
 * Supprime les artefacts JSON/échappement indésirables
 */

import { applyFrenchTypography } from './frenchTypography';

/**
 * Nettoie le texte généré pour supprimer les artefacts d'échappement JSON
 * @param text Le texte à nettoyer
 * @returns Le texte nettoyé
 */
export function cleanGeneratedText(text: string): string {
  if (!text || typeof text !== 'string') return text || '';
  
  let cleaned = text
    // ========== NETTOYAGE MARKDOWN / ASTÉRISQUES ==========
    // Supprimer gras+italique ***text*** ou ___text___
    .replace(/\*{3}(.+?)\*{3}/g, '$1')
    .replace(/_{3}(.+?)_{3}/g, '$1')
    // Supprimer gras **text** ou __text__
    .replace(/\*{2}(.+?)\*{2}/g, '$1')
    .replace(/_{2}(.+?)_{2}/g, '$1')
    // Supprimer italique *text* ou _text_ (pas les underscores dans les mots)
    .replace(/\*(.+?)\*/g, '$1')
    // Supprimer les astérisques orphelins restants
    .replace(/\*+/g, '')
    // Supprimer les titres markdown # ## ### etc. (avec ou sans espace après, avec ou sans texte)
    .replace(/^#{1,6}\s*/gm, '')
    // Supprimer les # isolés ou en groupe au milieu d'une ligne (artefacts IA)
    .replace(/\s#{1,6}\s/g, ' ')
    .replace(/#{2,}/g, '')
    // Supprimer tout # résiduel isolé (pas dans les mots)
    .replace(/(?<![&\w])#(?!\w)/g, '')
    // Supprimer les séparateurs markdown --- *** ===
    .replace(/^[=\-*_]{3,}\s*$/gm, '')
    // Supprimer les balises de liste markdown - ou *
    .replace(/^\s*[-*]\s+/gm, '• ')
    // Supprimer les blocs de code markdown ```...```
    .replace(/```[\s\S]*?```/g, '')
    // Supprimer les backticks isolés
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`+/g, '')
    // ========== NETTOYAGE DES BALISES HTML ==========
    .replace(/<\/?(?:p|br|div|span|strong|em|b|i|u|h[1-6]|ul|ol|li|blockquote|a|img|table|tr|td|th|thead|tbody|hr|pre|code)[^>]*>/gi, '')
    // ========== NETTOYAGE DES ENTITÉS HTML ==========
    .replace(/&nbsp;?/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&#xa0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&hellip;/gi, '…')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&laquo;/gi, '«')
    .replace(/&raquo;/gi, '»')
    .replace(/&ldquo;/gi, '\u201C')
    .replace(/&rdquo;/gi, '\u201D')
    .replace(/&lsquo;/gi, '\u2018')
    .replace(/&rsquo;/gi, '\u2019')
    // Convertir les guillemets échappés \" -> guillemet réel
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
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
    // Supprimer les fragments JSON qui fuient dans le texte
    .replace(/json\s*"?\s*numero\s*"?\s*:\s*\d+\s*,?\s*"?\s*(titre)?\s*"?\s*:?\s*/gi, '')
    .replace(/"?\s*numero\s*"?\s*:\s*\d+\s*,?\s*"?\s*(titre)?\s*"?\s*:?\s*/gi, '')
    // Cas génériques de clés JSON orphelines
    .replace(/(^|\s)"?(titre|title|content|chapters|subChapters|contenu|numero|description|summary|text|body|paragraph)"?\s*:\s*/gi, '$1')
    .replace(/^[\[{,\s]+"?(numero|titre|title|content|chapters|subChapters|contenu)"?\s*:\s*/gim, '')
    .replace(/^"{3,}/gm, '"')
    .replace(/"{3,}$/gm, '"')
    // ========== NETTOYAGE DES MÉTADONNÉES JSON RÉSIDUELLES ==========
    // Supprimer les fragments JSON de métadonnées en fin de texte (nombreMots, qualityScore, wordCount, etc.)
    .replace(/,?\s*"(?:nombreMots|nombre_mots|wordCount|word_count|qualityScore|quality_score|scoreGlobal|score_global|scoreReelEstime|nombrePagesEstime|nombreMotsEstime|nombreMotsPrevu|contenuComplet|raw|_qualityScore|_attempts)"\s*:\s*(?:"[^"]*"|\d+|true|false|null)\s*/gi, '')
    // Supprimer les accolades/crochets JSON orphelins en fin de texte
    .replace(/[,\s]*[}\]]\s*$/g, (match, offset, str) => {
      // Ne supprimer que si c'est probablement un résidu JSON (pas de { ou [ correspondant proche)
      const lastOpen = Math.max(str.lastIndexOf('{', offset - 1), str.lastIndexOf('[', offset - 1));
      const textBetween = str.substring(lastOpen, offset);
      if (lastOpen >= 0 && textBetween.includes('"') && textBetween.includes(':')) return '';
      // Aussi supprimer si c'est juste } ou ] tout seul en fin
      if (/^\s*[}\]]\s*$/.test(match.trim())) return '';
      return match;
    })
    // Supprimer les blocs JSON complets de métadonnées en fin de texte
    .replace(/[.,]?\s*"(?:nombreMots|wordCount|qualityScore|score\w+)"\s*:\s*\d+\s*(?:,\s*"(?:\w+)"\s*:\s*(?:\d+|"[^"]*")\s*)*[}\]]*\s*`*\s*$/gi, '')
    // ========== NETTOYAGE DES MÉTADONNÉES / ARTEFACTS DE STATS ==========
    .replace(/\b(?:nombre\s+de\s+mots|word\s*count|mots?\s*:?\s*total)\s*[:=]\s*\d[\d\s.,]*/gi, '')
    .replace(/export\s+epub\s*(?:natif|native)?[^.\n]*/gi, '')
    .replace(/\b(?:pages?\s+estim[ée]e?s?|estimated\s+pages?)\s*[:=]\s*\d[\d\s.,]*/gi, '')
    .replace(/chapitre\s+\d+\s*[-–—]\s*nombre\s+de\s+mots\s*[:=]\s*\d[\d\s.,]*/gi, '')
    .replace(/\b(?:score|lisibilit[ée]|readability|flesch)\s*[:=]\s*\d[\d.,]*\s*(?:\/\s*\d+)?/gi, '')
    .replace(/\[(?:note|remarque|ndlr|instruction|info|warning|tip|important|todo|fixme|hack|xxx)[^\]]*\]/gi, '')
    .replace(/\((?:note\s+de\s+l'auteur|note\s+de\s+l'éditeur|note\s*:)[^)]*\)/gi, '')
    .replace(/[~≈]?\s*\d{3,5}\s*mots?\b/gi, '')
    .replace(/\(\s*\d{3,5}\s*mots?\s*\)/gi, '')
    // ========== NETTOYAGE ARTEFACTS IA COURANTS ==========
    .replace(/\b(?:g[ée]n[ée]r[ée]\s+par\s+(?:ia|ai|intelligence\s+artificielle)|generated\s+by\s+ai|cr[ée][ée]\s+avec\s+(?:ia|ai|chatgpt|gemini|claude|gpt|openai|llm))[^.\n]*/gi, '')
    .replace(/\n\s*[-–—]*\s*(?:fin\s+du\s+chapitre|end\s+of\s+chapter|fin\s+de\s+(?:la\s+)?section)\s*[-–—]*\s*$/gi, '')
    .replace(/\b(?:voici|here\s+is|ci-dessous|below\s+is)\s+(?:le|la|les|the|your|un|une)\s+(?:chapitre|chapter|texte|text|contenu|content|version|suite|r[ée]sum[ée])[^.\n]*[.:]\s*/gi, '')
    .replace(/\b(?:ce\s+chapitre|this\s+chapter|cette\s+section)\s+(?:contient|contains|fait|compte)\s+[^.\n]*\d+\s*mots?[^.\n]*/gi, '')
    .replace(/\b(?:format|longueur|length|tokens?|caractères|characters)\s*[:=]\s*[^\n]*/gi, '')
    // Supprimer les instructions IA résiduelles
    .replace(/\b(?:je\s+vais\s+(?:maintenant|écrire|rédiger|continuer)|let\s+me\s+(?:write|continue|create)|continuons\s+avec|passons\s+(?:à|au))\b[^.\n]*[.:]\s*/gi, '')
    // Supprimer "Chapitre X :" redondant en début de contenu (déjà dans le titre)
    .replace(/^chapitre\s+\d+\s*[:–—]\s*/gim, '')
    .replace(/^\s*(?:---+|\*\*\*+|===+|___+)\s*$/gm, '')
    .replace(/^(?:résumé|summary|synopsis|abstract)\s*[:]\s*/gim, '')
    .replace(/^\s*[-*=_]{1,2}\s*$/gm, '')
    // ========== NETTOYAGE DES EMOJIS TEXTUELS ==========
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
    // ========== NETTOYAGE DES URLS ORPHELINES ==========
    .replace(/https?:\/\/[^\s)>\]]+/g, '')
    // ========== NETTOYAGE DES RÉPÉTITIONS IA (bégaiement) ==========
    // Mots identiques répétés 3+ fois consécutivement
    .replace(/\b(\w{3,})\s+(?:\1\s+){2,}\1\b/gi, '$1')
    // Même mot répété 2 fois consécutivement (sauf mots courts courants)
    .replace(/\b((?!que|qui|très|plus|dans|avec|pour|mais|tout|elle|nous|vous|leur|bien|même|être|faire|aller|voir|dire|dont)\w{4,})\s+\1\b/gi, '$1')
    // ========== NETTOYAGE PHRASES IA RÉCURRENTES ==========
    .replace(/\b(?:n'hésitez\s+pas\s+à|feel\s+free\s+to)\b[^.\n]*/gi, '')
    .replace(/\b(?:en\s+conclusion|pour\s+conclure|en\s+résumé|pour\s+résumer)\s*,?\s*(?:nous\s+avons\s+vu|il\s+est\s+(?:important|essentiel|crucial)\s+de\s+(?:noter|souligner|rappeler))\b[^.\n]*/gi, '')
    .replace(/\b(?:il\s+est\s+(?:important|essentiel|crucial|fondamental)\s+de\s+(?:noter|souligner|comprendre|rappeler)\s+que)\b/gi, '')
    .replace(/  +/g, ' ')
    .replace(/ ([.,;:!?])/g, '$1');
  
  // ✅ CRITIQUE: Boucle RENFORCÉE pour garantir que TOUS les mots collés sont corrigés
  // Augmenté à 10 itérations pour couvrir tous les cas complexes
  let previousLength = 0;
  let iterations = 0;
  const maxIterations = 10;
  
  while (cleaned.length !== previousLength && iterations < maxIterations) {
    previousLength = cleaned.length;
    iterations++;
    
    cleaned = cleaned
      // ========== CAS 1: PONCTUATION FORTE + LETTRE ==========
      // Point suivi d'une lettre (minuscule ou majuscule, y compris accents)
      .replace(/\.([A-Za-zÀ-ÖØ-öø-ÿ])/g, '. $1')
      // Exclamation suivie d'une lettre
      .replace(/!([A-Za-zÀ-ÖØ-öø-ÿ])/g, '! $1')
      // Interrogation suivie d'une lettre
      .replace(/\?([A-Za-zÀ-ÖØ-öø-ÿ])/g, '? $1')
      // Points de suspension suivis d'une lettre
      .replace(/…([A-Za-zÀ-ÖØ-öø-ÿ])/g, '… $1')
      // Trois points consécutifs suivis d'une lettre
      .replace(/\.\.\.([A-Za-zÀ-ÖØ-öø-ÿ])/g, '... $1')
      
      // ========== CAS 2: PONCTUATION FAIBLE + LETTRE ==========
      // Virgule suivie d'une lettre
      .replace(/,([A-Za-zÀ-ÖØ-öø-ÿ])/g, ', $1')
      // Point-virgule suivi d'une lettre
      .replace(/;([A-Za-zÀ-ÖØ-öø-ÿ])/g, '; $1')
      // Deux-points suivis d'une lettre (IMPORTANT pour les dialogues)
      .replace(/:([A-Za-zÀ-ÖØ-öø-ÿ])/g, ': $1')
      
      // ========== CAS 3: PONCTUATION + CHIFFRE ==========
      .replace(/\.(\d)/g, '. $1')
      .replace(/,(\d)/g, ', $1')
      .replace(/:(\d)/g, ': $1')
      .replace(/!(\d)/g, '! $1')
      .replace(/\?(\d)/g, '? $1')
      
      // ========== CAS 4: GUILLEMETS FRANÇAIS ==========
      // Après guillemet fermant français suivi d'une lettre
      .replace(/»([A-Za-zÀ-ÖØ-öø-ÿ])/g, '» $1')
      // Ponctuation + guillemet fermant + lettre
      .replace(/\.»([A-Za-zÀ-ÖØ-öø-ÿ])/g, '.» $1')
      .replace(/!»([A-Za-zÀ-ÖØ-öø-ÿ])/g, '!» $1')
      .replace(/\?»([A-Za-zÀ-ÖØ-öø-ÿ])/g, '?» $1')
      
      // ========== CAS 5: GUILLEMETS ANGLAIS ==========
      // Après guillemet fermant anglais suivi d'une lettre
      .replace(/"([A-Za-zÀ-ÖØ-öø-ÿ])/g, '" $1')
      // Ponctuation + guillemet fermant + lettre
      .replace(/\."([A-Za-zÀ-ÖØ-öø-ÿ])/g, '." $1')
      .replace(/!"([A-Za-zÀ-ÖØ-öø-ÿ])/g, '!" $1')
      .replace(/\?"([A-Za-zÀ-ÖØ-öø-ÿ])/g, '?" $1')
      
      // ========== CAS 6: PARENTHÈSES ==========
      // Après parenthèse fermante suivie d'une lettre
      .replace(/\)([A-Za-zÀ-ÖØ-öø-ÿ])/g, ') $1')
      // Ponctuation + parenthèse fermante + lettre
      .replace(/\.\)([A-Za-zÀ-ÖØ-öø-ÿ])/g, '.) $1')
      
      // ========== CAS 7: CROCHETS ==========
      .replace(/\]([A-Za-zÀ-ÖØ-öø-ÿ])/g, '] $1')
      
      // ========== CAS 8: TIRETS LONGS (dialogues) ==========
      // Tiret long suivi d'une lettre sans espace
      .replace(/—([A-Za-zÀ-ÖØ-öø-ÿ])/g, '— $1')
      .replace(/–([A-Za-zÀ-ÖØ-öø-ÿ])/g, '– $1');
  }
  
  // Nettoyage final
  cleaned = cleaned
    // Supprimer les caractères de contrôle Unicode indésirables (SAUF \n et \t)
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    // Nettoyer les doubles espaces (réapparus après corrections)
    .replace(/  +/g, ' ')
    // Nettoyer les lignes vides multiples
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Nettoie le texte ET applique la typographie française professionnelle.
 * À utiliser pour les exports (DOCX, EPUB, PDF).
 */
export function cleanAndTypographize(text: string): string {
  const cleaned = cleanGeneratedText(text);
  return applyFrenchTypography(cleaned);
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

/**
 * Nettoie le texte spécifiquement pour la synthèse vocale (TTS).
 * Supprime tout le markdown, les astérisques, les balises, et optimise pour la lecture audio.
 */
export function cleanForAudio(text: string): string {
  if (!text || typeof text !== 'string') return text || '';
  
  let cleaned = cleanGeneratedText(text);
  
  cleaned = cleaned
    // Supprimer TOUT astérisque restant (gras, italique, orphelins)
    .replace(/\*/g, '')
    // Supprimer underscores de mise en forme
    .replace(/_([^_]+)_/g, '$1')
    .replace(/_+/g, ' ')
    // Supprimer les titres markdown # ## ### etc. (avec ou sans espace)
    .replace(/^#{1,6}\s*/gm, '')
    // Supprimer tout # résiduel dans le texte
    .replace(/#/g, '')
    // Supprimer les balises HTML résiduelles
    .replace(/<[^>]*>/g, '')
    // Supprimer les crochets markdown [texte](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Supprimer les crochets simples [texte]
    .replace(/\[([^\]]*)\]/g, '$1')
    // Supprimer les backticks
    .replace(/`+/g, '')
    // Supprimer les puces et listes
    .replace(/^•\s*/gm, '')
    .replace(/^[-–—]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // ========== NETTOYAGE DES MÉTADONNÉES AUDIO ==========
    .replace(/\b(?:nombre\s+de\s+mots|word\s*count|mots?\s*:?\s*total)\s*[:=]\s*\d[\d\s.,]*/gi, '')
    .replace(/export\s+epub\s*(?:natif|native)?[^.\n]*/gi, '')
    .replace(/\b(?:pages?\s+estim[ée]e?s?|estimated\s+pages?)\s*[:=]\s*\d[\d\s.,]*/gi, '')
    .replace(/[~≈]?\s*\d{3,5}\s*mots?\b/gi, '')
    .replace(/\(\s*\d{3,5}\s*mots?\s*\)/gi, '')
    .replace(/\[(?:note|remarque|ndlr|instruction)[^\]]*\]/gi, '')
    // ========== OPTIMISATIONS LECTURE AUDIO ==========
    // Ajouter des pauses naturelles (points de suspension → pause)
    .replace(/\.{3,}/g, '...')
    // Supprimer les doubles tirets
    .replace(/--+/g, ', ')
    // Supprimer les séparateurs
    .replace(/^[=\-*_]{3,}\s*$/gm, '')
    // Supprimer les URLs (illisibles en audio)
    .replace(/https?:\/\/[^\s)>\]]+/g, '')
    .replace(/www\.[^\s)>\]]+/g, '')
    // Supprimer les adresses email
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '')
    // Supprimer les emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
    // Convertir les abréviations courantes pour la lecture
    .replace(/\bn°\s*/gi, 'numéro ')
    .replace(/\bM\.\s/g, 'Monsieur ')
    .replace(/\bMme\.?\s/g, 'Madame ')
    .replace(/\bMlle\.?\s/g, 'Mademoiselle ')
    .replace(/\bDr\.?\s/g, 'Docteur ')
    .replace(/\bPr\.?\s/g, 'Professeur ')
    .replace(/\bMe\.?\s/g, 'Maître ')
    .replace(/\bSt\.?\s/g, 'Saint ')
    .replace(/\bSte\.?\s/g, 'Sainte ')
    .replace(/\betc\.\s/g, 'et cætera. ')
    .replace(/\bcf\.\s/gi, 'voir ')
    .replace(/\bex\.\s/gi, 'par exemple ')
    .replace(/\bvs\.?\s/gi, 'contre ')
    .replace(/\bp\.\s*(\d+)/gi, 'page $1')
    .replace(/\bpp\.\s*(\d+)/gi, 'pages $1')
    .replace(/\bchap\.\s*/gi, 'chapitre ')
    .replace(/\bfig\.\s*/gi, 'figure ')
    .replace(/\bvol\.\s*/gi, 'volume ')
    .replace(/\béd\.\s*/gi, 'édition ')
    // Convertir les pourcentages pour la lecture
    .replace(/(\d+)\s*%/g, '$1 pour cent')
    // Convertir les symboles courants
    .replace(/&/g, ' et ')
    .replace(/\+/g, ' plus ')
    // Convertir les chiffres romains courants en toutes lettres
    .replace(/\bXXI(?:e|ème)?\s*siècle/gi, 'vingt-et-unième siècle')
    .replace(/\bXX(?:e|ème)?\s*siècle/gi, 'vingtième siècle')
    .replace(/\bXIX(?:e|ème)?\s*siècle/gi, 'dix-neuvième siècle')
    .replace(/\bXVIII(?:e|ème)?\s*siècle/gi, 'dix-huitième siècle')
    .replace(/\bXVII(?:e|ème)?\s*siècle/gi, 'dix-septième siècle')
    .replace(/\bXVI(?:e|ème)?\s*siècle/gi, 'seizième siècle')
    .replace(/\bXV(?:e|ème)?\s*siècle/gi, 'quinzième siècle')
    // Améliorer la ponctuation pour des pauses naturelles
    .replace(/\s*;\s*/g, '. ')
    .replace(/\s*:\s*$/gm, '.')
    // Supprimer les parenthèses vides
    .replace(/\(\s*\)/g, '')
    // Supprimer les crochets vides
    .replace(/\[\s*\]/g, '')
    // Convertir les parenthèses en virgules pour fluidité audio
    .replace(/\s*\(\s*/g, ', ')
    .replace(/\s*\)\s*/g, ', ')
    // Nettoyer les lignes vides multiples
    .replace(/\n{3,}/g, '\n\n')
    // Nettoyer les doubles virgules ou ponctuation redondante
    .replace(/,\s*,/g, ',')
    .replace(/\.\s*\./g, '.')
    // Nettoyer les espaces multiples
    .replace(/  +/g, ' ')
    .trim();
  
  // POST-PROCESSING : boucle pour garantir zéro artefact markdown
  let prev = '';
  let iterations = 0;
  while (cleaned !== prev && iterations < 5) {
    prev = cleaned;
    iterations++;
    cleaned = cleaned
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '')
      .replace(/^_+|_+$/gm, '')
      .replace(/\[\s*\]/g, '')
      .replace(/\(\s*\)/g, '')
      .replace(/  +/g, ' ');
  }
  
  return cleaned;
}

/**
 * Détecte les caractères spéciaux markdown interdits dans un texte audio.
 * Retourne un objet avec le nombre d'artefacts et les types trouvés.
 */
export function detectAudioArtifacts(text: string): { count: number; types: string[] } {
  if (!text || typeof text !== 'string') return { count: 0, types: [] };
  
  const checks: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /\*+/g, label: 'Astérisques (*)' },
    { pattern: /#{1,6}\s/g, label: 'Titres markdown (#)' },
    { pattern: /`+/g, label: 'Backticks (`)' },
    { pattern: /__+/g, label: 'Underscores doubles (__)' },
    { pattern: /^[-–—]{3,}\s*$/gm, label: 'Séparateurs (---)' },
    { pattern: /<[^>]+>/g, label: 'Balises HTML' },
  ];
  
  let count = 0;
  const types: string[] = [];
  
  for (const { pattern, label } of checks) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      count += matches.length;
      types.push(`${label} (×${matches.length})`);
    }
  }
  
  return { count, types };
}
