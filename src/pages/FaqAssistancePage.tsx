import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, MessageCircle, Clock, CheckCircle, AlertCircle, Book, Key, CreditCard, RefreshCw, ArrowLeft, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// SEO Meta + Schema.org FAQ pour la page
const useFaqSeo = (faqItems: { question: string; answer: string }[]) => {
  useEffect(() => {
    document.title = "FAQ & Assistance - EbookStudio Pro | Support Client";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Besoin d'aide avec EbookStudio Pro ? Trouvez des réponses à vos questions sur l'accès, le paiement, l'utilisation du générateur d'ebook IA. Support client réactif.");
    }
    
    // Schema.org FAQPage pour SEO
    const existingSchema = document.querySelector('script[data-faq-schema]');
    if (existingSchema) existingSchema.remove();
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer.replace(/\*\*/g, '').replace(/\n/g, ' ')
        }
      }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-faq-schema]');
      if (schemaScript) schemaScript.remove();
    };
  }, [faqItems]);
};

export const FaqAssistancePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleResendCode = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('resend-access-code', {
        body: { email: email.trim().toLowerCase() }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('✅ Code renvoyé ! Vérifiez votre boîte mail (et les spams)');
      } else {
        toast.error(data.error || 'Aucun abonnement trouvé pour cet email');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error('Erreur lors de l\'envoi. Contactez-nous par email.');
    } finally {
      setIsResending(false);
    }
  };

  const faqItems = [
    {
      category: 'access',
      question: "Je n'ai pas reçu mon code d'accès après paiement",
      answer: `Pas de panique ! Voici les étapes à suivre :
      
1. **Vérifiez vos spams** - L'email peut être filtré automatiquement
2. **Attendez quelques minutes** - La livraison peut prendre jusqu'à 5 minutes
3. **Utilisez le formulaire ci-dessus** pour renvoyer votre code
4. Si rien ne fonctionne, contactez-nous à boubetgeorges@gmail.com avec votre preuve de paiement`
    },
    {
      category: 'access',
      question: "Mon code EBK-XXXXXX ne fonctionne pas",
      answer: `Vérifiez ces points :

1. **Format exact** : Le code doit être au format EBK-XXXXXX (6 caractères après le tiret)
2. **Majuscules** : Entrez le code en MAJUSCULES
3. **Email correct** : Utilisez l'email exact de votre achat
4. **Copier-coller** : Évitez les espaces avant/après le code

Si le problème persiste, contactez-nous avec une capture d'écran de l'erreur.`
    },
    {
      category: 'payment',
      question: "J'ai payé mais je n'ai rien reçu",
      answer: `Après votre paiement PayPal ou carte bancaire :

1. Vous êtes redirigé vers une page de confirmation
2. Entrez votre email sur cette page
3. Nous recevons une notification et créons votre accès
4. Vous recevez votre code par email sous 24h maximum (souvent en quelques minutes)

**Conseil** : Gardez votre reçu PayPal comme preuve de paiement.`
    },
    {
      category: 'payment',
      question: "Puis-je obtenir un remboursement ?",
      answer: `Oui ! Nous offrons une **garantie 30 jours satisfait ou remboursé**.

Si vous n'êtes pas satisfait pour quelque raison que ce soit :
1. Envoyez un email à boubetgeorges@gmail.com
2. Indiquez votre email d'achat et la raison (optionnel)
3. Remboursement intégral sous 48-72h

Aucune question posée, aucune justification nécessaire.`
    },
    {
      category: 'usage',
      question: "Comment fonctionne le générateur d'ebook ?",
      answer: `EbookStudio Pro utilise un workflow éditorial en 14 étapes :

1. **Directeur Éditorial** - Analyse votre sujet et audience
2. **Analyse Marché** - Identifie les mots-clés KDP rentables
3. **Architecte Contenu** - Structure vos chapitres
4. **Rédaction Experte** - Génère le contenu de chaque chapitre
5-14. Révision, packaging, couverture, export...

Tout est automatisé. Vous entrez votre sujet, l'IA fait le reste !`
    },
    {
      category: 'usage',
      question: "Combien d'ebooks puis-je créer ?",
      answer: `Avec l'accès Lifetime à 37€, vous avez un accès **illimité** :

✅ Nombre d'ebooks illimité
✅ Générations de chapitres illimitées  
✅ Couvertures illimitées
✅ Exports Google Docs/Word illimités
✅ Mises à jour gratuites à vie

La seule limite est votre imagination !`
    },
    {
      category: 'usage',
      question: "Dois-je fournir ma propre clé API OpenAI ?",
      answer: `Non, ce n'est pas obligatoire mais c'est possible :

**Option 1 - Sans clé API** : Utilisez notre quota inclus (limité)
**Option 2 - Avec votre clé** : Entrez votre clé OpenAI dans Paramètres pour un usage illimité

Votre clé reste privée et stockée localement sur votre appareil uniquement.`
    },
    {
      category: 'technical',
      question: "Sur quels appareils puis-je utiliser EbookStudio Pro ?",
      answer: `EbookStudio Pro fonctionne sur tous les appareils avec un navigateur web :

✅ Ordinateur (Windows, Mac, Linux)
✅ Tablette (iPad, Android)
✅ Smartphone (iPhone, Android) - expérience optimisée pour écran large

Aucune installation nécessaire. Tout fonctionne dans votre navigateur.`
    },
    {
      category: 'technical',
      question: "Mes données sont-elles sécurisées ?",
      answer: `Oui, nous prenons la sécurité très au sérieux :

🔒 Connexion HTTPS chiffrée
🔒 Données stockées sur serveurs sécurisés (Supabase)
🔒 Aucun partage de données avec des tiers
🔒 Clés API stockées uniquement sur votre appareil

Vos ebooks vous appartiennent à 100%.`
    }
  ];

  // Hook SEO avec Schema.org
  useFaqSeo(faqItems);

  // Filtrage des FAQ par recherche
  const filteredFaqItems = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [searchQuery, faqItems]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'access': return <Key className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'usage': return <Book className="h-4 w-4" />;
      case 'technical': return <HelpCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'access': return 'Accès';
      case 'payment': return 'Paiement';
      case 'usage': return 'Utilisation';
      case 'technical': return 'Technique';
      default: return 'Général';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-xl font-bold text-primary">FAQ & Assistance</h1>
          <Button variant="outline" onClick={() => navigate('/offres')} className="gap-2">
            Voir l'offre
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Comment pouvons-nous vous aider ?</h1>
          <p className="text-xl text-muted-foreground">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        {/* Resend Code Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-fuchsia-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              Code perdu ? Renvoyez-le instantanément
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Entrez l'email de votre achat"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleResendCode} 
                disabled={isResending}
                className="bg-primary hover:bg-primary/90"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Renvoyer mon code
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              💡 Vérifiez aussi vos spams si vous ne recevez rien
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-2xl text-emerald-600">95%</p>
            <p className="text-sm text-muted-foreground">Problèmes résolus</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-semibold">Réponse en -24h</p>
            <p className="text-sm text-muted-foreground">Par email</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold">Garantie 30 jours</p>
            <p className="text-sm text-muted-foreground">Satisfait ou remboursé</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-md transition-shadow">
            <MessageCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">Support inclus</p>
            <p className="text-sm text-muted-foreground">À vie avec votre accès</p>
          </Card>
        </div>

        {/* Barre de recherche FAQ */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher dans la FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {filteredFaqItems.length} résultat(s) trouvé(s)
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune question ne correspond à votre recherche. 
                  <br />Essayez d'autres mots-clés ou contactez-nous directement.
                </p>
              ) : (
                filteredFaqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="animate-in fade-in duration-300">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="shrink-0">
                          {getCategoryIcon(item.category)}
                          <span className="ml-1">{getCategoryLabel(item.category)}</span>
                        </Badge>
                        <span>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line pl-4 border-l-2 border-primary/20 ml-2">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-10 w-10 mx-auto text-amber-400" />
            <h3 className="text-2xl font-bold">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-slate-300">
              Contactez-nous directement, nous répondons sous 24h maximum
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = 'mailto:boubetgeorges@gmail.com?subject=Assistance EbookStudio Pro'}
                className="gap-2"
              >
                <Mail className="h-5 w-5" />
                boubetgeorges@gmail.com
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center pt-8">
          <p className="text-muted-foreground mb-4">Pas encore client ?</p>
          <Button 
            size="lg" 
            onClick={() => navigate('/offres')}
            className="bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-90"
          >
            Découvrir EbookStudio Pro → 37€ à vie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaqAssistancePage;
