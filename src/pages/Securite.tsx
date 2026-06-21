import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Database, Mail, Cookie, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Securite = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/offres"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
      </Button>

      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Sécurité & Confidentialité</h1>
      </div>

      <p className="text-muted-foreground mb-10">
        Cette page est maintenue par l'équipe Ebookstudio Pro pour répondre aux questions
        courantes sur la sécurité, la confidentialité et la protection des données de la
        plateforme. Il s'agit d'un contenu éditorial appartenant à l'éditeur de
        l'application&nbsp;: ce n'est pas une certification ni une vérification indépendante.
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Lock className="w-5 h-5 text-primary" /> Accès & authentification
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>L'accès aux espaces personnels nécessite une authentification par compte.</li>
            <li>Les rôles d'administration sont vérifiés côté serveur, jamais uniquement dans le navigateur.</li>
            <li>Les données de chaque utilisateur sont isolées par des règles d'accès au niveau de la base de données.</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Database className="w-5 h-5 text-primary" /> Hébergement & infrastructure
          </h2>
          <p>
            La plateforme s'appuie sur l'infrastructure cloud de Lovable (base de données,
            authentification, fonctions serveur et stockage managés). Ces capacités sont
            fournies par la plateforme&nbsp;; les pratiques décrites sur cette page relèvent
            d'une responsabilité partagée entre l'éditeur de l'application et ses utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Mail className="w-5 h-5 text-primary" /> Données collectées & paiements
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adresse email (compte, accès, communications).</li>
            <li>Données de paiement traitées par Stripe — elles ne sont pas stockées sur nos serveurs.</li>
            <li>Contenu généré (ebooks, chapitres) conservé dans votre espace personnel.</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Cookie className="w-5 h-5 text-primary" /> Cookies & mesure d'audience
          </h2>
          <p>
            Nous utilisons des cookies essentiels au fonctionnement du site et une mesure
            d'audience anonymisée. Voir la{" "}
            <Link to="/politique-confidentialite" className="text-primary underline">
              Politique de Confidentialité
            </Link>{" "}
            pour le détail.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Trash2 className="w-5 h-5 text-primary" /> Conservation & vos droits (RGPD)
          </h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de
            suppression et de portabilité de vos données. En cas de suppression de compte,
            vos données sont effacées sous 30 jours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">Signaler un problème de sécurité</h2>
          <p>
            Pour toute question ou signalement relatif à la sécurité ou à la confidentialité,
            contactez-nous à&nbsp;:{" "}
            <a href="mailto:boubetgeorges@gmail.com" className="text-primary underline">
              boubetgeorges@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Securite;
