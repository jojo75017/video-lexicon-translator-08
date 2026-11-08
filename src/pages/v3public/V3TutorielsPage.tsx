import { useState } from 'react';
import tutorielsHero from '@/assets/tutoriels-hero-v2.jpg';
import rubDemarrer from '@/assets/tuto-rub-demarrer.jpg';
import rubEtapes from '@/assets/tuto-rub-etapes.jpg';
import rubCreer from '@/assets/tuto-rub-creer.jpg';
import rubEcrire from '@/assets/tuto-rub-ecrire.jpg';
import rubHabiller from '@/assets/tuto-rub-habiller.jpg';
import rubPublier from '@/assets/tuto-rub-publier.jpg';
import georgesVideo from '@/assets/georges_boubet_pourquoi_ebookstudio_v3.mp4.asset.json';
import bienvenueVideo from '@/assets/bienvenue_tutoriels_v3.mp4.asset.json';
import jamaisSeulVideo from '@/assets/jamais_seul_accompagnement_v3.mp4.asset.json';
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

const RUBRIQUE_IMAGES: Record<string, string> = {
  'Démarrer': rubDemarrer, 'Les 5 étapes': rubEtapes, 'Créer': rubCreer,
  'Écrire et corriger': rubEcrire, 'Habiller': rubHabiller, 'Publier et vendre': rubPublier,
};

const INTRO_VIDEOS = [
  {
    tab: 'Le mot de Georges', src: georgesVideo.url, badge: 'Bienvenue · Le mot du fondateur',
    title: "Pourquoi j'ai créé EbookStudio V3",
    text: "Georges Boubet, auteur publié sur Amazon, vous explique en 1 min 30 pourquoi il a créé cet outil et comment il peut vous aider à publier votre livre.",
    steps: ['Découvrez la démarche, de l’idée au livre prêt pour KDP.', 'Suivez les tutoriels pas à pas, atelier par atelier.', 'Retrouvez articles et conseils KDP sur le site de Georges.'],
  },
  {
    tab: 'Bienvenue dans vos tutoriels', src: bienvenueVideo.url, badge: 'Ouverture · 1 min 30',
    title: 'Bienvenue dans vos tutoriels',
    text: "Comment suivre la formation : l'ordre conseillé des tutoriels et la façon d'en tirer le meilleur pour avancer sur votre livre.",
    steps: ['Commencez par la rubrique « Démarrer ».', 'Suivez les tutoriels dans l’ordre, à votre rythme.', 'Revenez ici quand vous en avez besoin.'],
  },
  {
    tab: "Vous n'êtes jamais seul", src: jamaisSeulVideo.url, badge: 'Accompagnement · 1 min 35',
    title: "Vous n'êtes jamais seul",
    text: 'Les 4 piliers de votre accompagnement pour avancer sereinement jusqu’à la publication.',
    steps: ['EBOOKBOT vous guide dans les ateliers.', 'La FAQ répond aux questions fréquentes.', 'Un appel de 30 minutes et l’assistance restent disponibles.'],
  },
];

const BOOKING_URL = 'https://calendly.com/pro-georgesboubet/30min';

export default function V3TutorielsPage() {
  const [open, setOpen] = useState<TutorielV3 | null>(null);
  const [i, setI] = useState(0);
  const [intro, setIntro] = useState(0);
  const start = (t: TutorielV3) => { setOpen(t); setI(0); };

  return (
    <div className="v3-dark-page"><div className="mx-auto max-w-6xl px-4 py-8">
      <img src={tutorielsHero} alt="Ordinateur affichant un tutoriel vidéo, carnet de notes et casque" width={1600} height={560}
        className="mb-8 h-56 w-full rounded-2xl object-cover md:h-72" />
      <div className="mb-8">
        <Badge variant="secondary">Mis à jour oct. 2026</Badge>
        <h1 className="mt-2 text-3xl font-bold">Tutoriels V3</h1>
        <p className="mt-1 text-muted-foreground">{TUTORIELS_V3.length} tutoriels courts, pas à pas, pour tout faire de A à Z.</p>
      </div>

      <section className="mb-10 rounded-2xl border bg-card p-5 md:p-6" aria-labelledby="videos-ouverture">
        <h2 id="videos-ouverture" className="sr-only">Vidéos d'ouverture</h2>
        <div role="tablist" className="mb-5 flex flex-wrap gap-2">
          {INTRO_VIDEOS.map((v, n) => (
            <button key={v.title} type="button" role="tab" aria-selected={intro === n} onClick={() => setIntro(n)}
              className={`v3-chip-toggle rounded-full border px-4 py-2 text-sm font-medium ${intro === n ? 'border-primary bg-primary text-primary-foreground' : 'bg-transparent text-foreground hover:border-primary'}`}>
              {n + 1}. {v.tab}
            </button>
          ))}
        </div>
        {(() => { const v = INTRO_VIDEOS[intro]; return (
        <div className="grid gap-6 md:grid-cols-2">
          <video key={v.src} src={v.src} controls preload="metadata" playsInline
            className="aspect-video w-full rounded-xl bg-black" aria-label={`Vidéo : ${v.title}`} />
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit">{v.badge}</Badge>
            <h3 className="mt-2 text-2xl font-bold">{v.title}</h3>
            <p className="mt-2 text-muted-foreground">{v.text}</p>
            <ol className="mt-4 space-y-2 text-sm">
              {v.steps.map((s, k) => (
                <li key={s} className="flex gap-3 rounded-lg border p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary text-xs text-primary">{k + 1}</span>{s}
                </li>
              ))}
            </ol>
            {intro === 0 && (
              <Button asChild className="mt-5 w-full gap-2 sm:w-auto v3-btn-action-orange">
                <a href="https://georgesboubet.com" target="_blank" rel="noopener noreferrer">
                  Découvrir Georgesboubet.com <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {intro < INTRO_VIDEOS.length - 1 && (
              <Button variant="outline" className="mt-3 w-full gap-2 sm:w-auto" onClick={() => setIntro(intro + 1)}>
                Vidéo suivante <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>); })()}
      </section>

      {RUBRIQUES_V3.map((r) => (
        <section key={r} className="mb-8">
          <div className="relative mb-4 overflow-hidden rounded-xl">
            <img src={RUBRIQUE_IMAGES[r]} alt={`Illustration de la rubrique ${r}`} width={1088} height={608} loading="lazy"
              className="h-32 w-full object-cover md:h-40" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,11,17,0.75), rgba(8,11,17,0.1))' }} />
            <h2 className="absolute bottom-3 left-4 text-2xl font-bold" style={{ color: '#fff' }}>{r}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TUTORIELS_V3.filter((t) => t.rubrique === r).map((t) => (
              <button key={t.id} type="button" onClick={() => start(t)}
                className="rounded-lg border bg-card p-4 text-left hover:border-primary">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tuto {t.num} · {t.duree}</span>
                  {t.videos?.length ? <Badge>🎬 Vidéo{t.videos.length > 1 ? `s (${t.videos.length})` : ''}</Badge> : <Badge variant="secondary">📘 Guide illustré</Badge>}
                </div>
                <div className="mt-1 font-medium">{t.titre}</div>
                {t.videos?.length
                  ? <div className="mt-2 flex items-center gap-1 text-sm text-primary"><PlayCircle className="h-4 w-4" /> Regarder la vidéo</div>
                  : <>
                      <div className="mt-2 flex items-center gap-1 text-sm text-primary"><BookOpen className="h-4 w-4" /> Consulter le guide pas-à-pas</div>
                      <div className="mt-1 text-xs text-muted-foreground">Vidéo à venir prochainement</div>
                    </>}
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
              ) : (
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium"><BookOpen className="h-4 w-4 text-primary" /> Guide illustré pas-à-pas</div>
                  <p className="mt-1 text-muted-foreground">La vidéo de ce tutoriel arrive prochainement. En attendant, suivez les écrans ci-dessous puis cliquez sur « Essayer maintenant ».</p>
                </div>
              )}
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
    </div></div>
  );
}
