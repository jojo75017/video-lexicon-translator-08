import React from 'react';
import { CheckCircle2, Lock, Play, GraduationCap } from 'lucide-react';
import { MASTERCLASS_MODULES, type MasterclassModule } from '@/data/masterclassModules';

interface Props {
  activeId: number;
  completed: number[];
  unlocked: boolean;
  onSelect: (m: MasterclassModule) => void;
}

const MasterclassSidebar: React.FC<Props> = ({ activeId, completed, unlocked, onSelect }) => {
  const total = MASTERCLASS_MODULES.length;
  const doneCount = completed.length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="flex flex-col h-full p-5 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-bold leading-tight text-foreground">EbookStudio Pro</p>
          <p className="text-xs text-muted-foreground">Masterclass · 5h</p>
        </div>
      </div>

      {/* Progression */}
      <div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-semibold text-foreground">
            {doneCount}/{total} · {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Modules */}
      <nav className="flex flex-col gap-2">
        {MASTERCLASS_MODULES.map((m) => {
          const isActive = m.id === activeId;
          const isDone = completed.includes(m.id);
          const isLocked = !m.isFree && !unlocked;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              className={`group flex items-start gap-3 rounded-xl p-3 text-left transition-all ${
                isActive ? 'bg-primary/15 ring-1 ring-primary/40' : 'hover:bg-muted/60'
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-accent" />
                )}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Module {m.id}
                  </span>
                  {m.isFree && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/15 rounded px-1.5 py-0.5">
                      Gratuit
                    </span>
                  )}
                </span>
                <span className="block text-sm font-medium text-foreground truncate">
                  {m.titre}
                </span>
                <span className="block text-xs text-muted-foreground">{m.duration}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MasterclassSidebar;
