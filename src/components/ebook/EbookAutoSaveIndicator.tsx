import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, Loader2, Cloud } from 'lucide-react';

interface Props {
  data: any;
  storageKey: string;
  intervalMs?: number;
}

export const EbookAutoSaveIndicator: React.FC<Props> = ({ data, storageKey, intervalMs = 30000 }) => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const dataRef = useRef(data);
  const prevDataRef = useRef<string>('');

  dataRef.current = data;

  const save = useCallback(() => {
    const serialized = JSON.stringify(dataRef.current);
    if (serialized === prevDataRef.current) return; // No changes
    
    setStatus('saving');
    try {
      localStorage.setItem(storageKey, serialized);
      prevDataRef.current = serialized;
      setLastSaved(new Date());
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('idle');
    }
  }, [storageKey]);

  useEffect(() => {
    const interval = setInterval(save, intervalMs);
    return () => clearInterval(interval);
  }, [save, intervalMs]);

  const timeAgo = lastSaved
    ? `${Math.round((Date.now() - lastSaved.getTime()) / 1000)}s`
    : null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {status === 'saving' && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Sauvegarde...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-green-600">Sauvegardé ✓</span>
        </>
      )}
      {status === 'idle' && lastSaved && (
        <>
          <Cloud className="h-3 w-3" />
          <span>Sauvé il y a {timeAgo}</span>
        </>
      )}
      {status === 'idle' && !lastSaved && (
        <>
          <Cloud className="h-3 w-3" />
          <span>Auto-save activé</span>
        </>
      )}
    </div>
  );
};

export default EbookAutoSaveIndicator;
