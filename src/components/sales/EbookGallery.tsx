import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, TrendingUp, BookOpen, Tag, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import coverBusiness from '@/assets/mockups/cover-business.jpg';
import coverFiction from '@/assets/mockups/cover-fiction.jpg';
import coverSelfhelp from '@/assets/mockups/cover-selfhelp.jpg';
import coverCooking from '@/assets/mockups/cover-cooking.jpg';
import coverRomance from '@/assets/mockups/cover-romance.jpg';
import coverKids from '@/assets/mockups/cover-kids.jpg';

interface EbookEntry {
  cover: string;
  title: string;
  author: string;
  category: string;
  bsr: string;
  monthlyRevenue: string;
  description: string;
  keywords: string[];
  rating: number;
  reviews: number;
}

const EBOOKS: EbookEntry[] = [
  {
    cover: coverBusiness,
    title: 'Maîtriser l\'IA',
    author: 'Antoine V.',
    category: 'Business',
    bsr: '#2 847',
    monthlyRevenue: '1 240 €',
    description: 'Le guide pratique 2026 pour intégrer l\'IA dans votre activité d\'entrepreneur. 200 pages d\'exemples concrets.',
    keywords: ['intelligence artificielle', 'business 2026', 'entrepreneur', 'productivité IA', 'ChatGPT business', 'automatisation', 'guide pratique'],
    rating: 4.7,
    reviews: 128,
  },
  {
    cover: coverFiction,
    title: 'L\'Ombre du passé',
    author: 'Claire M.',
    category: 'Thriller',
    bsr: '#5 102',
    monthlyRevenue: '890 €',
    description: 'Un thriller psychologique haletant. Quand son passé refait surface, Léa comprend qu\'elle n\'était pas seule.',
    keywords: ['thriller français', 'roman policier', 'suspense', 'thriller psychologique', 'enquête', 'mystère', 'roman noir'],
    rating: 4.6,
    reviews: 87,
  },
  {
    cover: coverSelfhelp,
    title: 'L\'art de ne rien forcer',
    author: 'Julien P.',
    category: 'Développement perso',
    bsr: '#3 410',
    monthlyRevenue: '1 580 €',
    description: '7 clés pour vivre en harmonie avec soi-même et les autres. Une méthode douce inspirée du bouddhisme.',
    keywords: ['développement personnel', 'bien-être', 'méditation', 'bouddhisme', 'pleine conscience', 'harmonie', 'sérénité'],
    rating: 4.9,
    reviews: 214,
  },
  {
    cover: coverCooking,
    title: 'Cuisine méditerranéenne',
    author: 'Sophie L.',
    category: 'Cuisine',
    bsr: '#8 924',
    monthlyRevenue: '620 €',
    description: '80 recettes du sud — Italie, Grèce, Espagne, Provence. Photos pas-à-pas et conseils nutrition.',
    keywords: ['cuisine méditerranéenne', 'recettes faciles', 'cuisine italienne', 'régime méditerranéen', 'recettes santé', 'cuisine du sud', 'plats provençaux'],
    rating: 4.8,
    reviews: 156,
  },
  {
    cover: coverRomance,
    title: 'Un été à Marseille',
    author: 'Marie D.',
    category: 'Romance',
    bsr: '#4 256',
    monthlyRevenue: '980 €',
    description: 'Une romance estivale dans la cité phocéenne. Quand Léa rencontre Antoine, tout bascule en un instant.',
    keywords: ['romance française', 'romance estivale', 'love story', 'roman sentimental', 'romance feel-good', 'Marseille', 'été'],
    rating: 4.5,
    reviews: 92,
  },
  {
    cover: coverKids,
    title: 'Les aventures de Léo',
    author: 'Pierre J.',
    category: 'Jeunesse',
    bsr: '#6 831',
    monthlyRevenue: '720 €',
    description: 'Léo, jeune explorateur, part à la découverte du monde. Un livre illustré pour les 5-8 ans.',
    keywords: ['livre enfant', 'aventure jeunesse', 'livre illustré', 'enfant 5 ans', 'lecture enfant', 'histoire du soir', 'livre éducatif'],
    rating: 4.9,
    reviews: 73,
  },
];

const EbookGallery: React.FC = () => {
  const [selected, setSelected] = useState<EbookEntry | null>(null);
  const navigate = useNavigate();

  return (
    <section id="galerie" className="py-20 px-4 bg-background scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="bg-kdp-orange/10 text-kdp-orange border-kdp-orange/30 px-4 py-2 mb-4">
            <Award className="w-4 h-4 mr-2" />
            VITRINE DES RÉSULTATS
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Voyez ce que <span className="text-primary">vous allez créer</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Chaque ebook ci-dessous a été créé avec EbookStudio. Cliquez pour voir la fiche complète :
            description, mots-clés KDP et stats Amazon.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {EBOOKS.map((book, i) => (
            <motion.button
              key={book.title}
              type="button"
              onClick={() => setSelected(book)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative text-left"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl shadow-foreground/10 ring-1 ring-border group-hover:ring-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all">
                <img
                  src={book.cover}
                  alt={`Couverture ebook ${book.title}`}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <span className="text-white text-xs font-bold bg-primary/90 px-3 py-1 rounded-full">
                    Voir la fiche →
                  </span>
                </div>
                <Badge className="absolute top-2 left-2 bg-kdp-orange text-foreground border-0 text-[10px] font-bold">
                  {book.bsr}
                </Badge>
              </div>
              <div className="mt-3 px-1">
                <p className="text-xs text-muted-foreground">{book.category}</p>
                <p className="font-bold text-sm text-foreground line-clamp-1">{book.title}</p>
                <p className="text-xs text-primary font-bold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {book.monthlyRevenue} / mois
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-5 text-sm">
            6 niches couvertes — la plateforme s'adapte à <span className="text-foreground font-semibold">tous les genres</span>
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Créer mon ebook — 67€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Modal détail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-2">
                <img
                  src={selected.cover}
                  alt={selected.title}
                  className="w-full rounded-xl shadow-lg ring-1 ring-border"
                />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{selected.category}</Badge>
                    <Badge className="bg-kdp-orange/10 text-kdp-orange border-kdp-orange/30">
                      BSR {selected.bsr}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      {selected.monthlyRevenue} / mois
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">par {selected.author}</p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(selected.rating)
                            ? 'fill-kdp-orange text-kdp-orange'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-bold ml-1">{selected.rating}</span>
                    <span className="text-xs text-muted-foreground">({selected.reviews} avis)</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Description KDP
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selected.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold mb-1.5 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      7 mots-clés backend (générés par l'IA)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.keywords.map((k) => (
                        <Badge
                          key={k}
                          variant="outline"
                          className="text-[10px] font-mono border-primary/30 text-foreground/70"
                        >
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/upsell-paiement?plan=pro')}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl"
                  >
                    Créer un ebook comme celui-ci — 67€
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EbookGallery;
