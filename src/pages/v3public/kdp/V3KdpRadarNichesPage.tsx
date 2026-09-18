import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Download,
  Flame,
  Lightbulb,
  Loader2,
  Radar,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MARKETPLACES } from '@/components/admin/market/marketShared';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';

/** Historique local (10 dernières explorations). */
const STORE_KEY = 'v3:kdp:radar:explorations';

interface Niche {
  nom: string;
  probleme: string;
  lecteur: string;
  demande: string;
  concurrence: string;
  angle: string;
}

interface Exploration {
  niches: Niche[];
  conseil: string;
}

interface StoredExploration {
  id: string;
  theme: string;
  marche: string;
  date: string;
  exploration: Exploration;
}

const lire = (): StoredExploration[] => {
  try {
    const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(list) ? list.slice(0, 10) : [];
  } catch {
    return [];
  }
};

const ecrire = (list: StoredExploration[]) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 10))); } catch { /* stockage indisponible */ }
};

const copier = async (texte: string, label = 'Copié') => {
  try {
    await navigator.clipboard.writeText(texte);
    toast.success(`${label} ✓`);
  } catch {
    toast.error('Copie impossible dans ce navigateur.');
  }
};

const nettoyer = (v: unknown) => String(v ?? '').trim();

/** Thématiques de départ proposées (contenu maison, pas de copie d'outil tiers). */
const THEMATIQUES = [
  'Bien-être et sérénité',
  'Organisation du quotidien',
  'Cuisine facile',
  'Apprentissage des enfants',
  'Vie de couple',
  'Petits budgets',
  'Sport à la maison',
  'Voyages en famille',
];

/** Idées de saison affichées selon le mois en cours. */
const ideesSaison = (): { titre: string; idees: string[] } => {
  const mois = new Date().getMonth(); // 0 = janvier
  const nomMois = new Date().toLocaleDateString('fr-FR', { month: 'long' });
  const parMois: Record<number, string[]> = {
    0: ['résolutions tenues cette fois', 'cahier de budget de l\'année', 'détox après les fêtes'],
    1: ['carnet de couple avant la Saint-Valentin', 'recettes réconfortantes d\'hiver'],
    2: ['journal de printemps et renouveau', 'organisateur de jardin potager'],
    3: ['activités de Pâques pour enfants', 'planning de grand ménage'],
    4: ['carnet de préparation des examens', 'recettes de pique-nique'],
    5: ['cahier de vacances à préparer', 'guide du potager d\'été'],
    6: ['journal de voyage en famille', 'activités d\'été pour enfants'],
    7: ['organisateur de rentrée sereine', 'carnet de lectures d\'été'],
    8: ['planner de rentrée des classes', 'routines du matin pour parents débordés'],
    9: ['thriller d\'automne', 'cahier de préparation d\'Halloween'],
    10: ['calendrier de l\'avent maison', 'journal de gratitude de fin d\'année'],
    11: ['carnet de cadeaux de Noël', 'recettes de fêtes sans stress', 'bilan de l\'année et objectifs'],
  };
  return { titre: `Sélection de ${nomMois}`, idees: parMois[mois] || parMois[0] };
};

/** Section repliable (les trois blocs du bas sont fermés par défaut). */
function SectionRepliable({
  titre,
  children,
  defautOuvert = false,
}: {
  titre: string;
  children: React.ReactNode;
  defautOuvert?: boolean;
}) {
  const [ouvert, setOuvert] = useState(defautOuvert);
  return (
    <section className="rounded-2xl border" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{titre}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform"
          style={{ color: 'var(--v3-muted)', transform: ouvert ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {ouvert && <div className="border-t px-5 py-4" style={{ borderColor: 'var(--v3-line)' }}>{children}</div>}
    </section>
  );
}

export default function V3KdpRadarNichesPage() {
  const [theme, setTheme] = useState('');
  const [marche, setMarche] = useState('fr');
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [courant, setCourant] = useState<StoredExploration | null>(null);
  const [historique, setHistorique] = useState<StoredExploration[]>([]);

  useEffect(() => {
    setHistorique(lire());
  }, []);

  const paysLabel = useMemo(
    () => MARKETPLACES.find((m) => m.id === marche)?.label || marche,
    [marche],
  );
  const saison = useMemo(() => ideesSaison(), []);

  const sauver = (rech: StoredExploration) => {
    setCourant(rech);
    const suite = [rech, ...lire().filter((r) => r.id !== rech.id)].slice(0, 10);
    ecrire(suite);
    setHistorique(suite);
  };

  const explorer = async (themeDepart?: string) => {
    const sujet = nettoyer(themeDepart ?? theme);
    if (sujet.length < 3) {
      setErreur('Écrivez un thème large (au moins 3 lettres), par exemple « journal de gratitude » ou « cuisine facile ».');
      return;
    }
    if (!isAIConfigured()) {
      setErreur("Aucune clé IA valide enregistrée. Ouvrez « Paramétrage des clés » puis revenez ici.");
      return;
    }
    setErreur(null);
    setTheme(sujet);
    setOccupe(true);
    try {
      const prompt = `Tu es éditeur spécialiste d'Amazon KDP, marché ${paysLabel}.
Écris en français courant uniquement : jamais de latin, jamais de mot inventé, jamais de mot étranger décoratif.
N'invente aucun chiffre : pas de volume de recherche, pas de nombre de ventes, pas de pourcentage. La demande et la concurrence sont des estimations qualitatives (« faible », « moyenne », « forte ») présentées comme telles.

Thème de départ : ${sujet}

Propose exactement 10 niches précises issues de ce thème. Chaque niche doit viser un problème réel de lecteur, pas un sujet vague. Pour chacune :
- "nom" : le nom court de la niche (3 à 7 mots).
- "probleme" : le problème concret du lecteur, une phrase.
- "lecteur" : à qui s'adresse le livre, quelques mots.
- "demande" : faible, moyenne ou forte (estimation qualitative).
- "concurrence" : faible, moyenne ou forte (estimation qualitative).
- "angle" : l'angle qui différencie le livre des concurrents, une phrase.

Ajoute "conseil" : un paragraphe de 3 phrases maximum expliquant comment choisir parmi ces niches et comment valider la préférée avant d'écrire.

Réponds uniquement avec ce JSON :
{"niches":[{"nom":"...","probleme":"...","lecteur":"...","demande":"...","concurrence":"...","angle":"..."}],"conseil":"..."}`;

      const brut = await callAIWriting(prompt, { temperature: 0.8, jsonMode: true, maxTokens: 6000 });
      const bloc = brut.match(/\{[\s\S]*\}/);
      if (!bloc) throw new Error('Réponse illisible du moteur IA. Relancez l\'exploration.');
      const parsed = JSON.parse(bloc[0]);

      const exploration: Exploration = {
        niches: (parsed.niches || [])
          .map((n: any) => ({
            nom: nettoyer(n?.nom),
            probleme: nettoyer(n?.probleme),
            lecteur: nettoyer(n?.lecteur),
            demande: nettoyer(n?.demande),
            concurrence: nettoyer(n?.concurrence),
            angle: nettoyer(n?.angle),
          }))
          .filter((n: Niche) => n.nom)
          .slice(0, 10),
        conseil: nettoyer(parsed.conseil),
      };
      if (!exploration.niches.length) {
        throw new Error("L'exploration reçue est vide. Relancez-la.");
      }

      sauver({ id: `${Date.now()}`, theme: sujet, marche, date: new Date().toISOString(), exploration });
    } catch (e: any) {
      setErreur(e?.message || "L'exploration n'a pas abouti. Relancez-la.");
    } finally {
      setOccupe(false);
    }
  };

  const texteComplet = () => {
    if (!courant) return '';
    const e = courant.exploration;
    return [
      `RADAR DE NICHES — ${courant.theme} (${MARKETPLACES.find((m) => m.id === courant.marche)?.label || courant.marche})`,
      '',
      '=== 10 NICHES PROPOSÉES ===',
      ...e.niches.map(
        (n, i) =>
          `${i + 1}. ${n.nom}\n   Problème : ${n.probleme}\n   Lecteur : ${n.lecteur}\n   Demande : ${n.demande || 'non estimée'} · Concurrence : ${n.concurrence || 'non estimée'}\n   Angle : ${n.angle}`,
      ),
      '',
      '=== COMMENT CHOISIR ===',
      e.conseil,
    ].join('\n');
  };

  const exporter = () => {
    if (!courant) return;
    const blob = new Blob([texteComplet()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radar-niches-${courant.theme.toLowerCase().replace(/[^a-z0-9]+/gi, '-').slice(0, 40) || 'livre'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btn = 'v3-btn v3-btn-primary h-10';
  const couleurNiveau = (c: string) => {
    const v = c.toLowerCase();
    if (v.includes('faible')) return '#1b6b3a';
    if (v.includes('forte') || v.includes('élev')) return '#8a2222';
    return 'var(--v3-gold-600)';
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Radar de niches — trouvez votre prochaine idée de livre | Ebookstudio</title>
        <meta name="description" content="Partez d'un thème large et obtenez 10 niches de livre centrées sur un vrai problème de lecteur, avec demande, concurrence et angle de différenciation." />
      </Helmet>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link to="/v3/kdp" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          <ArrowLeft className="h-4 w-4" /> Retour à l'espace KDP
        </Link>
        <Link to="/v3/fonctionnalites/cles" className="text-[12.5px] underline" style={{ color: 'var(--v3-muted)' }}>
          Paramétrage des clés
        </Link>
      </div>

      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--v3-gold-600)' }}>
          Espace KDP · page 5
        </p>
        <h1 className="v3-serif text-[30px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Radar de niches</h1>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
          Partez d'un thème large : vous obtenez 10 niches centrées sur un vrai problème de lecteur, avec une estimation
          de la demande et de la concurrence, et l'angle pour vous différencier. Aucun chiffre inventé.
        </p>
      </header>

      {/* Recherche */}
      <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
        <h2 className="mb-1 text-[16px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Sur quelle idée voulez-vous partir ?</h2>
        <p className="mb-3 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
          Entrez un thème large — l'outil propose 10 niches centrées sur un problème réel de lecteur.
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr,200px,auto] sm:items-end">
          <div>
            <Label className="text-xs">Thème de départ</Label>
            <Input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !occupe) void explorer(); }}
              placeholder="Ex : journal de gratitude, roman feel-good, gestion de l'anxiété…"
            />
          </div>
          <div>
            <Label className="text-xs">Marché Amazon</Label>
            <select
              value={marche}
              onChange={(e) => setMarche(e.target.value)}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              style={{ borderColor: 'var(--v3-line)' }}
            >
              {MARKETPLACES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <Button onClick={() => void explorer()} disabled={occupe} className={btn}>
            {occupe ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-1.5">Générer 10 idées</span>
          </Button>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          10 angles de niches, puis une estimation de la demande et de la concurrence pour chacun.
        </p>
        {erreur && (
          <p className="mt-3 rounded-lg border px-3 py-2 text-[13px]" style={{ borderColor: '#c99', background: '#fdf3f3', color: '#8a2222' }}>
            {erreur}
          </p>
        )}
      </section>

      {/* Inspiration */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            <Flame className="h-4 w-4" style={{ color: 'var(--v3-action-orange)' }} /> Idées de saison
          </h2>
          <p className="mb-3 mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{saison.titre} — à préparer quelques semaines en avance.</p>
          <div className="flex flex-wrap gap-2">
            {saison.idees.map((idee) => (
              <button
                key={idee}
                type="button"
                onClick={() => void explorer(idee)}
                disabled={occupe}
                className="rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:opacity-80"
                style={{ borderColor: 'var(--v3-action-orange)', color: 'var(--v3-action-orange)', background: 'var(--v3-paper)' }}
              >
                {idee}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
            <Lightbulb className="h-4 w-4" style={{ color: 'var(--v3-gold-600)' }} /> Thématiques qui fonctionnent sur KDP
          </h2>
          <p className="mb-3 mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>Cliquez sur une thématique pour explorer ses niches.</p>
          <div className="flex flex-wrap gap-2">
            {THEMATIQUES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => void explorer(t)}
                disabled={occupe}
                className="rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:opacity-80"
                style={{ borderColor: 'var(--v3-line)', color: 'var(--v3-ink)', background: 'var(--v3-paper)' }}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Résultats */}
      {courant && (
        <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
              <Radar className="h-4 w-4" style={{ color: 'var(--v3-action-orange)' }} />
              10 niches pour « {courant.theme} »
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void copier(texteComplet(), 'Exploration copiée')}>
                <Copy className="h-3.5 w-3.5" /> Copier
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={exporter}>
                <Download className="h-3.5 w-3.5" /> Exporter (.txt)
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {courant.exploration.niches.map((n, i) => (
              <article key={`${n.nom}-${i}`} className="rounded-xl border p-4" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
                <p className="text-[14px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  {i + 1}. {n.nom}
                </p>
                {n.probleme && <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{n.probleme}</p>}
                {n.lecteur && (
                  <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--v3-ink)' }}>Pour :</span> {n.lecteur}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-[11.5px] font-semibold">
                  {n.demande && (
                    <span className="rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--v3-line)', color: couleurNiveau(n.demande) }}>
                      Demande : {n.demande}
                    </span>
                  )}
                  {n.concurrence && (
                    <span className="rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--v3-line)', color: couleurNiveau(n.concurrence) }}>
                      Concurrence : {n.concurrence}
                    </span>
                  )}
                </div>
                {n.angle && (
                  <p className="mt-2 text-[12.5px]" style={{ color: 'var(--v3-ink)' }}>
                    <span className="font-semibold">Angle :</span> {n.angle}
                  </p>
                )}
              </article>
            ))}
          </div>

          {courant.exploration.conseil && (
            <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
              <p className="mb-1 text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Comment choisir</p>
              <p className="text-[13px]" style={{ color: 'var(--v3-muted)' }}>{courant.exploration.conseil}</p>
            </div>
          )}
        </section>
      )}

      {/* Historique */}
      {historique.length > 0 && (
        <section className="mb-4 rounded-2xl border p-5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-cream)' }}>
          <h2 className="mb-3 text-[15px] font-semibold" style={{ color: 'var(--v3-ink)' }}>Dernières explorations</h2>
          <div className="flex flex-wrap gap-2">
            {historique.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setCourant(h)}
                className="rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: courant?.id === h.id ? 'var(--v3-action-orange)' : 'var(--v3-line)',
                  color: 'var(--v3-ink)',
                  background: 'var(--v3-paper)',
                }}
              >
                {h.theme} · {new Date(h.date).toLocaleDateString('fr-FR')}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Trois sections repliables (fermées par défaut) */}
      <div className="grid gap-3">
        <SectionRepliable titre="Comment ça marche ?">
          <ol className="list-decimal space-y-1.5 pl-5 text-[13px]" style={{ color: 'var(--v3-muted)' }}>
            <li>Entrez un thème large (ex : yoga, budget, anxiété).</li>
            <li>L'outil propose 10 niches précises, chacune centrée sur un problème réel de lecteur.</li>
            <li>Chaque niche reçoit une estimation qualitative de la demande et de la concurrence — ce sont des estimations, pas des mesures exactes.</li>
            <li>Choisissez une niche, puis validez-la en regardant les livres similaires sur Amazon avant d'écrire.</li>
          </ol>
        </SectionRepliable>

        <SectionRepliable titre="La bonne logique pour choisir une niche">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Partir du lecteur', d: 'Quel problème votre lecteur a-t-il aujourd\'hui ? Il achète une solution, pas un livre.' },
              { t: 'Formuler une promesse', d: 'Pouvez-vous résumer votre livre en une phrase simple et concrète ? Si oui, la niche est bonne.' },
              { t: 'Vérifier la demande', d: 'Des livres similaires se vendent-ils sur Amazon ? Regardez leurs avis et leur classement.' },
              { t: 'Rester réaliste', d: 'La niche est-elle accessible à votre niveau ? Évaluez la concurrence honnêtement.' },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border p-3.5" style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>{c.t}</p>
                <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{c.d}</p>
              </div>
            ))}
          </div>
        </SectionRepliable>

        <SectionRepliable titre="Erreurs à éviter dans le choix de niche">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Niche trop large', d: '« Développement personnel » est trop vaste. Préférez « gestion du stress pour jeunes mamans ».' },
              { t: 'Niche trop concurrentielle', d: 'Si les 5 premiers livres ont des milliers d\'avis, il sera difficile de percer sans vraie différence.' },
              { t: 'Copier sans réflexion', d: 'Reproduire un livre existant sans angle propre est une erreur. Trouvez votre différenciation.' },
              { t: 'Attendre la niche parfaite', d: 'Il n\'existe pas de niche magique. Une niche claire, testable et accessible suffit pour se lancer.' },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border p-3.5" style={{ borderColor: '#e5c9c9', background: '#fdf6f6' }}>
                <p className="text-[13px] font-semibold" style={{ color: '#8a2222' }}>{c.t}</p>
                <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{c.d}</p>
              </div>
            ))}
          </div>
        </SectionRepliable>
      </div>
    </div>
  );
}
