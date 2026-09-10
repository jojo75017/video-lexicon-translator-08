# Audit du 10 septembre — ce qui marche, ce qui coince

## Ce qui fonctionne

- Le code de l'application est sain : aucune erreur de compilation sur l'ensemble du projet.
- Aucune erreur active dans le navigateur au moment du contrôle (page `/v3`).
- Les appels aux services (fonctions serveur) des 3 derniers jours répondent tous
  correctement : 5 appels, 100 % en succès, aucun échec.
- 78 vérifications automatiques sur 81 passent (couvertures brochées, calculs KDP,
  export Word, accès admin, connexion, purge des offres).
- Base de données : aucune alerte de sécurité bloquante (2 avertissements mineurs,
  détaillés plus bas).

## Anomalies confirmées

### 1. Écrans blancs après chaque mise à jour (le plus visible pour vous)
27 erreurs enregistrées en 2 semaines du type « impossible de charger le module /
la feuille de style ». C'est ce qui provoque la page blanche ou le blocage quand
une page a été mise à jour pendant que vous l'aviez ouverte. Une reprise
automatique existe déjà mais elle ne couvre pas les feuilles de style, seulement
les pages.

### 2. Cinq pages sont tombées en erreur au moins une fois
Erreurs « X n'est pas défini », signe d'un élément appelé mais pas déclaré :
`V3TypographyBar` (écran d'écriture, 9 sept.), `canExportKindle` (couverture
Kindle, 3 sept.), `hasStory` (9 sept.), `EmailFunnelPanel` et `V3WhatsNewPanel`
(admin), `v3Open` (verrou de lancement). Chacune fait planter la page concernée.

### 3. Une page a réclamé une connexion hors de son cadre
Une erreur « useAuth hors de son fournisseur » le 9 septembre : une page
d'abonné a demandé l'identité de l'utilisateur alors qu'elle n'y a pas accès.
À localiser précisément.

### 4. Trois vérifications automatiques en échec
- Bandeau de bascule V2 → V3 : le test ne retrouve plus la destination attendue.
- En-tête V3 : la marque et les boutons principaux ne sont plus trouvés à
  l'endroit prévu, et le bouton « S'inscrire » apparaît en double.
Ce sont soit de vraies régressions d'affichage, soit des tests devenus obsolètes
après vos derniers changements d'en-tête : à trancher page par page.

### 5. Bruit d'extensions navigateur
28 erreurs « Object Not Found Matching Id » : ce sont des extensions Chrome, pas
votre site. Elles polluent le journal et masquent les vraies erreurs.

## Ce que je propose de corriger

1. Reprise automatique élargie aux feuilles de style : plus de page blanche
   après mise à jour, rechargement propre et silencieux.
2. Correction des 5 pages en erreur, une par une, avec passage réel sur chaque
   écran concerné.
3. Localisation et correction de la demande de connexion mal placée.
4. Reprise des 3 vérifications en échec : correction du double bouton
   « S'inscrire » s'il est réel, mise à jour des tests sinon.
5. Filtrage des erreurs d'extensions dans le journal, pour que la page admin
   n'affiche plus que les vraies pannes.
6. Les 2 avertissements de base de données : restreindre l'usage de deux
   fonctions internes aux seuls appels serveur.

## Ce que je ne touche pas

Tarifs, paiements, calculs KDP, sécurité des accès, crédits IA, contenus
générés, base de données (hors les 2 restrictions ci-dessus). Aucun test qui
consomme des crédits IA.

## Détails techniques

- `tsgo --noEmit -p tsconfig.app.json` : exit 0.
- `vitest run` : 8 fichiers, 2 en échec (`V2V3FloatingSwitch.test.tsx`,
  `V3Header.test.tsx`), 3 tests rouges.
- Journal `public.error_logs` sur 14 jours : 27 échecs de chargement de chunk/CSS,
  6 `ReferenceError` distinctes, 1 `useAuth` hors provider, 28 entrées d'extensions.
- `function_edge_logs` (3 j) : 5 requêtes, toutes en 200.
- Linter base : 2 fonctions `SECURITY DEFINER` exécutables par `authenticated`
  → révoquer `EXECUTE` ou basculer en `SECURITY INVOKER`.
- `chunkErrorRecovery.ts` gère `Failed to fetch dynamically imported module`
  mais pas `Unable to preload CSS` : ajouter ce motif au même mécanisme.
