import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Rocket, Bot, Sparkles } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';
import V3QuickActionsBar from '@/components/v3public/V3QuickActionsBar';
import V3ResumeBookCard from '@/components/v3public/V3ResumeBookCard';
import V3GenieOutlinePanel from '@/components/v3public/V3GenieOutlinePanel';
import V3KeyHint from '@/components/v3public/V3KeyHint';
import V3PipelinePanel from '@/components/v3public/V3PipelinePanel';

const V3CreateWizard = lazy(() => import('@/components/v3public/V3CreateWizard'));

/**
 * « Lancer mon livre » — le parcours direct, dans l'esprit de la V2 (formulaire
 * + workflow 15 agents), mais en mieux : aperçu du livre à côté, reprise,
 * chapitres de 2 500 mots, correction professionnelle et export KDP.
 * Aucun dialogue Génie, aucune biographie ici : on remplit, on lance.
 */
export default function V3LaunchBookPage() {
  return (
    <section className="v3-halo-soft min-h-[calc(100vh-4rem)] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackButton />
          <V3QuickActionsBar />
        </div>

        <div className="mt-6 text-center">
          <span className="v3-chip v3-chip-gold">
            <Rocket className="w-3.5 h-3.5" /> Lancer mon livre
          </span>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 leading-tight" style={{ color: 'var(--v3-ink)' }}>
            Remplissez votre fiche, les 15 agents écrivent
          </h1>
          <p className="mt-3 text-sm md:text-base max-w-3xl mx-auto" style={{ color: 'var(--v3-muted)' }}>
            Le parcours direct, comme sur la V2 — mais en mieux : sommaire généré et modifiable,
            chapitres longs (2&nbsp;500 à 3&nbsp;500 mots), aperçu du livre à côté, correction
            professionnelle en 4 passes, métadonnées KDP et export Word/PDF/EPUB.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/v3/workflow" className="v3-btn v3-btn-outline text-xs">
              <Bot className="w-3.5 h-3.5" /> Voir les 15 agents
            </Link>
            <Link to="/v3/create" className="v3-btn v3-btn-ghost text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Je préfère dialoguer avec le Génie
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <V3ResumeBookCard />
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_360px] items-start">
          <div className="min-w-0 v3-ambiance">
            <div className="v3-card">
              <Suspense fallback={<div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>}>
                <V3CreateWizard />
              </Suspense>
            </div>

            <div className="mt-4">
              <V3KeyHint />
            </div>

            <div className="mt-4">
              <V3PipelinePanel />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <V3GenieOutlinePanel />
          </aside>
        </div>
      </div>
    </section>
  );
}
