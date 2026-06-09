import { useState } from "react";
import { Play } from "lucide-react";

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

export default function VideoPlaylistCarousel() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className="py-12 md:py-16 px-4 border-b border-border bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            En vidéo
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            Découvrez EbookStudio en 5 courtes vidéos
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:thin]">
          {VIDEOS.map((v, i) => (
            <div
              key={v.id}
              className="snap-start shrink-0 w-[260px] sm:w-[300px]"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-foreground/5 shadow-sm">
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
                    className="group absolute inset-0 w-full h-full"
                    aria-label={`Lire : ${v.title}`}
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </span>
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground line-clamp-2">
                <span className="text-primary mr-1">{i + 1}.</span>
                {v.title}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-primary hover:text-accent transition-colors"
          >
            Voir toute la playlist sur YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}
