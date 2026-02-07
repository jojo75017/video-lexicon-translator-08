import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookOpen, Clock, ArrowLeft, ArrowRight, ChevronRight, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { getArticleBySlug, getRelatedArticles, type BlogArticle } from '@/data/blogArticles';

const TableOfContents = ({ items }: { items: BlogArticle['tableOfContents'] }) => (
  <nav className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      📑 Sommaire
    </h2>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="text-white/60 hover:text-violet-400 transition-colors text-sm flex items-center gap-2"
            style={{ paddingLeft: item.level > 2 ? `${(item.level - 2) * 16}px` : 0 }}
          >
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const FaqSection = ({ faq }: { faq: BlogArticle['faq'] }) => (
  <section className="mt-12 border-t border-white/10 pt-10">
    <h2 className="text-2xl font-bold text-white mb-6">❓ Questions fréquentes</h2>
    <div className="space-y-4">
      {faq.map((item, i) => (
        <details key={i} className="group bg-white/5 border border-white/10 rounded-lg">
          <summary className="cursor-pointer p-4 text-white font-medium flex items-center justify-between hover:text-violet-400 transition-colors">
            {item.question}
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
          </summary>
          <p className="px-4 pb-4 text-white/60 text-sm">{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
);

const CtaBanner = () => (
  <div className="my-10 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl p-6 text-center">
    <h3 className="text-xl font-bold text-white mb-2">
      🚀 Prêt à créer votre ebook ?
    </h3>
    <p className="text-white/60 mb-4 text-sm">
      EbookStudio Pro génère des ebooks professionnels avec l'IA en quelques minutes.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link to="/demo">
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Essai gratuit
        </Button>
      </Link>
      <Link to="/offres">
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
          Voir les offres
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  </div>
);

const RelatedArticles = ({ slugs }: { slugs: string[] }) => {
  const related = getRelatedArticles(slugs);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <h2 className="text-2xl font-bold text-white mb-6">📚 Articles connexes</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((article) => (
          <Link key={article.slug} to={`/blog/${article.slug}`} className="group">
            <Card className="bg-white/5 border-white/10 hover:border-violet-500/50 transition-all">
              <CardContent className="p-4">
                <Badge className="mb-2 text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">
                  {article.category}
                </Badge>
                <h3 className="text-white font-medium group-hover:text-violet-400 transition-colors text-sm line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-white/50 text-xs mt-1">{article.readTime} de lecture</p>
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

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    url: `https://ebookstudio.fr/blog/${article.slug}`,
    datePublished: article.dateISO,
    dateModified: article.dateISO,
    author: { '@type': 'Organization', name: 'EbookStudio Pro' },
    publisher: {
      '@type': 'Organization',
      name: 'EbookStudio Pro',
      url: 'https://ebookstudio.fr',
    },
    mainEntityOfPage: `https://ebookstudio.fr/blog/${article.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ebookstudio.fr' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ebookstudio.fr/blog' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://ebookstudio.fr/blog/${article.slug}` },
    ],
  };

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
              <Link to="/offres" className="text-white/70 hover:text-white transition-colors">Accueil</Link>
              <Link to="/blog" className="text-violet-400 font-medium">Blog</Link>
              <Link to="/demo" className="text-white/70 hover:text-white transition-colors">Démo</Link>
            </nav>
            <Link to="/offres">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-sm">
                Accès Générateur
              </Button>
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-white/40">
            <Link to="/offres" className="hover:text-white/60">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-white/60">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60 truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        {/* Article */}
        <article className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                  {article.category}
                </Badge>
                <span className="text-white/50 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {article.readTime}
                </span>
                <span className="text-white/50 text-sm">{article.date}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>

              <p className="text-lg text-white/60">{article.excerpt}</p>

              <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  <Target className="w-3 h-3 mr-1" />
                  {article.keyword}
                </Badge>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/10">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {article.searchVolume}/mois
                </Badge>
              </div>
            </div>

            {/* Table of Contents */}
            <TableOfContents items={article.tableOfContents} />

            {/* Content */}
            <div className="prose prose-invert prose-violet max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-white prose-h3:text-xl prose-h3:text-white/90 prose-p:text-white/70 prose-li:text-white/70 prose-strong:text-white prose-a:text-violet-400 hover:prose-a:text-violet-300">
              <ReactMarkdown
                components={{
                  h2: ({ children, ...props }) => {
                    const id = String(children)
                      .toLowerCase()
                      .replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h2 id={id} {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const id = String(children)
                      .toLowerCase()
                      .replace(/[^a-z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h3 id={id} {...props}>{children}</h3>;
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Mid-article CTA */}
            <CtaBanner />

            {/* FAQ */}
            <FaqSection faq={article.faq} />

            {/* Related Articles */}
            <RelatedArticles slugs={article.relatedSlugs} />

            {/* Back to blog */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au blog
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 bg-slate-950/50">
          <div className="container mx-auto px-4 text-center text-white/40 text-sm">
            © 2025 EbookStudio Pro. Tous droits réservés.
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogArticleTemplate;
