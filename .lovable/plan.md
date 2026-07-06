## Objectif
Corriger le graphique comparatif « agents IA » (`src/components/admin/V2V3Compare.tsx`) selon les nombres validés :
- **Carte 1 — V2 Actuel : 15** ✅ (inchangé)
- **Carte 2 — V3 Nouveau (197€) : 22** (actuellement 30 → à corriger)
- **Carte 3 — V3 Premium (347€) : 30** ✅ (inchangé)

## Constat
Le fichier définit une seule constante `V3_AGENTS = 30` (ligne 15) réutilisée pour la carte 2 (ligne 140) **et** la carte 3 (ligne 161). Il faut deux valeurs distinctes.

## Étapes
1. **Séparer les constantes** en haut du fichier :
   - `V2_AGENTS = 15` (inchangé)
   - `V3_AGENTS = 22` (carte V3 Nouveau / 197€)
   - `V3_PREMIUM_AGENTS = 30` (carte V3 Premium / 347€)
2. **Carte 3 (Premium)** : utiliser `V3_PREMIUM_AGENTS` (ligne ~161) au lieu de `V3_AGENTS`.
3. **Sous-titre carte 3** (ligne ~163) : remplacer « même nombre, qualité IA Pro » (devenu faux puisque 30 ≠ 22) par « **qualité IA Pro** » (ou « +8 agents, qualité IA Pro »), afin que le texte reste cohérent avec les chiffres.
4. Vérifier que la ligne du tableau « Puissance IA » (×1 / ×2 / ×4) et « Modules premium inclus » restent cohérentes — aucune modification de valeur nécessaire, mais relecture rapide.

## Vérification
- Typecheck (`tsgo`).
- Contrôle visuel de la section pour confirmer 15 / 22 / 30 et le sous-titre corrigé.

## Hors périmètre
- Aucun autre compteur (les modules 32/68/100 restent inchangés).
