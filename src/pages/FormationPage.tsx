import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, Download, BookOpen, ChevronRight, Eye, ChevronLeft, ArrowLeft,
  Search, Star, StarOff, CheckCircle2, Circle, Play, Clock, Filter,
  Sparkles, GraduationCap, Trophy, Target, Zap, Layers, Settings,
  Image, TrendingUp, Megaphone, DollarSign, FileOutput, Rocket, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import FormationQuiz from '@/components/formation/FormationQuiz';
import FormationBadges from '@/components/formation/FormationBadges';

interface Module {
  id: number;
  title: string;
  description: string;
  content: string;
  category: 'basics' | 'creation' | 'advanced' | 'marketing';
  icon: React.ElementType;
  duration: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
}

const FormationPage = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quizModule, setQuizModule] = useState<number | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('formation-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    const saved = localStorage.getItem('formation-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [quizScores, setQuizScores] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('formation-quiz-scores');
    return saved ? JSON.parse(saved) : {};
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const modules: Module[] = [
    {
      id: 1,
      title: "Configuration et Démarrage",
      description: "Installation, configuration API OpenAI, générateur d'idées",
      category: 'basics',
      icon: Settings,
      duration: '15 min',
      difficulty: 'débutant',
      content: `# Module 1 : Configuration et Démarrage

## 1.1 Installation et Configuration Initiale

**Fonctionnalités principales :**
- Configuration de l'API OpenAI
- Paramétrage des préférences utilisateur
- Interface de navigation intuitive

**Actions à effectuer :**
1. Saisir votre clé API OpenAI
2. Configurer le nombre de chapitres par défaut
3. Paramétrer vos préférences de génération

### Captures d'écran à inclure :
- Écran de configuration API
- Panneau de paramètres utilisateur
- Interface de navigation principale

## 1.2 Générateur d'Idées d'Ebooks

**Fonctionnalités principales :**
- 50+ idées d'ebooks pré-générées
- Catégories diversifiées : Business, Santé, Technologie, Finance
- Système de génération automatique de nouveaux concepts

**Actions à effectuer :**
1. Explorer les catégories d'idées
2. Sélectionner une idée qui vous inspire
3. Transférer automatiquement vers le planificateur`
    },
    {
      id: 2,
      title: "Planificateur d'Ebook",
      description: "Création du plan, gestion des chapitres, structure",
      category: 'creation',
      icon: Layers,
      duration: '25 min',
      difficulty: 'débutant',
      content: `# Module 2 : Planificateur d'Ebook

## 2.1 Création du Plan Initial

**Fonctionnalités principales :**
- Génération automatique de structure
- Personnalisation du titre et de l'auteur
- Création de préface et conclusion
- Système de chapitres et sous-chapitres

**Actions à effectuer :**
1. Saisir le titre de l'ebook
2. Renseigner le nom de l'auteur
3. Générer la structure automatiquement
4. Personnaliser la préface et la conclusion

## 2.2 Gestion Avancée des Chapitres

**Fonctionnalités principales :**
- Drag & Drop pour réorganiser
- Fusion et division de chapitres
- Duplication de chapitres
- Ajout de sous-chapitres

**Actions à effectuer :**
1. Réorganiser les chapitres par glisser-déposer
2. Diviser un chapitre en plusieurs parties
3. Fusionner des chapitres similaires
4. Ajouter des sous-chapitres détaillés`
    },
    {
      id: 3,
      title: "Templates Professionnels",
      description: "Galerie de templates, personnalisation",
      category: 'creation',
      icon: BookOpen,
      duration: '20 min',
      difficulty: 'débutant',
      content: `# Module 3 : Templates Professionnels

## 3.1 Galerie de Templates

**Templates disponibles :**
- **Business** : Guides entrepreneuriaux, stratégies
- **Fiction** : Romans, nouvelles, récits
- **Mémoires** : Autobiographies, témoignages
- **Guides** : Tutoriels, formations

**Actions à effectuer :**
1. Parcourir la galerie de templates
2. Prévisualiser les structures
3. Appliquer un template à votre ebook
4. Personnaliser selon vos besoins

## 3.2 Personnalisation des Templates

**Fonctionnalités principales :**
- Modification de la structure
- Adaptation du contenu
- Personnalisation des styles
- Sauvegarde de templates personnalisés`
    },
    {
      id: 4,
      title: "Génération de Contenu IA",
      description: "Rédaction automatique, outils d'écriture avancés",
      category: 'creation',
      icon: Sparkles,
      duration: '30 min',
      difficulty: 'intermédiaire',
      content: `# Module 4 : Génération de Contenu IA

## 4.1 Rédaction Automatique

**Fonctionnalités principales :**
- Génération de contenu par chapitre
- Génération de sous-chapitres détaillés
- Amélioration du style d'écriture
- Optimisation SEO automatique

**Actions à effectuer :**
1. Générer le contenu d'un chapitre
2. Améliorer le style d'écriture
3. Optimiser pour le SEO
4. Réviser et affiner le contenu

## 4.2 Outils d'Écriture Avancés

**Fonctionnalités principales :**
- Analyse de texte existant
- Génération de table des matières
- Compteur de mots automatique
- Sauvegarde automatique
- Dictaphone IA avec transcription`
    },
    {
      id: 5,
      title: "Outils Avancés",
      description: "Générateur de couverture IA, outils de productivité",
      category: 'advanced',
      icon: Zap,
      duration: '25 min',
      difficulty: 'intermédiaire',
      content: `# Module 5 : Outils Avancés

## 5.1 Générateur de Couverture IA

**Fonctionnalités principales :**
- Création automatique de couvertures
- Styles variés et professionnels
- Personnalisation des couleurs
- Export haute résolution

**Actions à effectuer :**
1. Générer une couverture automatiquement
2. Choisir parmi plusieurs styles
3. Personnaliser les couleurs
4. Télécharger en haute résolution

## 5.2 Outils de Productivité

**Fonctionnalités principales :**
- Sauvegarde automatique
- Statistiques détaillées
- Historique des modifications
- Export de brouillons`
    },
    {
      id: 6,
      title: "Banque d'Images IA",
      description: "Génération d'illustrations, optimisation visuelle",
      category: 'advanced',
      icon: Image,
      duration: '20 min',
      difficulty: 'intermédiaire',
      content: `# Module 6 : Banque d'Images IA

## 6.1 Génération d'Illustrations

**Fonctionnalités principales :**
- Génération d'images personnalisées
- Styles variés (réaliste, artistique, cartoon)
- Optimisation automatique des formats
- Intégration directe dans l'ebook

**Actions à effectuer :**
1. Créer des illustrations pour chaque chapitre
2. Générer des images de couverture
3. Optimiser les images pour différents formats
4. Intégrer automatiquement dans l'ebook

## 6.2 Optimisation Visuelle

**Fonctionnalités principales :**
- Redimensionnement automatique
- Compression intelligente
- Formats multiples (JPEG, PNG, WebP)
- Métadonnées SEO`
    },
    {
      id: 7,
      title: "Optimisation KDP",
      description: "Préparation Amazon KDP, analyse concurrentielle",
      category: 'marketing',
      icon: Target,
      duration: '35 min',
      difficulty: 'avancé',
      content: `# Module 7 : Optimisation KDP

## 7.1 Préparation pour Amazon KDP

**Fonctionnalités principales :**
- Génération de description KDP
- Recherche de mots-clés optimisés
- Sélection de catégories appropriées
- Conseils de prix dynamiques

**Actions à effectuer :**
1. Générer une description accrocheuse
2. Rechercher les meilleurs mots-clés
3. Sélectionner les catégories optimales
4. Définir le prix de vente

## 7.2 Analyse Concurrentielle

**Fonctionnalités principales :**
- Analyse des concurrents directs
- Étude des prix du marché
- Identification des niches rentables
- Recommandations stratégiques`
    },
    {
      id: 8,
      title: "Marketing et Promotion",
      description: "Réseaux sociaux, email marketing, landing pages",
      category: 'marketing',
      icon: Megaphone,
      duration: '40 min',
      difficulty: 'avancé',
      content: `# Module 8 : Marketing et Promotion

## 8.1 Contenu pour Réseaux Sociaux

**Fonctionnalités principales :**
- Posts Facebook automatiques
- Tweets promotionnels
- Stories Instagram
- Publications LinkedIn

**Actions à effectuer :**
1. Générer du contenu pour chaque réseau
2. Planifier les publications
3. Créer des visuels attractifs
4. Suivre les performances

## 8.2 Email Marketing

**Fonctionnalités principales :**
- Campagnes email automatisées
- Templates d'emails professionnels
- Séquences de lancement
- Emails de suivi

## 8.3 Landing Pages

**Fonctionnalités principales :**
- Création de pages de vente
- Optimisation des conversions
- A/B testing intégré
- Analytics détaillés`
    },
    {
      id: 9,
      title: "Monétisation",
      description: "Stratégies de prix, diversification des revenus",
      category: 'marketing',
      icon: DollarSign,
      duration: '30 min',
      difficulty: 'avancé',
      content: `# Module 9 : Monétisation

## 9.1 Stratégies de Prix

**Fonctionnalités principales :**
- Calculateur de ROI
- Prix dynamiques
- Stratégies de bundle
- Programmes d'affiliation

**Actions à effectuer :**
1. Calculer le ROI optimal
2. Définir une stratégie de prix
3. Créer des bundles attractifs
4. Mettre en place l'affiliation

## 9.2 Diversification des Revenus

**Fonctionnalités principales :**
- Vente multi-plateformes
- Licences et droits d'auteur
- Formations complémentaires
- Services de consulting`
    },
    {
      id: 10,
      title: "Export Multi-Format",
      description: "Formats disponibles, optimisation par format",
      category: 'advanced',
      icon: FileOutput,
      duration: '25 min',
      difficulty: 'intermédiaire',
      content: `# Module 10 : Export Multi-Format

## 10.1 Formats Disponibles

**Formats supportés :**
- **PDF** : Version imprimable haute qualité
- **EPUB** : Compatible liseuses électroniques
- **MOBI** : Format Kindle
- **DOCX** : Édition Microsoft Word
- **HTML** : Version web interactive
- **InDesign (IDML)** : Format professionnel

**Actions à effectuer :**
1. Choisir le format d'export
2. Configurer les options avancées
3. Générer l'ebook final
4. Télécharger et vérifier

## 10.2 Optimisation par Format

**Fonctionnalités principales :**
- Mise en page automatique
- Métadonnées optimisées
- Table des matières interactive
- Index automatique`
    },
    {
      id: 11,
      title: "Stratégies Avancées",
      description: "Automatisation, scaling et growth hacking",
      category: 'advanced',
      icon: Rocket,
      duration: '45 min',
      difficulty: 'avancé',
      content: `# Module 11 : Stratégies Avancées

## 11.1 Automatisation Complète

**Fonctionnalités principales :**
- Workflows automatisés
- Génération en masse
- Planification de contenu
- Monitoring des performances

## 11.2 Scaling et Growth Hacking

**Stratégies couvertes :**
- Multiplication des niches
- Partenariats stratégiques
- Optimisation continue
- Expansion internationale

## 11.3 Livre Audio

**Fonctionnalités principales :**
- Conversion texte vers audio avec ElevenLabs
- Voix naturelles et expressives
- Export MP3 haute qualité
- Chapitrage automatique`
    }
  ];

  const categories = [
    { id: 'all', label: 'Tous', icon: Layers, count: modules.length },
    { id: 'basics', label: 'Bases', icon: GraduationCap, count: modules.filter(m => m.category === 'basics').length },
    { id: 'creation', label: 'Création', icon: Sparkles, count: modules.filter(m => m.category === 'creation').length },
    { id: 'advanced', label: 'Avancé', icon: Zap, count: modules.filter(m => m.category === 'advanced').length },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp, count: modules.filter(m => m.category === 'marketing').length },
  ];

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(module.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const progressPercentage = (completedModules.length / modules.length) * 100;

  const toggleFavorite = (moduleId: number) => {
    const newFavorites = favorites.includes(moduleId)
      ? favorites.filter(id => id !== moduleId)
      : [...favorites, moduleId];
    setFavorites(newFavorites);
    localStorage.setItem('formation-favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(moduleId) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const toggleCompleted = (moduleId: number) => {
    const newCompleted = completedModules.includes(moduleId)
      ? completedModules.filter(id => id !== moduleId)
      : [...completedModules, moduleId];
    setCompletedModules(newCompleted);
    localStorage.setItem('formation-completed', JSON.stringify(newCompleted));
    
    if (!completedModules.includes(moduleId)) {
      toast.success('Module terminé !', {
        description: `Progression : ${Math.round(((newCompleted.length) / modules.length) * 100)}%`
      });
    }
  };

  const handleQuizComplete = (moduleId: number, score: number) => {
    const newScores = { ...quizScores, [moduleId]: score };
    setQuizScores(newScores);
    localStorage.setItem('formation-quiz-scores', JSON.stringify(newScores));
    
    if (score >= 70 && !completedModules.includes(moduleId)) {
      toggleCompleted(moduleId);
    }
    
    if (score === 100) {
      toast.success('Score parfait !', {
        description: 'Vous avez débloqué le badge Perfectionniste !'
      });
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Contenu copié dans le presse-papiers !');
  };

  const copyAllModules = () => {
    const fullContent = `# Formation Complète : Générateur d'Ebook IA 📚

## Table des Matières

${modules.map((module, index) => `${index + 1}. ${module.title}`).join('\n')}

---

${modules.map((module, index) => `## Module ${index + 1} : ${module.title}

${module.content}

---`).join('\n\n')}`;

    copyToClipboard(fullContent);
  };

  const exportFormationPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isTitle: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      for (const line of lines) {
        if (yPos > 275) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += fontSize * 0.45;
      }
      yPos += isTitle ? 6 : 3;
    };

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Formation Complete', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text("Generateur d'Ebook IA", pageWidth / 2, 75, { align: 'center' });
    
    pdf.addPage();
    yPos = 20;
    addText('TABLE DES MATIERES', 16, true, true);
    yPos += 5;
    
    modules.forEach((module, index) => {
      addText(`Module ${index + 1}: ${module.title}`, 11);
      yPos += 2;
    });

    modules.forEach((module, index) => {
      pdf.addPage();
      yPos = 20;
      
      addText(`MODULE ${index + 1}`, 14, true, true);
      addText(module.title.toUpperCase(), 16, true, true);
      yPos += 5;
      
      const lines = module.content.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('# ')) {
          addText(line.replace('# ', ''), 14, true, true);
        } else if (line.startsWith('## ')) {
          yPos += 3;
          addText(line.replace('## ', ''), 12, true, true);
        } else if (line.startsWith('### ')) {
          yPos += 2;
          addText(line.replace('### ', ''), 11, true);
        } else if (line.startsWith('**') && line.endsWith('**')) {
          addText(line.replace(/\*\*/g, ''), 10, true);
        } else if (line.startsWith('- ')) {
          addText('• ' + line.replace('- ', ''), 10);
        } else if (line.match(/^\d+\./)) {
          addText(line, 10);
        } else if (line.trim()) {
          addText(line.replace(/\*\*/g, ''), 10);
        }
      }
    });

    pdf.save('Formation_Complete_Generateur_Ebook.pdf');
    toast.success('Formation exportée en PDF !');
    setShowPreview(false);
  };

  const previewPages = [
    {
      title: "Page de Couverture",
      content: (
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 h-full flex flex-col items-center justify-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Formation Complète</h2>
          <h3 className="text-xl text-primary mb-2">Générateur d'Ebook IA</h3>
          <p className="text-muted-foreground text-sm">Guide complet de toutes les fonctionnalités</p>
        </div>
      )
    },
    {
      title: "Table des Matières",
      content: (
        <div className="p-6 h-full overflow-auto">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">TABLE DES MATIÈRES</h3>
          <ul className="space-y-2 text-sm">
            {modules.map((module, index) => (
              <li key={module.id} className="flex gap-2">
                <span className="font-semibold text-primary">Module {index + 1}:</span>
                <span>{module.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    ...modules.map((module, index) => ({
      title: `Module ${index + 1}: ${module.title}`,
      content: (
        <div className="p-6 h-full overflow-auto">
          <Badge variant="secondary" className="mb-2">Module {index + 1}</Badge>
          <h3 className="text-lg font-bold mb-2">{module.title.toUpperCase()}</h3>
          <p className="text-xs text-muted-foreground mb-4">{module.description}</p>
          <div className="text-xs space-y-1 overflow-hidden">
            {module.content.split('\n').slice(0, 15).map((line, i) => (
              <p key={i} className={`${line.startsWith('#') ? 'font-bold' : ''} ${line.startsWith('-') ? 'pl-2' : ''}`}>
                {line.replace(/[#*]/g, '').trim() || '\u00A0'}
              </p>
            ))}
            <p className="text-muted-foreground italic">...</p>
          </div>
        </div>
      )
    }))
  ];

  const totalPages = previewPages.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'intermédiaire': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'avancé': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header avec progression */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/ebook-planner')} 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-muted-foreground">{completedModules.length}/{modules.length} modules</span>
              </div>
              <div className="w-32 hidden md:block">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Button 
                onClick={() => setShowBadges(!showBadges)} 
                size="sm" 
                variant={showBadges ? "default" : "outline"}
                className="gap-2"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Trophées</span>
              </Button>
              <Button onClick={copyAllModules} size="sm" variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copier tout</span>
              </Button>
              <Button 
                onClick={() => { setPreviewPage(0); setShowPreview(true); }} 
                size="sm" 
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-4">
            <GraduationCap className="h-4 w-4" />
            Formation Complète
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Maîtrisez le Générateur d'Ebook IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {modules.length} modules • {modules.reduce((acc, m) => acc + parseInt(m.duration), 0)} minutes de contenu
          </p>
          
          {/* Statistiques de progression */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{completedModules.length}</div>
              <div className="text-sm text-muted-foreground">Terminés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favoris</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Progression</div>
            </div>
          </div>
        </motion.div>

        {/* Section Badges */}
        <AnimatePresence>
          {showBadges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <FormationBadges 
                completedModules={completedModules}
                quizScores={quizScores}
                favorites={favorites}
                totalModules={modules.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un module..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Favoris ({favorites.length})
            </Button>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {cat.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Grille des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {filteredModules.map((module, index) => {
              const Icon = module.icon;
              const isCompleted = completedModules.includes(module.id);
              const isFavorite = favorites.includes(module.id);
              
              return (
                <motion.div
                  key={module.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-2 ${
                    isCompleted ? 'border-green-500/50 bg-green-500/5' : 'hover:border-primary/50'
                  }`}>
                    {/* Badge de complétion */}
                    {isCompleted && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Terminé
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(module.id)}
                          >
                            {isFavorite ? (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleCompleted(module.id)}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Module {module.id}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                        {quizScores[module.id] !== undefined && (
                          <span className={`flex items-center gap-1 ${quizScores[module.id] >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                            <HelpCircle className="h-3 w-3" />
                            Quiz: {quizScores[module.id]}%
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                        >
                          <Play className="h-3 w-3" />
                          {selectedModule === module.id ? 'Fermer' : 'Voir'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 gap-1"
                          onClick={() => setQuizModule(module.id)}
                        >
                          <HelpCircle className="h-3 w-3" />
                          Quiz
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="gap-1 px-2"
                          onClick={() => {
                            setPreviewPage(modules.findIndex(m => m.id === module.id) + 2);
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun module trouvé</p>
          </div>
        )}

        {/* Module sélectionné */}
        <AnimatePresence>
          {selectedModule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="mb-8 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const mod = modules.find(m => m.id === selectedModule);
                        const Icon = mod?.icon || BookOpen;
                        return <Icon className="h-6 w-6 text-primary" />;
                      })()}
                      <CardTitle className="text-2xl">
                        Module {selectedModule} : {modules.find(m => m.id === selectedModule)?.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyToClipboard(modules.find(m => m.id === selectedModule)?.content || '')}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copier
                      </Button>
                      <Button 
                        onClick={() => toggleCompleted(selectedModule)}
                        size="sm"
                        variant={completedModules.includes(selectedModule) ? "default" : "outline"}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {completedModules.includes(selectedModule) ? 'Terminé' : 'Marquer terminé'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {modules.find(m => m.id === selectedModule)?.content || ''}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checklist améliorée */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <CardTitle>Checklist de Lancement d'Ebook</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Pré-production
                  </h4>
                  <ul className="space-y-2 text-sm pl-4">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Idée validée et recherche effectuée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Structure détaillée créée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Template sélectionné et personnalisé
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Production
                  </h4>
                  <ul className="space-y-2 text-sm pl-4">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Contenu généré et optimisé
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Couverture créée et finalisée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Images intégrées et optimisées
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Relecture et corrections effectuées
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Optimisation KDP
                  </h4>
                  <ul className="space-y-2 text-sm pl-4">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Description accrocheuse rédigée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Mots-clés recherchés et sélectionnés
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Catégories optimales choisies
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Prix compétitif défini
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Marketing
                  </h4>
                  <ul className="space-y-2 text-sm pl-4">
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Contenu social media préparé
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Campagne email configurée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Landing page créée
                    </li>
                    <li className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      Stratégie de lancement planifiée
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de prévisualisation PDF */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Prévisualisation du PDF - {previewPages[previewPage]?.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Page {previewPage + 1} / {totalPages}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="border rounded-lg bg-white text-foreground min-h-[400px] shadow-inner">
            {previewPages[previewPage]?.content}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                disabled={previewPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewPage(Math.min(totalPages - 1, previewPage + 1))}
                disabled={previewPage === totalPages - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 overflow-x-auto max-w-xs">
              {previewPages.slice(0, 6).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreviewPage(idx)}
                  className={`w-8 h-10 rounded border text-xs flex items-center justify-center transition-all ${
                    previewPage === idx 
                      ? 'border-primary bg-primary/10 text-primary font-bold' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              {previewPages.length > 6 && (
                <span className="text-xs text-muted-foreground self-center">+{previewPages.length - 6}</span>
              )}
            </div>

            <Button onClick={exportFormationPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Quiz */}
      <Dialog open={quizModule !== null} onOpenChange={(open) => !open && setQuizModule(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {quizModule !== null && (
            <FormationQuiz
              moduleId={quizModule}
              moduleTitle={modules.find(m => m.id === quizModule)?.title || ''}
              onComplete={handleQuizComplete}
              onClose={() => setQuizModule(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormationPage;
