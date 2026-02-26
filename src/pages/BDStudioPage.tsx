import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, Palette, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { EbookComicBookGenerator } from '@/components/ebook/EbookComicBookGenerator';
import { Helmet } from 'react-helmet';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const BDStudioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>BD Studio — Créez des Bandes Dessinées Franco-Belges avec l'IA</title>
        <meta name="description" content="Créez des BD style Tintin, Astérix, Lucky Luke avec l'IA. Générateur de bandes dessinées franco-belges complet : scénario, illustrations, export KDP." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/ebook-planner')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                BD Studio Pro
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Créez des{' '}
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Bandes Dessinées
                </span>
                {' '}avec l'IA
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Styles franco-belges classiques — Tintin, Astérix, Lucky Luke, Schtroumpfs — 
                du scénario à l'export KDP en quelques clics.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {[
                  { icon: Palette, label: '6 styles BD classiques' },
                  { icon: BookOpen, label: 'Scénario IA complet' },
                  { icon: Download, label: 'Export PDF/KDP' },
                  { icon: Zap, label: 'Génération 1 clic' },
                ].map((feat) => (
                  <Badge key={feat.label} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                    <feat.icon className="h-3.5 w-3.5" />
                    {feat.label}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Generator */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <EbookComicBookGenerator />
        </section>
      </div>
    </>
  );
};

export default BDStudioPage;
