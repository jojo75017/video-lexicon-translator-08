# Remise à zéro des campagnes + tunnel « 5 niches → inscription → bonus »

## Ce qui ne va pas aujourd'hui

Il existe quatre jeux de campagnes qui se chevauchent (`salesEmailCampaign`, `canonicalEmailCampaign`, `brevoOnboardingEmails`, `systemeioSequences`), plusieurs pages admin d'envoi, et un cadeau à 10 niches dont les bonus ne sont livrés qu'après achat. Résultat : personne ne sait quelle campagne est active, et le prospect n'a aucune récompense immédiate.

## Le nouveau parcours (un seul chemin)

```text
   EMAIL (Systeme.io)                PAGE CADEAU /cadeau
   1 seule séquence  ───────────►    5 niches Amazon visibles
   5 emails, 1 tag                   (aperçu réel, pas de mystère)
                                              │
                                              ▼
                                     FORMULAIRE UNIQUE
                                     email + prénom
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                    Les 5 niches (PDF)            Les BONUS débloqués
                    envoyées par email            tout de suite → /bonus
                              └───────────────┬───────────────┘
                                              ▼
                                     SUITE DE LA SÉQUENCE
                                     (5 emails automatiques)
                                              │
                                              ▼
                                  /commander — 47 € à vie
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                      Carte bancaire                   Bouton PayPal
                       (Stripe)                        (bien visible)
```

## 1. Tout virer

- Suppression des trois campagnes obsolètes : `salesEmailCampaign.ts`, `canonicalEmailCampaign.ts`, `brevoOnboardingEmails.ts`.
- Un seul fichier de vérité : `src/data/campagneUnique.ts` (remplace `systemeioSequences.ts`).
- Une seule page admin : `/admin/campagnes` (l'actuelle page séquence est réécrite, les autres panneaux d'envoi renvoient vers elle). Aucun autre endroit ne propose d'envoyer une campagne.
- Les anciens templates HTML dans `public/email-templates/` sont retirés du build.

## 2. La nouvelle séquence (style Systeme.io, prête à copier)

5 emails, un seul tag `PROSPECT-EBS`, déclenchés à l'inscription :

| # | Délai | Sujet | But |
|---|-------|-------|-----|
| 1 | immédiat | Vos 5 niches + vos bonus sont ouverts | livrer, créer la confiance |
| 2 | J+1 | La niche que 9 auteurs sur 10 ignorent | preuve, usage du cadeau |
| 3 | J+3 | De l'idée au livre publié en une soirée | démonstration produit |
| 4 | J+5 | 47 € une fois, puis c'est un abonnement | l'offre + échéance 30 septembre |
| 5 | J+7 | Dernier rappel avant la fermeture | urgence, dernier lien |

Chaque email : un seul lien, un seul bouton, ton direct, en français. Copier-coller depuis `/admin/campagnes` (bouton « Copier » par email, objet + corps).

## 3. Le cadeau : 5 niches, pas 10

- Nouveau pack `nichesPack5` extrait des 600 niches réelles (5 catégories les plus vendeuses, meilleure demande / concurrence la plus faible). Aucune donnée inventée.
- La page `/cadeau` est réécrite : les 5 niches sont montrées en clair (titre, demande, concurrence) puis le formulaire d'inscription juste en dessous.
- L'ancienne page `/10-niches-offertes` redirige vers `/cadeau` (aucun lien mort).

## 4. Bonus livrés au moment de l'inscription

Changement de règle assumé : les bonus ne sont plus réservés à l'achat, ils sont la récompense de l'inscription.

- À la validation du formulaire : le prospect est enregistré, les 5 niches partent par email, et `/bonus` s'ouvre immédiatement, déverrouillé pour cet email.
- `/bonus` reconnaît l'email inscrit (jeton local + vérification côté serveur) et affiche les bonus téléchargeables ; l'accès complet à l'atelier reste réservé aux acheteurs.
- Les liens de bonus cassés sont revérifiés un par un.

## 5. Le bouton PayPal sur /commander

- Deux boutons côte à côte sous le prix : **Payer par carte — 47 €** et **Payer avec PayPal**, aux couleurs PayPal, avec le logo.
- Les deux ouvrent le même paiement sécurisé (PayPal est déjà activé côté serveur) ; le bouton PayPal affiche directement le choix PayPal.
- L'e-mail saisi est conservé dans les deux cas, c'est lui qui ouvre l'accès.

## Détails techniques

- Fichiers supprimés : `src/data/salesEmailCampaign.ts`, `src/data/canonicalEmailCampaign.ts`, `src/data/brevoOnboardingEmails.ts`, `src/data/systemeioSequences.ts`. Les consommateurs (`BonusPage.tsx`, `AdminSequenceEmailPage.tsx`, `ProspectManagerPage.tsx`, `CampaignPerformanceDashboard.tsx`, `TemplatePerformancePanel.tsx`) sont repointés vers `src/data/campagneUnique.ts`.
- Nouveau `src/lib/nichesPack5.ts` (dérivé déterministe de `niches600`) ; `src/lib/niches10Pack.ts` conservé uniquement pour la redirection.
- `funnel-capture-lead` : ajout du `lead_magnet: 'niches5_bonus'`, tag `PROSPECT-EBS`, et déblocage bonus (colonne `bonus_unlocked_at`) — migration avec GRANT + RLS.
- `/commander` : second bouton appelant `v3-pack-checkout` avec `preferred_method: 'paypal'` (Stripe Checkout, PayPal déjà forcé dans la fonction), Stripe embedded conservé.
- Mémoires à mettre à jour : la règle « bonus uniquement après achat » est remplacée ; le cadeau passe de 10 à 5 niches.
