import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ebookTeaser from "@/assets/ebook-teaser.mp4";

const HeroVideoTeaser = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto my-12 px-4"
    >
      <div className="text-center mb-6">
        <Badge className="mb-3 bg-violet-500/10 text-violet-400 border-violet-500/30">
          <Play className="w-3 h-3 mr-1" />
          Aperçu en vidéo
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
          Découvrez{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            EbookStudio Pro
          </span>{" "}
          en action
        </h3>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/10 bg-slate-900 group">
        <video
          ref={videoRef}
          src={ebookTeaser}
          muted={isMuted}
          loop
          playsInline
          className="w-full aspect-video object-cover"
          onEnded={() => setIsPlaying(false)}
        />

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-violet-500/90 transition-colors shadow-2xl">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Controls */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Pause className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        🎬 Créez des ebooks professionnels en quelques minutes avec l'IA
      </p>
    </motion.div>
  );
};

export default HeroVideoTeaser;
