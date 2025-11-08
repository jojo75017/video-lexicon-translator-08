import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, Plus, Wand2, RotateCcw, ArrowLeft, Merge, Sparkles, Eye, Search, Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagazineSidebar } from '@/components/layout/MagazineSidebar';
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
import { EbookChapterImageGenerator } from '@/components/ebook/EbookChapterImageGenerator';
import { EbookExporter } from '@/components/ebook/EbookExporter';
import { EbookAdvancedFeatures } from '@/components/ebook/EbookAdvancedFeatures';
import { EbookKdpTools } from '@/components/ebook/EbookKdpTools';
import { EbookPreview } from '@/components/ebook/EbookPreview';
import { EbookCoverGenerator } from '@/components/ebook/EbookCoverGenerator';
import { EbookWritingAssistant } from '@/components/ebook/EbookWritingAssistant';
import { EbookBackCoverGenerator } from '@/components/ebook/EbookBackCoverGenerator';
import heroEbook from '@/assets/hero-ebook-robot.png';

// Hooks et données
import { useSubscriptionGeneration, Chapter, SubChapter } from '@/hooks/useSubscriptionGeneration';
import { ebookTemplates } from '@/data/ebookTemplates';

interface EbookPlannerPageProps {
  subscriberEmail?: string;
  subscriberData?: any;
}

const EbookPlannerPage: React.FC<EbookPlannerPageProps> = ({ subscriberEmail = '', subscriberData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [apiKey, setApiKey] = useState('');
  
  // États principaux
  const [ebookTitle, setEbookTitle] = useState(location.state?.suggestedTitle || '');
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories, generateBackCover } = useSubscriptionGeneration(subscriberEmail, apiKey, ebookTitle);
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
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'planner':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg border-2 bg-white/95 backdrop-blur-sm" style={{ borderColor: 'hsl(var(--coral-pink))' }}>
                  <CardHeader className="rounded-t-lg" style={{ background: 'linear-gradient(135deg, hsl(var(--coral-pink) / 0.15) 0%, hsl(var(--royal-purple) / 0.15) 100%)' }}>
                    <CardTitle className="flex items-center gap-3 text-xl font-bold" style={{ color: 'hsl(var(--royal-purple))' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--coral-pink)) 0%, hsl(var(--royal-purple)) 100%)' }}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      Informations générales
                    </CardTitle>
                    <CardDescription style={{ color: 'hsl(var(--royal-purple) / 0.8)' }}>
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
                        style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue)) 0%, hsl(var(--royal-purple)) 100%)' }}
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

                <Card className="shadow-lg border-2 bg-white/95 backdrop-blur-sm" style={{ borderColor: 'hsl(var(--cobalt-blue))' }}>
                  <CardHeader className="rounded-t-lg" style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue) / 0.15) 0%, hsl(var(--royal-purple) / 0.1) 100%)' }}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold" style={{ color: 'hsl(var(--cobalt-blue))' }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue)) 0%, hsl(190 85% 65%) 100%)' }}>
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        Structure des chapitres
                      </CardTitle>
                      <div className="flex gap-2">
                        {selectedChapters.length > 1 && (
                          <Button
                            onClick={mergeSelectedChapters}
                            variant="outline"
                            size="sm"
                            style={{ borderColor: 'hsl(var(--cobalt-blue))', color: 'hsl(var(--cobalt-blue))' }}
                          >
                            <Merge className="h-3 w-3 mr-1" />
                            Fusionner ({selectedChapters.length})
                          </Button>
                        )}
                        <Button onClick={addChapter} size="sm" style={{ background: 'linear-gradient(135deg, hsl(var(--cobalt-blue)) 0%, hsl(190 85% 65%) 100%)' }}>
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
          </div>
        );
      
      case 'templates':
        return <EbookTemplates onApplyTemplate={applyTemplate} />;
      
      case 'writing':
        return (
          <EbookWriting 
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
          />
        );
      
      case 'tools':
        return (
          <div className="space-y-6">
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
              <Card className="border-2" style={{ borderColor: 'hsl(var(--honey-gold))' }}>
                <CardHeader style={{ background: 'linear-gradient(135deg, hsl(var(--honey-gold) / 0.15) 0%, hsl(150 75% 60% / 0.1) 100%)' }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--honey-gold))' }}>
                    <Eye className="h-5 w-5" />
                    Résumé de l'Ebook
                  </CardTitle>
                  <CardDescription style={{ color: 'hsl(var(--honey-gold) / 0.8)' }}>
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
              <Card className="border-2" style={{ borderColor: 'hsl(var(--royal-purple))' }}>
                <CardHeader style={{ background: 'linear-gradient(135deg, hsl(var(--royal-purple) / 0.15) 0%, hsl(var(--coral-pink) / 0.1) 100%)' }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--royal-purple))' }}>
                    <Palette className="h-5 w-5" />
                    Concepts de Couverture
                  </CardTitle>
                  <CardDescription style={{ color: 'hsl(var(--royal-purple) / 0.8)' }}>
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

              {/* SEO Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Optimisation SEO
                  </CardTitle>
                  <CardDescription>
                    Mots-clés et optimisation pour Amazon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const seo = await optimizeForSEO(ebookTitle, chapters);
                      if (seo) {
                        setSeoOptimization(seo);
                        toast.success('Optimisation SEO générée !');
                      }
                    }}
                    disabled={!ebookTitle || !authorName || isGenerating}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Optimiser pour le SEO
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Améliorez votre visibilité en ligne
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
            </div>
          </div>
        );
      
      case 'kdp':
        return (
          <EbookKdpTools
            ebookTitle={ebookTitle}
            chapters={chapters}
            isGenerating={isGenerating}
          />
        );
      
      case 'advanced':
        return (
          <EbookAdvancedFeatures
            ebookTitle={ebookTitle}
            chapters={chapters}
            isGenerating={isGenerating}
          />
        );
      
      case 'back-cover':
        return (
          <EbookBackCoverGenerator
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={chapters}
            isGenerating={isGenerating}
            onGenerate={async (tone, audience, highlights) => {
              return await generateBackCover(ebookTitle, authorName, chapters, tone, audience, highlights);
            }}
          />
        );
      
      case 'marketing':
        return (
          <EbookMarketing
            ebookTitle={ebookTitle}
            chapters={chapters}
            isGenerating={isGenerating}
          />
        );
      
      case 'monetization':
        return <EbookMonetization />;
      
      case 'export':
        return (
          <EbookExporter
            ebookTitle={ebookTitle}
            authorName={authorName}
            preface={preface}
            conclusion={conclusion}
            chapters={chapters}
          />
        );
      
      case 'toc':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Générer la table des matières</CardTitle>
              <CardDescription>
                Créez automatiquement une table des matières professionnelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateTableOfContents}
                disabled={chapters.length === 0}
                className="w-full"
              >
                Générer et copier la table des matières
              </Button>
            </CardContent>
          </Card>
        );
      
      case 'settings':
        return (
          <EbookSettings
            apiKey={apiKey}
            onUpdateApiKey={setApiKey}
            numberOfChapters={numberOfChapters}
            onUpdateNumberOfChapters={setNumberOfChapters}
            importText={importText}
            onUpdateImportText={setImportText}
            onAnalyzeImportedText={generateAutomaticPlan}
            isGenerating={isGenerating}
          />
        );
      
      case 'images':
        return (
          <EbookChapterImageGenerator
            ebookTitle={ebookTitle}
            chapters={chapters}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, hsl(var(--cream)) 0%, hsl(var(--cobalt-blue) / 0.1) 50%, hsl(var(--coral-pink) / 0.05) 100%)' }}>
      {/* Magazine Sidebar */}
      <MagazineSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden" style={{ background: 'var(--gradient-magazine-hero)' }}>
          <div className="absolute inset-0 bg-grid-white/10"></div>
          {/* Image décorative du tableau de bord */}
          <img
            src={heroEbook}
            alt="Illustration du tableau de bord ebook - Studio de Création"
            loading="lazy"
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 w-full h-auto opacity-50 hidden lg:block animate-[float_6s_ease-in-out_infinite]"
            style={{
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div className="relative container mx-auto px-6 py-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/ebook-ideas')}
              className="absolute top-6 left-6 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux idées
            </Button>
            
            <div className="max-w-4xl mx-auto text-center mt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)' }}>
                <BookOpen className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-white">
                Studio de Création
              </h1>
              
              <p className="font-inter text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Créez des livres numériques de qualité professionnelle avec l'IA
              </p>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Wand2 className="h-4 w-4" />
                    <span>IA Avancée</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <BookOpen className="h-4 w-4" />
                    <span>Export PDF</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Outils KDP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EbookPlannerPage;
