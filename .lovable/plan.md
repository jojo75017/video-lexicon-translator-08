## Objectif

Te donner, dès maintenant, un **kit influenceurs prêt à envoyer** sur TikTok/Instagram, plus une **rémunération par parrainage à 30 %** qui réutilise ton système d'affiliation existant. Deux points d'accès : un **module admin** dans le Hub V3 et une **page publique `/influenceurs`** partageable directement.

> **Prix en vigueur** : on est à **67 € maintenant** (jusqu'au 1er octobre). Le passage à **197 € (V3)** est prévu pour octobre. Le kit affiche donc le prix et la commission **actuels (67 €)** et est conçu pour basculer automatiquement à 197 € en octobre.

---

## 1. Le modèle financier (idée développée)

On garde ton système actuel (tables `referral_codes`, `referrals`, `affiliate_clicks`, commission 30 %).

```text
MAINTENANT  : Vente 67 €   →  30 % = 20,10 € / vente
DÈS OCTOBRE : Vente 197 €  →  30 % = 59,10 € / vente   (V3)
```

Pour éviter de toucher au code en octobre, on centralise le prix et la date de bascule dans une petite constante (réutilisant `referralLaunch.ts` / une date `V3_PRICE_SWITCH = 1er octobre 2026`). Avant la date → 67 € / 20,10 € ; après → 197 € / 59,10 €. Tout le kit (page, PDF, simulateur, message d'approche) lit cette constante.

Argumentaire « gagnant-gagnant » à mettre en avant :

- **30 % de commission** à vie sur chaque vente — bien au-dessus de la moyenne.
- **Lien + code unique** par influenceur → suivi automatique clics + ventes (déjà géré).
- **Pas de cash en avance** : zéro risque, tu ne paies que sur résultat réel.
- **Bonus de palier** (texte d'incitation) : ex. à partir de 5 ventes, accès offert à l'influenceur → il devient ambassadeur authentique.
- **Tableau de simulation** : « 10 ventes = 201 € (puis 591 € dès octobre) », etc.

> Note : le programme de parrainage public reste cadré par `referralLaunch.ts`. Le kit est utilisable dès maintenant pour contacter/préparer les influenceurs ; les liens fonctionnent immédiatement.

---

## 2. Le mockup visuel premium

- Génération d'un **visuel mockup photoréaliste** (écran de l'app sur smartphone/tablette, fond premium, badge prix dynamique « 67 € à vie » → « 197 € » en octobre), charte respectée (fond clair, teal #008296, accent orange #FF9E2D, photoréalisme strict).
- Stocké dans `src/assets/` et utilisé : (a) page `/influenceurs`, (b) intégré au PDF, (c) téléchargeable seul (format vertical 9:16 prêt pour story/Reel).

---

## 3. Le PDF « Dossier Influenceur »

Document pro d'1-2 pages dans `public/kit-influenceurs.pdf` (téléchargeable depuis l'app) :

1. Pitch produit + mockup.
2. L'offre : **30 % par vente** (20,10 € maintenant, 59,10 € dès octobre), tableau de simulation.
3. Comment ça marche en 3 étapes (reçoit son lien → poste → gagne).
4. **3 scripts vidéo TikTok/Reels** prêts à tourner (hook + corps + CTA).
5. Conditions simples + contact + lien d'inscription.

---

## 4. Page publique `/influenceurs`

Landing partageable (style charte KDP) :

- Hero : « Deviens ambassadeur Ebookstudio — gagne 30 % par vente ».
- Mockup premium + bénéfices.
- Simulateur de gains interactif (slider ventes → € gagnés), prix lu depuis la constante de bascule.
- Les 3 scripts vidéo affichés + bouton copier.
- Boutons : **Télécharger le kit (PDF)**, **Télécharger le visuel**, **Je rejoins le programme** (création/récupération du code via `referral_codes`, comme `PromoAffiliePage`).
- SEO via `SeoHead` (titre < 60, meta < 160, H1 unique). Route ajoutée dans `App.tsx`.

---

## 5. Module admin dans le Hub V3

- Nouvelle entrée dans `src/data/roadmapV3.ts` : `influencer-kit` (pilier `marketing`, status `done`), titre « Kit Influenceurs TikTok/Insta ».
- En complément, on **garde 197 € dans la roadmap** : note sur le module / mémoire que la commission passera de 20,10 € à 59,10 € au passage V3 en octobre.
- Composant React rendu via `v3ModuleRegistry`, permettant de :
  - Saisir le nom d'un influenceur → **générer un lien + code de suivi unique** (`referral_codes`).
  - Copier un **message d'approche prêt à coller** (DM TikTok/Insta) avec lien injecté.
  - Télécharger le PDF et le visuel.
  - Mini-tableau de suivi (clics / ventes) depuis `affiliate_clicks` + `referrals`.

---

## Détails techniques

- **Réutilisation** maximale : `referral_codes`, `referrals`, `affiliate_clicks`, `useReferral`, logique `PromoAffiliePage`, `SeoHead`, `FunnelLayout`. Aucune nouvelle table.
- **Prix dynamique** : une constante centrale (prix + date de bascule 1er octobre) pilote tout l'affichage (67 €/20,10 € → 197 €/59,10 €).
- **Mockup** : généré via l'outil d'image (photoréaliste), asset importé ES6.
- **PDF** : généré une fois (reportlab) et déposé dans `public/` ; QA visuelle avant livraison.
- **Pas de logique de paiement modifiée** — flux de commission existant (`handle_funnel_order_paid`).
- Fichiers touchés : `src/data/roadmapV3.ts`, `v3ModuleRegistry`, nouveau `InfluencerKit.tsx`, nouvelle page `InfluenceursPage.tsx`, `App.tsx`, asset mockup, `public/kit-influenceurs.pdf`, petite constante prix/bascule.

---

## Hors périmètre

- Pas de modification du taux de commission (reste 30 %).
- Pas d'automatisation d'envoi de DM (message fourni à copier-coller).
