import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Crown, Sparkles, Search, LayoutGrid,
  MousePointerClick, BadgeCheck, ArrowLeft, Rocket,
} from 'lucide-react';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

interface TourStep {
  id: number;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
}

const STEPS: TourStep[] = [
  {
    id: 1,
    title: 'Bienvenue dans le cockpit V3',
    description: "Voici votre espace Publication Assistée Pro : tous vos outils premium réunis dans une seule interface.",
    targetSelector: '[data-tour="hero"]',
    position: 'bottom',
    icon: <Crown className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Votre accès à vie',
    description: "197€ une fois, et c'est à vous pour toujours. Toutes les futures mises à jour V3 incluses.",
    targetSelector: '[data-tour="price"]',
    position: 'bottom',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Recherche instantanée',
    description: "Tapez quelques lettres pour retrouver n'importe quel outil parmi les 60 modules.",
    targetSelector: '[data-tour="search"]',
    position: 'bottom',
    icon: <Search className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Navigation par pilier',
    description: 'Filtrez par Publier, Monétiser, Marketing ou IA pour aller droit au but.',
    targetSelector: '[data-tour="filters"]',
    position: 'bottom',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Lancez un outil',
    description: 'Cliquez sur une carte pour ouvrir directement l\'outil correspondant dans une fenêtre dédiée.',
    targetSelector: '[data-tour="card"]',
    position: 'top',
    icon: <MousePointerClick className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'Suivez l\'avancement',
    description: 'Chaque carte indique son statut : Prêt, En cours ou Bientôt disponible.',
    targetSelector: '[data-tour="status"]',
    position: 'top',
    icon: <BadgeCheck className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'Revenez quand vous voulez',
    description: 'Ce bouton vous ramène au cockpit principal à tout moment. Bonne création !',
    targetSelector: '[data-tour="back"]',
    position: 'bottom',
    icon: <ArrowLeft className="w-5 h-5" />,
  },
];

interface V3HubTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const V3HubTour: React.FC<V3HubTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltip, setTooltip] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const current = STEPS[step];

    const update = () => {
      const el = document.querySelector(current.targetSelector);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTarget({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height });

      const tw = 340, th = 210, off = 16;
      let t = 0, l = 0;
      switch (current.position) {
        case 'top':
          t = r.top + window.scrollY - th - off;
          l = r.left + window.scrollX + r.width / 2 - tw / 2;
          break;
        case 'bottom':
          t = r.top + window.scrollY + r.height + off;
          l = r.left + window.scrollX + r.width / 2 - tw / 2;
          break;
        case 'left':
          t = r.top + window.scrollY + r.height / 2 - th / 2;
          l = r.left + window.scrollX - tw - off;
          break;
        case 'right':
          t = r.top + window.scrollY + r.height / 2 - th / 2;
          l = r.left + window.scrollX + r.width + off;
          break;
      }
      l = Math.max(16, Math.min(l, window.innerWidth - tw - 16));
      t = Math.max(window.scrollY + 16, t);
      setTooltip({ top: t, left: l });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [isOpen, step]);

  if (!isOpen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => (isLast ? onComplete() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
        onClick={onClose}
        style={{
          background: `radial-gradient(circle at ${target.left + target.width / 2 - window.scrollX}px ${target.top + target.height / 2 - window.scrollY}px, transparent 0px, transparent ${Math.max(target.width, target.height) / 2 + 16}px, rgba(0,0,0,0.82) ${Math.max(target.width, target.height) / 2 + 48}px)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-[101] pointer-events-none rounded-2xl"
        style={{
          top: target.top - 8,
          left: target.left - 8,
          width: target.width + 16,
          height: target.height + 16,
          border: `2px solid ${GOLD}`,
          boxShadow: `0 0 0 4px ${GOLD}33, 0 0 30px -4px ${GOLD}aa`,
        }}
      />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed z-[102] w-[340px]"
        style={{ top: tooltip.top, left: tooltip.left }}
      >
        <div className="rounded-2xl overflow-hidden border" style={{ background: '#161616', borderColor: `${GOLD}55` }}>
          <div className="flex items-center justify-between p-4" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }}>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-black/20" style={{ color: '#1a1a1a' }}>{current.icon}</span>
              <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>{current.title}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-black/10 hover:bg-black/20 transition-colors" style={{ color: '#1a1a1a' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-white/70 leading-relaxed">{current.description}</p>

            <div className="flex items-center justify-center gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 24 : 8,
                    background: i === step ? GOLD : i < step ? GOLD_LIGHT : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button onClick={onClose} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Passer
              </button>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/15 text-white/70 hover:border-white/40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-bold"
                  style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}
                >
                  {isLast ? (<>C'est parti ! <Rocket className="w-4 h-4" /></>) : (<>Suivant <ChevronRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default V3HubTour;
