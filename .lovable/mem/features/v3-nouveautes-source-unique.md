---
name: Nouveautés V3 — source unique
description: Toute nouveauté V3 se déclare dans src/data/v3Nouveautes.ts ; badges NOUVEAU automatiques 30 jours, jamais écrits en dur
type: feature
---
- `src/data/v3Nouveautes.ts` est la SEULE source des nouveautés V3 (`id`, `title`, `desc`, `to`, `date`, `tier`, `status`).
- Badge « Nouveau » automatique pendant 30 jours après `date` : dérivé via `isRouteNouveau()` dans la sidebar (`V3Sidebar.tsx`) et les onglets (`V3MainTabs.tsx`). **Ne jamais réécrire `badge: 'NEW'` en dur.**
- `/v3/nouveautes` est générée depuis ce fichier (groupée par mois, section « Bientôt disponible ») et remet le compteur non-vu à zéro (`localStorage: v3_nouveautes_seen_at`).
- Libellés de palier dérivés de `v3Pricing.ts` (Plume 27 €/mois, Édition 47 €/mois) — jamais de tarif écrit en dur.
- Anciennes pages de vente supprimées : `/vente-v3` et `/commande-v3` redirigent vers `/commander` (offre unique 47 € à vie jusqu'au 30/09/2026).
