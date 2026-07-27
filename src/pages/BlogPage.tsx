import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Clock, ArrowRight, Newspaper, ExternalLink, ArrowLeft, Home, LayoutGrid } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogArticles } from '@/data/blogArticles';

const articles = blogArticles.map((a) => ({
  slug: `/blog/${a.slug}`,
  title: a.title,
  excerpt: a.excerpt,
  category: a.category,
  readTime: a.readTime,
  date: a.date,
  image: a.image,
  author: a.author,
}));

// Regroupe les articles par catégorie et prend la 1re image comme visuel
const categoryModules = (() => {
  const map = new Map<string, { name: string; image: string; count: number }>();
  for (const a of articles) {
    const existing = map.get(a.category);
    if (existing) existing.count += 1;
    else map.set(a.category, { name: a.category, image: a.image, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
})();



const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const visibleArticles = useMemo(
    () => (activeCategory ? articles.filter((a) => a.category === activeCategory) : articles),
    [activeCategory]
  );

  return (
    <>
      <Helmet>
        <title>Blog Ebookstudio Pro V2 - Guides IA pour Créer des Ebooks | Tutoriels KDP</title>
        <meta name="description" content="Découvrez nos guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT, astuces KDP et stratégies de publication Amazon." />
        <meta name="keywords" content="blog ebook ia, tutoriel chatgpt livre, guide kdp amazon, créer ebook intelligence artificielle" />
        <link rel="canonical" href="https://ebookstudio.fr/blog" />
        <meta property="og:title" content="Blog Ebookstudio Pro V2 - Guides IA pour Créer des Ebooks" />
        <meta property="og:description" content="Guides complets pour créer des ebooks avec l'IA. Tutoriels ChatGPT et stratégies KDP." />
        <meta property="og:url" content="https://ebookstudio.fr/blog" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "Blog", "name": "Blog Ebookstudio Pro V2",
            "description": "Guides et tutoriels pour créer des ebooks avec l'intelligence artificielle",
            "url": "https://ebookstudio.fr/blog",
            "publisher": { "@type": "Organization", "name": "Ebookstudio Pro V2", "url": "https://ebookstudio.fr" },
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
              <span className="text-xl font-bold text-foreground">Ebookstudio Pro V2</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_nav')); }} className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/blog" className="text-primary font-medium">Blog</Link>
              <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Démo</Link>
              <Link to="/formation" className="text-muted-foreground hover:text-foreground transition-colors">Formation</Link>
            </nav>
            <div className="flex items-center gap-2">
              <a href="https://ebookcluster.com" target="_blank" rel="noopener noreferrer" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_back_btn')); }}>
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">ebookcluster.com</span>
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
              Blog <span className="text-primary">Ebookstudio Pro V2</span>
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

        {/* Modules par catégorie */}
        <section className="pb-6">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/30">Explorer par thème</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Modules & catégories</h2>
              </div>
              {activeCategory && (
                <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>
                  <LayoutGrid className="w-4 h-4 mr-2" /> Tout afficher
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryModules.map((cat) => {
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveCategory(active ? null : cat.name)}
                    className={`group relative rounded-2xl overflow-hidden border transition-all text-left ${
                      active ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/40' : 'border-border hover:border-primary/50 hover:shadow-lg'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="text-white font-semibold text-base md:text-lg leading-tight">{cat.name}</div>
                        <div className="text-white/80 text-xs mt-1">{cat.count} article{cat.count > 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleArticles.map((article, index) => (
                <Link key={index} to={article.slug} className="group">
                  <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0">{article.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="font-medium text-foreground">{article.author}</span>
                        <span>·</span>
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1 ml-auto"><Clock className="w-4 h-4" />{article.readTime}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
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
                      💡 S'ouvre dans un nouvel onglet - votre session sur ebookstudio.fr reste active, fermez simplement l'onglet pour revenir.
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
              <a href="https://ebookcluster.com" target="_blank" rel="noopener noreferrer" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('blog_footer_site')); }}>
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visiter ebookcluster.com
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
                  <span className="font-bold text-foreground">Ebookstudio Pro V2</span>
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
            <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">© 2025 Ebookstudio Pro V2. Tous droits réservés.</div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogPage;
