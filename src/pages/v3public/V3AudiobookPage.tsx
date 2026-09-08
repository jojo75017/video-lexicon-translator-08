import { useMemo, useState } from 'react';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Headphones } from 'lucide-react';
import AudiobookCoverPicker from '@/components/v3public/AudiobookCoverPicker';
import AudiobookBookPicker from '@/components/v3public/AudiobookBookPicker';
import { EbookAudioGenerator } from '@/components/ebook/EbookAudioGenerator';
import { parseManuscript } from '@/lib/manuscriptParser';

/**
 * Studio livre audio professionnel — reprend l'outil complet déjà en service
 * (voix premium, sections, lecture, fusion MP3, exports).
 */
export default function V3AudiobookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [preface, setPreface] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [manuscript, setManuscript] = useState('');
  const [cover, setCover] = useState<{ title: string | null; url: string | null } | null>(null);

  const chapters = useMemo(() => {
    const sections = parseManuscript(manuscript, 'Chapitre 1');
    return sections.map((s, i) => ({
      id: `ch-${i + 1}`,
      title: s.title,
      content: s.blocks.map((b) => b.text).join('\n\n'),
      subChapters: [],
    }));
  }, [manuscript]);

  const totalWords = useMemo(
    () => chapters.reduce((n, c) => n + (c.content?.split(/\s+/).filter(Boolean).length || 0), 0),
    [chapters],
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <BackButton to="/v3/nouveautes" />

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <Badge className="bg-amber-500 mb-1">Voix Premium — incluse dans Édition</Badge>
              <h1 className="text-3xl font-bold text-[#232F3E]">Studio livre audio</h1>
            </div>
          </div>
          <p className="text-slate-600">
            Le studio complet : voix premium par univers, découpage en chapitres, intro parlée,
            écoute chapitre par chapitre, MP3 unique ou fichiers séparés.
          </p>
        </header>

        <AudiobookCoverPicker
          onSelected={({ title: coverTitle, url }) => {
            setCover({ title: coverTitle, url });
            if (coverTitle && !title.trim()) setTitle(coverTitle);
          }}
        />

        <Card className="p-5 mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ab-title">Titre du livre</Label>
            <Input
              id="ab-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Les flammes du passé"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ab-author">Nom de l'auteur</Label>
            <Input
              id="ab-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Georges Boubet"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ab-preface">Préface (facultatif)</Label>
            <Textarea
              id="ab-preface"
              value={preface}
              onChange={(e) => setPreface(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <div>
            <Label htmlFor="ab-conclusion">Conclusion (facultatif)</Label>
            <Textarea
              id="ab-conclusion"
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
        </Card>

        <Card className="p-5 mb-6">
          <Label htmlFor="ab-manuscript">Manuscrit complet</Label>
          <p className="text-xs text-slate-500 mt-1">
            Collez votre livre. Les titres « Chapitre 1 », « # Titre » ou « ## Titre » créent
            automatiquement les chapitres audio.
          </p>
          <Textarea
            id="ab-manuscript"
            value={manuscript}
            onChange={(e) => setManuscript(e.target.value)}
            placeholder={'Chapitre 1 — Le départ\n\nTexte du chapitre…'}
            className="min-h-[260px] mt-2"
          />
          <div className="text-xs text-slate-500 mt-2">
            {chapters.length} chapitre(s) détecté(s) · {totalWords.toLocaleString('fr-FR')} mots ·
            ≈ {Math.max(1, Math.round(totalWords / 150))} min d'écoute
          </div>
        </Card>

        <EbookAudioGenerator
          ebookTitle={title || cover?.title || 'Mon livre'}
          authorName={author || 'Auteur'}
          preface={preface}
          conclusion={conclusion}
          chapters={chapters}
        />
      </div>
    </div>
  );
}
