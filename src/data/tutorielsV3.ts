import etape1Video from '@/assets/videos/tuto-etape-1.mp4.asset.json';
import etape2Video from '@/assets/videos/tuto-etape-2.mp4.asset.json';
import etape3Video from '@/assets/videos/tuto-etape-3.mp4.asset.json';
import etape4Video from '@/assets/videos/tuto-etape-4.mp4.asset.json';
import etape5Video from '@/assets/videos/tuto-etape-5.mp4.asset.json';
// Source unique des tutoriels V3 (diaporamas + futures vidéos).
export type TutoRubrique = 'Démarrer' | 'Les 5 étapes' | 'Créer' | 'Écrire et corriger' | 'Habiller' | 'Publier et vendre';

export interface TutorielV3 {
  id: string;
  num: number;
  rubrique: TutoRubrique;
  titre: string;
  duree: string;
  route: string;
  etapes: string[];
  videos?: string[];
}

const t = (num: number, rubrique: TutoRubrique, titre: string, route: string, etapes: string[], duree = '1 min'): TutorielV3 => ({
  id: `tuto-${num}`, num, rubrique, titre, route, etapes, duree,
});

export const TUTORIELS_V3: TutorielV3[] = [
  t(1, 'Démarrer', 'Bienvenue dans la V3', '/v3', [
    "L'accueil V3 regroupe tous vos outils au même endroit.",
    'La barre de gauche est classée par rubriques : Créer, Écrire, Habiller, Publier, Vendre.',
    "L'encart « Vous êtes abonné ? Commencez ici » vous mène directement aux spécialistes.",
    'Le bandeau du haut annonce les nouveautés et les offres en cours.',
  ]),
  t(2, 'Démarrer', '« Commence ici » : choisir son spécialiste', '/v3/commence-ici', [
    'Ouvrez « Commence ici » depuis l’accueil.',
    'Chaque robot spécialiste correspond à un type de livre (roman, cuisine, voyage, jeunesse…).',
    'Cliquez sur une carte : l’outil adapté s’ouvre avec les bons réglages.',
  ]),
  t(3, 'Démarrer', 'Ajouter sa clé IA gratuite', '/v3/parametres', [
    'Allez dans Paramètres.',
    'Collez votre clé Gemini (commence par AIza) ou OpenRouter (commence par sk-or-).',
    'Enregistrez : la génération utilise votre clé, sans surcoût.',
  ]),
  t(4, 'Démarrer', 'Les forfaits et les compléments', '/v3/forfaits', [
    'Plume 27 €/mois, Édition 47 €/mois, Maison d’Édition 97 €/mois (2 mois offerts en annuel).',
    'Cover Studio Pro (67 €) et Studio Jeunesse (47 €) restent des compléments séparés.',
    'Choisissez votre formule puis payez par carte.',
  ]),
  t(5, 'Les 5 étapes', 'Vue d’ensemble : les 5 étapes de A à Z', '/v3/create', [
    'Étape 1 : l’idée et la fiche du livre.',
    'Étape 2 : le sommaire.',
    'Étape 3 : la rédaction des chapitres.',
    'Étape 4 : la correction et la couverture.',
    'Étape 5 : la publication et le lancement.',
  ], '2 min'),
  t(6, 'Les 5 étapes', 'Étape 1 : idée et fiche du livre', '/v3/create', [
    'Indiquez le titre provisoire, la catégorie et le sujet.',
    'Choisissez votre avatar lecteur.',
    'Validez la fiche : elle guide toute la suite.',
  ]),
  t(7, 'Les 5 étapes', 'Étape 2 : le sommaire', '/v3/create', [
    'Générez le sommaire à partir de la fiche.',
    'Modifiez, ajoutez ou supprimez des chapitres (40 maximum).',
    'Validez pour passer à la rédaction.',
  ]),
  t(8, 'Les 5 étapes', 'Étapes 3 et 4 : rédaction, correction, couverture', '/v3/create', [
    'Lancez la rédaction chapitre par chapitre.',
    'Passez la correction éditoriale sur le livre complet.',
    'Créez la couverture dans le studio couverture.',
  ], '2 min'),
  t(9, 'Les 5 étapes', 'Étape 5 : publication et lancement', '/v3/kdp/fiche-audit', [
    'Remplissez la fiche KDP champ par champ.',
    'Exportez le PDF intérieur et l’EPUB.',
    'Suivez votre plan de lancement.',
  ]),
  t(10, 'Créer', 'Créer mon livre (assistant)', '/v3/create', [
    'Ouvrez « Créer mon livre ».',
    'Suivez l’assistant étape par étape.',
    'Votre brouillon est sauvegardé automatiquement.',
  ]),
  t(11, 'Créer', '« Écrire maintenant » : 5 propositions', '/v3/lancer', [
    'Remplissez la fiche rapide.',
    "L'IA propose 5 idées de livre détaillées.",
    'Choisissez-en une : le sommaire est créé directement.',
  ]),
  t(12, 'Créer', 'Choisir son avatar lecteur', '/v3/create', [
    'Sous le titre, ouvrez l’encart avatar lecteur.',
    'Choisissez un univers puis un des 3 profils, ou créez le vôtre.',
    'Le bandeau vert confirme le profil activé.',
  ]),
  t(13, 'Créer', 'Remettre à zéro un nouveau livre', '/v3/create', [
    'Cliquez sur le bouton vert « Nouveau livre (remettre à zéro) ».',
    'Confirmez : le brouillon en cours est vidé.',
    'Vos livres enregistrés ne sont jamais supprimés.',
  ]),
  t(14, 'Créer', 'Histoires courtes (jusqu’à 20)', '/v3/livres/histoires-illustrees', [
    'Indiquez le thème et le nombre d’histoires.',
    'Les histoires sont créées par lots, sans doublon de titres.',
    'Le bouton « Compléter » ajoute les histoires manquantes.',
  ]),
  t(15, 'Créer', 'Je raconte ma vie', '/v3/biographie', [
    'Choisissez : Récit de ma vie, Arbre généalogique ou Souvenirs pour mes enfants.',
    'Aucun avatar lecteur : c’est un livre personnel.',
    'Vos mots sont gardés tels quels.',
  ]),
  t(16, 'Écrire et corriger', 'Rédiger avec le Studio Pro', '/v3/studio', [
    'Ouvrez le Studio Pro.',
    'La Bible du livre garde la mémoire des personnages et des faits.',
    'Rédigez chapitre par chapitre.',
  ]),
  t(17, 'Écrire et corriger', 'La correction éditoriale', '/v3/mes-livres', [
    'Dans Mes livres, cliquez sur « Correction éditoriale ».',
    'Récupérez le livre puis lancez l’analyse.',
    'Lisez le rapport : personnages, chronologie, répétitions, typographie.',
  ]),
  t(18, 'Écrire et corriger', 'HumanizeAI', '/v3/outils/humanizer', [
    'Collez ou importez votre texte.',
    'Lancez l’humanisation : le sens, les faits et les chiffres sont conservés.',
    'Consultez l’audit puis copiez ou téléchargez le texte.',
  ]),
  t(19, 'Écrire et corriger', 'Mes livres : retrouver et reprendre', '/v3/mes-livres', [
    'Tous vos livres apparaissent avec leur titre.',
    'Cliquez sur un livre pour le reprendre.',
    'Utilisez les boutons Corriger ou Correction éditoriale.',
  ]),
  t(20, 'Habiller', 'La couverture KDP', '/v3/studio-v4', [
    'Le brief artistique est créé depuis le résumé du livre.',
    'Modifiez-le si besoin, puis générez l’image.',
    'Ajoutez titre et sous-titre dans l’éditeur.',
  ]),
  t(21, 'Habiller', 'Cover Studio Pro (complément 67 €)', '/v3/cover-pro', [
    'Débloquez le complément Cover Studio Pro.',
    'Créez couverture, dos et quatrième de couverture.',
    'Exportez au format KDP.',
  ]),
  t(22, 'Habiller', 'Léonie : album illustré 3–6 ans', '/v3/create/album-illustre', [
    'Écrivez l’idée de l’histoire (jusqu’à 30 pages).',
    'Validez le personnage illustré : il est verrouillé pour tout le livre.',
    'Générez les pages puis exportez au format carré KDP.',
  ], '2 min'),
  t(23, 'Publier et vendre', 'La fiche KDP champ par champ', '/v3/kdp/fiche-audit', [
    'Titre, sous-titre, description, mots-clés, catégories.',
    'L’outil vérifie chaque champ.',
    'Copiez les textes dans Amazon KDP.',
  ]),
  t(24, 'Publier et vendre', 'Exporter et vérifier avant Amazon', '/v3/mes-livres', [
    'Exportez le PDF intérieur et l’EPUB.',
    'Passez la checklist de conformité.',
    'Téléversez les fichiers sur Amazon KDP.',
  ]),
  t(25, 'Publier et vendre', 'Studio Micro-Séries (précommande V4)', '/v3/offre-micro-series', [
    'Transformez votre livre en scripts de vidéos courtes.',
    'Récupérez hooks, voix off, scènes et sous-titres.',
    'Créez les vidéos avec votre outil préféré.',
  ]),
];

export const RUBRIQUES_V3: TutoRubrique[] = ['Démarrer', 'Les 5 étapes', 'Créer', 'Écrire et corriger', 'Habiller', 'Publier et vendre'];

// Tutoriel 8 = vidéos des Étapes 3 et 4 réunies.
const VIDEOS: Record<number, string[]> = { 6: [etape1Video.url], 7: [etape2Video.url], 8: [etape3Video.url, etape4Video.url], 9: [etape5Video.url] };
TUTORIELS_V3.forEach((x) => { if (VIDEOS[x.num]?.length) x.videos = VIDEOS[x.num]; });
