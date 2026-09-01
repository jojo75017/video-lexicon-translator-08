import { useEffect, useState, type ReactNode } from 'react';
import { V3_LAUNCH_UNLOCKED } from '@/config/v3Launch';
import useIsAdmin from '@/hooks/useIsAdmin';
import { toast } from 'sonner';

/**
 * Contemplation Mode — Phase 0 (pre-launch V3).
 *
 * Tant que la V3 n'est pas ouverte et que l'utilisateur n'est pas admin,
 * tous les clics sur des liens/boutons internes sont interceptés :
 * les visiteurs ne peuvent QUE contempler la V3.
 *
 * Règle absolue : pendant que le statut admin est inconnu, RIEN n'est bloqué.
 * Un admin dont la session met du temps à se restaurer ne doit jamais tomber
 * sur le message d'ouverture au 1ᵉʳ octobre.
 */
const ALLOWED_PATHS = [
  '/v3',
  '/v3/',
  '/v3/offre',
  '/v3/pourquoi',
  '/v3/realite-kdp',
  '/v3/contact',
  '/v3/script-heygen',
  '/v3/nouveautes',
  // Pages de présentation ouvertes avant le lancement : elles ne créent
  // aucun livre, donc les visiteurs peuvent les parcourir librement.
  '/v3/commence-ici',
  '/v3/workflow',
  '/v3/fonctionnalites',
];

const ALLOWED_EXTERNAL_HOSTS = [
  'ebookstudio.blog',
  'www.ebookstudio.blog',
];

/**
 * Aperçu volontaire « comme un abonné » : conservé EN MÉMOIRE uniquement.
 * Il se réinitialise à chaque chargement, donc il ne peut plus masquer les
 * sorties admin ni réafficher le verrou du 1ᵉʳ octobre après une actualisation.
 */
export const ADMIN_PREVIEW_AS_SUBSCRIBER_KEY = 'v3_admin_preview_as_subscriber';

let previewAsSubscriberMemory = false;

export function isPreviewingAsSubscriber(): boolean {
  return previewAsSubscriberMemory;
}

export function setPreviewingAsSubscriber(next: boolean) {
  previewAsSubscriberMemory = next;
  window.dispatchEvent(new Event('v3-admin-preview-change'));
}

function isAllowedTarget(href: string | null): boolean {
  if (!href) return false;
  if (href.startsWith('#')) return true;
  try {
    const url = new URL(href, window.location.origin);
    // External links: only whitelisted marketing hosts
    if (url.origin !== window.location.origin) {
      return ALLOWED_EXTERNAL_HOSTS.includes(url.hostname);
    }
    const path = url.pathname.replace(/\/+$/, '') || '/';
    // Routes hors /v3 : on laisse (retour V2, /offres, etc.)
    if (!path.startsWith('/v3')) return true;
    return ALLOWED_PATHS.some((p) => {
      const norm = p.replace(/\/+$/, '') || '/';
      return path === norm;
    });
  } catch {
    return false;
  }
}

export default function V3ContemplationMode({ children }: { children: ReactNode }) {
  const { isAdmin } = useIsAdmin();
  const [previewAsSubscriber, setPreviewAsSubscriber] = useState(isPreviewingAsSubscriber);

  // L'aperçu « comme un abonné » peut être basculé depuis la barre admin.
  useEffect(() => {
    const sync = () => setPreviewAsSubscriber(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('v3-admin-preview-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Verrou uniquement quand le statut est CONNU et non admin (ou aperçu volontaire).
  const locked = !V3_LAUNCH_UNLOCKED && (isAdmin === false || (isAdmin === true && previewAsSubscriber));

  useEffect(() => {
    if (!locked) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      const button = target.closest('button, [role="button"], [role="link"]') as HTMLElement | null;
      const el = anchor || button;
      if (!el) return;

      // Element au-dessus du header (bandeau global V3) : autorisé
      if (el.closest('[data-contemplation-allow="true"]')) return;

      const href = anchor?.getAttribute('href') || anchor?.dataset.to || null;

      if (anchor && isAllowedTarget(href)) return;

      // Blocage
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toast.info('🔒 La V3 ouvre le 1ᵉʳ octobre 2026. Pour l\'instant, tu peux juste la contempler.', {
        duration: 3500,
        id: 'v3-contemplation',
      });
    };

    // Capture phase to beat React handlers
    document.addEventListener('click', handler, true);
    document.addEventListener('submit', handler as any, true);
    return () => {
      document.removeEventListener('click', handler, true);
      document.removeEventListener('submit', handler as any, true);
    };
  }, [locked]);

  return (
    <>
      {locked && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none"
          aria-hidden
        >
          <div className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-lg backdrop-blur"
               style={{
                 background: 'rgba(15,46,31,0.92)',
                 color: '#D4AF37',
                 border: '1px solid rgba(212,175,55,0.5)',
               }}>
            {isAdmin === true
              ? '👁️ Aperçu abonné (admin) · Ouverture le 1ᵉʳ octobre 2026'
              : '🔒 Mode contemplation · Ouverture le 1ᵉʳ octobre 2026'}
          </div>
        </div>
      )}
      {children}
    </>
  );
}
