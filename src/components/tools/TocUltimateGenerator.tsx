import { useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles, Download, Pin, RotateCcw, Trash2, FileJson, FileText, FileDown, History } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';

export type UltimateTocChapter = {
  id: string;
  numero: number;
  titre: string;
  objectif: string;
};

type Props = {
  /** Callback optionnel : quand fourni, un bouton "Utiliser dans le wizard" apparaît. */
  onApply?: (chapters: UltimateTocChapter[], meta: { theme: string; genre: string; audience: string; style: string; creativity: string; description: string }) => void;
  /** Valeurs initiales (pré-remplissage depuis le wizard). */
  initialTheme?: string;
  initialDescription?: string;
  initialGenre?: string;
  initialChapters?: number;
};

const GENRES = ['Roman', 'Fantaisie', 'Science-Fiction', 'Policier / Thriller', 'Romance', 'Horreur', 'Aventure', 'Biographie', 'Développement personnel', 'Manuel / Guide', 'Livre de recettes', 'Jeunesse', 'Poésie'];
const AUDIENCES = ['Enfants (6-12 ans)', 'Adolescents (12-18 ans)', 'Jeunes adultes (18-30)', 'Adultes', 'Seniors', 'Tous publics', 'Professionnels'];
const STYLES = [
  { id: 'classique', label: 'Classique (Roman)' },
  { id: 'technique', label: 'Technique (Manuel)' },
  { id: 'poetique', label: 'Poétique' },
  { id: 'minimaliste', label: 'Minimaliste' },
  { id: 'detaille', label: 'Détaillé (avec sous-parties)' },
  { id: 'accrocheur', label: 'Accrocheur / Vendeur' },
];
const CREATIVITY = [
  { id: 'faible', label: 'Faible — titres simples', temp: 0.3 },
  { id: 'moyen', label: 'Moyen — équilibré', temp: 0.6 },
  { id: 'eleve', label: 'Élevé — titres originaux', temp: 0.85 },
  { id: 'tres_eleve', label: 'Très élevé — surprenants', temp: 1.05 },
];

const HISTORY_KEY = 'toc_ultimate_history_v1';
const PINNED_KEY = 'toc_ultimate_pinned_v1';

type HistoryEntry = {
  id: string;
  createdAt: number;
  theme: string;
  genre: string;
  chapters: UltimateTocChapter[];
};

function readLS<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function writeLS<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ } }

function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function clean(text: unknown): string {
  return String(text || '').replace(/```(json)?/gi, '').replace(/[{}"]/g, '').replace(/\s+/g, ' ').trim();
}

export default function TocUltimateGenerator({ onApply, initialTheme, initialDescription, initialGenre, initialChapters }: Props) {
  const [theme, setTheme] = useState(initialTheme || '');
  const [genre, setGenre] = useState(initialGenre || 'Roman');
  const [audience, setAudience] = useState('Adultes');
  const [description, setDescription] = useState(initialDescription || '');
  const [nbChapters, setNbChapters] = useState<number>(Math.min(60, Math.max(10, initialChapters || 15)));
  const [style, setStyle] = useState('classique');
  const [creativity, setCreativity] = useState('moyen');

  const [chapters, setChapters] = useState<UltimateTocChapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'form' | 'edit' | 'history' | 'pinned'>('form');
  const [history, setHistory] = useState<HistoryEntry[]>(() => readLS<HistoryEntry[]>(HISTORY_KEY, []));
  const [pinned, setPinned] = useState<HistoryEntry[]>(() => readLS<HistoryEntry[]>(PINNED_KEY, []));

  useEffect(() => { writeLS(HISTORY_KEY, history); }, [history]);
  useEffect(() => { writeLS(PINNED_KEY, pinned); }, [pinned]);

  const stats = useMemo(() => {
    const total = chapters.length;
    const avgTitle = total ? Math.round(chapters.reduce((s, c) => s + c.titre.length, 0) / total) : 0;
    const avgObj = total ? Math.round(chapters.reduce((s, c) => s + c.objectif.length, 0) / total) : 0;
    return { total, avgTitle, avgObj };
  }, [chapters]);

  const generate = async () => {
    if (!theme.trim() || theme.trim().length < 3) {
      toast.error('Renseignez au moins le thème principal du livre.');
      return;
    }
    const provider = getProvider();
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) {
      toast.error('Configurez d’abord votre clé Gemini dans les paramètres.');
      return;
    }
    const styleLabel = STYLES.find((s) => s.id === style)?.label || style;
    const cr = CREATIVITY.find((c) => c.id === creativity) || CREATIVITY[1];

    const prompt = `Tu es directeur éditorial expert. Crée une TABLE DES MATIÈRES professionnelle en français.

Thème principal : ${theme}
Genre : ${genre}
Public cible : ${audience}
Description : ${description || 'Non fournie'}
Style de sommaire : ${styleLabel}
Niveau de créativité : ${cr.label}
Nombre EXACT de chapitres : ${nbChapters}

Réponds STRICTEMENT en JSON valide, sans markdown, avec ce schéma :
{"chapters":[{"numero":1,"titre":"Titre spécifique et évocateur","objectif":"Objectif éditorial du chapitre en 1 phrase claire"}]}

Règles strictes :
- exactement ${nbChapters} chapitres numérotés de 1 à ${nbChapters} ;
- aucun titre générique ("Chapitre 1", "Introduction", "Conclusion" tout seul) ;
- aucun titre répété ni motif conclusif répétitif ;
- titres cohérents avec le thème et le genre ;
- style ${styleLabel.toLowerCase()}, adapté au public ${audience.toLowerCase()} ;
- objectifs concrets, pas de blabla.`;

    setLoading(true);
    try {
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: cr.temp, maxTokens: Math.min(14000, 1500 + nbChapters * 220) });
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch { const m = raw.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); }
      const arr = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
      const seen = new Set<string>();
      const out: UltimateTocChapter[] = arr
        .map((c: any, i: number) => ({ id: makeId(), numero: i + 1, titre: clean(c.titre || c.title), objectif: clean(c.objectif || c.goal || c.description) }))
        .filter((c: UltimateTocChapter) => {
          const k = c.titre.toLowerCase();
          if (!c.titre || seen.has(k)) return false;
          seen.add(k); return true;
        })
        .slice(0, nbChapters)
        .map((c: UltimateTocChapter, i: number) => ({ ...c, numero: i + 1 }));

      if (out.length < Math.max(3, Math.floor(nbChapters * 0.6))) {
        throw new Error('Sommaire incomplet');
      }
      setChapters(out);
      setTab('edit');
      const entry: HistoryEntry = { id: makeId(), createdAt: Date.now(), theme, genre, chapters: out };
      setHistory((h) => [entry, ...h].slice(0, 30));
      toast.success(`Sommaire de ${out.length} chapitres généré ✓`);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Échec de la génération. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const updateChapter = (id: string, field: 'titre' | 'objectif', value: string) => {
    setChapters((cs) => cs.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };
  const removeChapter = (id: string) => {
    setChapters((cs) => cs.filter((c) => c.id !== id).map((c, i) => ({ ...c, numero: i + 1 })));
  };
  const addChapter = () => {
    setChapters((cs) => [...cs, { id: makeId(), numero: cs.length + 1, titre: `Chapitre ${cs.length + 1}`, objectif: '' }]);
  };

  const exportMarkdown = () => {
    const md = `# ${theme || 'Table des matières'}\n\n${chapters.map((c) => `## Chapitre ${c.numero} — ${c.titre}\n\n_${c.objectif}_\n`).join('\n')}`;
    download(md, 'sommaire.md', 'text/markdown');
  };
  const exportJson = () => {
    download(JSON.stringify({ theme, genre, audience, style, creativity, chapters }, null, 2), 'sommaire.json', 'application/json');
  };
  const exportTxt = () => {
    const txt = `TABLE DES MATIÈRES\n\n${chapters.map((c) => `Chapitre ${c.numero} — ${c.titre}\n${c.objectif}\n`).join('\n')}`;
    download(txt, 'sommaire.txt', 'text/plain');
  };
  const pinCurrent = () => {
    if (!chapters.length) return;
    const entry: HistoryEntry = { id: makeId(), createdAt: Date.now(), theme, genre, chapters };
    setPinned((p) => [entry, ...p].slice(0, 20));
    toast.success('Sommaire épinglé ✓');
  };
  const restore = (entry: HistoryEntry) => {
    setChapters(entry.chapters);
    setTheme(entry.theme);
    setGenre(entry.genre);
    setTab('edit');
  };

  const inputCls = 'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 border-black/10 bg-white';

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-black/10">
        {[
          { id: 'form', label: 'Génération', icon: Sparkles },
          { id: 'edit', label: `Édition${chapters.length ? ` (${chapters.length})` : ''}`, icon: FileText },
          { id: 'history', label: `Historique (${history.length})`, icon: History },
          { id: 'pinned', label: `Épinglés (${pinned.length})`, icon: Pin },
        ].map((t) => {
          const Icon = t.icon as any;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition ${active ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-orange-600'}`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'form' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Thème principal *</span>
              <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex : la quête d'un héritage familial en Provence" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Genre</span>
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className={inputCls}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Public cible</span>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className={inputCls}>
                {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Description générale</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Résumé, ton, atmosphère, personnages clés…" className={inputCls + ' resize-none'} />
            </label>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Nombre de chapitres : {nbChapters}</span>
              <input type="range" min={10} max={60} value={nbChapters} onChange={(e) => setNbChapters(Number(e.target.value))} className="w-full accent-orange-500" />
              <span className="text-[10px] text-gray-500">10 (essai) → 60 (roman ample)</span>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Style de sommaire</span>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputCls}>
                {STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Niveau de créativité</span>
              <select value={creativity} onChange={(e) => setCreativity(e.target.value)} className={inputCls}>
                {CREATIVITY.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-900">
              Utilise la clé Gemini configurée dans les paramètres. Les résultats sont sauvegardés dans l'historique local (30 derniers).
            </div>
            <button
              onClick={generate}
              disabled={loading || !theme.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Génération en cours…' : (chapters.length ? 'Régénérer' : 'Générer la table des matières')}
            </button>
          </div>
        </div>
      )}

      {tab === 'edit' && (
        <div className="space-y-3">
          {chapters.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Aucun sommaire pour le moment. Va dans l'onglet <strong>Génération</strong>.
            </div>
          )}
          {chapters.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 text-xs">
                <div className="flex gap-4"><span><strong>{stats.total}</strong> chapitres</span><span>Titre moy. <strong>{stats.avgTitle}</strong> car.</span><span>Objectif moy. <strong>{stats.avgObj}</strong> car.</span></div>
                <div className="flex flex-wrap gap-1">
                  <button onClick={exportMarkdown} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 hover:bg-orange-50"><FileText className="h-3 w-3" /> Markdown</button>
                  <button onClick={exportTxt} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 hover:bg-orange-50"><FileDown className="h-3 w-3" /> TXT</button>
                  <button onClick={exportJson} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 hover:bg-orange-50"><FileJson className="h-3 w-3" /> JSON</button>
                  <button onClick={pinCurrent} className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white px-2.5 py-1 hover:bg-orange-50"><Pin className="h-3 w-3" /> Épingler</button>
                </div>
              </div>

              <div className="space-y-2">
                {chapters.map((c) => (
                  <div key={c.id} className="rounded-xl border border-black/10 bg-white p-3">
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-500 font-bold text-white text-sm">{c.numero}</span>
                      <div className="flex-1 space-y-1.5">
                        <input value={c.titre} onChange={(e) => updateChapter(c.id, 'titre', e.target.value)} placeholder="Titre du chapitre" className="w-full rounded-md border border-black/10 px-2 py-1.5 text-sm font-semibold outline-none focus:border-orange-400" />
                        <textarea value={c.objectif} onChange={(e) => updateChapter(c.id, 'objectif', e.target.value)} placeholder="Objectif éditorial de ce chapitre" rows={2} className="w-full resize-none rounded-md border border-black/10 px-2 py-1.5 text-xs outline-none focus:border-orange-400" />
                      </div>
                      <button onClick={() => removeChapter(c.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
                <button onClick={addChapter} className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-500 hover:border-orange-400 hover:text-orange-600">+ Ajouter un chapitre</button>
              </div>

              {onApply && (
                <button
                  onClick={() => onApply(chapters, { theme, genre, audience, style, creativity, description })}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
                >
                  <Download className="h-4 w-4" /> Utiliser ce sommaire dans le wizard
                </button>
              )}
            </>
          )}
        </div>
      )}

      {(tab === 'history' || tab === 'pinned') && (
        <div className="space-y-2">
          {(tab === 'history' ? history : pinned).length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              {tab === 'history' ? 'Aucune génération encore.' : 'Aucun sommaire épinglé.'}
            </div>
          )}
          {(tab === 'history' ? history : pinned).map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-black/10 bg-white p-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900 truncate">{entry.theme || 'Sans thème'}</div>
                <div className="text-[11px] text-gray-500">{entry.genre} · {entry.chapters.length} chapitres · {new Date(entry.createdAt).toLocaleString('fr-FR')}</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => restore(entry)} className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2 py-1 text-xs hover:bg-orange-50"><RotateCcw className="h-3 w-3" /> Restaurer</button>
                <button
                  onClick={() => tab === 'history' ? setHistory((h) => h.filter((x) => x.id !== entry.id)) : setPinned((p) => p.filter((x) => x.id !== entry.id))}
                  className="rounded-md border border-black/10 p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                ><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
