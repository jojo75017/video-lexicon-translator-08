import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Bot,
  Target,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';

const SeoGenerateurEbookPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Générateur Ebook IA Gratuit | Créez votre Livre Automatiquement";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Générateur d'ebook IA professionnel. Créez un livre complet automatiquement avec intelligence artificielle. Essai gratuit, export Amazon KDP inclus.");
    }
  }, []);

  const benefits = [
    { icon: Clock, title: "24h au lieu de 6 mois", description: "Créez un ebook complet en une journée" },
    { icon: Bot, title: "14 modules IA", description: "Workflow éditorial professionnel automatisé" },
    { icon: Target, title: "Optimisé KDP", description: "Métadonnées et format Amazon générés" },
    { icon: DollarSign, title: "Revenus passifs", description: "Publiez et gagnez sur Amazon" },
  ];

  const comparisons = [
    { feature: "Temps de création", traditional: "3-6 mois", ebookiapro: "24-48 heures" },
    { feature: "Coût ghostwriter", traditional: "2000-5000€", ebookiapro: "67€ (à vie)" },
    { feature: "Couverture pro", traditional: "150-500€", ebookiapro: "Inclus" },
    { feature: "Optimisation KDP", traditional: "Formation 300€+", ebookiapro: "Automatique" },
    { feature: "Corrections & relecture", traditional: "500-1500€", ebookiapro: "IA intégrée" },
  ];

  const testimonials = [
    { name: "Marie L.", role: "Auteure débutante", text: "J'ai publié mon premier ebook en 3 jours. Incroyable !", rating: 5 },
    { name: "Thomas D.", role: "Entrepreneur", text: "5 ebooks publiés en 2 mois. Mes revenus Amazon ont explosé.", rating: 5 },
    { name: "Sophie M.", role: "Coach bien-être", text: "L'outil parfait pour créer du contenu de valeur rapidement.", rating: 5 },
  ];

  const faqs = [
    { question: "Qu'est-ce qu'un générateur d'ebook IA ?", answer: "Un générateur d'ebook IA est un outil qui utilise l'intelligence artificielle pour créer automatiquement des livres numériques complets : structure, chapitres, contenu, couverture et formatage." },
    { question: "Le générateur est-il vraiment gratuit ?", answer: "EbookStudio Pro propose un essai gratuit avec 3 plans d'ebooks. L'accès complet à vie est ensuite à 67€, incluant toutes les fonctionnalités et mises à jour futures." },
    { question: "Les ebooks générés sont-ils uniques ?", answer: "Oui, chaque ebook est original et unique. Le système inclut un validateur anti-plagiat et une réécriture naturelle pour garantir l'originalité du contenu." },
    { question: "Puis-je utiliser le générateur pour créer des ebooks à vendre ?", answer: "Absolument ! Les ebooks créés vous appartiennent entièrement. Vous pouvez les vendre sur Amazon KDP, votre site, ou toute autre plateforme." },
    { question: "Quels types d'ebooks puis-je créer ?", answer: "Le générateur supporte tous les genres : guides pratiques, développement personnel, fiction, romance, thriller, cuisine, business, et bien plus avec 17 templates spécialisés." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "EbookStudio Pro - Générateur Ebook IA",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "67", "priceCurrency": "EUR" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "127" }
        })
      }} />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 px-4 py-1">
              <Zap className="w-4 h-4 mr-2" />
              Générateur IA #1 en France
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Générateur d'Ebook IA<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Créez votre Livre en 24h
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Le générateur d'ebook le plus avancé. 14 modules IA pour créer, structurer et publier 
              votre livre sur Amazon KDP automatiquement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 text-white"
                onClick={() => navigate('/offres')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Essayer le générateur
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-border text-foreground" onClick={() => navigate('/demo')}>
                Démo gratuite
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-muted-foreground">Satisfaction garantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Pourquoi choisir notre générateur d'ebook ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="border-border hover:border-primary/30 transition-all hover:shadow-lg bg-background/50">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Générateur IA vs Méthode Traditionnelle
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Économisez temps et argent avec notre générateur d'ebook
          </p>
          
          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-background/50">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center font-semibold text-muted-foreground">Traditionnel</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">EbookStudio</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-6 py-4 font-medium text-foreground">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.traditional}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        {row.ebookiapro}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Ils ont utilisé notre générateur d'ebook
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-border bg-background/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
          <h2>Le meilleur générateur d'ebook IA en 2025</h2>
          <p>
            <strong>EbookStudio Pro</strong> est le générateur d'ebook le plus complet du marché. 
            Contrairement aux outils basiques qui se contentent de générer du texte, notre plateforme 
            offre un <strong>workflow éditorial professionnel en 14 étapes</strong>.
          </p>
          <h3>Ce que notre générateur d'ebook inclut :</h3>
          <ul>
            <li><strong>Directeur éditorial IA</strong> : Vision stratégique et optimisation du titre</li>
            <li><strong>Analyse de marché</strong> : Mots-clés KDP et positionnement</li>
            <li><strong>Architecte de contenu</strong> : Structure professionnelle auto-générée</li>
            <li><strong>Rédaction experte</strong> : Chapitres détaillés et engageants</li>
            <li><strong>Réécriture naturelle</strong> : Style humain, anti-détection IA</li>
            <li><strong>Générateur de couvertures</strong> : 17 templates professionnels</li>
            <li><strong>Export KDP</strong> : Format prêt pour Amazon en un clic</li>
          </ul>
          <h3>Pour qui est ce générateur d'ebook ?</h3>
          <p>Notre générateur s'adresse à :</p>
          <ul>
            <li>Les <strong>entrepreneurs</strong> qui veulent créer des lead magnets</li>
            <li>Les <strong>coachs et formateurs</strong> pour valoriser leur expertise</li>
            <li>Les <strong>auteurs débutants</strong> qui veulent se lancer rapidement</li>
            <li>Les <strong>marketeurs</strong> cherchant des revenus passifs sur Amazon</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            FAQ - Générateur d'Ebook IA
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-border bg-background/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
              }))
            })
          }} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Essayez le meilleur générateur d'ebook IA
          </h2>
          <p className="text-xl opacity-90 mb-8">
            3 plans gratuits pour tester • Accès complet à 67€ à vie
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 shadow-xl font-bold"
            onClick={() => navigate('/offres')}
          >
            <Zap className="w-5 h-5 mr-2" />
            Créer mon premier ebook
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ecrire-livre-chatgpt" className="text-muted-foreground hover:text-primary transition-colors">Écrire un livre avec ChatGPT</a></li>
                <li><a href="/creer-ebook-ia" className="text-muted-foreground hover:text-primary transition-colors">Créer un ebook avec l'IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/offres" className="text-muted-foreground hover:text-primary transition-colors">Voir les offres</a></li>
                <li><a href="/demo" className="text-muted-foreground hover:text-primary transition-colors">Essai gratuit</a></li>
                <li><a href="/formation" className="text-muted-foreground hover:text-primary transition-colors">Formation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/valeur-offre" className="text-muted-foreground hover:text-primary transition-colors">Valeur de l'offre</a></li>
                <li><a href="/ebook-planner" className="text-muted-foreground hover:text-primary transition-colors">Accéder au générateur</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm">
            <p className="text-muted-foreground">© 2025 EbookStudio Pro - Le meilleur générateur d'ebook IA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoGenerateurEbookPage;
