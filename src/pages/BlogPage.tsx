import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Clock, TrendingUp, ArrowRight, Sparkles, Target, Zap, PenTool, DollarSign, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const articles = [
  {
    slug: '/ecrire-livre-chatgpt',
    title: 'Écrire un Livre avec ChatGPT : Guide Complet 2025',
    excerpt: 'Découvrez comment utiliser ChatGPT pour écrire votre livre de A à Z. Prompts, techniques et workflow complet pour publier sur Amazon KDP.',
    category: 'Tutorial',
    readTime: '12 min',
    keyword: 'écrire un livre avec chatgpt',
    searchVolume: 1300,
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500',
    date: '13 Janvier 2025'
  },
  {
    slug: '/creer-ebook-ia',
    title: 'Créer un Ebook avec l\'IA : Méthode Pas à Pas',
    excerpt: 'Apprenez à créer un ebook professionnel avec l\'intelligence artificielle. De l\'idée à la publication KDP en quelques heures.',
    category: 'Guide',
    readTime: '10 min',
    keyword: 'créer un ebook avec l\'ia',
    searchVolume: 720,
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-500',
    date: '13 Janvier 2025'
  },
  {
    slug: '/generateur-ebook',
    title: 'Générateur d\'Ebook IA : Comparatif & Solution',
    excerpt: 'Quel est le meilleur générateur d\'ebook IA en 2025 ? Comparatif des outils, fonctionnalités et prix pour faire le bon choix.',
    category: 'Comparatif',
    readTime: '8 min',
    keyword: 'générateur ebook ia',
    searchVolume: 480,
    icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
    date: '13 Janvier 2025'
  },
  {
    slug: '/blog/auto-edition-amazon-kdp',
    title: 'Auto-édition Amazon KDP : Le Guide Ultime 2025',
    excerpt: 'Tout ce qu\'il faut savoir pour réussir son auto-édition sur Amazon KDP. Formatage, prix, catégories et stratégies de lancement.',
    category: 'Guide',
    readTime: '15 min',
    keyword: 'auto édition amazon kdp',
    searchVolume: 880,
    icon: PenTool,
    gradient: 'from-rose-500 to-pink-500',
    date: '14 Janvier 2025'
  },
  {
    slug: '/blog/gagner-argent-ebook',
    title: 'Gagner de l\'Argent avec les Ebooks : Stratégies Rentables',
    excerpt: 'Découvrez comment générer des revenus passifs avec vos ebooks. Niches rentables, pricing et techniques de vente sur Amazon.',
    category: 'Monétisation',
    readTime: '11 min',
    keyword: 'gagner argent ebook',
    searchVolume: 590,
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
    date: '14 Janvier 2025'
  },
  {
    slug: '/blog/idees-ebook-rentables',
    title: '50 Idées d\'Ebooks Rentables à Créer en 2025',
    excerpt: 'Liste complète d\'idées de niches et sujets d\'ebooks qui se vendent bien sur Amazon KDP. Inspirez-vous pour votre prochain bestseller.',
    category: 'Inspiration',
    readTime: '9 min',
    keyword: 'idées ebook rentables',
    searchVolume: 390,
    icon: Lightbulb,
    gradient: 'from-indigo-500 to-blue-500',
    date: '14 Janvier 2025'
  }
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog EbookStudio Pro - Guides IA pour Créer des Ebooks | Tutoriels KDP</title>
        <meta name="description" content="Découvrez nos guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT, astuces KDP et stratégies de publication Amazon." />
        <meta name="keywords" content="blog ebook ia, tutoriel chatgpt livre, guide kdp amazon, créer ebook intelligence artificielle" />
        <link rel="canonical" href="https://ebookstudio.fr/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog EbookStudio Pro - Guides IA pour Créer des Ebooks" />
        <meta property="og:description" content="Guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT et stratégies KDP." />
        <meta property="og:url" content="https://ebookstudio.fr/blog" />
        <meta property="og:type" content="website" />
        
        {/* Schema.org Blog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog EbookStudio Pro",
            "description": "Guides et tutoriels pour créer des ebooks avec l'intelligence artificielle",
            "url": "https://ebookstudio.fr/blog",
            "publisher": {
              "@type": "Organization",
              "name": "EbookStudio Pro",
              "url": "https://ebookstudio.fr"
            },
            "blogPost": articles.map(article => ({
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.excerpt,
              "url": `https://ebookstudio.fr${article.slug}`,
              "datePublished": "2025-01-13"
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/offres" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EbookStudio Pro</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_nav')); }} className="text-white/70 hover:text-white transition-colors">Accueil</Link>
              <Link to="/blog" className="text-violet-400 font-medium">Blog</Link>
              <Link to="/demo" className="text-white/70 hover:text-white transition-colors">Démo</Link>
              <Link to="/formation" className="text-white/70 hover:text-white transition-colors">Formation</Link>
            </nav>
            <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_cta')); }}>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                Accès Générateur
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30">
              📚 Ressources & Guides
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">EbookStudio Pro</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Guides complets, tutoriels et stratégies pour créer des ebooks professionnels avec l'intelligence artificielle
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">{articles.length}</div>
                <div className="text-white/60 text-sm">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">2,500+</div>
                <div className="text-white/60 text-sm">Recherches/mois ciblées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">100%</div>
                <div className="text-white/60 text-sm">Gratuit</div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Link key={index} to={article.slug} className="group">
                  <Card className="h-full bg-white/5 border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 overflow-hidden">
                    {/* Gradient Header */}
                    <div className={`h-32 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {article.category}
                        </Badge>
                        <article.icon className="w-12 h-12 text-white/30" />
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </span>
                        <span>{article.date}</span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="text-white/60 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      {/* Keyword Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          <Target className="w-3 h-3 mr-1" />
                          {article.keyword}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/10">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {article.searchVolume}/mois
                        </Badge>
                      </div>
                      
                      {/* CTA */}
                      <div className="flex items-center text-violet-400 font-medium text-sm group-hover:text-violet-300">
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à créer votre premier ebook ?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Passez de la lecture à l'action. Notre générateur IA transforme vos idées en ebooks professionnels en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Essayer gratuitement
                </Button>
              </Link>
              <Link to="/offres">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                  Accès Pro — 67€ à vie
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white">EbookStudio Pro</span>
                </div>
                <p className="text-white/50 text-sm">
                  Le générateur d'ebooks IA le plus complet pour publier sur Amazon KDP.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">📚 Guides SEO</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/ecrire-livre-chatgpt" className="text-white/60 hover:text-violet-400 transition-colors">Écrire avec ChatGPT</Link></li>
                  <li><Link to="/creer-ebook-ia" className="text-white/60 hover:text-violet-400 transition-colors">Créer un Ebook IA</Link></li>
                  <li><Link to="/generateur-ebook" className="text-white/60 hover:text-violet-400 transition-colors">Générateur Ebook</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">🚀 Produit</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/offres" className="text-white/60 hover:text-violet-400 transition-colors">Offres & Prix</Link></li>
                  <li><Link to="/demo" className="text-white/60 hover:text-violet-400 transition-colors">Démo gratuite</Link></li>
                  <li><Link to="/formation" className="text-white/60 hover:text-violet-400 transition-colors">Formation</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">💡 Ressources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/valeur-offre" className="text-white/60 hover:text-violet-400 transition-colors">Valeur de l'offre</Link></li>
                  <li><Link to="/blog" className="text-white/60 hover:text-violet-400 transition-colors">Blog</Link></li>
                  <li><Link to="/affiliation" className="text-white/60 hover:text-violet-400 transition-colors">Affiliation</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
              © 2025 EbookStudio Pro. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogPage;
