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

**Toi, dans Systeme.io — 10 minutes, une seule fois :** tu travailles en texte,
pas en HTML, donc je te livre pour chaque email : le texte à coller tel quel,
le libellé du bouton, et le lien court à coller dans le champ « URL » du bouton
Systeme.io. Trois copier-coller par email, rien d'autre : pas de HTML, pas de
DNS, pas de nouvelle liste. Les dates et la programmation restent inchangées.


**Tes listes :** on n'en a pas besoin de nouvelles. Les 2 020 prospects et les
contacts Systeme.io sont déjà en base et déjà synchronisés. Le problème n'est
pas le nombre de contacts, c'est que le clic n'est pas mesuré et que la page
d'arrivée ne convertit pas.

## Le plan


### Étape 1 — Emails en texte simple, avec un lien court et propre

Systeme.io s'écrit en texte, pas en HTML : on abandonne donc le HTML et on
livre du texte prêt à coller. Et tu as raison, une URL technique interminable
fait fuir : le suivi ne doit jamais se voir.

- **Liens courts maison** : chaque lien devient `https://ebookstudio.fr/r/essai1`
  (la page relais `/r` existe déjà). Ton domaine, quelques caractères, rien de
  technique. Le relais enregistre le clic puis renvoie vers `/essai`
  instantanément.
- **Le texte de l'email** ne contient qu'une seule ligne de lien, en bas :
  `>> Écrire mon chapitre 1 gratuitement : https://ebookstudio.fr/r/essai1`.
- **Le bouton** est celui de Systeme.io : tu tapes le libellé fourni et tu
  colles le même lien court dans son champ URL. Le lecteur ne voit que le texte
  du bouton.
- `/admin/sequence-email` devient une page « texte » : pour chaque email, objet,
  texte à coller, libellé du bouton, lien court — chacun avec son bouton
  « Copier ».
- Ajouter dans le panneau admin une ligne unique et lisible :
  envoyés → ouvreurs → clics par lien → visites `/essai` → emails captés →
  commandes. Une seule vue, la marche qui bloque devient visible.
- Note : sans HTML, le pixel d'ouverture disparaît. Les ouvertures seront
  celles de Systeme.io ; nous, on mesure ce qui compte vraiment — les clics et
  ce qui suit.



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

- `src/data/campagneUnique.ts` : liens courts `https://ebookstudio.fr/r/<clé>`
  (table de correspondance clé → destination + gabarit) au lieu de l'URL de
  fonction visible. `src/pages/RedirectClickPage.tsx` gère déjà `/r` : il
  enregistre le clic via `track-email-click` puis redirige.
- `src/pages/admin/AdminSequenceEmailPage.tsx` : génération HTML des 5 emails
  `cadeau-*` avec bouton texte seul (aucune URL affichée) + pixel d'ouverture ;
  version texte avec le lien court uniquement.

- Panneau unifié dans `NewsletterClicksPanel.tsx` : jointure
  `email_opens` / `email_clicks` / `capture_events` (surface `essai`,
  `commander`) / `funnel_leads` / `funnel_orders`.
- `EssaiPage.tsx` : ordre des étapes inversé (génération avant mur email),
  exemples cliquables, un seul appel à l'action par écran.
- Aucun changement de tarif, aucun envoi de masse depuis l'app (100 % Systeme.io).
