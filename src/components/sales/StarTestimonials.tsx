import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  color: string;
  result?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marie Dubois",
    role: "Auteure Kindle",
    text: "En 2 semaines, j'ai publié 3 ebooks qui me rapportent maintenant 800€/mois en passif. L'outil est incroyablement intuitif !",
    rating: 5,
    avatar: "MD",
    color: "from-pink-500 to-rose-500",
    result: "+800€/mois"
  },
  {
    name: "Thomas Laurent",
    role: "Coach Business",
    text: "J'utilise les ebooks comme lead magnets pour mes formations. Mon taux de conversion a littéralement triplé !",
    rating: 5,
    avatar: "TL",
    color: "from-blue-500 to-cyan-500",
    result: "x3 conversions"
  },
  {
    name: "Sophie Martin",
    role: "Entrepreneur",
    text: "Le support est exceptionnel et les formations intégrées m'ont fait gagner des mois d'apprentissage. Meilleur investissement de l'année.",
    rating: 5,
    avatar: "SM",
    color: "from-purple-500 to-violet-500",
    result: "6 mois gagnés"
  },
  {
    name: "Jean-Pierre Moreau",
    role: "Retraité Actif",
    text: "À 62 ans, je pensais que c'était trop technique pour moi. En fait, c'est plus simple que d'utiliser Word !",
    rating: 5,
    avatar: "JP",
    color: "from-emerald-500 to-teal-500",
    result: "12 ebooks publiés"
  },
  {
    name: "Camille Bernard",
    role: "Formatrice en ligne",
    text: "Les outils KDP m'ont permis de comprendre exactement quelles niches cibler. Résultat : best-seller en 1 mois.",
    rating: 5,
    avatar: "CB",
    color: "from-amber-500 to-orange-500",
    result: "Best-seller KDP"
  }
];

const StarTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-2">Ils ont transformé leur vie</h2>
          <p className="text-muted-foreground">
            Note moyenne : <span className="font-bold text-foreground">4.9/5</span> basée sur 847 avis
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Avatar & Info */}
                  <div className="text-center md:text-left shrink-0">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${current.color} flex items-center justify-center text-foreground text-2xl font-bold shadow-lg mx-auto md:mx-0`}>
                      {current.avatar}
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-lg">{current.name}</p>
                      <p className="text-sm text-muted-foreground">{current.role}</p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {current.result && (
                      <div className="mt-3 inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium px-3 py-1 rounded-full">
                        🎯 {current.result}
                      </div>
                    )}
                  </div>

                  {/* Quote */}
                  <div className="flex-1">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <p className="text-xl md:text-2xl text-foreground leading-relaxed italic">
                      "{current.text}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StarTestimonials;
