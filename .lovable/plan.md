# Ouvertures + clics des newsletters visibles dans l'app, pour relancer les non-ouvrants

## Le principe

Les clics sont déjà suivis : chaque bouton des newsletters passe par le traceur
(`track-email-click`) et remonte dans le panneau « Clics Systeme.io », avec
l'email du prospect fourni par la balise `{{contact.email}}`.

Ce qui manque : les **ouvertures**. Le HTML des newsletters ne contient
aucun pixel de suivi aujourd'hui (vérifié dans `newslettersSystemeio.ts`).
On applique donc exactement la même méthode que pour les clics : un pixel
invisible avec la balise `{{contact.email}}`, envoyé dans le HTML collé
dans Systeme.io. Résultat : l'app connaît, par newsletter, qui a ouvert,
qui a cliqué, et donc **qui n'a rien fait** — la liste à relancer.

Note : les statistiques internes de Systeme.io restent dans Systeme.io ;
on ne les récupère pas automatiquement. Le suivi ci-dessous est notre propre
mesure, indépendante et par prospect.

## Étape 1 — Pixel d'ouverture dans chaque newsletter

- Ajout d'un pixel 1x1 en bas du HTML généré, avec le numéro de la
  newsletter et l'email fusionné.
- Les emails de test (balise non remplacée) ne sont pas comptés, comme
  pour les clics.
- Limite honnête à afficher dans le panneau : Gmail et Outlook bloquent ou
  mettent en cache les images, donc le taux d'ouverture réel est
  sous-estimé. Le clic reste le signal fiable.

## Étape 2 — Nouveau panneau « Relancer les non-ouvrants »

Dans `/admin/sequence-email`, à côté du panneau de clics :

- Sélection d'une newsletter (#1 à #5) ou « toutes ».
- Trois compteurs : ont ouvert, ont cliqué, **n'ont rien fait**.
- Liste des non-ouvrants (prospects connus en base, hors désabonnés et hors
  clients ayant acheté).
- Bouton **Copier les emails** et **Exporter en CSV** pour importer le
  segment dans Systeme.io et y envoyer la relance.
- Bouton pour proposer un objet de relance prêt à coller (même contenu,
  nouvel objet).

## Étape 3 — Le geste côté Systeme.io

1. Coller le HTML de la newsletter (il contient désormais le pixel).
2. 48 h après l'envoi, ouvrir le panneau, exporter les non-ouvrants.
3. Importer ce CSV dans Systeme.io en le taguant `RELANCE-<numéro>`.
4. Envoyer la même newsletter à ce tag avec l'objet de relance.

## Détails techniques

- `src/data/newslettersSystemeio.ts` : helper `trackedOpenPixel(n)` + insertion
  dans `newsletterToHtml`, template `newsletter-<n>` réutilisé pour
  correspondre au préfixe déjà filtré côté panneau.
- `supabase/functions/track-email-open` : validation de l'email réel
  (même règle anti-balise que `track-email-click`), aucune autre modif.
- Nouveau `src/components/admin/NewsletterEngagementPanel.tsx` : lecture de
  `email_opens` + `email_clicks` filtrés sur `template_name LIKE 'newsletter-%'`,
  croisement avec `sales_prospects` (exclusion `unsubscribed`), export CSV.
- Aucun envoi de masse depuis l'app : la relance part de Systeme.io.
