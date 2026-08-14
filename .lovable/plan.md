# Paramétrage LearnyBox (emails) — plan complet, sans code

Objectif : configurer votre compte LearnyBox gratuit pour envoyer vos emails (offre 47 € accès à vie jusqu'au 30/09/2026, cadeau « 10 niches ») sans toucher au code de l'app et sans consommer de crédits de build.

## Étape 1 — Réglages de base du compte (15 min)
1. Réglages > Mon compte : nom d'expéditeur `Georges — Ebookstudio`, email de réponse `boubetgeorges@gmail.com`.
2. Renseignez l'adresse postale / mentions légales (obligatoire anti-spam, sinon vos emails partent en indésirables).
3. Fuseau horaire : Europe/Paris. Langue : français.

## Étape 2 — Domaine d'envoi (le point critique)
- Domaine visible : `ebookstudio.fr`.
- Attention : le sous-domaine `notify.ebookstudio.fr` est déjà délégué à Lovable pour les emails de l'app (mots de passe, confirmations, emails de bienvenue). **Ne pas le réutiliser dans LearnyBox.**
- Choisissez donc pour LearnyBox un sous-domaine distinct, par exemple `mail.ebookstudio.fr` ou `news.ebookstudio.fr`.
- Ajoutez chez votre registrar exactement les enregistrements SPF/DKIM (et DMARC si proposé) affichés par LearnyBox pour ce sous-domaine. Rien d'autre.
- Vérifiez le statut « domaine authentifié » dans LearnyBox avant le premier envoi.

## Étape 3 — Listes et segments
Créez 4 listes/tags :
1. `prospects-froids` (imports, anciens leads)
2. `leads-10-niches` (cadeau demandé, pas encore acheté)
3. `clients-47` (accès à vie payé)
4. `anciens-v2` (migration V3, remise -20 %)

Règle : un email de vente ne part jamais vers `clients-47`.

## Étape 4 — Formulaire de capture
1. Créez un formulaire « 10 niches offertes » (champs : prénom + email seulement).
2. Tag automatique à l'inscription : `leads-10-niches`.
3. Page de remerciement : votre page cadeau existante `/10-niches-offertes`.
4. Récupérez le code d'intégration LearnyBox : vous pourrez me le donner plus tard si vous voulez l'insérer dans l'app (ça, oui, demandera une petite intervention).

## Étape 5 — Séquence automatique « 10 niches » (5 emails)
| Jour | Sujet | But |
|---|---|---|
| J+0 | Vos 10 niches sont prêtes | Livrer le cadeau, poser votre nom |
| J+1 | Le problème n°1 des débutants KDP | Éduquer, montrer l'écart outils vs publication |
| J+3 | Avant / après : 6 livrables en un seul agent | Preuve produit |
| J+5 | Pourquoi 47 € une seule fois (et pas 27 €/mois) | Offre + urgence 30/09/2026 |
| J+7 | Dernier rappel avant fermeture | Rareté + CTA unique |

Règles à appliquer dans chaque email : 1 seul CTA, texte 100 % français, lien de désinscription (auto LearnyBox), signature avec `boubetgeorges@gmail.com`.

## Étape 6 — Emails transactionnels : ne pas doublonner
Les emails de bienvenue avec identifiants, réinitialisation de mot de passe et confirmations restent envoyés par l'app (déjà en place). LearnyBox ne sert qu'au marketing/nurture. Sinon vos abonnés reçoivent deux fois le même message.

## Étape 7 — Broadcast immédiat (avant la coupure)
1. Créez une campagne unique vers `prospects-froids` + `leads-10-niches`.
2. Collez le HTML de vente 47 € déjà rédigé (offre, cadeau 10 niches, 6 livrables, CTA `/commander`, contact).
3. Test d'envoi vers votre propre adresse (Gmail + un autre fournisseur) avant diffusion.

## Étape 8 — Chauffage et délivrabilité
- Jour 1 : 50 envois. Jour 2 : 100. Jour 3 : 200. Puis doublez tous les 2 jours.
- Nettoyez les adresses en erreur après chaque envoi.
- Surveillez : ouvertures > 25 %, plaintes < 0,1 %.

## Étape 9 — Suivi des ventes
Ajoutez `?src=learnybox` à vos liens `/commander` pour distinguer les ventes venant de LearnyBox dans vos statistiques.

## Ce que je fais côté app (uniquement si vous le demandez)
- Insérer le formulaire LearnyBox sur la page cadeau.
- Ajouter LearnyBox dans le module « Intégrations » des abonnés, à côté de Brevo / Système.io / GetResponse.

Les étapes 1 à 9 se font entièrement dans l'interface LearnyBox : zéro crédit consommé.
