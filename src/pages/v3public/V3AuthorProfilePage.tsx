import { useParams, Link } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';

/** Page auteur publique. En attendant la migration DB (profiles.slug/bio/avatar/amazon),
 *  on affiche un cadre neutre pour tout slug non identifié. */
export default function V3AuthorProfilePage() {
  const { slug } = useParams();

  return (
    <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--v3-cloud)] grid place-items-center mx-auto">
        <User className="w-8 h-8 text-[var(--v3-muted)]" />
      </div>
      <h1 className="v3-serif text-3xl font-bold mt-6">Auteur « {slug} »</h1>
      <p className="text-sm text-[var(--v3-muted)] mt-2 max-w-md mx-auto">
        Cet auteur n'a pas encore publié de page publique, ou son profil est en cours de configuration.
      </p>
      <Link to="/v3/gallery" className="v3-btn v3-btn-outline mt-8">
        <ArrowLeft className="w-4 h-4" /> Voir la galerie
      </Link>
    </section>
  );
}
