
import React from 'react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, HelpCircle, Search, FileText, BarChart2 } from "lucide-react";

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

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            Comment interpréter le volume de recherche d'un mot-clé ?
          </AccordionTrigger>
          <AccordionContent>
            Le volume de recherche indique le nombre moyen de recherches mensuelles pour un mot-clé. Un volume élevé 
            signifie une forte demande, mais implique souvent une concurrence accrue. Évaluez ce chiffre en fonction 
            de votre secteur - 100 recherches mensuelles peuvent être significatives dans une niche spécialisée, tandis 
            que 10 000 recherches peuvent être modestes dans un secteur très concurrentiel.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">
            Comment les scores de difficulté sont-ils calculés ?
          </AccordionTrigger>
          <AccordionContent>
            Les scores de difficulté évaluent la complexité à se positionner pour un mot-clé donné, généralement sur une échelle de 0 à 100.
            Ce calcul prend en compte l'autorité des domaines déjà positionnés, la qualité de leur contenu, le nombre de backlinks,
            et d'autres facteurs de référencement. Un score bas (0-30) indique une opportunité facile à saisir, tandis qu'un score élevé (70+)
            suggère qu'une stratégie plus élaborée sera nécessaire.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-left">
            Comment optimiser le contenu pour l'intention de recherche ?
          </AccordionTrigger>
          <AccordionContent>
            Pour optimiser votre contenu selon l'intention de recherche, identifiez d'abord si la requête est informationnelle (recherche d'information),
            transactionnelle (intention d'achat), navigationnelle (recherche d'un site spécifique) ou commerciale (comparaison avant achat).
            Adaptez ensuite votre contenu en conséquence : articles détaillés pour les requêtes informationnelles, pages produits optimisées 
            pour les requêtes transactionnelles, etc. Analysez les résultats actuellement en première page pour comprendre le type de contenu que Google valorise.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger className="text-left">
            Quelle est l'importance des mots-clés dans le SEO moderne ?
          </AccordionTrigger>
          <AccordionContent>
            Bien que le SEO ait évolué au-delà de la simple correspondance exacte de mots-clés, ils restent un élément fondamental
            pour comprendre l'intention des utilisateurs. Aujourd'hui, les algorithmes des moteurs de recherche analysent la sémantique et le contexte,
            cherchant à comprendre le sujet global plutôt que des mots-clés isolés. Une stratégie efficace consiste à cibler des sujets complets
            avec un ensemble de mots-clés connexes plutôt que de se concentrer sur un seul terme. Cette approche thématique améliore à la fois
            l'expérience utilisateur et le référencement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger className="text-left">
            Comment exploiter Google Search Console pour l'optimisation des mots-clés ?
          </AccordionTrigger>
          <AccordionContent>
            Google Search Console est un outil précieux pour l'optimisation des mots-clés car il fournit des données réelles sur votre performance dans
            les résultats de recherche. Analysez les requêtes pour lesquelles votre site apparaît déjà avec une position moyenne correcte (positions 8-20)
            mais avec un faible taux de clics. Ces mots-clés représentent des opportunités d'amélioration à court terme :
            optimisez vos meta titles et descriptions pour ces pages, enrichissez le contenu existant, et vous pourriez voir une
            amélioration rapide de votre classement et de votre trafic.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger className="text-left">
            Comment suivre l'évolution des positions pour mes mots-clés ?
          </AccordionTrigger>
          <AccordionContent>
            Pour suivre efficacement l'évolution de vos positions, utilisez une combinaison d'outils comme Google Search Console pour les données réelles, 
            et des outils de suivi dédiés comme SISTRIX, SEMrush ou Ahrefs pour une vision plus complète. Établissez un rapport hebdomadaire ou mensuel 
            pour surveiller les fluctuations importantes. Prêtez attention non seulement aux changements de position, mais aussi aux variations du taux de clics et 
            des impressions, qui peuvent révéler des opportunités d'optimisation même sans amélioration du classement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger className="text-left">
            Comment la structure du site influence-t-elle le référencement des mots-clés ?
          </AccordionTrigger>
          <AccordionContent>
            La structure du site joue un rôle crucial dans le référencement des mots-clés car elle aide les moteurs de recherche à comprendre 
            l'organisation et l'importance relative de votre contenu. Une architecture logique facilite le crawl et l'indexation, tout en distribuant 
            efficacement l'autorité de domaine à travers les pages. Organisez votre contenu en catégories thématiques claires, utilisez une hiérarchie 
            d'URLs cohérente, et créez des liens internes stratégiques pour renforcer les pages cibles pour vos mots-clés principaux.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default KeywordFAQ;
