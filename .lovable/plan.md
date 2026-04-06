
Objectif: corriger la vraie cause du problème pour que les ebooks soient réellement sauvegardés et restaurables.

1. Constats tirés du code
- `useEbookDatabase.saveProject()` n’enregistre rien si `supabase.auth.getUser()` ne retourne pas d’utilisateur.
- `loadLatestProject()` et `loadAllProjects()` dépendent eux aussi d’un utilisateur authentifié.
- La route `/ebook-planner` est protégée par `SubscriberGate`, mais ce gate valide seulement l’abonnement via `validate-subscription` et du `localStorage`.
- Donc on peut entrer dans le générateur sans vraie session backend, alors que les tables `ebook_projects`, `ebook_project_versions`, `workflow_results` et `audiobooks` exigent `auth.uid()` via les règles de sécurité.
- C’est cohérent avec votre symptôme: l’éditeur semble fonctionner, mais le livre n’apparaît jamais dans la bibliothèque.

2. Cause racine
Le système mélange aujourd’hui 2 mécanismes différents :
- accès “abonnement” via email + code d’accès
- persistance “base de données” via authentification utilisateur

Le premier ouvre bien l’interface.
Le second est obligatoire pour sauvegarder.
Aujourd’hui ils ne sont pas reliés correctement.

3. Plan de correction
Étape 1 — Corriger l’erreur de build en attente
- Réparer la ligne cassée dans `src/components/ebook/EbookAudioGenerator.tsx` autour de la ligne 1699 pour remettre le projet dans un état compilable avant toute autre modification.

Étape 2 — Exiger une vraie session avant toute sauvegarde ebook
- Ajouter une vérification centralisée dans `EbookPlannerPage` et/ou `useEbookDatabase`.
- Si aucun utilisateur authentifié n’est présent:
  - bloquer la sauvegarde cloud
  - afficher un message explicite du type: “Connectez-vous complètement pour sauvegarder vos livres”
  - éviter le faux sentiment que le projet est enregistré.

Étape 3 — Relier l’accès abonnement à une vraie authentification
- Revoir le flux `/subscription` pour qu’après validation de l’abonnement, l’utilisateur obtienne aussi une vraie session d’authentification.
- Le plus propre: faire du login/signup standard, puis associer/valider l’abonnement côté backend.
- Ainsi `auth.uid()` sera disponible pour `ebook_projects`, `workflow_results` et `audiobooks`.

Étape 4 — Sécuriser l’auto-save pour ne plus échouer silencieusement
- Dans `useEbookDatabase.saveProject()` :
  - remplacer le retour silencieux en cas d’utilisateur absent par une erreur/toast explicite
  - retourner un statut exploitable par le planner
- Dans `EbookPlannerPage` :
  - ne pas afficher “Projet sauvegardé !” si `saveProject()` a échoué
  - différencier sauvegarde locale et sauvegarde cloud.

Étape 5 — Restaurer clairement depuis plusieurs sources
- Au chargement du planner:
  - prioriser la base si session valide
  - sinon restaurer uniquement le cache local comme brouillon temporaire
- Ajouter une distinction visible entre:
  - “Brouillon local”
  - “Projet sauvegardé dans la bibliothèque”

Étape 6 — Vérifier les points connexes
- Contrôler aussi `useWorkflowCloudSync` et `EbookAudioGenerator` car ils reposent sur la même condition d’authentification.
- Uniformiser les messages d’erreur pour ebooks, workflow et livres audio.

4. Fichiers concernés
- `src/components/ebook/EbookAudioGenerator.tsx`
- `src/hooks/useEbookDatabase.ts`
- `src/pages/EbookPlannerPage.tsx`
- `src/components/SubscriptionAuth.tsx`
- `src/components/auth/SubscriberGate.tsx`
- possiblement `src/App.tsx` et le flux d’authentification associé

5. Résultat attendu après correction
- un utilisateur connecté peut créer un ebook et le retrouver dans “Ma Bibliothèque”
- l’auto-save sauvegarde réellement en base
- si la session manque, l’application le dit clairement au lieu de faire semblant de sauvegarder
- on ne perd plus un livre entier sans explication

6. Détail technique
```text
Etat actuel
SubscriptionAuth -> localStorage abonnement -> accès au planner
Planner -> saveProject() -> besoin de auth.uid()
Pas de session auth -> RLS bloque -> aucune sauvegarde réelle

Etat corrigé
Connexion utilisateur réelle -> auth.uid() disponible
Validation abonnement -> accès confirmé
Planner -> saveProject() -> insert/update ebook_projects OK
Bibliothèque -> retrouve bien les projets
```
