import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Menu, X, LogIn, User, Mail } from 'lucide-react';

/**
 * Header V3 simplifié — plus de doublons avec la barre latérale.
 * Toute la navigation vit dans la sidebar. Ici : logo + actions compte + accès contact.
 */
export default function V3Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/v3" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-[var(--v3-orange)] grid place-items-center text-white">
            <Feather className="w-4 h-4" />
          </span>
          <span className="v3-serif text-xl font-bold tracking-tight">
            Ebookstudio<span className="text-[var(--v3-orange)]"> V3</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => nav('/contact-support')}
            className="v3-btn v3-btn-ghost"
            title="Contact & support"
          >
            <Mail className="w-4 h-4" /> Contact
          </button>
          {isAuthed ? (
            <>
              <button onClick={() => nav('/v3/library')} className="v3-btn v3-btn-ghost">
                <User className="w-4 h-4" /> Ma bibliothèque
              </button>
              <button onClick={() => nav('/v3/create')} className="v3-btn v3-btn-primary">
                Écrire un livre
              </button>
            </>
          ) : (
            <>
              <button onClick={() => nav('/v3/auth')} className="v3-btn v3-btn-ghost">
                <LogIn className="w-4 h-4" /> Connexion
              </button>
              <button onClick={() => nav('/v3/auth?mode=signup')} className="v3-btn v3-btn-primary">
                S'inscrire
              </button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu mobile — la sidebar n'est pas toujours visible sur mobile */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="px-5 py-3 space-y-1">
            <button
              onClick={() => { setOpen(false); nav('/v3/create'); }}
              className="v3-btn v3-btn-primary w-full justify-center"
            >
              Écrire un livre
            </button>
            <button
              onClick={() => { setOpen(false); nav(isAuthed ? '/v3/library' : '/v3/auth'); }}
              className="v3-btn v3-btn-outline w-full justify-center"
            >
              {isAuthed ? 'Ma bibliothèque' : 'Connexion'}
            </button>
            <button
              onClick={() => { setOpen(false); nav('/contact-support'); }}
              className="v3-btn v3-btn-ghost w-full justify-center"
            >
              <Mail className="w-4 h-4" /> Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
