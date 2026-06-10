import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ArrowRight, Check, ChevronDown, RotateCcw, Trophy, Lock, Sparkles, Loader2, Wand2, AlertCircle,
  Pencil, Save, X,
} from 'lucide-react';
import { getModuleById, type V3Module } from '@/data/roadmapV3';
import { isModuleClickable } from './v3ModuleRegistry';
import { supabase } from '@/integrations/supabase/client';
import { useOpenAIConfig } from '@/hooks/useOpenAIConfig';

// Palette « Clair Ambre » — cohérente avec V3HubPage.
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Georgia', 'Times New Roman', serif";

const PROGRESS_KEY = 'v3_workflow30_progress';
const RESULTS_KEY = 'v3_workflow30_results';
const THEME_KEY = 'v3_workflow30_theme';
const BRIEF_KEY = 'v3_workflow30_brief';

interface Brief {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  chapterCount: string;
  wordsPerChapter: string;
}
const EMPTY_BRIEF: Brief = { title: '', subtitle: '', author: '', category: '', chapterCount: '', wordsPerChapter: '' };
function loadBrief(): Brief {
  try {
    const raw = localStorage.getItem(BRIEF_KEY);
    return raw ? { ...EMPTY_BRIEF, ...(JSON.parse(raw) as Partial<Brief>) } : EMPTY_BRIEF;
  } catch {
    return EMPTY_BRIEF;
  }
}

interface Step {
  moduleId: string;
  label?: string;
  hint: string;
}
interface Phase {
  key: string;
  emoji: string;
  title: string;
  steps: Step[];
}

/** Le parcours complet : de l'idée au livre publié et vendu. 30 étapes. */
const PHASES: Phase[] = [
  {
    key: 'idee', emoji: '🔎', title: 'Phase 1 — Trouver l\'idée gagnante',
    steps: [
      { moduleId: 'p22-trend-radar', label: 'Repérer les tendances', hint: 'Détecte les sujets qui montent sur Amazon.' },
      { moduleId: 'niche-intelligence', label: 'Choisir la niche', hint: 'L\'IA sélectionne la niche la plus rentable.' },
      { moduleId: 'p16-competitive', label: 'Analyser la concurrence', hint: 'Étudie les best-sellers de la niche.' },
      { moduleId: 'ku-niche-detector', label: 'Vérifier la rentabilité (KU)', hint: 'Confirme le potentiel de revenus.' },
      { moduleId: 'p26-commercial-score', label: 'Valider le potentiel', hint: 'Note le potentiel commercial avant d\'écrire.' },
    ],
  },
  {
    key: 'ecriture', emoji: '✍️', title: 'Phase 2 — Concevoir & écrire le livre',
    steps: [
      { moduleId: 'book-creation-studio', label: 'Créer le concept & le plan', hint: 'Titre, sous-titre, structure et 1er chapitre.' },
      { moduleId: 'p17-series', label: 'Architecturer la série', hint: 'Planifie les tomes si c\'est une saga.' },
      { moduleId: 'p19-author-voice', label: 'Fixer la voix d\'auteur', hint: 'Définit un style constant pour tout le livre.' },
      { moduleId: 'p20-chat-manuscript', label: 'Développer le manuscrit', hint: 'Rédige le cœur du contenu chapitre par chapitre.' },
      { moduleId: 'p23-universe-bible', label: 'Vérifier la cohérence', hint: 'Contrôle la cohérence de l\'univers et des persos.' },
    ],
  },
  {
    key: 'qualite', emoji: '🧪', title: 'Phase 3 — Réviser & garantir la qualité',
    steps: [
      { moduleId: 'p18-readability', label: 'Auditer la lisibilité', hint: 'Mesure et améliore la fluidité de lecture.' },
      { moduleId: 'p24-cliche-detector', label: 'Nettoyer clichés & répétitions', hint: 'Supprime les tics d\'écriture et redites.' },
      { moduleId: 'p25-tone-adapter', label: 'Adapter le ton', hint: 'Ajuste le ton à la cible de lecteurs.' },
      { moduleId: 'ebook-anti-plagiat', label: 'Vérifier l\'originalité', hint: 'Contrôle l\'originalité et protège le texte.' },
      { moduleId: 'content-compliance', label: 'Contrôler la conformité KDP', hint: 'Évite les motifs de refus à la publication.' },
    ],
  },
  {
    key: 'mise-en-page', emoji: '🎨', title: 'Phase 4 — Mise en page & couverture',
    steps: [
      { moduleId: 'manuscript-converter', label: 'Préparer le manuscrit', hint: 'Met le fichier au bon format KDP.' },
      { moduleId: 'back-matter-builder', label: 'Rédiger les pages de fin', hint: 'Remerciements, bio et appels à l\'action.' },
      { moduleId: 'copyright-page', label: 'Générer la page copyright', hint: 'Crée les mentions légales obligatoires.' },
      { moduleId: 'cover-studio-pro', label: 'Concevoir la couverture', hint: 'Direction artistique de couverture haut de gamme.' },
      { moduleId: 'cover-variants-thumbnail', label: 'Tester la miniature Amazon', hint: 'Valide la lisibilité du titre en petit.' },
    ],
  },
  {
    key: 'publication', emoji: '🚀', title: 'Phase 5 — Préparer & publier sur KDP',
    steps: [
      { moduleId: 'multi-format-express', label: 'Choisir les formats', hint: 'Ebook + broché prêts à l\'upload.' },
      { moduleId: 'cover-pdf-exact', label: 'Couverture KDP exacte', hint: 'Dos + 4e + fonds perdus aux bonnes cotes.' },
      { moduleId: 'kindle-previewer', label: 'Vérifier le rendu', hint: 'Contrôle l\'affichage avant publication.' },
      { moduleId: 'isbn-metadata', label: 'Rédiger ISBN & métadonnées', hint: 'Titre, sous-titre, mots-clés et description.' },
      { moduleId: 'categories-manager-10', label: 'Choisir les 10 catégories', hint: 'Maximise la visibilité avec 10 catégories.' },
      { moduleId: 'prepub-checklist', label: 'Passer la checklist finale', hint: 'Vérifie tout avant de publier.' },
      { moduleId: 'kdp-pack-zip', label: 'Préparer le pack KDP', hint: 'Récapitulatif des fichiers prêts à l\'upload.' },
    ],
  },
  {
    key: 'vente', emoji: '📈', title: 'Phase 6 — Lancer & vendre',
    steps: [
      { moduleId: 'sales-description', label: 'Écrire la description vendeuse', hint: 'Une fiche produit qui convertit.' },
      { moduleId: 'listing-optimizer', label: 'Optimiser l\'annonce', hint: 'Titre et mots-clés optimisés pour Amazon.' },
      { moduleId: 'launch-sequence-j7', label: 'Préparer la séquence J-7', hint: 'Plan de lancement jour par jour.' },
      { moduleId: 'sales-tracker', label: 'Mettre en place le suivi des ventes', hint: 'Plan de pilotage des ventes et royalties.' },
    ],
  },
];

interface FlatStep extends Step {
  phaseKey: string;
  phaseTitle: string;
  emoji: string;
  globalIndex: number; // 0-based
}

const FLAT: FlatStep[] = PHASES.flatMap((p) =>
  p.steps.map((s) => ({ ...s, phaseKey: p.key, phaseTitle: p.title, emoji: p.emoji, globalIndex: 0 })),
).map((s, i) => ({ ...s, globalIndex: i }));

const TOTAL = FLAT.length;

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}
function loadResults(): Record<string, string> {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

const V3Workflow30: React.FC<{ onOpenModule: (m: V3Module) => void }> = ({ onOpenModule }) => {
  const { apiKey: userGeminiKey } = useOpenAIConfig();
  const [done, setDone] = useState<Set<string>>(() => loadSet(PROGRESS_KEY));
  const [results, setResults] = useState<Record<string, string>>(() => loadResults());
  const [theme, setTheme] = useState<string>(() => localStorage.getItem(THEME_KEY) ?? '');
  const [brief, setBrief] = useState<Brief>(() => loadBrief());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openPhase, setOpenPhase] = useState<string | null>(PHASES[0].key);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>('');
  const activeRef = useRef<HTMLDivElement>(null);

  // Fournisseur IA + clé personnelle.
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'openrouter'>(
    () => (localStorage.getItem('v3_workflow30_provider') as 'gemini' | 'openai' | 'openrouter') || 'gemini',
  );
  const [model, setModel] = useState<string>(
    () => localStorage.getItem('v3_workflow30_model') || '',
  );
  const [customKey, setCustomKey] = useState<string>(
    () => localStorage.getItem('v3_workflow30_custom_key') || '',
  );
  useEffect(() => { localStorage.setItem('v3_workflow30_provider', provider); }, [provider]);
  useEffect(() => { localStorage.setItem('v3_workflow30_model', model); }, [model]);
  useEffect(() => { localStorage.setItem('v3_workflow30_custom_key', customKey); }, [customKey]);
  const effectiveKey = (customKey.trim() || userGeminiKey || '').trim();
  const MODELS: Record<string, { value: string; label: string }[]> = {
    gemini: [
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (rapide)' },
      { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (qualité)' },
      { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (économique)' },
    ],
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o mini (économique)' },
      { value: 'gpt-4o', label: 'GPT-4o (qualité)' },
      { value: 'gpt-4.1', label: 'GPT-4.1' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini' },
    ],
    openrouter: [
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { value: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
      { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku (rapide)' },
      { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
      { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (raisonnement)' },
      { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'openai/gpt-4o', label: 'GPT-4o' },
      { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
      { value: 'mistralai/mistral-large', label: 'Mistral Large' },
      { value: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' },
      { value: 'x-ai/grok-2', label: 'Grok 2' },
    ],
  };
  const currentModel = model || MODELS[provider][0].value;

  // Sauvegarde cloud des projets.
  const [projects, setProjects] = useState<{ id: string; name: string; updated_at: string }[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('Mon livre');
  const [saving, setSaving] = useState(false);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);

  const refreshProjects = async () => {
    const { data } = await supabase
      .from('v3_workflow_projects')
      .select('id,name,updated_at')
      .order('updated_at', { ascending: false });
    if (data) setProjects(data);
  };
  useEffect(() => { refreshProjects(); }, []);

  const saveToCloud = async () => {
    setCloudMsg(null);
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { setCloudMsg('Connecte-toi pour sauvegarder dans ton compte.'); return; }
      const payload = {
        user_id: auth.user.id,
        name: projectName.trim() || 'Mon livre',
        theme,
        brief: brief as unknown as Record<string, unknown>,
        done: [...done] as unknown as Record<string, unknown>,
        results: results as unknown as Record<string, unknown>,
      };
      if (projectId) {
        const { error: e } = await supabase.from('v3_workflow_projects').update(payload as never).eq('id', projectId);
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase.from('v3_workflow_projects').insert(payload as never).select('id').single();
        if (e) throw e;
        if (data) setProjectId((data as { id: string }).id);
      }

      setCloudMsg('Projet sauvegardé ✓');
      await refreshProjects();
    } catch (e) {
      setCloudMsg(e instanceof Error ? e.message : 'Échec de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const loadFromCloud = async (id: string) => {
    setCloudMsg(null);
    if (!id) return;
    const { data, error: e } = await supabase.from('v3_workflow_projects').select('*').eq('id', id).single();
    if (e || !data) { setCloudMsg('Impossible de charger ce projet.'); return; }
    setProjectId(data.id);
    setProjectName(data.name);
    setTheme(data.theme || '');
    setBrief({ ...EMPTY_BRIEF, ...((data.brief as Partial<Brief>) || {}) });
    setDone(new Set((data.done as string[]) || []));
    setResults((data.results as Record<string, string>) || {});
    setCloudMsg('Projet chargé ✓');
  };

  const newProject = () => {
    setProjectId(null);
    setProjectName('Mon livre');
    setCloudMsg(null);
  };


  useEffect(() => { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done])); }, [done]);
  useEffect(() => { localStorage.setItem(RESULTS_KEY, JSON.stringify(results)); }, [results]);
  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);
  useEffect(() => { localStorage.setItem(BRIEF_KEY, JSON.stringify(brief)); }, [brief]);
  const setBriefField = (k: keyof Brief, v: string) => setBrief((p) => ({ ...p, [k]: v }));

  const completed = useMemo(() => FLAT.filter((s) => done.has(s.moduleId)).length, [done]);
  const pct = Math.round((completed / TOTAL) * 100);

  // Étape active = première non terminée.
  const activeIndex = useMemo(() => {
    const i = FLAT.findIndex((s) => !done.has(s.moduleId));
    return i === -1 ? TOTAL : i;
  }, [done]);

  // Ouvre automatiquement la phase de l'étape active.
  useEffect(() => {
    if (activeIndex < TOTAL) setOpenPhase(FLAT[activeIndex].phaseKey);
  }, [activeIndex]);

  const generate = async (step: FlatStep) => {
    setError(null);
    if (provider === 'gemini' && !effectiveKey) {
      setError("Choisis ta clé Gemini ci-dessus (ou bascule sur un autre fournisseur) pour lancer l'auto-pilote.");
      return;
    }
    if (provider === 'openrouter' && !customKey.trim()) {
      setError("Ajoute ta clé OpenRouter (sk-or-…) ci-dessus pour utiliser Claude, DeepSeek, etc.");
      return;
    }
    setLoadingId(step.moduleId);
    try {
      const mod = getModuleById(step.moduleId);
      const priorOutputs = FLAT.filter((s) => s.globalIndex < step.globalIndex && results[s.moduleId])
        .map((s) => ({ title: s.label ?? getModuleById(s.moduleId)?.title ?? s.moduleId, output: results[s.moduleId] }));

      const { data, error: fnErr } = await supabase.functions.invoke('v3-autopilot-step', {
        body: {
          moduleId: step.moduleId,
          stepNumber: step.globalIndex + 1,
          stepTitle: step.label ?? mod?.title ?? step.moduleId,
          stepHint: step.hint,
          moduleTitle: mod?.title ?? step.moduleId,
          moduleDescription: mod?.description ?? '',
          theme,
          brief,
          priorOutputs,
          provider,
          userApiKey: provider === 'gemini' ? effectiveKey : customKey.trim(),
        },
      });


      if (fnErr) throw new Error(fnErr.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.result) throw new Error('Réponse vide de l\'IA.');

      setResults((prev) => ({ ...prev, [step.moduleId]: data.result as string }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setLoadingId(null);
    }
  };

  const validate = (id: string) => setDone((prev) => new Set(prev).add(id));

  const startEdit = (id: string) => { setEditingId(id); setDraft(results[id] ?? ''); };
  const cancelEdit = () => { setEditingId(null); setDraft(''); };
  const saveEdit = (id: string) => {
    setResults((prev) => ({ ...prev, [id]: draft }));
    setEditingId(null);
    setDraft('');
  };

  const reset = () => {
    setDone(new Set());
    setResults({});
    setError(null);
  };

  return (
    <section id="parcours" className="mb-12 scroll-mt-20">
      <div className="rounded-3xl border-2 bg-white overflow-hidden shadow-[0_10px_44px_-18px_rgba(232,149,30,0.45)]"
        style={{ borderColor: AMBER }}>
        {/* En-tête + progression */}
        <div className="relative p-6 sm:p-8" style={{ background: `linear-gradient(135deg, ${AMBER_SOFT}, #ffffff 70%)` }}>
          <span className="pointer-events-none absolute inset-x-10 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)` }} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 rounded-full border px-3.5 py-1"
                style={{ borderColor: `${AMBER}66`, background: '#fff' }}>
                <Wand2 className="h-4 w-4" style={{ color: AMBER }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: AMBER_DEEP }}>
                  Auto-pilote IA · 30 étapes
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
                De l'idée au livre publié — c'est l'IA qui travaille
              </h2>
              <p className="mt-2 max-w-2xl text-sm" style={{ color: '#6f5e47' }}>
                À chaque étape, l'IA fait le travail à ta place. Tu lis le résultat, tu valides,
                et elle enchaîne sur l'étape suivante en gardant tout le contexte. Ta progression
                est sauvegardée automatiquement.
              </p>
            </div>
            <button onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors hover:bg-[#FFF3DF]"
              style={{ borderColor: `${AMBER}55`, color: AMBER_DEEP }}>
              <RotateCcw className="h-3.5 w-3.5" /> Recommencer
            </button>
          </div>

          {/* Brief du livre */}
          <div className="mt-5 rounded-2xl border p-4 sm:p-5" style={{ borderColor: '#eadfc9', background: '#fffdf8' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: AMBER_DEEP }}>
              Ton projet de livre
            </p>
            <p className="text-xs mb-4" style={{ color: '#6f5e47' }}>
              Renseigne ce que tu sais déjà. Laisse vide ce que tu veux que l'IA propose à ta place
              (elle peut inventer le titre, le sous-titre et même choisir la niche).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Titre du livre</label>
                <input value={brief.title} onChange={(e) => setBriefField('title', e.target.value)} maxLength={150}
                  placeholder="Ex : Reprendre le contrôle de ton temps"
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Sous-titre</label>
                <input value={brief.subtitle} onChange={(e) => setBriefField('subtitle', e.target.value)} maxLength={200}
                  placeholder="Ex : La méthode en 7 étapes pour entrepreneurs débordés"
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Nom de l'auteur</label>
                <input value={brief.author} onChange={(e) => setBriefField('author', e.target.value)} maxLength={120}
                  placeholder="Ex : Georges Boubet"
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Nombre de chapitres visés</label>
                <input value={brief.chapterCount} onChange={(e) => setBriefField('chapterCount', e.target.value)} maxLength={10}
                  placeholder="Ex : 12"
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Catégorie / genre</label>
              <select value={brief.category} onChange={(e) => setBriefField('category', e.target.value)}
                className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none appearance-none"
                style={{ borderColor: '#eadfc9', color: INK, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a18a6c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                <option value="">-- Laisser l'IA choisir --</option>
                <option value="Fiction">Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller / Policier">Thriller / Policier</option>
                <option value="Science-Fiction">Science-Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Développement personnel">Développement personnel</option>
                <option value="Business & Entreprise">Business & Entreprise</option>
                <option value="Santé, Forme et Diététique">Santé, Forme et Diététique</option>
                <option value="Famille et bien-être">Famille et bien-être</option>
                <option value="Cuisine et Vins">Cuisine et Vins</option>
                <option value="Histoire">Histoire</option>
                <option value="Biographies et Mémoires">Biographies et Mémoires</option>
                <option value="Religion et Spiritualité">Religion et Spiritualité</option>
                <option value="Art, Musique et Photographie">Art, Musique et Photographie</option>
                <option value="Science et Nature">Science et Nature</option>
                <option value="Voyage">Voyage</option>
                <option value="Humour">Humour</option>
                <option value="Éducation et Enseignement">Éducation et Enseignement</option>
                <option value="Informatique et Internet">Informatique et Internet</option>
                <option value="Sports et Loisirs">Sports et Loisirs</option>
                <option value="Jeunesse">Jeunesse</option>
                <option value="Érotisme">Érotisme</option>
              </select>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>
                Thème / angle de départ (facultatif) — laisse vide pour que l'IA choisisse la niche
              </label>
              <input value={theme} onChange={(e) => setTheme(e.target.value)} maxLength={300}
                placeholder="Ex : développement personnel pour entrepreneurs débordés…"
                className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: '#eadfc9', color: INK }} />
            </div>
          </div>

          {/* Fournisseur IA + clé personnelle */}
          <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: '#eadfc9', background: '#fffdf8' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: AMBER_DEEP }}>
              Moteur IA & ta clé
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Fournisseur</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value as 'gemini' | 'openai')}
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none appearance-none"
                  style={{ borderColor: '#eadfc9', color: INK, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a18a6c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                  <option value="gemini">Google Gemini (ta clé)</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>
                  {provider === 'gemini'
                    ? 'Clé Gemini (laisse vide pour utiliser celle des réglages)'
                    : 'Clé OpenAI (facultative)'}
                </label>
                <input value={customKey} onChange={(e) => setCustomKey(e.target.value)} type="password"
                  placeholder={provider === 'gemini' ? 'AIza…' : 'sk-…'}
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
            </div>
          </div>

          {/* Sauvegarde cloud */}
          <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: '#eadfc9', background: '#fffdf8' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: AMBER_DEEP }}>
              Mes projets (sauvegarde dans le compte)
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Nom du projet</label>
                <input value={projectName} onChange={(e) => setProjectName(e.target.value)} maxLength={120}
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: '#eadfc9', color: INK }} />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold mb-1.5" style={{ color: INK }}>Rouvrir un projet</label>
                <select value={projectId ?? ''} onChange={(e) => loadFromCloud(e.target.value)}
                  className="w-full rounded-xl bg-white border px-4 py-2.5 text-sm focus:outline-none appearance-none"
                  style={{ borderColor: '#eadfc9', color: INK, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a18a6c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                  <option value="">-- Sélectionner --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={saveToCloud} disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}>
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {projectId ? 'Enregistrer' : 'Créer & sauver'}
              </button>
              <button onClick={newProject}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-bold border transition-colors hover:bg-[#FFF3DF]"
                style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}>
                Nouveau
              </button>
            </div>
            {cloudMsg && <p className="mt-2 text-[12px] font-semibold" style={{ color: AMBER_DEEP }}>{cloudMsg}</p>}
          </div>




          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: INK }}>{completed} / {TOTAL} étapes validées</span>
              <span className="text-sm font-black" style={{ color: completed === TOTAL ? GREEN : AMBER_DEEP }}>{pct}%</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: '#f0e7d4' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: completed === TOTAL ? `linear-gradient(90deg, ${GREEN}, #2fc488)` : `linear-gradient(90deg, ${AMBER}, #FFB44D)` }} />
            </div>
            {completed === TOTAL && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}>
                <Trophy className="h-4 w-4" /> Bravo, l'IA a mené ton livre de l'idée jusqu'au lancement !
              </p>
            )}
          </div>
        </div>

        {/* Phases */}
        <div className="divide-y divide-[#f0e7d4]">
          {PHASES.map((phase) => {
            const isOpen = openPhase === phase.key;
            const phaseSteps = FLAT.filter((s) => s.phaseKey === phase.key);
            const phaseDone = phaseSteps.filter((s) => done.has(s.moduleId)).length;
            const phaseComplete = phaseDone === phaseSteps.length;
            return (
              <div key={phase.key}>
                <button onClick={() => setOpenPhase(isOpen ? null : phase.key)}
                  className="w-full flex items-center gap-3 px-5 sm:px-7 py-4 text-left transition-colors hover:bg-[#FCF8F0]"
                  aria-expanded={isOpen}>
                  <span className="grid h-9 w-9 place-items-center rounded-xl text-lg shrink-0 border"
                    style={{ borderColor: phaseComplete ? GREEN : '#eadfc9', background: phaseComplete ? `${GREEN}14` : '#FCF8F0' }}>
                    {phaseComplete ? <Check className="h-4 w-4" style={{ color: GREEN }} /> : phase.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>{phase.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#a18a6c' }}>{phaseDone} / {phaseSteps.length} étapes</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: AMBER_DEEP }} />
                </button>

                {isOpen && (
                  <div className="pb-3">
                    {phaseSteps.map((step) => {
                      const n = step.globalIndex + 1;
                      const mod = getModuleById(step.moduleId);
                      const ready = isModuleClickable(step.moduleId);
                      const isDone = done.has(step.moduleId);
                      const isActive = step.globalIndex === activeIndex;
                      const isLocked = step.globalIndex > activeIndex;
                      const isLoading = loadingId === step.moduleId;
                      const result = results[step.moduleId];

                      return (
                        <div key={step.moduleId} ref={isActive ? activeRef : undefined}
                          className="px-5 sm:px-7 py-3"
                          style={isActive ? { background: '#FFFDF8' } : undefined}>
                          <div className="flex items-start gap-3">
                            {/* Pastille numéro / état */}
                            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black border-2"
                              style={{
                                borderColor: isDone ? GREEN : isActive ? AMBER : '#e3d6bd',
                                background: isDone ? GREEN : isActive ? AMBER_SOFT : '#fff',
                                color: isDone ? '#fff' : isActive ? AMBER_DEEP : '#bcaa8c',
                              }}>
                              {isDone ? <Check className="h-3.5 w-3.5" /> : isLocked ? <Lock className="h-3 w-3" /> : n}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold leading-tight ${isDone ? 'opacity-70' : ''}`} style={{ color: INK }}>
                                {step.label ?? mod?.title ?? step.moduleId}
                              </div>
                              <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#8a7860' }}>{step.hint}</p>

                              {/* Actions de l'étape active */}
                              {(isActive || (isDone && result)) && editingId !== step.moduleId && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  {!isDone && (
                                    <button onClick={() => generate(step)} disabled={isLoading}
                                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                                      style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}>
                                      {isLoading
                                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> L'IA travaille…</>
                                        : <><Sparkles className="h-3.5 w-3.5" /> {result ? 'Régénérer' : 'Générer avec l\'IA'}</>}
                                    </button>
                                  )}
                                  {result && (
                                    <button onClick={() => startEdit(step.moduleId)}
                                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold border transition-colors hover:bg-[#FFF3DF]"
                                      style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}>
                                      <Pencil className="h-3.5 w-3.5" /> Modifier le brouillon
                                    </button>
                                  )}
                                  {result && !isDone && (
                                    <button onClick={() => validate(step.moduleId)}
                                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold border transition-colors hover:bg-[#eafaf2]"
                                      style={{ borderColor: `${GREEN}66`, color: GREEN }}>
                                      <Check className="h-3.5 w-3.5" /> Valider & étape suivante
                                    </button>
                                  )}
                                  {ready && mod && (
                                    <button onClick={() => onOpenModule(mod)}
                                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-colors hover:bg-[#FFF3DF]"
                                      style={{ borderColor: '#eadfc9', color: AMBER_DEEP }}>
                                      Affiner dans l'outil <ArrowRight className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Erreur */}
                              {isActive && error && (
                                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-lg px-2.5 py-1.5"
                                  style={{ background: '#fdecec', color: '#c0392b' }}>
                                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                                </div>
                              )}

                              {/* Mode brouillon : édition du texte */}
                              {editingId === step.moduleId && (
                                <div className="mt-3">
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: AMBER_DEEP }}>
                                    <Pencil className="h-3.5 w-3.5" /> Mode brouillon
                                  </div>
                                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={14}
                                    className="w-full rounded-xl border p-4 text-[13px] leading-relaxed font-mono focus:outline-none"
                                    style={{ borderColor: '#eadfc9', background: '#fffdf8', color: INK }} />
                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <button onClick={() => saveEdit(step.moduleId)}
                                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
                                      style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}>
                                      <Save className="h-3.5 w-3.5" /> Enregistrer le brouillon
                                    </button>
                                    <button onClick={cancelEdit}
                                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold border transition-colors hover:bg-[#FFF3DF]"
                                      style={{ borderColor: '#eadfc9', color: '#8a7860' }}>
                                      <X className="h-3.5 w-3.5" /> Annuler
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Résultat IA */}
                              {result && (isActive || isDone) && editingId !== step.moduleId && (
                                <div className="mt-3 rounded-xl border p-4 text-[13px] leading-relaxed v3-md"
                                  style={{ borderColor: '#eadfc9', background: '#FCFAF4', color: INK }}>
                                  <ReactMarkdown>{result}</ReactMarkdown>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Styles markdown locaux */}
      <style>{`
        .v3-md h1,.v3-md h2,.v3-md h3{font-family:${SERIF};color:${INK};font-weight:700;margin:0.6em 0 0.3em;line-height:1.25}
        .v3-md h1{font-size:1.15rem}.v3-md h2{font-size:1.05rem}.v3-md h3{font-size:0.98rem}
        .v3-md p{margin:0.4em 0}
        .v3-md ul,.v3-md ol{margin:0.4em 0;padding-left:1.2em}
        .v3-md li{margin:0.15em 0}
        .v3-md strong{color:${AMBER_DEEP}}
        .v3-md table{width:100%;border-collapse:collapse;margin:0.5em 0;font-size:0.85em}
        .v3-md th,.v3-md td{border:1px solid #eadfc9;padding:4px 8px;text-align:left}
        .v3-md th{background:${AMBER_SOFT}}
        .v3-md code{background:#f0e7d4;border-radius:4px;padding:1px 4px;font-size:0.85em}
        .v3-md a{color:${AMBER_DEEP};text-decoration:underline}
      `}</style>
    </section>
  );
};

export default V3Workflow30;
