import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, User, Mail, GraduationCap, Menu, X } from 'lucide-react';
import BlogExternalLink from './BlogExternalLink';
import ThemeToggle from './ThemeToggle';
import { ADMIN_HOME_PATH } from '@/config/adminRoutes';

/**
 * Header V3 — Ligne 1 (barre de marque premium).
 * Fond émeraude profond, accent or, typo sérif. La ligne 2 (mega-menu
 * catégories) est rendue par V3MainTabs juste en dessous.
 */
export default function V3Header({ isAuthed = false, isAdmin = false }: { isAuthed?: boolean; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    nav(`/v3/outils${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  };

  return (
    <header
      className="sticky top-0 z-40 overflow-x-clip"
      style={{
        background: 'linear-gradient(180deg, #064e3b 0%, #053e2f 100%)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.28)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center gap-4 lg:gap-6">
        {/* Branding */}
        <Link to="/v3" className="flex items-center gap-3 shrink-0 group">
          <span
            className="grid place-items-center w-9 h-9 rounded-full"
            style={{
              background: 'var(--v3-gold)',
              boxShadow: '0 4px 14px -4px rgba(201,168,76,0.55)',
            }}
          >
            <span className="v3-serif text-[15px] font-bold text-[#1a1408] leading-none italic">E</span>
          </span>
          <div className="leading-tight">
            <div className="v3-serif text-[20px] font-semibold text-white tracking-tight">
              Ebookstudio
            </div>
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--v3-gold)' }}>
              V3 · Premium
            </div>
          </div>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={submitSearch} className="hidden lg:flex flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v3-gold)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un outil, un guide, un livre…"
            className="w-full pl-10 pr-4 py-2 rounded-full text-[13px] text-white placeholder:text-white/50 focus:outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
            }}
          />
        </form>

        {/* Actions droite (≥ lg) */}
        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          <ThemeToggle variant="onDark" />
          <BlogExternalLink variant="headerDark" />
          <Link to="/formation" className="v3-btn v3-btn-on-dark" title="Formation">
            <GraduationCap className="w-4 h-4" /> Formation
          </Link>
          <Link to="/v3/contact" className="v3-btn v3-btn-on-dark" title="Support">
            <Mail className="w-4 h-4" /> Support
          </Link>
          <Link to="/ebook-planner" className="v3-btn v3-btn-on-dark text-[12.5px]" title="Basculer sur EbookStudio V2">
            Basculer V2
          </Link>
          {isAdmin && (
            <Link to={ADMIN_HOME_PATH} className="v3-btn v3-btn-on-dark text-[12.5px]" title="Ouvrir le dashboard administrateur">
              Dashboard admin
            </Link>
          )}

          <span className="w-px h-6 mx-1" style={{ background: 'rgba(201,168,76,0.25)' }} />

          {isAuthed ? (
            <>
              <Link to="/v3/library" className="v3-btn v3-btn-on-dark">
                <User className="w-4 h-4" /> Ma bibliothèque
              </Link>
              <Link to="/v3/create" className="v3-btn v3-btn-gold">
                Écrire un livre
              </Link>
            </>
          ) : (
            <>
              <Link to="/v3/auth" className="v3-btn v3-btn-on-dark">
                <LogIn className="w-4 h-4" /> Connexion
              </Link>
              <Link to="/v3/auth?mode=signup" className="v3-btn v3-btn-gold">
                S'inscrire
              </Link>
            </>
          )}
        </nav>

        {/* CTA rapide + trigger mobile & tablette (< lg) */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <Link
            to={isAuthed ? '/v3/create' : '/v3/auth?mode=signup'}
            className="v3-btn v3-btn-gold text-[12px] whitespace-nowrap"
            style={{ padding: '7px 14px' }}
          >
            {isAuthed ? 'Écrire' : "S'inscrire"}
          </Link>
          <button
            className="p-2 text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Ouvrir le menu principal"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filet or sous la barre */}
      <div className="v3-gold-rule" />

      {/* Drawer mobile & tablette */}
      {open && (
        <div className="lg:hidden" style={{ background: '#053e2f' }}>
          <div className="px-5 py-4 space-y-2">
            <form onSubmit={submitSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v3-gold)' }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                className="w-full pl-10 pr-4 py-2 rounded-full text-[13px] text-white placeholder:text-white/50 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.25)' }}
              />
            </form>
            <Link to="/v3/create" onClick={() => setOpen(false)} className="v3-btn v3-btn-gold w-full justify-center">
              Écrire un livre
            </Link>
            <Link to={isAuthed ? '/v3/library' : '/v3/auth'} onClick={() => setOpen(false)} className="v3-btn v3-btn-on-dark w-full justify-center">
              {isAuthed ? 'Ma bibliothèque' : 'Connexion'}
            </Link>
            <ThemeToggle variant="onDark" className="w-full justify-center" />
            <BlogExternalLink variant="headerDark" className="w-full justify-center" onClick={() => setOpen(false)} />
            <Link to="/formation" onClick={() => setOpen(false)} className="v3-btn v3-btn-on-dark w-full justify-center">
              <GraduationCap className="w-4 h-4" /> Formation
            </Link>
            <Link to="/v3/contact" onClick={() => setOpen(false)} className="v3-btn v3-btn-on-dark w-full justify-center">
              <Mail className="w-4 h-4" /> Contact & support
            </Link>
            <Link to="/ebook-planner" onClick={() => setOpen(false)} className="v3-btn v3-btn-on-dark w-full justify-center">
              Basculer V2
            </Link>
            {isAdmin && (
              <Link to={ADMIN_HOME_PATH} onClick={() => setOpen(false)} className="v3-btn v3-btn-on-dark w-full justify-center">
                Dashboard admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
