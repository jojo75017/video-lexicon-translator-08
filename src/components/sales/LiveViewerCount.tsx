import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export const LiveViewerCount: React.FC = () => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Simulated realistic viewer count between 8 and 24
    const base = 8 + Math.floor(Math.random() * 12);
    setViewers(base);

    const interval = setInterval(() => {
      setViewers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.max(5, Math.min(28, next));
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <Eye className="w-4 h-4" />
      <span><strong>{viewers}</strong> personnes regardent cette page</span>
    </div>
  );
};

export default LiveViewerCount;
