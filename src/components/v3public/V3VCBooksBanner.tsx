import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import vcRobot from '@/assets/plans/vc-books-robot.png';
import reference from '@/assets/vc-books/style-reference.png.asset.json';

export default function V3VCBooksBanner() {
  return (
    <section id="vc-books" aria-labelledby="vc-books-home-title" className="v3-vcbooks-dark scroll-mt-40 rounded-3xl" style={{ background: 'linear-gradient(135deg,#0B0F17,#1A1614)', border: '1px solid rgba(246,189,42,0.35)' }}>
      <div className="grid items-center gap-6 p-6 md:p-8 sm:grid-cols-[180px_1fr] lg:grid-cols-[180px_1fr_160px] md:gap-10">
        <img
          src={vcRobot}
          alt="La mascotte robot VC Books, installée aux petits coins avec son livre"
          width={816}
          height={816}
          loading="lazy"
          className="mx-auto h-40 w-40 object-contain sm:h-48 sm:w-48"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold text-primary">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Atelier d’images · Auteur et Édition
          </p>
          <h2 id="vc-books-home-title" className="v3-serif mt-2 text-2xl font-semibold md:text-3xl" style={{ color: "#F3EDE6" }}>
            VC Books — la lecture aux petits coins
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "#D6CCC2" }}>
            Anecdotes, quiz, histoires courtes et jeux : des livres humoristiques à savourer une petite pause à la fois.
          </p>
          <p className="mt-2 text-sm" style={{ color: "#D6CCC2" }}>Robot d’écriture et exports Word / PDF inclus.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/v3/vc-books/creer">Créer mon livre VC Books <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/v3/vc-books/bibliotheque">Ma bibliothèque <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/v3/vc-books/apercu">Voir la page et le modèle <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/v3/vc-books/images">Studio de couverture VC Books <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
        <Link to="/v3/vc-books/apercu" className="mx-auto block w-40 sm:col-start-2 lg:col-start-auto" aria-label="Voir le modèle VC Books">
          <img src={reference.url} alt="Le Petit Cabinet des grandes curiosités : votre modèle de couverture" className="aspect-[2/3] w-full rounded-md object-contain" loading="lazy" />
        </Link>
      </div>
    </section>
  );
}