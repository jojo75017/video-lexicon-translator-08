import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BRAND_SUFFIX = 'Ebookstudio Pro V2';
const SEPARATOR = ' — ';

/**
 * Garantit que document.title se termine TOUJOURS par "— EbookStudio V2".
 * Surveille à la fois les changements de route ET les modifications de title
 * effectuées par d'autres composants (Helmet, document.title = ...).
 */
export function useBrandTitle() {
  const location = useLocation();

  useEffect(() => {
    const ensureSuffix = () => {
      const current = document.title || '';
      if (current.endsWith(BRAND_SUFFIX)) return;
      const base = current.trim().replace(/\s+[—\-|·]\s*EbookStudio.*$/i, '').trim();
      const next = base ? `${base}${SEPARATOR}${BRAND_SUFFIX}` : BRAND_SUFFIX;
      if (next !== current) {
        // évite la boucle MutationObserver -> setter
        document.title = next;
      }
    };

    // Apply immediately after navigation
    ensureSuffix();
    // Re-apply on next tick (after Helmet flush)
    const t = setTimeout(ensureSuffix, 50);

    // Observe future title mutations (document.title = "..." in any page)
    const titleEl = document.querySelector('title');
    let observer: MutationObserver | null = null;
    if (titleEl) {
      observer = new MutationObserver(ensureSuffix);
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    return () => {
      clearTimeout(t);
      observer?.disconnect();
    };
  }, [location.pathname]);
}
