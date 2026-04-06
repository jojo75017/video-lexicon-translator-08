

# Correction : Connexion admin impossible + erreur React

## 2 problèmes identifiés

### Problème 1 — Erreur React bloquante (priorité immédiate)
L'erreur `"Should have a queue"` crash l'application au chargement de `EbookPlannerPage`. Elle vient de `useWorkflowCloudSync` appelé dans `useWorkflowResults`. Ce bug React se produit quand le nombre ou l'ordre des hooks change entre les renders — probablement causé par les modifications récentes de `useWorkflowResults.ts` qui ont ajouté l'appel à `useWorkflowCloudSync` en tant que hook interne destructuré différemment.

**Correction :** Dans `useWorkflowResults.ts`, s'assurer que `useWorkflowCloudSync()` est appelé inconditionnellement au tout début du hook (ce qui semble être le cas ligne 32, mais le HMR peut créer ce bug). Forcer un rebuild propre en ajoutant un commentaire de version ou en réorganisant légèrement l'import.

### Problème 2 — Magic link admin échoue
Les logs auth montrent `"One-time token not found"` et `"Email link is invalid or has expired"`. La cause : quand on est sur le preview (`id-preview--...lovable.app`), le `redirectTo` pointe vers ce domaine preview. Mais le lien dans l'email est cliqué depuis Gmail (IP Google `172.253.x.x`) ce qui pré-consomme le token OTP via un prefetch/link-preview avant que l'utilisateur ne clique réellement. Le second clic échoue car le token est déjà utilisé.

**Correction :** Forcer `emailRedirectTo` vers l'URL publiée (`https://video-lexicon-translator-08.lovable.app/admin-direct`) dans TOUS les cas, pas seulement quand on détecte `lovableproject.com`. Cela évite les interférences du proxy preview.

## Plan de correction

### Étape 1 — Corriger l'erreur React dans useWorkflowResults
**Fichier :** `src/hooks/useWorkflowResults.ts`
- Vérifier que `useWorkflowCloudSync()` est le tout premier appel après `useState`
- Si le problème persiste, déplacer les appels cloud en dehors du hook (les passer en paramètre ou les appeler directement via import)

### Étape 2 — Forcer le redirect vers l'URL publiée
**Fichier :** `src/pages/AdminDirectPage.tsx`
- Remplacer la logique conditionnelle du `redirectTo` par une constante fixe vers `https://video-lexicon-translator-08.lovable.app/admin-direct`
- Supprimer la détection `lovableproject.com` / `window.location.origin` qui ne fonctionne pas correctement sur le preview

### Étape 3 — Même correction pour AuthPage
**Fichier :** `src/pages/AuthPage.tsx`  
- Appliquer la même URL de redirection fixe pour les OTP/magic links envoyés depuis la page auth standard

### Résultat attendu
- L'application ne crash plus au chargement
- Le magic link admin redirige correctement vers l'app publiée
- La connexion admin fonctionne de bout en bout

