/**
 * Panneau des calques graphiques : sélection, déplacement, taille, couleur,
 * opacité, masquage, verrouillage et suppression.
 *
 * 100 % local : aucun appel IA, aucun crédit, aucune écriture en base ici.
 */
import { ArrowDown, ArrowUp, Eye, EyeOff, Lock, LockOpen, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { FrontShapeLayer } from '@/lib/cover-editor/frontComposition';

const KIND_LABEL: Record<FrontShapeLayer['kind'], string> = {
  rect: 'Forme',
  diagonal: 'Diagonale',
  frame: 'Cadre',
  ornament: 'Ornement',
  photo: 'Photographie',
};

interface Props {
  shapes: FrontShapeLayer[];
  canvas: { width: number; height: number };
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPatch: (id: string, patch: Partial<FrontShapeLayer>, snapshot?: boolean) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}

export default function ShapeLayersPanel({
  shapes,
  canvas,
  selectedId,
  onSelect,
  onPatch,
  onRemove,
  onMove,
}: Props) {
  const selected = shapes.find((s) => s.id === selectedId) ?? null;

  if (!shapes.length) {
    return (
      <Card className="h-fit">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-foreground">Calques graphiques</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Appliquez un modèle de référence pour créer les calques (formes, cadres, ornements,
            bandeaux, photographie).
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardContent className="space-y-3 p-4">
        <p className="text-sm font-semibold text-foreground">Calques graphiques</p>

        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {shapes.map((shape, index) => (
            <div
              key={shape.id}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-2 py-1 text-xs',
                shape.id === selectedId ? 'border-primary bg-primary/5' : 'border-border',
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(shape.id)}
                className="flex-1 truncate text-left"
                title={`${KIND_LABEL[shape.kind]} — ${shape.name}`}
              >
                <span className="font-medium text-foreground">{shape.name}</span>
                <span className="ml-1 text-muted-foreground">({KIND_LABEL[shape.kind]})</span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title={shape.hidden ? 'Afficher' : 'Masquer'}
                onClick={() => onPatch(shape.id, { hidden: !shape.hidden })}
              >
                {shape.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title={shape.locked ? 'Déverrouiller' : 'Verrouiller'}
                onClick={() => onPatch(shape.id, { locked: !shape.locked })}
              >
                {shape.locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Monter"
                disabled={index === 0}
                onClick={() => onMove(shape.id, -1)}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Descendre"
                disabled={index === shapes.length - 1}
                onClick={() => onMove(shape.id, 1)}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                title="Supprimer"
                onClick={() => onRemove(shape.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="space-y-3 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-foreground">
              {selected.name} {selected.locked && '· verrouillé'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Horizontal</Label>
                <Input
                  type="number"
                  value={Math.round(selected.x)}
                  disabled={selected.locked}
                  onChange={(e) => onPatch(selected.id, { x: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vertical</Label>
                <Input
                  type="number"
                  value={Math.round(selected.y)}
                  disabled={selected.locked}
                  onChange={(e) => onPatch(selected.id, { y: Number(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Largeur</Label>
                <Input
                  type="number"
                  value={Math.round(selected.width)}
                  disabled={selected.locked}
                  onChange={(e) =>
                    onPatch(selected.id, {
                      width: Math.max(8, Math.min(canvas.width * 2, Number(e.target.value) || 8)),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hauteur</Label>
                <Input
                  type="number"
                  value={Math.round(selected.height)}
                  disabled={selected.locked}
                  onChange={(e) =>
                    onPatch(selected.id, {
                      height: Math.max(8, Math.min(canvas.height * 2, Number(e.target.value) || 8)),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Couleur</Label>
              <Input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(selected.color) ? selected.color : '#000000'}
                disabled={selected.locked}
                onChange={(e) => onPatch(selected.id, { color: e.target.value })}
                className="h-9 w-full p-1"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Opacité · {Math.round((selected.opacity ?? 1) * 100)} %</Label>
              <Slider
                value={[Math.round((selected.opacity ?? 1) * 100)]}
                min={0}
                max={100}
                step={1}
                disabled={selected.locked}
                onValueChange={([v]) => onPatch(selected.id, { opacity: v / 100 }, false)}
              />
            </div>

            {(selected.kind === 'frame' || selected.kind === 'ornament' || selected.kind === 'photo') && (
              <div className="space-y-1">
                <Label className="text-xs">Épaisseur du trait · {selected.strokeWidth ?? 0}</Label>
                <Slider
                  value={[selected.strokeWidth ?? 0]}
                  min={0}
                  max={Math.round(canvas.width * 0.02)}
                  step={1}
                  disabled={selected.locked}
                  onValueChange={([v]) => onPatch(selected.id, { strokeWidth: v }, false)}
                />
              </div>
            )}

            {(selected.kind === 'rect' || selected.kind === 'frame' || selected.kind === 'photo') && (
              <div className="space-y-1">
                <Label className="text-xs">Angles arrondis · {selected.radius ?? 0}</Label>
                <Slider
                  value={[selected.radius ?? 0]}
                  min={0}
                  max={Math.round(canvas.width * 0.1)}
                  step={1}
                  disabled={selected.locked}
                  onValueChange={([v]) => onPatch(selected.id, { radius: v }, false)}
                />
              </div>
            )}

            {selected.kind === 'frame' && (
              <div className="space-y-1">
                <Label className="text-xs">Écart du second cadre · {selected.gap ?? 0}</Label>
                <Slider
                  value={[selected.gap ?? 0]}
                  min={0}
                  max={Math.round(canvas.width * 0.06)}
                  step={1}
                  disabled={selected.locked}
                  onValueChange={([v]) => onPatch(selected.id, { gap: v, double: v > 0 }, false)}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
