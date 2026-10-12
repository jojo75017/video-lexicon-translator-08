import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Bot, Clapperboard, LibraryBig, Radio, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import '@/styles/v3-public.css';

const partners = [
  { icon: '🎬', category: 'Vidéo IA', name: 'VID par MyBoxVideo', description: "Créateur de modèles vidéo avec l'IA, pour présenter et promouvoir vos livres.", href: 'https://warriorplus.com/o2/a/l9g3wdx/0', tone: 'video' },
  { icon: '🤖', category: 'PLR', name: 'The Book-to-Bot Blueprint', description: 'Une méthode avec droits de revente (PLR) pour transformer un livre en assistant IA.', href: 'https://warriorplus.com/o2/a/w80wnfd/0', tone: 'plr' },
  { icon: '📚', category: "Logiciel d'édition", name: 'BookForge', description: "Logiciel d'édition à utiliser du 4e trimestre et toute l'année.", href: 'https://warriorplus.com/o2/a/h12hd3d/0', tone: 'edition' },
  { icon: '📡', category: 'Création de livres', name: 'Constructeur de livres Signaux morts', description: 'Un constructeur de livres pour créer vos ouvrages pas à pas.', href: 'https://warriorplus.com/o2/a/nv21zcr/0', tone: 'books' },
  { icon: '🦸', category: 'Bande dessinée', name: 'Studio de BD de héros', description: 'Un studio pour créer vos bandes dessinées de super-héros.', href: 'https://warriorplus.com/o2/a/mzbzkcy/0', tone: 'comic' },
  { icon: '🤖', category: 'Outil EbookStudio', name: 'EbookStudio AI Team', description: '10 robots IA pour construire le squelette de votre livre de A à Z. 47 € une seule fois.', href: 'https://www.trafic-affiliation.com/captur_robotsamazonkdp', tone: 'team' },
];
const partnerIcons = { video: Clapperboard, plr: Bot, edition: LibraryBig, books: Radio, comic: Shield, team: Bot };

export default function PartnerToolsPage() {
  usePageMeta({ title: 'Nos partenaires — EbookStudio', description: "Une sélection d'outils complémentaires pour vos livres : vidéo, édition, bandes dessinées et contenus prêts à l'emploi.", canonical: 'https://ebookstudio.fr/partenaires' });

  return (
    <main className="partner-tools min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <Link className="partner-tools-brand" to="/">EbookStudio <ArrowRight className="h-4 w-4" /></Link>
        <header className="pb-9 pt-10 sm:pt-14">
          <p className="partner-tools-eyebrow">Nos partenaires</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Les outils de nos partenaires pour aller plus loin</h1>
          <p className="partner-tools-intro mt-5 max-w-3xl text-base leading-relaxed">Une sélection d'outils complémentaires pour vos livres : vidéo, édition, bandes dessinées et contenus prêts à l'emploi.</p>
        </header>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {partners.map(partner => {
            const Icon = partnerIcons[partner.tone as keyof typeof partnerIcons];
            return (
            <article key={partner.href} className="partner-tools-card flex min-w-0 flex-col p-6" data-tone={partner.tone}>
              <span aria-label={partner.icon}><Icon className="h-8 w-8" aria-hidden="true" /></span>
              <p className="partner-tools-category mb-2 mt-5 text-xs font-semibold">{partner.category}</p>
              <h2 className="text-xl font-bold leading-snug">{partner.name}</h2>
              <p className="partner-tools-description mb-7 mt-3 flex-1 text-sm leading-relaxed">{partner.description}</p>
              <Button asChild className="partner-tools-discover w-full">
                <a href={partner.href} target="_blank" rel="nofollow sponsored noopener" aria-label={`Découvrir ${partner.name}`}>Découvrir <ArrowUpRight /></a>
              </Button>
            </article>
          ); })}
        </div>
        <footer className="partner-tools-footer mt-9 border-t pt-6">
          <p className="text-sm leading-relaxed">🇬🇧 Les pages des partenaires sont en anglais : traduisez-les en français en 1 clic avec votre navigateur (clic droit → « Traduire en français »).</p>
          <p className="partner-tools-disclosure mt-3 text-xs leading-relaxed">Liens partenaires : EbookStudio peut percevoir une commission si vous achetez via ces liens, sans surcoût pour vous.</p>
        </footer>
      </div>
    </main>
  );
}