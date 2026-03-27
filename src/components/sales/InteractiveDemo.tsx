import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, PenTool, Palette, FileText, ArrowRight, 
  Play, CheckCircle, Sparkles, Clock, Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    id: 1,
    icon: Brain,
    title: "Choisissez votre niche",
    subtitle: "30 secondes",
    description: "Décrivez votre sujet en une phrase. L'IA analyse le marché Amazon et génère un plan optimisé.",
    demo: {
      input: "Guide pratique sur le jeûne intermittent",
      output: [
        "✅ Niche validée — Volume Amazon élevé",
        "📖 12 chapitres structurés automatiquement",
        "🎯 5 mots-clés KDP identifiés",
        "📊 Concurrence : Modérée — Opportunité forte",
      ],
    },
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    icon: PenTool,
    title: "L'IA rédige votre ebook",
    subtitle: "15 minutes",
    description: "Gemini 3 Flash génère chaque chapitre avec un style professionnel et humain. Vous gardez le contrôle.",
    demo: {
      input: "Chapitre 3 : Les bienfaits scientifiques du jeûne",
      output: [
        "✅ 2 500 mots rédigés en 28 secondes",
        "🧠 Score anti-IA : 94% (indétectable)",
        "📝 Ton adapté : Informatif & accessible",
        "🔄 Régénération illimitée si besoin",
      ],
    },
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    icon: Palette,
    title: "Couverture + Export",
    subtitle: "5 minutes",
    description: "Imagen 3 crée une couverture pro. Exportez en PDF, EPUB ou Word — prêt pour Amazon KDP.",
    demo: {
      input: "Générer couverture professionnelle",
      output: [
        "🎨 3 designs générés en 10 secondes",
        "📐 Format KDP respecté automatiquement",
        "📄 Export PDF prêt pour publication",
        "🚀 Listing Amazon optimisé inclus",
      ],
    },
    color: "from-violet-500 to-purple-500",
  },
];

const InteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const navigate = useNavigate();

  const handleStepClick = (index: number) => {
    if (index === activeStep) return;
    setShowOutput(false);
    setIsAnimating(true);
    setTimeout(() => {
      setActiveStep(index);
      setIsAnimating(false);
      setTimeout(() => setShowOutput(true), 400);
    }, 200);
  };

  const handleSimulate = () => {
    setShowOutput(false);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowOutput(true);
    }, 800);
  };

  const step = STEPS[activeStep];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(6,182,212,0.06),transparent)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
            <Play className="w-4 h-4 mr-2" />
            DÉMO EN 3 ÉTAPES
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Voyez la puissance de l'IA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              en action
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            De l'idée au livre publié sur Amazon — en moins de 20 minutes.
          </p>
        </div>

        {/* Step selector */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleStepClick(i)}
              className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-xl border transition-all duration-300 ${
                i === activeStep
                  ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center transition-transform duration-300 ${
                  i === activeStep ? 'scale-110' : 'scale-100 opacity-60'
                }`}
              >
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className={`text-sm font-semibold ${i === activeStep ? 'text-white' : 'text-white/50'}`}>
                  Étape {s.id}
                </p>
                <p className={`text-xs ${i === activeStep ? 'text-cyan-400' : 'text-white/30'}`}>
                  {s.subtitle}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-white/20 hidden lg:block ml-2" />
              )}
            </button>
          ))}
        </div>

        {/* Demo area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900/80 border-slate-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Left: description */}
                  <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-800">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 text-sm font-medium">{step.subtitle}</span>
                    </div>
                    <p className="text-white/70 leading-relaxed mb-6">{step.description}</p>
                    <Button
                      onClick={handleSimulate}
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold hover:from-cyan-400 hover:to-emerald-400"
                      disabled={isAnimating}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isAnimating ? 'Génération...' : 'Simuler cette étape'}
                    </Button>
                  </div>

                  {/* Right: simulated output */}
                  <div className="p-8 md:p-10 bg-slate-950/50">
                    {/* Input */}
                    <div className="mb-6">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Entrée</p>
                      <div className="bg-slate-800/80 rounded-lg px-4 py-3 border border-slate-700">
                        <p className="text-white/80 text-sm font-mono">{step.demo.input}</p>
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Résultat IA</p>
                      <div className="space-y-2">
                        {step.demo.output.map((line, i) => (
                          <motion.div
                            key={`${activeStep}-${i}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={showOutput ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                            transition={{ delay: showOutput ? i * 0.15 : 0, duration: 0.3 }}
                            className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-700/50"
                          >
                            <span className="text-sm text-white/90">{line}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {showOutput && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Terminé en {step.subtitle}
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-white/60 text-sm mb-4">
            <strong className="text-white">20 minutes</strong> du début à la publication. Essayez par vous-même.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold px-8 py-6 rounded-xl shadow-lg shadow-cyan-500/20"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Essayer la démo gratuite
            </Button>
            <a
              href="https://www.trafic-affiliation.com/ebookstudio_capture"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-slate-700 text-white/70 hover:text-white hover:border-slate-600">
                Recevoir les 10 niches gratuites
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
