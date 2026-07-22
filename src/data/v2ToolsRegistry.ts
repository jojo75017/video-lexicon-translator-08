/**
 * Registre des outils V2 (pages existantes) à exposer dans l'onglet
 * « Outils V2 » du Hub V3. Chaque entrée pointe vers une route de l'app.
 * Aucun code métier n'est dupliqué — c'est un launcher unifié.
 */
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen, Image as ImageIcon, Mic, Palette, FileText, Search,
  TrendingUp, Sparkles, GraduationCap, Bot, PenTool, Layers,
  BarChart3, Lightbulb, Wand2, Users, Target, Compass, ShoppingBag,
  Newspaper, Rocket,
} from 'lucide-react';

export type V2ToolCategory =
  | 'ecriture'
  | 'visuel'
  | 'audio'
  | 'kdp'
  | 'marketing'
  | 'analyse'
  | 'formation';

export interface V2Tool {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
  category: V2ToolCategory;
  badge?: 'V2' | 'Populaire' | 'Nouveau';
}

export const V2_TOOL_CATEGORIES: { id: V2ToolCategory; label: string; emoji: string }[] = [
  { id: 'ecriture', label: 'Écriture & Idées', emoji: '✍️' },
  { id: 'visuel', label: 'Visuel & Couverture', emoji: '🎨' },
  { id: 'audio', label: 'Audio & Vidéo', emoji: '🎙️' },
  { id: 'kdp', label: 'Amazon KDP', emoji: '📦' },
  { id: 'marketing', label: 'Marketing & Ventes', emoji: '📢' },
  { id: 'analyse', label: 'Analyse & Audit', emoji: '📊' },
  { id: 'formation', label: 'Formation & Guides', emoji: '🎓' },
];

export const V2_TOOLS: V2Tool[] = [
  // — Écriture & Idées —
  { id: 'ebook-planner', label: 'Ebook Planner (V2)', description: 'Le pipeline complet P1-P15 (15 agents) qui reste la référence.', route: '/ebook-planner', icon: BookOpen, category: 'ecriture', badge: 'Populaire' },
  { id: 'toc-ultimate', label: 'Générateur Ultime de Sommaire', description: 'Table des matières pro : genre, public, style, créativité — éditable et exportable.', route: '/v3/outils/sommaire-ultime', icon: FileText, category: 'ecriture', badge: 'Nouveau' },
  { id: 'ebook-ideas', label: 'Générateur d\'idées', description: 'Trouvez rapidement des idées d\'ebooks rentables.', route: '/ebook-ideas', icon: Lightbulb, category: 'ecriture' },
  { id: 'ambiances', label: 'Ambiances d\'écriture', description: 'Décors sonores et visuels pour rédiger sans distraction.', route: '/ambiances', icon: Palette, category: 'ecriture' },
  { id: 'ai-chat', label: 'Chat IA', description: 'Assistant conversationnel pour brainstormer et écrire.', route: '/ai-chat', icon: Bot, category: 'ecriture' },
  { id: 'ebookbot', label: 'Ebookbot', description: 'Bot spécialisé création d\'ebook pas à pas.', route: '/ebookbot', icon: Wand2, category: 'ecriture' },
  { id: 'quiz', label: 'Quiz Auteur', description: 'Identifiez votre profil d\'auteur en 2 minutes.', route: '/quiz', icon: Users, category: 'ecriture' },
  

  // — Visuel & Couverture —
  { id: 'couverture-kdp', label: 'Cover Studio KDP', description: 'Générez des couvertures Kindle et poche prêtes à publier.', route: '/couverture-kdp', icon: ImageIcon, category: 'visuel', badge: 'Populaire' },
  { id: 'bd-studio', label: 'BD Studio', description: 'Créez des bandes dessinées et albums illustrés.', route: '/bd-studio', icon: PenTool, category: 'visuel' },

  // — Audio & Vidéo —
  { id: 'audiobook-demo', label: 'Audiobook Studio', description: 'Générez un audiobook complet à partir de votre manuscrit.', route: '/audiobook-demo', icon: Mic, category: 'audio' },
  { id: 'formation-audio', label: 'Formation Audio', description: 'Podcasts et cours audio de formation.', route: '/formation-audio', icon: Mic, category: 'audio' },

  // — Amazon KDP —
  { id: 'kdp-keywords', label: 'KDP Keywords', description: 'Recherche de mots-clés Amazon KDP à fort volume.', route: '/kdp-keywords', icon: Search, category: 'kdp', badge: 'Populaire' },
  { id: 'niches', label: 'Niches Amazon', description: 'Explorez les niches KDP qui vendent aujourd\'hui.', route: '/niches', icon: Target, category: 'kdp' },
  { id: 'niches-600', label: '600 Niches', description: 'Base élargie de 600 niches Amazon analysées.', route: '/niches-600', icon: Layers, category: 'kdp' },
  { id: 'series-tomes', label: 'Séries & Tomes', description: 'Planifiez vos séries multi-tomes sur Amazon.', route: '/series-tomes', icon: BookOpen, category: 'kdp' },
  { id: 'kdp-ads-guide', label: 'KDP Ads Guide', description: 'Guide complet pour lancer vos publicités Amazon.', route: '/kdp-ads-guide', icon: Rocket, category: 'kdp' },

  // — Marketing & Ventes —
  { id: 'plan-marketing', label: 'Plan Marketing', description: 'Bâtissez votre plan marketing en 15 minutes.', route: '/plan-marketing', icon: Compass, category: 'marketing' },
  { id: 'campagne-vente', label: 'Campagne de vente', description: 'Créez une campagne de lancement clé en main.', route: '/campagne-vente', icon: TrendingUp, category: 'marketing' },
  { id: 'generateur-posts', label: 'Générateur Posts Sociaux', description: 'Posts prêts pour Instagram / Facebook / TikTok.', route: '/generateur-posts', icon: Newspaper, category: 'marketing' },
  { id: 'parrainage', label: 'Parrainage', description: 'Système d\'affiliation intégré.', route: '/parrainage', icon: Users, category: 'marketing' },
  { id: 'affiliation', label: 'Affiliation Formation', description: 'Devenez affilié de la formation EbookStudio.', route: '/affiliation', icon: ShoppingBag, category: 'marketing' },

  // — Analyse & Audit —
  { id: 'audit-pilot', label: 'Audit Pilot', description: 'Audit complet de votre manuscrit avant publication.', route: '/audit-pilot', icon: BarChart3, category: 'analyse' },
  { id: 'bookperfect', label: 'BookPerfect AI', description: 'Correction et polissage IA de votre manuscrit.', route: '/bookperfect', icon: Sparkles, category: 'analyse' },
  { id: 'fiches-pratiques', label: 'Fiches pratiques', description: 'Modèles et fiches méthodologiques.', route: '/fiches-pratiques', icon: FileText, category: 'analyse' },

  // — Formation & Guides —
  { id: 'formation', label: 'Formation vidéo', description: 'Cours vidéo complet EbookStudio.', route: '/formation', icon: GraduationCap, category: 'formation' },
  { id: 'formation-videos', label: 'Bibliothèque vidéo', description: 'Toutes les vidéos de formation.', route: '/formation-videos', icon: GraduationCap, category: 'formation' },
  { id: 'masterclass', label: 'Masterclass', description: '5 modules avancés (5h de formation).', route: '/masterclass', icon: GraduationCap, category: 'formation' },
  { id: 'guide-outils', label: 'Guide des outils', description: 'Documentation pour tirer parti de chaque outil.', route: '/guide-outils', icon: Compass, category: 'formation' },
  { id: 'tutoriels', label: 'Tutoriels', description: 'Tutoriels pas à pas.', route: '/tutoriels', icon: GraduationCap, category: 'formation' },
];
