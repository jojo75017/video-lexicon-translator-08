import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Play, Lightbulb, Layers } from "lucide-react";

const videos = [
  {
    id: "5qG4svJ-dfE",
    icon: Layers,
    title: "Les fonctionnalités en détail",
    description:
      "Tour complet des 14 modules IA : de la génération du plan à l'export KDP, chaque onglet expliqué pas à pas.",
  },
];

const HeroVideoTeaser = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-violet-500/10 text-violet-400 border-violet-500/30">
            <Play className="w-3 h-3 mr-1" />
            Vidéos explicatives
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Comprenez{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              exactement ce que vous obtenez
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Avant d'essayer, regardez ces 2 courtes vidéos. Vous verrez pourquoi
            des centaines de créateurs utilisent déjà EbookStudio Pro pour
            publier sur Amazon KDP.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl shadow-violet-500/10 border border-border bg-card aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex gap-3 items-start">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center mt-0.5">
                  <video.icon className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {video.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroVideoTeaser;
