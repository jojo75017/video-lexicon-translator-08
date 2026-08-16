# Bouton clair/sombre, onglet Compléments, et emails qui font cliquer

Trois manques constatés dans le code actuel :
- aucun sélecteur clair/sombre : le header V3 (`V3Header.tsx`) n'a aucun bouton de thème et la feuille `v3-public.css` n'a pas de variante sombre ;
- aucun onglet « Compléments / Upsells » dans la barre latérale (`V3Sidebar.tsx`) ni de page `/v3/upsells` ;
- les emails de relance envoient vers l'achat sans donner de raison de cliquer, et le tableau d'envoi ne montre pas ce que chaque email rapporte réellement.

## 1. Bouton clair / sombre (visible partout)

- Un bouton dans la barre de marque V3, à gauche de « Support » : trois états — Clair, Sombre, Automatique (suit le système).
- Choix mémorisé dans le navigateur, appliqué avant le premier affichage (aucun clignotement blanc).
- Le même bouton apparaît dans le menu mobile et dans la barre latérale, en bas.
- Le thème sombre couvre tout : pages V3, barre latérale, tuiles, formulaires, tableaux, dialogues, aperçus de sommaire. Fond profond, texte crème, accent or conservé, contraste vérifié.
- Les blocs déjà sombres (bandeaux, sections émeraude) restent lisibles dans les deux modes.

## 2. Onglet « Compléments » (upsells)

Nouvelle entrée en haut de la section « Mon compte » de la barre latérale : **Compléments & options**, page `/v3/upsells`.

La page présente, en cartes Émeraude & Or, chaque complément avec prix, ce qu'il apporte, et un bouton d'action :
- BookPerfect AI — Directeur éditorial (97 €)
- Pack Traductions relues, 10 langues (97 €)
- Audiolivre Premium (67 €)
- Version audio d'un livre (9,99 €)
- Sélection maisons d'édition (77 €)
- Pack Sérénité — Zoom 1-à-1 (30 €)

Règles d'affichage :
- si le complément est déjà inclus dans le forfait de l'abonné, la carte affiche « Inclus dans votre forfait » et le bouton ouvre l'outil au lieu du paiement ;
- pour Studio Pro, tout est marqué inclus (aucun achat possible) ;
- un bandeau en tête rappelle la valeur totale des compléments et l'économie réalisée avec Studio Pro ;
- les mêmes cartes réapparaissent sous un livre terminé, pour que l'abonné n'ait rien à chercher.

Paiement : bouton unique par complément, paiement intégré (carte) plus PayPal, avec retour à la page et déblocage immédiat.

## 3. Faire cliquer et acheter avec les emails

Principe appliqué à toute la relance : **un clic gratuit avant tout achat**. Chaque email a un seul objectif et un seul lien principal, vers le cadeau des 10 niches livré immédiatement dans l'application ; l'offre payante n'apparaît qu'après ce premier clic.

Refonte des envois :
- objets courts (45 caractères maximum), sans prix, sans majuscules, sans emoji, formulés comme un message personnel ;
- promesse concrète dès la première ligne, décision demandée avant le premier défilement ;
- un seul lien principal, répété deux fois au maximum ; le lien d'achat placé plus bas, jamais en concurrence ;
- preuve visible dans le corps du message : pages réelles d'un livre produit, couverture, fichier prêt pour Amazon ;
- signature unique avec votre adresse directe boubetgeorges@gmail.com ;
- trois séquences séparées : jamais ouverts (réactivation, 3 messages), ouverts sans clic (cadeau, preuve, objection, échéance), cliqueurs (message personnel puis rappel d'achat) ;
- envoi étalé automatiquement par lots pour respecter le quota, exclusion des désabonnés et des adresses en rebond, marquage `[TEST]` sur vos essais.

Mesure, dans le panneau d'administration, colonne par email : envoyés, ouverts, cliqués, cadeau réclamé, commande créée, commande payée. Sans ces colonnes, impossible de savoir quel message convertit — c'est ce qui manque aujourd'hui.

Le lien cadeau et le lien d'achat portent une source par email, de sorte qu'une vente est attribuée au message qui l'a produite.

## Détails techniques

- Thème : `ThemeProvider` (clair/sombre/auto) + `localStorage`, script d'initialisation dans `index.html`, classe `dark` sur `<html>`, variables sombres ajoutées dans `src/index.css` et `src/styles/v3-public.css`, bouton `ThemeToggle` monté dans `V3Header.tsx` (desktop + drawer) et `V3Sidebar.tsx`.
- Compléments : page `src/pages/v3public/V3UpsellsPage.tsx` alimentée par `V3_ADDON_LIST` (déjà présent dans `src/data/v3Pricing.ts`), route `/v3/upsells` dans `App.tsx`, entrée dans `V3Sidebar.tsx`, réutilisation de `V3SubscribeCheckout` et `PayPalSubscribeButton`, statut d'inclusion via `useV3Entitlement`. Les prix des compléments passent par les identifiants déjà autorisés dans `v3-subscription-checkout`.
- Emails : modèles `reactivation-a1/a2/a3`, `clic-b1/b2/b3/b4`, `chaud-c1/c2` dans `send-closing-47`, déclarés dans `src/data/canonicalEmailCampaign.ts` ; segments calculés depuis `email_send_log`, `email_opens`, `email_clicks`, `sales_prospects` ; colonnes de résultat ajoutées à `ClosingCampaignPanel.tsx` ; suivi `checkout_click` / `checkout_ready` via `captureTracking.ts`.
- Aucune modification des tarifs d'abonnement dans cette étape.

## Ordre d'exécution

1. Thème clair/sombre et bouton visible (header, mobile, barre latérale).
2. Page Compléments, onglet dans la barre latérale, cartes sous un livre terminé.
3. Réécriture des emails, segments, colonnes de résultat, puis envoi test vers votre adresse avant l'envoi réel par lots.
