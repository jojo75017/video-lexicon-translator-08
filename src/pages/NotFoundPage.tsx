import { Link } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
  <main className="min-h-screen bg-background px-4 py-16 text-foreground">
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <p className="mb-3 text-sm font-semibold uppercase text-primary">Page introuvable</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Où souhaitez-vous aller&nbsp;?</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Ce lien est ancien ou incorrect. Choisissez l’accès adapté à votre situation.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1">
          <Link to="/commander"><BookOpen className="mr-2 h-4 w-4" />Découvrir l’offre</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to="/connexion-abonne"><LogIn className="mr-2 h-4 w-4" />Déjà client</Link>
        </Button>
      </div>
    </div>
  </main>
);

export default NotFoundPage;