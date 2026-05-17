import React from 'react';
import { WritingAmbiance } from '@/data/writingAmbiances';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmbianceCardProps {
  ambiance: WritingAmbiance;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const AmbianceCard: React.FC<AmbianceCardProps> = ({ ambiance, selected, onSelect }) => {
  const { palette, fonts, name, tagline } = ambiance;

  return (
    <button
      type="button"
      onClick={() => onSelect(ambiance.id)}
      className={cn(
        'group relative w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-xl',
        selected
          ? 'border-[#008296] shadow-lg ring-2 ring-[#008296]/30'
          : 'border-transparent hover:border-[#008296]/30 shadow-sm'
      )}
      aria-pressed={selected}
    >
      {/* Bandeau d'en-tête style "Themes" */}
      <div
        className="flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold"
        style={{ background: palette.headerBg, color: palette.headerText }}
      >
        <span>Ambiance</span>
        <span className="opacity-70">{ambiance.category}</span>
      </div>

      {/* Zone principale - aperçu typo + couleur */}
      <div
        className="px-5 py-8 flex flex-col items-center justify-center min-h-[140px]"
        style={{ background: palette.bg, color: palette.text }}
      >
        <span
          className="text-3xl md:text-4xl leading-tight"
          style={{ fontFamily: `'${fonts.headingFamily}', serif`, color: palette.accent }}
        >
          {name}
        </span>
      </div>

      {/* Pied - tagline */}
      <div
        className="px-3 py-2 text-[11px] text-center font-medium border-t"
        style={{
          background: palette.surfaceAlt,
          color: palette.textMuted,
          borderColor: palette.surfaceAlt,
        }}
      >
        {tagline}
      </div>

      {selected && (
        <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-[#008296] text-white flex items-center justify-center shadow-md">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
};
