import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORKFLOW_STEPS } from '@/components/ebook/workflow/workflowAgents';

const AgentsShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="outils" className="py-20 px-4 bg-secondary/40 scroll-mt-20">
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
            15 AGENTS IA — UN ÉCOSYSTÈME COMPLET
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            La seule plateforme avec <span className="text-primary">15 agents spécialisés</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Chaque agent a un rôle précis : éditeur, marché, architecte, romancier, styliste…
            Ils travaillent ensemble pour produire un manuscrit niveau pro.
          </p>
        </motion.div>

        {/* Grid 15 agents */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {WORKFLOW_STEPS.map((agent, i) => {
            const Icon = agent.icon;
            const isBonus = agent.id === 'P15';
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`group relative bg-card rounded-2xl p-4 border transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isBonus
                    ? 'border-kdp-orange/40 hover:border-kdp-orange shadow-kdp-orange/10'
                    : 'border-border hover:border-primary/40 hover:shadow-primary/10'
                }`}
              >
                {isBonus && (
                  <div className="absolute -top-2 -right-2 bg-kdp-orange text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    BONUS
                  </div>
                )}

                {/* Mockup mini */}
                <div className={`relative aspect-[4/3] rounded-xl mb-3 overflow-hidden ${
                  isBonus ? 'bg-gradient-to-br from-kdp-orange/15 to-kdp-orange/5' : 'bg-gradient-to-br from-primary/10 to-accent/5'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className={`w-10 h-10 ${isBonus ? 'text-kdp-orange' : 'text-primary'} group-hover:scale-110 transition-transform`} />
                  </div>
                  {/* Mockup top bar */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-1 rounded-full bg-foreground/10" />
                    <div className="h-1 rounded-full bg-foreground/10 mt-1 w-2/3" />
                  </div>
                </div>

                {/* Texte */}
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground">{agent.id}</p>
                  <h3 className="font-bold text-sm text-foreground leading-tight">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{agent.agentRole}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
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
