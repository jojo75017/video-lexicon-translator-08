import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookMarked } from 'lucide-react';
import { useKdpFormat } from '@/hooks/useKdpFormat';
import { KDP_FORMAT_OPTIONS, getWordsPerPage } from '@/utils/kdpPageDensity';

interface KdpFormatSelectProps {
  className?: string;
  compact?: boolean;
}

/**
 * Sélecteur de format KDP partagé : pilote la densité mots/page utilisée
 * pour toutes les estimations de pages affichées dans l'app.
 */
export const KdpFormatSelect: React.FC<KdpFormatSelectProps> = ({ className, compact }) => {
  const { formatId, setFormatId } = useKdpFormat();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <BookMarked className="h-4 w-4 text-primary shrink-0" />
      {!compact && <span className="text-sm text-muted-foreground">Format KDP :</span>}
      <Select value={formatId} onValueChange={(v) => setFormatId(v as typeof formatId)}>
        <SelectTrigger className="h-8 w-[230px] text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {KDP_FORMAT_OPTIONS.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label} — ~{getWordsPerPage(o.id)} mots/page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default KdpFormatSelect;
