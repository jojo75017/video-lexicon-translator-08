/**
 * Bandeau d'état « génération d'images » du studio de couverture.
 *
 * Affiche en permanence : générations incluses restantes, ou clé OpenAI
 * personnelle active, ou invitation explicite à en ajouter une. Le coffre de
 * clé est accessible en un clic, sans quitter l'éditeur.
 *
 * Aucune modification du chiffrement, des droits ni de la logique de crédits :
 * tout passe par les fonctions serveur existantes.
 */
import { useState } from 'react';
import { KeyRound, Loader2, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CoverProKeyVault from '@/components/cover-studio-pro/CoverProKeyVault';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export default function CoverProAccessBar({ className }: Props) {
  const { hasAccess, credits, key, loading, refresh } = useCoverProAccess();
  const [open, setOpen] = useState(false);

  const noFunding = !loading && credits.remaining <= 0 && !key;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border p-3 text-sm',
        noFunding ? 'border-amber-300 bg-amber-50' : 'border-border bg-card',
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Vérification de votre accès…
        </span>
      ) : !hasAccess ? (
        <>
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            La génération d’illustration fait partie de Cover Studio KDP Pro. Les modèles, les
            textes et les exports restent utilisables.
          </span>
          <Button asChild size="sm" variant="outline" className="ml-auto">
            <a href="/v3/cover-pro">Débloquer</a>
          </Button>
        </>
      ) : (
        <>
          <Badge variant={credits.remaining > 0 ? 'default' : 'secondary'}>
            {credits.remaining} génération(s) incluse(s)
          </Badge>

          {key ? (
            <span className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> Clé OpenAI personnelle active
              <span className="font-mono text-xs text-muted-foreground">{key.mask}</span>
            </span>
          ) : credits.remaining > 0 ? (
            <span className="text-muted-foreground">
              Ajoutez votre clé OpenAI personnelle pour générer sans limite ensuite.
            </span>
          ) : (
            <span className="flex items-center gap-2 font-medium text-amber-800">
              <TriangleAlert className="h-4 w-4" />
              Générations incluses épuisées : ajoutez votre clé OpenAI personnelle pour continuer.
            </span>
          )}

          <Button
            size="sm"
            variant={noFunding ? 'default' : 'outline'}
            className="ml-auto gap-1"
            onClick={() => setOpen(true)}
          >
            <KeyRound className="h-4 w-4" />
            {key ? 'Gérer ma clé' : 'Ajouter ma clé OpenAI'}
          </Button>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Clé OpenAI personnelle</DialogTitle>
            <DialogDescription>
              Votre clé est vérifiée puis chiffrée sur nos serveurs. Elle n’est jamais enregistrée
              dans votre navigateur et jamais affichée en entier.
            </DialogDescription>
          </DialogHeader>
          <CoverProKeyVault keyInfo={key} onChanged={() => void refresh()} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
