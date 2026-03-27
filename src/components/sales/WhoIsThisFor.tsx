import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, PenTool, TrendingUp, GraduationCap, Briefcase, 
  Heart, CheckCircle, ArrowRight 
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 }
  })
};

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const profiles = [
  {
    icon: PenTool,
    title: "Auteur débutant",
    desc: "Vous rêvez de publier mais ne savez pas par où commencer",
    outcome: "Votre 1er ebook sur Amazon ce soir",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Entrepreneur",
    desc: "Vous voulez des lead magnets ou des revenus passifs KDP",
    outcome: "+340 leads ou 850€/mois en 6 mois",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Briefcase,
    title: "Freelance / Coach",
    desc: "Vous voulez asseoir votre expertise avec un livre",
    outcome: "Crédibilité instantanée dans votre niche",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: GraduationCap,
    title: "Side-hustler",
    desc: "Vous cherchez un complément de revenu sans risque",
    outcome: "1 ebook/semaine = 420€+/mois de royalties",
    color: "from-amber-500 to-orange-500",
  },
];

const WhoIsThisFor = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(6,182,212,0.04),transparent)]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.div variants={fadeIn}>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2 mb-4">
              <Target className="w-4 h-4 mr-2" />
              EST-CE POUR VOUS ?
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeIn} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Vous vous reconnaissez ?
          </motion.h2>
          <motion.p variants={fadeIn} custom={2} className="text-white/70 text-lg max-w-xl mx-auto">
            EbookStudio est fait pour vous si…
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid sm:grid-cols-2 gap-5">
          {profiles.map((p, i) => (
            <motion.div key={i} variants={fadeIn} custom={i}>
              <Card className="h-full bg-slate-900/60 border-slate-800 hover:border-cyan-500/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white mb-1">{p.title}</h3>
                      <p className="text-white/60 text-sm mb-3">{p.desc}</p>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{p.outcome}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Reassurance */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 flex-wrap justify-center text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400" />
              Aucune compétence technique requise
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Résultats dès le 1er jour
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
