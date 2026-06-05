import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Package, Image as ImageIcon, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { downloadKdpPack } from '@/lib/kdpPackZip';

const TEAL = '#008296';

/**
 * Pack KDP ZIP — bundle PDF intérieur + couverture + métadonnées + README, prêt pour Amazon.
 */
const KdpPackExport: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [categories, setCategories] = useState('');
  const [coverFrontUrl, setCoverFrontUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const build = async () => {
    if (!title.trim() || !author.trim()) return toast.error('Titre et auteur requis.');
    setBusy(true);
    try {
      await downloadKdpPack({
        ebookTitle: title,
        authorName: author,
        subtitle: subtitle || undefined,
        kdpDescription: description || undefined,
        kdpKeywords: keywords || undefined,
        kdpCategories: categories ? categories.split(',').map((c) => c.trim()).filter(Boolean) : undefined,
        pdfBlob: pdfFile || null,
        coverFrontUrl: coverFrontUrl || undefined,
      });
      toast.success('Pack KDP ZIP généré ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Échec génération du pack');
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère un fichier ZIP contenant le PDF intérieur, la couverture, les métadonnées et un
        README de publication — prêt à téléverser sur Amazon KDP. Génère le PDF intérieur via le
        module « Multi-format Express », puis ajoute-le ici.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Titre *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mon livre" />
        </div>
        <div>
          <Label className="text-xs">Auteur *</Label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Prénom Nom" />
        </div>
        <div>
          <Label className="text-xs">Sous-titre</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Catégories KDP (séparées par virgule)</Label>
          <Input value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Cat 1, Cat 2" />
        </div>
        <div>
          <Label className="text-xs">Mots-clés KDP</Label>
          <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="mot1, mot2, mot3" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><ImageIcon className="h-3 w-3" /> URL couverture (optionnel)</Label>
          <Input value={coverFrontUrl} onChange={(e) => setCoverFrontUrl(e.target.value)} placeholder="https://…" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Description KDP</Label>
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <Label className="text-xs flex items-center gap-1"><FileUp className="h-3 w-3" /> PDF intérieur (optionnel)</Label>
        <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
      </div>

      <Card className="border-joy-ink/10">
        <CardContent className="p-4">
          <Button onClick={build} disabled={busy} style={{ background: TEAL, color: 'white' }}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
            <span className="ml-1.5">Générer le Pack KDP ZIP</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KdpPackExport;
