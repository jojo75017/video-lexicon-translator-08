import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import banner from '@/assets/v3-premium-banner.jpg';

/**
 * Bandeau d'accueil. Pour les abonnés : grande bannière illustrée + longue barre de recherche,
 * les onglets de catégories étant déjà dans la barre latérale. Visiteurs : bandeau simple.
 */
export default function V3Header({ isAuthed }: { isAuthed?: boolean; isAdmin?: boolean }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  if (!isAuthed) {
    return (
      <header data-v3-nav="" className="v3-welcome-header sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 text-center">
          <p className="v3-welcome-title">
            <span className="v3-welcome-intro">Bienvenue sur </span>
            <strong>EbookStudio <span className="v3-welcome-premium">Premium</span> <span className="v3-welcome-version">V3</span></strong>
          </p>
        </div>
      </header>
    );
  }

  return (
    <header data-v3-nav="" className="relative overflow-hidden" style={{ background: '#080B11', borderBottom: '1px solid rgba(246,189,42,.35)' }}>
      <img src={banner} alt="" width={1920} height={640} className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.9 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,11,17,.25) 0%, rgba(8,11,17,.55) 70%, rgba(8,11,17,.9) 100%)' }} />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-10 pt-20 text-center md:pb-12 md:pt-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: '#F6BD2A' }}>Votre maison d'édition IA</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F3EDE6', textShadow: '0 2px 18px rgba(0,0,0,.7)' }}>
          EbookStudio <span style={{ color: '#F6BD2A', fontStyle: 'italic' }}>Premium</span> V3
        </h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: '#D8CFC7', textShadow: '0 1px 8px rgba(0,0,0,.8)' }}>
          Écrire, illustrer, publier et vendre vos livres, au même endroit.
        </p>
        <form
          className="mt-6 flex w-full max-w-3xl items-center gap-2 rounded-full p-1.5"
          style={{ background: 'rgba(26,29,36,.92)', border: '1px solid rgba(246,189,42,.55)', boxShadow: '0 8px 30px rgba(0,0,0,.45)' }}
          onSubmit={(e) => {
            e.preventDefault();
            const term = q.trim();
            navigate(`/v3/outils${term ? `?q=${encodeURIComponent(term)}` : ''}`);
          }}
        >
          <Search className="ml-3 h-5 w-5 shrink-0" style={{ color: '#F6BD2A' }} aria-hidden="true" />
          <input
            aria-label="Rechercher un outil"
            placeholder="Rechercher un outil : couverture, audio, traduction, KDP…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 flex-1 bg-transparent px-2 text-[15px] outline-none"
            style={{ color: '#F3EDE6' }}
          />
          <button type="submit" className="v3-flat-btn h-11 shrink-0 rounded-full px-6 text-sm font-semibold" style={{ background: '#EA580C', color: '#fff' }}>
            Rechercher
          </button>
        </form>
      </div>
    </header>
  );
}
