/**
 * « Commencer mon livre » depuis une niche.
 * Panneau de confirmation : tous les champs de la fiche sont pré-remplis et
 * modifiables, puis envoyés au parcours de création (/v3/create).
 * Aucun appel obligatoire à l'IA : la proposition immédiate fonctionne sans clé.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Niche600 } from '@/data/niches600';
import { nicheToDraft, type NicheStartDraft } from '@/lib/v3/nicheToBrief';
import { readBookBrief, writeBookBrief } from '@/lib/v3/bookBrief';
import { useSubscriberProfile } from '@/hooks/useSubscriberProfile';
import { callAIWriting, getProvider, getProviderKey, validateKeyFormat } from '@/services/aiWritingService';

interface Props {
  niche: Niche600 | null;
  onClose: () => void;
}

export default function NicheStartDialog({ niche, onClose }: Props) {
  const navigate = useNavigate();
  const { profile } = useSubscriberProfile();
  const [draft, setDraft] = useState<NicheStartDraft | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const authorName = useMemo(() => {
    const pen = (profile.pen_name || '').trim();
    if (pen) return pen;
    const full = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return full || 'Auteur Ebookstudio';
  }, [profile.pen_name, profile.first_name, profile.last_name]);

  useEffect(() => {
    if (!niche) { setDraft(null); return; }
    setDraft(nicheToDraft(niche, authorName));
  }, [niche, authorName]);

  const set = <K extends keyof NicheStartDraft>(key: K, value: NicheStartDraft[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  const proposeWithAI = async () => {
    if (!niche || !draft) return;
    const provider = getProvider();
    const key = getProviderKey(provider);
    if (!key || !validateKeyFormat(provider, key)) {
      toast.error('Ajoutez votre clé IA dans « Clés API » pour utiliser la proposition IA. La fiche actuelle reste utilisable telle quelle.');
      return;
    }
    setAiLoading(true);
    try {
      const prompt = `Tu es un éditeur senior spécialisé Amazon KDP. À partir de la niche ci-dessous, propose UN livre commercial percutant, en français uniquement.
Niche : "${niche.niche}"
Catégorie : "${niche.sousNiche}"
Mot-clé Amazon visé : "${niche.motCleAmazon}"

Réponds STRICTEMENT en JSON valide (sans balises, sans texte autour) :
{
  "title": "titre principal court et vendeur (max 70 caractères)",
  "subtitle": "sous-titre bénéfice/promesse (max 120 caractères)",
  "synopsis": "synopsis de 150 à 200 mots décrivant le contenu, le lecteur visé et la transformation obtenue"
}`;
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: 0.8, maxTokens: 2048 });
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) { try { parsed = JSON.parse(m[0]); } catch { /* ignoré */ } }
      }
      if (!parsed?.title) throw new Error('Réponse IA invalide.');
      setDraft({
        ...draft,
        title: String(parsed.title || draft.title).slice(0, 120),
        subtitle: String(parsed.subtitle || draft.subtitle).slice(0, 160),
        synopsis: String(parsed.synopsis || draft.synopsis).trim(),
      });
      toast.success('Proposition IA appliquée — vérifiez puis ouvrez le parcours.');
    } catch (e: any) {
      toast.error(e?.message || 'Impossible de générer la proposition.');
    } finally {
      setAiLoading(false);
    }
  };

  const openWorkflow = () => {
    if (!niche || !draft) return;
    if (!draft.title.trim()) {
      toast.error('Donnez un titre à votre livre avant d’ouvrir le parcours.');
      return;
    }
    const existing = readBookBrief();
    if (existing?.title && existing.title.trim() !== draft.title.trim()) {
      const ok = window.confirm(
        `Une fiche « ${existing.title} » est déjà en cours. Elle sera remplacée par « ${draft.title} ». Continuer ?`,
      );
      if (!ok) return;
    }
    writeBookBrief({
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      author: draft.author.trim(),
      category: draft.category,
      genre: draft.category,
      description: draft.synopsis.trim(),
      synopsis: draft.synopsis.trim(),
      chapters: draft.chapters,
      wordsPerChapter: draft.wordsPerChapter,
      creationPath: 'story',
      mode: 'book',
      projectId: null,
    });
    onClose();
    navigate('/v3/create');
  };

  return (
    <Dialog open={Boolean(niche)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF9E2D]" />
            Commencer mon livre
          </DialogTitle>
          <DialogDescription>
            {niche ? `Niche : ${niche.niche} · mot-clé « ${niche.motCleAmazon} »` : ''}
            {' '}Tous les champs sont modifiables avant d’ouvrir le parcours d’écriture.
          </DialogDescription>
        </DialogHeader>

        {draft && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="niche-title">Titre</Label>
              <Input id="niche-title" value={draft.title} onChange={(e) => set('title', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="niche-subtitle">Sous-titre</Label>
              <Input id="niche-subtitle" value={draft.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="niche-category">Catégorie</Label>
                <Input id="niche-category" value={draft.category} onChange={(e) => set('category', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="niche-author">Nom de l’auteur</Label>
                <Input id="niche-author" value={draft.author} onChange={(e) => set('author', e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="niche-synopsis">Synopsis</Label>
              <Textarea
                id="niche-synopsis"
                rows={8}
                value={draft.synopsis}
                onChange={(e) => set('synopsis', e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="niche-chapters">Nombre de chapitres (3 à 40)</Label>
                <Input
                  id="niche-chapters"
                  type="number"
                  min={3}
                  max={40}
                  value={draft.chapters}
                  onChange={(e) => set('chapters', Math.min(40, Math.max(3, Number(e.target.value) || 3)))}
                />
              </div>
              <div>
                <Label htmlFor="niche-words">Mots par chapitre</Label>
                <Input
                  id="niche-words"
                  type="number"
                  min={800}
                  max={5000}
                  step={100}
                  value={draft.wordsPerChapter}
                  onChange={(e) => set('wordsPerChapter', Math.min(5000, Math.max(800, Number(e.target.value) || 1500)))}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Total estimé : {(draft.chapters * draft.wordsPerChapter).toLocaleString('fr-FR')} mots.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={openWorkflow}
                className="bg-[#FF9E2D] hover:bg-[#f08d16] text-[#232F3E] font-bold"
              >
                Ouvrir le parcours <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={proposeWithAI} disabled={aiLoading}>
                {aiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Proposer avec l’IA
              </Button>
              <Button variant="ghost" onClick={onClose}>Annuler</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
