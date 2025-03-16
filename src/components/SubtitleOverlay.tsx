
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ subtitles, currentTime, language }) => {
  const getCurrentSubtitle = () => {
    return subtitles.find(
      (subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );
  };

  const currentSubtitle = getCurrentSubtitle();

  if (!currentSubtitle) return null;

  return (
    <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center space-y-2 p-4 z-30">
      <AnimatePresence mode="wait">
        <motion.div
          key={`original-${currentTime}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-black/75 px-6 py-3 rounded-lg shadow-lg max-w-2xl backdrop-blur-md"
        >
          <p className="text-[#FEC6A1] text-xl font-semibold text-center drop-shadow-sm">
            {currentSubtitle.text}
          </p>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`translation-${currentTime}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-primary/75 px-6 py-3.5 rounded-lg shadow-lg backdrop-blur-md max-w-2xl border border-primary/20"
        >
          <p className="text-[#E5DEFF] text-xl font-semibold text-center drop-shadow-sm">
            {currentSubtitle.translation}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SubtitleOverlay;
