import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cpu, Image, Headphones, GraduationCap, Users, Bot, ShieldCheck,
  ArrowRight, Gift, Sparkles, Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const items = [
  { icon: Cpu, title: 'Générateur 15 agents IA (P1-P15)', desc: 'Workflow complet Gemini 3 Flash', value: 297 },
  { icon: Image, title: 'Studio couvertures Imagen 3', desc: 'Couvertures photoréalistes illimitées', value: 197 },
  { icon: Headphones, title: 'Studio audiobooks Azure Neural', desc: 'Voix neuronales premium en 30+ langues', value: 147 },
  { icon: GraduationCap, title: 'Formation 18 modules KDP', desc: 'De zéro à 1k€/mois sur Amazon', value: 197 },
  { icon: Bot, title: 'Copilote Ebookie 24/7', desc: 'Assistant IA intégré multilingue', value: 97 },
  { icon: Users, title: 'Communauté privée', desc: 'Forum, lives, partage de niches', value: 97 },
  { icon: ShieldCheck, title: 'Garantie 30 jours', desc: 'Satisfait ou remboursé sans condition', value: 0, free: true },
];

const totalValue = items.reduce((sum, i) => sum + i.value, 0);
const PRICE = 67;

const BonusStack: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/40">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-kdp-orange/10 text-kdp-orange border-kdp-orange/30 px-4 py-2 mb-4">
            <Gift className="w-4 h-4 mr-2" />
            TOUT CE QUE VOUS RECEVEZ AUJOURD'HUI
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Une valeur réelle de <span className="text-kdp-orange">{totalValue}€</span><br />
            <span className="text-foreground/80 text-2xl md:text-3xl">pour seulement {PRICE}€ à vie</span>
          </h2>
          <p className="text-muted-foreground">Chaque module est inclus sans surcoût ni abonnement.</p>
        </motion.div>

        {/* Stack */}
        <div className="space-y-3 mb-10">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <h3 className="font-bold text-foreground text-sm sm:text-base truncate">{item.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 ml-6">{item.desc}</p>
              </div>
              <div className="text-right shrink-0">
                {item.free ? (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">INCLUS</span>
                ) : (
                  <span className="text-base sm:text-lg font-black text-foreground">{item.value}€</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total + CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-10 text-primary-foreground shadow-2xl shadow-primary/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <span className="text-2xl text-primary-foreground/60 line-through">{totalValue}€</span>
              <ArrowRight className="w-6 h-6" />
              <span className="text-6xl md:text-7xl font-black text-kdp-orange leading-none">{PRICE}€</span>
            </div>
            <p className="text-primary-foreground/80 mb-2">Paiement unique — accès à vie</p>
            <p className="text-sm text-primary-foreground/70 mb-6">
              Économie immédiate : <span className="font-bold text-kdp-orange">{totalValue - PRICE}€</span> ({Math.round((1 - PRICE / totalValue) * 100)}% de remise)
            </p>

            <Button
              size="lg"
              onClick={() => navigate('/upsell-paiement?plan=pro')}
              className="bg-kdp-orange hover:bg-kdp-orange/90 text-foreground font-bold px-10 py-7 rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Tout débloquer pour {PRICE}€
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-primary-foreground/70 mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Garantie 30 jours • Paiement sécurisé • Accès instantané
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BonusStack;
