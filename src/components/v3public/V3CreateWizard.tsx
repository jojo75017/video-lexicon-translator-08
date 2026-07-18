import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ImageIcon, Loader2, Plus, RefreshCw, Rocket, Save, Sparkles, Trash2, UserRound, Wand2, FileDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import EbookCompleteWorkflow from '@/components/ebook/EbookCompleteWorkflow';
import V3ExportPanel from '@/components/admin/V3ExportPanel';
import { invokeImageFunction } from '@/lib/aiImageInvoke';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';


type WizardCharacter = {
  id: string;
  name: string;
  role: string;
  traits: string;
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

export default function V3CreateWizard() {
  const hub = useMemo(readHubConfig, []);
  const [step, setStep] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [completedBook, setCompletedBook] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const coverTriggeredRef = useRef(false);

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

  const [title, setTitle] = useState(hub.title || '');
  const [description, setDescription] = useState(hub.description || '');
  const [category, setCategory] = useState(hub.genre || 'Roman');
  const [customCategory, setCustomCategory] = useState('');
  const [tone, setTone] = useState('Inspirant');
  const [chapters, setChapters] = useState(clampNumber(Number(hub.numberOfChapters), 3, 60, 12));
  const [wordsPerChapter, setWordsPerChapter] = useState(2500);
  const [characters, setCharacters] = useState<WizardCharacter[]>([makeCharacter()]);
  const [finalTitle, setFinalTitle] = useState(hub.title || '');
  const [subtitle, setSubtitle] = useState(hub.subtitle || '');
  const [authorName, setAuthorName] = useState(hub.author || 'Auteur Ebookstudio');

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

  const saveDraft = () => {
    try {
      const draft = {
        savedAt: new Date().toISOString(),
        title, description, category, customCategory, tone, chapters, wordsPerChapter,
        characters, finalTitle, subtitle, authorName,
      };
      const raw = localStorage.getItem('v3_wizard_drafts_v1');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ id: crypto.randomUUID?.() || String(Date.now()), ...draft });
      localStorage.setItem('v3_wizard_drafts_v1', JSON.stringify(list.slice(0, 20)));
      localStorage.setItem(WIZARD_KEY, JSON.stringify(draft));
      toast.success('Brouillon sauvegardé — retrouve-le dans « Ma bibliothèque ».');
    } catch {
      toast.error('Sauvegarde impossible.');
    }
  };

  const resetWizard = () => {
    if (!confirm('Recommencer un nouveau livre ? Le brouillon en cours sera effacé.')) return;
    setTitle(''); setDescription(''); setCategory('Roman'); setCustomCategory('');
    setTone('Inspirant'); setChapters(12); setWordsPerChapter(2500);
    setCharacters([makeCharacter()]); setFinalTitle(''); setSubtitle('');
    setAiTopic(''); setAiResult(null); setStep(0); setLaunched(false); setCompletedBook(null); setCoverUrl(null);
    coverTriggeredRef.current = false;
    ['ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data'].forEach((k) => localStorage.removeItem(k));
    toast.success('Nouveau livre — formulaire réinitialisé.');
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

  const canStepOne = title.trim().length >= 3 && description.trim().length >= 30;
  const canStepTwo = Boolean(effectiveCategory.trim()) && chapters >= 3 && chapters <= 60 && wordsPerChapter >= 500;
  const canStepFour = finalTitle.trim().length >= 3 && authorName.trim().length >= 2;

  const goNext = () => {
    if (step === 0 && !canStepOne) {
      toast.error('Ajoute un titre et une description claire avant de continuer.');
      return;
    }
    if (step === 1 && !canStepTwo) {
      toast.error('Vérifie la catégorie, le nombre de chapitres et les mots par chapitre.');
      return;
    }
    if (step === 2 && !finalTitle.trim()) setFinalTitle(title);
    setStep((value) => Math.min(3, value + 1));
  };

  const updateCharacter = (id: string, field: keyof WizardCharacter, value: string) => {
    setCharacters((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeCharacter = (id: string) => {
    setCharacters((items) => items.length <= 1 ? items : items.filter((item) => item.id !== id));
  };

  const launchWorkflow = () => {
    if (!canStepFour) {
      toast.error('Valide le titre final et le nom d’auteur avant de générer.');
      return;
    }

    const workflowDescription = [
      description.trim(),
      `Style demandé : ${tone}.`,
      `Format prévu : ${chapters} chapitres d'environ ${wordsPerChapter} mots chacun.`,
      workflowCharacters.length
        ? `Personnages fournis : ${workflowCharacters.map((character) => `${character.name} (${character.role}) — ${character.description}`).join(' | ')}`
        : '',
    ].filter(Boolean).join('\n\n');

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
    };

    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      localStorage.setItem(TARGET_WORDS_KEY, String(wordsPerChapter));
      localStorage.setItem(WIZARD_KEY, JSON.stringify(config));
      ['ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data'].forEach((key) => localStorage.removeItem(key));
    } catch {
      // The mounted workflow still receives props if localStorage is unavailable.
    }

    toast.success('Le workflow complet démarre maintenant.');
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
            {completedBook && (
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: 'var(--v3-paper)', color: 'var(--v3-orange-600)' }}>
                <Check className="h-4 w-4" /> Livre terminé
              </span>
            )}
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
          initialBookIntroduction={description.trim()}
          initialNumberOfChapters={chapters}
          initialWordsPerChapter={wordsPerChapter}
          initialTone={tone}
          characters={workflowCharacters}
          onComplete={setCompletedBook}
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


  const steps = ['Idée', 'Style', 'Personnages', 'Titre'];

  return (
    <div className="space-y-8">
      {/* Barre d'actions rapides */}
      <div className="flex flex-wrap gap-2 justify-end">
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

      <div className="grid gap-2 sm:grid-cols-4">

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

      {step === 3 && (
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
          <button type="button" onClick={launchWorkflow} className="v3-btn v3-btn-primary w-full justify-center py-5 text-base">
            <Rocket className="h-5 w-5" /> Générer mon livre avec le workflow complet
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--v3-border)' }}>
        <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="v3-btn v3-btn-ghost disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>
        {step < 3 ? (
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