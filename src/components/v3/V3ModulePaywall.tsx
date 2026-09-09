import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, Lock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { V3_UPSELL_PACKS } from '@/data/roadmapV3';
import { findPaidModuleForPath, V3_PAID_MODULE_BY_KEY, type V3PaidModule } from '@/data/v3ModuleAccess';
import useModuleAccess from '@/hooks/useModuleAccess';
import V3UpsellCheckout from '@/components/admin/V3UpsellCheckout';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';

/**
 * Verrou d'un complément payant : l'outil reste visible mais grisé et
 * inutilisable, avec un encart d'achat qui ouvre réellement le paiement.
 *
 * Le module est déduit de la route courante (`v3ModuleAccess`), ou forcé
 * via la propriété `moduleKey`.
 */
export function V3ModulePaywall({
  children,
  moduleKey,
}: {
  children: ReactNode;
  moduleKey?: string;
}) {
  const location = useLocation();
  const mod: V3PaidModule | null = moduleKey
    ? V3_PAID_MODULE_BY_KEY[moduleKey] ?? null
    : findPaidModuleForPath(location.pathname);
  const { loading, hasAccess } = useModuleAccess(mod?.key ?? null);
  const [checkout, setCheckout] = useState<'pack' | 'price' | null>(null);

  if (!mod) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }

  if (hasAccess) return <>{children}</>;

  const pack = mod.packId ? V3_UPSELL_PACKS.find((p) => p.id === mod.packId) ?? null : null;
  const price = mod.price.toLocaleString('fr-FR');

  return (
    <div className="relative">
      {/* Aperçu réel de l'outil, grisé et totalement inactif */}
      <div
        aria-hidden
        className="pointer-events-none select-none"
        style={{ filter: 'grayscale(1) blur(1.5px)', opacity: 0.35 }}
        tabIndex={-1}
      >
        {children}
      </div>

      {/* Encart d'achat */}
      <div className="absolute inset-0 flex items-start justify-center px-4 py-10">
        <div
          className="w-full max-w-xl rounded-2xl p-6 shadow-xl"
          style={{ background: 'var(--v3-surface, #fff)', border: '1px solid var(--v3-line, #E7E1D8)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'var(--v3-gold-50, #FDF6E7)', color: 'var(--v3-gold-600, #B4841F)' }}
            >
              <Lock className="h-3 w-3" /> Complément
            </span>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--v3-muted)' }}>
              paiement unique · sans abonnement
            </span>
          </div>

          <h2 className="v3-serif mt-3 text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
            {mod.title}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
            {mod.pitch}
          </p>

          <p className="mt-4 text-3xl font-bold" style={{ color: 'var(--v3-gold-600, #B4841F)' }}>
            {price} €
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCheckout(pack ? 'pack' : 'price')}
              disabled={!pack && !mod.priceId}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--v3-gold-600, #B4841F)' }}
            >
              <ShoppingBag className="h-4 w-4" /> Débloquer — {price} €
            </button>
            <Link
              to="/v3/upsells"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
              style={{ border: '1px solid var(--v3-line, #E7E1D8)', color: 'var(--v3-ink)' }}
            >
              <ArrowLeft className="h-4 w-4" /> Tous les compléments
            </Link>
          </div>

          <p className="mt-4 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
            Déjà inclus dans le forfait Édition. <Link to="/v3/forfaits" className="underline">Voir les forfaits</Link>
          </p>
        </div>
      </div>

      {checkout === 'pack' && pack && (
        <V3UpsellCheckout pack={pack} onClose={() => setCheckout(null)} autoStart />
      )}
      {checkout === 'price' && mod.priceId && (
        <V3SubscribeCheckout
          priceId={mod.priceId}
          planName={mod.title}
          onClose={() => setCheckout(null)}
          returnUrl={`${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`}
        />
      )}
    </div>
  );
}

export default V3ModulePaywall;
