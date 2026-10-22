import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import robot from '@/assets/plans/vc-books-robot.png';
import cover from '@/assets/vc-books/style-reference.png.asset.json';
import interior from '@/assets/vc-books/interior-model.jpg.asset.json';
import metadata from '@/assets/vc-books/metadata-model.jpg.asset.json';

const PREVIEWS = {
  cover: { asset: cover, title: 'Couverture humoristique', caption: 'Votre couverture de référence : Le Petit Cabinet des grandes curiosités.' },
  interior: { asset: interior, title: 'Intérieur du livre', caption: 'Page 10 de votre modèle : pause numérotée, texte justifié, encart humoristique et question.' },
  metadata: { asset: metadata, title: 'Dossier de métadonnées KDP', caption: 'Première page de votre dossier éditorial et SEO de référence.' },
};

export default function V3VCBooksPreviewPage() {
  const [view, setView] = useState<keyof typeof PREVIEWS>('cover');
  const preview = PREVIEWS[view];
  return (
    <main className="v3-shell py-6 md:py-10">
      <Button asChild variant="ghost" size="sm"><Link to="/v3"><ArrowLeft />Accueil</Link></Button>
      <header className="mt-4 flex items-center gap-4 border-b border-border pb-6">
        <img src={robot} alt="Robot VC Books" className="h-20 w-20 shrink-0 object-contain" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Auteur et Édition · Aperçu du futur studio</p>
          <h1 className="v3-serif mt-1 text-3xl font-semibold text-foreground">VC Books</h1>
          <p className="mt-2 text-sm text-muted-foreground">La lecture aux petits coins</p>
        </div>
      </header>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <section aria-label="Collection VC Books" className="space-y-6">
          <div>
            <h2 className="v3-serif text-xl font-semibold text-foreground">Votre livre humoristique</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Culture générale, anecdotes, quiz et jeux pour de petites pauses pleines de curiosité.</p>
          </div>
          <dl className="divide-y divide-border border-y border-border text-sm">
            <div className="py-3"><dt className="font-semibold text-foreground">Livre compact</dt><dd className="mt-1 text-muted-foreground">Poche ou demi-lettre · 6 × 9 pouces (15,2 × 22,9 cm) · 80 à 150 pages</dd></div>
            <div className="py-3"><dt className="font-semibold text-foreground">Présentation prévue</dt><dd className="mt-1 text-muted-foreground">Pauses numérotées, texte justifié, encarts humoristiques et réponses regroupées</dd></div>
            <div className="py-3"><dt className="font-semibold text-foreground">Sorties prévues</dt><dd className="mt-1 text-muted-foreground">Word modifiable · PDF broché · Dossier KDP séparé</dd></div>
          </dl>
          <div className="rounded-md border border-border bg-card p-4">
            <h2 className="text-base font-semibold text-foreground">Comment faire ce livre, étape par étape</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Choisir le thème</strong> : culture générale, animaux, histoire, sport… un sujet par livre.</li>
              <li><strong className="text-foreground">Écrire le contenu</strong> : 60 à 120 « pauses » courtes (anecdote, quiz, devinette), avec l’outil « Écrire un livre » en indiquant « livre humoristique de pauses toilettes ».</li>
              <li><strong className="text-foreground">Créer la couverture</strong> dans l’atelier ci-dessous : couleur pour la couverture, noir et blanc pour les dessins intérieurs.</li>
              <li><strong className="text-foreground">Mettre en page</strong> au format 6 × 9 pouces, texte justifié, réponses regroupées à la fin.</li>
              <li><strong className="text-foreground">Préparer la fiche KDP</strong> : titre, sous-titre, 7 mots-clés, catégories et description, comme le dossier modèle.</li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">La rédaction automatique et l’export Word/PDF dédiés VC Books arrivent bientôt ; les pages présentées sont celles de votre modèle.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="h-auto w-full whitespace-normal py-3"><Link to="/v3/vc-books/creer"><BookOpen className="shrink-0" />Créer mon livre VC Books<ArrowRight className="shrink-0" /></Link></Button>
            <Button asChild variant="outline" className="h-auto w-full whitespace-normal py-3"><Link to="/v3/vc-books/bibliotheque"><BookOpen className="shrink-0" />Ma bibliothèque VC Books<ArrowRight className="shrink-0" /></Link></Button>
            <Button asChild variant="outline" className="h-auto w-full whitespace-normal py-3"><Link to="/v3/vc-books/images"><ImageIcon className="shrink-0" />Ouvrir l’atelier de couvertures<ArrowRight className="shrink-0" /></Link></Button>
          </div>
        </section>
        <section aria-label="Aperçu du modèle VC Books" className="min-w-0">
          <Tabs value={view} onValueChange={(value) => { if (value in PREVIEWS) setView(value as keyof typeof PREVIEWS); }}>
            <TabsList className="grid h-auto w-full grid-cols-3">
              <TabsTrigger value="cover" className="min-w-0 gap-1 px-1 py-3 text-xs sm:text-sm"><ImageIcon className="hidden h-4 w-4 sm:block" />Couverture</TabsTrigger>
              <TabsTrigger value="interior" className="min-w-0 gap-1 px-1 py-3 text-xs sm:text-sm"><BookOpen className="hidden h-4 w-4 sm:block" />Intérieur</TabsTrigger>
              <TabsTrigger value="metadata" className="min-w-0 gap-1 px-1 py-3 text-xs sm:text-sm"><FileText className="hidden h-4 w-4 sm:block" />Dossier KDP</TabsTrigger>
            </TabsList>
          </Tabs>
          <figure className="mt-4">
            <div className="flex min-h-96 items-start justify-center rounded-md border border-border bg-muted p-3 sm:p-6">
              <img src={preview.asset.url} alt={preview.title} className="h-auto max-h-[900px] w-full max-w-[640px] object-contain" />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{preview.caption}</figcaption>
          </figure>
        </section>
      </div>
    </main>
  );
}