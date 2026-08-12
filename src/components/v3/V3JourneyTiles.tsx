import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSISTANT_JOURNEY } from '@/data/assistantKnowledge';

/**
 * Onglets illustrés du parcours livre : Plan → Écrire → Habiller → Publier → Vendre,
 * plus l'accès à l'atelier complet. Chaque vignette ouvre directement l'outil.
 */
const V3JourneyTiles = ({ title = 'Où voulez-vous aller ?' }: { title?: string }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Les 5 étapes de votre livre, et tous les outils au même endroit.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {ASSISTANT_JOURNEY.map((j) => (
          <Link
            key={j.id}
            to={j.route}
            className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="relative h-24">
              <img
                src={j.image}
                alt={j.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-sm font-bold text-background flex items-center gap-1">
                <span>{j.emoji}</span> {j.label}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[11.5px] leading-snug text-muted-foreground line-clamp-2">{j.tagline}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary">
                Ouvrir <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default V3JourneyTiles;
