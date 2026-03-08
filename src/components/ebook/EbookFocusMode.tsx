import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Play, Pause, RotateCcw, Maximize2, Minimize2, Coffee, Target, Clock, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface EbookFocusModeProps {
  onClose: () => void;
  initialContent?: string;
  wordGoal?: number;
}

const ambientSounds = [
  { id: 'none', label: 'Silence', emoji: '🔇' },
  { id: 'rain', label: 'Pluie', emoji: '🌧️' },
  { id: 'fire', label: 'Feu de cheminée', emoji: '🔥' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

export const EbookFocusMode: React.FC<EbookFocusModeProps> = ({ onClose, initialContent = '', wordGoal = 1000 }) => {
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedSound, setSelectedSound] = useState('none');
  const [sessionWords, setSessionWords] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startWordsRef = useRef(0);

  useEffect(() => {
    startWordsRef.current = content.split(/\s+/).filter(Boolean).length;
  }, []);

  const currentWords = content.split(/\s+/).filter(Boolean).length;
  const wordsWritten = Math.max(0, currentWords - startWordsRef.current + sessionWords);
  const goalProgress = Math.min(100, Math.round((wordsWritten / wordGoal) * 100));

  // Pomodoro timer
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          if (isBreak) {
            setIsBreak(false);
            setPomodoroTime(25 * 60);
            toast.success('☕ Pause terminée ! On reprend.');
          } else {
            setPomodoroCount(c => c + 1);
            setIsBreak(true);
            setPomodoroTime(5 * 60);
            toast.success('🍅 Pomodoro terminé ! Prenez 5 min de pause.');
          }
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isBreak]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setIsBreak(false);
    setPomodoroTime(25 * 60);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          {/* Pomodoro */}
          <div className="flex items-center gap-2">
            <Badge variant={isBreak ? 'secondary' : 'outline'} className="font-mono text-sm px-3">
              {isBreak ? '☕' : '🍅'} {formatTime(pomodoroTime)}
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetTimer}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            {pomodoroCount > 0 && <span className="text-xs text-muted-foreground">×{pomodoroCount}</span>}
          </div>

          {/* Ambient sounds */}
          <div className="flex items-center gap-1">
            {ambientSounds.map(s => (
              <Button key={s.id} variant={selectedSound === s.id ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-2" onClick={() => setSelectedSound(s.id)}>
                {s.emoji}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Word count */}
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{currentWords}</span> mots
            <span className="mx-1">·</span>
            <span className="text-green-500 font-medium">+{wordsWritten}</span> cette session
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Word goal progress */}
      <div className="px-4 py-1.5 border-b bg-muted/10">
        <div className="flex items-center gap-3">
          <Target className="h-3.5 w-3.5 text-primary" />
          <Progress value={goalProgress} className="flex-1 h-1.5" />
          <span className="text-xs text-muted-foreground">{wordsWritten}/{wordGoal} mots</span>
          {goalProgress >= 100 && <Badge className="text-[10px] bg-green-500">🎉 Objectif atteint !</Badge>}
        </div>
      </div>

      {/* Writing area */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full max-w-3xl h-full p-8 md:p-12 bg-transparent border-0 outline-none resize-none text-lg leading-relaxed focus:ring-0"
          placeholder="Commencez à écrire... (Échap pour quitter)"
          autoFocus
          spellCheck
        />
      </div>
    </div>
  );
};

export default EbookFocusMode;
