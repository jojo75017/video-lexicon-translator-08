import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen, Lock, Loader2, Sparkles, Download, FileText, FileDown,
  Plus, Trash2, ChevronDown, ChevronUp, ListTree, Copy, Check, Image as ImageIcon,
  RefreshCw, Wand2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useShortStoriesAccess from '@/hooks/useShortStoriesAccess';
import V3ShortStoriesUpsell from '@/components/v3/V3ShortStoriesUpsell';
import {
  exportShortStoriesDocx,
  exportShortStoriesPdf,
  exportShortStoriesTxt,
  type ShortStory,
} from '@/lib/shortStoriesExport';

const EMERALD = 'var(--v3-emerald, #064e3b)';
const GOLD = 'var(--v3-gold, #c9a84c)';
const MUTED = 'var(--v3-muted, #6b7280)';
const LINE = 'var(--v3-line, #e5e7eb)';

const AGE_GROUPS = [
  { id: '3-6', label: 'Maternelle 3-6 ans' },
  { id: '7-12', label: 'Jeunesse 7-12 ans' },
  { id: 'adultes', label: 'Adultes / littérature courte' },
];

const TONES = [
  { id: 'rassurante', label: 'Rassurante & douce' },
  { id: 'aventure', label: 'Aventureuse' },
  { id: 'drole', label: 'Drôle & légère' },
  { id: 'philosophique', label: 'Philosophique / feel-good' },
  { id: 'mysterieuse', label: 'Mystérieuse' },
];

const BATCH_SIZE = 5;
const MAX_STORIES = 30;

export default function V3ShortStoriesPage() {
  const { loading: accessLoading, hasAccess, userEmail, refresh } = useShortStoriesAccess();
  const [searchParams, setSearchParams] = useSearchParams();
  const [upsellOpen, setUpsellOpen] = useState(false);

  // — Formulaire —
  const [targetAge, setTargetAge] = useState('3-6');
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('rassurante');
  const [count, setCount] = useState(10);
  const [wordsPerStory, setWordsPerStory] = useState(250);
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [characterBible, setCharacterBible] = useState('');
  const [generateImages, setGenerateImages] = useState(false);

  // — Contenu —
  const [stories, setStories] = useState<ShortStory[]>([]);
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | 'all' | null>(null);
  const cancelRef = useRef(false);

  // Retour de paiement : on attend que le webhook enregistre le droit.
  useEffect(() => {
    if (searchParams.get('paiement') !== 'ok') return;
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      await refresh();
      if (attempts >= 8) clearInterval(timer);
    }, 2500);
    toast.success('Paiement reçu ! Activation de votre accès…');
    setSearchParams({}, { replace: true });
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveTitle = useMemo(() => {
    if (bookTitle.trim()) return bookTitle.trim();
    const ageLabel = AGE_GROUPS.find((a) => a.id === targetAge)?.label ?? 'Histoires';
    return theme.trim() ? `Histoires courtes — ${theme.trim()}` : `Mon livre d'${ageLabel.toLowerCase()}`;
  }, [bookTitle, targetAge, theme]);

  const generate = useCallback(async () => {
    if (!theme.trim()) {
      toast.error('Indiquez un thème pour votre livre d\'histoires.');
      return;
    }
    const total = Math.min(Math.max(count || 10, 1), MAX_STORIES);
    cancelRef.current = false;
    setGenerating(true);
    setProgress(0);
    setStories([]);

    try {
      let generated = 0;
      while (generated < total) {
        if (cancelRef.current) break;
        const batchCount = Math.min(BATCH_SIZE, total - generated);
        const { data, error } = await supabase.functions.invoke('short-stories-generate', {
          body: {
            bookTitle: effectiveTitle,
            targetAge,
            theme: theme.trim(),
            tone: TONES.find((t) => t.id === tone)?.label ?? tone,
            count: batchCount,
            wordsPerStory,
            characterBible: characterBible.trim() || undefined,
            generateImages,
            startIndex: generated,
          },
        });
        if (error) throw new Error(error.message);
        const batch = (data as { stories?: ShortStory[] })?.stories ?? [];
        if (batch.length === 0) throw new Error('Réponse IA vide — réessayez.');
        setStories((prev) => [...prev, ...batch]);
        generated += batch.length;
        setProgress(generated);
      }
      if (!cancelRef.current) {
        toast.success(`${generated} histoire${generated > 1 ? 's' : ''} générée${generated > 1 ? 's' : ''} !`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Génération impossible.');
    } finally {
      setGenerating(false);
    }
  }, [theme, count, targetAge, tone, wordsPerStory, characterBible, generateImages, effectiveTitle]);

  const regenerateOne = async (numero: number) => {
    setRegenerating(numero);
    try {
      const story = stories.find((s) => s.numero === numero);
      if (!story) return;
      const { data, error } = await supabase.functions.invoke('short-stories-generate', {
        body: {
          bookTitle: effectiveTitle,
          targetAge,
          theme: theme.trim(),
          tone: TONES.find((t) => t.id === tone)?.label ?? tone,
          count: 1,
          wordsPerStory,
          characterBible: characterBible.trim() || undefined,
          generateImages,
          startIndex: numero - 1,
        },
      });
      if (error) throw new Error(error.message);
      const batch = (data as { stories?: ShortStory[] })?.stories ?? [];
      if (batch.length === 0) throw new Error('Réponse IA vide.');
      const [replacement] = batch;
      setStories((prev) =>
        prev.map((s) =>
          s.numero === numero
            ? { ...replacement, numero }
            : s,
        ),
      );
      toast.success(`Histoire n°${numero} regénérée.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regénération impossible.');
    } finally {
      setRegenerating(null);
    }
  };

  const copyPrompt = async (key: number | 'all', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
      toast.success('Prompt copié !');
    } catch {
      toast.error('Copie impossible.');
    }
  };

  const updateStory = (numero: number, patch: Partial<ShortStory>) => {
    setStories((prev) => prev.map((s) => (s.numero === numero ? { ...s, ...patch } : s)));
  };
  const removeStory = (numero: number) => {
    setStories((prev) =>
      prev.filter((s) => s.numero !== numero).map((s, i) => ({ ...s, numero: i + 1 })),
    );
  };
  const addStory = () => {
    setStories((prev) => [
      ...prev,
      {
        numero: prev.length + 1,
        title: `Nouvelle histoire ${prev.length + 1}`,
        synopsis: '',
        content: '',
        illustrationPromptEn: '',
        moral: '',
      },
    ]);
  };

  const exportData = { bookTitle: effectiveTitle, authorName: authorName.trim(), stories };
  const canExport = stories.length > 0 && !generating;
  const allPrompts = stories
    .map((s) => `# ${s.numero}. ${s.title}\n${s.illustrationPromptEn}`)
    .join('\n\n');

  // ————— Accès verrouillé —————
  if (accessLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: EMERALD }} />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(201,168,76,0.15)' }}
        >
          <Lock className="h-8 w-8" style={{ color: EMERALD }} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: EMERALD }}>
          Histoires Courtes &amp; Contes Illustrés
        </h2>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          Ce générateur est réservé au plan Pro — ou déblocable à vie pour 27 €.
        </p>
        <button
          onClick={() => setUpsellOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(90deg, ${EMERALD}, #0d7a5f)` }}
        >
          <BookOpen className="h-4 w-4" /> Débloquer le générateur
        </button>
        {upsellOpen && (
          <V3ShortStoriesUpsell defaultEmail={userEmail} onClose={() => setUpsellOpen(false)} />
        )}
      </div>
    );
  }

  // ————— Interface débloquée —————
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* ——— Panneau de configuration ——— */}
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: EMERALD }}>
            Configuration du livre
          </h3>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Public cible
          </label>
          <select
            value={targetAge}
            onChange={(e) => setTargetAge(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            {AGE_GROUPS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Thème / Niche
          </label>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder='Ex : "Histoires du soir", "Aventures dans l espace"…'
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Tonalité
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            {TONES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Nombre d'histoires (max {MAX_STORIES})
          </label>
          <input
            type="number"
            min={1}
            max={MAX_STORIES}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-1"
            style={{ borderColor: LINE }}
          />
          {count > 20 && (
            <p className="text-[11px] mb-2" style={{ color: '#C97A14' }}>
              Au-delà de 20 histoires, la génération est plus longue — restez sur la page.
            </p>
          )}
          <div className="mb-3" />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Longueur cible par histoire (mots)
          </label>
          <input
            type="number"
            min={50}
            max={2500}
            value={wordsPerStory}
            onChange={(e) => setWordsPerStory(parseInt(e.target.value) || 250)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Personnage(s) récurrent(s) (optionnel)
          </label>
          <input
            value={characterBible}
            onChange={(e) => setCharacterBible(e.target.value)}
            placeholder="Ex : Léo, un petit renard curieux et courageux"
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Titre du livre (optionnel)
          </label>
          <input
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder={effectiveTitle}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Nom d'auteur (optionnel)
          </label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Votre nom de plume"
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={generateImages}
              onChange={(e) => setGenerateImages(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-xs" style={{ color: MUTED }}>
              Générer aussi les illustrations (consomme des crédits IA)
            </span>
          </label>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: `linear-gradient(90deg, ${EMERALD}, #0d7a5f)` }}
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Génération {progress}/{Math.min(count, MAX_STORIES)}…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Générer le livre</>
            )}
          </button>
          {generating && (
            <button
              onClick={() => { cancelRef.current = true; }}
              className="mt-2 w-full text-xs underline"
              style={{ color: MUTED }}
            >
              Arrêter après ce lot
            </button>
          )}
        </div>

        {/* ——— Exports ——— */}
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <h3 className="text-sm font-black uppercase tracking-wider mb-3" style={{ color: EMERALD }}>
            Export KDP
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => exportShortStoriesPdf(exportData)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ background: GOLD }}
            >
              <FileDown className="h-4 w-4" /> PDF (6"×9" prêt KDP)
            </button>
            <button
              onClick={() => void exportShortStoriesDocx(exportData)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-50"
              style={{ borderColor: EMERALD, color: EMERALD }}
            >
              <FileText className="h-4 w-4" /> DOCX (éditable)
            </button>
            <button
              onClick={() => exportShortStoriesTxt(exportData)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-50"
              style={{ borderColor: LINE, color: MUTED }}
            >
              <Download className="h-4 w-4" /> TXT (brut)
            </button>
          </div>
        </div>
      </div>

      {/* ——— Prévisualisation & édition ——— */}
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: EMERALD }}>
              <ListTree className="inline h-4 w-4 mr-1 -mt-0.5" />
              {effectiveTitle} — {stories.length} histoire{stories.length > 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyPrompt('all', allPrompts)}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border px-3 py-1.5"
                style={{ borderColor: GOLD, color: EMERALD }}
                disabled={!canExport}
              >
                {copied === 'all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Tous les prompts
              </button>
              <button
                onClick={addStory}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border px-3 py-1.5"
                style={{ borderColor: LINE, color: EMERALD }}
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
          </div>

          {stories.length === 0 && !generating && (
            <div className="text-center py-16">
              <BookOpen className="h-10 w-10 mx-auto mb-3" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>
                Configurez votre livre à gauche, puis cliquez sur « Générer le livre ».
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                Chaque histoire inclut : titre · synopsis visuel · texte complet · morale · prompt d'illustration (EN).
              </p>
            </div>
          )}

          {/* Sommaire */}
          {stories.length > 0 && (
            <div
              className="rounded-xl p-4 mb-4 text-xs"
              style={{ background: 'rgba(201,168,76,0.07)', border: `1px solid rgba(201,168,76,0.25)` }}
            >
              <span className="font-bold" style={{ color: EMERALD }}>Sommaire : </span>
              {stories.map((s) => `${s.numero}. ${s.title}`).join(' · ')}
            </div>
          )}

          <div className="space-y-3">
            {stories.map((s) => {
              const isOpen = expanded[s.numero] ?? true;
              return (
                <div key={s.numero} className="rounded-xl border" style={{ borderColor: LINE }}>
                  <div
                    className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
                    onClick={() => setExpanded((prev) => ({ ...prev, [s.numero]: !isOpen }))}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                      style={{ background: EMERALD }}
                    >
                      {s.numero}
                    </span>
                    <input
                      value={s.title}
                      onChange={(e) => updateStory(s.numero, { title: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-sm font-semibold bg-transparent border-b border-transparent focus:border-emerald-600 focus:outline-none truncate"
                      style={{ color: EMERALD }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); regenerateOne(s.numero); }}
                      disabled={regenerating === s.numero}
                      aria-label={`Regénérer l'histoire ${s.numero}`}
                      className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 disabled:opacity-50"
                      title="Regénérer cette histoire"
                    >
                      {regenerating === s.numero ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeStory(s.numero); }}
                      aria-label={`Supprimer l'histoire ${s.numero}`}
                      className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" style={{ color: MUTED }} />
                    ) : (
                      <ChevronDown className="h-4 w-4" style={{ color: MUTED }} />
                    )}
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>
                          Synopsis (scène visuelle)
                        </label>
                        <textarea
                          value={s.synopsis}
                          onChange={(e) => updateStory(s.numero, { synopsis: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>
                          Texte de l'histoire
                        </label>
                        <textarea
                          value={s.content}
                          onChange={(e) => updateStory(s.numero, { content: e.target.value })}
                          rows={8}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>
                            Morale / Message
                          </label>
                          <input
                            value={s.moral}
                            onChange={(e) => updateStory(s.numero, { moral: e.target.value })}
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            style={{ borderColor: LINE }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>
                            Prompt illustration (EN)
                          </label>
                          <div className="flex gap-2">
                            <input
                              value={s.illustrationPromptEn}
                              onChange={(e) => updateStory(s.numero, { illustrationPromptEn: e.target.value })}
                              className="flex-1 rounded-lg border px-3 py-2 text-sm"
                              style={{ borderColor: LINE }}
                            />
                            <button
                              onClick={() => copyPrompt(s.numero, s.illustrationPromptEn)}
                              className="rounded-lg border px-2.5 py-2 hover:bg-black/[0.03]"
                              style={{ borderColor: LINE }}
                              title="Copier le prompt"
                            >
                              {copied === s.numero ? <Check className="h-4 w-4" style={{ color: EMERALD }} /> : <Copy className="h-4 w-4" style={{ color: MUTED }} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {s.imageUrl && (
                        <div className="rounded-lg border p-2" style={{ borderColor: LINE }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>
                            <ImageIcon className="inline h-3 w-3 mr-1" /> Illustration générée
                          </p>
                          <img
                            src={s.imageUrl}
                            alt={`Illustration de ${s.title}`}
                            className="max-h-64 rounded-lg object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
