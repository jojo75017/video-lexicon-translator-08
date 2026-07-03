# Plan — Connexion débloquée + Hub V3 plus lisible

Deux problèmes distincts à régler.

## 1. Connexion impossible (page `/auth` admin — mot de passe refusé)

**Diagnostic** : les logs confirment des refus « Invalid login credentials » sur `boubetgeorges@gmail.com`, suivis d'une demande de réinitialisation. Le mot de passe enregistré ne correspond plus. Je ne peux pas lire ni forcer un mot de passe côté serveur (zone protégée), mais le code contient déjà une **connexion par lien magique** (`signInWithOtp`) — elle est juste enfouie et peu visible.

**Ce que je vais faire :**
- Mettre en **évidence le bouton « Recevoir un lien de connexion par email »** sur `/auth` : c'est la voie la plus fiable, aucun mot de passe à retenir.
- Après clic sur le lien reçu, la page `/auth` détecte la session et vérifie automatiquement le rôle admin, puis redirige vers le tableau de bord (logique déjà en place).
- Clarifier les 3 chemins sur `/auth` : lien magique (recommandé), mot de passe, mot de passe oublié.
- Vérifier que le `redirectTo` du lien pointe bien vers l'URL utilisée (préview vs publié) pour éviter un lien mort.

Résultat : vous vous reconnectez immédiatement via le lien reçu par email, sans dépendre du mot de passe.

> Option complémentaire (si vous préférez garder le mot de passe) : je peux aussi ajouter/soigner l'écran « Définir un nouveau mot de passe » après clic sur l'email de réinitialisation. À me confirmer.

## 2. Hub V3 — « trop de modules en vrac, pas de fil conducteur, navigation confuse »

Le Hub (`/hub-v3`) a déjà un onglet **Parcours** (parcours guidé) et un onglet **Outils** (tous les modules), mais l'entrée n'est pas assez guidée et les outils apparaissent en vrac.

**Ce que je vais faire :**

1. **Fil conducteur par défaut** : ouvrir systématiquement le Hub sur l'onglet **Parcours** (idée → écriture → couverture → publication → vente), pour que chacun sache par où commencer.

2. **Onglet « Outils » réorganisé clairement par étapes/piliers** : au lieu d'une grille en vrac, regrouper les modules sous des sections titrées et numérotées (1. Écrire · 2. Visuels · 3. Publier · 4. Monétiser · 5. Marketing), avec une courte phrase d'intro par section. Garder la recherche et les filtres existants.

3. **Repères de navigation** : 
   - Bandeau d'étapes cliquable en haut du Parcours indiquant clairement l'étape en cours.
   - Bouton retour toujours visible et libellé explicite.
   - Réduire le nombre d'onglets visibles au premier coup d'œil / hiérarchiser (Parcours et Outils en avant, Offres/Roadmap/Guides plus discrets).

4. **Moins de bruit visuel** : titres de section plus lisibles, espacement, et badges d'accès (Inclus 197€ / Pack) homogènes pour qu'on comprenne d'un coup d'œil ce qui est débloqué.

## Détails techniques
- `src/pages/AuthPage.tsx` : promouvoir visuellement le bloc `handlePasswordlessLogin`, hiérarchiser les CTA, vérifier `emailRedirectTo`.
- `src/pages/V3HubPage.tsx` : `activeTab` par défaut = `parcours` ; refonte du rendu de l'onglet `outils` (sections par pilier via `PILLAR_ORDER` / `V3_PILLAR_META`) ; en-têtes de section ; hiérarchie des `HUB_TABS`.
- Aucun changement de base de données ni de logique de paiement/accès (badges d'accès inchangés, seulement présentés plus clairement).

Ces deux chantiers sont indépendants — je peux livrer la connexion en premier si vous voulez la débloquer tout de suite.