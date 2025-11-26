import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Plus, Wand2, RotateCcw, ArrowLeft, Merge, Sparkles, Eye, Search, Palette, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagazineSidebar } from '@/components/layout/MagazineSidebar';
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
import heroEbook from '@/assets/hero-ebook-robot.png';

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
  
  // Clé de stockage localStorage
  const STORAGE_KEY = 'ebook-planner-autosave';
  
  // Charger les données sauvegardées au montage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
    return null;
  };
  
  const savedData = loadSavedData();
  
  // Hook de base de données
  const { saveProject, loadLatestProject, isSaving } = useEbookDatabase();
  
  const [apiKey, setApiKey] = useState(savedData?.apiKey || '');
  
  // États principaux
  const [ebookTitle, setEbookTitle] = useState(location.state?.suggestedTitle || savedData?.ebookTitle || '');
  const [targetAudience, setTargetAudience] = useState(savedData?.targetAudience || 'Adultes');
  const [tomeNumber, setTomeNumber] = useState<number | null>(savedData?.tomeNumber || null);
  
  // États des paramètres avancés
  const [writingStyle, setWritingStyle] = useState(savedData?.writingStyle || 'narratif');
  const [chapterLength, setChapterLength] = useState(savedData?.chapterLength || 'moyen');
  const [detailLevel, setDetailLevel] = useState(savedData?.detailLevel || 'détaillé');
  const [tone, setTone] = useState(savedData?.tone || 'professionnel');
  const [narrativeFormat, setNarrativeFormat] = useState(savedData?.narrativeFormat || 'troisième personne');
  
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories, generateBackCover } = useSubscriptionGeneration(subscriberEmail, apiKey, ebookTitle, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat);
  const [authorName, setAuthorName] = useState(savedData?.authorName || '');
  const [preface, setPreface] = useState(savedData?.preface || '');
  const [conclusion, setConclusion] = useState(savedData?.conclusion || '');
  const [chapters, setChapters] = useState<Chapter[]>(savedData?.chapters || []);
  const [characters, setCharacters] = useState<EbookCharacter[]>(savedData?.characters || []);
  const [numberOfChapters, setNumberOfChapters] = useState(savedData?.numberOfChapters || 8);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');
  const [ebookImages, setEbookImages] = useState<Array<{url: string, title: string, chapterIndex?: number}>>(savedData?.ebookImages || []);
  
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

  // Charger le projet depuis la base de données au démarrage
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

  // Sauvegarde automatique dans la base de données ET localStorage
  useEffect(() => {
    const dataToSave = {
      apiKey,
      ebookTitle,
      authorName,
      targetAudience,
      tomeNumber,
      writingStyle,
      chapterLength,
      detailLevel,
      tone,
      narrativeFormat,
      preface,
      conclusion,
      chapters,
      numberOfChapters,
      ebookImages,
      characters,
      lastSaved: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage (backup)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde localStorage:', error);
    }

    // Sauvegarder dans la base de données (si titre existe)
    if (ebookTitle) {
      const projectData = {
        title: ebookTitle,
        author_name: authorName,
        target_audience: targetAudience,
        tome_number: tomeNumber,
        writing_style: writingStyle,
        chapter_length: chapterLength,
        detail_level: detailLevel,
        tone: tone,
        narrative_format: narrativeFormat,
        preface: preface,
        conclusion: conclusion,
        chapters: chapters,
        characters: characters,
        ebook_images: ebookImages,
        number_of_chapters: numberOfChapters,
        book_summary: bookSummary,
        cover_concepts: coverConcepts,
        seo_optimization: seoOptimization,
        kdp_description: kdpDescription,
        kdp_keywords: kdpKeywords,
        kdp_categories: kdpCategories,
      };

      // Debounce pour éviter trop de sauvegardes
      const timer = setTimeout(() => {
        saveProject(projectData);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [apiKey, ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, preface, conclusion, chapters, numberOfChapters, ebookImages, characters, bookSummary, coverConcepts, seoOptimization, kdpDescription, kdpKeywords, kdpCategories]);

  // Notifier l'utilisateur au premier chargement si des données ont été restaurées
  useEffect(() => {
    // Console log uniquement pour debug, pas de toast
    if (savedData?.lastSaved) {
      const lastSavedDate = new Date(savedData.lastSaved);
      console.log('✅ Plan restauré automatiquement:', lastSavedDate.toLocaleString('fr-FR'));
    }
  }, []);

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
        // Toast supprimé - action visible sans notification
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
    setTargetAudience('Adultes');
    setTomeNumber(null);
    setWritingStyle('narratif');
    setChapterLength('moyen');
    setDetailLevel('détaillé');
    setTone('professionnel');
    setNarrativeFormat('troisième personne');
    setCharacters([]);
    
    // Effacer également le localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
      toast.success('Plan réinitialisé et sauvegarde effacée !');
    } catch (error) {
      toast.success('Plan réinitialisé !');
    }
  };

  const handleImageSelect = (imageUrl: string, title: string) => {
    const newImage = { url: imageUrl, title };
    setEbookImages(prev => [...prev, newImage]);
    toast.success('Image ajoutée à votre ebook !');
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
    setActiveTab('planner'); // Retour à l'onglet planificateur
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <EbookProjectsList 
            onProjectLoad={handleProjectLoad}
            onCreateNew={() => setActiveTab('planner')}
            currentProject={{
              title: ebookTitle,
              hasContent: chapters.length > 0 || preface.length > 0 || conclusion.length > 0
            }}
          />
        );
      
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div>
                        <Label htmlFor="audience">Public cible</Label>
                        <Select value={targetAudience} onValueChange={setTargetAudience}>
                          <SelectTrigger id="audience">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Enfants (3-7 ans)">Enfants (3-7 ans)</SelectItem>
                            <SelectItem value="Jeunes lecteurs (8-12 ans)">Jeunes lecteurs (8-12 ans)</SelectItem>
                            <SelectItem value="Adolescents (13-17 ans)">Adolescents (13-17 ans)</SelectItem>
                            <SelectItem value="Adultes">Adultes</SelectItem>
                            <SelectItem value="Tout public">Tout public</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tome-number">Numéro de tome (optionnel)</Label>
                      <Select value={tomeNumber?.toString() || 'none'} onValueChange={(val) => setTomeNumber(val === 'none' ? null : parseInt(val))}>
                        <SelectTrigger id="tome-number">
                          <SelectValue placeholder="Ebook unique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ebook unique</SelectItem>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>Tome {num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="apikey">Clé API OpenAI</Label>
                        <Input
                          id="apikey"
                          type="password"
                          placeholder="sk-..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Nécessaire pour la génération automatique
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="chapters">Nombre de chapitres</Label>
                        <Input
                          id="chapters"
                          type="number"
                          min="3"
                          max="20"
                          value={numberOfChapters}
                          onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 8)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Pour la génération automatique (3-20)
                        </p>
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

                    {/* Bouton Formation Affiliation - Très visible */}
                    <div className="pt-6 border-t-2 border-dashed border-primary/30">
                      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 p-4 rounded-lg border-2 border-amber-500/40">
                        <Button
                          onClick={() => navigate('/affiliation')}
                          size="lg"
                          className="w-full gap-2 text-lg font-bold shadow-lg hover:scale-105 transition-transform"
                          style={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%)',
                            color: 'white'
                          }}
                        >
                          <Users className="h-5 w-5" />
                          💰 Formation Affiliation - Gagnez 30% par Vente !
                        </Button>
                        <p className="text-xs text-center mt-2 text-muted-foreground font-medium">
                          14€ - 29€ de commission par vente • Cookie 30 jours
                        </p>
                      </div>
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
            authorName={authorName}
            chapters={chapters}
            apiKey={apiKey}
            targetAudience={targetAudience}
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
              
              {/* Indicateur de sauvegarde discret */}
              {isSaving && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-white/90 text-xs font-medium">Sauvegarde en cours...</span>
                </div>
              )}
              {!isSaving && ebookTitle && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-white/90 text-xs font-medium">Sauvegardé</span>
                </div>
              )}
              
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
