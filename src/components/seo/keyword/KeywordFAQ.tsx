
import React from 'react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react";

const KeywordFAQ: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
        Questions fréquentes sur les mots-clés
      </h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            Comment choisir les meilleurs mots-clés pour mon site ?
          </AccordionTrigger>
          <AccordionContent>
            Pour choisir les meilleurs mots-clés, recherchez ceux qui ont un volume de recherche élevé mais une difficulté modérée. 
            Privilégiez les mots-clés pertinents pour votre audience et qui correspondent à votre contenu. 
            Les mots-clés longue traîne (3-5 mots) sont souvent moins compétitifs et plus ciblés.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            Quelle est la différence entre les mots-clés standards et longue traîne ?
          </AccordionTrigger>
          <AccordionContent>
            Les mots-clés standards sont généralement courts (1-2 mots) et ont un volume de recherche élevé mais une forte concurrence.
            Les mots-clés longue traîne sont plus longs (3-5 mots ou plus), plus spécifiques, avec un volume de recherche inférieur mais 
            une concurrence moindre, ce qui les rend souvent plus faciles à cibler et avec un taux de conversion plus élevé.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            Comment utiliser l'analyse des concurrents ?
          </AccordionTrigger>
          <AccordionContent>
            L'analyse des concurrents vous permet d'identifier les sites qui se positionnent bien sur vos mots-clés cibles.
            Étudiez leur contenu, leur structure et leur stratégie de liaison pour comprendre ce qui fonctionne dans votre secteur.
            Identifiez les opportunités que vos concurrents n'exploitent pas encore pour vous démarquer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default KeywordFAQ;
