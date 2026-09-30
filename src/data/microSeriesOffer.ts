import { Captions, Clapperboard, FileDown, Smartphone, WandSparkles } from 'lucide-react';

export const MICRO_SERIES_OFFER = {
  title: 'Studio Micro-Séries IA',
  price: 67,
  referencePrice: 197,
  stripePackId: 'micro_series' as const,
  moduleKey: 'micro-series',
  route: '/v3/offre-micro-series',
  steps: [
    { icon: Clapperboard, number: '01', title: 'Choisissez votre livre', description: 'Partez d’un livre de votre bibliothèque ou d’un extrait déjà rédigé.' },
    { icon: Smartphone, number: '02', title: 'Composez la série', description: 'Préparez 3, 5 ou 10 épisodes verticaux de 30 à 60 secondes.' },
    { icon: WandSparkles, number: '03', title: 'Obtenez scripts et scènes', description: 'Accroche, voix off, découpage visuel et consignes de tournage pour chaque épisode.' },
    { icon: FileDown, number: '04', title: 'Exportez sans surcoût vidéo', description: 'Récupérez storyboard PDF, texte, sous-titres SRT et tableau CSV prêts à utiliser.' },
  ],
  deliverables: [
    { icon: Clapperboard, label: 'Scripts courts calibrés pour Reels, TikTok et Shorts' },
    { icon: Captions, label: 'Sous-titres SRT synchronisés pour le montage' },
    { icon: Smartphone, label: 'Storyboard vertical scène par scène' },
    { icon: FileDown, label: 'Exports PDF, texte et CSV sans génération vidéo imposée' },
  ],
} as const;