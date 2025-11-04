import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MasonryGrid } from '@/components/ui/masonry-grid';
import { 
  ArrowLeft, Lightbulb, BookOpen, TrendingUp, Heart, Brain, 
  Briefcase, Fish, Target, Sparkles, Search, Star, Trophy, Crown,
  Zap, Flame, Users, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EbookIdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const themes = [
    {
      category: 'Romans & Fiction Populaires',
      icon: BookOpen,
      gradient: 'bg-gradient-to-br from-coral-pink to-rose-600',
      badge: '🔥 Trending',
      difficulty: '⭐⭐⭐',
      potential: '💰💰💰',
      pages: '200-300',
      ideas: [
        'La Dernière Héritière : Romance Fantasy',
        'Secrets de Minuit : Thriller Psychologique',
        'L\'Empire des Cœurs Brisés : Dark Romance',
        'Murmures dans la Brume : Mystère Gothique',
        'La Prophétie de Luna : Fantasy Moderne',
        'Passion Interdite : Romance Contemporaine',
        'Le Chasseur d\'Âmes : Urban Fantasy',
        'Souvenirs Effacés : Science-Fiction Romance',
        'La Malédiction du Manoir : Romance Paranormale',
        'Échos du Passé : Thriller Historique',
        'L\'Académie des Ombres : Young Adult Fantasy',
        'Amour en Temps de Guerre : Romance Historique',
        'Le Royaume Oublié : Epic Fantasy',
        'Secrets de Famille : Drame Contemporain',
        'La Gardienne des Étoiles : Space Opera Romance',
        'Vengeance Silencieuse : Thriller Revenge',
        'Les Chroniques de Cristal : Fantasy Romance',
        'Passion Dévastatrice : Romance Milliardaire',
        'L\'Île des Mystères : Aventure Romance',
        'Flammes du Destin : Paranormal Romance',
        'Le Pacte du Diable : Dark Fantasy',
        'Cœurs en Exil : Romance Émotionnelle',
        'La Société Secrète : Mystery Romance',
        'Rêves Interdits : Contemporary Romance',
        'L\'Héritier Maudit : Gothic Romance'
      ]
    },
    {
      category: 'Développement Personnel',
      icon: Brain,
      gradient: 'bg-gradient-to-br from-royal-purple to-purple-600',
      badge: '👑 Bestseller',
      difficulty: '⭐⭐',
      potential: '💰💰💰💰',
      pages: '150-200',
      ideas: [
        'Comment développer sa confiance en soi en 30 jours',
        'Les 7 habitudes des personnes qui réussissent',
        'Guide complet de la gestion du stress',
        'Maîtriser l\'art de la communication',
        'Comment transformer ses échecs en réussites',
        'Productivité ultime : 10x votre efficacité en 2024',
        'Mindset de millionnaire : penser comme un leader',
        'Intelligence émotionnelle : maîtriser ses émotions',
        'Concentration laser : éliminer les distractions',
        'Confiance absolue : surmonter peurs et blocages'
      ]
    },
    {
      category: 'Business & Entrepreneuriat',
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-cobalt-blue to-cyan-600',
      badge: '⚡ Populaire',
      difficulty: '⭐⭐⭐',
      potential: '💰💰💰💰💰',
      pages: '180-250',
      ideas: [
        'Créer son business en ligne sans budget',
        'Le guide du freelance qui cartonne',
        'Marketing digital pour débutants',
        'Comment vendre ses services 3x plus cher',
        'Automatiser son business pour plus de liberté',
        'Marketing d\'influence : devenir un pro',
        'Stratégies SEO qui fonctionnent en 2024',
        'Email marketing : convertir comme un chef',
        'Publicité Facebook pour petites entreprises',
        'Content marketing : créer du contenu viral',
        'Marketing automation : vendre pendant son sommeil',
        'Personal branding : construire sa marque personnelle',
        'Growth hacking : exploser sa croissance',
        'Marketing local pour commerçants',
        'Copywriting : écrire pour vendre',
        'Marketing sur Instagram : 100k followers en 6 mois',
        'LinkedIn marketing pour B2B',
        'Affiliation marketing : générer 5000€/mois',
        'Marketing vidéo : TikTok et YouTube',
        'Funnel de vente : convertir 10x plus',
        'Retargeting publicitaire : reconquérir ses prospects',
        'Marketing éthique et durable'
      ]
    },
    {
      category: 'Santé & Bien-être',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
      badge: '✨ Débutant',
      difficulty: '⭐',
      potential: '💰💰💰',
      pages: '120-180',
      ideas: [
        'Perdre du poids durablement sans régime',
        'Méditation : guide du débutant',
        'Alimentation intuitive pour une vie saine',
        'Comment améliorer son sommeil naturellement',
        'Yoga pour tous : 21 jours pour se sentir mieux'
      ]
    },
    {
      category: 'Cuisine & Gastronomie',
      icon: Flame,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-600',
      badge: '🌶️ Tendance',
      difficulty: '⭐⭐',
      potential: '💰💰💰',
      pages: '100-150',
      ideas: [
        'Recettes véganes faciles et rapides',
        'Les secrets de la cuisine italienne',
        'Pâtisserie pour les nuls',
        'Cuisine du monde : voyage culinaire',
        'Les meilleurs cocktails pour vos soirées'
      ]
    },
    {
      category: 'Technologie & Gadgets',
      icon: Zap,
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      badge: '🤖 Futuriste',
      difficulty: '⭐⭐⭐',
      potential: '💰💰💰💰',
      pages: '160-220',
      ideas: [
        'Les dernières tendances en IA',
        'Guide des meilleurs gadgets connectés',
        'Comment créer son site web en 2024',
        'Sécurité informatique : protéger ses données',
        'Les métiers du futur dans la tech'
      ]
    },
    {
      category: 'Voyages & Aventure',
      icon: Target,
      gradient: 'bg-gradient-to-br from-sky-500 to-blue-600',
      badge: '🌍 Explorateur',
      difficulty: '⭐⭐',
      potential: '💰💰💰',
      pages: '140-200',
      ideas: [
        'Les destinations secrètes en Europe',
        'Road trip : guide ultime',
        'Voyager seul : conseils et astuces',
        'Les plus belles randonnées du monde',
        'Comment voyager avec un petit budget'
      ]
    },
    {
      category: 'Animaux de compagnie',
      icon: Fish,
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
      badge: '🐾 Adorable',
      difficulty: '⭐',
      potential: '💰💰💰',
      pages: '100-150',
      ideas: [
        'Comment éduquer son chiot',
        'Les secrets du bien-être félin',
        'Guide des races de chiens',
        'Alimentation saine pour animaux',
        'Soins et hygiène pour animaux'
      ]
    },
    {
      category: 'Parentalité & Éducation',
      icon: Users,
      gradient: 'bg-gradient-to-br from-lime-500 to-green-600',
      badge: '👶 Expert',
      difficulty: '⭐⭐',
      potential: '💰💰💰💰',
      pages: '150-200',
      ideas: [
        'L\'éducation positive pour les nuls',
        'Comment gérer les crises de colère',
        'Activités créatives pour enfants',
        'Les secrets d\'une communication parent-enfant',
        'Préparer son enfant à l\'école'
      ]
    },
    {
      category: 'Finance & Investissement',
      icon: BarChart3,
      gradient: 'bg-gradient-to-br from-honey-gold to-orange-600',
      badge: '📈 Pro',
      difficulty: '⭐⭐⭐',
      potential: '💰💰💰💰💰',
      pages: '180-250',
      ideas: [
        'Investir en bourse pour les débutants',
        'Comment gérer son budget personnel',
        'Les secrets de l\'investissement immobilier',
        'Préparer sa retraite sereinement',
        'Les meilleures stratégies d\'épargne'
      ]
    },
    {
      category: 'Mode & Style',
      icon: Sparkles,
      gradient: 'bg-gradient-to-br from-royal-purple to-pink-600',
      badge: '💎 En vogue',
      difficulty: '⭐⭐',
      potential: '💰💰💰',
      pages: '120-180',
      ideas: [
        'Créer son style personnel',
        'Garde-robe minimaliste et chic',
        'Mode éthique et durable',
        'Beauté naturelle : DIY cosmétiques',
        'Style homme : les bases intemporelles'
      ]
    },
    {
      category: 'Spiritualité & Philosophie',
      icon: Brain,
      gradient: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      badge: '🧘 Zen',
      difficulty: '⭐⭐',
      potential: '💰💰💰',
      pages: '150-200',
      ideas: [
        'Trouver son sens de la vie',
        'Méditation et pleine conscience',
        'Les principes du bonheur authentique',
        'Sagesse ancienne pour vie moderne',
        'Développer son intuition'
      ]
    },
    {
      category: 'Sport & Fitness',
      icon: Trophy,
      gradient: 'bg-gradient-to-br from-emerald-500 to-lime-600',
      badge: '💪 Actif',
      difficulty: '⭐⭐',
      potential: '💰💰💰💰',
      pages: '140-200',
      ideas: [
        'Musculation à la maison sans matériel',
        'Course à pied : du canapé au marathon',
        'Fitness pour femmes enceintes',
        'Yoga dynamique pour sportifs',
        'Récupération et performance'
      ]
    },
    {
      category: 'Écologie & Durabilité',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-green-500 to-lime-600',
      badge: '🌱 Eco',
      difficulty: '⭐',
      potential: '💰💰💰',
      pages: '100-150',
      ideas: [
        'Zéro déchet : guide pratique',
        'Maison écologique et économique',
        'Jardinage urbain pour débutants',
        'Mode de vie minimaliste',
        'Consommation responsable au quotidien'
      ]
    },
    {
      category: 'Reconversion Professionnelle',
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      badge: '🔄 Nouveau départ',
      difficulty: '⭐⭐⭐',
      potential: '💰💰💰💰',
      pages: '180-250',
      ideas: [
        'Changer de métier après 40 ans',
        'Bilan de compétences DIY',
        'Créer son emploi idéal',
        'Du salariat à l\'entrepreneuriat',
        'Négocier sa reconversion interne'
      ]
    },
    {
      category: 'Aquariophilie & Poissons',
      icon: Fish,
      gradient: 'bg-gradient-to-br from-cobalt-blue to-cyan-600',
      badge: '🐠 Passion',
      difficulty: '⭐⭐',
      potential: '💰💰',
      pages: '120-180',
      ideas: [
        'Aquarium débutant : guide complet',
        'Poissons tropicaux : espèces et soins',
        'Aquascaping : créer un paysage aquatique',
        'Eau douce vs eau de mer : faire son choix',
        'Filtration d\'aquarium : système parfait'
      ]
    }
  ];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = searchQuery === "" || 
      theme.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.ideas.some(idea => idea.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || theme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const allCategories = themes.map(t => t.category);

  const handleGoToPlanner = (title: string) => {
    navigate('/ebook-planner', { state: { suggestedTitle: title } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-cream/50 font-inter">
      {/* Hero Section - Magazine Style */}
      <div className="relative overflow-hidden bg-gradient-magazine-hero text-white">
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
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
              300+ Idées de<br />Bestsellers à Créer
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Trouvez l'inspiration parfaite pour votre prochain ebook. De la fiction aux guides pratiques, découvrez des titres qui cartonnent.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-cool" />
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
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-white/80 text-sm">Idées disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-white/80 text-sm">Ebooks créés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-white/80 text-sm">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.9⭐</div>
              <div className="text-white/80 text-sm">Note moyenne</div>
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
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
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
