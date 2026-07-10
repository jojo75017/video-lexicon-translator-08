## Contexte & clarification de la stratégie

Dans le code actuel, **« V4 » = le palier premium 347€** (30 agents `tier: 'v4'`), qui vient **au-dessus** de la V3 197€ (22 agents `tier: 'v3'`). Il n'y a donc pas de « faire la V3 avant » : l'accès direct au 347€ marche déjà (`useV3Entitlement.hasFull` s'active sur un plan `full_*` sans exiger la Base).

Ce qui manque, ce n'est pas l'offre — c'est que le **workflow V4 n'est pas plus perfectionné** que la V3 : ce sont surtout des agents en plus, pas un vrai processus supérieur. Ce plan corrige cela, en se concentrant **d'abord sur le workflow** (pas sur le prix, laissé à 347€).

Périmètre : `src/data/editionAgents.ts` (orchestration), `src/components/admin/EditionWorkflow.tsx` (présentation), et 1 nouveau composant frontend. **Aucun** changement backend, prix ou paiement.

```text
V3 (197€) ──► 22 agents, parcours linéaire simple
V4 (347€) ──► V3 + processus premium :
              • plus d'étapes structurées en phases
              • révisions IA multi-passes par chapitre
              • contrôle éditorial avancé (ton/style/longueur/persona)
              • visuels & pack KDP poussés
```

## 1. Structurer le workflow V4 en phases claires (pas juste « plus d'agents »)

Dans `editionAgents.ts`, ajouter un champ `phase` (ex : `Conception`, `Rédaction`, `Révision multi-passes`, `Enrichissement`, `Fabrication`, `Positionnement`, `Lancement`) à chaque agent, et une constante ordonnée `EDITION_PHASES`.

Dans `EditionWorkflow.tsx`, remplacer l'affichage « par département » du mode V4 par un **parcours séquentiel en phases numérotées** avec une barre de progression par phase, pour qu'on voie une vraie montée en puissance vs la V3.

## 2. Révisions IA multi-passes par chapitre

Ajouter, dans la section « Structure du livre » (déjà présente avec curseur chapitres + mots), un bloc **« Passes de révision IA »** visible uniquement en V4 :

- Sélecteur du nombre de passes (1 à 3) : *Rédaction → Relecture stylistique → Polissage final*.
- Description de ce que fait chaque passe.
- Persistance en `localStorage` (comme `targetWords`) pour être reprise par les agents de rédaction/révision existants.

Cela matérialise le « multi-passes » demandé sans toucher aux générateurs : le réglage est lu par les modules de rédaction déjà branchés.

## 3. Contrôle éditorial avancé (nouveau composant `EditorialControlPanel`)

Créer `src/components/ebook/EditorialControlPanel.tsx`, affiché en V4 dans le parcours, offrant :

- **Ton** (ex : chaleureux, expert, narratif, direct) et **style** (ex : concret/exemples, académique, storytelling).
- **Longueur cible par chapitre** (réutilise `targetWords`).
- **Persona lecteur** (champ libre : à qui s'adresse le livre).
- **Structure narrative** (linéaire / thématique / problème-solution).

Tous ces réglages sont persistés en `localStorage` sous une clé unique et affichés en résumé au-dessus du parcours, pour cadrer les agents de rédaction et de ton (`p19-author-voice`, `p25-tone-adapter`) déjà existants.

## 4. Visuels & pack KDP poussés — mise en avant dans le parcours

Regrouper visuellement les agents V4 déjà présents (`cover-studio-pro`, `edition-variant-studio` illustrations, `multi-format-express`, pack KDP, `audio-video-transcription`) dans une **phase « Enrichissement & Fabrication »** clairement identifiée, avec un encart expliquant le livrable final (couverture pro + illustrations + pack KDP prêt à uploader + audiobook). Aucun nouveau module : uniquement mise en avant et regroupement.

## 5. Clarifier l'accès direct au 347€

Ajouter, en tête du mode V4, un court bandeau explicatif : « Offre premium accessible directement — pas besoin de la Base 197€ ». Confirme visuellement ce que le code fait déjà.

## Validation

Après implémentation, vérifier sur `/hub-v3?tab=parcours` (mode admin/V4) :

- Le parcours V4 s'affiche en phases numérotées avec progression.
- Le bloc « Passes de révision IA » (1–3) est visible et persistant.
- Le panneau de contrôle éditorial (ton/style/persona/longueur) fonctionne et se sauvegarde.
- La phase Enrichissement & Fabrication regroupe bien les visuels + pack KDP.
- Le bandeau d'accès direct 347€ est présent.

## Hors périmètre

- Pas de changement de prix ni de tunnel de paiement.
- Pas de modification des générateurs/edge functions ni des secrets (BYOK conservé).
- Pas de création d'une offre « au-dessus de 347€ » : V4 = le palier premium 347€ existant, rendu réellement supérieur à la V3.
- Aucune donnée fictive.