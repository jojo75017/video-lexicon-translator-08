/**
 * Registre des outils accessibles depuis le hub V3.
 * Seules les routes réellement disponibles pour un abonné sont listées
 * (aucune route ne redirige vers /admin ou /offres).
 */
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen, Image as ImageIcon, Mic, Palette, FileText, Search,
  Sparkles, GraduationCap, Bot, PenTool, Layers,
  BarChart3, Lightbulb, Wand2, Users, Target, PenLine,
  FolderOpen, Home, Star, Signature,
} from 'lucide-react';

export type V2ToolCategory =
  | 'ecriture'
  | 'visuel'
  | 'audio'
  | 'kdp'
  | 'analyse'
  | 'espace'
  | 'formation';

export interface V2Tool {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
  category: V2ToolCategory;
  badge?: 'V2' | 'V3' | 'Populaire' | 'Nouveau';
}

export const V2_TOOL_CATEGORIES: { id: V2ToolCategory; label: string; emoji: string }[] = [
  { id: 'ecriture',  label: 'Écriture & Idées',        emoji: '✍️' },
  { id: 'visuel',    label: 'Visuel & Couverture',     emoji: '🎨' },
  { id: 'audio',     label: 'Audio & Vidéo',           emoji: '🎙️' },
  { id: 'kdp',       label: 'Amazon KDP',              emoji: '📦' },
  { id: 'analyse',   label: 'Analyse & Audit',         emoji: '📊' },
  { id: 'espace',    label: 'Mon espace V3',           emoji: '🏠' },
  { id: 'formation', label: 'Formation & Guides',      emoji: '🎓' },
];

export const V2_TOOLS: V2Tool[] = [
  // — Écriture & Idées —
  { id: 'v3-create',   label: 'Créer un livre (Wizard V3)', description: '4 étapes : détails, réglages, personnages, génération.', route: '/v3/create', icon: PenLine, category: 'ecriture', badge: 'V3' },
  { id: 'ebook-planner', label: 'Ebook Planner (V2)',       description: 'Le pipeline complet P1-P15 (22 agents), toujours en production.', route: '/ebook-planner', icon: BookOpen, category: 'ecriture', badge: 'Populaire' },
  { id: 'toc-ultimate', label: 'Générateur Ultime de Sommaire', description: 'Table des matières pro : genre, ton, créativité — éditable et exportable.', route: '/v3/outils/sommaire-ultime', icon: FileText, category: 'ecriture', badge: 'Nouveau' },
  { id: 'ebook-ideas', label: "Générateur d'idées",         description: "Trouvez rapidement des idées d'ebooks rentables.", route: '/ebook-ideas', icon: Lightbulb, category: 'ecriture' },
  { id: 'ambiances',   label: "Ambiances d'écriture",       description: 'Décors sonores et visuels pour rédiger sans distraction.', route: '/ambiances', icon: Palette, category: 'ecriture' },
  { id: 'ebookbot',    label: 'Ebookbot / Chat IA',         description: 'Assistant conversationnel pour brainstormer et écrire.', route: '/ebookbot', icon: Bot, category: 'ecriture' },
  { id: 'quiz',        label: 'Quiz Auteur',                description: "Identifiez votre profil d'auteur en 2 minutes.", route: '/quiz', icon: Users, category: 'ecriture' },
  { id: 'signature',   label: 'Ma signature auteur',        description: 'Signature email et blocs auteurs prêts à coller.', route: '/signature', icon: Signature, category: 'ecriture' },

  // — Visuel & Couverture —
  { id: 'couverture-kdp', label: 'Cover Studio KDP', description: 'Couvertures Kindle et poche prêtes à publier.', route: '/couverture-kdp', icon: ImageIcon, category: 'visuel', badge: 'Populaire' },
  { id: 'bd-studio',      label: 'BD Studio',       description: 'Créez des bandes dessinées et albums illustrés.', route: '/bd-studio', icon: PenTool, category: 'visuel' },

  // — Audio & Vidéo —
  { id: 'formation-audio',  label: 'Formation Audio',    description: 'Podcasts et cours audio de formation.', route: '/formation-audio', icon: Mic, category: 'audio' },
  { id: 'formation-series-audio', label: 'Séries Audio', description: 'Écoutez les séries de formation en audio.', route: '/formation-series-audio', icon: Mic, category: 'audio' },

  // — Amazon KDP —
  { id: 'kdp-keywords', label: 'KDP Keywords',      description: 'Recherche de mots-clés Amazon KDP à fort volume.', route: '/kdp-keywords', icon: Search, category: 'kdp', badge: 'Populaire' },
  { id: 'niches',       label: 'Niches Amazon',     description: 'Explorez les niches KDP qui vendent aujourd\'hui.', route: '/niches', icon: Target, category: 'kdp' },
  { id: 'niches-600',   label: '600 Niches',        description: 'Base élargie de 600 niches Amazon analysées.', route: '/niches-600', icon: Layers, category: 'kdp', badge: 'Nouveau' },
  { id: 'series-tomes', label: 'Séries & Tomes',    description: 'Planifiez vos séries multi-tomes sur Amazon.', route: '/series-tomes', icon: BookOpen, category: 'kdp' },
  { id: 'word-count',   label: 'Compteur de mots KDP', description: 'Objectifs pages/mots par format Amazon KDP.', route: '/word-count', icon: BarChart3, category: 'kdp' },

  // — Analyse & Audit —
  { id: 'audit-pilot',      label: 'Audit Pilot',    description: 'Audit complet de votre manuscrit avant publication.', route: '/audit-pilot', icon: BarChart3, category: 'analyse' },
  { id: 'bookperfect',      label: 'BookPerfect AI', description: 'Correction et polissage IA de votre manuscrit.', route: '/bookperfect', icon: Sparkles, category: 'analyse' },
  { id: 'fiches-pratiques', label: 'Fiches pratiques', description: 'Modèles et fiches méthodologiques.', route: '/fiches-pratiques', icon: FileText, category: 'analyse' },

  // — Mon espace V3 —
  { id: 'v3-home',      label: 'Accueil V3',        description: 'Page d\'accueil publique V3.', route: '/v3', icon: Home, category: 'espace', badge: 'V3' },
  { id: 'v3-hub',       label: 'Hub V3',            description: 'Tableau de bord + brouillons.', route: '/v3/hub', icon: Wand2, category: 'espace', badge: 'V3' },
  { id: 'v3-library',   label: 'Mes projets',       description: 'Tous vos livres sauvegardés.', route: '/v3/library', icon: FolderOpen, category: 'espace', badge: 'V3' },
  { id: 'v3-mes-livres', label: 'Gestion livres',   description: 'Manager avancé de vos livres.', route: '/v3/mes-livres', icon: BookOpen, category: 'espace', badge: 'V3' },
  { id: 'v3-gallery',   label: 'Galerie publique',  description: 'Livres publiés par la communauté.', route: '/v3/gallery', icon: Star, category: 'espace', badge: 'V3' },
  { id: 'v3-auteur',    label: 'Profil auteur',     description: 'Configurer votre page auteur.', route: '/v3/auteur', icon: Users, category: 'espace', badge: 'V3' },

  // — Formation & Guides —
  { id: 'formation',        label: 'Formation vidéo',   description: 'Cours vidéo complet EbookStudio.', route: '/formation', icon: GraduationCap, category: 'formation' },
  { id: 'formation-videos', label: 'Bibliothèque vidéo', description: 'Toutes les vidéos de formation.', route: '/formation-videos', icon: GraduationCap, category: 'formation' },
  { id: 'formation-series', label: 'Séries de formation', description: 'Formations en séries structurées.', route: '/formation-series', icon: GraduationCap, category: 'formation' },
  { id: 'masterclass',      label: 'Masterclass',       description: '5 modules avancés (5h de formation).', route: '/masterclass', icon: GraduationCap, category: 'formation' },
  { id: 'blog',             label: 'Guides & Blog',     description: 'Tous les guides publiés.', route: '/blog', icon: FileText, category: 'formation' },
];
