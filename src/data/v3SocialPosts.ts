/**
 * Calendrier de 30 jours de publications prêtes à copier-coller.
 * Aucun chiffre inventé : les textes parlent de la méthode et de l'outil,
 * jamais de résultats non vérifiables.
 * Le jeton {{LIEN}} est remplacé à l'affichage par le lien de partage
 * (lien de parrainage de l'abonné s'il en a un).
 */
export interface SocialPostDay {
  day: number;
  theme: string;
  /** Post long, ton conversationnel — groupes Facebook d'auteurs/KDP. */
  facebook: string;
  /** Post professionnel — LinkedIn. */
  linkedin: string;
  /** Script de 20 à 30 secondes — Reels / TikTok / Shorts. */
  short: string;
  hashtags: string[];
}

const H_FR = ['autoedition', 'amazonkdp', 'ecrireunlivre', 'ebookstudio'];
const H_PRO = ['autoedition', 'ia', 'edition', 'ecriture'];

export const V3_SOCIAL_POSTS: SocialPostDay[] = [
  {
    day: 1,
    theme: 'La promesse',
    facebook:
      "Beaucoup d'auteurs abandonnent leur livre non pas par manque d'idées, mais parce qu'ils se noient entre le plan, la rédaction, la correction et les fichiers Amazon.\n\nJ'ai construit Ebookstudio pour tenir une seule promesse : partir d'une idée et arriver à un fichier prêt à publier, sans rien laisser en chemin.\n\nJe vous offre le pack de 10 niches + le kit de démarrage, sans rien acheter : {{LIEN}}",
    linkedin:
      "L'autoédition ne bloque presque jamais sur l'écriture. Elle bloque sur la chaîne : structurer, rédiger, corriger, mettre en forme, préparer les métadonnées Amazon.\n\nEbookstudio couvre cette chaîne complète, de l'idée au fichier accepté par KDP.\n\nPack de 10 niches + kit de démarrage offerts : {{LIEN}}",
    short:
      "Plan large : « Votre idée de livre est là depuis des mois. » — Écran de l'app : « Voici ce qui manquait : la chaîne complète, du plan au fichier Amazon. » — Fin : « Le pack de niches est offert, lien en bio. »",
    hashtags: H_FR,
  },
  {
    day: 2,
    theme: 'Le sommaire construit à deux',
    facebook:
      "Un livre qui se vend commence par un sommaire pensé pour un lecteur précis, pas par un plan générique.\n\nDans Ebookstudio, le sommaire se construit en dialogue : vous donnez vos idées, l'IA les structure, vous validez chapitre par chapitre. Rien n'est écrit avant votre accord.\n\nÀ tester avec le kit offert : {{LIEN}}",
    linkedin:
      "Le sommaire est le vrai livrable stratégique d'un livre : il fixe la promesse, la progression et le public.\n\nNous l'avons donc rendu conversationnel : proposition, validation par blocs de chapitres, ajustement. L'auteur garde la décision à chaque étape.\n\n{{LIEN}}",
    short:
      "« On ne commence pas un livre par la page 1. » — Capture du dialogue Sommaire IA — « Vos idées, structurées, validées par vous. »",
    hashtags: H_PRO,
  },
  {
    day: 3,
    theme: 'Voir son livre s’écrire',
    facebook:
      "Ce qui rassure le plus les auteurs : voir le texte apparaître.\n\nEbookstudio affiche le livre en direct pendant la rédaction, chapitre après chapitre, avec le compteur de mots. Vous pouvez lire, corriger, réécrire un passage à tout moment.\n\n{{LIEN}}",
    linkedin:
      "Un outil d'écriture assistée doit être transparent : on doit voir ce qui est produit, quand c'est produit.\n\nD'où l'affichage « votre livre en direct » : lecture, correction et réécriture ciblée pendant la génération.\n\n{{LIEN}}",
    short:
      "« Où en est mon livre ? » — Capture de l'aperçu en direct — « Vous le voyez s'écrire, vous gardez la main. »",
    hashtags: H_FR,
  },
  {
    day: 4,
    theme: 'Le mode Copilot',
    facebook:
      "Vous écrivez avec vos mots, l'IA les rend nets sans les remplacer. C'est ça le mode Copilot : vos idées, votre voix, une écriture propre.\n\nOn compare avant/après côte à côte, vous choisissez ce que vous gardez.\n\n{{LIEN}}",
    linkedin:
      "Le risque de l'IA en écriture, c'est l'uniformisation du style.\n\nNotre réponse : un mode copilote qui polit le passage dicté et affiche systématiquement « vos mots d'origine » face à la version corrigée. L'auteur arbitre.\n\n{{LIEN}}",
    short:
      "« Je ne veux pas d'un texte robot. » — Capture avant/après — « Vos mots, corrigés. Pas remplacés. »",
    hashtags: H_PRO,
  },
  {
    day: 5,
    theme: 'La correction maison d’édition',
    facebook:
      "Un manuscrit non relu se repère en trois lignes : phrases coupées, répétitions, ponctuation flottante.\n\nEbookstudio applique une correction en plusieurs passes : réparation de la dictée, orthographe et grammaire, style, cohérence des fins de chapitre.\n\n{{LIEN}}",
    linkedin:
      "La relecture professionnelle n'est pas une passe unique. Nous en appliquons plusieurs, dans un ordre défini : réparation de la saisie, langue, style, cohérence narrative.\n\nRésultat : un manuscrit lisible sans intervention supplémentaire.\n\n{{LIEN}}",
    short:
      "« Ce qui trahit un livre autoédité ? » — Zoom sur un texte corrigé — « Une relecture en plusieurs passes. »",
    hashtags: H_FR,
  },
  {
    day: 6,
    theme: 'La couverture',
    facebook:
      "Sur Amazon, la couverture décide du clic. Point.\n\nCover Studio Pro génère une couverture au bon format, avec le dos calculé selon le nombre de pages, et le gabarit complet prêt à téléverser.\n\n{{LIEN}}",
    linkedin:
      "Sur une place de marché, la vignette est le premier filtre commercial.\n\nCover Studio Pro produit une couverture au format KDP exact, dos calculé selon la pagination, gabarit complet exportable.\n\n{{LIEN}}",
    short:
      "« Votre couverture a une seconde pour convaincre. » — Capture Cover Studio Pro — « Format KDP exact, dos calculé. »",
    hashtags: H_FR,
  },
  {
    day: 7,
    theme: 'Les données KDP',
    facebook:
      "Le moment où beaucoup d'auteurs calent : le formulaire Amazon. Description, 7 mots-clés, 3 catégories, bio.\n\nEbookstudio les prépare à partir de votre livre, dans un format que KDP accepte. Vous copiez, vous collez.\n\n{{LIEN}}",
    linkedin:
      "Publier sur KDP, c'est renseigner des métadonnées qui pilotent la découvrabilité : description formatée, mots-clés backend, catégories.\n\nNous les générons depuis le manuscrit et les livrons au format attendu.\n\n{{LIEN}}",
    short:
      "« Le formulaire Amazon fait abandonner. » — Capture page Données KDP — « Description, mots-clés, catégories : prêts. »",
    hashtags: H_PRO,
  },
  {
    day: 8,
    theme: 'Choisir sa niche',
    facebook:
      "Écrire un livre sans regarder la demande, c'est publier pour personne.\n\nJe partage 10 niches à fort potentiel, avec pourquoi elles tiennent : {{LIEN}}",
    linkedin:
      "Avant d'écrire, valider la demande : volume de recherche, concurrence, angle disponible.\n\nJe partage une sélection de 10 niches avec l'analyse qui va avec : {{LIEN}}",
    short:
      "« La niche compte plus que le talent. » — Capture des 10 niches — « C'est offert, lien en bio. »",
    hashtags: H_FR,
  },
  {
    day: 9,
    theme: 'La biographie',
    facebook:
      "Beaucoup de gens veulent écrire leur vie et ne savent pas par où commencer.\n\nLe mode Biographie pose les questions à votre place, en 9 étapes, et transforme vos réponses en récit.\n\n{{LIEN}}",
    linkedin:
      "Le récit de vie est le projet éditorial le plus fréquent — et le plus souvent abandonné, faute de méthode.\n\nNotre mode Biographie structure l'entretien en 9 étapes puis rédige à partir des réponses.\n\n{{LIEN}}",
    short:
      "« Écrire votre vie ? » — Capture des 9 étapes — « Vous répondez, le récit se construit. »",
    hashtags: H_FR,
  },
  {
    day: 10,
    theme: 'Les livres pour enfants',
    facebook:
      "Album 3-6 ans, histoires du soir 3-7 ans : texte court, images cohérentes, format prêt pour l'impression.\n\nC'est l'un des segments les plus accessibles pour un premier livre.\n\n{{LIEN}}",
    linkedin:
      "Le livre illustré jeunesse demande une cohérence visuelle d'une page à l'autre. C'est le point dur.\n\nNos presets 3-6 et 3-7 ans verrouillent le style et le personnage sur l'ensemble de l'album.\n\n{{LIEN}}",
    short:
      "« Un album jeunesse en une soirée ? » — Pages illustrées qui défilent — « Style et personnage constants. »",
    hashtags: H_FR,
  },
  {
    day: 11,
    theme: 'Le workflow 15 agents',
    facebook:
      "Un livre, ce n'est pas une seule tâche. C'est quinze : idée, marché, sommaire, personnages, rédaction, relecture, couverture, métadonnées…\n\nEbookstudio les enchaîne dans un pipeline, et vous suivez chaque étape.\n\n{{LIEN}}",
    linkedin:
      "Nous avons découpé la production d'un livre en 15 étapes spécialisées plutôt qu'un prompt géant.\n\nChaque étape a un rôle, un contrôle et une sortie vérifiable. C'est ce qui rend le résultat reproductible.\n\n{{LIEN}}",
    short:
      "« Un prompt ne fait pas un livre. » — Grille des 15 agents — « 15 étapes, chacune vérifiable. »",
    hashtags: H_PRO,
  },
  {
    day: 12,
    theme: 'La traduction',
    facebook:
      "Un livre écrit, dix marchés possibles. La traduction est intégrée : vous choisissez la langue au démarrage du projet.\n\n{{LIEN}}",
    linkedin:
      "Le même manuscrit peut adresser plusieurs marchés Amazon. La traduction est donc intégrée au projet, dès le paramétrage initial.\n\n{{LIEN}}",
    short: "« Un livre. Dix marchés. » — Sélecteur de langue — « La traduction est intégrée. »",
    hashtags: H_PRO,
  },
  {
    day: 13,
    theme: 'L’audio',
    facebook:
      "Le format audio ouvre un public que le papier n'atteint pas.\n\nEbookstudio génère la version audio de votre livre, chapitre par chapitre, exportable.\n\n{{LIEN}}",
    linkedin:
      "L'audio n'est plus un format annexe. Nous produisons la lecture du manuscrit chapitre par chapitre, avec export prêt à diffuser.\n\n{{LIEN}}",
    short: "« Et si votre livre se lisait tout seul ? » — Lecteur audio — « Version audio générée. »",
    hashtags: H_FR,
  },
  {
    day: 14,
    theme: 'Les avis clients',
    facebook:
      "Un livre sans avis ne décolle pas. Ce n'est pas une question de chance, c'est une marche à suivre.\n\nJ'ai écrit la procédure complète, étape par étape, dans l'outil.\n\n{{LIEN}}",
    linkedin:
      "La preuve sociale conditionne la conversion d'une fiche produit. Nous documentons donc la démarche de collecte d'avis, conforme aux règles Amazon.\n\n{{LIEN}}",
    short: "« Zéro avis = zéro vente. » — Capture de la marche à suivre — « La procédure existe. »",
    hashtags: H_FR,
  },
  {
    day: 15,
    theme: 'Objection : « l’IA écrit mal »',
    facebook:
      "« L'IA écrit plat. » Souvent vrai — quand on lui demande un livre entier en un clic.\n\nEbookstudio travaille chapitre par chapitre, avec une mémoire du récit et vos consignes de style. Et vous relisez tout.\n\n{{LIEN}}",
    linkedin:
      "Le reproche fait à l'IA — un texte lisse et sans mémoire — vient surtout de la méthode employée.\n\nNous rédigeons chapitre par chapitre avec mémoire narrative persistante et contraintes de style explicites.\n\n{{LIEN}}",
    short: "« L'IA écrit plat ? » — Chapitre à l'écran — « Pas si on écrit chapitre par chapitre. »",
    hashtags: H_PRO,
  },
  {
    day: 16,
    theme: 'Objection : « je n’y connais rien »',
    facebook:
      "Vous n'avez pas besoin de savoir formater un fichier, calculer un dos de couverture ou choisir un code catégorie.\n\nL'outil s'en charge. Vous, vous racontez.\n\n{{LIEN}}",
    linkedin:
      "La barrière à l'entrée de l'autoédition est technique, pas créative : formats, gabarits, métadonnées.\n\nNous absorbons cette couche pour laisser l'auteur sur le contenu.\n\n{{LIEN}}",
    short: "« Je n'y connais rien en édition. » — Écrans qui défilent — « Justement. »",
    hashtags: H_FR,
  },
  {
    day: 17,
    theme: 'Objection : « je n’ai pas le temps »',
    facebook:
      "Le temps ne se perd pas à écrire. Il se perd à recommencer : plan refait, chapitres incohérents, mise en forme reprise trois fois.\n\nUne chaîne unique supprime ces reprises.\n\n{{LIEN}}",
    linkedin:
      "Le coût réel d'un livre autoédité n'est pas la rédaction : ce sont les reprises. Plan, cohérence, mise en forme, métadonnées.\n\nUne chaîne intégrée élimine ces allers-retours.\n\n{{LIEN}}",
    short: "« Pas le temps ? » — Timeline du projet — « Le temps se perd dans les reprises. »",
    hashtags: H_PRO,
  },
  {
    day: 18,
    theme: 'Le kit de démarrage',
    facebook:
      "J'ai réuni tout ce qu'il faut pour démarrer dans un kit : les étapes, les écrans, les pièges à éviter.\n\nC'est offert, sans engagement : {{LIEN}}",
    linkedin:
      "Un guide de démarrage complet : parcours de production, écrans, points de vigilance sur KDP.\n\nAccès libre : {{LIEN}}",
    short: "« Par où commencer ? » — Pages du kit — « Le kit est offert. »",
    hashtags: H_FR,
  },
  {
    day: 19,
    theme: 'La mémoire du récit',
    facebook:
      "Le vrai problème d'un livre long : le chapitre 12 oublie le chapitre 3.\n\nEbookstudio garde une mémoire du récit : personnages, lieux, dates, révélations. La cohérence tient jusqu'à la fin.\n\n{{LIEN}}",
    linkedin:
      "La cohérence sur 200 pages est un problème de mémoire, pas de style.\n\nNous maintenons une mémoire structurée du récit — personnages, chronologie, informations révélées — réinjectée à chaque chapitre.\n\n{{LIEN}}",
    short: "« Le chapitre 12 oublie le chapitre 3. » — Fiche mémoire — « Plus maintenant. »",
    hashtags: H_PRO,
  },
  {
    day: 20,
    theme: 'Importer un manuscrit existant',
    facebook:
      "Vous avez déjà un manuscrit dans un tiroir ? Importez-le : correction, mise en forme, couverture, métadonnées Amazon.\n\nPas besoin de repartir de zéro.\n\n{{LIEN}}",
    linkedin:
      "Un manuscrit existant n'a pas besoin d'être réécrit : il a besoin d'être fini.\n\nImport, correction éditoriale, mise en forme, préparation KDP.\n\n{{LIEN}}",
    short: "« Un manuscrit inachevé dans un tiroir ? » — Import à l'écran — « Finissez-le. »",
    hashtags: H_FR,
  },
  {
    day: 21,
    theme: 'La recherche de mots-clés',
    facebook:
      "Les 7 mots-clés backend d'Amazon décident si votre livre est trouvable.\n\nL'outil les propose à partir de votre sujet et de ce que cherchent les lecteurs.\n\n{{LIEN}}",
    linkedin:
      "Les champs de mots-clés KDP sont un levier de découvrabilité sous-exploité.\n\nNous les générons à partir du sujet du livre et des requêtes réelles du marché.\n\n{{LIEN}}",
    short: "« 7 mots-clés. Tout se joue là. » — Capture mots-clés — « Générés pour votre sujet. »",
    hashtags: H_PRO,
  },
  {
    day: 22,
    theme: 'Espionner la concurrence',
    facebook:
      "Avant d'écrire, regardez ce que vend déjà votre niche : prix, pagination, positionnement, avis.\n\nL'analyse par ASIN vous donne ces repères.\n\n{{LIEN}}",
    linkedin:
      "L'analyse concurrentielle sur Amazon est factuelle : prix pratiqués, pagination, positionnement, volume d'avis.\n\nNotre module ASIN restitue ces données avant la phase d'écriture.\n\n{{LIEN}}",
    short: "« Regardez d'abord ce qui vend. » — Analyse ASIN — « Les repères avant d'écrire. »",
    hashtags: H_PRO,
  },
  {
    day: 23,
    theme: 'La mise en forme',
    facebook:
      "Un sommaire propre, des titres cohérents, une pagination qui tient : c'est ce qui fait qu'un livre a l'air publié.\n\nL'export s'en occupe, Word et PDF.\n\n{{LIEN}}",
    linkedin:
      "La mise en forme fait la crédibilité perçue d'un ouvrage : table des matières, hiérarchie des titres, pagination.\n\nExports Word et PDF conformes.\n\n{{LIEN}}",
    short: "« Ce qui fait \"vrai livre\" ? » — Sommaire mis en page — « La mise en forme. »",
    hashtags: H_FR,
  },
  {
    day: 24,
    theme: 'Pour les formateurs et consultants',
    facebook:
      "Si vous formez, conseillez ou coachez, un livre est votre meilleure carte de visite. Il travaille pendant que vous dormez.\n\n{{LIEN}}",
    linkedin:
      "Pour un consultant ou un formateur, le livre reste l'actif d'autorité le plus durable : il qualifie les prospects avant le premier échange.\n\nEncore faut-il pouvoir le produire sans y perdre un trimestre.\n\n{{LIEN}}",
    short: "« Votre meilleure carte de visite ? » — Livre en main — « Un livre à votre nom. »",
    hashtags: H_PRO,
  },
  {
    day: 25,
    theme: 'Pour les artisans et commerçants',
    facebook:
      "Votre métier contient un livre : vos méthodes, vos erreurs, vos conseils. Ça intéresse plus de monde que vous ne le pensez.\n\n{{LIEN}}",
    linkedin:
      "Un savoir-faire métier constitue un contenu éditorial recherché : méthodes, cas concrets, erreurs à éviter.\n\nLe transformer en livre est aujourd'hui une question d'outillage.\n\n{{LIEN}}",
    short: "« Votre métier contient un livre. » — Défilé de couvertures — « Il ne manque que l'outil. »",
    hashtags: H_FR,
  },
  {
    day: 26,
    theme: 'La série',
    facebook:
      "Un livre attire un lecteur. Une série le garde.\n\nLa bible de série tient les personnages, l'univers et la chronologie sur plusieurs tomes.\n\n{{LIEN}}",
    linkedin:
      "L'économie de l'autoédition récompense la série : acquisition sur le tome 1, marge sur les suivants.\n\nD'où la bible de série : personnages, univers, chronologie partagés entre les tomes.\n\n{{LIEN}}",
    short: "« Un livre attire. Une série retient. » — Bible de série — « Cohérence multi-tomes. »",
    hashtags: H_PRO,
  },
  {
    day: 27,
    theme: 'Les mockups',
    facebook:
      "Pour vendre un livre en ligne, il faut le montrer. Les mockups 3D transforment un fichier en objet désirable.\n\n{{LIEN}}",
    linkedin:
      "Un fichier ne se vend pas ; un objet, si. Les rendus 3D servent la page produit comme la communication de lancement.\n\n{{LIEN}}",
    short: "« Montrez-le, ne le décrivez pas. » — Mockups 3D — « Un fichier devient un objet. »",
    hashtags: H_FR,
  },
  {
    day: 28,
    theme: 'La question qui fait avancer',
    facebook:
      "Question sincère à ceux qui ont un projet de livre : qu'est-ce qui vous bloque exactement — le plan, l'écriture, ou la publication ?\n\nRépondez en commentaire, je réponds à chacun.",
    linkedin:
      "Question aux auteurs en projet : le blocage se situe où exactement — structuration, rédaction, ou publication ?\n\nLes réponses orientent directement ce que nous construisons.",
    short: "« Qu'est-ce qui vous bloque : le plan, l'écriture ou la publication ? » — « Dites-le en commentaire. »",
    hashtags: H_FR,
  },
  {
    day: 29,
    theme: 'Le parrainage',
    facebook:
      "Si l'outil vous sert, il servira sûrement à un auteur autour de vous. Partagez votre lien, la recommandation est récompensée.\n\n{{LIEN}}",
    linkedin:
      "La recommandation entre auteurs reste le canal le plus efficace de ce marché. Notre programme de parrainage la rémunère.\n\n{{LIEN}}",
    short: "« Un auteur autour de vous en a besoin. » — Lien de parrainage — « La recommandation est récompensée. »",
    hashtags: H_FR,
  },
  {
    day: 30,
    theme: 'L’appel clair',
    facebook:
      "Résumé simple : vous avez une idée, Ebookstudio vous emmène jusqu'au fichier publiable. Le pack de 10 niches et le kit de démarrage sont offerts pour tester la méthode.\n\n{{LIEN}}",
    linkedin:
      "De l'idée au fichier accepté par Amazon, sans rupture dans la chaîne.\n\nPour évaluer la méthode : pack de 10 niches et kit de démarrage en accès libre.\n\n{{LIEN}}",
    short: "« De l'idée au fichier publiable. » — Écrans de l'app — « Commencez avec le pack offert. »",
    hashtags: H_FR,
  },
];

export const SOCIAL_CHANNELS = [
  { id: 'facebook', label: 'Facebook / Groupes', hint: 'Ton conversationnel, posté dans les groupes auteurs & KDP' },
  { id: 'linkedin', label: 'LinkedIn', hint: 'Ton professionnel, sans emoji' },
  { id: 'short', label: 'Reels / TikTok / Shorts', hint: 'Script de 20 à 30 secondes' },
] as const;

export type SocialChannel = (typeof SOCIAL_CHANNELS)[number]['id'];
