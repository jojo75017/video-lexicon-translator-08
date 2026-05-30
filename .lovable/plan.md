## Objectif

Donner à la **V3** une identité visuelle et un concept totalement nouveaux (palette **Emerald Prestige**, typo **Space Grotesk + DM Sans**), appliqués **uniquement quand le mode V3 est activé** dans le cockpit admin. La **V2 reste 100% intacte** : aucune modification des tokens globaux ni des autres pages.

## Garde-fous (non négociables)

- On ne touche **pas** au thème global (`index.css` tokens V2, teal #008296, FAFAFA, etc.).
- Tout le nouveau style est **scopé** sous une classe `.v3-skin` et conditionné à `v3Mode` (admin uniquement, déjà sécurisé côté serveur via `useV3Mode`).
- En mode V2 (par défaut), le cockpit s'affiche exactement comme aujourd'hui.

## Direction visuelle V3

- Fond profond émeraude/charbon, accents **or** (#c9a84c) pour les CTA et titres clés.
- Palette : `#064e3b` (base), `#0d7a5f` (primaire), `#c9a84c` (accent or), `#f5f0e0` (texte clair).
- Titres en **Space Grotesk**, corps en **DM Sans**.
- Concept « Publication Assistée Pro » : look premium/sombre haut de gamme qui tranche avec le clair KDP de la V2.

## Ce qui change concrètement

1. **`index.css`** — ajouts additifs uniquement :
   - Import Google Fonts Space Grotesk + DM Sans.
   - Un bloc `.v3-skin { --v3-bg; --v3-surface; --v3-primary; --v3-gold; --v3-ink; --v3-muted; ... }` + styles de base (fond, police, scrollbar) qui ne s'appliquent QUE sous `.v3-skin`. Rien hors de ce scope.

2. **`src/pages/AdminCockpitPage.tsx`** :
   - Remplacer les constantes couleur figées (TEAL/ORANGE/INK) par un objet `theme` calculé selon `v3Mode` : valeurs V2 actuelles si off, valeurs V3 (émeraude/or) si on.
   - Appliquer la classe `v3Mode ? 'v3-skin' : ''` sur le conteneur racine de la page.
   - Re-styler en mode V3 : header, cartes piliers, modules, badge prix, bannière « Mode V3 actif », dialog détail module → fond sombre, bordures or, titres Space Grotesk.
   - Le toggle V2/V3 reste identique (sert d'interrupteur de thème en plus).

3. **`src/data/roadmapV3.ts`** :
   - Ajouter une variante de couleurs piliers pour le mode V3 (mapping émeraude/or) tout en gardant les couleurs actuelles pour compat. Aucune autre donnée modifiée.

## Détails techniques

- Aucune migration DB, aucun changement de prix, aucune route nouvelle.
- Le thème V3 est purement CSS scopé + logique conditionnelle React gated sur `v3Mode` (déjà admin-only et validé serveur).
- Impact V2 / abonnés : nul (la classe `.v3-skin` n'existe jamais hors mode V3 admin).

## Vérification

- Mode V2 (défaut) : capture cockpit → identique à l'actuel.
- Mode V3 (toggle on) : capture cockpit → fond émeraude, accents or, Space Grotesk/DM Sans, modules re-stylés.
- Build OK, pas d'erreur console.