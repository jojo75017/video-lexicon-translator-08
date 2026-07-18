import { Link } from 'react-router-dom';
import { Feather } from 'lucide-react';

export default function V3Footer() {
  return (
    <footer className="v3-section-dark mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/v3" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--v3-orange)] grid place-items-center text-white">
              <Feather className="w-4 h-4" />
            </span>
            <span className="v3-serif text-xl font-bold">Ebookstudio V3</span>
          </Link>
          <p className="mt-4 text-sm text-white/60 max-w-xs">
            L'atelier d'écriture par IA. Écris, illustre et publie ton livre en quelques minutes.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Explorer</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/v3">Accueil</Link></li>
            <li><Link to="/v3/gallery">Galerie</Link></li>
            <li><Link to="/v3/auteur">Auteur invité</Link></li>
            <li><Link to="/v3/create">Créer un livre</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Mon compte</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/v3/library">Bibliothèque</Link></li>
            <li><Link to="/v3/mes-livres">Mes livres publiés</Link></li>
            <li><Link to="/v3/parametres">Paramètres auteur</Link></li>
            <li><Link to="/v3/auth">Connexion</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Légal</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/cgv">CGV</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/politique-confidentialite">Confidentialité</Link></li>
            <li><Link to="/securite">Sécurité</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 text-xs text-white/40 text-center">
          Ebookstudio V3 — L'atelier d'écriture par IA. © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
