import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

const avatars = [
  { initials: "MD", color: "from-pink-500 to-rose-500" },
  { initials: "TL", color: "from-blue-500 to-cyan-500" },
  { initials: "SR", color: "from-violet-500 to-purple-500" },
  { initials: "JP", color: "from-emerald-500 to-teal-500" },
  { initials: "CB", color: "from-amber-500 to-orange-500" },
];

const SocialProofBanner = () => {
  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Stacked avatars */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex -space-x-3">
            {avatars.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-md`}
              >
                {a.initials}
              </motion.div>
            ))}
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="ml-4 text-sm text-muted-foreground font-medium"
          >
            +230 auteurs actifs
          </motion.span>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.8/5</span>
            <span>— 38 avis</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Garantie 30 jours</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Paiement unique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofBanner;
