import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
  <main className="min-h-screen bg-background px-4 py-16 text-foreground">
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
      <p className="mb-3 text-sm font-semibold uppercase text-primary">Page introuvable</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Ce lien n’existe plus</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Il pointe vers une page ancienne ou supprimée. Découvrez EbookStudio et
        créez votre livre avec l’IA en quelques minutes.
      </p>
      <div className="mt-8 flex w-full max-w-xs justify-center">
        <Button asChild className="w-full">
          <Link to="/commander"><BookOpen className="mr-2 h-4 w-4" />Découvrir l’offre</Link>
        </Button>
      </div>
    </div>
  </main>
);

export default NotFoundPage;
