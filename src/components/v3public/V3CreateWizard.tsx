import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, ImageIcon, Loader2, Palette, Plus, RefreshCw, Rocket, Save, Sparkles, Trash2, UserRound, Wand2, FileDown, RotateCcw, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import EbookCompleteWorkflow from '@/components/ebook/EbookCompleteWorkflow';
import { ApiProviderQuickSettings } from '@/components/ebook/ApiProviderQuickSettings';
import V3ExportPanel from '@/components/admin/V3ExportPanel';
import V3KdpPublishPanel from '@/components/v3public/V3KdpPublishPanel';
import { supabase } from '@/integrations/supabase/client';
import { normalizeManuscript } from '@/utils/manuscriptNormalizer';
import { publishWrittenChapters } from '@/lib/v3/writtenChapters';

import { proofreadChapters, type ChapterProofread } from '@/lib/correcteur/proofreadBook';

import { invokeImageFunction } from '@/lib/aiImageInvoke';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';
import TocUltimateGenerator, { type UltimateTocChapter } from '@/components/tools/TocUltimateGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { clearTocForWorkflow, listSourcePassages, parseTocText, readBookBrief, readLatestUltimateToc, writeBookBrief, type BriefOutlineChapter } from '@/lib/v3/bookBrief';


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
  'Roman', 'Thriller / Policier', 'Policier / Enquête', 'Romance', 'Romance historique',
  'Fantasy / Fantastique', 'Science-fiction', 'Horreur / Suspense', 'Aventure',
  'Nouvelles / Récits courts', 'Biographie / Mémoires', 'Témoignage / Récit de vie',
  'Développement personnel', 'Productivité / Organisation', 'Business / Entrepreneuriat',
  'Finances personnelles / Investissement', 'Marketing / Vente en ligne',
  'Santé / Bien-être', 'Fitness / Sport', 'Nutrition / Régimes', 'Cuisine / Recettes',
  'Voyage / Guide', 'Enfants / Jeunesse', 'Livre illustré 3-7 ans', 'Éducation / Pédagogie',
  'Parentalité / Famille', 'Spiritualité', 'Psychologie / Relations', 'Histoire / Culture',
  'Nature / Animaux', 'Loisirs créatifs / DIY', 'Informatique / IA', 'Carnet / Journal / Cahier',
  'Poésie', 'Autre',
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
  return !normalized
    || /^(chapitre|chapter|ch\.?)\s*\d+$/.test(normalized)
    || /^l[’']aboutissement\b/i.test(normalized);
}

function buildFallbackOutline(title: string, category: string, count: number): OutlineChapter[] {
  const subject = cleanText(title) || cleanText(category) || 'le projet';
  void subject;

  const isFiction = /roman|thriller|policier|romance|fantasy|fantastique|science|fiction|jeunesse|enfants/i.test(category);
  const fictionTemplates = [
    ['L’appel de Montferrand', 'Ouvrir le récit par une image forte, un lieu, une attente et une tension immédiate.'],
    ['La première fissure', 'Faire apparaître le premier signe que l’équilibre du héros est menacé.'],
    ['La promesse brisée', 'Installer une perte, un mensonge ou un engagement impossible à ignorer.'],
    ['Le témoin silencieux', 'Introduire un indice humain ou matériel qui change la perception du lecteur.'],
    ['Le chemin interdit', 'Pousser le protagoniste vers une décision qu’il aurait voulu éviter.'],
    ['Les voix du passé', 'Relier l’intrigue actuelle à une blessure, une histoire familiale ou un secret ancien.'],
    ['La chambre des indices', 'Rassembler des éléments concrets qui donnent envie de continuer.'],
    ['Un allié incertain', 'Faire entrer un personnage utile mais ambigu dans la progression.'],
    ['Le premier aveu', 'Révéler une vérité partielle qui soulève davantage de questions.'],
    ['La piste qui déraille', 'Créer une fausse certitude puis la retourner contre le héros.'],
    ['Le prix du silence', 'Montrer ce que chacun risque si la vérité sort.'],
    ['La nuit des décisions', 'Faire basculer le héros dans une action irréversible.'],
    ['Les portes closes', 'Augmenter les obstacles et isoler le protagoniste.'],
    ['Le nom qu’on efface', 'Révéler un nom, un document ou une trace que quelqu’un veut faire disparaître.'],
    ['La mémoire des pierres', 'Ancrer l’enquête ou le conflit dans un décor chargé de sens.'],
    ['Le visage du doute', 'Faire douter le héros de ses alliés, de ses souvenirs ou de son jugement.'],
    ['La lettre oubliée', 'Apporter une pièce nouvelle qui réoriente toute l’histoire.'],
    ['Le pacte fragile', 'Forcer deux personnages à coopérer malgré leurs oppositions.'],
    ['Le piège se referme', 'Créer une séquence de tension où chaque choix aggrave la situation.'],
    ['Les ombres répondent', 'Donner au lecteur une réponse importante sans tout expliquer.'],
    ['La vérité déplacée', 'Montrer que l’explication la plus évidente était incomplète.'],
    ['Le cœur du mensonge', 'Atteindre le centre moral ou émotionnel du conflit.'],
    ['Ce que l’on protège', 'Révéler les motivations profondes d’un personnage clé.'],
    ['Le retour impossible', 'Faire comprendre que le héros ne peut plus revenir à son ancienne vie.'],
    ['La faute originelle', 'Exposer l’événement déclencheur caché derrière l’intrigue.'],
    ['La dernière piste', 'Conduire le lecteur vers le lieu, la preuve ou la personne décisive.'],
    ['Le choix du héros', 'Placer le protagoniste devant un dilemme clair et coûteux.'],
    ['La confrontation', 'Mettre face à face les forces qui se sont opposées tout au long du récit.'],
    ['Ce qui demeure', 'Montrer les conséquences humaines de la révélation.'],
    ['La lumière après l’ombre', 'Fermer l’arc principal avec émotion, résolution et ouverture maîtrisée.'],
  ];
  const practicalTemplates = [
    ['Le point de départ', 'Clarifier la situation actuelle, le besoin du lecteur et la promesse du livre.'],
    ['Le vrai problème', 'Identifier l’obstacle central que le lecteur n’arrive pas encore à résoudre.'],
    ['Les erreurs fréquentes', 'Montrer ce qui bloque les résultats et comment éviter ces pièges.'],
    ['La méthode simple', 'Présenter une méthode claire, structurée et immédiatement compréhensible.'],
    ['Le premier déclic', 'Aider le lecteur à obtenir une première compréhension concrète.'],
    ['Le cadre de décision', 'Donner des critères pour choisir la bonne direction.'],
    ['Les bases solides', 'Installer les fondamentaux indispensables avant de passer à l’action.'],
    ['La mise en pratique', 'Transformer les notions en exercices, exemples ou actions visibles.'],
    ['Le plan étape par étape', 'Organiser une progression logique que le lecteur peut suivre.'],
    ['Les cas concrets', 'Illustrer la méthode avec des situations réalistes et parlantes.'],
    ['Les outils essentiels', 'Présenter les outils, ressources ou habitudes qui facilitent l’application.'],
    ['Le passage à l’action', 'Faire passer le lecteur de la compréhension à l’exécution.'],
    ['Les blocages cachés', 'Identifier les résistances psychologiques, pratiques ou stratégiques.'],
    ['La correction de trajectoire', 'Apprendre à ajuster son plan quand les premiers résultats ne suffisent pas.'],
    ['Le niveau avancé', 'Approfondir les techniques sans perdre la clarté pédagogique.'],
    ['La routine gagnante', 'Installer une répétition simple pour maintenir les progrès.'],
    ['La mesure des résultats', 'Expliquer comment suivre les progrès et interpréter les signaux utiles.'],
    ['Les raccourcis intelligents', 'Présenter des leviers qui font gagner du temps sans sacrifier la qualité.'],
    ['Les pièges du perfectionnisme', 'Éviter l’immobilisme et favoriser une avancée régulière.'],
    ['La consolidation', 'Stabiliser les acquis pour éviter le retour en arrière.'],
    ['L’adaptation personnelle', 'Aider le lecteur à personnaliser la méthode selon son contexte.'],
    ['Le système complet', 'Assembler toutes les pièces en une stratégie cohérente.'],
    ['Les questions difficiles', 'Répondre aux objections et aux cas particuliers.'],
    ['Le plan des 30 prochains jours', 'Proposer une feuille de route concrète et motivante.'],
    ['La montée en puissance', 'Montrer comment amplifier les résultats obtenus.'],
    ['L’autonomie du lecteur', 'Donner au lecteur les moyens de continuer sans dépendance.'],
    ['Les ressources utiles', 'Orienter vers des supports, checklists ou références pratiques.'],
    ['La transformation finale', 'Mettre en évidence le chemin parcouru et les bénéfices obtenus.'],
    ['Le nouvel élan', 'Préparer la suite avec confiance et clarté.'],
    ['La conclusion active', 'Terminer par une synthèse forte et un appel à appliquer immédiatement.'],
  ];
  const templates = isFiction ? fictionTemplates : practicalTemplates;

  return Array.from({ length: count }, (_, index) => {
    const [prefix, objectif] = templates[index % templates.length];
    const cycle = Math.floor(index / templates.length);
    // Pas de suffixe « 2 » et pas de titre du livre collé à chaque chapitre :
    // au-delà du premier cycle on produit une variante réellement différente.
    const cycleVariants = ['', 'seconde vague', 'contre-courant', 'dernier acte'];
    const variant = cycleVariants[cycle] || `variation ${cycle}`;
    return {
      id: makeId(),
      numero: index + 1,
      titre: cycle === 0 ? prefix : `${prefix} — ${variant}`,
      objectif,
    };
  });

}

function hasRepeatedFallbackTitles(items: OutlineChapter[], expectedCount: number) {
  if (items.length !== expectedCount) return true;
  const titles = items.map((item) => cleanText(item.titre).toLowerCase()).filter(Boolean);
  const repeatedAboutissement = titles.filter((title) => title.startsWith('l’aboutissement') || title.startsWith("l'aboutissement")).length;
  const uniqueTitles = new Set(titles);
  return repeatedAboutissement > 1 || uniqueTitles.size < Math.max(3, Math.ceil(expectedCount * 0.8));
}

export default function V3CreateWizard() {
  const [searchParams] = useSearchParams();
  const requestedProjectId = searchParams.get('projectId');
  const hub = useMemo(readHubConfig, []);
  const [step, setStep] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [completedBook, setCompletedBook] = useState<any>(null);
  // Relecture automatique du manuscrit (V3) : dès que le livre est terminé,
  // chaque chapitre est corrigé puis remplacé par sa version relue.
  const [autoFix, setAutoFix] = useState<{
    running: boolean;
    done: number;
    total: number;
    corrections: number;
    /** Expressions latines / pseudo-latines supprimées automatiquement. */
    latin: number;
    failed: number;
    finished: boolean;
  }>({ running: false, done: 0, total: 0, corrections: 0, latin: 0, failed: 0, finished: false });

  const autoFixStartedRef = useRef(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [savingCloud, setSavingCloud] = useState(false);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [showTocTool, setShowTocTool] = useState(false);
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
    if (completedBook && !coverUrl && !coverTriggeredRef.current) {
      coverTriggeredRef.current = true;
      generateCover();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedBook, coverUrl]);

  // Reprise après crash : recharge le brouillon wizard + relance le workflow
  // au bon step si `ebook_workflow_progress` / `ebook_workflow_results` existent.
  useEffect(() => {
    if (restoreRef.current) return;
    if (requestedProjectId) return;
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
      if (w.sourceText) setSourceText(String(w.sourceText));

      // La fiche du livre (Génie / V3BriefRecap) écrit `category`/`chapters`,
      // le wizard historique `genre`/`numberOfChapters` : on accepte les deux.
      const wGenre = w.genre || w.category;
      if (wGenre) {
        const match = CATEGORIES.find((c) => c.toLowerCase() === String(wGenre).toLowerCase());
        if (match) setCategory(match);
        else { setCategory('Autre'); setCustomCategory(String(wGenre)); }
      }
      if (w.tone) setTone(w.tone);
      if (w.numberOfChapters || w.chapters) setChapters(clampNumber(Number(w.numberOfChapters || w.chapters), 3, 60, 12));
      if (w.wordsPerChapter) setWordsPerChapter(Number(w.wordsPerChapter));
      if (Array.isArray(w.characters) && w.characters.length) {
        setCharacters(w.characters.map((c: any) => ({
          id: makeId(), name: c.name || '', role: c.role || 'Personnage principal', traits: c.description || c.traits || '',
        })));
      }
      if (Array.isArray(w.outline) && w.outline.length) {
        const restoredOutline = w.outline.map((o: any, i: number) => ({
          id: makeId(), numero: o.numero || i + 1, titre: o.titre || `Chapitre ${i + 1}`, objectif: o.objectif || '',
        }));
        const restoredCount = clampNumber(Number(w.numberOfChapters || w.chapters || restoredOutline.length), 3, 60, restoredOutline.length || 12);
        setOutline(hasRepeatedFallbackTitles(restoredOutline, restoredCount)
          ? buildFallbackOutline(w.title || title, wGenre || effectiveCategory, restoredCount)
          : restoredOutline);
      }
      if (w.cibleProfil) setCibleProfil(w.cibleProfil);
      if (w.cibleNiveau) setCibleNiveau(w.cibleNiveau);
      if (w.cibleBesoins) setCibleBesoins(w.cibleBesoins);
      if (w.cibleFrustrations) setCibleFrustrations(w.cibleFrustrations);
      if (w.promesseCentrale) setPromesseCentrale(w.promesseCentrale);
      if (w.promesseBenefices) setPromesseBenefices(w.promesseBenefices);
      if (w.promesseDifferenciation) setPromesseDifferenciation(w.promesseDifferenciation);
      if (w.promesseEmotion) setPromesseEmotion(w.promesseEmotion);
      if (w.bibleUnivers) setBibleUnivers(w.bibleUnivers);
      if (w.arbreNarratif) setArbreNarratif(w.arbreNarratif);

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
  }, [requestedProjectId]);


  const [title, setTitle] = useState(hub.title || '');
  const [description, setDescription] = useState(hub.description || '');
  /** Mots exacts de l'auteur (souvenirs, récit) : transmis aux agents, jamais résumés. */
  const [sourceText, setSourceText] = useState<string>((hub as any).sourceText || '');

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

  // Bible de l'univers & Arbre narratif (fiction / séries / univers étendus)
  const [bibleUnivers, setBibleUnivers] = useState('');
  const [arbreNarratif, setArbreNarratif] = useState('');


  // Assistant IA — trouve titre / sous-titre / synopsis / catégories à partir d'une idée ou d'une niche.
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; subtitle: string; synopsis: string; categories: string[] } | null>(null);

  // Ouverture depuis « Mes livres » : recharge le vrai projet cloud dans le
  // workflow, au lieu d'afficher uniquement sa page publique en lecture.
  useEffect(() => {
    if (!requestedProjectId) return;
    let cancelled = false;

    const openSavedProject = async () => {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        toast.error('Connecte-toi pour ouvrir ce livre.');
        return;
      }

      const { data, error } = await supabase
        .from('ebook_projects')
        .select('*')
        .eq('id', requestedProjectId)
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        toast.error(error?.message || 'Livre introuvable dans Mes livres.');
        return;
      }

      let saved = data as any;
      let savedChapters = Array.isArray(saved.chapters) ? saved.chapters : [];

      // Les anciens workflows ont parfois enregistré le manuscrit complet dans
      // l'historique des versions avant de mettre à jour la fiche principale.
      // Récupère automatiquement la dernière version exploitable : l'abonné ne
      // doit jamais avoir à régénérer un livre déjà terminé.
      if (!savedChapters.some((chapter: any) => String(chapter?.content || chapter?.contenu || '').trim())) {
        const { data: versions } = await supabase
          .from('ebook_project_versions')
          .select('*')
          .eq('project_id', requestedProjectId)
          .eq('user_id', auth.user.id)
          .order('version_number', { ascending: false });
        const completeVersion = (versions || []).find((version: any) =>
          Array.isArray(version?.chapters)
          && version.chapters.some((chapter: any) => String(chapter?.content || chapter?.contenu || '').trim())
        );
        if (completeVersion) {
          saved = { ...saved, ...completeVersion, id: data.id, title: completeVersion.title || data.title };
          savedChapters = completeVersion.chapters;
        }
      }
      const restoredOutline = savedChapters.map((chapter: any, index: number) => ({
        id: makeId(),
        numero: Number(chapter.number || chapter.numero || index + 1),
        titre: cleanText(chapter.title || chapter.titre || `Chapitre ${index + 1}`),
        objectif: cleanText(chapter.objectif || chapter.goal || ''),
      }));
      const savedImages = Array.isArray(saved.ebook_images) ? saved.ebook_images : [];
      const savedCover = savedImages.find((image: any) => image?.type === 'front_cover')?.url || saved.cover_concepts || null;
      const savedSubtitle = String(saved.narrative_format || '').replace(/^Sous-titre\s*:\s*/i, '');
      const savedChapterCount = clampNumber(Number(saved.number_of_chapters || savedChapters.length), 3, 60, 12);

      restoreRef.current = true;
      syncProjectId(saved.id);
      setTitle(saved.title || '');
      setFinalTitle(saved.title || '');
      setSubtitle(savedSubtitle === 'Workflow V3 complet' ? '' : savedSubtitle);
      setAuthorName(saved.author_name || 'Auteur Ebookstudio');
      setDescription(saved.preface || saved.book_summary || 'Livre sauvegardé dans Mes livres.');
      setTone(saved.tone || saved.writing_style || 'Inspirant');
      setChapters(savedChapterCount);
      if (saved.kdp_categories) {
        const match = CATEGORIES.find((item) => item.toLowerCase() === String(saved.kdp_categories).toLowerCase());
        if (match) setCategory(match);
        else { setCategory('Autre'); setCustomCategory(String(saved.kdp_categories)); }
      }
      if (restoredOutline.length) setOutline(restoredOutline);
      if (Array.isArray(saved.characters) && saved.characters.length) {
        setCharacters(saved.characters.map((character: any) => ({
          id: makeId(),
          name: character.name || '',
          role: character.role || 'Personnage',
          traits: character.description || character.traits || '',
        })));
      }
      setCoverUrl(savedCover);
      const hasManuscript = savedChapters.some((chapter: any) =>
        String(chapter?.content || chapter?.contenu || '').trim().length > 0
      );
      if (hasManuscript) {
        setCompletedBook({
          chapters: savedChapters,
          conclusion: saved.conclusion || '',
          backCover: { description: saved.kdp_description || '' },
        });
        setLaunched(true);
      } else {
        setStep(2);
        setLaunched(false);
      }
        toast.success(`« ${saved.title} » est ouvert — l’export est affiché en premier.`);
    };

    void openSavedProject();
    return () => { cancelled = true; };
    // syncProjectId is intentionally stable for the lifetime of this wizard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedProjectId]);

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
    .concat(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters).slice(outline.length))
    .slice(0, chapters)
    .map((item, index) => {
      const cleanedTitle = cleanText(item.titre);
      const fallbackTitle = cleanedTitle && !isGenericTitle(cleanedTitle)
        ? cleanedTitle
        : buildFallbackOutline(finalTitle || title, effectiveCategory, chapters)[index]?.titre || `Chapitre ${index + 1} — ${cleanText(finalTitle || title || effectiveCategory)}`;
      return { ...item, numero: index + 1, titre: fallbackTitle, objectif: cleanText(item.objectif) };
    });

  // Chaque chapitre rappelle les passages du récit de l'auteur qu'il doit raconter :
  // la rédaction suit ainsi sa vie, dans son ordre, sans inventer d'épisode.
  const outlineText = normalizedOutline
    .map((chapter, index) => {
      const brief = readBookBrief() || {};
      const passages = listSourcePassages(String(brief.sourceText || ''));
      const assigned = (brief.outline || [])[index]?.sources || [];
      const memories = assigned
        .map((n) => passages[Number(n) - 1])
        .filter(Boolean)
        .map((text, i) => `  Souvenir ${assigned[i]} (mots de l'auteur, à développer, jamais à résumer) : "${String(text).slice(0, 1500)}"`)
        .join('\n');
      return [
        `Chapitre ${chapter.numero} — ${chapter.titre}`,
        `Objectif : ${chapter.objectif || 'Objectif éditorial à préciser.'}`,
        memories,
      ].filter(Boolean).join('\n');
    })
    .join('\n');

  const canStepOne = title.trim().length >= 3 && description.trim().length >= 30;
  const canStepTwo = Boolean(effectiveCategory.trim()) && chapters >= 3 && chapters <= 60 && wordsPerChapter >= 500;
  // Sommaire non bloquant : les agents V2 (P3 « L'Architecte ») reconstruisent le plan si l'auteur ne l'a pas affiné.
  const canStepOutline = normalizedOutline.length >= 3;
  const canStepFour = finalTitle.trim().length >= 3 && authorName.trim().length >= 2;

  // Instantané du brief pour le récapitulatif « Livre en préparation » sur /v3
  useEffect(() => {
    if (!title.trim() && !description.trim()) return;
    // Le Génie et le wizard partagent la même fiche. Toujours reprendre ici la
    // matière la plus récente du stockage, sinon un ancien état React pouvait
    // écraser les nouveaux souvenirs saisis dans le dialogue.
    const currentBrief = readBookBrief() || {};
    writeBookBrief({
      ...currentBrief,
      title: finalTitle.trim() || title.trim(),
      subtitle: subtitle.trim(),
      author: authorName.trim(),
      description: description.trim(),
      sourceText: String(currentBrief.sourceText || sourceText).trim(),

      category: effectiveCategory,
      genre: effectiveCategory,
      tone,
      chapters,
      numberOfChapters: chapters,
      wordsPerChapter,
      outline: normalizedOutline.map((c) => ({ numero: c.numero, titre: c.titre, objectif: c.objectif })),
      characters: characters.filter((c) => c.name.trim()).map((c) => ({ name: c.name, role: c.role, description: c.traits, traits: c.traits })),
      cibleProfil, cibleNiveau, cibleBesoins, cibleFrustrations,
      promesseCentrale, promesseBenefices, promesseDifferenciation, promesseEmotion,
      projectId,
    } as any);
  }, [title, finalTitle, subtitle, authorName, description, sourceText, effectiveCategory, tone, chapters, wordsPerChapter, normalizedOutline, characters, cibleProfil, cibleNiveau, cibleBesoins, cibleFrustrations, promesseCentrale, promesseBenefices, promesseDifferenciation, promesseEmotion, projectId]);

  const [showTocPaste, setShowTocPaste] = useState(false);
  const [tocPasteText, setTocPasteText] = useState('');

  const applyImportedToc = (imported: BriefOutlineChapter[], sourceLabel: string) => {
    if (!imported.length) {
      toast.error('Aucun chapitre détecté dans ce sommaire.');
      return;
    }
    const capped = imported.slice(0, 60);
    setOutline(capped.map((chapter, index) => ({
      id: makeId(),
      numero: index + 1,
      titre: cleanText(chapter.titre) || `Chapitre ${index + 1}`,
      objectif: cleanText(chapter.objectif || ''),
    })));
    setChapters(clampNumber(capped.length, 3, 60, capped.length));
    toast.success(`${capped.length} chapitres importés (${sourceLabel}) ✓`);
  };

  const importUltimateToc = () => {
    const found = readLatestUltimateToc();
    if (!found) {
      toast.error('Aucun sommaire trouvé. Crée-le dans « Sommaire Ultime » puis clique sur « Envoyer vers le workflow ».');
      return;
    }
    applyImportedToc(found.chapters, found.source);
    clearTocForWorkflow();
  };

  // Import automatique quand on arrive depuis /v3/toc-ultime (?toc=ultime)
  const tocParamHandled = useRef(false);
  useEffect(() => {
    if (tocParamHandled.current) return;
    const wantsToc = new URLSearchParams(window.location.search).get('toc') === 'ultime';
    if (!wantsToc) return;
    tocParamHandled.current = true;
    const found = readLatestUltimateToc();
    if (found) {
      applyImportedToc(found.chapters, found.source);
      clearTocForWorkflow();
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasRepeatedFallbackTitles(outline, chapters)) {
      setOutline(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters));
    }
  }, [chapters, effectiveCategory, finalTitle, title, outline]);

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
    sourceText.trim()
      ? `✍️ MATIÈRE BRUTE DE L'AUTEUR — ses mots exacts. RÈGLE ABSOLUE : ne jamais résumer, raccourcir ni supprimer ces souvenirs. Chaque passage doit être DÉVELOPPÉ en scènes complètes (dialogues, sensations, décors), en corrigeant seulement l'orthographe, la grammaire et le style :\n"""${sourceText.trim()}"""`
      : '',
    `Style demandé : ${tone}.`,
    `Format prévu : ${chapters} chapitres de ${wordsPerChapter} mots minimum chacun (développement obligatoire, jamais de résumé).`,
    outlineText ? `SOMMAIRE VALIDÉ PAR L'AUTEUR — à respecter strictement :\n${outlineText}` : '',

    workflowCharacters.length
      ? `Personnages fournis : ${workflowCharacters.map((character) => `${character.name} (${character.role}) — ${character.description}`).join(' | ')}`
      : '',
    bibleUnivers.trim() ? `📚 BIBLE DE L'UNIVERS — cohérence obligatoire pour tous les agents :\n${bibleUnivers.trim()}` : '',
    arbreNarratif.trim() ? `🌳 ARBRE NARRATIF — arcs, embranchements, chronologie :\n${arbreNarratif.trim()}` : '',
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
      ? normalizeManuscript(completed.chapters, {
          expectedCount: chapters,
          outline: normalizedOutline,
          bookTitle: resolvedTitle,
        })
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
        bibleUnivers, arbreNarratif,
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
    [
      'ebook_workflow_progress',
      'ebook_workflow_results',
      'ebook_workflow_sync_data',
      WIZARD_KEY,
      CONFIG_KEY,
      PROJECT_ID_KEY,
    ].forEach((k) => localStorage.removeItem(k));
    restoreRef.current = true; // évite qu'un effet de reprise ne recharge l'ancien brouillon
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
- jamais le même titre répété ;
- interdiction de répéter "L'aboutissement" ou une formule de conclusion sur plusieurs chapitres ;
- aucun bloc markdown, aucune balise json ;
- titres courts, vendeurs, cohérents avec le synopsis.`;
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: 0.55, maxTokens: Math.min(12000, 1800 + chapters * 180) });
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
      const aiChapters = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
      const seenTitles = new Set<string>();
      const nextOutline = aiChapters.map((item: any, index: number) => ({
        id: makeId(),
        numero: index + 1,
        titre: cleanText(item.titre || item.title),
        objectif: cleanText(item.objectif || item.goal || item.description),
      })).filter((item: OutlineChapter) => {
        const key = cleanText(item.titre).toLowerCase();
        if (isGenericTitle(item.titre) || seenTitles.has(key)) return false;
        seenTitles.add(key);
        return true;
      }).slice(0, chapters);
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
    if (step === 1 && hasRepeatedFallbackTitles(outline, chapters)) {
      setOutline(buildFallbackOutline(finalTitle || title, effectiveCategory, chapters));
      toast.warning('Ancien sommaire répétitif remplacé par un plan complet.');
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
    publishWrittenChapters(Array.isArray(bookData?.chapters) ? bookData.chapters : []);
    await saveProjectToCloud({ silent: true, completedBookOverride: bookData });
    toast.success('Livre terminé et sauvegardé dans Mes livres.');
  };

  // La colonne « Déjà écrit » suit la rédaction en direct.
  useEffect(() => {
    if (!completedBook) return;
    publishWrittenChapters(Array.isArray(completedBook.chapters) ? completedBook.chapters : []);
  }, [completedBook]);


  // Correction automatique du livre terminé (V3) : aucune action de l'abonné.
  useEffect(() => {
    if (!completedBook || autoFixStartedRef.current) return;
    const source = Array.isArray(completedBook.chapters) ? completedBook.chapters : [];
    const items = source
      .map((c: any, index: number) => ({
        index,
        title: String(c.title || c.titre || `Chapitre ${index + 1}`),
        original: String(c.content || c.contenu || ''),
      }))
      .filter((c) => c.original.trim().length > 200);
    if (items.length === 0) return;

    autoFixStartedRef.current = true;
    let cancelled = false;
    setAutoFix({ running: true, done: 0, total: items.length, corrections: 0, latin: 0, failed: 0, finished: false });

    (async () => {
      const list: ChapterProofread[] = items.map((c) => ({
        chapterId: `auto-${c.index}`,
        index: c.index,
        title: c.title,
        original: c.original,
        corrected: '',
        corrections: [],
        quality: 0,
        status: 'pending',
        accepted: false,
      }));

      await proofreadChapters(
        list,
        'strict',
        (p) => {
          if (cancelled) return;
          const ch = p.chapter;
          if (ch.status === 'done' && ch.corrected) {
            setCompletedBook((prev: any) => {
              if (!prev) return prev;
              const next = [...(prev.chapters || [])];
              const target = next[ch.index];
              if (!target) return prev;
              next[ch.index] = { ...target, content: ch.corrected, contenu: ch.corrected, corrected: true };
              return { ...prev, chapters: next };
            });
            setAutoFix((s) => ({
              ...s,
              done: s.done + 1,
              corrections: s.corrections + (ch.corrections?.length || 0),
              latin: (s.latin || 0) + (ch.latinRemoved || 0),
            }));

          } else if (ch.status === 'failed') {
            setAutoFix((s) => ({ ...s, done: s.done + 1, failed: s.failed + 1 }));
          }
        },
        () => cancelled,
      );

      if (cancelled) return;
      setAutoFix((s) => ({ ...s, running: false, finished: true }));
      toast.success('Relecture automatique terminée : le manuscrit corrigé est prêt à exporter.');
      setCompletedBook((prev: any) => {
        if (prev) void saveProjectToCloud({ silent: true, completedBookOverride: prev });
        return prev;
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedBook]);



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
      const out = normalizeManuscript(rawCh, {
        expectedCount: chapters,
        outline: p3Ch.length > 0 ? p3Ch : normalizedOutline,
        bookTitle: finalTitle || title,
      });

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
          publishWrittenChapters(partial.chapters);
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
        bibleUnivers, arbreNarratif,
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
              <span className="v3-chip v3-chip-orange">
                {completedBook ? <Check className="h-3.5 w-3.5" /> : <Rocket className="h-3.5 w-3.5" />}
                {completedBook ? 'Livre terminé et sauvegardé' : 'Workflow lancé'}
              </span>
              <h2 className="v3-serif mt-3 text-3xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                {completedBook ? 'Ton livre est prêt à exporter' : 'Les agents travaillent sur ton livre'}
              </h2>
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


        {completedBook && (autoFix.running || autoFix.finished) && (
          <div className="rounded-[28px] border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
            <div className="flex items-center gap-3">
              {autoFix.running ? <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--v3-orange-600)' }} /> : <Check className="h-5 w-5" style={{ color: 'var(--v3-orange-600)' }} />}
              <div>
                <h3 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>
                  {autoFix.running ? 'Relecture automatique en cours' : 'Relecture automatique terminée'}
                </h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
                  {autoFix.done}/{autoFix.total} chapitres relus · {autoFix.corrections} corrections appliquées
                  {autoFix.latin > 0 ? ` · ${autoFix.latin} expression(s) latine(s) supprimée(s)` : ''}
                  {autoFix.failed > 0 ? ` · ${autoFix.failed} chapitre(s) à revoir dans le Correcteur` : ''}

                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--v3-orange-50)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${autoFix.total ? Math.round((autoFix.done / autoFix.total) * 100) : 0}%`, background: 'var(--v3-orange-600)' }}
              />
            </div>
          </div>
        )}

        {completedBook ? (
          <div id="exports-livre" className="scroll-mt-24">

            <V3ExportPanel
              manuscript={(completedBook.chapters || []).map((c: any, index: number) => {
                const validatedOutlineTitle = normalizedOutline[index]?.titre?.trim();
                const generatedTitle = typeof c.title === 'string' ? c.title.trim() : '';
                const titleForExport = validatedOutlineTitle || generatedTitle || `Chapitre ${index + 1}`;
                return `# Chapitre ${index + 1} – ${titleForExport.replace(/^chapitre\s+\d+\s*[:–—-]?\s*/i, '')}\n\n${c.content || c.contenu || ''}`;
              }).join('\n\n')}
              title={finalTitle}
              subtitle={subtitle}
              author={authorName}
            />
          </div>
        ) : (
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
        )}

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
            <div className="mt-5 flex flex-col items-center gap-4">
              <div className="w-[320px] max-w-full aspect-[2/3] rounded-xl overflow-hidden border flex items-center justify-center" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-orange-50)' }}>
                {coverLoading && !coverUrl ? (
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-orange-600)' }} />
                ) : coverUrl ? (
                  <img src={coverUrl} alt={`Couverture ${finalTitle}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs px-2 text-center" style={{ color: 'var(--v3-muted)' }}>Aucune couverture</span>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  disabled={!coverUrl}
                  onClick={async () => {
                    if (!coverUrl) return;
                    try {
                      const response = await fetch(coverUrl);
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `couverture-${(finalTitle || 'livre').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
                      link.click();
                      URL.revokeObjectURL(url);
                      toast.success('Couverture téléchargée.');
                    } catch {
                      window.open(coverUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-50"
                  style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
                >
                  <FileDown className="h-4 w-4" /> Télécharger l’image
                </button>
                <button
                  type="button"
                  disabled={!coverUrl}
                  onClick={async () => {
                    if (!coverUrl) return;
                    await navigator.clipboard.writeText(coverUrl);
                    toast.success('URL de la couverture copiée.');
                  }}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-50"
                  style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
                >
                  <Copy className="h-4 w-4" /> Copier l’URL
                </button>
                <Link
                  to={`/v3/cover-studio-pro/edit?title=${encodeURIComponent(finalTitle)}&subtitle=${encodeURIComponent(subtitle || '')}&author=${encodeURIComponent(authorName)}${coverUrl ? `&image=${encodeURIComponent(coverUrl)}` : ''}`}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                  style={{ background: 'var(--v3-ink)', color: '#fff' }}
                >
                  <Palette className="h-4 w-4" /> Ouvrir Cover Studio Pro
                </Link>
                <Link
                  to="/couverture-kdp"
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
                  style={{ borderColor: 'var(--v3-orange-600)', color: 'var(--v3-orange-600)', background: 'var(--v3-paper)' }}
                >
                  <ExternalLink className="h-4 w-4" /> Couverture PDF exacte KDP
                </Link>
              </div>
            </div>
          </div>
        )}

        {completedBook && (
          <V3KdpPublishPanel
            title={finalTitle}
            subtitle={subtitle}
            author={authorName}
            category={effectiveCategory}
            coverUrl={coverUrl}
            initialDescription={completedBook?.backCover?.description || ''}
            manuscript={(completedBook.chapters || []).map((c: any, index: number) => {
              const validatedOutlineTitle = normalizedOutline[index]?.titre?.trim();
              const generatedTitle = typeof c.title === 'string' ? c.title.trim() : '';
              const titleForExport = validatedOutlineTitle || generatedTitle || `Chapitre ${index + 1}`;
              return `# Chapitre ${index + 1} – ${titleForExport.replace(/^chapitre\s+\d+\s*[:–—-]?\s*/i, '')}\n\n${c.content || ''}`;
            }).join('\n\n')}
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


  const steps = ['Fiche du livre', 'Style', 'Sommaire', 'Personnages', 'Titre'];

  return (
    <div className="space-y-8">
      {resumeInfo && !launched && (
        <div className="rounded-[24px] border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between" style={{ borderColor: 'var(--v3-orange-600)', background: 'var(--v3-orange-50)' }}>
          <div className="flex items-start gap-3">
            <RotateCcw className="h-5 w-5 mt-0.5" style={{ color: 'var(--v3-orange-600)' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
                Livre en cours détecté : « {resumeInfo.title} »
              </p>
              <p className="text-xs" style={{ color: 'var(--v3-muted)' }}>
                Le workflow s'est arrêté à l'étape <strong>{resumeInfo.lastStep}</strong>. Reprends exactement là où tu t'étais arrêté — les chapitres déjà écrits sont conservés.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setLaunched(true); setResumeInfo(null); toast.success('Reprise du workflow — les agents redémarrent au dernier chapitre.'); }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: 'var(--v3-orange-600)', color: '#fff' }}
            >
              <Rocket className="h-4 w-4" /> Reprendre le workflow
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm('Repartir de zéro effacera la progression enregistrée. Continuer ?')) return;
                ['ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data'].forEach((k) => localStorage.removeItem(k));
                setResumeInfo(null);
                toast.info('Progression effacée — tu peux repartir de zéro.');
              }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
            >
              Effacer
            </button>
          </div>
        </div>
      )}

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

      {/* Panneau "Clés API & Modèles IA" affiché par V3CreatePage — pas de doublon ici. */}





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
            <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Fiche du livre</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Titre, sous-titre, catégorie KDP, auteur et synopsis : c’est la base que suivront les agents.</p>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Titre du livre</span>
            <input
              value={title}
              onChange={(event) => { setTitle(event.target.value); if (!finalTitle.trim()) setFinalTitle(event.target.value); }}
              placeholder="Ex : Le guide complet pour publier son premier livre"
              className="w-full rounded-2xl border px-4 py-4 text-lg outline-none"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Sous-titre <span className="font-normal" style={{ color: 'var(--v3-muted)' }}>(optionnel)</span></span>
            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Ex : la méthode pas à pas pour publier sur Amazon KDP en 30 jours"
              className="w-full rounded-2xl border px-4 py-3 outline-none"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Catégorie ({CATEGORIES.length} disponibles)</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                size={8}
                className="w-full rounded-2xl border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
              >
                {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <span className="block text-xs" style={{ color: 'var(--v3-muted)' }}>Sélection : <strong>{category === 'Autre' ? (customCategory || 'Autre') : category}</strong></span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Nom de l’auteur</span>
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="Ex : Nanakia"
                className="w-full rounded-2xl border px-4 py-3 outline-none"
                style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
              />
              {category === 'Autre' && (
                <input
                  value={customCategory}
                  onChange={(event) => setCustomCategory(event.target.value)}
                  placeholder="Précise ta catégorie"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none"
                  style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
                />
              )}
            </label>
          </div>
          <label className="block space-y-2">
            <span className="flex items-center justify-between gap-3 text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
              Synopsis du livre
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
          {promesseCentrale.trim() && (
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--v3-orange-600)', background: 'var(--v3-orange-50)' }}>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--v3-muted)' }}>Promesse centrale (générée par l’IA)</span>
              <p className="mt-1 text-sm" style={{ color: 'var(--v3-ink)' }}>✨ {promesseCentrale}</p>
            </div>
          )}
        </div>
      )}


      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="v3-serif text-4xl font-bold" style={{ color: 'var(--v3-ink)' }}>Style du livre</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>Choisis le ton, le nombre de chapitres et la longueur. Catégorie retenue : <strong>{category === 'Autre' ? (customCategory || 'Autre') : category}</strong>.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>Ton</span>
              <select value={tone} onChange={(event) => setTone(event.target.value)} className="w-full rounded-2xl border px-4 py-3 outline-none" style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}>
                {TONES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>

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
                  onClick={() => setShowTocTool(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-white px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50"
                  title="Ouvrir le générateur avancé (genre, public, style, créativité)"
                >
                  <Wrench className="h-3 w-3" /> Générateur ultime
                </button>
                <button
                  type="button"
                  onClick={importUltimateToc}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                  title="Injecter le sommaire créé dans l'outil « Sommaire Ultime »"
                >
                  <FileDown className="h-3 w-3" /> Injecter mon Sommaire Ultime
                </button>
                <button
                  type="button"
                  onClick={() => setShowTocPaste(true)}
                  className="text-xs font-bold underline"
                  style={{ color: 'var(--v3-muted)' }}
                >
                  Coller mon sommaire
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
              {normalizedOutline.map((chapter, index) => {
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

      <Dialog open={showTocTool} onOpenChange={setShowTocTool}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-orange-500" /> Générateur Ultime de Sommaire
            </DialogTitle>
          </DialogHeader>
          <TocUltimateGenerator
            initialTheme={title}
            initialDescription={description}
            initialGenre={effectiveCategory}
            initialChapters={chapters}
            onApply={(chs: UltimateTocChapter[]) => {
              setOutline(chs.map((c, i) => ({ id: c.id, numero: i + 1, titre: c.titre, objectif: c.objectif })));
              setChapters(chs.length);
              setShowTocTool(false);
              toast.success(`Sommaire de ${chs.length} chapitres appliqué au wizard ✓`);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTocPaste} onOpenChange={setShowTocPaste}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-4 w-4 text-emerald-600" /> Coller mon sommaire
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Une ligne = un chapitre. Formats acceptés : texte, Markdown, ou JSON du Sommaire Ultime. « Titre | Objectif » est reconnu.
          </p>
          <textarea
            value={tocPasteText}
            onChange={(event) => setTocPasteText(event.target.value)}
            rows={12}
            placeholder={'1. L’appel du large | Installer le décor et la tension\n2. La première fissure | ...'}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => {
              const parsed = parseTocText(tocPasteText);
              if (!parsed.length) { toast.error('Aucun chapitre détecté.'); return; }
              applyImportedToc(parsed, 'sommaire collé');
              setShowTocPaste(false);
            }}
            className="v3-btn v3-btn-primary w-full justify-center"
          >
            <Check className="h-4 w-4" /> Injecter dans le workflow
          </button>
        </DialogContent>
      </Dialog>




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

          <div className="rounded-3xl border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">📚</span>
              <h3 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>Bible de l'univers</h3>
            </div>
            <p className="mb-3 text-sm" style={{ color: 'var(--v3-muted)' }}>
              Décris ton univers : lieux, factions, règles, magie, chronologie, ambiance. Ce texte sera injecté dans TOUS les agents pour garantir la cohérence (idéal pour séries, sagas, mondes étendus).
            </p>
            <textarea
              value={bibleUnivers}
              onChange={(e) => setBibleUnivers(e.target.value)}
              rows={8}
              placeholder={"Ex :\n• Monde : Terre alternative après 2087, climat effondré, IA omniprésentes.\n• Factions : Concile de l'Aube (ordre), Nomades du Silex (résistance).\n• Règles : voyage temporel possible mais irréversible.\n• Ton : mélancolique, technologique, poétique."}
              className="w-full resize-y rounded-2xl border px-4 py-3 outline-none text-sm"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-bg)' }}
            />
          </div>

          <div className="rounded-3xl border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🌳</span>
              <h3 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>Arbre narratif</h3>
            </div>
            <p className="mb-3 text-sm" style={{ color: 'var(--v3-muted)' }}>
              Arcs, embranchements, choix, points de bascule, chronologie. Colle ton arbre narratif ici — les agents respecteront la structure lors de la génération.
            </p>
            <textarea
              value={arbreNarratif}
              onChange={(e) => setArbreNarratif(e.target.value)}
              rows={8}
              placeholder={"Ex :\nActe I → rencontre → révélation A\n  ├─ Choix 1 : accepte → arc trahison\n  └─ Choix 2 : refuse → arc exil\nActe II → point de bascule chapitre 12 (mort du mentor)\nActe III → convergence des arcs au chapitre 22\nFinal → épilogue ouvert sur tome 2."}
              className="w-full resize-y rounded-2xl border px-4 py-3 outline-none text-sm"
              style={{ borderColor: 'var(--v3-border)', color: 'var(--v3-ink)', background: 'var(--v3-bg)' }}
            />
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

          {/* Cible & Promesse — générée par l'IA sur la fiche du livre (lecture seule ici) */}
          {promesseCentrale.trim() && (
            <div className="rounded-[28px] border p-5" style={{ borderColor: 'var(--v3-border)', background: 'var(--v3-paper)' }}>
              <span className="v3-chip v3-chip-orange"><Sparkles className="h-3.5 w-3.5" /> Cible &amp; Promesse (IA)</span>
              <p className="v3-serif mt-2 text-lg font-bold" style={{ color: 'var(--v3-ink)' }}>{promesseCentrale}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--v3-muted)' }}>
                {[cibleProfil, cibleBesoins, promesseEmotion].filter(Boolean).join(' · ')}
              </p>
            </div>
          )}

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