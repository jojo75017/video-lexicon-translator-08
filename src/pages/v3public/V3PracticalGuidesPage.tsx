import { useNavigate } from 'react-router-dom';
import { writeBookBrief } from '@/lib/v3/bookBrief';
import { writeBookType } from '@/lib/v3/bookType';
import { findAvatarCategory } from '@/data/v3BookAvatars';

type GuideTemplate = {
  emoji: string;
  title: string;
  subtitle: string;
  category: string;
  synopsis: string;
};

const GUIDES: GuideTemplate[] = [
  {
    emoji: '🌿', title: 'Mon premier potager naturel', subtitle: '20 conseils pour réussir ses premières récoltes',
    category: 'Jardinage, Potager & Nature',
    synopsis: "Guide pratique pour débutants : choisir l'emplacement du potager, préparer la terre, sélectionner les légumes, réussir les semis, planter, arroser, utiliser le compost et le paillage, prévenir ravageurs et maladies, récolter et préparer les saisons suivantes. Calendriers indicatifs, tableaux et checklists.",
  },
  {
    emoji: '🔨', title: '20 travaux de bricolage faciles à réaliser soi-même', subtitle: 'Réparer, aménager et embellir sa maison',
    category: 'Maison, Bricolage & Rénovation',
    synopsis: "Travaux accessibles aux débutants : fixer une étagère, réparer une porte, rénover un meuble, repeindre un mur, organiser un atelier, petites réparations. Pour chaque projet : outils et matériaux, difficulté, temps indicatif, étapes, erreurs courantes, sécurité, résultat attendu. Travaux dangereux signalés avec renvoi vers un professionnel.",
  },
  {
    emoji: '🏡', title: 'Une maison bien organisée au quotidien', subtitle: '30 astuces pour gagner de la place et du temps',
    category: 'Maison, Cuisine & Équipements',
    synopsis: "Organiser sa cuisine, optimiser les placards, ranger les ustensiles, entretenir les appareils ménagers, aménager les petits espaces, simplifier les tâches quotidiennes. Listes d'équipements, tableaux comparatifs utiles, solutions pour différents budgets, sans tests ni prix inventés.",
  },
  {
    emoji: '✈️', title: 'Préparer son voyage de A à Z', subtitle: 'Le guide pour voyager sereinement',
    category: 'Voyages, Tourisme & Découvertes',
    synopsis: "Du choix de la destination au retour : budget, transports, hébergements, documents, déplacements, itinéraire, imprévus. Checklists, exemples de budgets indicatifs, conseils pratiques ; formalités, prix et horaires à vérifier auprès de sources officielles.",
  },
  {
    emoji: '🐠', title: "Réussir son premier aquarium d'eau douce", subtitle: 'Le guide pratique du débutant',
    category: 'Aquariophilie & Poissons d’eau douce',
    synopsis: "Choisir son aquarium, installer filtration et chauffage, comprendre le cycle de l'azote, tester l'eau, choisir des poissons compatibles, installer les plantes, entretenir son bac. Fiches pratiques, tableaux de paramètres indicatifs, checklists, prévention des erreurs ; bien-être des poissons prioritaire.",
  },
];

const RESET_KEYS = [
  'v3_create_workflow_config_v2', 'edition_book_config_v1', 'v3_create_current_project_id_v1',
  'ebook_workflow_progress', 'ebook_workflow_results', 'ebook_workflow_sync_data',
];

export default function V3PracticalGuidesPage() {
  const navigate = useNavigate();

  const start = (g: GuideTemplate) => {
    try { RESET_KEYS.forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
    writeBookType('guide');
    writeBookBrief({ title: g.title, subtitle: g.subtitle, category: g.category, description: g.synopsis });
    navigate('/v3/lancer');
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        De vrais guides pratiques, sans personnages ni intrigue : choisissez un modèle, il ouvre « Écrire un livre » avec le titre,
        le sous-titre, la catégorie, le synopsis et le type « Guide pratique » déjà remplis. Vous ajoutez votre nom d’auteur,
        choisissez l’un des 3 personas, puis vérifiez le sommaire avant la rédaction.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => {
          const personas = findAvatarCategory(g.category)?.avatars || [];
          return (
            <div key={g.title} className="flex flex-col rounded-2xl border bg-card p-5">
              <div className="text-3xl">{g.emoji}</div>
              <h3 className="mt-2 text-lg font-bold">{g.title}</h3>
              <p className="text-sm text-muted-foreground">{g.subtitle}</p>
              <p className="mt-2 text-xs font-semibold">{g.category}</p>
              <p className="mt-3 text-xs font-semibold">{personas.length} personas :</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {personas.map((p) => <li key={p.id}>{p.name}</li>)}
              </ul>
              <button type="button" onClick={() => start(g)} className="v3-btn v3-btn-primary mt-auto pt-2 justify-center text-sm">
                Créer ce guide
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
