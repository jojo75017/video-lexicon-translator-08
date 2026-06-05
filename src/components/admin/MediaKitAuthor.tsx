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

// Kit Presse / Media Kit Auteur — IA (BYOK Gemini)
const MediaKitAuthor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !author.trim()) return toast.error('Titre et auteur requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es attaché(e) de presse littéraire. Rédige un dossier de presse (media kit) complet et professionnel pour ce livre, prêt à envoyer aux journalistes, blogueurs et podcasts.
Titre : "${title}"
Auteur : ${author}
${genre ? `Genre : ${genre}` : ''}
${summary ? `Résumé : ${summary}` : ''}

Structure le dossier ainsi :
1. PITCH PRESSE (3-4 phrases accrocheuses, angle médiatique).
2. RÉSUMÉ DU LIVRE (1 paragraphe vendeur).
3. BIO AUTEUR (version courte 50 mots + version longue 120 mots).
4. POINTS FORTS / ANGLES MÉDIA (5 angles d'interview ou sujets d'articles).
5. FAQ JOURNALISTE (5 questions/réponses prêtes à l'emploi).
6. CITATIONS À REPRENDRE (3 phrases d'accroche).
7. INFORMATIONS PRATIQUES (format à compléter : prix, ISBN, date, contact).
Réponds en français, ton professionnel.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6, maxTokens: 3000 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère un dossier de presse complet (pitch, bio, angles média, FAQ, citations) prêt à envoyer aux
        médias et influenceurs.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur *</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Résumé</Label><Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="text-xs" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le dossier de presse</span>
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

export default MediaKitAuthor;
