import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock } from 'lucide-react';
import AgentAvatar from '@/components/v3public/AgentAvatar';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import { getUpsellFigure, type UpsellFigure } from '@/data/v3UpsellFigures';


export interface V3UpsellPromoCardProps {
  /** Clé d'addon (V3_ADDON_LIST) ou id de pack roadmap — pour la figure. */
  figureId: string;
  title: string;
  price: number;
  description: string;
  /** Route où l'abonné utilise le complément. */
  to: string;
  /** Identifiant de prix Stripe (paiement unique) — si absent, la carte renvoie vers `to`. */
  priceId?: string;
  badge?: string;
  /** Inclus d'office dans le forfait courant ? */
  included?: boolean;
  className?: string;
}

/**
 * Encart upsell personnifié : figure + prénom, phrase pédagogique d'une ligne,
 * titre du pack, prix, badge et CTA « Débloquer » (tunnel de paiement) ou
 * « Ouvrir » si déjà acquis. Réutilisable partout dans le parcours abonné.
 *
 * Les prénoms illustrent des cas d'usage pédagogiques (« Comme Étienne… »),
 * jamais de faux témoignages clients.
 */
export default function V3UpsellPromoCard({
  figureId,
  title,
  price,
  description,
  to,
  priceId,
  badge,
  included = false,
  className = '',
}: V3UpsellPromoCardProps) {
  const navigate = useNavigate();
  const { hasFull } = useV3Entitlement();
  const [checkout, setCheckout] = useState(false);

  const fig: UpsellFigure = getUpsellFigure(figureId);

  // Studio Pro = tout inclus : on affiche « Ouvrir ».
  const isIncluded = included || hasFull;

  const handleOpen = () => {
    if (isIncluded) {
      if (to.startsWith('http')) window.open(to, '_blank', 'noopener');
      else navigate(to);
      return;
    }
    if (priceId) {
      setCheckout(true);
      return;
    }
    // Pack roadmap (pas d'achat unitaire) → page forfaits.
    navigate(to || '/v3/forfaits');
  };

  return (
    <article
      className={`flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-lg ${className}`}
      style={{
        background: 'var(--v3-surface, #fff)',
        border: `1px solid ${fig.accent}33`,
        boxShadow: '0 2px 12px -8px rgba(0,0,0,0.18)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${fig.accent}15` }}
        >
          <AgentAvatar seed={figureId} accent={fig.accent} size={40} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[15px] font-bold leading-tight" style={{ color: 'var(--v3-ink)' }}>
              {title}
            </h3>
            {badge && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: `${fig.accent}1a`, color: fig.accent }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] font-medium" style={{ color: fig.accent }}>
            {fig.prenom}
          </p>
        </div>
      </div>

      <p className="mt-3 flex-1 text-[13px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
        {description}
      </p>

      <p className="mt-3 rounded-lg px-3 py-2 text-[12px] italic leading-snug"
        style={{ background: `${fig.accent}0d`, color: 'var(--v3-ink)' }}>
        « {fig.phrase} »
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isIncluded ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--v3-emerald-50, #e8f7ef)', color: 'var(--v3-emerald-600, #0b6e4c)' }}
          >
            <Check className="h-3.5 w-3.5" /> Inclus
          </span>
        ) : (
          <span className="text-lg font-bold" style={{ color: fig.accent }}>
            {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
        )}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: isIncluded ? 'var(--v3-emerald-600, #0b6e4c)' : fig.accent }}
        >
          {isIncluded ? (
            <>Ouvrir <ArrowRight className="h-3.5 w-3.5" /></>
          ) : (
            <><Lock className="h-3.5 w-3.5" /> Débloquer</>
          )}
        </button>
      </div>

      {checkout && priceId && (
        <V3SubscribeCheckout
          priceId={priceId}
          planName={title}
          onClose={() => setCheckout(false)}
          returnUrl={`${window.location.origin}/v3/offres/merci?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(title)}`}
        />
      )}
    </article>
  );
}

