# Campagne « Ce que vous perdez le 1er octobre » — 2 lettres + relances

## Ce qu'on met en place

Deux séquences distinctes, envoyées depuis votre espace admin, puis relancées automatiquement.

**A. Abonnés V2 existants (déjà clients)**
Objectif : qu'ils ne perdent pas leurs avantages et qu'ils activent leurs 3 modules V3 offerts + leur remise -20 % à vie.

**B. Prospects non-acheteurs (ouvreurs et cliqueurs, hors acheteurs et désinscrits)**
Objectif : les dissuader d'attendre — au 1er octobre l'accès à vie à 47 € disparaît, il ne restera que l'abonnement.

Envoi : vous cliquez « Envoyer » pour la lettre 1. Les relances J+3 et J+7 partent ensuite automatiquement, uniquement vers ceux qui n'ont ni acheté ni cliqué. Toute personne qui achète sort immédiatement de la séquence.

## Marche à suivre côté vous (5 minutes)

1. Ouvrir **Admin → Gestion prospects → Campagne « Ce que vous perdez »**.
2. Vérifier le compteur de destinataires affiché pour chaque segment.
3. Cliquer **Prévisualiser** puis **Envoi test** (vers votre adresse) pour la lettre A puis la lettre B.
4. Vérifier les 2 emails dans votre boîte (liens, prix, orthographe).
5. Cliquer **Envoyer maintenant** sur le segment choisi.
6. Activer l'interrupteur **Relances automatiques** : J+3 et J+7 partiront seules.
7. Le lendemain, revenir sur le panneau : envoyés / ouverts / cliqués / achats sont affichés.

Aucun envoi ne part sans votre clic. Un même destinataire ne reçoit jamais deux fois la même lettre.

## Lettre 1 — Prospects (celle qui dissuade d'attendre)

**Objet :** Le 1er octobre, l'accès à vie à EbookStudio disparaît
**Pré-en-tête :** Après cette date, il ne reste que l'abonnement. Le calcul est simple.

> Bonjour,
>
> Je vous écris une fois, clairement, parce que la date approche et que je ne veux pas que vous l'appreniez après.
>
> **Jusqu'au 30 septembre**, EbookStudio est accessible pour **47 € une seule fois**, à vie. Vous payez une fois, vous gardez l'accès, y compris les évolutions à venir.
>
> **À partir du 1er octobre**, cette offre n'existe plus. Il ne restera que l'abonnement : 17 €/mois pour la formule Plume, 27 €/mois pour la formule Édition. Sur un an, cela fait 204 € au lieu de 47 €. Sur trois ans, 612 €.
>
> **Ce que vous perdez précisément si vous attendez :**
>
> - L'accès à vie : plus jamais proposé après cette date.
> - Le prix de 47 € : c'est le plus bas jamais pratiqué, il ne reviendra pas.
> - Les mises à jour incluses sans repayer : dans l'abonnement, l'accès s'arrête le jour où vous arrêtez de payer.
> - Vos projets en cours : un abonnement interrompu, c'est un livre à moitié écrit auquel vous n'accédez plus. Avec l'accès à vie, votre livre vous attend, même si vous ne l'ouvrez pas pendant six mois.
>
> Et ce que vous obtenez pour ces 47 € : le plan du livre, la rédaction chapitre par chapitre, la correction automatique du manuscrit, les fichiers Word et PDF aux normes Amazon KDP, la couverture complète avec le dos calculé, et la fiche de vente Amazon (titre, description, mots-clés, catégories).
>
> **47 € — paiement unique — accès à vie.** Possible en 2 fois (2 × 25 €) ou 3 fois (3 × 18 €), carte bancaire ou PayPal.
>
> **➜ [ JE PRENDS MON ACCÈS À VIE À 47 € ]**
> *(gros bouton orange, pleine largeur, pointant vers https://ebookstudio.fr/commander)*
>
> Si quelque chose vous retient, répondez simplement à cet email : je lis et je réponds moi-même.
>
> Georges Boubet — EbookStudio
>
> P.S. Le 1er octobre au matin, cette page affichera 17 €/mois. Ce sera trop tard pour l'accès à vie, et je ne pourrai pas faire d'exception. Le lien direct, si le bouton ne s'affiche pas : https://ebookstudio.fr/commander

**Appels à l'action dans la lettre (3 au total, même destination) :**

1. Un premier lien texte juste après le calcul des 204 €/an : « Voir l'offre à 47 € avant le 30 septembre ».
2. Le bouton principal orange `#FF9E2D` au milieu de l'email : **« Je prends mon accès à vie à 47 € »**.
3. Le lien brut en clair dans le P.S., pour les boîtes qui bloquent les boutons.

Tous pointent vers `https://ebookstudio.fr/commander?src=perte-1er-octobre-1` (page d'inscription + paiement : l'email est saisi là, puis carte ou PayPal). Le clic est tracké pour exclure automatiquement la personne des relances.

**Relance J+3 :** « Le calcul sur 12 mois » — 47 € une fois contre 204 € par an, plus une démonstration en images du livre produit.
**Relance J+7 :** « Dernier rappel utile » — 3 paragraphes courts, la date, le lien, rien d'autre.

## Lettre 2 — Abonnés V2 (ton différent, pas de vente)

**Objet :** Votre accès V2 est conservé — voici ce qui s'ajoute pour vous
Contenu : leur accès à vie reste acquis, 3 modules V3 offerts (2 livres/mois, 20 chapitres), remise -20 % à vie sur Plume et Édition s'ils veulent tout débloquer. Aucune pression, aucune date couperet.
**Appel à l'action :** bouton **« J'active mes 3 modules V3 offerts »** vers `https://ebookstudio.fr/v3/migration`, plus le lien en clair dans le P.S.
**Relance J+7 uniquement**, vers ceux qui n'ont pas ouvert.

## Détails techniques

- Nouvelle fonction `send-perte-1er-octobre` (segments `subscribers_v2` et `prospects_no_buy`), sur le modèle de `send-closing-47` : modes `status`, `preview`, `test`, `send`, plus `mode: 'relance'` pour les suites automatiques.
- Envoi via Resend avec `sendResendEmailThrottled` (respect du quota) et le garde-fou `EMAIL_SENDING_ENABLED` déjà en place — je vérifie qu'il est bien ouvert avant le premier envoi et je vous le dis.
- Exclusions systématiques : acheteurs, désinscrits, adresses en `suppressed_emails`, contacts inactifs, et anti-doublon par gabarit dans `email_send_log`.
- Relances automatiques : tâche planifiée quotidienne qui envoie J+3 et J+7 en se basant sur `email_send_log` (aucun envoi si clic ou achat entre-temps).
- Nouveau panneau `PerteOctobrePanel.tsx` dans l'admin (compteurs, prévisualisation, test, envoi, interrupteur relances).
- Les liens pointent vers `/commander` pour les prospects et `/v3/migration` pour les V2, avec suivi d'ouverture et de clic existant.

## Ce que je vous dirai après l'implémentation

Le nombre exact de destinataires par segment, et je vous envoie les 2 emails de test dans votre boîte avant tout envoi de masse.
