import { Facebook, Linkedin, Instagram, Twitter, Share2, Users, Hash } from 'lucide-react';

export type Platform = 'facebook-group' | 'facebook-page' | 'linkedin' | 'instagram' | 'twitter' | 'tiktok' | 'pinterest';
export type LaunchPhase = 'teaser' | 'launch-day' | 'social-proof' | 'promo' | 'storytelling';

export interface GeneratedPost {
  platform: Platform;
  phase: LaunchPhase;
  content: string;
  hashtags: string[];
  visualTip: string;
}

export const PLATFORMS: { id: Platform; label: string; icon: React.ElementType; color: string; maxChars: number }[] = [
  { id: 'facebook-group', label: 'Groupes Facebook', icon: Users, color: 'from-blue-600 to-blue-500', maxChars: 2000 },
  { id: 'facebook-page', label: 'Page Facebook', icon: Facebook, color: 'from-blue-700 to-blue-600', maxChars: 2000 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-sky-700 to-sky-600', maxChars: 3000 },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-600 to-purple-600', maxChars: 2200 },
  { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'from-zinc-800 to-zinc-700', maxChars: 280 },
  { id: 'tiktok', label: 'TikTok', icon: Share2, color: 'from-zinc-900 to-pink-600', maxChars: 2200 },
  { id: 'pinterest', label: 'Pinterest', icon: Hash, color: 'from-red-600 to-red-500', maxChars: 500 },
];

export const PHASES: { id: LaunchPhase; label: string; emoji: string; description: string }[] = [
  { id: 'teaser', label: 'Teaser (J-7 à J-1)', emoji: '🔮', description: 'Créer l\'attente et la curiosité' },
  { id: 'launch-day', label: 'Jour de lancement', emoji: '🚀', description: 'Annonce officielle avec lien' },
  { id: 'social-proof', label: 'Preuve sociale', emoji: '⭐', description: 'Partager reviews et témoignages' },
  { id: 'promo', label: 'Promotion', emoji: '🎁', description: 'Offres spéciales et urgence' },
  { id: 'storytelling', label: 'Storytelling', emoji: '📖', description: 'L\'histoire derrière le livre' },
];
