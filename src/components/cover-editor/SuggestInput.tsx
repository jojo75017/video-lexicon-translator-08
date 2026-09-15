/**
 * Champ texte libre accompagné d'une liste déroulante de suggestions.
 *
 * 100 % interface : aucune donnée envoyée, aucune écriture en base. L'abonné
 * peut choisir une suggestion ou écrire sa propre valeur.
 */
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SuggestInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export default function SuggestInput({
  id,
  value,
  onChange,
  suggestions,
  placeholder,
}: SuggestInputProps) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = value.trim().toLocaleLowerCase('fr');
    if (!query) return suggestions;
    const matches = suggestions.filter((item) =>
      item.toLocaleLowerCase('fr').includes(query),
    );
    return matches.length > 0 ? matches : suggestions;
  }, [suggestions, value]);

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pr-10"
        autoComplete="off"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Voir des exemples"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-[#f47920]/10 hover:text-[#f47920]"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[280px] p-1">
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className={cn(
                  'block w-full rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-[#f47920]/10',
                  item === value && 'bg-[#f47920]/10 font-medium',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
