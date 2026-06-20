import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InlineLeadCapture from '@/components/marketing/InlineLeadCapture';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Baby,
  Image as ImageIcon,
  Ruler,
  CheckCircle,
  ArrowRight,
  Bot,
  FileText,
  Palette,
  Layers,
} from 'lucide-react';

const SeoGuideKdpEnfantsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Formater un livre pour enfants sur KDP";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Guide complet pour formater un livre pour enfants sur Amazon KDP : mise en page fixe (fixed layout), résolution des images, dimensions. L'IA d'Ebookstudio automatise tout."
      );
    }
  }, []);

  const requirements = [
    { icon: Layers, title: 'Mise en page fixe', description: 'Le « fixed layout » garde texte et illustrations alignés sur chaque page.' },
    { icon: ImageIcon, title: 'Résolution des images', description: 'Illustrations 300 DPI minimum, pleine page sans pixellisation.' },
    { icon: Ruler, title: 'Dimensions normées', description: 'Formats carrés 21,59×21,59 cm ou portrait 20,32×25,4 cm acceptés par KDP.' },
    { icon: Palette, title: 'Marges & fonds perdus', description: 'Fonds perdus (bleed) pour les images bord à bord et marges intérieures correctes.' },
  ];

  const steps = [
    { number: '1', title: 'Choisissez la tranche d\'âge', description: 'L\'IA adapte longueur, vocabulaire et structure au public visé.' },
    { number: '2', title: 'Générez histoire + illustrations', description: 'Texte et visuels cohérents, personnages constants page après page.' },
    { number: '3', title: 'Formatage automatique KDP', description: 'Fixed layout, résolution image et dimensions appliqués automatiquement.' },
    { number: '4', title: 'Exportez et publiez', description: 'Fichier conforme aux exigences Amazon KDP, prêt à téléverser.' },
  ];

  const faqs = [
    {
      question: 'Quel format choisir pour un livre pour enfants sur KDP ?',
      answer: "Pour un album illustré, privilégiez le format carré 21,59×21,59 cm ou le portrait 20,32×25,4 cm. Ces dimensions sont reconnues par Amazon KDP et idéales pour les illustrations pleine page.",
    },
    {
      question: "Qu'est-ce que le « fixed layout » et pourquoi est-il indispensable ?",
      answer: "Le fixed layout (mise en page fixe) verrouille la position du texte et des images sur chaque page. Contrairement au reflowable, il garantit que les illustrations et le texte restent parfaitement alignés, ce qui est essentiel pour les livres jeunesse.",
    },
    {
      question: 'Quelle résolution d\'image faut-il pour un livre jeunesse KDP ?',
      answer: "Amazon recommande 300 DPI pour l'impression. Les illustrations pleine page doivent être en haute résolution pour éviter toute pixellisation à l'impression.",
    },
    {
      question: "L'IA d'Ebookstudio gère-t-elle vraiment le formatage automatiquement ?",
      answer: "Oui. Les agents IA d'Ebookstudio Pro V2 appliquent automatiquement les exigences KDP pour la jeunesse : mise en page fixe, résolution des images et dimensions conformes, pour un fichier prêt à publier.",
    },
    {
      question: 'Faut-il savoir dessiner pour créer un livre illustré pour enfants ?',
      answer: "Non. Le générateur d'illustrations IA crée des visuels cohérents et professionnels à partir de vos descriptions, sans aucune compétence en dessin.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <link rel="canonical" href="https://ebookstudio.fr/guide-kdp-enfants" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Formater un livre pour enfants sur Amazon KDP : le guide',
          description: "Exigences de formatage des livres jeunesse sur Amazon KDP (fixed layout, résolution image, dimensions) et automatisation par l'IA d'Ebookstudio.",
          author: { '@type': 'Organization', name: 'Ebookstudio Pro V2' },
          publisher: { '@type': 'Organization', name: 'Ebookstudio Pro V2' },
          datePublished: '2026-06-19',
          dateModified: new Date().toISOString().split('T')[0],
        }),
      }} />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 px-4 py-1">
              <Baby className="w-4 h-4 mr-2" />
              Niche Livres pour Enfants
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Formater un livre pour enfants<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                sur Amazon KDP
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Mise en page fixe, résolution des images, dimensions normées : maîtrisez les exigences
              spécifiques de KDP pour la jeunesse. L'IA d'Ebookstudio Pro V2 automatise tout le formatage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 text-white"
                onClick={() => navigate('/offres')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Créer mon livre pour enfants
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-border text-foreground"
                onClick={() => navigate('/demo')}
              >
                Essayer gratuitement
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Les exigences de formatage KDP pour la jeunesse
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, idx) => (
              <Card key={idx} className="border-border hover:border-primary/30 transition-all hover:shadow-lg bg-background/50">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <req.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{req.title}</h3>
                  <p className="text-muted-foreground text-sm">{req.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Comment l'IA automatise le formatage de votre livre jeunesse
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            4 étapes pour passer de l'idée à un album illustré conforme aux normes Amazon KDP
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg shadow-primary/25">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-accent/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
          <h2>Formater un livre pour enfants sur KDP : ce qui change</h2>
          <p>
            Un livre pour enfants ne se formate pas comme un roman. Les <strong>illustrations pleine page</strong>,
            le faible volume de texte et l'importance de la mise en page imposent des règles précises sur
            <strong> Amazon KDP</strong>. Maîtriser ces exigences évite les rejets de fichier et garantit un rendu professionnel.
          </p>

          <h3>1. La mise en page fixe (fixed layout)</h3>
          <p>
            Pour la jeunesse, le format « reflowable » classique ne convient pas : il déplacerait le texte et
            séparerait les illustrations. Le <strong>fixed layout</strong> verrouille chaque page comme une image,
            préservant l'harmonie entre texte et dessin — indispensable pour les albums illustrés.
          </p>

          <h3>2. La résolution des images</h3>
          <p>
            Amazon exige des illustrations en <strong>300 DPI</strong> pour l'impression. Une image trop légère
            apparaîtra floue ou pixellisée. Chaque visuel pleine page doit donc être généré en haute résolution,
            avec des <strong>fonds perdus (bleed)</strong> pour les images bord à bord.
          </p>

          <h3>3. Les dimensions conformes</h3>
          <p>
            Les formats les plus utilisés pour la jeunesse sont le <strong>carré 21,59×21,59 cm</strong> et le
            <strong> portrait 20,32×25,4 cm</strong>. Le choix du format influence les marges, le dos et la couverture.
          </p>

          <h3>Comment Ebookstudio automatise tout cela</h3>
          <p>
            Les agents IA d'<strong>Ebookstudio Pro V2</strong> appliquent automatiquement ces contraintes : génération
            d'illustrations cohérentes en haute résolution, mise en page fixe, dimensions et marges conformes KDP.
            Vous obtenez un fichier prêt à publier, sans logiciel de PAO ni compétence technique.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Questions fréquentes sur le formatage des livres pour enfants
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                    <span className="text-primary">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-6">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Créez votre livre pour enfants, déjà formaté pour KDP
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Histoire, illustrations et formatage conforme générés automatiquement par l'IA.
          </p>

          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 shadow-xl font-bold"
            onClick={() => navigate('/offres')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Commencer maintenant
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <div className="px-4"><InlineLeadCapture /></div>
      <footer className="py-10 px-4 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/creer-ebook-ia" className="text-muted-foreground hover:text-primary transition-colors">Créer un ebook avec l'IA</a></li>
                <li><a href="/ecrire-livre-chatgpt" className="text-muted-foreground hover:text-primary transition-colors">Écrire un livre avec ChatGPT</a></li>
                <li><a href="/blog/creer-livre-enfant-ia-kdp" className="text-muted-foreground hover:text-primary transition-colors">Créer un livre pour enfants avec l'IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/offres" className="text-muted-foreground hover:text-primary transition-colors">Voir les offres</a></li>
                <li><a href="/demo" className="text-muted-foreground hover:text-primary transition-colors">Essai gratuit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ebook-planner" className="text-muted-foreground hover:text-primary transition-colors">Accéder au générateur</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm">
            <p className="text-muted-foreground">© 2026 Ebookstudio Pro V2 - Générateur d'ebooks avec l'IA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoGuideKdpEnfantsPage;
