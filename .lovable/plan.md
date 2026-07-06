# Enrichir le parcours 347€ : 16 phases + 15 étapes Pro exclusives

## Problème actuel
Le fichier `src/components/admin/V3Workflow30.tsx` définit `PHASES` avec **7 phases** seulement, dont **une seule** phase Pro (Phase 7) contenant **5 étapes** premium. Résultat : le 347€ paraît identique au 197€ et peu valorisé.

Objectif validé par l'utilisateur : **redécouper en 15+ phases** ET **passer de 5 à 15 étapes exclusives 347€**.

## Principe conservé
Règle mémoire respectée : un acheteur 197€ ne croise jamais d'étape verrouillée au milieu de son travail → toutes les phases « core » d'abord, toutes les phases Pro regroupées **à la fin** (affichées en aperçu verrouillé pour le 197€).

## Nouvelle structure des phases (`PHASES`)

Les 29 étapes core existantes sont redécoupées en phases plus courtes, puis 6 phases Pro closent le parcours.

```text
CORE (197€) — inclus
 Phase 1  🔎 Trouver l'idée gagnante        niche-intelligence, p16-competitive
 Phase 2  📊 Valider le potentiel           p26-commercial-score, book-creation-studio
 Phase 3  ✍️ Écrire le manuscrit           p19-author-voice, p20-chat-manuscript, p23-universe-bible
 Phase 4  🧪 Réviser & qualité              p18-readability, cockpit-audit-pilot
 Phase 5  🛡️ Originalité & conformité       ebook-anti-plagiat, content-compliance
 Phase 6  🎨 Mise en page                   manuscript-converter, back-matter-builder, copyright-page
 Phase 7  🖼️ Couverture                     cover-studio-pro, cover-pdf-exact, cover-variants-thumbnail
 Phase 8  📦 Formats & rendu                multi-format-express, kindle-previewer
 Phase 9  🏷️ Métadonnées & catégories       isbn-metadata, categories-manager-10
 Phase 10 🚀 Publier sur KDP                prepub-checklist, kdp-pack-zip
 Phase 11 📣 Lancer & rendre visible        listing-optimizer, launch-pricing, launch-sequence-j7,
                                             amazon-ads, look-inside-optimizer, author-page-optimizer

PRO (347€) — exclusif, verrouillé pour 197€ (aperçu)
 Phase 12 💰 Fiche qui convertit & avis     sales-description, review-generation*, look-inside-pro*
 Phase 13 📈 Piloter & optimiser les ventes sales-tracker, pricing-ads-pro*, kdp-select-strategy*
 Phase 14 🌍 Étendre l'audience             email-sequence-auteur*, social-launch-kit*, book-funnel*
 Phase 15 📚 Développer le catalogue        p17-series, bundle-boxset*, backlist-scaling*
 Phase 16 🎧 Décliner & rayonner            audiobook-plan*, translation-strategy*,
                                             p22-trend-radar, p24-cliche-detector
```

`*` = **10 nouvelles étapes Pro** à créer (avec `tier: 'premium'`, `label` + `hint` vendeurs). Total Pro = 5 existantes + 10 nouvelles = **15 étapes exclusives 347€**.

Nouvelles étapes Pro proposées :
- `review-generation` — Obtenir des premiers avis (plan ARC / bêta-lecteurs)
- `look-inside-pro` — Optimisation avancée de l'aperçu « Look Inside »
- `pricing-ads-pro` — Optimisation avancée prix + campagnes Amazon Ads
- `kdp-select-strategy` — Stratégie KDP Select, promos gratuites & Countdown
- `email-sequence-auteur` — Séquence email d'auteur pour vendre en direct
- `social-launch-kit` — Kit de posts réseaux sociaux prêts à publier
- `book-funnel` — Tunnel de vente hors Amazon (lead magnet + page)
- `bundle-boxset` — Créer un coffret / box set à partir de la série
- `backlist-scaling` — Plan pour scaler le catalogue (backlist)
- `audiobook-plan` — Plan de production audiobook
- `translation-strategy` — Stratégie de traduction & marchés internationaux

(On garde 11 idées listées ; on en retient 10 pour atteindre 15 exactement, `translation-strategy` ou `audiobook-plan` ajustable.)

## Fichiers modifiés

### 1. `src/components/admin/V3Workflow30.tsx`
- Remplacer le tableau `PHASES` par la nouvelle structure 16 phases ci-dessus.
- Ajouter les 10 nouvelles étapes premium (`tier: 'premium'`) avec `label` + `hint`.
- `buildFlat`, `CORE_TOTAL`, `FULL_TOTAL` sont dérivés automatiquement → recomptés seuls. Mettre à jour les commentaires (ex. « 29 agents / 44 agents »).
- Les nouvelles étapes tournent via l'edge function générique existante (`v3-autopilot-step`) grâce à `stepTitle`+`stepHint` : **aucun module backend à créer**. `getModuleById` retournera `undefined` pour ces IDs, ce qui est déjà géré (fallback sur `step.label`).
- Vérifier que les phases 100% premium s'affichent bien en aperçu verrouillé pour le 197€ (comportement déjà en place pour l'ancienne Phase 7).

### 2. Textes de valeur (mêmes fichiers déjà touchés récemment)
- `src/components/ebook/WritingEngineBadge.tsx` : ajouter une ligne de comparaison « Étapes du parcours : 29 vs 44 » et « Phases exclusives Pro : 5 phases marketing & scaling » pour rendre l'écart visible.
- Vérifier les mentions de comptage d'agents/étapes dans `V3PricingTiers.tsx` et l'intro du parcours (lignes ~752-753 de `V3Workflow30.tsx`) pour rester cohérent avec les nouveaux totaux.

### 3. Mémoire projet
- Mettre à jour `mem://features/workflow/v3-parcours-30-etapes` (nombre de phases/étapes) et l'entrée d'index correspondante.

## Points techniques
- Aucun changement de schéma, RLS, ni droits admin. `useV3Entitlement` reste la source de vérité (admin = accès complet).
- Le palier Pro (`quality: 'pro'`) et les caps de mots (3500 vs 6000) déjà en place restent inchangés.
- Vérification finale : `tsgo --noEmit` + contrôle visuel du Hub en 197€ (phases Pro verrouillées) et en 347€ (16 phases déroulables).

## Résultat attendu
- **347€** : 16 phases, dont 5 phases Pro exclusives, ~15 étapes réservées → différence flagrante et lisible.
- **197€** : 11 phases opérationnelles (idée → lancement) sans étape verrouillée en chemin, les 5 phases Pro visibles en aperçu incitatif.