import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, ShoppingBag } from 'lucide-react';
import AgentAvatar from '@/components/v3public/AgentAvatar';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import useV3Entitlement from '@/hooks/useV3Entitlement';
import { getUpsellFigure, type UpsellFigure } from '@/data/v3UpsellFigures';
import V3UpsellCheckout from '@/components/admin/V3UpsellCheckout';
import type { V3UpsellPack, V3PackId } from '@/data/roadmapV3';


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
  /** Identifiant du pack pour le tunnel d'achat unitaire dédié. */
  packId?: V3PackId;
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
  packId,
  badge,
  included = false,
  className = '',
}: V3UpsellPromoCardProps) {
  const navigate = useNavigate();
  const { hasFull } = useV3Entitlement();
  const [checkout, setCheckout] = useState(false);
  const packForCheckout: V3UpsellPack | null = packId ? {
    id: packId,
    title,
    desc: description,
    price,
    priceId: priceId ?? `v3_pack_${packId}_once`,
    to,
    modules: [],
    badge,
  } : null;

  const fig: UpsellFigure = getUpsellFigure(figureId);

  /** Ajoute le marqueur de retour vers /v3/upsells sur la route de destination. */
  const withReturn = (path: string) =>
    path.startsWith('http') ? path : `${path}${path.includes('?') ? '&' : '?'}from=upsells`;

  // Forfait Édition = tout inclus : on affiche « Ouvrir ».
  const isIncluded = included || hasFull;

  const handleOpen = () => {
    if (isIncluded) {
      if (to.startsWith('http')) window.open(to, '_blank', 'noopener');
      else navigate(withReturn(to));
      return;
    }
    if (priceId || packId) {
      setCheckout(true);
      return;
    }
    // Pas d'achat unitaire configuré → on ouvre au moins le bon outil.
    navigate(withReturn(to || '/v3/forfaits'));
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

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <span className="block text-lg font-bold" style={{ color: fig.accent }}>
            {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
          <span className="block text-[10px] font-medium" style={{ color: 'var(--v3-muted)' }}>
            paiement unique · sans abonnement
          </span>
          {isIncluded && (
          <span
            className="mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--v3-emerald-50, #e8f7ef)', color: 'var(--v3-emerald-600, #0b6e4c)' }}
          >
            <Check className="h-3.5 w-3.5" /> Inclus · valeur {price.toLocaleString('fr-FR')} €
          </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: isIncluded ? 'var(--v3-emerald-600, #0b6e4c)' : fig.accent }}
        >
          {isIncluded ? (
            <>Ouvrir <ArrowRight className="h-3.5 w-3.5" /></>
          ) : (
            <><Lock className="h-3.5 w-3.5" /> Acheter {price.toLocaleString('fr-FR')} €</>
          )}
        </button>
      </div>

      {isIncluded && (priceId || packId) && (
        <button
          type="button"
          onClick={() => setCheckout(true)}
          className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold underline"
          style={{ color: fig.accent }}
        >
          <ShoppingBag className="h-3 w-3" /> Acheter séparément / offrir — {price.toLocaleString('fr-FR')} €
        </button>
      )}

      {checkout && priceId && !packId && (
        <V3SubscribeCheckout
          priceId={priceId}
          planName={title}
          onClose={() => setCheckout(false)}
          returnUrl={`${window.location.origin}/v3/offres/merci?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(title)}`}
        />
      )}
      {checkout && packForCheckout && (
        <V3UpsellCheckout pack={packForCheckout} onClose={() => setCheckout(false)} />
      )}
    </article>
  );
}

