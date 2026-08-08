/**
 * Registre complet des outils accessibles depuis le hub V3.
 * Rassemble ~50 modules V2 + V3 avec image de catégorie (Unsplash),
 * catégorie, badge, description et route publique.
 */
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen, Image as ImageIcon, Mic, Palette, FileText, Search,
  Sparkles, GraduationCap, Bot, PenTool, Layers,
  BarChart3, Lightbulb, Wand2, Users, Target, PenLine,
  FolderOpen, Home, Star, Signature, Rocket, Megaphone,
  Mail, Gift, ShieldCheck, Video, ClipboardList, Compass,
  TrendingUp, Award, Globe, Briefcase, Building2, HeartHandshake,
  Headphones, Youtube, MessageSquare, Zap, Download, ScrollText,
  Boxes, Store, LineChart, GitBranch,
} from 'lucide-react';

export type V2ToolCategory =
  | 'ecriture'
  | 'visuel'
  | 'audio'
  | 'kdp'
  | 'analyse'
  | 'marketing'
  | 'business'
  | 'espace'
  | 'formation';

export interface V2Tool {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
  category: V2ToolCategory;
  badge?: 'V2' | 'V3' | 'Populaire' | 'Nouveau' | 'Pro' | 'Gratuit';
  image?: string;
}

/** Illustration par catégorie (Unsplash, stable, libre) */
const IMG = {
  ecriture:  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=70&auto=format&fit=crop',
  visuel:    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=70&auto=format&fit=crop',
  audio:     'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=70&auto=format&fit=crop',
  kdp:       'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=70&auto=format&fit=crop',
  analyse:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70&auto=format&fit=crop',
  marketing: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&q=70&auto=format&fit=crop',
  business:  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70&auto=format&fit=crop',
  espace:    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&q=70&auto=format&fit=crop',
  formation: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=70&auto=format&fit=crop',
} as const;

export const V2_TOOL_CATEGORIES: { id: V2ToolCategory; label: string; emoji: string; image: string }[] = [
  { id: 'ecriture',  label: 'Écriture & Idées',        emoji: '✍️', image: IMG.ecriture  },
  { id: 'visuel',    label: 'Visuel & Couverture',     emoji: '🎨', image: IMG.visuel    },
  { id: 'audio',     label: 'Audio & Vidéo',           emoji: '🎙️', image: IMG.audio     },
  { id: 'kdp',       label: 'Amazon KDP',              emoji: '📦', image: IMG.kdp       },
  { id: 'analyse',   label: 'Analyse & Audit',         emoji: '📊', image: IMG.analyse   },
  { id: 'marketing', label: 'Marketing & Vente',       emoji: '📣', image: IMG.marketing },
  { id: 'business',  label: 'Business & Pro',          emoji: '💼', image: IMG.business  },
  { id: 'espace',    label: 'Mon espace V3',           emoji: '🏠', image: IMG.espace    },
  { id: 'formation', label: 'Formation & Guides',      emoji: '🎓', image: IMG.formation },
];

export const V2_TOOLS: V2Tool[] = [
  // — Écriture & Idées —
  { id: 'v3-create', label: 'Créer un livre (Wizard V3)', description: '4 étapes : détails, réglages, personnages, génération.', route: '/v3/create', icon: PenLine, category: 'ecriture', badge: 'V3', image: IMG.ecriture },
  { id: 'ebook-planner', label: 'Ebook Planner (V2)', description: 'Pipeline complet P1-P15 (22 agents), toujours en production.', route: '/ebook-planner', icon: BookOpen, category: 'ecriture', badge: 'Populaire', image: IMG.ecriture },
  { id: 'toc-ultimate', label: 'Générateur Ultime de Sommaire', description: 'Table des matières pro : genre, ton, créativité — éditable et exportable.', route: '/v3/outils/sommaire-ultime', icon: FileText, category: 'ecriture', badge: 'Nouveau', image: IMG.ecriture },
  { id: 'ebook-ideas', label: "Générateur d'idées", description: "Trouvez rapidement des idées d'ebooks rentables.", route: '/ebook-ideas', icon: Lightbulb, category: 'ecriture', image: IMG.ecriture },
  { id: 'creer-ebook-ia', label: 'Créer un ebook avec IA', description: 'Rédaction complète assistée par IA.', route: '/creer-ebook-ia', icon: Sparkles, category: 'ecriture', image: IMG.ecriture },
  { id: 'ecrire-chatgpt', label: 'Écrire un livre avec ChatGPT', description: 'Framework et prompts pour rédiger avec ChatGPT.', route: '/ecrire-livre-chatgpt', icon: Bot, category: 'ecriture', image: IMG.ecriture },
  { id: 'generateur-ebook', label: 'Générateur d\'ebook', description: 'Générateur clé-en-main : titre, plan, chapitres.', route: '/generateur-ebook', icon: Wand2, category: 'ecriture', image: IMG.ecriture },
  { id: 'ambiances', label: "Ambiances d'écriture", description: 'Décors sonores et visuels pour rédiger sans distraction.', route: '/ambiances', icon: Palette, category: 'ecriture', image: IMG.ecriture },
  { id: 'ebookbot', label: 'Ebookbot / Chat IA', description: 'Assistant conversationnel pour brainstormer et écrire.', route: '/ebookbot', icon: Bot, category: 'ecriture', image: IMG.ecriture },
  { id: 'ai-chat', label: 'Chat IA multimodèle', description: 'Chat multi-modèles (Gemini, Claude, GPT).', route: '/ai-chat', icon: MessageSquare, category: 'ecriture', image: IMG.ecriture },
  { id: 'quiz', label: 'Quiz Auteur', description: "Identifiez votre profil d'auteur en 2 minutes.", route: '/quiz', icon: Users, category: 'ecriture', image: IMG.ecriture },
  { id: 'signature', label: 'Ma signature auteur', description: 'Signature email et blocs auteurs prêts à coller.', route: '/signature', icon: Signature, category: 'ecriture', image: IMG.ecriture },
  { id: 'seo-generator', label: 'SEO Generator', description: 'Générez titres, méta-descriptions et keywords SEO.', route: '/seo-generator', icon: Search, category: 'ecriture', image: IMG.ecriture },
  { id: 'multi-translator', label: 'Traduction 10 langues', description: 'Traduisez votre livre en 10 langues (EN, ES, DE, IT, PT, NL, PL, JA, ZH, AR) — IA + relecture.', route: '/ebook-planner?tab=multi-translator', icon: Globe, category: 'ecriture', badge: 'Nouveau', image: IMG.ecriture },

  // — Visuel & Couverture —
  { id: 'couverture-kdp', label: 'Cover Studio KDP', description: 'Couvertures Kindle et poche prêtes à publier.', route: '/couverture-kdp', icon: ImageIcon, category: 'visuel', badge: 'Populaire', image: IMG.visuel },
  { id: 'bd-studio', label: 'BD Studio', description: 'Créez des bandes dessinées et albums illustrés.', route: '/bd-studio', icon: PenTool, category: 'visuel', image: IMG.visuel },
  { id: 'generateur-posts', label: 'Générateur de posts', description: 'Visuels réseaux sociaux prêts à publier.', route: '/generateur-posts', icon: ImageIcon, category: 'visuel', image: IMG.visuel },

  // — Audio & Vidéo —
  { id: 'audiobook', label: 'Audiobook Studio', description: 'Transformez votre livre en livre audio.', route: '/audiobook', icon: Headphones, category: 'audio', badge: 'Populaire', image: IMG.audio },
  { id: 'audiobook-demo', label: 'Démo Audiobook', description: 'Écoutez un extrait audio de démonstration.', route: '/audiobook-demo', icon: Headphones, category: 'audio', image: IMG.audio },
  { id: 'formation-audio', label: 'Formation Audio', description: 'Podcasts et cours audio de formation.', route: '/formation-audio', icon: Mic, category: 'audio', image: IMG.audio },
  { id: 'formation-series-audio', label: 'Séries Audio', description: 'Écoutez les séries de formation en audio.', route: '/formation-series-audio', icon: Mic, category: 'audio', image: IMG.audio },
  { id: 'checklist-tournage', label: 'Checklist tournage', description: 'Préparer et tourner vos vidéos auteur.', route: '/checklist-tournage', icon: Video, category: 'audio', image: IMG.audio },

  // — Amazon KDP —
  { id: 'kdp-keywords', label: 'KDP Keywords', description: 'Recherche de mots-clés Amazon KDP à fort volume — gratuit pour tout le monde.', route: '/kdp-keywords', icon: Search, category: 'kdp', badge: 'Gratuit', image: IMG.kdp },
  { id: 'niches', label: 'Niches Amazon', description: 'Explorez les niches KDP qui vendent aujourd\'hui.', route: '/niches', icon: Target, category: 'kdp', image: IMG.kdp },
  { id: 'niches-600', label: '600 Niches', description: 'Base élargie de 600 niches Amazon analysées.', route: '/niches-600', icon: Layers, category: 'kdp', badge: 'Nouveau', image: IMG.kdp },
  { id: 'series-tomes', label: 'Séries & Tomes', description: 'Planifiez vos séries multi-tomes sur Amazon.', route: '/series-tomes', icon: BookOpen, category: 'kdp', image: IMG.kdp },
  { id: 'word-count', label: 'Compteur de mots KDP', description: 'Objectifs pages/mots par format Amazon KDP.', route: '/word-count', icon: BarChart3, category: 'kdp', image: IMG.kdp },
  { id: 'kdp-ads-guide', label: 'Guide KDP Ads', description: 'Lancez vos campagnes publicitaires KDP.', route: '/kdp-ads-guide', icon: TrendingUp, category: 'kdp', image: IMG.kdp },
  { id: 'kdp-etranger', label: 'KDP à l\'étranger', description: 'Publier sur les marchés Amazon internationaux.', route: '/creer-ebook-kdp-etranger', icon: Globe, category: 'kdp', image: IMG.kdp },
  { id: 'guide-kdp-enfants', label: 'Guide KDP Enfants', description: 'Livres jeunesse Amazon KDP : format & pièges.', route: '/guide-kdp-enfants', icon: BookOpen, category: 'kdp', image: IMG.kdp },
  { id: 'publication-pro', label: 'Publication Pro', description: 'Checklist complète avant publication.', route: '/publication-pro', icon: Rocket, category: 'kdp', badge: 'Pro', image: IMG.kdp },

  // — Analyse & Audit —
  { id: 'audit-pilot', label: 'Audit Pilot', description: 'Audit complet de votre manuscrit avant publication.', route: '/audit-pilot', icon: BarChart3, category: 'analyse', image: IMG.analyse },
  { id: 'correcteur-livre', label: 'Corriger mon livre', description: 'Importez un manuscrit terminé : correction intégrale chapitre par chapitre, relecture et export KDP.', route: '/v3/corriger', icon: Wand2, category: 'analyse', badge: 'Nouveau', image: IMG.analyse },
  { id: 'bookperfect', label: 'BookPerfect AI', description: 'Correction et polissage IA de votre manuscrit.', route: '/bookperfect', icon: Sparkles, category: 'analyse', badge: 'Populaire', image: IMG.analyse },

  { id: 'resultat-5min', label: 'Résultat en 5 min', description: 'Diagnostic express de votre projet livre.', route: '/resultat-en-5-min', icon: Zap, category: 'analyse', image: IMG.analyse },
  { id: 'fiches-pratiques', label: 'Fiches pratiques', description: 'Modèles et fiches méthodologiques.', route: '/fiches-pratiques', icon: FileText, category: 'analyse', image: IMG.analyse },

  // — Marketing & Vente —
  { id: 'plan-marketing', label: 'Plan marketing', description: 'Plan de lancement 30 jours pour votre livre.', route: '/plan-marketing', icon: LineChart, category: 'marketing', image: IMG.marketing },
  { id: 'campagne-vente', label: 'Campagne de vente', description: 'Campagne complète pour vendre votre livre.', route: '/campagne-vente', icon: Megaphone, category: 'marketing', image: IMG.marketing },
  { id: 'apercu-emails', label: 'Aperçu des emails', description: 'Bibliothèque de séquences email prêtes.', route: '/apercu-emails', icon: Mail, category: 'marketing', image: IMG.marketing },
  { id: 'emails-onboarding', label: 'Emails onboarding', description: 'Séquence de bienvenue pour vos lecteurs.', route: '/emails-onboarding', icon: Mail, category: 'marketing', image: IMG.marketing },
  { id: 'dashboard-marketing', label: 'Dashboard marketing', description: 'Suivez vos KPI marketing en un coup d\'œil.', route: '/dashboard-marketing', icon: BarChart3, category: 'marketing', image: IMG.marketing },
  { id: 'affiliation', label: 'Affiliation', description: 'Programme d\'affiliation Ebookstudio.', route: '/affiliation', icon: HeartHandshake, category: 'marketing', image: IMG.marketing },
  { id: 'parrainage', label: 'Parrainage', description: 'Invitez vos amis, gagnez des crédits.', route: '/parrainage', icon: Gift, category: 'marketing', image: IMG.marketing },
  { id: 'carte-cadeau', label: 'Carte cadeau', description: 'Offrez Ebookstudio à un proche.', route: '/carte-cadeau', icon: Gift, category: 'marketing', image: IMG.marketing },

  // — Business & Pro —
  { id: 'business-center', label: 'Business Center', description: 'Pilotez votre activité d\'auteur.', route: '/business-center', icon: Briefcase, category: 'business', badge: 'Pro', image: IMG.business },
  { id: 'crm', label: 'CRM auteurs', description: 'Gérez vos contacts et prospects.', route: '/crm', icon: Users, category: 'business', image: IMG.business },
  { id: 'gestion-prospects', label: 'Gestion prospects', description: 'Segmentation et relances automatiques.', route: '/gestion-prospects', icon: Users, category: 'business', image: IMG.business },
  { id: 'coaching-vip', label: 'Coaching VIP', description: 'Sessions coaching 1:1 avec un expert.', route: '/coaching-vip', icon: Award, category: 'business', badge: 'Pro', image: IMG.business },
  { id: 'influenceurs', label: 'Influenceurs', description: 'Base d\'influenceurs à contacter.', route: '/influenceurs', icon: TrendingUp, category: 'business', image: IMG.business },
  { id: 'communaute', label: 'Communauté', description: 'Rejoignez la communauté des auteurs.', route: '/communaute', icon: Users, category: 'business', image: IMG.business },
  { id: 'extension-chrome', label: 'Extension Chrome', description: 'Extension navigateur pour Ebookstudio.', route: '/extension-chrome', icon: Boxes, category: 'business', image: IMG.business },

  // — Mon espace V3 —
  { id: 'v3-home', label: 'Accueil V3', description: 'Page d\'accueil publique V3.', route: '/v3', icon: Home, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'v3-hub', label: 'Hub V3', description: 'Tableau de bord + brouillons.', route: '/v3/hub', icon: Wand2, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'v3-library', label: 'Mes projets', description: 'Tous vos livres sauvegardés.', route: '/v3/library', icon: FolderOpen, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'v3-mes-livres', label: 'Gestion livres', description: 'Manager avancé de vos livres.', route: '/v3/mes-livres', icon: BookOpen, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'v3-gallery', label: 'Galerie publique', description: 'Livres publiés par la communauté.', route: '/v3/gallery', icon: Star, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'v3-auteur', label: 'Profil auteur', description: 'Configurer votre page auteur.', route: '/v3/auteur', icon: Users, category: 'espace', badge: 'V3', image: IMG.espace },
  { id: 'dashboard', label: 'Tableau de bord', description: 'Vue d\'ensemble de vos projets.', route: '/dashboard', icon: LineChart, category: 'espace', image: IMG.espace },
  { id: 'espace', label: 'Espace abonné', description: 'Accès à votre espace personnel.', route: '/espace', icon: ShieldCheck, category: 'espace', image: IMG.espace },
  { id: 'subscription', label: 'Mon abonnement', description: 'Gérer votre plan et facturation.', route: '/subscription', icon: ShieldCheck, category: 'espace', image: IMG.espace },

  // — Formation & Guides —
  { id: 'formation', label: 'Formation vidéo', description: 'Cours vidéo complet Ebookstudio.', route: '/formation', icon: GraduationCap, category: 'formation', image: IMG.formation },
  { id: 'formation-videos', label: 'Bibliothèque vidéo', description: 'Toutes les vidéos de formation.', route: '/formation-videos', icon: Youtube, category: 'formation', image: IMG.formation },
  { id: 'formation-series', label: 'Séries de formation', description: 'Formations en séries structurées.', route: '/formation-series', icon: GitBranch, category: 'formation', image: IMG.formation },
  { id: 'masterclass', label: 'Masterclass', description: '5 modules avancés (5h de formation).', route: '/masterclass', icon: GraduationCap, category: 'formation', badge: 'Pro', image: IMG.formation },
  { id: 'webinaire', label: 'Webinaire', description: 'Prochains webinaires en direct.', route: '/webinaire', icon: Video, category: 'formation', image: IMG.formation },
  { id: 'tutoriels', label: 'Tutoriels', description: 'Tutoriels pas-à-pas.', route: '/tutoriels', icon: ClipboardList, category: 'formation', image: IMG.formation },
  { id: 'guide-ebook', label: 'Guide Ebook', description: 'Guide complet de l\'auteur.', route: '/guide-ebook', icon: ScrollText, category: 'formation', image: IMG.formation },
  { id: 'guide-outils', label: 'Guide des outils', description: 'Prise en main de tous les outils.', route: '/guide-outils', icon: Compass, category: 'formation', image: IMG.formation },
  { id: 'guide-brevo', label: 'Guide automatisation Brevo', description: 'Automatiser vos emails avec Brevo.', route: '/guide-automatisation-brevo', icon: Mail, category: 'formation', image: IMG.formation },
  { id: 'blog', label: 'Guides & Blog', description: 'Tous les guides publiés.', route: '/blog', icon: FileText, category: 'formation', image: IMG.formation },
  { id: 'faq', label: 'FAQ', description: 'Questions fréquentes.', route: '/faq', icon: MessageSquare, category: 'formation', image: IMG.formation },
];
