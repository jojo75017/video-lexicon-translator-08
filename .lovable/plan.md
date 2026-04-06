

# Audit complet du Générateur d'Ebooks — Problèmes et Améliorations

## Problèmes critiques identifiés

### 1. La sauvegarde manuelle ment à l'utilisateur
**Fichier :** `src/pages/EbookPlannerPage.tsx` (ligne 1110-1111)
`handleManualSave` appelle `await saveProject(projectData)` puis affiche **toujours** `toast.success('Projet sauvegardé !')`, même si `saveProject` retourne `null` (pas de session auth). L'utilisateur pense que c'est sauvé alors que rien n'est en base.

**Correction :** Vérifier le retour de `saveProject` et afficher un toast d'erreur si `null`.

### 2. L'auto-save silencieux à chaque changement de données
**Fichier :** `src/pages/EbookPlannerPage.tsx` (lignes 582-618)
Le `useEffect` de sauvegarde automatique déclenche `saveProject` à chaque changement de n'importe quel champ (titre, auteur, chapitres, etc.) avec un debounce de seulement 2 secondes. Cela crée un bombardement de requêtes Supabase. De plus, si la session est absente, ces appels échouent silencieusement.

**Correction :** 
- Augmenter le debounce à 10-15 secondes (l'auto-save 60s existe déjà en filet de sécurité)
- Ajouter un flag `isAuthenticated` pour éviter les appels inutiles

### 3. Double sauvegarde concurrente
Il y a **3 mécanismes de sauvegarde simultanés** qui se marchent dessus :
1. `useEffect` debounce 2s sur chaque changement (ligne 582)
2. Auto-save 60s via `setInterval` (ligne 504)  
3. Sauvegarde avant changement d'onglet `handleTabChange` (ligne 1115)

Cela provoque des conditions de course et des écritures concurrentes en base.

**Correction :** Supprimer le mécanisme debounce 2s, garder uniquement l'auto-save 60s + la sauvegarde à la navigation.

### 4. Le chargement du projet écrase le brouillon local sans avertir
**Fichier :** `src/pages/EbookPlannerPage.tsx` (lignes 459-484)
`loadFromDatabase()` écrase tous les champs avec les données cloud au montage, sans comparer les timestamps avec le brouillon local (`savedData`). Si l'utilisateur a travaillé hors ligne, son brouillon local plus récent est perdu.

**Correction :** Comparer `savedData.lastSaved` avec `dbProject.updated_at` et demander confirmation si le brouillon local est plus récent.

### 5. `subscriber-auth` : faille de sécurité potentielle
**Fichier :** `supabase/functions/subscriber-auth/index.ts` (ligne 105)
`adminClient.auth.admin.listUsers()` charge **tous** les utilisateurs en mémoire pour trouver un email. Sur une base avec beaucoup d'utilisateurs, c'est lent et consomme de la mémoire.

**Correction :** Utiliser `adminClient.auth.admin.getUserByEmail(normalizedEmail)` (ou `listUsers({ filter })`) au lieu de `listUsers()`.

### 6. Les résultats du workflow ne sont que dans localStorage
**Fichier :** `src/hooks/useWorkflowResults.ts`
Le hook `useWorkflowResults` stocke tout en `localStorage`. Si l'utilisateur change de navigateur ou vide son cache, tout le workflow P1-P14 est perdu. Le `useWorkflowCloudSync` existe mais n'est pas systématiquement utilisé.

**Correction :** Sauver automatiquement chaque étape en base via `saveStepToCloud` après chaque `saveStepResult`, et restaurer depuis le cloud au chargement si le localStorage est vide.

### 7. Fichier EbookPlannerPage trop volumineux (3724 lignes)
Ce fichier est un composant monolithique avec ~185 imports, ~80 états, et tout le rendu dans un seul `switch` de ~250 cases. C'est fragile, lent à charger, et impossible à maintenir proprement.

**Correction à moyen terme :** Extraire le `renderContent()` dans un composant séparé ou un lazy-loaded router, et grouper les états liés dans des hooks dédiés (ex: `useEbookPlannerState`).

### 8. L'export ZIP ne déclenche pas de sauvegarde fiable
**Fichier :** `src/components/ebook/EbookAudioGenerator.tsx` (ligne 861)
L'export ZIP utilise `new Blob(mp3Blobs)` (concaténation brute) pour la sauvegarde en bibliothèque, ce qui produit un fichier audio potentiellement corrompu en base.

**Correction :** Utiliser le même mécanisme de fallback que l'export fichier unique (rawBlob puis tentative FFmpeg).

## Améliorations recommandées (par priorité)

### Priorité 1 — Fiabilité sauvegarde
1. Vérifier le retour de `saveProject` dans `handleManualSave` et afficher erreur si échec
2. Supprimer le debounce 2s, garder auto-save 60s + sauvegarde au changement d'onglet
3. Ajouter un indicateur visuel permanent "Sauvegardé en cloud ✓" vs "Brouillon local ⚠️"

### Priorité 2 — Persistance workflow  
4. Auto-sauver les résultats workflow en base après chaque étape
5. Restaurer depuis le cloud si localStorage vide

### Priorité 3 — Performance & sécurité
6. Corriger `listUsers()` dans `subscriber-auth`
7. Comparer timestamps local/cloud avant d'écraser au chargement

### Priorité 4 — Architecture
8. Extraire les états du planner dans un hook dédié
9. Lazy-loader les onglets pour réduire le bundle

## Fichiers à modifier
- `src/pages/EbookPlannerPage.tsx` — sauvegarde, chargement, debounce
- `src/hooks/useEbookDatabase.ts` — retour explicite d'erreur
- `src/hooks/useWorkflowResults.ts` — sync cloud automatique
- `supabase/functions/subscriber-auth/index.ts` — optimisation listUsers
- `src/components/ebook/EbookAudioGenerator.tsx` — export ZIP sauvegarde

## Résultat attendu
- L'utilisateur sait toujours si son projet est sauvé en cloud ou juste en local
- Plus de "Projet sauvegardé !" mensonger
- Les résultats du workflow survivent au changement de navigateur
- Moins de requêtes Supabase inutiles (de ~30/min à ~2/min)

