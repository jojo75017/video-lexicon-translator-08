# Recaler la valeur 197€ / 497€ du générateur V3

## Objectif
Mettre des freins clairs pour que le 197€ ne donne plus tout. Le 197€ va **jusqu'à publier sur KDP** (sans marketing). Tout le **lancement / vente / monétisation** devient **visible mais bridé (teaser)** avec upsell 497€. Et la **qualité IA monte par palier** : V2 (67€) < Essentiel (197€) < Pro (497€).

## 1. Nouvelle frontière des paliers (qui fait quoi)

Re-tagger les étapes dans `V3Workflow30.tsx` (champ `tier`) selon ce principe :

```text
197€ (Essentiel) → Phases 1 à 5 : idée → écrire → réviser → mettre en page → PUBLIER sur KDP
497€ (Pro)       → tout le 197€ + Phase 6 (Vente) + agents avancés + qualité max
```

Concrètement, passent en **`premium`** (donc bridés dans le 197€) :
- **Toute la Phase 6 — Lancer & vendre** : description vendeuse, optimiseur d'annonce, **séquence emails J-7**, suivi des ventes. (aujourd'hui 3 sur 4 sont en `core` → c'est la grosse fuite)
- Restent premium comme aujourd'hui : radar de tendances, détecteur KU, architecte de série, nettoyeur clichés, adaptateur de ton, test miniature, audiobook.

Pour garder ~22 agents au 197€, repassent en **`core`** (publication "propre" légitime à 197€) : aperçu Kindle et préparation du pack KDP ZIP.

Le compteur d'agents et la barre de progression sont déjà recalculés dynamiquement (`buildFlat`), donc le nombre s'ajuste tout seul. La liste reste éditable.

## 2. Teaser bridé au lieu de masquer (réponse "aperçu bridé")

Aujourd'hui, dans le parcours 197€, les étapes premium sont **purement masquées** (`buildFlat` les filtre). Nouveau comportement :

- En parcours **Essentiel**, les étapes premium **restent visibles** dans la liste, marquées d'un badge cadenas doré « Pro · 497€ ».
- Au lieu du bouton « Générer », elles affichent un **aperçu bridé** : un court exemple généré (ou un extrait tronqué ~30 %) + un voile « flou » sur la suite, avec le CTA **« Débloquer avec le Pack Tout Complet 497€ »** qui ouvre `V3PackCheckout`.
- Le clic « Générer » réel est bloqué tant que `hasFull` est faux.
- Ça crée le manque : l'utilisateur voit la valeur (emails de lancement, ads…) mais ne peut pas l'exécuter.

## 3. Qualité IA par palier (réponse "plus performant")

Ajouter un niveau de qualité transmis à l'edge function `v3-autopilot-step`, dérivé du parcours actif :

| Palier | Modèle | Longueur sortie | Prompt | Variantes |
|---|---|---|---|---|
| V2 (67€) | rapide (flash) | standard | concis | 1 |
| **197€** | qualité (pro) | +50 % de profondeur | prompt enrichi (exemples, structure pro) | 1 |
| **497€** | top qualité | sortie maximale | prompt expert + checklist qualité | **plusieurs variantes / A-B / régénérations** |

Côté code :
- `V3Workflow30.tsx` envoie un champ `quality: 'core' | 'pro'` dans `baseBody` (et le sélecteur de modèle peut être pré-réglé selon le palier).
- `v3-autopilot-step/index.ts` : selon `quality`, ajuste `maxOutputTokens` (ex. 8192 → 12288), choisit un modèle par défaut plus fort, injecte un bloc d'instructions « niveau expert » dans le `system`/`user`, et en `pro` demande **2–3 variantes** comparatives sur les livrables marketing (titres, descriptions, accroches).

## 4. Cohérence affichage Hub
- Le bandeau du Hub annonce clairement : « 197€ : écris et publie ton livre sur Amazon. 497€ : lance-le et vends-le (emails, ads, social, audio, monétisation) + qualité IA maximale. »
- Mettre à jour les libellés du sélecteur de parcours et le sous-texte d'upsell pour refléter la nouvelle frontière (publier vs vendre).

## Détails techniques
- **Fichiers modifiés** : `src/components/admin/V3Workflow30.tsx` (re-tag `tier`, rendu teaser bridé, champ `quality`, libellés), `supabase/functions/v3-autopilot-step/index.ts` (modèle/tokens/prompt/variantes selon `quality`), éventuellement `src/components/admin/V3HubPage.tsx` (texte du bandeau).
- **Déploiement** : redéployer `v3-autopilot-step` après modif.
- **Pas de nouveau paiement** : on réutilise le gating `useV3Entitlement` + `V3PackCheckout` déjà en place.
- **Mémoire** : enregistrer la nouvelle politique de paliers (197€ = jusqu'à publication, marketing = teaser 497€, qualité par palier) dans la mémoire projet.

## Hors périmètre (à confirmer plus tard)
- Brancher la même logique teaser/qualité sur les modules ouverts hors workflow (cartes du Hub).
- Limites d'usage chiffrées (nombre de livres, de régénérations) — pas demandé ici.
