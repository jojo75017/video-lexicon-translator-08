/**
 * Source unique du fonctionnement « 2 temps » de la V3.
 *
 * Règle produit : chaque module travaille en deux temps.
 *  - Temps 1 : Gemini analyse / prépare (l'architecte)
 *  - Temps 2 : ChatGPT (via OpenRouter) produit le livrable (la plume)
 *
 * `live: true` signifie que les deux temps tournent réellement dans le module.
 * Interdiction de passer un module à `live: true` avant que son temps 1 et son
 * temps 2 soient branchés : pas de promesse non tenue dans l'interface.
 */

export type TwoStepMoteur = 'gemini' | 'chatgpt' | 'image' | 'voix';

export interface TwoStepPhase {
  moteur: TwoStepMoteur;
  /** Libellé du moteur affiché à l'abonné. */
  label: string;
  /** Ce que ce temps produit, en une phrase simple. */
  output: string;
}

export interface TwoStepEngine {
  id: string;
  /** Domaine, en un mot (affiché en surtitre). */
  role: string;
  /** Nom du module. */
  title: string;
  desc: string;
  route?: string;
  temps1: TwoStepPhase;
  temps2: TwoStepPhase;
  live: boolean;
}

const GEMINI_LABEL = 'Gemini — l’architecte';
const CHATGPT_LABEL = 'ChatGPT — la plume';

export const TWO_STEP_ENGINES: TwoStepEngine[] = [
  {
    id: 'manuscrit',
    role: 'Rédaction',
    title: 'Rédaction du manuscrit',
    desc: 'Chapitre par chapitre, avec la mémoire de la bible du livre.',
    route: '/v3/studio',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Bible du livre, plan et mémoire des chapitres.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'Le texte du chapitre, écrit à partir de cette bible.' },
    live: true,
  },
  {
    id: 'recherche',
    role: 'Recherche',
    title: 'Recherche & niche',
    desc: 'Niche, concurrence et angle éditorial analysés avant la première ligne.',
    route: '/v3/outils/espion-concurrents',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Analyse de la niche, de la concurrence et des angles libres.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'Le positionnement rédigé : promesse, titre et angle.' },
    live: false,
  },
  {
    id: 'correction',
    role: 'Correction',
    title: 'Correction du livre',
    desc: 'Passe éditoriale complète, chapitre par chapitre.',
    route: '/v3/corriger',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Relevé des fautes, ruptures de ton et incohérences.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'Le texte corrigé, que vous validez ligne par ligne.' },
    live: false,
  },
  {
    id: 'visuels',
    role: 'Visuels',
    title: 'Visuels de couverture',
    desc: 'Directions artistiques photoréalistes, déclinables à volonté.',
    route: '/v3/mes-couvertures',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'La direction artistique écrite : scène, lumière, ambiance.' },
    temps2: { moteur: 'image', label: 'Génération d’images IA', output: 'L’illustration, générée à partir de cette direction.' },
    live: false,
  },
  {
    id: 'mise-en-page',
    role: 'Mise en page',
    title: 'Couverture & mise en page',
    desc: 'Dos calculé, 4e de couverture et fonds perdus conformes KDP.',
    route: '/v3/mes-couvertures',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Textes de 4e de couverture et hiérarchie des titres.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'La couverture composée en 300 DPI, dos compris.' },
    live: false,
  },
  {
    id: 'audio',
    role: 'Narration',
    title: 'Livre audio',
    desc: 'Votre manuscrit lu au format audio, prêt à publier.',
    route: '/v3/outils/audiobook',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Préparation du texte à lire : découpe, ponctuation, prononciations.' },
    temps2: { moteur: 'voix', label: 'Synthèse vocale premium', output: 'La lecture audio du livre, chapitre par chapitre.' },
    live: false,
  },
  {
    id: 'metadonnees',
    role: 'Métadonnées',
    title: 'Métadonnées Amazon',
    desc: 'Titre, sous-titre, 7 mots-clés et catégories choisis pour être trouvés.',
    route: '/kdp-keywords',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Analyse des recherches Amazon et des catégories atteignables.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'Titre, sous-titre et 7 mots-clés rédigés.' },
    live: false,
  },
  {
    id: 'traduction',
    role: 'International',
    title: 'Traduction 10 langues',
    desc: 'Le même livre publié sur les marchés Amazon étrangers.',
    route: '/v3/outils/traduction',
    temps1: { moteur: 'gemini', label: GEMINI_LABEL, output: 'Glossaire, noms propres et repères de style à conserver.' },
    temps2: { moteur: 'chatgpt', label: CHATGPT_LABEL, output: 'La traduction, fidèle au glossaire du temps 1.' },
    live: false,
  },
];

export const getTwoStepEngine = (id: string): TwoStepEngine | undefined =>
  TWO_STEP_ENGINES.find((e) => e.id === id);
