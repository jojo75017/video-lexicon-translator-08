import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ebooksShowcase1 from '@/assets/ebooks-showcase-1.png';
import ebooksShowcase2 from '@/assets/ebooks-showcase-2.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const AuthorShowcase: React.FC = () => {
  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Résultats réels
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
            ✨ Exemples réels d'ebooks publiés avec{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              EbookStudio
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ces livres ont été créés à l'aide du workflow éditorial IA — et sont en vente sur Amazon.
          </p>
          <p className="text-sm font-medium text-foreground mt-2">
            ✨ Vous pouvez créer le vôtre en quelques minutes.
          </p>
        </motion.div>

        {/* Images */}
        <motion.div variants={fadeUp} custom={1} className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 hover:shadow-cyan-500/20 transition-shadow duration-500">
            <img
              src={ebooksShowcase1}
              alt="Ebooks publiés avec EbookStudio — Ce que la femme de ménage a vu, Revenu Passif 2025, Retour en Provence"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 hover:shadow-cyan-500/20 transition-shadow duration-500">
            <img
              src={ebooksShowcase2}
              alt="Ebooks publiés avec EbookStudio — L'Appel des Ombres, Revenu Passif 2025, Bien-Être au Quotidien"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          {[
            '+ de 35 ebooks publiés',
            'Succès sur Amazon KDP',
            'Créés avec EbookStudio Pro',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={3} className="text-center">
          <Button
            size="lg"
            onClick={() => window.open('https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7', '_blank')}
            className="text-base px-8 py-5 h-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold shadow-lg shadow-cyan-500/25 gap-2 group"
          >
            👉 Voir ma page auteur Amazon
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
          <p className="text-xs text-slate-500 mt-2">
            S'ouvre dans un nouvel onglet — restez sur EbookStudio
          </p>
          <p className="text-xs text-slate-600 mt-1">
            👉 Preuve réelle — résultats visibles publiquement.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AuthorShowcase;
