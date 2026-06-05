import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

// Calendrier éditorial réseaux 30 jours — IA (BYOK Gemini)
const SocialCalendar30: React.FC = () => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [platforms, setPlatforms] = useState('Instagram, TikTok, Facebook');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim()) return toast.error('Indique le titre du livre.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es un community manager spécialisé dans la promotion de livres. Crée un calendrier éditorial réseaux sociaux sur 30 jours pour promouvoir ce livre.
Livre : "${title}"
${theme ? `Thème / sujet : ${theme}` : ''}
Plateformes : ${platforms}

Pour chaque jour (Jour 1 à Jour 30), donne sur une ligne :
- Jour | Plateforme(s) | Type de post (citation, coulisses, sondage, extrait, témoignage, carrousel conseil, story Q&R…) | Accroche/légende courte | Hashtags clés
Varie les formats et les angles. Inclus 3-4 jours de "rest/repost". Reste actionnable et concret.
Réponds en français, sous forme de liste claire jour par jour.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7, maxTokens: 3000 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère un planning de posts multi-plateformes sur 30 jours, avec formats variés et accroches,
        à partir de ton livre.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre du livre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Thème / sujet</Label><Input value={theme} onChange={(e) => setTheme(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Plateformes</Label><Input value={platforms} onChange={(e) => setPlatforms(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer 30 jours</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={18} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default SocialCalendar30;
