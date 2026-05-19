## Contexte

Tu es sur `/ebook-planner` qui utilise le shell `EspaceHeader` (5 familles : Plan / Écrire / Habiller / Publier / Vendre). Deux outils existent mais sont enterrés :

- **Audit ASIN / Audit Pilot** → sous-onglet de "Publier" (id `audit-pilot`), invisible tant qu'on n'ouvre pas la famille Publier.
- **Communauté** → route `/communaute` (ForumPage existe), mais **aucun lien** dans `EspaceHeader`. Elle n'est listée que dans `ModernSidebar` (autre shell non utilisé sur ebook-planner).

---

## Partie 1 — Déblocage immédiat (sprint maintenant)

### A. Rendre l'onglet "Audit ASIN" visible

Dans `src/components/layout/EspaceHeader.tsx` :

1. Ajouter dans la barre principale (à côté de "Tous les outils") un **bouton raccourci "🔍 Audit ASIN"** qui appelle `onTabChange('audit-pilot')` → ouvre directement la fiche ASIN.
2. Dans `PLANNER_SUBTABS.export`, remonter `audit-pilot` en **1ère position** avec libellé plus explicite : "🔍 Auditer un ASIN".
3. Dans `KdpAmazonResearch`, garder `defaultTab="asin"` quand on arrive sans contexte (déjà OK).

### B. Débloquer la Communauté

Dans `EspaceHeader.tsx` :

1. Ajouter un **bouton "💬 Communauté"** dans la barre du haut (à droite, près du logout), qui fait `navigate('/communaute')`.
2. Ajouter aussi un item "Communauté" dans le popover **"Tous les outils"** sous une nouvelle famille `account` (ou en lien direct externe).
3. Vérifier que `/communaute` est bien protégé par `SubscriberGate` (déjà OK dans App.tsx).

### C. Quick wins QoL

- Tooltip "NEW" sur le bouton Audit ASIN pendant 30 jours.
- Badge orange `NEW` sur Communauté.

**Fichiers touchés** : `src/components/layout/EspaceHeader.tsx` uniquement.

---

## Partie 2 — Plan V3 Septembre 2026 (passage 147€ → 197€)

Objectif : justifier le passage à **197€** par une vraie montée en valeur perçue, sans casser la stack actuelle (focus stabilisation respecté).

### V3.1 — A+ Content Generator (le gros morceau, ~2j dev)
4 modules visuels IA exportables prêts pour KDP :
- Module 1 : Bannière auteur (photo + bio + signature)
- Module 2 : Extrait stylisé du livre (1ère page mise en scène)
- Module 3 : Comparatif série / autres tomes
- Module 4 : Témoignages lecteurs (citations + étoiles)
- Export : PNG 970×600 + ZIP zippé prêt pour upload KDP A+ Content Manager.

### V3.2 — Audit ASIN "one-click batch" (~1j)
- Auditer **jusqu'à 5 ASINs en lot** depuis `/audit-pilot`
- Rapport comparatif PDF avec scores globaux, top-3 actions par livre
- Historique des audits sauvegardé en base (table `kdp_audits`)

### V3.3 — Pack "Lancement KDP 30 jours" (~1j)
- Calendrier interactif J1→J30 : posts sociaux, emails ARC, relances Amazon Ads
- Generateur d'emails ARC pré-remplis (10 templates)
- Connecté au planificateur déjà en place

### V3.4 — Communauté V2 (~1j)
- Catégories : Niches / Couvertures / Mots-clés / Bugs / Réussites
- Système de "réussite vérifiée" (upload screenshot KDP → badge gold)
- Notifications email Resend pour réponses (déjà partiellement en place)

### V3.5 — Tarification & merch
- Bascule `147€ → 197€` (déjà faite côté front, vérifier Stripe price ID en sept.)
- Bandeau "Early bird 147€ jusqu'au 31 août" + countdown
- Page `/v3` listant les nouveautés pour conversion

### Roadmap proposée

```
Juin       : V3.1 A+ Content Generator (priorité absolue)
Juillet    : V3.2 Audit batch + V3.4 Communauté V2
Août       : V3.3 Pack Lancement 30j + early bird 147€
1er sept.  : Bascule officielle 197€ + page /v3 live
```

---

## Détails techniques

- `EspaceHeader.tsx` : ajouter 2 boutons dans la barre top + 1 entrée dans subtabs.export + 1 famille `account` dans `ALL_TOOLS`.
- Pas de migration DB pour la partie 1.
- Pour V3.2 : nouvelle table `kdp_audits (id, user_id, asin, score, payload jsonb, created_at)` avec RLS user-scoped.
- A+ Content Generator : nouvelle edge function `kdp-aplus-content-generator` utilisant Gemini 3 image preview + composition Canvas côté client.

---

## Question

Tu veux que j'attaque tout de suite la **Partie 1 (déblocage Communauté + Audit ASIN)** dès validation, et qu'on planifie la V3.1 (A+ Content) pour la semaine prochaine ?
