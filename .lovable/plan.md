

# Plan — Suppression complète du tunnel Systeme.io

## Diagnostic

L'utilisateur veut tout mettre à plat et supprimer toute trace de Systeme.io qui n'est plus utilisé. Le tunnel de paiement passe désormais uniquement par PayPal manuel (`/upsell-paiement` → PayPal → `/confirmation-paiement` → code EBK-XXXXXX).

## Ce qui existe et doit disparaître

D'après les fichiers visibles :

1. **Edge function `systemeio-webhook`** (déclarée dans `supabase/config.toml`)
2. **Fichier `src/data/formationSystemeIo.ts`** (données de formation liées à systeme.io)
3. **Références éventuelles** dans les composants de formation, pages d'admin, ou scripts d'import

## Plan d'action

### 1. Audit exhaustif des références
Recherche dans tout le projet de :
- `systemeio`, `systeme.io`, `systeme_io`, `SystemeIo`
- Imports de `formationSystemeIo`
- Références dans `App.tsx`, pages admin, composants formation

### 2. Suppression de l'edge function
- Supprimer `supabase/functions/systemeio-webhook/` (dossier complet)
- Retirer le bloc `[functions.systemeio-webhook]` de `supabase/config.toml`

### 3. Suppression des fichiers de données
- Supprimer `src/data/formationSystemeIo.ts`
- Identifier les composants qui l'importent et soit les supprimer, soit basculer sur une autre source de données (ex : `formationModules` standard)

### 4. Nettoyage des références UI
- Retirer tout bouton, lien ou onglet "Systeme.io" dans l'admin ou la formation
- Retirer toute mention dans la documentation utilisateur visible

### 5. Vérification finale
- Build sans erreur TypeScript
- Aucune référence résiduelle dans `grep -r "systeme"` du projet

## Note importante

Avant d'exécuter, je vais d'abord faire l'audit complet (étape 1) pour confirmer la liste exacte des fichiers à modifier — il pourrait y avoir des dépendances cachées (ex : un composant `FormationSystemeIo.tsx` qui dépend du fichier de données).

## Fichiers concernés (estimation)
- `supabase/config.toml` — retrait du bloc
- `supabase/functions/systemeio-webhook/` — suppression
- `src/data/formationSystemeIo.ts` — suppression
- 1 à 3 composants de formation ou admin référençant systeme.io (à confirmer après audit)

