# Rendre le 347€ vraiment supérieur au 197€ (sur le LIVRE, pas juste le marketing)

## Constat
Dans `V3Workflow30.tsx`, les phases 1 à 11 (écriture, qualité, couverture, publication) sont **100 % identiques** entre les deux offres. Toutes les étapes `premium` du 347€ sont regroupées dans les phases marketing/scaling (12-16). Résultat : un acheteur 197€ a exactement le même *livre* qu'un acheteur 347€. Il ne perçoit aucune raison de payer 150€ de plus pour un meilleur livre.

De plus, le 347€ n'a **pas** de couverture plus haut de gamme que le 197€.

## Objectif
Le 347€ doit produire un **meilleur livre** que le 197€ :
1. des étapes de **qualité éditoriale premium** insérées dans les phases de création (visibles verrouillées pour le 197€, débloquées pour le 347€) ;
2. une **couverture ultra-pro** exclusive au 347€.

La qualité IA reste par palier (197€ = `core`, cap 3500 mots ; 347€ = `pro`, cap 6000 mots) — rien à changer côté moteur.

## Changements

### 1. `src/components/admin/V3Workflow30.tsx` — étapes LIVRE premium intégrées
Ajouter des étapes `tier: 'premium'` **à l'intérieur** des phases de création existantes (elles s'affichent alors comme aperçu verrouillé pour le 197€ grâce au filtre déjà en place) :

- **Phase 3 — Écrire le manuscrit** : ajouter
  - `developmental-edit` — « Édition structurelle Pro » (structure, rythme, arcs) · `premium`
  - `p25-tone-adapter` — « Affiner le ton sur mesure » · `premium`
- **Phase 4 — Réviser & garantir la qualité** : ajouter
  - `copy-editing-line` — « Copy-editing & ligne éditoriale » · `premium`
  - `reading-committee` — « Comité de lecture IA » · `premium`
- **Phase 5 — Originalité & conformité** : ajouter
  - `p24-cliche-detector` — « Nettoyer clichés & répétitions » · `premium` (le déplacer ici depuis la phase 16)
- **Phase 6 — Mise en page** : ajouter
  - `quality-label` — « Label Qualité Maison d'Édition » · `premium`

Ces étapes utilisent l'exécution IA générique (`stepLabel` + `stepHint`) — aucun module backend requis (fallback déjà géré par `getModuleById`).

### 2. Couverture ultra-pro exclusive 347€ (Phase 7 — Couverture)
Ajouter une étape `premium` dédiée :
- `cover-studio-pro-v3` — « Couverture Signature Pro (IA gpt-image-2) » · `premium`
  - direction artistique IA + variations, via l'edge `generate-premium-cover` (gpt-image-2 prioritaire, déjà en place).

Le 197€ garde `cover-studio-pro` (couverture standard) ; le 347€ ajoute par-dessus la couverture signature premium. La carte d'aperçu verrouillé du 197€ mettra ce module en avant comme argument fort.

### 3. Cohérence des compteurs & messages
- `buildFlat` / `CORE_TOTAL` / `FULL_TOTAL` se recalculent automatiquement — vérifier les nouveaux totaux (Core inchangé ~29, Full ~+8 étapes livre → ~53).
- Mettre à jour les libellés « 29 vs 45 » dans `V3Workflow30.tsx` (intro, carte teaser) et dans `WritingEngineBadge.tsx` avec les nouveaux chiffres réels.
- Reformuler la carte teaser 197€ pour insister sur la **qualité du livre** (édition structurelle, comité de lecture, label qualité, couverture signature), pas seulement le marketing.

### 4. Filtre d'affichage — vérification
Le filtre actuel masque une phase seulement si **toutes** ses étapes sont premium. Comme on insère des étapes premium dans des phases mixtes (core + premium), il faut vérifier que le rendu masque **chaque étape premium individuellement** en mode core (aperçu verrouillé), et pas la phase entière. Ajuster le rendu des étapes pour que, en mode `core`, les étapes premium apparaissent en version « verrouillée/floutée incitative » plutôt que d'être supprimées.

### 5. Mémoire projet
Mettre à jour `mem://features/workflow/v3-parcours-30-etapes` et `mem://business/pricing/v3-tier-value-split` : le 347€ se distingue désormais aussi sur la **qualité du livre** (édition Pro + couverture signature), pas uniquement marketing/vente.

## Vérification
- `npx tsgo --noEmit` sans erreur.
- Contrôle visuel du Hub : en mode 197€, les nouvelles étapes livre premium apparaissent verrouillées (aperçu) ; en mode 347€, elles sont déverrouillées et exécutables.

## Hors périmètre
Aucun changement de schéma, RLS, droits admin, ni du moteur d'écriture. `useV3Entitlement` reste la source de vérité des droits payés.