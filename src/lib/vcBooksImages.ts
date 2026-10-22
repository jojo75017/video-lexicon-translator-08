export type VCImageKind = 'cover' | 'interior';
export interface VCImageBrief {
  kind: VCImageKind;
  scene: string;
  title: string;
  subtitle: string;
  author: string;
  withText: boolean;
}

export function buildVCImagePrompt(brief: VCImageBrief): string {
  if (!brief.scene.trim()) throw new Error('Décrivez la scène à illustrer.');
  if (brief.withText && !brief.title.trim()) throw new Error('Indiquez le titre de la couverture.');
  const art = brief.kind === 'cover'
    ? 'Illustration éditoriale humoristique en couleurs, dessin peint détaillé, personnages expressifs, contours nets. Palette jaune lumineux, bleu foncé et turquoise avec accents orange. Composition verticale à plat, personnage principal bien visible, accessoires de culture générale, humour bon enfant, sans vulgarité. Ni photographie ni rendu 3D. Garder des zones calmes en haut et en bas pour la typographie.'
    : 'Illustration intérieure humoristique en noir et blanc uniquement, traits noirs nets, fond blanc, sans aplats gris lourds, sujet complet avec espace autour. Composition verticale, dessin éditorial expressif, humour bon enfant, sans vulgarité. Ni photographie ni rendu 3D.';
  const typography = brief.kind === 'cover' && brief.withText
    ? `Typographie française parfaitement lisible, grande et expressive. Reproduire uniquement ces textes à l’identique : titre « ${brief.title.trim()} » en haut ; ${brief.subtitle.trim() ? `sous-titre « ${brief.subtitle.trim()} » dans un bandeau turquoise ; ` : ''}${brief.author.trim() ? `auteur « ${brief.author.trim()} » en bas. ` : ''}Aucun autre mot, aucun faux texte.`
    : 'AUCUN TEXTE : aucune lettre, aucun titre, aucun chiffre, aucun bandeau, aucune signature.';
  return `${art}\nScène originale demandée : ${brief.scene.trim()}\n${typography}\nSans filigrane, sans logo, sans prix, sans badge Amazon, sans livre en perspective. Anatomie cohérente, pas de membres accidentels. Ne pas reproduire une couverture existante.`;
}