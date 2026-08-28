import { Sparkles, BookOpen, BookMarked, ImageIcon, AudioLines, Tags, ArrowRight } from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD = '#c9a84c';

const PILLS = [
  { label: 'Kindle', icon: BookOpen },
  { label: 'Livre broché', icon: BookMarked },
  { label: 'Couverture', icon: ImageIcon },
  { label: 'Livre audio', icon: AudioLines },
  { label: 'Métadonnées', icon: Tags },
];

/** Premier module de l'accueil V3 — accroche « agent d'édition IA multi-modèle ». */
export default function V3HeroBanner({ className = '' }: { className?: string }) {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${EMERALD} 0%, #053e2f 55%, #0a5a45 100%)`,
        borderBottom: `1px solid ${GOLD}66`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14 text-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: GOLD, background: `${GOLD}1A`, border: `1px solid ${GOLD}66` }}
        >
          <Sparkles className="w-3 h-3" /> Ebookstudio V3
        </span>

        <h1
          className="v3-serif mt-5 font-semibold leading-[1.1] text-[28px] md:text-[40px]"
          style={{ color: '#fffaf0', textShadow: '0 2px 14px rgba(3,32,24,0.6)' }}
        >
          Votre agent d'édition IA{' '}
          <span className="italic" style={{ color: GOLD }}>multi-modèle</span>
        </h1>

        <p className="mt-4 mx-auto max-w-2xl text-[15px] md:text-[16.5px] leading-relaxed text-white/90">
          Transformez une simple idée de livre en un package complet prêt pour Amazon :
          Kindle, livre broché, couverture, livre audio et métadonnées.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PILLS.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${GOLD}55`, color: '#f5f0e0' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: GOLD }} /> {label}
            </li>
          ))}
        </ul>

        <a href="#moteurs-ia-v3" className="v3-btn v3-btn-gold mt-7 text-[13.5px]">
          Découvrir les moteurs <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
