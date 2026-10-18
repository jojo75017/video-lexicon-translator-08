/** Pure policy shared by the browser and the writing function. */
export function detectBookType(intro: string) {
  const label = (/TYPE DE LIVRE\s*:\s*([^\n]+)/i.exec(String(intro || ''))?.[1] || '').trim();
  const nonFiction = /guide|tutoriel|documentaire|informatif|professionnel|formation|biographie|t[ée]moignage/i.test(label);
  const isGuide = /guide|tutoriel/i.test(label);
  const isBio = /biographie|t[ée]moignage/i.test(label);
  const directive = nonFiction ? `TYPE DE LIVRE IMPOSÉ : ${label}. CE N'EST PAS UN ROMAN.
INTERDICTIONS ABSOLUES : aucune intrigue, aucun personnage fictif, aucun dialogue romanesque, aucun suspense, aucun rebondissement, aucun cliffhanger, aucun titre de chapitre façon roman.${isBio ? ' Seules les personnes réelles citées par l’auteur peuvent apparaître.' : ''}
${isGuide ? `STRUCTURE PÉDAGOGIQUE : objectif clair ; introduction courte ; sous-titres ## et ### ; étapes numérotées ; matériel nécessaire quand pertinent ; conseils d'expert ; erreurs courantes ; précautions de sécurité ; tableaux Markdown utiles ; checklist finale (- [ ]) ; conclusion pratique.
Titres descriptifs et utiles, progression du plus simple au plus avancé.` : 'Structure informative claire : sous-titres ## et ###, paragraphes courts, faits vérifiables, exemples réels, encadrés « À retenir ».'}
N'invente jamais de chiffres, prix, paramètres techniques, horaires ou réglementations. En aquariophilie, ne jamais inventer les paramètres de maintenance, les compatibilités entre espèces ni les traitements sanitaires : vérifier les sources fiables, sinon signaler l'incertitude.` : '';
  return { label, nonFiction, isGuide, directive };
}

export function nonFictionProductionPrompt(directive: string, segmented = false): string {
  return `Tu es un RÉDACTEUR PÉDAGOGIQUE expert. Ton clair, bienveillant, précis, adapté au niveau du lecteur.
${directive}
Respecte mot pour mot les titres et l'ordre du sommaire validé. Développe exclusivement l'objectif et les points utiles du chapitre, sans redondance ni remplissage. Explique concrètement comment faire et pourquoi. Les exemples ne doivent jamais devenir des scènes fictionnelles.
${segmented ? 'Rédige uniquement les sous-sections de ce segment, sans conclure le chapitre avant le dernier segment ; ne répète pas les segments précédents.' : 'Termine par une synthèse pratique et une checklist des acquis, pas par du suspense.'}
Retourne uniquement le JSON demandé, avec le contenu intégral en français.`;
}

export function canResumeBook(currentTitle: string, currentIntro: string, savedTitle: string, savedIntro: string): boolean {
  return currentTitle.trim().toLocaleLowerCase() === savedTitle.trim().toLocaleLowerCase()
    && detectBookType(currentIntro).nonFiction === detectBookType(savedIntro).nonFiction;
}

export function wizardStepAfter(step: number, fiction: boolean, direction: 1 | -1): number {
  const next = Math.max(0, Math.min(4, step + direction));
  return !fiction && next === 3 ? (direction === 1 ? 4 : 2) : next;
}