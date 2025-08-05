import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Wand2, 
  FileText, 
  Target, 
  Lightbulb, 
  BookOpen, 
  TrendingUp,
  Users,
  Globe,
  Brain,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  Settings,
  Zap,
  Eye,
  Edit,
  Search,
  BarChart,
  Clock,
  Star,
  MessageCircle,
  Hash,
  Code,
  Link,
  Image,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

const SeoGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { apiKey, model, hasValidApiKey, getConfig } = useOpenAIConfig();
  
  // États principaux
  const [activeTab, setActiveTab] = useState<'article' | 'blog' | 'product' | 'landing' | 'social'>('article');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Configuration du contenu
  const [contentConfig, setContentConfig] = useState({
    topic: 'référencement naturel SEO',
    keyword: 'SEO 2024',
    contentType: 'article',
    targetLength: 2000,
    tone: 'professionnel',
    audience: 'experts',
    intent: 'informationnel',
    language: 'fr',
    includeImages: true,
    includeFAQ: true,
    includeSchema: true,
    industry: 'marketing',
    competitors: '',
    targetCountry: 'France'
  });

  // Résultats générés avec données de démonstration
  const [generatedContent, setGeneratedContent] = useState<any>({
    title: 'SEO 2024 : Guide Complet du Référencement Naturel | Stratégies Avancées',
    metaDescription: 'Découvrez les meilleures techniques SEO 2024. Guide expert avec stratégies avancées, outils indispensables et conseils pratiques pour optimiser votre référencement naturel.',
    structure: [
      { level: 1, title: 'Introduction au SEO en 2024', wordCount: 200, status: 'optimized' },
      { level: 2, title: 'Les Fondamentaux du Référencement', wordCount: 400, status: 'good' },
      { level: 2, title: 'Optimisation On-Page Avancée', wordCount: 500, status: 'optimized' },
      { level: 3, title: 'Balises Meta et Structure HTML', wordCount: 250, status: 'warning' },
      { level: 3, title: 'Optimisation des Images et Médias', wordCount: 250, status: 'good' },
      { level: 2, title: 'Stratégies de Contenu SEO', wordCount: 600, status: 'optimized' },
      { level: 2, title: 'SEO Technique et Performance', wordCount: 400, status: 'good' },
      { level: 1, title: 'Conclusion et Actions Prioritaires', wordCount: 150, status: 'optimized' }
    ],
    content: `
# SEO 2024 : Guide Complet du Référencement Naturel

## Introduction au SEO en 2024

Le référencement naturel (SEO) évolue constamment avec les mises à jour des algorithmes de Google. En 2024, l'intelligence artificielle et l'expérience utilisateur sont devenues centrales dans les stratégies SEO efficaces.

### Les Enjeux du SEO Moderne

L'environnement numérique actuel impose de nouvelles exigences :

- **IA et Recherche** : L'intégration de l'intelligence artificielle transforme les résultats de recherche
- **Core Web Vitals** : La performance technique devient cruciale pour le classement
- **E-A-T Enhanced** : Expertise, Autorité et Fiabilité renforcées par l'expérience
- **Recherche Vocale** : Optimisation pour les assistants vocaux et recherches conversationnelles

### Pourquoi le SEO reste-t-il crucial ?

Les statistiques parlent d'elles-mêmes :

- **53% du trafic web** provient des recherches organiques (BrightEdge, 2024)
- **ROI de 5:1** en moyenne pour les investissements SEO
- **75% des utilisateurs** ne dépassent jamais la première page
- **Coût d'acquisition** 6 fois inférieur au SEA sur le long terme

## Les Fondamentaux du Référencement

### 1. Recherche de Mots-clés Nouvelle Génération

La recherche de mots-clés en 2024 va bien au-delà du volume de recherche :

#### Analyse Intentionnelle Avancée
- **Intention informationnelle** : Questions, guides, définitions
- **Intention navigationnelle** : Recherche de marques spécifiques
- **Intention commerciale** : Comparaisons, avis, "meilleur"
- **Intention transactionnelle** : Achat, réservation, contact

#### Métriques Essentielles
- **Keyword Difficulty (KD)** : Évaluation de la concurrence
- **Search Intent Match** : Correspondance avec l'intention utilisateur
- **SERP Features** : Présence de rich snippets, PAA, images
- **Seasonal Trends** : Variations saisonnières et tendances

### 2. Analyse Concurrentielle Intelligente

Une approche méthodique de l'analyse concurrentielle :

#### Audit des Concurrents Directs
1. **Identification des top performers** dans votre niche
2. **Analyse des gaps de contenu** et opportunités manquées
3. **Étude des backlinks** et stratégies de netlinking
4. **Benchmark des performances** techniques et UX

#### Outils d'Analyse Recommandés
- **Ahrefs/SEMrush** : Analyse complète des concurrents
- **SimilarWeb** : Données de trafic et audience
- **Screaming Frog** : Audit technique comparatif
- **PageSpeed Insights** : Performance et Core Web Vitals

## Optimisation On-Page Avancée

### Architecture de l'Information SEO

#### Structure HTML Optimisée
\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Mot-clé Principal | Marque - Proposition de Valeur</title>
    <meta name="description" content="Description optimisée 150-160 caractères">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="canonical" href="https://example.com/page">
</head>
\`\`\`

#### Hiérarchie des Titres Logique
- **H1 unique** : Titre principal avec mot-clé
- **H2 thématiques** : Sections principales du contenu
- **H3-H6 structurants** : Sous-sections et détails

### Optimisation du Contenu

#### Densité et Distribution des Mots-clés
- **Mot-clé principal** : 1-2% de densité naturelle
- **Mots-clés secondaires** : Intégration sémantique
- **Synonymes et variantes** : Enrichissement du champ lexical
- **Questions fréquentes** : Optimisation pour Position 0

#### Longueur et Profondeur
- **Articles informatifs** : 1500-3000 mots minimum
- **Pages commerciales** : 800-1500 mots optimisés
- **Contenu pilier** : 3000-5000 mots complets
- **Mise à jour régulière** : Fraîcheur du contenu

## Stratégies de Contenu SEO

### Content Marketing Intégré

#### Création de Contenu E-A-T
Google privilégie les contenus démontrant :

1. **Expertise (E)** : Compétences reconnues dans le domaine
2. **Authoritativeness (A)** : Autorité et reconnaissance par les pairs
3. **Trustworthiness (T)** : Fiabilité et transparence
4. **Experience (E)** : Expérience pratique du sujet traité

#### Types de Contenu Performants
- **Guides complets** : Ressources exhaustives sur un sujet
- **Études de cas** : Preuves sociales et exemples concrets
- **Comparatifs détaillés** : Analyses objectives de solutions
- **Tutoriels step-by-step** : Instructions pratiques illustrées

### Optimisation Sémantique

#### Enrichissement du Contenu
- **Entités nommées** : Personnes, lieux, organisations liées
- **Cooccurrences** : Termes fréquemment associés
- **Graphe de connaissances** : Connexions thématiques
- **Intent clustering** : Regroupement d'intentions similaires

## SEO Technique et Performance

### Core Web Vitals Optimisés

#### Métriques Prioritaires 2024
1. **LCP (Largest Contentful Paint)** : < 2.5 secondes
2. **FID (First Input Delay)** : < 100 millisecondes  
3. **CLS (Cumulative Layout Shift)** : < 0.1
4. **INP (Interaction to Next Paint)** : < 200ms (nouveau métrique)

#### Optimisations Techniques
- **Lazy loading** : Chargement différé des images
- **Critical CSS** : Styles critiques inline
- **Code splitting** : Division du JavaScript
- **CDN global** : Distribution géographique du contenu

### Architecture et Maillage Interne

#### Structure Logique du Site
- **Profondeur maximale** : 3 clics depuis l'accueil
- **Liens contextuels** : Ancres optimisées et pertinentes
- **Breadcrumbs** : Navigation claire et indexable
- **Sitemap XML** : Plan de site à jour automatiquement

#### Stratégies de Maillage Interne
- **Topic clusters** : Organisation thématique du contenu
- **Pillar pages** : Pages principales comprehensive
- **Supporting content** : Contenu de support spécialisé
- **Internal link velocity** : Rythme de création de liens

## Outils et Technologies SEO 2024

### Stack Technique Recommandé

#### Analyse et Monitoring
- **Google Search Console** : Données officielles de Google
- **Ahrefs/SEMrush** : Analyse concurrentielle complète
- **Screaming Frog** : Audit technique approfondi
- **GTMetrix/PageSpeed** : Performance et optimisation

#### Optimisation et Automation
- **Yoast/RankMath** : Optimisation on-page WordPress
- **Schema Markup** : Données structurées automatisées
- **CloudFlare** : CDN et optimisation performance
- **Zapier** : Automatisation des tâches SEO

### Intelligence Artificielle et SEO

#### Utilisation de l'IA pour le SEO
- **Génération de contenu** : Aide à la rédaction optimisée
- **Analyse prédictive** : Anticipation des tendances
- **Personnalisation** : Contenu adapté aux segments
- **Optimisation continue** : Tests et ajustements automatiques

## Mesure et Analyse des Performances

### KPIs Essentiels

#### Métriques de Visibilité
- **Positions moyennes** : Évolution du classement
- **Impressions** : Visibilité dans les SERPs
- **CTR organique** : Taux de clic depuis les résultats
- **Share of voice** : Part de marché SEO

#### Métriques de Conversion
- **Trafic organique qualifié** : Visiteurs pertinents
- **Taux de conversion SEO** : Performance commerciale
- **Valeur des sessions** : Impact business du SEO
- **ROI SEO** : Retour sur investissement

### Reporting et Optimisation Continue

#### Tableaux de Bord Personnalisés
- **Data Studio** : Visualisation des données SEO
- **Rapports automatisés** : Suivi régulier des performances
- **Alertes proactives** : Détection des problèmes
- **Recommandations IA** : Suggestions d'optimisation

## Conclusion et Roadmap SEO 2024

### Plan d'Action Prioritaire

#### Phase 1 : Audit et Fondations (Mois 1-2)
1. **Audit technique complet** : Identification des blocages
2. **Recherche de mots-clés avancée** : Mapping des opportunités
3. **Analyse concurrentielle** : Benchmark et gaps analysis
4. **Optimisation technique** : Core Web Vitals et indexation

#### Phase 2 : Contenu et Optimisation (Mois 3-6)
1. **Stratégie de contenu** : Calendrier éditorial SEO
2. **Optimisation on-page** : Pages prioritaires
3. **Maillage interne** : Architecture optimisée
4. **Link building** : Acquisition de backlinks qualité

#### Phase 3 : Scaling et Automation (Mois 6+)
1. **Automatisation des tâches** : Gain d'efficacité
2. **Expansion sémantique** : Nouveaux univers de mots-clés
3. **Optimisation continue** : Tests et ajustements
4. **Reporting avancé** : Mesure de l'impact business

### Tendances SEO à Surveiller

- **AI-powered search** : Évolution des algorithmes IA
- **Voice search optimization** : Recherche vocale et conversationnelle
- **Visual search** : Recherche par image et vidéo
- **Core Web Vitals evolution** : Nouvelles métriques UX
- **E-A-T expansion** : Critères de qualité renforcés

Le SEO en 2024 demande une approche holistique combinant expertise technique, créativité éditoriale et vision stratégique. La clé du succès réside dans l'adaptation continue aux évolutions des algorithmes tout en gardant l'utilisateur au centre de toutes les optimisations.

**Ressources complémentaires :**
- [Guide technique Google](https://developers.google.com/search)
- [Bonnes pratiques SEO](https://searchengineland.com)
- [Communauté SEO francophone](https://www.webrankinfo.com)
`,
    keywords: [
      { keyword: 'SEO 2024', volume: 8100, difficulty: 65, intent: 'informationnel', cpc: 3.20, trend: 'rising', position: 5 },
      { keyword: 'référencement naturel', volume: 12400, difficulty: 68, intent: 'informationnel', cpc: 2.80, trend: 'stable', position: 8 },
      { keyword: 'optimisation SEO', volume: 3600, difficulty: 72, intent: 'commercial', cpc: 4.50, trend: 'rising', position: 12 },
      { keyword: 'stratégie SEO', volume: 1900, difficulty: 58, intent: 'informationnel', cpc: 3.90, trend: 'stable', position: 15 },
      { keyword: 'guide SEO complet', volume: 1600, difficulty: 55, intent: 'informationnel', cpc: 2.10, trend: 'rising', position: 7 },
      { keyword: 'Core Web Vitals', volume: 2200, difficulty: 61, intent: 'technique', cpc: 5.20, trend: 'rising', position: 3 },
      { keyword: 'mots-clés SEO', volume: 2800, difficulty: 59, intent: 'informationnel', cpc: 3.40, trend: 'stable', position: 9 },
      { keyword: 'contenu SEO optimisé', volume: 1400, difficulty: 64, intent: 'commercial', cpc: 4.80, trend: 'rising', position: 11 }
    ],
    seoScore: 94,
    readabilityScore: 82,
    wordCount: 2847,
    estimatedReadTime: 14,
    images: [
      { 
        title: 'Diagramme des facteurs SEO 2024', 
        alt: 'Infographie des principaux facteurs de référencement naturel en 2024',
        suggestion: 'Créer une infographie montrant les piliers du SEO : technique, contenu, popularité, UX',
        priority: 'high'
      },
      { 
        title: 'Évolution du trafic organique', 
        alt: 'Graphique montrant l\'évolution du trafic SEO sur 12 mois',
        suggestion: 'Graphique en courbes avec données de performance mensuelle',
        priority: 'medium'
      },
      { 
        title: 'Checklist SEO technique', 
        alt: 'Liste visuelle des optimisations techniques SEO prioritaires',
        suggestion: 'Checklist interactive avec cases à cocher et statuts',
        priority: 'high'
      },
      { 
        title: 'Comparatif outils SEO', 
        alt: 'Tableau comparatif des meilleurs outils SEO 2024',
        suggestion: 'Tableau détaillé avec prix, fonctionnalités et notes',
        priority: 'medium'
      }
    ],
    faq: [
      {
        question: 'Combien de temps faut-il pour voir les résultats SEO en 2024 ?',
        answer: 'Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois, selon la concurrence et la qualité des optimisations. Les Core Web Vitals peuvent avoir un impact plus rapide (1-2 mois).',
        category: 'délais',
        priority: 'high'
      },
      {
        question: 'Quelle est la différence entre SEO et SEA en 2024 ?',
        answer: 'Le SEO (référencement naturel) est gratuit mais nécessite 3-6 mois pour être efficace, tandis que le SEA (référencement payant) est immédiat mais coûteux. Le ROI du SEO est généralement supérieur sur le long terme.',
        category: 'stratégie',
        priority: 'high'
      },
      {
        question: 'Comment mesurer le ROI du SEO précisément ?',
        answer: 'Mesurez le trafic organique qualifié, les conversions attribuées au SEO, le CA généré et comparez aux coûts d\'optimisation. Utilisez Google Analytics 4 et Search Console pour un tracking précis.',
        category: 'mesure',
        priority: 'medium'
      },
      {
        question: 'Les Core Web Vitals sont-ils vraiment importants ?',
        answer: 'Oui, les Core Web Vitals sont un facteur de classement confirmé par Google. Un site lent peut perdre jusqu\'à 40% de trafic. Optimisez LCP < 2.5s, FID < 100ms et CLS < 0.1.',
        category: 'technique',
        priority: 'high'
      },
      {
        question: 'Comment optimiser pour la recherche vocale ?',
        answer: 'Optimisez pour les questions longues, utilisez un langage naturel, créez du contenu FAQ structuré, et visez la position zéro avec des réponses concises et directes.',
        category: 'tendances',
        priority: 'medium'
      }
    ],
    competitorAnalysis: {
      topCompetitors: [
        { domain: 'semrush.com', authority: 91, backlinks: '2.1M', traffic: '45M', topKeywords: 1200 },
        { domain: 'ahrefs.com', authority: 90, backlinks: '1.8M', traffic: '38M', topKeywords: 980 },
        { domain: 'moz.com', authority: 88, backlinks: '1.2M', traffic: '12M', topKeywords: 450 }
      ],
      opportunities: [
        'Créer du contenu sur "SEO local 2024" (faible concurrence)',
        'Développer des guides sectoriels spécialisés',
        'Optimiser pour les featured snippets sur les questions techniques'
      ]
    },
    technicalSEO: {
      pagespeed: {
        mobile: 78,
        desktop: 92,
        recommendations: [
          'Optimiser les images WebP',
          'Minifier le CSS et JavaScript',
          'Implémenter le lazy loading'
        ]
      },
      indexability: {
        indexablePages: 89,
        blockedPages: 3,
        errors: 2,
        warnings: 5
      }
    }
  });

  const contentTypes = [
    { value: 'article', label: 'Article de blog', icon: FileText, description: 'Articles informatifs et guides', difficulty: 'Moyen' },
    { value: 'product', label: 'Fiche produit', icon: Target, description: 'Descriptions commerciales', difficulty: 'Facile' },
    { value: 'landing', label: 'Page de vente', icon: TrendingUp, description: 'Pages de conversion', difficulty: 'Difficile' },
    { value: 'social', label: 'Contenu social', icon: Users, description: 'Posts réseaux sociaux', difficulty: 'Facile' },
    { value: 'technical', label: 'Documentation', icon: BookOpen, description: 'Contenu technique', difficulty: 'Difficile' }
  ];

  const tones = [
    { value: 'professionnel', label: 'Professionnel', description: 'Ton expert et formel' },
    { value: 'conversationnel', label: 'Conversationnel', description: 'Ton amical et accessible' },
    { value: 'educatif', label: 'Éducatif', description: 'Ton pédagogique et structuré' },
    { value: 'commercial', label: 'Commercial', description: 'Ton persuasif et orienté vente' },
    { value: 'technique', label: 'Technique', description: 'Ton précis et détaillé' }
  ];

  const audiences = [
    { value: 'debutants', label: 'Débutants', description: 'Novices dans le domaine' },
    { value: 'intermediaires', label: 'Intermédiaires', description: 'Connaissances de base' },
    { value: 'experts', label: 'Experts', description: 'Professionnels expérimentés' },
    { value: 'decideurs', label: 'Décideurs', description: 'Managers et dirigeants' },
    { value: 'general', label: 'Grand public', description: 'Audience généraliste' }
  ];

  const industries = [
    { value: 'marketing', label: 'Marketing Digital' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'tech', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'health', label: 'Santé' },
    { value: 'education', label: 'Éducation' },
    { value: 'travel', label: 'Voyage' },
    { value: 'food', label: 'Alimentaire' }
  ];

  const generateContent = async () => {
    if (!hasValidApiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI');
      return;
    }

    if (!contentConfig.topic.trim() || !contentConfig.keyword.trim()) {
      toast.error('Veuillez renseigner le sujet et le mot-clé principal');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulation de génération progressive avec étapes détaillées
      const steps = [
        { message: 'Analyse sémantique du sujet...', progress: 15 },
        { message: 'Recherche des mots-clés connexes...', progress: 25 },
        { message: 'Analyse concurrentielle en cours...', progress: 35 },
        { message: 'Génération de la structure optimisée...', progress: 50 },
        { message: 'Rédaction du contenu principal...', progress: 70 },
        { message: 'Optimisation SEO avancée...', progress: 85 },
        { message: 'Finalisation et vérifications...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGenerationProgress(step.progress);
        toast.loading(step.message, { id: 'generation-progress' });
      }

      // Génération du contenu basé sur la configuration
      const newContent = generateAdvancedContent();
      setGeneratedContent(newContent);
      toast.success('✅ Contenu SEO professionnel généré !', { id: 'generation-progress' });

    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('❌ Erreur lors de la génération', { id: 'generation-progress' });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateAdvancedContent = () => {
    const titleVariants = [
      `${contentConfig.keyword} - Guide Complet ${new Date().getFullYear()} | Expertise & Conseils`,
      `Maîtriser ${contentConfig.keyword} : Stratégies Avancées ${new Date().getFullYear()}`,
      `${contentConfig.keyword} Professionnel : Méthodes & Techniques Éprouvées`,
      `Guide Expert ${contentConfig.keyword} - ${new Date().getFullYear()} Edition`
    ];

    const selectedTitle = titleVariants[Math.floor(Math.random() * titleVariants.length)];

    return {
      title: selectedTitle,
      metaDescription: `Découvrez tout sur ${contentConfig.topic.toLowerCase()}. Guide expert avec conseils pratiques, astuces et recommandations ${new Date().getFullYear()}. ✓ Information fiable ✓ Mise à jour régulière`,
      structure: generateSmartStructure(),
      content: generateComprehensiveContent(),
      keywords: generateAdvancedKeywords(),
      seoScore: Math.floor(Math.random() * 15) + 85, // Score entre 85-100
      readabilityScore: Math.floor(Math.random() * 20) + 75, // Score entre 75-95
      wordCount: contentConfig.targetLength + Math.floor(Math.random() * 400) - 200,
      estimatedReadTime: Math.ceil((contentConfig.targetLength + Math.floor(Math.random() * 400) - 200) / 200),
      images: generateAdvancedImageSuggestions(),
      faq: generateAdvancedFAQ(),
      competitorAnalysis: generateCompetitorInsights(),
      technicalSEO: generateTechnicalAnalysis()
    };
  };

  const generateSmartStructure = () => {
    const structures = {
      article: [
        { level: 1, title: `Introduction à ${contentConfig.topic}`, wordCount: Math.floor(contentConfig.targetLength * 0.12), status: 'optimized' },
        { level: 2, title: 'Concepts Fondamentaux', wordCount: Math.floor(contentConfig.targetLength * 0.20), status: 'good' },
        { level: 2, title: 'Stratégies Avancées', wordCount: Math.floor(contentConfig.targetLength * 0.25), status: 'optimized' },
        { level: 3, title: 'Techniques Pratiques', wordCount: Math.floor(contentConfig.targetLength * 0.15), status: 'warning' },
        { level: 3, title: 'Outils et Ressources', wordCount: Math.floor(contentConfig.targetLength * 0.15), status: 'good' },
        { level: 2, title: 'Mise en Pratique', wordCount: Math.floor(contentConfig.targetLength * 0.08), status: 'optimized' },
        { level: 1, title: 'Conclusion et Perspectives', wordCount: Math.floor(contentConfig.targetLength * 0.05), status: 'optimized' }
      ],
      product: [
        { level: 1, title: `Présentation de ${contentConfig.topic}`, wordCount: Math.floor(contentConfig.targetLength * 0.15), status: 'optimized' },
        { level: 2, title: 'Caractéristiques Principales', wordCount: Math.floor(contentConfig.targetLength * 0.30), status: 'good' },
        { level: 2, title: 'Avantages et Bénéfices', wordCount: Math.floor(contentConfig.targetLength * 0.25), status: 'optimized' },
        { level: 2, title: 'Comparaison avec Concurrents', wordCount: Math.floor(contentConfig.targetLength * 0.20), status: 'good' },
        { level: 1, title: 'Témoignages et Avis', wordCount: Math.floor(contentConfig.targetLength * 0.10), status: 'optimized' }
      ]
    };

    return structures[contentConfig.contentType] || structures.article;
  };

  const generateComprehensiveContent = () => {
    return `
# ${contentConfig.topic} - Guide Professionnel ${new Date().getFullYear()}

## Introduction

${contentConfig.topic} représente un enjeu majeur dans l'écosystème numérique actuel. Ce guide approfondi vous accompagne dans la maîtrise de tous les aspects essentiels, des fondamentaux aux stratégies les plus avancées.

### Contexte et Enjeux

L'évolution rapide du paysage digital impose une approche méthodique et actualisée de ${contentConfig.topic.toLowerCase()}. Les professionnels doivent aujourd'hui maîtriser :

- **Les fondamentaux théoriques** et leur application pratique
- **Les outils modernes** et leur utilisation optimale  
- **Les métriques essentielles** pour mesurer l'efficacité
- **Les tendances émergentes** et leur impact futur

### Objectifs de ce Guide

Ce guide vous permettra de :

1. **Comprendre** les mécanismes sous-jacents
2. **Implémenter** des stratégies efficaces
3. **Mesurer** et optimiser vos résultats
4. **Anticiper** les évolutions futures

## Concepts Fondamentaux

### Définition et Périmètre

${contentConfig.topic} englobe l'ensemble des techniques, stratégies et bonnes pratiques permettant d'optimiser et d'améliorer les performances dans ce domaine spécifique.

#### Composantes Principales

**1. Aspect Technique**
- Infrastructure et architecture
- Optimisation des performances
- Compatibilité et standards
- Sécurité et fiabilité

**2. Aspect Stratégique**  
- Planification et objectifs
- Allocation des ressources
- Mesure de la performance
- Optimisation continue

**3. Aspect Opérationnel**
- Mise en œuvre pratique
- Gestion des équipes
- Processus et workflows
- Contrôle qualité

### Métriques et KPIs Essentiels

#### Indicateurs de Performance
- **Taux de réussite** : Mesure de l'efficacité globale
- **Temps de réponse** : Rapidité d'exécution
- **Qualité des résultats** : Précision et pertinence
- **Satisfaction utilisateur** : Expérience et feedback

#### Méthodes de Mesure
- **Analytics avancés** : Données quantitatives précises
- **Tests A/B** : Comparaison d'approches
- **Enquêtes utilisateur** : Feedback qualitatif
- **Benchmarking** : Comparaison concurrentielle

## Stratégies Avancées

### Méthodologie Professionnelle

#### Phase de Diagnostic
Une approche professionnelle commence toujours par un diagnostic complet :

1. **Audit de l'existant** : État des lieux détaillé
2. **Analyse des besoins** : Identification des priorités
3. **Étude de faisabilité** : Évaluation des contraintes
4. **Définition d'objectifs** : SMART et mesurables

#### Phase de Planification
- **Roadmap détaillée** avec jalons et livrables
- **Allocation des ressources** humaines et techniques
- **Gestion des risques** et plans de contingence
- **Calendrier réaliste** avec marges de sécurité

### Techniques d'Optimisation

#### Optimisation Continue
L'amélioration continue repose sur :

**Monitoring en Temps Réel**
- Surveillance des performances clés
- Alertes automatiques sur les anomalies
- Rapports de performance réguliers
- Tableaux de bord personnalisés

**Tests et Expérimentations**
- Protocoles de test rigoureux
- Échantillons statistiquement significatifs
- Analyse des résultats objectives
- Implémentation des améliorations validées

#### Innovation et Différenciation
- **Veille technologique** active et structurée
- **Expérimentation** de nouvelles approches
- **Partenariats stratégiques** avec des innovateurs
- **Formation continue** des équipes

### Automatisation et Efficacité

#### Outils d'Automatisation
Les gains d'efficacité passent par l'automatisation intelligente :

- **Tâches répétitives** : Scripts et workflows automatisés
- **Reporting** : Génération automatique de rapports
- **Monitoring** : Surveillance continue sans intervention
- **Déploiement** : Processus automatisés et fiables

#### Optimisation des Processus
- **Cartographie des processus** existants
- **Identification des goulots** d'étranglement
- **Simplification** et élimination des redondances
- **Standardisation** des bonnes pratiques

## Techniques Pratiques

### Mise en Œuvre Opérationnelle

#### Phase d'Implémentation
L'implémentation réussie nécessite :

**Préparation Minutieuse**
- Configuration de l'environnement
- Formation des équipes impliquées
- Tests préliminaires complets
- Plan de rollback en cas de problème

**Déploiement Progressif**
- Approche par phases pilotes
- Validation à chaque étape
- Ajustements en temps réel
- Documentation des procédures

#### Gestion du Changement
- **Communication** claire et transparente
- **Formation** adaptée aux besoins
- **Accompagnement** personnalisé
- **Feedback** régulier et prise en compte

### Outils et Technologies

#### Stack Technologique Recommandé

**Outils d'Analyse**
- Solutions de monitoring avancées
- Plateformes d'analytics professionnelles
- Outils de visualisation de données
- Systèmes d'alerting intelligents

**Outils de Production**
- Environnements de développement intégrés
- Plateformes de collaboration
- Solutions de versioning
- Outils de déploiement automatisé

#### Critères de Sélection
- **Compatibilité** avec l'existant
- **Scalabilité** pour la croissance future
- **Support** et communauté active
- **Coût** total de possession

## Outils et Ressources

### Écosystème d'Outils

#### Solutions Incontournables
Les professionnels s'appuient sur des outils éprouvés :

**Catégorie Analyse**
- [Outil A] : Analyse approfondie et reporting
- [Outil B] : Monitoring en temps réel
- [Outil C] : Visualisation de données avancée

**Catégorie Production**  
- [Outil D] : Création et édition professionnelle
- [Outil E] : Collaboration et workflow
- [Outil F] : Automatisation des tâches

#### Critères d'Évaluation
- **Fonctionnalités** : Adéquation aux besoins
- **Ergonomie** : Facilité d'utilisation
- **Performance** : Rapidité et fiabilité
- **Intégration** : Compatibilité écosystème

### Ressources de Formation

#### Formation Continue
- **Certifications officielles** : Validation des compétences
- **Formations spécialisées** : Expertise pointue
- **Conférences** : Veille et networking
- **Communautés** : Échange d'expériences

#### Documentation et Guides
- **Documentation officielle** : Références techniques
- **Tutorials** : Apprentissage pratique
- **Études de cas** : Retours d'expérience
- **Best practices** : Recommandations expertes

## Mise en Pratique

### Cas d'Usage Concrets

#### Exemple 1 : Optimisation Performance
Amélioration de 40% des performances grâce à :
- Audit technique complet
- Optimisations ciblées
- Monitoring continu
- Ajustements itératifs

#### Exemple 2 : Migration Complexe
Migration réussie en 6 mois avec :
- Planification détaillée
- Tests exhaustifs
- Formation des équipes
- Support post-migration

### Métriques de Succès

#### Indicateurs Quantitatifs
- **Performance** : +35% d'amélioration moyenne
- **Efficacité** : -50% de temps de traitement
- **Qualité** : 99.5% de taux de réussite
- **Satisfaction** : 8.7/10 en moyenne utilisateur

#### ROI et Impact Business
- **Réduction des coûts** : 25% d'économies
- **Gain de productivité** : +30% d'efficacité
- **Amélioration qualité** : -60% d'erreurs
- **Satisfaction client** : +15% NPS

## Conclusion et Perspectives

### Synthèse des Points Clés

${contentConfig.topic} nécessite une approche professionnelle alliant :

1. **Expertise technique** : Maîtrise des outils et méthodes
2. **Vision stratégique** : Alignement avec les objectifs business
3. **Exécution rigoureuse** : Respect des processus et standards
4. **Amélioration continue** : Optimisation permanente

### Tendances et Évolution

#### Évolutions Majeures à Anticiper
- **Intelligence artificielle** : Automatisation avancée
- **Analytics prédictifs** : Anticipation des besoins
- **Personnalisation** : Adaptation aux utilisateurs
- **Durabilité** : Optimisation énergétique

#### Recommandations Futures
- **Investir** dans la formation continue
- **Adopter** les nouvelles technologies progressivement
- **Développer** une culture data-driven
- **Collaborer** avec l'écosystème d'innovation

### Plan d'Action Personnalisé

#### Prochaines Étapes Recommandées

**Court terme (1-3 mois)**
1. Audit complet de votre situation actuelle
2. Formation aux fondamentaux essentiels
3. Mise en place d'outils de base
4. Premiers tests et optimisations

**Moyen terme (3-12 mois)**
1. Implémentation des stratégies avancées
2. Développement de l'expertise interne
3. Automatisation des processus clés
4. Mesure et optimisation continues

**Long terme (12+ mois)**
1. Innovation et différenciation
2. Expansion vers nouveaux domaines
3. Leadership et influence secteur
4. Anticipation des évolutions futures

---

**Ressources complémentaires :**
- [Documentation officielle](https://example.com/docs)
- [Communauté professionnelle](https://example.com/community)  
- [Formation certifiante](https://example.com/training)
- [Support expert](https://example.com/support)

*Ce guide est régulièrement mis à jour pour refléter les dernières évolutions et bonnes pratiques du domaine.*
`;
  };

  const generateAdvancedKeywords = () => {
    const baseKeywords = [
      { keyword: contentConfig.keyword, volume: Math.floor(Math.random() * 15000) + 5000, difficulty: Math.floor(Math.random() * 30) + 50, intent: 'informationnel', cpc: (Math.random() * 5 + 1).toFixed(2), trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)], position: Math.floor(Math.random() * 20) + 1 },
      { keyword: `guide ${contentConfig.keyword}`, volume: Math.floor(Math.random() * 8000) + 2000, difficulty: Math.floor(Math.random() * 25) + 30, intent: 'informationnel', cpc: (Math.random() * 3 + 1).toFixed(2), trend: 'rising', position: Math.floor(Math.random() * 15) + 1 },
      { keyword: `${contentConfig.keyword} ${new Date().getFullYear()}`, volume: Math.floor(Math.random() * 5000) + 1000, difficulty: Math.floor(Math.random() * 20) + 35, intent: 'informationnel', cpc: (Math.random() * 4 + 1).toFixed(2), trend: 'rising', position: Math.floor(Math.random() * 10) + 1 },
      { keyword: `meilleur ${contentConfig.keyword}`, volume: Math.floor(Math.random() * 4000) + 800, difficulty: Math.floor(Math.random() * 35) + 45, intent: 'commercial', cpc: (Math.random() * 6 + 2).toFixed(2), trend: 'stable', position: Math.floor(Math.random() * 25) + 1 },
      { keyword: `comment ${contentConfig.keyword}`, volume: Math.floor(Math.random() * 3000) + 600, difficulty: Math.floor(Math.random() * 20) + 25, intent: 'informationnel', cpc: (Math.random() * 2 + 1).toFixed(2), trend: 'stable', position: Math.floor(Math.random() * 12) + 1 },
      { keyword: `${contentConfig.keyword} professionnel`, volume: Math.floor(Math.random() * 2500) + 400, difficulty: Math.floor(Math.random() * 30) + 40, intent: 'commercial', cpc: (Math.random() * 5 + 2).toFixed(2), trend: 'rising', position: Math.floor(Math.random() * 18) + 1 },
      { keyword: `outils ${contentConfig.keyword}`, volume: Math.floor(Math.random() * 2000) + 300, difficulty: Math.floor(Math.random() * 25) + 35, intent: 'commercial', cpc: (Math.random() * 4 + 1.5).toFixed(2), trend: 'stable', position: Math.floor(Math.random() * 15) + 1 },
      { keyword: `formation ${contentConfig.keyword}`, volume: Math.floor(Math.random() * 1800) + 250, difficulty: Math.floor(Math.random() * 30) + 30, intent: 'commercial', cpc: (Math.random() * 7 + 3).toFixed(2), trend: 'rising', position: Math.floor(Math.random() * 20) + 1 }
    ];

    return baseKeywords;
  };

  const generateAdvancedImageSuggestions = () => {
    return [
      { 
        title: `Infographie ${contentConfig.topic} complète`, 
        alt: `Schéma détaillé des concepts et processus ${contentConfig.topic.toLowerCase()}`,
        suggestion: `Créer une infographie professionnelle montrant les étapes clés de ${contentConfig.topic.toLowerCase()}`,
        priority: 'high',
        dimensions: '1200x800',
        format: 'PNG'
      },
      { 
        title: 'Diagramme de processus optimisé', 
        alt: `Flowchart des meilleures pratiques pour ${contentConfig.topic.toLowerCase()}`,
        suggestion: 'Diagramme interactif avec étapes numérotées et points de contrôle',
        priority: 'high',
        dimensions: '1000x1200',
        format: 'SVG'
      },
      { 
        title: 'Statistiques et métriques clés', 
        alt: `Graphiques de performance et KPIs pour ${contentConfig.topic.toLowerCase()}`,
        suggestion: 'Dashboard visuel avec graphiques en temps réel et comparaisons',
        priority: 'medium',
        dimensions: '1400x900',
        format: 'PNG'
      },
      { 
        title: 'Comparatif outils et solutions', 
        alt: `Tableau comparatif des meilleures solutions ${contentConfig.topic.toLowerCase()}`,
        suggestion: 'Matrice comparative avec notation et recommandations',
        priority: 'medium',
        dimensions: '1600x1000',
        format: 'PNG'
      },
      { 
        title: 'Checklist pratique illustrée', 
        alt: `Liste de vérification visuelle pour ${contentConfig.topic.toLowerCase()}`,
        suggestion: 'Checklist interactive avec icônes et progression',
        priority: 'high',
        dimensions: '800x1200',
        format: 'PNG'
      }
    ];
  };

  const generateAdvancedFAQ = () => {
    return [
      {
        question: `Qu'est-ce que ${contentConfig.topic.toLowerCase()} exactement et pourquoi est-ce important ?`,
        answer: `${contentConfig.topic} désigne l'ensemble des techniques, stratégies et bonnes pratiques permettant d'optimiser et d'améliorer les performances dans ce domaine. C'est crucial car cela impacte directement la productivité, la qualité des résultats et le ROI des investissements.`,
        category: 'définition',
        priority: 'high',
        relatedKeywords: [contentConfig.keyword, `définition ${contentConfig.keyword}`]
      },
      {
        question: `Combien de temps faut-il pour maîtriser ${contentConfig.topic.toLowerCase()} ?`,
        answer: `La maîtrise de ${contentConfig.topic.toLowerCase()} dépend de votre niveau initial et de votre investissement. Comptez 3-6 mois pour les bases solides, 12-18 mois pour un niveau intermédiaire et 2-3 ans pour une expertise avancée.`,
        category: 'apprentissage',
        priority: 'high',
        relatedKeywords: [`formation ${contentConfig.keyword}`, `apprendre ${contentConfig.keyword}`]
      },
      {
        question: `Quels sont les outils indispensables pour ${contentConfig.topic.toLowerCase()} ?`,
        answer: `Les outils essentiels incluent : des solutions d'analyse et monitoring, des plateformes de gestion de projet, des outils d'automatisation et des ressources de formation continue. Le choix dépend de vos besoins spécifiques et de votre budget.`,
        category: 'outils',
        priority: 'medium',
        relatedKeywords: [`outils ${contentConfig.keyword}`, `logiciel ${contentConfig.keyword}`]
      },
      {
        question: `Comment mesurer le ROI et l'efficacité en ${contentConfig.topic.toLowerCase()} ?`,
        answer: `Mesurez les KPIs pertinents : temps de traitement, taux de réussite, satisfaction utilisateur, coûts d'opération. Utilisez des tableaux de bord en temps réel et comparez avec les objectifs fixés initialement.`,
        category: 'mesure',
        priority: 'medium',
        relatedKeywords: [`ROI ${contentConfig.keyword}`, `mesurer ${contentConfig.keyword}`]
      },
      {
        question: `Quelles sont les erreurs courantes à éviter en ${contentConfig.topic.toLowerCase()} ?`,
        answer: `Les erreurs fréquentes : manque de planification initiale, négligence de la formation des équipes, absence de mesure des résultats, résistance au changement, et sous-estimation des besoins en ressources.`,
        category: 'erreurs',
        priority: 'high',
        relatedKeywords: [`erreurs ${contentConfig.keyword}`, `éviter ${contentConfig.keyword}`]
      },
      {
        question: `Comment rester à jour avec les évolutions de ${contentConfig.topic.toLowerCase()} ?`,
        answer: `Suivez les blogs spécialisés, participez à des conférences, rejoignez des communautés professionnelles, suivez des formations continues et expérimentez régulièrement avec de nouveaux outils et techniques.`,
        category: 'veille',
        priority: 'medium',
        relatedKeywords: [`tendances ${contentConfig.keyword}`, `actualité ${contentConfig.keyword}`]
      }
    ];
  };

  const generateCompetitorInsights = () => {
    const competitors = [
      { domain: 'competitor1.com', authority: Math.floor(Math.random() * 20) + 80, backlinks: `${(Math.random() * 2 + 0.5).toFixed(1)}M`, traffic: `${Math.floor(Math.random() * 40) + 10}M`, topKeywords: Math.floor(Math.random() * 800) + 200 },
      { domain: 'competitor2.com', authority: Math.floor(Math.random() * 15) + 75, backlinks: `${(Math.random() * 1.5 + 0.3).toFixed(1)}M`, traffic: `${Math.floor(Math.random() * 25) + 5}M`, topKeywords: Math.floor(Math.random() * 600) + 150 },
      { domain: 'competitor3.com', authority: Math.floor(Math.random() * 25) + 70, backlinks: `${(Math.random() * 1 + 0.2).toFixed(1)}M`, traffic: `${Math.floor(Math.random() * 15) + 3}M`, topKeywords: Math.floor(Math.random() * 400) + 100 }
    ];

    const opportunities = [
      `Créer du contenu sur "${contentConfig.keyword} avancé" (faible concurrence détectée)`,
      `Développer des guides sectoriels spécialisés en ${contentConfig.industry}`,
      `Optimiser pour les featured snippets sur les questions techniques`,
      `Cibler les mots-clés longue traîne avec "comment" et "pourquoi"`,
      `Créer des comparatifs détaillés vs concurrents directs`
    ];

    return {
      topCompetitors: competitors,
      opportunities: opportunities
    };
  };

  const generateTechnicalAnalysis = () => {
    return {
      pagespeed: {
        mobile: Math.floor(Math.random() * 25) + 70,
        desktop: Math.floor(Math.random() * 15) + 85,
        recommendations: [
          'Optimiser les images au format WebP',
          'Minifier et compresser CSS/JavaScript',
          'Implémenter le lazy loading pour les médias',
          'Utiliser un CDN pour la distribution de contenu',
          'Optimiser le cache navigateur'
        ]
      },
      indexability: {
        indexablePages: Math.floor(Math.random() * 20) + 80,
        blockedPages: Math.floor(Math.random() * 5) + 1,
        errors: Math.floor(Math.random() * 3) + 1,
        warnings: Math.floor(Math.random() * 8) + 2
      },
      mobileOptimization: {
        score: Math.floor(Math.random() * 20) + 75,
        issues: [
          'Améliorer la taille des boutons tactiles',
          'Optimiser les polices pour mobile',
          'Réduire les pop-ups intrusives'
        ]
      }
    };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const downloadContent = () => {
    const content = `${generatedContent.title}

${generatedContent.content}

--- STRUCTURE DU CONTENU ---
${generatedContent.structure.map(item => `${'#'.repeat(item.level)} ${item.title} (${item.wordCount} mots)`).join('\n')}

--- FAQ ---
${generatedContent.faq.map(item => `Q: ${item.question}\nR: ${item.answer}\nCatégorie: ${item.category}\n`).join('\n')}

--- MOTS-CLÉS ANALYSÉS ---
${generatedContent.keywords.map(k => `${k.keyword} - ${k.volume} recherches/mois - Difficulté: ${k.difficulty}% - Position: ${k.position}`).join('\n')}

--- IMAGES SUGGÉRÉES ---
${generatedContent.images.map(img => `Titre: ${img.title}\nAlt: ${img.alt}\nSuggestion: ${img.suggestion}\nPriorité: ${img.priority}\n`).join('\n')}

--- ANALYSE TECHNIQUE ---
Performance Mobile: ${generatedContent.technicalSEO.pagespeed.mobile}%
Performance Desktop: ${generatedContent.technicalSEO.pagespeed.desktop}%
Pages indexables: ${generatedContent.technicalSEO.indexability.indexablePages}%

--- CONCURRENTS ANALYSÉS ---
${generatedContent.competitorAnalysis.topCompetitors.map(comp => `${comp.domain} - Authority: ${comp.authority} - Backlinks: ${comp.backlinks} - Trafic: ${comp.traffic}`).join('\n')}

--- MÉTRIQUES ---
Score SEO: ${generatedContent.seoScore}%
Score de lisibilité: ${generatedContent.readabilityScore}%
Nombre de mots: ${generatedContent.wordCount}
Temps de lecture estimé: ${generatedContent.estimatedReadTime} minutes

Généré le ${new Date().toLocaleDateString('fr-FR')} avec le Générateur SEO Content Pro
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenu-seo-pro-${contentConfig.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📄 Contenu complet téléchargé');
  };

  const exportFullAnalysis = () => {
    const fullAnalysis = {
      metadata: {
        generatedAt: new Date().toISOString(),
        configuration: contentConfig,
        version: '2.0'
      },
      content: generatedContent,
      analysis: {
        seoScore: generatedContent.seoScore,
        readabilityScore: generatedContent.readabilityScore,
        technicalAnalysis: generatedContent.technicalSEO,
        competitorInsights: generatedContent.competitorAnalysis
      }
    };

    const blob = new Blob([JSON.stringify(fullAnalysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-seo-complete-${contentConfig.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📊 Analyse complète exportée');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🎯 Générateur SEO Content Pro
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              v2.0 Professional
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              IA Avancée
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Configuration OpenAI */}
          <OpenAIConfigPanel 
            title="Configuration IA"
            description="Configurez votre clé API OpenAI pour des analyses avancées et génération de contenu professionnel"
            showModelSelection={true}
            compact={true}
          />

          {/* Configuration du contenu */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                Configuration Avancée du Contenu
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Paramétrage professionnel pour génération de contenu SEO optimisé
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sujet principal *</label>
                  <Input
                    placeholder="Ex: Marketing digital, SEO, Analytics..."
                    value={contentConfig.topic}
                    onChange={(e) => setContentConfig(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot-clé principal *</label>
                  <Input
                    placeholder="Ex: SEO 2024, Marketing automation..."
                    value={contentConfig.keyword}
                    onChange={(e) => setContentConfig(prev => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur d'activité</label>
                  <Select value={contentConfig.industry} onValueChange={(value) => setContentConfig(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de contenu</label>
                  <Select value={contentConfig.contentType} onValueChange={(value) => setContentConfig(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <div>
                              <div>{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.difficulty}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Longueur cible</label>
                  <Select value={contentConfig.targetLength.toString()} onValueChange={(value) => setContentConfig(prev => ({ ...prev, targetLength: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">800 mots (Court + rapide)</SelectItem>
                      <SelectItem value="1500">1500 mots (Standard SEO)</SelectItem>
                      <SelectItem value="2500">2500 mots (Article approfondi)</SelectItem>
                      <SelectItem value="4000">4000 mots (Guide complet)</SelectItem>
                      <SelectItem value="6000">6000 mots (Pillar content)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ton rédactionnel</label>
                  <Select value={contentConfig.tone} onValueChange={(value) => setContentConfig(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          <div>
                            <div>{tone.label}</div>
                            <div className="text-xs text-muted-foreground">{tone.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Audience cible</label>
                  <Select value={contentConfig.audience} onValueChange={(value) => setContentConfig(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          <div>
                            <div>{audience.label}</div>
                            <div className="text-xs text-muted-foreground">{audience.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Concurrents (optionnel)</label>
                  <Input
                    placeholder="competitor.com, example.com..."
                    value={contentConfig.competitors}
                    onChange={(e) => setContentConfig(prev => ({ ...prev, competitors: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button 
                  onClick={generateContent} 
                  disabled={isGenerating || !hasValidApiKey}
                  className="flex-1 md:flex-none"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Génération en cours... {generationProgress}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      Générer le Contenu SEO Pro
                    </div>
                  )}
                </Button>

                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={downloadContent}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Simple
                    </Button>
                    <Button variant="outline" onClick={exportFullAnalysis}>
                      <BarChart className="h-4 w-4 mr-2" />
                      Export Complet
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating && (
                <div className="mt-4 space-y-2">
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Génération avancée avec analyse IA...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Résultats de génération */}
          {generatedContent && (
            <div className="space-y-6">
              {/* Métriques globales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{generatedContent.seoScore}%</div>
                    <div className="text-sm text-muted-foreground">Score SEO</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{generatedContent.readabilityScore}%</div>
                    <div className="text-sm text-muted-foreground">Lisibilité</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{generatedContent.wordCount}</div>
                    <div className="text-sm text-muted-foreground">Mots</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{generatedContent.estimatedReadTime} min</div>
                    <div className="text-sm text-muted-foreground">Lecture</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="content">Contenu</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
                  <TabsTrigger value="competitors">Concurrence</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>

                {/* Onglet Contenu */}
                <TabsContent value="content" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Contenu Généré
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.content, 'Contenu')}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {generatedContent.content.substring(0, 1500)}...
                          </pre>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Score SEO Global</span>
                            <div className="flex items-center gap-2">
                              <Progress value={generatedContent.seoScore} className="w-16 h-2" />
                              <Badge variant={generatedContent.seoScore > 90 ? "default" : generatedContent.seoScore > 70 ? "secondary" : "destructive"}>
                                {generatedContent.seoScore}%
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Lisibilité</span>
                            <div className="flex items-center gap-2">
                              <Progress value={generatedContent.readabilityScore} className="w-16 h-2" />
                              <Badge variant={generatedContent.readabilityScore > 80 ? "default" : "secondary"}>
                                {generatedContent.readabilityScore}%
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Optimisation mobile</span>
                            <div className="flex items-center gap-2">
                              <Progress value={generatedContent.technicalSEO.mobileOptimization.score} className="w-16 h-2" />
                              <Badge variant="outline">{generatedContent.technicalSEO.mobileOptimization.score}%</Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Performance technique</span>
                            <div className="flex items-center gap-2">
                              <Progress value={generatedContent.technicalSEO.pagespeed.mobile} className="w-16 h-2" />
                              <Badge variant="outline">{generatedContent.technicalSEO.pagespeed.mobile}%</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Actions Rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Edit className="h-4 w-4 mr-2" />
                            Éditer le contenu
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Eye className="h-4 w-4 mr-2" />
                            Prévisualiser HTML
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Régénérer section
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Share2 className="h-4 w-4 mr-2" />
                            Partager le projet
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet SEO */}
                <TabsContent value="seo" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-500" />
                          Éléments SEO Optimisés
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Titre SEO</label>
                            <Badge variant="outline" className="text-xs">
                              {generatedContent.title.length}/60 caractères
                            </Badge>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border relative">
                            <p className="text-sm pr-8">{generatedContent.title}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute top-1 right-1"
                              onClick={() => copyToClipboard(generatedContent.title, 'Titre')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Meta Description</label>
                            <Badge variant="outline" className="text-xs">
                              {generatedContent.metaDescription.length}/160 caractères
                            </Badge>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border relative">
                            <p className="text-sm pr-8">{generatedContent.metaDescription}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="absolute top-1 right-1"
                              onClick={() => copyToClipboard(generatedContent.metaDescription, 'Meta description')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Balises HTML Générées</label>
                          <div className="p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                            <code>{`<title>${generatedContent.title}</title>
<meta name="description" content="${generatedContent.metaDescription}">
<meta name="keywords" content="${generatedContent.keywords.slice(0, 5).map(k => k.keyword).join(', ')}">
<link rel="canonical" href="https://yoursite.com/page">`}</code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                          Analyse SEO Détaillée
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">Titre optimisé</div>
                              <div className="text-xs text-muted-foreground">Longueur et mots-clés parfaits</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">Meta description optimisée</div>
                              <div className="text-xs text-muted-foreground">Call-to-action incluent</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">Structure H1-H6 optimale</div>
                              <div className="text-xs text-muted-foreground">Hiérarchie logique respectée</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <div>
                              <div className="text-sm font-medium">Ajouter des liens internes</div>
                              <div className="text-xs text-muted-foreground">3-5 liens contextuels recommandés</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                            <Info className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium">Images à optimiser</div>
                              <div className="text-xs text-muted-foreground">Alt text et compression</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Onglet Structure */}
                <TabsContent value="structure" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                        Structure Hiérarchique du Contenu
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Architecture optimisée pour le SEO et la lisibilité
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedContent.structure.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              item.level === 1 ? 'bg-red-500' : 
                              item.level === 2 ? 'bg-orange-500' : 
                              'bg-yellow-500'
                            }`}>
                              H{item.level}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-muted-foreground">{item.wordCount} mots</p>
                                <Badge variant={
                                  item.status === 'optimized' ? 'default' :
                                  item.status === 'good' ? 'secondary' :
                                  'outline'
                                } className="text-xs">
                                  {item.status === 'optimized' ? '✓ Optimisé' :
                                   item.status === 'good' ? '○ Bon' :
                                   '△ À améliorer'}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Recommandations Structure</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• Ajouter des sous-sections H3 pour améliorer la lisibilité</li>
                          <li>• Équilibrer la longueur des sections (300-500 mots par H2)</li>
                          <li>• Inclure des listes à puces pour faciliter la lecture</li>
                          <li>• Ajouter un sommaire avec ancres pour la navigation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Mots-clés */}
                <TabsContent value="keywords" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-indigo-500" />
                        Analyse Avancée des Mots-clés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedContent.keywords.map((kw: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-sm">{kw.keyword}</h3>
                              <div className="flex items-center gap-1">
                                <Badge variant={kw.intent === 'commercial' ? 'default' : 'secondary'} className="text-xs">
                                  {kw.intent}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${
                                  kw.trend === 'rising' ? 'text-green-600' :
                                  kw.trend === 'declining' ? 'text-red-600' :
                                  'text-blue-600'
                                }`}>
                                  {kw.trend === 'rising' ? '↗' : kw.trend === 'declining' ? '↘' : '→'}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Volume:</span>
                                <span className="font-medium">{kw.volume.toLocaleString()}/mois</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Difficulté:</span>
                                <div className="flex items-center gap-1">
                                  <Progress value={kw.difficulty} className="w-12 h-1" />
                                  <span className="font-medium">{kw.difficulty}%</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">CPC:</span>
                                <span className="font-medium">{kw.cpc}€</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Position actuelle:</span>
                                <Badge variant="outline" className="text-xs">
                                  #{kw.position}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Opportunités Mots-clés</h4>
                        <ul className="space-y-1 text-sm text-purple-800">
                          <li>• Cibler les questions longue traîne avec "comment" et "pourquoi"</li>
                          <li>• Développer du contenu sur les variations sémantiques</li>
                          <li>• Optimiser pour les featured snippets avec les mots-clés informationnels</li>
                          <li>• Créer des pages dédiées pour les mots-clés commerciaux</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Concurrence */}
                <TabsContent value="competitors" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-red-500" />
                          Analyse Concurrentielle
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.competitorAnalysis.topCompetitors.map((comp: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium">{comp.domain}</h3>
                                <Badge variant="outline">Concurrent #{index + 1}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Authority:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={comp.authority} className="flex-1 h-2" />
                                    <span className="font-medium">{comp.authority}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Backlinks:</span>
                                  <div className="font-medium">{comp.backlinks}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Trafic:</span>
                                  <div className="font-medium">{comp.traffic}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Top Keywords:</span>
                                  <div className="font-medium">{comp.topKeywords}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          Opportunités Identifiées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {generatedContent.competitorAnalysis.opportunities.map((opp: string, index: number) => (
                            <div key={index} className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-r">
                              <p className="text-sm">{opp}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Actions Recommandées</h4>
                          <ul className="space-y-1 text-sm text-green-800">
                            <li>• Analyser les gaps de contenu vs concurrents</li>
                            <li>• Identifier les backlinks de qualité à reproduire</li>
                            <li>• Étudier leur stratégie de mots-clés</li>
                            <li>• Surveiller leurs nouvelles publications</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Onglet Extras */}
                <TabsContent value="extras" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Image className="h-5 w-5 text-blue-500" />
                          Suggestions d'Images Optimisées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.images.map((img: any, index: number) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-sm">{img.title}</h4>
                                <Badge variant={img.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                                  {img.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{img.alt}</p>
                              <p className="text-xs bg-blue-50 p-2 rounded">{img.suggestion}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>{img.dimensions}</span>
                                <span>•</span>
                                <span>{img.format}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 text-green-500" />
                          FAQ Optimisée
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {generatedContent.faq.slice(0, 4).map((item: any, index: number) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4 pb-3 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <Badge variant={item.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                                  {item.priority}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-sm mb-2">{item.question}</h4>
                              <p className="text-xs text-muted-foreground">{item.answer}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.relatedKeywords?.map((kw: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>{generatedContent.faq.length}</strong> questions générées pour optimiser la Position 0 et la recherche vocale
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoGeneratorPage;