import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Keyboard, Maximize2, Save, Eye, Moon, Sun, Zap, History, Focus } from 'lucide-react';
import { toast } from 'sonner';

interface KeyboardShortcut {
  keys: string;
  description: string;
  action: string;
}

const shortcuts: KeyboardShortcut[] = [
  { keys: 'Ctrl+S', description: 'Sauvegarder le projet', action: 'save' },
  { keys: 'Ctrl+Shift+F', description: 'Mode plein écran', action: 'fullscreen' },
  { keys: 'Ctrl+Shift+P', description: 'Prévisualiser', action: 'preview' },
  { keys: 'Ctrl+Shift+D', description: 'Mode focus (sans distraction)', action: 'focus' },
  { keys: 'Ctrl+B', description: 'Gras', action: 'bold' },
  { keys: 'Ctrl+I', description: 'Italique', action: 'italic' },
  { keys: 'Ctrl+U', description: 'Souligné', action: 'underline' },
  { keys: 'Ctrl+Z', description: 'Annuler', action: 'undo' },
  { keys: 'Ctrl+Shift+Z', description: 'Rétablir', action: 'redo' },
  { keys: 'F11', description: 'Plein écran navigateur', action: 'browser-fullscreen' },
];

interface EbookUXEnhancementsProps {
  onSave?: () => void;
  onTogglePreview?: () => void;
  onToggleFocus?: () => void;
  autoSaveEnabled?: boolean;
  lastSaved?: Date | null;
  isDirty?: boolean;
}

export const EbookUXEnhancements: React.FC<EbookUXEnhancementsProps> = ({
  onSave,
  onTogglePreview,
  onToggleFocus,
  autoSaveEnabled: initialAutoSave = true,
  lastSaved,
  isDirty = false,
}) => {
  const [autoSave, setAutoSave] = useState(initialAutoSave);
  const [focusMode, setFocusMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saveHistory, setSaveHistory] = useState<string[]>([]);
  const [writingGoal, setWritingGoal] = useState({ daily: 1000, current: 0 });
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setSessionTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-save simulation
  useEffect(() => {
    if (!autoSave || !isDirty) return;
    const timeout = setTimeout(() => {
      onSave?.();
      setSaveHistory(prev => [new Date().toLocaleTimeString(), ...prev].slice(0, 10));
    }, 30000);
    return () => clearTimeout(timeout);
  }, [autoSave, isDirty, onSave]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave?.();
        toast.success('Sauvegardé !');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setFocusMode(prev => !prev);
        onToggleFocus?.();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        onTogglePreview?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSave, onTogglePreview, onToggleFocus]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-primary/10"><Zap className="h-6 w-6 text-primary" /></div>
            Centre de Productivité
            <Badge className="bg-primary/10 text-primary border-primary/30">UX PRO</Badge>
          </CardTitle>
          <CardDescription>Raccourcis clavier, mode focus, timer de session et sauvegarde automatique</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Session timer */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><History className="h-4 w-4" /> Timer de session</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">{formatTime(sessionTimer)}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant={isTimerRunning ? 'destructive' : 'default'} onClick={() => setIsTimerRunning(!isTimerRunning)}>
                {isTimerRunning ? 'Pause' : 'Démarrer'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setSessionTimer(0); setIsTimerRunning(false); }}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto-save settings */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Save className="h-4 w-4" /> Sauvegarde Auto</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Activer (toutes les 30s)</Label>
              <Checkbox checked={autoSave} onCheckedChange={(v) => setAutoSave(!!v)} />
            </div>
            <div className="text-xs text-muted-foreground">
              {lastSaved ? `Dernière sauvegarde: ${lastSaved.toLocaleTimeString()}` : 'Pas encore sauvegardé'}
            </div>
            {isDirty && <Badge variant="outline" className="text-xs">Modifications non sauvées</Badge>}
            {saveHistory.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium">Historique :</p>
                {saveHistory.slice(0, 5).map((time, i) => (
                  <p key={i} className="text-xs text-muted-foreground">💾 {time}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Focus mode */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Focus className="h-4 w-4" /> Mode Focus</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Sans distraction</Label>
              <Checkbox checked={focusMode} onCheckedChange={(v) => { setFocusMode(!!v); onToggleFocus?.(); }} />
            </div>
            <p className="text-xs text-muted-foreground">
              Masque la sidebar, les notifications et les barres d'outils secondaires
            </p>
            <Badge variant={focusMode ? 'default' : 'secondary'} className="text-xs">
              {focusMode ? '🎯 Focus activé' : '📋 Mode normal'}
            </Badge>
          </CardContent>
        </Card>

        {/* Daily goal */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">🎯 Objectif du jour</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={writingGoal.daily}
                onChange={e => setWritingGoal(prev => ({ ...prev, daily: parseInt(e.target.value) || 0 }))}
                className="w-20 border rounded px-2 py-1 text-sm bg-background"
              />
              <span className="text-xs text-muted-foreground">mots / jour</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, writingGoal.daily > 0 ? (writingGoal.current / writingGoal.daily) * 100 : 0)}%` }} />
              </div>
              <span className="text-xs font-mono">{writingGoal.current}/{writingGoal.daily}</span>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard shortcuts */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Keyboard className="h-4 w-4" /> Raccourcis Clavier</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-muted/30">
                  <span className="text-xs text-muted-foreground">{s.description}</span>
                  <kbd className="text-xs font-mono bg-background border rounded px-2 py-0.5">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbookUXEnhancements;
