import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

const SalesFaq: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Comment fonctionne le paiement unique à 67€ ?",
      answer: "Vous payez 67€ une seule fois via PayPal et vous obtenez un accès à vie à l'ensemble de la plateforme. Pas d'abonnement mensuel, pas de frais cachés. Vous recevez immédiatement votre code d'accès par email après le paiement. Des facilités sont disponibles : 2×35€ ou 3×25€."
    },
    {
      question: "Ai-je besoin de compétences techniques ou de savoir écrire ?",
      answer: "Absolument pas ! EbookStudio est conçu pour les débutants complets. L'IA Gemini 3 Flash rédige l'intégralité de votre ebook. Vous choisissez simplement le sujet, le ton et le style — l'IA s'occupe de tout le reste, de la structure aux chapitres en passant par la couverture."
    },
    {
      question: "Qu'est-ce que Gemini 3 Flash et combien ça coûte ?",
      answer: "Gemini 3 Flash est l'IA de Google, plus rapide et moins chère qu'OpenAI. Vous créez un compte gratuit sur Google AI Studio, générez votre clé API en 2 minutes, et ne payez que ce que vous consommez directement à Google. Coût moyen : 0,20€ à 0,50€ par ebook complet. Un guide vidéo étape par étape est inclus après l'achat."
    },
    {
      question: "Puis-je vendre les ebooks générés sur Amazon KDP ?",
      answer: "Oui, vous gardez 100% des droits sur tout ce que vous créez. Nos outils KDP intégrés (optimisation de description, mots-clés, catégories, suivi BSR) vous aident à maximiser vos ventes et votre visibilité sur Amazon."
    },
    {
      question: "Combien de temps faut-il pour créer un ebook complet ?",
      answer: "Avec le workflow en 7 étapes guidées par l'IA, vous pouvez avoir un ebook complet (plan, chapitres, couverture, formatage KDP) en moins d'une heure. La rédaction d'un chapitre prend environ 30 secondes à l'IA."
    },
    {
      question: "Que se passe-t-il si je ne suis pas satisfait ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 30 jours, sans condition. Si l'outil ne vous convient pas, envoyez-nous un simple email et nous vous remboursons intégralement. Vous ne prenez aucun risque."
    },
    {
      question: "Les formations et le support sont-ils inclus ?",
      answer: "Oui ! Tout est inclus dans votre accès : formations vidéo intégrées à chaque module, guides pas-à-pas, tutoriels de configuration API, et accès au forum communautaire. Vous ne serez jamais seul."
    },
    {
      question: "Puis-je créer des audiobooks et des BD ?",
      answer: "Oui ! EbookStudio inclut un module audiobook (via Azure Speech, optionnel et gratuit jusqu'à 5 audiobooks/mois) et un module BD/Comics avec génération de scénarios et mise en page automatique. Tout est inclus sans surcoût."
    },
    {
      question: "Le prix de 67€ va-t-il augmenter ?",
      answer: "Oui. Le prix normal passera à 147€ le 1er juillet. Parce que j'accompagne les créateurs et que je veux rendre cet outil accessible, le tarif de lancement est à 67€ à vie avec toutes les futures mises à jour incluses. Profitez-en avant l'augmentation !"
    },
    {
      question: "Puis-je gagner de l'argent en recommandant EbookStudio ?",
      answer: "Oui ! Notre programme de parrainage vous permet de gagner 30€ par vente pour chaque personne que vous recommandez. Vous recevez un lien unique dans votre espace membre, et vos commissions sont suivies en temps réel dans votre tableau de bord. C'est un excellent moyen de rentabiliser votre investissement dès les premières recommandations."
    },
    {
      question: "Comment fonctionne le paiement en plusieurs fois ?",
      answer: "Vous pouvez choisir de payer en 2 fois (2×35€) ou en 3 fois (3×25€) via PayPal. Vous obtenez un accès immédiat dès le premier paiement. Les prélèvements suivants sont automatiques, sans aucune action de votre part."
    }
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,hsl(var(--primary)/0.03),transparent)]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ — 11 réponses essentielles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground">
            Toutes vos questions,
            <span className="text-muted-foreground"> nos réponses.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Nous avons rassemblé les questions les plus posées par nos utilisateurs avant de se lancer.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="bg-card backdrop-blur-sm rounded-xl border border-border px-6 shadow-sm hover:border-primary/20 transition-colors duration-300 data-[state=open]:border-primary/30 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-sm md:text-base text-foreground">
                <span className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pl-10 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <p className="font-bold text-lg mb-2 text-foreground">Encore des doutes ?</p>
            <p className="text-muted-foreground text-sm mb-6">
              Réservez un appel Zoom gratuit pour voir l'outil en direct, ou lancez-vous directement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold px-8 py-5 rounded-xl shadow-lg shadow-primary/20"
                onClick={() => navigate('/upsell-paiement?plan=pro')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Accès Pro — 67€ à vie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <a href="https://calendly.com/boubetgeorges/nouvelle-reunion" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2 border-border text-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50">
                  <MessageCircle className="w-4 h-4" />
                  Réserver un Zoom gratuit
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesFaq;
