/**
 * Script de la vidéo Ebookstudio V3 (≈6 min 10 avec voix off).
 * Source texte : docs/video-v3-script.md
 *
 * Chaque ligne devient un sous-titre. Les durées sont calées sur la voix off
 * réellement générée (voir voiceTiming.ts), pas sur une vitesse de lecture
 * théorique.
 */
import {
  VOICE_DURATIONS,
  VOICE_GAP_SECONDS,
  VOICE_LEAD_SECONDS,
  VOICE_TAIL_SECONDS,
} from "./voiceTiming";
import { TRANSITION_FRAMES } from "./theme";

export interface Scene {
  chapter: string;
  title: string;
  chips: string[];
  lines: string[];
  /** Capture réelle affichée à droite (dans public/images). */
  shot?: string;
  /** Légende de la capture. */
  shotCaption?: string;
  /** Visuel dominant de la séquence. */
  motif: "opening" | "problem" | "outline" | "writing" | "proof" | "publish" | "pricing" | "closing";
}

export const FPS = 30;
const WORDS_PER_MINUTE = 145;

/** Durée d'un sous-titre en frames, jamais moins de 2,6 s. */
export function lineDuration(line: string): number {
  const words = line.trim().split(/\s+/).length;
  const frames = Math.round((words / WORDS_PER_MINUTE) * 60 * FPS);
  return Math.max(84, frames + 34);
}


export const SCENES: Scene[] = [
  {
    chapter: "Séquence 1",
    title: "Un livre, jusqu'au bout",
    motif: "opening",
    shot: "studio.jpg",
    shotCaption: "Écran réel : la fiche de départ du livre.",
    chips: ["Ebookstudio V3", "Amazon KDP", "Français"],
    lines: [
      "Bonjour, je suis Georges Boubet, auteur sur Amazon KDP et créateur d'Ebookstudio.",
      "Si vous avez déjà essayé un outil d'écriture par intelligence artificielle, vous connaissez le scénario.",
      "Les cinq premières minutes sont enthousiasmantes : vous tapez une idée, un texte apparaît, tout semble possible.",
      "Et puis vient le moment de publier. Là, l'outil vous laisse seul.",
      "Un fichier mal formaté, un sommaire en désordre, des chapitres qui se répètent, des données KDP à remplir à la main.",
      "Le livre n'existe toujours pas.",
      "Dans les sept minutes qui viennent, je vais vous montrer exactement l'inverse : un livre complet, du premier échange jusqu'au fichier accepté par Amazon.",
    ],
  },
  {
    chapter: "Séquence 2",
    title: "Le vrai problème",
    motif: "problem",
    chips: ["Terminer", "Cohérence", "Publier"],
    lines: [
      "Le problème n'a jamais été de trouver une idée. Le problème, c'est de terminer.",
      "Terminer, cela veut dire : un plan qui tient debout, quarante chapitres qui se souviennent les uns des autres,",
      "une langue française correcte, une couverture lisible en vignette,",
      "et des métadonnées qui font remonter le livre dans les recherches Amazon.",
      "Ebookstudio V3 a été construit uniquement pour ça : vous accompagner jusqu'à la fin.",
      "Pas pour produire du texte, mais pour produire un livre publiable.",
    ],
  },
  {
    chapter: "Séquence 3",
    title: "On construit le sommaire ensemble",
    motif: "outline",
    shot: "sommaire.jpg",
    shotCaption: "Écran réel : le sommaire construit avec vous.",
    chips: ["Mode Copilot", "Validation par 3", "Vos mots"],
    lines: [
      "Première étape, et c'est celle qui change tout : le sommaire.",
      "Vous ne recevez pas un plan tout fait à prendre ou à laisser. Vous discutez.",
      "Vous donnez vos idées, avec vos mots, même en désordre.",
      "L'intelligence artificielle vous les renvoie structurées, corrigées, et vous validez trois chapitres à la fois.",
      "Si un chapitre ne vous plaît pas, vous le dites, il est réécrit devant vous.",
      "À droite de l'écran, vous voyez en permanence deux onglets : le sommaire en construction, et votre livre tel qu'il s'écrit.",
      "Vous gardez la main sur chaque titre, chaque point à traiter, chaque liste à puces.",
      "C'est le mode Copilot. Vos idées, votre voix — la structure, c'est la machine qui la tient.",
    ],
  },
  {
    chapter: "Séquence 4",
    title: "L'écriture, avec mémoire du livre",
    motif: "writing",
    shot: "workflow.jpg",
    shotCaption: "Écran réel : le pipeline des agents.",
    chips: ["2 500 à 3 500 mots", "Mémoire", "Reprise"],
    lines: [
      "Ensuite, l'écriture.",
      "Chaque chapitre est rédigé séparément, entre deux mille cinq cents et trois mille cinq cents mots,",
      "et surtout : le studio garde la mémoire du livre.",
      "Les personnages, les dates, les lieux, ce qui a déjà été révélé au lecteur, les questions encore ouvertes.",
      "Le chapitre douze sait ce qui s'est passé au chapitre trois.",
      "C'est exactement ce qui manque partout ailleurs, et c'est ce qui distingue un vrai livre d'un empilement de textes.",
      "Vous pouvez suivre l'avancement en direct, arrêter, reprendre plus tard là où vous vous étiez arrêté.",
    ],
  },
  {
    chapter: "Séquence 5",
    title: "La correction, en quatre passes",
    motif: "proof",
    shot: "correction.jpg",
    shotCaption: "Écran réel : la correction, avant / après.",
    chips: ["Dictée", "Répétitions", "Cohérence", "Typographie"],
    lines: [
      "Un manuscrit brut n'est pas un livre. Il faut le corriger comme une maison d'édition le ferait.",
      "Le studio effectue quatre passes successives : réparation de la dictée et de la ponctuation,",
      "suppression des répétitions et des mots étrangers parasites,",
      "cohérence du récit d'un chapitre à l'autre, puis relecture typographique française :",
      "espaces insécables, guillemets, tirets cadratins.",
      "Et une règle absolue : aucun chapitre ne se termine sur un mot en suspens, toujours sur une phrase achevée.",
      "Vous voyez le avant et le après côte à côte, et vous décidez.",
    ],
  },
  {
    chapter: "Séquence 6",
    title: "Habiller, publier, vendre",
    motif: "publish",
    shot: "cover.jpg",
    shotCaption: "Écran réel : la couverture aux gabarits Amazon.",
    chips: ["Couverture 300 dpi", "PDF · DOCX · EPUB", "Données KDP", "Audio"],
    lines: [
      "Le livre est écrit et corrigé. Il reste à l'habiller et à le publier.",
      "La couverture : recto, tranche calculée selon votre nombre de pages, quatrième de couverture,",
      "en trois cents points par pouce, aux gabarits exacts d'Amazon.",
      "Le sommaire est mis en forme, avec des ambiances soignées si vous le souhaitez.",
      "L'export : PDF, DOCX, EPUB, plus une version audio de votre livre.",
      "Et surtout, les données KDP prêtes à coller : titre, sous-titre, description formatée, sept mots-clés, catégories BISAC vérifiées.",
      "Vous ne remplissez plus rien à la main.",
      "Enfin, la partie que personne ne prépare : vendre.",
      "Analyse de niches Amazon, audit de concurrence par référence produit, description optimisée,",
      "et la marche à suivre pour obtenir vos premiers avis clients honnêtement.",
    ],
  },
  {
    chapter: "Séquence 7",
    title: "Les formules",
    motif: "pricing",
    chips: ["Plume 27 €", "Édition 47 €", "Studio Pro 97 €"],
    lines: [
      "Trois formules, et elles sont simples.",
      "Plume, vingt-sept euros par mois : trente livres par mois, quarante chapitres, tous les onglets du studio,",
      "dix langues, la couverture complète, l'audiolivre et la correction professionnelle.",
      "Édition, quarante-sept euros par mois : livres illimités, soixante chapitres, Cover Studio Pro,",
      "le mode recherche approfondie, les outils d'analyse Amazon et le pack KDP prêt à publier.",
      "Studio Pro, quatre-vingt-dix-sept euros par mois : absolument tout est inclus,",
      "y compris les séries multi-tomes et tous les compléments — plus rien à acheter, jamais.",
      "En annuel, deux mois vous sont offerts. Et au lancement, le 1er octobre : le premier mois est offert.",
    ],
  },
  {
    chapter: "Séquence 8",
    title: "Votre cadeau de départ",
    motif: "closing",
    shot: "livres.jpg",
    shotCaption: "Écran réel : vos livres, prêts à publier.",
    chips: ["10 niches analysées", "Kit de démarrage", "Sans carte bancaire"],
    lines: [
      "Avant de partir, prenez le cadeau :",
      "dix niches Amazon à fort potentiel, analysées, et le kit de démarrage complet de la V3.",
      "C'est gratuit, sans carte bancaire, sur la page cadeau.",
      "Lisez-les. Si vous vous dites « je pourrais écrire ce livre-là », c'est que le moment est venu.",
      "Ebookstudio V3 ouvre le 1er octobre. À très bientôt, et bonne écriture.",
    ],
  },
];

/** Frame à laquelle le premier sous-titre d'une séquence apparaît (= début de la voix). */
export const SUBTITLE_START = Math.round(VOICE_LEAD_SECONDS * FPS);

/**
 * Durée des sous-titres d'une séquence, répartie au prorata du nombre de mots
 * sur la durée réellement parlée par la voix off.
 */
export const LINE_DURATIONS: number[][] = SCENES.map((scene, i) => {
  const total = Math.round(VOICE_DURATIONS[i] * FPS);
  const weights = scene.lines.map((l) => l.trim().split(/\s+/).length);
  const sum = weights.reduce((a, b) => a + b, 0);
  const frames = weights.map((w) => Math.max(60, Math.round((w / sum) * total)));
  // Ajuste la dernière ligne pour retomber exactement sur la durée parlée.
  const drift = total - frames.reduce((a, b) => a + b, 0);
  frames[frames.length - 1] = Math.max(60, frames[frames.length - 1] + drift);
  return frames;
});

/**
 * Durée de chaque séquence : la voix + le silence de respiration, plus la
 * frame de transition (les transitions se chevauchent dans TransitionSeries).
 */
export const SCENE_DURATIONS = VOICE_DURATIONS.map((d, i) =>
  i < VOICE_DURATIONS.length - 1
    ? Math.round((d + VOICE_GAP_SECONDS) * FPS) + TRANSITION_FRAMES
    : Math.round((d + VOICE_TAIL_SECONDS) * FPS),
);

export const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
