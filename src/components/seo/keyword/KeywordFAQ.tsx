
import React from 'react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquareQuestion } from "lucide-react";

const KeywordFAQ: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquareQuestion className="h-5 w-5 mr-2 text-blue-500" />
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
            Identifiez les opportunités de mots-clés qu'ils n'exploitent pas encore ou où leur présence est faible.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            Comment interpréter le volume de recherche et la difficulté ?
          </AccordionTrigger>
          <AccordionContent>
            Le volume de recherche indique combien de fois un mot-clé est recherché mensuellement. 
            Un volume élevé signifie plus de trafic potentiel, mais aussi généralement plus de concurrence.
            La difficulté (sur 100) estime la difficulté à se classer pour ce mot-clé. 
            Une difficulté inférieure à 30 est considérée comme facile, entre 30 et 60 comme moyenne, et au-dessus de 60 comme difficile.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">
            Combien de mots-clés devrais-je cibler par page ?
          </AccordionTrigger>
          <AccordionContent>
            Il est recommandé de cibler un mot-clé principal et 2-3 mots-clés secondaires ou variantes par page.
            Concentrez-vous sur un sujet principal par page pour maximiser la pertinence et éviter la cannibalisation de mots-clés entre vos pages.
            L'important est de créer un contenu naturel et de qualité qui répond aux intentions de recherche, plutôt que de simplement accumuler des mots-clés.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-left">
            Comment exporter et utiliser les mots-clés générés ?
          </AccordionTrigger>
          <AccordionContent>
            Pour exporter vos mots-clés sélectionnés, cochez ceux qui vous intéressent puis cliquez sur le bouton "Exporter la sélection".
            Un fichier CSV sera téléchargé avec les données complètes (mot-clé, volume, difficulté, CPC, compétition).
            Vous pouvez ensuite utiliser ces données pour planifier votre stratégie de contenu, structurer votre site ou 
            orienter vos campagnes publicitaires.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger className="text-left">
            Pourquoi configurer une clé API OpenAI ?
          </AccordionTrigger>
          <AccordionContent>
            La configuration d'une clé API OpenAI vous permet d'accéder à des fonctionnalités avancées comme l'analyse des concurrents 
            et les données SERP en temps réel. Sans clé API, vous avez toujours accès aux suggestions de mots-clés standards et longue traîne,
            mais les données concurrentielles ne seront pas disponibles. Votre clé API est stockée localement dans votre navigateur et 
            n'est jamais partagée avec nos serveurs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default KeywordFAQ;
