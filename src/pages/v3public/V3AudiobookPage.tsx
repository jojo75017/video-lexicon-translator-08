import { useState } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Loader2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VOICES = [
  { id: 'fr-FR-DeniseNeural', label: 'Denise (FR femme, chaleureuse)' },
  { id: 'fr-FR-HenriNeural', label: 'Henri (FR homme, posé)' },
  { id: 'fr-FR-BrigitteNeural', label: 'Brigitte (FR femme, narratrice)' },
  { id: 'fr-FR-AlainNeural', label: 'Alain (FR homme, expressif)' },
];

export default function V3AudiobookPage() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(VOICES[0].id);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (text.trim().length < 20) { toast.error('Texte trop court'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('azure-speech-tts', {
        body: { text, voice, format: 'mp3' },
      });
      if (error) throw error;
      const url = data?.audioUrl || data?.url;
      if (data?.audioBase64 && !url) {
        const blob = await (await fetch(`data:audio/mp3;base64,${data.audioBase64}`)).blob();
        setAudioUrl(URL.createObjectURL(blob));
      } else {
        setAudioUrl(url);
      }
      toast.success('Audio généré 🎧');
    } catch (e: any) {
      toast.error('Erreur : ' + (e.message || 'TTS indisponible'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-amber-500 mb-1">NEW · Studio 12,99€ / Voix Premium en Éditeur 59€</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Audiobook TTS</h1>
            </div>
          </div>
          <p className="text-slate-600">Transformez vos chapitres en fichiers MP3 prêts pour Audible, Apple Books ou votre site.</p>
        </header>

        <Card className="p-5 mb-6">
          <Label>Voix narrateur</Label>
          <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full mt-1 border rounded-md p-2 bg-white">
            {VOICES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </Card>

        <Card className="p-5 mb-6">
          <Label>Texte du chapitre</Label>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Collez le chapitre à convertir en audio…"
            className="min-h-[280px] mt-1"
          />
          <div className="text-xs text-slate-500 mt-1">{text.length} caractères (~{Math.ceil(text.length / 900)} min d'écoute)</div>
        </Card>

        <div className="text-center mb-6">
          <Button size="lg" onClick={handleGenerate} disabled={loading} className="bg-[#008296] hover:bg-[#006e7f]">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération…</> : <><Mic className="h-4 w-4 mr-2" /> Générer l'audio</>}
          </Button>
        </div>

        {audioUrl && (
          <Card className="p-5">
            <audio src={audioUrl} controls className="w-full mb-3" />
            <Button variant="outline" asChild>
              <a href={audioUrl} download="chapitre.mp3"><Download className="h-4 w-4 mr-2" /> Télécharger MP3</a>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
