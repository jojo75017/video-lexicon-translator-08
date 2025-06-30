import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Sparkles, 
  Zap,
  Eye,
  Copy,
  Download,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordTabsNavigation from './KeywordTabsNavigation';
import KeywordTabsContent from './KeywordTabsContent';

interface AdvancedKeywordGeneratorProps {}

const AdvancedKeywordGenerator: React.FC<AdvancedKeywordGeneratorProps> = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('keywords');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [showArticleDialog, setShowArticleDialog] = useState(false);

  const generateKeywords = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedKeywords: KeywordSuggestion[] = [
        {
          keyword: `${keyword} guide complet`,
          volume: 2400,
          difficulty: 45,
          cpc: 1.2,
          competition: 0.6,
          trend: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 75,
          searchVolume: 2400,
          relevance: 90,
          suggestedTitle: `Guide Complet ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025`,
          suggestedDescription: `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques et stratégies éprouvées pour ${keyword}.`
        },
        {
          keyword: `comment ${keyword}`,
          volume: 1800,
          difficulty: 35,
          cpc: 0.8,
          competition: 0.4,
          trend: [15, 18, 22, 28, 32, 38, 42, 48, 52, 58, 62, 68],
          intent: 'informational',
          type: 'question',
          opportunity: 80,
          searchVolume: 1800,
          relevance: 85,
          suggestedTitle: `Comment ${keyword} - Guide Pratique`,
          suggestedDescription: `Apprenez comment bien faire ${keyword} étape par étape avec nos conseils d'experts.`
        },
        {
          keyword: `${keyword} prix`,
          volume: 3200,
          difficulty: 55,
          cpc: 2.1,
          competition: 0.8,
          trend: [25, 28, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'commercial',
          type: 'standard',
          opportunity: 65,
          searchVolume: 3200,
          relevance: 95,
          suggestedTitle: `Prix ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025 : Comparatif`,
          suggestedDescription: `Découvrez les prix ${keyword} actuels. Comparaisons détaillées, promotions et conseils d'achat pour ${keyword}.`
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: 2800,
          difficulty: 60,
          cpc: 1.8,
          competition: 0.7,
          trend: [30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
          intent: 'commercial',
          type: 'standard',
          opportunity: 70,
          searchVolume: 2800,
          relevance: 88,
          suggestedTitle: `Meilleur ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025 : Top 10`,
          suggestedDescription: `Classement des meilleurs ${keyword}. Tests complets, avis détaillés et recommandations d'experts pour ${keyword}.`
        },
        {
          keyword: `${keyword} conseils`,
          volume: 1600,
          difficulty: 30,
          cpc: 0.9,
          competition: 0.3,
          trend: [12, 15, 18, 22, 25, 30, 35, 40, 45, 50, 55, 60],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 85,
          searchVolume: 1600,
          relevance: 82,
          suggestedTitle: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Conseils d'Experts`,
          suggestedDescription: `Conseils pratiques pour ${keyword}. Guide complet avec exemples concrets et astuces d'experts.`
        }
      ];

      setKeywords(generatedKeywords);
      setHasGenerated(true);
      
      generateArticle(keyword);
      
      toast.success(`${generatedKeywords.length} mots-clés générés avec succès !`);
      
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSeoOptimizedArticle = (userKeyword: string) => {
    if (!userKeyword) return '';
    
    const cleanKeyword = userKeyword.toLowerCase().trim();
    const keywordCapitalized = cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1);
    
    // Génération du titre SEO (60 caractères max)
    const seoTitle = `${keywordCapitalized} : Guide Complet 2025`.substring(0, 60);
    
    // Génération de la meta description (152 caractères max)
    const metaDescription = `Découvrez tout sur ${cleanKeyword}. Guide complet avec conseils d'experts, techniques avancées et solutions pratiques pour ${cleanKeyword}.`.substring(0, 152);
    
    // Génération du slug
    const slug = cleanKeyword.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Catégories basées sur le mot-clé
    const categories = getCategories(cleanKeyword);
    
    // Contenu spécialisé selon le mot-clé
    const content = generateSpecializedContent(cleanKeyword, keywordCapitalized);
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${cleanKeyword}, guide ${cleanKeyword}, conseils ${cleanKeyword}, comment ${cleanKeyword}">
    <link rel="canonical" href="https://example.com/${slug}">
    <meta property="og:title" content="${seoTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://example.com/${slug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoTitle}">
    <meta name="twitter:description" content="${metaDescription}">
</head>
<body>

# ${keywordCapitalized} : Guide Complet et Détaillé 2025

**Slug :** ${slug}  
**Catégories :** ${categories.join(', ')}  
**Mots-clés :** ${cleanKeyword}, guide ${cleanKeyword}, conseils ${cleanKeyword}

## Table des matières
1. [Introduction au ${cleanKeyword}](#introduction)
2. [Qu'est-ce que ${cleanKeyword} ?](#definition)
3. [Comment bien commencer avec ${cleanKeyword}](#debuter)
4. [Techniques avancées de ${cleanKeyword}](#techniques-avancees)
5. [Erreurs courantes à éviter](#erreurs-eviter)
6. [Équipement et outils pour ${cleanKeyword}](#equipement)
7. [Étapes détaillées pour ${cleanKeyword}](#etapes-detaillees)
8. [Conseils d'experts pour ${cleanKeyword}](#conseils-experts)
9. [Coûts et budget pour ${cleanKeyword}](#couts-budget)
10. [Comparaisons et alternatives](#comparaisons)
11. [Questions fréquemment posées](#faq)
12. [Conclusion](#conclusion)

## Introduction au ${cleanKeyword} {#introduction}

Le **${cleanKeyword}** est devenu un sujet d'intérêt majeur ces dernières années. Que vous soyez débutant ou que vous cherchiez à approfondir vos connaissances, ce guide complet vous accompagnera dans votre parcours d'apprentissage du ${cleanKeyword}.

Dans cet article de plus de 1500 mots, nous explorerons tous les aspects du ${cleanKeyword}, des bases aux techniques les plus avancées. Vous découvrirez des conseils pratiques, des astuces d'experts et tout ce qu'il faut savoir pour réussir dans le domaine du ${cleanKeyword}.

${content.introduction}

## Qu'est-ce que ${cleanKeyword} ? {#definition}

${content.definition}

### Les principes fondamentaux du ${cleanKeyword}

Le ${cleanKeyword} repose sur plusieurs principes essentiels :

1. **Principe de base** : ${content.principles[0]}
2. **Principe d'efficacité** : ${content.principles[1]}  
3. **Principe de durabilité** : ${content.principles[2]}

### Histoire et évolution du ${cleanKeyword}

L'évolution du ${cleanKeyword} s'est faite en plusieurs étapes importantes. Comprendre cette histoire vous aidera à mieux appréhender les pratiques actuelles et les tendances futures du ${cleanKeyword}.

${content.history}

## Comment bien commencer avec ${cleanKeyword} {#debuter}

Pour débuter efficacement dans le ${cleanKeyword}, il est crucial de suivre une approche méthodique. Voici les étapes essentielles pour bien commencer votre parcours dans le ${cleanKeyword}.

### Préparatifs essentiels

Avant de vous lancer dans le ${cleanKeyword}, assurez-vous d'avoir :

- **Les connaissances de base** : Familiarisez-vous avec le vocabulaire spécifique au ${cleanKeyword}
- **L'équipement nécessaire** : ${content.equipment}
- **Un environnement adapté** : ${content.environment}
- **Du temps dédié** : Le ${cleanKeyword} demande de la patience et de la régularité

### Premiers pas dans le ${cleanKeyword}

${content.firstSteps}

## Techniques avancées de ${cleanKeyword} {#techniques-avancees}

Une fois les bases maîtrisées, vous pouvez explorer des techniques plus avancées de ${cleanKeyword}. Ces méthodes vous permettront d'optimiser vos résultats et d'atteindre un niveau d'expertise supérieur.

### Technique avancée n°1 : ${content.advancedTechnique1.title}

${content.advancedTechnique1.description}

**Mise en pratique :**
- Étape 1 : ${content.advancedTechnique1.steps[0]}
- Étape 2 : ${content.advancedTechnique1.steps[1]}
- Étape 3 : ${content.advancedTechnique1.steps[2]}

### Technique avancée n°2 : ${content.advancedTechnique2.title}

${content.advancedTechnique2.description}

**Avantages de cette technique :**
- Amélioration significative des résultats
- Réduction du temps nécessaire
- Optimisation des ressources utilisées

## Erreurs courantes à éviter {#erreurs-eviter}

Dans le domaine du ${cleanKeyword}, certaines erreurs reviennent fréquemment chez les débutants et même chez les pratiquants expérimentés. Connaître ces pièges vous permettra de les éviter et d'améliorer considérablement vos résultats.

### Erreur n°1 : ${content.commonMistakes[0].title}

${content.commonMistakes[0].description}

**Comment l'éviter :** ${content.commonMistakes[0].solution}

### Erreur n°2 : ${content.commonMistakes[1].title}

${content.commonMistakes[1].description}

**Comment l'éviter :** ${content.commonMistakes[1].solution}

### Erreur n°3 : ${content.commonMistakes[2].title}

${content.commonMistakes[2].description}

**Comment l'éviter :** ${content.commonMistakes[2].solution}

## Équipement et outils pour ${cleanKeyword} {#equipement}

Le choix de l'équipement approprié est crucial pour réussir dans le ${cleanKeyword}. Voici une liste détaillée des outils et équipements recommandés selon votre niveau.

### Équipement pour débutants

${content.beginnerEquipment}

### Équipement avancé

Pour ceux qui souhaitent aller plus loin dans le ${cleanKeyword}, voici les outils professionnels recommandés :

${content.advancedEquipment}

### Budget et coût de l'équipement

Le budget nécessaire pour le ${cleanKeyword} varie considérablement selon vos objectifs :

- **Budget débutant** : ${content.budgetBeginner}
- **Budget intermédiaire** : ${content.budgetIntermediate}
- **Budget professionnel** : ${content.budgetProfessional}

## Étapes détaillées pour ${cleanKeyword} {#etapes-detaillees}

Voici un guide étape par étape pour maîtriser le ${cleanKeyword} de manière progressive et efficace.

### Phase 1 : Apprentissage des bases (Semaines 1-4)

${content.phase1}

### Phase 2 : Développement des compétences (Semaines 5-12)

${content.phase2}

### Phase 3 : Perfectionnement et spécialisation (Mois 4-12)

${content.phase3}

## Conseils d'experts pour ${cleanKeyword} {#conseils-experts}

Nos experts en ${cleanKeyword} partagent leurs conseils les plus précieux pour vous aider à exceller dans ce domaine.

### Conseil d'expert n°1 : ${content.expertTips[0].title}

${content.expertTips[0].advice}

### Conseil d'expert n°2 : ${content.expertTips[1].title}

${content.expertTips[1].advice}

### Conseil d'expert n°3 : ${content.expertTips[2].title}

${content.expertTips[2].advice}

## Coûts et budget pour ${cleanKeyword} {#couts-budget}

Comprendre les coûts associés au ${cleanKeyword} vous aidera à planifier votre budget et à faire les meilleurs choix selon vos moyens.

### Analyse des coûts

${content.costAnalysis}

### Retour sur investissement

Le ${cleanKeyword} peut représenter un excellent investissement si vous suivez les bonnes pratiques :

${content.roi}

## Comparaisons et alternatives {#comparaisons}

Il existe plusieurs approches et alternatives au ${cleanKeyword} traditionnel. Voici une comparaison détaillée pour vous aider à faire le meilleur choix.

### ${cleanKeyword} vs Alternative A

${content.comparison1}

### ${cleanKeyword} vs Alternative B  

${content.comparison2}

## Questions fréquemment posées {#faq}

### Combien de temps faut-il pour maîtriser le ${cleanKeyword} ?

${content.faq.time}

### Quel est le coût moyen pour débuter en ${cleanKeyword} ?

${content.faq.cost}

### Le ${cleanKeyword} est-il adapté aux débutants ?

${content.faq.beginners}

### Quelles sont les principales difficultés du ${cleanKeyword} ?

${content.faq.difficulties}

### Comment choisir son équipement de ${cleanKeyword} ?

${content.faq.equipment}

### Où trouver des formations en ${cleanKeyword} ?

${content.faq.training}

## Conclusion {#conclusion}

Le ${cleanKeyword} représente un domaine fascinant qui offre de nombreuses possibilités d'épanouissement et de développement personnel ou professionnel. Grâce à ce guide complet, vous disposez maintenant de toutes les informations nécessaires pour débuter ou approfondir votre pratique du ${cleanKeyword}.

Les points clés à retenir :

- Le ${cleanKeyword} demande de la patience et de la pratique régulière
- L'investissement dans un équipement de qualité est essentiel
- Les erreurs font partie de l'apprentissage
- La communauté ${cleanKeyword} est généralement accueillante et prête à aider

N'hésitez pas à commencer dès aujourd'hui votre parcours dans le ${cleanKeyword}. Avec de la persévérance et en suivant les conseils de ce guide, vous atteindrez rapidement vos objectifs dans ce domaine passionnant.

---

*Article optimisé SEO - ${new Date().toLocaleDateString('fr-FR')} - Guide complet ${cleanKeyword}*

</body>
</html>`;
  };

  const getCategories = (keyword: string): string[] => {
    const categoryMap: { [key: string]: string[] } = {
      'aquariophilie': ['Animaux', 'Loisirs', 'Aquarium'],
      'marketing': ['Business', 'Digital', 'Stratégie'],
      'cuisine': ['Gastronomie', 'Recettes', 'Alimentation'],
      'jardinage': ['Nature', 'Extérieur', 'Plantes'],
      'fitness': ['Sport', 'Santé', 'Bien-être'],
      'programmation': ['Technologie', 'Développement', 'Code'],
      'voyage': ['Tourisme', 'Découverte', 'Aventure'],
      'photographie': ['Art', 'Technique', 'Créativité']
    };

    // Recherche de catégories basées sur des mots-clés
    for (const [key, categories] of Object.entries(categoryMap)) {
      if (keyword.includes(key)) {
        return categories;
      }
    }

    // Catégories par défaut
    return ['Guide', 'Conseils', 'Pratique'];
  };

  const generateSpecializedContent = (keyword: string, keywordCapitalized: string) => {
    // Contenu spécialisé pour l'aquariophilie
    if (keyword.includes('aquariophilie') || keyword.includes('aquarium')) {
      return {
        introduction: `L'aquariophilie est bien plus qu'un simple loisir : c'est un art qui combine science, patience et créativité. Maintenir un écosystème aquatique équilibré demande des connaissances précises et une approche méthodique.`,
        
        definition: `L'**aquariophilie** est l'art de maintenir et d'élever des poissons et autres organismes aquatiques en milieu artificiel. Cette pratique nécessite une compréhension approfondie des cycles biologiques, de la chimie de l'eau et du comportement animal.

Un aquarium n'est pas seulement un réservoir d'eau avec des poissons : c'est un écosystème miniature qui doit être maintenu en équilibre constant. Chaque élément, de la filtration à l'éclairage, joue un rôle crucial dans la santé de vos pensionnaires aquatiques.`,

        principles: [
          "Le cycle de l'azote doit être parfaitement maîtrisé pour éviter l'empoisonnement des poissons",
          "La filtration mécanique, biologique et chimique doit être adaptée au volume et au peuplement",
          "L'équilibre écologique doit être maintenu sur le long terme sans interventions excessives"
        ],

        history: `L'aquariophilie moderne a vu le jour au XIXe siècle avec les premières techniques de maintien d'eau douce. L'évolution technologique a permis de démocratiser cette pratique, passant des simples bocaux aux systèmes sophistiqués d'aujourd'hui avec contrôle automatisé des paramètres.`,

        equipment: `Un système de filtration adapté, un éclairage LED programmable, un chauffage thermostaté, des tests de paramètres d'eau`,
        environment: `Un emplacement stable, à l'abri des vibrations et des variations de température`,

        firstSteps: `Commencez par un aquarium d'au moins 100 litres pour faciliter la stabilité des paramètres. Effectuez le cyclage pendant 4-6 semaines avant d'introduire les premiers poissons. Choisissez des espèces robustes et compatibles entre elles.`,

        advancedTechnique1: {
          title: "Aquascaping naturel",
          description: "Créer un paysage aquatique harmonieux en utilisant roches, racines et plantes vivantes pour reproduire un environnement naturel.",
          steps: [
            "Planifier la composition selon la règle des tiers",
            "Installer le hardscape (roches, racines) avant la plantation",
            "Sélectionner les plantes selon leurs besoins lumineux et nutritifs"
          ]
        },

        advancedTechnique2: {
          title: "Gestion des paramètres par zones",
          description: "Optimiser différentes zones de l'aquarium selon les besoins spécifiques des habitants (zone de reproduction, zone d'alimentation, zone de repos)."
        },

        commonMistakes: [
          {
            title: "Surpopulation de l'aquarium",
            description: "Introduire trop de poissons d'un coup ou dépasser la capacité de filtration.",
            solution: "Respecter la règle de 1 cm de poisson par litre d'eau et introduire progressivement."
          },
          {
            title: "Négligence du cycle de l'azote",
            description: "Introduire des poissons dans un aquarium non cyclé peut provoquer des pics mortels d'ammoniaque.",
            solution: "Toujours effectuer un cyclage complet de 4-6 semaines avant le premier poisson."
          },
          {
            title: "Suralimentation systématique",
            description: "Donner trop de nourriture pollue rapidement l'eau et peut tuer les poissons.",
            solution: "Nourrir avec parcimonie : ce qui n'est pas consommé en 2-3 minutes est trop."
          }
        ],

        beginnerEquipment: `Pour débuter : aquarium 100L (200€), filtre externe (80€), chauffage 100W (25€), éclairage LED (60€), tests eau (40€), décorations et plantes (50€). Budget total : environ 455€.`,

        advancedEquipment: `Équipement professionnel : aquarium sur mesure (800€+), filtration surdimensionnée (200€), éclairage haute performance (150€), système CO2 (120€), osmoseur (180€), contrôleur automatique (300€).`,

        budgetBeginner: "400-600€ pour un setup complet débutant",
        budgetIntermediate: "800-1500€ pour un aquarium bien équipé", 
        budgetProfessional: "2000€+ pour un système professionnel",

        phase1: `Apprentissage théorique du cycle de l'azote, choix et installation de l'équipement de base, cyclage de l'aquarium. Introduction des premiers poissons robustes (Guppys, Platys, Corydoras).`,

        phase2: `Maîtrise des tests d'eau et maintenance régulière, introduction d'espèces plus délicates, initiation aux plantes aquatiques, compréhension des interactions entre espèces.`,

        phase3: `Spécialisation dans un type d'aquarium (récifal, planté, biotope), reproduction d'espèces, aquascaping avancé, participation à des concours ou associations.`,

        expertTips: [
          {
            title: "Patience dans le cyclage",
            advice: "Ne jamais précipiter le processus de maturation biologique. Un aquarium bien cyclé est la base de tout succès en aquariophilie."
          },
          {
            title: "Observation quotidienne",
            advice: "Développer l'œil pour détecter les changements de comportement des poissons, premiers indicateurs de problèmes."
          },
          {
            title: "Investissement dans la filtration",
            advice: "Mieux vaut surdimensionner la filtration que de regretter plus tard. C'est le cœur de votre écosystème."
          }
        ],

        costAnalysis: `Le coût initial peut sembler élevé, mais l'aquariophilie devient économique sur le long terme. Les frais récurrents se limitent à l'électricité (3-5€/mois), la nourriture (10€/mois) et les produits d'entretien (5€/mois).`,

        roi: `L'aquariophilie offre un retour sur investissement en termes de bien-être et relaxation. Des études montrent que observer un aquarium réduit le stress et la tension artérielle.`,

        comparison1: `L'aquariophilie d'eau douce demande moins de maintenance et coûte moins cher que l'eau de mer, mais offre moins de diversité colorée. Idéale pour débuter.`,

        comparison2: `Les aquariums plantés demandent plus de technique (CO2, éclairage) mais créent des écosystèmes plus stables et esthétiques que les aquariums avec plantes artificielles.`,

        faq: {
          time: "Comptez 6 mois pour maîtriser les bases et 2-3 ans pour devenir vraiment compétent. L'apprentissage continue toute la vie.",
          cost: "Budget minimal 400€, idéalement 600-800€ pour débuter confortablement avec un aquarium de qualité.",
          beginners: "Oui, avec de la patience et de bonnes informations. Commencez par un aquarium communautaire d'eau douce.",
          difficulties: "Maintien de l'équilibre biologique, gestion des maladies, compatibilité des espèces, patience durant le cyclage.",
          equipment: "Privilégiez la qualité de la filtration, choisissez un aquarium assez grand (100L minimum), investissez dans un bon éclairage.",
          training: "Clubs aquariophiles locaux, forums spécialisés, magasins spécialisés, salons aquariophiles, livres de référence."
        }
      };
    }

    // Contenu générique pour autres sujets
    return {
      introduction: `Le domaine du ${keyword} offre de nombreuses opportunités d'apprentissage et de développement. Ce guide vous accompagnera dans votre découverte de ce sujet passionnant.`,
      
      definition: `Le **${keyword}** désigne un ensemble de pratiques, techniques et connaissances spécifiques à ce domaine. Pour bien comprendre le ${keyword}, il faut maîtriser ses concepts fondamentaux et ses applications pratiques.`,

      principles: [
        `La compréhension des bases théoriques du ${keyword}`,
        `L'application pratique des techniques de ${keyword}`,
        `Le développement continu des compétences en ${keyword}`
      ],

      history: `L'évolution du ${keyword} s'est faite progressivement, avec des avancées significatives ces dernières décennies.`,

      equipment: `les outils et équipements spécifiques au domaine du ${keyword}`,
      environment: `un espace de travail adapté à la pratique du ${keyword}`,

      firstSteps: `Commencez par vous familiariser avec les concepts de base du ${keyword}. Pratiquez régulièrement et n'hésitez pas à poser des questions à la communauté.`,

      advancedTechnique1: {
        title: `Technique avancée de ${keyword}`,
        description: `Cette technique permet d'optimiser votre approche du ${keyword} pour obtenir de meilleurs résultats.`,
        steps: [
          `Analyser la situation actuelle`,
          `Appliquer la technique appropriée`,
          `Évaluer les résultats obtenus`
        ]
      },

      advancedTechnique2: {
        title: `Optimisation du ${keyword}`,
        description: `Méthode pour améliorer l'efficacité de votre pratique du ${keyword}.`
      },

      commonMistakes: [
        {
          title: `Précipitation dans l'apprentissage`,
          description: `Vouloir aller trop vite sans maîtriser les bases.`,
          solution: `Prendre le temps nécessaire pour bien assimiler chaque étape.`
        },
        {
          title: `Négligence de la pratique régulière`,
          description: `Ne pas pratiquer suffisamment le ${keyword}.`,
          solution: `Établir un planning de pratique régulière et s'y tenir.`
        },
        {
          title: `Isolement dans l'apprentissage`,
          description: `Ne pas chercher l'aide de la communauté.`,
          solution: `Rejoindre des groupes et forums dédiés au ${keyword}.`
        }
      ],

      beginnerEquipment: `Équipement de base nécessaire pour débuter dans le ${keyword}.`,
      advancedEquipment: `Matériel professionnel pour une pratique avancée du ${keyword}.`,

      budgetBeginner: `100-300€ selon les besoins`,
      budgetIntermediate: `300-800€ pour du matériel de qualité`,
      budgetProfessional: `800€+ pour un équipement professionnel`,

      phase1: `Apprentissage des concepts fondamentaux du ${keyword} et première mise en pratique.`,
      phase2: `Développement des compétences intermédiaires et exploration de techniques avancées.`,
      phase3: `Spécialisation et perfectionnement dans des domaines spécifiques du ${keyword}.`,

      expertTips: [
        {
          title: `Persévérance`,
          advice: `Le ${keyword} demande du temps et de la patience. Les résultats viennent avec la pratique.`
        },
        {
          title: `Formation continue`,
          advice: `Restez informé des évolutions dans le domaine du ${keyword}.`
        },
        {
          title: `Partage d'expérience`,
          advice: `Échangez avec d'autres pratiquants pour enrichir vos connaissances.`
        }
      ],

      costAnalysis: `Le coût du ${keyword} varie selon vos objectifs et votre niveau d'engagement.`,
      roi: `L'investissement dans le ${keyword} peut apporter de nombreux bénéfices personnels et professionnels.`,

      comparison1: `Comparaison entre différentes approches du ${keyword}.`,
      comparison2: `Analyse des avantages et inconvénients des méthodes traditionnelles vs modernes.`,

      faq: {
        time: `Le temps d'apprentissage varie selon votre engagement et vos objectifs.`,
        cost: `Le coût initial dépend de l'équipement choisi et de vos ambitions.`,
        beginners: `Oui, le ${keyword} est accessible aux débutants avec une bonne méthode.`,
        difficulties: `Les principales difficultés incluent la maîtrise technique et la régularité.`,
        equipment: `Choisissez du matériel adapté à votre niveau et à vos besoins.`,
        training: `De nombreuses ressources sont disponibles en ligne et localement.`
      }
    };
  };

  const generateArticle = (userKeyword: string) => {
    const article = generateSeoOptimizedArticle(userKeyword);
    setGeneratedArticle(article);
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(generatedArticle);
    toast.success('Article copié dans le presse-papier');
  };

  const downloadArticle = () => {
    const blob = new Blob([generatedArticle], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-${keyword.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Article téléchargé');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Gradient */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90"></div>
        <CardContent className="relative p-12 text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Générateur de Mots-Clés IA
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Découvrez des mots-clés performants avec l'intelligence artificielle. 
            Analysez la concurrence, générez du contenu optimisé et boostez votre SEO.
          </p>
        </CardContent>
      </Card>

      {/* Main Generator Card */}
      <Card className="shadow-xl border-2 border-gradient-to-r from-blue-200 to-purple-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Générateur de mots-clés
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot-clé principal</label>
              <Input 
                placeholder="ex: marketing digital"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Langue</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                  <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                  <SelectItem value="de">🇩🇪 Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generateKeywords}
              disabled={isLoading || !keyword.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-12 mt-6"
            >
              {isLoading ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Générer les mots-clés
                </>
              )}
            </Button>

            {hasGenerated && generatedArticle && (
              <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-12 mt-6"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Voir l'Article SEO
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center gap-2">
                        <Target className="h-6 w-6 text-blue-500" />
                        Article SEO Optimisé - {keyword} (1500+ mots)
                      </span>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyArticle}
                          className="hover:bg-blue-50 border-blue-200"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadArticle}
                          className="hover:bg-green-50 border-green-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger HTML
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-blue-100 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-gray-800 leading-relaxed font-mono">
                        {generatedArticle}
                      </pre>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {hasGenerated && (
            <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">
                ✨ {keywords.length} mots-clés générés + Article SEO 1500+ mots avec title (60 car.) et meta (152 car.) !
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      {hasGenerated && (
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-t-xl">
              <KeywordTabsNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                hasResults={hasGenerated} 
              />
            </div>
            <div className="p-6">
              <KeywordTabsContent 
                activeTab={activeTab} 
                keywords={keywords} 
                keyword={keyword} 
              />
            </div>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && !isLoading && (
        <Card className="p-16 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200">
          <div className="p-6 bg-white rounded-full w-32 h-32 mx-auto mb-6 shadow-lg">
            <Search className="h-20 w-20 text-blue-400 mx-auto mt-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Commencez votre recherche</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Entrez un mot-clé pour générer des suggestions intelligentes, 
            analyser la concurrence et créer un article SEO optimisé de 1500+ mots 
            avec title (60 caractères) et meta description (152 caractères).
          </p>
        </Card>
      )}
    </div>
  );
};

export default AdvancedKeywordGenerator;
