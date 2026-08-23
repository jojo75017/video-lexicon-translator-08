import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Lock, Loader2, Sparkles, Download, Copy, Check,
  Plus, Trash2, ChevronDown, ChevronUp, ListTree, Palette,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useChercheTrouveAccess from '@/hooks/useChercheTrouveAccess';
import V3ChercheTrouveUpsell from '@/components/v3/V3ChercheTrouveUpsell';
import { getProviderKey } from '@/services/aiWritingService';

const EMERALD = 'var(--v3-emerald, #064e3b)';
const GOLD = 'var(--v3-gold, #c9a84c)';
const MUTED = 'var(--v3-muted, #6b7280)';
const LINE = 'var(--v3-line, #e5e7eb)';

export interface SeekFindObject {
  nom: string;
  quantite: number;
}

export interface SeekFindScene {
  numero: number;
  titre: string;
  description: string;
  objets: SeekFindObject[];
  promptImage: string;
}

const DRAWING_STYLES = [
  { id: 'line-art-cartoon', label: 'Line art cartoon' },
  { id: 'kawaii', label: 'Kawaii' },
  { id: 'realiste', label: 'Réaliste' },
  { id: 'mandala', label: 'Mandala' },
];

const DIFFICULTIES = [
  { id: 'facile', label: 'Facile (enfants 3-7 ans)' },
  { id: 'moyen', label: 'Moyen (8-12 ans / famille)' },
  { id: 'difficile', label: 'Difficile (adultes)' },
];

const BATCH_SIZE = 5;
const MAX_SCENES = 30;

function exportTxt(bookTitle: string, authorName: string, scenes: SeekFindScene[]) {
  const lines: string[] = [
    bookTitle.toUpperCase(),
    authorName ? `par ${authorName}` : '',
    '',
    'Livre de coloriage Cherche & Trouve — concepts, objets cachés et prompts IA.',
    '='.repeat(60),
    '',
  ];
  for (const s of scenes) {
    lines.push(`SCÈNE ${s.numero} — ${s.titre}`);
    lines.push('-'.repeat(50));
    if (s.description) lines.push(s.description, '');
    lines.push('Objets à cacher :');
    for (const o of s.objets) lines.push(`  • ${o.quantite > 1 ? `${o.quantite} × ` : ''}${o.nom}`);
    lines.push('', 'Prompt image (EN) :', s.promptImage, '', '');
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${bookTitle.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 50) || 'cherche-et-trouve'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function V3ChercheTrouvePage() {
  const { loading: accessLoading, hasAccess, userEmail, refresh } = useChercheTrouveAccess();
  const [searchParams, setSearchParams] = useSearchParams();
  const [upsellOpen, setUpsellOpen] = useState(false);

  // — Formulaire —
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('line-art-cartoon');
  const [difficulty, setDifficulty] = useState('moyen');
  const [objectsPerScene, setObjectsPerScene] = useState(10);
  const [count, setCount] = useState(10);
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');

  // — Contenu —
  const [scenes, setScenes] = useState<SeekFindScene[]>([]);
  const [generating, setGenerating] = useState(false);
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
    return theme.trim() ? `Cherche & Trouve — ${theme.trim()}` : 'Mon livre Cherche & Trouve';
  }, [bookTitle, theme]);

  const generate = useCallback(async () => {
    if (!theme.trim()) {
      toast.error('Indiquez un thème de scène (ex : "Forêt enchantée", "Fond marin"…).');
      return;
    }
    const total = Math.min(Math.max(count || 10, 1), MAX_SCENES);
    cancelRef.current = false;
    setGenerating(true);
    setProgress(0);
    setScenes([]);

    const geminiApiKey = getProviderKey('gemini') || localStorage.getItem('openai_api_key') || '';

    try {
      let generated = 0;
      while (generated < total) {
        if (cancelRef.current) break;
        const batchCount = Math.min(BATCH_SIZE, total - generated);
        const { data, error } = await supabase.functions.invoke('cherche-trouve-generate', {
          body: {
            theme: theme.trim(),
            style,
            difficulty,
            objectsPerScene,
            startIndex: generated,
            count: batchCount,
            geminiApiKey,
          },
        });
        if (error) throw new Error(error.message);
        const batch = (data as { scenes?: SeekFindScene[] })?.scenes ?? [];
        if (batch.length === 0) throw new Error('Réponse IA vide — réessayez.');
        setScenes((prev) => [...prev, ...batch]);
        generated += batch.length;
        setProgress(generated);
      }
      if (!cancelRef.current) {
        toast.success(`${generated} scène${generated > 1 ? 's' : ''} générée${generated > 1 ? 's' : ''} ! Copiez les prompts dans votre outil d'image.`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Génération impossible.');
    } finally {
      setGenerating(false);
    }
  }, [theme, style, difficulty, objectsPerScene, count]);

  const copyPrompt = async (key: number | 'all', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
      toast.success('Prompt copié ! Collez-le dans Midjourney, DALL-E ou Idéogram.');
    } catch {
      toast.error('Copie impossible — sélectionnez le texte manuellement.');
    }
  };

  const updateScene = (numero: number, patch: Partial<SeekFindScene>) => {
    setScenes((prev) => prev.map((s) => (s.numero === numero ? { ...s, ...patch } : s)));
  };
  const removeScene = (numero: number) => {
    setScenes((prev) =>
      prev.filter((s) => s.numero !== numero).map((s, i) => ({ ...s, numero: i + 1 })),
    );
  };
  const addScene = () => {
    setScenes((prev) => [
      ...prev,
      {
        numero: prev.length + 1,
        titre: `Nouvelle scène ${prev.length + 1}`,
        description: '',
        objets: [],
        promptImage: '',
      },
    ]);
  };

  const canExport = scenes.length > 0 && !generating;
  const allPrompts = scenes.map((s) => `# Scène ${s.numero} — ${s.titre}\n${s.promptImage}`).join('\n\n');

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
          Coloriages Cherche &amp; Trouve
        </h2>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          Ce générateur est réservé au plan Pro — ou déblocable à vie pour 27 €.
        </p>
        <button
          onClick={() => setUpsellOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(90deg, ${EMERALD}, #0d7a5f)` }}
        >
          <Search className="h-4 w-4" /> Débloquer le générateur
        </button>
        {upsellOpen && (
          <V3ChercheTrouveUpsell defaultEmail={userEmail} onClose={() => setUpsellOpen(false)} />
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
            Thème de la scène
          </label>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder='Ex : "Forêt enchantée", "Ville futuriste", "Fond marin"…'
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Style de dessin
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            {DRAWING_STYLES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Niveau de difficulté (densité des détails)
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Objets à cacher par scène : <strong style={{ color: EMERALD }}>{objectsPerScene}</strong>
          </label>
          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={objectsPerScene}
            onChange={(e) => setObjectsPerScene(parseInt(e.target.value))}
            className="w-full mb-3 accent-emerald-800"
            aria-label="Nombre d'objets à cacher par scène"
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Nombre de scènes (max {MAX_SCENES})
          </label>
          <input
            type="number"
            min={1}
            max={MAX_SCENES}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
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
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-4"
            style={{ borderColor: LINE }}
          />

          <button
            onClick={generate}
            disabled={generating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: `linear-gradient(90deg, ${EMERALD}, #0d7a5f)` }}
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Génération {progress}/{Math.min(count, MAX_SCENES)}…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Générer les scènes</>
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
            Export &amp; prompts
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => copyPrompt('all', allPrompts)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ background: GOLD }}
            >
              {copied === 'all' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copier tous les prompts
            </button>
            <button
              onClick={() => exportTxt(effectiveTitle, authorName.trim(), scenes)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-50"
              style={{ borderColor: EMERALD, color: EMERALD }}
            >
              <Download className="h-4 w-4" /> TXT (scènes + objets + prompts)
            </button>
          </div>
          <p className="text-[11px] mt-3" style={{ color: MUTED }}>
            Collez chaque prompt dans Midjourney, DALL-E ou Idéogram pour obtenir la page de
            coloriage au trait noir et blanc, prête pour le format KDP 6"×9".
          </p>
        </div>
      </div>

      {/* ——— Résultats ——— */}
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: EMERALD }}>
              <ListTree className="inline h-4 w-4 mr-1 -mt-0.5" />
              {effectiveTitle} — {scenes.length} scène{scenes.length > 1 ? 's' : ''}
            </h3>
            <button
              onClick={addScene}
              className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border px-3 py-1.5"
              style={{ borderColor: LINE, color: EMERALD }}
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une scène
            </button>
          </div>

          {scenes.length === 0 && !generating && (
            <div className="text-center py-16">
              <Palette className="h-10 w-10 mx-auto mb-3" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>
                Configurez votre livre à gauche, puis cliquez sur « Générer les scènes ».
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                Pour chaque page : titre · description · liste des objets cachés · prompt image
                optimisé en anglais (line art noir &amp; blanc).
              </p>
            </div>
          )}

          {/* Sommaire */}
          {scenes.length > 0 && (
            <div
              className="rounded-xl p-4 mb-4 text-xs"
              style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              <span className="font-bold" style={{ color: EMERALD }}>Sommaire : </span>
              {scenes.map((s) => `${s.numero}. ${s.titre}`).join(' · ')}
            </div>
          )}

          <div className="space-y-3">
            {scenes.map((s) => {
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
                    <span className="flex-1 text-sm font-semibold truncate" style={{ color: EMERALD }}>
                      {s.titre}
                    </span>
                    <span className="text-[10px] rounded-full px-2 py-0.5 font-semibold" style={{ background: 'rgba(201,168,76,0.15)', color: EMERALD }}>
                      {s.objets.reduce((sum, o) => sum + o.quantite, 0)} objets
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeScene(s.numero); }}
                      aria-label={`Supprimer la scène ${s.numero}`}
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
                    <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: LINE }}>
                      <div className="pt-3">
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Titre de la page
                        </label>
                        <input
                          value={s.titre}
                          onChange={(e) => updateScene(s.numero, { titre: e.target.value })}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Description
                        </label>
                        <textarea
                          value={s.description}
                          onChange={(e) => updateScene(s.numero, { description: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1.5" style={{ color: MUTED }}>
                          Objets à cacher
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {s.objets.map((o, i) => (
                            <span
                              key={`${o.nom}-${i}`}
                              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                              style={{ background: 'rgba(6,78,59,0.08)', color: EMERALD }}
                            >
                              <Search className="h-3 w-3" />
                              {o.quantite > 1 ? `${o.quantite} × ` : ''}{o.nom}
                            </span>
                          ))}
                          {s.objets.length === 0 && (
                            <span className="text-[11px]" style={{ color: MUTED }}>Aucun objet — régénérez ou éditez.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold" style={{ color: MUTED }}>
                            Prompt image (anglais — prêt pour Midjourney / DALL-E / Idéogram)
                          </label>
                          <button
                            onClick={() => copyPrompt(s.numero, s.promptImage)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold rounded-lg border px-2.5 py-1 transition-colors"
                            style={{ borderColor: GOLD, color: EMERALD }}
                          >
                            {copied === s.numero ? (
                              <><Check className="h-3 w-3" /> Copié !</>
                            ) : (
                              <><Copy className="h-3 w-3" /> Copier le prompt</>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={s.promptImage}
                          onChange={(e) => updateScene(s.numero, { promptImage: e.target.value })}
                          rows={4}
                          className="w-full rounded-lg border px-3 py-2 text-xs font-mono leading-relaxed"
                          style={{ borderColor: LINE, background: '#fafaf7' }}
                        />
                      </div>
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
