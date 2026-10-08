import { Check, Lock } from 'lucide-react';
import { findPaidModuleForPath } from '@/data/v3ModuleAccess';
import useModuleAccess from '@/hooks/useModuleAccess';

/** Presentation only: reuse the same access check as the tool's paywall. */
export default function V3ModuleStatusBadge({ route }: { route?: string }) {
  const module = route ? findPaidModuleForPath(route) : null;
  const { loading, hasAccess, reason } = useModuleAccess(module?.key);
  const price = module?.price.toLocaleString('fr-FR');
  const label = !module
    ? 'Inclus · couverture standard et outils de base'
    : loading
      ? 'Vérification de votre accès…'
      : reason === 'admin'
        ? `Option payante · ${price} € · accès admin`
        : hasAccess
          ? reason === 'purchased' ? 'Déjà acheté · aucun paiement' : 'Inclus dans vos droits actuels'
          : `Option payante · ${price} € · paiement unique`;
  return (
    <span className="mt-3 inline-flex items-start gap-1.5 rounded-md border border-border bg-muted px-2 py-1.5 text-xs font-semibold text-foreground">
      {module && (!hasAccess || reason === 'admin') ? <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
      {module ? label : 'Inclus dans votre accès'}
    </span>
  );
}