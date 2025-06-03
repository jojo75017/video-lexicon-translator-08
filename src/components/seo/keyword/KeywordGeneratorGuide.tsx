import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  BarChart3,
  Download,
  Sparkles,
  Globe,
  ExternalLink,
  ArrowRight,
  Info,
  FileText,
  MessageSquare,
  Tag,
  FolderTree,
  Lightbulb,
  Calendar,
  Users,
  PieChart
} from 'lucide-react';

const KeywordGeneratorGuide: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(1);

  const toggleStep = (stepId: number) => {
    setOpenStep(openStep === stepId ? null : stepId);
  };

  const allSteps = [
    {
      id: 1,
      title: "Recherche de mots-clés",
      description: "Découvrez comment identifier les mots-clés les plus pertinents pour votre niche.",
      category: "Débuter",
      content: (
        <div className="space-y-4">
          <p>La recherche de mots-clés est le point de départ de toute stratégie SEO. Elle consiste à identifier les termes que les utilisateurs saisissent dans les moteurs de recherche pour trouver des informations, des produits ou des services.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Brainstorming</strong> : Listez tous les mots-clés possibles liés à votre activité.</li>
            <li><strong>Outils de recherche</strong> : Utilisez des outils comme Google Keyword Planner, SEMrush ou Ahrefs pour trouver des mots-clés pertinents.</li>
            <li><strong>Analyse de la concurrence</strong> : Identifiez les mots-clés utilisés par vos concurrents.</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Conseil pro :</h4>
            <p>Privilégiez les mots-clés de longue traîne (expressions de plusieurs mots) qui sont moins concurrentiels et plus précis.</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Analyse de la concurrence",
      description: "Apprenez à espionner vos concurrents pour identifier leurs meilleures stratégies.",
      category: "Analyse",
      content: (
        <div className="space-y-4">
          <p>L'analyse de la concurrence vous permet de comprendre les stratégies SEO de vos concurrents et d'identifier les opportunités à saisir.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Identification des concurrents</strong> : Listez les sites web qui se positionnent sur les mêmes mots-clés que vous.</li>
            <li><strong>Analyse des mots-clés</strong> : Identifiez les mots-clés sur lesquels vos concurrents se positionnent.</li>
            <li><strong>Analyse du contenu</strong> : Étudiez le contenu de vos concurrents pour identifier les sujets qui fonctionnent le mieux.</li>
          </ul>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Stratégie :</h4>
            <p>Identifiez les mots-clés sur lesquels vos concurrents sont faibles et créez du contenu de meilleure qualité pour les dépasser.</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Optimisation du contenu",
      description: "Découvrez comment créer du contenu optimisé pour les moteurs de recherche.",
      category: "Contenu",
      content: (
        <div className="space-y-4">
          <p>L'optimisation du contenu consiste à créer du contenu de qualité, pertinent et optimisé pour les moteurs de recherche.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Mots-clés</strong> : Intégrez vos mots-clés de manière naturelle dans votre contenu.</li>
            <li><strong>Structure</strong> : Structurez votre contenu avec des titres (H1, H2, H3) et des paragraphes clairs.</li>
            <li><strong>Lisibilité</strong> : Rédigez des phrases courtes et utilisez un vocabulaire simple.</li>
          </ul>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">✍️ Rédaction :</h4>
            <p>Rédigez pour vos utilisateurs avant de rédiger pour les moteurs de recherche. Un contenu de qualité est essentiel pour attirer et fidéliser votre audience.</p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Netlinking (Backlinks)",
      description: "Apprenez à obtenir des liens de qualité pour améliorer votre positionnement.",
      category: "Liens",
      content: (
        <div className="space-y-4">
          <p>Le netlinking consiste à obtenir des liens (backlinks) depuis d'autres sites web vers le vôtre. Les backlinks sont un signal de confiance pour les moteurs de recherche et peuvent améliorer votre positionnement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Recherche de partenaires</strong> : Identifiez les sites web pertinents dans votre niche et contactez-les pour proposer un échange de liens.</li>
            <li><strong>Création de contenu de qualité</strong> : Créez du contenu de qualité qui incite les autres sites web à vous linker naturellement.</li>
            <li><strong>Inscription dans les annuaires</strong> : Inscrivez votre site web dans les annuaires de qualité.</li>
          </ul>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🔗 Liens :</h4>
            <p>Privilégiez la qualité à la quantité. Un lien depuis un site web de qualité est plus important que plusieurs liens depuis des sites web de faible qualité.</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Optimisation technique",
      description: "Améliorez la structure et la vitesse de votre site web pour un meilleur référencement.",
      category: "Technique",
      content: (
        <div className="space-y-4">
          <p>L'optimisation technique consiste à améliorer la structure et la vitesse de votre site web pour faciliter l'exploration et l'indexation par les moteurs de recherche.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Vitesse de chargement</strong> : Optimisez la vitesse de chargement de votre site web en compressant les images, en utilisant un CDN et en activant la mise en cache.</li>
            <li><strong>Mobile-friendly</strong> : Assurez-vous que votre site web est responsive et s'affiche correctement sur les appareils mobiles.</li>
            <li><strong>Structure du site</strong> : Créez une structure de site claire et logique avec des URL optimisées et un sitemap XML.</li>
          </ul>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">⚙️ Technique :</h4>
            <p>Utilisez Google PageSpeed Insights pour identifier les points à améliorer sur votre site web.</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Suivi des résultats",
      description: "Mesurez l'efficacité de votre stratégie SEO et ajustez-la en conséquence.",
      category: "Suivi",
      content: (
        <div className="space-y-4">
          <p>Le suivi des résultats vous permet de mesurer l'efficacité de votre stratégie SEO et d'identifier les points à améliorer.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Google Analytics</strong> : Suivez le trafic de votre site web, les sources de trafic et le comportement des utilisateurs.</li>
            <li><strong>Google Search Console</strong> : Suivez les performances de votre site web dans les résultats de recherche Google, les mots-clés sur lesquels vous vous positionnez et les erreurs d'exploration.</li>
            <li><strong>Outils de suivi de positionnement</strong> : Suivez le positionnement de vos mots-clés dans les résultats de recherche.</li>
          </ul>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📊 Analyse :</h4>
            <p>Analysez régulièrement vos résultats et ajustez votre stratégie SEO en conséquence. Le SEO est un processus continu qui nécessite une adaptation constante.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Mots-clés de longue traîne",
      description: "Ciblez des expressions spécifiques pour attirer un trafic qualifié.",
      category: "Mots-clés",
      content: (
        <div className="space-y-4">
          <p>Les mots-clés de longue traîne sont des expressions de recherche plus longues et plus spécifiques que les mots-clés génériques. Ils sont moins concurrentiels et attirent un trafic plus qualifié.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Exemple</strong> : Au lieu de cibler le mot-clé "chaussures", ciblez "chaussures de course pour femmes pas chères".</li>
            <li><strong>Avantages</strong> : Moins de concurrence, trafic plus qualifié, taux de conversion plus élevé.</li>
            <li><strong>Comment les trouver</strong> : Utilisez des outils de recherche de mots-clés et analysez les questions posées par les utilisateurs sur les forums et les réseaux sociaux.</li>
          </ul>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Ciblage :</h4>
            <p>Intégrez des mots-clés de longue traîne dans vos articles de blog, vos pages de produits et vos descriptions de vidéos.</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Optimisation On-Page",
      description: "Travaillez les éléments internes de vos pages pour un référencement optimal.",
      category: "Optimisation",
      content: (
        <div className="space-y-4">
          <p>L'optimisation On-Page consiste à travailler les éléments internes de vos pages web pour améliorer leur référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Balises Title</strong> : Optimisez vos balises Title avec vos mots-clés cibles.</li>
            <li><strong>Meta Descriptions</strong> : Rédigez des meta descriptions attrayantes qui incitent les utilisateurs à cliquer.</li>
            <li><strong>Balises Hn</strong> : Structurez votre contenu avec des balises H1, H2, H3, etc.</li>
            <li><strong>Attributs Alt</strong> : Ajoutez des attributs Alt descriptifs à vos images.</li>
          </ul>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📝 Contenu :</h4>
            <p>Optimisez chaque page de votre site web avec un mot-clé cible différent.</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Contenu de qualité",
      description: "Créez du contenu informatif, engageant et pertinent pour votre audience.",
      category: "Contenu",
      content: (
        <div className="space-y-4">
          <p>Le contenu de qualité est essentiel pour attirer et fidéliser votre audience, ainsi que pour améliorer votre référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Originalité</strong> : Créez du contenu original et unique qui apporte une valeur ajoutée à vos utilisateurs.</li>
            <li><strong>Pertinence</strong> : Créez du contenu pertinent pour votre audience cible et qui répond à leurs besoins.</li>
            <li><strong>Engagement</strong> : Créez du contenu engageant qui incite les utilisateurs à interagir (commentaires, partages, etc.).</li>
          </ul>
          <div className="bg-lime-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🌟 Qualité :</h4>
            <p>Publiez régulièrement du contenu de qualité pour maintenir l'intérêt de votre audience et améliorer votre référencement.</p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "Optimisation des images",
      description: "Réduisez la taille de vos images et ajoutez des balises alt pour un meilleur SEO.",
      category: "Images",
      content: (
        <div className="space-y-4">
          <p>L'optimisation des images consiste à réduire la taille de vos images et à ajouter des balises alt descriptives pour améliorer leur référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Taille des images</strong> : Réduisez la taille de vos images pour améliorer la vitesse de chargement de vos pages.</li>
            <li><strong>Balises Alt</strong> : Ajoutez des balises Alt descriptives à vos images pour aider les moteurs de recherche à comprendre leur contenu.</li>
            <li><strong>Format des images</strong> : Utilisez le format JPEG pour les photos et le format PNG pour les illustrations.</li>
          </ul>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🖼️ Visuel :</h4>
            <p>Optimisez toutes les images de votre site web pour améliorer votre référencement et l'expérience utilisateur.</p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Maillage interne",
      description: "Créez des liens entre vos pages pour faciliter la navigation et améliorer le SEO.",
      category: "Liens",
      content: (
        <div className="space-y-4">
          <p>Le maillage interne consiste à créer des liens entre les pages de votre site web pour faciliter la navigation et améliorer le référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Liens contextuels</strong> : Ajoutez des liens contextuels dans vos articles de blog et vos pages de produits.</li>
            <li><strong>Menu de navigation</strong> : Créez un menu de navigation clair et logique.</li>
            <li><strong>Pied de page</strong> : Ajoutez des liens vers les pages importantes de votre site web dans le pied de page.</li>
          </ul>
          <div className="bg-cyan-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🌐 Structure :</h4>
            <p>Créez un maillage interne cohérent pour faciliter la navigation et améliorer le référencement de votre site web.</p>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "SEO local",
      description: "Optimisez votre présence en ligne pour les recherches locales.",
      category: "Local",
      content: (
        <div className="space-y-4">
          <p>Le SEO local consiste à optimiser votre présence en ligne pour les recherches locales.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Google My Business</strong> : Créez et optimisez votre fiche Google My Business.</li>
            <li><strong>Annuaires locaux</strong> : Inscrivez votre entreprise dans les annuaires locaux.</li>
            <li><strong>Avis clients</strong> : Encouragez vos clients à laisser des avis sur Google et les autres plateformes.</li>
          </ul>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📍 Proximité :</h4>
            <p>Optimisez votre présence en ligne pour les recherches locales et attirez des clients près de chez vous.</p>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "Audit SEO",
      description: "Analysez votre site pour identifier les problèmes et les opportunités d'amélioration.",
      category: "Analyse",
      content: (
        <div className="space-y-4">
          <p>Un audit SEO consiste à analyser votre site web pour identifier les problèmes et les opportunités d'amélioration.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Analyse technique</strong> : Vérifiez la vitesse de chargement, la structure du site, la compatibilité mobile, etc.</li>
            <li><strong>Analyse du contenu</strong> : Vérifiez la qualité du contenu, l'optimisation des mots-clés, la structure des pages, etc.</li>
            <li><strong>Analyse des backlinks</strong> : Vérifiez la qualité et la quantité des backlinks.</li>
          </ul>
          <div className="bg-rose-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🔍 Diagnostic :</h4>
            <p>Réalisez régulièrement un audit SEO pour identifier les problèmes et les opportunités d'amélioration.</p>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "Outils SEO",
      description: "Découvrez les outils indispensables pour votre stratégie SEO.",
      category: "Outils",
      content: (
        <div className="space-y-4">
          <p>Il existe de nombreux outils SEO disponibles pour vous aider à améliorer votre référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Google Analytics</strong> : Suivez le trafic de votre site web.</li>
            <li><strong>Google Search Console</strong> : Suivez les performances de votre site web dans les résultats de recherche Google.</li>
            <li><strong>SEMrush</strong> : Analysez vos concurrents et trouvez des mots-clés.</li>
            <li><strong>Ahrefs</strong> : Analysez vos backlinks et trouvez des opportunités de netlinking.</li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🛠️ Boîte à outils :</h4>
            <p>Utilisez les outils SEO pour analyser votre site web, suivre vos résultats et identifier les opportunités d'amélioration.</p>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: "Tendances SEO",
      description: "Restez informé des dernières tendances pour adapter votre stratégie.",
      category: "Veille",
      content: (
        <div className="space-y-4">
          <p>Le SEO est un domaine en constante évolution. Il est important de rester informé des dernières tendances pour adapter votre stratégie.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Recherche vocale</strong> : Optimisez votre contenu pour la recherche vocale.</li>
            <li><strong>Indexation mobile-first</strong> : Assurez-vous que votre site web est compatible mobile.</li>
            <li><strong>Intelligence artificielle</strong> : Utilisez l'IA pour améliorer votre stratégie SEO.</li>
          </ul>
          <div className="bg-stone-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🚀 Futur :</h4>
            <p>Restez informé des dernières tendances SEO pour adapter votre stratégie et rester compétitif.</p>
          </div>
        </div>
      )
    },
    {
      id: 16,
      title: "Stratégie de contenu",
      description: "Planifiez et créez du contenu de qualité pour attirer votre audience.",
      category: "Contenu",
      content: (
        <div className="space-y-4">
          <p>Une stratégie de contenu consiste à planifier et à créer du contenu de qualité pour attirer votre audience cible.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Définir vos objectifs</strong> : Définissez les objectifs de votre stratégie de contenu (attirer du trafic, générer des leads, etc.).</li>
            <li><strong>Identifier votre audience cible</strong> : Identifiez les besoins et les intérêts de votre audience cible.</li>
            <li><strong>Créer un calendrier éditorial</strong> : Planifiez la publication de votre contenu sur une base régulière.</li>
          </ul>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📅 Organisation :</h4>
            <p>Planifiez et créez du contenu de qualité pour attirer votre audience et atteindre vos objectifs.</p>
          </div>
        </div>
      )
    },
    {
      id: 17,
      title: "Analyse sémantique",
      description: "Utilisez le champ lexical de vos mots-clés pour enrichir votre contenu.",
      category: "Sémantique",
      content: (
        <div className="space-y-4">
          <p>L'analyse sémantique consiste à utiliser le champ lexical de vos mots-clés pour enrichir votre contenu et améliorer votre référencement.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Synonymes</strong> : Utilisez des synonymes de vos mots-clés pour varier votre vocabulaire.</li>
            <li><strong>Termes associés</strong> : Utilisez des termes associés à vos mots-clés pour enrichir votre contenu.</li>
            <li><strong>Questions</strong> : Répondez aux questions que se posent les utilisateurs sur vos mots-clés.</li>
          </ul>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📚 Lexique :</h4>
            <p>Utilisez l'analyse sémantique pour enrichir votre contenu et améliorer votre référencement.</p>
          </div>
        </div>
      )
    },
    {
      id: 18,
      title: "Accessibilité",
      description: "Rendez votre site accessible à tous les utilisateurs, y compris les personnes handicapées.",
      category: "Accessibilité",
      content: (
        <div className="space-y-4">
          <p>L'accessibilité consiste à rendre votre site web accessible à tous les utilisateurs, y compris les personnes handicapées.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Balises Alt</strong> : Ajoutez des balises Alt descriptives à vos images.</li>
            <li><strong>Contrastes de couleurs</strong> : Utilisez des contrastes de couleurs suffisants pour faciliter la lecture.</li>
            <li><strong>Navigation au clavier</strong> : Assurez-vous que votre site web est navigable au clavier.</li>
          </ul>
          <div className="bg-lime-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">♿ Inclusion :</h4>
            <p>Rendez votre site web accessible à tous les utilisateurs pour améliorer l'expérience utilisateur et votre référencement.</p>
          </div>
        </div>
      )
    },
    {
      id: 19,
      title: "Analyseur de tendances avancé",
      description: "Analysez l'évolution des volumes de recherche et identifiez les tendances saisonnières",
      category: "Analyse",
      content: (
        <div className="space-y-4">
          <p>L'analyseur de tendances avancé vous permet de :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Visualiser l'évolution</strong> : Graphiques de tendances sur 12 mois</li>
            <li><strong>Identifier les pics saisonniers</strong> : Détection automatique des variations</li>
            <li><strong>Prédire les opportunités</strong> : Suggestions basées sur les cycles</li>
            <li><strong>Comparer les performances</strong> : Analyse comparative des mots-clés</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Conseil pro :</h4>
            <p>Utilisez les données de tendances pour planifier votre calendrier éditorial et anticiper les pics de recherche.</p>
          </div>
        </div>
      )
    },
    {
      id: 20,
      title: "Intelligence concurrentielle",
      description: "Analysez les stratégies de mots-clés de vos concurrents et identifiez les gaps",
      category: "Concurrence",
      content: (
        <div className="space-y-4">
          <p>L'intelligence concurrentielle révèle :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Analyse des concurrents</strong> : Force, trafic estimé, top mots-clés</li>
            <li><strong>Gaps d'opportunités</strong> : Mots-clés non ciblés par la concurrence</li>
            <li><strong>Positions comparatives</strong> : Classement par mot-clé</li>
            <li><strong>Estimation du trafic</strong> : Potentiel de chaque concurrent</li>
          </ul>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Stratégie :</h4>
            <p>Concentrez-vous sur les gaps identifiés pour vous positionner sur des mots-clés délaissés par vos concurrents.</p>
          </div>
        </div>
      )
    },
    {
      id: 21,
      title: "Planificateur de stratégie de contenu",
      description: "Créez un calendrier éditorial optimisé basé sur vos mots-clés",
      category: "Stratégie",
      content: (
        <div className="space-y-4">
          <p>Le planificateur génère automatiquement :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Idées d'articles</strong> : Titres optimisés par intention de recherche</li>
            <li><strong>Calendrier de publication</strong> : Planning sur 12 semaines</li>
            <li><strong>Priorisation intelligente</strong> : Basée sur volume et difficulté</li>
            <li><strong>Types de contenu</strong> : Guides, comparatifs, tutoriels, etc.</li>
          </ul>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📅 Organisation :</h4>
            <p>Suivez le planning généré pour maintenir une publication régulière et stratégique.</p>
          </div>
        </div>
      )
    },
    {
      id: 22,
      title: "Insights et recommandations IA",
      description: "Obtenez des analyses personnalisées et des recommandations automatiques",
      category: "IA",
      content: (
        <div className="space-y-4">
          <p>L'analyseur d'insights détecte automatiquement :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Opportunités à faible concurrence</strong> : Mots-clés faciles à positionner</li>
            <li><strong>Alertes de difficulté</strong> : Mots-clés trop concurrentiels</li>
            <li><strong>Équilibre des intentions</strong> : Distribution des types de recherche</li>
            <li><strong>Potentiel de trafic</strong> : Estimation du trafic total possible</li>
          </ul>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🧠 IA Avancée :</h4>
            <p>Chaque insight inclut une action recommandée spécifique et un niveau d'impact estimé.</p>
          </div>
        </div>
      )
    },
    {
      id: 23,
      title: "Clustering de mots-clés",
      description: "Organisez automatiquement vos mots-clés en groupes thématiques",
      category: "Organisation",
      content: (
        <div className="space-y-4">
          <p>Le clustering intelligent permet de :</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Groupement automatique</strong> : Basé sur la sémantique et les mots communs</li>
            <li><strong>Statistiques par cluster</strong> : Volume total, difficulté moyenne</li>
            <li><strong>Intention dominante</strong> : Type de recherche principal du groupe</li>
            <li><strong>Export par cluster</strong> : Téléchargement CSV par thématique</li>
          </ul>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🗂️ Structure :</h4>
            <p>Utilisez les clusters pour organiser votre site en silos thématiques et améliorer votre architecture SEO.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Guide du générateur de mots-clés</h1>
      </div>

      <p className="text-gray-600">
        Ce guide vous aidera à utiliser efficacement le générateur de mots-clés pour optimiser votre stratégie SEO.
      </p>

      <Separator className="my-4" />

      <Accordion type="single" collapsible className="w-full">
        {allSteps.map((step) => (
          <AccordionItem key={step.id} value={String(step.id)}>
            <AccordionTrigger className="flex justify-between items-center py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{step.title}</span>
                <Badge variant="secondary">{step.category}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-4">
              {step.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default KeywordGeneratorGuide;
