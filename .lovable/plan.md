

## Diagnostic des 2 problèmes

### Problème 1 : "La sidebar n'a pas changé"
Le code de la sidebar **a bien été mis à jour** (header projet, recherche, favoris, accordéon exclusif, badges) — vérifié dans `ModernSidebar.tsx` lignes 568-792.

**MAIS** la sidebar n'apparaît **QUE sur 2 pages** : `/ebook-planner` et `/formation-series`. Tu es actuellement sur `/admin-direct` qui est une **page de connexion admin par lien magique** — elle n'a JAMAIS eu de sidebar. Donc forcément, tu ne vois aucun changement ici.

→ Pour voir les nouveautés sidebar : aller sur `/ebook-planner`.

### Problème 2 : "Je ne vois pas mes abonnés"
La page `/admin-direct` n'affiche PAS la liste des abonnés — c'est juste un formulaire d'envoi de lien magique. La vraie page de gestion est `/admin` (`AdminPage.tsx` qui charge `subscribers` depuis Supabase et les liste).

Tu es probablement coincé sur `/admin-direct` parce que :
- soit ta session admin a expiré → redirige sur le formulaire au lieu de `/dashboard`
- soit le clic sur "Admin Panel" dans la sidebar t'envoie sur `/admin` mais le `AdminGate` te renvoie sur `/admin-direct`

## Plan de correction (3 actions ciblées, pas de fioritures)

### Action 1 — Fusionner `/admin-direct` et `/admin` en une seule page
Sur `/admin-direct` : si l'utilisateur **est déjà admin connecté**, afficher directement la liste des abonnés (au lieu de juste rediriger vers `/dashboard` qui ne montre pas les abonnés). Si non connecté, garder le formulaire lien magique.

→ Plus de page-piège qui te coupe l'accès à tes abonnés.

### Action 2 — Ajouter un raccourci "Voir abonnés" partout
Dans la sidebar (section ⚙️ Mon Compte) : ajouter un item **"👥 Mes Abonnés"** (admin only) qui pointe directement vers `/admin` (la liste).

Aujourd'hui il y a juste "Admin Panel" → on ajoute un lien direct vers la table des abonnés.

### Action 3 — Vérifier que `AdminGate` ne te bloque pas
Lire `AdminGate.tsx` et `getIsCurrentSessionAdmin()` pour comprendre pourquoi tu es renvoyé sur `/admin-direct` au lieu de voir `/admin`. Si la session admin est trop fragile (timeout 5s), l'allonger ou ajouter un fallback `localStorage`.

## Fichiers à modifier
- `src/pages/AdminDirectPage.tsx` — afficher liste abonnés si déjà admin (réutilise le composant de `AdminPage.tsx`)
- `src/components/layout/ModernSidebar.tsx` — ajouter item "👥 Mes Abonnés" → `/admin`
- `src/components/auth/AdminGate.tsx` (à lire) — vérifier la logique de redirection

## Ce que je NE fais PAS
- Pas de refonte sidebar bis (la précédente est déjà en place et fonctionne sur `/ebook-planner`)
- Pas de touche au design
- Pas de migration DB

## Pour le 1er mai
Le projet **est prêt techniquement** — les 5 chantiers sidebar sont en place, la page Guide existe, les BYOK fonctionnent. Le seul vrai blocage actuel c'est que **tu ne vois pas tes abonnés** depuis `/admin-direct`. C'est un bug de routage (3 fichiers à corriger), pas un problème de fond.

