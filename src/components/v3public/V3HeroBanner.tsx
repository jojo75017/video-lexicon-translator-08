import { Sparkles, BookOpen, BookMarked, ImageIcon, AudioLines, Tags, ArrowRight } from 'lucide-react';

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
        background: 'var(--v3-ivory)',
        borderBottom: '1px solid var(--v3-line)',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--v3-gold), transparent)' }} />

      <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14 text-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--v3-gold-600)', background: 'var(--v3-gold-soft)', border: '1px solid color-mix(in srgb, var(--v3-gold) 45%, transparent)' }}
        >
          <Sparkles className="w-3 h-3" /> Ebookstudio V3
        </span>

        <h1
          className="v3-serif mt-5 font-semibold leading-[1.1] text-[28px] md:text-[40px]"
          style={{ color: 'var(--v3-editorial-ink)' }}
        >
          Votre agent d'édition IA{' '}
          <span className="italic" style={{ color: 'var(--v3-emerald)' }}>multi-modèle</span>
        </h1>

        <p className="mt-4 mx-auto max-w-2xl text-[15px] md:text-[16.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          Transformez une simple idée de livre en un package complet prêt pour Amazon :
          Kindle, livre broché, couverture, livre audio et métadonnées.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PILLS.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ background: 'var(--v3-paper)', border: '1px solid var(--v3-line)', color: 'var(--v3-editorial-ink-soft)' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: 'var(--v3-gold-600)' }} /> {label}
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
