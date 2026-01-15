import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Quote, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  quote: string;
  result: string;
  videoUrl?: string; // Placeholder for future video URLs
}

const testimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "Marie D.",
    role: "Auteure Kindle",
    avatar: "MD",
    color: "from-pink-500 to-rose-500",
    quote: "J'ai créé 5 ebooks en 1 mois grâce à ce générateur. Mes revenus KDP ont triplé !",
    result: "+300% revenus",
  },
  {
    id: "2",
    name: "Thomas L.",
    role: "Entrepreneur",
    avatar: "TL",
    color: "from-blue-500 to-cyan-500",
    quote: "L'outil parfait pour créer du contenu premium rapidement. ROI immédiat.",
    result: "5 ebooks/mois",
  },
  {
    id: "3",
    name: "Sophie R.",
    role: "Coach Business",
    avatar: "SR",
    color: "from-violet-500 to-purple-500",
    quote: "La formation audio incluse m'a permis de comprendre toute la stratégie ebook.",
    result: "1er ebook 7 jours",
  },
];

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/30">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Témoignages Clients
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ils ont transformé leur écriture avec{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              EbookStudio Pro
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les résultats de nos utilisateurs qui ont publié leur premier ebook en quelques jours.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-white/10 bg-slate-900/50 hover:border-violet-500/30 transition-all group">
                {/* Video Placeholder / Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-20`} />
                  
                  {/* Avatar in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}>
                      {testimonial.avatar}
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Result badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-emerald-500/90 text-white border-0 shadow-lg">
                      {testimonial.result}
                    </Badge>
                  </div>

                  {/* Coming soon indicator */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-black/50 text-white/80 border-0 text-xs">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Audio bientôt
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Quote */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-1 -left-1 w-6 h-6 text-violet-500/30" />
                    <p className="text-sm text-foreground/90 pl-5 italic">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicator */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-emerald-400 font-semibold">+150 auteurs</span> ont déjà publié avec EbookStudio Pro
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
