import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, BookOpen, Palette, CheckCircle2, ArrowRight, Clock } from "lucide-react";

const SUJETS = [
  "Le jeûne intermittent pour débutants",
  "Méditation pleine conscience au quotidien",
  "Recettes véganes faciles et gourmandes",
];

const CHAPITRES = [
  "Introduction : pourquoi ce livre va te transformer",
  "Chapitre 1 : les bases scientifiques",
  "Chapitre 2 : ta première semaine pas à pas",
  "Chapitre 3 : les 7 erreurs à éviter",
  "Chapitre 4 : recettes & menus prêts à l'emploi",
  "Conclusion : ton plan d'action sur 30 jours",
];

const TEXTE_CHAPITRE =
  "Imagine te réveiller chaque matin avec une énergie débordante, une clarté mentale absolue et une sensation de légèreté que tu n'avais plus connue depuis l'enfance. Ce n'est pas un rêve — c'est exactement ce que des milliers de personnes vivent aujourd'hui...";

interface Props {
  onCtaClick?: () => void;
}

export const JoyfulLiveDemo = ({ onCtaClick }: Props) => {
  const [sujetIdx, setSujetIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [launched, setLaunched] = useState(false);
  const [step, setStep] = useState(0); // 0=idle, 1=plan, 2=redaction, 3=cover
  const [chaptersDone, setChaptersDone] = useState(0);
  const [textTyped, setTextTyped] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  // Effet machine à écrire pour le sujet
  useEffect(() => {
    if (launched) return;
    const sujet = SUJETS[sujetIdx];
    let i = 0;
    setTyped("");
    const typing = setInterval(() => {
      i++;
      setTyped(sujet.slice(0, i));
      if (i >= sujet.length) {
        clearInterval(typing);
        setTimeout(() => setSujetIdx((s) => (s + 1) % SUJETS.length), 1800);
      }
    }, 55);
    return () => clearInterval(typing);
  }, [sujetIdx, launched]);

  // Animation séquentielle après lancement
  useEffect(() => {
    if (!launched) return;
    setStep(1);
    setChaptersDone(0);
    setTextTyped("");

    // Étape 1 : chapitres qui se cochent
    const chapInterval = setInterval(() => {
      setChaptersDone((c) => {
        if (c + 1 >= CHAPITRES.length) clearInterval(chapInterval);
        return c + 1;
      });
    }, 350);

    // Étape 2 : rédaction après 2.8s
    const t2 = setTimeout(() => {
      setStep(2);
      let i = 0;
      const writer = setInterval(() => {
        i += 3;
        setTextTyped(TEXTE_CHAPITRE.slice(0, i));
        if (i >= TEXTE_CHAPITRE.length) clearInterval(writer);
      }, 25);
    }, 2800);

    // Étape 3 : couverture après 6s
    const t3 = setTimeout(() => setStep(3), 6000);

    return () => {
      clearInterval(chapInterval);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [launched]);

  const handleLaunch = () => {
    setLaunched(true);
  };

  const handleReset = () => {
    setLaunched(false);
    setStep(0);
    setChaptersDone(0);
    setTextTyped("");
  };

  return (
    <section
      ref={sectionRef}
      id="demo-live"
      className="py-20 px-4 bg-gradient-to-b from-[hsl(var(--joy-lavender)/0.3)] to-joy-cream"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-joy-peach text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy mb-4">
            ✨ Démo en direct
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-4">
            Regarde ton premier livre prendre vie
          </h2>
          <p className="text-lg text-joy-ink/70 max-w-2xl mx-auto">
            Aucune inscription, aucun engagement. Juste un aperçu de ce que tu vas vivre.
          </p>
        </div>

        {/* Carte simulateur */}
        <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-joy border-2 border-[hsl(var(--joy-lavender))] relative overflow-hidden">
          {/* Décor */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-joy-sun/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-joy-mint/30 rounded-full blur-3xl" />

          <div className="relative">
            {/* Étape 0 : input */}
            {!launched && (
              <div className="text-center py-6">
                <label className="block text-sm font-bold uppercase tracking-wider text-joy-ink/60 mb-3">
                  Ton sujet d'ebook
                </label>
                <div className="bg-joy-cream rounded-2xl p-5 mb-6 max-w-2xl mx-auto border-2 border-joy-ink/10 text-left">
                  <span className="text-xl md:text-2xl font-bold text-joy-ink">
                    {typed}
                    <span className="inline-block w-0.5 h-6 bg-joy-ink ml-1 animate-pulse" />
                  </span>
                </div>
                <button
                  onClick={handleLaunch}
                  className="inline-flex items-center gap-3 bg-joy-peach hover:bg-[hsl(var(--joy-peach)/0.85)] text-joy-ink font-black text-lg px-8 py-4 rounded-full shadow-joy hover:scale-105 hover:-rotate-1 transition-all duration-200"
                >
                  <Wand2 className="w-5 h-5" />
                  Lancer la magie
                  <Sparkles className="w-5 h-5" />
                </button>
                <p className="text-sm text-joy-ink/50 mt-4">
                  ⚡ Aperçu animé — la vraie version est encore plus fluide
                </p>
              </div>
            )}

            {/* Étapes animées */}
            {launched && (
              <div className="space-y-6">
                {/* Badge temps */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 bg-joy-sun text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy animate-joy-pop">
                    <Clock className="w-4 h-4" />
                    Temps estimé : 27 secondes ⚡
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-joy-ink/60 hover:text-joy-ink underline"
                  >
                    ↺ Recommencer
                  </button>
                </div>

                {/* Étape 1 : Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[hsl(var(--joy-mint)/0.25)] border-2 border-[hsl(var(--joy-mint))] rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-joy-mint flex items-center justify-center text-joy-ink font-black">
                      1
                    </div>
                    <h3 className="font-black text-joy-ink">Plan généré par P1</h3>
                  </div>
                  <ul className="space-y-2 ml-2">
                    {CHAPITRES.map((c, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: i < chaptersDone ? 1 : 0.3,
                          x: 0,
                        }}
                        className="flex items-start gap-2 text-sm md:text-base text-joy-ink/80"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                            i < chaptersDone ? "text-joy-ink" : "text-joy-ink/20"
                          }`}
                        />
                        <span className={i < chaptersDone ? "" : "text-joy-ink/40"}>{c}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Étape 2 : Rédaction */}
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[hsl(var(--joy-sun)/0.25)] border-2 border-[hsl(var(--joy-sun))] rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-joy-sun flex items-center justify-center text-joy-ink font-black">
                          2
                        </div>
                        <h3 className="font-black text-joy-ink">Chapitre 1 rédigé par P3</h3>
                        <BookOpen className="w-4 h-4 text-joy-ink/60 ml-auto" />
                      </div>
                      <p className="text-joy-ink/80 leading-relaxed text-sm md:text-base font-serif italic">
                        {textTyped}
                        {textTyped.length < TEXTE_CHAPITRE.length && (
                          <span className="inline-block w-0.5 h-4 bg-joy-ink ml-0.5 animate-pulse" />
                        )}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Étape 3 : Couverture */}
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[hsl(var(--joy-lavender)/0.25)] border-2 border-[hsl(var(--joy-lavender))] rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-joy-lavender flex items-center justify-center text-joy-ink font-black">
                          3
                        </div>
                        <h3 className="font-black text-joy-ink">Couverture créée par Imagen 3</h3>
                        <Palette className="w-4 h-4 text-joy-ink/60 ml-auto" />
                      </div>
                      <div className="flex justify-center">
                        <motion.div
                          initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
                          animate={{ rotate: -3, scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 120 }}
                          className="w-44 h-64 md:w-52 md:h-72 rounded-xl shadow-2xl bg-gradient-to-br from-joy-peach via-joy-sun to-joy-lavender p-6 flex flex-col justify-between animate-joy-float relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/10" />
                          <div className="relative">
                            <div className="text-xs font-bold uppercase tracking-widest text-joy-ink/70 mb-2">
                              Le guide essentiel
                            </div>
                            <div className="text-xl md:text-2xl font-black text-joy-ink leading-tight">
                              {SUJETS[sujetIdx].split(" ").slice(0, 3).join(" ")}
                            </div>
                          </div>
                          <div className="relative text-xs font-bold text-joy-ink/80">
                            ✨ Édition 2026
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA final */}
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center pt-4"
                    >
                      <button
                        onClick={onCtaClick}
                        className="inline-flex items-center gap-3 bg-joy-ink hover:bg-joy-ink/90 text-joy-cream font-black text-lg px-8 py-4 rounded-full shadow-joy hover:scale-105 transition-all"
                      >
                        Moi aussi je veux essayer
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-sm text-joy-ink/60 mt-3">
                        67€ à vie · 30 jours satisfait ou remboursé
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoyfulLiveDemo;
