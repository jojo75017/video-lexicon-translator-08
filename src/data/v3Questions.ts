import { V2_TOOLS, type V2ToolCategory } from './v2ToolsRegistry';
import { ASSISTANT_FAQ } from './assistantKnowledge';
import { EXTRA_CURATED } from './v3QuestionsExtra';
import type { QuestionEntry } from './v3Questions.types';

export type { QuestionEntry };

const THEME_BY_CATEGORY: Record<V2ToolCategory, string> = {
  ecriture: 'Écrire mon livre',
  visuel: 'Couverture & illustrations',
  audio: 'Audio & audiolivres',
  kdp: 'Publier sur Amazon KDP',
  analyse: 'Niches & mots-clés',
  marketing: 'Vendre & faire connaître',
  business: 'Business & revenus',
  espace: 'Mon espace & mon compte',
  formation: 'Formations & guides',
};

/** Questions issues des demandes réelles des abonnés. */
const CURATED: QuestionEntry[] = [
  {
    id: 'q-cle-unique',
    question: 'Faut-il une clé OpenAI et OpenRouter, ou la clé Gemini suffit-elle ?',
    answer:
      'La clé Gemini seule fait tourner l’écriture, la correction et l’humaniseur. OpenAI et OpenRouter sont facultatifs, et sans aucune clé le moteur intégré prend le relais.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Paramétrer mes clés', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'q-blocs-900',
    question: 'Que veut dire « traitement par blocs de 900 mots » dans l’humaniseur ?',
    answer:
      'Vous collez tout le document : le logiciel le découpe lui-même en tranches d’environ 900 mots, les traite l’une après l’autre avec une barre de progression et relance automatiquement une tranche en cas d’échec. Aucune action de votre part.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Ouvrir l’humaniseur', route: '/ebook-planner' },
  },
  {
    id: 'q-blocs-700',
    question: 'Et les « blocs de 700 mots avec nettoyage » du correcteur ?',
    answer:
      'Même principe, avec des blocs plus courts pour la précision orthographique. Le nettoyage (mots latins, artefacts, phrases de fin incomplètes) est automatique : vous cliquez seulement sur « Corriger mon livre ».',
    theme: 'Corriger mon livre',
    action: { label: 'Corriger mon livre', route: '/v3/corriger' },
  },
  {
    id: 'q-correction-arret',
    question: 'La correction s’arrête en cours de route, que faire ?',
    answer:
      'Cliquez sur « Effacer la correction et repartir à zéro » puis relancez : les chapitres en échec sont désormais réessayés jusqu’à cinq fois et ignorés au pire, sans stopper le reste du livre.',
    theme: 'Corriger mon livre',
    action: { label: 'Ouvrir le correcteur', route: '/v3/corriger' },
  },
  {
    id: 'q-livre-corrige',
    question: 'Où retrouver mon livre après correction ?',
    answer:
      'Chaque correction est enregistrée automatiquement dans « Mes livres corrigés », d’où vous pouvez la rouvrir, la relancer ou l’exporter.',
    theme: 'Corriger mon livre',
    action: { label: 'Mes livres corrigés', route: '/v3/livres-corriges' },
  },
  {
    id: 'q-export-sommaire',
    question: 'Mon sommaire est-il propre à l’export Word et PDF ?',
    answer:
      'Oui : les titres sont nettoyés (plus d’artefacts JSON), dédoublonnés, et la table des matières utilise un habillage soigné dans les exports DOCX et PDF.',
    theme: 'Exports & fichiers',
    action: { label: 'Exporter mon livre', route: '/v3/hub?tab=export' },
  },
  {
    id: 'q-paypal',
    question: 'Puis-je payer avec PayPal ?',
    answer:
      'Oui. Le paiement carte et le paiement PayPal sont proposés côte à côte sur la page de commande.',
    theme: 'Forfaits & paiement',
    action: { label: 'Voir les forfaits', route: '/v3/forfaits' },
  },
  {
    id: 'q-forfaits',
    question: 'Quelle différence entre Plume et Édition ?',
    answer:
      'Plume (27 €/mois) donne tous les onglets d’écriture, le Sommaire IA guidé, les 10 langues, l’audiolivre et l’export. Édition (47 €/mois) ajoute la Recherche Approfondie, le Sommaire IA avancé, Cover Studio Pro, BD Studio Pro et inclut absolument tous les compléments (BookPerfect, traductions relues, audio premium, coaching 1-à-1). Il n’existe que ces deux forfaits. En annuel, deux mois sont offerts.',
    theme: 'Forfaits & paiement',
    action: { label: 'Comparer les forfaits', route: '/v3/forfaits' },
  },
  {
    id: 'q-v2',
    question: 'J’étais client de la V2, que devient mon accès ?',
    answer:
      'Votre V2 reste acquise à vie, trois modules V3 vous sont offerts, et vous gardez -20 % à vie sur Plume ou Édition.',
    theme: 'Forfaits & paiement',
    action: { label: 'Mon offre ancien client', route: '/v3/migration' },
  },
  {
    id: 'q-parrainage',
    question: 'Comment gagner des commissions en parrainant ?',
    answer:
      'Votre espace parrainage vous donne un lien unique, le suivi de vos filleuls et le total de vos commissions.',
    theme: 'Business & revenus',
    action: { label: 'Mon parrainage', route: '/mon-parrainage' },
  },
  {
    id: 'q-coordonnees',
    question: 'Qui voit mes coordonnées et mes réseaux sociaux ?',
    answer:
      'Vous seul. Ces fiches sont privées ; vos réseaux ne s’affichent sur votre page auteur que si vous cochez explicitement l’option.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Mes coordonnées', route: '/v3/fonctionnalites/coordonnees' },
  },
  {
    id: 'q-integrations',
    question: 'Puis-je brancher Brevo, Systeme.io ou GetResponse ?',
    answer:
      'Oui : enregistrez la clé de votre outil d’e-mailing dans les intégrations, et vos contacts pourront y être envoyés.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Mes intégrations', route: '/v3/fonctionnalites/integrations' },
  },
  {
    id: 'q-latin',
    question: 'Comment être sûr qu’il ne reste aucun mot latin dans mon texte ?',
    answer:
      'Le correcteur applique un balayage anti-latin en double passe et répare les fins de chapitre pour qu’elles se terminent par une vraie phrase ponctuée.',
    theme: 'Corriger mon livre',
    action: { label: 'Lancer la correction', route: '/v3/corriger' },
  },
  {
    id: 'q-chapitres',
    question: 'Combien de chapitres puis-je générer par livre ?',
    answer:
      'Jusqu’à 40 chapitres par projet. Au-delà de 30, un avertissement s’affiche car la génération devient longue.',
    theme: 'Écrire mon livre',
    action: { label: 'Créer mon livre', route: '/v3/create' },
  },
  {
    id: 'q-support',
    question: 'Comment joindre une vraie personne ?',
    answer:
      'Passez par le support : décrivez votre blocage, vous recevez une réponse personnelle avec la marche à suivre.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Contacter le support', route: '/v3/contact' },
  },
];

const FROM_ASSISTANT: QuestionEntry[] = ASSISTANT_FAQ.map((f) => ({
  id: `faq-${f.id}`,
  question: f.question,
  answer: f.answer,
  theme: 'Questions fréquentes',
  action: f.actions[0] ?? { label: 'Ouvrir l’assistant', route: '/v3/assistant' },
}));

/** Gain de temps concret, par famille d'outils. */
const GAIN_BY_CATEGORY: Record<V2ToolCategory, string> = {
  ecriture:
    'Dès que vous devez produire du texte long : il évite la page blanche et vous rend un contenu structuré, que vous relisez au lieu de l’écrire.',
  visuel:
    'Dès que vous devez présenter votre livre : vous obtenez un visuel propre sans passer par un logiciel de retouche.',
  audio:
    'Dès que vous voulez une version écoutable de votre travail, sans studio ni micro.',
  kdp: 'Au moment de la mise en vente : il vous évite les allers-retours et les refus de publication.',
  analyse:
    'Avant d’écrire : vous vérifiez que le sujet intéresse des lecteurs avant d’y passer des heures.',
  marketing:
    'Après la publication : vous avez les textes de promotion prêts, au lieu de repartir d’une page vide.',
  business:
    'Quand vous voulez piloter vos revenus : les chiffres et les priorités sont réunis au même endroit.',
  espace:
    'Au quotidien : vos informations, vos projets et vos réglages restent centralisés.',
  formation:
    'Quand vous bloquez sur une étape : la marche à suivre est expliquée dans l’ordre.',
};

/** Ce qu'il faut préparer avant d'ouvrir l'outil, par famille. */
const PREPARE_BY_CATEGORY: Record<V2ToolCategory, string> = {
  ecriture: 'Votre sujet, le public visé et, si vous l’avez déjà, votre sommaire.',
  visuel: 'Votre titre, votre nom d’auteur et deux lignes décrivant l’ambiance voulue.',
  audio: 'Votre manuscrit terminé, ou au moins le chapitre à faire lire.',
  kdp: 'Titre, description, prix envisagé et nombre de pages de votre livre.',
  analyse: 'Une idée de thème ou de rayon, même approximative.',
  marketing: 'Le titre du livre, sa promesse principale et la date de mise en vente.',
  business: 'Vos ventes ou vos objectifs du mois, pour comparer.',
  espace: 'Rien de particulier : vos informations de compte suffisent.',
  formation: 'Un moment calme, et la question précise qui vous bloque.',
};

/** Cinq questions par outil du registre : rôle, accès, prise en main, utilité, préparation. */
const FROM_TOOLS: QuestionEntry[] = V2_TOOLS.flatMap((tool) => {
  const theme = THEME_BY_CATEGORY[tool.category] ?? 'Outils';
  const action = { label: `Ouvrir ${tool.label}`, route: tool.route };
  return [
    {
      id: `tool-${tool.id}-role`,
      question: `À quoi sert « ${tool.label} » ?`,
      answer: tool.description,
      theme,
      action,
    },
    {
      id: `tool-${tool.id}-acces`,
      question: `Où trouver « ${tool.label} » dans mon espace ?`,
      answer: `Cet outil s'ouvre directement depuis ce bouton, et reste accessible depuis la barre latérale et l'index des outils.`,
      theme,
      action,
    },
    {
      id: `tool-${tool.id}-usage`,
      question: `Comment utiliser « ${tool.label} » pas à pas ?`,
      answer: `Ouvrez l’outil, remplissez les champs demandés, lancez, puis relisez et ajustez le résultat avant de le télécharger ou de l’enregistrer. Rien n’est publié à votre place.`,
      theme,
      action,
    },
    {
      id: `tool-${tool.id}-gain`,
      question: `Dans quel cas « ${tool.label} » me fait-il gagner du temps ?`,
      answer: GAIN_BY_CATEGORY[tool.category] ?? 'Dès que la tâche vous prend plus de temps à la main qu’à la relecture.',
      theme,
      action,
    },
    {
      id: `tool-${tool.id}-prepa`,
      question: `Que faut-il préparer avant d’ouvrir « ${tool.label} » ?`,
      answer: PREPARE_BY_CATEGORY[tool.category] ?? 'Votre sujet et votre titre suffisent pour démarrer.',
      theme,
      action,
    },
  ];
});

const seen = new Set<string>();

export const V3_QUESTIONS: QuestionEntry[] = [
  ...CURATED,
  ...EXTRA_CURATED,
  ...FROM_ASSISTANT,
  ...FROM_TOOLS,
].filter(
  (q) => {
    const key = q.question.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  },
);

export const V3_QUESTION_THEMES: string[] = Array.from(
  new Set(V3_QUESTIONS.map((q) => q.theme)),
).sort((a, b) => a.localeCompare(b, 'fr'));

export default V3_QUESTIONS;
