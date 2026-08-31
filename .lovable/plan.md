# Passer les campagnes sur Systeme.io et repasser Resend en gratuit

## Le principe

Deux usages d'email, deux outils :

```text
   CAMPAGNES (marketing, listes)        →  Systeme.io  (47 €/mois déjà payé)
   EMAILS DE L'APP (1 personne, 1 clic) →  Resend plan GRATUIT (3 000/mois)
```

Aujourd'hui 37 fonctions de l'application envoient des emails par Resend :
codes d'accès, confirmations de paiement Stripe/PayPal, essai gratuit,
relances de panier, livraison d'audiobook, invitations bêta. Si Resend
disparaît complètement, ces emails ne partent plus. Le plan gratuit Resend
suffit largement pour ce volume : tu résilies le payant, tu ne casses rien.

## Étape 1 — Retirer complètement l'envoi de campagnes du projet

- Suppression du panneau de diffusion de masse `CampagneDiffusionPanel` et des
  fonctions d'envoi en masse (`send-campagne-unique`, `send-sales-email`,
  `send-closing-47`, la relance automatique planifiée).
- `/admin/campagnes` devient une page **copier-coller** : les 5 emails prêts à
  coller dans Systeme.io, avec bouton « Copier le HTML » et « Copier le texte ».
- Le bouton « M'envoyer un test » est conservé (1 email, Resend gratuit) pour
  vérifier le rendu avant de coller.
- Gestion Prospects garde uniquement la liste des contacts et l'export CSV,
  plus aucun bouton d'envoi.

Résultat : aucun envoi de masse ne peut plus partir depuis l'app, donc plus de
quota Resend dépassé, plus de statistiques faussées.

## Étape 2 — Les 5 emails livrés pour Systeme.io

Dans `public/email-systemeio/` :

| Fichier | Objet | Rôle |
|---|---|---|
| `01-niches.html` | Vos 5 niches sont prêtes | livraison du cadeau |
| `02-preuve.html` | Le livre écrit en 40 minutes | démonstration |
| `03-bonus.html` | Vos bonus vous attendent | valeur + rappel |
| `04-offre.html` | 47 € une fois, à vie | l'offre |
| `05-cloture.html` | Dernier jour | urgence |

Tous les liens pointent vers `https://ebookstudio.fr/...?src=systemeio` pour
que tu voies dans le suivi ce qui vient de Systeme.io.

## Étape 3 — Ce que tu fais dans Systeme.io (procédure exacte)

Un document `docs/systemeio-configuration.md` livré avec le détail, résumé :

1. **Authentifier le domaine** : Systeme.io → Paramètres → Domaines d'envoi →
   ajouter `ebookstudio.fr`. Il te donne un SPF/DKIM. Ton SPF actuel devient
   `v=spf1 include:amazonses.com include:_spf.systeme.io ~all` (un seul
   enregistrement SPF, jamais deux). DKIM en CNAME séparé. Sans ça, tes emails
   partent en spam.
2. **Créer les tags** : `PROSPECT-EBS`, `LEAD-CADEAU`, `CLIENT-47`,
   `DESABONNE`, `ESSAI_EBOOKSTUDIO` (déjà existant).
3. **Importer la liste** : les contacts sont déjà synchronisés par l'app ;
   vérifier le compte et supprimer les doublons dans Systeme.io.
4. **Créer la campagne** (Emails → Campagne « Lancement 47 ») : 5 emails, aux
   jours 0, 1, 2, 4, 6, déclenchée par le tag `LEAD-CADEAU`.
5. **Automation** : formulaire d'inscription `/cadeau` → tag `LEAD-CADEAU` →
   campagne. Règle d'arrêt : si tag `CLIENT-47`, sortir de la campagne (on
   n'envoie plus l'offre à quelqu'un qui a acheté).
6. **Poser le tag `CLIENT-47` à l'achat** : l'app le fera automatiquement après
   un paiement validé (voir détails techniques).

## Étape 4 — Resend

- Tu passes l'abonnement Resend en **plan gratuit** (aucune clé à changer,
  `RESEND_API_KEY` reste valable).
- L'app n'envoie plus que des emails individuels : très loin des 3 000/mois
  gratuits.
- Le webhook Resend reste branché pour les rebonds des emails de l'app.

## Détails techniques

- Fichiers supprimés : `src/components/admin/CampagneDiffusionPanel.tsx`,
  fonctions edge `send-campagne-unique`, `send-sales-email`, `send-closing-47`,
  et le cron de relance associé.
- `src/pages/admin/AdminSequenceEmailPage.tsx` : passage en mode copier-coller
  (HTML + texte par email), conservation de `send-campaign-test`.
- Nouveau helper : dans `payments-webhook` / `stripe-webhook`, appel de
  `pushToSystemeIo` avec le tag `CLIENT-47` après paiement confirmé, pour la
  règle de sortie de campagne.
- `src/data/campagneUnique.ts` reste la source unique du texte des 5 emails ;
  les fichiers HTML Systeme.io sont générés depuis ce même contenu.
- Aucun changement de tarif ni de tunnel : offre 47 € à vie, `/commander`
  inchangé (Stripe + PayPal).
- Mémoire projet mise à jour : Systeme.io = campagnes, Resend = emails de
  l'app uniquement (plan gratuit).

## Ordre d'exécution

1. Nettoyage des envois de masse dans l'app.
2. Génération des 5 fichiers HTML + texte Systeme.io.
3. Rédaction du guide de configuration Systeme.io.
4. Tag `CLIENT-47` automatique à l'achat.
5. Tu configures Systeme.io avec le guide, puis tu résilies le payant Resend.
