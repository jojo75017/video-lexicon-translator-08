import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import MasterclassSidebar from '@/components/masterclass/MasterclassSidebar';
import MasterclassPlayer from '@/components/masterclass/MasterclassPlayer';
import MasterclassTabs from '@/components/masterclass/MasterclassTabs';
import MasterclassOfferPopup from '@/components/masterclass/MasterclassOfferPopup';
import MasterclassIntro from '@/components/masterclass/MasterclassIntro';
import {
  MASTERCLASS_MODULES,
  MASTERCLASS_CTA_URL,
  type MasterclassModule,
} from '@/data/masterclassModules';

const UNLOCK_KEY = 'masterclass-unlocked';
const PROGRESS_KEY = 'masterclass-progress';

const MasterclassPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeId, setActiveId] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [view, setView] = useState<'intro' | 'player'>('intro');

  useEffect(() => {
    try {
      const isUnlocked = localStorage.getItem(UNLOCK_KEY) === '1';
      setUnlocked(isUnlocked);
      const raw = localStorage.getItem(PROGRESS_KEY);
      const hasProgress = !!raw && JSON.parse(raw)?.length > 0;
      if (raw) setCompleted(JSON.parse(raw));
      // Visiteur déjà engagé → direct sur le lecteur, sinon intro
      if (isUnlocked || hasProgress) setView('player');
    } catch {
      /* ignore */
    }
  }, []);

  const handleStart = () => {
    setActiveId(1);
    setView('player');
  };

  const activeModule = useMemo(
    () => MASTERCLASS_MODULES.find((m) => m.id === activeId) ?? MASTERCLASS_MODULES[0],
    [activeId],
  );

  const locked = !activeModule.isFree && !unlocked;

  const handleUnlock = () => {
    setUnlocked(true);
    try {
      localStorage.setItem(UNLOCK_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const handleSelect = (m: MasterclassModule) => {
    setActiveId(m.id);
    setSheetOpen(false);
  };

  const markComplete = () => {
    const next = Array.from(new Set([...completed, activeModule.id]));
    setCompleted(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (next.length === MASTERCLASS_MODULES.length) {
      setPopupOpen(true);
    } else {
      const nextModule = MASTERCLASS_MODULES.find((m) => m.id === activeModule.id + 1);
      if (nextModule) setActiveId(nextModule.id);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Masterclass EbookStudio Pro V2 — Créer & vendre un ebook</title>
        <meta
          name="description"
          content="Masterclass gratuite de 5h pour créer, designer et vendre un ebook rentable sur Amazon KDP avec EbookStudio Pro V2. Module 1 offert."
        />
        <link rel="canonical" href="https://ebookstudio.fr/masterclass" />
      </Helmet>

      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-[300px] shrink-0 border-r border-border bg-card/40">
          <div className="sticky top-0">
            <MasterclassSidebar
              activeId={activeId}
              completed={completed}
              unlocked={unlocked}
              onSelect={handleSelect}
            />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden flex items-center justify-between border-b border-border px-4 py-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="w-4 h-4" /> Modules
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-card">
                <MasterclassSidebar
                  activeId={activeId}
                  completed={completed}
                  unlocked={unlocked}
                  onSelect={handleSelect}
                />
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold">Masterclass</span>
          </header>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                Module {activeModule.id} · {activeModule.duration}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">{activeModule.titre}</h1>
            </div>

            <MasterclassPlayer module={activeModule} locked={locked} onUnlock={handleUnlock} />

            {!locked && (
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={markComplete} variant="secondary" className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {completed.includes(activeModule.id)
                    ? 'Module terminé'
                    : 'Marquer comme terminé'}
                </Button>
                {activeModule.id < MASTERCLASS_MODULES.length && (
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => setActiveId(activeModule.id + 1)}
                  >
                    Module suivant <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {!locked && <MasterclassTabs module={activeModule} />}

            {/* CTA persistant */}
            <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 to-transparent p-6">
              <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                <Flame className="w-5 h-5" /> Offre Spéciale
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Prêt à passer à l'action ? Accédez à l'outil complet EbookStudio Pro pour créer et
                publier votre ebook.
              </p>
              <Button
                asChild
                size="lg"
                className="font-bold bg-gradient-to-r from-[#FF9E2D] to-[#e8492b] hover:opacity-90 animate-pulse text-white border-0"
              >
                <a href={MASTERCLASS_CTA_URL} target="_blank" rel="noopener noreferrer">
                  🔥 Découvrir l'offre complète
                </a>
              </Button>
            </div>
          </div>
        </main>
      </div>

      <MasterclassOfferPopup open={popupOpen} onOpenChange={setPopupOpen} />
    </div>
  );
};

export default MasterclassPage;
