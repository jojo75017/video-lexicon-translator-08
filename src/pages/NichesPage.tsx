import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Lightbulb, ArrowRight, Sparkles, Heart, Brain, 
  Briefcase, Users, Target, Flame, Star, BookOpen,
  TrendingUp, DollarSign, GraduationCap, Palette, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ebookThemes } from '@/data/ebookIdeas';

const categoryIcons: Record<string, any> = {
  'Santé et bien-être': Heart,
  'Finances personnelles': DollarSign,
  'Relations et rencontres': Users,
  'Développement personnel': Brain,
  'Spiritualité': Sparkles,
  'Business & Carrière': Briefcase,
  'Parentalité et famille': Users,
  'Loisirs et compétences': Palette,
  'Romans & Fiction Populaires': BookOpen,
  'Romance': Heart,
  'Livres pour Enfants': Star,
  'Développement Personnel': Brain,
  'Business & Entrepreneuriat': Briefcase,
  'Santé & Bien-être': Heart,
  'Cuisine & Gastronomie': Flame,
  'Technologie & Gadgets': Zap,
  'Voyages & Aventure': Target,
  'Animaux de compagnie': Heart,
  'Parentalité & Éducation': Users,
  'Finance & Investissement': TrendingUp,
  'Mode & Style': Sparkles,
};

const categoryColors: Record<string, string> = {
  'Santé et bien-être': 'from-emerald-500 to-green-600',
  'Finances personnelles': 'from-amber-500 to-orange-600',
  'Relations et rencontres': 'from-pink-500 to-rose-600',
  'Développement personnel': 'from-violet-500 to-purple-600',
  'Spiritualité': 'from-indigo-500 to-blue-600',
  'Business & Carrière': 'from-blue-500 to-cyan-600',
  'Parentalité et famille': 'from-lime-500 to-green-600',
  'Loisirs et compétences': 'from-teal-500 to-cyan-600',
};

const NichesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Get all unique categories from ebookThemes
  const allCategories = useMemo(() => {
    return ebookThemes.map(theme => theme.category);
  }, []);

  // Filter ideas based on search
  const filteredThemes = useMemo(() => {
    return ebookThemes.map(theme => ({
      ...theme,
      ideas: theme.ideas.filter(idea => 
        idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(theme => 
      activeCategory === 'all' || theme.category === activeCategory
    ).filter(theme => theme.ideas.length > 0 || searchQuery === '');
  }, [searchQuery, activeCategory]);

  // Handle using a niche
  const handleUseNiche = (niche: string, category: string) => {
    // Navigate to ebook-planner with the niche as title
    navigate(`/ebook-planner?niche=${encodeURIComponent(niche)}&category=${encodeURIComponent(category)}`);
  };

  const totalNiches = ebookThemes.reduce((acc, theme) => acc + theme.ideas.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-2xl">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Bibliothèque de Niches
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Plus de <span className="font-bold text-primary">{totalNiches}</span> idées de niches rentables pour créer votre ebook. 
            Cliquez sur "Utiliser" pour pré-remplir automatiquement votre projet.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une niche (ex: perdre du poids, marketing, yoga...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg rounded-xl border-2 focus:border-primary"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Effacer
            </Button>
          )}
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl gap-1 min-w-max">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                🌟 Toutes ({totalNiches})
              </TabsTrigger>
              {allCategories.map((category) => {
                const Icon = categoryIcons[category] || Lightbulb;
                const theme = ebookThemes.find(t => t.category === category);
                return (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    className="px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.split(' ')[0]} ({theme?.ideas.length || 0})
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Content */}
          <TabsContent value={activeCategory} className="mt-6">
            <div className="grid gap-6">
              {filteredThemes.map((theme, themeIndex) => {
                const Icon = categoryIcons[theme.category] || Lightbulb;
                const color = categoryColors[theme.category] || theme.gradient || 'from-gray-500 to-gray-600';
                
                return (
                  <motion.div
                    key={theme.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: themeIndex * 0.05 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all">
                      <CardHeader className={`bg-gradient-to-r ${color} text-white`}>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className="w-6 h-6" />
                          <span>{theme.category}</span>
                          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                            {theme.ideas.length} niches
                          </Badge>
                          {theme.badge && (
                            <Badge variant="outline" className="border-white/50 text-white">
                              {theme.badge}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {theme.ideas.map((idea, ideaIndex) => (
                            <motion.div
                              key={ideaIndex}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: ideaIndex * 0.02 }}
                              className="group flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all border border-transparent hover:border-primary/20"
                            >
                              <span className="text-sm font-medium flex-1 pr-2 line-clamp-2">
                                {idea}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUseNiche(idea, theme.category)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredThemes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune niche trouvée</h3>
                <p className="text-muted-foreground">
                  Essayez avec d'autres mots-clés ou explorez toutes les catégories
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-4"
                >
                  Voir toutes les niches
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-primary">{allCategories.length}</div>
            <div className="text-sm text-muted-foreground">Catégories</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-primary">{totalNiches}</div>
            <div className="text-sm text-muted-foreground">Niches</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-emerald-500">100%</div>
            <div className="text-sm text-muted-foreground">Rentables</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-amber-500">1 clic</div>
            <div className="text-sm text-muted-foreground">Pour démarrer</div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NichesPage;
