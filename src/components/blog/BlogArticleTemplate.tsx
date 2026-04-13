import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Clock, ArrowLeft, ArrowRight, ChevronRight, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug, getRelatedArticles, type BlogArticle } from '@/data/blogArticles';

const TableOfContents = ({ items }: { items: BlogArticle['tableOfContents'] }) => (
  <nav className="bg-muted/50 border border-border rounded-xl p-6 mb-8">
    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">📑 Sommaire</h2>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2" style={{ paddingLeft: item.level > 2 ? `${(item.level - 2) * 16}px` : 0 }}>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />{item.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const FaqSection = ({ faq }: { faq: BlogArticle['faq'] }) => (
  <section className="mt-12 border-t border-border pt-10">
    <h2 className="text-2xl font-bold text-foreground mb-6">❓ Questions fréquentes</h2>
    <div className="space-y-4">
      {faq.map((item, i) => (
        <details key={i} className="group bg-muted/50 border border-border rounded-lg">
          <summary className="cursor-pointer p-4 text-foreground font-medium flex items-center justify-between hover:text-primary transition-colors">
            {item.question}
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
          </summary>
          <p className="px-4 pb-4 text-muted-foreground text-sm">{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
);

const CtaBanner = () => (
  <div className="my-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
    <h3 className="text-xl font-bold text-foreground mb-2">🚀 Prêt à créer votre ebook ?</h3>
    <p className="text-muted-foreground mb-4 text-sm">EbookStudio Pro génère des ebooks professionnels avec l'IA en quelques minutes.</p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link to="/demo"><Button variant="outline">Essai gratuit</Button></Link>
      <Link to="/offres"><Button>Voir les offres <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
    </div>
  </div>
);

const RelatedArticles = ({ slugs }: { slugs: string[] }) => {
  const related = getRelatedArticles(slugs);
  if (related.length === 0) return null;
  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">📚 Articles connexes</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((article) => (
          <Link key={article.slug} to={`/blog/${article.slug}`} className="group">
            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <Badge className="mb-2 text-xs bg-primary/10 text-primary border-primary/30">{article.category}</Badge>
                <h3 className="text-foreground font-medium group-hover:text-primary transition-colors text-sm line-clamp-2">{article.title}</h3>
                <p className="text-muted-foreground text-xs mt-1">{article.readTime} de lecture</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

const BlogArticleTemplate = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  if (!article) return <Navigate to="/blog" replace />;

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: article.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };
  const articleSchema = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.metaDescription, url: `https://ebookstudio.fr/blog/${article.slug}`, datePublished: article.dateISO, dateModified: article.dateISO, author: { '@type': 'Organization', name: 'EbookStudio Pro' }, publisher: { '@type': 'Organization', name: 'EbookStudio Pro', url: 'https://ebookstudio.fr' }, mainEntityOfPage: `https://ebookstudio.fr/blog/${article.slug}` };
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ebookstudio.fr' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ebookstudio.fr/blog' }, { '@type': 'ListItem', position: 3, name: article.title, item: `https://ebookstudio.fr/blog/${article.slug}` } ] };

  return (
    <>
      <Helmet>
        <title>{article.metaTitle}</title>
        <meta name="description" content={article.metaDescription} />
        <meta name="keywords" content={article.keyword} />
        <link rel="canonical" href={`https://ebookstudio.fr/blog/${article.slug}`} />
        <meta property="og:title" content={article.metaTitle} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={`https://ebookstudio.fr/blog/${article.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/offres" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary-foreground" /></div>
              <span className="text-xl font-bold text-foreground">EbookStudio Pro</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('article_nav')); }} className="text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/blog" className="text-primary font-medium">Blog</Link>
              <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Démo</Link>
            </nav>
            <Link to="/offres" onClick={() => { import('@/utils/analytics').then(m => m.trackOffresClick('article_cta')); }}>
              <Button className="text-sm">Accès Générateur</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/offres" className="hover:text-foreground">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        <article className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/30">{article.category}</Badge>
                <span className="text-muted-foreground text-sm flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime}</span>
                <span className="text-muted-foreground text-sm">{article.date}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{article.title}</h1>
              <p className="text-lg text-muted-foreground">{article.excerpt}</p>
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 bg-green-500/5"><Target className="w-3 h-3 mr-1" />{article.keyword}</Badge>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 bg-amber-500/5"><TrendingUp className="w-3 h-3 mr-1" />{article.searchVolume}/mois</Badge>
              </div>
            </div>

            <TableOfContents items={article.tableOfContents} />

            <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-foreground prose-h3:text-xl prose-h3:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              <ReactMarkdown
                components={{
                  h2: ({ children, ...props }) => { const id = String(children).toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '').replace(/\s+/g, '-'); return <h2 id={id} {...props}>{children}</h2>; },
                  h3: ({ children, ...props }) => { const id = String(children).toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '').replace(/\s+/g, '-'); return <h3 id={id} {...props}>{children}</h3>; },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            <CtaBanner />
            <FaqSection faq={article.faq} />
            <RelatedArticles slugs={article.relatedSlugs} />

            <div className="mt-12 text-center">
              <Link to="/blog"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Retour au blog</Button></Link>
            </div>
          </div>
        </article>

        <footer className="border-t border-border py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">© 2025 EbookStudio Pro. Tous droits réservés.</div>
        </footer>
      </div>
    </>
  );
};

export default BlogArticleTemplate;
