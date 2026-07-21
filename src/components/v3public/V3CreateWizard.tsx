import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ImageIcon, Loader2, Palette, Plus, RefreshCw, Rocket, Save, Sparkles, Trash2, UserRound, Wand2, FileDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import EbookCompleteWorkflow from '@/components/ebook/EbookCompleteWorkflow';
import V3ExportPanel from '@/components/admin/V3ExportPanel';
import { supabase } from '@/integrations/supabase/client';
import { invokeImageFunction } from '@/lib/aiImageInvoke';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';


type WizardCharacter = {
  id: string;
  name: string;
  role: string;
  traits: string;
};

type OutlineChapter = {
  id: string;
  numero: number;
  titre: string;
  objectif: string;
};

type HubConfig = {
  title?: string;
  subtitle?: string;
  author?: string;
  description?: string;
  genre?: string;
  targetAudience?: string;
  numberOfChapters?: number;
};

const CONFIG_KEY = 'edition_book_config_v1';
const TARGET_WORDS_KEY = 'edition_chapter_target_words_v1';
const WIZARD_KEY = 'v3_create_wizard_config_v1';
const PROJECT_ID_KEY = 'v3_create_current_project_id_v1';

const CATEGORIES = [
  'Roman', 'Thriller / Policier', 'Romance', 'Fantasy / Fantastique', 'Science-fiction', 'Biographie / Mémoires',
  'Développement personnel', 'Business / Entrepreneuriat', 'Santé / Bien-être', 'Cuisine / Recettes', 'Voyage / Guide',
  'Enfants / Jeunesse', 'Éducation / Pédagogie', 'Spiritualité', 'Autre',
];

const TONES = ['Inspirant', 'Pédagogique', 'Émotionnel', 'Direct', 'Humoristique', 'Premium', 'Romanesque', 'Expert'];

function readHubConfig(): HubConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function makeCharacter(): WizardCharacter {
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
    name: '',
    role: 'Personnage principal',
    traits: '',
  };
}

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function cleanText(value: unknown) {
  return String(value || '')
    .replace(/```(?:json)?/gi, '')
    .replace(/[{}[\]`]/g, '')
    .replace(/"(?:numero|titre|objectif|title|chapterTitle)"\s*:\s*/gi, '')
    .replace(/^chapitre\s+\d+\s*[:–—-]?\s*/i, '')
    .replace(/^chapter\s+\d+\s*[:–—-]?\s*/i, '')
    .replace(/^['"«»“”]+|['"«»“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGenericTitle(value: unknown) {
  const normalized = cleanText(value).toLowerCase();
  return !normalized || /^(chapitre|chapter|ch\.?)\s*\d+$/.test(normalized);
}

function buildFallbackOutline(title: string, category: string, count: number): OutlineChapter[] {
  const subject = cleanText(title) || cleanText(category) || 'le projet';
  const templates = [
    ['Les fondations', 'Installer le contexte, la promesse et les enjeux du livre.'],
    ['Le déclic initial', 'Faire comprendre pourquoi le sujet devient important maintenant.'],
    ['Les erreurs à éviter', 'Clarifier les pièges qui empêchent le lecteur d’avancer.'],
    ['La méthode pas à pas', 'Donner une progression simple, applicable et concrète.'],
    ['Le premier résultat visible', 'Transformer la théorie en action mesurable.'],
    ['Les cas réels', 'Ancrer les idées dans des situations proches du lecteur.'],
    ['Le niveau avancé', 'Approfondir les notions essentielles sans perdre en clarté.'],
    ['La consolidation', 'Aider le lecteur à stabiliser ses acquis.'],
    ['Le plan d’action', 'Organiser les prochaines étapes de manière pratique.'],
    ['L’aboutissement', 'Conclure sur une transformation claire et motivante.'],
  ];

  return Array.from({ length: count }, (_, index) => {
    const [prefix, objectif] = templates[Math.min(index, templates.length - 1)];
    return {
      id: makeId(),
      numero: index + 1,
      titre: `${prefix} — ${subject}`,
      objectif,
    };
  });
}

export default function V3CreateWizard() {
  const hub = useMemo(readHubConfig, []);
  const [step, setStep] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [completedBook, setCompletedBook] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [savingCloud, setSavingCloud] = useState(false);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(() => {
    try { return localStorage.getItem(PROJECT_ID_KEY); } catch { return null; }
  });
  const projectIdRef = useRef<string | null>(projectId);
  const coverTriggeredRef = useRef(false);
  const [resumeInfo, setResumeInfo] = useState<{ title: string; lastStep: string } | null>(null);
  const restoreRef = useRef(false);

  const generateCover = async () => {
    setCoverLoading(true);
    try {
      const openaiApiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('openai_real_api_key')) || undefined;
      const { data, error } = await invokeImageFunction<any>('generate-front-cover', {
        ebookTitle: finalTitle.trim() || title.trim(),
        subtitle: subtitle.trim(),
        authorName: authorName.trim(),
        genre: effectiveCategory,
        style: 'professional',
        variation: 1,
        coverType: 'front',
        useOpenAI: !!openaiApiKey,
        openaiApiKey,
      });
      if (error || !data?.imageUrl) throw new Error(error?.message || 'Génération échouée');
      setCoverUrl(data.imageUrl);
      void saveProjectToCloud({ silent: true, coverUrlOverride: data.imageUrl });
      toast.success('Couverture générée — tu peux la garder ou en refaire une.');
    } catch (e: any) {
      toast.error(e?.message || 'Impossible de générer la couverture.');
    } finally {
      setCoverLoading(false);
    }
  };

  useEffect(() => {
    if (completedBook && !coverTriggeredRef.current) {
      coverTriggeredRef.current = true;
      generateCover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedBook]);

  // Reprise après crash : recharge le brouillon wizard + relance le workflow
  // au bon step si `ebook_workflow_progress` / `ebook_workflow_results` existent.
  useEffect(() => {
    if (restoreRef.current) return;
    restoreRef.current = true;
    try {
      const wizRaw = localStorage.getItem(WIZARD_KEY);
      const progRaw = localStorage.getItem('ebook_workflow_progress');
      const resRaw = localStorage.getItem('ebook_workflow_results');
      if (!wizRaw) return;
      const w = JSON.parse(wizRaw);

      // Restaure les champs wizard
      if (w.title) { setTitle(w.title); setFinalTitle(w.title); }
      if (w.subtitle) setSubtitle(w.subtitle);
      if (w.author) setAuthorName(w.author);
      if (w.description) setDescription(w.description);
      if (w.genre) {
        const match = CATEGORIES.find((c) => c.toLowerCase() === String(w.genre).toLowerCase());
        if (match) setCategory(match);
        else { setCategory('Autre'); setCustomCategory(String(w.genre)); }
      }
      if (w.tone) setTone(w.tone);
      if (w.numberOfChapters) setChapters(clampNumber(Number(w.numberOfChapters), 3, 60, 12));
      if (w.wordsPerChapter) setWordsPerChapter(Number(w.wordsPerChapter));
      if (Array.isArray(w.characters) && w.characters.length) {
        setCharacters(w.characters.map((c: any) => ({
          id: makeId(), name: c.name || '', role: c.role || 'Personnage principal', traits: c.description || c.traits || '',
        })));
      }
      if (Array.isArray(w.outline) && w.outline.length) {
        setOutline(w.outline.map((o: any, i: number) => ({
          id: makeId(), numero: o.numero || i + 1, titre: o.titre || `Chapitre ${i + 1}`, objectif: o.objectif || '',
        })));
      }
      if (w.cibleProfil) setCibleProfil(w.cibleProfil);
      if (w.cibleNiveau) setCibleNiveau(w.cibleNiveau);
      if (w.cibleBesoins) setCibleBesoins(w.cibleBesoins);
      if (w.cibleFrustrations) setCibleFrustrations(w.cibleFrustrations);
      if (w.promesseCentrale) setPromesseCentrale(w.promesseCentrale);
      if (w.promesseBenefices) setPromesseBenefices(w.promesseBenefices);
      if (w.promesseDifferenciation) setPromesseDifferenciation(w.promesseDifferenciation);
      if (w.promesseEmotion) setPromesseEmotion(w.promesseEmotion);

      // Détecte une progression workflow inachevée
      let lastStep = '';
      let hasProgress = false;
      if (progRaw) {
        try {
          const p = JSON.parse(progRaw);
          if (p?.currentStepIndex >= 0 || p?.stepResults) {
            hasProgress = true;
            lastStep = `P${(p.currentStepIndex ?? 0) + 1}`;
          }
        } catch {}
      }
      if (!hasProgress && resRaw) {
        try {
          const r = JSON.parse(resRaw);
          const keys = Object.keys(r || {}).filter((k) => /^P\d+$/.test(k));
          if (keys.length && keys.length < 15) {
            hasProgress = true;
            lastStep = keys.sort((a, b) => Number(b.slice(1)) - Number(a.slice(1)))[0];
          }
        } catch {}
      }
      if (hasProgress && w.title) {
        setResumeInfo({ title: w.title, lastStep });
      }
    } catch (e) {
      console.warn('V3 wizard restore skipped:', e);
    }
  }, []);


  const [title, setTitle] = useState(hub.title || '');
  const [description, setDescription] = useState(hub.description || '');
  const [category, setCategory] = useState(hub.genre || 'Roman');
  const [customCategory, setCustomCategory] = useState('');
  const [tone, setTone] = useState('Inspirant');
  const [chapters, setChapters] = useState(clampNumber(Number(hub.numberOfChapters), 3, 60, 12));
  const [wordsPerChapter, setWordsPerChapter] = useState(2500);
  const [characters, setCharacters] = useState<WizardCharacter[]>([makeCharacter()]);
  const [outline, setOutline] = useState<OutlineChapter[]>(() => buildFallbackOutline(hub.title || '', hub.genre || 'Roman', clampNumber(Number(hub.numberOfChapters), 3, 60, 12)));
  const [finalTitle, setFinalTitle] = useState(hub.title || '');
  const [subtitle, setSubtitle] = useState(hub.subtitle || '');
  const [authorName, setAuthorName] = useState(hub.author || 'Auteur Ebookstudio');

  // Cible & Promesse (parité V2 — améliore drastiquement les résultats des agents)
  const [cibleProfil, setCibleProfil] = useState('');
  const [cibleNiveau, setCibleNiveau] = useState('tous');
  const [cibleBesoins, setCibleBesoins] = useState('');
  const [cibleFrustrations, setCibleFrustrations] = useState('');
  const [promesseCentrale, setPromesseCentrale] = useState('');
  const [promesseBenefices, setPromesseBenefices] = useState('');
  const [promesseDifferenciation, setPromesseDifferenciation] = useState('');
  const [promesseEmotion, setPromesseEmotion] = useState('');
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [targetPromiseOpen, setTargetPromiseOpen] = useState(false);

  const handleAutofillTargetPromise = async () => {
    if (!title.trim() && !finalTitle.trim()) {
      toast.error('Ajoute au moins un titre avant l’auto-remplissage.');
      return;
    }
    setAutofillLoading(true);
    try {
      const provider = getProvider();
      const userApiKey = provider === 'gemini' ? getProviderKey('gemini') : '';
      const { data, error } = await supabase.functions.invoke('autofill-target-promise', {
        body: {
          title: finalTitle.trim() || title.trim(),
          subtitle: subtitle.trim(),
          category: effectiveCategory,
          bookIntroduction: description.trim(),
          language: 'fr',
          userApiKey,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setCibleProfil(data?.cibleProfil || '');
      setCibleNiveau(data?.cibleNiveau || 'tous');
      setCibleBesoins(data?.cibleBesoins || '');
      setCibleFrustrations(data?.cibleFrustrations || '');
      setPromesseCentrale(data?.promesseCentrale || '');
      setPromesseBenefices(data?.promesseBenefices || '');
      setPromesseDifferenciation(data?.promesseDifferenciation || '');
      setPromesseEmotion(data?.promesseEmotion || '');
      setTargetPromiseOpen(true);
      toast.success('Cible & Promesse remplies — relis puis lance la génération.');
    } catch (e: any) {
      toast.error(e?.message || 'Auto-remplissage indisponible.');
    } finally {
      setAutofillLoading(false);
    }
  };

  // Assistant IA — trouve titre / sous-titre / synopsis / catégories à partir d'une idée ou d'une niche.
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; subtitle: string; synopsis: string; categories: string[] } | null>(null);

  const runAIAssistant = async () => {
    if (aiTopic.trim().length < 4) {
      toast.error('Décris ton idée, ton sujet ou ta niche (au moins quelques mots).');
      return;
    }
    const provider = getProvider();
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) {
      toast.error('Ajoute et valide ta clé IA en haut de la page avant de lancer l’assistant.');
      return;
    }
    setAiLoading(true);
    try {
      const prompt = `Tu es un éditeur senior spécialisé Amazon KDP. À partir de l'idée / niche ci-dessous, propose UN livre commercial percutant.
Idée / niche : "${aiTopic.trim()}"

Réponds STRICTEMENT en JSON valide (sans balises, sans texte autour) avec ce schéma :
{
  "title": "titre principal court et vendeur (max 70 caractères)",
  "subtitle": "sous-titre bénéfice/promesse (max 120 caractères)",
  "synopsis": "synopsis complet de 150 à 200 mots, style vendeur, en français, décrivant le contenu, le lecteur visé et la transformation obtenue",
  "categories": ["3 à 5 catégories Amazon FR pertinentes, en français, séparées ici sous forme de tableau"]
}`;
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: 0.8, maxTokens: 4096 });
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
      }
      if (!parsed?.title) throw new Error('Réponse IA invalide.');
      setAiResult({
        title: String(parsed.title || '').slice(0, 120),
        subtitle: String(parsed.subtitle || '').slice(0, 160),
        synopsis: String(parsed.synopsis || '').trim(),
        categories: Array.isArray(parsed.categories) ? parsed.categories.map(String).slice(0, 6) : [],
      });
      toast.success('Propositions IA prêtes — clique « Appliquer » pour remplir le formulaire.');
    } catch (e: any) {
      toast.error(e?.message || 'Impossible de générer les propositions.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAIResult = () => {
    if (!aiResult) return;
    setTitle(aiResult.title);
    setFinalTitle(aiResult.title);
    setSubtitle(aiResult.subtitle);
    setDescription(aiResult.synopsis);
    const firstCat = aiResult.categories[0];
    if (firstCat) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === firstCat.toLowerCase());
      if (match) setCategory(match);
      else { setCategory('Autre'); setCustomCategory(firstCat); }
    }
    toast.success('Formulaire rempli — vérifie et continue vers l’étape suivante.');
  };

  const effectiveCategory = category === 'Autre' ? (customCategory.trim() || 'Autre') : category;
  const totalWords = chapters * wordsPerChapter;
  const estimatedPages = Math.ceil(totalWords / 250);
  const descriptionWords = description.trim().split(/\s+/).filter(Boolean).length;
  const workflowCharacters = characters
    .filter((character) => character.name.trim() || character.traits.trim())
    .map((character) => ({
      id: character.id,
      name: character.name.trim() || character.role,
      role: character.role,
      description: character.traits.trim() || 'Personnage à développer pendant le workflow.',
    }));

  const normalizedOutline = outline
    .slice(0, chapters)
    .map((item, index) => {
      const cleanedTitle = cleanText(item.titre);
      const fallbackTitle = cleanedTitle && !isGenericTitle(cleanedTitle)
        ? cleanedTitle
        : `Chapitre ${index + 1} — à préciser`;
      return { ...item, numero: index + 1, titre: fallbackTitle, objectif: cleanText(item.objectif) };
    });

  const outlineText = normalizedOutline
    .map((chapter) => `Chapitre ${chapter.numero} — ${chapter.titre}\nObjectif : ${chapter.objectif || 'Objectif éditorial à préciser.'}`)
    .join('\n');

  const canStepOne = title.trim().length >= 3 && description.trim().length >= 30;
  const canStepTwo = Boolean(effectiveCategory.trim()) && chapters >= 3 && chapters <= 60 && wordsPerChapter >= 500;
  // Sommaire non bloquant : les agents V2 (P3 « L'Architecte ») reconstruisent le plan si l'auteur ne l'a pas affiné.
  const canStepOutline = normalizedOutline.length >= 3;
  const canStepFour = finalTitle.trim().length >= 3 && authorName.trim().length >= 2;

  const targetPromiseBlock = () => {
    const cibleLines = [
      cibleProfil && `Profil : ${cibleProfil}`,
      cibleNiveau && `Niveau : ${cibleNiveau}`,
      cibleBesoins && `Besoins : ${cibleBesoins}`,
      cibleFrustrations && `Frustrations : ${cibleFrustrations}`,
    ].filter(Boolean).join('\n');
    const promLines = [
      promesseCentrale && `Promesse centrale : ${promesseCentrale}`,
      promesseBenefices && `Bénéfices :\n${promesseBenefices}`,
      promesseDifferenciation && `Différenciation : ${promesseDifferenciation}`,
      promesseEmotion && `Émotion visée : ${promesseEmotion}`,
    ].filter(Boolean).join('\n');
    const out: string[] = [];
    if (cibleLines) out.push(`🎯 CIBLE IDÉALE\n${cibleLines}`);
    if (promLines) out.push(`✨ PROMESSE\n${promLines}`);
    return out.join('\n\n');
  };

  const buildWorkflowDescription = () => [
    description.trim(),
    `Style demandé : ${tone}.`,
    `Format prévu : ${chapters} chapitres d'environ ${wordsPerChapter} mots chacun.`,
    outlineText ? `SOMMAIRE VALIDÉ PAR L'AUTEUR — à respecter strictement :\n${outlineText}` : '',
    workflowCharacters.length
      ? `Personnages fournis : ${workflowCharacters.map((character) => `${character.name} (${character.role}) — ${character.description}`).join(' | ')}`
      : '',
    targetPromiseBlock(),
  ].filter(Boolean).join('\n\n');

  const syncProjectId = (id: string | null) => {
    projectIdRef.current = id;
    setProjectId(id);
    try {
      if (id) localStorage.setItem(PROJECT_ID_KEY, id);
      else localStorage.removeItem(PROJECT_ID_KEY);
    } catch {}
  };

  const saveProjectToCloud = async (options: { silent?: boolean; completedBookOverride?: any; coverUrlOverride?: string | null } = {}) => {
    const { silent = false, completedBookOverride, coverUrlOverride } = options;
    const resolvedTitle = (finalTitle.trim() || title.trim() || 'Sans titre').slice(0, 180);
    const activeCoverUrl = coverUrlOverride ?? coverUrl;
    const completed = completedBookOverride || completedBook;
    const completedChapters = Array.isArray(completed?.chapters)
      ? completed.chapters.map((chapter: any, index: number) => ({
          number: Number(chapter.number || chapter.numero || index + 1),
          title: cleanText(chapter.title || chapter.titre || normalizedOutline[index]?.titre || `Partie ${index + 1}`),
          content: String(chapter.content || chapter.contenu || '').trim(),
          incomplete: Boolean(chapter.incomplete),
        }))
      : [];

    const projectPayload = {
      title: resolvedTitle,
      author_name: authorName.trim() || 'Auteur Ebookstudio',
      target_audience: hub.targetAudience || '',
      writing_style: tone,
      chapter_length: `${wordsPerChapter} mots par chapitre`,
      detail_level: `${chapters} chapitres · ${totalWords.toLocaleString('fr-FR')} mots estimés`,
      tone,
      narrative_format: subtitle.trim() ? `Sous-titre : ${subtitle.trim()}` : 'Workflow V3 complet',
      preface: description.trim(),
      conclusion: completed?.conclusion || '',
      chapters: completedChapters as any,
      characters: workflowCharacters as any,
      ebook_images: activeCoverUrl ? [{ type: 'front_cover', url: activeCoverUrl, title: resolvedTitle }] as any : [] as any,
      number_of_chapters: chapters,
      book_summary: [
        description.trim(),
        outlineText ? `\nTABLE DES MATIÈRES VALIDÉE\n${outlineText}` : '',
      ].filter(Boolean).join('\n\n'),
      cover_concepts: activeCoverUrl || '',
      kdp_description: completed?.backCover?.description || '',
      kdp_keywords: '',
      kdp_categories: effectiveCategory,
      project_type: 'ebook',
      updated_at: new Date().toISOString(),
    };

    try {
      setSavingCloud(true);
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        if (!silent) toast.error('Connecte-toi pour sauvegarder le livre dans Mes livres.');
        return null;
      }


      const idToUpdate = projectIdRef.current;
      if (idToUpdate) {
        const { data, error } = await supabase
          .from('ebook_projects')
          .update({ ...projectPayload, user_id: auth.user.id } as any)
          .eq('id', idToUpdate)
          .eq('user_id', auth.user.id)
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (data?.id) {
          syncProjectId(data.id);
          if (!silent) toast.success('Sauvegardé dans Mes livres.');
          return data.id;
        }
      }

      const { data, error } = await supabase
        .from('ebook_projects')
        .insert({ ...projectPayload, user_id: auth.user.id } as any)
        .select('id')
        .single();
      if (error) throw error;
      syncProjectId(data.id);
      if (!silent) toast.success('Sauvegardé dans Mes livres.');
      return data.id;
    } catch (error: any) {
      console.error('V3 project save failed:', error);
      if (!silent) toast.error(error?.message || 'Sauvegarde impossible dans Mes livres.');
      return null;
    } finally {
      setSavingCloud(false);
    }
  };

  const saveDraft = async () => {
    try {
      const draft = {
        savedAt: new Date().toISOString(),
        title, description, category, customCategory, tone, chapters, wordsPerChapter,
        characters, outline, finalTitle, subtitle, authorName,
      };
      const raw = localStorage.getItem('v3_wizard_drafts_v1');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ id: crypto.randomUUID?.() || String(Date.now()), ...draft });
      localStorage.setItem('v3_wizard_drafts_v1', JSON.stringify(list.slice(0, 20)));
      localStorage.setItem(WIZARD_KEY, JSON.stringify(draft));
    } catch {
      toast.error('Sauvegarde locale impossible.');
    }
    await saveProjectToCloud();
  };

  const resetWizard = () => {
    if (!confirm('Recommencer un nouveau livre ? Le brouillon en cours sera effacé.')) return;
    setTitle(''); setDescription(''); setCategory('Roman'); setCustomCategory('');
    setTone('Inspirant'); setChapters(12); setWordsPerChapter(2500);
    setCharacters([makeCharacter()]); setOutline(buildFallbackOutline('', 'Roman', 12)); setFinalTitle(''); setSubtitle('');
    setAiTopic(''); setAiResult(null); setStep(0); setLaunched(false); setCompletedBook(null); setCoverUrl(null);
    syncProjectId(null);
    coverTriggeredRef.current = false;
    ['ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data'].forEach((k) => localStorage.removeItem(k));
    toast.success('Nouveau livre — formulaire réinitialisé.');
  };


  const generateOutline = async () => {
    if (!canStepOne || !canStepTwo) {
      toast.error('Complète le titre, le synopsis, la catégorie et le format avant le sommaire.');
      return;
    }

    const provider = getProvider();
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) {
      setOutline(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters));
      toast.success('Sommaire préparé — tu peux modifier chaque chapitre.');
      return;
    }

    setOutlineLoading(true);
    try {
      const prompt = `Tu es directeur éditorial KDP. Crée une table des matières professionnelle en français.
Titre : ${finalTitle || title}
Sous-titre : ${subtitle || 'Non défini'}
Catégorie : ${effectiveCategory}
Ton : ${tone}
Synopsis : ${description}
Nombre exact de chapitres : ${chapters}
Mots par chapitre : ${wordsPerChapter}

Réponds STRICTEMENT en JSON valide, sans markdown, avec ce schéma :
{"chapters":[{"numero":1,"titre":"Titre spécifique non générique","objectif":"Objectif éditorial clair en une phrase"}]}

Règles :
- exactement ${chapters} chapitres ;
- jamais de titre générique comme "Chapitre 1" ;
- aucun bloc markdown, aucune balise json ;
- titres courts, vendeurs, cohérents avec le synopsis.`;
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: 0.55, maxTokens: Math.min(12000, 1800 + chapters * 180) });
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
      const aiChapters = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
      const nextOutline = aiChapters.map((item: any, index: number) => ({
        id: makeId(),
        numero: index + 1,
        titre: cleanText(item.titre || item.title),
        objectif: cleanText(item.objectif || item.goal || item.description),
      })).filter((item: OutlineChapter) => !isGenericTitle(item.titre)).slice(0, chapters);
      if (nextOutline.length !== chapters) throw new Error('Sommaire incomplet');
      setOutline(nextOutline);
      toast.success('Sommaire généré — relis puis valide avant de lancer.');
    } catch (error) {
      console.error('Outline generation failed:', error);
      setOutline(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters));
      toast.warning('Sommaire robuste préparé — tu peux le modifier avant génération.');
    } finally {
      setOutlineLoading(false);
    }
  };

  const goNext = () => {
    if (step === 0 && !canStepOne) {
      toast.error('Ajoute un titre et une description claire avant de continuer.');
      return;
    }
    if (step === 1 && !canStepTwo) {
      toast.error('Vérifie la catégorie, le nombre de chapitres et les mots par chapitre.');
      return;
    }
    if (step === 1 && outline.length !== chapters) {
      setOutline(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters));
    }
    if (step === 2 && !canStepOutline) {
      toast.error('Valide le sommaire : chaque chapitre doit avoir un titre et un objectif.');
      return;
    }
    if (step === 3 && !finalTitle.trim()) setFinalTitle(title);
    setStep((value) => Math.min(4, value + 1));
  };

  const updateCharacter = (id: string, field: keyof WizardCharacter, value: string) => {
    setCharacters((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeCharacter = (id: string) => {
    setCharacters((items) => items.length <= 1 ? items : items.filter((item) => item.id !== id));
  };

  const updateOutline = (id: string, field: keyof Pick<OutlineChapter, 'titre' | 'objectif'>, value: string) => {
    setOutline((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeOutlineChapter = (id: string) => {
    setOutline((items) => items.length <= 3 ? items : items.filter((item) => item.id !== id).map((item, index) => ({ ...item, numero: index + 1 })));
    setChapters((value) => Math.max(3, value - 1));
  };

  const addOutlineChapter = () => {
    setOutline((items) => {
      const next = [...items, { id: makeId(), numero: items.length + 1, titre: `Nouvelle partie — ${title || effectiveCategory}`, objectif: 'Définir le rôle précis de ce chapitre dans la progression du livre.' }];
      setChapters(clampNumber(next.length, 3, 60, 12));
      return next;
    });
  };

  const handleWorkflowComplete = async (bookData: any) => {
    setCompletedBook(bookData);
    await saveProjectToCloud({ silent: true, completedBookOverride: bookData });
    toast.success('Livre terminé et sauvegardé dans Mes livres.');
  };

  // Auto-save cloud pendant que les agents avancent : lit `ebook_workflow_results`
  // et reconstruit un `completedBook` partiel pour ne jamais perdre les chapitres.
  const buildBookFromWorkflowResults = () => {
    try {
      const raw = localStorage.getItem('ebook_workflow_results');
      if (!raw) return null;
      const results = JSON.parse(raw) as Record<string, { result?: any; displayContent?: string }>;
      const p4 = results.P4?.result;
      const p5 = results.P5?.result;
      const p3 = results.P3?.result;
      const p1 = results.P1?.result;
      const p7 = results.P7?.result;
      const rawCh = (p4?.chapitres || p5?.chapitresFinal || []) as any[];
      const p3Ch = Array.isArray(p3?.chapitres) ? p3.chapitres : [];
      if (rawCh.length === 0 && p3Ch.length === 0) return null;
      const byNum = new Map<number, any>();
      rawCh.forEach((ch, i) => byNum.set(ch?.numero || ch?.number || i + 1, ch));
      const total = Math.max(chapters || 0, rawCh.length, p3Ch.length);
      const out: any[] = [];
      for (let i = 1; i <= total; i++) {
        const ch = byNum.get(i);
        const p3m = p3Ch.find((p: any) => (p.numero || 0) === i) || p3Ch[i - 1];
        const title = cleanText(ch?.titre || ch?.title || p3m?.titre || p3m?.title || `Chapitre ${i}`);
        const content = String(ch?.contenu || ch?.content || '').trim();
        out.push({ number: i, title, content, incomplete: !content });
      }
      return {
        chapters: out,
        conclusion: '',
        backCover: { description: p7?.descriptionKDP || '', accroche: p7?.accroche4emeCouverture || '' },
        bookSynopsis: p1?.promesseCentrale || '',
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!launched || completedBook) return;
    let timer: any;
    const trigger = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const partial = buildBookFromWorkflowResults();
        if (partial && partial.chapters.some((c: any) => !c.incomplete)) {
          void saveProjectToCloud({ silent: true, completedBookOverride: partial });
        }
      }, 4000);
    };
    trigger();
    window.addEventListener('ebook_workflow_results_updated', trigger);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('ebook_workflow_results_updated', trigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launched, completedBook]);

  const launchWorkflow = async () => {
    if (!canStepFour) {
      toast.error('Valide le titre final et le nom d’auteur avant de générer.');
      return;
    }
    if (!canStepOutline) {
      toast.error('Valide le sommaire avant de générer le livre.');
      setStep(2);
      return;
    }

    const workflowDescription = buildWorkflowDescription();

    const config = {
      title: finalTitle.trim(),
      subtitle: subtitle.trim(),
      author: authorName.trim(),
      description: workflowDescription,
      genre: effectiveCategory,
      targetAudience: hub.targetAudience || '',
      numberOfChapters: chapters,
      tone,
      wordsPerChapter,
      characters: workflowCharacters,
      outline: normalizedOutline,
    };

    // Reprise après crash : ne PAS effacer la progression si l'utilisateur
    // relance le même livre (même titre). Le workflow V2 monté ci-dessous
    // reprend alors automatiquement à l'étape échouée grâce à
    // `ebook_workflow_progress` + `ebook_workflow_results`.
    try {
      const prevRaw = localStorage.getItem(WIZARD_KEY);
      const prevTitle = prevRaw ? (JSON.parse(prevRaw)?.title || '') : '';
      const sameBook = prevTitle && prevTitle.toLowerCase() === finalTitle.trim().toLowerCase();
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      localStorage.setItem(TARGET_WORDS_KEY, String(wordsPerChapter));
      localStorage.setItem(WIZARD_KEY, JSON.stringify({
        ...config,
        cibleProfil, cibleNiveau, cibleBesoins, cibleFrustrations,
        promesseCentrale, promesseBenefices, promesseDifferenciation, promesseEmotion,
      }));
      if (!sameBook) {
        ['ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data']
          .forEach((key) => localStorage.removeItem(key));
      } else {
        toast.info('Reprise du livre en cours détectée — les agents redémarrent au dernier chapitre sauvegardé.');
      }
    } catch {
      // The mounted workflow still receives props if localStorage is unavailable.
    }

    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      const savedId = await saveProjectToCloud({ silent: true });
      if (savedId) {
        toast.success('Projet sauvegardé. Le workflow complet démarre maintenant.');
      } else {
        toast.message('Workflow lancé. La sauvegarde cloud a échoué mais tu peux continuer.');
      }
    } else {
      toast.message('Workflow lancé en mode invité. Connecte-toi pour retrouver ton livre dans « Mes livres ».');
    }
    setLaunched(true);

  };

  if (launched) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border p-5 sm:p-7" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-orange-50)' }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="v3-chip v3-chip-orange"><Rocket className="h-3.5 w-3.5" /> Workflow lancé</span>
              <h2 className="v3-serif mt-3 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>Les agents travaillent sur ton livre</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                {finalTitle} · {chapters} chapitres · {totalWords.toLocaleString('fr-FR')} mots estimés
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {completedBook && (
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: 'var(--v3-paper)', color: 'var(--v3-orange-600)' }}>
                  <Check className="h-4 w-4" /> Livre terminé
                </span>
              )}
              <button
                type="button"
                onClick={async () => {
                  const id = await saveProjectToCloud({ silent: false });
                  if (id) toast.success('Sauvegardé dans Ma bibliothèque.');
                }}
                disabled={savingCloud}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border shadow-sm disabled:opacity-60"
                style={{ borderColor: 'var(--v3-orange-600)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
                title="Force la sauvegarde immédiate dans Ma bibliothèque"
              >
                {savingCloud ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Sauvegarder maintenant
              </button>
            </div>
          </div>
        </div>


        <EbookCompleteWorkflow
          key={`${finalTitle}-${chapters}-${wordsPerChapter}`}
          autoStart
          hideInputForm
          initialTitle={finalTitle.trim()}
          initialSubtitle={subtitle.trim()}
          initialCategory={effectiveCategory}
          initialAuthorName={authorName.trim()}
          initialNumberOfChapters={chapters}
          initialWordsPerChapter={wordsPerChapter}
          initialTone={tone}
          characters={workflowCharacters}
          initialBookIntroduction={buildWorkflowDescription()}
          onComplete={handleWorkflowComplete}
        />

        {completedBook && (
          <div className="rounded-[28px] border p-5 sm:p-7" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="v3-chip v3-chip-orange"><ImageIcon className="h-3.5 w-3.5" /> Couverture</span>
                <h3 className="v3-serif mt-3 text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>Ta couverture est prête</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                  Générée automatiquement après la fin du livre. Tu peux en refaire une autre ou la personnaliser depuis le Studio Couverture.
                </p>
              </div>
              <button
                type="button"
                onClick={generateCover}
                disabled={coverLoading}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
                style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
              >
                {coverLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refaire la couverture
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Nom d’auteur sur la couverture</span>
                <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Sous-titre</span>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value.slice(0, 120))} placeholder="Optionnel" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
              </label>
            </div>
            <div className="mt-5 flex justify-center">
              <div className="w-56 aspect-[2/3] rounded-xl overflow-hidden border flex items-center justify-center" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-orange-50)' }}>
                {coverLoading && !coverUrl ? (
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-orange-600)' }} />
                ) : coverUrl ? (
                  <img src={coverUrl} alt={`Couverture ${finalTitle}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs px-2 text-center" style={{ color: 'var(--v3-muted)' }}>Aucune couverture</span>
                )}
              </div>
            </div>
          </div>
        )}

        {completedBook && (
          <V3ExportPanel
            manuscript={(completedBook.chapters || []).map((c: any) => `# ${c.title || `Chapitre ${c.number}`}\n\n${c.content || ''}`).join('\n\n')}
            title={finalTitle}
            subtitle={subtitle}
            author={authorName}
          />
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            to="/cover-studio"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
            style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
          >
            <Palette className="h-4 w-4" /> Couverture
          </Link>
          <Link
            to="/ambiances"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
            style={{ borderColor: 'var(--v3-orange-600)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
          >
            <Sparkles className="h-4 w-4" /> Ambiances
          </Link>
          <button
            type="button"
            onClick={saveDraft}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
            style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
          >
            <Save className="h-4 w-4" /> Sauvegarder le brouillon
          </button>
          <button
            type="button"
            onClick={resetWizard}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
            style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
          >
            <RotateCcw className="h-4 w-4" /> Nouveau livre
          </button>
        </div>

      </div>
    );
  }


  const steps = ['Idée', 'Style', 'Sommaire', 'Personnages', 'Titre'];

  return (
    <div className="space-y-8">
      {/* Barre d'actions rapides */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Link
          to="/cover-studio"
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
        >
          <Palette className="h-3.5 w-3.5" /> Couverture
        </Link>
        <Link
          to="/ambiances"
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{ borderColor: 'var(--v3-orange-600)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Ambiances
        </Link>
        <button
          type="button"
          onClick={saveDraft}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
        >
          <Save className="h-3.5 w-3.5" /> Sauvegarder brouillon
        </button>
        <button
          type="button"
          onClick={resetWizard}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Nouveau livre
        </button>
      </div>


      {/* Assistant IA : titre, sous-titre, synopsis, catégories */}
      <div className="rounded-[24px] border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-orange-50)' }}>
        <div className="flex items-center gap-2">
          <span className="v3-chip v3-chip-orange"><Wand2 className="h-3.5 w-3.5" /> Assistant IA</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
            Trouve titre · sous-titre · synopsis · catégories
          </span>
        </div>
        <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
          Décris ton idée, ton sujet ou une niche Amazon. L'IA te propose un titre commercial, un sous-titre, un synopsis de ~150 mots et jusqu'à 5 catégories pertinentes.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Ex : livre pratique pour parents débordés, niche méditation pour ados, roman feel-good à Rome…"
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
          />
          <button
            type="button"
            onClick={runAIAssistant}
            disabled={aiLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
            style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Trouver des idées
          </button>
        </div>
        {aiResult && (
          <div className="mt-4 rounded-xl border p-4 text-sm space-y-2" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}>
            <div><strong>Titre :</strong> {aiResult.title}</div>
            {aiResult.subtitle && <div><strong>Sous-titre :</strong> {aiResult.subtitle}</div>}
            <div><strong>Synopsis :</strong> {aiResult.synopsis}</div>
            {aiResult.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <strong>Catégories :</strong>
                {aiResult.categories.map((c) => (
                  <span key={c} className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-muted)' }}>{c}</span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={applyAIResult}
              className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
            >
              <Check className="h-3.5 w-3.5" /> Appliquer au formulaire
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-5">

        {steps.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <button
              key={label}
              type="button"
              onClick={() => index <= step && setStep(index)}
              className="rounded-2xl border px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
              style={{
                borderColor: active || done ? 'rgba(249, 115, 22, 0.45)' : 'var(--v3-border)',
                background: active ? 'var(--v3-orange-50)' : 'var(--v3-paper)',
                color: active || done ? 'var(--v3-orange-600)' : 'var(--v3-muted)',
              }}
            >
              <span className="block text-xs font-bold uppercase">Étape {index + 1}</span>
              <span className="mt-1 block text-sm font-bold">{done ? '✓ ' : ''}{label}</span>
            </button>
          );
        })}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Page principale</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Commence par le titre du projet et une description d’environ 150 mots.</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Titre de départ</span>
            <input
              value={title}
              onChange={(event) => { setTitle(event.target.value); if (!finalTitle.trim()) setFinalTitle(event.target.value); }}
              placeholder="Ex : Le guide complet pour publier son premier livre"
              className="w-full rounded-2xl border px-4 py-4 text-lg outline-none"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
            />
          </label>
          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3 text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
              Description du livre
              <span className="text-xs font-semibold" style={{ color: descriptionWords >= 120 ? 'var(--v3-orange-600)' : 'var(--v3-muted)' }}>{descriptionWords} / 150 mots</span>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={8}
              placeholder="Explique le sujet, le lecteur visé, l’objectif du livre, l’ambiance, les points importants à aborder…"
              className="w-full resize-none rounded-2xl border px-4 py-4 outline-none"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Style du livre</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Choisis la catégorie, le ton, le nombre de chapitres et la longueur.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Catégorie</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}>
                {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Ton</span>
              <select value={tone} onChange={(event) => setTone(event.target.value)} className="w-full rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}>
                {TONES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          {category === 'Autre' && (
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Nouvelle catégorie</span>
              <input value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} className="w-full rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
            </label>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Nombre de chapitres</span>
                <input type="number" min={3} max={60} value={chapters} onChange={(event) => setChapters(clampNumber(Number(event.target.value), 3, 60, 12))} className="w-20 rounded-xl border px-2 py-2 text-right font-bold outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }} />
              </div>
              <input type="range" min={3} max={60} value={chapters} onChange={(event) => setChapters(Number(event.target.value))} className="mt-5 w-full" />
              <div className="mt-2 flex justify-between text-xs" style={{ color: 'var(--v3-muted)' }}><span>3</span><span>60 chapitres max</span></div>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Mots par chapitre</span>
                <input type="number" min={500} max={8000} step={100} value={wordsPerChapter} onChange={(event) => setWordsPerChapter(clampNumber(Number(event.target.value), 500, 8000, 2500))} className="w-24 rounded-xl border px-2 py-2 text-right font-bold outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }} />
              </div>
              <input type="range" min={500} max={8000} step={100} value={wordsPerChapter} onChange={(event) => setWordsPerChapter(Number(event.target.value))} className="mt-5 w-full" />
              <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>{totalWords.toLocaleString('fr-FR')} mots estimés · environ {estimatedPages} pages</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          {/* Hero header */}
          <div className="relative overflow-hidden rounded-[28px] border p-8" style={{ borderColor: 'var(--v3-border)', background: 'linear-gradient(135deg, var(--v3-orange-50) 0%, var(--v3-paper) 100%)' }}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20" style={{ background: 'var(--v3-orange-600)' }} />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--v3-orange-600)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}>
                  <Sparkles className="h-3 w-3" /> Étape 3 · Sommaire
                </span>
                <h2 className="v3-serif mt-3 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: 'var(--v3-ink)' }}>
                  L'architecture<br/>de votre récit
                </h2>
                <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                  Chaque chapitre est une promesse faite au lecteur. Génère un sommaire cohérent, puis affine les titres et les objectifs — les agents suivront ta ligne éditoriale à la lettre.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                <button
                  type="button"
                  onClick={generateOutline}
                  disabled={outlineLoading}
                  className="v3-btn v3-btn-primary shadow-lg"
                >
                  {outlineLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {outline.length && !outlineLoading ? 'Régénérer' : 'Générer le sommaire'}
                </button>
                <button
                  type="button"
                  onClick={() => { if (!finalTitle.trim()) setFinalTitle(title); setStep(3); }}
                  className="text-xs font-bold underline"
                  style={{ color: 'var(--v3-muted)' }}
                  title="L'agent P3 « L'Architecte » reconstruira le sommaire automatiquement."
                >
                  Passer cette étape — l'IA le fera pour moi
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Chapitres</span>
              <strong className="v3-serif mt-1 block text-3xl" style={{ color: 'var(--v3-ink)' }}>{chapters}</strong>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Mots / chapitre</span>
              <strong className="v3-serif mt-1 block text-3xl" style={{ color: 'var(--v3-ink)' }}>{wordsPerChapter.toLocaleString('fr-FR')}</strong>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Total estimé</span>
              <strong className="v3-serif mt-1 block text-3xl" style={{ color: 'var(--v3-ink)' }}>{totalWords.toLocaleString('fr-FR')}</strong>
              <span className="text-[10px]" style={{ color: 'var(--v3-muted)' }}>mots · ~{Math.round(totalWords / 250)} pages</span>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: canStepOutline ? 'var(--v3-orange-600)' : 'var(--v3-border)', background: canStepOutline ? 'var(--v3-orange-50)' : 'var(--v3-paper)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Validation</span>
              <strong className="v3-serif mt-1 block text-3xl" style={{ color: canStepOutline ? 'var(--v3-orange-600)' : 'var(--v3-ink)' }}>
                {normalizedOutline.length}<span className="text-lg" style={{ color: 'var(--v3-muted)' }}>/{chapters}</span>
              </strong>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--v3-border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (normalizedOutline.length / chapters) * 100)}%`, background: 'var(--v3-orange-600)' }} />
              </div>
            </div>
          </div>

          {/* Chapter timeline */}
          <div className="relative">
            <div className="absolute bottom-4 left-[27px] top-4 w-px" style={{ background: 'var(--v3-border)' }} aria-hidden />
            <div className="space-y-3">
              {outline.slice(0, chapters).map((chapter, index) => {
                const isValid = chapter.titre.length >= 4 && chapter.objectif.length >= 8;
                return (
                  <div key={chapter.id} className="group relative flex gap-4">
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-bold shadow-sm transition-all group-hover:scale-105" style={{ borderColor: isValid ? 'var(--v3-orange-600)' : 'var(--v3-border)', background: isValid ? 'var(--v3-orange-600)' : 'var(--v3-paper)', color: isValid ? 'var(--v3-paper)' : 'var(--v3-muted)' }}>
                      <span className="v3-serif text-lg">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 rounded-2xl border p-5 transition-all hover:shadow-md" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>
                          Chapitre {index + 1} · ~{wordsPerChapter.toLocaleString('fr-FR')} mots
                        </span>
                        <button type="button" onClick={() => removeOutlineChapter(chapter.id)} className="rounded-full p-2 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" style={{ color: 'var(--v3-muted)' }} aria-label="Supprimer ce chapitre"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <input
                        value={chapter.titre}
                        onChange={(event) => updateOutline(chapter.id, 'titre', event.target.value)}
                        placeholder="Titre évocateur du chapitre…"
                        className="v3-serif w-full border-0 border-b bg-transparent px-0 py-2 text-xl font-bold outline-none transition focus:border-current"
                        style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }}
                      />
                      <textarea
                        value={chapter.objectif}
                        onChange={(event) => updateOutline(chapter.id, 'objectif', event.target.value)}
                        rows={2}
                        placeholder="Que doit vivre, comprendre ou ressentir le lecteur ici ?"
                        className="mt-3 w-full resize-none rounded-xl border px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-current"
                        style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-orange-50)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {chapters < 60 && (
            <button type="button" onClick={addOutlineChapter} className="v3-btn v3-btn-outline mx-auto flex">
              <Plus className="h-4 w-4" /> Ajouter un chapitre
            </button>
          )}
        </div>
      )}


      {step === 3 && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Tes personnages</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Ajoute ceux qui comptent. Tu peux aussi laisser vide pour un livre non-fiction.</p>
            </div>
            <button type="button" onClick={() => setCharacters((items) => [...items, makeCharacter()])} className="v3-btn v3-btn-outline"><Plus className="h-4 w-4" /> Ajouter</button>
          </div>
          <div className="space-y-4">
            {characters.map((character, index) => (
              <div key={character.id} className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--v3-ink)' }}><UserRound className="h-4 w-4" /> Personnage {index + 1}</span>
                  <button type="button" onClick={() => removeCharacter(character.id)} className="rounded-full p-2" style={{ color: 'var(--v3-muted)' }} aria-label="Supprimer ce personnage"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={character.name} onChange={(event) => updateCharacter(character.id, 'name', event.target.value)} placeholder="Nom" className="rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }} />
                  <input value={character.role} onChange={(event) => updateCharacter(character.id, 'role', event.target.value)} placeholder="Rôle" className="rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }} />
                </div>
                <textarea value={character.traits} onChange={(event) => updateCharacter(character.id, 'traits', event.target.value)} rows={3} placeholder="Traits, histoire, personnalité, rôle dans le livre…" className="mt-3 w-full resize-none rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Donne-lui un titre</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Vérifie le résumé puis lance directement les agents du workflow.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Titre final</span>
              <input value={finalTitle} onChange={(event) => setFinalTitle(event.target.value)} className="w-full rounded-2xl border px-4 py-4 text-lg font-bold outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Nom d’auteur</span>
              <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} className="w-full rounded-2xl border px-4 py-4 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
            </label>
            <label className="block space-y-2 md:col-span-2">
              <span className="flex items-center justify-between gap-3 text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
                Sous-titre <span className="text-xs font-semibold" style={{ color: 'var(--v3-muted)' }}>optionnel · ~80 caractères</span>
              </span>
              <input value={subtitle} onChange={(event) => setSubtitle(event.target.value.slice(0, 120))} placeholder="Ex : Le guide pas-à-pas pour publier sur Amazon KDP" className="w-full rounded-2xl border px-4 py-4 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
            </label>
          </div>
          <div className="rounded-[28px] border p-5" style={{ borderColor: 'rgba(249, 115, 22, 0.35)', background: 'var(--v3-orange-50)' }}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[['Genre', effectiveCategory], ['Ton', tone], ['Chapitres', String(chapters)], ['Mots total', totalWords.toLocaleString('fr-FR')]].map(([label, value]) => (
                <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>{label}</span>
                  <strong className="mt-1 block text-lg" style={{ color: 'var(--v3-ink)' }}>{value}</strong>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--v3-muted)' }}>{description}</p>
          </div>

          {/* Cible & Promesse — parité V2, améliore fortement la qualité des agents */}
          <div className="rounded-[28px] border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="v3-chip v3-chip-orange"><Sparkles className="h-3.5 w-3.5" /> Recommandé</span>
                <h3 className="v3-serif mt-2 text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>Cible &amp; Promesse</h3>
                <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>Renseigne (ou laisse l'IA remplir) pour un livre plus percutant.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleAutofillTargetPromise}
                  disabled={autofillLoading}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
                  style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
                >
                  {autofillLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Auto-remplir Cible &amp; Promesse
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPromiseOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
                  style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
                >
                  {targetPromiseOpen ? 'Masquer' : 'Modifier'}
                </button>
              </div>
            </div>
            {targetPromiseOpen && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>🎯 Profil du lecteur</span>
                  <input value={cibleProfil} onChange={(e) => setCibleProfil(e.target.value)} placeholder="Ex : femmes 35-55 ans en quête de sens" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Niveau</span>
                  <select value={cibleNiveau} onChange={(e) => setCibleNiveau(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                    <option value="tous">Tous niveaux</option>
                  </select>
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Besoins / attentes</span>
                  <textarea value={cibleBesoins} onChange={(e) => setCibleBesoins(e.target.value)} rows={2} placeholder="Ce que le lecteur cherche à obtenir…" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Frustrations / douleurs</span>
                  <textarea value={cibleFrustrations} onChange={(e) => setCibleFrustrations(e.target.value)} rows={2} placeholder="Ce qui ne marche pas pour lui aujourd'hui…" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>✨ Promesse centrale (1 phrase)</span>
                  <input value={promesseCentrale} onChange={(e) => setPromesseCentrale(e.target.value)} placeholder="Ex : Reprendre le contrôle de son temps en 30 jours" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1 md:col-span-2">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Bénéfices clés</span>
                  <textarea value={promesseBenefices} onChange={(e) => setPromesseBenefices(e.target.value)} rows={3} placeholder={"- Bénéfice 1\n- Bénéfice 2\n- Bénéfice 3"} className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Différenciation</span>
                  <textarea value={promesseDifferenciation} onChange={(e) => setPromesseDifferenciation(e.target.value)} rows={2} placeholder="Ce qui rend ce livre unique…" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--v3-muted)' }}>Émotion visée</span>
                  <input value={promesseEmotion} onChange={(e) => setPromesseEmotion(e.target.value)} placeholder="Ex : rassurer, inspirer, faire rire" className="w-full rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }} />
                </label>
              </div>
            )}
          </div>

          <button type="button" onClick={launchWorkflow} className="v3-btn v3-btn-primary w-full justify-center py-5 text-base">
            <Rocket className="h-5 w-5" /> Générer mon livre avec le workflow complet
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--v3-border)' }}>
        <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="v3-btn v3-btn-ghost disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>
        {step < 4 ? (
          <button type="button" onClick={goNext} className="v3-btn v3-btn-primary">
            Continuer <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--v3-muted)' }}><Sparkles className="h-4 w-4" /> Prêt pour les agents</span>
        )}
      </div>
    </div>
  );
}