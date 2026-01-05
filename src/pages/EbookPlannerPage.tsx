import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Plus, Wand2, RotateCcw, ArrowLeft, Merge, Sparkles, Eye, Search, Palette, Users,
  Save, Zap, Target, FileText, Crown, Trash2, ImageIcon, Loader2, X, ChevronRight, Rocket, CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
import { EbookDashboard } from '@/components/ebook/EbookDashboard';

import { EbookStatisticsTools } from '@/components/ebook/EbookStatisticsTools';
import { EbookVoiceDictation } from '@/components/ebook/EbookVoiceDictation';
import { EbookSeriesManager } from '@/components/ebook/EbookSeriesManager';
import { EbookKdpMarketAnalysis } from '@/components/ebook/EbookKdpMarketAnalysis';
import { EbookAudioGenerator } from '@/components/ebook/EbookAudioGenerator';
import { EbookFormationPDF } from '@/components/ebook/EbookFormationPDF';
import EbookKdpAnalytics from '@/components/ebook/EbookKdpAnalytics';
import { EbookImageLibrary } from '@/components/ebook/EbookImageLibrary';
import { EbookAnalyticsDashboard } from '@/components/ebook/EbookAnalyticsDashboard';
import { EbookBookMockup3D } from '@/components/ebook/EbookBookMockup3D';
import EbookPriceEstimator from '@/components/ebook/EbookPriceEstimator';
import EbookEncyclopedia from '@/components/ebook/EbookEncyclopedia';
import EbookAtlas from '@/components/ebook/EbookAtlas';
import { EbookEditorAudit } from '@/components/ebook/EbookEditorAudit';
import { EbookEditorialDirector } from '@/components/ebook/EbookEditorialDirector';
import { EbookMarketAnalysis } from '@/components/ebook/EbookMarketAnalysis';
import { EbookContentArchitect } from '@/components/ebook/EbookContentArchitect';
import EbookExpertWriting from '@/components/ebook/EbookExpertWriting';
import EbookNaturalRewrite from '@/components/ebook/EbookNaturalRewrite';
import EbookEditorialPackaging from '@/components/ebook/EbookEditorialPackaging';
import { EbookEditorialQuality } from '@/components/ebook/EbookEditorialQuality';
import { EbookFinalDiagnosis } from '@/components/ebook/EbookFinalDiagnosis';
import EbookEditorialMemory from '@/components/ebook/EbookEditorialMemory';
import EbookChapterCoherence from '@/components/ebook/EbookChapterCoherence';
import EbookSelfCritique from '@/components/ebook/EbookSelfCritique';
import EbookIterativeLoop from '@/components/ebook/EbookIterativeLoop';
import EbookStyleSignature from '@/components/ebook/EbookStyleSignature';
import EbookUltimateVerdict from '@/components/ebook/EbookUltimateVerdict';
import { EbookInteractiveTutorial } from '@/components/ebook/EbookInteractiveTutorial';
import { useConfetti } from '@/hooks/useConfetti';

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
  const { fireStars } = useConfetti();
  
  const [apiKey, setApiKey] = useState(savedData?.apiKey || '');
  const [ebookTitle, setEbookTitle] = useState(location.state?.suggestedTitle || savedData?.ebookTitle || '');
  const [targetAudience, setTargetAudience] = useState(savedData?.targetAudience || 'Adultes');
  const [tomeNumber, setTomeNumber] = useState<number | null>(savedData?.tomeNumber || null);
  const [writingStyle, setWritingStyle] = useState(savedData?.writingStyle || 'narratif');
  const [chapterLength, setChapterLength] = useState(savedData?.chapterLength || 'moyen');
  const [detailLevel, setDetailLevel] = useState(savedData?.detailLevel || 'détaillé');
  const [tone, setTone] = useState(savedData?.tone || 'professionnel');
  const [narrativeFormat, setNarrativeFormat] = useState(savedData?.narrativeFormat || 'troisième personne');
  const [bookDescription, setBookDescription] = useState(savedData?.bookDescription || '');
  const [genre, setGenre] = useState(savedData?.genre || '');
  const [characters, setCharacters] = useState<EbookCharacter[]>(savedData?.characters || []);
  
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateBookSynopsis, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories, generateBackCover, generatePreface, generateConclusion, generateEpilogue, translateContent, analyzeTextStatistics } = useSubscriptionGeneration(subscriberEmail, apiKey, ebookTitle, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, bookDescription, genre, characters);
  
  const [authorName, setAuthorName] = useState(savedData?.authorName || '');
  const [preface, setPreface] = useState(savedData?.preface || '');
  const [conclusion, setConclusion] = useState(savedData?.conclusion || '');
  const [epilogue, setEpilogue] = useState(savedData?.epilogue || '');
  const [chapters, setChapters] = useState<Chapter[]>(savedData?.chapters || []);
  const [numberOfChapters, setNumberOfChapters] = useState(savedData?.numberOfChapters || 8);
  const [targetWordsPerChapter, setTargetWordsPerChapter] = useState(savedData?.targetWordsPerChapter || 2500);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [importText, setImportText] = useState('');
  const [ebookImages, setEbookImages] = useState<Array<{url: string, title: string, chapterId?: string}>>(savedData?.ebookImages || []);
  const [generatingImageForCharacter, setGeneratingImageForCharacter] = useState<string | null>(null);
  
  const [bookSummary, setBookSummary] = useState('');
  const [coverConcepts, setCoverConcepts] = useState('');
  const [seoOptimization, setSeoOptimization] = useState('');
  const [kdpDescription, setKdpDescription] = useState('');
  const [kdpKeywords, setKdpKeywords] = useState('');
  const [kdpCategories, setKdpCategories] = useState('');
  
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(location.state?.fromFormation || false);
  const [showTutorial, setShowTutorial] = useState(location.state?.fromFormation || false);

  // Ref pour toujours avoir les dernières données (évite les problèmes de closure)
  const currentDataRef = useRef({
    ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength,
    detailLevel, tone, narrativeFormat, preface, conclusion, chapters, characters,
    ebookImages, numberOfChapters, bookSummary, coverConcepts, seoOptimization, bookDescription, genre,
    kdpDescription, kdpKeywords, kdpCategories
  });

  // Mettre à jour la ref quand les données changent
  useEffect(() => {
    currentDataRef.current = {
      ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength,
      detailLevel, tone, narrativeFormat, preface, conclusion, chapters, characters,
      ebookImages, numberOfChapters, bookSummary, coverConcepts, seoOptimization, bookDescription, genre,
      kdpDescription, kdpKeywords, kdpCategories
    };
  }, [ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength,
      detailLevel, tone, narrativeFormat, preface, conclusion, chapters, characters,
      ebookImages, numberOfChapters, bookSummary, coverConcepts, seoOptimization, bookDescription, genre,
      kdpDescription, kdpKeywords, kdpCategories]);

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

  // Fonction pour nettoyer les images base64 volumineuses du contenu avant localStorage
  // Garde les URLs cloud [IMAGE_URL:https://...] mais supprime les base64
  const stripBase64ImagesFromContent = (text: string): string => {
    if (!text) return '';
    // Supprime seulement les images base64, garde les URLs
    return text.replace(/\[IMAGE:\d+:data:image\/[^;]+;base64,[^\]]+\]/g, '[IMAGE_REMOVED]');
  };

  const stripBase64ImagesFromChapters = (chaps: Chapter[]): Chapter[] => {
    return chaps.map(ch => ({
      ...ch,
      content: stripBase64ImagesFromContent(ch.content || ''),
      subChapters: ch.subChapters.map(sub => ({
        ...sub,
        content: stripBase64ImagesFromContent(sub.content || '')
      }))
    }));
  };

  useEffect(() => {
    // Sauvegarder dans localStorage SANS les images base64 volumineuses
    const dataToSave = {
      apiKey, ebookTitle, authorName, targetAudience, tomeNumber, writingStyle,
      chapterLength, detailLevel, tone, narrativeFormat, bookDescription, genre,
      preface: stripBase64ImagesFromContent(preface), 
      conclusion: stripBase64ImagesFromContent(conclusion), 
      epilogue: stripBase64ImagesFromContent(epilogue),
      chapters: stripBase64ImagesFromChapters(chapters), 
      numberOfChapters, targetWordsPerChapter, 
      ebookImages: [], // Ne pas sauvegarder les images dans localStorage
      characters, 
      lastSaved: new Date().toISOString()
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
  }, [apiKey, ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, bookDescription, genre, preface, conclusion, epilogue, chapters, numberOfChapters, ebookImages, characters, bookSummary, coverConcepts, seoOptimization, kdpDescription, kdpKeywords, kdpCategories]);

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

  // Générer une image de référence pour un personnage
  const generateCharacterImage = async (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character || !character.name || !character.description) {
      toast.error('Le personnage doit avoir un nom et une description');
      return;
    }

    setGeneratingImageForCharacter(characterId);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-reference', {
        body: {
          characterName: character.name,
          characterDescription: character.description,
          useOpenAI: !!apiKey,
          openaiApiKey: apiKey || undefined
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setCharacters(prev => prev.map(c => 
          c.id === characterId ? { ...c, referenceImageUrl: data.imageUrl } : c
        ));
        toast.success(`Image générée pour ${character.name}`);
      }
    } catch (error) {
      console.error('Erreur génération image:', error);
      toast.error('Erreur lors de la génération de l\'image');
    } finally {
      setGeneratingImageForCharacter(null);
    }
  };

  // État pour la génération complète
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, currentItem: '' });
  const [isGeneratingComplete, setIsGeneratingComplete] = useState(false);

  // Générer l'ebook complet en une seule action
  const generateCompleteEbook = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre');
      return;
    }
    if (!apiKey) {
      toast.error('Clé API OpenAI requise');
      return;
    }

    setIsGeneratingComplete(true);
    
    try {
      // Étape 1: Générer le plan si pas de chapitres
      let currentChapters = chapters;
      if (chapters.length === 0) {
        toast.info('Génération du plan en cours...');
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
          currentChapters = generatedChapters;
        } else {
          toast.error('Erreur lors de la génération du plan');
          setIsGeneratingComplete(false);
          return;
        }
      }

      // Calculer le total d'éléments à générer
      const totalSubChapters = currentChapters.reduce((acc, ch) => acc + ch.subChapters.length, 0);
      const totalItems = currentChapters.length + totalSubChapters + 4; // +4 pour synopsis, préface, conclusion et épilogue
      let currentProgress = 0;

      // NOUVELLE ÉTAPE: Générer la synopsis pour assurer la cohérence
      setGenerationProgress({ current: 0, total: totalItems, currentItem: '📋 Synopsis (fil conducteur)' });
      toast.info('Génération de la synopsis pour la cohérence...');
      const synopsis = await generateBookSynopsis(ebookTitle, currentChapters, targetAudience);
      if (!synopsis) {
        toast.warning('Synopsis non générée, génération sans fil conducteur');
      } else {
        console.log('Synopsis générée:', synopsis.substring(0, 200) + '...');
      }
      currentProgress++;

      setGenerationProgress({ current: currentProgress, total: totalItems, currentItem: 'Préface' });

      // Étape 2: Générer la préface si vide (avec synopsis)
      if (!preface) {
        setGenerationProgress({ current: currentProgress, total: totalItems, currentItem: '📖 Préface' });
        const prefaceResult = await generatePreface(ebookTitle, currentChapters, targetAudience, synopsis || undefined);
        if (prefaceResult) setPreface(prefaceResult);
        currentProgress++;
      } else {
        currentProgress++;
      }

      // Étape 3: Générer le contenu de chaque chapitre et sous-chapitre (avec synopsis et contexte)
      let previousChapterSummary = '';
      
      for (let i = 0; i < currentChapters.length; i++) {
        const chapter = currentChapters[i];
        
        // Générer le contenu du chapitre principal si vide (avec synopsis et contexte)
        if (!chapter.content) {
          setGenerationProgress({ 
            current: currentProgress, 
            total: totalItems, 
            currentItem: `📝 Chapitre ${i + 1}/${currentChapters.length}: ${chapter.title}` 
          });
          const chapterContent = await generateChapterContent(
            chapter, 
            targetWordsPerChapter, 
            synopsis || undefined, 
            i, 
            currentChapters.length, 
            previousChapterSummary || undefined
          );
          if (chapterContent) {
            updateChapterContent(chapter.id, chapterContent);
            currentChapters[i] = { ...chapter, content: chapterContent };
            // Créer un résumé du chapitre pour le suivant
            previousChapterSummary = chapterContent.substring(0, 500) + '...';
          }
        } else {
          previousChapterSummary = chapter.content.substring(0, 500) + '...';
        }
        currentProgress++;

        // Générer le contenu de chaque sous-chapitre si vide (avec synopsis)
        for (let j = 0; j < chapter.subChapters.length; j++) {
          const subChapter = chapter.subChapters[j];
          if (!subChapter.content) {
            setGenerationProgress({ 
              current: currentProgress, 
              total: totalItems, 
              currentItem: `📄 Sous-chapitre: ${subChapter.title}` 
            });
            const subContent = await generateSubChapterContent(
              subChapter, 
              Math.round(targetWordsPerChapter * 0.6),
              synopsis || undefined,
              chapter.title
            );
            if (subContent) {
              setChapters(prev => prev.map(ch => {
                if (ch.id === chapter.id) {
                  return {
                    ...ch,
                    subChapters: ch.subChapters.map(sub => 
                      sub.id === subChapter.id ? { ...sub, content: subContent } : sub
                    )
                  };
                }
                return ch;
              }));
            }
          }
          currentProgress++;
        }
      }

      // Étape 4: Générer la conclusion si vide (avec synopsis)
      if (!conclusion) {
        setGenerationProgress({ current: currentProgress, total: totalItems, currentItem: '🎯 Conclusion' });
        const conclusionResult = await generateConclusion(ebookTitle, currentChapters, targetAudience, synopsis || undefined);
        if (conclusionResult) setConclusion(conclusionResult);
      }
      currentProgress++;

      // Étape 5: Générer l'épilogue si vide (avec synopsis)
      if (!epilogue) {
        setGenerationProgress({ current: currentProgress, total: totalItems, currentItem: '✨ Épilogue' });
        const epilogueResult = await generateEpilogue(ebookTitle, currentChapters, targetAudience, synopsis || undefined);
        if (epilogueResult) setEpilogue(epilogueResult);
      }

      setGenerationProgress({ current: totalItems, total: totalItems, currentItem: '✅ Terminé !' });
      toast.success('🎉 Ebook complet généré avec cohérence !');
      fireStars();
      
    } catch (error) {
      console.error('Erreur génération complète:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGeneratingComplete(false);
      setGenerationProgress({ current: 0, total: 0, currentItem: '' });
    }
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

  // Fonction pour insérer une image dans le contenu d'un chapitre
  const handleInsertImageToChapter = (chapterId: string, imageUrl: string) => {
    console.log('🖼️ Insertion image - chapterId:', chapterId, 'chapters:', chapters.map(c => ({ id: c.id, title: c.title })));
    
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) {
      // Essayer avec l'index si l'ID ne correspond pas
      const chapterIndex = parseInt(chapterId);
      const fallbackChapter = !isNaN(chapterIndex) && chapters[chapterIndex];
      if (fallbackChapter) {
        const imageTag = `\n\n[IMAGE_URL:${imageUrl}]\n\n`;
        const newContent = (fallbackChapter.content || '') + imageTag;
        updateChapterContent(fallbackChapter.id, newContent);
        toast.success(`Image insérée dans "${fallbackChapter.title}"`);
        console.log('✅ Image insérée (via index) dans:', fallbackChapter.title);
        return;
      }
      toast.error('Chapitre non trouvé - ID: ' + chapterId);
      return;
    }
    
    const imageTag = `\n\n[IMAGE_URL:${imageUrl}]\n\n`;
    const newContent = (chapter.content || '') + imageTag;
    updateChapterContent(chapterId, newContent);
    toast.success(`Image insérée dans "${chapter.title}"`);
    console.log('✅ Image insérée dans:', chapter.title, 'Nouveau contenu (fin):', newContent.slice(-100));
  };

  // Fonction de sauvegarde manuelle
  const handleManualSave = async () => {
    if (!ebookTitle) {
      toast.error('Veuillez entrer un titre pour sauvegarder');
      return;
    }
    
    const projectData = {
      title: ebookTitle, author_name: authorName, target_audience: targetAudience,
      tome_number: tomeNumber, writing_style: writingStyle, chapter_length: chapterLength,
      detail_level: detailLevel, tone, narrative_format: narrativeFormat,
      preface, conclusion, chapters, characters, ebook_images: ebookImages,
      number_of_chapters: numberOfChapters, book_summary: bookSummary,
      cover_concepts: coverConcepts, seo_optimization: seoOptimization,
      kdp_description: kdpDescription, kdp_keywords: kdpKeywords, kdp_categories: kdpCategories,
    };
    
    await saveProject(projectData);
    toast.success('Projet sauvegardé !');
  };

  // Fonction de changement d'onglet avec sauvegarde (utilise la ref pour avoir les dernières données)
  const handleTabChange = async (newTab: string) => {
    // Sauvegarder avant de changer d'onglet si on a un titre
    const data = currentDataRef.current;
    if (data.ebookTitle) {
      console.log('💾 Sauvegarde avant changement onglet - chapters:', data.chapters.map(c => ({ id: c.id, title: c.title, hasContent: !!c.content, contentPreview: c.content?.slice(-50) })));
      const projectData = {
        title: data.ebookTitle, author_name: data.authorName, target_audience: data.targetAudience,
        tome_number: data.tomeNumber, writing_style: data.writingStyle, chapter_length: data.chapterLength,
        detail_level: data.detailLevel, tone: data.tone, narrative_format: data.narrativeFormat,
        preface: data.preface, conclusion: data.conclusion, chapters: data.chapters, 
        characters: data.characters, ebook_images: data.ebookImages,
        number_of_chapters: data.numberOfChapters, book_summary: data.bookSummary,
        cover_concepts: data.coverConcepts, seo_optimization: data.seoOptimization,
        kdp_description: data.kdpDescription, kdp_keywords: data.kdpKeywords, kdp_categories: data.kdpCategories,
      };
      await saveProject(projectData);
    }
    setActiveTab(newTab);
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
    
    // Rediriger vers l'onglet planificateur
    setActiveTab('planner');
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
    
    toast.success('🎉 Nouveau projet créé !', {
      description: 'Vous pouvez maintenant commencer votre nouvel ebook.',
      duration: 4000,
    });
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
      
      case 'dashboard':
        return (
          <EbookDashboard
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={chapters}
            preface={preface}
            conclusion={conclusion}
            targetWordsPerChapter={targetWordsPerChapter}
            kdpDescription={kdpDescription}
            kdpKeywords={kdpKeywords}
          />
        );
      
      case 'planner':
        return (
          <div className="relative animate-fade-in">
            {/* Indicateur de bienvenue pour les utilisateurs venant de la formation */}
            {showWelcome && (
              <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 shadow-2xl animate-scale-in">
                <div className="absolute inset-0 bg-grid-white opacity-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">
                        🎉 Bravo ! Vous êtes prêt à créer votre livre
                      </h2>
                    </div>
                    <p className="text-white/90">
                      Vous ne rédigez aucune ligne. <span className="font-semibold">Vous guidez l'intention, l'éditeur numérique fait le reste.</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">1</div>
                        <div className="text-white">
                          <p className="font-semibold text-sm">Choisir</p>
                          <p className="text-xs text-white/80">Remplissez le titre et la description</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/60" />
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">2</div>
                        <div className="text-white">
                          <p className="font-semibold text-sm">Générer</p>
                          <p className="text-xs text-white/80">Cliquez sur "Générer avec l'IA"</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/60" />
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">3</div>
                        <div className="text-white">
                          <p className="font-semibold text-sm">Valider</p>
                          <p className="text-xs text-white/80">Consultez le verdict final</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Background décoratif */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              {/* Header Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-grid-white opacity-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">
                          {ebookTitle || "Votre prochain best-seller"}
                        </h1>
                        <p className="text-white/80 text-sm mt-1">
                          {authorName ? `Par ${authorName}` : "Commencez à créer votre ebook"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      type="button"
                      onClick={generateAutomaticPlan} 
                      disabled={!ebookTitle || isGenerating}
                      className="bg-white text-violet-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      data-tutorial="generate-button"
                    >
                      <Wand2 className="h-5 w-5 mr-2" />
                      {isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={resetPlan}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Nouveau
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        setShowWelcome(true);
                        setShowTutorial(true);
                      }}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Aide
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Design Premium */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Chapitres', value: chapters.length, icon: BookOpen, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
                  { label: 'Personnages', value: characters.length, icon: Users, gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
                  { label: 'Images', value: ebookImages.length, icon: Palette, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
                  { label: 'Mots', value: chapters.reduce((acc, c) => acc + (c.content?.split(' ').length || 0) + c.subChapters.reduce((subAcc, sc) => subAcc + (sc.content?.split(' ').length || 0), 0), 0), icon: FileText, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.shadow} animate-fade-in`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" 
                         style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne principale (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* General Info Card */}
                  <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Informations générales</CardTitle>
                          <CardDescription>Définissez les bases de votre ebook</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Titre de l'ebook</Label>
                          <Input
                            placeholder="Mon Ebook Extraordinaire"
                            value={ebookTitle}
                            onChange={(e) => setEbookTitle(e.target.value)}
                            className="h-12 text-lg border-2 focus:border-violet-500 transition-colors"
                            data-tutorial="title-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Nom de l'auteur</Label>
                          <Input
                            placeholder="Votre nom"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="h-12 text-lg border-2 focus:border-violet-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Description du livre - NOUVEAU */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          📋 Description / Sujet du livre (important pour la cohérence)
                        </Label>
                        <Textarea
                          placeholder="Décrivez en quelques phrases le sujet de votre livre, l'histoire que vous voulez raconter, les thèmes principaux, les personnages clés... Plus vous donnez de détails, plus l'IA sera cohérente."
                          value={bookDescription}
                          onChange={(e) => setBookDescription(e.target.value)}
                          rows={4}
                          className="resize-y min-h-[100px] border-2 focus:border-amber-500 transition-colors"
                        />
                        <p className="text-xs text-muted-foreground">
                          💡 Astuce: Indiquez le genre, le contexte, les personnages principaux et l'intrigue souhaitée pour des résultats plus cohérents.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2" data-tutorial="genre-select">
                          <Label className="text-sm font-medium">Genre / Catégorie</Label>
                          <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger className="h-12 border-2 focus:border-violet-500">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="roman">📖 Roman</SelectItem>
                              <SelectItem value="thriller">🔪 Thriller/Policier</SelectItem>
                              <SelectItem value="romance">💕 Romance</SelectItem>
                              <SelectItem value="fantasy">🧙 Fantasy</SelectItem>
                              <SelectItem value="science-fiction">🚀 Science-Fiction</SelectItem>
                              <SelectItem value="horreur">👻 Horreur</SelectItem>
                              <SelectItem value="developpement-personnel">🧠 Développement personnel</SelectItem>
                              <SelectItem value="business">💼 Business/Entrepreneuriat</SelectItem>
                              <SelectItem value="guide-pratique">📚 Guide pratique</SelectItem>
                              <SelectItem value="cuisine">🍳 Cuisine</SelectItem>
                              <SelectItem value="voyage">✈️ Voyage</SelectItem>
                              <SelectItem value="biographie">📝 Biographie</SelectItem>
                              <SelectItem value="enfant">🧒 Livre pour enfants</SelectItem>
                              <SelectItem value="education">🎓 Éducation</SelectItem>
                              <SelectItem value="sante">❤️ Santé/Bien-être</SelectItem>
                              <SelectItem value="spiritualite">🙏 Spiritualité</SelectItem>
                              <SelectItem value="autre">📋 Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Public cible</Label>
                          <Select value={targetAudience} onValueChange={setTargetAudience}>
                            <SelectTrigger className="h-12 border-2 focus:border-violet-500">
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
                          <Label className="text-sm font-medium">Nombre de chapitres</Label>
                          <Input
                            type="number"
                            min="3"
                            max="100"
                            value={numberOfChapters}
                            onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 8)}
                            className="h-12 border-2 focus:border-violet-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Clé API OpenAI</Label>
                          <Input
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="h-12 border-2 focus:border-violet-500"
                          />
                        </div>
                      </div>

                      {/* Section Personnages Principaux */}
                      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-fuchsia-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-purple-800">Personnages principaux</h3>
                              <p className="text-sm text-purple-600">Définissez vos personnages pour une histoire cohérente</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {characters.map((character, index) => (
                              <div key={character.id} className="p-4 bg-white/70 rounded-xl border border-purple-200 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-purple-700">Personnage {index + 1}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCharacters(prev => prev.filter(c => c.id !== character.id))}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Nom du personnage"
                                    value={character.name}
                                    onChange={(e) => {
                                      setCharacters(prev => prev.map(c => 
                                        c.id === character.id ? { ...c, name: e.target.value } : c
                                      ));
                                    }}
                                    className="border-purple-200 focus:border-purple-400"
                                  />
                                  <Select 
                                    value={character.role || ''} 
                                    onValueChange={(value) => {
                                      setCharacters(prev => prev.map(c => 
                                        c.id === character.id ? { ...c, role: value } : c
                                      ));
                                    }}
                                  >
                                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                                      <SelectValue placeholder="Rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="protagonist">🦸 Protagoniste</SelectItem>
                                      <SelectItem value="antagonist">😈 Antagoniste</SelectItem>
                                      <SelectItem value="sidekick">🤝 Acolyte</SelectItem>
                                      <SelectItem value="mentor">🧙 Mentor</SelectItem>
                                      <SelectItem value="love-interest">💕 Intérêt amoureux</SelectItem>
                                      <SelectItem value="secondary">👤 Secondaire</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Textarea
                                  placeholder="Description détaillée : apparence physique, personnalité, motivations, histoire personnelle, particularités..."
                                  value={character.description}
                                  onChange={(e) => {
                                    setCharacters(prev => prev.map(c => 
                                      c.id === character.id ? { ...c, description: e.target.value } : c
                                    ));
                                  }}
                                  className="min-h-[100px] border-purple-200 focus:border-purple-400"
                                />
                                
                                {/* Image de référence */}
                                <div className="flex items-start gap-3 pt-2 border-t border-purple-100">
                                  {character.referenceImageUrl ? (
                                    <div className="relative group">
                                      <img 
                                        src={character.referenceImageUrl} 
                                        alt={`Portrait de ${character.name}`}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-purple-300 shadow-md"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                          setCharacters(prev => prev.map(c => 
                                            c.id === character.id ? { ...c, referenceImageUrl: undefined } : c
                                          ));
                                        }}
                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-purple-200 flex items-center justify-center bg-purple-50">
                                      <ImageIcon className="h-8 w-8 text-purple-300" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="text-xs text-purple-600 mb-2">Image de référence IA</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateCharacterImage(character.id)}
                                      disabled={generatingImageForCharacter === character.id || !character.name || !character.description}
                                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                                    >
                                      {generatingImageForCharacter === character.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Génération...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="h-4 w-4 mr-2" />
                                          {character.referenceImageUrl ? 'Régénérer' : 'Générer portrait'}
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCharacters(prev => [...prev, {
                                  id: Date.now().toString(),
                                  name: '',
                                  description: '',
                                  role: ''
                                }]);
                              }}
                              className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter un personnage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Bouton Générer l'ebook complet */}
                      <Card className="border-2 border-dashed border-green-400 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                  <Zap className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-green-800">Générer l'ebook complet</h3>
                                  <p className="text-sm text-green-600">
                                    Génère automatiquement le plan, tous les chapitres, sous-chapitres, préface et conclusion
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={generateCompleteEbook}
                                disabled={isGeneratingComplete || isGenerating || !ebookTitle || !apiKey}
                                size="lg"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 min-w-[200px]"
                              >
                                {isGeneratingComplete ? (
                                  <>
                                    <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                                    Génération...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="h-5 w-5 mr-2" />
                                    Générer tout l'ebook
                                  </>
                                )}
                              </Button>
                            </div>
                            
                            {/* Options de génération */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-green-200">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-700">Mots par chapitre</Label>
                                <Select value={targetWordsPerChapter.toString()} onValueChange={(v) => setTargetWordsPerChapter(parseInt(v))}>
                                  <SelectTrigger className="h-10 border-green-200 focus:border-green-500">
                                    <SelectValue placeholder="Mots par chapitre" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="250">250 mots (court)</SelectItem>
                                    <SelectItem value="350">350 mots (standard)</SelectItem>
                                    <SelectItem value="500">500 mots (moyen)</SelectItem>
                                    <SelectItem value="750">750 mots (long)</SelectItem>
                                    <SelectItem value="1000">1000 mots (très long)</SelectItem>
                                    <SelectItem value="1500">1500 mots (détaillé)</SelectItem>
                                    <SelectItem value="2000">2000 mots (complet)</SelectItem>
                                    <SelectItem value="2500">2500 mots (exhaustif)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-end">
                                <p className="text-xs text-green-600 italic">
                                  📖 Estimation: ~{Math.round(targetWordsPerChapter * numberOfChapters / 250)} pages pour {numberOfChapters} chapitres
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Barre de progression */}
                          {isGeneratingComplete && generationProgress.total > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-700 font-medium">{generationProgress.currentItem}</span>
                                <span className="text-green-600">
                                  {generationProgress.current}/{generationProgress.total}
                                </span>
                              </div>
                              <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                                  style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                            Préface / Introduction
                          </Label>
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
                            className="text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50"
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
                          className="resize-y min-h-[120px] border-2 focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
                            Conclusion / Mot de la fin
                          </Label>
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
                            className="text-xs text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-50"
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
                          className="resize-y min-h-[120px] border-2 focus:border-fuchsia-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Épilogue (optionnel)
                          </Label>
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
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
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
                          className="resize-y min-h-[80px] border-2 focus:border-rose-500 transition-colors"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chapters Card */}
                  <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">Structure des chapitres</CardTitle>
                            <CardDescription>Organisez et rédigez vos chapitres ({chapters.length} chapitres)</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={generateTableOfContents} variant="outline" size="sm" disabled={chapters.length === 0} className="border-cyan-200 hover:bg-cyan-50">
                            <FileText className="h-4 w-4 mr-1" />
                            Sommaire
                          </Button>
                          {selectedChapters.length > 1 && (
                            <Button onClick={mergeSelectedChapters} variant="outline" size="sm" className="border-cyan-200 hover:bg-cyan-50">
                              <Merge className="h-4 w-4 mr-1" />
                              Fusionner ({selectedChapters.length})
                            </Button>
                          )}
                          <Button onClick={addChapter} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {chapters.length === 0 ? (
                        <div className="text-center py-16 px-8">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center animate-float">
                            <BookOpen className="w-10 h-10 text-cyan-500" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Aucun chapitre</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Commencez par générer un plan automatique avec l'IA ou ajoutez des chapitres manuellement
                          </p>
                          <div className="flex justify-center gap-3">
                            <Button onClick={addChapter} variant="outline" className="border-cyan-200 hover:bg-cyan-50">
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter manuellement
                            </Button>
                            <Button 
                              onClick={generateAutomaticPlan} 
                              disabled={!ebookTitle || isGenerating}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
                            >
                              <Wand2 className="h-4 w-4 mr-2" />
                              Générer avec l'IA
                            </Button>
                          </div>
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

                  {/* Templates */}
                  <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Templates Premium</CardTitle>
                          <CardDescription>Appliquez un modèle pré-défini pour démarrer rapidement</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <EbookTemplates onApplyTemplate={applyTemplate} />
                    </CardContent>
                  </Card>

                  {/* Save Status */}
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">Sauvegarde en cours...</span>
                      </>
                    ) : ebookTitle ? (
                      <>
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        <span className="text-sm text-muted-foreground">Sauvegardé automatiquement</span>
                        <Save className="w-4 h-4 text-emerald-500 ml-auto" />
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                        <span className="text-sm text-muted-foreground">En attente d'un titre pour sauvegarder</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Aperçu (1/3) */}
                <div className="space-y-6">
                  <div className="sticky top-6">
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
              </div>
            </div>
          </div>
        );
      
      case 'writing':
        return (
          <EbookWriting
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
            targetWordsPerChapter={targetWordsPerChapter}
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
            bookSummary={bookSummary}
          />
        );
      
      case 'images':
        return (
          <EbookChapterImageGenerator
            ebookTitle={ebookTitle}
            chapters={chapters}
            characters={characters}
            ebookImages={ebookImages.map(img => ({
              chapterId: img.chapterId || '',
              chapterTitle: img.title,
              imageUrl: img.url,
              style: ''
            }))}
            onImagesUpdate={(images) => {
              setEbookImages(images.map(img => ({
                url: img.imageUrl,
                title: img.chapterTitle,
                chapterId: img.chapterId
              })));
            }}
            onInsertImageToChapter={handleInsertImageToChapter}
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
            characters={characters}
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
      
      case 'library':
        return (
          <EbookImageLibrary
            ebookId={currentProjectId || undefined}
            ebookTitle={ebookTitle}
            onImageSelect={(url) => setEbookImages([...ebookImages, { url, title: 'Image sélectionnée' }])}
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
      
      case 'price-estimator':
        return (
          <EbookPriceEstimator />
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
      
      case 'encyclopedia':
        return (
          <EbookEncyclopedia
            onInsertContent={(content) => {
              // Ajouter le contenu à la préface ou au premier chapitre disponible
              if (chapters.length > 0) {
                const updatedChapters = [...chapters];
                updatedChapters[0].content = (updatedChapters[0].content || '') + '\n\n' + content;
                setChapters(updatedChapters);
                toast.success('Contenu ajouté au premier chapitre');
              } else {
                setPreface((prev) => prev + '\n\n' + content);
                toast.success('Contenu ajouté à la préface');
              }
            }}
          />
        );
      
      case 'atlas':
        return (
          <EbookAtlas
            onInsertContent={(content) => {
              if (chapters.length > 0) {
                const updatedChapters = [...chapters];
                updatedChapters[0].content = (updatedChapters[0].content || '') + '\n\n' + content;
                setChapters(updatedChapters);
                toast.success('Contenu ajouté au premier chapitre');
              } else {
                setPreface((prev) => prev + '\n\n' + content);
                toast.success('Contenu ajouté à la préface');
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
      
      case 'characters':
        return (
          <EbookCharacters
            characters={characters}
            onUpdateCharacters={setCharacters}
            ebookTitle={ebookTitle}
            chapters={chapters}
          />
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
            onImportTome={(data) => {
              setEbookTitle(data.title);
              setAuthorName(data.authorName);
              setTomeNumber(data.tomeNumber);
              setPreface(data.preface);
              setConclusion(data.conclusion);
              setChapters(data.chapters);
              setTargetWordsPerChapter(data.targetWordsPerChapter);
              setActiveTab('planner');
              toast.success(`"${data.title}" importé avec ${data.chapters.length} chapitres ! (~${data.targetWordsPerChapter.toLocaleString()} mots/chapitre)`);
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
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <EbookAnalyticsDashboard
              chapters={chapters}
              targetWordsPerChapter={targetWordsPerChapter}
              ebookTitle={ebookTitle}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <EbookBookMockup3D
                title={ebookTitle}
                author={authorName}
              />
            </div>
          </div>
        );
      
      case 'editor-audit':
        return (
          <EbookEditorAudit />
        );
      
      case 'editorial-director':
        return (
          <EbookEditorialDirector />
        );
      
      case 'market-analysis':
        return (
          <EbookMarketAnalysis />
        );
      
      case 'content-architect':
        return (
          <EbookContentArchitect 
            onApplyStructure={(structure) => {
              const newChapters = structure.map((ch, index) => ({
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
              setActiveTab('planner');
            }}
          />
        );
      
      case 'expert-writing':
        return (
          <EbookExpertWriting />
        );
      
      case 'natural-rewrite':
        return (
          <EbookNaturalRewrite />
        );
      
      case 'editorial-packaging':
        return (
          <EbookEditorialPackaging />
        );
      
      case 'editorial-quality':
        return (
          <EbookEditorialQuality />
        );
      
      case 'final-diagnosis':
        return (
          <EbookFinalDiagnosis />
        );
      
      case 'editorial-memory':
        return (
          <EbookEditorialMemory />
        );
      
      case 'chapter-coherence':
        return (
          <EbookChapterCoherence />
        );
      
      case 'self-critique':
        return (
          <EbookSelfCritique />
        );
      
      case 'iterative-loop':
        return (
          <EbookIterativeLoop />
        );
      
      case 'style-signature':
        return (
          <EbookStyleSignature />
        );
      
      case 'ultimate-verdict':
        return (
          <EbookUltimateVerdict />
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
        onTabChange={handleTabChange}
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
            
            {/* Boutons d'action - bien visibles */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                type="button"
                onClick={handleManualSave}
                disabled={isSaving || !ebookTitle}
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button
                type="button"
                onClick={resetPlan}
                className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau projet
              </Button>
            </div>
            
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

      {/* Tutoriel interactif */}
      <EbookInteractiveTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={() => {
          setShowTutorial(false);
          toast.success('🎉 Tutoriel terminé ! Vous êtes prêt à créer votre ebook.');
        }}
      />
    </div>
  );
};

export default EbookPlannerPage;
