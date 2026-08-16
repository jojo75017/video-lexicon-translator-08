import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Gem, Sparkles } from 'lucide-react';
import {
  V3_ADDON_LIST,
  V3_ADDONS_TOTAL_VALUE,
  formatPrice,
  type V3Addon,
} from '@/data/v3Pricing';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import useV3Entitlement from '@/hooks/useV3Entitlement';

interface Props {
  /** Titre au-dessus des cartes (masqué si vide). */
  title?: string;
  /** Version compacte affichée sous un livre terminé. */
  compact?: boolean;
  className?: string;
}

/**
 * Cartes des compléments (upsells) — réutilisées sur la page /v3/upsells
 * et sous un livre terminé. Un complément déjà inclus dans le forfait
 * ouvre l'outil au lieu du paiement.
 */
export default function V3AddonCards({ title = 'Compléments & options', compact = false, className = '' }: Props) {
  const navigate = useNavigate();
  const { hasBase, hasFull } = useV3Entitlement();
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  // hasFull = formule tout inclus : aucun complément à acheter.
  const isIncluded = (addon: V3Addon) => hasFull || (hasBase && addon.inEdition);

  const open = (addon: V3Addon) => {
    if (isIncluded(addon)) {
      if (addon.to.startsWith('http')) window.open(addon.to, '_blank', 'noopener');
      else navigate(addon.to);
      return;
    }
    setCheckout({ priceId: addon.priceId, planName: addon.title });
  };

  return (
    <section className={className}>
      {title && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.24em]"
              style={{ color: 'var(--v3-gold-600)' }}
            >
              Options à la carte
            </p>
            <h2 className="v3-serif text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
              {title}
            </h2>
          </div>
          {!hasFull && (
            <Link
              to="/v3/forfaits"
              className="v3-btn v3-btn-outline text-[12.5px]"
              title="Tout est inclus dans Studio Pro"
            >
              <Gem className="h-4 w-4" /> Tout inclus dès Studio Pro
            </Link>
          )}
        </div>
      )}

      {!compact && (
        <div
          className="mb-5 rounded-2xl px-5 py-4"
          style={{ background: 'var(--v3-gold-soft)', border: '1px solid var(--v3-line)' }}
        >
          <p className="text-sm" style={{ color: 'var(--v3-ink)' }}>
            <strong>Valeur totale des compléments : {formatPrice(V3_ADDONS_TOTAL_VALUE)}.</strong>{' '}
            Le forfait Studio Pro (97 €/mois) les inclut tous — vous n'avez alors plus rien à acheter
            à l'unité.
          </p>
        </div>
      )}

      <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {V3_ADDON_LIST.map((addon) => {
          const included = isIncluded(addon);
          return (
            <article
              key={addon.key}
              className="flex flex-col rounded-2xl p-5"
              style={{
                background: 'var(--v3-surface, #fff)',
                border: '1px solid var(--v3-line)',
                boxShadow: 'var(--v3-shadow-card)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--v3-ink)' }}>
                  {addon.title}
                </h3>
                {included ? (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ background: 'var(--v3-emerald-50)', color: 'var(--v3-emerald-600)' }}
                  >
                    Inclus
                  </span>
                ) : (
                  <span className="shrink-0 text-lg font-bold" style={{ color: 'var(--v3-emerald-600)' }}>
                    {formatPrice(addon.price)}
                  </span>
                )}
              </div>

              <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
                {addon.description}
              </p>

              <button
                type="button"
                onClick={() => open(addon)}
                className={`mt-4 w-full justify-center ${included ? 'v3-btn v3-btn-outline' : 'v3-btn v3-btn-primary'}`}
              >
                {included ? (
                  <>
                    <Check className="h-4 w-4" /> Ouvrir l'outil
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Ajouter pour {formatPrice(addon.price)}
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>

      {checkout && (
        <V3SubscribeCheckout
          priceId={checkout.priceId}
          planName={checkout.planName}
          onClose={() => setCheckout(null)}
        />
      )}
    </section>
  );
}
