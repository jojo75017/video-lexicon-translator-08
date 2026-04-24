import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Licence = () => (
  <div className="min-h-screen bg-background text-foreground">
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link to="/offres"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
      </Button>
      <h1 className="text-3xl font-extrabold mb-2">📄 Licence d'Utilisation du Logiciel (EULA)</h1>
      <p className="text-sm text-muted-foreground mb-8">Date de mise à jour : 23 avril 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold">Éditeur</h2>
          <p>
            EI Entrepreneur<br />
            164 rue de Saussure<br />
            75017 Paris — France<br />
            SIRET : 853 211 035 00011<br />
            Email : tanboub75017@gmail.com
          </p>
          <p><strong>Nom du service :</strong> Ebookstudio Pro</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">1. Objet</h2>
          <p>La présente licence (ci-après « Licence ») encadre les conditions d'accès et d'utilisation du logiciel en ligne Ebookstudio Pro (ci-après le « Service »).</p>
          <p>Elle constitue un contrat juridiquement contraignant entre l'éditeur et l'utilisateur.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">2. Acceptation</h2>
          <p>L'accès au Service implique l'acceptation pleine et entière de la présente Licence, ainsi que des CGV et de la politique de confidentialité associées.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">3. Accès au service</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Accès fourni après paiement (offre actuelle : 67€)</li>
            <li>Accès personnel, non exclusif et non transférable</li>
            <li>L'éditeur se réserve le droit de modifier, suspendre ou améliorer le Service à tout moment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">4. Droits accordés (Licence commerciale incluse)</h2>
          <p>Sous réserve du respect de la présente Licence, l'utilisateur bénéficie :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>d'un droit d'accès au Service</li>
            <li>du droit de générer des ebooks et contenus</li>
            <li>du droit de modifier les contenus générés</li>
            <li>du droit d'exploiter commercialement les contenus (vente, publication, affiliation…)</li>
          </ul>
          <p className="mt-2">👉 Cette licence n'autorise pas la revente du Service lui-même.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">5. Restrictions</h2>
          <p>Il est strictement interdit de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>revendre, louer, partager ou transférer l'accès au Service</li>
            <li>reproduire, copier ou détourner le fonctionnement du logiciel</li>
            <li>créer un service concurrent similaire</li>
            <li>automatiser l'accès (bots, scripts, scraping…)</li>
            <li>contourner les limitations techniques</li>
            <li>utiliser le Service à des fins illégales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">6. Compte utilisateur</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>1 compte = 1 utilisateur</li>
            <li>identifiants strictement personnels</li>
            <li>toute activité réalisée via le compte engage l'utilisateur</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">7. Propriété intellectuelle</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Le Service, son code, son interface et ses fonctionnalités sont la propriété exclusive de l'éditeur</li>
            <li>Les contenus générés appartiennent à l'utilisateur</li>
            <li>L'utilisateur garantit disposer des droits nécessaires sur les contenus diffusés</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">8. Contenus générés par IA</h2>
          <p>Le Service peut utiliser des technologies d'intelligence artificielle (notamment OpenAI).</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Les contenus sont fournis sans garantie d'exactitude</li>
            <li>L'utilisateur est seul responsable de leur utilisation</li>
            <li>L'utilisateur doit vérifier la conformité légale des contenus (droits d'auteur, conformité réglementaire…)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">9. Responsabilité</h2>
          <p>L'éditeur :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ne garantit pas un fonctionnement sans interruption</li>
            <li>ne peut être tenu responsable des pertes indirectes (perte de revenus, données, opportunités…)</li>
          </ul>
          <p className="mt-2">👉 La responsabilité est limitée au montant payé par l'utilisateur.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">10. Suspension / Résiliation</h2>
          <p>L'éditeur se réserve le droit de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>suspendre ou supprimer un compte en cas de non-respect de la Licence</li>
            <li>refuser l'accès en cas d'abus ou de tentative de fraude</li>
          </ul>
          <p className="mt-2">Aucun remboursement ne sera dû en cas de violation des conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">11. Données personnelles (RGPD)</h2>
          <p>Les données personnelles sont traitées conformément à la <Link to="/politique-confidentialite" className="text-primary underline">politique de confidentialité</Link>.</p>
          <p>Conformément au RGPD, l'utilisateur dispose des droits suivants :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>droit d'accès</li>
            <li>droit de rectification</li>
            <li>droit de suppression</li>
            <li>droit d'opposition</li>
          </ul>
          <p className="mt-2">👉 Contact : tanboub75017@gmail.com</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">12. Disponibilité du service</h2>
          <p>Le Service est accessible 24h/24 et 7j/7, sauf maintenance ou cas de force majeure.</p>
          <p>Aucune garantie de disponibilité continue n'est fournie.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">13. Modification de la licence</h2>
          <p>L'éditeur peut modifier la présente Licence à tout moment. La version applicable est celle en vigueur au moment de l'utilisation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold">14. Droit applicable</h2>
          <p>La présente Licence est régie par le droit français.</p>
          <p>Tout litige relève de la compétence des tribunaux du ressort de :<br />👉 Paris</p>
        </section>

        <section className="border-l-4 border-purple-500 pl-4 bg-purple-50/50 dark:bg-purple-950/20 py-4 rounded-r">
          <h2 className="text-xl font-bold">15. Licence commerciale étendue</h2>
          <p>En complément de la licence commerciale standard, l'utilisateur ayant souscrit à la <strong>licence étendue (47€)</strong> bénéficie des droits supplémentaires suivants :</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>possibilité de créer des ebooks pour des clients tiers</li>
            <li>utilisation du Service dans un cadre professionnel (freelance, agence)</li>
            <li>exploitation des contenus générés pour plusieurs projets commerciaux</li>
            <li>revente des prestations incluant les contenus générés</li>
          </ul>
          <p className="mt-3"><strong>Restrictions spécifiques :</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>la revente, le partage ou la mise à disposition du Service reste strictement interdite</li>
            <li>l'accès au Service demeure personnel et non transférable</li>
            <li>l'utilisateur ne peut en aucun cas proposer un outil concurrent basé sur Ebookstudio Pro</li>
          </ul>
          <p className="mt-3 text-sm">
            👉 <Link to="/licence-etendue" className="text-purple-600 dark:text-purple-400 underline">Souscrire à la licence étendue</Link>
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Licence;
