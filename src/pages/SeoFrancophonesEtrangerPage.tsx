import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUtm } from '@/lib/utmTracking';
import { getStoredRefCode } from '@/hooks/useReferralTracking';
import {
  Sparkles,
  Globe,
  CreditCard,
  CheckCircle,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Languages,
  Gift,
  Download,
} from 'lucide-react';

const SeoFrancophonesEtrangerPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }
    setSubmitting(true);
    try {
      const utm = getStoredUtm();
      await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: email.trim().toLowerCase(),
          lead_magnet: 'publier-kdp-etranger',
          ref_code: getStoredRefCode(),
          utm_source: utm.utm_source || null,
          utm_medium: utm.utm_medium || null,
          utm_campaign: utm.utm_campaign || null,
          landing_url: typeof window !== 'undefined' ? window.location.href : null,
        },
      });
      setDone(true);
      toast.success('Parfait ! Votre guide arrive dans votre boîte mail. 📩');
    } catch {
      toast.error("Une erreur est survenue, réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    document.title = "Créer et vendre un ebook KDP depuis l'étranger | Francophones";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Français expatrié en Suisse, Belgique, Luxembourg, Allemagne ou au Canada ? Créez et vendez votre ebook en français sur Amazon KDP avec l'IA d'Ebookstudio."
      );
    }
  }, []);

  const countries = [
    { flag: '🇨🇭', name: 'Suisse' },
    { flag: '🇧🇪', name: 'Belgique' },
    { flag: '🇱🇺', name: 'Luxembourg' },
    { flag: '🇩🇪', name: 'Allemagne' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🌍', name: 'Reste du monde' },
  ];

  const reassurances = [
    { icon: Globe, title: 'KDP accepte les auteurs hors de France', description: "Amazon KDP est ouvert aux auteurs du monde entier : il suffit d'une adresse et d'un compte bancaire valides, où que vous viviez." },
    { icon: CreditCard, title: 'Paiement international', description: "Vous êtes payé par virement ou chèque sur votre compte local, dans votre pays de résidence, en euros, francs suisses ou dollars." },
    { icon: ShieldCheck, title: 'Fiscalité simple', description: "Un formulaire fiscal en ligne (tax interview) à remplir une seule fois sur KDP suffit pour la plupart des résidents francophones." },
    { icon: Languages, title: '100% en français', description: "L'outil, le support et les ebooks générés sont entièrement en français. Vous restez sur votre marché, sans barrière de langue." },
  ];

  const steps = [
    { number: '1', title: 'Choisissez votre sujet', description: "L'IA vous aide à trouver une niche porteuse sur le marché francophone." },
    { number: '2', title: 'Générez votre ebook', description: 'Texte, structure et illustrations cohérents, en français, créés automatiquement.' },
    { number: '3', title: 'Formatage KDP conforme', description: 'Dimensions, marges et export prêts à téléverser sur Amazon KDP.' },
    { number: '4', title: 'Publiez depuis votre pays', description: 'Mise en vente sur Amazon, paiement sur votre compte local.' },
  ];

  const faqs = [
    {
      question: 'Puis-je publier sur Amazon KDP depuis la Suisse ?',
      answer: "Oui. Amazon KDP est accessible aux résidents suisses. Vous créez un compte gratuit, remplissez le formulaire fiscal une fois, et vous êtes payé en CHF ou EUR sur votre compte bancaire suisse.",
    },
    {
      question: "Comment suis-je payé quand je vis à l'étranger ?",
      answer: "Amazon KDP verse vos royalties par virement bancaire (ou chèque selon le pays) sur votre compte local, chaque mois, dès le seuil minimum atteint. Cela fonctionne en Suisse, Belgique, Luxembourg, Allemagne, au Canada et dans la plupart des pays.",
    },
    {
      question: "Dois-je payer des impôts en France si je vends sur Amazon ?",
      answer: "En règle générale, vous déclarez vos revenus dans votre pays de résidence fiscale. Le formulaire fiscal de KDP (tax interview) gère la retenue à la source. Pour votre situation précise, rapprochez-vous d'un comptable local.",
    },
    {
      question: "L'ebook est-il bien en français ?",
      answer: "Oui, à 100%. Ebookstudio est conçu pour le marché francophone : l'interface, le support et le contenu généré par l'IA sont en français. C'est l'outil idéal pour les francophones expatriés qui visent le lectorat francophone mondial.",
    },
    {
      question: 'Le marché francophone est-il assez grand hors de France ?',
      answer: "Plus de 320 millions de personnes parlent français dans le monde. Suisse, Belgique, Luxembourg, Québec et communautés expatriées forment un lectorat à fort pouvoir d'achat, souvent moins concurrentiel que le marché français.",
    },
  ];

  const captureCard = (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
      <CardContent className="p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Guide gratuit : publier sur KDP depuis l'étranger
          </h2>
          <p className="text-muted-foreground max-w-xl mb-4">
            Recevez par email notre <strong className="text-foreground">guide PDF complet</strong> pour
            créer un compte KDP, être payé sur votre compte local et publier votre ebook en français —
            où que vous viviez (Suisse, Belgique, Luxembourg, Allemagne, Canada).
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            🇨🇭 🇧🇪 🇱🇺 🇩🇪 🇨🇦 &nbsp;Déjà rejoint par des auteurs francophones aux quatre coins du monde.
          </p>

          {done ? (
            <div className="flex items-center gap-2 text-primary font-semibold">
              <CheckCircle className="w-5 h-5" />
              Votre guide arrive dans votre boîte mail. Vérifiez vos spams !
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="text-base py-3 flex-1"
                required
              />
              <Button type="submit" disabled={submitting} className="font-semibold py-3 px-6">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Envoi…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Recevoir le guide
                  </span>
                )}
              </Button>
            </form>
          )}
          <p className="text-[11px] text-muted-foreground mt-3">
            Pas de spam. Désinscription en 1 clic.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <link rel="canonical" href="https://ebookstudio.fr/creer-ebook-kdp-etranger" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: "Créer et vendre un ebook sur Amazon KDP depuis l'étranger (francophones)",
          description: "Guide pour les francophones expatriés (Suisse, Belgique, Luxembourg, Allemagne, Canada) qui veulent créer et vendre un ebook en français sur Amazon KDP avec l'IA d'Ebookstudio.",
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
              <Globe className="w-4 h-4 mr-2" />
              Francophones du monde entier
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Créer et vendre un ebook<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                sur Amazon KDP depuis l'étranger
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Français expatrié en Suisse, Belgique, Luxembourg, Allemagne ou au Canada ? Créez votre
              ebook en français avec l'IA d'Ebookstudio Pro V2 et vendez-le sur Amazon KDP depuis votre pays.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {countries.map((c, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground">
                  <span className="text-lg">{c.flag}</span>
                  {c.name}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 text-white"
                onClick={() => navigate('/offres')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Créer mon ebook
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

      {/* Capture email — au-dessus de la ligne de flottaison */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          {captureCard}
        </div>
      </section>


      {/* Reassurances */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Publier sur KDP depuis l'étranger : tout fonctionne
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reassurances.map((item, idx) => (
              <Card key={idx} className="border-border hover:border-primary/30 transition-all hover:shadow-lg bg-background/50">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
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
            De l'idée à la vente, où que vous soyez
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            4 étapes pour créer un ebook en français et le publier sur Amazon KDP depuis votre pays de résidence
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
          <h2>Vendre des ebooks en français quand on vit à l'étranger</h2>
          <p>
            Vivre en <strong>Suisse, en Belgique, au Luxembourg, en Allemagne ou au Canada</strong> n'est pas un obstacle
            pour publier sur <strong>Amazon KDP</strong> : c'est même un avantage. Vous touchez le lectorat francophone
            mondial — plus de 320 millions de personnes — tout en bénéficiant souvent d'un meilleur pouvoir d'achat local.
          </p>

          <h3>1. Un compte KDP accessible partout</h3>
          <p>
            La création d'un compte Amazon KDP est <strong>gratuite et ouverte aux auteurs du monde entier</strong>.
            Vous renseignez votre adresse de résidence, vos coordonnées bancaires locales et vous remplissez une fois
            le formulaire fiscal en ligne. Aucune société ni adresse en France n'est nécessaire.
          </p>

          <h3>2. Être payé sur votre compte local</h3>
          <p>
            Amazon verse vos royalties chaque mois par <strong>virement bancaire</strong> sur votre compte, dans votre
            devise locale (EUR, CHF, CAD…). Le seuil de paiement est faible, ce qui permet d'encaisser rapidement vos premières ventes.
          </p>

          <h3>3. Un contenu 100% francophone</h3>
          <p>
            Ebookstudio est <strong>pensé pour le marché francophone</strong> : l'IA rédige et illustre vos ebooks en français,
            l'interface et le support sont en français. Vous n'avez aucune barrière de langue, contrairement à une publication
            sur le marché anglophone.
          </p>

          <h3>Pourquoi Ebookstudio est idéal pour les expatriés</h3>
          <p>
            Pas besoin de logiciel de PAO ni de compétences techniques : les agents IA d'<strong>Ebookstudio Pro V2</strong>
            génèrent texte, illustrations et fichier au format conforme aux exigences d'Amazon KDP. Vous publiez depuis
            n'importe quel pays, en quelques clics, et vendez à toute la francophonie.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Questions fréquentes des francophones expatriés
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

      {/* Lead magnet — capture email (rappel) */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-3xl mx-auto">
          {captureCard}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Lancez votre ebook en français, où que vous viviez
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Création, illustrations et formatage KDP générés automatiquement par l'IA.
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
      <footer className="py-10 px-4 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/creer-ebook-ia" className="text-muted-foreground hover:text-primary transition-colors">Créer un ebook avec l'IA</a></li>
                <li><a href="/guide-kdp-enfants" className="text-muted-foreground hover:text-primary transition-colors">Formater un livre pour enfants sur KDP</a></li>
                <li><a href="/ecrire-livre-chatgpt" className="text-muted-foreground hover:text-primary transition-colors">Écrire un livre avec ChatGPT</a></li>
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

export default SeoFrancophonesEtrangerPage;
