import { useRef, useState } from "react";
import { Play, ChevronLeft, ChevronRight, Youtube } from "lucide-react";

const PLAYLIST_ID = "PL0O88EpaooEZwDTo_p69o1-LdCHlS2YHl";

interface VideoItem {
  id: string;
  title: string;
}

// Vidéos de la playlist YouTube (ordre de la playlist)
const VIDEOS: VideoItem[] = [
  { id: "NF7H9wUyi9o", title: "Créer & publier un livre KDP avec l'IA" },
  { id: "4h_ex9Amdus", title: "Le manuscrit généré par 15 agents IA" },
  { id: "jV-40dkxQvw", title: "Couverture & visuels premium" },
  { id: "gtJPR_w3r7c", title: "Audiobook & déclinaisons" },
  { id: "k91fCwp2XZc", title: "Mots-clés, marketing & publication" },
];

function Thumb({ id, title }: { id: string; title: string }) {
  // maxresdefault peut être absent → fallback hqdefault
  const [src, setSrc] = useState(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  );
}

export default function VideoPlaylistCarousel() {
  const [playing, setPlaying] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 md:py-20 px-4 border-b border-border bg-gradient-to-b from-secondary/40 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            <Youtube className="w-4 h-4" /> En vidéo
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-foreground">
            Découvrez EbookStudio en 5 courtes vidéos
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            De l'idée au livre publié : suivez le workflow complet pas à pas.
          </p>
        </div>

        <div className="relative">
          {/* Flèches */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Précédent"
            className="hidden md:flex absolute -left-4 top-[38%] z-10 items-center justify-center w-11 h-11 rounded-full bg-card border border-border shadow-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Suivant"
            className="hidden md:flex absolute -right-4 top-[38%] z-10 items-center justify-center w-11 h-11 rounded-full bg-card border border-border shadow-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((v, i) => (
              <div
                key={v.id}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-foreground/5 shadow-md group-hover:shadow-xl transition-shadow">
                  {playing === v.id ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1&list=${PLAYLIST_ID}&rel=0`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(v.id)}
                      className="absolute inset-0 w-full h-full"
                      aria-label={`Lire : ${v.title}`}
                    >
                      <Thumb id={v.id} title={v.title} />
                      <span className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-primary/90 backdrop-blur text-primary-foreground shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      </span>
                      <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-foreground border border-border">
                        {i + 1}/{VIDEOS.length}
                      </span>
                    </button>
                  )}
                </div>
                <p className="mt-3 text-sm font-bold text-foreground line-clamp-2 leading-snug">
                  {v.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors"
          >
            <Youtube className="w-4 h-4" /> Voir toute la playlist sur YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}
