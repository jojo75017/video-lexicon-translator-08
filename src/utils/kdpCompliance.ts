/**
 * Vérificateur de conformité KDP (Kindle Direct Publishing)
 * Vérifie les normes Amazon avant export
 */

export interface KdpComplianceResult {
  score: number; // 0-100
  status: 'pass' | 'warning' | 'fail';
  checks: KdpCheck[];
  summary: string;
}

export interface KdpCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  category: 'format' | 'content' | 'metadata' | 'structure';
}

interface KdpCheckInput {
  title?: string;
  authorName?: string;
  description?: string;
  keywords?: string[];
  categories?: string[];
  chapters?: Array<{
    title?: string;
    content?: string;
    subChapters?: Array<{ title?: string; content?: string }>;
  }>;
  preface?: string;
  conclusion?: string;
  price?: number;
  pageCount?: number;
  format?: 'ebook' | 'paperback' | 'both';
}

/**
 * Lance une vérification complète de conformité KDP
 */
export function runKdpComplianceCheck(input: KdpCheckInput): KdpComplianceResult {
  const checks: KdpCheck[] = [];

  // ========== MÉTADONNÉES ==========
  // Titre
  checks.push(checkTitle(input.title));
  // Nom d'auteur
  checks.push(checkAuthorName(input.authorName));
  // Description KDP
  checks.push(checkDescription(input.description));
  // Mots-clés
  checks.push(checkKeywords(input.keywords));
  // Catégories
  checks.push(checkCategories(input.categories));
  // Prix
  checks.push(checkPrice(input.price, input.format));

  // ========== CONTENU ==========
  // Nombre de mots total
  const totalWords = countTotalWords(input);
  checks.push(checkWordCount(totalWords));
  // Chapitres vides
  checks.push(checkEmptyChapters(input.chapters));
  // Longueur minimale par chapitre
  checks.push(checkChapterMinLength(input.chapters));
  // Préface et conclusion
  checks.push(checkPrefaceConclusion(input.preface, input.conclusion));

  // ========== FORMAT ==========
  // Structure hiérarchique
  checks.push(checkStructure(input.chapters));
  // Caractères spéciaux interdits
  checks.push(checkForbiddenCharacters(input));
  // Taille estimée du fichier
  checks.push(checkEstimatedFileSize(totalWords));
  // Nombre de pages (broché)
  checks.push(checkPageCount(input.pageCount || Math.ceil(totalWords / 250)));

  // Calcul du score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const score = Math.round((passCount * 100 + warnCount * 50) / checks.length);
  
  const status: 'pass' | 'warning' | 'fail' = 
    failCount > 2 ? 'fail' : 
    failCount > 0 || warnCount > 3 ? 'warning' : 'pass';

  const summary = status === 'pass' 
    ? `✅ Manuscrit conforme KDP (${passCount}/${checks.length} vérifications réussies)`
    : status === 'warning'
    ? `⚠️ ${warnCount} avertissement(s) et ${failCount} erreur(s) à corriger`
    : `❌ ${failCount} erreur(s) critiques bloquent la publication KDP`;

  return { score, status, checks, summary };
}

function checkTitle(title?: string): KdpCheck {
  if (!title || title.trim().length === 0) {
    return { id: 'title', label: 'Titre du livre', status: 'fail', message: 'Titre manquant', category: 'metadata' };
  }
  if (title.length > 200) {
    return { id: 'title', label: 'Titre du livre', status: 'fail', message: `Titre trop long (${title.length}/200 caractères max)`, category: 'metadata' };
  }
  if (title.length < 3) {
    return { id: 'title', label: 'Titre du livre', status: 'warning', message: 'Titre très court, risque de faible visibilité', category: 'metadata' };
  }
  return { id: 'title', label: 'Titre du livre', status: 'pass', message: `Titre valide (${title.length} caractères)`, category: 'metadata' };
}

function checkAuthorName(name?: string): KdpCheck {
  if (!name || name.trim().length === 0) {
    return { id: 'author', label: 'Nom d\'auteur', status: 'fail', message: 'Nom d\'auteur manquant', category: 'metadata' };
  }
  if (name.length > 100) {
    return { id: 'author', label: 'Nom d\'auteur', status: 'warning', message: 'Nom d\'auteur très long', category: 'metadata' };
  }
  return { id: 'author', label: 'Nom d\'auteur', status: 'pass', message: 'Nom d\'auteur valide', category: 'metadata' };
}

function checkDescription(desc?: string): KdpCheck {
  if (!desc || desc.trim().length === 0) {
    return { id: 'description', label: 'Description KDP', status: 'fail', message: 'Description manquante', category: 'metadata' };
  }
  const plainLength = desc.replace(/<[^>]*>/g, '').length;
  if (plainLength > 4000) {
    return { id: 'description', label: 'Description KDP', status: 'fail', message: `Description trop longue (${plainLength}/4000 caractères)`, category: 'metadata' };
  }
  if (plainLength < 100) {
    return { id: 'description', label: 'Description KDP', status: 'warning', message: 'Description trop courte pour un bon référencement', category: 'metadata' };
  }
  // Vérifier les balises HTML autorisées
  const forbiddenTags = desc.match(/<(?!\/?(b|i|br|h[1-6]|p|ul|ol|li)\b)[^>]+>/gi);
  if (forbiddenTags && forbiddenTags.length > 0) {
    return { id: 'description', label: 'Description KDP', status: 'warning', message: `Balises HTML non autorisées détectées : ${forbiddenTags.slice(0, 3).join(', ')}`, category: 'metadata' };
  }
  return { id: 'description', label: 'Description KDP', status: 'pass', message: `Description valide (${plainLength} caractères)`, category: 'metadata' };
}

function checkKeywords(keywords?: string[]): KdpCheck {
  if (!keywords || keywords.length === 0) {
    return { id: 'keywords', label: 'Mots-clés KDP', status: 'fail', message: 'Aucun mot-clé défini (7 recommandés)', category: 'metadata' };
  }
  if (keywords.length < 7) {
    return { id: 'keywords', label: 'Mots-clés KDP', status: 'warning', message: `Seulement ${keywords.length}/7 mots-clés définis`, category: 'metadata' };
  }
  // Vérifier la longueur max par mot-clé (50 caractères)
  const tooLong = keywords.filter(k => k.length > 50);
  if (tooLong.length > 0) {
    return { id: 'keywords', label: 'Mots-clés KDP', status: 'warning', message: `${tooLong.length} mot(s)-clé(s) dépassent 50 caractères`, category: 'metadata' };
  }
  return { id: 'keywords', label: 'Mots-clés KDP', status: 'pass', message: `${keywords.length} mots-clés valides`, category: 'metadata' };
}

function checkCategories(categories?: string[]): KdpCheck {
  if (!categories || categories.length === 0) {
    return { id: 'categories', label: 'Catégories Amazon', status: 'warning', message: 'Aucune catégorie définie (2 recommandées)', category: 'metadata' };
  }
  if (categories.length < 2) {
    return { id: 'categories', label: 'Catégories Amazon', status: 'warning', message: 'Une seule catégorie, 2 recommandées', category: 'metadata' };
  }
  return { id: 'categories', label: 'Catégories Amazon', status: 'pass', message: `${categories.length} catégories définies`, category: 'metadata' };
}

function checkPrice(price?: number, format?: string): KdpCheck {
  if (!price || price <= 0) {
    return { id: 'price', label: 'Prix de vente', status: 'warning', message: 'Prix non défini', category: 'metadata' };
  }
  if (format !== 'paperback') {
    // Ebook : vérifier palier 70%
    if (price >= 2.99 && price <= 9.99) {
      return { id: 'price', label: 'Prix de vente', status: 'pass', message: `${price}€ — Palier 70% de royalties`, category: 'metadata' };
    }
    if (price < 0.99) {
      return { id: 'price', label: 'Prix de vente', status: 'fail', message: 'Prix minimum KDP : 0,99€', category: 'metadata' };
    }
    return { id: 'price', label: 'Prix de vente', status: 'warning', message: `${price}€ — Palier 35% de royalties (2,99-9,99€ pour 70%)`, category: 'metadata' };
  }
  return { id: 'price', label: 'Prix de vente', status: 'pass', message: `${price}€`, category: 'metadata' };
}

function checkWordCount(totalWords: number): KdpCheck {
  if (totalWords < 2500) {
    return { id: 'wordcount', label: 'Nombre de mots', status: 'fail', message: `${totalWords.toLocaleString()} mots — Minimum recommandé : 5 000`, category: 'content' };
  }
  if (totalWords < 10000) {
    return { id: 'wordcount', label: 'Nombre de mots', status: 'warning', message: `${totalWords.toLocaleString()} mots — Court pour un ebook standard`, category: 'content' };
  }
  return { id: 'wordcount', label: 'Nombre de mots', status: 'pass', message: `${totalWords.toLocaleString()} mots`, category: 'content' };
}

function checkEmptyChapters(chapters?: KdpCheckInput['chapters']): KdpCheck {
  if (!chapters || chapters.length === 0) {
    return { id: 'empty-chapters', label: 'Chapitres vides', status: 'fail', message: 'Aucun chapitre détecté', category: 'structure' };
  }
  const empty = chapters.filter(c => {
    const content = c.content || '';
    const subContent = (c.subChapters || []).map(s => s.content || '').join('');
    return (content + subContent).trim().length < 50;
  });
  if (empty.length > 0) {
    return { id: 'empty-chapters', label: 'Chapitres vides', status: 'fail', message: `${empty.length} chapitre(s) vide(s) ou quasi-vide(s)`, category: 'structure' };
  }
  return { id: 'empty-chapters', label: 'Chapitres vides', status: 'pass', message: 'Tous les chapitres contiennent du contenu', category: 'structure' };
}

function checkChapterMinLength(chapters?: KdpCheckInput['chapters']): KdpCheck {
  if (!chapters || chapters.length === 0) {
    return { id: 'chapter-length', label: 'Longueur des chapitres', status: 'fail', message: 'Aucun chapitre', category: 'content' };
  }
  const shortChapters = chapters.filter(c => {
    const words = ((c.content || '') + ' ' + (c.subChapters || []).map(s => s.content || '').join(' ')).split(/\s+/).filter(Boolean).length;
    return words < 500;
  });
  if (shortChapters.length > 0) {
    return { id: 'chapter-length', label: 'Longueur des chapitres', status: 'warning', message: `${shortChapters.length} chapitre(s) avec moins de 500 mots`, category: 'content' };
  }
  return { id: 'chapter-length', label: 'Longueur des chapitres', status: 'pass', message: 'Tous les chapitres ont une longueur suffisante', category: 'content' };
}

function checkPrefaceConclusion(preface?: string, conclusion?: string): KdpCheck {
  const hasPreface = preface && preface.trim().length > 50;
  const hasConclusion = conclusion && conclusion.trim().length > 50;
  if (!hasPreface && !hasConclusion) {
    return { id: 'preface-conclusion', label: 'Préface / Conclusion', status: 'warning', message: 'Ni préface ni conclusion — recommandé pour un ebook professionnel', category: 'structure' };
  }
  return { id: 'preface-conclusion', label: 'Préface / Conclusion', status: 'pass', message: `${hasPreface ? '✓ Préface' : '✗ Préface'} | ${hasConclusion ? '✓ Conclusion' : '✗ Conclusion'}`, category: 'structure' };
}

function checkStructure(chapters?: KdpCheckInput['chapters']): KdpCheck {
  if (!chapters || chapters.length === 0) {
    return { id: 'structure', label: 'Structure hiérarchique', status: 'fail', message: 'Aucune structure détectée', category: 'structure' };
  }
  if (chapters.length < 3) {
    return { id: 'structure', label: 'Structure hiérarchique', status: 'warning', message: `Seulement ${chapters.length} chapitre(s) — 5+ recommandés`, category: 'structure' };
  }
  const withSubs = chapters.filter(c => c.subChapters && c.subChapters.length > 0).length;
  if (withSubs === 0 && chapters.length > 5) {
    return { id: 'structure', label: 'Structure hiérarchique', status: 'warning', message: 'Pas de sous-chapitres — améliorerait la navigation', category: 'structure' };
  }
  return { id: 'structure', label: 'Structure hiérarchique', status: 'pass', message: `${chapters.length} chapitres, ${withSubs} avec sous-chapitres`, category: 'structure' };
}

function checkForbiddenCharacters(input: KdpCheckInput): KdpCheck {
  const allText = [
    input.title, input.authorName, input.description,
    ...(input.chapters || []).flatMap(c => [c.title, c.content, ...(c.subChapters || []).flatMap(s => [s.title, s.content])]),
    input.preface, input.conclusion
  ].filter(Boolean).join(' ');

  // Caractères qui posent problème sur Kindle
  const problems: string[] = [];
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(allText)) problems.push('Caractères de contrôle');
  if (/[\uFFF0-\uFFFF]/.test(allText)) problems.push('Caractères Unicode spéciaux');
  if (/\t/.test(allText)) problems.push('Tabulations (utiliser des espaces)');

  if (problems.length > 0) {
    return { id: 'forbidden-chars', label: 'Caractères interdits', status: 'warning', message: `Détectés : ${problems.join(', ')}`, category: 'format' };
  }
  return { id: 'forbidden-chars', label: 'Caractères interdits', status: 'pass', message: 'Aucun caractère problématique', category: 'format' };
}

function checkEstimatedFileSize(totalWords: number): KdpCheck {
  // Estimation grossière : ~6 bytes par mot en UTF-8
  const estimatedKB = Math.round(totalWords * 6 / 1024);
  const estimatedMB = (estimatedKB / 1024).toFixed(1);
  
  if (estimatedKB > 650 * 1024) { // 650 MB max KDP
    return { id: 'filesize', label: 'Taille estimée du fichier', status: 'fail', message: `~${estimatedMB} MB — Dépasse la limite KDP de 650 MB`, category: 'format' };
  }
  return { id: 'filesize', label: 'Taille estimée du fichier', status: 'pass', message: `~${estimatedKB < 1024 ? estimatedKB + ' KB' : estimatedMB + ' MB'}`, category: 'format' };
}

function checkPageCount(pageCount?: number): KdpCheck {
  if (!pageCount || pageCount <= 0) {
    return { id: 'pages', label: 'Nombre de pages', status: 'warning', message: 'Non calculé', category: 'format' };
  }
  if (pageCount < 24) {
    return { id: 'pages', label: 'Nombre de pages', status: 'fail', message: `${pageCount} pages — Minimum KDP broché : 24 pages`, category: 'format' };
  }
  if (pageCount > 828) {
    return { id: 'pages', label: 'Nombre de pages', status: 'fail', message: `${pageCount} pages — Maximum KDP broché : 828 pages`, category: 'format' };
  }
  return { id: 'pages', label: 'Nombre de pages', status: 'pass', message: `${pageCount} pages`, category: 'format' };
}

function countTotalWords(input: KdpCheckInput): number {
  const allText = [
    ...(input.chapters || []).flatMap(c => [
      c.content || '',
      ...(c.subChapters || []).map(s => s.content || '')
    ]),
    input.preface || '',
    input.conclusion || ''
  ].join(' ');

  return allText.split(/\s+/).filter(w => w.length > 0).length;
}
