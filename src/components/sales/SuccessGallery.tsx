import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, TrendingUp, Eye, ChevronLeft, ChevronRight, 
  Quote, DollarSign, BookOpen, Calendar
} from 'lucide-react';

interface SuccessStory {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  coverUrl: string;
  monthlyRevenue: string;
  salesCount: string;
  rating: number;
  reviews: number;
  publishDate: string;
  testimonial: string;
  niche: string;
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    title: "30 Recettes Healthy en 15 Minutes",
    author: "Marie D.",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Marie&backgroundColor=ec4899",
    category: "Cuisine & Bien-être",
    coverUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=400&fit=crop",
    monthlyRevenue: "847€",
    salesCount: "2,340",
    rating: 4.7,
    reviews: 156,
    publishDate: "Septembre 2024",
    testimonial: "J'ai généré mon livre en une journée avec EbookStudio Pro. Le workflow IA m'a guidée pas à pas !",
    niche: "Recettes rapides"
  },
  {
    id: '2',
    title: "Investir dans l'Immobilier Locatif",
    author: "Thomas B.",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Thomas&backgroundColor=3b82f6",
    category: "Finance & Business",
    coverUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=400&fit=crop",
    monthlyRevenue: "1,230€",
    salesCount: "1,890",
    rating: 4.8,
    reviews: 203,
    publishDate: "Août 2024",
    testimonial: "De 0 à 1000€/mois en 3 mois grâce à l'analyse de niche et aux mots-clés optimisés.",
    niche: "Immobilier"
  },
  {
    id: '3',
    title: "Méditation pour les Débutants",
    author: "Sophie L.",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sophie&backgroundColor=10b981",
    category: "Développement Personnel",
    coverUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=400&fit=crop",
    monthlyRevenue: "623€",
    salesCount: "1,456",
    rating: 4.9,
    reviews: 312,
    publishDate: "Octobre 2024",
    testimonial: "La fonctionnalité de réécriture naturelle a rendu mon livre fluide et authentique.",
    niche: "Bien-être"
  },
  {
    id: '4',
    title: "Le Guide du Potager Bio",
    author: "Pierre M.",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Pierre&backgroundColor=f59e0b",
    category: "Jardinage",
    coverUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=400&fit=crop",
    monthlyRevenue: "456€",
    salesCount: "987",
    rating: 4.6,
    reviews: 89,
    publishDate: "Novembre 2024",
    testimonial: "L'encyclopédie IA m'a permis de créer 50 fiches plantes en quelques heures !",
    niche: "Jardinage bio"
  },
  {
    id: '5',
    title: "Productivité Maximale",
    author: "Lucas R.",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Lucas&backgroundColor=8b5cf6",
    category: "Business & Productivité",
    coverUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=400&fit=crop",
    monthlyRevenue: "1,567€",
    salesCount: "2,890",
    rating: 4.8,
    reviews: 445,
    publishDate: "Juillet 2024",
    testimonial: "Mon 5ème livre avec EbookStudio. Le simulateur Amazon Ads m'a fait économiser des centaines d'euros.",
    niche: "Productivité"
  }
];

interface SuccessGalleryProps {
  variant?: 'carousel' | 'grid';
  limit?: number;
}

const SuccessGallery: React.FC<SuccessGalleryProps> = ({
  variant = 'carousel',
  limit = 5
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const stories = successStories.slice(0, limit);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const renderStoryCard = (story: SuccessStory, index: number) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/80 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          {/* Cover image */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={story.coverUrl} 
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Revenue badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500/90 text-white font-bold px-3 py-1">
                <DollarSign className="w-3 h-3 mr-1" />
                {story.monthlyRevenue}/mois
              </Badge>
            </div>
            
            {/* Title overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <Badge variant="secondary" className="text-xs mb-2">{story.category}</Badge>
              <h3 className="text-white font-bold text-lg line-clamp-2">{story.title}</h3>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Author */}
          <div className="flex items-center gap-3">
            <img 
              src={story.authorAvatar} 
              alt={story.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium text-foreground">{story.author}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {story.publishDate}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{story.rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">{story.reviews} avis</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="font-bold text-primary">{story.salesCount}</div>
              <div className="text-xs text-muted-foreground">ventes</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xs text-muted-foreground">Top 100</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="relative p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Quote className="absolute top-2 left-2 w-4 h-4 text-primary/30" />
            <p className="text-sm text-muted-foreground italic pl-5">
              "{story.testimonial}"
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (variant === 'grid') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-3">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Success Stories
          </Badge>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Ils ont publié avec EbookStudio Pro
          </h2>
          <p className="text-muted-foreground mt-2">
            Découvrez les résultats de nos auteurs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => renderStoryCard(story, index))}
        </div>
      </div>
    );
  }

  // Carousel variant
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-3">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Success Stories
        </Badge>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Ils génèrent des revenus passifs
        </h2>
      </div>

      <div className="relative max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {renderStoryCard(stories[activeIndex], 0)}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'w-6 bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessGallery;
