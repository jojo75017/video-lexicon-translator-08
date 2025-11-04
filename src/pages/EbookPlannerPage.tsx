import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Plus, Wand2, RotateCcw, ArrowLeft, Merge, Sparkles, Eye, Search, Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import EbookImageBank from '@/components/ebook/EbookImageBank';
import { EbookMarketing } from '@/components/ebook/EbookMarketing';
import { EbookMonetization } from '@/components/ebook/EbookMonetization';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Composants refactorisés
import { EbookTemplates } from '@/components/ebook/EbookTemplates';
import { EbookChapter } from '@/components/ebook/EbookChapter';
import { EbookWriting } from '@/components/ebook/EbookWriting';
import { EbookSettings } from '@/components/ebook/EbookSettings';
import { EbookExporter } from '@/components/ebook/EbookExporter';
import { EbookAdvancedFeatures } from '@/components/ebook/EbookAdvancedFeatures';
import { EbookKdpTools } from '@/components/ebook/EbookKdpTools';
import { EbookPreview } from '@/components/ebook/EbookPreview';
import { EbookCoverGenerator } from '@/components/ebook/EbookCoverGenerator';
import { EbookWritingAssistant } from '@/components/ebook/EbookWritingAssistant';

// Hooks et données
import { useSubscriptionGeneration, Chapter, SubChapter } from '@/hooks/useSubscriptionGeneration';
import { ebookTemplates } from '@/data/ebookTemplates';

interface EbookPlannerPageProps {
  subscriberEmail: string;
  subscriberData: any;
}

const EbookPlannerPage: React.FC<EbookPlannerPageProps> = ({ subscriberEmail, subscriberData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories } = useSubscriptionGeneration(subscriberEmail);
  
  // États principaux
  const [ebookTitle, setEbookTitle] = useState(location.state?.suggestedTitle || '');
  const [authorName, setAuthorName] = useState('');
  const [preface, setPreface] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');
  const [ebookImages, setEbookImages] = useState<Array<{url: string, title: string, chapterIndex?: number}>>([]);
  
  // États pour les résultats des outils
  const [bookSummary, setBookSummary] = useState('');
  const [coverConcepts, setCoverConcepts] = useState('');
  const [seoOptimization, setSeoOptimization] = useState('');
  const [kdpDescription, setKdpDescription] = useState('');
  const [kdpKeywords, setKdpKeywords] = useState('');
  const [kdpCategories, setKdpCategories] = useState('');

  // Configuration du glisser-déposer
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Gestion des chapitres (optimisée avec useCallback)
  const addChapter = React.useCallback(() => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      subChapters: [],
      content: ''
    };
    setChapters(prev => [...prev, newChapter]);
  }, []);

  const removeChapter = React.useCallback((chapterId: string) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
    setSelectedChapters(prev => prev.filter(id => id !== chapterId));
  }, []);

  const updateChapterTitle = React.useCallback((chapterId: string, title: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, title } : chapter
    ));
  }, []);

  const updateChapterContent = React.useCallback((chapterId: string, content: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, content } : chapter
    ));
  }, []);

  const addSubChapter = React.useCallback((chapterId: string) => {
    const newSubChapter: SubChapter = {
      id: Date.now().toString(),
      title: '',
      content: ''
    };
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subChapters: [...chapter.subChapters, newSubChapter] }
        : chapter
    ));
  }, []);

  const removeSubChapter = React.useCallback((chapterId: string, subChapterId: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subChapters: chapter.subChapters.filter(sub => sub.id !== subChapterId) }
        : chapter
    ));
  }, []);

  const updateSubChapterTitle = React.useCallback((chapterId: string, subChapterId: string, title: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId 
        ? { 
            ...chapter, 
            subChapters: chapter.subChapters.map(sub => 
              sub.id === subChapterId ? { ...sub, title } : sub
            )
          }
        : chapter
    ));
  }, []);

  const updateSubChapterContent = React.useCallback((chapterId: string, subChapterId: string, content: string) => {
    setChapters(prev => prev.map(c => 
      c.id === chapterId 
        ? {
            ...c,
            subChapters: c.subChapters.map(sc =>
              sc.id === subChapterId ? { ...sc, content } : sc
            )
          }
        : c
    ));
  }, []);

  // Glisser-déposer pour réorganiser les chapitres
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setChapters((chapters) => {
        const oldIndex = chapters.findIndex(chapter => chapter.id === active.id);
        const newIndex = chapters.findIndex(chapter => chapter.id === over?.id);

        const newChapters = arrayMove(chapters, oldIndex, newIndex);
        toast.success('Chapitres réorganisés !');
        return newChapters;
      });
    }
  };

  // Sélection de chapitres
  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  // Fusion de chapitres sélectionnés
  const mergeSelectedChapters = () => {
    if (selectedChapters.length < 2) {
      toast.error('Sélectionnez au moins 2 chapitres à fusionner');
      return;
    }

    const chaptersToMerge = chapters.filter(c => selectedChapters.includes(c.id));
    const otherChapters = chapters.filter(c => !selectedChapters.includes(c.id));
    
    const mergedChapter: Chapter = {
      id: Date.now().toString(),
      title: `${chaptersToMerge[0].title} (fusionné)`,
      subChapters: chaptersToMerge.flatMap(c => c.subChapters),
      content: chaptersToMerge.map(c => c.content).join('\n\n')
    };

    const firstSelectedIndex = chapters.findIndex(c => c.id === selectedChapters[0]);
    const newChapters = [...otherChapters];
    newChapters.splice(firstSelectedIndex, 0, mergedChapter);

    setChapters(newChapters);
    setSelectedChapters([]);
    toast.success(`${chaptersToMerge.length} chapitres fusionnés !`);
  };

  // Dupliquer un chapitre
  const duplicateChapter = (chapterId: string) => {
    const chapterToDuplicate = chapters.find(c => c.id === chapterId);
    if (!chapterToDuplicate) return;

    const duplicatedChapter: Chapter = {
      ...chapterToDuplicate,
      id: Date.now().toString(),
      title: `${chapterToDuplicate.title} (copie)`,
      subChapters: chapterToDuplicate.subChapters.map(sub => ({
        ...sub,
        id: (Date.now() + Math.random()).toString()
      }))
    };

    const originalIndex = chapters.findIndex(c => c.id === chapterId);
    const newChapters = [...chapters];
    newChapters.splice(originalIndex + 1, 0, duplicatedChapter);
    setChapters(newChapters);
    toast.success('Chapitre dupliqué !');
  };

  // Déplacer un chapitre
  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(c => c.id === chapterId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    const newChapters = arrayMove(chapters, currentIndex, newIndex);
    setChapters(newChapters);
    toast.success(`Chapitre déplacé vers le ${direction === 'up' ? 'haut' : 'bas'} !`);
  };

  // Générer le contenu d'un chapitre
  const handleGenerateChapterContent = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const content = await generateChapterContent(chapter);
    if (content) {
      updateChapterContent(chapterId, content);
    }
  };

  // Générer le contenu d'un sous-chapitre
  const handleGenerateSubChapterContent = async (chapterId: string, subChapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    const subChapter = chapter.subChapters.find(sc => sc.id === subChapterId);
    if (!subChapter) return;

    const content = await generateSubChapterContent(subChapter);
    if (content) {
      updateSubChapterContent(chapterId, subChapterId, content);
    }
  };

  // Diviser un chapitre automatiquement
  const handleSplitChapter = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

  // Fonction splitChapterAutomatically retirée (pas dans le nouveau hook)
    toast.info('Fonction de division automatique non disponible');
  };

  // Générer automatiquement un plan d'ebook
  const generateAutomaticPlan = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre');
      return;
    }

    const planData = await generateEbookPlan(ebookTitle, authorName, numberOfChapters);
    if (planData) {
      if (!authorName) {
        setAuthorName(planData.author);
      }
      setPreface(planData.preface);
      setConclusion(planData.conclusion);
      
      const generatedChapters = planData.chapters.map((chapter: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: chapter.title,
        content: '',
        subChapters: chapter.subChapters.map((sub: string, subIndex: number) => ({
          id: (Date.now() + index * 100 + subIndex).toString(),
          title: sub,
          content: ''
        }))
      }));
      
      setChapters(generatedChapters);
    }
  };

  // Analyser un texte importé
  const analyzeImportedText = async () => {
    toast.info('Fonctionnalité disponible prochainement');
  };

  // Appliquer un template
  const applyTemplate = (templateType: string) => {
    const template = ebookTemplates[templateType];
    if (!template) return;

    setEbookTitle(template.title);
    setAuthorName(template.author);
    setPreface(template.preface);
    setConclusion(template.conclusion);
    
    const templateChapters = template.chapters.map((chapter, index) => ({
      id: (Date.now() + index).toString(),
      title: chapter.title,
      content: '',
      subChapters: chapter.subChapters.map((sub, subIndex) => ({
        id: (Date.now() + index * 100 + subIndex).toString(),
        title: sub,
        content: ''
      }))
    }));
    
    setChapters(templateChapters);
    toast.success(`Template ${templateType} appliqué avec succès !`);
  };

  // Générer la table des matières
  const generateTableOfContents = () => {
    if (chapters.length === 0) {
      toast.error('Ajoutez des chapitres pour générer la table des matières');
      return;
    }

    let toc = `📚 TABLE DES MATIÈRES\n`;
    toc += `${'='.repeat(50)}\n\n`;
    
    if (preface) {
      toc += `Préface ................................................ Page 3\n\n`;
    }
    
    let currentPage = preface ? 5 : 3;
    
    chapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      const pageNumber = currentPage;
      
      toc += `${chapterNumber}. ${chapter.title}`;
      const dots = Math.max(2, 45 - chapter.title.length - chapterNumber.toString().length);
      toc += `${'.'.repeat(dots)} Page ${pageNumber}\n`;
      
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        toc += `   ${subNumber} ${subChapter.title}`;
        const subDots = Math.max(2, 42 - subChapter.title.length - subNumber.length);
        toc += `${'.'.repeat(subDots)} Page ${pageNumber + subIndex + 1}\n`;
      });
      
      toc += '\n';
      currentPage += Math.max(5, chapter.subChapters.length + 3);
    });
    
    if (conclusion) {
      toc += `Conclusion/Mot de la fin ................................ Page ${currentPage + 2}\n`;
    }
    
    toc += `\n${'='.repeat(50)}\n`;
    toc += `Total estimé: ${currentPage + (conclusion ? 4 : 2)} pages\n`;

    navigator.clipboard.writeText(toc);
    toast.success('Table des matières copiée dans le presse-papiers !');
  };

  // Réinitialiser le plan
  const resetPlan = () => {
    setEbookTitle('');
    setAuthorName('');
    setPreface('');
    setConclusion('');
    setChapters([]);
    setNumberOfChapters(8);
    setSelectedChapters([]);
    setImportText('');
    setEbookImages([]);
    toast.success('Plan réinitialisé !');
  };

  const handleImageSelect = (imageUrl: string, title: string) => {
    const newImage = { url: imageUrl, title };
    setEbookImages(prev => [...prev, newImage]);
    toast.success('Image ajoutée à votre ebook !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-blue-50">
      {/* Hero Section Professionnel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/95 via-primary to-primary/90">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <Button
            variant="ghost"
            onClick={() => navigate('/ebook-ideas')}
            className="absolute top-6 left-6 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux idées
          </Button>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-white/10 backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Générateur d'Ebook
              <span className="block text-3xl md:text-4xl lg:text-5xl text-white/80 font-medium mt-2">
                Professionnel
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Créez des livres numériques de qualité professionnelle avec l'intelligence artificielle. 
              De l'idée à la publication sur Amazon KDP.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-white font-medium">
                  <Wand2 className="h-4 w-4" />
                  <span>IA Avancée</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-white font-medium">
                  <BookOpen className="h-4 w-4" />
                  <span>Export PDF</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-white font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Outils KDP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-10">
        {/* Navigation Professionnelle */}
        <div className="mb-12">
          <Tabs defaultValue="planner" className="space-y-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
              <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-transparent gap-1 p-1">
                <TabsTrigger 
                  value="planner" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📝 Planificateur</span>
                  <span className="lg:hidden">📝 Plan</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="templates" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📋 Templates</span>
                  <span className="lg:hidden">📋 Mod.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="writing" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">✍️ Rédaction</span>
                  <span className="lg:hidden">✍️ Écr.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tools" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">🛠️ Outils</span>
                  <span className="lg:hidden">🛠️ Out.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="kdp" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📖 KDP</span>
                  <span className="lg:hidden">📖 KDP</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">💼 Business</span>
                  <span className="lg:hidden">💼 Biz</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="marketing" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📢 Marketing</span>
                  <span className="lg:hidden">📢 Mrk</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="monetization" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">💰 Monétisation</span>
                  <span className="lg:hidden">💰 Mon</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="export" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📤 Export</span>
                  <span className="lg:hidden">📤 Exp</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="toc" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">📚 Sommaire</span>
                  <span className="lg:hidden">📚 Som</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="images" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">🎨 Images</span>
                  <span className="lg:hidden">🎨 Img</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="text-xs lg:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  <span className="hidden lg:inline">⚙️ Paramètres</span>
                  <span className="lg:hidden">⚙️ Cfg</span>
                </TabsTrigger>
              </TabsList>
            </div>

          <TabsContent value="planner" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-primary">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      Informations générales
                    </CardTitle>
                    <CardDescription>
                      Définissez les informations de base de votre ebook
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Titre de l'ebook</Label>
                        <Input
                          id="title"
                          placeholder="Mon Ebook Extraordinaire"
                          value={ebookTitle}
                          onChange={(e) => setEbookTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="author">Nom de l'auteur</Label>
                        <Input
                          id="author"
                          placeholder="Votre nom"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="preface">Préface/Introduction</Label>
                      <Textarea
                        id="preface"
                        placeholder="Écrivez une préface engageante..."
                        value={preface}
                        onChange={(e) => setPreface(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="conclusion">Conclusion/Mot de la fin</Label>
                      <Textarea
                        id="conclusion"
                        placeholder="Rédigez une conclusion mémorable..."
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={generateAutomaticPlan} 
                        disabled={!ebookTitle || isGenerating}
                        className="flex-1"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Génération...' : '✨ Générer automatiquement'}
                      </Button>
                      <Button 
                        onClick={resetPlan}
                        variant="outline"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Réinitialiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-primary">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        Structure des chapitres
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedChapters.length > 1 && (
                          <Button
                            onClick={mergeSelectedChapters}
                            variant="outline"
                            size="sm"
                          >
                            <Merge className="h-3 w-3 mr-1" />
                            Fusionner ({selectedChapters.length})
                          </Button>
                        )}
                        <Button onClick={addChapter} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un chapitre
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {chapters.map((chapter, index) => (
                            <EbookChapter
                              key={chapter.id}
                              chapter={chapter}
                              index={index}
                              isSelected={selectedChapters.includes(chapter.id)}
                              onSelect={toggleChapterSelection}
                              onUpdateTitle={updateChapterTitle}
                              onUpdateContent={updateChapterContent}
                              onAddSubChapter={addSubChapter}
                              onRemoveSubChapter={removeSubChapter}
                              onUpdateSubChapterTitle={updateSubChapterTitle}
                              onMoveChapter={moveChapter}
                              onDuplicateChapter={duplicateChapter}
                              onSplitChapter={handleSplitChapter}
                              onGenerateChapterContent={handleGenerateChapterContent}
                              onGenerateSubChapterContent={handleGenerateSubChapterContent}
                              onRemoveChapter={removeChapter}
                              isGenerating={isGenerating}
                              totalChapters={chapters.length}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    
                    {chapters.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4" />
                        <p>Aucun chapitre ajouté. Commencez par ajouter un chapitre ou générer automatiquement un plan.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6 sticky top-8">
                <EbookPreview
                  ebookTitle={ebookTitle}
                  authorName={authorName}
                  preface={preface}
                  conclusion={conclusion}
                  chapters={chapters}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <EbookTemplates onApplyTemplate={applyTemplate} />
          </TabsContent>

          <TabsContent value="writing">
            <EbookWriting 
              chapters={chapters}
              onUpdateChapterContent={updateChapterContent}
              onUpdateSubChapterContent={updateSubChapterContent}
            />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Générateur de couverture IA */}
              <div className="lg:col-span-2">
                <EbookCoverGenerator
                  ebookTitle={ebookTitle}
                  authorName={authorName}
                />
              </div>

              {/* Assistant d'écriture */}
              <div className="lg:col-span-2">
                <EbookWritingAssistant
                  ebookTitle={ebookTitle}
                />
              </div>

              {/* Résumé automatique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Résumé de l'Ebook
                  </CardTitle>
                  <CardDescription>
                    Génère un résumé attractif pour votre ebook
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const summary = await generateBookSummary(chapters, ebookTitle);
                      if (summary) {
                        setBookSummary(summary);
                        toast.success('Résumé généré !');
                      }
                    }}
                    disabled={!ebookTitle || !authorName || isGenerating}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Générer le résumé
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Parfait pour la 4ème de couverture ou description en ligne
                  </p>
                  
                  {bookSummary && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{bookSummary}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(bookSummary);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Concepts de couverture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Concepts de Couverture
                  </CardTitle>
                  <CardDescription>
                    5 idées créatives pour votre couverture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const concepts = await generateEbookCover(ebookTitle);
                      if (concepts) {
                        setCoverConcepts(concepts);
                        toast.success('Concepts générés !');
                      }
                    }}
                    disabled={!ebookTitle || !authorName || isGenerating}
                    className="w-full"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Générer les concepts
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Descriptions détaillées pour votre designer
                  </p>
                  
                  {coverConcepts && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{coverConcepts}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(coverConcepts);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Optimisation SEO */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Optimisation SEO
                  </CardTitle>
                  <CardDescription>
                    Mots-clés, titres alternatifs et meta descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const seoData = await optimizeForSEO(ebookTitle, chapters);
                      if (seoData) {
                        const formatted = `
**Titres optimisés:**
${seoData.titles.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}

**Mots-clés:**
${seoData.keywords.join(', ')}

**Meta Description:**
${seoData.metaDescription}

**Hashtags:**
${seoData.hashtags.join(' ')}
                        `.trim();
                        setSeoOptimization(formatted);
                        toast.success('Optimisation SEO générée !');
                      }
                    }}
                    disabled={!ebookTitle || !authorName || isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Analyser et optimiser pour le SEO
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Obtenez des titres alternatifs, mots-clés et hashtags optimisés pour la visibilité
                  </p>
                  
                  {seoOptimization && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{seoOptimization}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(seoOptimization);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Amazon KDP Tools */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📚 Outils Amazon KDP
                  </CardTitle>
                  <CardDescription>
                    Optimisez votre ebook pour la publication sur Amazon KDP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={async () => {
                        const description = await generateKDPDescription(ebookTitle, chapters);
                        if (description) {
                          setKdpDescription(description);
                          toast.success('Description KDP générée !');
                        }
                      }}
                      disabled={!ebookTitle || isGenerating}
                      className="w-full"
                    >
                      📝 Description KDP
                    </Button>
                    <Button 
                      onClick={() => toast.info('Fonctionnalité disponible prochainement')}
                      disabled={!ebookTitle || isGenerating}
                      className="w-full"
                    >
                      🔑 Mots-clés KDP
                    </Button>
                    <Button 
                      onClick={() => toast.info('Fonctionnalité disponible prochainement')}
                      disabled={!ebookTitle || isGenerating}
                      className="w-full"
                    >
                      📂 Catégories KDP
                    </Button>
                  </div>

                  {kdpDescription && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{kdpDescription}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(kdpDescription);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}

                  {kdpKeywords && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{kdpKeywords}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(kdpKeywords);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}

                  {kdpCategories && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <pre className="whitespace-pre-wrap text-sm flex-1">{kdpCategories}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(kdpCategories);
                            toast.success('Copié dans le presse-papier !');
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Générez description, mots-clés et catégories optimisés pour Amazon KDP
                  </p>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Statistiques de l'Ebook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{chapters.length}</div>
                      <div className="text-sm text-muted-foreground">Chapitres</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {chapters.reduce((acc, ch) => acc + ch.subChapters.length, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Sous-chapitres</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {chapters.filter(ch => ch.content && ch.content.trim().length > 0).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Chapitres rédigés</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round((chapters.filter(ch => ch.content && ch.content.trim().length > 0).length / Math.max(1, chapters.length)) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Progression</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="kdp">
            <EbookKdpTools 
              ebookTitle={ebookTitle}
              chapters={chapters}
              isGenerating={isGenerating}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <EbookAdvancedFeatures 
              ebookTitle={ebookTitle}
              chapters={chapters}
              isGenerating={isGenerating}
            />
          </TabsContent>

          <TabsContent value="export">
            <EbookExporter
              ebookTitle={ebookTitle}
              authorName={authorName}
              preface={preface}
              conclusion={conclusion}
              chapters={chapters}
            />
          </TabsContent>

          <TabsContent value="toc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Table des Matières Automatique
                </CardTitle>
                <CardDescription>
                  Génération automatique avec numérotation et pagination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateTableOfContents} className="w-full mb-4" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  📖 Générer la table des matières
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  La table des matières sera copiée dans votre presse-papiers
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            {/* Settings retirés - pas besoin de clé API */}
            <div className="space-y-4">
              <div>
                <Label>Nombre de chapitres</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfChapters}
                  onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 8)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Plan: {subscriberData?.plan_type || 'starter'}</p>
                <p>Chapitres générés: {subscriberData?.chapters_generated || 0}</p>
                <p>Plans créés: {subscriberData?.ebook_plans_generated || 0}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <EbookImageBank 
              onImageSelect={handleImageSelect}
              ebookTitle={ebookTitle}
              chapters={chapters}
            />
            
            {ebookImages.length > 0 && (
              <Card className="mt-6 gradient-card glow-effect border-0">
                <CardHeader>
                  <CardTitle className="gradient-primary bg-clip-text text-transparent">
                    📷 Images de votre Ebook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ebookImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image.url} 
                          alt={image.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setEbookImages(prev => prev.filter((_, i) => i !== index))}
                          >
                            Supprimer
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{image.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <EbookMarketing
              ebookTitle={ebookTitle}
              chapters={chapters}
              isGenerating={isGenerating}
            />
          </TabsContent>

          <TabsContent value="monetization" className="space-y-6">
            <EbookMonetization />
          </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EbookPlannerPage;
