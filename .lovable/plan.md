# Objectif : faire passer le taux de clic de ~1% à un niveau sain et relancer les prospects

Le constat : 56% d'ouverture (très bon) mais ~1% de clic. Le contenu et surtout l'absence de **vrai bouton d'action** tuent les clics. On retravaille le rendu visuel + les textes, puis on relance.

## 1. Nouveau design visuel des emails (`send-sales-email`)

Refonte de `buildHtmlEmail` pour des emails qui donnent envie de cliquer :
- **En-tête de marque** clair (EbookStudio Pro, couleurs KDP : teal #008296, accent orange #FF9E2D).
- **Un seul bouton CTA dominant** (gros bouton orange centré) au lieu de liens-texte noyés — c'est LE changement qui fait grimper les clics.
- Support d'une syntaxe bouton dans les textes (`[[texte|url]]`) rendue en gros bouton traçable.
- **Encadré preuve sociale** (35+ livres publiés, profil Amazon public, "généré en 47 min").
- Mise en forme aérée : titres, puces avec icônes, espacements.
- On garde le pixel d'ouverture et les liens traçables existants (le tracking ne change pas).

## 2. Réécriture des corps d'emails (plus courts, 1 seule action)

Réécrire les 6 étapes des deux segments (`getEmailBody` froid + `getInteresseEmailBody` intéressés) :
- Accroche forte dès la 1re ligne, texte resserré (on lit en 15 sec).
- **Une seule action par email** (soit la démo, soit l'offre — pas les deux côte à côte qui dispersent le clic).
- Bénéfice concret + curiosité (« voir le plan se générer sous vos yeux »).
- Bouton bien visible via la nouvelle syntaxe `[[ Voir la démo gratuite → | lien ]]`.
- Objets conservés (ils marchent déjà), légers ajustements seulement si utile.

## 3. Relance des prospects depuis /gestion-prospects

Ajout d'un bouton **« 🔁 Relancer les non-cliqueurs »** dans la page Gestion Prospects :
- Cible automatiquement les prospects qui ont **ouvert mais jamais cliqué** (vos ~357 leads tièdes les plus prometteurs).
- Leur envoie un **nouvel email de relance dédié** (nouveau contenu n°7, orienté curiosité + démo, avec gros bouton), via le mode manuel de `send-sales-email`.
- Confirmation du nombre d'emails envoyés (toast existant).
- Le bouton existant « Relancer les chauds » reste, mais on clarifie : chauds = ont cliqué, tièdes = ont ouvert sans cliquer.

## 4. Vérification

- Déploiement de la fonction `send-sales-email` mise à jour.
- Test d'envoi sur 1–2 adresses pour valider le rendu visuel (bouton, en-tête, preuve sociale) avant relance de masse.

## Détails techniques

- Fichiers : `supabase/functions/send-sales-email/index.ts` (refonte `buildHtmlEmail`, textes, ajout étape relance), `src/pages/ProspectManagerPage.tsx` (bouton relance non-cliqueurs + appel `send-sales-email` mode manual sur la liste filtrée ouvreurs-non-cliqueurs).
- Aucune migration DB nécessaire (on réutilise `sales_prospects`, `email_opens`, `email_clicks`).
- Envoi via Brevo (inchangé), tracking ouverture/clic inchangé.
