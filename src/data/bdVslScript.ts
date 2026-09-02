/**
 * Script de la vidéo de vente (VSL) du Studio BD & Jeunesse — page /bd-offre.
 *
 * Source unique du script. Deux versions :
 *  - `voiceover` : le texte mot pour mot à lire au micro (ou pour une voix-off IA).
 *  - `storyboard` : ce que l'écran montre pour chaque séquence.
 *
 * Durée visée : 2 min 50. La vidéo d'accroche générée par IA sert de boucle
 * visuelle en attendant la version parlée complète.
 */

export interface VslSequence {
  /** Code temporel de début, au format mm:ss. */
  start: string;
  /** Durée approximative de la séquence, en secondes. */
  duration: number;
  /** Ce que dit la voix-off, mot pour mot. */
  voiceover: string;
  /** Ce que l'écran montre. */
  storyboard: string;
}

export const BD_VSL_SCRIPT: VslSequence[] = [
  {
    start: '0:00',
    duration: 15,
    voiceover:
      "Vous avez une idée de bande dessinée ou de livre illustré pour enfants… mais vous ne savez pas dessiner. Et franchement, vous n'avez pas non plus le temps d'apprendre.",
    storyboard:
      "Plan serré sur un carnet ouvert, un crayon posé. Une main hésite au-dessus d'une page blanche. Lumière chaude, ambiance attente.",
  },
  {
    start: '0:15',
    duration: 25,
    voiceover:
      "Jusqu'ici, créer une BD, c'était l'enfer des outils : un logiciel pour le scénario, un autre pour les personnages, un troisième pour les planches. Au final, votre héros change de visage d'une case à l'autre, et vous avez passé des heures à tout recommencer.",
    storyboard:
      "Montage rapide de plusieurs fenêtres de logiciels qui s'ouvrent et se ferment, personnages mal alignés qui changent de style, horloge qui tourne.",
  },
  {
    start: '0:40',
    duration: 40,
    voiceover:
      "C'est exactement pour ça que j'ai créé le Studio BD & Jeunesse. Vous décrivez votre idée en une phrase. Le studio génère vos personnages, garde exactement le même visage de la première à la dernière page, écrit le scénario case par case, illustre chaque planche dans un vrai style franco-belge et prépare vos fichiers prêts pour Amazon KDP.",
    storyboard:
      "Défilement fluide d'une planche complète en construction : personnage qui apparaît, bulles qui se remplissent, cases qui s'illustrent l'une après l'autre. Transition sur un export PDF/KDP propre.",
  },
  {
    start: '1:20',
    duration: 30,
    voiceover:
      "Quatre étapes, c'est tout. Un : vous créez vos personnages. Deux : l'IA écrit le scénario. Trois : les planches s'illustrent toutes seules. Quatre : vous exportez en haute résolution, prêt à publier.",
    storyboard:
      "Quatre pastilles numérotées qui apparaissent en cascade, chacune accompagnée de son rendu visuel : portrait de personnage, découpage de scénario, planche illustrée, dossier d'export.",
  },
  {
    start: '1:50',
    duration: 25,
    voiceover:
      "Que vous soyez parent ou grand-parent qui veut offrir un livre personnalisé, enseignant qui crée ses supports, ou auteur KDP en quête d'une niche visuelle qui se vend : le studio s'adapte à votre projet.",
    storyboard:
      "Trois portraits d'utilisateurs souriants (parent, enseignant, auteur) tenant chacun un livre imprimé différent.",
  },
  {
    start: '2:15',
    duration: 20,
    voiceover:
      "Aujourd'hui, l'accès complet au studio est à 17 euros, paiement unique, accès à vie, sans aucune mensualité. Avec les bonus inclus et la garantie satisfait ou remboursé pendant 30 jours.",
    storyboard:
      "Carte de prix 17 € barrant 27 €, badges bonus qui s'allument, sceau de garantie 30 jours qui se pose.",
  },
  {
    start: '2:35',
    duration: 15,
    voiceover:
      "Ne laissez pas votre idée dormir dans un tiroir. Cliquez sur le bouton juste sous cette vidéo et créez votre première bande dessinée aujourd'hui.",
    storyboard:
      "Bouton « Je crée ma BD » qui se soulève, carnet qui se ferme et devient un livre imprimé, logo du studio qui apparaît en fondu.",
  },
];

/** Version continue du texte voix-off, prête à copier. */
export const BD_VSL_VOICEOVER_FULL: string = BD_VSL_SCRIPT.map((s) => s.voiceover).join('\n\n');

export default BD_VSL_SCRIPT;
