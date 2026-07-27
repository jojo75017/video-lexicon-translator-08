# Plan — Compléments V3 à ajouter

Après audit de `/v3` (routes, header, sidebar, outils, hub, pages publiques), voici ce qui manque encore pour rendre la V3 réellement **prête au lancement d'août/octobre**. Regroupé par priorité.

---

## 1. Espace abonné (Mon compte) — manquant critique

Aujourd'hui il n'existe pas de tableau de bord personnel unifié dans `/v3`. À créer :

- `/v3/compte` — Dashboard personnel (livres en cours, quota du mois, forfait actif, factures Stripe, clés API BYOK)
- `/v3/compte/facturation` — Historique Stripe (portail client), changement de forfait, annulation
- `/v3/compte/cles-api` — Gestionnaire Gemini/OpenRouter multi-clés (déjà codé, à intégrer ici)
- `/v3/compte/quotas` — Compteur livres/mois selon plan (5 / 10 / illimité)
- Badge forfait actif visible dans le header (🌱 / ⚡ / 👑)

## 2. Workflow de génération — finaliser le tunnel

- **Reprise de projet** : bouton "Reprendre" sur chaque brouillon (checkpoint localStorage + `ebook_projects`)
- **Barre de progression 30 agents** visible pendant la génération (P1 → P30)
- **Journal live** (logs par agent) + bouton "Réessayer cet agent"
- **Sélecteur de clé Gemini par projet** intégré au wizard (composant existe, à brancher)
- **Estimation coût crédits** avant lancement

## 3. Modules V3 encore absents du registre

En croisant `v2ToolsRegistry.ts` (63 outils) avec les besoins déclarés :

- **Studio Couverture Pro V3** (page dédiée `/v3/couverture-studio` — gpt-image-2 + variations)
- **KDP Pilot** (page dédiée `/v3/kdp-pilot` — publication assistée)
- **Amazon Spy / KDSpy** (existe en donnée, pas de page publique V3)
- **Traducteur 10 langues** (inclus Auteur, upsell autres)
- **Éditeur de sommaire** (TocEditor) — accessible hors wizard
- **Import Studio** — actuellement composant, en faire une page `/v3/import`
- **Générateur BD / Livre audio / Coloriage** — pages dédiées manquantes

## 4. Onboarding & aide

- **Tour guidé** première connexion V3 (5 étapes : créer, sommaire, générer, habiller, publier)
- **Centre d'aide V3** `/v3/aide` avec vidéos + FAQ
- **Chat support** (Ebookbot déjà là, à contextualiser V3)
- **Modèles de livres prêts** (`/v3/modeles`) — 10 templates par catégorie

## 5. Communauté & social proof

- **Galerie publique** enrichie (`/v3/gallery` existe, à peupler avec vrais livres)
- **Profils auteurs** publics avec livres publiés
- **Témoignages vidéo** sur la home
- **Compteur "livres publiés ce mois"** (temps réel via Supabase)

## 6. Admin — pilotage V3

- **Dashboard admin V3** `/admin/v3` : MRR, abonnés par tier, livres générés/jour, coût IA
- **Gestion des accès** : offrir un forfait manuellement, révoquer
- **Feature flags** par forfait (activer/désactiver un outil sans redéploiement)
- **Modération galerie** publique

## 7. Marketing intégré V3

- **Page comparaison forfaits** `/v3/forfaits` propre (aujourd'hui `/offres` mélange V2/V3)
- **Bandeau promo saisonnier** (59€ été → 97€ octobre → 197€) piloté depuis admin
- **Parrainage** (1 mois offert pour 1 filleul)
- **Codes promo** applicables au checkout Stripe

## 8. Polish visuel

- **Favicon + OG images** dédiés V3 (émeraude/or)
- **Loading skeletons** cohérents sur toutes les pages V3
- **Mode sombre** optionnel (charte émeraude s'y prête)
- **Animations** subtiles (Framer Motion) sur hero et cartes outils

---

## Détails techniques

- Toutes les nouvelles pages sous `src/pages/v3public/` + routes dans `App.tsx` sous `<Route path="/v3">`
- Quotas et feature flags stockés dans `v3ToolPlans.ts` (source de vérité déjà en place)
- Compteurs temps réel via Supabase Realtime sur `ebook_projects`
- Portail client Stripe : edge function `stripe-customer-portal` à créer
- Aucune nouvelle table nécessaire — réutiliser `ebook_projects`, `subscribers`, `user_roles`

---

## Proposition d'ordre d'exécution

1. **Sprint 1 (bloquant lancement)** : §1 Espace abonné + §2 Workflow finalisé + §7 Page forfaits propre
2. **Sprint 2** : §3 Modules manquants + §4 Onboarding
3. **Sprint 3** : §5 Communauté + §6 Admin + §8 Polish

Dis-moi par quel sprint on commence — ou coche les points précis que tu veux implémenter en premier.
