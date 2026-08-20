import {
  KeyRound, IdCard, Share2, Plug, BookPlus, PenLine, Palette, TrendingUp,
  Library, Crown, HeartHandshake, HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { V3_HEADER_MENU } from './v3HeaderMenu';

export type FeatureTileKind = 'link' | 'category';

export interface FeatureTile {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tint: string;          // fond de la pastille d'icône
  kind: FeatureTileKind;
  to?: string;           // pour kind = 'link'
  categoryKey?: string;  // clé dans V3_HEADER_MENU pour kind = 'category'
  private?: boolean;     // affiche le badge « visible par vous seul »
}

export interface FeatureRow {
  label: string;
  tiles: FeatureTile[];
}

const cat = (key: string) => V3_HEADER_MENU.find((c) => c.key === key);

export const FEATURE_ROWS: FeatureRow[] = [
  {
    label: 'Mon compte',
    tiles: [
      {
        id: 'cles',
        title: 'Paramétrage des clés',
        subtitle: 'Gemini, OpenAI, OpenRouter — vos moteurs IA',
        icon: KeyRound,
        tint: 'rgba(13,122,95,0.12)',
        kind: 'link',
        to: '/v3/fonctionnalites/cles',
        private: true,
      },
      {
        id: 'coordonnees',
        title: 'Mes coordonnées',
        subtitle: 'Nom, adresse, téléphone, e-mail de facturation',
        icon: IdCard,
        tint: 'rgba(201,168,76,0.16)',
        kind: 'link',
        to: '/v3/fonctionnalites/coordonnees',
        private: true,
      },
      {
        id: 'reseaux',
        title: 'Mes réseaux sociaux',
        subtitle: 'Site, Instagram, YouTube, page auteur Amazon',
        icon: Share2,
        tint: 'rgba(59,130,246,0.12)',
        kind: 'link',
        to: '/v3/fonctionnalites/reseaux',
        private: true,
      },
      {
        id: 'integrations',
        title: 'Mes intégrations',
        subtitle: 'Brevo, Systeme.io, GetResponse, MailerLite',
        icon: Plug,
        tint: 'rgba(244,114,45,0.14)',
        kind: 'link',
        to: '/v3/fonctionnalites/integrations',
        private: true,
      },
    ],
  },
  {
    label: 'Le parcours du livre',
    tiles: [
      {
        id: 'workflow-15-agents',
        title: 'Workflow 15 Agents',
        subtitle: 'Le pipeline P1 → P15 et l’avancement de votre livre',
        icon: Bot,
        tint: 'rgba(13,122,95,0.14)',
        kind: 'link',
        to: '/v3/workflow',
      },
      {
        id: 'creer',
        title: 'Créer',
        subtitle: cat('creer')?.tagline ?? 'De l’idée au plan',
        icon: BookPlus,
        tint: 'rgba(6,78,59,0.12)',
        kind: 'category',
        categoryKey: 'creer',
      },
      {
        id: 'ecrire',
        title: 'Écrire',
        subtitle: cat('ecrire')?.tagline ?? 'Le moteur d’écriture',
        icon: PenLine,
        tint: 'rgba(13,122,95,0.12)',
        kind: 'category',
        categoryKey: 'ecrire',
      },
      {
        id: 'habiller',
        title: 'Habiller',
        subtitle: cat('habiller')?.tagline ?? 'Le livre-objet',
        icon: Palette,
        tint: 'rgba(201,168,76,0.18)',
        kind: 'category',
        categoryKey: 'habiller',
      },
      {
        id: 'vendre',
        title: 'Vendre',
        subtitle: cat('vendre')?.tagline ?? 'La visibilité & les ventes',
        icon: TrendingUp,
        tint: 'rgba(220,38,38,0.10)',
        kind: 'category',
        categoryKey: 'vendre',
      },
    ],
  },
  {
    label: 'Aller plus loin',
    tiles: [
      {
        id: 'livres',
        title: 'Livres spéciaux',
        subtitle: cat('livres')?.tagline ?? 'Les formats dédiés',
        icon: Library,
        tint: 'rgba(6,78,59,0.12)',
        kind: 'category',
        categoryKey: 'livres',
      },
      {
        id: 'forfaits',
        title: 'Forfaits',
        subtitle: 'Plume 27 €/mois · Édition 47 €/mois · Studio Pro 97 €/mois',
        icon: Crown,
        tint: 'rgba(201,168,76,0.18)',
        kind: 'link',
        to: '/v3/forfaits',
      },
      {
        id: 'parrainage',
        title: 'Parrainage',
        subtitle: 'Votre lien, vos filleuls, vos commissions',
        icon: HeartHandshake,
        tint: 'rgba(236,72,153,0.10)',
        kind: 'link',
        to: '/mon-parrainage',
      },
      {
        id: 'questions',
        title: 'Questions-réponses',
        subtitle: 'Une réponse claire + le bouton vers le bon outil',
        icon: HelpCircle,
        tint: 'rgba(59,130,246,0.12)',
        kind: 'link',
        to: '/v3/fonctionnalites/questions',
      },
    ],
  },
];

export default FEATURE_ROWS;
