import { useState } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TEMPLATES = [
  { id: 'standing', label: 'Livre debout (offert)', free: true },
  { id: 'hand', label: 'Livre en main', free: false },
  { id: 'shelf', label: 'Sur étagère', free: false },
  { id: 'ipad', label: 'Sur iPad', free: false },
  { id: 'stack', label: 'Pile de livres', free: false },
];

export default function V3MockupPage() {
  const [coverUrl, setCoverUrl] = useState('');
  const [template, setTemplate] = useState('standing');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!coverUrl) { toast.error('URL de couverture manquante'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mockup', {
        body: { coverUrl, template },
      });
      if (error) throw error;
      setResult(data?.imageUrl || data?.url || '');
      toast.success('Mockup généré ✨');
    } catch (e: any) {
      toast.error('Erreur : ' + (e.message || 'génération impossible'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-emerald-600 mb-1">🎁 OFFERT (1 template) · Illimité en Studio</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Mockups 3D</h1>
            </div>
          </div>
          <p className="text-slate-600">Prévisualisation professionnelle de votre livre pour pubs Facebook, Instagram et Amazon.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <div>
              <Label>URL de votre couverture (JPG/PNG)</Label>
              <Input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://…/couverture.jpg" />
            </div>
            <div>
              <Label className="mb-2 block">Template</Label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`text-left p-3 rounded-lg border transition ${template === t.id ? 'border-[#008296] bg-emerald-50' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    <div className="text-sm font-medium">{t.label}</div>
                    {t.free ? <Badge variant="outline" className="text-xs mt-1">Offert</Badge> : <Badge className="bg-amber-500 text-xs mt-1">Payant</Badge>}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-[#008296] hover:bg-[#006e7f]">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération…</> : 'Générer le mockup'}
            </Button>
          </Card>

          <Card className="p-5 flex items-center justify-center min-h-[400px] bg-slate-50">
            {result ? (
              <img src={result} alt="Mockup" className="max-w-full max-h-[500px] rounded-lg shadow-xl" />
            ) : (
              <div className="text-slate-400 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Le mockup apparaîtra ici</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
