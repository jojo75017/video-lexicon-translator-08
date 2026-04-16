import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, CheckCircle, Headphones, BookOpen, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const guarantees = [
  {
    icon: BookOpen,
    title: "Publiez en 7 jours",
    desc: "Si vous ne publiez pas votre 1er ebook en 7 jours, on vous offre une session coaching 1-on-1 gratuite.",
    color: "from-primary to-accent",
  },
  {
    icon: RefreshCcw,
    title: "Remboursement intégral",
    desc: "Pas satisfait ? Remboursement 100% sous 30 jours, sans condition ni question posée.",
    color: "from-primary to-accent",
  },
  {
    icon: Headphones,
    title: "Support illimité",
    desc: "Zoom gratuit avec le créateur + support prioritaire par email. Vous n'êtes jamais seul.",
    color: "from-kdp-orange to-kdp-orange/80",
  },
];

const GuaranteeSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 mr-2" />
            TRIPLE GARANTIE
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Zéro risque. Zéro excuse.
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            On prend le risque à votre place. Si ça ne fonctionne pas, vous ne perdez rien.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-card/80 border-border hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                    <g.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-3">{g.title}</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">{g.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
        >
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              "🔒 Paiement sécurisé SSL",
              "✅ Accès immédiat",
              "🛡️ Garantie 30 jours",
              "💬 Support 7j/7",
            ].map((item, i) => (
              <span key={i} className="text-sm text-foreground/70 flex items-center gap-1">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
