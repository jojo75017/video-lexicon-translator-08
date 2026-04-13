import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, ArrowRight, Sparkles, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { bestSellers2026, bestSellerCategories } from '@/data/bestSellers2026';
import { useNavigate } from 'react-router-dom';

const BestSellersTab = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeFilter === 'all'
    ? bestSellers2026
    : bestSellers2026.filter(b => b.category === activeFilter);

  const handleUseNiche = (title: string) => {
    navigate(`/ebook-planner?niche=${encodeURIComponent(title)}&category=${encodeURIComponent('Best-Sellers 2026')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header premium */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 py-6 px-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-yellow-500/10 border-2 border-amber-500/20"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-bold mx-auto">
          <Gift className="w-4 h-4" />
          CADEAU EXCLUSIF 2026
          <Crown className="w-4 h-4" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
          🏆 30 Best-Sellers à Écrire en 2026
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Titres, sous-titres et préfaces prêts à l'emploi — Chaque concept a été analysé pour son potentiel commercial sur Amazon KDP.
        </p>
      </motion.div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          size="sm"
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveFilter('all')}
          className="text-xs"
        >
          🌟 Tous ({bestSellers2026.length})
        </Button>
        {bestSellerCategories.map(cat => {
          const count = bestSellers2026.filter(b => b.category === cat.key).length;
          return (
            <Button
              key={cat.key}
              size="sm"
              variant={activeFilter === cat.key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(cat.key)}
              className="text-xs"
            >
              {cat.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Best-sellers grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((book, index) => {
            const catInfo = bestSellerCategories.find(c => c.key === book.category);
            const isExpanded = expandedId === book.id;

            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="overflow-hidden border-2 hover:border-amber-500/40 transition-all group h-full">
                  {/* Header coloré */}
                  <CardHeader className={`bg-gradient-to-r ${catInfo?.color || 'from-gray-500 to-gray-600'} text-white py-3 px-4`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-lg">{book.icon}</span>
                          <CardTitle className="text-base font-bold leading-tight">
                            {book.title}
                          </CardTitle>
                          {book.trending && (
                            <Badge className="bg-yellow-400 text-black text-[9px] px-1.5 py-0 shrink-0">
                              <Sparkles className="w-3 h-3 mr-0.5" />
                              TREND
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground/80 text-xs font-medium">
                          {book.subtitle}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white text-[10px] shrink-0">
                        #{book.id}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    {/* Préface tronquée / expandable */}
                    <div>
                      <p className={`text-sm text-muted-foreground leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {book.preface}
                      </p>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : book.id)}
                        className="text-xs text-primary font-medium mt-1 flex items-center gap-1 hover:underline"
                      >
                        {isExpanded ? (
                          <>Réduire <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Lire la préface complète <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    </div>

                    {/* CTA */}
                    <Button
                      size="sm"
                      onClick={() => handleUseNiche(book.title)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Utiliser ce concept
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BestSellersTab;
