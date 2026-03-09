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
  // La clé API utilisateur est OBLIGATOIRE pour générer
  const hasValidApiKey = isUserKeyValid && !!userApiKey;
  const canGenerate = title.trim() && authorName.trim() && category && bookIntroduction.trim() && hasReadSteps && hasValidApiKey;

  // Load saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: WorkflowProgress = JSON.parse(saved);
        // Only restore if there's actual progress
        if (data.currentStepIndex >= 0 && Object.keys(data.stepResults).length > 0) {
          setHasSavedProgress(true);
        }
      }
    } catch (e) {
      console.error('Error loading saved progress:', e);
    }
  }, []);

  // Save progress after each step
  const saveProgress = useCallback(() => {
    if (currentStepIndex < 0 || Object.keys(stepResults).length === 0) return;
    
    const progress: WorkflowProgress = {
      title,
      subtitle,
      category,
      authorName,
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
      selectedTitleIndex
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      console.log(`📦 Progress saved at step ${currentStepIndex + 1}`);
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }, [title, subtitle, category, authorName, numberOfChapters, currentStepIndex, stepResults, allContext, generatedCharacters, waitingForCharacterValidation, waitingForTitleValidation, titleSuggestions, originalTitleScore, selectedTitleIndex]);

  // Auto-save whenever stepResults changes
  useEffect(() => {
    if (Object.keys(stepResults).length > 0) {
      saveProgress();
    }
  }, [stepResults, saveProgress]);

  // Clear saved progress
  const clearSavedProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedProgress(false);
    toast.success('Sauvegarde supprimée');
  };

  // Restore saved progress
  const restoreSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: WorkflowProgress = JSON.parse(saved);
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

  const runStep = async (
    stepId: string,
    context: Record<string, any>,
    extraBody: Record<string, any> = {},
    options: { previousContextOverride?: Record<string, any> } = {}
  ): Promise<{ result: any; displayContent: string } | null> => {
    try {
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

      // IMPORTANT: pour éviter des payloads énormes (P4 chapitre par chapitre),
      // on peut passer un contexte "slim".
      const previousContext = options.previousContextOverride ?? context;

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
            userApiKey: isUserKeyValid ? userApiKey : undefined,
            useUserKey: isUserKeyValid && !!userApiKey,
            ...extraBody,
          }
        });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      return {
        result: data.result,
        displayContent: data.displayContent || 'Résultat généré'
      };
    } catch (err: any) {
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
      msg.includes('failed to fetch')
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
    // Mettre à jour le contexte P3 avec les personnages modifiés
    const updatedP3 = { ...allContext.P3, personnages: generatedCharacters };
    setAllContext(prev => ({ ...prev, P3: updatedP3 }));
    // Reprendre à partir de P4 (index 3)
    generateCompleteBook(3);
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
  const generateCompleteBook = async (resumeFromIndex: number = 0) => {
    if (!title.trim() || !authorName.trim() || !category) {
      toast.error('Veuillez remplir le titre, le nom d\'auteur et la catégorie');
      return;
    }

    // Vérifier que l'utilisateur a configuré sa clé API
    if (!hasValidApiKey) {
      toast.error('🔑 Veuillez configurer votre clé API Gemini dans l\'onglet "Paramètres" avant de générer.');
      return;
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
    // NOTE: en cas de pause après P3 (validation des personnages), React peut ne pas avoir flushé `allContext`.
    // On ré-hydrate donc depuis `stepResults` pour éviter un blocage à P4.
    const context: Record<string, any> = isResuming ? { ...allContext } : {};

    if (isResuming) {
      Object.entries(stepResults).forEach(([stepId, data]) => {
        if (context[stepId] === undefined) {
          context[stepId] = data.result;
        }
      });
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
          const structure = context.P3?.chapitres || [];
          if (!Array.isArray(structure) || structure.length === 0) {
            console.error('P3 context:', JSON.stringify(context.P3)?.substring(0, 500));
            toast.error('⚠️ La structure P3 est vide. Veuillez relancer depuis P3.');
            // Forcer un retry automatique de P3 avant d'abandonner
            toast.info('🔄 Relance automatique de P3...');
            try {
              const p3Retry = await runStep('P3', context);
              if (p3Retry?.result?.chapitres?.length > 0) {
                context.P3 = p3Retry.result;
                setAllContext(prev => ({ ...prev, P3: p3Retry.result }));
                setStepResults(prev => ({ ...prev, P3: p3Retry }));
                saveStepResult('P3', p3Retry.result, p3Retry.displayContent);
                toast.success('✅ P3 re-généré avec succès, continuation vers P4...');
              } else {
                throw new Error("Structure P3 introuvable même après relance. Veuillez réessayer en cliquant sur 'Relancer'.");
              }
            } catch (retryErr: any) {
              throw new Error("Structure P3 introuvable : impossible de rédiger les chapitres. Cliquez sur 'Relancer' pour réessayer.");
            }
          }

          const retryStructure = context.P3?.chapitres || [];

          // Récupérer les chapitres déjà générés (si reprise)
          const existingChapters = context.P4?.chapitres || [];
          const chapitresComplets: any[] = [...existingChapters];
          const startFromChapter = existingChapters.length;

          for (let chIdx = startFromChapter; chIdx < retryStructure.length; chIdx++) {
            const chapitre = retryStructure[chIdx];

            // Contexte slim pour P4 : inclut les résumés des 3 derniers chapitres générés
            // pour maintenir la cohérence narrative sans exploser la taille du payload
            const derniersCh = chapitresComplets.slice(-3).map((ch: any) => ({
              numero: ch.numero,
              titre: ch.titre,
              contenu: (ch.contenu || ch.content || '').substring(0, 400),
            }));
            const p4SlimContext: Record<string, any> = {
              P1: context.P1,
              P2: context.P2,
              P3: context.P3,
              P4: { chapitres: derniersCh },
            };

            let partial: { result: any; displayContent: string } | null = null;
            try {
              partial = await runStepWithRetry(
                'P4',
                context,
                { chapter: chapitre },
                { previousContextOverride: p4SlimContext },
                3
              );
            } catch (err: any) {
              throw new Error(`P4 — Chapitre ${chIdx + 1}/${retryStructure.length} : ${err?.message || 'Erreur inconnue'}`);
            }
            const chapitreGenere = partial?.result?.chapitre;
            if (chapitreGenere) chapitresComplets.push(chapitreGenere);

            // UI : on met à jour P4 au fil de l'eau
            const p4DisplayContent = `**📄 Chapitres rédigés : ${chapitresComplets.length}/${retryStructure.length}**\n\nDernier : ${partial?.displayContent || ''}`;
            setStepResults(prev => ({
              ...prev,
              P4: {
                result: { chapitres: chapitresComplets, nombreChapitres: chapitresComplets.length },
                displayContent: p4DisplayContent,
              }
            }));
            
            // Sauvegarder le contexte intermédiaire pour la reprise
            context.P4 = { chapitres: chapitresComplets };
            setAllContext(prev => ({ ...prev, P4: context.P4 }));
            
            // Sauvegarder P4 dans le hook global (pour consultation dans onglet individuel)
            saveStepResult('P4', context.P4, p4DisplayContent);
            // Sync cloud
            if (title) saveStepToCloud(title, 'P4', context.P4, p4DisplayContent);
          }

          // Collapse previous step, keep current expanded
          if (i > 0) {
            const prevStep = workflowSteps[i - 1];
            setExpandedSteps(prev => ({ ...prev, [prevStep.id]: false }));
          }
        } else {
          const result = await runStep(step.id, context);

          // APRÈS P1 : TOUJOURS pause pour valider/choisir le titre best-seller
          // On fait ce check AVANT le if(result) pour garantir l'arrêt même si result est null
          if (step.id === 'P1') {
            if (result) {
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
            }
            setWaitingForTitleValidation(true);
            setIsGenerating(false);
            saveProgress();
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
              setGeneratedCharacters(personnagesP3);
              setWaitingForCharacterValidation(true);
              setIsGenerating(false);
              saveProgress();
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
      generateCompleteBook(failedStepIndex);
    }
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
          <div className={`flex items-start space-x-3 p-4 rounded-lg border ${hasValidApiKey ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <Key className={`h-5 w-5 mt-0.5 ${hasValidApiKey ? 'text-green-600' : 'text-red-500'}`} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${hasValidApiKey ? 'text-green-700' : 'text-red-600'}`}>
                  {hasValidApiKey ? '🔑 Votre clé API OpenAI est active' : '🔑 Clé API OpenAI requise'}
                </span>
                {hasValidApiKey && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Prêt
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasValidApiKey 
                  ? 'Les coûts de génération seront facturés directement sur votre compte OpenAI.'
                  : 'Configurez votre clé API OpenAI dans l\'onglet "Paramètres" pour générer votre livre. Les coûts (~0.50€ - 2€ par livre) seront facturés sur votre compte OpenAI.'
                }
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
                    setError(null);
                    setFailedStepIndex(null);
                    setCurrentStepIndex(-1);
                    setStepResults({});
                    setAllContext({});
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