import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Feather, Palette, AudioLines, Rocket, GraduationCap, Sparkles } from 'lucide-react';
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

const STARTS = [
  { title: 'Écrire mon livre', desc: 'Roman, guide ou récit, chapitre par chapitre.', icon: Feather, color: '#EA580C', to: '/v3/create', tuto: '/v3/tutoriels-v3' },
  { title: 'Studio Couvertures', desc: 'Couverture Kindle et brochée prête pour KDP.', icon: Palette, color: '#7C3AED', to: '/v3/studio-v4', tuto: '/v3/tutoriels-v3' },
  { title: 'Audio & KDP', desc: 'Livre audio MP3 et fiche Amazon complète.', icon: AudioLines, color: '#059669', to: '/v3/outils/audiobook', tuto: '/v3/tutoriels-v3' },
  { title: 'Vendre & Lancer', desc: 'Plan de lancement et publicités Amazon.', icon: Rocket, color: '#D97706', to: '/v3/kdp-pilot', tuto: '/v3/tutoriels-v3' },
];

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
    <div className="space-y-6" style={{ background: '#080B11', borderRadius: 32, padding: '1.25rem' }}>
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
        {book && (
          <Link to={`/v3/book/${book.id}`} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold" style={{ background: '#EA580C', color: '#fff' }}>
            <span style={{ color: '#fff' }}>Continuer mon livre</span> <ArrowRight className="h-4 w-4" style={{ color: '#fff' }} />
          </Link>
        )}
      </div>

      {/* 2. Écriture Express */}
      <form onSubmit={start} className={`${panel} mx-auto max-w-3xl`} style={{ ...panelStyle, border: '2px solid #EA580C' }}>
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
      </form>

      {/* 3. Les 4 grands départs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STARTS.map(({ title: t, desc, icon: Icon, color, to, tuto }) => (
          <div key={t} className="flex flex-col rounded-3xl p-5" style={{ background: `${color}22`, border: `2px solid ${color}` }}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: color }}>
              <Icon className="h-5 w-5" style={{ color: '#fff' }} />
            </span>
            <h3 className="mt-3 text-lg font-bold" style={{ color: '#F8FAFC' }}>{t}</h3>
            <p className="mt-1 flex-1 text-sm" style={{ color: '#CBD5E1' }}>{desc}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to={to} className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: color, color: '#fff' }}>
                <span style={{ color: '#fff' }}>Y aller</span> <ArrowRight className="h-4 w-4" style={{ color: '#fff' }} />
              </Link>
              <Link to={tuto} className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: '#101622', border: `1px solid ${color}`, color: '#F1F5F9' }}>
                <GraduationCap className="h-4 w-4" /> <span>Tutoriel</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
