import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Bouton « Retour en haut » global.
 *
 * Placé en bas à droite pour ne pas chevaucher :
 *  - le CTA flottant (FloatingToolCTA, en bas à gauche),
 *  - la barre d'inscription collante (StickySignupBar, barre haute / basse),
 *  - une éventuelle bannière de cookies (généralement en bas à gauche ou en
 *    barre pleine : le bouton reste visible après défilement, avec un z-index
 *    modéré pour rester sous les bannières de consentement).
 *
 * N'apparaît qu'après un défilement suffisant (≥ 500 px), ce qui évite tout
 * conflit visuel au chargement de la page avec un bandeau cookie.
 */
export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Revenir en haut de la page"
      title="Revenir en haut"
      className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: 'var(--v3-emerald, #0d7a5f)',
        color: '#fff',
        border: '1px solid rgba(201,168,76,0.55)',
      }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
