import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, role } = useAuth();
  const isSubscriber = isAuthenticated && (role === 'pro' || role === 'admin');
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
      title: "Étape 1 : Choisir",
      description: "Définissez votre sujet, votre lecteur et votre objectif",
      category: 'basics',
      icon: Target,
      duration: '5 min',
      difficulty: 'débutant',
      content: `# Étape 1 : Choisir votre projet

## Vous ne rédigez aucune ligne.
**Vous guidez l'intention, l'éditeur numérique fait le reste.**

---

## Ce que vous faites :

### 1. Choisissez votre sujet
- Quel thème voulez-vous aborder ?
- Quelle expertise souhaitez-vous partager ?
- Quelle histoire voulez-vous raconter ?

### 2. Définissez votre lecteur idéal
- À qui s'adresse votre livre ?
- Quels sont ses besoins, ses frustrations ?
- Que cherche-t-il à apprendre ou ressentir ?

### 3. Fixez votre objectif
- Informer, inspirer, divertir, transformer ?
- Quel résultat attendez-vous pour votre lecteur ?

---

## Ce que vous obtenez :

✅ Une direction claire pour votre projet  
✅ Un angle éditorial défini  
✅ Les bases pour que l'éditeur numérique travaille pour vous`
    },
    {
      id: 2,
      title: "Étape 2 : Générer",
      description: "Le système structure et rédige automatiquement",
      category: 'creation',
      icon: Sparkles,
      duration: '3 min',
      difficulty: 'débutant',
      content: `# Étape 2 : Générer votre livre

## Vous ne rédigez aucune ligne.
**Vous guidez l'intention, l'éditeur numérique fait le reste.**

---

## Ce que vous faites :

### 1. Validez le titre et la description
- Vérifiez que le titre correspond à votre vision
- Ajustez la description si nécessaire

### 2. Lancez la génération
- Cliquez sur "Générer le plan"
- Cliquez sur "Rédiger le contenu"
- Attendez quelques instants

### 3. Laissez le système travailler
- Structure automatique en chapitres cohérents
- Rédaction fluide et naturelle
- Ton adapté à votre lecteur cible

---

## Ce que vous obtenez :

✅ Un plan structuré de votre livre  
✅ Des chapitres rédigés avec votre voix  
✅ Une cohérence narrative de bout en bout  
✅ Un contenu prêt à être validé`
    },
    {
      id: 3,
      title: "Étape 3 : Valider",
      description: "Lisez le verdict éditorial et finalisez",
      category: 'advanced',
      icon: CheckCircle2,
      duration: '5 min',
      difficulty: 'débutant',
      content: `# Étape 3 : Valider et publier

## Vous ne rédigez aucune ligne.
**Vous guidez l'intention, l'éditeur numérique fait le reste.**

---

## Ce que vous faites :

### 1. Consultez le verdict éditorial
- Un diagnostic complet de votre livre
- Points forts identifiés
- Recommandations finales

### 2. Relisez votre contenu
- Parcourez les chapitres générés
- Vérifiez que tout correspond à votre intention
- Demandez des ajustements si besoin

### 3. Exportez votre livre
- Choisissez le format (PDF, EPUB, MOBI...)
- Téléchargez votre fichier final
- Publiez sur la plateforme de votre choix

---

## Ce que vous obtenez :

✅ Un livre complet et cohérent  
✅ Un verdict de qualité professionnelle  
✅ Votre ebook prêt à publier  
✅ Votre voix, pas celle d'un robot`
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les étapes', icon: Layers, count: modules.length },
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
        {/* Logo EbookiaPro.V2 Premium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 rounded-full scale-150" />
            
            {/* Logo container */}
            <motion.div
              className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Premium badge */}
              <motion.div
                className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                V2.0
              </motion.div>
              
              {/* Main logo text */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
                <div className="text-left">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                      EbookStudio
                    </span>
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      {' '}Pro
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm font-medium tracking-widest">
                    MOTEUR IA ÉDITORIAL
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400/50" />
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-orange-400/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm mb-4">
            <GraduationCap className="h-4 w-4" />
            Formation Complète
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Créez votre livre en 3 étapes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Vous guidez l'intention, l'éditeur numérique fait le reste.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-xl mx-auto">
            <p className="text-lg font-medium text-primary">
              ✨ Vous ne rédigez aucune ligne.
            </p>
            <p className="text-muted-foreground mt-1">
              Choisissez • Générez • Validez
            </p>
          </div>

          {/* Animation Onboarding 3 étapes */}
          <div className="mt-10 mb-8">
            <div className="relative max-w-4xl mx-auto">
              {/* Ligne de connexion animée */}
              <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Étape 1 - Choisir */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group"
                >
                  <div className="relative">
                    <motion.div 
                      className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 border-2 border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/10"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Target className="h-14 w-14 text-blue-500" />
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      1
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Choisir</h3>
                    <p className="text-sm text-muted-foreground">Votre sujet, lecteur et objectif</p>
                    <motion.div 
                      className="mt-3 flex flex-wrap justify-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {['Sujet', 'Lecteur', 'Objectif'].map((tag, i) => (
                        <motion.span 
                          key={tag}
                          className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + i * 0.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Étape 2 - Générer */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="group"
                >
                  <div className="relative">
                    <motion.div 
                      className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/30 border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10"
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-14 w-14 text-primary" />
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring" }}
                    >
                      2
                    </motion.div>
                    {/* Particules animées */}
                    <motion.div 
                      className="absolute top-4 right-4"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/60" />
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-6 left-4"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h3 className="text-xl font-bold text-primary mb-2">Générer</h3>
                    <p className="text-sm text-muted-foreground">Structure et rédaction automatiques</p>
                    <motion.div 
                      className="mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <motion.div 
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        animate={{ boxShadow: ["0 0 0 0 rgba(var(--primary), 0.2)", "0 0 0 8px rgba(var(--primary), 0)", "0 0 0 0 rgba(var(--primary), 0)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-3 w-3" />
                        Automatique
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Étape 3 - Valider */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="group"
                >
                  <div className="relative">
                    <motion.div 
                      className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/30 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/10"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <CheckCircle2 className="h-14 w-14 text-green-500" />
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-sm shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.6, type: "spring" }}
                    >
                      3
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Valider</h3>
                    <p className="text-sm text-muted-foreground">Verdict éditorial et export</p>
                    <motion.div 
                      className="mt-3 flex flex-wrap justify-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      {['PDF', 'EPUB', 'KDP'].map((format, i) => (
                        <motion.span 
                          key={format}
                          className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.7 + i * 0.1 }}
                        >
                          {format}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bouton Commencer maintenant */}
            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate(isSubscriber ? '/ebook-planner' : '/offres', { state: { fromFormation: true } })}
                  className="gap-3 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <Rocket className="h-5 w-5" />
                  {isSubscriber ? 'Accéder au générateur' : 'Essayer le générateur'}
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <p className="mt-3 text-sm text-muted-foreground">
                {isSubscriber ? 'Accédez à votre espace de création' : 'Découvrez nos offres pour débloquer toutes les fonctionnalités'}
              </p>
            </motion.div>
          </div>
          
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

        {/* Section EbookiaPro.V2 - Les 14 points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
                <Sparkles className="h-4 w-4" />
                Moteur IA Éditorial
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Ce que vous découvrirez dans EbookStudio Pro V2
              </CardTitle>
              <p className="text-muted-foreground mt-2 text-lg">
                14 outils IA professionnels pour créer des ebooks de qualité éditoriale
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { num: 'P1', title: 'Directeur Éditorial', desc: 'Analyse stratégique de votre projet', icon: Target, color: 'from-blue-500 to-blue-600' },
                  { num: 'P2', title: 'Analyse de Marché', desc: 'Positionnement et niche idéale', icon: TrendingUp, color: 'from-green-500 to-green-600' },
                  { num: 'P3', title: 'Architecte de Contenu', desc: 'Structure optimale de votre livre', icon: Layers, color: 'from-purple-500 to-purple-600' },
                  { num: 'P4', title: 'Rédaction Experte', desc: 'Écriture professionnelle IA', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
                  { num: 'P5', title: 'Réécriture Naturelle', desc: 'Humanisation du texte', icon: Sparkles, color: 'from-pink-500 to-pink-600' },
                  { num: 'P6', title: 'Qualité Éditoriale', desc: 'Vérification orthographe & style', icon: CheckCircle2, color: 'from-teal-500 to-teal-600' },
                  { num: 'P7', title: 'Packaging Éditorial', desc: 'Couverture, titre, 4ème de couverture', icon: Image, color: 'from-orange-500 to-orange-600' },
                  { num: 'P8', title: 'Diagnostic Final', desc: 'Analyse complète avant publication', icon: Target, color: 'from-red-500 to-red-600' },
                  { num: 'P9', title: 'Mémoire Éditoriale', desc: 'Conservation de votre voix unique', icon: BookOpen, color: 'from-cyan-500 to-cyan-600' },
                  { num: 'P10', title: 'Cohérence Globale', desc: 'Vérification narrative inter-chapitres', icon: Layers, color: 'from-amber-500 to-amber-600' },
                  { num: 'P11', title: 'Auto-Critique IA', desc: 'Détection des faiblesses', icon: HelpCircle, color: 'from-rose-500 to-rose-600' },
                  { num: 'P12', title: 'Boucle Itérative', desc: 'Amélioration continue automatique', icon: Zap, color: 'from-violet-500 to-violet-600' },
                  { num: 'P13', title: 'Signature de Style', desc: 'Votre empreinte unique', icon: Sparkles, color: 'from-emerald-500 to-emerald-600' },
                  { num: 'P14', title: 'Verdict Ultime', desc: 'Validation finale professionnelle', icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.num}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                        {item.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => navigate('/ebook-planner')}
                  className="gap-3 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/25"
                >
                  <Rocket className="h-5 w-5" />
                  Accéder à EbookStudio Pro V2
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
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

        {/* Résumé des 3 étapes */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-primary" />
              <CardTitle>En résumé : votre parcours</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-muted/50 border">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">1. Choisir</h4>
                <p className="text-sm text-muted-foreground">
                  Votre sujet, votre lecteur, votre objectif
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-muted/50 border">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">2. Générer</h4>
                <p className="text-sm text-muted-foreground">
                  Le système structure et rédige pour vous
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-muted/50 border">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">3. Valider</h4>
                <p className="text-sm text-muted-foreground">
                  Lisez le verdict et exportez votre livre
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-lg font-semibold text-primary mb-2">
                ✨ Vous ne rédigez aucune ligne.
              </p>
              <p className="text-muted-foreground">
                Vous guidez l'intention, l'éditeur numérique fait le reste.
              </p>
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
