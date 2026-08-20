# Lancement V3 — « 1er chapitre gratuit » (en ligne le 1er septembre, ouverture le 1er octobre)

Tarifs de référence, uniques et définitifs dans tout ce projet : **Plume 27 €/mois (270 €/an)**, **Édition 47 €/mois (470 €/an)**, **Studio Pro 97 €/mois (970 €/an)**. Aucun autre prix (17 €, 13,60 €, 21,60 €, 59 €, 197 €, 547 €) ne doit apparaître dans les nouvelles pages et emails du lancement.

## L'idée

Le visiteur écrit son **premier chapitre gratuitement**, sans payer. À la fin du chapitre, il ne peut aller plus loin qu'en créant un compte et en choisissant un forfait — avec **le premier mois offert**. Son accès complet s'ouvre le **1er octobre 2026** : entre-temps il attend dans une salle d'attente qui lui donne déjà de la valeur.

```text
Email / pub / blog
        │
        ▼
  /essai  ── 3 questions (idée, public, ton)
        │
        ▼
  Chapitre 1 écrit en direct (~1 500 mots) + sommaire proposé
        │
        ├─ « Télécharger mon chapitre »  → email demandé → PDF + séquence email
        │
        ▼
  Mur de conversion : « Chapitre 2 à 40 → il faut un compte »
        │
        ▼
  /essai/inscription : compte + forfait (27 / 47 / 97) — 1er mois offert
        │                        1er prélèvement le 1er novembre
        ▼
  /v3/attente : compte à rebours 1er octobre + cadeaux + rang d'inscription
        │
        ▼
  1er octobre : V3_LAUNCH_UNLOCKED = true → accès complet
```

## Ce qui sera construit

### 1. Page d'essai gratuit `/essai`
- Formulaire ultra-court : l'idée du livre (seul champ obligatoire), public visé, ton.
- Génération en direct du **chapitre 1** (1 200-1 800 mots) + proposition de titre, sous-titre et sommaire complet, réutilisant le moteur de rédaction existant.
- Aperçu paginé façon livre (même rendu que l'aperçu V3 actuel).
- 1 essai par visiteur et par jour, contrôlé côté serveur (email + empreinte IP) pour éviter le pillage de crédits.

### 2. Récupération du chapitre
- Bouton « Recevoir mon chapitre en PDF » : email obligatoire à cette étape seulement, enregistré comme prospect.
- Envoi automatique du chapitre + lien de reprise (le brouillon est conservé et rattaché au compte à la première connexion).

### 3. Mur de conversion + inscription
- Après le chapitre : les chapitres suivants, la couverture, la correction, l'export KDP sont montrés verrouillés.
- Page `/essai/inscription` : création de compte, choix du forfait (27 / 47 / 97, mensuel ou annuel), **premier mois offert** (carte enregistrée, premier prélèvement le 1er novembre 2026), résiliable en un clic pendant le mois offert.
- Paiement via le tunnel Stripe abonnement déjà en place (`v3-subscription-checkout`), période d'essai côté Stripe.

### 4. Salle d'attente `/v3/attente` (pour les inscrits avant le 1er octobre)
- Compte à rebours jusqu'au 1er octobre 8 h.
- Rang d'inscription (« vous êtes le 42ᵉ membre fondateur »).
- Les 3 cadeaux déjà écrits (10 niches, kit de démarrage, checklist J-7) accessibles immédiatement.
- Leur chapitre 1 d'essai, conservé et prêt à être repris le jour de l'ouverture.
- Aucun accès aux outils tant que le drapeau de lancement est fermé : les admins gardent l'accès complet.

### 5. Emails du lancement (5 messages)
1. J+0 — votre chapitre est prêt (livraison du PDF).
2. J+1 — ce que devient ce chapitre dans un livre complet.
3. J+3 — le premier mois est offert, la facturation ne démarre qu'en novembre.
4. J+6 — les 3 cadeaux + le rang de membre fondateur.
5. J+9 — dernier rappel avant fermeture de l'offre « premier mois offert » (30 septembre).

### 6. Nettoyage des anciens prix
- Les bandeaux et pages qui affichent encore 47 € à vie, 59 €, 67 €, 197 € ou 547 € sont retirés ou réécrits sur les trois forfaits 27 / 47 / 97.
- Le bandeau global devient : « Écrivez votre premier chapitre gratuitement — ouverture le 1er octobre ».

### 7. Pilotage depuis votre compte admin
Nouvel onglet **« Lancement 1er septembre »** dans le tableau de bord admin, réservé aux administrateurs (rôle vérifié côté serveur) :
- **Chiffres du jour** : essais lancés, chapitres livrés, emails captés, inscriptions, taux de conversion essai → abonné, répartition Plume / Édition / Studio Pro.
- **Liste des essais** : idée du livre, email, date, chapitre consultable en un clic, statut (livré, converti, abandonné), export CSV.
- **Liste d'attente** : membres inscrits, forfait choisi, rang, date de fin du mois offert, relance individuelle possible.
- **Emails** : les 5 messages de la séquence avec statut par destinataire (envoyé, en attente, erreur), envoi manuel d'une vague et test sur votre adresse.
- **Interrupteurs** : ouvrir / fermer l'essai gratuit, ouvrir la V3 (bascule du 1er octobre), fermer l'offre « premier mois offert » — sans republier le site.
- **Contrôle qualité** : un bloc qui vérifie automatiquement qu'aucun ancien prix (59, 67, 197, 547 €) ne subsiste dans les pages du tunnel, et que les prix Stripe 27 / 47 / 97 sont bien en place.


## Détails techniques

- Nouvelle table `trial_chapters` : email, idée, chapitre généré, sommaire, IP, date, `converted_user_id`. RLS : lecture par le propriétaire une fois lié, écriture via edge function ; GRANT explicites.
- Nouvelle edge function `trial-chapter` : anti-abus (1 essai / email / 24 h), génération via la passerelle IA, stockage du résultat, envoi du PDF.
- `v3-subscription-checkout` complété avec une période d'essai (`trial_end` = 1er novembre 2026) et le forfait choisi.
- `src/config/v3Launch.ts` : ajout de `/essai`, `/essai/inscription` et `/v3/attente` aux routes accessibles avant l'ouverture ; `V3ContemplationMode` ne bloque plus ces routes.
- Un seul fichier de vérité pour les prix : `src/data/v3Pricing.ts` (27 / 47 / 97). Les nouvelles pages et emails lisent ces valeurs, jamais des montants écrits en dur.
- Mémoire projet mise à jour : les tarifs 17 €/27 € et l'offre à vie 47 € sont marqués obsolètes.

## Calendrier

- **Semaine du 24 août** : essai gratuit, mur de conversion, inscription avec premier mois offert.
- **28-31 août** : salle d'attente, cadeaux, nettoyage des anciens prix, tests de bout en bout.
- **1er septembre** : mise en ligne et départ des emails.
- **1er octobre** : bascule du drapeau de lancement, ouverture complète.
