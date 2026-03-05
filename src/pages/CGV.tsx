import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CGV = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/offres"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
      </Button>
      <h1 className="text-3xl font-extrabold mb-8">Conditions Générales de Vente</h1>
      
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold">Article 1 — Objet</h2>
          <p>Les présentes CGV régissent la vente de l'accès à la plateforme EbookStudio Pro, outil de création d'ebooks assisté par intelligence artificielle.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 2 — Prix et paiement</h2>
          <p>Le prix est indiqué en euros TTC sur la page de l'offre. Le paiement est effectué en une seule fois via Stripe (carte bancaire). Un paiement en plusieurs fois peut être proposé.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 3 — Accès au service</h2>
          <p>L'accès est fourni immédiatement après confirmation du paiement, via un code d'accès envoyé par email. L'accès est accordé à vie (durée de vie du service), sans abonnement récurrent.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 4 — Droit de rétractation</h2>
          <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contenus numériques fournis immédiatement. Toutefois, nous offrons une <strong>garantie satisfait ou remboursé de 30 jours</strong> sur simple demande par email.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 5 — Propriété du contenu généré</h2>
          <p>Les ebooks et contenus générés via EbookStudio Pro sont la propriété exclusive de l'utilisateur. L'utilisateur est libre de les publier, vendre ou distribuer comme il le souhaite.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 6 — Responsabilité</h2>
          <p>EbookStudio Pro fournit un outil de création assistée par IA. L'utilisateur reste responsable du contenu final qu'il publie. Nous ne garantissons pas de revenus spécifiques.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 7 — Support</h2>
          <p>Un support par email est inclus. Des sessions Zoom personnalisées peuvent être réservées via Calendly pour un accompagnement supplémentaire.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Article 8 — Droit applicable</h2>
          <p>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.</p>
        </section>
      </div>
    </div>
  </div>
);

export default CGV;
