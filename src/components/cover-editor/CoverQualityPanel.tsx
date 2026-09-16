import { CheckCircle2, TriangleAlert } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { FrontComposition } from '@/lib/cover-editor/frontComposition';
import { cn } from '@/lib/utils';

interface Props {
  composition: FrontComposition;
  hasIllustration: boolean;
  /** Support visé : le contrôle des marges est plus strict en broché et en relié. */
  coverType?: 'ebook' | 'paperback' | 'hardcover';
  /** Dimensions réelles de l'illustration, si elles sont connues. */
  imageSize?: { width: number; height: number } | null;
  className?: string;
}

export default function CoverQualityPanel({
  composition,
  hasIllustration,
  coverType = 'ebook',
  imageSize = null,
  className,
}: Props) {
  const title = composition.layers.find((layer) => layer.role === 'title' && !layer.hidden);
  const author = composition.layers.find((layer) => layer.role === 'author' && !layer.hidden);
  const isPrint = coverType !== 'ebook';
  const margin = composition.canvas.width * (isPrint ? 0.06 : 0.04);
  const minPixels = isPrint ? 2550 : 1600;
  const issues = [
    imageSize && Math.min(imageSize.width, imageSize.height) < minPixels
      ? `L’illustration est un peu petite pour ce support (${imageSize.width} × ${imageSize.height} px). Régénérez-la pour une impression nette.`
      : null,
    !hasIllustration ? 'Ajoutez une illustration avant le téléchargement.' : null,
    !title?.text.trim() ? 'Le titre du livre est manquant.' : null,
    title && title.fontSize < composition.canvas.width * 0.055 ? 'Le titre risque d’être trop petit en miniature Amazon.' : null,
    title && (title.x < margin || title.x + title.width > composition.canvas.width - margin) ? 'Le titre est trop proche d’un bord.' : null,
    !author?.text.trim() ? 'Le nom d’auteur est manquant.' : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <Card className={cn(issues.length ? 'border-amber-500/40' : 'border-emerald-500/40', className)}>
      <CardContent className="space-y-2 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {issues.length ? <TriangleAlert className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          Vérifier ma couverture
        </p>
        {issues.length ? issues.map((issue) => <p key={issue} className="text-xs text-muted-foreground">• {issue}</p>) : (
          <p className="text-xs text-muted-foreground">Titre, auteur, illustration et marges principales sont prêts pour l’export.</p>
        )}
        <p className="text-xs text-muted-foreground">Regardez aussi la couverture en petite taille : le sujet et le titre doivent rester immédiatement reconnaissables.</p>
        {isPrint && (
          <p className="text-xs text-muted-foreground">
            Support imprimé : gardez le titre à distance des bords, la découpe et le pli mangent
            quelques millimètres.
          </p>
        )}
      </CardContent>
    </Card>
  );
}