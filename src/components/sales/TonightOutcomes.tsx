import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, BookOpen, FileText, Search, Palette, 
  Rocket, ArrowRight, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const outcomes = [
  { time: "0–5 min", icon: Search, label: "Niche validée + plan de 12 chapitres", color: "text-primary bg-cyan-500/10 border-cyan-500/20" },
  { time: "5–20 min", icon: FileText, label: "Ebook de 25 000+ mots rédigé par l'IA", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { time: "20–30 min", icon: Palette, label: "Couverture pro générée par Imagen 3", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { time: "30–45 min", icon: BookOpen, label: "Export PDF/EPUB prêt pour Amazon KDP", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

const TonightOutcomes = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-secondary/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.06),transparent)]" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.div variants={fadeIn}>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              CE SOIR, VOUS AUREZ…
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeIn} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Votre ebook publié
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              avant minuit
            </span>
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-emerald-500/50 to-amber-500/50 hidden sm:block" />
          
          <div className="space-y-5">
            {outcomes.map((o, i) => (
              <motion.div key={i} variants={fadeIn} custom={i}
                className="flex items-center gap-4 sm:gap-6 group">
                {/* Time pill */}
                <div className={`flex-shrink-0 w-[4.5rem] text-center px-2 py-1.5 rounded-lg border text-xs font-bold ${o.color}`}>
                  {o.time}
                </div>
                {/* Content */}
                <div className="flex items-center gap-3 flex-1 bg-muted/50 rounded-xl px-5 py-4 border border-border/50 group-hover:border-slate-600 transition-colors">
                  <o.icon className={`w-5 h-5 flex-shrink-0 ${o.color.split(' ')[0]}`} />
                  <span className="text-foreground font-medium">{o.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mt-10">
          <Button size="lg" onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="text-lg px-10 py-7 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-2xl shadow-xl shadow-cyan-500/20 hover:-translate-y-1 transition-all">
            <Sparkles className="w-5 h-5 mr-2" />
            Je publie mon ebook ce soir
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-foreground/40 text-xs mt-3 flex items-center justify-center gap-2">
            <Rocket className="w-3.5 h-3.5" />
            Accès immédiat après paiement • Garantie 30 jours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TonightOutcomes;
