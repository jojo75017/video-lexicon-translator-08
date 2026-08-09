# Sommaire stylé à l'export + réparation de la campagne 47 €

Deux chantiers dans le même passage : d'abord le diagnostic de la campagne (urgent, argent en jeu), puis le sommaire « motif discret » à l'export Word/PDF.

## 1. Ce que montrent réellement les chiffres de la campagne

Vérifié dans la base et sur les liens :

- Les envois ont bien fonctionné : **étape 1 = 650 emails** (5 août), **étape 2 = 643 emails** (7 août). Aucune erreur d'envoi.
- Les ouvertures sont bonnes : **229 personnes** ont ouvert l'étape 1, **111** l'étape 2 (dernière ouverture aujourd'hui).
- Les clics sont quasi nuls : **4 personnes** seulement sur l'étape 1, **0 sur l'étape 2**.
- **La séquence est arrêtée** : les étapes 3, 4 et 5 existent dans le code mais n'ont jamais été envoyées. Aucune tâche planifiée n'existe côté base (`cron.job` est vide), donc rien ne part tout seul : il faut un déclenchement.
- Les liens eux-mêmes fonctionnent techniquement : la page de commande répond, et le lien de suivi redirige bien vers `ebookstudio.fr/commander`.

Conclusion : le problème n'est pas l'envoi ni la page, c'est **(a)** la séquence qui s'est arrêtée à l'étape 2, et **(b)** le lien du bouton qui part vers un domaine technique (`…supabase.co/functions/v1/track-email-click?…`) au lieu de `ebookstudio.fr` — c'est le type d'URL que les messageries et antivirus signalent ou neutralisent, ce qui décourage le clic et fait perdre des clics dans les statistiques.

## 2. Réparations campagne

1. **Lien de clic sur ton propre domaine.** Nouvelle route publique `/r` sur `ebookstudio.fr` qui enregistre le clic puis redirige vers `/commander`. Le bouton des emails devient `https://ebookstudio.fr/r?...` : lien propre, rassurant, cliquable partout.
2. **Repli sans suivi.** Si l'enregistrement du clic échoue, la redirection vers `/commander` se fait quand même — on ne perd jamais un acheteur pour un souci de statistique.
3. **Relance de la séquence.** Bouton admin pour envoyer l'**étape 3** aux contacts ayant déjà reçu les étapes 1 et 2, puis étapes 4 et 5 à 2-3 jours d'intervalle, avec aperçu avant envoi et envoi test sur ta propre adresse.
4. **Relance ciblée des ouvreurs non-cliqueurs** (les ~230 personnes qui ouvrent mais ne cliquent pas) : même offre, objet différent, un seul bouton, message court.
5. **Tableau de suivi** dans l'espace admin : envoyés / ouvertures uniques / clics uniques par étape, pour voir immédiatement si le nouveau lien débloque les clics.

## 3. Sommaire « motif discret » à l'export

Style retenu : fond crème `#F5F1EA`, texte `#3A3A3A`, filets et numéros `#8C6A3F`, séparateurs `#D9C7A7`.

- Page de sommaire dédiée : titre « Table des matières » en petites capitales espacées, filet fin doré au-dessus et en dessous.
- Chaque chapitre : numéro en doré, titre en gris anthracite, ligne de points de conduite discrète jusqu'au bord, fin séparateur crème entre les entrées.
- Sous-chapitres en retrait, plus petits, sans points de conduite.
- Préface / Conclusion / Personnages traités comme des entrées à part, sans numéro.
- Le style s'applique à l'export Word **et** PDF, avec les mêmes règles de nettoyage des titres déjà en place (pas de titres génériques, pas de résidus JSON).
- Une option d'export « Sommaire stylé » (activée par défaut) permet de revenir au sommaire sobre actuel.

## Détails techniques

- `supabase/functions/send-sales-email/index.ts` : `trackedLink()` pointe vers `https://ebookstudio.fr/r?e=…&s=…&t=…` ; ajout d'un mode d'envoi de l'étape 3 et d'un mode « ouvreurs non-cliqueurs » (exclusion des désinscrits et des doublons via `email_send_log`).
- Nouvelle page `src/pages/RedirectClickPage.tsx` + route `/r` : insertion dans `email_clicks` via la fonction existante `track-email-click` (appel non bloquant), puis `window.location.replace` vers `/commander?src=…`.
- `src/utils/docxExportEngine.ts` : bloc « TABLE DES MATIÈRES » remplacé par un rendu stylé (tabulation à droite avec points de conduite, bordures de paragraphe pour les filets, couleurs de la palette) ; nouvelle option `styledToc` dans `src/lib/ebookExportOptions.ts`.
- Export PDF : même palette et même structure appliquées au générateur PDF utilisé par l'aperçu avant téléchargement.
- Aucun changement de tarif, de contenu d'offre ni de schéma de base de données.
