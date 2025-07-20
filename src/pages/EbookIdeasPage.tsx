import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, BookOpen, TrendingUp, Heart, Brain, Briefcase, Fish, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EbookIdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const themes = [
    {
      category: 'Développement Personnel',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      ideas: [
        'Comment développer sa confiance en soi en 30 jours',
        'Les 7 habitudes des personnes qui réussissent',
        'Guide complet de la gestion du stress',
        'Maîtriser l\'art de la communication',
        'Comment transformer ses échecs en réussites'
      ]
    },
    {
      category: 'Business & Entrepreneuriat',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
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
      color: 'from-green-500 to-green-600',
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
      color: 'from-yellow-500 to-orange-600',
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
      color: 'from-indigo-500 to-indigo-600',
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
      color: 'from-pink-500 to-rose-600',
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
      color: 'from-red-500 to-red-600',
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
      color: 'from-orange-500 to-orange-600',
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
      color: 'from-teal-500 to-teal-600',
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
      color: 'from-purple-500 to-pink-600',
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
      color: 'from-violet-500 to-violet-600',
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
      color: 'from-emerald-500 to-emerald-600',
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
      color: 'from-blue-500 to-cyan-600',
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
      color: 'from-green-500 to-lime-600',
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
      color: 'from-rose-500 to-pink-600',
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
      color: 'from-amber-500 to-orange-600',
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
      color: 'from-cyan-500 to-blue-600',
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
    }
  ];

  const handleGoToPlanner = (title: string) => {
    navigate('/ebook-planner', { state: { suggestedTitle: title } });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <Lightbulb className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Idées de Titres d'Ebook</h1>
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground">
          Découvrez plus de 80 idées de titres d'ebooks répartis en 16 thématiques populaires
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cliquez sur une idée pour commencer à créer votre plan d'ebook
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${theme.color} text-white`}>
                  <theme.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {theme.category}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {theme.ideas.length} idées
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {theme.ideas.map((idea, ideaIndex) => (
                  <Button
                    key={ideaIndex}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 hover:bg-muted"
                    onClick={() => handleGoToPlanner(idea)}
                  >
                    <div className="text-sm leading-5">
                      <span className="font-medium text-primary">•</span> {idea}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6 mt-12">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Prêt à créer votre ebook ?</h3>
            <p className="text-muted-foreground mb-4">
              Choisissez une idée ci-dessus ou créez votre propre plan personnalisé
            </p>
            <Button 
              onClick={() => navigate('/ebook-planner')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Créer mon plan d'ebook
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-orange-600" />
              <h3 className="text-xl font-bold">🎯 Pack de 20 Prompts Professionnels</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Générez un pack complet de 20 prompts IA professionnels, formatés et prêts à vendre, 
              regroupés en 4-5 catégories (Business, Copywriting, Voyage, Développement personnel...)
            </p>
            <div className="bg-white/50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">✨ Ce que vous obtiendrez :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 20 prompts originaux et puissants</li>
                <li>• Fiches formatées pour ChatGPT/IA</li>
                <li>• Structure professionnelle vendable</li>
                <li>• Catégories thématiques pertinentes</li>
                <li>• Format PDF/Word compatible</li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/prompts-generator')}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Target className="h-5 w-5 mr-2" />
              Générer mes 20 prompts pros
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookIdeasPage;