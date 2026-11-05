import { Link } from 'react-router-dom';
import { Feather } from 'lucide-react';

export default function V3Footer() {
  // Pied de page noir/or — maquette du 5 novembre (planche 16).
  return (
    <footer
      className="mt-auto"
      style={{ background: '#080B11', borderTop: '1px solid rgba(246,189,42,.25)', color: '#D8CFC7' }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/v3" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full grid place-items-center text-white" style={{ background: '#D97706' }}>
              <Feather className="w-4 h-4" />
            </span>
            <span className="v3-serif text-xl font-bold" style={{ color: '#F6BD2A' }}>Ebookstudio V3</span>
          </Link>
          <p className="mt-4 text-sm max-w-xs" style={{ color: '#B9AFA6' }}>
            L'atelier d'écriture par IA. Écris, illustre et publie ton livre en quelques minutes.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8A7F76' }}>Ressources</div>
          <ul className="space-y-2 text-sm" style={{ color: '#E8E1DA' }}>
            <li>
              <a href="https://ebookstudio.blog/#accueil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:opacity-80">
                Blog EbookStudio
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded" style={{ background: '#D97706', color: '#fff' }}>Nouveau</span>
              </a>
            </li>
            <li><Link to="/formation" className="hover:opacity-80">Formation vidéo</Link></li>
            <li><Link to="/v3" className="hover:opacity-80">Accueil V3</Link></li>
            <li><Link to="/v3/tutoriels-v3" className="hover:opacity-80">Tutoriels V3</Link></li>
            <li><Link to="/v3/create" className="hover:opacity-80">Créer un livre</Link></li>
            <li><Link to="/v3/contact" className="hover:opacity-80">Contact &amp; support</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8A7F76' }}>Mon compte</div>
          <ul className="space-y-2 text-sm" style={{ color: '#E8E1DA' }}>
            <li><Link to="/v3/mes-livres" className="hover:opacity-80">Mes livres</Link></li>
            <li><Link to="/v3/outils" className="hover:opacity-80">Tous les outils V3</Link></li>
            <li><Link to="/v3/compte" className="hover:opacity-80">Mon compte &amp; clés IA</Link></li>
            <li><Link to="/v3/forfaits" className="hover:opacity-80">Offres &amp; options</Link></li>
            <li><Link to="/v3/fonctionnalites/questions" className="hover:opacity-80">FAQ — 539 questions</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8A7F76' }}>Légal</div>
          <ul className="space-y-2 text-sm" style={{ color: '#E8E1DA' }}>
            <li><Link to="/cgv" className="hover:opacity-80">CGV</Link></li>
            <li><Link to="/mentions-legales" className="hover:opacity-80">Mentions légales</Link></li>
            <li><Link to="/politique-confidentialite" className="hover:opacity-80">Confidentialité</Link></li>
            <li><Link to="/securite" className="hover:opacity-80">Sécurité</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(246,189,42,.15)' }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 text-xs text-center" style={{ color: '#8A7F76' }}>
          Ebookstudio V3 — L'atelier d'écriture par IA. © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
