# Votre livre visible, corrigé et sauvegardé au même endroit

## Le chemin visible

```text
┌──────────────────────────────────────────────────────────────┐
│  1. J’ÉCRIS        2. MON SOMMAIRE        3. MON LIVRE       │
│  étape active                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ÉCRIVEZ OU COLLEZ VOTRE SOUVENIR                             │
│ [ Mon frère Michel, ma sœur Anne, l’été 1974…              ] │
│                                      [ Envoyer au Génie ]     │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ VOTRE LIVRE EN COURS                                         │
│ 3 textes · 1 246 mots · 2 corrigés · 1 à vérifier            │
│ ███████████████░░░                                           │
│                                                              │
│ TEXTE 3 — CORRECTION EN COURS…                               │
│ Puis la version corrigée apparaît ici automatiquement.       │
│                                                              │
│ Indices respectés : Michel = frère · Anne = sœur · été 1974  │
│ [Modifier] [Garder cette version] [Refaire la correction]     │
│                                                              │
│ Question liée au texte :                                     │
│ « Que s’est-il passé avec Michel pendant l’été 1974 ? »       │
│ [Réponse qui sera ajoutée au récit] [Ajouter au récit]        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ✓ Enregistré sur votre compte à 17:42                        │
│ [Enregistrer maintenant]       [Reprendre ce livre plus tard] │
└──────────────────────────────────────────────────────────────┘
```

## Ce qui sera corrigé

1. **Afficher immédiatement le livre en cours sous la zone d’écriture**
   - Chaque envoi apparaît dans l’ordre : `Texte 1`, `Texte 2`, `Texte 3`.
   - Montrer le nombre de mots, le nombre de textes corrigés et ceux restant à vérifier.
   - Afficher le texte original et la version corrigée sans ouvrir un autre volet.

2. **Corriger automatiquement chaque nouveau texte**
   - Après « Envoyer au Génie », le texte est d’abord sauvegardé, puis corrigé automatiquement.
   - La correction utilise les indices déjà retenus : prénoms, liens familiaux, lieux, dates et faits confirmés.
   - Si un prénom ou un fait disparaît, la correction est refusée et relancée proprement.
   - Une seule correction automatique par nouveau texte, sans doublon.

3. **Faire des questions une vraie suite du récit**
   - Une question maximum à la fois, fondée sur un détail précis du dernier texte.
   - La réponse apparaît immédiatement comme le texte suivant du livre, puis elle est corrigée de la même manière.
   - Les indices retenus restent visibles juste au-dessus de la question et peuvent être corrigés par l’auteur.

4. **Rendre la sauvegarde impossible à manquer**
   - Déplacer l’état de sauvegarde directement sous le livre en cours, pas tout en bas de la page.
   - Afficher clairement : `Enregistrement…`, `Enregistré sur votre compte à…`, ou `Conservé sur cet appareil`.
   - Ajouter un bouton `Enregistrer maintenant` pour retenter immédiatement en cas d’échec.
   - Conserver la sauvegarde automatique après chaque texte, correction, validation, réponse et modification d’indice.

5. **Permettre de reprendre exactement où l’auteur s’est arrêté**
   - Afficher une action claire `Reprendre ce livre plus tard` menant à `Mes livres`.
   - À la réouverture, restaurer le texte, les corrections, les indices, la conversation et l’étape active.
   - Le bouton `Reprendre` ouvre directement l’étape et le dernier texte en cours, sans revenir au début.

6. **Réduire l’encombrement**
   - Garder à l’étape 1 seulement : saisie, livre en cours, question du Génie et sauvegarde.
   - Laisser sommaire, rédaction finale, export et couverture dans les étapes 2 et 3.
   - Les réglages secondaires restent disponibles dans un seul volet fermé.

## Détails techniques

- Réorganiser `V3CreatePage`, `V3GenieDialog` et `V3PassageCorrector` autour d’un panneau unique « Votre livre en cours ».
- Déclencher la correction du nouveau passage après la première sauvegarde réussie ou locale, en réutilisant la correction existante et `factMemory`.
- Exposer un état par passage : `enregistré`, `correction en cours`, `à vérifier`, `validé`, `erreur à relancer`.
- Rendre `SaveStatusLine` visible près du récit et lui ajouter la sauvegarde manuelle.
- Renforcer la restauration existante de `draft_state` et l’ouverture via `projectId`, sans modifier la structure de la base.
- Ne modifier ni paiements, ni tarifs, ni sécurité, ni calculs KDP, ni accès aux modules.

## Vérification

- Envoyer un premier texte avec deux prénoms, un lien familial, un lieu et une date.
- Vérifier qu’il apparaît immédiatement sous la saisie, puis que sa correction s’affiche sans clic supplémentaire et conserve tous les indices.
- Répondre à la question du Génie et vérifier que la réponse devient le texte suivant.
- Recharger la page puis rouvrir le livre depuis `Mes livres` : retrouver les textes, corrections, indices et la bonne étape.
- Simuler un échec de sauvegarde et vérifier que le bouton de nouvelle tentative fonctionne sans perdre le texte local.
