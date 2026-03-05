import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PolitiqueConfidentialite = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/offres"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
      </Button>
      <h1 className="text-3xl font-extrabold mb-8">Politique de Confidentialité</h1>
      
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold">Données collectées</h2>
          <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adresse email (inscription, paiement, newsletter)</li>
            <li>Données de paiement (traitées par Stripe, non stockées chez nous)</li>
            <li>Contenu généré (ebooks, chapitres) — stocké dans votre espace personnel</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fournir l'accès au service EbookStudio Pro</li>
            <li>Envoyer des emails transactionnels (accès, mises à jour)</li>
            <li>Envoyer la newsletter (uniquement si vous êtes inscrit)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">Cookies</h2>
          <p>Nous utilisons des cookies essentiels pour le fonctionnement du site et Google Analytics (GA4) pour mesurer l'audience de manière anonymisée.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : boubetgeorges@gmail.com</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Durée de conservation</h2>
          <p>Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont effacées sous 30 jours.</p>
        </section>
      </div>
    </div>
  </div>
);

export default PolitiqueConfidentialite;
