// Kit de publication réseaux sociaux — campagne « Accès à vie 47 € » (jusqu'au 30/09/2026).
// Chaque post a son visuel prêt à télécharger. Aucun contenu inventé sur les résultats clients.

import fb01 from '@/assets/social/fb-01-sommaire.jpg';
import fb02 from '@/assets/social/fb-02-livres.jpg';
import fb03 from '@/assets/social/fb-03-correction.jpg';
import fb04 from '@/assets/social/fb-04-couverture.jpg';
import fb05 from '@/assets/social/fb-05-liseuse.jpg';
import fb06 from '@/assets/social/fb-06-autrice.jpg';
import fb07 from '@/assets/social/fb-07-jeunesse.jpg';
import fb08 from '@/assets/social/fb-08-ventes.jpg';
import fb09 from '@/assets/social/fb-09-soir.jpg';
import fb10 from '@/assets/social/fb-10-echeance.jpg';
import pin01 from '@/assets/social/pin-01-sommaire.jpg';
import pin02 from '@/assets/social/pin-02-kdp.jpg';
import pin03 from '@/assets/social/pin-03-couverture.jpg';
import pin04 from '@/assets/social/pin-04-chapitres.jpg';
import pin05 from '@/assets/social/pin-05-jeunesse.jpg';

export const DEMO_URL = 'https://ebookstudio.fr/demo';
export const OFFER_URL = 'https://ebookstudio.fr/commander';

export function withUtm(url: string, source: string, campaign: string) {
  const u = new URL(url);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'social');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}

export interface SocialPost {
  id: string;
  goal: string;
  image: string;
  imageFile: string;
  text: string;
  link: string;
}

export interface PinterestPin {
  id: string;
  image: string;
  imageFile: string;
  board: string;
  title: string;
  description: string;
  link: string;
}

const FB = (n: string) => withUtm(DEMO_URL, 'facebook', `demo-genie-${n}`);
const PIN = (n: string) => withUtm(DEMO_URL, 'pinterest', `pin-${n}`);

export const FACEBOOK_POSTS: SocialPost[] = [
  {
    id: 'fb-01',
    goal: 'Démonstration — le sommaire en 2 minutes',
    image: fb01,
    imageFile: 'fb-01-sommaire.jpg',
    text: `Vous avez une idée de livre, mais vous bloquez sur le plan ?

Décrivez votre idée en une phrase. En moins de deux minutes, vous repartez avec un titre, un sous-titre et un sommaire chapitre par chapitre — de quoi savoir enfin quoi écrire.

C'est gratuit, sans inscription pour commencer : ${FB('01')}`,
    link: FB('01'),
  },
  {
    id: 'fb-02',
    goal: 'Preuve produit — du plan au livre imprimé',
    image: fb02,
    imageFile: 'fb-02-livres.jpg',
    text: `Un livre publié, ce n'est pas seulement du texte : c'est un plan tenu, une mise en page propre, une couverture nette et un fichier accepté par Amazon KDP.

Ebookstudio fait la chaîne complète : sommaire, rédaction chapitre par chapitre, correction, export Word/PDF prêt pour KDP et couverture.

Testez sur votre idée : ${FB('02')}`,
    link: FB('02'),
  },
  {
    id: 'fb-03',
    goal: 'Douleur — le manuscrit qui dort dans un tiroir',
    image: fb03,
    imageFile: 'fb-03-correction.jpg',
    text: `Vous avez un manuscrit terminé mais jamais publié, parce que la relecture vous fait peur ?

Importez votre document : il est corrigé chapitre par chapitre, et vous gardez la main — chaque correction peut être acceptée ou refusée, mot par mot.

Voir comment ça marche : ${FB('03')}`,
    link: FB('03'),
  },
  {
    id: 'fb-04',
    goal: 'Couverture — objection « je ne suis pas graphiste »',
    image: fb04,
    imageFile: 'fb-04-couverture.jpg',
    text: `« Je n'y connais rien en graphisme. » C'est la phrase qui bloque le plus d'auteurs.

Cover Studio Pro calcule la tranche selon votre nombre de pages, place la 4e de couverture et exporte en 300 DPI aux dimensions exigées par KDP. Vous choisissez un modèle, vous ajustez le titre, c'est tout.

Essayez : ${FB('04')}`,
    link: FB('04'),
  },
  {
    id: 'fb-05',
    goal: 'Format ebook — audience Kindle',
    image: fb05,
    imageFile: 'fb-05-liseuse.jpg',
    text: `Ebook, broché, ou les deux ? Beaucoup d'auteurs perdent des semaines sur cette question.

Le même projet sort en fichier Kindle propre et en PDF broché, avec une table des matières cliquable et des chapitres correctement découpés.

Faites l'essai avec votre idée : ${FB('05')}`,
    link: FB('05'),
  },
  {
    id: 'fb-06',
    goal: 'Rassurance — « je n\'y connais rien »',
    image: fb06,
    imageFile: 'fb-06-autrice.jpg',
    text: `On me demande souvent : « Faut-il être écrivain pour utiliser Ebookstudio ? »

Non. Il faut avoir quelque chose à transmettre. Le reste — le plan, la structure, la mise en forme, le fichier KDP — c'est l'outil qui s'en occupe, et vous validez à chaque étape.

Commencez par une phrase : ${FB('06')}`,
    link: FB('06'),
  },
  {
    id: 'fb-07',
    goal: 'Niche jeunesse — livres illustrés',
    image: fb07,
    imageFile: 'fb-07-jeunesse.jpg',
    text: `Les livres illustrés pour les 3-7 ans sont l'une des niches les plus demandées sur Amazon — et l'une des plus difficiles à produire seul.

Ebookstudio génère les histoires et les illustrations cohérentes, au format carré accepté par KDP.

À voir ici : ${FB('07')}`,
    link: FB('07'),
  },
  {
    id: 'fb-08',
    goal: 'Étude de marché — niches et mots-clés',
    image: fb08,
    imageFile: 'fb-08-ventes.jpg',
    text: `Publier sans étudier la demande, c'est écrire pour personne.

Avant d'écrire une ligne, vous pouvez analyser la niche, les mots-clés Amazon et les catégories où votre livre a une vraie place.

Regardez comment : ${FB('08')}`,
    link: FB('08'),
  },
  {
    id: 'fb-09',
    goal: 'Objection temps — « je n\'ai pas le temps »',
    image: fb09,
    imageFile: 'fb-09-soir.jpg',
    text: `« Je n'ai pas le temps d'écrire un livre. »

La vraie question, c'est le temps perdu à recommencer le plan, à réécrire les mêmes chapitres, à refaire la mise en page. C'est exactement ce que l'outil supprime.

Testez sur votre idée, ce soir : ${FB('09')}`,
    link: FB('09'),
  },
  {
    id: 'fb-10',
    goal: 'Urgence — fin de l\'accès à vie 47 €',
    image: fb10,
    imageFile: 'fb-10-echeance.jpg',
    text: `Information importante pour ceux qui hésitent encore.

L'accès à vie à Ebookstudio est à 47 € jusqu'au 30 septembre 2026. Après cette date, l'accès se fera uniquement par abonnement mensuel ou annuel.

Détail de l'offre : ${withUtm(OFFER_URL, 'facebook', 'demo-genie-10')}`,
    link: withUtm(OFFER_URL, 'facebook', 'demo-genie-10'),
  },
];

export const PINTEREST_PINS: PinterestPin[] = [
  {
    id: 'pin-01',
    image: pin01,
    imageFile: 'pin-01-sommaire.jpg',
    board: 'Écrire un livre',
    title: 'Écrire son livre avec l\'IA : le sommaire en 2 minutes',
    description:
      'Décrivez votre idée de livre en une phrase et obtenez un titre, un sous-titre et un sommaire chapitre par chapitre. Méthode complète pour structurer un livre avant de l\'écrire. #écrireunlivre #autoédition #amazonkdp',
    link: PIN('01'),
  },
  {
    id: 'pin-02',
    image: pin02,
    imageFile: 'pin-02-kdp.jpg',
    board: 'Publier sur Amazon KDP',
    title: 'Publier sur Amazon KDP : le guide pas à pas pour débutants',
    description:
      'Comment publier son premier livre sur Amazon KDP : format, mise en page, table des matières, couverture aux bonnes dimensions et fichier accepté du premier coup. #amazonkdp #autoédition #publierunlivre',
    link: PIN('02'),
  },
  {
    id: 'pin-03',
    image: pin03,
    imageFile: 'pin-03-couverture.jpg',
    board: 'Couvertures de livres',
    title: 'Une couverture de livre professionnelle sans être graphiste',
    description:
      'Modèles de couvertures KDP, calcul automatique de la tranche selon le nombre de pages et export 300 DPI prêt à imprimer. #couverturedelivre #kdp #designdelivre',
    link: PIN('03'),
  },
  {
    id: 'pin-04',
    image: pin04,
    imageFile: 'pin-04-chapitres.jpg',
    board: 'Écrire un livre',
    title: '40 chapitres rédigés pendant que vous dormez',
    description:
      'Un plan validé, puis la rédaction chapitre par chapitre avec mémoire du livre pour garder la cohérence du début à la fin. #écriture #romanenécriture #ia',
    link: PIN('04'),
  },
  {
    id: 'pin-05',
    image: pin05,
    imageFile: 'pin-05-jeunesse.jpg',
    board: 'Livres pour enfants',
    title: 'Livres pour enfants : histoires et illustrations générées',
    description:
      'Créer un album illustré pour les 3-7 ans : histoires courtes, illustrations cohérentes et format carré accepté par Amazon KDP. #livrejeunesse #albumillustré #kdp',
    link: PIN('05'),
  },
];

export const FACEBOOK_COMMENTS: string[] = [
  'Pour la structure, le plus simple est de partir de la promesse du livre : une phrase qui dit ce que le lecteur sait faire à la fin. Tous les chapitres découlent de là.',
  'Sur KDP, la plupart des refus viennent de la couverture : dimensions de tranche fausses ou moins de 300 DPI. Vérifiez ces deux points avant de renvoyer le fichier.',
  'Un conseil qui change tout : validez votre sommaire avant d\'écrire une ligne. C\'est ce qui évite de réécrire trois fois les mêmes chapitres.',
  'Pour une première publication, viser 20 à 30 chapitres courts est plus tenable que 10 chapitres très longs — et la lecture est plus fluide.',
  'Si votre manuscrit est déjà terminé, ne le réécrivez pas : faites-le relire chapitre par chapitre et gardez la main sur chaque correction.',
];

export const GROUP_RULES: { title: string; detail: string }[] = [
  {
    title: 'Un seul lien par publication',
    detail: 'Plusieurs liens dans un même post font chuter la portée et déclenchent les filtres anti-spam des groupes.',
  },
  {
    title: 'Apporter avant de proposer',
    detail: 'Répondez à 3 questions du groupe avant de publier votre propre post dans la semaine.',
  },
  {
    title: 'Pas plus d\'un post par groupe et par semaine',
    detail: 'Alternez les angles (démonstration, correction, couverture) pour ne jamais répéter le même message.',
  },
  {
    title: 'Répondre à tous les commentaires le jour même',
    detail: 'Les commentaires dans la première heure déterminent la diffusion du post.',
  },
];
