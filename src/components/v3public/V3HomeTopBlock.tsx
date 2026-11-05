import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, Plus, Minus, RotateCcw } from 'lucide-react';
import AgentPortrait from './AgentPortrait';
import useIsAdmin from '@/hooks/useIsAdmin';
import { setSpaceChoice } from '@/lib/v3OpenState';
import { SUBSCRIBER_HOME_PATH } from '@/lib/authDestination';
import photoRevise from '@/assets/template-memoir.jpg';
import photoCreate from '@/assets/template-fiction.jpg';
import photoVisual from '@/assets/bd-studio-hero.jpg';
import photoAudio from '@/assets/v3-kdp-auto-formatting.jpg';
import { supabase } from '@/integrations/supabase/client';

/**
 * Haut de l'accueil abonné (refonte du 5 novembre) :
 * reprise du dernier livre, encart « Écriture Express » pour les novices,
 * puis les 4 grands départs colorés avec leur tutoriel.
 */

const WIZARD_KEY = 'v3_create_workflow_config_v2';
const PROJECT_ID_KEY = 'v3_create_current_project_id_v1';

const GENRES = ['Roman', 'Thriller / Policier', 'Romance', 'Développement personnel', 'Santé / Bien-être', 'Enfants / Jeunesse', 'Biographie / Mémoires', 'Cuisine / Recettes'];

const EXAMPLES = [
  { label: 'Roman policier d’hiver', title: 'La Neige de Minuit', subject: 'Une enquête dans un village de montagne isolé par la neige', genre: 'Thriller / Policier', chapters: 20 },
  { label: 'Guide bien-être', title: 'Dormir enfin', subject: 'Méthodes simples et naturelles pour retrouver un sommeil réparateur', genre: 'Santé / Bien-être', chapters: 10 },
  { label: 'Livre jeunesse', title: 'Léon le petit phare', subject: 'Un petit phare qui apprend à briller malgré sa peur du noir', genre: 'Enfants / Jeunesse', chapters: 8 },
];

type Situation = {
  tag: string; title: string; sub: string; color: string; agent: string; agentName: string;
  photo: string; to: string; steps: string[]; links: { label: string; to: string }[];
};

const SITUATIONS: Situation[] = [
  {
    tag: 'J’ai déjà un texte', title: 'Réviser mon livre', sub: 'Importer · corriger · relire', color: '#2563EB',
    agent: 'victor', agentName: 'Victor', photo: photoRevise, to: '/v3/corriger',
    steps: [
      'Ouvrez « Corriger mon livre » et importez votre manuscrit (Word ou texte).',
      'L’IA corrige chaque chapitre : orthographe, style et cohérence.',
      'Relisez chapitre par chapitre et acceptez les corrections.',
      'Passez le texte dans HumanizeAI si vous voulez un style plus naturel.',
      'Exportez en Word ou PDF au format KDP.',
    ],
    links: [
      { label: 'Corriger mon livre', to: '/v3/corriger' },
      { label: 'BookPerfect AI', to: '/bookperfect' },
      { label: 'HumanizeAI', to: '/v3/outils/humanizer' },
      { label: 'Livres corrigés', to: '/v3/livres-corriges' },
      { label: 'Traduction 10 langues', to: '/v3/outils/traduction' },
    ],
  },
  {
    tag: 'Je pars de zéro', title: 'Créer mon livre & sommaire', sub: 'Idée · sommaire · rédaction', color: '#EA580C',
    agent: 'camille', agentName: 'Camille', photo: photoCreate, to: '/v3/lancer',
    steps: [
      'Ouvrez « Écrire un livre » et donnez un titre et un sujet.',
      'Choisissez le genre et le nombre de chapitres (5 à 40).',
      'Validez ou modifiez le sommaire proposé par l’IA.',
      'Lancez la rédaction : les chapitres s’écrivent un par un.',
      'Retrouvez votre livre dans « Mes livres » pour l’exporter.',
    ],
    links: [
      { label: 'Écrire un livre', to: '/v3/lancer' },
      { label: 'Créer mon livre (4 parcours)', to: '/v3/create' },
      { label: 'Raconter ma vie (biographie)', to: '/v3/biographie' },
      { label: 'J’ai déjà mon sommaire', to: '/v3/create?import=1' },
      { label: 'Sommaire IA — dialogue', to: '/v3/create?sommaire=ia' },
      { label: 'Sommaire Ultime', to: '/v3/outils/sommaire-ultime' },
      { label: 'Studio Pro (Gemini + ChatGPT)', to: '/v3/studio' },
    ],
  },
  {
    tag: 'Je veux un livre visuel', title: 'Livres illustrés, BD & VC Books', sub: 'Format · images · export', color: '#7C3AED',
    agent: 'iris', agentName: 'Iris', photo: photoVisual, to: '/v3/create/illustre',
    steps: [
      'Choisissez votre format : album, BD, VC Books ou guide illustré.',
      'Remplissez la fiche du livre (titre, thème, public).',
      'Générez les images, ou importez les vôtres depuis l’ordinateur.',
      'Vérifiez chaque page puis créez la couverture.',
      'Exportez en PDF au format KDP.',
    ],
    links: [
      { label: 'Illustrations intérieures', to: '/v3/create/illustre' },
      { label: 'BD Studio', to: '/bd-studio' },
      { label: 'VC Books — créer un livre', to: '/v3/vc-books/creer' },
      { label: 'Guides illustrés de A à Z', to: '/v3/guides-illustres' },
      { label: 'Studio de couverture', to: '/v3/studio-v4' },
    ],
  },
  {
    tag: 'Je prépare audio & Amazon', title: 'Studio Audio & publication KDP', sub: 'Manuscrit · voix · fiche KDP', color: '#059669',
    agent: 'gaspard', agentName: 'Gaspard', photo: photoAudio, to: '/v3/audiobook',
    steps: [
      'Ouvrez le Studio Audio et importez un livre de « Mes livres ».',
      'Choisissez la voix et générez le fichier MP3.',
      'Dans l’Espace KDP, trouvez vos mots-clés et catégories.',
      'Faites rédiger la description et la fiche Amazon.',
      'Passez l’audit KDP Pilot avant de publier.',
    ],
    links: [
      { label: 'Studio Audio', to: '/v3/audiobook' },
      { label: 'Espace KDP', to: '/v3/kdp' },
      { label: 'Mots-clés Amazon', to: '/kdp-keywords' },
      { label: 'Studio Recherche KDP', to: '/v3/recherche' },
      { label: 'KDP Pilot — Audit', to: '/audit-pilot' },
    ],
  },
];

const QUICK_TILES = [
  { label: 'Mes livres', to: '/v3/mes-livres', color: '#2563EB' },
  { label: 'Tutoriels A à Z', to: '/v3/tutoriels-v3', color: '#0891B2' },
  { label: 'Tous les outils V3', to: '/v3/outils', color: '#7C3AED' },
];

const ADMIN_LINKS = [
  { label: 'Dashboard admin', to: '/admin' },
  { label: 'Pilotage du lancement', to: '/admin/lancement' },
  { label: 'Base emails & envois', to: '/gestion-prospects' },
  { label: 'Aperçu des emails', to: '/apercu-emails' },
  { label: 'Partenaires', to: '/admin/partenaires' },
];

function SituationCard({ s }: { s: Situation }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: `2px solid ${s.color}`, background: '#14110F' }}>
      <div className="relative p-4" style={{ minHeight: 190 }}>
        <img src={s.photo} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.78 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,17,15,.55), rgba(20,17,15,.22))' }} />
        <div className="relative flex items-start justify-between gap-3">
          <span className="rounded-md px-3 py-1 text-xs font-bold" style={{ background: s.color, color: '#fff' }}>{s.tag}</span>
          <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: s.color, border: '2px solid #fff' }}>
            <AgentPortrait id={s.agent} name={s.agentName} />
          </span>
        </div>
        <h3 className="relative mt-2 text-2xl font-bold" style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.85)' }}>{s.title}</h3>
        <p className="relative mt-6 text-sm" style={{ color: '#F0EAE4', textShadow: '0 1px 6px rgba(0,0,0,.85)' }}>{s.sub}</p>
        <div className="relative mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
            className="v3-chip-toggle inline-flex items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold"
            style={{ background: s.color, color: '#fff' }}>
            <span style={{ color: '#fff' }}>Tutoriel</span>
            {open ? <Minus className="h-4 w-4" style={{ color: '#fff' }} /> : <Plus className="h-4 w-4" style={{ color: '#fff' }} />}
          </button>
          <Link to={s.to} className="inline-flex items-center justify-between rounded-md px-3 py-1.5 text-sm font-bold" style={{ background: '#3F3A37', color: '#fff' }}>
            <span style={{ color: '#fff' }}>Ouvrir l’atelier</span> <ArrowRight className="h-4 w-4" style={{ color: '#fff' }} />
          </Link>
        </div>
      </div>
      {open && (
        <div className="space-y-3 p-4" style={{ background: `${s.color}1f`, borderTop: `1px solid ${s.color}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#fff' }}>Comment faire</p>
          <ol className="space-y-1.5">
            {s.steps.map((st, i) => (
              <li key={st} className="flex gap-2 rounded-md p-2 text-sm" style={{ background: '#1E1A18', color: '#EDE7E2' }}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: s.color, color: '#fff' }}>{i + 1}</span>
                <span className="v3-sit-step">{st}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#fff' }}>Onglets de cet atelier</p>
          <div className="flex flex-wrap gap-2">
            {s.links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: '#1E1A18', border: `1px solid ${s.color}`, color: '#fff' }}>
                <span style={{ color: '#fff' }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Book = { id: string; title: string | null; updated_at: string };

const panel = 'rounded-3xl p-5 md:p-6';
const panelStyle = { background: '#101622', border: '1px solid #243248', color: '#F1F5F9' };
const fieldStyle = { background: '#172132', border: '1px solid #243248', color: '#F8FAFC' };

export default function V3HomeTopBlock({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [genre, setGenre] = useState('Roman');
  const [chapters, setChapters] = useState(12);
  const [adminOpen, setAdminOpen] = useState(false);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    let cancelled = false;
    supabase.from('ebook_projects').select('id,title,updated_at').eq('user_id', userId)
      .order('updated_at', { ascending: false }).limit(1)
      .then(({ data }) => { if (!cancelled) setBook(((data as Book[]) ?? [])[0] ?? null); });
    return () => { cancelled = true; };
  }, [userId]);

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;
    try {
      // Nouveau livre : on prépare l'assistant sans toucher aux livres déjà enregistrés.
      localStorage.removeItem(PROJECT_ID_KEY);
      localStorage.removeItem('ebook_workflow_progress');
      localStorage.removeItem('ebook_workflow_results');
      localStorage.setItem(WIZARD_KEY, JSON.stringify({
        title: title.trim(), description: subject.trim(), genre, numberOfChapters: chapters,
      }));
    } catch { /* stockage indisponible : l'assistant s'ouvre vide */ }
    navigate('/v3/lancer?ecrire=1');
  };

  return (
    <div className="space-y-6" style={{ background: '#332E2B', borderRadius: 32, padding: '1.25rem' }}>
      {/* 0. Accès directs */}
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {QUICK_TILES.map((t) => (
          <Link key={t.to} to={t.to} className="rounded-md px-3 py-2 text-sm font-bold" style={{ background: t.color, color: '#fff' }}>
            <span style={{ color: '#fff' }}>{t.label}</span>
          </Link>
        ))}
        {isAdmin && (
          <div className="relative">
            <button type="button" onClick={() => setAdminOpen((v) => !v)} aria-expanded={adminOpen}
              className="v3-chip-toggle flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold" style={{ background: '#B91C1C', color: '#fff' }}>
              <span style={{ color: '#fff' }}>Administration</span>
              {adminOpen ? <Minus className="h-4 w-4" style={{ color: '#fff' }} /> : <Plus className="h-4 w-4" style={{ color: '#fff' }} />}
            </button>
            {adminOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 space-y-1 rounded-md p-2" style={{ background: '#1E1A18', border: '1px solid #B91C1C' }}>
                {ADMIN_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className="block rounded px-2 py-1.5 text-sm" style={{ background: '#2A2624', color: '#fff' }}>
                    <span style={{ color: '#fff' }}>{l.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        <a href={SUBSCRIBER_HOME_PATH} onClick={() => setSpaceChoice('v2')} className="rounded-md px-3 py-2 text-sm font-bold" style={{ background: '#EA580C', color: '#fff' }}>
          <span style={{ color: '#fff' }}>Revenir à la V2</span>
        </a>
      </div>

      {/* 1. Reprise du livre */}
      <div className={`${panel} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`} style={panelStyle}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: '#EA580C' }}>
            <BookOpen className="h-5 w-5" style={{ color: '#fff' }} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FB923C' }}>Reprendre mon livre</p>
            <p className="truncate text-lg font-semibold" style={{ color: '#F8FAFC' }}>
              {book === undefined ? 'Chargement…' : book ? (book.title || 'Livre sans titre') : 'Aucun livre en cours pour le moment'}
            </p>
            {book && <p className="text-xs" style={{ color: '#94A3B8' }}>Modifié le {new Date(book.updated_at).toLocaleDateString('fr-FR')}</p>}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/v3/lancer" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold" style={{ background: 'rgba(234,88,12,.14)', border: '1px solid rgba(234,88,12,.55)', color: '#FDBA74' }}>
            <span style={{ color: '#FDBA74' }}>Je repars de zéro</span> <RotateCcw className="h-4 w-4" style={{ color: '#FDBA74' }} />
          </Link>
          {book && (
            <Link to={`/v3/book/${book.id}`} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold" style={{ background: '#EA580C', color: '#fff' }}>
              <span style={{ color: '#fff' }}>Continuer mon livre</span> <ArrowRight className="h-4 w-4" style={{ color: '#fff' }} />
            </Link>
          )}
        </div>
      </div>

      {/* 2. Écriture Express */}
      <form onSubmit={start} className={`${panel} relative mx-auto max-w-3xl overflow-hidden`} style={{ ...panelStyle, border: '2px solid #EA580C' }}>
        <img src={photoCreate} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.85 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(16,22,34,.38), rgba(16,22,34,.18))' }} />
        <div className="relative">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ background: '#2A1608', color: '#FB923C' }}>
            <Sparkles className="h-3.5 w-3.5" /> Écriture Express
          </p>
          <h2 className="mt-2 text-2xl font-semibold" style={{ color: '#F8FAFC' }}>Votre livre en 4 réponses</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Remplissez, l'IA s'occupe du reste.</p>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((x) => (
            <button key={x.label} type="button" className="v3-chip-toggle rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: '#172132', border: '1px solid #EA580C', color: '#FDBA74' }}
              onClick={() => { setTitle(x.title); setSubject(x.subject); setGenre(x.genre); setChapters(x.chapters); }}>
              Exemple : {x.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>1. Titre du livre
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-xl px-3 py-2" style={fieldStyle} placeholder="Ex. La Neige de Minuit" />
          </label>
          <label className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>3. Genre
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 w-full rounded-xl px-3 py-2" style={fieldStyle}>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold sm:col-span-2" style={{ color: '#E2E8F0' }}>2. De quoi parle votre livre ?
            <textarea value={subject} onChange={(e) => setSubject(e.target.value)} required rows={2} className="mt-1 w-full rounded-xl px-3 py-2" style={fieldStyle} placeholder="Ex. Une enquête dans un village isolé par la neige" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2" style={{ color: '#E2E8F0' }}>4. Nombre de chapitres : {chapters}
            <input type="range" min={5} max={40} value={chapters} onChange={(e) => setChapters(Number(e.target.value))} className="mt-2 w-full accent-orange-600" />
          </label>
        </div>
        <div className="mt-5 text-center">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold" style={{ background: '#EA580C', color: '#fff' }}>
            <span style={{ color: '#fff' }}>Écrire mon livre</span> <ArrowRight className="h-5 w-5" style={{ color: '#fff' }} />
          </button>
        </div>
        </div>
      </form>

      {/* 3. Dans quelle situation vous retrouvez-vous ? */}
      <h2 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>Dans quelle situation vous retrouvez-vous ?</h2>
      <div className="grid items-start gap-4 md:grid-cols-2">
        {SITUATIONS.map((s) => <SituationCard key={s.title} s={s} />)}
      </div>
    </div>
  );
}
