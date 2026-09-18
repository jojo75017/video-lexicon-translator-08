/**
 * Espace KDP — liste unique des pages de l'onglet « KDP ».
 * Pour ajouter une page plus tard : une ligne ici + la route, rien d'autre.
 */
export interface KdpTabPage {
  label: string;
  to: string;
  desc: string;
  badge?: string;
  /** Page maison (créée par nous) ou outil déjà existant regroupé ici. */
  maison?: boolean;
}

export const KDP_TAB_PAGES: KdpTabPage[] = [
  {
    label: 'Fiche Audit — un ASIN, tout le contenu',
    to: '/v3/kdp/fiche-audit',
    desc: 'Collez un ASIN : description de vente, 7 mots-clés backend et contenu A+ en 4 modules, prêts à coller dans KDP',
    badge: 'Nouveau',
    maison: true,
  },
  {
    label: 'Plan de lancement — vos 30 premiers jours',
    to: '/v3/kdp/lancement',
    desc: 'Décrivez votre livre ou collez un ASIN : une action par jour pendant 30 jours, avec les messages prêts à publier',
    badge: 'Nouveau',
    maison: true,
  },
  {
    label: 'Mots-clés percutants — un sujet, 7 mots-clés KDP',
    to: '/v3/kdp/mots-cles',
    desc: 'Un sujet ou un ASIN : les 7 mots-clés à coller dans KDP, les expressions à viser, des titres et sous-titres',
    badge: 'Nouveau',
    maison: true,
  },
  {
    label: 'Audit avant publication',
    to: '/audit-pilot',
    desc: 'Vérification complète de votre fiche avant la mise en vente Kindle ou poche',
  },
  {
    label: 'Mots-clés Amazon',
    to: '/kdp-keywords',
    desc: 'Recherche de mots-clés KDP à fort volume pour votre titre et votre description',
  },
  {
    label: 'Catégories KDP',
    to: '/v3/outils/categories',
    desc: 'Plus de 19 000 catégories Amazon à explorer pour mieux vous positionner',
  },
  {
    label: 'KDP Pilot — aller plus loin',
    to: '/v3/kdp-pilot',
    desc: 'Suivi des ventes réelles et de la niche sur Amazon — outil partenaire payant, code abonné inclus',
    badge: '-15 %',
  },
];
