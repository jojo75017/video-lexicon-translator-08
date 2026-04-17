import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Palette, Mic, BarChart3, Megaphone } from 'lucide-react';

const PILLARS = [
  { icon: PenTool,   label: 'Écrire',    count: 7, color: 'text-emerald-500' },
  { icon: Palette,   label: 'Visuels',   count: 2, color: 'text-violet-500' },
  { icon: Mic,       label: 'Audio',     count: 2, color: 'text-blue-500' },
  { icon: BarChart3, label: 'KDP',       count: 8, color: 'text-kdp-orange' },
  { icon: Megaphone, label: 'Marketing', count: 2, color: 'text-rose-500' },
];

const TOTAL = PILLARS.reduce((s, p) => s + p.count, 0);

const ToolsCounterBanner: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-baseline gap-3 mb-3">
            <span className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">
              {TOTAL}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-foreground">OUTILS PRO</span>
          </div>
          <p className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
            Dans une seule plateforme — <span className="text-primary font-bold">15 agents IA</span> + <span className="text-primary font-bold">6 studios</span> visuels, audio et marketing
          </p>

          {/* 5 piliers en chiffres */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:-translate-y-1 transition-all"
                >
                  <Icon className={`w-7 h-7 mx-auto mb-2 ${p.color}`} />
                  <p className="text-2xl font-black text-foreground">{p.count}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{p.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsCounterBanner;
