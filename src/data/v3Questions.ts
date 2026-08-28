import { V2_TOOLS, type V2ToolCategory } from './v2ToolsRegistry';
import { ASSISTANT_FAQ } from './assistantKnowledge';

export interface QuestionEntry {
  id: string;
  question: string;
  answer: string;
  theme: string;
  action: { label: string; route: string };
}

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

/** Deux questions par outil du registre : « à quoi ça sert » et « où le trouver ». */
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
  ];
});

const seen = new Set<string>();

export const V3_QUESTIONS: QuestionEntry[] = [...CURATED, ...FROM_ASSISTANT, ...FROM_TOOLS].filter(
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
