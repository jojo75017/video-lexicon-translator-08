import { Link } from 'react-router-dom';
import { ArrowRight, Feather, BookOpen, Rocket, Quote } from 'lucide-react';

/** Contenu éditorial de l'accueil abonné : conseils rédigés, liés aux pages existantes. */
const ARTICLES = [
  {
    icon: Feather,
    color: '#EA580C',
    tag: 'Écrire',
    title: 'Un bon livre commence par un bon sommaire',
    text: "Avant d'écrire la première ligne, prenez dix minutes pour poser vos chapitres. Un plan clair évite les répétitions, garde le fil et rend la rédaction deux fois plus rapide.",
    to: '/v3/outils/sommaire-ultime',
    cta: 'Préparer mon sommaire',
  },
  {
    icon: BookOpen,
    color: '#2563EB',
    tag: 'Relire',
    title: 'Relire à voix haute, le secret des auteurs',
    text: "Une phrase qui accroche à l'oral accroche aussi le lecteur. Relisez chaque chapitre lentement, puis confiez la correction fine à Victor pour l'orthographe et le style.",
    to: '/v3/corriger',
    cta: 'Corriger un chapitre',
  },
  {
    icon: Rocket,
    color: '#059669',
    tag: 'Publier',
    title: 'Sur Amazon, la fiche compte autant que le livre',
    text: "Titre, sous-titre, description et mots-clés décident si un lecteur clique. Soignez-les comme une vitrine : c'est ce que l'acheteur voit en premier.",
    to: '/v3/kdp/fiche-audit',
    cta: 'Vérifier ma fiche KDP',
  },
];

export default function V3SubscriberEditorial() {
  return (
    <section className="v3-shell py-10 md:py-14">
      <div className="text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: 'rgba(246,189,42,0.12)', color: '#F6BD2A' }}
        >
          Le carnet de l'auteur
        </span>
        <h2 className="v3-serif mt-3 text-2xl font-semibold md:text-3xl" style={{ color: '#F3EDE6' }}>
          Conseils pour écrire, relire et publier
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm" style={{ color: '#B9AFA6' }}>
          Trois réflexes simples à garder en tête, à chaque étape de votre livre.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {ARTICLES.map(({ icon: Icon, color, tag, title, text, to, cta }) => (
          <article
            key={title}
            className="flex flex-col rounded-2xl p-6"
            style={{ background: '#332E2B', border: `1px solid ${color}55`, borderTop: `4px solid ${color}` }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: `${color}26`, color }}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color }}>{tag}</span>
            </div>
            <h3 className="v3-serif mt-4 text-xl font-semibold leading-snug" style={{ color: '#F3EDE6' }}>{title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: '#D6CCC2' }}>{text}</p>
            <Link to={to} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color }}>
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>

      <figure
        className="mx-auto mt-8 max-w-3xl rounded-2xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg,#1A1614,#332E2B)', border: '1px solid rgba(246,189,42,0.3)' }}
      >
        <Quote className="mx-auto h-6 w-6" style={{ color: '#F6BD2A' }} />
        <blockquote className="v3-serif mt-3 text-lg italic md:text-xl" style={{ color: '#F3EDE6' }}>
          « Le premier jet n'a pas besoin d'être parfait, il a seulement besoin d'exister. »
        </blockquote>
        <figcaption className="mt-3 text-xs uppercase tracking-[0.16em]" style={{ color: '#B9AFA6' }}>
          Le mot de l'équipe EbookStudio
        </figcaption>
        <Link to="/v3/tutoriels-v3" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#F6BD2A' }}>
          Voir les tutoriels de A à Z <ArrowRight className="h-4 w-4" />
        </Link>
      </figure>
    </section>
  );
}
