/**
 * Scripts Loom — la présentation (vidéo 0) + les 20 tutoriels prioritaires.
 * Contenu rédigé à la main, français uniquement, aucune donnée inventée.
 * Durée visée : 5 minutes maximum par vidéo (débit calme, ~140 mots/minute).
 */

export type ScriptType = 'visage' | 'ecran' | 'visage+ecran';

export interface ScriptSection {
  /** Titre de la partie (repère de minutage). */
  titre: string;
  /** Ce que l'on montre à l'écran pendant cette partie. */
  ecran?: string;
  /** Texte à lire à voix haute. */
  texte: string;
}

export interface ScriptTutoriel {
  numero: number;
  titre: string;
  /** Durée visée en minutes. */
  duree: number;
  type: ScriptType;
  /** Page(s) à ouvrir avant d'enregistrer. */
  route: string;
  /** En une phrase : ce que le spectateur saura faire à la fin. */
  objectif: string;
  /** Emplacement réservé au robot présentateur (nom + visuel), à remplir plus tard. */
  presentateur?: string;
  sections: ScriptSection[];
}

export const TYPE_LABELS: Record<ScriptType, string> = {
  visage: 'Visage (caméra)',
  ecran: 'Écran seul',
  'visage+ecran': 'Visage + écran',
};

const TRANSITION =
  "Voilà ma présentation. Place aux onglets : on passe sur mon écran, je vous les présente dans l'ordre. À vous ensuite de faire comme vous voulez, dans l'ordre qui vous arrange.";

export const SCRIPTS_TUTORIELS: ScriptTutoriel[] = [
  {
    numero: 0,
    titre: 'Ma présentation — qui je suis et ce que vous allez voir',
    duree: 5,
    type: 'visage',
    route: 'Caméra seule, puis /v3 en fin de vidéo',
    objectif: 'Le spectateur sait qui vous êtes, ce qu’est EbookStudio et ce qu’il va découvrir ensuite.',
    sections: [
      {
        titre: '1. Qui je suis (≈ 1 min)',
        ecran: 'Caméra, plan fixe, fond calme.',
        texte:
          "Bonjour, je suis Georges Boubet. J'écris et je publie des livres sur Amazon KDP, et je suis le créateur d'EbookStudio.\n\nJe ne viens pas du monde de la technique. Je viens du monde des auteurs : celui où l'on écrit le soir, où l'on doute, et où l'on finit par avoir un fichier sur son ordinateur sans savoir quoi en faire.\n\nC'est exactement pour cette raison que j'ai fabriqué cet outil : parce que j'en avais besoin pour moi-même, avant d'en faire un atelier pour les autres.",
      },
      {
        titre: '2. Le vrai problème (≈ 1 min)',
        ecran: 'Caméra.',
        texte:
          "Un manuscrit écrit n'est pas un livre publiable. C'est la phrase la plus utile que je puisse vous dire aujourd'hui.\n\nEntre le texte terminé et la page Amazon, il reste la correction, la mise en forme, la couverture aux bonnes dimensions, la description, les mots-clés, les catégories, le fichier accepté sans erreur.\n\nC'est là que la plupart des projets s'arrêtent. Pas par manque de talent : par manque d'atelier.",
      },
      {
        titre: '3. Ce qu’est EbookStudio (≈ 1 min)',
        ecran: 'Caméra.',
        texte:
          "EbookStudio, ce n'est pas un bouton magique qui écrit un livre à votre place pendant que vous dormez. C'est un atelier, organisé comme une petite maison d'édition.\n\nOn y construit le sommaire, on y écrit chapitre par chapitre, on corrige, on fabrique la couverture, on prépare la fiche Amazon, on exporte le fichier final.\n\nVous restez l'auteur. L'outil tient la lampe, range les établis et vous évite les erreurs qui coûtent des semaines.",
      },
      {
        titre: '4. Ce que je vais vous montrer (≈ 1 min)',
        ecran: 'Caméra, puis partage d’écran sur /v3.',
        texte:
          "Dans les vidéos qui suivent, je vous présente les onglets un par un, dans l'ordre de fabrication d'un livre : Créer, Écrire, Habiller, Publier, Vendre, puis les réglages et les forfaits.\n\nChaque vidéo fait cinq minutes maximum. Vous regardez celle qui vous concerne, quand elle vous concerne.\n\nCertaines vidéos montrent seulement mon écran : c'est volontaire, vous verrez exactement ce que je clique.",
      },
      {
        titre: '5. Transition (≈ 30 s)',
        ecran: '/v3, page d’accueil plein écran.',
        texte: TRANSITION,
      },
    ],
  },
  {
    numero: 1,
    titre: 'Par où commencer + la page d’accueil V3',
    duree: 5,
    type: 'visage+ecran',
    route: '/v3 puis /v3/commence-ici',
    objectif: 'Comprendre l’organisation du menu et savoir où cliquer le premier jour.',
    sections: [
      {
        titre: 'Accroche (≈ 40 s)',
        ecran: '/v3, en haut de page.',
        texte:
          "Première vidéo de la visite : votre point d'entrée. Si vous ne retenez qu'une chose aujourd'hui, retenez l'ordre du menu, car c'est l'ordre dans lequel un livre se fabrique.",
      },
      {
        titre: 'Démonstration (≈ 3 min)',
        ecran: 'Descendre lentement /v3, survoler le menu, ouvrir /v3/commence-ici.',
        texte:
          "En haut, le bandeau de lancement : la date d'ouverture et ce qui est déjà accessible.\n\nJuste en dessous, la vidéo de présentation, le studio de couverture, puis les nouveautés du moment.\n\nDans le menu principal : Créer, Écrire, Habiller, Publier, Vendre, Livres spéciaux, Forfaits. On crée l'idée, on écrit, on habille le livre, on le publie, on le vend.\n\nÀ gauche, la barre latérale garde vos raccourcis : créer un livre, mes livres, mes couvertures, mes réglages. Vous pouvez la masquer si vous préférez travailler au large.\n\nEnfin, la page « Commencer ici » : elle vous donne la première action à faire, sans réfléchir.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Retour en haut de /v3.',
        texte:
          "Voilà le plan de l'atelier. Dans la prochaine vidéo, on crée un livre depuis zéro avec Ebookstudio-Génie.",
      },
    ],
  },
  {
    numero: 2,
    titre: 'Ebookstudio-Génie : créer mon livre',
    duree: 5,
    type: 'ecran',
    route: '/v3/create',
    objectif: 'Savoir remplir la fiche du livre et lancer un projet propre.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/create, écran d’accueil du Génie.',
        texte:
          "On commence par le début : créer le projet. Ici, on ne demande pas d'être technique, on demande de répondre à des questions simples sur votre livre.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Parcourir les quatre étapes : détails, réglages, personnages, génération.',
        texte:
          "Première étape, les détails : le titre provisoire, le sujet, le public visé. Écrivez comme vous parleriez à un libraire.\n\nDeuxième étape, les réglages : le genre, le ton, la longueur visée, le nombre de chapitres. C'est ici que se décide le rythme du livre.\n\nTroisième étape, les personnages : indispensable en roman, facultatif en non-fiction.\n\nQuatrième étape, la génération : on lance, et l'outil construit. Vous gardez la main : rien n'est définitif, tout se modifie ensuite.\n\nUn conseil : mieux vaut un sujet étroit et clair qu'un sujet immense et flou. Les meilleurs livres répondent à une seule question de lecteur.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'La fiche remplie.',
        texte:
          "Le projet existe, il est enregistré, vous pourrez le reprendre quand vous voulez. On passe au sommaire.",
      },
    ],
  },
  {
    numero: 3,
    titre: 'Le sommaire construit avec l’IA',
    duree: 5,
    type: 'ecran',
    route: '/v3/create?sommaire=ia et /v3/outils/sommaire-ultime',
    objectif: 'Obtenir un sommaire solide et le corriger à la main.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: 'Sommaire IA, écran vide.',
        texte:
          "Le sommaire, c'est la charpente. Un livre avec un bon sommaire s'écrit presque tout seul ; un livre sans sommaire s'arrête au chapitre trois.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Dialoguer avec l’IA, modifier un titre de chapitre, réordonner, ouvrir le Sommaire Ultime.',
        texte:
          "On dialogue : je dis ce que je veux, l'outil propose, je corrige. Regardez, je remplace ce titre trop vague par une promesse concrète.\n\nJe déplace ce chapitre : la progression doit suivre celle du lecteur, pas la mienne.\n\nJe supprime les doublons. Deux chapitres qui disent la même chose, c'est un livre qui donne l'impression de tourner en rond.\n\nAvec le Sommaire Ultime, on obtient une table des matières propre, éditable et exportable, prête pour l'écriture.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le sommaire validé.',
        texte:
          "Prenez vraiment le temps sur cette étape : c'est la seule où dix minutes de plus font gagner des jours.",
      },
    ],
  },
  {
    numero: 4,
    titre: 'Studio Pro : la Bible du livre, puis la rédaction',
    duree: 5,
    type: 'ecran',
    route: '/v3/studio',
    objectif: 'Comprendre le duo « architecte » et « plume » pour les livres exigeants.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/studio.',
        texte:
          "Voici l'onglet des livres exigeants : romans longs, sagas, ouvrages avec beaucoup de personnages et de cohérence à tenir.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Construire la Bible, valider, lancer la rédaction chapitre par chapitre.',
        texte:
          "Première phase : la Bible du livre. Synopsis, structure, personnages, chronologie. C'est le carnet de l'architecte.\n\nVous lisez, vous corrigez, vous validez. Rien n'est écrit avant votre accord.\n\nDeuxième phase : la rédaction, chapitre par chapitre, en gardant la mémoire de ce qui précède. C'est ce qui évite les contradictions entre le chapitre deux et le chapitre dix-huit.\n\nOn peut s'arrêter, revenir demain, reprendre au chapitre suivant.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Un chapitre rédigé.',
        texte:
          "Si votre livre est simple, restez sur le Génie. Si votre livre est ambitieux, venez ici.",
      },
    ],
  },
  {
    numero: 5,
    titre: 'Personnages et importation d’un manuscrit',
    duree: 5,
    type: 'ecran',
    route: '/v3/create?step=3 et /v3/create?import=1',
    objectif: 'Créer des personnages utiles et reprendre un texte déjà commencé.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: 'Étape Personnages.',
        texte:
          "Deux situations très fréquentes : vous écrivez une fiction avec plusieurs personnages, ou vous avez déjà un texte en cours sur votre ordinateur.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Ajouter un personnage, puis importer un fichier DOCX ou TXT.',
        texte:
          "Un personnage utile tient en quatre lignes : ce qu'il veut, ce qui l'empêche, ce qu'il cache, comment il parle. Le reste est du décor.\n\nJ'en ajoute un deuxième, en opposition avec le premier : c'est l'opposition qui crée l'histoire.\n\nMaintenant l'importation. Je dépose un fichier Word ou texte. L'outil découpe en chapitres et récupère votre texte tel quel.\n\nÀ partir de là, votre manuscrit existant rejoint l'atelier : correction, couverture, export, tout devient accessible.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le manuscrit importé.',
        texte:
          "Personne ne repart de zéro ici. Si vous avez déjà écrit, on continue votre travail.",
      },
    ],
  },
  {
    numero: 6,
    titre: 'Le parcours des agents : écrire le livre entier',
    duree: 5,
    type: 'visage+ecran',
    route: '/v3/hub?tab=parcours',
    objectif: 'Savoir lancer l’écriture complète et suivre l’avancement.',
    sections: [
      {
        titre: 'Accroche (≈ 40 s)',
        ecran: 'Caméra courte, puis le parcours.',
        texte:
          "C'est le cœur de l'atelier. Plutôt qu'une seule grosse machine, le travail est découpé en étapes, chacune avec son rôle précis.",
      },
      {
        titre: 'Démonstration (≈ 3 min)',
        ecran: 'Parcourir les étapes, montrer la barre d’avancement, ouvrir un chapitre rédigé.',
        texte:
          "Chaque étape fait une chose et la fait bien : le plan, la documentation, la rédaction, l'harmonisation du style, la relecture finale.\n\nLa barre d'avancement vous dit où vous en êtes. Vous pouvez fermer l'onglet : le travail est enregistré, vous reprenez plus tard.\n\nOn ouvre un chapitre rédigé : je le lis, je le modifie si besoin. Votre voix reste la vôtre, et je vous conseille toujours de relire vous-même.\n\nUn dernier point important : on garde des chapitres de longueur raisonnable. Un livre bien découpé se lit mieux et se corrige plus vite.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le livre en cours.',
        texte:
          "Le texte existe. Passons à la correction, parce qu'un texte brut n'est pas encore un livre.",
      },
    ],
  },
  {
    numero: 7,
    titre: 'Corriger mon livre (manuscrit terminé)',
    duree: 5,
    type: 'ecran',
    route: '/v3/corriger',
    objectif: 'Faire corriger un manuscrit complet, chapitre par chapitre.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/corriger.',
        texte:
          "Cet onglet est pour ceux qui arrivent avec un livre déjà écrit, parfois depuis des années, et qui n'osent pas le publier.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Importer un manuscrit, lancer la correction, comparer avant / après.',
        texte:
          "J'importe le manuscrit. L'outil le découpe en chapitres et travaille chapitre par chapitre, pas en une seule fois : c'est plus fiable.\n\nRegardez l'affichage avant et après. Vous voyez ce qui a changé, et vous acceptez ou vous refusez.\n\nLa correction touche l'orthographe, la grammaire, les répétitions, les phrases trop longues, les tournures maladroites. Elle ne réécrit pas votre livre à votre place.\n\nÀ la fin, le texte corrigé part directement vers l'export.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le manuscrit corrigé.',
        texte:
          "Un livre corrigé, c'est un lecteur qui reste. Ne sautez jamais cette étape.",
      },
    ],
  },
  {
    numero: 8,
    titre: 'BookPerfect et l’assistant Ebookstudio',
    duree: 5,
    type: 'ecran',
    route: '/bookperfect et /v3/assistant',
    objectif: 'Polir un texte et trouver le bon outil en posant une question.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/bookperfect.',
        texte:
          "Deux outils de confort, très utilisés au quotidien : l'un polit le texte, l'autre répond à vos questions sur l'atelier.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Polir un passage dans BookPerfect, puis poser une question dans l’assistant.',
        texte:
          "Dans BookPerfect, je colle un passage un peu lourd. On travaille le rythme, on enlève le gras, on garde le sens.\n\nC'est l'outil du perfectionniste : à utiliser sur les passages importants, l'ouverture, la fin de chapitre, la quatrième de couverture.\n\nEnsuite, l'assistant. Je tape ma question en français simple : « comment je fabrique ma couverture ? ». Il répond, et il me donne le bouton vers la bonne page.\n\nC'est le raccourci quand vous ne savez plus où aller dans l'atelier.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'La réponse de l’assistant.',
        texte:
          "Gardez ces deux onglets en favori : ils font gagner beaucoup de temps.",
      },
    ],
  },
  {
    numero: 9,
    titre: 'Traduction en 10 langues',
    duree: 5,
    type: 'ecran',
    route: '/v3/outils/traduction',
    objectif: 'Traduire un livre et savoir ce qu’il faut vérifier avant de publier.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/outils/traduction.',
        texte:
          "Votre livre existe en français. Les autres marchés Amazon existent aussi. Voici comment on ouvre la porte.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Choisir une langue, traduire un chapitre, relire.',
        texte:
          "Dix langues disponibles : anglais, espagnol, allemand, italien, portugais, néerlandais, polonais, japonais, chinois, arabe.\n\nOn traduit chapitre par chapitre, puis on relit. Je le dis franchement : une traduction doit être relue, idéalement par quelqu'un qui parle la langue.\n\nPensez aussi à traduire la description, le titre et les mots-clés : un livre anglais avec une fiche française ne se vend pas.\n\nEt la couverture : parfois un simple changement de texte suffit.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le chapitre traduit.',
        texte:
          "Commencez par une seule langue, celle où votre sujet a un public. Une bonne traduction vaut mieux que cinq approximatives.",
      },
    ],
  },
  {
    numero: 10,
    titre: 'Mes livres : reprendre, sauvegarder, avancer',
    duree: 5,
    type: 'ecran',
    route: '/v3/mes-livres et /v3/book/:id',
    objectif: 'Ne plus jamais perdre un projet et savoir où il en est.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/mes-livres.',
        texte:
          "La question qu'on me pose le plus : « et si je ferme mon navigateur, je perds tout ? » Non. Voici pourquoi.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Ouvrir la liste, entrer dans un livre, montrer l’avancement et la reprise.',
        texte:
          "Voici tous vos projets, avec leur état d'avancement. J'ouvre celui-ci.\n\nSur la page du livre : le sommaire, les chapitres écrits, ce qui reste à faire, la couverture associée, les exports.\n\nJe reprends au chapitre où je m'étais arrêté. L'enregistrement se fait au fur et à mesure, sans bouton à chercher.\n\nJe vous conseille malgré tout d'exporter votre texte régulièrement sur votre ordinateur. C'est votre manuscrit : gardez-en toujours une copie chez vous.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'La liste des livres.',
        texte:
          "C'est votre bibliothèque de travail. Les vidéos suivantes habillent le livre.",
      },
    ],
  },
  {
    numero: 11,
    titre: 'Studio de couverture : l’illustration',
    duree: 5,
    type: 'visage+ecran',
    route: '/v3/couverture (studio de couverture)',
    objectif: 'Obtenir une illustration de couverture crédible et commerciale.',
    sections: [
      {
        titre: 'Accroche (≈ 40 s)',
        ecran: 'Caméra courte, puis le studio.',
        texte:
          "La couverture, c'est votre vendeur. Sur Amazon, elle est vue en tout petit, à côté de dizaines d'autres. Elle doit être lisible avant d'être jolie.",
      },
      {
        titre: 'Démonstration (≈ 3 min)',
        ecran: 'Étape 1 « Illustration » : choisir une direction artistique, générer, ajuster la luminosité.',
        texte:
          "On commence par l'illustration seule, sans texte : c'est le décor du livre.\n\nJe choisis une direction artistique adaptée au genre. Un roman historique et un guide pratique ne se ressemblent pas.\n\nJe génère, je compare, je garde la meilleure. Je peux éclaircir ou assombrir l'image, et revenir en arrière si je vais trop loin.\n\nRègle simple : une image claire, un sujet unique, pas de détails minuscules qui disparaîtront en vignette.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le bouton « Continuer dans l’éditeur ».',
        texte:
          "L'illustration est prête. On passe aux textes, au dos et à l'export dans la vidéo suivante.",
      },
    ],
  },
  {
    numero: 12,
    titre: 'Couverture : textes, dos, quatrième et export',
    duree: 5,
    type: 'ecran',
    route: 'Éditeur de couverture, étapes 2 à 4',
    objectif: 'Terminer une couverture complète et exporter le fichier.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: 'Éditeur de couverture, étape 2.',
        texte:
          "Le parcours est volontairement en quatre temps : illustration, textes, dos et quatrième, export. On suit l'ordre, et on ne se perd pas.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Poser titre et sous-titre, choisir la police, remplir le dos et la quatrième, exporter.',
        texte:
          "Étape deux : le titre, le sous-titre, le nom d'auteur. Une police lisible, un contraste franc. Le titre doit se lire à la taille d'un timbre.\n\nÉtape trois : le dos et la quatrième de couverture, pour le format papier. Le dos dépend du nombre de pages : l'outil s'en occupe.\n\nÉtape quatre : l'export. Pour le Kindle, on sort une image aux bonnes dimensions, directement depuis votre navigateur.\n\nBroché et relié sont aussi prévus, avec leurs marges propres.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le fichier exporté.',
        texte:
          "Vous avez une couverture professionnelle, sans logiciel de graphisme à apprendre.",
      },
    ],
  },
  {
    numero: 13,
    titre: 'Illustrations, BD et mockup 3D',
    duree: 5,
    type: 'ecran',
    route: '/v3/mockup et les outils d’illustration',
    objectif: 'Illustrer l’intérieur du livre et créer une image de présentation.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: 'Outils d’illustration.',
        texte:
          "Tout ce qui se voit autour du texte : les images intérieures, les planches, et l'image du livre en volume qu'on utilise pour la promotion.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Générer une illustration intérieure, montrer le studio BD, créer un mockup 3D.',
        texte:
          "Pour l'intérieur, on garde une cohérence : même style, même lumière, d'un bout à l'autre du livre.\n\nLe studio BD et jeunesse est un module à part, payant : je vous le montre pour que vous sachiez qu'il existe, sans vous laisser croire qu'il est inclus partout.\n\nEnfin le mockup 3D : votre couverture posée sur un livre réaliste. C'est l'image que vous utiliserez sur les réseaux, dans vos emails et sur votre page auteur.\n\nJe la télécharge, elle est prête à publier.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le mockup téléchargé.',
        texte:
          "Le livre est habillé. On passe à la publication.",
      },
    ],
  },
  {
    numero: 14,
    titre: 'Données KDP et export du fichier final',
    duree: 5,
    type: 'visage+ecran',
    route: '/v3/donnees-kdp',
    objectif: 'Préparer tout ce que KDP demande et sortir le fichier à déposer.',
    sections: [
      {
        titre: 'Accroche (≈ 40 s)',
        ecran: 'Caméra courte, puis /v3/donnees-kdp.',
        texte:
          "C'est le moment où beaucoup d'auteurs abandonnent : le formulaire Amazon. On va le remplir tranquillement, ligne par ligne.",
      },
      {
        titre: 'Démonstration (≈ 3 min)',
        ecran: 'Remplir les données KDP, montrer les catégories et le compteur de mots, exporter.',
        texte:
          "Titre, sous-titre, auteur, description, langue, mots-clés, catégories : tout est regroupé ici, au même endroit.\n\nLes catégories se choisissent dans une liste très large : on cherche celle où votre livre a une vraie chance d'être vu, pas la plus prestigieuse.\n\nLe compteur de mots vous dit où vous en êtes, ce qui est utile pour estimer le nombre de pages du format papier.\n\nEt enfin l'export : le fichier du livre, prêt à déposer. Vous vérifiez une dernière fois la table des matières et les titres de chapitre.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le fichier final.',
        texte:
          "Votre livre est publiable. Les vidéos suivantes servent à le rendre visible.",
      },
    ],
  },
  {
    numero: 15,
    titre: 'Fiche Audit : description, mots-clés, contenu A+',
    duree: 5,
    type: 'ecran',
    route: '/v3/kdp/fiche-audit',
    objectif: 'Obtenir une fiche Amazon complète à partir d’un ASIN.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/kdp/fiche-audit.',
        texte:
          "Votre livre est en ligne, mais sa fiche est pauvre. C'est le défaut le plus courant et le plus facile à corriger.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Coller un ASIN, générer la description, les 7 mots-clés et les 4 modules A+, charger la couverture.',
        texte:
          "Je colle l'ASIN du livre et je choisis le marché. Les informations réelles du livre sont récupérées.\n\nOn obtient une description de vente en français, prête à coller dans KDP, puis sept mots-clés pour les champs de l'arrière-boutique.\n\nEnsuite le contenu A+ : quatre modules, avec leur texte et leur image. Un conseil important : chargez d'abord votre couverture, pour que les images reprennent ses couleurs et son ambiance.\n\nJe télécharge les images aux bonnes dimensions et je copie les textes.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Les modules générés.',
        texte:
          "Une fiche complète donne confiance. C'est souvent ce qui déclenche l'achat.",
      },
    ],
  },
  {
    numero: 16,
    titre: 'Mots-clés percutants : un sujet, 7 mots-clés KDP',
    duree: 5,
    type: 'ecran',
    route: '/v3/kdp/mots-cles',
    objectif: 'Remplir intelligemment les sept champs de mots-clés de KDP.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/kdp/mots-cles.',
        texte:
          "Sept champs de mots-clés chez Amazon. Sept occasions d'être trouvé, ou sept occasions gâchées.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Mode « par mot-clé » puis « par ASIN », montrer les expressions et les titres proposés.',
        texte:
          "Deux façons de travailler : à partir d'un sujet, ou à partir d'un ASIN existant.\n\nOn obtient les sept mots-clés à coller, des expressions à viser, des idées de titres et de sous-titres, et une liste de ce qu'il faut éviter.\n\nSoyons honnêtes sur un point : la concurrence est indiquée de façon qualitative, faible, moyenne ou forte. Je refuse d'afficher des chiffres inventés de volume de recherche.\n\nTout est modifiable, copiable et exportable, et l'historique garde vos dernières recherches.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Les sept mots-clés.',
        texte:
          "Changez vos mots-clés, attendez quelques semaines, observez. C'est un réglage, pas une loterie.",
      },
    ],
  },
  {
    numero: 17,
    titre: 'Publicité Amazon : vos campagnes prêtes à recopier',
    duree: 5,
    type: 'ecran',
    route: '/v3/kdp/publicite',
    objectif: 'Préparer un plan de campagnes clair avant de dépenser un euro.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/kdp/publicite.',
        texte:
          "La publicité n'est pas obligatoire. Mais si vous en faites, faites-la avec un plan écrit, pas au hasard.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Décrire le livre ou coller un ASIN, ajouter des ASIN concurrents, générer le plan.',
        texte:
          "Je décris mon livre, ou je colle son ASIN. Je peux ajouter les ASIN de livres concurrents que je veux cibler : uniquement ceux que je choisis moi-même.\n\nJe demande un plan simple, trois campagnes, ou un plan complet, cinq campagnes.\n\nPour chaque campagne : le ciblage, l'objectif, les mots-clés, les livres visés, un budget de départ et une enchère de départ.\n\nJe suis très clair : ces montants sont des points de départ à ajuster, pas des promesses. On surveille, on coupe ce qui ne marche pas, on garde ce qui marche.\n\nIl y a aussi une liste de mots-clés négatifs, pour éviter de payer des clics inutiles.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le plan exporté.',
        texte:
          "Commencez petit, lisez vos chiffres réels chaque semaine, et ne dépensez jamais ce que vous ne pouvez pas perdre.",
      },
    ],
  },
  {
    numero: 18,
    titre: 'Radar de niches : un thème, 10 idées de livres',
    duree: 5,
    type: 'ecran',
    route: '/v3/kdp/radar-niches',
    objectif: 'Choisir une niche centrée sur un vrai problème de lecteur.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/kdp/radar-niches.',
        texte:
          "Avant d'écrire, il faut savoir pour qui. Cet onglet transforme un thème large en dix pistes précises.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Saisir un thème, lire les 10 niches, ouvrir les trois sections repliables.',
        texte:
          "J'entre un thème large. J'obtiens dix niches, chacune avec le problème du lecteur, à qui elle s'adresse, la demande, la concurrence et l'angle de différenciation.\n\nLa demande et la concurrence sont des estimations qualitatives, annoncées comme telles.\n\nEn bas, trois sections que vous pouvez ouvrir quand vous voulez : comment ça marche, la bonne logique pour choisir une niche, et les erreurs à éviter. Lisez surtout la troisième.\n\nMa règle personnelle : une niche, un problème, un lecteur. Si vous ne savez pas décrire votre lecteur en une phrase, la niche est trop large.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Une niche retenue.',
        texte:
          "Choisissez une piste, puis revenez à la vidéo deux pour créer le livre.",
      },
    ],
  },
  {
    numero: 19,
    titre: 'Plan de lancement : vos 30 premiers jours',
    duree: 5,
    type: 'ecran',
    route: '/v3/kdp/lancement',
    objectif: 'Savoir quoi faire chaque jour pendant le premier mois.',
    sections: [
      {
        titre: 'Accroche (≈ 30 s)',
        ecran: '/v3/kdp/lancement.',
        texte:
          "Publier un livre et ne rien faire ensuite, c'est le laisser dormir. Voici un mois d'actions, une par jour.",
      },
      {
        titre: 'Démonstration (≈ 3 min 30)',
        ecran: 'Générer le plan, cocher un jour, montrer les messages prêts à publier.',
        texte:
          "Je pars de mon livre ou de son ASIN. Le plan sort en quatre semaines, avec pour chaque jour une action, un canal et un texte prêt à publier.\n\nJe coche les jours faits : le compteur vous montre l'avancement. C'est bête, mais c'est ce qui fait tenir.\n\nLes objectifs affichés sont des repères à surveiller, pas des résultats garantis. Aucun auteur sérieux ne vous promettra des ventes.\n\nJe copie, j'exporte, et je garde le plan dans mon historique.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: 'Le plan coché.',
        texte:
          "Trente petites actions valent mieux qu'une grande annonce suivie d'un long silence.",
      },
    ],
  },
  {
    numero: 20,
    titre: 'Réglages, clés API et forfaits',
    duree: 5,
    type: 'visage+ecran',
    route: '/v3/parametres, /v3/fonctionnalites/cles, /v3/forfaits',
    objectif: 'Configurer son espace et comprendre ce que contient chaque forfait.',
    sections: [
      {
        titre: 'Accroche (≈ 40 s)',
        ecran: 'Caméra courte, puis /v3/parametres.',
        texte:
          "Dernière vidéo de la visite : les réglages, puis les forfaits. Je vous dis les prix et ce qu'il y a dedans, sans détour.",
      },
      {
        titre: 'Démonstration (≈ 3 min)',
        ecran: 'Montrer les paramètres, la page des clés, puis la page des forfaits.',
        texte:
          "Dans les paramètres : vos coordonnées d'auteur, vos réseaux, vos préférences d'écriture.\n\nLa page des clés : vous y renseignez votre propre clé, et vous testez qu'elle fonctionne. La page explique où l'obtenir, étape par étape.\n\nMaintenant les forfaits. Plume : vingt-sept euros par mois, ou deux cent soixante-dix euros par an. Édition : quarante-sept euros par mois, ou quatre cent soixante-dix euros par an. En annuel, deux mois sont offerts.\n\nSi vous étiez déjà client de la version 2, vous gardez moins vingt pour cent à vie, et la version 2 reste accessible.\n\nCertains modules restent payants à part : je vous les signale toujours à l'écran.",
      },
      {
        titre: 'Conclusion (≈ 40 s)',
        ecran: '/v3/forfaits.',
        texte:
          "Vous avez vu l'atelier en entier. L'ouverture publique a lieu le 1er octobre. Prenez l'onglet qui vous concerne aujourd'hui, et commencez par là. À bientôt.",
      },
    ],
  },
];

/** Texte complet d'un script, prêt à copier dans Loom. */
export function scriptToText(s: ScriptTutoriel): string {
  const entete = [
    `Vidéo ${s.numero} — ${s.titre}`,
    `Durée visée : ${s.duree} min · ${TYPE_LABELS[s.type]}`,
    `À ouvrir : ${s.route}`,
    `Objectif : ${s.objectif}`,
  ].join('\n');
  const corps = s.sections
    .map((sec) => `## ${sec.titre}\n${sec.ecran ? `À l'écran : ${sec.ecran}\n` : ''}\n${sec.texte}`)
    .join('\n\n');
  return `${entete}\n\n${corps}`;
}

/** Tous les scripts en un seul document. */
export function tousLesScriptsTexte(): string {
  return SCRIPTS_TUTORIELS.map(scriptToText).join('\n\n———\n\n');
}
