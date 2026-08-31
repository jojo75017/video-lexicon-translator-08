import { useState } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function V3HumanizerPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHumanize = async () => {
    if (input.trim().length < 30) {
      toast.error('Merci de saisir au moins 30 caractères');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('humanize-content', {
        body: { text: input, level: 'strong', locale: 'fr' },
      });
      if (error) throw error;
      setOutput(data?.humanized || data?.text || data?.result || '');
      toast.success('Texte humanisé ✨');
    } catch (e: any) {
      toast.error('Erreur : ' + (e.message || 'humanisation impossible'));
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
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-amber-500 mb-1">Inclus dans Édition</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Humaniseur IA</h1>
            </div>
          </div>
          <p className="text-slate-600">Rendez vos chapitres 100 % indétectables (GPTZero, Originality, Copyleaks).</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5">
            <label className="font-semibold text-sm mb-2 block">Texte original</label>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Collez ici le chapitre à humaniser…"
              className="min-h-[320px] resize-none"
            />
            <div className="text-xs text-slate-500 mt-1">{input.length} caractères</div>
          </Card>
          <Card className="p-5">
            <label className="font-semibold text-sm mb-2 block">Texte humanisé</label>
            <Textarea
              value={output}
              readOnly
              placeholder="Le résultat apparaîtra ici…"
              className="min-h-[320px] resize-none bg-emerald-50/40"
            />
            {output && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié !'); }}>
                Copier
              </Button>
            )}
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button size="lg" onClick={handleHumanize} disabled={loading} className="bg-[#008296] hover:bg-[#006e7f]">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Humanisation…</> : <><Wand2 className="h-4 w-4 mr-2" /> Humaniser le texte</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
