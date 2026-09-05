import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

/**
 * Bouton « Retour en haut » global.
 *
 * Positionné en bas à droite, juste à gauche du bouton assistant flottant
 * (AssistantFloatingButton, bottom-5 right-4, z-[60]) et du bouton clés API
 * (bottom-32 right-5), afin de rester visible sans jamais les recouvrir.
 *  - le CTA flottant (FloatingToolCTA) et la barre d'inscription collante
 *    (StickySignupBar) sont en bas à gauche / pleine largeur ;
 *  - une éventuelle bannière de cookies reste au-dessus grâce à un z-index
 *    modéré (z-[55]).
 *
 * N'apparaît qu'après un défilement suffisant (≥ 500 px), ce qui évite tout
 * conflit visuel au chargement avec un bandeau cookie.
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
      className="group fixed bottom-5 right-20 z-[55] flex h-12 items-center gap-2 rounded-full px-3 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: 'var(--v3-emerald, #0d7a5f)',
        color: '#fff',
        border: '1px solid rgba(201,168,76,0.55)',
      }}
    >
      <BookOpen className="h-5 w-5" style={{ color: 'rgba(201,168,76,0.95)' }} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium tracking-wide opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:pr-1">
        Retour en haut
      </span>
    </button>
  );
}
