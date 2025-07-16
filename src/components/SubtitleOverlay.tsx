
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit, Copy, Volume2, Settings, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
}

interface SubtitleOverlayProps {
  subtitles: Subtitle[];
  currentTime: number;
  language: string;
  onSkipForward?: () => void;
  onSkipBack?: () => void;
  onEditSubtitle?: (subtitle: Subtitle, index: number) => void;
}

const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ 
  subtitles, 
  currentTime, 
  language,
  onSkipForward,
  onSkipBack,
  onEditSubtitle
}) => {
  const [showControls, setShowControls] = useState(false);
  const [langPreference, setLangPreference] = useState<'original' | 'translation' | 'both'>('both');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [flashAnimation, setFlashAnimation] = useState(false);

  const getCurrentSubtitleIndex = () => {
    return subtitles.findIndex(
      (subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );
  };

  const currentSubtitleIndex = getCurrentSubtitleIndex();
  const currentSubtitle = currentSubtitleIndex >= 0 ? subtitles[currentSubtitleIndex] : null;

  const copySubtitleText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Texte copié dans le presse-papier");
        setFlashAnimation(true);
        setTimeout(() => setFlashAnimation(false), 800);
      })
      .catch(() => {
        toast.error("Impossible de copier le texte");
      });
  };

  const handleEdit = () => {
    if (currentSubtitle && currentSubtitleIndex >= 0 && onEditSubtitle) {
      onEditSubtitle(currentSubtitle, currentSubtitleIndex);
    }
  };

  const toggleLangPreference = () => {
    const options: Array<'original' | 'translation' | 'both'> = ['original', 'translation', 'both'];
    const currentIndex = options.indexOf(langPreference);
    const nextIndex = (currentIndex + 1) % options.length;
    setLangPreference(options[nextIndex]);
    
    const messages = {
      'original': "Affichage des sous-titres originaux uniquement",
      'translation': "Affichage de la traduction uniquement",
      'both': "Affichage des deux langues"
    };
    
    toast.info(messages[options[nextIndex]]);
  };

  if (!currentSubtitle || !showSubtitles) return null;

  return (
    <div 
      className="absolute bottom-16 left-0 right-0 flex flex-col items-center space-y-3 p-4 z-30"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Contrôles des sous-titres */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/80 rounded-full backdrop-blur-md px-4 py-1.5 flex gap-2"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                  >
                    {showSubtitles ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{showSubtitles ? "Masquer les sous-titres" : "Afficher les sous-titres"}</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={toggleLangPreference}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Changer la langue ({langPreference})</TooltipContent>
              </Tooltip>
              
              {onSkipBack && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                      onClick={onSkipBack}
                    >
                      <SkipBack className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Sous-titre précédent</TooltipContent>
                </Tooltip>
              )}
              
              {onSkipForward && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                      onClick={onSkipForward}
                    >
                      <SkipForward className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Sous-titre suivant</TooltipContent>
                </Tooltip>
              )}
              
              {onEditSubtitle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                      onClick={handleEdit}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Modifier le sous-titre</TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => copySubtitleText(`${currentSubtitle.text}\n${currentSubtitle.translation}`)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Copier le texte</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Paramètres des sous-titres</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sous-titres */}
      {(langPreference === 'original' || langPreference === 'both') && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`original-${currentSubtitleIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: flashAnimation ? 1.05 : 1,
              transition: { 
                scale: { duration: 0.2 } 
              }
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-black/75 px-6 py-3 rounded-lg shadow-lg max-w-2xl backdrop-blur-md border border-gray-700/50 group relative"
          >
            <p className="text-[#FEC6A1] text-xl font-semibold text-center drop-shadow-sm">
              {currentSubtitle.text}
            </p>
            
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => copySubtitleText(currentSubtitle.text)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {(langPreference === 'translation' || langPreference === 'both') && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`translation-${currentSubtitleIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: flashAnimation ? 1.05 : 1,
              transition: { 
                scale: { duration: 0.2 } 
              }
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary/75 px-6 py-3.5 rounded-lg shadow-lg backdrop-blur-md max-w-2xl border border-primary/20 group relative"
          >
            <p className="text-[#E5DEFF] text-xl font-semibold text-center drop-shadow-sm">
              {currentSubtitle.translation}
            </p>
            
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => copySubtitleText(currentSubtitle.translation)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SubtitleOverlay;
