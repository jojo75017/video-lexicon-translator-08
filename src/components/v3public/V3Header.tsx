import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Feather, Menu, X, LogIn, User } from 'lucide-react';
import V3ToolsBar from './V3ToolsBar';

const MAIN_NAV = [
  { to: '/v3', label: 'Accueil', end: true },
  { to: '/v3/gallery', label: 'Galerie' },
  { to: '/v3/auteur', label: 'Auteur' },
  { to: '/v3/offres', label: 'Offres' },
  { to: '/v3#how', label: 'Comment ça marche' },
];

export const SPECIAL_BOOK_TABS: { slug: string; label: string }[] = [
  { slug: 'roman', label: 'Roman' },
  { slug: 'cuisine', label: 'Cuisine' },
  { slug: 'voyage', label: 'Voyage' },
  { slug: 'coloriage', label: 'Coloriage' },
  { slug: 'bd', label: 'BD / Manga' },
  { slug: 'documentaire', label: 'Documentaire' },
  { slug: 'atlas', label: 'Atlas' },
  { slug: 'encyclopedie', label: 'Encyclopédie' },
  { slug: 'agenda', label: 'Agenda' },
  { slug: 'journal', label: 'Journal' },
  { slug: 'scolaire', label: 'Scolaire' },
  { slug: 'aquariophilie', label: 'Aquariophilie' },
  { slug: 'oiseaux', label: 'Fiches oiseaux' },
  { slug: 'saga', label: 'Saga multi-tomes' },
];

export default function V3Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-[var(--v3-orange)]' : 'text-[var(--v3-ink)] hover:text-[var(--v3-orange)]'}`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/75 border-b border-black/5">
      {/* Ligne 1 */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/v3" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-[var(--v3-orange)] grid place-items-center text-white">
            <Feather className="w-4 h-4" />
          </span>
          <span className="v3-serif text-xl font-bold tracking-tight">Ebookstudio<span className="text-[var(--v3-orange)]"> V3</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {MAIN_NAV.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={linkCls}>
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthed ? (
            <>
              <button onClick={() => nav('/v3/library')} className="v3-btn v3-btn-ghost">
                <User className="w-4 h-4" /> Ma bibliothèque
              </button>
              <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-primary">Écrire un livre</button>
            </>
          ) : (
            <>
              <button onClick={() => nav('/v3/auth')} className="v3-btn v3-btn-ghost">
                <LogIn className="w-4 h-4" /> Connexion
              </button>
              <button onClick={() => nav('/v3/auth?mode=signup')} className="v3-btn v3-btn-primary">S'inscrire</button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Les onglets « Livres spéciaux » sont désormais dans la barre latérale */}



      {/* Ligne 3 — barre outils V2 catégorisés */}
      <V3ToolsBar />


      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="px-5 py-3 space-y-1">
            {MAIN_NAV.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                {it.label}
              </NavLink>
            ))}
            <div className="pt-2 flex gap-2">
              {isAuthed ? (
                <button onClick={() => { setOpen(false); nav('/v3/library'); }} className="v3-btn v3-btn-outline flex-1 justify-center">Ma bibliothèque</button>
              ) : (
                <button onClick={() => { setOpen(false); nav('/v3/auth'); }} className="v3-btn v3-btn-outline flex-1 justify-center">Connexion</button>
              )}
              <button onClick={() => { setOpen(false); nav('/v3/create'); }} className="v3-btn v3-btn-primary flex-1 justify-center">Écrire</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
