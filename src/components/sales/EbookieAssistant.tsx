import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Zap, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const chatBubbles = [
  { from: 'user', text: 'Quelle niche KDP est rentable en 2026 ?' },
  { from: 'bot', text: '🎯 3 niches qui cartonnent : Développement personnel pour parents, Recettes batch cooking, Carnets de gratitude. BSR moyen < 50k.' },
  { from: 'user', text: 'Tu peux générer la couverture ?' },
  { from: 'bot', text: '✨ Lancement Imagen 3 → 4 visuels photoréalistes prêts en 12s. Style "minimaliste premium" sélectionné automatiquement.' },
];

const stats = [
  { icon: MessageSquare, value: '10k+', label: 'questions / semaine' },
  { icon: Zap, value: '< 2s', label: 'temps de réponse' },
  { icon: Star, value: '4.8/5', label: 'satisfaction' },
];

const EbookieAssistant: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left : Persona + stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-accent/10 text-accent border-accent/30 px-4 py-2 mb-4">
              <Bot className="w-4 h-4 mr-2" />
              VOTRE COPILOTE IA INTÉGRÉ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
              Rencontrez <span className="text-primary">Ebookie</span><br />
              votre copilote KDP
            </h2>
            <p className="text-foreground/70 text-lg mb-8">
              Bloqué sur une niche ? Une couverture qui pèche ? Un titre faible ? Ebookie répond
              en moins de 2 secondes, 24/7, dans toutes les langues.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-black text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/upsell-paiement?plan=pro')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Activer Ebookie — 67€ à vie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Right : Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full opacity-60" />

            <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-primary-foreground">
                  <p className="font-bold text-sm">Ebookie</p>
                  <p className="text-[11px] opacity-80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-3 bg-background/50 min-h-[320px]">
                {chatBubbles.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 }}
                    className={`flex ${b.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        b.from === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm border border-border'
                      }`}
                    >
                      {b.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Input mock */}
              <div className="border-t border-border p-3 bg-background flex gap-2">
                <div className="flex-1 px-4 py-2.5 bg-muted/50 rounded-xl text-sm text-muted-foreground">
                  Pose une question à Ebookie…
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EbookieAssistant;
