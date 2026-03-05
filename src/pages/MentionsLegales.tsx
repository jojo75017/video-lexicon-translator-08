import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MentionsLegales = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/offres"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
      </Button>
      <h1 className="text-3xl font-extrabold mb-8">Mentions Légales</h1>
      
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold">Éditeur du site</h2>
          <p>EbookStudio Pro est édité par Georges Boubet, entrepreneur individuel.</p>
          <p>Email : boubetgeorges@gmail.com</p>
          <p>Siège social : France</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Hébergement</h2>
          <p>Le site est hébergé par Lovable (lovable.dev) et les services backend par Supabase.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Propriété intellectuelle</h2>
          <p>L'ensemble du contenu du site (textes, images, vidéos, logos) est protégé par le droit d'auteur. Toute reproduction non autorisée est interdite.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Responsabilité</h2>
          <p>Les ebooks générés via EbookStudio Pro sont la propriété de l'utilisateur. L'éditeur ne saurait être tenu responsable du contenu généré par l'IA.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Données personnelles</h2>
          <p>Consultez notre <Link to="/politique-confidentialite" className="text-primary underline">politique de confidentialité</Link> pour en savoir plus sur le traitement de vos données.</p>
        </section>
      </div>
    </div>
  </div>
);

export default MentionsLegales;
