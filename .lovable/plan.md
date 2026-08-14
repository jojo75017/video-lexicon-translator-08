# Bloquer définitivement les accès V2 et Dashboard admin sur la V3

## Problème confirmé
- La V3 possède déjà une barre avec **V2 — Générateur**, **Prospects**, **Emails** et **Admin**, mais le composant la supprime entièrement dès que sa vérification locale n'obtient pas exactement `isAdmin === true`.
- Cette barre relance sa propre vérification du rôle, séparément de l'état administrateur déjà calculé dans `App.tsx`. Ce doublon crée une nouvelle occasion de perdre momentanément les accès lors de la restauration ou du rafraîchissement de session.
- Le lien V2 existe aussi dans le grand en-tête, mais **Dashboard admin** n'y est pas présent. La disparition de la barre rapide laisse donc la V3 sans accès visible au tableau administrateur.
- Les destinations correctes existent : **V2** `/ebook-planner`, **Dashboard admin** `/admin`, **Prospects** `/gestion-prospects`, **Emails** `/apercu-emails`.

## Correction

### 1. Une seule source fiable pour le statut administrateur
- Utiliser dans toute la mise en page V3 le statut administrateur déjà résolu au niveau principal de l'application, au lieu de lancer une deuxième détection indépendante dans la barre.
- Conserver la validation du rôle par le backend : aucun droit administrateur ne sera fondé sur le stockage du navigateur.
- Pendant une restauration de session, afficher un état de vérification au lieu de conclure trop tôt que l'administrateur est un simple abonné.

### 2. Barre administrateur permanente sur toute la V3
Afficher, sur toutes les routes `/v3/*` dès que le rôle est confirmé :

```text
[V2 — Générateur] [Dashboard admin] [Prospects] [Emails] [Voir comme un abonné]
```

- La barre reste visible sur ordinateur et mobile, même en changeant d'onglet V3.
- **V2 — Générateur** ouvre directement `/ebook-planner`.
- **Dashboard admin** ouvre directement `/admin`.
- Aucun bouton ne passe par `/commander`, `/v3/auth` ou une autre page intermédiaire.
- Le mode « Voir comme un abonné » ne masque plus cette barre : il simule les restrictions abonné tout en conservant les sorties administrateur.

### 3. Accès de secours dans l'en-tête
- Conserver **V2** dans l'en-tête principal.
- Ajouter **Dashboard admin** à côté pour l'administrateur confirmé, sur ordinateur comme dans le menu mobile.
- Ainsi, même si la barre rapide rencontre un problème d'affichage, les deux accès essentiels restent disponibles.

### 4. Validation réelle
Avec une session administrateur :
1. Ouvrir directement `/v3` et vérifier la présence immédiate de **V2** et **Dashboard admin**.
2. Naviguer dans plusieurs routes `/v3/*` et confirmer que les accès restent présents.
3. Activer « Voir comme un abonné » et confirmer que les sorties V2/Admin restent visibles et utilisables.
4. Tester `/ebook-planner`, puis `/admin`, et vérifier qu'aucune redirection ne mène à la page de vente.
5. Recharger la page V3 et refaire le contrôle après restauration de session.
6. Vérifier également le menu mobile.

## Détails techniques
- Centraliser la propagation de `isAdmin` et de son état de chargement depuis `App.tsx` vers `V3PublicLayout`, `V3AdminQuickAccess` et `V3Header`.
- Retirer la vérification concurrente propre à `V3AdminQuickAccess`.
- Ne modifier ni les pages métier, ni les droits des abonnés, ni le tunnel de vente.