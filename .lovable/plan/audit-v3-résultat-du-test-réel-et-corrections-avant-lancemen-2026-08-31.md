# Audit V3 — résultat du test réel et corrections avant lancement

## Ce que le test automatisé a réellement trouvé

J'ai ouvert une à une les 58 pages `/v3/*` dans un vrai navigateur, connecté avec un compte admin.

Bonne nouvelle : **aucune page blanche, aucune 404, aucun plantage.** Les 242 routes
déclarées répondent, le Hub V3 se charge (98 outils, 8 piliers), le tunnel `/commander`
affiche bien le paiement unique 47 €.

Trois vrais problèmes sont ressortis :

1. **Anciens tarifs encore affichés à plusieurs endroits** (constaté dans le code) :
   - `/v3/nouveautes` : badges et sections « Plume 17€ » au lieu de 27 €, et le palier
     supérieur à 27 € au lieu de 47 €.
   - `/v3/outils/editeur` : badge « NEW · Débutant 9,99€ ».
   - `/v3/script-heygen` : script vidéo qui annonce 9,99 € / 12,99 € / 59 € par mois.
   - `/vente-v3` et `/commande` : anciennes offres 197 € et 547 € toujours en ligne,
     alors que l'offre unique est 47 € à vie jusqu'au 30/09/2026.
2. **Une page « Nouveautés » qui n'est pas la source de vérité.** Les mentions « NEW »
   sont écrites à la main dans le menu, la sidebar et les pages : elles ne peuvent pas
   rester justes dans le temps et l'abonné ne sait pas ce qui vient d'arriver.
3. **Un défaut d'affichage** sur `/v3/nouveautes` (un badge placé dans un paragraphe)
   qui génère un avertissement de rendu.

## Ce qu'on corrige

### 1. Un seul tarif partout
- `/v3/nouveautes` : Plume 27 €/mois, Édition 47 €/mois.
- `/v3/outils/editeur` : badge sans tarif obsolète.
- `/v3/script-heygen` : script réécrit sur l'offre réelle (47 € à vie jusqu'au 30/09,
  puis Plume 27 € / Édition 47 € par mois).
- `/vente-v3` et `/commande` : ces deux anciennes pages de vente sont redirigées vers
  `/commander`. Une seule page de vente, un seul prix, plus de contradiction possible.

### 2. Les nouveautés deviennent automatiques
- Un fichier unique liste chaque nouveauté : titre, courte phrase, lien, date d'arrivée,
  forfait concerné.
- Toute nouveauté datée de moins de 30 jours affiche automatiquement son badge
  « NOUVEAU » dans le menu et la sidebar, et disparaît ensuite toute seule.
- `/v3/nouveautes` est reconstruite depuis cette liste, groupée par mois, la plus
  récente en haut, avec un bouton direct vers l'outil concerné.
- La sidebar affiche un compteur des nouveautés non vues (remis à zéro à la visite),
  pour que l'abonné retrouve immédiatement ce qui vient de sortir.

### 3. Le défaut d'affichage
- Le badge de `/v3/nouveautes` sort du paragraphe : plus d'avertissement de rendu.

## Ce qu'on ne touche pas
Aucune modification des paiements Stripe/PayPal, des droits d'accès, du workflow des
agents ni des modules de génération. Uniquement l'affichage des tarifs, les redirections
des deux anciennes pages de vente, et le système de nouveautés.

## Détails techniques
- Nouveau `src/data/v3Nouveautes.ts` : type `V3Nouveaute` (`id`, `title`, `desc`,
  `to`, `date`, `tier`), helper `isRecent(date, days = 30)` et `countUnseen()` basé sur
  un horodatage en `localStorage` (`v3_nouveautes_seen_at`).
- `src/pages/v3public/V3NouveautesPage.tsx` : rendu depuis `v3Nouveautes.ts`,
  `ACCESS_META` aligné sur `src/data/v3Pricing.ts`, badge sorti du `<p>`.
- `src/data/v3HeaderMenu.ts` + `src/components/v3public/V3Sidebar.tsx` : badge `NOUVEAU`
  et compteur dérivés de `v3Nouveautes.ts` au lieu de valeurs écrites en dur.
- `src/App.tsx` : `/vente-v3` et `/commande` → `<Navigate to="/commander" replace />` ;
  suppression des imports `SalesPageV3Launch` et `V3CommandePage` devenus inutilisés.
- `V3EditorPage.tsx`, `V3ScriptHeygenPage.tsx` : textes tarifaires corrigés.

## Vérification
Nouveau passage navigateur sur les pages modifiées : aucun tarif obsolète détecté par
recherche automatique (`9,99`, `12,99`, `17 €`, `59 €`, `197`, `547`), `/vente-v3` et
`/commande` arrivent sur `/commander`, `/v3/nouveautes` sans avertissement de rendu et
badges cohérents avec le menu.
