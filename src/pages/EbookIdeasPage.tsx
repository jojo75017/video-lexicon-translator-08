import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, BookOpen, TrendingUp, Heart, Brain, Briefcase, Fish, Target, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EbookIdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const themes = [
    {
      category: 'Romans & Fiction Populaires',
      icon: BookOpen,
      gradient: 'bg-gradient-to-br from-vibrant-pink to-rose-500',
      shadow: 'shadow-pink',
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
      gradient: 'bg-gradient-to-br from-vibrant-purple to-purple-600',
      shadow: 'shadow-purple',
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
      gradient: 'bg-gradient-to-br from-vibrant-blue to-blue-600',
      shadow: 'shadow-blue',
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
      gradient: 'bg-gradient-to-br from-vibrant-green to-emerald-600',
      shadow: 'shadow-purple',
      ideas: [
        'Perdre du poids durablement sans régime',
        'Méditation : guide du débutant',
        'Alimentation intuitive pour une vie saine',
        'Comment améliorer son sommeil naturellement',
        'Yoga pour tous : 21 jours pour se sentir mieux'
      ]
    },
    {
      category: 'Finance & Investissement',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      shadow: 'shadow-blue',
      ideas: [
        'Investir en bourse pour les nuls',
        'Créer ses sources de revenus passifs',
        'Gérer son budget comme un pro',
        'Immobilier locatif : guide du débutant',
        'Cryptomonnaies : investir intelligemment'
      ]
    },
    {
      category: 'Technologie & Digital',
      icon: Brain,
      gradient: 'bg-gradient-to-br from-vibrant-cyan to-indigo-600',
      shadow: 'shadow-blue',
      ideas: [
        'Intelligence Artificielle pour tous',
        'Créer son site web sans coder',
        'Maîtriser les réseaux sociaux professionnels',
        'Cybersécurité : protéger ses données',
        'Productivité digitale : outils et méthodes'
      ]
    },
    {
      category: 'Créativité & Arts',
      icon: Lightbulb,
      gradient: 'bg-gradient-to-br from-vibrant-pink to-rose-600',
      shadow: 'shadow-pink',
      ideas: [
        'Débloquer sa créativité en 10 étapes',
        'Photographie mobile : techniques avancées',
        'Écrire son premier roman',
        'Dessiner : de débutant à artiste',
        'Créer des vidéos virales sur les réseaux'
      ]
    },
    {
      category: 'Relations & Famille',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-rose-500 to-red-600',
      shadow: 'shadow-pink',
      ideas: [
        'Construire des relations durables',
        'Éduquer ses enfants avec bienveillance',
        'Communication dans le couple',
        'Gérer les conflits familiaux',
        'Trouver l\'amour à l\'ère du digital'
      ]
    },
    {
      category: 'Cuisine & Gastronomie',
      icon: BookOpen,
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
      shadow: 'shadow-blue',
      ideas: [
        'Cuisine healthy : 50 recettes faciles',
        'Batch cooking : organisez vos repas',
        'Pâtisserie sans gluten',
        'Cuisine végétarienne pour carnivores',
        'Apéros et cocktails maison'
      ]
    },
    {
      category: 'Voyage & Aventure',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-vibrant-cyan to-teal-600',
      shadow: 'shadow-blue',
      ideas: [
        'Voyager avec un petit budget',
        'Road trip : guide de préparation',
        'Voyage solo en sécurité',
        'Destinations secrètes d\'Europe',
        'Digital nomad : travailler en voyageant',
        'Guide ultime de l\'Europe en train',
        'Asie du Sud-Est : itinéraire parfait',
        'Voyager malin : 50 astuces d\'expert',
        'Europe de l\'Est : trésors cachés',
        'Japon : guide du voyageur indépendant',
        'Thaïlande : au-delà des sentiers battus',
        'Interrail : traverser l\'Europe en liberté',
        'Voyage d\'affaires : optimiser ses déplacements',
        'Backpacking en Asie : guide survie',
        'Capitales européennes en week-end',
        'Vietnam : de Hanoï à Ho Chi Minh',
        'Portugal secret : 15 lieux magiques',
        'Corée du Sud : culture et modernité',
        'Balkans : découvrir les perles cachées',
        'Inde : voyage spirituel et culturel',
        'Islande : terre de feu et de glace',
        'Singapour et Malaisie : citytrip parfait',
        'Scandinavie : fjords et aurores boréales',
        'Camping-car en Europe : liberté totale',
        'Voyager responsable et éco-friendly'
      ]
    },
    {
      category: 'Mode & Style',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-vibrant-purple to-pink-600',
      shadow: 'shadow-purple',
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
      gradient: 'bg-gradient-to-br from-violet-500 to-violet-600',
      shadow: 'shadow-purple',
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
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-vibrant-green to-emerald-600',
      shadow: 'shadow-purple',
      ideas: [
        'Musculation à la maison sans matériel',
        'Course à pied : du canapé au marathon',
        'Fitness pour femmes enceintes',
        'Yoga dynamique pour sportifs',
        'Récupération et performance'
      ]
    },
    {
      category: 'Éducation & Apprentissage',
      icon: BookOpen,
      gradient: 'bg-gradient-to-br from-vibrant-blue to-cyan-600',
      shadow: 'shadow-blue',
      ideas: [
        'Apprendre une langue rapidement',
        'Techniques de mémorisation efficaces',
        'Étudier sans stress',
        'Développer son esprit critique',
        'Formation continue à l\'ère digitale'
      ]
    },
    {
      category: 'Écologie & Durabilité',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-vibrant-green to-lime-600',
      shadow: 'shadow-purple',
      ideas: [
        'Zéro déchet : guide pratique',
        'Maison écologique et économique',
        'Jardinage urbain pour débutants',
        'Mode de vie minimaliste',
        'Consommation responsable au quotidien'
      ]
    },
    {
      category: 'Parentalité',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
      shadow: 'shadow-pink',
      ideas: [
        'Éducation positive pour enfants épanouis',
        'Gérer les écrans chez les enfants',
        'Activités créatives en famille',
        'Préparer son enfant à l\'école',
        'Adolescence : comprendre et accompagner'
      ]
    },
    {
      category: 'Reconversion Professionnelle',
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      shadow: 'shadow-blue',
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
      gradient: 'bg-gradient-to-br from-vibrant-cyan to-blue-600',
      shadow: 'shadow-blue',
      ideas: [
        'Aquarium débutant : guide complet',
        'Poissons tropicaux : espèces et soins',
        'Aquascaping : créer un paysage aquatique',
        'Eau douce vs eau de mer : faire son choix',
        'Filtration d\'aquarium : système parfait',
        'Reproduction des poissons d\'ornement',
        'Plantes aquatiques : guide du débutant',
        'Cichlidés africains : guide d\'élevage',
        'Aquarium récifal : coraux et invertébrés',
        'Maladies des poissons : prévenir et guérir',
        'Discus : roi de l\'aquarium d\'eau douce',
        'Nano-aquarium : petit mais parfait',
        'Éclairage LED pour aquarium',
        'Poissons rouges : au-delà du bocal',
        'Betta splendens : guide complet',
        'Aquarium biotope : recréer la nature',
        'Maintenance aquarium : planning annuel',
        'Poissons d\'eau froide sans chauffage',
        'Aquaterrarium : terre et eau réunies',
        'Crevettes d\'aquarium : guide d\'élevage',
        'Aquarium communautaire harmonieux',
        'Chimie de l\'eau : maîtriser les paramètres',
        'Aquarium marin pour débutants',
        'Poissons carnivores : nourrir et élever',
        'Aquarium low-tech : simplicité efficace'
      ]
    },
    {
      category: 'Enfants 6-10 ans 🧸',
      icon: Heart,
      gradient: 'bg-gradient-to-br from-pink-400 to-purple-500',
      shadow: 'shadow-pink',
      ideas: [
        'Luna et le Dragon Magique',
        'L\'École des Petits Sorciers',
        'Les Aventures de Mimi la Souris',
        'Le Secret du Jardin Enchanté',
        'Tom et le Trésor des Pirates',
        'La Princesse qui Aimait les Insectes',
        'Les Amis de la Forêt Mystérieuse',
        'Charlie et son Chat Volant',
        'L\'Île aux Mille Couleurs',
        'Les Super-Pouvoirs de Nina',
        'Le Petit Robot qui Rêvait',
        'Les Jumeaux et la Machine à Temps',
        'L\'Ours qui ne Savait pas Hiberner',
        'La Fée des Dents Perdues',
        'Max et le Monstre Gentil',
        'Les Créatures du Lac Cristal',
        'Léa et les Animaux Parlants',
        'Le Livre qui S\'écrivait Tout Seul',
        'Les Gardiens de l\'Arc-en-Ciel',
        'Le Petit Chef Cuisinier',
        'L\'Astronaute de 8 ans',
        'La Maison dans les Nuages',
        'Sophie et le Pinceau Magique',
        'Le Club des Détectives Juniors',
        'Les Vacances Extraordinaires',
        'Le Phare aux Histoires',
        'Romain et son Dragon de Poche',
        'La Bibliothèque Secrète',
        'Les Superhéros du Quartier',
        'L\'Arbre qui Chantait des Berceuses'
      ]
    }
  ];

  const handleGoToPlanner = (title: string) => {
    navigate('/ebook-planner', { state: { suggestedTitle: title } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header avec effet de glassmorphisme */}
        <div className="relative overflow-hidden rounded-2xl gradient-card p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                size="sm"
                className="backdrop-blur-sm bg-white/10 border-white/20 text-foreground hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-primary text-white glow-effect">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-vibrant-purple bg-clip-text text-transparent">
                  Idées de Titres d'Ebook
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                  Plus de 300 idées créatives pour votre prochain bestseller
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Cliquez sur un titre pour générer votre ebook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des thèmes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme, index) => (
            <Card key={index} className={`group relative overflow-hidden border-0 transition-all duration-500 hover:scale-[1.02] hover:${theme.shadow} glow-effect`}>
              <div className="absolute inset-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${theme.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <theme.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        {theme.category}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {theme.ideas.length} idées disponibles
                        </span>
                        <div className="h-1 w-1 rounded-full bg-primary"></div>
                        <span className="text-xs text-primary font-medium">Populaire</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {theme.ideas.map((idea, ideaIndex) => (
                      <Button
                        key={ideaIndex}
                        variant="ghost"
                        className="w-full text-left justify-start h-auto p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group/item"
                        onClick={() => handleGoToPlanner(idea)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-2 h-2 rounded-full bg-primary opacity-60 group-hover/item:opacity-100 transition-opacity"></div>
                          <div className="flex-1 text-sm leading-6 group-hover/item:text-primary transition-colors">
                            {idea}
                          </div>
                          <Sparkles className="h-4 w-4 opacity-0 group-hover/item:opacity-100 text-primary transition-all duration-300 transform group-hover/item:translate-x-1" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Call-to-Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          <Card className="relative overflow-hidden border-0 bg-gradient-card">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-primary text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Créer votre ebook</h3>
                  <p className="text-muted-foreground">Planifiez et structurez votre contenu</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Utilisez notre générateur intelligent pour créer un plan détaillé et commencer la rédaction de votre ebook dès maintenant.
              </p>
              
              <Button 
                onClick={() => navigate('/ebook-planner')}
                size="lg"
                className="btn-gradient w-full"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Générer mon ebook maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-card">
            <div className="absolute inset-0 bg-gradient-secondary opacity-5"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-secondary text-white">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Pack de Prompts Pro</h3>
                  <p className="text-muted-foreground">20 prompts IA prêts à vendre</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Prompts originaux et testés</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Format professionnel vendable</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>5 catégories thématiques</span>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/prompts-generator')}
                size="lg"
                className="bg-gradient-secondary text-white hover:opacity-90 w-full"
              >
                <Target className="h-5 w-5 mr-2" />
                Créer mes prompts pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EbookIdeasPage;