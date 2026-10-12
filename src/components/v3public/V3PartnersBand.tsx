import { Link } from 'react-router-dom';

/** Bandeau « Nos partenaires » : liens affiliés externes, aucune logique d'accès. */
const PARTNERS = [
  { icon: '🎬', label: 'VID par MyBoxVideo', href: 'https://warriorplus.com/o2/a/l9g3wdx/0' },
  { icon: '🤖', label: 'Book-to-Bot Blueprint (PLR)', href: 'https://warriorplus.com/o2/a/w80wnfd/0' },
  { icon: '📚', label: 'BookForge', href: 'https://warriorplus.com/o2/a/h12hd3d/0' },
  { icon: '📡', label: 'Livres Signaux morts', href: 'https://warriorplus.com/o2/a/nv21zcr/0' },
  { icon: '🦸', label: 'Studio de BD de héros', href: 'https://warriorplus.com/o2/a/mzbzkcy/0' },
];

export default function V3PartnersBand() {
  return (
    <section className="v3-partners" aria-label="Nos partenaires">
      <div className="mx-auto max-w-[1240px]">
        <p className="v3-partners-title"><span>Nos partenaires</span>Des outils pour aller plus loin</p>
        <div className="flex flex-wrap justify-center gap-2">
          {PARTNERS.map((p) => (
            <a key={p.href} className="v3-partners-link" href={p.href} target="_blank" rel="nofollow sponsored noopener">
              <i aria-hidden="true">{p.icon}</i><b>{p.label}</b><em aria-hidden="true">→</em>
            </a>
          ))}
        </div>
        <div className="mt-4 text-center"><Link to="/partenaires" className="v3-partners-all">Voir tous nos partenaires →</Link></div>
        <p className="v3-partners-note">
          Pages en anglais, traduisibles en 1 clic (clic droit → « Traduire en français »). Liens partenaires : EbookStudio peut percevoir une commission, sans surcoût pour vous.
        </p>
      </div>
    </section>
  );
}
