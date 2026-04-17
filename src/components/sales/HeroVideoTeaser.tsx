import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

const HeroVideoTeaser = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Play className="w-3 h-3 mr-1" />
            Vidéo de présentation
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            La <span className="text-primary">révolution Amazon KDP</span> en 90 secondes
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Découvrez comment EbookStudio Pro automatise tout le workflow : du brief à la publication sur KDP.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/20 bg-card aspect-video group"
        >
          <video
            src="/videos/ebookstudio-presentation.mp4"
            controls
            playsInline
            preload="metadata"
            poster=""
            className="absolute inset-0 w-full h-full object-cover"
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>

          {/* Glow accent */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          Démo réelle de la plateforme — aucun trucage
        </motion.p>
      </div>
    </section>
  );
};

export default HeroVideoTeaser;
