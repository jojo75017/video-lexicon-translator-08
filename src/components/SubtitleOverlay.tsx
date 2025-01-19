import React from 'react';
import { motion } from 'framer-motion';

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
    <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center space-y-2 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-black/75 px-6 py-3 rounded-lg shadow-lg"
      >
        <p className="text-[#FEC6A1] text-xl font-semibold">
          {currentSubtitle.text}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-primary/75 px-6 py-3 rounded-lg shadow-lg"
      >
        <p className="text-[#E5DEFF] text-xl font-semibold">
          {currentSubtitle.translation}
        </p>
      </motion.div>
    </div>
  );
};

export default SubtitleOverlay;