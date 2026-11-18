import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BackButton from '@/components/v3/BackButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Image as ImageIcon, Loader2, Lock, Upload, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import useModuleAccess from '@/hooks/useModuleAccess';
import MockupStudioAccess from '@/components/v3public/MockupStudioAccess';
import { loadStudioCovers, type StudioCover } from '@/lib/studioCovers';
import { MOCKUP_MODELS, canvasToBlob, loadCover, renderMockup, type MockupModel } from '@/lib/mockup/bookMockups';

/** Studio Mockups 3D : couverture choisie dans la bibliothèque ou importée, 5 modèles, téléchargement réservé à la formule Édition. */
export default function V3MockupPage() {
  const [params] = useSearchParams();
  const { hasAccess, loading: accessLoading } = useModuleAccess('mockup-3d');
  const locked = accessLoading || !hasAccess;
  const [covers, setCovers] = useState<StudioCover[] | null>(null);
  const [source, setSource] = useState<string>('');
  const [model, setModel] = useState<MockupModel>('standing');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    void loadStudioCovers().then((list) => {
      const usable = list.filter((c) => c.thumbUrl);
      setCovers(usable);
      const wanted = params.get('titre')?.toLowerCase();
      const match = wanted ? usable.find((c) => (c.bookTitle || c.projectName).toLowerCase() === wanted) : null;
      if (match?.thumbUrl) setSource(match.thumbUrl);
    });
  }, [params]);

  useEffect(() => {
    if (!source) { setImg(null); return; }
    setBusy(true);
    loadCover(source).then(setImg).catch((e) => toast.error(e.message)).finally(() => setBusy(false));
  }, [source]);

  useEffect(() => {
    if (img && canvasRef.current) renderMockup(canvasRef.current, img, model);
  }, [img, model]);

  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) { toast.error('Choisissez une image JPG, PNG ou WEBP.'); return; }
    const reader = new FileReader();
    reader.onload = () => setSource(String(reader.result));
    reader.readAsDataURL(f);
  };

  const download = async (type: 'image/png' | 'image/jpeg') => {
    if (locked || !canvasRef.current || !img) return;
    const blob = await canvasToBlob(canvasRef.current, type);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mockup-${model}.${type === 'image/png' ? 'png' : 'jpg'}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton to="/v3/mes-livres" />
        <header className="mb-6">
          <Badge className="mb-2">Inclus avec la formule Édition</Badge>
          <h1 className="text-3xl font-bold text-foreground">Studio Mockups 3D</h1>
          <p className="text-muted-foreground">Votre vraie couverture, présentée en 5 mises en scène. Le titre et le texte restent intacts.</p>
        </header>
        <MockupStudioAccess />

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <Card className="p-5 space-y-5">
            <section>
              <h2 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4" /> 1. Ma couverture</h2>
              {covers === null ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Recherche de vos couvertures…</p>
              ) : covers.length ? (
                <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
                  {covers.map((c) => (
                    <Button key={c.id} variant="ghost" type="button" onClick={() => { if (c.thumbUrl) setSource(c.thumbUrl); }} title={c.bookTitle || c.projectName}
                      className={`rounded border-2 overflow-hidden ${source === c.thumbUrl ? 'border-primary' : 'border-transparent'}`}>
                      <img src={c.thumbUrl || undefined} alt={c.bookTitle || c.projectName} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune couverture enregistrée. <Link to="/v3/studio-v4" className="underline text-primary">Créer une couverture</Link> ou importez la vôtre.</p>
              )}
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-sm font-medium hover:bg-muted"
                onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
                <Upload className="h-4 w-4" /> Importer une image (Canva, graphiste…)
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </section>

            <section>
              <h2 className="font-semibold mb-2">2. Le modèle</h2>
              <div className="space-y-2">
                {MOCKUP_MODELS.map((m) => (
                  <button key={m.id} type="button" onClick={() => setModel(m.id)} aria-pressed={model === m.id}
                    className={`w-full text-left rounded-lg border p-3 transition ${model === m.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </button>
                ))}
              </div>
            </section>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex-1 grid place-items-center rounded-lg bg-muted min-h-[420px]">
              {busy ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : img ? (
                <canvas ref={canvasRef} className="max-w-full max-h-[640px] h-auto rounded shadow-lg" />
              ) : (
                <div className="text-center text-muted-foreground"><ImageIcon className="h-12 w-12 mx-auto mb-2" />Choisissez ou importez une couverture</div>
              )}
            </div>
            {locked ? (
              <div className="rounded-lg border border-border p-4 text-sm flex flex-wrap items-center gap-3">
                <Lock className="h-4 w-4" /> {accessLoading ? 'Vérification de votre accès…' : 'Téléchargements HD : achat unique 27 € ou inclus avec Édition.'}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button disabled={!img} onClick={() => void download('image/png')}><Download className="h-4 w-4 mr-2" />Télécharger PNG HD</Button>
                <Button disabled={!img} variant="outline" onClick={() => void download('image/jpeg')}><Download className="h-4 w-4 mr-2" />Télécharger JPG</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
