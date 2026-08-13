# Accès administrateur stable et tableau de bord unique

## Objectif
Créer un parcours administrateur unique et prévisible : connexion avec l’email et le mot de passe administrateur, puis arrivée systématique sur le tableau de bord qui regroupe la gestion, les prospects, Ebook Planner V2 et la V3.

## Modifications
1. **Une seule entrée de connexion admin**
   - Réserver une adresse claire à la connexion administrateur.
   - Garder l’authentification réelle par email et mot de passe du backend ; aucun code secret stocké dans le navigateur ou écrit dans le code.
   - Si la session admin est déjà valide, ouvrir directement le tableau de bord sans réafficher le formulaire.

2. **Une seule destination après connexion**
   - Remplacer les destinations contradictoires actuellement confirmées (`/dashboard`, `/ebook-planner`, `/admin`) par `/admin` après toute connexion ou restauration de session admin.
   - Faire de `/admin` le tableau de bord officiel et conserver Ebook Planner V2 comme bouton principal accessible depuis ce tableau.
   - Rediriger les anciens alias de tableau de bord admin vers `/admin` pour éviter les impasses.

3. **Protection fiable sans boucle de redirection**
   - Vérifier la session et le rôle admin côté backend avant d’afficher le tableau de bord.
   - En cas de session absente ou réellement expirée, revenir uniquement vers la connexion admin, en mémorisant `/admin` comme destination de retour.
   - Ne jamais envoyer un admin authentifié vers `/commander`, la connexion abonné ou une page de vente.
   - Supprimer la dépendance décisionnelle aux indicateurs `sessionStorage` ; ils ne serviront pas à accorder les droits.

4. **Tableau de bord administrateur clair**
   - Conserver le tableau existant et rendre immédiatement visibles les accès : **Prospects**, **Ebook Planner V2**, **V3**, **Créer un livre V3** et **Livres corrigés**.
   - Ajouter un bouton permanent « Tableau de bord admin » dans la navigation des pages administratives pour toujours pouvoir revenir au même point.

5. **Vérification du parcours complet**
   - Tester : session absente → connexion → `/admin`.
   - Tester : admin déjà connecté ouvrant `/`, `/auth`, `/commander`, `/dashboard` ou un ancien alias → `/admin`.
   - Tester depuis `/admin` les boutons Prospects, Ebook Planner V2 et V3, puis le retour au tableau de bord.
   - Vérifier qu’un visiteur et un abonné non-admin conservent leurs parcours normaux.

## Détails techniques
- Centraliser la destination admin dans une constante afin qu’elle ne diverge plus entre les composants.
- Harmoniser le routeur, la page de connexion et les garde-fous d’accès autour de cette destination.
- Les droits resteront fondés sur la session authentifiée et le rôle `admin` vérifié par le backend ; aucun « code spécial » local et falsifiable ne sera créé.
