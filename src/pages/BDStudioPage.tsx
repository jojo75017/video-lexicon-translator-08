import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, Palette, Download, Zap, Star, ChevronDown, Users, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { EbookComicBookGenerator } from '@/components/ebook/EbookComicBookGenerator';
import { Helmet } from 'react-helmet';
import bdHero from '@/assets/bd-studio-hero.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const BD_STYLES = [
  { name: 'Ligne Claire', author: 'Hergé', icon: '✏️', series: 'Tintin', color: 'from-blue-500 to-cyan-500' },
  { name: 'Uderzo', author: 'Uderzo', icon: '⚔️', series: 'Astérix', color: 'from-red-500 to-orange-500' },
  { name: 'Morris', author: 'Morris', icon: '🤠', series: 'Lucky Luke', color: 'from-amber-500 to-yellow-500' },
  { name: 'Peyo', author: 'Peyo', icon: '🍄', series: 'Schtroumpfs', color: 'from-blue-400 to-indigo-500' },
  { name: 'Franquin', author: 'Franquin', icon: '💥', series: 'Gaston', color: 'from-green-500 to-emerald-500' },
  { name: 'BD Moderne', author: 'Contemporain', icon: '🎨', series: 'Nouveau', color: 'from-purple-500 to-pink-500' },
];

const STEPS = [
  { num: '1', title: 'Choisissez un style', desc: 'Tintin, Astérix, Lucky Luke…', icon: Palette },
  { num: '2', title: 'L\'IA écrit le scénario', desc: 'Histoire complète avec dialogues', icon: Sparkles },
  { num: '3', title: 'Illustrations auto', desc: 'Chaque case est illustrée', icon: BookOpen },
  { num: '4', title: 'Exportez en PDF/KDP', desc: 'Prêt à publier sur Amazon', icon: Download },
];

const BDStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <>
      <Helmet>
        <title>BD Studio — Créez des Bandes Dessinées Franco-Belges avec l'IA</title>
        <meta name="description" content="Créez des BD style Tintin, Astérix, Lucky Luke avec l'IA. Générateur de bandes dessinées franco-belges complet : scénario, illustrations, export KDP." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={bdHero} 
              alt="Bandes dessinées franco-belges" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>

            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={stagger}
              className="max-w-2xl space-y-6"
            >
              <motion.div variants={fadeUp}>
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 px-4 py-1.5 text-sm font-semibold">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  BD Studio Pro — Nouveau
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                Créez vos{' '}
                <span className="relative inline-block">
                  <span className="text-amber-500 dark:text-amber-400">
                    Bandes Dessinées
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                <br />avec l'IA
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Styles franco-belges légendaires — <strong>Tintin</strong>, <strong>Astérix</strong>, <strong>Lucky Luke</strong> — 
                du scénario complet à l'export KDP en quelques clics.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setShowGenerator(true);
                    setTimeout(() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg px-8 shadow-xl shadow-amber-500/25"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Créer ma BD maintenant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('styles')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-amber-500/30 hover:bg-amber-500/10 text-lg"
                >
                  Voir les styles
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                        {['T', 'A', 'L', 'S'][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">8 templates</strong> prêts
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">Export KDP</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ STYLES BD ═══════════════════ */}
        <section id="styles" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold mb-3">
                6 styles artistiques{' '}
                <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">légendaires</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-xl mx-auto">
                Chaque style reproduit fidèlement la patte graphique des maîtres de la BD franco-belge.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {BD_STYLES.map((style, i) => (
                <motion.div key={style.name} variants={fadeUp} custom={i}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 hover:border-amber-500/40 overflow-hidden"
                    onClick={() => {
                      setShowGenerator(true);
                      setTimeout(() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                  >
                    <CardContent className="p-5 text-center space-y-3">
                      <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {style.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{style.name}</p>
                        <p className="text-xs text-muted-foreground">{style.series}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ COMMENT ÇA MARCHE ═══════════════════ */}
        <section className="py-16 px-4 bg-muted/30 border-y border-border/50">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
              <motion.h2 variants={fadeUp} className="text-3xl font-extrabold mb-3">
                Comment ça marche ?
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">
                De l'idée au livre publié en 4 étapes simples
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {STEPS.map((step, i) => (
                <motion.div key={step.num} variants={fadeUp} custom={i} className="relative">
                  <Card className="h-full border-border/50 hover:border-amber-500/30 transition-colors">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {step.num}
                      </div>
                      <step.icon className="h-8 w-8 mx-auto text-amber-500" />
                      <h3 className="font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground/30 text-2xl">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ STATS ═══════════════════ */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              {[
                { value: '8', label: 'Templates BD', icon: BookOpen },
                { value: '6', label: 'Styles artistiques', icon: Palette },
                { value: '24', label: 'Pages max/BD', icon: Trophy },
                { value: '< 5 min', label: 'Scénario IA', icon: Clock },
              ].map((stat, i) => (
                <motion.div key={stat.label} variants={fadeUp} custom={i} className="space-y-2">
                  <stat.icon className="h-6 w-6 mx-auto text-amber-500" />
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ CTA FINAL ═══════════════════ */}
        {!showGenerator && (
          <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-extrabold">
                Prêt à créer votre première BD ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Choisissez un template, l'IA s'occupe du reste. Aucune compétence en dessin requise.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setShowGenerator(true);
                  setTimeout(() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-6 shadow-xl shadow-amber-500/25"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Lancer le BD Studio
              </Button>
            </div>
          </section>
        )}

        {/* ═══════════════════ GENERATOR ═══════════════════ */}
        {showGenerator && (
          <section id="generator" className="max-w-6xl mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <EbookComicBookGenerator />
            </motion.div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            BD Studio Pro — Propulsé par l'IA • Export compatible Amazon KDP
          </p>
        </footer>
      </div>
    </>
  );
};

export default BDStudioPage;
