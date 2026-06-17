import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Type, Ruler, Image as ImageIcon, FileDown, Sparkles } from 'lucide-react';
import revolutionImg from '@/assets/v3/maison-edition-revolution.jpg';

// Charte locale alignée sur le Hub V3 (ambre / crème / serif).
const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';

const INK = '#2A2118';
const SERIF = "'Georgia', 'Times New Roman', serif";

interface MaisonEditionTabProps {
  /** Ouvre la fiche d'un outil V3 par son id. */
  onOpenModule: (moduleId: string) => void;
}

/** Lien interne stylé ouvrant un outil du générateur. */
function ToolLink({
  moduleId,
  onOpenModule,
  children,
}: {
  moduleId: string;
  onOpenModule: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenModule(moduleId)}
      className="inline font-semibold underline decoration-dotted underline-offset-2 transition-colors hover:bg-[#FFF3DF] rounded px-0.5"
      style={{ color: AMBER_DEEP }}
    >
      {children}
    </button>
  );
}

const MaisonEditionTab: React.FC<MaisonEditionTabProps> = ({ onOpenModule }) => {
  const navigate = useNavigate();

  return (
    <div className="pb-12">
      {/* HERO / BANNIÈRE RÉVOLUTION */}
      <div className="relative overflow-hidden rounded-3xl border border-[#eadfc9] shadow-[0_18px_60px_-24px_rgba(180,140,60,0.5)]">
        <img
          src={revolutionImg}
          alt="Livre ouvert magnifiquement mis en page sur le bureau d'une maison d'édition"
          width={1536}
          height={1024}
          className="h-[300px] w-full object-cover sm:h-[400px]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(20,14,6,0.82) 0%, rgba(20,14,6,0.45) 55%, rgba(20,14,6,0.1) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
          <div
            className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 mb-4"
            style={{ borderColor: `${AMBER}aa`, background: 'rgba(232,149,30,0.18)' }}
          >
            <Sparkles className="h-4 w-4" style={{ color: '#FFD89B' }} />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: '#FFD89B' }}>
              Révolution
            </span>
          </div>
          <h1
            className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl"
            style={{ fontFamily: SERIF }}
          >
            Réussir la mise en page d'un livre
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            La maison d'édition EbookStudio : tout ce qu'il faut soigner pour transformer un manuscrit
            terminé en un livre que l'on a envie de lire.
          </p>
        </div>
      </div>

      {/* INTRODUCTION */}
      <article
        className="mx-auto mt-10 max-w-3xl space-y-5 text-[15px] leading-relaxed"
        style={{ color: '#4a3d2c' }}
      >
        <p>
          Vous avez fièrement apposé le mot «&nbsp;Fin&nbsp;» sur la dernière page de votre manuscrit&nbsp;?
          Bravo, le plus long a été fait&nbsp;! Vous pensiez avoir terminé&nbsp;? Détrompez-vous, il reste une
          étape primordiale dans la conception de votre ouvrage. Avez-vous pensé à la mise en page du corps de
          votre livre et à l'apparence globale de son intérieur&nbsp;?
        </p>
        <p>
          L'esthétique et la présentation extérieur/intérieur de votre livre auront forcément un impact sur les
          ventes de ce dernier. Vous devez donner au lecteur l'envie de vous lire. On dit souvent que la
          couverture d'un livre est le premier contact avec le lecteur et que celle-ci doit donc impérativement
          être soignée&nbsp;: confiez-la à{' '}
          <ToolLink moduleId="cover-studio-pro" onOpenModule={onOpenModule}>Cover Studio Pro</ToolLink> ou générez
          un fichier d'impression irréprochable avec la{' '}
          <ToolLink moduleId="cover-pdf-exact" onOpenModule={onOpenModule}>Couverture KDP Exacte (PDF)</ToolLink>.
          C'est un fait, mais la partie n'est pas encore gagnée. S'il a été attiré par l'extérieur, le lecteur
          voudra en savoir plus et ouvrira votre livre pour le feuilleter une première fois — vérifiez ce rendu
          grâce au{' '}
          <ToolLink moduleId="kindle-previewer" onOpenModule={onOpenModule}>Kindle Previewer Simulé</ToolLink>.
          La mise en page du livre est donc le deuxième point de contact avec votre lecteur et c'est en cela
          qu'il est important d'y consacrer du temps.
        </p>

        <h2 className="pt-2 text-2xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
          Comment soigner la mise en page de son livre&nbsp;?
        </h2>
        <p>
          Le maître mot pour réussir la mise en page d'un livre, c'est l'<strong>homogénéité</strong>. Il n'est
          pas question que celle-ci soit désordonnée. Lors de la fabrication de votre ouvrage, vous devez donc
          parvenir à trouver une harmonie entre le fond et la forme. Cela signifie qu'après la longue phase
          d'écriture — que vous pouvez piloter dans le{' '}
          <ToolLink moduleId="book-creation-studio" onOpenModule={onOpenModule}>STUDIO de création de livres</ToolLink>{' '}
          — il reste encore d'importants choix à faire&nbsp;: quelle police de caractère choisir&nbsp;? Quel
          interligne&nbsp;? Avec ou sans retrait en début de paragraphe&nbsp;? Etc.
        </p>
        <p>
          La mise en page est identique dans le cas d'un livre ou d'un eBook, seule la pagination changera. Il
          y a bien sûr plusieurs manières de présenter son livre en fonction de son thème, de son style ou de
          l'image que l'on souhaite donner à son roman. Nous vous invitons à feuilleter divers livres qui vous
          inspirent ou qui correspondent à votre univers et votre style d'écriture pour déterminer ce que vous
          voulez.
        </p>
      </article>

      {/* SECTIONS */}
      <div className="mx-auto mt-8 max-w-3xl space-y-6">
        <Section icon={Type} title="Le corps du texte">
          <p>Voici quelques pistes pour optimiser le corps de texte&nbsp;:</p>
          <ul className="ml-1 mt-2 space-y-2">
            <Bullet>Il doit en général être centré.</Bullet>
            <Bullet>
              Vous pouvez mettre un retrait à chaque paragraphe (0,5&nbsp;cm suffisent) mais ce n'est pas
              obligatoire. Cela permet simplement une lecture plus aisée.
            </Bullet>
            <Bullet>
              L'interligne (l'espace entre les lignes) doit être régulier. Un interligne simple est correct et
              peut être suffisant.
            </Bullet>
            <Bullet>
              Le titre du chapitre est tout à vous en termes d'imagination&nbsp;: tout est possible, à condition
              de rester homogène, c'est-à-dire de faire la même chose pour chaque chapitre afin de garder une
              cohérence.
            </Bullet>
            <Bullet>Vous pouvez également vous contenter d'insérer un simple chiffre romain ou ne rien mettre du tout.</Bullet>
          </ul>
          <p className="mt-3 text-sm">
            👉 Prévisualisez instantanément ces réglages sur liseuse, tablette et téléphone avec le{' '}
            <ToolLink moduleId="kindle-previewer" onOpenModule={onOpenModule}>Kindle Previewer Simulé</ToolLink>.
          </p>
        </Section>

        <Section icon={Ruler} title="Les marges">
          <p>
            Pour respecter les marges techniques d'impression, des gabarits de fichier intérieur existent en
            fonction du format de votre livre. Vous pouvez aussi normaliser automatiquement votre fichier avec
            le{' '}
            <ToolLink moduleId="manuscript-converter" onOpenModule={onOpenModule}>Convertisseur Manuscrit Universel</ToolLink>{' '}
            et valider la conformité via la{' '}
            <ToolLink moduleId="prepub-checklist" onOpenModule={onOpenModule}>Checklist Prépublication</ToolLink>.
          </p>
          <p className="mt-3">
            Toutefois, en fonction du format de votre livre, nous vous conseillons de choisir des marges plus ou
            moins étroites. Ajoutez toujours une marge de reliure à gauche pour que le lecteur n'ait pas à
            décoller le livre pour lire les mots cachés.
          </p>
          <ul className="ml-1 mt-2 space-y-2">
            <Bullet>
              Pour un livre de poche au format 11×17&nbsp;cm, ne laissez que 1,25&nbsp;cm de marge des 4 côtés
              et ajoutez 0,50&nbsp;cm de marge de reliure. Ces mesures conviennent également pour un format A5
              (14,85×21&nbsp;cm).
            </Bullet>
            <Bullet>
              Pour un grand format comme le A4 (21×29,7&nbsp;cm) vous pouvez passer à des marges de 2&nbsp;cm sur
              les 4 côtés pour un usage courant, en y ajoutant une marge de reliure que vous pouvez porter à
              0,60&nbsp;cm.
            </Bullet>
          </ul>
        </Section>

        <Section icon={Type} title="Les polices">
          <p>
            Nous vous conseillons de choisir une police d'écriture qui ne fatigue pas les yeux (Garamond par
            exemple, ou le classique Times New Roman), ainsi qu'une taille agréable à lire correspondant à la
            norme (11 ou 12 par exemple).
          </p>
          <p className="mt-3">
            Certaines polices, comme Arial, sont plutôt adaptées à une lecture sur écran. D'autres en revanche
            seront davantage adaptées au format papier comme Times New Roman.
          </p>
          <p className="mt-3">
            Vous pouvez adapter la taille de votre police selon votre type de livre et votre lectorat. La taille
            généralement employée est de 12. Pour un public très jeune vous pouvez monter jusqu'à 16, et 14 pour
            les seniors. N'allez pas au-dessus, sauf pour un livre réservé aux personnes malvoyantes.
          </p>
          <p className="mt-3 text-sm">
            👉 Vérifiez que polices, marges et conformité KDP sont au vert avec le{' '}
            <ToolLink moduleId="cockpit-audit-pilot" onOpenModule={onOpenModule}>Cockpit Audit Pilot</ToolLink>,
            ou approfondissez dans la{' '}
            <button
              type="button"
              onClick={() => navigate('/formation')}
              className="inline font-semibold underline decoration-dotted underline-offset-2 rounded px-0.5 hover:bg-[#FFF3DF]"
              style={{ color: AMBER_DEEP }}
            >
              formation
            </button>.
          </p>
        </Section>

        <Section icon={ImageIcon} title="Les images">
          <p>
            Vous souhaitez insérer des images dans votre corps de texte&nbsp;? Avant de les utiliser, assurez-vous
            de bien disposer des droits d'exploitation. Où les avez-vous trouvées&nbsp;? Les avez-vous copiées
            sans autorisation sur un site&nbsp;? Voici quelques pistes&nbsp;:
          </p>
          <ul className="ml-1 mt-2 space-y-2">
            <Bullet>Renseignez-vous toujours sur le propriétaire des images et obtenez son autorisation de les utiliser.</Bullet>
            <Bullet>
              Vous pouvez acheter le droit d'utiliser des images d'illustration sur des banques d'images en
              ligne&nbsp;: vous serez ainsi sûr que tout est en règle.
            </Bullet>
            <Bullet>Il existe aussi de nombreuses banques d'images gratuites où vous trouverez votre bonheur sans dépenser un centime.</Bullet>
            <Bullet>
              Le plus simple est peut-être de solliciter un photographe ou un dessinateur de votre entourage.
              S'il s'agit d'une collaboration importante (livre illustré jeunesse, guide de voyage…), concluez un
              vrai partenariat d'édition.
            </Bullet>
            <Bullet>
              Attention au droit à l'image&nbsp;: si vous utilisez des photographies de personnes physiques, vous
              devez obtenir leur autorisation au préalable.
            </Bullet>
          </ul>
        </Section>

        <Section icon={FileDown} title="Télécharger un gabarit intérieur">
          <p>
            Pour mettre en page votre livre papier et respecter les marges d'impression, vous pouvez vous appuyer
            sur un gabarit intérieur correspondant au format choisi (fichiers Word .doc).
          </p>
          <p className="mt-3">
            Pour écrire et mettre en page, utilisez le logiciel de traitement de texte de votre choix (Microsoft
            Word, Google Docs, Pages, OpenOffice…). Cependant, la publication n'accepte qu'un seul format de
            fichier&nbsp;: le PDF. Une fois votre manuscrit terminé, enregistrez-le au format PDF — ou générez
            tous vos formats d'un clic (PDF broché, EPUB, grand format) avec le{' '}
            <ToolLink moduleId="multi-format-express" onOpenModule={onOpenModule}>Multi-format Express</ToolLink>.
          </p>
        </Section>
      </div>

      {/* CTA final */}
      <div className="mx-auto mt-10 max-w-3xl">
        <div
          className="flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: `${AMBER}55`, background: AMBER_SOFT }}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" style={{ color: AMBER_DEEP }} />
            <div>
              <p className="font-bold" style={{ fontFamily: SERIF, color: INK }}>
                Prêt à mettre votre livre en page&nbsp;?
              </p>
              <p className="text-sm" style={{ color: '#7c6b54' }}>
                Lancez l'aperçu liseuse et générez vos fichiers prêts à publier.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenModule('kindle-previewer')}
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)` }}
          >
            Ouvrir l'aperçu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-[#eadfc9] bg-white p-6 shadow-[0_2px_14px_-8px_rgba(180,140,60,0.25)]"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: AMBER_SOFT }}
        >
          <Icon className="h-5 w-5" style={{ color: AMBER_DEEP }} />
        </span>
        <h2 className="text-xl font-bold" style={{ fontFamily: SERIF, color: INK }}>
          {title}
        </h2>
      </div>
      <div className="text-[15px] leading-relaxed" style={{ color: '#4a3d2c' }}>
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: AMBER }} />
      <span>{children}</span>
    </li>
  );
}

export default MaisonEditionTab;
