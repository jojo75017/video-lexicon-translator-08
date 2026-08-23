import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Puzzle, Lock, Loader2, Sparkles, Download, FileText, FileDown,
  Plus, Trash2, ChevronDown, ChevronUp, ListTree,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import usePuzzleBookAccess from '@/hooks/usePuzzleBookAccess';
import V3PuzzleBookUpsell from '@/components/v3/V3PuzzleBookUpsell';
import {
  exportPuzzleBookDocx,
  exportPuzzleBookPdf,
  exportPuzzleBookTxt,
  type PuzzleItem,
} from '@/lib/puzzleBookExport';
import { getProviderKey } from '@/services/aiWritingService';

const EMERALD = 'var(--v3-emerald, #064e3b)';
const GOLD = 'var(--v3-gold, #c9a84c)';
const MUTED = 'var(--v3-muted, #6b7280)';
const LINE = 'var(--v3-line, #e5e7eb)';

const PUZZLE_TYPES = [
  { id: 'enigmes-policieres', label: 'Énigmes policières' },
  { id: 'chasses-tresor', label: 'Chasses au trésor textuelles' },
  { id: 'logique-narrative', label: 'Jeux de logique narrative' },
  { id: 'thematiques', label: 'Puzzles thématiques' },
];

const DIFFICULTIES = [
  { id: 'facile', label: 'Facile' },
  { id: 'moyen', label: 'Moyen' },
  { id: 'difficile', label: 'Difficile' },
];

const BATCH_SIZE = 5;
const MAX_PUZZLES = 40;

export default function V3PuzzleBookPage() {
  const { loading: accessLoading, hasAccess, userEmail, refresh } = usePuzzleBookAccess();
  const [searchParams, setSearchParams] = useSearchParams();
  const [upsellOpen, setUpsellOpen] = useState(false);

  // — Formulaire —
  const [puzzleType, setPuzzleType] = useState('enigmes-policieres');
  const [theme, setTheme] = useState('');
  const [count, setCount] = useState(20);
  const [difficulty, setDifficulty] = useState('moyen');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');

  // — Contenu —
  const [puzzles, setPuzzles] = useState<PuzzleItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
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
    const typeLabel = PUZZLE_TYPES.find((t) => t.id === puzzleType)?.label ?? 'Énigmes';
    return theme.trim() ? `${typeLabel} — ${theme.trim()}` : `Mon livre d'énigmes`;
  }, [bookTitle, puzzleType, theme]);

  const generate = useCallback(async () => {
    if (!theme.trim()) {
      toast.error('Indiquez un thème / une niche pour votre livre.');
      return;
    }
    const total = Math.min(Math.max(count || 20, 1), MAX_PUZZLES);
    cancelRef.current = false;
    setGenerating(true);
    setProgress(0);
    setPuzzles([]);

    const geminiApiKey = getProviderKey('gemini') || localStorage.getItem('openai_api_key') || '';

    try {
      let generated = 0;
      while (generated < total) {
        if (cancelRef.current) break;
        const batchCount = Math.min(BATCH_SIZE, total - generated);
        const { data, error } = await supabase.functions.invoke('puzzle-book-generate', {
          body: {
            puzzleType,
            theme: theme.trim(),
            difficulty,
            language,
            startIndex: generated,
            count: batchCount,
            geminiApiKey,
          },
        });
        if (error) throw new Error(error.message);
        const batch = (data as { puzzles?: PuzzleItem[] })?.puzzles ?? [];
        if (batch.length === 0) throw new Error('Réponse IA vide — réessayez.');
        setPuzzles((prev) => [...prev, ...batch]);
        generated += batch.length;
        setProgress(generated);
      }
      if (!cancelRef.current) {
        toast.success(`${generated} énigmes générées ! Prévisualisez, éditez, exportez.`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Génération impossible.');
    } finally {
      setGenerating(false);
    }
  }, [theme, count, puzzleType, difficulty, language]);

  const updatePuzzle = (numero: number, patch: Partial<PuzzleItem>) => {
    setPuzzles((prev) => prev.map((p) => (p.numero === numero ? { ...p, ...patch } : p)));
  };
  const updateHint = (numero: number, idx: number, value: string) => {
    setPuzzles((prev) =>
      prev.map((p) =>
        p.numero === numero
          ? { ...p, indices: p.indices.map((h, i) => (i === idx ? value : h)) }
          : p,
      ),
    );
  };
  const removePuzzle = (numero: number) => {
    setPuzzles((prev) =>
      prev.filter((p) => p.numero !== numero).map((p, i) => ({ ...p, numero: i + 1 })),
    );
  };
  const addPuzzle = () => {
    setPuzzles((prev) => [
      ...prev,
      {
        numero: prev.length + 1,
        titre: `Nouvelle énigme ${prev.length + 1}`,
        contexte: '',
        enonce: '',
        indices: [''],
        solution: '',
      },
    ]);
  };

  const exportData = { bookTitle: effectiveTitle, authorName: authorName.trim(), puzzles };
  const canExport = puzzles.length > 0 && !generating;

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
          Livres de Jeux &amp; Énigmes
        </h2>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          Ce générateur est réservé au plan Pro — ou déblocable à vie pour 27 €.
        </p>
        <button
          onClick={() => setUpsellOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(90deg, ${EMERALD}, #0d7a5f)` }}
        >
          <Puzzle className="h-4 w-4" /> Débloquer le générateur
        </button>
        {upsellOpen && (
          <V3PuzzleBookUpsell defaultEmail={userEmail} onClose={() => setUpsellOpen(false)} />
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
            Type de puzzle
          </label>
          <select
            value={puzzleType}
            onChange={(e) => setPuzzleType(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            {PUZZLE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Thème / Niche
          </label>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder='Ex : "Enquêtes au XIXe siècle", "Pirates et trésors perdus"…'
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3"
            style={{ borderColor: LINE }}
          />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Nombre de puzzles (max {MAX_PUZZLES})
          </label>
          <input
            type="number"
            min={1}
            max={MAX_PUZZLES}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 20)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-1"
            style={{ borderColor: LINE }}
          />
          {count > 30 && (
            <p className="text-[11px] mb-2" style={{ color: '#C97A14' }}>
              Au-delà de 30 puzzles, la génération est plus longue — restez sur la page.
            </p>
          )}
          <div className="mb-3" />

          <label className="block text-xs font-semibold mb-1" style={{ color: MUTED }}>
            Niveau de difficulté
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
            Langue de sortie
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
            className="w-full rounded-lg border px-3 py-2.5 text-sm mb-3 bg-white"
            style={{ borderColor: LINE }}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>

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
              <><Loader2 className="h-4 w-4 animate-spin" /> Génération {progress}/{Math.min(count, MAX_PUZZLES)}…</>
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
              onClick={() => exportPuzzleBookPdf(exportData)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              style={{ background: GOLD }}
            >
              <FileDown className="h-4 w-4" /> PDF (6"×9" prêt KDP)
            </button>
            <button
              onClick={() => void exportPuzzleBookDocx(exportData)}
              disabled={!canExport}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-50"
              style={{ borderColor: EMERALD, color: EMERALD }}
            >
              <FileText className="h-4 w-4" /> DOCX (éditable)
            </button>
            <button
              onClick={() => exportPuzzleBookTxt(exportData)}
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
              {effectiveTitle} — {puzzles.length} puzzle{puzzles.length > 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSolutions((v) => !v)}
                className="text-xs font-semibold rounded-lg border px-3 py-1.5"
                style={{ borderColor: GOLD, color: EMERALD }}
              >
                {showSolutions ? 'Masquer les solutions' : 'Voir les solutions'}
              </button>
              <button
                onClick={addPuzzle}
                className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg border px-3 py-1.5"
                style={{ borderColor: LINE, color: EMERALD }}
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
          </div>

          {puzzles.length === 0 && !generating && (
            <div className="text-center py-16">
              <Puzzle className="h-10 w-10 mx-auto mb-3" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: MUTED }}>
                Configurez votre livre à gauche, puis cliquez sur « Générer le livre ».
              </p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                Structure générée : titre accrocheur · contexte · énoncé · 1 à 3 indices progressifs ·
                solution détaillée regroupée en fin d'ouvrage.
              </p>
            </div>
          )}

          {/* Sommaire */}
          {puzzles.length > 0 && (
            <div
              className="rounded-xl p-4 mb-4 text-xs"
              style={{ background: 'rgba(201,168,76,0.07)', border: `1px solid rgba(201,168,76,0.25)` }}
            >
              <span className="font-bold" style={{ color: EMERALD }}>Sommaire : </span>
              {puzzles.map((p) => `${p.numero}. ${p.titre}`).join(' · ')}
              {' · '}Solutions
            </div>
          )}

          <div className="space-y-3">
            {puzzles.map((p) => {
              const isOpen = expanded[p.numero] ?? false;
              return (
                <div key={p.numero} className="rounded-xl border" style={{ borderColor: LINE }}>
                  <div
                    className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
                    onClick={() => setExpanded((prev) => ({ ...prev, [p.numero]: !isOpen }))}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                      style={{ background: EMERALD }}
                    >
                      {p.numero}
                    </span>
                    <span className="flex-1 text-sm font-semibold truncate" style={{ color: EMERALD }}>
                      {p.titre}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removePuzzle(p.numero); }}
                      aria-label={`Supprimer l'énigme ${p.numero}`}
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
                    <div className="px-4 pb-4 space-y-3 border-t pt-3" style={{ borderColor: LINE }}>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Titre
                        </label>
                        <input
                          value={p.titre}
                          onChange={(e) => updatePuzzle(p.numero, { titre: e.target.value })}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Contexte / mise en situation
                        </label>
                        <textarea
                          value={p.contexte}
                          onChange={(e) => updatePuzzle(p.numero, { contexte: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Énoncé du défi
                        </label>
                        <textarea
                          value={p.enonce}
                          onChange={(e) => updatePuzzle(p.numero, { enonce: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Indices progressifs
                        </label>
                        {p.indices.map((hint, i) => (
                          <input
                            key={i}
                            value={hint}
                            onChange={(e) => updateHint(p.numero, i, e.target.value)}
                            placeholder={`Indice ${i + 1}`}
                            className="w-full rounded-lg border px-3 py-2 text-sm mb-2"
                            style={{ borderColor: LINE }}
                          />
                        ))}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: MUTED }}>
                          Solution détaillée (section « Solutions » en fin d'ouvrage)
                        </label>
                        <textarea
                          value={p.solution}
                          onChange={(e) => updatePuzzle(p.numero, { solution: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: LINE, background: 'rgba(201,168,76,0.05)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Aperçu des solutions */}
          {showSolutions && puzzles.length > 0 && (
            <div className="mt-6 rounded-xl border p-4" style={{ borderColor: GOLD }}>
              <h4 className="text-sm font-black mb-3" style={{ color: EMERALD }}>
                Section « Solutions » (fin d'ouvrage)
              </h4>
              <div className="space-y-3">
                {puzzles.map((p) => (
                  <div key={`sol-${p.numero}`}>
                    <p className="text-xs font-bold" style={{ color: EMERALD }}>
                      Solution n°{p.numero} — {p.titre}
                    </p>
                    <p className="text-xs" style={{ color: MUTED }}>{p.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
