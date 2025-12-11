import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Plus, Wand2, RotateCcw, ArrowLeft, Merge, Sparkles, Eye, Search, Palette, Users,
  Save, Zap, Target, FileText, Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { ModernSidebar } from '@/components/layout/ModernSidebar';
import { useEbookDatabase } from '@/hooks/useEbookDatabase';
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
import { EbookCharacters, type Character } from '@/components/ebook/EbookCharacters';
import { EbookProjectsList } from '@/components/ebook/EbookProjectsList';
import { EbookAiChat } from '@/components/ebook/EbookAiChat';
import { EbookVersionHistory } from '@/components/ebook/EbookVersionHistory';
import { EbookStatisticsTools } from '@/components/ebook/EbookStatisticsTools';
import { EbookVoiceDictation } from '@/components/ebook/EbookVoiceDictation';
import { EbookSeriesManager } from '@/components/ebook/EbookSeriesManager';
import { EbookKdpMarketAnalysis } from '@/components/ebook/EbookKdpMarketAnalysis';
import { EbookAudioGenerator } from '@/components/ebook/EbookAudioGenerator';
import { EbookFormationPDF } from '@/components/ebook/EbookFormationPDF';
import EbookKdpAnalytics from '@/components/ebook/EbookKdpAnalytics';

// Hooks et données
import { useSubscriptionGeneration, Chapter, SubChapter } from '@/hooks/useSubscriptionGeneration';
import { ebookTemplates } from '@/data/ebookTemplates';
import { type Character as EbookCharacter } from '@/components/ebook/EbookCharacters';

interface EbookPlannerPageProps {
  subscriberEmail?: string;
  subscriberData?: any;
}

const EbookPlannerPage: React.FC<EbookPlannerPageProps> = ({ subscriberEmail = '', subscriberData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const STORAGE_KEY = 'ebook-planner-autosave';
  
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
    return null;
  };
  
  const savedData = loadSavedData();
  const { saveProject, loadLatestProject, isSaving, currentProjectId, setCurrentProjectId, saveVersion, loadVersions, restoreVersion } = useEbookDatabase();
  
  const [apiKey, setApiKey] = useState(savedData?.apiKey || '');
  const [ebookTitle, setEbookTitle] = useState(location.state?.suggestedTitle || savedData?.ebookTitle || '');
  const [targetAudience, setTargetAudience] = useState(savedData?.targetAudience || 'Adultes');
  const [tomeNumber, setTomeNumber] = useState<number | null>(savedData?.tomeNumber || null);
  const [writingStyle, setWritingStyle] = useState(savedData?.writingStyle || 'narratif');
  const [chapterLength, setChapterLength] = useState(savedData?.chapterLength || 'moyen');
  const [detailLevel, setDetailLevel] = useState(savedData?.detailLevel || 'détaillé');
  const [tone, setTone] = useState(savedData?.tone || 'professionnel');
  const [narrativeFormat, setNarrativeFormat] = useState(savedData?.narrativeFormat || 'troisième personne');
  
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories, generateBackCover, generatePreface, generateConclusion, generateEpilogue, translateContent, analyzeTextStatistics } = useSubscriptionGeneration(subscriberEmail, apiKey, ebookTitle, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat);
  
  const [authorName, setAuthorName] = useState(savedData?.authorName || '');
  const [preface, setPreface] = useState(savedData?.preface || '');
  const [conclusion, setConclusion] = useState(savedData?.conclusion || '');
  const [epilogue, setEpilogue] = useState(savedData?.epilogue || '');
  const [chapters, setChapters] = useState<Chapter[]>(savedData?.chapters || []);
  const [characters, setCharacters] = useState<EbookCharacter[]>(savedData?.characters || []);
  const [numberOfChapters, setNumberOfChapters] = useState(savedData?.numberOfChapters || 8);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');
  const [ebookImages, setEbookImages] = useState<Array<{url: string, title: string, chapterIndex?: number}>>(savedData?.ebookImages || []);
  
  const [bookSummary, setBookSummary] = useState('');
  const [coverConcepts, setCoverConcepts] = useState('');
  const [seoOptimization, setSeoOptimization] = useState('');
  const [kdpDescription, setKdpDescription] = useState('');
  const [kdpKeywords, setKdpKeywords] = useState('');
  const [kdpCategories, setKdpCategories] = useState('');
  
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const loadFromDatabase = async () => {
      const dbProject = await loadLatestProject();
      if (dbProject) {
        setEbookTitle(dbProject.title);
        setAuthorName(dbProject.author_name || '');
        setTargetAudience(dbProject.target_audience || 'Adultes');
        setTomeNumber(dbProject.tome_number);
        setWritingStyle(dbProject.writing_style || 'narratif');
        setChapterLength(dbProject.chapter_length || 'moyen');
        setDetailLevel(dbProject.detail_level || 'détaillé');
        setTone(dbProject.tone || 'professionnel');
        setNarrativeFormat(dbProject.narrative_format || 'troisième personne');
        setPreface(dbProject.preface || '');
        setConclusion(dbProject.conclusion || '');
        setChapters(Array.isArray(dbProject.chapters) ? dbProject.chapters as unknown as Chapter[] : []);
        setCharacters(Array.isArray(dbProject.characters) ? dbProject.characters as unknown as EbookCharacter[] : []);
        setEbookImages(Array.isArray(dbProject.ebook_images) ? dbProject.ebook_images as unknown as Array<{url: string, title: string, chapterIndex?: number}> : []);
        setNumberOfChapters(dbProject.number_of_chapters || 8);
        setBookSummary(dbProject.book_summary || '');
        setCoverConcepts(dbProject.cover_concepts || '');
        setSeoOptimization(dbProject.seo_optimization || '');
        setKdpDescription(dbProject.kdp_description || '');
        setKdpKeywords(dbProject.kdp_keywords || '');
        setKdpCategories(dbProject.kdp_categories || '');
      }
    };
    loadFromDatabase();
  }, []);

  useEffect(() => {
    const dataToSave = {
      apiKey, ebookTitle, authorName, targetAudience, tomeNumber, writingStyle,
      chapterLength, detailLevel, tone, narrativeFormat, preface, conclusion, epilogue,
      chapters, numberOfChapters, ebookImages, characters, lastSaved: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde localStorage:', error);
    }

    if (ebookTitle) {
      const projectData = {
        title: ebookTitle, author_name: authorName, target_audience: targetAudience,
        tome_number: tomeNumber, writing_style: writingStyle, chapter_length: chapterLength,
        detail_level: detailLevel, tone, narrative_format: narrativeFormat,
        preface, conclusion, chapters, characters, ebook_images: ebookImages,
        number_of_chapters: numberOfChapters, book_summary: bookSummary,
        cover_concepts: coverConcepts, seo_optimization: seoOptimization,
        kdp_description: kdpDescription, kdp_keywords: kdpKeywords, kdp_categories: kdpCategories,
      };

      const timer = setTimeout(() => saveProject(projectData), 2000);
      return () => clearTimeout(timer);
    }
  }, [apiKey, ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, preface, conclusion, epilogue, chapters, numberOfChapters, ebookImages, characters, bookSummary, coverConcepts, seoOptimization, kdpDescription, kdpKeywords, kdpCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addChapter = React.useCallback(() => {
    const newChapter: Chapter = { id: Date.now().toString(), title: '', subChapters: [], content: '' };
    setChapters(prev => [...prev, newChapter]);
  }, []);

  const removeChapter = React.useCallback((chapterId: string) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
    setSelectedChapters(prev => prev.filter(id => id !== chapterId));
  }, []);

  const updateChapterTitle = React.useCallback((chapterId: string, title: string) => {
    setChapters(prev => prev.map(chapter => chapter.id === chapterId ? { ...chapter, title } : chapter));
  }, []);

  const updateChapterContent = React.useCallback((chapterId: string, content: string) => {
    setChapters(prev => prev.map(chapter => chapter.id === chapterId ? { ...chapter, content } : chapter));
  }, []);

  const addSubChapter = React.useCallback((chapterId: string) => {
    const newSubChapter: SubChapter = { id: Date.now().toString(), title: '', content: '' };
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, subChapters: [...chapter.subChapters, newSubChapter] } : chapter
    ));
  }, []);

  const removeSubChapter = React.useCallback((chapterId: string, subChapterId: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, subChapters: chapter.subChapters.filter(sub => sub.id !== subChapterId) } : chapter
    ));
  }, []);

  const updateSubChapterTitle = React.useCallback((chapterId: string, subChapterId: string, title: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, subChapters: chapter.subChapters.map(sub => sub.id === subChapterId ? { ...sub, title } : sub) } : chapter
    ));
  }, []);

  const updateSubChapterContent = React.useCallback((chapterId: string, subChapterId: string, content: string) => {
    setChapters(prev => prev.map(c => 
      c.id === chapterId ? { ...c, subChapters: c.subChapters.map(sc => sc.id === subChapterId ? { ...sc, content } : sc) } : c
    ));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChapters((chapters) => {
        const oldIndex = chapters.findIndex(chapter => chapter.id === active.id);
        const newIndex = chapters.findIndex(chapter => chapter.id === over?.id);
        return arrayMove(chapters, oldIndex, newIndex);
      });
    }
  };

  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapters(prev => prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]);
  };

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

  const duplicateChapter = (chapterId: string) => {
    const chapterToDuplicate = chapters.find(c => c.id === chapterId);
    if (!chapterToDuplicate) return;
    const duplicatedChapter: Chapter = {
      ...chapterToDuplicate,
      id: Date.now().toString(),
      title: `${chapterToDuplicate.title} (copie)`,
      subChapters: chapterToDuplicate.subChapters.map(sub => ({ ...sub, id: (Date.now() + Math.random()).toString() }))
    };
    const originalIndex = chapters.findIndex(c => c.id === chapterId);
    const newChapters = [...chapters];
    newChapters.splice(originalIndex + 1, 0, duplicatedChapter);
    setChapters(newChapters);
    toast.success('Chapitre dupliqué !');
  };

  const moveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(c => c.id === chapterId);
    if (currentIndex === -1) return;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chapters.length) return;
    setChapters(arrayMove(chapters, currentIndex, newIndex));
  };

  const handleGenerateChapterContent = async (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const content = await generateChapterContent(chapter);
    if (content) updateChapterContent(chapterId, content);
  };

  const handleGenerateSubChapterContent = async (chapterId: string, subChapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const subChapter = chapter.subChapters.find(sc => sc.id === subChapterId);
    if (!subChapter) return;
    const content = await generateSubChapterContent(subChapter);
    if (content) updateSubChapterContent(chapterId, subChapterId, content);
  };

  const handleSplitChapter = async (chapterId: string) => {
    toast.info('Fonction de division automatique non disponible');
  };

  const generateAutomaticPlan = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre');
      return;
    }
    const planData = await generateEbookPlan(ebookTitle, authorName, numberOfChapters);
    if (planData) {
      if (!authorName) setAuthorName(planData.author);
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
    toast.success(`Template ${templateType} appliqué !`);
  };

  const generateTableOfContents = () => {
    if (chapters.length === 0) {
      toast.error('Ajoutez des chapitres pour générer la table des matières');
      return;
    }
    let toc = `📚 TABLE DES MATIÈRES\n${'='.repeat(50)}\n\n`;
    let currentPage = preface ? 5 : 3;
    if (preface) toc += `Préface ................................................ Page 3\n\n`;
    chapters.forEach((chapter, index) => {
      const chapterNumber = index + 1;
      toc += `${chapterNumber}. ${chapter.title}${'.'.repeat(Math.max(2, 45 - chapter.title.length - chapterNumber.toString().length))} Page ${currentPage}\n`;
      chapter.subChapters.forEach((subChapter, subIndex) => {
        const subNumber = `${chapterNumber}.${subIndex + 1}`;
        toc += `   ${subNumber} ${subChapter.title}${'.'.repeat(Math.max(2, 42 - subChapter.title.length - subNumber.length))} Page ${currentPage + subIndex + 1}\n`;
      });
      toc += '\n';
      currentPage += Math.max(5, chapter.subChapters.length + 3);
    });
    if (conclusion) toc += `Conclusion ................................ Page ${currentPage + 2}\n`;
    toc += `\n${'='.repeat(50)}\nTotal estimé: ${currentPage + (conclusion ? 4 : 2)} pages\n`;
    navigator.clipboard.writeText(toc);
    toast.success('Table des matières copiée !');
  };

  const resetPlan = () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser ? Toutes les données seront perdues et vous pourrez commencer un nouvel ebook.')) {
      return;
    }
    
    // Réinitialiser tous les états
    setEbookTitle(''); setAuthorName(''); setPreface(''); setConclusion(''); setEpilogue('');
    setChapters([]); setNumberOfChapters(8); setSelectedChapters([]);
    setImportText(''); setEbookImages([]); setTargetAudience('Adultes');
    setTomeNumber(null); setWritingStyle('narratif'); setChapterLength('moyen');
    setDetailLevel('détaillé'); setTone('professionnel');
    setNarrativeFormat('troisième personne'); setCharacters([]);
    setBookSummary(''); setCoverConcepts(''); setSeoOptimization('');
    setKdpDescription(''); setKdpKeywords(''); setKdpCategories('');
    
    // IMPORTANT: Réinitialiser l'ID du projet pour créer un nouveau projet lors de la prochaine sauvegarde
    setCurrentProjectId(null);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
    toast.success('Planificateur réinitialisé ! Vous pouvez commencer un nouvel ebook.');
  };

  const handleImageSelect = (imageUrl: string, title: string) => {
    setEbookImages(prev => [...prev, { url: imageUrl, title }]);
    toast.success('Image ajoutée !');
  };

  const handleProjectLoad = (project: any) => {
    setEbookTitle(project.title);
    setAuthorName(project.author_name || '');
    setTargetAudience(project.target_audience || 'Adultes');
    setTomeNumber(project.tome_number);
    setWritingStyle(project.writing_style || 'narratif');
    setChapterLength(project.chapter_length || 'moyen');
    setDetailLevel(project.detail_level || 'détaillé');
    setTone(project.tone || 'professionnel');
    setNarrativeFormat(project.narrative_format || 'troisième personne');
    setPreface(project.preface || '');
    setConclusion(project.conclusion || '');
    setChapters(Array.isArray(project.chapters) ? project.chapters as unknown as Chapter[] : []);
    setCharacters(Array.isArray(project.characters) ? project.characters as unknown as EbookCharacter[] : []);
    setEbookImages(Array.isArray(project.ebook_images) ? project.ebook_images as unknown as Array<{url: string, title: string, chapterIndex?: number}> : []);
    setNumberOfChapters(project.number_of_chapters || 8);
    setBookSummary(project.book_summary || '');
    setCoverConcepts(project.cover_concepts || '');
    setSeoOptimization(project.seo_optimization || '');
    setKdpDescription(project.kdp_description || '');
    setKdpKeywords(project.kdp_keywords || '');
    setKdpCategories(project.kdp_categories || '');
    setActiveTab('planner');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <EbookProjectsList 
            onProjectLoad={handleProjectLoad}
            onCreateNew={() => setActiveTab('planner')}
            currentProject={{ title: ebookTitle, hasContent: chapters.length > 0 || preface.length > 0 || conclusion.length > 0 }}
          />
        );
      
      case 'planner':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Colonne principale (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Chapitres', value: chapters.length, icon: BookOpen, color: 'from-violet-500 to-fuchsia-500' },
                  { label: 'Personnages', value: characters.length, icon: Users, color: 'from-cyan-500 to-blue-500' },
                  { label: 'Images', value: ebookImages.length, icon: Palette, color: 'from-amber-500 to-orange-500' },
                  { label: 'Mots', value: chapters.reduce((acc, c) => acc + (c.content?.split(' ').length || 0), 0), icon: FileText, color: 'from-emerald-500 to-teal-500' },
                ].map((stat, i) => (
                  <Card key={i} className="border border-border/50 bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            {/* General Info Card */}
            <Card className="border border-border/50">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>Définissez les bases de votre ebook</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre de l'ebook</Label>
                    <Input
                      placeholder="Mon Ebook Extraordinaire"
                      value={ebookTitle}
                      onChange={(e) => setEbookTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom de l'auteur</Label>
                    <Input
                      placeholder="Votre nom"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Public cible</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enfants (3-6 ans)">🧒 Enfants (3-6 ans)</SelectItem>
                        <SelectItem value="Enfants (6-10 ans)">👦 Enfants (6-10 ans)</SelectItem>
                        <SelectItem value="Enfants (10-12 ans)">📚 Pré-ados (10-12 ans)</SelectItem>
                        <SelectItem value="Adolescents">🎮 Adolescents (13-17 ans)</SelectItem>
                        <SelectItem value="Jeunes adultes">🎓 Jeunes adultes (18-25 ans)</SelectItem>
                        <SelectItem value="Adultes">👔 Adultes</SelectItem>
                        <SelectItem value="Seniors">🌟 Seniors</SelectItem>
                        <SelectItem value="Tout public">🌍 Tout public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de chapitres</Label>
                    <Input
                      type="number"
                      min="3"
                      max="100"
                      value={numberOfChapters}
                      onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 8)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Clé API OpenAI</Label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Préface / Introduction</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await generatePreface(ebookTitle, chapters, targetAudience);
                        if (result) {
                          setPreface(result);
                          toast.success('Préface générée !');
                        }
                      }}
                      disabled={isGenerating || !ebookTitle}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Générer avec l'IA
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Écrivez une préface engageante qui accroche le lecteur dès les premières lignes..."
                    value={preface}
                    onChange={(e) => setPreface(e.target.value)}
                    rows={6}
                    className="resize-y min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Conclusion / Mot de la fin</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await generateConclusion(ebookTitle, chapters, targetAudience);
                        if (result) {
                          setConclusion(result);
                          toast.success('Conclusion générée !');
                        }
                      }}
                      disabled={isGenerating || !ebookTitle}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Générer avec l'IA
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Rédigez une conclusion mémorable qui laisse une impression durable..."
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={6}
                    className="resize-y min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Épilogue (optionnel)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const result = await generateEpilogue(ebookTitle, chapters, targetAudience);
                        if (result) {
                          setEpilogue(result);
                          toast.success('Épilogue généré !');
                        }
                      }}
                      disabled={isGenerating || !ebookTitle}
                      className="text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Générer avec l'IA
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Ajoutez un épilogue pour conclure votre histoire ou offrir une perspective future..."
                    value={epilogue}
                    onChange={(e) => setEpilogue(e.target.value)}
                    rows={4}
                    className="resize-y min-h-[80px]"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    onClick={generateAutomaticPlan} 
                    disabled={!ebookTitle || isGenerating}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    {isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
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

            {/* Chapters Card - NOW PROMINENT */}
            <Card className="border border-border/50">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Structure des chapitres</CardTitle>
                      <CardDescription>Organisez et rédigez vos chapitres ({chapters.length} chapitres)</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={generateTableOfContents} variant="outline" size="sm" disabled={chapters.length === 0}>
                      <FileText className="h-4 w-4 mr-1" />
                      Sommaire
                    </Button>
                    {selectedChapters.length > 1 && (
                      <Button onClick={mergeSelectedChapters} variant="outline" size="sm">
                        <Merge className="h-4 w-4 mr-1" />
                        Fusionner ({selectedChapters.length})
                      </Button>
                    )}
                    <Button onClick={addChapter} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {chapters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-cyan-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aucun chapitre</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Commencez par générer un plan automatique ou ajoutez des chapitres manuellement
                    </p>
                    <Button onClick={addChapter} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un chapitre
                    </Button>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
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
                )}
              </CardContent>
            </Card>

            {/* Templates at the bottom */}
            <Card className="border border-border/50">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Templates</CardTitle>
                    <CardDescription>Appliquez un modèle pré-défini</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <EbookTemplates onApplyTemplate={applyTemplate} />
              </CardContent>
            </Card>

            {/* Save Status */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border/50">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Sauvegarde...</span>
                </>
              ) : ebookTitle ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Sauvegardé automatiquement</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">En attente d'un titre</span>
                </>
              )}
            </div>
            </div>

            {/* Colonne droite - Aperçu (1/3) */}
            <div className="space-y-6">
              <EbookPreview
                ebookTitle={ebookTitle}
                authorName={authorName}
                preface={preface}
                conclusion={conclusion}
                epilogue={epilogue}
                chapters={chapters}
              />
            </div>
          </div>
        );
      
      case 'writing':
        return (
          <EbookWriting
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
          />
        );
      
      case 'cover':
        return (
          <EbookCoverGenerator
            ebookTitle={ebookTitle}
            authorName={authorName}
          />
        );
      
      case 'tools':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-violet-500" />
                    Résumé du livre
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const summary = await generateBookSummary(chapters, ebookTitle);
                      if (summary) { setBookSummary(summary); toast.success('Résumé généré !'); }
                    }}
                    disabled={!ebookTitle || isGenerating}
                    className="w-full btn-gradient"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Générer le résumé
                  </Button>
                  {bookSummary && (
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <pre className="whitespace-pre-wrap text-sm">{bookSummary}</pre>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(bookSummary); toast.success('Copié !'); }}>
                        Copier
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-fuchsia-500" />
                    Concepts de couverture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const concepts = await generateEbookCover(ebookTitle);
                      if (concepts) { setCoverConcepts(concepts); toast.success('Concepts générés !'); }
                    }}
                    disabled={!ebookTitle || isGenerating}
                    className="w-full btn-gradient"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Générer les concepts
                  </Button>
                  {coverConcepts && (
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <pre className="whitespace-pre-wrap text-sm">{coverConcepts}</pre>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(coverConcepts); toast.success('Copié !'); }}>
                        Copier
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-cyan-500" />
                    Optimisation SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const seo = await optimizeForSEO(ebookTitle, chapters);
                      if (seo) { setSeoOptimization(seo); toast.success('SEO généré !'); }
                    }}
                    disabled={!ebookTitle || isGenerating}
                    className="w-full btn-gradient"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Optimiser pour le SEO
                  </Button>
                  {seoOptimization && (
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <pre className="whitespace-pre-wrap text-sm">{seoOptimization}</pre>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(seoOptimization); toast.success('Copié !'); }}>
                        Copier
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <EbookBackCoverGenerator
                ebookTitle={ebookTitle}
                authorName={authorName}
                chapters={chapters}
                isGenerating={isGenerating}
                onGenerate={async (tone, audience, highlights) => {
                  return await generateBackCover(ebookTitle, authorName, chapters, tone, audience, highlights);
                }}
              />
            </div>
          </div>
        );
      
      case 'kdp':
        return (
          <EbookKdpTools
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={chapters}
            apiKey={apiKey}
            targetAudience={targetAudience}
          />
        );
      
      case 'characters':
        return (
          <EbookCharacters
            characters={characters}
            onUpdateCharacters={setCharacters}
          />
        );
      
      case 'images':
        return (
          <EbookChapterImageGenerator
            ebookTitle={ebookTitle}
            chapters={chapters}
            characters={characters}
            ebookImages={ebookImages.map(img => ({
              chapterId: img.chapterIndex?.toString() || '',
              chapterTitle: img.title,
              imageUrl: img.url,
              style: ''
            }))}
            onImagesUpdate={(images) => {
              setEbookImages(images.map(img => ({
                url: img.imageUrl,
                title: img.chapterTitle,
                chapterIndex: parseInt(img.chapterId) || undefined
              })));
            }}
          />
        );
      
      case 'export':
        return (
          <EbookExporter
            ebookTitle={ebookTitle}
            authorName={authorName}
            preface={preface}
            conclusion={conclusion}
            epilogue={epilogue}
            chapters={chapters}
          />
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
            writingStyle={writingStyle}
            onUpdateWritingStyle={setWritingStyle}
            chapterLength={chapterLength}
            onUpdateChapterLength={setChapterLength}
            detailLevel={detailLevel}
            onUpdateDetailLevel={setDetailLevel}
            tone={tone}
            onUpdateTone={setTone}
            narrativeFormat={narrativeFormat}
            onUpdateNarrativeFormat={setNarrativeFormat}
          />
        );
      
      case 'imagebank':
        return (
          <EbookImageBank
            ebookTitle={ebookTitle}
            chapters={chapters}
            onImageSelect={(url, title) => setEbookImages([...ebookImages, { url, title }])}
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
        return (
          <EbookMonetization />
        );
      
      case 'templates':
        return (
          <EbookTemplates
            onApplyTemplate={(templateType) => {
              const template = ebookTemplates[templateType];
              if (template) {
                // Appliquer tout le contenu du template
                setEbookTitle(template.title);
                setAuthorName(template.author);
                setPreface(template.preface);
                setConclusion(template.conclusion);
                
                // Convertir les chapitres du template au format attendu
                const newChapters: Chapter[] = template.chapters.map((ch, index) => ({
                  id: `chapter-${Date.now()}-${index}`,
                  title: ch.title,
                  content: '',
                  subChapters: ch.subChapters.map((sub, subIndex) => ({
                    id: `subchapter-${Date.now()}-${index}-${subIndex}`,
                    title: sub,
                    content: ''
                  }))
                }));
                setChapters(newChapters);
                
                // Naviguer vers le planificateur pour voir le résultat
                setActiveTab('planner');
                toast.success(`Template "${template.title}" appliqué avec ${template.chapters.length} chapitres !`);
              }
            }}
          />
        );
      
      case 'assistant':
        return (
          <EbookWritingAssistant
            ebookTitle={ebookTitle}
          />
        );
      
      case 'aichat':
        return (
          <EbookAiChat />
        );
      
      case 'backcover':
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
      
      case 'versions':
        return (
          <EbookVersionHistory
            projectId={currentProjectId || ''}
            onRestore={async (versionId) => {
              await restoreVersion(versionId);
            }}
            loadVersions={loadVersions}
            onSaveVersion={async () => {
              if (currentProjectId) {
                await saveVersion(currentProjectId, {
                  title: ebookTitle,
                  author_name: authorName,
                  chapters,
                  preface,
                  conclusion
                });
              }
            }}
          />
        );
      
      case 'statistics':
        return (
          <EbookStatisticsTools
            ebookTitle={ebookTitle}
            preface={preface}
            conclusion={conclusion}
            epilogue={epilogue}
            chapters={chapters}
            characters={characters}
            apiKey={apiKey}
            onTranslate={(translatedData) => {
              setPreface(translatedData.preface);
              setConclusion(translatedData.conclusion);
              setEpilogue(translatedData.epilogue);
              setChapters(translatedData.chapters);
              toast.success('Traduction appliquée !');
            }}
          />
        );
      
      case 'voice':
        return (
          <EbookVoiceDictation
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
            apiKey={apiKey}
          />
        );
      
      case 'audiobook':
        return (
          <EbookAudioGenerator
            ebookTitle={ebookTitle}
            authorName={authorName}
            preface={preface}
            conclusion={conclusion}
            epilogue={epilogue}
            chapters={chapters}
            apiKey={apiKey}
          />
        );
      
      case 'series':
        return (
          <EbookSeriesManager
            currentTomeNumber={tomeNumber || undefined}
            ebookTitle={ebookTitle}
            onApplyToCurrentBook={(data) => {
              setTomeNumber(data.tomeNumber);
              toast.success(`Tome ${data.tomeNumber} configuré pour "${data.seriesTitle}"`);
            }}
          />
        );
      
      case 'market':
        return (
          <EbookKdpMarketAnalysis />
        );
      
      case 'kdp-analytics':
        return (
          <EbookKdpAnalytics />
        );
      
      case 'formation-pdf':
        return (
          <EbookFormationPDF />
        );
      
      case 'affiliation':
        // Rediriger vers la page affiliation
        navigate('/affiliation');
        return null;
      
      case 'admin':
        // Rediriger vers la page admin
        navigate('/admin');
        return null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-subtle">
      <ModernSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 bg-grid-white opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
          
          <div className="relative container mx-auto px-6 py-8">
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/ebook-ideas')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
            
            {/* Bouton Nouveau Projet - bien visible */}
            <Button
              onClick={resetPlan}
              className="absolute top-4 right-4 bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
            
            <div className="max-w-3xl mx-auto text-center pt-8 pb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                {ebookTitle || 'Studio de Création'}
              </h1>
              
              {isSaving && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Save className="w-3 h-3 mr-1 animate-pulse" />
                  Sauvegarde...
                </Badge>
              )}
              
              <p className="text-white/80 max-w-xl mx-auto mt-2">
                Créez des ebooks professionnels avec l'intelligence artificielle
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EbookPlannerPage;
