import type { QuestionEntry } from './v3Questions.types';

/**
 * Questions-réponses supplémentaires rédigées à la main.
 * Même format que le fichier principal : question, réponse, thème, bouton vers l'outil.
 */
export const EXTRA_CURATED: QuestionEntry[] = [
  // ── Écrire mon livre ─────────────────────────────────────────────
  {
    id: 'x-ecrire-01',
    question: 'Par où commencer quand je n’ai aucune idée de livre ?',
    answer:
      'Ouvrez le kit de démarrage : il propose des idées, des niches et un exemple de plan que vous pouvez reprendre tel quel.',
    theme: 'Écrire mon livre',
    action: { label: 'Ouvrir le kit de démarrage', route: '/v3/kit-demarrage' },
  },
  {
    id: 'x-ecrire-02',
    question: 'Puis-je partir d’un sommaire que j’ai déjà écrit ?',
    answer:
      'Oui. Dans la création de livre, choisissez « J’ai déjà mon sommaire », collez-le, et c’est ce sommaire qui sera respecté à la lettre.',
    theme: 'Écrire mon livre',
    action: { label: 'Créer mon livre', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-03',
    question: 'Le sommaire proposé ne me plaît pas, puis-je le réécrire ?',
    answer:
      'Chaque titre de chapitre est modifiable, vous pouvez en ajouter, en supprimer et changer l’ordre avant de lancer la rédaction.',
    theme: 'Écrire mon livre',
    action: { label: 'Modifier mon sommaire', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-04',
    question: 'Combien de mots par chapitre puis-je demander ?',
    answer:
      'Vous fixez vous-même la longueur, généralement entre 800 et 5 000 mots par chapitre selon le type de livre.',
    theme: 'Écrire mon livre',
    action: { label: 'Créer mon livre', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-05',
    question: 'Puis-je écrire un roman et pas seulement un guide pratique ?',
    answer:
      'Oui : romans, nouvelles, biographies, guides, carnets et livres jeunesse sont pris en charge, avec un ton adapté au genre choisi.',
    theme: 'Écrire mon livre',
    action: { label: 'Choisir mon type de livre', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-06',
    question: 'Le génie peut-il me poser des questions avant d’écrire ?',
    answer:
      'Oui, il pose une ou deux questions précises sur votre projet pour éviter les contresens, et vous pouvez répondre ou choisir « Plus tard ».',
    theme: 'Écrire mon livre',
    action: { label: 'Parler au génie', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-07',
    question: 'Mes chapitres sont-ils enregistrés si je ferme la page ?',
    answer:
      'Oui, chaque chapitre terminé est enregistré au fur et à mesure ; vous retrouvez le projet dans vos livres.',
    theme: 'Écrire mon livre',
    action: { label: 'Mes livres', route: '/v3/mes-livres' },
  },
  {
    id: 'x-ecrire-08',
    question: 'Puis-je écrire plusieurs livres en même temps ?',
    answer:
      'Oui, chaque projet est indépendant : vous passez de l’un à l’autre depuis la liste de vos livres sans mélanger les sommaires.',
    theme: 'Écrire mon livre',
    action: { label: 'Voir mes projets', route: '/v3/mes-livres' },
  },
  {
    id: 'x-ecrire-09',
    question: 'Comment continuer un livre commencé la semaine dernière ?',
    answer:
      'Ouvrez-le depuis vos livres : la rédaction reprend au premier chapitre non écrit, sans recommencer les précédents.',
    theme: 'Écrire mon livre',
    action: { label: 'Reprendre un livre', route: '/v3/mes-livres' },
  },
  {
    id: 'x-ecrire-10',
    question: 'Puis-je réécrire un seul chapitre qui ne me plaît pas ?',
    answer:
      'Oui, chaque chapitre se relance ou se modifie individuellement, les autres restent intacts.',
    theme: 'Écrire mon livre',
    action: { label: 'Ouvrir mon livre', route: '/v3/mes-livres' },
  },
  {
    id: 'x-ecrire-11',
    question: 'Puis-je écrire un livre à partir d’un document que j’ai déjà ?',
    answer:
      'Utilisez l’import : votre texte devient la base du projet, que vous pouvez ensuite structurer, corriger et exporter.',
    theme: 'Écrire mon livre',
    action: { label: 'Importer mon texte', route: '/v3/import' },
  },
  {
    id: 'x-ecrire-12',
    question: 'Comment écrire un livre très long, façon « version longue » ?',
    answer:
      'Le studio Version Longue enchaîne plan, chapitres, couverture et export pour les livres volumineux, chapitre par chapitre.',
    theme: 'Écrire mon livre',
    action: { label: 'Version Longue', route: '/v3/version-longue' },
  },
  {
    id: 'x-ecrire-13',
    question: 'Puis-je écrire une série de plusieurs tomes ?',
    answer:
      'Oui, l’outil séries et tomes garde la cohérence de l’univers d’un tome à l’autre.',
    theme: 'Écrire mon livre',
    action: { label: 'Séries et tomes', route: '/series-tomes' },
  },
  {
    id: 'x-ecrire-14',
    question: 'Comment écrire ma biographie ou celle d’un proche ?',
    answer:
      'L’atelier biographie vous guide par questions et transforme vos souvenirs en chapitres rédigés.',
    theme: 'Écrire mon livre',
    action: { label: 'Atelier biographie', route: '/v3/biographie' },
  },
  {
    id: 'x-ecrire-15',
    question: 'Puis-je faire un livre illustré pour enfants ?',
    answer:
      'Oui, la création illustrée associe texte court et images page par page, pensée pour les jeunes lecteurs.',
    theme: 'Écrire mon livre',
    action: { label: 'Créer un livre illustré', route: '/v3/create/illustre' },
  },
  {
    id: 'x-ecrire-16',
    question: 'Combien de temps prend l’écriture complète d’un livre ?',
    answer:
      'Comptez quelques minutes par chapitre : un livre de 12 chapitres est souvent prêt dans l’heure, un livre de 40 chapitres demande plus de patience.',
    theme: 'Écrire mon livre',
    action: { label: 'Lancer un livre', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-17',
    question: 'Que faire si un chapitre s’arrête au milieu d’une phrase ?',
    answer:
      'Relancez ce chapitre : la fin est reprise proprement, et le correcteur répare aussi les fins incomplètes.',
    theme: 'Écrire mon livre',
    action: { label: 'Corriger mon livre', route: '/v3/corriger' },
  },
  {
    id: 'x-ecrire-18',
    question: 'Le texte est-il bien écrit en français, sans mots inventés ?',
    answer:
      'Oui : le français est la seule langue de rédaction, et un balayage supprime le latin, les pseudo-mots et les artefacts.',
    theme: 'Écrire mon livre',
    action: { label: 'Vérifier mon texte', route: '/v3/corriger' },
  },
  {
    id: 'x-ecrire-19',
    question: 'Puis-je imposer mon style d’écriture ?',
    answer:
      'Indiquez le ton souhaité dans le brief (chaleureux, direct, littéraire…) et il est appliqué à tous les chapitres.',
    theme: 'Écrire mon livre',
    action: { label: 'Régler mon brief', route: '/v3/create' },
  },
  {
    id: 'x-ecrire-20',
    question: 'Puis-je écrire un livre à partir d’une niche repérée ?',
    answer:
      'Depuis une niche, le bouton « Commencer » ouvre un brief déjà rempli (titre, sous-titre, catégorie, synopsis, chapitres) que vous ajustez.',
    theme: 'Écrire mon livre',
    action: { label: 'Voir les 600 niches', route: '/niches-600' },
  },

  // ── Corriger mon livre ───────────────────────────────────────────
  {
    id: 'x-corr-01',
    question: 'Le correcteur change-t-il mon histoire ?',
    answer:
      'Non : il corrige la langue, la ponctuation et les scories, sans réécrire l’intrigue ni supprimer de passages.',
    theme: 'Corriger mon livre',
    action: { label: 'Corriger mon livre', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-02',
    question: 'Puis-je corriger un livre écrit ailleurs ?',
    answer:
      'Oui, collez ou importez votre texte : le correcteur ne demande pas que le livre ait été écrit ici.',
    theme: 'Corriger mon livre',
    action: { label: 'Ouvrir le correcteur', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-03',
    question: 'Puis-je comparer l’avant et l’après correction ?',
    answer:
      'Le texte d’origine reste conservé, vous gardez donc la version initiale à côté de la version corrigée.',
    theme: 'Corriger mon livre',
    action: { label: 'Mes livres corrigés', route: '/v3/livres-corriges' },
  },
  {
    id: 'x-corr-04',
    question: 'La correction supprime-t-elle mes paragraphes courts ?',
    answer:
      'Non, plus aucun paragraphe n’est retiré automatiquement, même très court comme une réplique de dialogue.',
    theme: 'Corriger mon livre',
    action: { label: 'Corriger mon livre', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-05',
    question: 'Combien de fois puis-je relancer la correction ?',
    answer:
      'Autant de fois que nécessaire ; chaque passage repart du texte que vous avez choisi.',
    theme: 'Corriger mon livre',
    action: { label: 'Relancer la correction', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-06',
    question: 'Comment rendre mon texte plus naturel, moins « robot » ?',
    answer:
      'L’humaniseur retravaille le rythme et les formulations pour un rendu plus humain, par tranches automatiques.',
    theme: 'Corriger mon livre',
    action: { label: 'Ouvrir l’humaniseur', route: '/v3/outils/humanizer' },
  },
  {
    id: 'x-corr-07',
    question: 'Une relecture professionnelle est-elle possible ?',
    answer:
      'BookPerfect propose une relecture renforcée du manuscrit complet, incluse dans l’offre Édition.',
    theme: 'Corriger mon livre',
    action: { label: 'Découvrir BookPerfect', route: '/bookperfect' },
  },
  {
    id: 'x-corr-08',
    question: 'Que faire si la correction affiche une erreur de serveur ?',
    answer:
      'Relancez : les chapitres en échec sont réessayés, et votre texte d’origine n’est jamais perdu entre-temps.',
    theme: 'Corriger mon livre',
    action: { label: 'Ouvrir le correcteur', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-09',
    question: 'Puis-je corriger seulement quelques pages ?',
    answer:
      'Oui, collez uniquement le passage concerné : la correction s’applique à ce que vous fournissez.',
    theme: 'Corriger mon livre',
    action: { label: 'Corriger un passage', route: '/v3/corriger' },
  },
  {
    id: 'x-corr-10',
    question: 'Le nombre de mots final est-il vérifiable ?',
    answer:
      'Le compteur de mots donne le total du manuscrit, utile avant de fixer le prix et le format papier.',
    theme: 'Corriger mon livre',
    action: { label: 'Compter mes mots', route: '/word-count' },
  },

  // ── Couverture & illustrations ───────────────────────────────────
  {
    id: 'x-cov-01',
    question: 'Comment créer ma première couverture simplement ?',
    answer:
      'La couverture express vous guide pas à pas : titre, sous-titre, synopsis, image, puis téléchargement.',
    theme: 'Couverture & illustrations',
    action: { label: 'Couverture express', route: '/v3/couverture-express' },
  },
  {
    id: 'x-cov-02',
    question: 'Où retrouver toutes mes couvertures ?',
    answer:
      'Dans « Mes couvertures » : chaque projet a un bouton pour ouvrir l’éditeur, renommer, dupliquer ou supprimer.',
    theme: 'Couverture & illustrations',
    action: { label: 'Mes couvertures', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-03',
    question: 'L’image de couverture est-elle générée automatiquement ?',
    answer:
      'Oui : votre titre, votre genre et votre synopsis servent à produire une illustration, sans texte incrusté pour rester modifiable.',
    theme: 'Couverture & illustrations',
    action: { label: 'Générer une illustration', route: '/v3/cover-pro' },
  },
  {
    id: 'x-cov-04',
    question: 'Mon illustration est trop sombre, puis-je l’éclaircir ?',
    answer:
      'Oui, un réglage de luminosité, contraste et saturation est disponible et il est conservé au téléchargement.',
    theme: 'Couverture & illustrations',
    action: { label: 'Ouvrir l’éditeur', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-05',
    question: 'Puis-je déplacer et modifier le titre sur la couverture ?',
    answer:
      'Le titre, le sous-titre et le nom d’auteur sont des calques déplaçables, avec choix de police, taille et couleur.',
    theme: 'Couverture & illustrations',
    action: { label: 'Éditer ma couverture', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-06',
    question: 'Existe-t-il des modèles de couverture prêts à l’emploi ?',
    answer:
      'Oui, une galerie de modèles par genre applique en un clic une composition et une typographie cohérentes.',
    theme: 'Couverture & illustrations',
    action: { label: 'Voir les modèles', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-07',
    question: 'Comment obtenir le fichier Kindle de ma couverture ?',
    answer:
      'Le bouton de téléchargement Kindle produit un JPEG 1600 × 2560 directement dans votre navigateur, sans repères ni interface.',
    theme: 'Couverture & illustrations',
    action: { label: 'Télécharger ma couverture', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-08',
    question: 'Et pour un livre broché avec dos et quatrième ?',
    answer:
      'L’éditeur propose les onglets Première, Dos et Quatrième, puis un export complet aux dimensions du format choisi.',
    theme: 'Couverture & illustrations',
    action: { label: 'Ouvrir l’éditeur broché', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-09',
    question: 'La couverture rigide est-elle prise en charge ?',
    answer:
      'Oui, avec la géométrie propre au relié (rabats et charnières) et des avertissements si la taille ou les marges posent problème.',
    theme: 'Couverture & illustrations',
    action: { label: 'Cover Studio Pro', route: '/v3/cover-studio-pro' },
  },
  {
    id: 'x-cov-10',
    question: 'Que contient exactement l’offre couverture à 67 € ?',
    answer:
      'La page dédiée détaille les formats couverts (Kindle, broché, relié), les modèles et les exports inclus.',
    theme: 'Couverture & illustrations',
    action: { label: 'Voir l’offre couverture', route: '/v3/offre-couverture-v4' },
  },
  {
    id: 'x-cov-11',
    question: 'Puis-je faire plusieurs essais avant de choisir ?',
    answer:
      'Oui, jusqu’à trois propositions par demande, et l’historique de vos images reste privé dans le projet.',
    theme: 'Couverture & illustrations',
    action: { label: 'Générer des propositions', route: '/v3/cover-pro' },
  },
  {
    id: 'x-cov-12',
    question: 'Mes couvertures sont-elles visibles par d’autres personnes ?',
    answer:
      'Non, vos images sont stockées en privé et ne s’affichent que pour votre compte.',
    theme: 'Couverture & illustrations',
    action: { label: 'Mes couvertures', route: '/v3/mes-couvertures' },
  },
  {
    id: 'x-cov-13',
    question: 'Pourquoi mes livres affichent-ils la même couverture ?',
    answer:
      'Choisissez la bonne image dans le sélecteur de couverture du livre : l’association se fait alors sur ce projet précis.',
    theme: 'Couverture & illustrations',
    action: { label: 'Ma bibliothèque', route: '/v3/library' },
  },
  {
    id: 'x-cov-14',
    question: 'Puis-je présenter mon livre en 3D pour la promotion ?',
    answer:
      'Le générateur de maquette 3D transforme votre couverture en visuel de présentation.',
    theme: 'Couverture & illustrations',
    action: { label: 'Maquette 3D', route: '/v3/outils/mockup-3d' },
  },
  {
    id: 'x-cov-15',
    question: 'Comment décrire l’image que je veux vraiment ?',
    answer:
      'Écrivez la scène en une ou deux phrases : décor, ambiance, couleurs. La description devient la consigne visuelle.',
    theme: 'Couverture & illustrations',
    action: { label: 'Décrire mon image', route: '/v3/cover-pro' },
  },

  // ── Publier sur Amazon KDP ───────────────────────────────────────
  {
    id: 'x-kdp-01',
    question: 'Quel format de fichier envoyer à Amazon KDP ?',
    answer:
      'Un DOCX ou un PDF pour l’intérieur, et un JPEG ou PDF pour la couverture selon le format choisi.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Exporter mon livre', route: '/v3/hub?tab=export' },
  },
  {
    id: 'x-kdp-02',
    question: 'Comment choisir mes mots-clés KDP ?',
    answer:
      'Le générateur de mots-clés propose des expressions recherchées par les lecteurs, prêtes à coller dans les sept champs.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Mots-clés KDP', route: '/kdp-keywords' },
  },
  {
    id: 'x-kdp-03',
    question: 'Comment choisir mes catégories sur Amazon ?',
    answer:
      'L’outil catégories vous aide à viser des rayons atteignables plutôt que les plus concurrentiels.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Choisir mes catégories', route: '/v3/outils/categories' },
  },
  {
    id: 'x-kdp-04',
    question: 'Comment savoir combien je vais gagner par vente ?',
    answer:
      'Le calculateur de royalties estime votre gain selon le prix, le format et le nombre de pages.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Calculer mes royalties', route: '/v3/outils/royalties' },
  },
  {
    id: 'x-kdp-05',
    question: 'Puis-je publier sur les Amazon étrangers ?',
    answer:
      'Oui, le guide KDP étranger explique comment adapter titre, description et mots-clés par marché.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Publier à l’étranger', route: '/creer-ebook-kdp-etranger' },
  },
  {
    id: 'x-kdp-06',
    question: 'Quelles données KDP dois-je préparer avant publication ?',
    answer:
      'Titre, sous-titre, auteur, description, mots-clés, catégories, prix et format : la fiche données KDP les regroupe.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Mes données KDP', route: '/v3/donnees-kdp' },
  },
  {
    id: 'x-kdp-07',
    question: 'Comment rédiger la description qui vend sur la fiche produit ?',
    answer:
      'Le générateur de fiche produit propose une accroche, des bénéfices et un appel à l’action lisibles sur mobile.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Rédiger ma fiche', route: '/v3/hub' },
  },
  {
    id: 'x-kdp-08',
    question: 'Faut-il un ISBN payant ?',
    answer:
      'Non, Amazon fournit un identifiant gratuit ; un ISBN acheté n’est utile que pour une diffusion hors KDP.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Guide publication', route: '/publication-pro' },
  },
  {
    id: 'x-kdp-09',
    question: 'Comment vérifier que mon livre respecte les règles KDP ?',
    answer:
      'L’audit de publication passe en revue les points qui provoquent le plus de refus avant votre envoi.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Auditer mon livre', route: '/audit-pilot' },
  },
  {
    id: 'x-kdp-10',
    question: 'Quel prix de vente choisir pour démarrer ?',
    answer:
      'Comparez le prix des livres du même rayon, puis validez votre marge avec le calculateur de royalties.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Tester un prix', route: '/v3/outils/royalties' },
  },
  {
    id: 'x-kdp-11',
    question: 'Existe-t-il une remise sur KDP Pilot ?',
    answer:
      'Oui, un code promo de 15 % est affiché et copiable sur la page KDP Pilot de la V3.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Voir KDP Pilot', route: '/v3/kdp-pilot' },
  },
  {
    id: 'x-kdp-12',
    question: 'Faut-il faire de la publicité Amazon dès le premier livre ?',
    answer:
      'Ce n’est pas obligatoire : le guide KDP Ads explique quand une campagne devient utile et à quel budget.',
    theme: 'Publier sur Amazon KDP',
    action: { label: 'Guide KDP Ads', route: '/kdp-ads-guide' },
  },

  // ── Audio & audiolivres ──────────────────────────────────────────
  {
    id: 'x-audio-01',
    question: 'Puis-je transformer mon livre en audiolivre ?',
    answer:
      'Oui, le studio audio lit vos chapitres avec une voix de synthèse et vous fournit les fichiers.',
    theme: 'Audio & audiolivres',
    action: { label: 'Studio audio', route: '/v3/outils/audiobook' },
  },
  {
    id: 'x-audio-02',
    question: 'Puis-je écouter un extrait avant de me lancer ?',
    answer:
      'La démo audio vous fait entendre le rendu des voix sur un court passage.',
    theme: 'Audio & audiolivres',
    action: { label: 'Écouter la démo', route: '/audiobook-demo' },
  },
  {
    id: 'x-audio-03',
    question: 'Combien de voix sont disponibles ?',
    answer:
      'Plusieurs voix féminines et masculines, avec réglage du débit, sont proposées dans le studio audio.',
    theme: 'Audio & audiolivres',
    action: { label: 'Choisir une voix', route: '/v3/outils/audiobook' },
  },
  {
    id: 'x-audio-04',
    question: 'Que faire des fichiers audio obtenus ?',
    answer:
      'Vous les téléchargez pour les vendre, les offrir en bonus ou les mettre en ligne sur votre boutique.',
    theme: 'Audio & audiolivres',
    action: { label: 'Studio audio', route: '/v3/outils/audiobook' },
  },
  {
    id: 'x-audio-05',
    question: 'L’audiolivre est-il inclus dans mon forfait ?',
    answer:
      'L’audio standard est inclus dès Plume, la version premium fait partie de l’offre Édition.',
    theme: 'Audio & audiolivres',
    action: { label: 'Comparer les forfaits', route: '/v3/forfaits' },
  },

  // ── Traductions & langues ────────────────────────────────────────
  {
    id: 'x-trad-01',
    question: 'Puis-je traduire mon livre ?',
    answer:
      'Oui, l’outil de traduction prend le manuscrit complet et conserve la structure des chapitres.',
    theme: 'Traductions & langues',
    action: { label: 'Traduire mon livre', route: '/v3/traduire' },
  },
  {
    id: 'x-trad-02',
    question: 'Combien de langues sont proposées ?',
    answer:
      'Dix langues principales sont disponibles, dont l’anglais, l’espagnol, l’allemand et l’italien.',
    theme: 'Traductions & langues',
    action: { label: 'Voir les langues', route: '/v3/traduire' },
  },
  {
    id: 'x-trad-03',
    question: 'La traduction est-elle relue ?',
    answer:
      'La traduction automatique est incluse ; la version relue fait partie des compléments de l’offre Édition.',
    theme: 'Traductions & langues',
    action: { label: 'Comparer les forfaits', route: '/v3/forfaits' },
  },
  {
    id: 'x-trad-04',
    question: 'Faut-il republier séparément la version traduite ?',
    answer:
      'Oui, chaque langue devient une fiche produit distincte sur Amazon, avec ses propres mots-clés.',
    theme: 'Traductions & langues',
    action: { label: 'Préparer mes données KDP', route: '/v3/donnees-kdp' },
  },

  // ── Niches & mots-clés ───────────────────────────────────────────
  {
    id: 'x-niche-01',
    question: 'Comment trouver une niche qui vend vraiment ?',
    answer:
      'Partez des 600 niches classées : chacune indique le sujet, l’angle et un point de départ de livre.',
    theme: 'Niches & mots-clés',
    action: { label: 'Explorer les 600 niches', route: '/niches-600' },
  },
  {
    id: 'x-niche-02',
    question: 'Puis-je voir ce que font mes concurrents ?',
    answer:
      'L’espion de concurrents analyse les livres déjà en place sur une niche pour repérer les manques.',
    theme: 'Niches & mots-clés',
    action: { label: 'Espionner une niche', route: '/v3/outils/espion-concurrents' },
  },
  {
    id: 'x-niche-03',
    question: 'Comment savoir si une niche est saturée ?',
    answer:
      'Regardez le nombre de titres récents et la qualité de leurs couvertures : peu de titres soignés signale une place à prendre.',
    theme: 'Niches & mots-clés',
    action: { label: 'Analyser une niche', route: '/v3/outils/espion-concurrents' },
  },
  {
    id: 'x-niche-04',
    question: 'Y a-t-il des idées de livres offertes ?',
    answer:
      'Oui, une sélection de niches est offerte librement pour tester la méthode avant tout achat.',
    theme: 'Niches & mots-clés',
    action: { label: 'Niches offertes', route: '/10-niches-offertes' },
  },
  {
    id: 'x-niche-05',
    question: 'Comment choisir entre deux niches qui me plaisent ?',
    answer:
      'Choisissez celle où vous pouvez publier plusieurs tomes : la série rentabilise mieux qu’un titre isolé.',
    theme: 'Niches & mots-clés',
    action: { label: 'Voir les niches', route: '/niches' },
  },
  {
    id: 'x-niche-06',
    question: 'Comment trouver des mots-clés pour la publicité Amazon ?',
    answer:
      'Le générateur de mots-clés AMS liste des expressions à tester pour vos campagnes.',
    theme: 'Niches & mots-clés',
    action: { label: 'Mots-clés AMS', route: '/v3/outils/ams-keywords' },
  },
  {
    id: 'x-niche-07',
    question: 'Une recherche approfondie sur mon sujet est-elle possible ?',
    answer:
      'Oui, la recherche approfondie rassemble faits, chiffres et angles utiles avant d’écrire, dans l’offre Édition.',
    theme: 'Niches & mots-clés',
    action: { label: 'Recherche approfondie', route: '/v3/recherche' },
  },

  // ── Vendre & faire connaître ─────────────────────────────────────
  {
    id: 'x-vente-01',
    question: 'Comment faire connaître mon livre sans budget publicité ?',
    answer:
      'Le plan marketing détaille les actions gratuites : posts, e-mails, communauté et bouche-à-oreille.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Mon plan marketing', route: '/plan-marketing' },
  },
  {
    id: 'x-vente-02',
    question: 'Puis-je générer des publications pour les réseaux sociaux ?',
    answer:
      'Oui, le générateur de posts produit des textes prêts à publier à partir de votre livre.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Générer des posts', route: '/generateur-posts' },
  },
  {
    id: 'x-vente-03',
    question: 'Comment lancer mon livre le jour de la sortie ?',
    answer:
      'La campagne de vente enchaîne annonce, rappel et dernier jour, avec les textes fournis.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Campagne de vente', route: '/campagne-vente' },
  },
  {
    id: 'x-vente-04',
    question: 'Comment obtenir mes premiers avis lecteurs ?',
    answer:
      'Proposez le livre à un petit groupe de lecteurs avant la sortie et demandez un avis honnête à la publication.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Programme lecteurs', route: '/arc-signup' },
  },
  {
    id: 'x-vente-05',
    question: 'Puis-je écrire une page de vente pour mon livre ?',
    answer:
      'Oui, le studio de contenu génère argumentaire, bénéfices et objections traitées.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Studio de contenu', route: '/v3/contentstudio' },
  },
  {
    id: 'x-vente-06',
    question: 'Comment créer une page auteur crédible ?',
    answer:
      'Votre page auteur regroupe biographie, livres et liens, et vous choisissez ce qui reste visible.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Ma page auteur', route: '/v3/auteur' },
  },
  {
    id: 'x-vente-07',
    question: 'Les vidéos aident-elles à vendre un livre ?',
    answer:
      'Oui, un court script de présentation suffit souvent ; un modèle de script est fourni.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Script vidéo', route: '/v3/script-heygen' },
  },
  {
    id: 'x-vente-08',
    question: 'Comment travailler avec des influenceurs ?',
    answer:
      'La fiche influenceurs propose les messages d’approche et le cadre d’un partenariat simple.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Approcher des influenceurs', route: '/influenceurs' },
  },
  {
    id: 'x-vente-09',
    question: 'Puis-je offrir un cadeau pour récolter des e-mails ?',
    answer:
      'Oui, un extrait ou un guide court sert d’aimant, et les inscrits arrivent dans votre suivi de prospects.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Mes prospects', route: '/gestion-prospects' },
  },
  {
    id: 'x-vente-10',
    question: 'Comment améliorer le référencement de mes pages ?',
    answer:
      'Le générateur SEO propose titres, descriptions et mots-clés adaptés à votre sujet.',
    theme: 'Vendre & faire connaître',
    action: { label: 'Générateur SEO', route: '/seo-generator' },
  },

  // ── Business & revenus ──────────────────────────────────────────
  {
    id: 'x-biz-01',
    question: 'Combien de livres faut-il pour un revenu régulier ?',
    answer:
      'La régularité vient plutôt d’une série de titres sur une même niche que d’un livre unique.',
    theme: 'Business & revenus',
    action: { label: 'Centre business', route: '/business-center' },
  },
  {
    id: 'x-biz-02',
    question: 'Puis-je vendre mes livres ailleurs qu’Amazon ?',
    answer:
      'Oui, vos fichiers exportés vous appartiennent et peuvent être vendus sur votre propre boutique.',
    theme: 'Business & revenus',
    action: { label: 'Exporter mes fichiers', route: '/v3/hub?tab=export' },
  },
  {
    id: 'x-biz-03',
    question: 'Comment suivre mes résultats de vente ?',
    answer:
      'Le tableau de bord rassemble vos chiffres et vos projets pour voir ce qui progresse.',
    theme: 'Business & revenus',
    action: { label: 'Mon tableau de bord', route: '/v3/hub' },
  },
  {
    id: 'x-biz-04',
    question: 'Existe-t-il un programme partenaire ?',
    answer:
      'Oui, le programme partenaires reverse une commission sur le premier paiement des personnes que vous amenez.',
    theme: 'Business & revenus',
    action: { label: 'Devenir partenaire', route: '/partenaires' },
  },
  {
    id: 'x-biz-05',
    question: 'Puis-je offrir un accès en cadeau ?',
    answer:
      'Oui, la carte cadeau permet d’offrir un accès à une autre personne.',
    theme: 'Business & revenus',
    action: { label: 'Carte cadeau', route: '/carte-cadeau' },
  },
  {
    id: 'x-biz-06',
    question: 'Puis-je être accompagné individuellement ?',
    answer:
      'Le coaching individuel est disponible et fait partie des compléments de l’offre Édition.',
    theme: 'Business & revenus',
    action: { label: 'Voir le coaching', route: '/coaching-vip' },
  },
  {
    id: 'x-biz-07',
    question: 'Puis-je vendre des livres jeunesse et des cahiers d’activités ?',
    answer:
      'Oui, coloriages, cherche-et-trouve, puzzles et carnets sont des formats rapides à produire.',
    theme: 'Business & revenus',
    action: { label: 'Studio jeunesse', route: '/bd-studio' },
  },
  {
    id: 'x-biz-08',
    question: 'Comment fixer un prix sans casser ma marge ?',
    answer:
      'Partez du coût d’impression et de la royaltie visée, puis ajustez vers le prix du marché.',
    theme: 'Business & revenus',
    action: { label: 'Calculer', route: '/v3/outils/royalties' },
  },

  // ── Forfaits & paiement ─────────────────────────────────────────
  {
    id: 'x-forf-01',
    question: 'Quels sont les prix affichés aujourd’hui ?',
    answer:
      'Plume est à 27 € par mois et Édition à 47 € par mois. En annuel, deux mois sont offerts.',
    theme: 'Forfaits & paiement',
    action: { label: 'Voir les forfaits', route: '/v3/forfaits' },
  },
  {
    id: 'x-forf-02',
    question: 'Puis-je changer de forfait plus tard ?',
    answer:
      'Oui, vous pouvez passer de Plume à Édition, le changement prend effet sur votre accès.',
    theme: 'Forfaits & paiement',
    action: { label: 'Gérer mon forfait', route: '/subscription' },
  },
  {
    id: 'x-forf-03',
    question: 'Puis-je arrêter mon abonnement quand je veux ?',
    answer:
      'Oui, l’abonnement s’arrête à la fin de la période en cours, sans engagement de durée.',
    theme: 'Forfaits & paiement',
    action: { label: 'Mon abonnement', route: '/subscription' },
  },
  {
    id: 'x-forf-04',
    question: 'Où retrouver mes paiements et mes factures ?',
    answer:
      'La page paiements liste chaque achat avec sa date, son montant et son statut.',
    theme: 'Forfaits & paiement',
    action: { label: 'Mes paiements', route: '/v3/paiements' },
  },
  {
    id: 'x-forf-05',
    question: 'Quand la V3 s’ouvre-t-elle pour les abonnés ?',
    answer:
      'Le 1er octobre 2026 à 8 h (heure de Paris) ; le calendrier détaille l’ouverture module par module.',
    theme: 'Forfaits & paiement',
    action: { label: 'Voir le calendrier', route: '/v3/calendrier' },
  },
  {
    id: 'x-forf-06',
    question: 'Jusqu’à quand la V2 reste-t-elle accessible ?',
    answer:
      'La V2 reste incluse dans les trois offres jusqu’au 31 décembre 2026, puis elle ferme pour tous en attendant la V4.',
    theme: 'Forfaits & paiement',
    action: { label: 'En savoir plus', route: '/v3/forfaits' },
  },
  {
    id: 'x-forf-07',
    question: 'Que contient l’offre déjà abonné ?',
    answer:
      'Votre V2 conservée, l’écriture jusqu’à 40 chapitres, 5 000 mots par chapitre, la couverture simple, la recherche avancée et la correction.',
    theme: 'Forfaits & paiement',
    action: { label: 'Mon offre', route: '/v3/migration' },
  },
  {
    id: 'x-forf-08',
    question: 'Les compléments payants sont-ils tous inclus dans Édition ?',
    answer:
      'Oui, Édition inclut l’ensemble des compléments : couvertures Kindle, broché et relié, studios BD et jeunesse, traductions relues et audio premium.',
    theme: 'Forfaits & paiement',
    action: { label: 'Comparer', route: '/v3/forfaits' },
  },
  {
    id: 'x-forf-09',
    question: 'Le paiement est-il sécurisé ?',
    answer:
      'Oui, il passe par un prestataire de paiement reconnu ; nous ne conservons jamais vos données bancaires.',
    theme: 'Forfaits & paiement',
    action: { label: 'Commander', route: '/commander' },
  },
  {
    id: 'x-forf-10',
    question: 'Puis-je payer en plusieurs fois ?',
    answer:
      'Selon l’offre, un paiement en deux ou trois fois est proposé sur la page de commande.',
    theme: 'Forfaits & paiement',
    action: { label: 'Voir les modalités', route: '/commander' },
  },
  {
    id: 'x-forf-11',
    question: 'Mon accès est actif mais un module reste verrouillé, pourquoi ?',
    answer:
      'Le module dépend soit de votre offre, soit de sa date d’ouverture : le calendrier indique laquelle des deux s’applique.',
    theme: 'Forfaits & paiement',
    action: { label: 'Vérifier le calendrier', route: '/v3/calendrier' },
  },
  {
    id: 'x-forf-12',
    question: 'Que se passe-t-il si je m’abonne après le lancement ?',
    answer:
      'Vous accédez immédiatement à tout ce que votre offre comprend, sans attendre une date.',
    theme: 'Forfaits & paiement',
    action: { label: 'Choisir mon offre', route: '/v3/forfaits' },
  },

  // ── Clés & moteurs IA ───────────────────────────────────────────
  {
    id: 'x-cle-01',
    question: 'Où enregistrer ma clé IA ?',
    answer:
      'Dans la page des clés : collez-la, elle est vérifiée puis conservée pour votre compte uniquement.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Mes clés', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'x-cle-02',
    question: 'Ma clé est-elle visible par quelqu’un d’autre ?',
    answer:
      'Non, elle reste privée et n’est utilisée que pour vos propres générations.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Gérer mes clés', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'x-cle-03',
    question: 'Comment obtenir une clé Gemini gratuitement ?',
    answer:
      'Créez un compte sur la plateforme Google AI Studio, générez une clé commençant par AIza, puis collez-la ici.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Ajouter ma clé', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'x-cle-04',
    question: 'Puis-je discuter librement avec l’IA, comme sur ChatGPT ?',
    answer:
      'Oui, la page de discussion ouvre un vrai échange libre dès que votre clé est enregistrée.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Discuter avec l’IA', route: '/v3/discuter-ia' },
  },
  {
    id: 'x-cle-05',
    question: 'Mes conversations sont-elles conservées ?',
    answer:
      'Les derniers échanges restent dans votre navigateur et vous pouvez les effacer d’un clic.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Ouvrir la discussion', route: '/v3/discuter-ia' },
  },
  {
    id: 'x-cle-06',
    question: 'Que faire si ma clé est refusée ?',
    answer:
      'Vérifiez qu’elle est complète, sans espace, et qu’elle correspond bien au fournisseur choisi, puis réenregistrez-la.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Vérifier ma clé', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'x-cle-07',
    question: 'Quel fournisseur choisir pour écrire un livre entier ?',
    answer:
      'Gemini suffit pour la majorité des projets ; OpenRouter permet d’essayer d’autres modèles si vous le souhaitez.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Choisir mon moteur', route: '/v3/fonctionnalites/cles' },
  },
  {
    id: 'x-cle-08',
    question: 'La génération consomme-t-elle mon quota chez le fournisseur ?',
    answer:
      'Oui, les appels passent par votre clé : le coût dépend donc de votre plan chez le fournisseur.',
    theme: 'Clés & moteurs IA',
    action: { label: 'Mes clés', route: '/v3/fonctionnalites/cles' },
  },

  // ── Exports & fichiers ──────────────────────────────────────────
  {
    id: 'x-exp-01',
    question: 'Dans quels formats puis-je exporter mon livre ?',
    answer:
      'Word (DOCX), PDF et Markdown, avec un sommaire propre dans les deux premiers.',
    theme: 'Exports & fichiers',
    action: { label: 'Exporter', route: '/v3/hub?tab=export' },
  },
  {
    id: 'x-exp-02',
    question: 'Puis-je modifier le fichier après export ?',
    answer:
      'Oui, le DOCX s’ouvre dans Word ou un traitement de texte gratuit et reste entièrement modifiable.',
    theme: 'Exports & fichiers',
    action: { label: 'Exporter en Word', route: '/v3/hub?tab=export' },
  },
  {
    id: 'x-exp-03',
    question: 'Mes exports sont-ils publics ?',
    answer:
      'Non : les fichiers sont générés pour vous et téléchargés sur votre appareil.',
    theme: 'Exports & fichiers',
    action: { label: 'Mes livres', route: '/v3/mes-livres' },
  },
  {
    id: 'x-exp-04',
    question: 'Comment récupérer un livre exporté il y a longtemps ?',
    answer:
      'Ouvrez le projet dans vos livres et relancez l’export : le contenu est conservé.',
    theme: 'Exports & fichiers',
    action: { label: 'Mes livres', route: '/v3/mes-livres' },
  },
  {
    id: 'x-exp-05',
    question: 'Le sommaire est-il cliquable dans le PDF ?',
    answer:
      'La table des matières est présentée proprement et les titres sont dédoublonnés avant export.',
    theme: 'Exports & fichiers',
    action: { label: 'Exporter en PDF', route: '/v3/hub?tab=export' },
  },
  {
    id: 'x-exp-06',
    question: 'Puis-je exporter uniquement la couverture ?',
    answer:
      'Oui, l’éditeur de couverture propose ses propres téléchargements, indépendants du manuscrit.',
    theme: 'Exports & fichiers',
    action: { label: 'Mes couvertures', route: '/v3/mes-couvertures' },
  },

  // ── Mon espace & mon compte ─────────────────────────────────────
  {
    id: 'x-esp-01',
    question: 'Comment modifier mon nom d’auteur affiché ?',
    answer:
      'Dans vos paramètres : le nom saisi est repris sur les couvertures et la page auteur.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Mes paramètres', route: '/v3/parametres' },
  },
  {
    id: 'x-esp-02',
    question: 'J’ai oublié mon mot de passe, que faire ?',
    answer:
      'Depuis la page de connexion, demandez un lien de réinitialisation envoyé sur votre e-mail.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Me connecter', route: '/connexion' },
  },
  {
    id: 'x-esp-03',
    question: 'Puis-je utiliser la V3 sur téléphone ?',
    answer:
      'Oui, les pages s’adaptent au mobile ; pour l’éditeur de couverture, un écran large reste plus confortable.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Ouvrir mon espace', route: '/v3/hub' },
  },
  {
    id: 'x-esp-04',
    question: 'Comment masquer ou afficher le menu latéral ?',
    answer:
      'Un bouton en haut de l’accueil affiche ou masque le menu, et votre choix est mémorisé.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Retour à l’accueil', route: '/v3' },
  },
  {
    id: 'x-esp-05',
    question: 'Où voir toutes les nouveautés récentes ?',
    answer:
      'La page nouveautés liste les ajouts, avec un repère pour ce qui date de moins d’un mois.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Voir les nouveautés', route: '/v3/nouveautes' },
  },
  {
    id: 'x-esp-06',
    question: 'Comment retrouver rapidement un outil précis ?',
    answer:
      'L’index des outils regroupe tous les modules avec un mot-clé de recherche.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Tous les outils', route: '/v3/outils' },
  },
  {
    id: 'x-esp-07',
    question: 'Puis-je revenir à la V2 si je préfère ?',
    answer:
      'Oui, le choix reste réversible : vous basculez entre V2 et V3 depuis la page de bienvenue.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Choisir ma version', route: '/v3/bienvenue' },
  },
  {
    id: 'x-esp-08',
    question: 'Mes données sont-elles supprimables ?',
    answer:
      'Oui, demandez la suppression depuis le support et votre compte ainsi que vos contenus sont retirés.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Contacter le support', route: '/v3/contact' },
  },
  {
    id: 'x-esp-09',
    question: 'Comment signaler un bug clairement ?',
    answer:
      'Indiquez la page, ce que vous avez cliqué et ce qui s’est affiché : la correction est bien plus rapide.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Signaler un problème', route: '/v3/contact' },
  },
  {
    id: 'x-esp-10',
    question: 'Puis-je laisser un témoignage ?',
    answer:
      'Oui, la page témoignage permet d’envoyer votre retour d’expérience.',
    theme: 'Mon espace & mon compte',
    action: { label: 'Laisser un témoignage', route: '/v3/temoignage' },
  },

  // ── Formations & guides ─────────────────────────────────────────
  {
    id: 'x-form-01',
    question: 'Existe-t-il une formation pour débuter de zéro ?',
    answer:
      'Oui, la formation reprend chaque étape depuis l’idée jusqu’à la mise en vente.',
    theme: 'Formations & guides',
    action: { label: 'Ouvrir la formation', route: '/formation' },
  },
  {
    id: 'x-form-02',
    question: 'Y a-t-il des vidéos courtes plutôt que du texte ?',
    answer:
      'Oui, les formations vidéo montrent les manipulations écran par écran.',
    theme: 'Formations & guides',
    action: { label: 'Voir les vidéos', route: '/formation-videos' },
  },
  {
    id: 'x-form-03',
    question: 'Puis-je écouter la formation en marchant ?',
    answer:
      'La version audio des modules est disponible pour écouter sans écran.',
    theme: 'Formations & guides',
    action: { label: 'Formation audio', route: '/formation-audio' },
  },
  {
    id: 'x-form-04',
    question: 'Comment publier un livre pour enfants sans erreur ?',
    answer:
      'Le guide KDP enfants détaille formats, marges et règles spécifiques à ce rayon.',
    theme: 'Formations & guides',
    action: { label: 'Guide KDP enfants', route: '/guide-kdp-enfants' },
  },
  {
    id: 'x-form-05',
    question: 'Existe-t-il des fiches pratiques à imprimer ?',
    answer:
      'Oui, les fiches pratiques résument chaque étape en une page.',
    theme: 'Formations & guides',
    action: { label: 'Fiches pratiques', route: '/fiches-pratiques' },
  },
  {
    id: 'x-form-06',
    question: 'Puis-je apprendre à écrire une série qui fidélise ?',
    answer:
      'La formation séries explique comment planifier plusieurs tomes et garder les lecteurs.',
    theme: 'Formations & guides',
    action: { label: 'Formation séries', route: '/formation-series' },
  },
  {
    id: 'x-form-07',
    question: 'Y a-t-il une masterclass plus complète ?',
    answer:
      'Oui, la masterclass approfondit la méthode avec des modules successifs et leurs questions-réponses.',
    theme: 'Formations & guides',
    action: { label: 'Ouvrir la masterclass', route: '/masterclass' },
  },
  {
    id: 'x-form-08',
    question: 'Comment savoir quel outil utiliser à quel moment ?',
    answer:
      'Le guide des outils replace chaque module dans l’ordre logique du projet.',
    theme: 'Formations & guides',
    action: { label: 'Guide des outils', route: '/guide-outils' },
  },
  {
    id: 'x-form-09',
    question: 'Existe-t-il des tutoriels pas à pas ?',
    answer:
      'Oui, les tutoriels détaillent les manipulations les plus fréquentes.',
    theme: 'Formations & guides',
    action: { label: 'Voir les tutoriels', route: '/tutoriels' },
  },
  {
    id: 'x-form-10',
    question: 'Puis-je voir un résultat concret en cinq minutes ?',
    answer:
      'Oui, la démonstration express montre un premier résultat utilisable très vite.',
    theme: 'Formations & guides',
    action: { label: 'Résultat en 5 minutes', route: '/resultat-en-5-min' },
  },

  // ── Studios BD & jeunesse ───────────────────────────────────────
  {
    id: 'x-bd-01',
    question: 'Que contient le studio BD et jeunesse ?',
    answer:
      'La création de bandes dessinées, d’histoires illustrées, de coloriages et de cahiers d’activités.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Ouvrir le studio', route: '/bd-studio' },
  },
  {
    id: 'x-bd-02',
    question: 'Puis-je créer des histoires du soir par tranche d’âge ?',
    answer:
      'Oui, le texte et la longueur s’adaptent à l’âge visé, par exemple 3-7 ans.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Histoires illustrées', route: '/bd-studio' },
  },
  {
    id: 'x-bd-03',
    question: 'Comment fabriquer un livre de coloriage vendable ?',
    answer:
      'Choisissez un thème, générez les planches au trait, puis exportez au format demandé par l’imprimeur.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Studio coloriage', route: '/bd-studio' },
  },
  {
    id: 'x-bd-04',
    question: 'Les cahiers cherche-et-trouve sont-ils disponibles ?',
    answer:
      'Oui, l’outil cherche-et-trouve génère des planches et leurs solutions.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Cherche et trouve', route: '/cherche-trouve' },
  },
  {
    id: 'x-bd-05',
    question: 'Et les livres de jeux type puzzles ou quiz ?',
    answer:
      'Les générateurs de puzzles et de quiz produisent des pages complètes prêtes à imprimer.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Livre de puzzles', route: '/puzzle-book' },
  },
  {
    id: 'x-bd-06',
    question: 'Combien coûte l’accès au studio jeunesse ?',
    answer:
      'Il est proposé à 47 € en accès à vie, et il est aussi inclus dans l’offre Édition.',
    theme: 'Studios BD & jeunesse',
    action: { label: 'Voir l’offre', route: '/bd-offre' },
  },
];

export default EXTRA_CURATED;
