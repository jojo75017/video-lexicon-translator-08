/**
 * Liste de démarchage partenaires — cibles francophones auto-édition / KDP / IA.
 *
 * Cette liste sert de point de départ pour le suivi (`ambassador_outreach`).
 * `verified: false` = le nom circule dans la niche mais la chaîne ou le compte
 * exact doit être vérifié avant tout envoi. Aucun envoi automatique.
 *
 * Exclusions volontaires : voir PARTNER_EXCLUDED_TARGETS ci-dessous. On ne
 * démarche pas quelqu'un qui vend déjà un outil concurrent : il ne recommandera
 * pas EbookStudio, et le message donne des informations à un concurrent.
 */

export interface PartnerTarget {
  /** Nom affiché du créateur ou de la marque. */
  name: string;
  /** Valeur de `platform` dans PARTNER_PLATFORMS. */
  platform: string;
  /** Thème principal, repris dans la colonne « niche » du suivi. */
  niche: string;
  /** Endroit de contact le plus probable, en clair. */
  contact: string;
  /** Où chercher précisément ce point de contact. */
  where: string;
  /** Chaîne / compte confirmé ou à vérifier avant envoi. */
  verified: boolean;
}

export const PARTNER_TARGETS: PartnerTarget[] = [
  {
    name: 'Nicolas Rocher',
    platform: 'youtube',
    niche: 'Auto-édition / KDP',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → onglet « À propos » → bouton e-mail',
    verified: false,
  },
  {
    name: 'Alexandre Chaimbault',
    platform: 'youtube',
    niche: 'Business en ligne / KDP',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos », sinon message Instagram',
    verified: false,
  },
  {
    name: 'Med Cisse',
    platform: 'youtube',
    niche: 'KDP / revenus passifs',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Jean-Baptiste Viet (Jeanviet)',
    platform: 'youtube',
    niche: 'Outils numériques / IA',
    contact: 'Formulaire du site jeanviet.info',
    where: 'jeanviet.info → page Contact',
    verified: true,
  },
  {
    name: 'Stan Juliann',
    platform: 'youtube',
    niche: 'Auto-édition',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Émilie Varrier',
    platform: 'youtube',
    niche: 'Écriture de roman',
    contact: 'Message Instagram',
    where: 'Bio Instagram, souvent liée depuis la chaîne',
    verified: false,
  },
  {
    name: 'Claire Lepagnol',
    platform: 'youtube',
    niche: 'Écriture / romancière',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Florence Tpin',
    platform: 'youtube',
    niche: 'Écriture / auto-édition',
    contact: 'Message Instagram',
    where: 'Compte Instagram lié à la chaîne',
    verified: false,
  },
  {
    name: 'Ethan Pingault',
    platform: 'youtube',
    niche: 'Business / IA',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Jérémy Ferrand',
    platform: 'youtube',
    niche: 'Revenus en ligne / KDP',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Bastien Bricout',
    platform: 'youtube',
    niche: 'Business en ligne',
    contact: 'Message Instagram',
    where: 'Instagram indiqué en description de vidéo',
    verified: false,
  },
  {
    name: 'Amaury Tardier',
    platform: 'youtube',
    niche: 'IA / productivité',
    contact: 'E-mail de la chaîne',
    where: 'YouTube → « À propos »',
    verified: false,
  },
  {
    name: 'Hélène Jacob — TutoBar',
    platform: 'blog',
    niche: 'Tutoriels édition',
    contact: 'Formulaire du site',
    where: 'Site → page Contact',
    verified: false,
  },
  {
    name: 'Anne Guervel',
    platform: 'blog',
    niche: 'Écriture / accompagnement auteurs',
    contact: 'Formulaire du site',
    where: 'Site → page Contact',
    verified: false,
  },
  {
    name: 'Cyril — autoeditermonlivre.fr',
    platform: 'blog',
    niche: 'Auto-édition',
    contact: 'E-mail du site',
    where: 'autoeditermonlivre.fr → Contact / mentions légales',
    verified: true,
  },
  {
    name: 'Jérôme — Écrire et être Lu',
    platform: 'podcast',
    niche: 'Écriture / publication',
    contact: 'E-mail du podcast',
    where: 'Page du podcast → Contact',
    verified: false,
  },
  {
    name: 'Sabrina Pommier',
    platform: 'instagram',
    niche: 'Auteure indépendante',
    contact: 'Message Instagram',
    where: 'Message privé Instagram',
    verified: false,
  },
  {
    name: 'Estelle Lequette',
    platform: 'instagram',
    niche: 'Écriture / auto-édition',
    contact: 'Message Instagram',
    where: 'Message privé Instagram',
    verified: false,
  },
  {
    name: 'Jean-Louis Vill',
    platform: 'newsletter',
    niche: 'Auto-édition',
    contact: 'Réponse à sa newsletter',
    where: 'Répondre directement au dernier e-mail reçu',
    verified: false,
  },
  {
    name: 'Groupe Facebook « Auto-édition & KDP francophone »',
    platform: 'groupe',
    niche: 'Communauté KDP',
    contact: 'Message à l\u2019administrateur',
    where: 'Groupe → onglet Membres → administrateurs',
    verified: true,
  },
];

/**
 * Lien direct vers l'endroit où trouver le point de contact de la cible.
 * On ne devine aucune adresse : on ouvre la recherche ou le réseau concerné.
 */
export const targetContactUrl = (t: PartnerTarget): string => {
  // Recherche publique accessible sans connexion : les recherches internes
  // d'Instagram/TikTok/Facebook renvoient une page vide hors session.
  const site =
    t.platform === 'youtube'
      ? 'site:youtube.com'
      : t.platform === 'instagram'
        ? 'site:instagram.com'
        : t.platform === 'tiktok'
          ? 'site:tiktok.com'
          : t.platform === 'groupe'
            ? 'site:facebook.com'
            : '';
  const q = encodeURIComponent(`${t.name} ${site} contact`.trim());
  return `https://duckduckgo.com/?q=${q}`;
};

/** Rappel affiché au-dessus de la liste. */
export const PARTNER_TARGETS_RULE =
  'Un seul message par cible, puis une seule relance à cinq jours. On vérifie la chaîne ou le compte avant d\u2019écrire.';

/** Cibles volontairement écartées : elles vendent déjà un outil du même genre. */
export const PARTNER_EXCLUDED_TARGETS: { name: string; reason: string }[] = [
  { name: 'Quentin Haguet', reason: 'lié à Rocket KDP / Bookhag' },
  { name: 'Antonin — KDP Pilot', reason: 'vend son propre logiciel KDP' },
  { name: 'Sébastien — Ebook-Création', reason: 'vend sa propre solution de création d’ebooks' },
];
