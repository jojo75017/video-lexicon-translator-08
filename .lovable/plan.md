## Objectif

Rendre la **rédaction du livre réellement plus performante au Pack Pro 347€** qu'à la Base 197€ (sans réserver de modèle IA — « tous les modèles pour tous » conservé), ET **l'afficher clairement via un encart comparatif** pour que l'acheteur 347€ comprenne exactement ce qu'il a en plus.

## Constat actuel

- `src/hooks/useV3Entitlement.ts` expose déjà `hasFull` (347€) / `hasBase` (197€).
- `EbookCompleteWorkflow.tsx` appelle `complete-book-workflow` **sans transmettre le palier** → réglages identiques pour tous.
- Serveur (`complete-book-workflow/index.ts`) : `DEFAULT_WORDS_PER_CHAPTER = 3500` figé, `minScore` fixe, une seule passe par chapitre.

## Leviers de différenciation 347€ (validés)

| Levier | Base 197€ | Pro 347€ |
|---|---|---|
| Densité / longueur chapitre | ~3500 mots | ~5000 mots |
| Boucle qualité (score cible) | seuil standard | seuil relevé + tentatives supplémentaires |
| Passe éditoriale auto sur chaque chapitre (P4) | non | oui (réécriture d'affinage) |
| Profondeur des sous-sections | standard | enrichie |

Le modèle IA reste au libre choix dans les deux paliers.

## Implémentation

### 1. Encart comparatif dans l'outil de rédaction (NOUVEAU — priorité UX)
- Créer un composant `src/components/ebook/WritingEngineBadge.tsx` (ou encart inline) affiché en haut de `EbookCompleteWorkflow`, qui montre :
  - **Si Pack Pro 347€** : bandeau valorisant « Moteur Rédaction Pro activé » listant les gains concrets (chapitres ~5000 mots vs 3500, passe éditoriale automatique, boucle qualité renforcée, sous-sections enrichies) → l'acheteur voit noir sur blanc ce qu'il obtient de plus.
  - **Si Base 197€** : encart « Moteur Standard » + rappel discret « Passez au Pack Pro 347€ pour des chapitres plus longs et une passe éditoriale automatique » (incitation, non bloquant).
- Style aligné charte KDP (teal #008296, accent orange #FF9E2D), tableau/liste comparatif court et lisible.

### 2. Frontend — `src/components/ebook/EbookCompleteWorkflow.tsx`
- Importer `useV3Entitlement`, lire `hasFull`.
- Afficher l'encart de l'étape 1.
- Ajouter `quality: hasFull ? 'pro' : 'core'` au `body` des **deux** appels `invoke('complete-book-workflow', ...)`.
- Pendant la génération, indiquer le moteur actif (« Moteur Pro · chapitre dense + affinage éditorial »).

### 3. Serveur — `supabase/functions/complete-book-workflow/index.ts`
- Lire `quality` depuis `payload` (défaut `'core'`).
- `wordsPerChapter` selon palier : `pro → 5000`, `core → 3500`.
- Relever `minScore` et le nombre de tentatives de la boucle qualité en `pro`.
- P4 en `pro` : ajouter une **passe d'affinage éditorial** (2ᵉ appel IA par chapitre pour densifier / fluidifier / enrichir les exemples) avant renvoi.
- Consignes de sous-sections enrichies en `pro`.

### 4. Cohérence commerciale
- Vérifier que `SalesPageV3.tsx` / `V3PricingTiers.tsx` décrivent les mêmes gains rédaction pour le 347€, pour un message cohérent entre vente et outil.

## Points techniques

- Mode `pro` = plus de volume → garder la segmentation P4 existante, n'ajouter la passe d'affinage que par chapitre (pas sur tout le livre d'un coup) pour éviter les timeouts.
- Aucun changement de RLS / schéma. `hasFull` inclut déjà l'admin (démo).
- Fallback Lovable AI et routage BYOK OpenRouter/Claude/OpenAI inchangés : le palier n'agit que sur les réglages qualité.
</content>
<summary>Ajouter un moteur qualité Pro (chapitres plus longs, seuil qualité relevé, passe éditoriale auto) réservé au Pack 347€, PLUS un encart comparatif visible dans l'outil de rédaction pour justifier concrètement le 347€ face au 197€.</summary>
</invoke>
