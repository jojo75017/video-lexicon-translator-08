/**
 * Script de la vidéo « Bienvenue » — après achat (≈2 min 30 avec voix off).
 * Source texte : docs/video-v3-bienvenue-script.md
 *
 * Aucune vente, aucun prix, aucun rappel d'offre : uniquement l'accueil
 * et la prise en main du studio.
 */
import type { Scene } from "./script";
import { buildTiming } from "./timing";
import {
  VOICE_DURATIONS,
  VOICE_GAP_SECONDS,
  VOICE_LEAD_SECONDS,
  VOICE_TAIL_SECONDS,
} from "./voiceTimingBienvenue";

export const FPS = 30;

export const SCENES_BIENVENUE: Scene[] = [
  {
    chapter: "Séquence 1",
    title: "Merci, et bienvenue",
    motif: "opening",
    shot: "studio.jpg",
    shotCaption: "Écran réel : votre tableau de bord.",
    chips: ["Vos cadeaux déjà là", "Rien à réclamer"],
    lines: [
      "Bonjour, et merci d'avoir rejoint Ebookstudio.",
      "Vos cadeaux sont déjà dans votre espace : les dix niches Amazon analysées et le kit de démarrage.",
      "Vous n'avez rien à réclamer, tout est là.",
      "Dans les deux minutes qui suivent, je vous montre simplement par où commencer.",
    ],
  },
  {
    chapter: "Séquence 2",
    title: "Commencez par le sommaire",
    motif: "outline",
    shot: "sommaire.jpg",
    shotCaption: "Écran réel : le sommaire construit avec vous.",
    chips: ["Vos mots", "Validation par 3", "Réécriture immédiate"],
    lines: [
      "Première étape : le sommaire, et vous le construisez en discutant.",
      "Vous donnez votre sujet avec vos mots, même en désordre.",
      "Le studio vous renvoie une structure, et vous validez trois chapitres à la fois.",
      "Un chapitre ne vous plaît pas ? Vous le dites, il est réécrit devant vous.",
      "Ne cherchez pas le plan parfait du premier coup : il se corrige à tout moment.",
    ],
  },
  {
    chapter: "Séquence 3",
    title: "L'écriture, chapitre par chapitre",
    motif: "writing",
    shot: "workflow.jpg",
    shotCaption: "Écran réel : votre livre en direct.",
    chips: ["2 500 à 3 500 mots", "Mémoire du livre", "Reprise à tout moment"],
    lines: [
      "Ensuite, vous écrivez chapitre par chapitre, jamais tout d'un bloc.",
      "Chaque chapitre fait entre deux mille cinq cents et trois mille cinq cents mots,",
      "et le studio garde la mémoire du livre : les personnages, les lieux, les dates, ce qui a déjà été dit au lecteur.",
      "Le chapitre douze sait ce qui s'est passé au chapitre trois.",
      "Vous pouvez vous arrêter quand vous voulez et reprendre plus tard exactement là où vous en étiez.",
    ],
  },
  {
    chapter: "Séquence 4",
    title: "Corriger, habiller, publier",
    motif: "proof",
    shot: "correction.jpg",
    shotCaption: "Écran réel : la correction, avant / après.",
    chips: ["4 passes", "Couverture Amazon", "PDF · DOCX · EPUB · Audio"],
    lines: [
      "Quand le manuscrit est là, le studio le corrige en quatre passes : ponctuation et dictée,",
      "répétitions, cohérence du récit, puis typographie française.",
      "Puis vous habillez le livre : la couverture aux gabarits d'Amazon, le sommaire mis en forme,",
      "l'export en PDF, DOCX, EPUB et en version audio,",
      "et les données KDP prêtes à coller : titre, description, mots-clés et catégories.",
    ],
  },
  {
    chapter: "Séquence 5",
    title: "Votre formule et vos questions",
    motif: "closing",
    shot: "livres.jpg",
    shotCaption: "Écran réel : vos livres, dans votre espace.",
    chips: ["Votre formule en haut de page", "Page Questions"],
    lines: [
      "Ce à quoi vous avez accès est indiqué dans votre espace, en haut de la page :",
      "votre formule, le nombre de livres et de chapitres, et les onglets ouverts.",
      "Tout ce qui est ouvert pour vous est utilisable dès maintenant.",
      "Et si quelque chose vous bloque, écrivez-moi depuis la page Questions de votre espace : je réponds personnellement.",
      "Bonne écriture — et au plaisir de lire votre premier livre.",
    ],
  },
];

const timing = buildTiming({
  fps: FPS,
  voiceDurations: VOICE_DURATIONS,
  lead: VOICE_LEAD_SECONDS,
  gap: VOICE_GAP_SECONDS,
  tail: VOICE_TAIL_SECONDS,
  lines: SCENES_BIENVENUE.map((s) => s.lines),
});

export const SUBTITLE_START_BIENVENUE = timing.subtitleStart;
export const LINE_DURATIONS_BIENVENUE = timing.lineDurations;
export const SCENE_DURATIONS_BIENVENUE = timing.sceneDurations;
export const TOTAL_DURATION_BIENVENUE = timing.total;
