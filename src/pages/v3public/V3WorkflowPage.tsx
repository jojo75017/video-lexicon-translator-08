import { Link } from 'react-router-dom';
import BackButton from '@/components/v3/BackButton';
import { Badge } from '@/components/ui/badge';
import { Bot, Rocket, Sparkles, ListTree } from 'lucide-react';
import V3AgentsGrid from '@/components/v3public/V3AgentsGrid';
import V3PipelinePanel from '@/components/v3public/V3PipelinePanel';

/**
 * « Workflow 15 Agents » — l'écran V3 qui montre le pipeline professionnel
 * P1 → P15 : qui travaille, où on en est, et comment lancer/reprendre son livre.
 */
export default function V3WorkflowPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <BackButton to="/v3" />

        <header className="mb-6">
          <Badge className="mb-3 bg-[#008296]">🤖 Pipeline éditorial</Badge>
          <h1 className="flex items-center gap-2 text-3xl font-bold leading-tight text-[#232F3E] md:text-4xl">
            <Bot className="h-8 w-8" style={{ color: '#0d7a5f' }} />
            Workflow 15 Agents — écrire mon livre
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Votre livre n’est pas produit par un seul robot. Quinze agents spécialisés se
            relaient&nbsp;: niche, structure, rédaction, humanisation, correction,
            métadonnées KDP, verdict final. Vous suivez l’avancement agent par agent
            et vous pouvez reprendre à tout moment là où vous vous êtes arrêté.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/v3/create"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ background: '#0d7a5f' }}
            >
              <Rocket className="h-4 w-4" /> Lancer mon livre
            </Link>
            <Link
              to="/ebook-planner"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'rgba(201,168,76,0.6)', color: '#8a6d1f' }}
            >
              <ListTree className="h-4 w-4" /> Ouvrir le pilotage détaillé P1 → P15
            </Link>
          </div>
        </header>

        <div className="grid gap-4">
          <V3AgentsGrid />

          <div
            className="rounded-[22px] border p-4 md:p-5"
            style={{ borderColor: 'var(--v3-border)', background: '#fff' }}
          >
            <h2 className="text-sm font-bold" style={{ color: 'var(--v3-ink)' }}>
              Deux chemins, choisissez le vôtre
            </h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Link
                to="/v3/create"
                className="rounded-2xl border p-3 transition hover:shadow-sm"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  <Sparkles className="h-4 w-4" style={{ color: '#8a6d1f' }} /> Je discute avec le Génie
                </div>
                <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                  Le sommaire se construit avec vous, chapitre par chapitre, puis la rédaction suit.
                </p>
              </Link>
              <Link
                to="/ebook-planner"
                className="rounded-2xl border p-3 transition hover:shadow-sm"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--v3-ink)' }}>
                  <Bot className="h-4 w-4" style={{ color: '#0d7a5f' }} /> Je laisse les 15 agents faire
                </div>
                <p className="mt-1 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
                  Niche → livre → correction → métadonnées KDP → couverture, en enchaînant les agents.
                </p>
              </Link>
            </div>
          </div>

          <V3PipelinePanel />
        </div>
      </div>
    </div>
  );
}
