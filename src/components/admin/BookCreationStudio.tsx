import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Download, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat, PROVIDER_LABELS } from '@/services/aiWritingService';
import { supabase } from '@/integrations/supabase/client';

/** Lit la fiche livre du Parcours pour préremplir titre/sous-titre/auteur. */
function readHubBookConfig(): { title: string; subtitle: string; author: string; genre?: string; description?: string } {
  try {
    const raw = localStorage.getItem('edition_book_config_v1');
    if (!raw) return { title: '', subtitle: '', author: '' };
    const c = JSON.parse(raw);
    return {
      title: c?.title || '',
      subtitle: c?.subtitle || '',
      author: c?.author || '',
      genre: c?.genre || '',
      description: c?.description || '',
    };
  } catch {
    return { title: '', subtitle: '', author: '' };
  }
}

/** Devine le type de livre à partir du genre libre saisi dans la fiche. */
function guessBookType(genre?: string): string {
  const g = (genre || '').toLowerCase();
  if (/(roman|fiction|nouvelle|thriller|polar|fantasy|sf)/.test(g)) return 'fiction';
  if (/(enfant|jeunesse|album)/.test(g)) return 'enfants';
  if (/(journal|planificateur|carnet)/.test(g)) return 'journal';
  if (/(activit|coloriage|puzzle)/.test(g)) return 'activites';
  if (/(exercice|workbook)/.test(g)) return 'exercices';
  if (/(po[ée]sie)/.test(g)) return 'poesie';
  if (/(bd|comic|manga)/.test(g)) return 'comique';
  if (/(cuisine|recette)/.test(g)) return 'cuisine';
  return 'non-fiction';
}


const TEAL = '#008296';
const INK = '#232F3E';

const STEPS = ['Type', 'Détails', 'Générer', 'Exporter'];

type BookType = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
};

const BOOK_TYPES: BookType[] = [
  { id: 'non-fiction', emoji: '📚', title: 'Non-fiction', subtitle: 'Guides, tutoriels, auto-assistance' },
  { id: 'fiction', emoji: '🌙', title: 'Fiction', subtitle: 'Romans, nouvelles' },
  { id: 'enfants', emoji: '🧸', title: 'Enfants', subtitle: 'Albums illustrés, livres pour jeunes lecteurs' },
  { id: 'journal', emoji: '📔', title: 'Journal', subtitle: 'Planificateurs, outils de suivi, journaux de bord' },
  { id: 'activites', emoji: '✏️', title: "Cahier d'activités", subtitle: 'Puzzles, coloriages, labyrinthes' },
  { id: 'exercices', emoji: '📝', title: "Cahier d'exercices", subtitle: 'Exercices, feuilles de travail' },
  { id: 'poesie', emoji: '🌸', title: 'Poésie', subtitle: 'Recueils, anthologies' },
  { id: 'comique', emoji: '💥', title: 'Comique', subtitle: 'Bandes dessinées, mangas' },
  { id: 'cuisine', emoji: '🔍', title: 'Livre de cuisine', subtitle: 'Recettes, menus' },
];

type SourceMeta = {
  emoji: string;
  label: string;
  hint: string;
  needsImport: boolean;
  importLabel?: string;
  importPlaceholder?: string;
  multiline?: boolean;
};

const SOURCE_META: Record<string, SourceMeta> = {
  scratch: { emoji: '✏️', label: 'Partir de zéro', hint: 'Page blanche guidée par l’IA — choisissez le type puis renseignez les détails.', needsImport: false },
  template: { emoji: '📚', label: 'À partir d’un modèle', hint: 'Sélectionnez un type ci-dessous : il servira de modèle de structure.', needsImport: false },
  url: { emoji: '🔗', label: 'Importer depuis une URL', hint: 'Collez l’URL d’un article ou d’une page web à transformer en livre.', needsImport: true, importLabel: 'URL de l’article', importPlaceholder: 'https://…' },
  docx: { emoji: '📄', label: 'Importer depuis un DOCX', hint: 'Collez le contenu de votre document Word.', needsImport: true, importLabel: 'Contenu du document', importPlaceholder: 'Collez ici le texte du fichier DOCX…', multiline: true },
  pdf: { emoji: '📕', label: 'Importer depuis un PDF', hint: 'Collez le texte extrait de votre PDF.', needsImport: true, importLabel: 'Contenu du PDF', importPlaceholder: 'Collez ici le texte du PDF…', multiline: true },
  gdocs: { emoji: '📝', label: 'Importer depuis Google Docs', hint: 'Collez le lien partagé ou le contenu du Google Docs.', needsImport: true, importLabel: 'Lien ou contenu Google Docs', importPlaceholder: 'https://docs.google.com/… ou collez le texte', multiline: true },
  video: { emoji: '🎬', label: 'Importer depuis une vidéo', hint: 'Collez la transcription de votre vidéo.', needsImport: true, importLabel: 'Transcription / lien vidéo', importPlaceholder: 'Collez la transcription ou le lien…', multiline: true },
  youtube: { emoji: '▶️', label: 'Importer depuis YouTube', hint: 'Collez le lien YouTube ou la transcription.', needsImport: true, importLabel: 'Lien YouTube / transcription', importPlaceholder: 'https://youtube.com/watch?v=…', multiline: true },
};

const slugify = (s: string) =>
  (s || 'mon-livre')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'mon-livre';

export default function BookCreationStudio(
  { initialSource, autoRun }: { initialSource?: string | null; autoRun?: boolean } = {},
) {
  const source = (initialSource && SOURCE_META[initialSource]) ? initialSource : 'scratch';
  const meta = SOURCE_META[source];
  const hub = readHubBookConfig();
  const seededType = guessBookType(hub.genre);
  const [step, setStep] = useState<number>(autoRun ? 2 : 0);
  const [importValue, setImportValue] = useState('');
  const [bookType, setBookType] = useState<string | null>(autoRun ? seededType : null);
  const [title, setTitle] = useState(autoRun ? (hub.title || 'Mon livre') : '');
  const [subtitle, setSubtitle] = useState(autoRun ? hub.subtitle : '');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [idea, setIdea] = useState(autoRun ? (hub.description || '') : '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [output, setOutput] = useState('');

  const selectType = (id: string) => {
    setBookType(id);
    setStep(1);
  };

  const loadingTimerRef = useRef<number | null>(null);

  const generate = async () => {
    // Garde-fou 1 : titre requis, sinon on montre l'étape Détails au lieu de bloquer.
    if (!title.trim()) {
      toast.error('Renseignez au moins un titre pour lancer la génération.');
      setStep(1);
      return;
    }
    // Garde-fou 2 : clé BYOK indispensable, sinon on ouvre le panneau clés.
    const provider = getProvider();
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) {
      toast.error(`Configurez d'abord votre clé ${PROVIDER_LABELS[provider]} pour lancer la génération.`);
      window.dispatchEvent(new CustomEvent('open-api-keys'));
      setStep(1);
      return;
    }
    setLoading(true);
    setOutput('');
    // Filet de sécurité : si l'IA ne répond pas au bout de 90 s, on débloque l'UI.
    if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = window.setTimeout(() => {
      setLoading(false);
      toast.error('L\'IA ne répond pas. Vérifiez votre clé et réessayez.');
      setStep(1);
    }, 90_000);
    try {
      const typeLabel = BOOK_TYPES.find((t) => t.id === bookType)?.title ?? 'Livre';
      const prompt = `Tu es un auteur professionnel KDP. Génère le PLAN STRUCTURÉ d'un livre de type "${typeLabel}" prêt à être développé via le pipeline éditorial.

Titre : "${title}"
${subtitle ? `Sous-titre : "${subtitle}"` : ''}
${audience ? `Public cible : ${audience}` : ''}
${keywords ? `Mots-clés : ${keywords}` : ''}
${idea ? `Idée / description : ${idea}` : ''}
${meta.needsImport && importValue.trim() ? `Source à transformer (${meta.label}) :\n${importValue.trim()}` : ''}

Produis en français, en texte brut (titres avec #, sans HTML) :
1. Une introduction rédigée (200-300 mots).
2. Un sommaire détaillé de 8 à 12 chapitres, chacun avec un titre clair (format "# Chapitre N : …") et 3-4 puces décrivant le contenu du chapitre.
3. Une conclusion suggérée (3-4 lignes).

Sois concret, orienté valeur lecteur et cohérent avec la niche.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
      setStep(3);
      toast.success('Plan généré ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
      setStep(1);
    } finally {
      setLoading(false);
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }
  };

  const cancelGeneration = () => {
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setLoading(false);
    setStep(1);
    toast('Génération annulée.');
  };

  // Auto-lancement : quand l'utilisateur clique « Lancer » sur un agent du
  // Parcours, on démarre directement la génération avec la fiche livre du Hub
  // (ou des valeurs par défaut) sans afficher les étapes Type/Détails.
  const autoRunTriggered = useRef(false);
  useEffect(() => {
    if (autoRun && !autoRunTriggered.current) {
      autoRunTriggered.current = true;
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);




  const downloadTxt = () => {
    if (!output.trim()) return;
    const header = `Titre : ${title}\n${subtitle ? `Sous-titre : ${subtitle}\n` : ''}${audience ? `Public : ${audience}\n` : ''}\n`;
    const blob = new Blob([header + output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(title)}-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Plan téléchargé ✓');
  };

  const saveV3Project = async () => {
    if (!title.trim()) return toast.error('Indique le titre avant de sauvegarder.');
    if (!output.trim()) return toast.error('Génère le plan avant de sauvegarder.');
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error('Connecte-toi pour sauvegarder dans ton compte.');
      const typeLabel = BOOK_TYPES.find((t) => t.id === bookType)?.title ?? 'Livre';
      const { data, error } = await supabase
        .from('v3_workflow_projects')
        .insert({
          user_id: auth.user.id,
          name: title.trim().slice(0, 120),
          theme: idea.trim(),
          brief: {
            title: title.trim(),
            subtitle: subtitle.trim(),
            author: '',
            category: typeLabel,
            chapterCount: '',
            wordsPerChapter: '',
            audience: audience.trim(),
            keywords: keywords.trim(),
            source: meta.label,
          },
          done: ['book-creation-studio'],
          results: { 'book-creation-studio': output.trim() },
        } as never)
        .select('id')
        .single();
      if (error) throw error;
      const savedId = (data as { id?: string } | null)?.id;
      if (savedId) localStorage.setItem('v3_workflow_open_project_id', savedId);
      toast.success('Projet sauvegardé dans Mes sauvegardes ✓');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sauvegarde impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 mb-1 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${TEAL}14`, color: TEAL }}>
          <span>{meta.emoji}</span> {meta.label}
        </div>
        <h2 className="text-2xl font-bold" style={{ color: TEAL }}>
          Studio de création de livres
        </h2>
        <p className="text-sm" style={{ color: `${INK}99` }}>{meta.hint}</p>
      </div>

      {/* Panneau d'import contextuel selon la source */}
      {step === 0 && meta.needsImport && (
        <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: `${TEAL}40`, background: `${TEAL}08` }}>
          <label className="text-xs font-semibold" style={{ color: INK }}>{meta.importLabel}</label>
          {meta.multiline ? (
            <Textarea value={importValue} onChange={(e) => setImportValue(e.target.value)} rows={5} placeholder={meta.importPlaceholder} />
          ) : (
            <Input value={importValue} onChange={(e) => setImportValue(e.target.value)} placeholder={meta.importPlaceholder} />
          )}
          <p className="text-[11px]" style={{ color: `${INK}80` }}>
            Ce contenu sera transformé par l'IA. Choisissez ensuite le type de livre ci-dessous.
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => i <= step && setStep(i)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              style={
                i === step
                  ? { background: TEAL, color: '#fff' }
                  : i < step
                  ? { background: `${TEAL}1a`, color: TEAL }
                  : { background: '#F0F0F0', color: `${INK}80` }
              }
            >
              {i + 1} {label}
            </button>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Type */}
      {step === 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold" style={{ color: INK }}>
            Que créez-vous ?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOK_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => selectType(t.id)}
                className="text-center rounded-xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  borderColor: bookType === t.id ? TEAL : '#E3E6E6',
                  background: bookType === t.id ? `${TEAL}0d` : '#fff',
                }}
              >
                <div className="text-3xl mb-3">{t.emoji}</div>
                <div className="font-bold text-sm mb-1" style={{ color: INK }}>
                  {t.title}
                </div>
                <div className="text-xs" style={{ color: `${INK}80` }}>
                  {t.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Détails */}
      {step === 1 && (
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-base font-bold" style={{ color: INK }}>
            Détails du livre
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK }}>Titre du livre</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Le guide complet de…" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK }}>Sous-titre</label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Ex : Méthode pas à pas pour…" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK }}>Public cible</label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex : Débutants en…" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK }}>Mots-clés (séparés par des virgules)</label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="mot-clé 1, mot-clé 2, mot-clé 3" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK }}>Idée / description</label>
            <Textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={4} placeholder="Décrivez votre livre en quelques phrases…" />
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(0)}>Retour</Button>
            <Button style={{ background: TEAL, color: '#fff' }} onClick={() => setStep(2)}>Continuer</Button>
          </div>
        </div>
      )}

      {/* Step 3 — Générer (IA réelle) */}
      {step === 2 && (
        <div className="space-y-4 max-w-2xl">
          <div className="rounded-xl border p-6" style={{ borderColor: '#E3E6E6', background: '#fff' }}>
            <h3 className="text-base font-bold mb-2" style={{ color: INK }}>Génération du plan</h3>
            <p className="text-sm mb-4" style={{ color: `${INK}99` }}>
              L'IA (votre clé BYOK) génère une introduction + un sommaire détaillé de chapitres, prêts à développer dans le pipeline éditorial P1–P15.
            </p>
            <div className="text-xs rounded-lg p-3 mb-4" style={{ background: `${TEAL}0d`, color: INK }}>
              <div><strong>Type :</strong> {BOOK_TYPES.find((t) => t.id === bookType)?.title ?? '—'}</div>
              <div><strong>Titre :</strong> {title || '—'}</div>
              <div><strong>Sous-titre :</strong> {subtitle || '—'}</div>
              <div><strong>Public :</strong> {audience || '—'}</div>
              <div><strong>Mots-clés :</strong> {keywords || '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => generate()} disabled={loading} style={{ background: TEAL, color: '#fff' }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="ml-1.5">{loading ? 'Génération en cours…' : 'Générer le plan du livre'}</span>
              </Button>
              {loading && (
                <Button variant="outline" onClick={cancelGeneration}>Annuler</Button>
              )}
            </div>
          </div>
          <div className="flex justify-start">
            <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
          </div>
        </div>
      )}

      {/* Step 4 — Exporter */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border p-6" style={{ borderColor: '#E3E6E6', background: '#fff' }}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-bold" style={{ color: INK }}>Plan généré</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }} disabled={!output.trim()}>
                  <Copy className="h-3.5 w-3.5" /> Copier
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={saveV3Project} disabled={!output.trim() || saving}>
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Sauvegarder
                </Button>
                <Button size="sm" className="gap-1.5" style={{ background: TEAL, color: '#fff' }} onClick={downloadTxt} disabled={!output.trim()}>
                  <Download className="h-3.5 w-3.5" /> Télécharger (.txt)
                </Button>
              </div>
            </div>
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={18} className="text-xs" />
            <p className="text-xs mt-3" style={{ color: `${INK}80` }}>
              Astuce : collez ce plan dans le module « Multi-format Express » pour générer le PDF KDP, ou dans le pipeline éditorial pour rédiger chaque chapitre.
            </p>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Régénérer</Button>
          </div>
        </div>
      )}
    </div>
  );
}
