import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, FileAudio, Loader2, Upload, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TEAL = '#008296';
const MAX_BYTES = 25 * 1024 * 1024;

const LANGS = [
  { value: 'auto', label: 'Détection automatique' },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'pt', label: 'Portugais' },
];

function bytes(n: number) {
  if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
  return `${Math.round(n / 1024)} Ko`;
}
function words(t: string) {
  return t.trim() ? t.trim().split(/\s+/).length : 0;
}

const AudioVideoTranscriber: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error('Fichier trop volumineux (max 25 Mo). Compresse l’audio ou découpe la vidéo.');
      return;
    }
    setFile(f);
  };

  const transcribe = async () => {
    if (!file) { toast.error('Choisis un fichier audio ou vidéo.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (lang && lang !== 'auto') fd.append('language', lang);
      const { data, error } = await supabase.functions.invoke('transcribe-media', { body: fd });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      const out = (data as any)?.text ?? '';
      if (!out) throw new Error('Aucun texte généré.');
      setText((prev) => (prev ? `${prev}\n\n${out}` : out));
      toast.success('Transcription terminée — texte éditable ci-dessous.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Échec de la transcription.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => { navigator.clipboard.writeText(text); toast.success('Texte copié.'); };
  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${(file?.name || 'media').replace(/\.[^.]+$/, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Transformez vos <strong>podcasts, interviews, conférences, vidéos YouTube ou notes vocales</strong> en
        texte propre et <strong>éditable</strong>, prêt à devenir un chapitre de livre. Transcription IA professionnelle,
        ponctuée et fidèle, jusqu’à 99 langues.
      </p>

      {/* Zone de dépôt */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0] ?? null); }}
        className="cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition hover:bg-muted/40"
        style={{ borderColor: TEAL }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <FileAudio className="h-5 w-5" style={{ color: TEAL }} />
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground">· {bytes(file.size)}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <Upload className="h-6 w-6" style={{ color: TEAL }} />
            <span><strong>Cliquez</strong> ou glissez un fichier audio / vidéo</span>
            <span className="text-xs">MP3, WAV, M4A, MP4, MOV, WEBM… · max 25 Mo</span>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Label className="text-xs">Langue du fichier</Label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={transcribe} disabled={loading || !file} style={{ background: TEAL }} className="text-white">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcription…</> : <><Wand2 className="mr-2 h-4 w-4" /> Transcrire</>}
        </Button>
      </div>

      {text && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Texte éditable · {words(text)} mots</Label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copy}><Copy className="mr-1 h-3.5 w-3.5" /> Copier</Button>
              <Button size="sm" variant="outline" onClick={download}><Download className="mr-1 h-3.5 w-3.5" /> .txt</Button>
            </div>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            className="font-mono text-sm leading-relaxed"
            placeholder="Le texte transcrit apparaîtra ici, prêt à éditer…"
          />
          <p className="text-[11px] text-muted-foreground">
            Astuce : corrigez les noms propres, ajoutez des intertitres, puis copiez le texte dans le Studio de
            création de livres pour le transformer en chapitre.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioVideoTranscriber;
