import React, { useState } from 'react';
import { ShieldCheck, CalendarClock, AlertTriangle, RefreshCw, Infinity as InfinityIcon } from 'lucide-react';
import V3PackCheckout from './V3PackCheckout';
import { V3_FULL_PACK } from '@/data/roadmapV3';

const GOLD = '#c9a84c';

/**
 * Module « Paiement Échelonné Sécurisé ».
 * Présente les facilités (1× / 4×129€ / 6×85€) gérées par abonnement Stripe à
 * durée limitée, explique le mécanisme de coupure d'accès et ouvre le tunnel
 * de paiement existant (v3-pack-checkout).
 */
const InstallmentPayments: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <V3PackCheckout open={open} onClose={() => setOpen(false)} product="full" />

      <p className="text-sm text-joy-ink/70">
        Le <strong>{V3_FULL_PACK.title}</strong> est payable en plusieurs fois. Chaque échéancier est géré
        par un abonnement Stripe à durée limitée : dès qu'une échéance est honorée, l'accès reste actif ;
        en cas d'échec, le mécanisme de coupure protège ton chiffre d'affaires.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {V3_FULL_PACK.installments.map((opt) => (
          <div key={opt} className="rounded-xl border p-4 text-center">
            <div className="text-xl font-black" style={{ color: GOLD }}>{opt}</div>
            <div className="text-xs text-joy-ink/50 mt-1">
              {opt.startsWith('1') ? 'Le plus économique' : 'Échéancier mensuel'}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl py-3 font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: GOLD }}
      >
        Choisir mes mensualités →
      </button>

      <div className="rounded-xl border p-4 space-y-3 bg-muted/40">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: GOLD }} />
          <p className="text-sm"><strong>Sécurisé par abonnement Stripe</strong> à durée limitée : chaque échéance est un prélèvement détecté automatiquement (réussi ou échoué).</p>
        </div>
        <div className="flex gap-3">
          <CalendarClock className="h-5 w-5 shrink-0" style={{ color: GOLD }} />
          <p className="text-sm">Relances email automatiques (Resend) à chaque paiement échoué.</p>
        </div>
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm"><strong>Coupure automatique 3 jours</strong> après un échec : le statut passe en <code>suspended</code> et l'accès est bloqué.</p>
        </div>
        <div className="flex gap-3">
          <RefreshCw className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm"><strong>Réactivation automatique</strong> dès régularisation du paiement.</p>
        </div>
        <div className="flex gap-3">
          <InfinityIcon className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm">Bascule en <strong>accès à vie</strong> une fois toutes les échéances payées.</p>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPayments;
