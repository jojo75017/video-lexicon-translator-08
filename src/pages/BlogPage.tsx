import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Clock, TrendingUp, ArrowRight, Sparkles, Target, Zap, PenTool, DollarSign, Lightbulb, Newspaper, ExternalLink, ArrowLeft, Home, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const articles = [
  { slug: '/ecrire-livre-chatgpt', title: 'Écrire un Livre avec ChatGPT : Guide Complet 2025', excerpt: 'Découvrez comment utiliser ChatGPT pour écrire votre livre de A à Z. Prompts, techniques et workflow complet pour publier sur Amazon KDP.', category: 'Tutorial', readTime: '12 min', keyword: 'écrire un livre avec chatgpt', searchVolume: 1300, icon: BookOpen, gradient: 'from-primary to-primary/70', date: '13 Janvier 2025' },
  { slug: '/creer-ebook-ia', title: 'Créer un Ebook avec l\'IA : Méthode Pas à Pas', excerpt: 'Apprenez à créer un ebook professionnel avec l\'intelligence artificielle. De l\'idée à la publication KDP en quelques heures.', category: 'Guide', readTime: '10 min', keyword: 'créer un ebook avec l\'ia', searchVolume: 720, icon: Sparkles, gradient: 'from-primary/80 to-accent', date: '13 Janvier 2025' },
  { slug: '/generateur-ebook', title: 'Générateur d\'Ebook IA : Comparatif & Solution', excerpt: 'Quel est le meilleur générateur d\'ebook IA en 2025 ? Comparatif des outils, fonctionnalités et prix pour faire le bon choix.', category: 'Comparatif', readTime: '8 min', keyword: 'générateur ebook ia', searchVolume: 480, icon: Zap, gradient: 'from-amber-500 to-orange-500', date: '13 Janvier 2025' },
  { slug: '/blog/auto-edition-amazon-kdp', title: 'Auto-édition Amazon KDP : Le Guide Ultime 2025', excerpt: 'Tout ce qu\'il faut savoir pour réussir son auto-édition sur Amazon KDP. Formatage, prix, catégories et stratégies de lancement.', category: 'Guide', readTime: '15 min', keyword: 'auto édition amazon kdp', searchVolume: 880, icon: PenTool, gradient: 'from-rose-500 to-pink-500', date: '14 Janvier 2025' },
  { slug: '/blog/gagner-argent-ebook', title: 'Gagner de l\'Argent avec les Ebooks : Stratégies Rentables', excerpt: 'Découvrez comment générer des revenus passifs avec vos ebooks. Niches rentables, pricing et techniques de vente sur Amazon.', category: 'Monétisation', readTime: '11 min', keyword: 'gagner argent ebook', searchVolume: 590, icon: DollarSign, gradient: 'from-emerald-500 to-teal-500', date: '14 Janvier 2025' },
  { slug: '/blog/idees-ebook-rentables', title: '50 Idées d\'Ebooks Rentables à Créer en 2025', excerpt: 'Liste complète d\'idées de niches et sujets d\'ebooks qui se vendent bien sur Amazon KDP. Inspirez-vous pour votre prochain bestseller.', category: 'Inspiration', readTime: '9 min', keyword: 'idées ebook rentables', searchVolume: 390, icon: Lightbulb, gradient: 'from-indigo-500 to-blue-500', date: '14 Janvier 2025' },
  { slug: '/blog/ebookstudio-pro-avis', title: 'EbookStudio Pro : Avis Complet, Fonctionnalités et Test 2026', excerpt: 'Test complet : workflow 15 agents IA, Gemini 3 Flash, audiobooks Azure, export KDP. Avis honnête sur le pack 67€ à vie.', category: 'Avis', readTime: '13 min', keyword: 'ebookstudio pro avis', searchVolume: 320, icon: Sparkles, gradient: 'from-amber-500 to-orange-500', date: '1 Mai 2026' },
  { slug: '/blog/kdp-pilot-strategie-publication', title: 'KDP Pilot : La Stratégie de Publication Amazon qui Cartonne en 2026', excerpt: 'Méthode complète : sélection de niches, mots-clés Amazon, BSR, séries et lancement optimisé pour percer sur Kindle Direct Publishing.', category: 'Stratégie', readTime: '14 min', keyword: 'kdp pilot stratégie', searchVolume: 410, icon: Target, gradient: 'from-violet-500 to-purple-600', date: '1 Mai 2026' },
  { slug: '/blog/audiobook-ia-amazon-acx', title: 'Créer un Audiobook IA en 2026 : Guide Complet (Amazon ACX, Audible)', excerpt: 'Méthode complète pour créer, héberger et vendre un audiobook IA professionnel. Voix Azure, segmentation, ACX et vente directe.', category: 'Audiobook', readTime: '12 min', keyword: 'créer audiobook ia', searchVolume: 480, icon: Headphones, gradient: 'from-cyan-500 to-blue-600', date: '1 Mai 2026' },
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog EbookStudio Pro - Guides IA pour Créer des Ebooks | Tutoriels KDP</title>
        <meta name="description" content="Découvrez nos guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT, astuces KDP et stratégies de publication Amazon." />
        <meta name="keywords" content="blog ebook ia, tutoriel chatgpt livre, guide kdp amazon, créer ebook intelligence artificielle" />
        <link rel="canonical" href="https://ebookstudio.fr/blog" />
        <meta property="og:title" content="Blog EbookStudio Pro - Guides IA pour Créer des Ebooks" />
        <meta property="og:description" content="Guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT et stratégies KDP." />
        <meta property="og:url" content="https://ebookstudio.fr/blog" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "Blog", "name": "Blog EbookStudio Pro",
            "description": "Guides et tutoriels pour créer des ebooks avec l'intelligence artificielle",
            "url": "https://ebookstudio.fr/blog",
            "publisher": { "@type": "Organization", "name": "EbookStudio Pro", "url": "https://ebookstudio.fr" },
            "blogPost": articles.map(article => ({ "@type": "BlogPosting", "headline": article.title, "description": article.excerpt, "url": `https://ebookstudio.fr${article.slug}`, "datePublished": "2025-01-13" }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/offres" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EbookStudio Pro</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_nav')); }} className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/blog" className="text-primary font-medium">Blog</Link>
              <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Démo</Link>
              <Link to="/formation" className="text-muted-foreground hover:text-foreground transition-colors">Formation</Link>
            </nav>
            <div className="flex items-center gap-2">
              <a href="https://ebookstudio.blog" target="_blank" rel="noopener noreferrer" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_back_btn')); }}>
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Retour au site</span>
                  <Home className="w-4 h-4 sm:hidden" />
                </Button>
              </a>
              <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_cta')); }}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:inline-flex">Accès Générateur</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30">📚 Ressources & Guides</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Blog <span className="text-primary">EbookStudio Pro</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Guides complets, tutoriels et stratégies pour créer des ebooks professionnels avec l'intelligence artificielle
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center"><div className="text-3xl font-bold text-primary">{articles.length}</div><div className="text-muted-foreground text-sm">Articles</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-green-600">2,500+</div><div className="text-muted-foreground text-sm">Recherches/mois ciblées</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-amber-600">100%</div><div className="text-muted-foreground text-sm">Gratuit</div></div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Link key={index} to={article.slug} className="group">
                  <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden">
                    <div className={`h-32 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">{article.category}</Badge>
                        <article.icon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime}</span>
                        <span>{article.date}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 bg-green-500/5"><Target className="w-3 h-3 mr-1" />{article.keyword}</Badge>
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 bg-amber-500/5"><TrendingUp className="w-3 h-3 mr-1" />{article.searchVolume}/mois</Badge>
                      </div>
                      <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80">
                        Lire l'article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Bannière vers le blog complet */}
            <div className="mt-16 max-w-5xl mx-auto">
              <a
                href="https://ebookstudio.blog/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />

                <div className="relative grid md:grid-cols-[auto_1fr_auto] items-center gap-6 p-8 md:p-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                    <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                  </div>

                  <div>
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/15">
                      ✨ Magazine officiel
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Découvrez notre magazine ebookstudio.blog
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base mb-2">
                      Des dizaines d'articles supplémentaires : tendances KDP, niches rentables, stratégies IA, témoignages d'auteurs et études de cas. Le complément parfait pour aller plus loin.
                    </p>
                    <p className="text-xs text-muted-foreground/80 italic">
                      💡 S'ouvre dans un nouvel onglet — votre session sur ebookstudio.fr reste active, fermez simplement l'onglet pour revenir.
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-primary font-semibold whitespace-nowrap group-hover:gap-3 transition-all">
                    Visiter le blog
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>

                <div className="md:hidden flex items-center justify-center gap-2 text-primary font-semibold pb-6">
                  Visiter le blog <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Que souhaitez-vous faire ensuite ?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Explorez nos offres ou lancez-vous directement dans la création de votre premier ebook avec notre générateur IA.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://ebookstudio.blog" target="_blank" rel="noopener noreferrer" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_footer_site')); }}>
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  <Home className="w-4 h-4 mr-2" />
                  Retour au site web
                </Button>
              </a>
              <Link to="/ebook-planner">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Accès Générateur
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-foreground" /></div>
                  <span className="font-bold text-foreground">EbookStudio Pro</span>
                </div>
                <p className="text-muted-foreground text-sm">Le générateur d'ebooks IA le plus complet pour publier sur Amazon KDP.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">📚 Guides SEO</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/ecrire-livre-chatgpt" className="text-muted-foreground hover:text-primary transition-colors">Écrire avec ChatGPT</Link></li>
                  <li><Link to="/creer-ebook-ia" className="text-muted-foreground hover:text-primary transition-colors">Créer un Ebook IA</Link></li>
                  <li><Link to="/generateur-ebook" className="text-muted-foreground hover:text-primary transition-colors">Générateur Ebook</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">🚀 Produit</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/offres" className="text-muted-foreground hover:text-primary transition-colors">Offres & Prix</Link></li>
                  <li><Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">Démo gratuite</Link></li>
                  <li><Link to="/formation" className="text-muted-foreground hover:text-primary transition-colors">Formation</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">💡 Ressources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/valeur-offre" className="text-muted-foreground hover:text-primary transition-colors">Valeur de l'offre</Link></li>
                  <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/affiliation" className="text-muted-foreground hover:text-primary transition-colors">Affiliation</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">© 2025 EbookStudio Pro. Tous droits réservés.</div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogPage;
