import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import AgentAvatar from '@/components/v3public/AgentAvatar';
import { V3_AGENTS } from '@/data/v3Agents';

type Item = {
  emoji: string;
  title: string;
  desc: string;
  to: string;
  cta: string;
  badge?: string;
};

/** Les deux nouveautés qui mènent tout : le Sommaire IA et les 26 agents spécialisés. */
const HEADLINE: Item[] = [
  {
    emoji: '✨',
    title: 'Sommaire IA — le meneur du livre',
    desc: "Vous dictez vos idées en vrac, l'IA les corrige et les transforme en plan chapitre par chapitre. Ce plan pilote ensuite la rédaction, la correction et l'export : plus de sommaire en double, plus de 80 chapitres quand vous en demandez 40.",
    to: '/v3/create?sommaire=ia',
    cta: 'Construire mon sommaire',
    badge: 'Commencez ici',
  },
  {
    emoji: '🤖',
    title: '26 agents — un par type de livre',
    desc: "Roman, cuisine, voyage, enfants, coloriage, BD, atlas, jeux, agenda, biographie… Chaque agent connaît les codes de sa catégorie, son format KDP et son style : vous choisissez votre agent, il écrit avec vous.",
    to: '/v3/commence-ici',
    cta: 'Choisir mon agent',
    badge: '26 agents',
  },
];

/** Les autres améliorations récentes, en format court. */
const MORE: Item[] = [
  {
    emoji: '🧹',
    title: 'Correction professionnelle',
    desc: '4 passes éditoriales : latin supprimé, fins de chapitre terminées par une vraie phrase, style maison d’édition.',
    to: '/v3/corriger',
    cta: 'Corriger un livre',
  },
  {
    emoji: '🎨',
    title: 'Couvertures aux formats exacts',
    desc: 'Kindle et broché normalisés automatiquement (recto/verso, dos calculé) — plus de ratio bancal.',
    to: '/v3/studio-v4',
    cta: 'Ouvrir Cover Studio',
  },
  {
    emoji: '🌍',
    title: 'Traduction 10 langues',
    desc: 'Choisissez la langue dès le départ, ou traduisez un livre existant pour ouvrir de nouveaux marchés.',
    to: '/v3/outils/traduction',
    cta: 'Traduire mon livre',
  },
  {
    emoji: '🎬',
    title: 'ContentStudio Engine',
    desc: 'Votre livre devient un cours vidéo : script, voix off et montage automatiques.',
    to: '/v3/contentstudio',
    cta: 'Voir ContentStudio',
  },
  {
    emoji: '📚',
    title: 'Aperçu du livre en direct',
    desc: 'Le manuscrit s’affiche à côté pendant l’écriture : version brute ou version corrigée, au choix.',
    to: '/v3/library',
    cta: 'Mes livres',
  },
  {
    emoji: '🚀',
    title: 'Données KDP + export propre',
    desc: 'Titre, sous-titre, description, mots-clés, catégories et fichiers prêts à téléverser sur Amazon.',
    to: '/v3/donnees-kdp',
    cta: 'Voir les données KDP',
  },
];

export default function V3WhatsNewPanel() {
  const avatars = ['margaux', 'leandre', 'noemie', 'zoe', 'victor'];

  return (
    <section className="v3-shell pt-8" id="nouveautes">
      <div
        className="rounded-3xl overflow-hidden"
        style={{ border: '1px solid var(--v3-joy-orange-soft)', background: 'var(--v3-joy-cream)' }}
      >
        <div className="px-6 md:px-10 py-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--v3-joy-orange-600)' }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.24em]"
              style={{ color: 'var(--v3-joy-orange-600)' }}
            >
              Ce qui a changé
            </span>
          </div>
          <h2 className="v3-serif mt-2 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: 'var(--v3-joy-ink)' }}>
            Les nouveautés de la V3
          </h2>
          <p className="mt-2 max-w-3xl text-[14px]" style={{ color: 'var(--v3-joy-muted)' }}>
            Le studio a beaucoup évolué. Deux nouveautés changent tout : le{' '}
            <strong style={{ color: 'var(--v3-joy-ink)' }}>Sommaire IA</strong>, qui mène le livre du début à la fin,
            et les <strong style={{ color: 'var(--v3-joy-ink)' }}>26 agents spécialisés par type de livre</strong>.
          </p>
        </div>

        {/* Les deux nouveautés majeures */}
        <div className="grid gap-4 px-6 pb-6 md:grid-cols-2 md:px-10">
          {HEADLINE.map((it) => (
            <Link
              key={it.title}
              to={it.to}
              className="group flex flex-col rounded-2xl bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ border: '1px solid var(--v3-joy-orange-soft)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{it.emoji}</span>
                {it.badge && (
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ background: 'var(--v3-joy-orange-soft)', color: 'var(--v3-joy-orange-600)' }}
                  >
                    {it.badge}
                  </span>
                )}
              </div>
              <h3
                className="v3-serif mt-3 text-xl font-semibold leading-snug"
                style={{ color: 'var(--v3-joy-ink)' }}
              >
                {it.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--v3-joy-muted)' }}>
                {it.desc}
              </p>

              {it.to === '/v3/commence-ici' && (
                <span className="mt-4 flex items-center -space-x-2">
                  {avatars.map((id) => {
                    const a = V3_AGENTS.find((x) => x.id === id);
                    if (!a) return null;
                    return (
                      <span key={id} className="rounded-full ring-2 ring-white bg-white">
                        <AgentAvatar seed={a.id} accent={a.accent} robot={a.robot} size={34} />
                      </span>
                    );
                  })}
                </span>
              )}

              <span
                className="v3-btn v3-joy-cta mt-5 inline-flex w-fit items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold"
              >
                {it.cta}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        {/* Les autres améliorations */}
        <div className="px-6 md:px-10 pb-8">
          <div
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: 'var(--v3-joy-orange-600)' }}
          >
            Et aussi, depuis la dernière version
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MORE.map((it) => (
              <Link
                key={it.title}
                to={it.to}
                className="group rounded-2xl bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: '1px solid var(--v3-joy-orange-soft)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{it.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold" style={{ color: 'var(--v3-joy-ink)' }}>
                      {it.title}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--v3-joy-muted)' }}>
                      {it.desc}
                    </p>
                    <span
                      className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold"
                      style={{ color: 'var(--v3-joy-orange-600)' }}
                    >
                      {it.cta}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
