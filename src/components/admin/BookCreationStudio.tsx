import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

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

const slugify = (s: string) =>
  (s || 'mon-livre')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'mon-livre';

export default function BookCreationStudio() {
  const [step, setStep] = useState(0);
  const [bookType, setBookType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const selectType = (id: string) => {
    setBookType(id);
    setStep(1);
  };

  const generate = async () => {
    if (!title.trim()) return toast.error('Indique au moins un titre.');
    setLoading(true);
    setOutput('');
    try {
      const typeLabel = BOOK_TYPES.find((t) => t.id === bookType)?.title ?? 'Livre';
      const prompt = `Tu es un auteur professionnel KDP. Génère le PLAN STRUCTURÉ d'un livre de type "${typeLabel}" prêt à être développé via le pipeline éditorial.

Titre : "${title}"
${subtitle ? `Sous-titre : "${subtitle}"` : ''}
${audience ? `Public cible : ${audience}` : ''}
${keywords ? `Mots-clés : ${keywords}` : ''}
${idea ? `Idée / description : ${idea}` : ''}

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
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: TEAL }}>
          Studio de création de livres
        </h2>
        <p className="text-sm" style={{ color: `${INK}99` }}>
          De l'idée au plan complet, prêt à développer puis exporter.
        </p>
      </div>

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
            <Button onClick={generate} disabled={loading} style={{ background: TEAL, color: '#fff' }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span className="ml-1.5">Générer le plan du livre</span>
            </Button>
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
