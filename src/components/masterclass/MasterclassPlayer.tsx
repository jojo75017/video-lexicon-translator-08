import React from 'react';
import MasterclassUnlockGate from './MasterclassUnlockGate';
import type { MasterclassModule } from '@/data/masterclassModules';

interface Props {
  module: MasterclassModule;
  locked: boolean;
  onUnlock: () => void;
}

const MasterclassPlayer: React.FC<Props> = ({ module, locked, onUnlock }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-border" style={{ aspectRatio: '16 / 9' }}>
      {!locked && (
        <iframe
          key={module.youtubeId}
          src={`https://www.youtube.com/embed/${module.youtubeId}?rel=0&modestbranding=1`}
          title={`Module ${module.id} — ${module.titre}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
      {locked && <MasterclassUnlockGate onUnlock={onUnlock} />}
    </div>
  );
};

export default MasterclassPlayer;
