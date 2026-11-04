import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function V3ToolSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="v3-tool-search h-9 shrink-0 gap-2 text-xs" aria-label="Rechercher un outil" title="Rechercher un outil">
          <Search className="h-4 w-4" aria-hidden="true" /> Rechercher
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <form className="flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          const term = query.trim();
          setOpen(false);
          navigate(`/v3/outils${term ? `?q=${encodeURIComponent(term)}` : ''}`);
        }}>
          <Input autoFocus aria-label="Nom de l’outil" placeholder="Rechercher un outil…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Button type="submit" size="icon" aria-label="Lancer la recherche" title="Lancer la recherche"><Search className="h-4 w-4" /></Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}