import jeunesse from '@/assets/booksite/jeunesse.jpg';
import thriller from '@/assets/booksite/thriller.jpg';
import romance from '@/assets/booksite/romance.jpg';
import policier from '@/assets/booksite/policier.jpg';
import western from '@/assets/booksite/western.jpg';
import fantasy from '@/assets/booksite/fantasy.jpg';
import sf from '@/assets/booksite/sf.jpg';
import horreur from '@/assets/booksite/horreur.jpg';
import aventure from '@/assets/booksite/aventure.jpg';
import historique from '@/assets/booksite/historique.jpg';
import bienetre from '@/assets/booksite/bienetre.jpg';
import guide from '@/assets/booksite/guide.jpg';
import type { BookSiteTheme } from './themes';

export const BOOK_SITE_BACKGROUNDS: Record<BookSiteTheme, string> = {
  jeunesse, sombre: thriller, doux: romance, policier, western, fantasy, sf, horreur, aventure, litteraire: historique, bienetre, clair: guide,
};
