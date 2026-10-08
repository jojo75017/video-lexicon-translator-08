import { Check, Lock } from 'lucide-react';
import { findPaidModuleForPath } from '@/data/v3ModuleAccess';
import useModuleAccess from '@/hooks/useModuleAccess';
import { V3_LIFETIME_OFFERS } from '@/data/v3Pricing';

/** Presentation only: reuse the same access check as the tool's paywall. */
export default function V3ModuleStatusBadge({ route, coverPro = false }: { route?: string; coverPro?: boolean }) {
  const module = route ? findPaidModuleForPath(route) : null;
  const { loading, hasAccess, reason } = useModuleAccess(coverPro ? 'cover_studio_pro' : module?.key);
  const paid = coverPro || !!module;
  const price = (coverPro ? V3_LIFETIME_OFFERS.cover.price : module?.price)?.toLocaleString('fr-FR');
  const label = !paid
    ? 'Inclus dans votre accès'
    : loading
      ? 'Vérification de votre accès…'
      : reason === 'admin'
        ? `Option payante · ${price} € · accès admin`
        : hasAccess
          ? reason === 'purchased' ? 'Déjà acheté · aucun paiement' : 'Inclus dans vos droits actuels'
          : `Option payante · ${price} € · paiement unique`;
  return (
    <span className="v3-module-status mt-3 inline-flex items-start gap-2 rounded-md border px-3 py-2 text-sm font-bold">
      {paid && (!hasAccess || reason === 'admin') ? <Lock className="mt-0.5 h-4 w-4 shrink-0" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" />}
      {label}
    </span>
  );
}