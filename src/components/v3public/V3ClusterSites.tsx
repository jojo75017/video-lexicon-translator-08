import { ExternalLink, BookOpen, PenLine } from 'lucide-react';

/** Les deux sites de Georges réalisés avec EbookStudio, affichés sous la galerie des couvertures. */
const SITES = [
  {
    name: 'ebookcluster.com',
    url: 'https://ebookcluster.com',
    icon: BookOpen,
    color: '#EA580C',
    tag: 'Le site des livres',
    title: 'Une vitrine pour tous mes livres',
    text: "Toutes mes publications réunies au même endroit : couvertures, résumés et liens d'achat. Les livres, les couvertures et les textes ont été préparés avec EbookStudio.",
  },
  {
    name: 'blogcluster.com',
    url: 'https://blogcluster.com',
    icon: PenLine,
    color: '#2563EB',
    tag: 'Les histoires audio',
    title: 'Mes livres audio, réalisés avec cet outil',
    text: "Sur BlogCluster, ce sont mes histoires audio qui prennent la parole : écoutez un extrait, entrez dans l'univers, puis explorez les histoires complètes. Tout a été écrit et voicé avec EbookStudio — vous aussi, vous pouvez le faire vous-même.",
  },
];

export default function V3ClusterSites() {
  return (
    <section className="v3-shell py-10 md:py-12">
      <div className="text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: 'rgba(246,189,42,0.12)', color: '#F6BD2A' }}
        >
          Réalisé avec EbookStudio
        </span>
        <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: '#F3EDE6' }}>
          Mes deux sites, faits avec cet outil
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#B9AFA6' }}>
          Publier un livre, c'est bien. Le faire vivre, c'est mieux. Voici comment j'utilise moi-même
          EbookStudio pour présenter mes livres et donner à écouter mes histoires audio, sans agence ni publicité coûteuse.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
        {SITES.map(({ name, url, icon: Icon, color, tag, title, text }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-1"
            style={{ background: '#332E2B', border: `1px solid ${color}55`, borderTop: `4px solid ${color}` }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: `${color}26`, color }}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color }}>{tag}</div>
                <div className="text-lg font-bold" style={{ color: '#F3EDE6' }}>{name}</div>
              </div>
            </div>
            <h3 className="v3-serif mt-4 text-xl font-semibold" style={{ color: '#F3EDE6' }}>{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: '#D6CCC2' }}>{text}</p>
            <span
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: color, color: '#FFFFFF' }}
            >
              Visiter {name} <ExternalLink className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
