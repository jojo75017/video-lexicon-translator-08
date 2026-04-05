import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, BookOpen, CheckCircle2, Loader2, AlertCircle, Shield,
  Rocket, Target, TrendingUp, Layers, FileText, Award, User, Hash,
  ChevronDown, ChevronUp, Tag, AlignLeft, RotateCcw, Trash2, Plus, Key
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWorkflowResults } from '@/hooks/useWorkflowResults';
import { useWorkflowCloudSync } from '@/hooks/useWorkflowCloudSync';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

interface Character {
  id: string;
  name: string;
  description: string;
  role?: string;
  arc?: string;
}

interface GeneratedCharacter {
  name: string;
  description: string;
  role: string;
  arc?: string;
}

interface EbookCompleteWorkflowProps {
  onComplete: (bookData: any) => void;
  characters?: Character[];
}

const STORAGE_KEY = 'ebook_workflow_progress';

interface WorkflowProgress {
  title: string;
  subtitle: string;
  category: string;
  authorName: string;
  bookIntroduction: string;
  hasReadSteps: boolean;
  numberOfChapters: number;
  currentStepIndex: number;
  stepResults: Record<string, { result: any; displayContent: string }>;
  allContext: Record<string, any>;
  savedAt: string;
  generatedCharacters?: GeneratedCharacter[];
  waitingForCharacterValidation?: boolean;
  waitingForTitleValidation?: boolean;
  titleSuggestions?: any[];
  originalTitleScore?: any;
  selectedTitleIndex?: number | null;
}

const workflowSteps = [
  { id: 'P1', name: 'Directeur Éditorial', icon: Target, description: 'Vision stratégique et analyse du projet' },
  { id: 'P2', name: 'Analyse de Marché', icon: TrendingUp, description: 'Positionnement Amazon KDP + 7 mots-clés stratégiques' },
  { id: 'P3', name: 'Architecte de Contenu', icon: Layers, description: 'Structure détaillée (400+ pages)' },
  { id: 'P4', name: 'Rédaction Experte', icon: FileText, description: 'Écriture professionnelle chapitre par chapitre' },
  { id: 'P5', name: 'Réécriture Naturelle', icon: Sparkles, description: 'Humanisation du texte (votre voix, pas un robot)' },
  { id: 'P6', name: 'Qualité Éditoriale', icon: CheckCircle2, description: 'Contrôle qualité approfondi' },
  { id: 'P7', name: 'Packaging Éditorial', icon: BookOpen, description: 'Métadonnées et mots-clés KDP optimisés' },
  { id: 'P8', name: 'Diagnostic Final', icon: Target, description: 'Vérification cohérence globale' },
  { id: 'P9', name: 'Mémoire Éditoriale', icon: Sparkles, description: 'Capture de VOTRE voix unique d\'auteur' },
  { id: 'P10', name: 'Cohérence Chapitres', icon: Layers, description: 'Transitions fluides entre chapitres' },
  { id: 'P11', name: 'Auto-Critique', icon: AlertCircle, description: 'Détection des faiblesses (sans flatterie)' },
  { id: 'P12', name: 'Boucle Itérative', icon: Sparkles, description: 'Améliorations automatiques' },
  { id: 'P13', name: 'Signature de Style', icon: Award, description: 'Voix d\'auteur unifiée et reconnaissable' },
  { id: 'P14', name: 'Verdict Ultime', icon: CheckCircle2, description: 'Validation finale par l\'éditeur professionnel' },
  { id: 'P15', name: 'Humanisation Anti-IA', icon: Shield, description: '🎁 BONUS — Rend le texte indétectable par les outils anti-IA' },
];

const EbookCompleteWorkflow: React.FC<EbookCompleteWorkflowProps> = ({ onComplete, characters: externalCharacters = [] }) => {
  // Hook pour sauvegarder les résultats P1-P14 globalement
  const { saveStepResult, saveAllResults } = useWorkflowResults();
  const { saveStepToCloud } = useWorkflowCloudSync();
  
  // Hook pour récupérer la clé API utilisateur
  const { apiKey: userApiKey, isValid: isUserKeyValid } = useOpenAIConfig();

  // Compteur dynamique de projets
  const [projectCount, setProjectCount] = useState<number | null>(null);
  useEffect(() => {
    supabase.from('ebook_projects').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setProjectCount(count); });
  }, []);
  
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [bookIntroduction, setBookIntroduction] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [numberOfChapters, setNumberOfChapters] = useState(8);
  const [hasReadSteps, setHasReadSteps] = useState(false);
  
  // Workflow state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepResults, setStepResults] = useState<Record<string, { result: any; displayContent: string }>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [failedStepIndex, setFailedStepIndex] = useState<number | null>(null);
  const [allContext, setAllContext] = useState<Record<string, any>>({});
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedProgressSnapshot, setSavedProgressSnapshot] = useState<WorkflowProgress | null>(null);
  
  // État pour les personnages générés en P3 et l'édition avant P4
  const [generatedCharacters, setGeneratedCharacters] = useState<GeneratedCharacter[]>([]);
  const [waitingForCharacterValidation, setWaitingForCharacterValidation] = useState(false);
  const [editingCharacterIndex, setEditingCharacterIndex] = useState<number | null>(null);
  
  // État pour la validation du titre après P1
  const [waitingForTitleValidation, setWaitingForTitleValidation] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<any[]>([]);
  const [originalTitleScore, setOriginalTitleScore] = useState<any>(null);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null); // null = titre original
  const [generatedIntro, setGeneratedIntro] = useState('');
  const [generatedConclusion, setGeneratedConclusion] = useState('');

  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / 15) * 100 : 0;
  const normalizedUserApiKey = typeof userApiKey === 'string' ? userApiKey.trim() : '';
  const hasConfiguredApiKey = normalizedUserApiKey.length > 0;
  const hasPlausibleApiKeyFormat = normalizedUserApiKey.startsWith('AIza');
  const hasUsableApiKey = hasConfiguredApiKey && hasPlausibleApiKeyFormat;
  const hasStrictlyValidatedApiKey = hasUsableApiKey && isUserKeyValid === true;
  const hasApiKeyValidationWarning = hasConfiguredApiKey && !hasPlausibleApiKeyFormat;
  const canGenerate = title.trim() && authorName.trim() && category && bookIntroduction.trim() && hasReadSteps;

  const readSavedProgressSnapshot = useCallback((): WorkflowProgress | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as WorkflowProgress;
    } catch (e) {
      console.error('Error reading saved progress snapshot:', e);
      return null;
    }
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data: WorkflowProgress = JSON.parse(saved);
      setSavedProgressSnapshot(data);
      if (data.currentStepIndex >= 0 && Object.keys(data.stepResults || {}).length > 0) {
        setHasSavedProgress(true);

        // Restauration automatique après refresh pour éviter de tout recommencer
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setCategory(data.category || '');
        setAuthorName(data.authorName || '');
        setBookIntroduction(data.bookIntroduction || '');
        setHasReadSteps(Boolean(data.hasReadSteps));
        setNumberOfChapters(data.numberOfChapters || 8);
        setCurrentStepIndex(data.currentStepIndex);
        setStepResults(data.stepResults || {});
        setAllContext(data.allContext || {});

        if (data.generatedCharacters?.length) {
          setGeneratedCharacters(data.generatedCharacters);
        }
        setWaitingForCharacterValidation(Boolean(data.waitingForCharacterValidation));
        setWaitingForTitleValidation(Boolean(data.waitingForTitleValidation));
        if (data.titleSuggestions) setTitleSuggestions(data.titleSuggestions);
        if (data.originalTitleScore) setOriginalTitleScore(data.originalTitleScore);
        if (data.selectedTitleIndex !== undefined) setSelectedTitleIndex(data.selectedTitleIndex);

        const restoredP1 = data.allContext?.P1 || data.stepResults?.P1?.result;
        if (restoredP1?.introductionGeneree) setGeneratedIntro(restoredP1.introductionGeneree);
        if (restoredP1?.conclusionGeneree) setGeneratedConclusion(restoredP1.conclusionGeneree);

        const expanded: Record<string, boolean> = {};
        Object.keys(data.stepResults || {}).forEach(stepId => {
          expanded[stepId] = false;
        });
        const lastStepId = workflowSteps[data.currentStepIndex]?.id;
        if (lastStepId) expanded[lastStepId] = true;
        setExpandedSteps(expanded);
      }
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }
  }, []);

  // Save progress after each step
  const saveProgress = useCallback((overrides: Partial<WorkflowProgress> = {}) => {
    const progress: WorkflowProgress = {
      title,
      subtitle,
      category,
      authorName,
      bookIntroduction,
      hasReadSteps,
      numberOfChapters,
      currentStepIndex,
      stepResults,
      allContext,
      savedAt: new Date().toISOString(),
      generatedCharacters,
      waitingForCharacterValidation,
      waitingForTitleValidation,
      titleSuggestions,
      originalTitleScore,
      selectedTitleIndex,
      ...overrides,
    };

    if (progress.currentStepIndex < 0 || Object.keys(progress.stepResults).length === 0) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setSavedProgressSnapshot(progress);
      setHasSavedProgress(true);
      console.log(`📦 Progress saved at step ${progress.currentStepIndex + 1}`);
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [title, subtitle, category, authorName, bookIntroduction, hasReadSteps, numberOfChapters, currentStepIndex, stepResults, allContext, generatedCharacters, waitingForCharacterValidation, waitingForTitleValidation, titleSuggestions, originalTitleScore, selectedTitleIndex]);

  // Auto-save whenever stepResults changes
  useEffect(() => {
    if (Object.keys(stepResults).length > 0) {
      saveProgress();
    }
  }, [stepResults, saveProgress]);

  // Clear saved progress
  const clearSavedProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedProgressSnapshot(null);
    setHasSavedProgress(false);
    toast.success('Sauvegarde supprimée');
  };

  // Reset TOTAL — efface tout le workflow (toutes les clés localStorage liées)
  const resetWorkflowCompletely = () => {
    const keysToRemove = [
      STORAGE_KEY,
      'ebook_workflow_results',
      'ebook_workflow_sync_data',
      'editorial_memory',
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setSavedProgressSnapshot(null);
    setHasSavedProgress(false);
    setTitle('');
    setSubtitle('');
    setCategory('');
    setBookIntroduction('');
    setAuthorName('');
    setNumberOfChapters(8);
    setCurrentStepIndex(-1);
    setStepResults({});
    setAllContext({});
    setError(null);
    setFailedStepIndex(null);
    setGeneratedDescription('');
    setHasReadSteps(false);
    setGeneratedCharacters([]);
    setWaitingForCharacterValidation(false);
    setEditingCharacterIndex(null);
    setWaitingForTitleValidation(false);
    setTitleSuggestions([]);
    setOriginalTitleScore(null);
    setSelectedTitleIndex(null);
    setGeneratedIntro('');
    setGeneratedConclusion('');
    toast.success('Workflow entièrement réinitialisé ! Vous pouvez repartir de zéro.');
  };

  // Restore saved progress
  const restoreSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: WorkflowProgress = JSON.parse(saved);
        setSavedProgressSnapshot(data);
        setTitle(data.title);
        setSubtitle(data.subtitle);
        setCategory(data.category);
        setAuthorName(data.authorName);
        setNumberOfChapters(data.numberOfChapters);
        setCurrentStepIndex(data.currentStepIndex);
        setStepResults(data.stepResults);
        setAllContext(data.allContext);
        setHasReadSteps(true);
        setHasSavedProgress(false);
        
        // Restaurer les personnages si sauvegardés
        if (data.generatedCharacters && data.generatedCharacters.length > 0) {
          setGeneratedCharacters(data.generatedCharacters);
        }
        if (data.waitingForCharacterValidation) {
          setWaitingForCharacterValidation(true);
        }
        if (data.waitingForTitleValidation) {
          setWaitingForTitleValidation(true);
          if (data.titleSuggestions) setTitleSuggestions(data.titleSuggestions);
          if (data.originalTitleScore) setOriginalTitleScore(data.originalTitleScore);
          if (data.selectedTitleIndex !== undefined) setSelectedTitleIndex(data.selectedTitleIndex);
        }
        
        // Expand all completed steps
        const expanded: Record<string, boolean> = {};
        Object.keys(data.stepResults).forEach(stepId => {
          expanded[stepId] = false;
        });
        // Expand the last completed step
        const lastStepId = workflowSteps[data.currentStepIndex]?.id;
        if (lastStepId) expanded[lastStepId] = true;
        setExpandedSteps(expanded);
        
        toast.success(`✅ Progression restaurée (${Object.keys(data.stepResults).length} étapes)`);
      }
    } catch (e) {
      console.error('Error restoring progress:', e);
      toast.error('Erreur lors de la restauration');
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const limitText = (value: unknown, maxLength: number) => {
    if (typeof value !== 'string') return '';
    return value.length > maxLength ? `${value.slice(0, maxLength).trim()}…` : value;
  };

  const buildSlimP4Context = (
    context: Record<string, any>,
    structure: any[],
    generatedChapters: any[]
  ) => ({
    P1: context.P1
      ? {
          descriptionGeneree: context.P1.descriptionGeneree,
          tonEditorial: context.P1.tonEditorial,
          lecteurCible: context.P1.lecteurCible,
        }
      : undefined,
    P2: context.P2
      ? {
          nichePrincipale: context.P2.nichePrincipale,
          motsClésKDP: context.P2.motsClésKDP,
          categoriesKDP: context.P2.categoriesKDP,
        }
      : undefined,
    P3: context.P3
      ? {
          structureGlobale: context.P3.structureGlobale,
          personnages: Array.isArray(context.P3.personnages)
            ? context.P3.personnages.map((character: any) => ({
                name: limitText(character?.name, 80),
                role: limitText(character?.role, 40),
                description: limitText(character?.description, 180),
                arc: limitText(character?.arc, 140),
              }))
            : [],
          chapitres: structure.map((item: any) => ({
            numero: item?.numero,
            titre: limitText(item?.titre || item?.title, 120),
            objectif: limitText(item?.objectif, 180),
            sousSections: Array.isArray(item?.sousSections)
              ? item.sousSections.slice(0, 3).map((section: string) => limitText(section, 90))
              : [],
            pointsCles: Array.isArray(item?.pointsCles)
              ? item.pointsCles.slice(0, 2).map((point: string) => limitText(point, 90))
              : [],
            accroche: limitText(item?.accroche, 140),
            lienAvecPrecedent: limitText(item?.lienAvecPrecedent, 140),
          })),
        }
      : undefined,
    P4: {
      chapitres: generatedChapters.slice(-3).map((chapter: any) => ({
        numero: chapter?.numero,
        titre: limitText(chapter?.titre || chapter?.title, 120),
        contenu: limitText(chapter?.contenu || chapter?.content, 400),
      })),
    },
  });

  const normalizeP3Structure = (rawStructure: any[] = []) => {
    return rawStructure
      .map((item: any, index: number) => {
        const numero = Number(item?.numero) || index + 1;
        const titre = String(item?.titre || item?.title || '').trim();

        if (!titre) return null;

        return {
          ...item,
          numero,
          titre,
          objectif: String(item?.objectif || '').trim(),
          sousSections: Array.isArray(item?.sousSections) ? item.sousSections.filter(Boolean) : [],
          pointsCles: Array.isArray(item?.pointsCles) ? item.pointsCles.filter(Boolean) : [],
          accroche: String(item?.accroche || '').trim(),
          lienAvecPrecedent: String(item?.lienAvecPrecedent || '').trim(),
        };
      })
      .filter(Boolean);
  };

  const p3Structure = normalizeP3Structure((allContext.P3 || stepResults.P3?.result || {})?.chapitres || []);
  const persistedP3Structure = normalizeP3Structure((savedProgressSnapshot?.allContext?.P3 || savedProgressSnapshot?.stepResults?.P3?.result || {})?.chapitres || []);
  const effectiveP3Structure = p3Structure.length > 0 ? p3Structure : persistedP3Structure;
  const persistedHasP4 = Boolean(savedProgressSnapshot?.stepResults?.P4 || savedProgressSnapshot?.allContext?.P4);
  const canResumeAfterP3 = !isGenerating && !waitingForTitleValidation && !waitingForCharacterValidation && p3Structure.length > 0 && !stepResults.P4;
  const savedResumeStepIndex = failedStepIndex !== null
    ? failedStepIndex
    : currentStepIndex >= 0 && currentStepIndex < workflowSteps.length && currentStepIndex < 14
      ? currentStepIndex
      : null;
  const persistedResumeStepIndex = savedProgressSnapshot && savedProgressSnapshot.currentStepIndex >= 0 && savedProgressSnapshot.currentStepIndex < 14
    ? savedProgressSnapshot.currentStepIndex
    : null;
  const effectiveResumeStepIndex = savedResumeStepIndex ?? persistedResumeStepIndex;
  const canResumeAfterP3FromSavedState = !isGenerating && !waitingForTitleValidation && !waitingForCharacterValidation && effectiveP3Structure.length > 0 && !stepResults.P4 && !persistedHasP4;
  const canResumeWorkflow = !isGenerating && !waitingForTitleValidation && !waitingForCharacterValidation && effectiveResumeStepIndex !== null;

  const splitIntoChunks = <T,>(items: T[], chunkCount: number) => {
    if (items.length === 0) return [] as T[][];

    return Array.from({ length: chunkCount }, (_, index) => {
      const start = Math.floor((index * items.length) / chunkCount);
      const end = Math.floor(((index + 1) * items.length) / chunkCount);
      return items.slice(start, end);
    }).filter(chunk => chunk.length > 0);
  };

  const buildP4Segments = (chapter: any, totalChapters: number) => {
    const rawSections = Array.isArray(chapter?.sousSections)
      ? chapter.sousSections.filter(Boolean)
      : [];

    if (totalChapters < 30) {
      return [{ partNumber: 1, totalParts: 1, sectionTitles: rawSections }];
    }

    const fallbackSections = [chapter?.objectif, chapter?.accroche, chapter?.lienAvecPrecedent]
      .filter(Boolean)
      .map((value: string) => String(value).trim());

    const sectionSource = rawSections.length > 0 ? rawSections : fallbackSections;
    const chunks = splitIntoChunks(sectionSource, 2);

    if (chunks.length === 0) {
      return [{ partNumber: 1, totalParts: 2, sectionTitles: [] }, { partNumber: 2, totalParts: 2, sectionTitles: [] }];
    }

    return chunks.map((sectionTitles, index) => ({
      partNumber: index + 1,
      totalParts: chunks.length,
      sectionTitles,
    }));
  };

  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  const mergeChapterSegments = (chapter: any, segments: any[]) => {
    const contenu = segments
      .map(segment => String(segment?.contenu || segment?.content || '').trim())
      .filter(Boolean)
      .join('\n\n');

    return {
      numero: chapter?.numero,
      titre: chapter?.titre || chapter?.title,
      contenu,
      nombreMots: segments.reduce((total, segment) => {
        const explicitCount = Number(segment?.nombreMots);
        return total + (Number.isFinite(explicitCount) && explicitCount > 0 ? explicitCount : countWords(String(segment?.contenu || segment?.content || '')));
      }, 0),
    };
  };

  const runStep = async (
    stepId: string,
    context: Record<string, any>,
    extraBody: Record<string, any> = {},
    options: { previousContextOverride?: Record<string, any> } = {}
  ): Promise<{ result: any; displayContent: string } | null> => {
    // Utiliser les personnages générés en P3 OU ceux passés en externe
    const personnagesP3 = generatedCharacters.length > 0 ? generatedCharacters : context.P3?.personnages || [];
    const charactersForAI = personnagesP3.length > 0
      ? personnagesP3.map((c: any) => ({
          name: c.name,
          description: c.description,
          role: c.role || 'secondary',
          arc: c.arc || ''
        }))
      : externalCharacters.map(c => ({
          name: c.name,
          description: c.description,
          role: c.role || 'secondary'
        }));

    const previousContext = options.previousContextOverride ?? context;

    try {
      // IMPORTANT: pour éviter des payloads énormes (P4 chapitre par chapitre),
      // on peut passer un contexte "slim".

      const { data, error: fnError } = await supabase.functions.invoke('complete-book-workflow', {
          body: {
            step: stepId,
            title,
            subtitle,
            category,
            authorName,
            numberOfChapters,
            bookIntroduction,
            characters: charactersForAI,
            previousContext,
            // Transmettre la clé API utilisateur si disponible et valide
            userApiKey: hasUsableApiKey ? normalizedUserApiKey : undefined,
            useUserKey: hasUsableApiKey,
            ...extraBody,
          }
        });

      if (fnError) {
        const realMessage = (fnError as any)?.context?.json?.error || fnError.message;
        throw new Error(realMessage);
      }
      if (data?.error) throw new Error(data.error);

      return {
        result: data.result,
        displayContent: data.displayContent || 'Résultat généré'
      };
    } catch (err: any) {
      if (stepId === 'P3') {
        const rawMessage = String(err?.message || '');
        const needsFallback =
          rawMessage.includes('non-2xx status code') ||
          rawMessage.includes('P3_STRUCTURE_INCOMPLETE') ||
          rawMessage.includes('failed to send a request to the edge function') ||
          rawMessage.includes('FunctionsFetchError');

        if (needsFallback && !extraBody.forceFallback) {
          console.warn('P3 failed in standard mode, retrying with robust fallback mode.');
          const { data, error: fallbackError } = await supabase.functions.invoke('complete-book-workflow', {
            body: {
              step: stepId,
              title,
              subtitle,
              category,
              authorName,
              numberOfChapters,
              bookIntroduction,
              characters: charactersForAI,
              previousContext,
              userApiKey: hasUsableApiKey ? normalizedUserApiKey : undefined,
              useUserKey: hasUsableApiKey,
              ...extraBody,
              forceFallback: true,
            }
          });

          if (!fallbackError && !data?.error) {
            return {
              result: data.result,
              displayContent: data.displayContent || 'Résultat généré'
            };
          }
        }
      }

      console.error(`Step ${stepId} error:`, err);
      throw err;
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const isTransientError = (err: any) => {
    const msg = String(err?.message || err || '').toLowerCase();
    return (
      msg.includes('timeout') ||
      msg.includes('rate') ||
      msg.includes('429') ||
      msg.includes('503') ||
      msg.includes('502') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('failed to send a request to the edge function')
    );
  };

  const runStepWithRetry = async (
    stepId: string,
    context: Record<string, any>,
    extraBody: Record<string, any> = {},
    options: { previousContextOverride?: Record<string, any> } = {},
    maxRetries: number = 3
  ) => {
    let lastErr: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await runStep(stepId, context, extraBody, options);
      } catch (err: any) {
        lastErr = err;
        if (!isTransientError(err) || attempt === maxRetries) break;

        const backoffMs = 700 * Math.pow(2, attempt - 1);
        toast.info(`⏳ Reprise automatique (${stepId}) — tentative ${attempt + 1}/${maxRetries}…`);
        await sleep(backoffMs);
      }
    }

    throw lastErr;
  };

  // Continuer le workflow après validation des personnages
  const continueAfterCharacterValidation = () => {
    setWaitingForCharacterValidation(false);

    const fallbackSavedProgress = savedProgressSnapshot || readSavedProgressSnapshot();
    const baseP3 = allContext.P3 || stepResults.P3?.result || fallbackSavedProgress?.allContext?.P3 || fallbackSavedProgress?.stepResults?.P3?.result || {};
    const normalizedChapitres = normalizeP3Structure(baseP3.chapitres || []);
    const baseContext = Object.keys(allContext).length > 0 ? allContext : (fallbackSavedProgress?.allContext || {});
    const baseStepResults = Object.keys(stepResults).length > 0 ? stepResults : (fallbackSavedProgress?.stepResults || {});
    const effectiveCharacters = generatedCharacters.length > 0
      ? generatedCharacters
      : Array.isArray(baseP3.personnages)
        ? baseP3.personnages
        : Array.isArray(fallbackSavedProgress?.generatedCharacters)
          ? fallbackSavedProgress.generatedCharacters
        : [];

    if (normalizedChapitres.length === 0) {
      toast.error('La structure P3 est vide ou invalide. Relancez P3 avant de continuer vers P4.');
      setFailedStepIndex(2);
      setError('Structure P3 invalide : aucun chapitre exploitable trouvé.');
      return;
    }

    const updatedP3 = { ...baseP3, chapitres: normalizedChapitres, personnages: effectiveCharacters };
    const nextContext = { ...baseContext, P3: updatedP3 };
    const nextP3State = baseStepResults.P3
      ? { ...baseStepResults.P3, result: updatedP3 }
      : { result: updatedP3, displayContent: 'Structure P3 restaurée depuis la sauvegarde locale.' };
    const nextStepResults = { ...baseStepResults, P3: nextP3State };

    setAllContext(nextContext);
    setStepResults(nextStepResults);

    saveProgress({
      currentStepIndex: 2,
      allContext: nextContext,
      stepResults: nextStepResults,
      generatedCharacters: effectiveCharacters,
      waitingForCharacterValidation: false,
    });

    // Reprendre à partir de P4 (index 3) avec le contexte P3 déjà injecté
    generateCompleteBook(3, { P3: updatedP3 });
  };

  // Continuer le workflow après validation du titre P1
  const continueAfterTitleValidation = () => {
    // Si l'utilisateur a choisi un titre alternatif, on met à jour
    if (selectedTitleIndex !== null && titleSuggestions[selectedTitleIndex]) {
      const chosen = titleSuggestions[selectedTitleIndex];
      setTitle(chosen.titre || chosen.title || title);
      setSubtitle(chosen.sousTitre || chosen.subtitle || subtitle);
      toast.success(`✅ Titre mis à jour : "${chosen.titre || chosen.title}"`);
    }
    // Sauvegarder intro/conclusion dans le contexte P1
    setAllContext(prev => ({
      ...prev,
      P1: {
        ...prev.P1,
        introductionGeneree: generatedIntro,
        conclusionGeneree: generatedConclusion,
      }
    }));
    setWaitingForTitleValidation(false);
    // Reprendre à partir de P2 (index 1)
    generateCompleteBook(1);
  };

  // Éditer un personnage
  const updateCharacter = (index: number, field: keyof GeneratedCharacter, value: string) => {
    setGeneratedCharacters(prev => 
      prev.map((char, i) => i === index ? { ...char, [field]: value } : char)
    );
  };

  // Supprimer un personnage
  const removeCharacter = (index: number) => {
    setGeneratedCharacters(prev => prev.filter((_, i) => i !== index));
  };

  // Ajouter un personnage
  const addCharacter = () => {
    setGeneratedCharacters(prev => [...prev, {
      name: 'Nouveau personnage',
      role: 'secondaire',
      description: 'Description à compléter...',
      arc: ''
    }]);
  };
  const generateCompleteBook = async (resumeFromIndex: number = 0, contextOverride: Record<string, any> = {}) => {
    if (!title.trim() || !authorName.trim() || !category) {
      toast.error('Veuillez remplir le titre, le nom d\'auteur et la catégorie');
      return;
    }

    if (hasApiKeyValidationWarning) {
      toast.warning('⚠️ Votre clé Gemini semble mal formatée ; le workflow utilisera le moteur IA intégré.');
    }

    setIsGenerating(true);
    setError(null);
    setFailedStepIndex(null);
    
    // Si on reprend, on garde le contexte existant, sinon on repart de zéro
    const isResuming = resumeFromIndex > 0;
    if (!isResuming) {
      setCurrentStepIndex(0);
      setStepResults({});
      setExpandedSteps({});
      setAllContext({});
    } else {
      setCurrentStepIndex(resumeFromIndex);
    }
    
    // Récupérer le contexte existant ou en créer un nouveau
    // Réhydrater depuis localStorage + stepResults + allContext + contextOverride
    let context: Record<string, any> = isResuming ? { ...allContext, ...contextOverride } : { ...contextOverride };

    if (isResuming) {
      // 1) Réhydrater depuis localStorage si le contexte React est vide
      if (Object.keys(context).length === 0 || !context.P3) {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const data: WorkflowProgress = JSON.parse(saved);
            if (data.allContext) {
              context = { ...data.allContext, ...context };
            }
            if (data.stepResults) {
              Object.entries(data.stepResults).forEach(([stepId, d]) => {
                if (context[stepId] === undefined) {
                  context[stepId] = d.result;
                }
              });
              // Restaurer aussi stepResults dans React si vide
              if (Object.keys(stepResults).length === 0) {
                setStepResults(data.stepResults);
              }
            }
            console.log('🔄 Context rehydrated from localStorage, keys:', Object.keys(context));
          }
        } catch (e) {
          console.error('Error rehydrating context from localStorage:', e);
        }
      }

      // 2) Compléter depuis stepResults React
      Object.entries(stepResults).forEach(([stepId, data]) => {
        if (context[stepId] === undefined) {
          context[stepId] = data.result;
        }
      });

      console.log('📋 Resume context keys:', Object.keys(context), 'P3 chapitres:', context.P3?.chapitres?.length || 0);
    }
    toast.info(isResuming 
      ? `🔄 Reprise à l'étape ${workflowSteps[resumeFromIndex].id}...` 
      : '🚀 Le Directeur Éditorial lance le workflow complet...'
    );

    let lastStepI = resumeFromIndex;
    try {
      for (let i = resumeFromIndex; i < workflowSteps.length; i++) {
        lastStepI = i;
        const step = workflowSteps[i];
        setCurrentStepIndex(i);

        // Auto-expand current step
        setExpandedSteps(prev => ({ ...prev, [step.id]: true }));

        // P4 est la seule étape potentiellement très longue : on la découpe en requêtes "1 chapitre".
        if (step.id === 'P4') {
          // Try multiple sources for P3 data
          let p3Data = context.P3;
          if (!p3Data?.chapitres || !Array.isArray(p3Data.chapitres) || p3Data.chapitres.length === 0) {
            // Fallback 1: stepResults React state
            if (stepResults.P3?.result?.chapitres) {
              p3Data = stepResults.P3.result;
              context.P3 = p3Data;
              console.log('🔄 P3 récupéré depuis stepResults React');
            }
          }
          if (!p3Data?.chapitres || !Array.isArray(p3Data.chapitres) || p3Data.chapitres.length === 0) {
            // Fallback 2: ebook_workflow_results (separate localStorage key from useWorkflowResults)
            try {
              const workflowResults = localStorage.getItem('ebook_workflow_results');
              if (workflowResults) {
                const parsed = JSON.parse(workflowResults);
                if (parsed.P3?.result?.chapitres) {
                  p3Data = parsed.P3.result;
                  context.P3 = p3Data;
                  console.log('🔄 P3 récupéré depuis ebook_workflow_results');
                }
              }
            } catch (e) {
              console.error('Error reading workflow results for P3 fallback:', e);
            }
          }
          if (!p3Data?.chapitres || !Array.isArray(p3Data.chapitres) || p3Data.chapitres.length === 0) {
            // Fallback 3: savedProgressSnapshot
            const fallback = savedProgressSnapshot || readSavedProgressSnapshot();
            const fallbackP3 = fallback?.allContext?.P3 || fallback?.stepResults?.P3?.result;
            if (fallbackP3?.chapitres) {
              p3Data = fallbackP3;
              context.P3 = p3Data;
              console.log('🔄 P3 récupéré depuis savedProgressSnapshot');
            }
          }

          const structure = normalizeP3Structure(p3Data?.chapitres || []);
          if (!Array.isArray(structure) || structure.length === 0) {
            console.error('P3 context:', JSON.stringify(context.P3)?.substring(0, 500));
            toast.error('⚠️ La structure P3 est vide. Veuillez relancer depuis P3.');
            // Forcer un retry automatique de P3 avant d'abandonner
            toast.info('🔄 Relance automatique de P3...');
            try {
              const p3Retry = await runStep('P3', context);
              const repairedStructure = normalizeP3Structure(p3Retry?.result?.chapitres || []);
              if (repairedStructure.length > 0) {
                context.P3 = { ...p3Retry.result, chapitres: repairedStructure };
                setAllContext(prev => ({ ...prev, P3: p3Retry.result }));
                setStepResults(prev => ({ ...prev, P3: { ...p3Retry, result: context.P3 } }));
                saveStepResult('P3', context.P3, p3Retry.displayContent);
                toast.success('✅ P3 re-généré avec succès, continuation vers P4...');
              } else {
                throw new Error("Structure P3 introuvable même après relance. Veuillez réessayer en cliquant sur 'Relancer'.");
              }
            } catch (retryErr: any) {
              throw new Error("Structure P3 introuvable : impossible de rédiger les chapitres. Cliquez sur 'Relancer' pour réessayer.");
            }
          }

          const retryStructure = normalizeP3Structure(context.P3?.chapitres || []);

          // Récupérer les chapitres déjà générés (si reprise)
          const existingChapters = context.P4?.chapitres || [];
          const chapitresComplets: any[] = [...existingChapters];
          const startFromChapter = existingChapters.length;

          for (let chIdx = startFromChapter; chIdx < retryStructure.length; chIdx++) {
            const chapitre = retryStructure[chIdx];
            const chapterSegments = buildP4Segments(chapitre, retryStructure.length);
            const generatedSegments: any[] = [];

            // Contexte slim pour P4 : inclut les résumés des 3 derniers chapitres générés
            // pour maintenir la cohérence narrative sans exploser la taille du payload
            let partial: { result: any; displayContent: string } | null = null;

            for (const chapterSegment of chapterSegments) {
              const p4SlimContext = buildSlimP4Context(context, retryStructure, chapitresComplets);

              try {
                partial = await runStepWithRetry(
                  'P4',
                  context,
                  {
                    chapter: chapitre,
                    chapterSegment: {
                      partNumber: chapterSegment.partNumber,
                      totalParts: chapterSegment.totalParts,
                      sectionTitles: chapterSegment.sectionTitles,
                      previousParts: generatedSegments,
                    }
                  },
                  { previousContextOverride: p4SlimContext },
                  3
                );
              } catch (err: any) {
                throw new Error(`P4 — Chapitre ${chIdx + 1}/${retryStructure.length} : ${err?.message || 'Erreur inconnue'}`);
              }

              const generatedPart = partial?.result?.chapitrePart || partial?.result?.chapitre;
              if (!generatedPart) {
                throw new Error(`P4 — Chapitre ${chIdx + 1}/${retryStructure.length} : segment vide`);
              }

              generatedSegments.push(generatedPart);
            }

            const chapitreGenere = mergeChapterSegments(chapitre, generatedSegments);
            if (chapitreGenere) chapitresComplets.push(chapitreGenere);

            // UI : on met à jour P4 au fil de l'eau
            const p4DisplayContent = `**📄 Chapitres rédigés : ${chapitresComplets.length}/${retryStructure.length}**\n\nDernier : ${chapitreGenere?.titre || partial?.displayContent || ''}`;
            const nextP4State = {
              result: { chapitres: chapitresComplets, nombreChapitres: chapitresComplets.length },
              displayContent: p4DisplayContent,
            };

            setStepResults(prev => ({
              ...prev,
              P4: nextP4State
            }));
            
            // Sauvegarder le contexte intermédiaire pour la reprise
            context.P4 = { chapitres: chapitresComplets };
            setAllContext(prev => ({ ...prev, P4: context.P4 }));
            
            // Sauvegarder P4 dans le hook global (pour consultation dans onglet individuel)
            saveStepResult('P4', context.P4, p4DisplayContent);
            // Sync cloud
            if (title) saveStepToCloud(title, 'P4', context.P4, p4DisplayContent);
            saveProgress({
              currentStepIndex: i,
              stepResults: { ...stepResults, P4: nextP4State },
              allContext: { ...context, P4: context.P4 },
              waitingForCharacterValidation: false,
            });
          }

          // Collapse previous step, keep current expanded
          if (i > 0) {
            const prevStep = workflowSteps[i - 1];
            setExpandedSteps(prev => ({ ...prev, [prevStep.id]: false }));
          }
        } else {
          const result = await runStepWithRetry(step.id, context, {}, {}, step.id === 'P3' ? 2 : 1);

          // APRÈS P1 : TOUJOURS pause pour valider/choisir le titre best-seller
          // On fait ce check AVANT le if(result) pour garantir l'arrêt même si result est null
          if (step.id === 'P1') {
            if (result) {
              const nextStepResults = { ...stepResults, [step.id]: result };
              const nextContext = { ...context, [step.id]: result.result };

              setStepResults(prev => ({ ...prev, [step.id]: result }));
              context[step.id] = result.result;
              setAllContext(prev => ({ ...prev, [step.id]: result.result }));
              saveStepResult(step.id, result.result, result.displayContent);
              if (title) saveStepToCloud(title, step.id, result.result, result.displayContent);
              
              const suggestions = Array.isArray(result.result?.titresAlternatifs) ? result.result.titresAlternatifs : [];
              const origScore = result.result?.titreOriginal || null;
              setTitleSuggestions(suggestions);
              setOriginalTitleScore(origScore);
              setSelectedTitleIndex(null);
              // Capturer intro/conclusion générées
              if (result.result?.introductionGeneree) setGeneratedIntro(result.result.introductionGeneree);
              if (result.result?.conclusionGeneree) setGeneratedConclusion(result.result.conclusionGeneree);

              setWaitingForTitleValidation(true);
              setIsGenerating(false);
              saveProgress({
                currentStepIndex: i,
                stepResults: nextStepResults,
                allContext: nextContext,
                waitingForTitleValidation: true,
                waitingForCharacterValidation: false,
                titleSuggestions: suggestions,
                originalTitleScore: origScore,
                selectedTitleIndex: null,
              });
              toast.info('📊 Analyse du titre terminée ! Choisissez votre titre best-seller avant de continuer.');
              return; // STOP — l'utilisateur doit valider avant P2
            }
            setWaitingForTitleValidation(true);
            setIsGenerating(false);
            saveProgress({ waitingForTitleValidation: true, waitingForCharacterValidation: false });
            toast.info('📊 Analyse du titre terminée ! Choisissez votre titre best-seller avant de continuer.');
            return; // STOP — l'utilisateur doit valider avant P2
          }

          if (result) {
            // Store result locally
            setStepResults(prev => ({ ...prev, [step.id]: result }));
            context[step.id] = result.result;
            setAllContext(prev => ({ ...prev, [step.id]: result.result }));
            
            // SAUVEGARDER dans le hook global pour consultation dans les onglets individuels
            saveStepResult(step.id, result.result, result.displayContent);
            // Sync cloud
            if (title) saveStepToCloud(title, step.id, result.result, result.displayContent);

            // Collapse previous step, keep current expanded
            if (i > 0) {
              const prevStep = workflowSteps[i - 1];
              setExpandedSteps(prev => ({ ...prev, [prevStep.id]: false }));
            }
            
            // APRÈS P3 : TOUJOURS marquer une pause pour valider les personnages avant P4
            // Même si 0 personnages, on laisse l'utilisateur vérifier et ajouter des personnages si besoin
            if (step.id === 'P3') {
              const personnagesP3 = Array.isArray(result.result?.personnages) ? result.result.personnages : [];
              const nextStepResults = { ...stepResults, [step.id]: result };
              const nextContext = { ...context, [step.id]: result.result };

              setGeneratedCharacters(personnagesP3);
              setWaitingForCharacterValidation(true);
              setIsGenerating(false);
              saveProgress({
                currentStepIndex: i,
                stepResults: nextStepResults,
                allContext: nextContext,
                generatedCharacters: personnagesP3,
                waitingForCharacterValidation: true,
                waitingForTitleValidation: false,
              });
              toast.info(personnagesP3.length > 0
                ? '🎭 Personnages générés ! Validez-les ou modifiez-les avant la rédaction.'
                : '✅ Structure générée ! Vous pouvez ajouter des personnages ou continuer directement.');
              return; // Pause le workflow - l'utilisateur doit cliquer pour continuer
            }
          }
        }

        // Small delay between steps to avoid rate limiting
        if (i < workflowSteps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // All steps complete
      setCurrentStepIndex(15);
      setFailedStepIndex(null);
      
      // Build final book data
      const bookData = {
        title,
        subtitle,
        authorName,
        category,
        numberOfChapters,
        // Description auto-générée par P1 (à réinjecter dans le planner)
        bookDescription: context.P1?.descriptionGeneree || '',
        preface: context.P7?.descriptionKDP || '',
        bookSynopsis: context.P1?.promesseCentrale || '',
        chapters: (context.P4?.chapitres || context.P5?.chapitresFinal || []).map((ch: any, idx: number) => ({
          number: ch.numero || idx + 1,
          title: ch.titre || ch.title || `Chapitre ${idx + 1}`,
          content: ch.contenu || ch.content || ''
        })),
        conclusion: context.P8?.verdict || '',
        marketPositioning: context.P2 || {},
        backCover: {
          description: context.P7?.descriptionKDP || '',
          accroche: context.P7?.accroche4emeCouverture || ''
        },
        styleSignature: context.P13 || {},
        finalVerdict: context.P14 || {},
        qualityScores: context.P6 || {}
      };

      // Clear saved progress on success
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedProgress(false);

      toast.success('✅ Livre généré ! Le contenu a été importé dans l\'onglet "Rédaction".');
      onComplete(bookData);

    } catch (err: any) {
      console.error('Workflow error:', err);
      setFailedStepIndex(lastStepI);
      setError(err.message || 'Erreur lors de la génération');
      // Save progress on error so user can resume
      saveProgress();
      toast.error(`Erreur à l'étape ${workflowSteps[lastStepI]?.id}: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const resumeFromFailedStep = () => {
    if (failedStepIndex !== null && failedStepIndex >= 0) {
      // Réhydrater depuis localStorage si le contexte React est vide
      let extraContext: Record<string, any> = {};
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data: WorkflowProgress = JSON.parse(saved);
          // Restaurer les stepResults si l'état React est vide
          if (Object.keys(stepResults).length === 0 && data.stepResults && Object.keys(data.stepResults).length > 0) {
            setStepResults(data.stepResults);
            Object.entries(data.stepResults).forEach(([stepId, d]) => {
              extraContext[stepId] = d.result;
            });
          }
          // Restaurer allContext si vide
          if (Object.keys(allContext).length === 0 && data.allContext && Object.keys(data.allContext).length > 0) {
            setAllContext(data.allContext);
            extraContext = { ...data.allContext, ...extraContext };
          }
        }
      } catch (e) {
        console.error('Error rehydrating from localStorage:', e);
      }
      generateCompleteBook(failedStepIndex, extraContext);
    }
  };

  const resumeWorkflowFromProgress = () => {
    let resumeIndex = effectiveResumeStepIndex;
    let extraContext: Record<string, any> = {};

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: WorkflowProgress = JSON.parse(saved);
        if (resumeIndex === null && data.currentStepIndex >= 0 && data.currentStepIndex < workflowSteps.length) {
          resumeIndex = data.currentStepIndex;
        }

        if (data.stepResults && Object.keys(stepResults).length === 0) {
          setStepResults(data.stepResults);
          Object.entries(data.stepResults).forEach(([stepId, d]) => {
            extraContext[stepId] = d.result;
          });
        }

        if (data.allContext) {
          if (Object.keys(allContext).length === 0) {
            setAllContext(data.allContext);
          }
          extraContext = { ...data.allContext, ...extraContext };
        }
      }
    } catch (e) {
      console.error('Error resuming workflow from progress:', e);
    }

    if (resumeIndex === null) {
      toast.error('Aucune étape à reprendre pour le moment.');
      return;
    }

    if (resumeIndex <= 2 && effectiveP3Structure.length > 0 && !stepResults.P4 && !persistedHasP4) {
      continueAfterCharacterValidation();
      return;
    }

    generateCompleteBook(resumeIndex, extraContext);
  };

  // Estimation réaliste : 3000-4000 mots/chapitre = ~12-16 pages/chapitre
  const estimatedPages = Math.round(numberOfChapters * 15);

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold mt-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('**')) {
          const parts = line.split('**');
          return (
            <p key={i} className="mt-1">
              {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
            </p>
          );
        }
        if (line.startsWith('_') && line.endsWith('_')) {
          return <p key={i} className="italic text-muted-foreground mt-2">{line.slice(1, -1)}</p>;
        }
        if (line.startsWith('✓') || line.startsWith('✗') || line.startsWith('•') || line.startsWith('⚠️') || line.startsWith('✦') || line.startsWith('→')) {
          return <p key={i} className="ml-4 mt-1">{line}</p>;
        }
        if (line.startsWith('---')) {
          return <hr key={i} className="my-4 border-border" />;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="mt-1">{line}</p>;
      });
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
            <Sparkles className="h-4 w-4" />
            Workflow IA Éditorial Complet
          </div>
          {/* Bandeau motivationnel */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg px-4 py-3 mb-4 text-sm">
            {projectCount !== null && projectCount > 0 ? (
              <p>👉 {projectCount} projets créés — lancez le prochain 🚀</p>
            ) : (
              <p>✨ Votre ebook peut être prêt en quelques minutes — commencez maintenant.</p>
            )}
          </div>
           <CardTitle className="text-2xl font-bold text-foreground">
            Créer votre livre en 1 clic
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Entrez les informations, puis lancez le workflow. Vous verrez le contenu de chaque étape en temps réel.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CTA Principal */}
          <Button
            type="button"
            onClick={() => {
              const titleInput = document.getElementById('title');
              if (titleInput) titleInput.focus();
            }}
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-shadow duration-500"
          >
            🚀 Commencer mon ebook maintenant
          </Button>
          <p className="text-xs text-muted-foreground text-center">Plan structuré + contenu généré automatiquement.</p>

          {/* Guidage visuel */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 animate-fade-in">
            <span>👇</span>
            <span>Étape 1 — Entrez le titre pour lancer votre ebook</span>
          </div>

          {/* Form Fields - Row 1: Title & Subtitle */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Titre du livre *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Elle faisait partie de la famille"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isGenerating}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-primary" />
                Sous-titre (optionnel)
              </Label>
              <Input
                id="subtitle"
                placeholder="Ex: L'histoire vraie d'une chienne extraordinaire"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Form Fields - Row 2: Category & Author */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Catégorie / Genre *
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez une catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction-litteraire">📚 Fiction littéraire</SelectItem>
                  <SelectItem value="romance">💕 Romance</SelectItem>
                  <SelectItem value="thriller-policier">🔍 Thriller / Policier</SelectItem>
                  <SelectItem value="science-fiction">🚀 Science-Fiction</SelectItem>
                  <SelectItem value="fantasy">🐉 Fantasy / Fantastique</SelectItem>
                  <SelectItem value="horreur">👻 Horreur</SelectItem>
                  <SelectItem value="historique">🏛️ Roman historique</SelectItem>
                  <SelectItem value="biographie-memoires">📖 Biographie / Mémoires</SelectItem>
                  <SelectItem value="temoignage">💬 Témoignage / Récit de vie</SelectItem>
                  <SelectItem value="developpement-personnel">🧠 Développement personnel</SelectItem>
                  <SelectItem value="business-entrepreneuriat">💼 Business / Entrepreneuriat</SelectItem>
                  <SelectItem value="sante-bien-etre">🌿 Santé / Bien-être</SelectItem>
                  <SelectItem value="cuisine">🍳 Cuisine / Recettes</SelectItem>
                  <SelectItem value="voyage">✈️ Voyage / Guide</SelectItem>
                  <SelectItem value="enfants-jeunesse">👶 Enfants / Jeunesse</SelectItem>
                  <SelectItem value="animaux">🐕 Animaux / Récit animalier</SelectItem>
                  <SelectItem value="spiritualite">🙏 Spiritualité / Religion</SelectItem>
                  <SelectItem value="education">📝 Éducation / Pédagogie</SelectItem>
                  <SelectItem value="jardinage">🌱 Jardinage</SelectItem>
                  <SelectItem value="jardin-bio">🌿 Jardin Bio</SelectItem>
                  <SelectItem value="permaculture">🌾 Permaculture</SelectItem>
                  <SelectItem value="potager">🥕 Potager</SelectItem>
                  <SelectItem value="bricolage">🔨 Bricolage</SelectItem>
                  <SelectItem value="autre">📦 Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nom d'auteur *
              </Label>
              <Input
                id="author"
                placeholder="Ex: Jean Dupont"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isGenerating}
                className="text-lg"
              />
            </div>
          </div>

          {/* Introduction / Vision du livre */}
          <div className="space-y-2">
            <Label htmlFor="book-introduction" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Introduction — Décrivez votre vision du livre *
            </Label>
            <Textarea
              id="book-introduction"
              placeholder="Décrivez ce que vous voulez pour ce livre : le thème principal, le message que vous souhaitez transmettre, le style d'écriture souhaité, les points clés à aborder, votre public cible, ce qui rend ce livre unique..."
              value={bookIntroduction}
              onChange={(e) => setBookIntroduction(e.target.value)}
              disabled={isGenerating}
              className="min-h-[120px] text-sm"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              💡 Plus vous êtes précis ici, plus le résultat sera fidèle à votre vision. L'IA utilisera cette description pour guider chaque étape du workflow.
            </p>
          </div>

          {/* Chapters Slider */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Nombre de chapitres
              </Label>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {numberOfChapters} chapitres
                </Badge>
                <Badge variant="outline" className="text-sm">
                  ~{estimatedPages} pages
                </Badge>
              </div>
            </div>
            <Slider
              value={[numberOfChapters]}
              onValueChange={(value) => setNumberOfChapters(value[0])}
              min={3}
              max={50}
              step={1}
              disabled={isGenerating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 chapitres (court)</span>
              <span>20 chapitres (long)</span>
            </div>
          </div>

          {/* API Key Status Indicator */}
          <div className={`flex items-start space-x-3 p-4 rounded-lg border ${hasStrictlyValidatedApiKey ? 'bg-green-500/10 border-green-500/30' : hasUsableApiKey ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <Key className={`h-5 w-5 mt-0.5 ${hasStrictlyValidatedApiKey ? 'text-green-600' : hasUsableApiKey ? 'text-amber-600' : 'text-red-500'}`} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${hasStrictlyValidatedApiKey ? 'text-green-700' : hasUsableApiKey ? 'text-amber-700' : 'text-red-600'}`}>
                  {hasStrictlyValidatedApiKey
                    ? '🔑 Votre clé API Gemini est active'
                    : hasUsableApiKey
                      ? '🔑 Clé détectée, lancement autorisé'
                      : '🔑 Clé API Gemini requise'}
                </span>
                <Badge
                  variant="outline"
                  className={hasStrictlyValidatedApiKey ? 'bg-green-100 text-green-700 border-green-300' : hasUsableApiKey ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-red-100 text-red-700 border-red-300'}
                >
                  {hasStrictlyValidatedApiKey ? 'Prêt' : hasUsableApiKey ? 'À vérifier' : 'Bloqué'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {hasStrictlyValidatedApiKey
                    ? 'Les coûts de génération seront facturés directement sur votre compte Gemini (~0,30€ par livre).'
                  : hasUsableApiKey
                    ? 'Une clé Gemini valide est bien présente. Le workflow peut démarrer.'
                    : 'Configurez une clé Gemini commençant par AIza dans l\'onglet "Paramètres" pour générer votre livre. Les anciens formats de clé ne sont plus acceptés.'}
              </p>
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Checkbox
              id="hasReadSteps"
              checked={hasReadSteps}
              onCheckedChange={(checked) => setHasReadSteps(checked === true)}
              disabled={isGenerating}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label 
                htmlFor="hasReadSteps" 
                className="text-sm font-medium cursor-pointer leading-tight"
              >
                ✅ J'ai lu et compris les 14 étapes du workflow éditorial
              </Label>
              <p className="text-xs text-muted-foreground">
                Je comprends que le système capture MA voix d'auteur (P9) et unifie mon style (P13) pour un résultat humain et naturel, pas robotique.
              </p>
            </div>
          </div>

          {/* Saved Progress Banner */}
          {hasSavedProgress && currentStepIndex < 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      Une session précédente a été sauvegardée
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez reprendre là où vous vous étiez arrêté
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={restoreSavedProgress}
                    className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSavedProgress}
                  >
                    Ignorer
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bouton Reset Total */}
          {(hasSavedProgress || currentStepIndex >= 0 || Object.keys(stepResults).length > 0) && (
            <div className="text-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('⚠️ Supprimer TOUT le workflow en mémoire et repartir de zéro ?')) {
                    resetWorkflowCompletely();
                  }
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Réinitialisation complète (repartir de zéro)
              </Button>
            </div>
          )}

          {/* Generate Button */}
          {currentStepIndex < 0 && (
            <motion.div
              whileHover={{ scale: canGenerate ? 1.02 : 1 }}
              whileTap={{ scale: canGenerate ? 0.98 : 1 }}
              className="text-center space-y-3"
            >
              <Button
                type="button"
                size="lg"
                onClick={() => generateCompleteBook(0)}
                disabled={!canGenerate}
                className="gap-3 px-10 py-7 text-lg font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 hover:from-primary/90 hover:via-amber-500/90 hover:to-orange-500/90 shadow-xl shadow-primary/30 transition-all duration-300 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="h-6 w-6" />
                Lancer la génération complète
              </Button>
              
              {!title.trim() || !authorName.trim() || !category ? (
                <p className="text-sm text-destructive">
                  ⚠️ Veuillez remplir le titre, la catégorie et le nom d'auteur
                </p>
              ) : !bookIntroduction.trim() ? (
                <p className="text-sm text-destructive">
                  ⚠️ Veuillez décrire votre vision du livre dans le champ Introduction
                </p>
              ) : !hasReadSteps ? (
                <p className="text-sm text-amber-600">
                  ⚠️ Veuillez cocher la case ci-dessus pour confirmer que vous avez lu les 14 étapes
                </p>
              ) : hasApiKeyValidationWarning ? (
                <p className="text-sm text-amber-600">
                  ⚠️ La clé Gemini enregistrée semble invalide ; le workflow basculera automatiquement sur le backend intégré.
                </p>
              ) : null}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Title Validation Card - After P1 */}
      {waitingForTitleValidation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-background to-amber-500/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">📊 Choisissez votre titre best-seller</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez le titre qui fera décoller votre livre sur Amazon
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  Étape P1 → P2
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Titre original avec score */}
              {originalTitleScore && (
                <div 
                  onClick={() => setSelectedTitleIndex(null)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTitleIndex === null 
                      ? 'border-primary bg-primary/10 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {selectedTitleIndex === null && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      <Badge variant="secondary">Votre titre actuel</Badge>
                    </div>
                    <Badge className={`text-lg px-3 py-1 ${
                      (originalTitleScore.scoreTotal || 0) >= 80 ? 'bg-green-500' : 
                      (originalTitleScore.scoreTotal || 0) >= 60 ? 'bg-amber-500' : 'bg-destructive'
                    } text-white`}>
                      {originalTitleScore.scoreTotal || '?'}/100
                    </Badge>
                  </div>
                  <p className="font-bold text-lg">{originalTitleScore.titre || title}</p>
                  {(originalTitleScore.sousTitre || subtitle) && (
                    <p className="text-muted-foreground">{originalTitleScore.sousTitre || subtitle}</p>
                  )}
                  {originalTitleScore.verdict && (
                    <p className="text-sm mt-2 text-muted-foreground italic">{originalTitleScore.verdict}</p>
                  )}
                </div>
              )}

              {/* Titres alternatifs */}
              {titleSuggestions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">✨ Titres alternatifs suggérés :</p>
                  {titleSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedTitleIndex(index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTitleIndex === index 
                          ? 'border-primary bg-primary/10 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {selectedTitleIndex === index && <CheckCircle2 className="h-5 w-5 text-primary" />}
                          <Badge variant="outline">Option {index + 1}</Badge>
                          {suggestion.angle && <Badge variant="secondary" className="text-xs">{suggestion.angle}</Badge>}
                        </div>
                        <Badge className={`text-lg px-3 py-1 ${
                          (suggestion.scoreTotal || 0) >= 80 ? 'bg-green-500' : 
                          (suggestion.scoreTotal || 0) >= 60 ? 'bg-amber-500' : 'bg-destructive'
                        } text-white`}>
                          {suggestion.scoreTotal || '?'}/100
                        </Badge>
                      </div>
                      <p className="font-bold text-lg">{suggestion.titre || suggestion.title}</p>
                      {(suggestion.sousTitre || suggestion.subtitle) && (
                        <p className="text-muted-foreground">{suggestion.sousTitre || suggestion.subtitle}</p>
                      )}
                      {suggestion.justification && (
                        <p className="text-sm mt-2 text-muted-foreground italic">{suggestion.justification}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Ou saisir un titre personnalisé */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-3 border border-dashed border-muted-foreground/30">
                <p className="text-sm font-medium text-foreground">✏️ Ou modifiez directement :</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Titre</Label>
                    <Input
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setSelectedTitleIndex(null); }}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Sous-titre</Label>
                    <Input
                      value={subtitle}
                      onChange={(e) => { setSubtitle(e.target.value); setSelectedTitleIndex(null); }}
                    />
                  </div>
                </div>
              </div>

              {/* Introduction générée - modifiable */}
              {generatedIntro && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2 border border-dashed border-primary/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">📝 Introduction générée (modifiable)</p>
                  </div>
                  <Textarea
                    value={generatedIntro}
                    onChange={(e) => setGeneratedIntro(e.target.value)}
                    className="min-h-[150px] text-sm"
                    placeholder="L'introduction de votre livre..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Cette introduction sera intégrée au début de votre livre. Modifiez-la librement.
                  </p>
                </div>
              )}

              {/* Conclusion générée - modifiable */}
              {generatedConclusion && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2 border border-dashed border-primary/30">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">🎯 Conclusion générée (modifiable)</p>
                  </div>
                  <Textarea
                    value={generatedConclusion}
                    onChange={(e) => setGeneratedConclusion(e.target.value)}
                    className="min-h-[120px] text-sm"
                    placeholder="La conclusion de votre livre..."
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  size="lg"
                  onClick={continueAfterTitleValidation}
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-amber-500"
                >
                  <Rocket className="h-5 w-5" />
                  {selectedTitleIndex !== null 
                    ? `Utiliser "${(titleSuggestions[selectedTitleIndex]?.titre || '').substring(0, 30)}..." et continuer`
                    : 'Garder mon titre et continuer (P2 → P15)'
                  }
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Le titre et l'introduction choisis seront utilisés pour toute la suite du workflow
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Character Validation Card - After P3 */}
      {waitingForCharacterValidation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">🎭 Personnages générés</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Vérifiez et modifiez les personnages avant la rédaction
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-500">
                  Étape P3 → P4
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {generatedCharacters.length === 0 ? (
                <div className="p-4 bg-background/80 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Aucun personnage n'a été détecté pour l'étape P3. Vous pouvez continuer directement (ou en ajouter si besoin).
                  </p>
                </div>
              ) : (
                generatedCharacters.map((char, index) => (
                <div 
                  key={index}
                  className="p-4 bg-background/80 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Nom</Label>
                        <Input
                          value={char.name}
                          onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                          className="font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Rôle</Label>
                        <Select 
                          value={char.role} 
                          onValueChange={(v) => updateCharacter(index, 'role', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="protagoniste">👤 Protagoniste</SelectItem>
                            <SelectItem value="antagoniste">🦹 Antagoniste</SelectItem>
                            <SelectItem value="secondaire">👥 Secondaire</SelectItem>
                            <SelectItem value="mentor">🎓 Mentor</SelectItem>
                            <SelectItem value="narrateur">📖 Narrateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeCharacter(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Textarea
                      value={char.description}
                      onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  
                  {char.arc && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Arc narratif</Label>
                      <Textarea
                        value={char.arc}
                        onChange={(e) => updateCharacter(index, 'arc', e.target.value)}
                        rows={2}
                        className="resize-none text-sm"
                      />
                    </div>
                  )}
                </div>
                ))
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addCharacter}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un personnage
              </Button>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  size="lg"
                  onClick={continueAfterCharacterValidation}
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-amber-500"
                >
                  <Rocket className="h-5 w-5" />
                  Valider et continuer (P4 → P14)
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Ces personnages seront utilisés dans tous les chapitres de votre livre
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {(canResumeAfterP3 || canResumeAfterP3FromSavedState) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-primary/30 bg-muted/20">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">La structure P3 est prête.</p>
                <p className="text-sm text-muted-foreground">
                  Le bouton de validation a été masqué, mais vous pouvez reprendre directement à la rédaction P4.
                </p>
              </div>

              <Button
                size="lg"
                onClick={continueAfterCharacterValidation}
                className="w-full gap-2"
              >
                <Rocket className="h-5 w-5" />
                Continuer vers P4
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {canResumeWorkflow && !(canResumeAfterP3 || canResumeAfterP3FromSavedState) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-primary/30 bg-muted/20">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Une reprise est disponible.</p>
                <p className="text-sm text-muted-foreground">
                  Votre progression est sauvegardée. Vous pouvez relancer le workflow depuis l'étape {workflowSteps[effectiveResumeStepIndex ?? 0]?.id}.
                </p>
              </div>

              <Button
                size="lg"
                onClick={resumeWorkflowFromProgress}
                className="w-full gap-2"
              >
                <Rocket className="h-5 w-5" />
                Reprendre le workflow
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Workflow Steps Card - Always visible */}
      <Card className="border border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Les 14 étapes du Directeur Éditorial
          </CardTitle>
          
          {/* Progress bar */}
          {currentStepIndex >= 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {currentStepIndex >= 14 ? 'Terminé !' : `Étape ${currentStepIndex + 1} sur 14`}
                </span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Steps List with Real Content */}
          {workflowSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = isGenerating && index === currentStepIndex;
            const isCompleted = stepResults[step.id] !== undefined;
            const stepData = stepResults[step.id];
            const isExpanded = expandedSteps[step.id] || false;
            
            return (
              <Collapsible
                key={step.id}
                open={isExpanded}
                onOpenChange={() => isCompleted && toggleStep(step.id)}
              >
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: isCompleted || isActive ? 1 : (currentStepIndex >= 0 ? 0.4 : 1),
                    scale: isActive ? 1.01 : 1
                  }}
                  className={`
                    rounded-lg transition-all overflow-hidden
                    ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                    ${isActive ? 'bg-primary/10 border border-primary/30 shadow-md' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted/20 border border-muted/30' : ''}
                  `}
                >
                  <CollapsibleTrigger asChild>
                    <div className={`flex items-center gap-3 p-3 ${isCompleted ? 'cursor-pointer hover:bg-green-500/20' : ''}`}>
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isActive ? 'bg-primary text-white animate-pulse' : ''}
                        ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={isCompleted ? 'default' : isActive ? 'secondary' : 'outline'} 
                            className="text-xs"
                          >
                            {step.id}
                          </Badge>
                          <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                            {step.name}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {step.description}
                        </p>
                      </div>

                      {isActive && (
                        <div className="text-xs text-primary font-medium animate-pulse">
                          En cours...
                        </div>
                      )}
                      
                      {isCompleted && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-green-600">
                            Terminé
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    {stepData && (
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                      <div className="bg-background/50 rounded-lg p-4 text-sm text-foreground prose prose-sm dark:prose-invert max-w-none">
                          {renderMarkdown(stepData.displayContent)}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </motion.div>
              </Collapsible>
            );
          })}

          {/* Final Success Message */}
          {currentStepIndex >= 14 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-center mt-4"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-xl text-green-700 dark:text-green-400">
                Livre généré avec succès !
              </p>
              <p className="text-muted-foreground mt-2">
                Cliquez sur chaque étape pour vérifier le contenu généré.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Le Verdict Éditeur Ultime a validé votre projet.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Error Display with Resume Button */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-destructive">
                Erreur à l'étape {failedStepIndex !== null ? workflowSteps[failedStepIndex]?.id : '?'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {/* Bouton principal : Reprendre */}
                {failedStepIndex !== null && failedStepIndex >= 0 && (
                  <Button 
                    size="sm" 
                    className="gap-2 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                    onClick={resumeFromFailedStep}
                    disabled={isGenerating}
                  >
                    <Rocket className="h-4 w-4" />
                    Reprendre à {workflowSteps[failedStepIndex]?.id}
                  </Button>
                )}
                
                {/* Bouton secondaire : Tout recommencer */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    resetWorkflowCompletely();
                  }}
                >
                  Tout recommencer
                </Button>
              </div>
              
              {failedStepIndex !== null && Object.keys(stepResults).length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  ✓ {Object.keys(stepResults).length} étape(s) déjà terminée(s) seront conservées
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EbookCompleteWorkflow;