import {
  Rocket, PenLine, Link2, Briefcase, Building2, GraduationCap,
  MonitorPlay, Video, BookOpen, Lightbulb,
} from 'lucide-react';

const EMERALD = '#064e3b';
const GOLD_DEEP = '#8a6d16';
const GOLD = '#c9a84c';
const LINE = 'rgba(6,78,59,0.14)';

const PROFILES = [
  { icon: Rocket, title: 'Débutants KDP', desc: 'Se lancer sur Amazon sans savoir par où commencer.' },
  { icon: PenLine, title: 'Auteurs pressés', desc: 'Créer des livres plus vite, sans sacrifier la qualité.' },
  { icon: Link2, title: 'Marketeurs d\u2019affiliation', desc: 'Des livres qui alimentent une audience et des offres.' },
  { icon: Briefcase, title: 'Indépendants', desc: 'Ajouter une prestation d\u2019édition à leurs services.' },
  { icon: Building2, title: 'Agences', desc: 'Produire des livres pour leurs clients, à la chaîne.' },
  { icon: GraduationCap, title: 'Coachs & experts', desc: 'Transformer leur savoir en livre de référence.' },
  { icon: MonitorPlay, title: 'Créateurs de cours', desc: 'Un livre pour appuyer et vendre leurs formations.' },
  { icon: Video, title: 'Créateurs de contenu', desc: 'Décliner leurs contenus en ouvrages publiables.' },
  { icon: BookOpen, title: 'Auteurs autoédités', desc: 'Un atelier complet, de l\u2019idée à la publication.' },
  { icon: Lightbulb, title: 'Ceux qui n\u2019écrivent pas', desc: 'Une idée suffit : l\u2019atelier fait le reste.' },
];

/** Section « À qui cela s'adresse-t-il ? » — informative, non cliquable. */
export default function V3AudiencePanel({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-5 md:px-8 py-12 ${className}`}>
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: GOLD_DEEP }}>
          Pour qui
        </div>
        <h2 className="v3-serif mt-2 text-2xl md:text-3xl font-semibold" style={{ color: EMERALD }}>
          À qui cela s'adresse-t-il&nbsp;?
        </h2>
      </div>

      <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {PROFILES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-white p-4" style={{ border: `1px solid ${LINE}` }}>
            <span
              className="grid place-items-center w-9 h-9 rounded-xl"
              style={{ background: `${EMERALD}0F`, border: `1px solid ${GOLD}55`, color: EMERALD }}
            >
              <Icon className="w-4.5 h-4.5" />
            </span>
            <div className="v3-serif mt-3 text-[15.5px] font-semibold leading-tight" style={{ color: EMERALD }}>
              {title}
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center v3-serif text-[17px] md:text-[19px] font-semibold" style={{ color: EMERALD }}>
        Si vous souhaitez créer un catalogue d'édition, Ebookstudio V3 vous fournit le système.
      </p>
    </section>
  );
}
