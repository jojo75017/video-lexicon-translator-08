import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface FunnelLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const FunnelLayout = ({ children, showFooter = true }: FunnelLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#232F3E] flex flex-col">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/promo" className="font-bold text-lg text-[#008296]">
            Ebookstudio Pro V2
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/promo/decouverte" className="hover:text-[#FF9E2D] transition">L'outil</Link>
            <Link to="/promo/affilie" className="hover:text-[#FF9E2D] transition">Affiliation</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {showFooter && (
        <footer className="border-t border-gray-200 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} Ebookstudio Pro V2 - Tous droits réservés</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/promo/affilie" className="text-[#FF9E2D] hover:underline font-semibold">
                💰 Programme d'affiliation - 30%
              </Link>
              <Link to="/mentions-legales" className="hover:text-[#008296]">Mentions légales</Link>
              <Link to="/cgv" className="hover:text-[#008296]">CGV</Link>
              <Link to="/politique-confidentialite" className="hover:text-[#008296]">Confidentialité</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default FunnelLayout;
