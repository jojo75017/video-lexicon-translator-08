# Plan : +d'inscrits email, et tout voir sans rien cacher

Objectif n°1 : maximiser les inscriptions aux guides gratuits (lead magnets). Approche en 3 volets : (A) un tableau de bord d'acquisition 100% transparent, (B) des optimisations concrètes dans l'app pour convertir plus, (C) un plan marketing externe pour amener plus de monde sur les points de capture.

Aujourd'hui le site capture déjà des emails via le popup, le bandeau sticky, les pages /cadeau, /demo et l'A/B test A/B. **Le vrai problème : on ne mesure que les inscriptions réussies, jamais combien de personnes ont VU le popup/bandeau ni combien ont cliqué.** Impossible donc de savoir où ça coince. On corrige ça en premier.

---

## Volet A — Tableau de bord "Acquisition" (tout voir)

Nouvel onglet **"Acquisition"** dans le CRM (`/crm`), réservé admin, qui montre toute la chaîne sans rien masquer :

```text
VUES popup/bandeau → CLICS (ouverture form) → INSCRITS → (plus tard) ACHATS
   12 400              3 100                    640            18
                       25% d'ouverture          20,6% conv.    2,8%
```

Contenu du tableau de bord :
- **Entonnoir d'acquisition complet** : vues → clics → inscrits, avec le taux de conversion à chaque étape, par source (popup, bandeau, page /cadeau, /demo, inline).
- **Comparatif A/B en clair** : variante A vs B, nombre d'inscrits ET taux de conversion réel de chaque variante, pour enfin trancher laquelle gagne.
- **Courbe des inscrits par jour** (30 jours) + total, et répartition par lead magnet (5 niches / KDP étranger).
- **Répartition par source UTM** (d'où viennent les inscrits : Google, Pinterest, email, direct…).
- **Liste brute des inscrits** récents (email, source, variante, date, lead magnet) avec export CSV — rien de caché.

Pour rendre cela possible, on ajoute le **tracking des vues et clics** des éléments de capture (aujourd'hui absent) : chaque affichage du popup/bandeau et chaque ouverture du formulaire sont enregistrés. Sans ça, les taux de conversion seraient des estimations ; là ce seront des chiffres réels.

## Volet B — Optimisations dans l'app (plus d'inscrits)

1. **Popup plus malin** : autoriser un ré-affichage après quelques jours (au lieu de "jamais plus") pour les visiteurs qui ont fermé sans s'inscrire, et déclenchement légèrement plus tôt sur mobile.
2. **Bandeau sticky avec preuve sociale** : ajouter un compteur réel ("déjà 1 200+ inscrits") et un champ email visible directement (1 clic de moins).
3. **Aimant supplémentaire sur /demo** : après que le visiteur a testé le générateur, proposer de recevoir le guide par email — c'est le moment de plus forte intention.
4. **Étendre l'A/B test** : tester aussi le moment de déclenchement et le visuel, pas seulement le texte, et afficher le gagnant directement dans le dashboard.
5. **Capture inline en fin d'articles de blog** : insérer un bloc d'inscription au milieu/fin des articles (fort trafic SEO existant).

## Volet C — Plan marketing externe (plus de trafic vers la capture)

- **SEO** : pousser le trafic vers les pages capture via les articles de blog déjà bien référencés (maillage interne + bloc d'inscription).
- **Pinterest / réseaux** : épingles qui pointent vers /cadeau (audience KDP très présente sur Pinterest).
- **Lead magnets segmentés** : mettre en avant le bon guide selon l'audience (général vs expatriés), déjà supporté techniquement.
- **Parrainage** : inciter les inscrits/clients existants à partager le guide (système de referral déjà en place).
- **Séquence email d'accueil** optimisée pour transformer l'inscrit en client 67€ (déjà partiellement en place).

> Note : les volets SEO/Pinterest/parrainage sont surtout des actions à mener (contenu, publications). Je peux préparer les supports dans l'app (blocs, pages, liens de partage) ; la diffusion reste manuelle.

---

## Ordre de réalisation proposé

1. **Tracking vues + clics** des éléments de capture (la base pour tout voir).
2. **Tableau de bord Acquisition** dans le CRM (entonnoir, A/B, sources, export).
3. **Optimisations popup / sticky / demo** pour augmenter le taux de conversion.
4. **Blocs de capture blog + supports marketing** (Pinterest/parrainage).

## Détails techniques

- Nouvelle table `capture_events` (type: `view` | `click`, surface: popup/sticky/demo/inline, variante A/B, source UTM, page) avec RLS + GRANT (lecture admin uniquement). Insertion publique anonyme autorisée uniquement pour ces 2 types d'événements.
- Tracking ajouté dans `LeadCapturePopup.tsx`, `StickySignupBar.tsx`, `InlineLeadCapture.tsx` et `/demo` (impression au montage, clic à l'ouverture du form). Insertion non bloquante.
- Nouveau composant `CrmAcquisition.tsx` + onglet dans `CrmPage.tsx`, requêtes agrégées sur `funnel_leads` (déjà: `ab_variant`, `utm_*`, `lead_magnet`, `created_at`) croisées avec `capture_events`.
- Aucune modification du flux de paiement. Lecture seule côté dashboard, écriture seule (events) côté public.
- A/B test étendu via `src/lib/abTest.ts` (ajout dimension de déclenchement) sans casser l'assignation stable existante.

Hors scope : refonte du design global, changement de l'offre 67€, intégration d'un outil emailing tiers.