import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { WrapTextElement } from '@/lib/cover-editor/wrapComposition';

export default function WrapTextToolbar({ element, onChange }: {
  element: WrapTextElement;
  onChange: (patch: Partial<WrapTextElement>) => void;
}) {
  const controls = [
    { label: 'Gras', Icon: Bold, active: element.bold, patch: { bold: !element.bold } },
    { label: 'Italique', Icon: Italic, active: element.italic, patch: { italic: !element.italic } },
    { label: 'Souligner', Icon: Underline, active: element.underline, patch: { underline: !element.underline } },
    ...(['left', 'center', 'right', 'justify'] as const).map((align, index) => ({
      label: ['Aligner à gauche', 'Centrer le texte', 'Aligner à droite', 'Justifier'][index],
      Icon: [AlignLeft, AlignCenter, AlignRight, AlignJustify][index],
      active: element.align === align,
      patch: { align },
    })),
  ];
  return <TooltipProvider><div role="toolbar" aria-label={`Mise en forme · ${element.role}`} className="flex flex-wrap gap-1">
    {controls.map(({ label, Icon, active, patch }) => <Tooltip key={label}>
      <TooltipTrigger asChild><Button type="button" size="icon" className="h-8 w-8" variant={active ? 'default' : 'outline'} aria-label={label} aria-pressed={Boolean(active)} onClick={() => onChange(patch)}><Icon className="h-4 w-4" /></Button></TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>)}
  </div></TooltipProvider>;
}