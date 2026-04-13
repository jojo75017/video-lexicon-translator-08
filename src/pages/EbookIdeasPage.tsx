import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import { 
  ArrowLeft, Search, Star, Trophy, BookOpen, Brain, Briefcase, Heart, 
  Flame, Zap, Target, Fish, Users, BarChart3, Sparkles, Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ebookThemes } from '@/data/ebookIdeas';
import { EbookAiChat } from '@/components/ebook/EbookAiChat';

const EbookIdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredThemes = ebookThemes.filter(theme => {
    const matchesSearch = searchQuery === "" || 
      theme.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.ideas.some(idea => idea.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || theme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const allCategories = ebookThemes.map(t => t.category);
  const totalIdeas = ebookThemes.reduce((sum, theme) => sum + theme.ideas.length, 0);
  const totalCategories = ebookThemes.length;

  const handleGoToPlanner = (title: string) => {
    navigate('/ebook-planner', { state: { suggestedTitle: title } });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section - Magazine Style */}
      <div className="relative overflow-hidden text-white" style={{background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'}}>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <Button 
            onClick={() => navigate('/ebook-planner')} 
            variant="outline" 
            size="sm"
            className="mb-8 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Créer mon ebook
          </Button>

          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              {totalIdeas}+ Idées de<br />Bestsellers à Créer
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-8 font-light">
              Trouvez l'inspiration parfaite pour votre prochain ebook. De la fiction aux guides pratiques, découvrez des titres qui cartonnent.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une idée, un thème..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-2xl"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{totalIdeas}+</div>
              <div className="text-foreground/80 text-sm">Idées disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-foreground/80 text-sm">Ebooks créés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{totalCategories}+</div>
              <div className="text-foreground/80 text-sm">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.9⭐</div>
              <div className="text-foreground/80 text-sm">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              Toutes les catégories
            </Button>
            {allCategories.slice(0, 8).map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                variant={cat === selectedCategory ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat - Premier */}
      <div className="container mx-auto px-6 py-12">
        <EbookAiChat />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <MasonryGrid columns={{ sm: 1, md: 2, lg: 3 }} gap="gap-8">
          {filteredThemes.map((theme, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${theme.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <theme.icon className="h-7 w-7" />
                  </div>
                  <Badge className="bg-white/90 text-navy-deep border-0 font-semibold">
                    {theme.badge}
                  </Badge>
                </div>

                <CardTitle className="text-2xl font-playfair mb-3 group-hover:text-coral-pink transition-colors">
                  {theme.category}
                </CardTitle>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-cool">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{theme.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{theme.potential}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{theme.pages} pages</span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  <strong>{theme.ideas.length}</strong> idées disponibles
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {theme.ideas.map((idea, ideaIndex) => (
                    <Button
                      key={ideaIndex}
                      onClick={() => handleGoToPlanner(idea)}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-gradient-to-r hover:from-coral-pink/10 hover:to-royal-purple/10 transition-all duration-300 rounded-xl group/btn"
                    >
                      <Sparkles className="h-4 w-4 mr-3 text-coral-pink opacity-0 group-hover/btn:opacity-100 transition-opacity flex-shrink-0" />
                      <span className="text-sm group-hover/btn:text-coral-pink transition-colors line-clamp-2">
                        {idea}
                      </span>
                    </Button>
                  ))}
                </div>

                <Button 
                  onClick={() => handleGoToPlanner(theme.ideas[0])}
                  className={`w-full mt-4 ${theme.gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Créer maintenant
                </Button>
              </CardContent>
            </Card>
          ))}
        </MasonryGrid>

        {filteredThemes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-playfair font-bold mb-2">Aucun résultat</h3>
            <p className="text-muted-foreground">
              Essayez de modifier votre recherche ou vos filtres
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-royal-purple to-coral-pink text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <Crown className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Prêt à écrire votre bestseller ?
          </h2>
          <p className="text-xl mb-8 text-foreground max-w-2xl mx-auto">
            Choisissez votre idée et laissez notre IA générer un plan complet en quelques secondes
          </p>
          <Button 
            onClick={() => navigate('/ebook-planner')}
            size="lg"
            className="bg-white text-royal-purple hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-2xl"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Commencer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EbookIdeasPage;
