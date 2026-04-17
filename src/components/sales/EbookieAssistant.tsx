import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Zap, MessageSquare, Star, ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Suggestion = {
  question: string;
  answer: string[];
};

const SUGGESTIONS: Suggestion[] = [
  {
    question: 'Comment optimiser mon titre pour Amazon KDP ?',
    answer: [
      '✅ Mets le bénéfice principal en premier (ex : "Perdre 5 kg…")',
      '✅ Ajoute un sous-titre avec 2-3 mots-clés Amazon',
      '✅ Limite-toi à 60 caractères pour éviter la troncature',
      '💡 Je peux générer 10 variantes A/B testées en 20s.',
    ],
  },
  {
    question: 'Quel prix pour mon ebook de 120 pages ?',
    answer: [
      '📊 Sweet spot KDP : 4,99 € (royalties 70%)',
      '💰 Lancement : 0,99 € pendant 7j → boost BSR',
      '🎯 Stable : 3,99 € à 5,99 € selon niche',
      '⚠️ Évite la zone morte 6,99-8,99 € (royalties tombent à 35%).',
    ],
  },
  {
    question: 'Quelle niche KDP est rentable en 2026 ?',
    answer: [
      '🔥 Top 3 niches BSR < 50k :',
      '1. Développement personnel parents (faible concurrence)',
      '2. Recettes batch cooking (recherche +180%)',
      '3. Carnets de gratitude illustrés (marges +400%)',
      '✨ Veux-tu une analyse complète d\'une de ces niches ?',
    ],
  },
];

const stats = [
  { icon: MessageSquare, value: '10k+', label: 'questions/semaine' },
  { icon: Zap, value: '< 2s', label: 'temps de réponse' },
  { icon: Star, value: '4.9/5', label: 'satisfaction' },
];

const EbookieAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  // Auto-démarre avec la première question
  useEffect(() => {
    const t = setTimeout(() => setActiveQuestion(0), 800);
    return () => clearTimeout(t);
  }, []);

  // Animation ligne par ligne
  useEffect(() => {
    if (activeQuestion === null) return;
    setVisibleLines(0);
    const total = SUGGESTIONS[activeQuestion].answer.length;
    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= total) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [activeQuestion]);

  const handleAsk = (i: number) => {
    setActiveQuestion(i);
  };

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
              votre copilote KDP 24/7
            </h2>
            <p className="text-foreground/70 text-lg mb-6">
              Bloqué sur une niche ? Une couverture qui pèche ? Un titre faible ? Ebookie répond
              en moins de 2 secondes, dans toutes les langues, sans jamais dormir.
            </p>

            {/* Bénéfices clés */}
            <div className="space-y-2.5 mb-8">
              {[
                'Réponses précises basées sur 50k+ ebooks Amazon analysés',
                'Conseils niche, prix, mots-clés et marketing en temps réel',
                'Génération de titres, descriptions et A+ content à la demande',
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>

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

          {/* Right : Chat démo interactive */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full opacity-60" />

            <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-primary-foreground flex-1">
                  <p className="font-bold text-sm">Ebookie</p>
                  <p className="text-[11px] opacity-80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                    En ligne — répond en 2s
                  </p>
                </div>
                <Badge className="bg-background/20 text-primary-foreground border-0 text-[10px]">
                  DÉMO LIVE
                </Badge>
              </div>

              {/* Questions cliquables */}
              <div className="p-4 bg-muted/30 border-b border-border">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  💬 Pose une question (cliquable) :
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleAsk(i)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        activeQuestion === i
                          ? 'bg-primary/10 border-primary/40 text-foreground font-semibold'
                          : 'bg-background border-border text-foreground/70 hover:border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      {s.question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation */}
              <div className="p-5 space-y-3 bg-background/50 min-h-[280px]">
                <AnimatePresence mode="wait">
                  {activeQuestion !== null && (
                    <motion.div
                      key={activeQuestion}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Question utilisateur */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end"
                      >
                        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary text-primary-foreground text-sm">
                          {SUGGESTIONS[activeQuestion].question}
                        </div>
                      </motion.div>

                      {/* Réponse Ebookie ligne par ligne */}
                      {visibleLines === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                              />
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-bl-sm bg-muted text-foreground text-sm border border-border space-y-1.5">
                            {SUGGESTIONS[activeQuestion].answer.slice(0, visibleLines).map((line, i) => (
                              <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="leading-relaxed"
                              >
                                {line}
                              </motion.p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input mock */}
              <div className="border-t border-border p-3 bg-background flex gap-2">
                <div className="flex-1 px-4 py-2.5 bg-muted/50 rounded-xl text-sm text-muted-foreground">
                  Pose une question à Ebookie…
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary-foreground" />
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
