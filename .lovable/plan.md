# Pourquoi « aucun clic » — et comment obtenir vraiment des abonnés

## Ce que les données disent (vérifié en base à l'instant)

| Mesure (10 derniers jours) | Réalité |
| --- | --- |
| Ouvertures enregistrées | 3 400 ouvertures, ~1 700 personnes différentes |
| Clics enregistrés | 93, dont **0 depuis le 29/08** |
| Emails actuellement dans Systeme.io | `cadeau-1` et `cadeau-2` (744 ouvertures depuis le 31/08) |
| Clics enregistrés sur `cadeau-1` / `cadeau-2` | **0** |
| Visites page /essai (30 j) | 145 → 13 lancements de génération → **5 emails captés** |
| Commandes payées depuis le début | **0** |

Deux conclusions distinctes, ne pas les confondre :

**1. Les clics des emails actuels ne peuvent pas être comptés.**
Les newsletters `news-*` passent par le relais de suivi, mais les emails
`cadeau-1` à `cadeau-5` — ceux que tu as réellement collés dans Systeme.io —
utilisent des liens directs vers `/essai`. Le pixel d'ouverture est là (d'où les
744 ouvertures), pas le suivi de clic. Donc « aucun clic » est en partie un trou
de mesure, pas forcément un désintérêt.

**2. Là où il y a des chiffres, la fuite n'est pas l'email.**
Les emails sont ouverts massivement (bon objet, bonne délivrabilité). C'est
après le clic que tout meurt : 145 visites de `/essai` ne produisent que 5
emails captés, et 0 commande payée n'a jamais existé. Le problème est la page
et l'offre, pas la rédaction des emails.

## Qui fait quoi (pas d'inquiétude : presque tout est pour moi)

**Moi, dans l'app — tu n'as rien à faire :** suivi des clics des 5 emails,
regénération du HTML prêt à coller, tableau de bord unique, refonte de la page
d'essai, parrainage, page publique de démonstration.

**Toi, dans Systeme.io — 10 minutes, une seule fois :** quand je te dis que
c'est prêt, tu ouvres `/admin/sequence-email`, tu copies le HTML des 5 emails
(bouton « Copier le HTML ») et tu le recolles dans tes 5 emails existants à la
place de l'ancien contenu. Les dates et la programmation restent inchangées.
Rien d'autre : pas de DNS, pas de réglage, pas de nouvelle liste.

**Tes listes :** on n'en a pas besoin de nouvelles. Les 2 020 prospects et les
contacts Systeme.io sont déjà en base et déjà synchronisés. Le problème n'est
pas le nombre de contacts, c'est que le clic n'est pas mesuré et que la page
d'arrivée ne convertit pas.

## Le plan


### Étape 1 — Rendre les clics mesurables (sinon on pilote à l'aveugle)
- Passer les 5 emails `cadeau-*` sur le même relais de suivi que les newsletters
  (lien + bouton + second lien), avec le nom du gabarit et la destination.
- Regénérer le HTML copier-coller de `/admin/sequence-email` avec ces liens.
- Ajouter dans le panneau admin une ligne unique et lisible :
  envoyés → ouvreurs → clics par lien → visites `/essai` → emails captés →
  commandes. Une seule vue, la marche qui bloque devient visible.

### Étape 2 — Réparer la page d'essai (c'est là que tu perds tout)
- 145 visites → 13 générations : le premier écran demande trop d'efforts.
  Une seule question visible (« votre idée de livre »), champ pré-rempli
  d'exemples cliquables, bouton unique.
- Le chapitre commence à s'écrire **avant** toute demande d'email ; le mur email
  n'apparaît qu'au moment de récupérer le texte complet.
- Bouton « Recevoir mon chapitre » unique, sans autre lien concurrent sur l'écran.

### Étape 3 — Séparer « avoir des abonnés » de « vendre 47 € »
Aujourd'hui le même email demande à la fois l'inscription et l'achat.
- Emails 1 à 3 : un seul but, l'inscription à l'essai. Aucun prix affiché.
- Emails 4 et 5 : l'offre, réservée à ceux qui ont cliqué ou généré un chapitre.
- Ceux qui ne cliquent jamais après 5 envois sortent de la campagne (protection
  de la délivrabilité).

### Étape 4 — Aller chercher du trafic neuf (la liste actuelle est usée)
La liste a été sollicitée tout le mois d'août sans un seul achat : elle ne
produira pas les abonnés du lancement. Trois sources à brancher, par ordre de
rendement :
- **Page publique « chapitre gratuit »** optimisée pour le partage, avec preuve
  visible (un livre réel du sommaire au fichier Amazon), à diffuser dans les
  groupes Facebook auteurs/KDP.
- **Parrainage** : le kit existe déjà ; l'activer dans l'email de livraison du
  chapitre (1 filleul inscrit = 1 bonus concret).
- **Contenu court** : 1 démonstration filmée de 60 s par semaine (idée → livre
  exporté), publiée avec le lien `/essai` suivi.

### Étape 5 — Décider avant le 1er octobre
Deux vagues de mesure suffisent : si après correction du suivi et de la page
d'essai le taux visite → email capté reste sous 15 %, c'est l'offre qu'il faut
changer (premier mois offert mis en avant plutôt que 47 € à vie), pas les emails.

## Détails techniques

- `src/data/campagneUnique.ts` : remplacer `ctaUrl`/liens texte par des URL
  passant par `track-email-click` (paramètres `t`, `s`, `u`), sur le modèle de
  `trackedCtaUrl` dans `src/data/newslettersSystemeio.ts`.
- `src/pages/admin/AdminSequenceEmailPage.tsx` : génération HTML des 5 emails
  `cadeau-*` avec liens suivis + pixel d'ouverture.
- Panneau unifié dans `NewsletterClicksPanel.tsx` : jointure
  `email_opens` / `email_clicks` / `capture_events` (surface `essai`,
  `commander`) / `funnel_leads` / `funnel_orders`.
- `EssaiPage.tsx` : ordre des étapes inversé (génération avant mur email),
  exemples cliquables, un seul appel à l'action par écran.
- Aucun changement de tarif, aucun envoi de masse depuis l'app (100 % Systeme.io).
