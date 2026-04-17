import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, ArrowRight, Trophy, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Row = {
  feature: string;
  rocket: boolean;
  studio: boolean;
  exclusive?: boolean;
};

const PARITY_ROWS: Row[] = [
  // Parité KDP Rocket
  { feature: 'Recherche de niches rentables', rocket: true, studio: true },
  { feature: 'Analyse concurrence Amazon', rocket: true, studio: true },
  { feature: 'Générateur de titres optimisés', rocket: true, studio: true },
  { feature: 'Description KDP optimisée SEO', rocket: true, studio: true },
  { feature: 'Mots-clés backend (7 slots)', rocket: true, studio: true },
  { feature: 'Recommandation catégories KDP', rocket: true, studio: true },
  { feature: 'Stratégie de prix dynamique', rocket: true, studio: true },
  { feature: 'Plan de lancement 30 jours', rocket: true, studio: true },
  { feature: 'Générateur de couvertures IA', rocket: true, studio: true },
  { feature: 'Posts réseaux sociaux automatiques', rocket: true, studio: true },
  { feature: 'Bio auteur & nom de plume', rocket: true, studio: true },
  { feature: 'Assistant IA conversationnel', rocket: true, studio: true },
];

const EXCLUSIVE_ROWS: Row[] = [
  { feature: '✍️ Manuscrit complet généré par IA (15 agents P1-P15)', rocket: false, studio: true, exclusive: true },
  { feature: '🎧 Audiobook TTS pro (voix neuronales OpenAI)', rocket: false, studio: true, exclusive: true },
  { feature: '⚡ Audio Express (pipeline FFmpeg automatisé)', rocket: false, studio: true, exclusive: true },
  { feature: '📄 Importateur DOCX intelligent', rocket: false, studio: true, exclusive: true },
  { feature: '🎨 A+ Content Amazon (modules visuels)', rocket: false, studio: true, exclusive: true },
  { feature: '📚 Multi-tomes & gestion de séries', rocket: false, studio: true, exclusive: true },
  { feature: '🌍 Traducteur 30+ langues intégré', rocket: false, studio: true, exclusive: true },
  { feature: '🖼️ Mockups 3D photoréalistes', rocket: false, studio: true, exclusive: true },
  { feature: '🎓 Formation complète 18 modules vidéo', rocket: false, studio: true, exclusive: true },
];

const KdpRocketParityTable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-kdp-orange/10 text-kdp-orange border-kdp-orange/30 px-4 py-2 mb-4">
            <Trophy className="w-4 h-4 mr-2" />
            COMPARATIF FONCTIONNALITÉS
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Tout ce que fait KDP Rocket
            <br />
            <span className="text-primary">+ 9 outils en plus</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Comparaison fonctionnalité par fonctionnalité — pour 67€ à vie au lieu de 39€/mois.
          </p>
        </motion.div>

        {/* Tableau */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border-2 border-border shadow-2xl bg-card"
        >
          {/* En-tête colonnes */}
          <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] bg-gradient-to-r from-secondary to-muted border-b-2 border-border">
            <div className="p-4 sm:p-5 font-bold text-foreground text-sm sm:text-base">
              Fonctionnalité
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-border">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">KDP Rocket</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5">39€/mois</p>
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-border bg-primary/5">
              <p className="text-xs sm:text-sm font-bold text-primary flex items-center justify-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                EbookStudio
              </p>
              <p className="text-[10px] sm:text-xs text-primary/80 mt-0.5 font-semibold">67€ à vie</p>
            </div>
          </div>

          {/* Lignes parité */}
          {PARITY_ROWS.map((row, i) => (
            <motion.div
              key={`p-${i}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] border-b border-border hover:bg-muted/30 transition-colors"
            >
              <div className="p-3 sm:p-4 text-sm sm:text-base text-foreground">
                {row.feature}
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border">
                <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border bg-primary/5">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Séparateur exclusifs */}
          <div className="grid grid-cols-1 bg-gradient-to-r from-kdp-orange/10 via-kdp-orange/15 to-kdp-orange/10 border-y-2 border-kdp-orange/30">
            <div className="p-4 text-center">
              <p className="text-sm sm:text-base font-black text-kdp-orange uppercase tracking-wide flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                9 outils exclusifs EbookStudio
                <Sparkles className="w-4 h-4" />
              </p>
            </div>
          </div>

          {/* Lignes exclusives */}
          {EXCLUSIVE_ROWS.map((row, i) => (
            <motion.div
              key={`e-${i}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] border-b border-border hover:bg-kdp-orange/5 transition-colors"
            >
              <div className="p-3 sm:p-4 text-sm sm:text-base text-foreground font-medium">
                {row.feature}
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border">
                <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive/70" />
                </div>
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border bg-kdp-orange/5">
                <Badge className="bg-kdp-orange text-foreground font-bold text-[10px] px-2 py-0.5">
                  EXCLU
                </Badge>
              </div>
            </motion.div>
          ))}

          {/* Pied — Prix */}
          <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_180px_180px] bg-gradient-to-r from-primary/5 to-accent/5 border-t-2 border-border">
            <div className="p-4 sm:p-5 font-black text-foreground text-base sm:text-lg flex items-center">
              💰 Prix total
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-border">
              <p className="font-black text-base sm:text-lg text-foreground">39€</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">/mois</p>
              <p className="text-[10px] text-destructive font-semibold mt-1">468€/an</p>
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-border bg-primary/10">
              <p className="font-black text-base sm:text-lg text-primary">67€</p>
              <p className="text-[10px] sm:text-xs text-primary/80 font-bold">À VIE</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">−401€/an</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground mb-5 text-base">
            <span className="text-foreground font-bold">21 outils pro</span> au lieu de 12 —{' '}
            <span className="text-primary font-bold">économisez 401€ dès la première année</span>
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-10 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            J'accède à tout pour 67€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default KdpRocketParityTable;
