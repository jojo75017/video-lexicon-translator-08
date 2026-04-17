import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Image as ImageIcon, Headphones, FileText, Tag, BarChart3, Mail, Calendar, Sparkles } from 'lucide-react';

const DELIVERABLES = [
  { icon: BookOpen, title: 'Manuscrit complet', value: '~200 pages', color: 'bg-emerald-500/10 text-emerald-600' },
  { icon: ImageIcon, title: 'Couverture pro', value: 'Front + dos + tranche', color: 'bg-violet-500/10 text-violet-600' },
  { icon: Headphones, title: 'Audiobook', value: '~5h voix premium', color: 'bg-blue-500/10 text-blue-600' },
  { icon: FileText, title: 'Description KDP', value: 'Optimisée 4 000 car.', color: 'bg-rose-500/10 text-rose-600' },
  { icon: Tag, title: '7 mots-clés', value: 'Backend Amazon', color: 'bg-kdp-orange/10 text-kdp-orange' },
  { icon: BarChart3, title: '3 catégories', value: 'Niches BSR rentables', color: 'bg-amber-500/10 text-amber-600' },
  { icon: Mail, title: 'Email de lancement', value: 'Prêt à envoyer', color: 'bg-cyan-500/10 text-cyan-600' },
  { icon: Calendar, title: 'Plan social media', value: '14 posts pré-rédigés', color: 'bg-fuchsia-500/10 text-fuchsia-600' },
];

const EbookAnatomy: React.FC = () => {
  return (
    <section id="anatomie" className="py-20 px-4 bg-secondary/30 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            CE QUE VOUS OBTENEZ À LA FIN
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Anatomie d'un projet <span className="text-primary">EbookStudio</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Chaque projet vous livre 8 actifs prêts à publier sur Amazon KDP — pas seulement un manuscrit.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DELIVERABLES.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${d.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-foreground">{d.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{d.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EbookAnatomy;
