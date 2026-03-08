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
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
import { EbookMockupStudio } from '@/components/ebook/EbookMockupStudio';
import { CalibreStudioEpub } from '@/components/ebook/CalibreStudioEpub';
import { PriceEbookStudio } from '@/components/ebook/PriceEbookStudio';
import { EbookCharacters, type Character } from '@/components/ebook/EbookCharacters';
import { EbookProjectsList } from '@/components/ebook/EbookProjectsList';
import { EbookAiChat } from '@/components/ebook/EbookAiChat';
import { EbookDashboard } from '@/components/ebook/EbookDashboard';

import { EbookStatisticsTools } from '@/components/ebook/EbookStatisticsTools';
import { EbookVoiceDictation } from '@/components/ebook/EbookVoiceDictation';
import { EbookSeriesManager } from '@/components/ebook/EbookSeriesManager';
import { EbookKdpMarketAnalysis } from '@/components/ebook/EbookKdpMarketAnalysis';
import { EbookKdpResearch } from '@/components/ebook/EbookKdpResearch';
import EbookKdpExplosiveSimulator from '@/components/ebook/EbookKdpExplosiveSimulator';
import { EbookAudioGenerator } from '@/components/ebook/EbookAudioGenerator';
import FormationAudiobookDistribution from '@/components/ebook/FormationAudiobookDistribution';
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
import EbookCompleteWorkflow from '@/components/ebook/EbookCompleteWorkflow';
import { EbookInteractiveTutorial } from '@/components/ebook/EbookInteractiveTutorial';
import { WorkflowStepWrapper } from '@/components/ebook/WorkflowStepWrapper';
import { WorkflowOnboarding } from '@/components/ebook/WorkflowOnboarding';
import { WorkflowDashboard } from '@/components/ebook/WorkflowDashboard';
import { WorkflowExportCompiled } from '@/components/ebook/WorkflowExportCompiled';
import { useConfetti } from '@/hooks/useConfetti';
import { useDemoMode } from '@/hooks/useDemoMode';
import { DemoBanner } from '@/components/ebook/DemoBanner';
import { DemoPaywall } from '@/components/ebook/DemoPaywall';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { WorkflowResultViewer } from '@/components/ebook/WorkflowResultViewer';
import { cleanGeneratedText, cleanChapters, countAllStuckWords } from '@/utils/textCleaner';
import EbookUrlImport from '@/components/ebook/EbookUrlImport';
import EbookPlagiarismValidator from '@/components/ebook/EbookPlagiarismValidator';
import EbookAmazonSimulator from '@/components/ebook/EbookAmazonSimulator';
import EbookSeoArticleGenerator from '@/components/ebook/EbookSeoArticleGenerator';
import EbookDocumentTransformer from '@/components/ebook/EbookDocumentTransformer';
import EbookAmazonAdsSimulator from '@/components/ebook/EbookAmazonAdsSimulator';
import EbookLaunchPlan from '@/components/ebook/EbookLaunchPlan';
import EbookColoringBookGenerator from '@/components/ebook/EbookColoringBookGenerator';
import EbookComicBookGenerator from '@/components/ebook/EbookComicBookGenerator';
import EbookDiaryGenerator from '@/components/ebook/EbookDiaryGenerator';
import EbookDocumentaryGenerator from '@/components/ebook/EbookDocumentaryGenerator';
import EbookRecipeBookGenerator from '@/components/ebook/EbookRecipeBookGenerator';
import EbookTravelGuideGenerator from '@/components/ebook/EbookTravelGuideGenerator';
import EbookAquariumGenerator from '@/components/ebook/EbookAquariumGenerator';
import EbookBirdSheetGenerator from '@/components/ebook/EbookBirdSheetGenerator';
import EbookNicheAnalysis from '@/components/ebook/EbookNicheAnalysis';
import EbookDescriptionMagnet from '@/components/ebook/EbookDescriptionMagnet';
import EbookPenNameGenerator from '@/components/ebook/EbookPenNameGenerator';

// Composants 2026
import EbookVideoTrailer from '@/components/ebook/EbookVideoTrailer';
import EbookMultiTranslator from '@/components/ebook/EbookMultiTranslator';
import EbookTrendPredictor from '@/components/ebook/EbookTrendPredictor';
import EbookABTesting from '@/components/ebook/EbookABTesting';
import EbookPresentation from '@/components/ebook/EbookPresentation';
import EbookHumanizer from '@/components/ebook/EbookHumanizer';
import EbookArcManager from '@/components/ebook/EbookArcManager';
import EbookDirectSales from '@/components/ebook/EbookDirectSales';
import EbookBsrTracker from '@/components/ebook/EbookBsrTracker';
import EbookExportGuide from '@/components/ebook/EbookExportGuide';
import KdpGuideChecklist from '@/components/ebook/KdpGuideChecklist';
import PdfKdpReformatter from '@/components/ebook/PdfKdpReformatter';
import PdfKdpAnalyzer from '@/components/ebook/PdfKdpAnalyzer';
import EbookStrictProofreader from '@/components/ebook/EbookStrictProofreader';
import KdpCoverStudio from '@/components/ebook/KdpCoverStudio';
import SubscriberActivityPopup from '@/components/admin/SubscriberActivityPopup';
import { EbookLibrary } from '@/components/ebook/EbookLibrary';
import { AudioExpressWorkflow } from '@/components/ebook/AudioExpressWorkflow';
import { AudiobookLibrary } from '@/components/ebook/AudiobookLibrary';
import { EbookDraftMode } from '@/components/ebook/EbookDraftMode';
import { EbookPromptLibrary } from '@/components/ebook/EbookPromptLibrary';
import { EbookManuscriptDashboard } from '@/components/ebook/EbookManuscriptDashboard';
import { EbookRichEditor } from '@/components/ebook/EbookRichEditor';
import { EbookAIDetectorScore } from '@/components/ebook/EbookAIDetectorScore';
import { EbookAICoverStudio } from '@/components/ebook/EbookAICoverStudio';
import { EbookMultiTomeHub } from '@/components/ebook/EbookMultiTomeHub';
import { EbookAdvancedExport } from '@/components/ebook/EbookAdvancedExport';
import { EbookWritingIntelligence } from '@/components/ebook/EbookWritingIntelligence';
import { EbookPublicationPlanner } from '@/components/ebook/EbookPublicationPlanner';
import { EbookRoyaltyDashboard } from '@/components/ebook/EbookRoyaltyDashboard';
import { EbookUXEnhancements } from '@/components/ebook/EbookUXEnhancements';
import { EbookKdpPrePublishChecklist } from '@/components/ebook/EbookKdpPrePublishChecklist';
import { EbookPromptChainGenerator } from '@/components/ebook/EbookPromptChainGenerator';
import { EbookCompetitorDashboard } from '@/components/ebook/EbookCompetitorDashboard';
import { EbookBetaReaderHub } from '@/components/ebook/EbookBetaReaderHub';

import { useSubscriptionGeneration, Chapter, SubChapter } from '@/hooks/useSubscriptionGeneration';
import { ebookTemplates } from '@/data/ebookTemplates';
import { type Character as EbookCharacter } from '@/components/ebook/EbookCharacters';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface EbookPlannerPageProps {
  subscriberEmail?: string;
  subscriberData?: any;
  isDemo?: boolean;
  isAdmin?: boolean;
}

const EbookPlannerPage: React.FC<EbookPlannerPageProps> = ({
  subscriberEmail = '',
  subscriberData,
  isDemo: isDemoProp = false,
  isAdmin: isAdminProp = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Security: if the page is reached without a verified subscriber context,
  // we force demo mode so premium actions stay blocked.
  // EXCEPTION: Admins have full access without needing a subscriber code.
  const hasValidSubscriber =
    isAdminProp ||
    (!!subscriberEmail &&
      typeof subscriberData?.access_code === 'string' &&
      subscriberData.access_code.trim().length > 0 &&
      (subscriberData?.status === 'active' || subscriberData?.plan_type === 'lifetime'));

  const isDemo = isDemoProp || !hasValidSubscriber;
  
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
  const { limits: demoLimits, incrementPlanCount } = useDemoMode(!isDemo ? true : false);
  const { getStepResult, clearResults: clearWorkflowResults, saveStepResult } = useWorkflowResults();
  const [showPaywall, setShowPaywall] = useState<'chapters' | 'export' | 'cover' | 'advanced' | null>(null);
  const [userProjectsCount, setUserProjectsCount] = useState(0);
  
  // Read niche from URL query params
  const [searchParams] = useSearchParams();
  const nicheFromUrl = searchParams.get('niche');
  const categoryFromUrl = searchParams.get('category');
  
  // Utiliser useOpenAIConfig pour une persistance fiable de la clé API
  const { apiKey, updateApiKey: setApiKey } = useOpenAIConfig();
  const [ebookTitle, setEbookTitle] = useState(nicheFromUrl || location.state?.suggestedTitle || savedData?.ebookTitle || '');
  const [targetAudience, setTargetAudience] = useState(savedData?.targetAudience || 'Adultes');
  const [tomeNumber, setTomeNumber] = useState<number | null>(savedData?.tomeNumber || null);
  const [writingStyle, setWritingStyle] = useState(savedData?.writingStyle || 'narratif');
  const [chapterLength, setChapterLength] = useState(savedData?.chapterLength || 'moyen');
  const [detailLevel, setDetailLevel] = useState(savedData?.detailLevel || 'détaillé');
  const [tone, setTone] = useState(savedData?.tone || 'professionnel');
  const [narrativeFormat, setNarrativeFormat] = useState(savedData?.narrativeFormat || 'troisième personne');
  const [bookDescription, setBookDescription] = useState(savedData?.bookDescription || '');
  const [genre, setGenre] = useState(categoryFromUrl || savedData?.genre || '');
  const [characters, setCharacters] = useState<EbookCharacter[]>(savedData?.characters || []);
  
  const { isGenerating, generateChapterContent, generateSubChapterContent, generateEbookPlan, generateBookSummary, generateBookSynopsis, generateEbookCover, optimizeForSEO, generateKDPDescription, generateKDPKeywords, generateKDPCategories, generateBackCover, generatePreface, generateConclusion, generateEpilogue, translateContent, analyzeTextStatistics } = useSubscriptionGeneration(subscriberEmail, apiKey, ebookTitle, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, bookDescription, genre, characters, isDemo);
  
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
  
  const [activeTab, setActiveTab] = useState('onboarding');
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

    // Charger le nombre de projets de l'utilisateur
    const loadProjectsCount = async () => {
      if (!isDemo) {
        const { count, error } = await supabase
          .from('ebook_projects')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          setUserProjectsCount(count);
        }
      }
    };
    loadProjectsCount();
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
    // Note: apiKey est géré séparément par useOpenAIConfig
    const dataToSave = {
      ebookTitle, authorName, targetAudience, tomeNumber, writingStyle,
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
  }, [ebookTitle, authorName, targetAudience, tomeNumber, writingStyle, chapterLength, detailLevel, tone, narrativeFormat, bookDescription, genre, preface, conclusion, epilogue, chapters, numberOfChapters, ebookImages, characters, bookSummary, coverConcepts, seoOptimization, kdpDescription, kdpKeywords, kdpCategories]);

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

  // Fonction pour nettoyer tous les chapitres des artefacts JSON
  const handleCleanAllChapters = React.useCallback(() => {
    // Compter les mots collés AVANT le nettoyage
    const stuckWordsBefore = countAllStuckWords(chapters, preface, conclusion);
    
    const cleanedChapters = chapters.map(chapter => ({
      ...chapter,
      title: cleanGeneratedText(chapter.title || ''),
      content: cleanGeneratedText(chapter.content || ''),
      subChapters: chapter.subChapters.map(sub => ({
        ...sub,
        title: cleanGeneratedText(sub.title || ''),
        content: cleanGeneratedText(sub.content || '')
      }))
    }));
    
    const cleanedPreface = cleanGeneratedText(preface);
    const cleanedConclusion = cleanGeneratedText(conclusion);
    
    // Compter les mots collés APRÈS le nettoyage
    const stuckWordsAfter = countAllStuckWords(cleanedChapters, cleanedPreface, cleanedConclusion);
    
    // Appliquer les changements
    setChapters(cleanedChapters);
    setPreface(cleanedPreface);
    setConclusion(cleanedConclusion);
    
    // Afficher le résultat avec les statistiques
    const corrected = stuckWordsBefore - stuckWordsAfter;
    if (stuckWordsBefore > 0) {
      toast.success(
        `✨ Nettoyage terminé ! ${corrected} mot${corrected > 1 ? 's' : ''} collé${corrected > 1 ? 's' : ''} corrigé${corrected > 1 ? 's' : ''} sur ${stuckWordsBefore} détecté${stuckWordsBefore > 1 ? 's' : ''}.`,
        { duration: 5000 }
      );
    } else {
      toast.success('✨ Texte déjà propre ! Aucun mot collé détecté.', { duration: 4000 });
    }
  }, [chapters, preface, conclusion]);

  const handleGenerateChapterContent = async (chapterId: string) => {
    // Bloquer en mode démo
    if (isDemo) {
      setShowPaywall('chapters');
      return;
    }
    
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const content = await generateChapterContent(chapter, targetWordsPerChapter);
    if (content) updateChapterContent(chapterId, content);
  };

  const handleGenerateSubChapterContent = async (chapterId: string, subChapterId: string) => {
    // Bloquer en mode démo
    if (isDemo) {
      setShowPaywall('chapters');
      return;
    }
    
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
    // Bloquer en mode démo
    if (isDemo) {
      setShowPaywall('chapters');
      return;
    }
    
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
    
    // En mode démo, vérifier les limites
    if (isDemo && !demoLimits.canGeneratePlan) {
      setShowPaywall('chapters');
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
      
      // Incrémenter le compteur en mode démo
      if (isDemo) {
        incrementPlanCount();
      }
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
    try {
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
    } catch (err) {
      console.error('Erreur sauvegarde avant changement onglet:', err);
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

  const clearCurrentEditorState = () => {
    // Réinitialiser TOUS les états (y compris bookDescription et genre)
    setEbookTitle('');
    setAuthorName('');
    setPreface('');
    setConclusion('');
    setEpilogue('');
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
    setBookSummary('');
    setCoverConcepts('');
    setSeoOptimization('');
    setKdpDescription('');
    setKdpKeywords('');
    setKdpCategories('');
    setBookDescription('');
    setGenre('');

    // IMPORTANT: Réinitialiser l'ID du projet pour forcer la création d'un nouveau projet
    setCurrentProjectId(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }

    setActiveTab('planner');
  };

  const handleCreateNewProject = () => {
    const hasExistingContent = Boolean(
      ebookTitle.trim() ||
      authorName.trim() ||
      preface.trim() ||
      conclusion.trim() ||
      chapters.length > 0 ||
      characters.length > 0 ||
      ebookImages.length > 0 ||
      bookSummary.trim() ||
      coverConcepts.trim() ||
      seoOptimization.trim() ||
      kdpDescription.trim() ||
      kdpKeywords.trim() ||
      kdpCategories.trim() ||
      bookDescription.trim() ||
      genre.trim()
    );

    if (hasExistingContent) {
      const confirmed = confirm(
        'Créer un nouveau projet ?\n\nLe projet actuellement affiché sera réinitialisé dans l’éditeur, mais restera sauvegardé dans la base si vous l’avez déjà enregistré.'
      );
      if (!confirmed) return;
    }

    clearCurrentEditorState();
    toast.success('Nouveau projet prêt : aucune sauvegarde existante ne sera écrasée.');
  };

  const resetPlan = () => {
    if (!confirm('⚠️ RÉINITIALISATION COMPLÈTE\n\nCette action va effacer :\n• Le titre et l\'auteur\n• Tous les chapitres\n• Tous les personnages\n• La préface et conclusion\n• Toutes les images\n\nVoulez-vous vraiment tout supprimer et repartir de zéro ?')) {
      return;
    }

    clearCurrentEditorState();

    toast.success('🧹 Projet réinitialisé !', {
      description: 'Toutes les données ont été effacées. Vous repartez de zéro.',
      duration: 4000,
    });
  };

  const handleImageSelect = (imageUrl: string, title: string) => {
    setEbookImages(prev => [...prev, { url: imageUrl, title }]);
    toast.success('Image ajoutée !');
  };

  const handleProjectLoad = (project: any) => {
    // Important: définir le projet actif pour que l'auto-save mette bien à jour CE projet
    setCurrentProjectId(project.id);

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
      case 'onboarding':
        return (
          <WorkflowOnboarding
            onStartWorkflow={() => setActiveTab('complete-workflow')}
            onNavigateToStep={(tabId) => setActiveTab(tabId)}
            ebookTitle={ebookTitle}
            hasExistingProject={chapters.length > 0}
          />
        );

      case 'presentation':
        return (
          <EbookPresentation onNavigate={(tab) => setActiveTab(tab)} />
        );

      case 'niche-analysis':
        return <EbookNicheAnalysis />;

      case 'projects':
        return (
          <EbookProjectsList 
            onProjectLoad={handleProjectLoad}
            onCreateNew={handleCreateNewProject}
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

      case 'draft-mode':
        if (isDemo) {
          setShowPaywall('chapters');
          return null;
        }
        return (
          <EbookDraftMode
            chapters={chapters}
            ebookTitle={ebookTitle}
            authorName={authorName}
            isGenerating={isGeneratingComplete}
            onGenerateAll={generateCompleteEbook}
            generationProgress={generationProgress}
          />
        );

      case 'prompt-library':
        return (
          <EbookPromptLibrary
            currentGenre={genre}
            onApplyTemplate={(template) => {
              setWritingStyle(template.writingStyle);
              setTone(template.tone);
              setNarrativeFormat(template.narrativeFormat);
              setGenre(template.genre);
            }}
          />
        );

      case 'manuscript-dashboard':
        return (
          <EbookManuscriptDashboard
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={chapters}
            preface={preface}
            conclusion={conclusion}
            targetWordsPerChapter={targetWordsPerChapter}
            kdpDescription={kdpDescription}
            kdpKeywords={kdpKeywords}
            kdpCategories={kdpCategories}
          />
        );

      case 'rich-editor':
        if (isDemo) {
          setShowPaywall('chapters');
          return null;
        }
        return (
          <EbookRichEditor
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
            targetWordsPerChapter={targetWordsPerChapter}
          />
        );


        return (
          <WorkflowDashboard
            ebookTitle={ebookTitle}
            onNavigate={(tabId) => setActiveTab(tabId)}
            onStartAutoWorkflow={() => setActiveTab('complete-workflow')}
          />
        );

      case 'workflow-export':
        return (
          <WorkflowExportCompiled
            ebookTitle={ebookTitle}
            authorName={authorName}
          />
        );
      
      case 'complete-workflow': {
        // Bloquer en mode démo
        if (isDemo) {
          return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center">⚡ Générer le livre complet</h2>
              <p className="text-muted-foreground text-center max-w-md">
                La génération complète (P1→P14) est disponible avec l'accès complet.
              </p>
              <Button
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowPaywall('chapters')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Débloquer pour 97€
              </Button>
            </div>
          );
        }

        return (
          <EbookCompleteWorkflow
            characters={characters}
            onComplete={(bookData) => {
              // Update title and author from the workflow
              if (bookData?.title) setEbookTitle(bookData.title);
              if (bookData?.authorName) setAuthorName(bookData.authorName);
              if (bookData?.numberOfChapters) setNumberOfChapters(bookData.numberOfChapters);
              if (typeof bookData?.bookDescription === 'string' && bookData.bookDescription.trim()) {
                setBookDescription(bookData.bookDescription);
              }
              
              // Update all the state with the generated book data
              if (typeof bookData?.preface === 'string') setPreface(bookData.preface);
              if (typeof bookData?.conclusion === 'string') setConclusion(bookData.conclusion);
              if (bookData?.epilogue) setEpilogue(bookData.epilogue);
              if (bookData?.bookSynopsis) setBookSummary(bookData.bookSynopsis);
              if (bookData?.marketPositioning?.motsClésKDP) {
                setKdpKeywords(bookData.marketPositioning.motsClésKDP.join(', '));
              }
              if (bookData?.marketPositioning?.categoriesKDP) {
                setKdpCategories(bookData.marketPositioning.categoriesKDP.join(', '));
              }
              if (bookData?.backCover?.description) {
                setKdpDescription(bookData.backCover.description);
              }

              const generatedChapters: Chapter[] = Array.isArray(bookData?.chapters)
                ? bookData.chapters.map((ch: any, index: number) => ({
                    id: `cw-${Date.now()}-${index}`,
                    title: cleanGeneratedText(ch?.title) || `Chapitre ${ch?.number || index + 1}`,
                    content: cleanGeneratedText(ch?.content) || '',
                    subChapters: []
                  }))
                : [];

              if (generatedChapters.length > 0) {
                setChapters(generatedChapters);
                setActiveTab('writing');
                fireStars();
                toast.success(`✅ ${generatedChapters.length} chapitres importés dans l'onglet Rédaction`);
              } else {
                toast.error("La génération s'est terminée, mais aucun chapitre n'a été renvoyé.");
              }
            }}
          />
        );
      }
      
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

            {/* Background décoratif — subtle */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
            </div>
            
            <div className="relative z-10 space-y-6">
              {/* Header Hero Section — 2026 Glass */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(262,83%,20%)] via-[hsl(275,80%,25%)] to-[hsl(292,75%,20%)] p-8 shadow-2xl border border-white/10">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[hsl(292,84%,61%)] rounded-full blur-[100px] opacity-20" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[hsl(189,94%,43%)] rounded-full blur-[80px] opacity-15" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_0_30px_hsl(262,83%,58%,0.3)]">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                          {ebookTitle || "Votre prochain best-seller"}
                        </h1>
                        <p className="text-white/50 text-sm mt-1 font-medium">
                          {authorName ? `Par ${authorName}` : "Commencez à créer votre ebook"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      type="button"
                      onClick={generateAutomaticPlan} 
                      disabled={!ebookTitle || isGenerating}
                      className="bg-white text-[hsl(262,83%,35%)] hover:bg-white/90 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 font-bold rounded-xl"
                      data-tutorial="generate-button"
                    >
                      <Wand2 className="h-5 w-5 mr-2" />
                      {isGenerating ? 'Génération...' : 'Générer avec l\'IA'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={resetPlan}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-xl"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Nouveau
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => { setShowWelcome(true); setShowTutorial(true); }}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-xl"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Aide
                    </Button>
                    {isAdminProp && (
                      <Button 
                        type="button"
                        onClick={async () => {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (session) {
                            toast.success('Session Auth active !', { description: `Connecté: ${session.user.email}` });
                            window.location.reload();
                          } else {
                            toast.info('Redirection vers connexion Auth...');
                            navigate('/auth?redirect=/ebook-planner');
                          }
                        }}
                        className="bg-[hsl(38,92%,50%)]/20 hover:bg-[hsl(38,92%,50%)]/30 text-[hsl(38,92%,70%)] border border-[hsl(38,92%,50%)]/30 rounded-xl"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Auth
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white/70 text-sm italic">
                    🚀 1, 2, 3… Foncez ! Je suis toujours là pour vous accompagner en Zoom gratuit — Georges
                  </p>
                </div>
              </div>

              {/* Quick Stats — 2026 Glass Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Chapitres', value: chapters.length, icon: BookOpen, color: 'hsl(262,83%,58%)' },
                  { label: 'Personnages', value: characters.length, icon: Users, color: 'hsl(189,94%,43%)' },
                  { label: 'Images', value: ebookImages.length, icon: Palette, color: 'hsl(38,92%,50%)' },
                  { label: 'Mots', value: chapters.reduce((acc, c) => acc + (c.content?.split(' ').length || 0) + c.subChapters.reduce((subAcc, sc) => subAcc + (sc.content?.split(' ').length || 0), 0), 0), icon: FileText, color: 'hsl(160,84%,39%)' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="group relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${stat.color}, transparent 70%)` }} />
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: stat.color, boxShadow: `0 8px 25px -5px ${stat.color}40` }}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne principale (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* General Info Card — 2026 */}
                  <Card className="overflow-hidden border border-border/50 shadow-xl bg-card/90 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 25px -5px hsl(262 83% 58% / 0.4)' }}>
                            <BookOpen className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold tracking-tight">Informations générales</CardTitle>
                            <CardDescription className="text-xs">Définissez les bases de votre ebook</CardDescription>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={resetPlan}
                          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
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
                              <SelectItem value="jardinage">🌱 Jardinage</SelectItem>
                              <SelectItem value="jardin-bio">🌿 Jardin Bio</SelectItem>
                              <SelectItem value="permaculture">🌾 Permaculture</SelectItem>
                              <SelectItem value="potager">🥕 Potager</SelectItem>
                              <SelectItem value="bricolage">🔨 Bricolage</SelectItem>
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
                          {chapters.length > 0 && (
                            <Button 
                              onClick={() => {
                                setChapters([]);
                                toast.success("Chapitres réinitialisés");
                              }} 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Réinitialiser
                            </Button>
                          )}
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
        // Bloquer l'écriture en mode démo
        if (isDemo) {
          return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center">Écriture des chapitres</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Cette fonctionnalité est réservée aux membres. Débloquez l'accès complet pour écrire vos chapitres avec l'IA.
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowPaywall('chapters')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Débloquer pour 97€
              </Button>
            </div>
          );
        }
        return (
          <EbookWriting
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
            onUpdateSubChapterContent={updateSubChapterContent}
            targetWordsPerChapter={targetWordsPerChapter}
            onCleanAllChapters={handleCleanAllChapters}
          />
        );
      
      case 'cover':
        // Bloquer la couverture en mode démo
        if (isDemo) {
          return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center">Générateur de couvertures</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Créez des couvertures professionnelles avec l'IA. Disponible avec l'accès complet.
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowPaywall('cover')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Débloquer pour 97€
              </Button>
            </div>
          );
        }
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

      case 'description-magnet':
        return <EbookDescriptionMagnet />;

      case 'pen-name':
        return <EbookPenNameGenerator />;
      
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
            subscriberEmail={subscriberEmail}
          />
        );
      
      case 'export-guide':
        return <EbookExportGuide />;
      
      case 'kdp-guide':
        return <KdpGuideChecklist />;
      
      case 'export':
        // Bloquer l'export en mode démo
        if (isDemo) {
          return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-center">Export PDF, Word & ePub</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Exportez votre ebook dans tous les formats professionnels. Disponible avec l'accès complet.
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={() => setShowPaywall('export')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Débloquer pour 97€
              </Button>
            </div>
          );
        }
        // Récupérer la structure KDP depuis les résultats du workflow P3
        const p3Result = getStepResult('P3');
        const kdpStructure = p3Result?.result ? {
          introduction: p3Result.result.introduction,
          blocsPratiques: p3Result.result.blocsPratiques,
          aproposAuteur: p3Result.result.aproposAuteur,
          annexes: p3Result.result.annexes,
        } : undefined;
        
        return (
          <EbookExporter
            ebookTitle={ebookTitle}
            authorName={authorName}
            preface={preface}
            conclusion={conclusion}
            epilogue={epilogue}
            chapters={chapters}
            characters={characters}
            kdpStructure={kdpStructure}
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
      
      case 'mockup-studio':
        return <EbookMockupStudio />;

      case 'calibre-epub':
        return <CalibreStudioEpub />;

      case 'price-studio':
        return <PriceEbookStudio />;

      case 'kdp-cover-studio':
        return <KdpCoverStudio />;

      case 'library':
        return (
          <EbookImageLibrary
            ebookId={currentProjectId || undefined}
            ebookTitle={ebookTitle}
            subscriberEmail={subscriberEmail}
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

      case 'url-import':
        return (
          <EbookUrlImport
            onGuideGenerated={(guide) => {
              // Appliquer le guide généré au projet
              if (guide.title) setEbookTitle(guide.title);
              
              // Convertir les chapitres du guide
              if (guide.chapters && guide.chapters.length > 0) {
                const newChapters: Chapter[] = guide.chapters.map((ch, index) => ({
                  id: `url-${Date.now()}-${index}`,
                  title: ch.title,
                  content: ch.content || '',
                  subChapters: ch.keyPoints?.map((kp, ki) => ({
                    id: `url-sub-${Date.now()}-${index}-${ki}`,
                    title: kp,
                    content: ''
                  })) || []
                }));
                setChapters(newChapters);
              }
              
              if (guide.conclusion) setConclusion(guide.conclusion);
              if (guide.summary) setBookDescription(guide.summary);
              
              toast.success(`Guide "${guide.title}" importé avec ${guide.chapters?.length || 0} chapitres !`);
              setActiveTab('planner');
            }}
          />
        );
      
      case 'doc-transform':
        return (
          <EbookDocumentTransformer 
            onSendToWorkflow={(data) => {
              // Inject into workflow: P1 (title/intro) and P4 (chapters)
              
              // P1 - Directeur Éditorial: titre, préface, conclusion
              const p1Display = `# 📋 Directeur Éditorial (Import)\n\n**Titre validé:** ${data.title}\n**Auteur:** ${data.author}\n\n## Introduction\n${data.preface}\n\n## Conclusion\n${data.conclusion}`;
              saveStepResult('P1', {
                title: data.title,
                author: data.author,
                introduction: data.preface,
                conclusion: data.conclusion,
                source: 'document-import'
              }, p1Display);
              
              // P4 - Rédaction Expert: chapitres
              const chaptersContent = data.chapters.map((ch, i) => `## Chapitre ${i + 1}: ${ch.title}\n\n${ch.content}`).join('\n\n---\n\n');
              const p4Display = `# ✍️ Rédaction (Import)\n\n${data.chapters.length} chapitres importés\n\n${chaptersContent}`;
              saveStepResult('P4', {
                chapters: data.chapters,
                source: 'document-import'
              }, p4Display);

              // Update ebook title and chapters in the planner state
              setEbookTitle(data.title);
              setAuthorName(data.author);
              setPreface(data.preface);
              setConclusion(data.conclusion);
              
              toast.success(`"${data.title}" injecté dans l'Éditeur Éditorial !`, {
                description: `${data.chapters.length} chapitres prêts pour le workflow P1-P15`
              });
              setActiveTab('workflow-dashboard');
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
          <EbookAiChat isDemo={isDemo} />
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
            isDemo={isDemo}
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
      
      case 'formation-audiobook-distribution':
        return <FormationAudiobookDistribution />;

      case 'audio-express':
        return (
          <AudioExpressWorkflow
            ebookTitle={ebookTitle}
            chapters={chapters}
            preface={preface}
            conclusion={conclusion}
            authorName={authorName}
            onNavigateToAudio={() => handleTabChange('audiobook')}
          />
        );

      case 'ebook-library':
        return (
          <EbookLibrary onLoadProject={(project) => handleProjectLoad(project)} />
        );

      case 'audiobook-library':
        return <AudiobookLibrary />;
      
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
              const safeTitle = data.title?.trim() || `${data.seriesTitle || 'Série'} - Tome ${data.tomeNumber}`;
              const safeAuthor = data.authorName?.trim() || authorName || 'Auteur inconnu';
              const safeSynopsis = data.synopsis?.trim() || '';
              const safePreface = data.preface?.trim() || (safeSynopsis ? `Introduction du tome ${data.tomeNumber}.\n\n${safeSynopsis}` : '');
              const safeConclusion = data.conclusion?.trim() || '';
              const safeChapters = Array.isArray(data.chapters) && data.chapters.length > 0
                ? data.chapters
                : Array.from({ length: 8 }, (_, index) => ({
                    id: `chapter-fallback-${Date.now()}-${index}`,
                    title: `Chapitre ${index + 1}`,
                    content: '',
                    subChapters: []
                  }));

              // Inject into Workflow Éditorial (P1 + P4) instead of Planificateur
              setEbookTitle(safeTitle);
              setAuthorName(safeAuthor);
              setTomeNumber(data.tomeNumber);
              setPreface(safePreface);
              setConclusion(safeConclusion);
              setChapters(safeChapters);
              setTargetWordsPerChapter(data.targetWordsPerChapter);

              // P1 - Directeur Éditorial
              const p1Display = `# 📋 Directeur Éditorial (Import Tome ${data.tomeNumber})\n\n**Titre :** ${safeTitle}\n**Auteur :** ${safeAuthor}\n**Série :** ${data.seriesTitle}\n**Synopsis :** ${safeSynopsis}\n\n## Introduction\n${safePreface}\n\n## Conclusion\n${safeConclusion}`;
              saveStepResult('P1', {
                title: safeTitle,
                author: safeAuthor,
                introduction: safePreface,
                conclusion: safeConclusion,
                tomeNumber: data.tomeNumber,
                seriesTitle: data.seriesTitle,
                synopsis: safeSynopsis,
                source: 'series-bible-import'
              }, p1Display);

              // P4 - Rédaction Expert: chapitres
              const chaptersContent = safeChapters.map((ch, i) => `## Chapitre ${i + 1}: ${ch.title}\n\n${ch.content || '(À rédiger via le workflow)'}`).join('\n\n---\n\n');
              const p4Display = `# ✍️ Rédaction (Import Tome ${data.tomeNumber})\n\n${safeChapters.length} chapitres importés (~${data.targetWordsPerChapter.toLocaleString()} mots/chapitre)\n\n${chaptersContent}`;
              saveStepResult('P4', {
                chapters: safeChapters,
                targetWordsPerChapter: data.targetWordsPerChapter,
                source: 'series-bible-import'
              }, p4Display);

              setActiveTab('workflow-dashboard');
              toast.success(`"${safeTitle}" (Tome ${data.tomeNumber}) injecté dans l'Éditeur Éditorial !`, {
                description: `${safeChapters.length} chapitres prêts pour le workflow P1-P15`
              });
            }}
          />
        );
      
      case 'coloring-book':
        return (
          <EbookColoringBookGenerator ebookTitle={ebookTitle} />
        );
      
      case 'comic-book':
        return (
          <EbookComicBookGenerator ebookTitle={ebookTitle} />
        );
      
      case 'diary-generator':
        return (
          <EbookDiaryGenerator ebookTitle={ebookTitle} />
        );
      
      case 'recipe-book':
        return (
          <EbookRecipeBookGenerator ebookTitle={ebookTitle} />
        );
      
      case 'travel-guide':
        return (
          <EbookTravelGuideGenerator ebookTitle={ebookTitle} />
        );
      
      case 'aquarium-guide':
        return (
          <EbookAquariumGenerator ebookTitle={ebookTitle} />
        );
      
      case 'bird-guide':
        return (
          <EbookBirdSheetGenerator ebookTitle={ebookTitle} />
        );
      
      case 'documentary':
        return (
          <EbookDocumentaryGenerator ebookTitle={ebookTitle} />
        );
      
      case 'kdp-research':
        return (
          <EbookKdpResearch />
        );
      
      case 'kdp-explosive':
        return (
          <EbookKdpExplosiveSimulator />
        );
      
      case 'amazon-simulator':
        return (
          <EbookAmazonSimulator 
            title={ebookTitle}
            authorName={authorName}
          />
        );
      
      case 'amazon-ads':
        return (
          <EbookAmazonAdsSimulator 
            ebookTitle={ebookTitle}
            genre={genre}
          />
        );
      
      case 'launch-plan':
        return <EbookLaunchPlan />;
      
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
      
      
      
      case 'plagiarism-validator':
        return (
          <EbookPlagiarismValidator />
        );
      
      case 'editor-audit':
        return (
          <EbookEditorAudit
            />
        );
      
      case 'editorial-director':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P1"
              stepName="Directeur Éditorial"
              result={getStepResult('P1')}
            >
              <EbookEditorialDirector
                subject={ebookTitle}
                onSubjectChange={setEbookTitle}
              />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'market-analysis':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P2"
              stepName="Analyse de Marché"
              result={getStepResult('P2')}
            >
              <EbookMarketAnalysis />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'content-architect':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P3"
              stepName="Architecte de Contenu"
              result={getStepResult('P3')}
            >
              <EbookContentArchitect 
                onApplyStructure={(structure) => {
                  // Generate new unique chapters - replaces entirely to avoid duplicates
                  const timestamp = Date.now();
                  const newChapters = structure.map((ch, index) => ({
                    id: `chapter-${timestamp}-${index}`,
                    title: ch.title,
                    content: '',
                    subChapters: ch.subChapters.map((sub, subIndex) => ({
                      id: `subchapter-${timestamp}-${index}-${subIndex}`,
                      title: sub,
                      content: ''
                    }))
                  }));
                  // Replace chapters entirely (not append) to prevent duplicates
                  setChapters(newChapters);
                  toast.success(`Structure appliquée : ${newChapters.length} chapitres créés`);
                  setActiveTab('planner');
                }}
              />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'expert-writing':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P4"
              stepName="Rédaction Experte"
              result={getStepResult('P4')}
            >
              <EbookExpertWriting />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'natural-rewrite':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P5"
              stepName="Réécriture Naturelle"
              result={getStepResult('P5')}
            >
              <EbookNaturalRewrite />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'editorial-packaging':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P7"
              stepName="Packaging Éditorial"
              result={getStepResult('P7')}
            >
              <EbookEditorialPackaging />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'editorial-quality':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P6"
              stepName="Qualité Éditoriale"
              result={getStepResult('P6')}
            >
              <EbookEditorialQuality />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'final-diagnosis':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P8"
              stepName="Diagnostic Final"
              result={getStepResult('P8')}
            >
              <EbookFinalDiagnosis />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'editorial-memory':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P9"
              stepName="Mémoire Éditoriale"
              result={getStepResult('P9')}
            >
              <EbookEditorialMemory />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'chapter-coherence':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P10"
              stepName="Cohérence Chapitres"
              result={getStepResult('P10')}
            >
              <EbookChapterCoherence />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'self-critique':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P11"
              stepName="Auto-Critique"
              result={getStepResult('P11')}
            >
              <EbookSelfCritique />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'iterative-loop':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P12"
              stepName="Boucle Itérative"
              result={getStepResult('P12')}
            >
              <EbookIterativeLoop />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'style-signature':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P13"
              stepName="Signature de Style"
              result={getStepResult('P13')}
            >
              <EbookStyleSignature />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'ultimate-verdict':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P14"
              stepName="Verdict Ultime"
              result={getStepResult('P14')}
            >
              <EbookUltimateVerdict />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'formation-pdf':
        return (
          <EbookFormationPDF />
        );
      
      case 'affiliation':
        // Rediriger vers la page affiliation
        navigate('/affiliation');
        return null;
      
      case 'seo-articles':
        return (
          <EbookSeoArticleGenerator />
        );

      // ========== OUTILS 2026 ==========
      case 'video-trailer':
        return (
          <EbookVideoTrailer
            ebookTitle={ebookTitle}
            bookSummary={bookSummary}
            coverImage={ebookImages[0]?.url}
          />
        );
      
      case 'multi-translator':
        return (
          <EbookMultiTranslator
            ebookTitle={ebookTitle}
            chapters={chapters}
            preface={preface}
            conclusion={conclusion}
          />
        );
      
      case 'trend-predictor':
        return <EbookTrendPredictor />;
      
      case 'ab-testing':
        return (
          <EbookABTesting
            ebookTitle={ebookTitle}
            coverImage={ebookImages[0]?.url}
          />
        );
      
      case 'humanize-anti-ia':
        return (
          <WorkflowStepWrapper currentTabId={activeTab} onNavigate={handleTabChange} isGenerating={isGenerating}>
            <WorkflowResultViewer
              stepId="P15"
              stepName="Humanisation Anti-IA"
              result={getStepResult('P15')}
            >
              <EbookHumanizer />
            </WorkflowResultViewer>
          </WorkflowStepWrapper>
        );
      
      case 'humanizer':
        return <EbookHumanizer />;

      case 'ai-detector':
        return <EbookAIDetectorScore />;

      case 'ai-cover-studio':
        return (
          <EbookAICoverStudio
            ebookTitle={ebookTitle}
            authorName={authorName}
            onCoverGenerated={(url) => {
              setEbookImages(prev => [{ url, title: 'Couverture IA' }, ...prev]);
              toast.success('Couverture ajoutée à votre projet');
            }}
          />
        );

      case 'multi-tome-hub':
        return <EbookMultiTomeHub />;

      case 'advanced-export':
        return (
          <EbookAdvancedExport
            ebookTitle={ebookTitle}
            authorName={authorName}
            chapters={chapters}
            preface={preface}
            conclusion={conclusion}
            characters={characters}
            coverImage={ebookImages[0]?.url}
          />
        );
      
      case 'writing-intelligence':
        return (
          <EbookWritingIntelligence
            chapters={chapters}
            onUpdateChapterContent={updateChapterContent}
          />
        );

      case 'publication-planner':
        return <EbookPublicationPlanner />;

      case 'royalty-dashboard':
        return <EbookRoyaltyDashboard />;

      case 'ux-center':
        return <EbookUXEnhancements />;

      case 'arc-manager':
        return (
          <EbookArcManager
            ebookTitle={ebookTitle}
            authorName={authorName}
            bookSummary={bookSummary}
          />
        );
      
      case 'direct-sales':
        return (
          <EbookDirectSales
            ebookTitle={ebookTitle}
            authorName={authorName}
          />
        );
      
      case 'bsr-tracker':
        return <EbookBsrTracker />;

      case 'pdf-reformatter':
        return <PdfKdpReformatter />;

      case 'pdf-analyzer':
        return <PdfKdpAnalyzer />;

      case 'strict-proofread':
        return (
          <EbookStrictProofreader
            chapters={chapters}
            onApplyCorrections={(chapterIndex, correctedContent) => {
              const updated = [...chapters];
              if (updated[chapterIndex]) {
                updated[chapterIndex] = { ...updated[chapterIndex], content: correctedContent };
                setChapters(updated);
              }
            }}
          />
        );

      case 'subscription':
        // Rediriger vers la page Abonnement
        navigate('/subscription');
        return null;
      
      case 'admin':
        // Rediriger vers la page admin
        navigate('/admin');
        return null;
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Onglet non disponible</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Cet onglet n'est pas encore disponible. Revenez au tableau de bord pour continuer.
            </p>
            <Button variant="outline" onClick={() => setActiveTab('onboarding')}>
              Retour à l'accueil
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      <ModernSidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Hero Header — Dark Premium 2026 */}
        <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/50">
          {/* Subtle glow effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.1),transparent)]" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/8 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/8 rounded-full blur-[100px]" />
          
          <div className="relative container mx-auto px-6 py-6">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/ebook-ideas')}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800 rounded-xl text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleManualSave}
                  disabled={isSaving || !ebookTitle}
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-700 rounded-xl transition-all duration-300"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                  type="button"
                  onClick={resetPlan}
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-700 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau
                </Button>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-8 h-8 text-slate-900" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">
                {ebookTitle || 'Studio de Création'}
              </h1>
              
              {isSaving && (
                <Badge className="bg-slate-800/50 text-cyan-400 border-slate-700">
                  <Save className="w-3 h-3 mr-1 animate-pulse" />
                  Sauvegarde...
                </Badge>
              )}
              
              <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm tracking-wide uppercase font-medium">
                Créez des ebooks professionnels avec l'intelligence artificielle
              </p>
              
              {/* Import URL CTA */}
              <Button
                type="button"
                onClick={() => handleTabChange('url-import')}
                className="mt-6 relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-white font-semibold px-8 py-3 h-auto rounded-2xl border border-cyan-500/20 group transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-3">
                  <span className="text-lg">🔗</span>
                  <span>Créer mon premier ebook</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400 font-bold text-[10px] px-2 py-0.5 border border-cyan-500/30">
                    2026
                  </Badge>
                </span>
              </Button>

              <p className="mt-5 text-slate-600 text-sm italic">
                🚀 1, 2, 3… Foncez ! Je suis toujours là pour vous accompagner en Zoom gratuit — Georges
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <DemoBanner 
            plansGenerated={demoLimits.plansGenerated} 
            maxPlans={demoLimits.maxPlansInDemo} 
            isAuthenticated={!isDemo}
            userName={subscriberEmail}
            projectsCount={userProjectsCount}
          />
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
      
      {/* Demo Paywall */}
      {showPaywall && (
        <DemoPaywall 
          feature={showPaywall} 
          onClose={() => setShowPaywall(null)} 
        />
      )}

      {/* Admin: Subscriber Activity Popup */}
      <SubscriberActivityPopup />
    </div>
  );
};

export default EbookPlannerPage;
