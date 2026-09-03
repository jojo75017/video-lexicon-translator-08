# Étape 2 — Interface « Mes couvertures »

Nouvelle page indépendante, branchée uniquement sur `cover_projects` via `src/lib/coverProjects.ts`. Aucun ancien module de couverture, aucun éditeur Fabric, aucune fonction IA, aucun calcul KDP, aucun export, aucun abonnement/crédit, aucun ISBN, aucune modification du bucket `ebook-images`. Aucun appel IA donc aucun crédit Lovable.

## Rappel sécurité étape 1 (résultats réellement observés)

- Compte A et compte B : chacun crée, lit, modifie et supprime ses propres projets → réussi.
- Lecture d'un projet de B par A via son `id` → 0 ligne renvoyée.
- Modification / suppression d'un projet de B par A → refusé par RLS (0 ligne affectée).
- Insertion en usurpant le `user_id` d'un autre compte → refusée.
- Upload par B dans le dossier de A → refusé ; listage du dossier de A par B → vide.
- Visiteur non connecté : lecture table vide, upload refusé, accès direct au bucket privé refusé.
- URL signée 60 s : 200 immédiatement, puis 400 `InvalidJWT — "exp" claim timestamp check failed` après expiration.
- Comptes de test `rlstest-a…` / `rlstest-b…` supprimés, aucune donnée résiduelle.

## Nouvelles routes

| Route | Contenu |
|---|---|
| `/v3/mes-couvertures` | Liste des projets + création |
| `/v3/mes-couvertures/:id` | Fiche projet (lecture seule + emplacement réservé éditeur) |

Les deux routes reprennent la protection existante (`gated(...)` + `TrialGate`), comme les routes couverture actuelles. Visiteur non connecté → redirection d'authentification standard d'EbookStudio.

## Page liste « Mes couvertures »

Chaque carte affiche : nom du projet, titre du livre, type lisible (eBook Kindle / Broché / Relié), miniature privée via **URL signée temporaire** (jamais d'URL publique) ou visuel neutre à défaut, date de dernière modification, badge « Brouillon ».

Actions par carte :
- **Ouvrir** → fiche projet
- **Renommer** → petite boîte de dialogue, champ nom
- **Dupliquer** → nouvelle ligne, nouvel identifiant, nom suffixé « (copie) », mêmes métadonnées et même Fabric JSON ; le fichier illustration n'est pas recopié à cette étape (chemins laissés vides sur la copie)
- **Supprimer** → confirmation obligatoire avant suppression

États : chargement (squelettes), liste vide avec message d'invitation, message d'erreur clair, notification de confirmation après création / renommage / duplication / suppression. Grille responsive 1 / 2 / 3 colonnes, style cockpit EbookStudio existant (cartes shadcn, accents teal/or).

## Création d'un projet

Bouton « Créer une couverture » ouvrant un formulaire :
- nom du projet (obligatoire)
- titre du livre (facultatif)
- type de couverture : eBook Kindle / Broché / Relié
- nombre de pages (facultatif, affiché seulement pour Broché et Relié)

Un identifiant de format est enregistré selon le type choisi (`ebook-kindle`, `broche-wrap`, `hardcover`) sans exécuter aucun calcul de dimensions. Aucun champ ISBN.

## Fiche projet

Affiche les informations enregistrées (nom, titre, type, format, pages, dates) et un emplacement réservé avec le texte exact : « L'éditeur professionnel sera disponible à l'étape suivante. » Aucun éditeur graphique branché.

## Accès dans l'espace abonné

Ajout d'une entrée « Mes couvertures » dans le menu abonné existant, groupe « Habiller » (`src/data/v3HeaderMenu.ts`), à côté des entrées couverture actuelles, sans modifier ces entrées.

## Détails techniques

- Nouveaux fichiers : `src/pages/v3/mes-couvertures/MesCouverturesPage.tsx`, `src/pages/v3/mes-couvertures/CouvertureProjetPage.tsx`, plus un composant carte et une boîte de dialogue de création.
- Fichiers modifiés : `src/App.tsx` (2 routes ajoutées), `src/data/v3HeaderMenu.ts` (1 lien ajouté).
- Toutes les lectures/écritures passent par `listCoverProjects`, `getCoverProject`, `createCoverProject`, `updateCoverProject`, `deleteCoverProject`, `getSignedCoverUrl`. Une petite fonction de duplication réutilise ces mêmes helpers.
- Les miniatures sont signées à la demande (TTL court) et jamais mises en cache sous forme d'URL persistée.

## Tests réalisés avant compte rendu

Sessions navigateur réelles avec deux comptes : A ne voit que ses projets, B que les siens ; création, renommage, duplication (nouvel identifiant vérifié), suppression avec confirmation ; persistance après déconnexion/reconnexion ; miniature de A inaccessible depuis B ; visiteur non connecté redirigé et incapable d'ouvrir la page.

## Livrable final

Routes créées, composants ajoutés/modifiés, résultats réellement observés des tests, confirmation qu'aucun ancien module n'a été modifié, qu'aucun appel IA n'a eu lieu et qu'aucun crédit Lovable n'a été consommé. Arrêt ensuite, en attente de validation avant de brancher l'éditeur graphique.
