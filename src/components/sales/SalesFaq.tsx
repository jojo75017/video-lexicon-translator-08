import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SalesFaq: React.FC = () => {
  const faqs = [
    {
      question: "Comment fonctionne le paiement unique ?",
      answer: "Vous payez 37€ une seule fois et vous obtenez un accès à vie. Pas d'abonnement, pas de frais cachés. Vous recevez immédiatement votre code d'accès par email après le paiement."
    },
    {
      question: "Ai-je besoin de compétences techniques ?",
      answer: "Non ! EbookStudio Pro est conçu pour les débutants. L'interface est intuitive et l'IA fait 90% du travail. Vous guidez simplement le sujet et le style, le reste est automatisé."
    },
    {
      question: "Puis-je vendre les ebooks générés sur Amazon KDP ?",
      answer: "Oui, absolument ! Vous gardez 100% des droits sur tout ce que vous créez. Nos outils KDP intégrés vous aident même à optimiser vos descriptions et mots-clés pour maximiser vos ventes."
    },
    {
      question: "Que se passe-t-il si je ne suis pas satisfait ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 30 jours. Si l'outil ne vous convient pas, envoyez-nous un simple email et nous vous remboursons intégralement, sans question."
    },
    {
      question: "Les formations sont-elles vraiment incluses ?",
      answer: "Oui ! Toutes les formations (texte + audio) sont directement intégrées dans l'outil. Vous ne serez jamais perdu : des guides étape par étape vous accompagnent dans chaque module."
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Questions fréquentes
          </div>
          <h2 className="text-3xl font-bold mb-4">Vous hésitez encore ?</h2>
          <p className="text-muted-foreground">
            Voici les réponses aux questions les plus posées
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                <span className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pl-9">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Vous avez d'autres questions ?
          </p>
          <Link to="/faq">
            <Button variant="outline" size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Voir toutes les FAQ
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SalesFaq;
