import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Layers, Sparkles, Clock,
  PenTool, Palette, Mic, BarChart3, Megaphone,
  Image as ImageIcon, Headphones, Zap, Rocket, Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORKFLOW_STEPS } from '@/components/ebook/workflow/workflowAgents';

import mockEditor from '@/assets/mockups/agent-editor.jpg';
import mockMarket from '@/assets/mockups/agent-market.jpg';
import mockArchitect from '@/assets/mockups/agent-architect.jpg';
import mockCover from '@/assets/mockups/agent-cover.jpg';
import mockAudio from '@/assets/mockups/agent-audio.jpg';
import mockKdp from '@/assets/mockups/agent-kdp.jpg';

// Mockups par agent IA
const AGENT_MOCKUPS: Record<string, string> = {
  P1: mockEditor, P2: mockMarket, P3: mockArchitect, P4: mockEditor, P5: mockEditor,
  P6: mockKdp, P7: mockKdp, P8: mockKdp, P9: mockEditor, P10: mockArchitect,
  P11: mockKdp, P12: mockArchitect, P13: mockEditor, P14: mockKdp, P15: mockEditor,
};
const AGENT_TIME: Record<string, string> = {
  P1: '20s', P2: '45s', P3: '60s', P4: '8 min', P5: '2 min',
  P6: '90s', P7: '30s', P8: '40s', P9: '15s', P10: '50s',
  P11: '40s', P12: '60s', P13: '30s', P14: '20s', P15: '3 min',
};

// Bénéfices orientés résultats (style KDP Rocket)
const AGENT_BENEFITS: Record<string, string> = {
  P1: 'Trouve les angles éditoriaux qui vendent',
  P2: 'Analyse 50 concurrents Amazon et trouve la niche rentable',
  P3: 'Construit le plan détaillé chapitre par chapitre',
  P4: 'Rédige le manuscrit complet (jusqu\'à 30 chapitres)',
  P5: 'Optimise le rythme et la fluidité de chaque chapitre',
  P6: 'Génère description KDP optimisée SEO',
  P7: 'Trouve les 7 mots-clés backend Amazon',
  P8: 'Recommande les meilleures catégories KDP',
  P9: 'Corrige orthographe et typographie française pro',
  P10: 'Crée la structure narrative qui captive',
  P11: 'Calcule le prix optimal pour maximiser tes royalties',
  P12: 'Conçoit la table des matières et la couverture textuelle',
  P13: 'Polit le manuscrit pour un rendu éditeur pro',
  P14: 'Vérifie la conformité KDP avant publication',
  P15: 'Audit final qualité (jury éditorial)',
};

type ToolCard = {
  id: string;
  badge: string;
  name: string;
  subtitle: string;
  description: string;
  icon: any;
  mockup: string;
  time: string;
  bonus?: boolean;
};

// Helper pour transformer un agent en ToolCard
const agentToCard = (id: string): ToolCard => {
  const agent = WORKFLOW_STEPS.find((a) => a.id === id)!;
  return {
    id: agent.id,
    badge: `Agent ${agent.id}`,
    name: agent.name,
    subtitle: agent.agentSubtitle,
    description: AGENT_BENEFITS[agent.id] ?? agent.description,
    icon: agent.icon,
    mockup: AGENT_MOCKUPS[agent.id] ?? mockEditor,
    time: AGENT_TIME[agent.id] ?? '60s',
    bonus: agent.id === 'P15',
  };
};

// 5 piliers — 21 outils au total
const PILLARS = [
  {
    id: 'pilier-ecrire',
    label: 'Écrire',
    icon: PenTool,
    accent: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'Les agents IA qui structurent et rédigent votre manuscrit complet',
    tools: ['P1', 'P3', 'P4', 'P5', 'P9', 'P10', 'P13'].map(agentToCard),
  },
  {
    id: 'pilier-visuels',
    label: 'Visuels',
    icon: Palette,
    accent: 'text-violet-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    description: 'Studios pour créer la couverture et les illustrations professionnelles',
    tools: [
      {
        id: 'V1', badge: 'Studio', name: 'Studio Couverture IA', subtitle: 'Imagen 3',
        description: 'Génère une couverture KDP pro (front + back + tranche) en 3 clics',
        icon: ImageIcon, mockup: mockCover, time: '90s',
      },
      {
        id: 'V2', badge: 'Studio', name: 'Éditeur Canva intégré', subtitle: 'Drag & Drop',
        description: 'Personnalise ta couverture pixel-perfect, sans logiciel externe',
        icon: Palette, mockup: mockCover, time: 'Live',
      },
    ] as ToolCard[],
  },
  {
    id: 'pilier-audio',
    label: 'Audio',
    icon: Mic,
    accent: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'Transformez votre ebook en audiobook prêt à vendre sur Audible',
    tools: [
      {
        id: 'A1', badge: 'Studio', name: 'Audiobook TTS Pro', subtitle: 'OpenAI Voice',
        description: 'Transforme ton ebook en livre audio (5h) prêt pour Audible en 10 min',
        icon: Headphones, mockup: mockAudio, time: '5 min/h',
      },
      {
        id: 'A2', badge: 'Studio', name: 'Audio Express', subtitle: 'Pipeline FFmpeg',
        description: 'Génère et assemble tous tes chapitres audio automatiquement',
        icon: Zap, mockup: mockAudio, time: 'Auto',
      },
    ] as ToolCard[],
  },
  {
    id: 'pilier-kdp',
    label: 'KDP',
    icon: BarChart3,
    accent: 'text-kdp-orange',
    bg: 'bg-kdp-orange/10',
    border: 'border-kdp-orange/30',
    description: 'Tous les outils Amazon KDP pour publier et optimiser vos ventes',
    tools: ['P2', 'P6', 'P7', 'P8', 'P11', 'P12', 'P14', 'P15'].map(agentToCard),
  },
  {
    id: 'pilier-marketing',
    label: 'Marketing',
    icon: Megaphone,
    accent: 'text-rose-600',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    description: 'Lancez votre ebook avec un plan marketing complet généré par IA',
    tools: [
      {
        id: 'M1', badge: 'Studio', name: 'Plan de Lancement IA', subtitle: 'Stratégie 30j',
        description: 'Calendrier complet de lancement Amazon avec actions jour par jour',
        icon: Rocket, mockup: mockMarket, time: '2 min',
      },
      {
        id: 'M2', badge: 'Studio', name: 'Posts Réseaux Sociaux', subtitle: 'Multi-plateformes',
        description: '30 posts prêts à publier (Instagram, Facebook, LinkedIn, TikTok)',
        icon: Send, mockup: mockMarket, time: '90s',
      },
    ] as ToolCard[],
  },
];

const TOTAL_TOOLS = PILLARS.reduce((s, p) => s + p.tools.length, 0);

const ToolCardItem: React.FC<{ tool: ToolCard; pillarAccent: string; index: number }> = ({ tool, pillarAccent, index }) => {
  const Icon = tool.icon;
  const isBonus = tool.bonus;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.05 }}
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
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
        <img
          src={tool.mockup}
          alt={`Mockup ${tool.name}`}
          loading="lazy"
          width={768}
          height={576}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg ${
          isBonus ? 'bg-kdp-orange/90' : 'bg-primary/90'
        }`}>
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur text-foreground text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
          <Clock className="w-3 h-3" />
          {tool.time}
        </div>
      </div>
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px] font-mono">
            {tool.badge}
          </Badge>
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${pillarAccent}`}>
            {tool.subtitle}
          </span>
        </div>
        <h3 className="font-bold text-lg text-foreground leading-tight">{tool.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </motion.article>
  );
};

const AgentsShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="outils" className="py-20 px-4 bg-secondary/40 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header avec compteur géant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 mb-4">
            <Layers className="w-4 h-4 mr-2" />
            ÉCOSYSTÈME COMPLET — 5 PILIERS
          </Badge>
          <div className="inline-flex items-baseline gap-3 mb-4">
            <span className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">
              {TOTAL_TOOLS}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-foreground">OUTILS PRO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tout pour <span className="text-primary">créer, publier et vendre</span> vos ebooks
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            15 agents IA + 6 studios visuels, audio et marketing — dans une seule plateforme.
          </p>
        </motion.div>

        {/* 5 piliers en sections distinctes */}
        <div className="space-y-20">
          {PILLARS.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <div key={pillar.id} id={pillar.id} className="scroll-mt-40">
                {/* En-tête de pilier */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`mb-8 p-6 rounded-2xl border-2 ${pillar.bg} ${pillar.border}`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-14 h-14 rounded-2xl ${pillar.bg} border-2 ${pillar.border} flex items-center justify-center`}>
                      <PillarIcon className={`w-7 h-7 ${pillar.accent}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-foreground">{pillar.label}</h3>
                        <Badge className={`${pillar.bg} ${pillar.accent} border ${pillar.border} font-bold`}>
                          {pillar.tools.length} outils
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-foreground/70 mt-1">{pillar.description}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Cartes du pilier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pillar.tools.map((tool, i) => (
                    <ToolCardItem key={tool.id} tool={tool} pillarAccent={pillar.accent} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-5">
            Tous les {TOTAL_TOOLS} outils inclus à vie — <span className="text-primary font-bold">aucun coût additionnel</span>
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Débloquer les {TOTAL_TOOLS} outils — 67€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentsShowcase;
