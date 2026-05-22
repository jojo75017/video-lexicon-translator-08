import React from 'react';
import { ExternalLink, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthorBook {
  asin: string;
  title: string;
  category: string;
}

const BOOKS: AuthorBook[] = [
  { asin: 'B0GXB3V5DJ', title: "L'Ancien Locataire - Un thriller psychologique dans un Paris de 2030", category: 'Thriller psychologique' },
  { asin: 'B0GG7QCFTZ', title: "Axel Kiev : L'Origine du Code - Tome 1", category: "Thriller d'espionnage technologique" },
  { asin: 'B0GY5K8GCS', title: 'Signal Zéro - Intégrale Tomes 1 & 2', category: 'Thriller technologique' },
  { asin: 'B0GX2SVHY4', title: 'Le Loup en Vacances - Les aventures de Lupo', category: 'Jeunesse 4-6 ans' },
  { asin: 'B0GQQB7V1F', title: "Dans l'Ombre de la Villa - Tome 1 (Les Secrets de la Femme de Ménage)", category: 'Polar' },
  { asin: 'B0GN34WYMK', title: 'La Bible du Voyage - En famille en Europe, 27 pays', category: 'Voyage / Famille' },
];

const coverUrl = (asin: string) =>
  `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
const fallbackCoverUrl = (asin: string) =>
  `https://m.media-amazon.com/images/P/${asin}.jpg`;
const amazonUrl = (asin: string) => `https://www.amazon.fr/dp/${asin}/`;

interface Props {
  onStartWorkflow?: () => void;
}

export const AuthorBooksShowcase: React.FC<Props> = ({ onStartWorkflow }) => {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <header className="mb-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <BookOpen className="h-4 w-4" />
          Vitrine auteur
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          Des livres déjà publiés sur Amazon avec Ebookstudio Pro V2
        </h3>
        <p className="text-sm text-muted-foreground">
          6 titres signés <strong className="text-foreground">Georges Boubet</strong> - preuve que la méthode fonctionne.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {BOOKS.map((book) => (
          <a
            key={book.asin}
            href={amazonUrl(book.asin)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col text-left"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border bg-muted shadow-md ring-1 ring-border transition-all group-hover:-translate-y-1 group-hover:shadow-xl group-hover:ring-accent">
              <img
                src={coverUrl(book.asin)}
                alt={`Couverture ${book.title}`}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== fallbackCoverUrl(book.asin)) {
                    img.src = fallbackCoverUrl(book.asin);
                  }
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
                  Voir sur Amazon <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
            <div className="mt-2 px-0.5">
              <p className="text-[11px] font-medium text-primary">{book.category}</p>
              <p className="line-clamp-2 text-xs font-semibold text-foreground" title={book.title}>
                {book.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">de Georges Boubet</p>
            </div>
          </a>
        ))}
      </div>

      {onStartWorkflow && (
        <div className="mt-6 flex flex-col items-center gap-2 border-t pt-5 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Vous aussi, publiez un livre Amazon KDP avec la méthode 15 agents.
          </p>
          <Button
            onClick={onStartWorkflow}
            className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Créer mon livre comme Georges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};
