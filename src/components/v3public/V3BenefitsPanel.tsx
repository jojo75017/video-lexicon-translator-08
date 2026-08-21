import { Link } from 'react-router-dom';
import { ArrowRight, BookCheck, Feather, Image as ImageIcon, BarChart3 } from 'lucide-react';

const BENEFITS = [
  {
    icon: BookCheck,
    title: 'Un livre complet, prêt pour Amazon',
    text:
      'Manuscrit entier, sommaire propre, chapitres qui se terminent par une vraie phrase, fichiers Word, PDF et EPUB. Pas un brouillon à retravailler pendant trois mois.',
  },
  {
    icon: Feather,
    title: 'Un texte tenu comme en maison d’édition',
    text:
      'Correction en plusieurs passes : style, cohérence, répétitions, mots latins, phrases coupées. Le résultat se lit comme un livre, pas comme une sortie d’IA.',
  },
  {
    icon: ImageIcon,
    title: 'Une couverture qui tient la comparaison',
    text:
      'Formats Kindle, broché avec dos, carré illustré, hardcover. Titre net et lisible, export PDF print-ready avec bleed : le visuel ne trahit pas votre livre.',
  },
  {
    icon: BarChart3,
    title: 'Les données KDP qui font vendre',
    text:
      'Description commerciale, 7 mots-clés, catégories BISAC et prix conseillé. La partie que presque tous les auteurs bâclent est préparée pour vous.',
  },
];

export default function V3BenefitsPanel() {
  return (
    <section id="v3-benefices" className="max-w-7xl mx-auto px-5 md:px-8 py-16 scroll-mt-24">
      <div className="max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: 'var(--v3-gold-600)' }}>
          Le résultat pour vous
        </div>
        <h2 className="v3-serif mt-2 text-3xl md:text-4xl font-semibold" style={{ color: 'var(--v3-emerald)' }}>
          Ce que la V3 vous apporte
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
          Pas des fonctionnalités : des livrables. Voilà ce que vous avez entre les mains à la fin du parcours.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl bg-white p-6"
            style={{ border: '1px solid var(--v3-line)' }}
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-full"
              style={{ background: 'rgba(201,168,76,0.18)', color: '#8a6d1f' }}
            >
              <b.icon className="h-5 w-5" />
            </span>
            <h3 className="v3-serif mt-3 text-[19px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
              {b.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>
              {b.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to="/v3/fonctionnalites" className="v3-btn v3-btn-gold">
          Voir les 12 modules <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/v3/forfaits"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: 'var(--v3-emerald)' }}
        >
          Comparer les deux forfaits <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
