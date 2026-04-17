import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Sparkles, Clock, PenTool, Palette, Mic, BarChart3, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORKFLOW_STEPS } from '@/components/ebook/workflow/workflowAgents';

import mockEditor from '@/assets/mockups/agent-editor.jpg';
import mockMarket from '@/assets/mockups/agent-market.jpg';
import mockArchitect from '@/assets/mockups/agent-architect.jpg';
import mockCover from '@/assets/mockups/agent-cover.jpg';
import mockAudio from '@/assets/mockups/agent-audio.jpg';
import mockKdp from '@/assets/mockups/agent-kdp.jpg';

// Mapping agent → mockup screenshot. Cycle pour couvrir les 15 agents.
const AGENT_MOCKUPS: Record<string, string> = {
  P1: mockEditor,
  P2: mockMarket,
  P3: mockArchitect,
  P4: mockEditor,
  P5: mockEditor,
  P6: mockKdp,
  P7: mockKdp,
  P8: mockKdp,
  P9: mockEditor,
  P10: mockArchitect,
  P11: mockKdp,
  P12: mockArchitect,
  P13: mockEditor,
  P14: mockKdp,
  P15: mockEditor,
};

const AGENT_TIME: Record<string, string> = {
  P1: '20s', P2: '45s', P3: '60s', P4: '8 min', P5: '2 min',
  P6: '90s', P7: '30s', P8: '40s', P9: '15s', P10: '50s',
  P11: '40s', P12: '60s', P13: '30s', P14: '20s', P15: '3 min',
};

// 5 piliers — pour grouper les agents et offrir un repère visuel
type PillarKey = 'pilier-ecrire' | 'pilier-visuels' | 'pilier-audio' | 'pilier-kdp' | 'pilier-marketing';
const PILLARS: Record<PillarKey, { label: string; icon: typeof PenTool; color: string; agents: string[] }> = {
  'pilier-ecrire':    { label: 'Écrire',    icon: PenTool,    color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30', agents: ['P1','P3','P4','P5','P9','P10','P13'] },
  'pilier-visuels':   { label: 'Visuels',   icon: Palette,    color: 'text-violet-600 bg-violet-500/10 border-violet-500/30',   agents: [] },
  'pilier-audio':     { label: 'Audio',     icon: Mic,        color: 'text-blue-600 bg-blue-500/10 border-blue-500/30',         agents: [] },
  'pilier-kdp':       { label: 'KDP',       icon: BarChart3,  color: 'text-kdp-orange bg-kdp-orange/10 border-kdp-orange/30',   agents: ['P2','P6','P7','P8','P11','P12','P14','P15'] },
  'pilier-marketing': { label: 'Marketing', icon: Megaphone,  color: 'text-rose-600 bg-rose-500/10 border-rose-500/30',         agents: [] },
};

const AgentsShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="outils" className="py-20 px-4 bg-secondary/40 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 mb-4">
            <Layers className="w-4 h-4 mr-2" />
            15 AGENTS IA — ÉCOSYSTÈME COMPLET
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Les 15 agents IA qui <span className="text-primary">rédigent votre ebook</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Chaque agent a un rôle précis et un écran dédié. Voici à quoi ressemble la plateforme — et ce que chaque agent produit.
          </p>
        </motion.div>

        {/* Ancres invisibles pour la nav par pilier */}
        <div id="pilier-ecrire" className="scroll-mt-32" />

        {/* Grid 15 agents avec mockup screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {WORKFLOW_STEPS.map((agent, i) => {
            const Icon = agent.icon;
            const isBonus = agent.id === 'P15';
            const mockup = AGENT_MOCKUPS[agent.id] ?? mockEditor;
            const time = AGENT_TIME[agent.id] ?? '60s';

            // Insérer ancres pilier au passage
            const isFirstKdp = agent.id === 'P2';

            return (
              <React.Fragment key={agent.id}>
                {isFirstKdp && <div id="pilier-kdp" className="scroll-mt-32 hidden" />}
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05 }}
                  className={`group relative bg-card rounded-2xl overflow-hidden border transition-all hover:-translate-y-1.5 hover:shadow-2xl ${
                    isBonus
                      ? 'border-kdp-orange/40 hover:border-kdp-orange shadow-kdp-orange/10'
                      : 'border-border hover:border-primary/40 hover:shadow-primary/15'
                  }`}
                >
                  {isBonus && (
                    <div className="absolute top-3 right-3 z-10 bg-kdp-orange text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      🎁 BONUS
                    </div>
                  )}

                  {/* Mockup screenshot */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
                    <img
                      src={mockup}
                      alt={`Mockup interface ${agent.name}`}
                      loading="lazy"
                      width={768}
                      height={576}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay icône agent */}
                    <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg ${
                      isBonus ? 'bg-kdp-orange/90' : 'bg-primary/90'
                    }`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    {/* Badge temps */}
                    <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur text-foreground text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                      <Clock className="w-3 h-3" />
                      {time}
                    </div>
                  </div>

                  {/* Texte */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        Agent {agent.id}
                      </Badge>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {agent.agentSubtitle}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </motion.article>
              </React.Fragment>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground mb-5">
            Tous les agents inclus dans l'accès à vie — <span className="text-primary font-bold">aucun coût additionnel</span>
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Débloquer les 15 agents — 67€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentsShowcase;
