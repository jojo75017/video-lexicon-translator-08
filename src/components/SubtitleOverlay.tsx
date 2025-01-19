import React from 'react';

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
      <div className="bg-black/75 px-4 py-2 rounded-lg">
        <p className="text-white text-lg font-semibold">
          {currentSubtitle.text}
        </p>
      </div>
      <div className="bg-primary/75 px-4 py-2 rounded-lg">
        <p className="text-white text-lg font-semibold">
          {currentSubtitle.translation}
        </p>
      </div>
    </div>
  );
};

export default SubtitleOverlay;