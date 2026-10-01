import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RUBRIQUES_V3, TUTORIELS_V3, type TutorielV3 } from '@/data/tutorielsV3';

export default function V3TutorielsPage() {
  const [open, setOpen] = useState<TutorielV3 | null>(null);
  const [i, setI] = useState(0);
  const start = (t: TutorielV3) => { setOpen(t); setI(0); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Badge variant="secondary">Mis à jour oct. 2026</Badge>
        <h1 className="mt-2 text-3xl font-bold">Tutoriels V3</h1>
        <p className="mt-1 text-muted-foreground">{TUTORIELS_V3.length} tutoriels courts, pas à pas, pour tout faire de A à Z.</p>
      </div>

      {RUBRIQUES_V3.map((r) => (
        <section key={r} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">{r}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TUTORIELS_V3.filter((t) => t.rubrique === r).map((t) => (
              <button key={t.id} type="button" onClick={() => start(t)}
                className="rounded-lg border bg-card p-4 text-left hover:border-primary">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tuto {t.num} · {t.duree}</span>
                  {t.videos?.length && <Badge>🎬 Vidéo{t.videos.length > 1 ? `s (${t.videos.length})` : ''}</Badge>}
                </div>
                <div className="mt-1 font-medium">{t.titre}</div>
                <div className="mt-2 flex items-center gap-1 text-sm text-primary"><PlayCircle className="h-4 w-4" /> {t.videos?.length ? 'Regarder la vidéo' : 'Voir le tuto'}</div>
              </button>
            ))}
          </div>
        </section>
      ))}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl">
          {open && (
            <>
              <DialogHeader><DialogTitle>Tuto {open.num} — {open.titre}</DialogTitle></DialogHeader>
              {open.video && (
                <div className="rounded-lg border bg-muted/40 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium"><PlayCircle className="h-4 w-4 text-primary" /> Regardez la vidéo, puis suivez les écrans ci-dessous</div>
                  <video src={open.video} controls playsInline preload="metadata" className="w-full rounded-md" />
                </div>
              )}
              <Progress value={((i + 1) / open.etapes.length) * 100} />
              <div className="min-h-32 py-4">
                {!open.video && <img src={`/tutoriels/tuto-${open.num}.jpg`} alt={`Capture : ${open.titre}`}
                  className="mb-3 w-full rounded-md border" loading="lazy" />}
                <div className="text-sm text-muted-foreground">Écran {i + 1} / {open.etapes.length}</div>
                <p className="mt-2 text-lg">{open.etapes[i]}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft className="h-4 w-4" /> Précédent</Button>
                {i < open.etapes.length - 1
                  ? <Button onClick={() => setI(i + 1)}>Suivant <ChevronRight className="h-4 w-4" /></Button>
                  : <Button asChild><Link to={open.route} onClick={() => setOpen(null)}>Essayer maintenant</Link></Button>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
