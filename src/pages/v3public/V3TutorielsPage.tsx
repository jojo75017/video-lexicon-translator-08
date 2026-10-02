import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, FileText, PlayCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RUBRIQUES_V3, TUTORIELS_V3, type TutorielV3 } from '@/data/tutorielsV3';

const KDP_RESOURCES = [
  {
    title: 'Guide officiel Amazon KDP',
    description: 'Documentation complète pour démarrer sur Kindle Direct Publishing et comprendre les bases de la publication.',
    tags: ['Guide', 'KDP'],
    href: 'https://kdp.amazon.com/fr_FR/help',
    icon: BookOpen,
  },
  {
    title: 'Amazon Ads Academy',
    description: 'Cours gratuits et certifications officielles pour maîtriser les campagnes publicitaires Amazon.',
    tags: ['Guide', 'Amazon Ads'],
    href: 'https://advertising.amazon.com/academy?referrer_url=learningconsole.amazonadvertising.com%2F&ref_=lc',
    icon: BookOpen,
  },
  {
    title: 'Tableau de bord KDP',
    description: 'Accédez à vos livres, ventes, royalties et performances directement sur Amazon KDP.',
    tags: ['Outil', 'KDP'],
    href: 'https://kdp.amazon.com/fr_FR/bookshelf',
    icon: Target,
  },
  {
    title: 'Console Amazon Ads',
    description: 'Gérez vos campagnes publicitaires et consultez leurs performances.',
    tags: ['Outil', 'Amazon Ads'],
    href: 'https://advertising.amazon.com/fr-fr',
    icon: Target,
  },
  {
    title: 'Guide de mise en page KDP',
    description: 'Formats, marges et spécifications pour préparer correctement vos manuscrits.',
    tags: ['Article', 'KDP'],
    href: 'https://kdp.amazon.com/fr_FR/help/topic/G201834180',
    icon: FileText,
  },
  {
    title: 'Certification Sponsored Ads',
    description: 'Obtenez la certification officielle Amazon pour les publicités Sponsored Products et Brands.',
    tags: ['Guide', 'Amazon Ads'],
    href: 'https://advertising.amazon.com/academy?referrer_url=learningconsole.amazonadvertising.com%2Fstudent%2Fpath%2F1535-amazon-sponsored-ads-certification&ref_=lc_student_path_1535-amazon-sponsored-ads-certification',
    icon: BookOpen,
  },
] as const;

const BOOKING_URL = 'https://calendly.com/boubetgeorges/nouvelle-reunion';

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

      <section className="mb-10 border-y bg-secondary/40 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold">Besoin d'aide ou de clarifications ?</h2>
          <p className="mt-3 text-muted-foreground">
            Un appel avec le fondateur pour répondre à vos questions, clarifier certaines fonctionnalités et vous aider à mieux comprendre les analyses de l'outil, si besoin.
          </p>
          <p className="mt-3 text-muted-foreground">
            Aucun prérequis, aucun engagement. L'objectif est simplement de vous accompagner afin que vous puissiez exploiter KDP Pilot sereinement et efficacement, à votre rythme.
          </p>
          <Button asChild className="mt-5 gap-2">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <CalendarDays className="h-4 w-4" />
              Réserver un appel (30 min)
            </a>
          </Button>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="kdp-resources-title">
        <h2 id="kdp-resources-title" className="mb-4 text-xl font-semibold">Ressources utiles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KDP_RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <article key={resource.title} className="flex min-h-52 flex-col rounded-lg border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {resource.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                <Button asChild variant="outline" className="mt-4 w-full gap-2">
                  <a href={resource.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Accéder
                  </a>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl">
          {open && (
            <>
              <DialogHeader><DialogTitle>Tuto {open.num} — {open.titre}</DialogTitle></DialogHeader>
              {open.videos?.length ? (
                <div className="rounded-lg border bg-muted/40 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium"><PlayCircle className="h-4 w-4 text-primary" /> Regardez {open.videos.length > 1 ? `les ${open.videos.length} vidéos` : 'la vidéo'}, puis suivez les écrans ci-dessous</div>
                  {open.videos.map((v, vi) => (
                    <div key={v} className={vi > 0 ? 'mt-3' : ''}>
                      {open.videos.length > 1 && <div className="mb-1 text-xs font-medium text-muted-foreground">Vidéo {vi + 1} / {open.videos.length}</div>}
                      <video src={v} controls playsInline preload="metadata" className="w-full rounded-md" />
                    </div>
                  ))}
                </div>
              ) : null}
              <Progress value={((i + 1) / open.etapes.length) * 100} />
              <div className="min-h-32 py-4">
                {!open.videos?.length && <img src={`/tutoriels/tuto-${open.num}.jpg`} alt={`Capture : ${open.titre}`}
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
