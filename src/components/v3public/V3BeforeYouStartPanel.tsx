import { Link } from 'react-router-dom';
import { KeyRound, Gift, ArrowRight } from 'lucide-react';

/**
 * « Avant de commencer » — regroupe la clé Gemini et la migration V2,
 * qui occupaient chacune une bande colorée pleine largeur.
 */
export default function V3BeforeYouStartPanel() {
  const openKeyStudio = async () => {
    const url = 'https://aistudio.google.com/app/apikey';
    try {
      await navigator.clipboard.writeText(url);
      const { toast } = await import('sonner');
      toast.success('Lien copié. Collez-le dans un nouvel onglet si le clic ne fonctionne pas.', { duration: 7000 });
    } catch {}
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      const { toast } = await import('sonner');
      toast.info('Le nouvel onglet a été bloqué. Le lien est déjà copié : collez-le manuellement.', { duration: 9000 });
    }
  };

  return (
    <section className="v3-shell">
      <div className="v3-note">
        <h2
          className="v3-serif text-[19px] font-semibold"
          style={{ color: 'var(--v3-emerald)' }}
        >
          Avant de commencer
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Clé Gemini */}
          <div
            className="rounded-2xl border bg-white p-4"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <div className="flex items-start gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
              >
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  Branchez votre clé Gemini gratuite
                </p>
                <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
                  60 secondes, quota généreux offert par Google. Si le lien est bloqué par votre
                  navigateur, il est déjà copié : collez-le dans un nouvel onglet.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={openKeyStudio} className="v3-btn v3-btn-gold text-[12.5px]">
                Obtenir ma clé gratuite
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('v3-open-keys'))}
                className="text-[12.5px] font-semibold underline"
                style={{ color: 'var(--v3-emerald)' }}
              >
                Coller ma clé
              </button>
            </div>
          </div>

          {/* Migration V2 → V3 */}
          <div
            className="rounded-2xl border bg-white p-4"
            style={{ borderColor: 'var(--v3-line)' }}
          >
            <div className="flex items-start gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{ background: 'var(--v3-gold-soft)', color: '#6a4f10' }}
              >
                <Gift className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[14.5px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  Vous êtes abonné V2 ? Trois modules vous sont offerts
                </p>
                <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-muted)' }}>
                  Génie, Correcteur et Export Premium — et −20 % à vie sur les forfaits Plume et Édition.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/v3/migration"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold underline"
                style={{ color: 'var(--v3-emerald)' }}
              >
                Voir ma migration V3 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
