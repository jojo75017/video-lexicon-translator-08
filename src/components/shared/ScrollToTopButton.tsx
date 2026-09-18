import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

/**
 * Flèche « retour en haut » présente sur toutes les pages.
 *
 * Positionnée au-dessus d'EBOOKBOT (le bouton flottant de l'assistant, qui se
 * trouve à `bottom: 1.25rem` avec une hauteur de `3.5rem`). On laisse un
 * espace d'environ 7 cm — dans la fourchette 5–10 cm demandée — entre le haut
 * d'EBOOKBOT et le bas de la flèche.
 *
 * La flèche n'apparaît qu'après avoir défilé vers le bas, et disparaît en haut
 * de page. Le clic remonte la page en douceur.
 */

// EBOOKBOT : bottom 1.25rem + hauteur 3.5rem = 4.75rem depuis le bas.
// On ajoute 7 cm d'espacement (CSS `cm` ≈ 37,8 px).
const BOTTOM_OFFSET = 'calc(4.75rem + 7cm)';

const HIDDEN_ROUTES = ['/auth', '/logout-total'];

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r))) return null;

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Revenir en haut de la page"
      title="Revenir en haut"
      style={{ bottom: BOTTOM_OFFSET }}
      className={[
        'fixed right-4 z-[60] h-12 w-12 rounded-full shadow-2xl',
        'grid place-items-center transition-all duration-300',
        'bg-gradient-to-br from-orange-500 to-orange-600',
        'hover:scale-110 active:scale-95',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
    >
      <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;
