import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, BarChart3, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie M.",
    avatar: "SM",
    quote: "Mon premier ebook généré en 40 min. 3 semaines plus tard : BSR #2 400 en développement personnel. Je n'y croyais pas.",
    bsr: "#2 400",
    revenue: "320€/mois",
    category: "Développement Personnel",
    books: 4,
  },
  {
    name: "Thomas R.",
    avatar: "TR",
    quote: "J'ai publié 8 ebooks en 2 mois avec EbookStudio. L'audiobook intégré m'a fait gagner 40% de ventes en plus sur ACX.",
    bsr: "#1 850",
    revenue: "580€/mois",
    category: "Business & Finances",
    books: 8,
  },
  {
    name: "Marie L.",
    avatar: "ML",
    quote: "Les couvertures IA sont bluffantes. Mon livre pour enfants est monté à BSR #900 en 10 jours. Merci Georges !",
    bsr: "#900",
    revenue: "450€/mois",
    category: "Livres pour Enfants",
    books: 3,
  },
];

const KdpTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Résultats <span className="text-primary">réels</span> de nos utilisateurs
          </h2>
          <p className="text-muted-foreground text-lg">
            Des auteurs KDP qui génèrent des revenus passifs grâce à EbookStudio Pro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

              {/* Quote */}
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-primary/5 rounded-xl p-3 text-center">
                  <BarChart3 className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">BSR</p>
                  <p className="text-sm font-bold text-foreground">{t.bsr}</p>
                </div>
                <div className="bg-primary/5 rounded-xl p-3 text-center">
                  <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Revenus</p>
                  <p className="text-sm font-bold text-foreground">{t.revenue}</p>
                </div>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.books} ebooks · {t.category}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KdpTestimonials;