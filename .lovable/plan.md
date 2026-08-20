# Obtenir des clics et des abonnés : stratégie complète (au-delà du bloc de preuve)

Non, le bloc de preuve seul ne suffira pas. Les chiffres relevés en base disent
précisément où ça casse, et ce n'est pas la preuve sociale en premier.

## Ce que disent les données (5 derniers jours)

| Étape du tunnel | Réalité mesurée |
| --- | --- |
| Emails envoyés | 623 destinataires uniques |
| Ouvertures | 174 personnes (~28 %) — **correct** |
| Clics enregistrés | **1 personne** |
| Commandes créées | 1, jamais payée |
| Commandes payées | **0** |
| Encarts du site | 142 affichages, **0 clic** |

Diagnostic : l'email arrive et se fait lire. Personne ne clique. Deux raisons,
dans cet ordre :

1. **On demande de l'argent au premier clic.** Le bouton propose « payer 47 € »
   à des gens qui n'ont jamais vu l'outil fonctionner. C'est le pas le plus dur
   du tunnel, placé en premier.
2. **Une partie des clics n'est même pas comptée.** Seul le bouton principal
   passe par le relais de suivi ; le bouton audio et le lien MP3 pointent en
   direct. On pilote à l'aveugle sur les liens les plus attirants.

## La stratégie : déplacer le premier clic vers quelque chose de gratuit

On arrête de vendre au premier clic. On offre **le premier chapitre de leur
livre, écrit gratuitement, sans inscription et sans carte**. C'est le seul appel
à l'action qui a une chance d'être cliqué par quelqu'un qui hésite depuis un mois.

Le chemin devient : *email → une idée de livre saisie → chapitre écrit sous leurs
yeux → « la suite du livre, c'est ici »*. La vente arrive après la preuve, pas
avant.

### 1. Tout mesurer (d'abord, aucun envoi)
- Tous les liens des emails passent par le relais de suivi, pas seulement le bouton.
- Suivi sur la page de commande : arrivée sur la page, puis clic sur le bouton de
  paiement (carte et PayPal séparément).
- Un seul écran admin : envoyés → ouvreurs → clics par lien → visites page →
  clics paiement → payés. On voit enfin la marche qui bloque.

### 2. Réécrire l'email autour du cadeau
- Un seul objectif, un seul lien, répété deux fois (3 premières lignes + bas).
- 120 mots maximum, lisible sur mobile sans faire défiler.
- Objet centré sur le résultat, pas sur l'offre ni la date limite :
  « Votre premier chapitre, écrit ce soir » plutôt que « l'offre se termine ».
- Plus de concurrence audio + MP3 + offre dans le même message.

### 3. Segmenter (les 3 messages type GetResponse)
- **Non-ouvreurs (≈449)** : même cadeau, autre objet, renvoi 48 h plus tard.
- **Ouvreurs sans clic (≈173)** : la preuve — un livre réel, du sommaire au
  fichier Amazon, et le chapitre offert.
- **Cliqueurs** : message personnel court avec une question directe.

### 4. Rendre la page de commande décidable
- Réassurance remontée au-dessus du bouton : PayPal, 2×/3×, ce qui est livré
  immédiatement, ce qui se passe le 1er octobre.
- Relance automatique de toute commande restée en attente plus de 2 h.

### 5. Preuve d'usage (le bloc validé précédemment)
- Bloc factuel « Ils écrivent en ce moment avec EbookStudio » : Rachel D.,
  Patrick L., Stéphane M., Claude René B. — version utilisée et étape en cours,
  aucune citation inventée.
- Les vrais témoignages viendront à la rentrée et s'afficheront automatiquement
  en dessous, sans nouvelle intervention.

### 6. Ce qui se joue au 1er septembre
- Le vrai gisement d'abonnés est le lancement V3 avec **premier mois offert**.
  Toute cette séquence sert à constituer la liste de gens qui ont *vu* l'outil
  écrire, pour qu'ils s'inscrivent le 1er septembre — pas à arracher des 47 €
  à froid en dix jours.

## Ordre d'exécution proposé

1. Mesure complète + bloc de preuve (aucun envoi) — immédiat.
2. Réécriture de l'email cadeau + test sur ton adresse.
3. Envoi segmenté, par vagues, avec relevé des clics réels après chaque vague.
4. Page de commande + relance des paniers en attente.

## Détails techniques

- Suivi des liens : router audio, MP3 et liens texte via `/r`
  (`src/pages/RedirectClickPage.tsx`) avec `t` = nom du gabarit, dans
  `supabase/functions/send-sales-email/index.ts` (`mediaBlock`, `ctaButton`,
  corps des 5 étapes).
- Événements page : `capture_events`, `surface = 'commander'`, `event_type`
  `page_view` / `checkout_click_card` / `checkout_click_paypal`, posés dans
  `src/pages/v3public/V3CommanderPage.tsx`.
- Tableau de bord : `CampaignSequencePanel.tsx` étendu (clics par lien + ligne
  visites → clics paiement → payés).
- Cadeau : le lien principal des emails pointe vers `/essai` (chapitre gratuit)
  au lieu de `/commander` ; la vente reste en second lien en bas de page `/essai`.
- Segments : modes `resend_non_openers` et `resend_clickers` dans
  `send-sales-email`, calculés depuis `email_send_log`, `email_opens`,
  `email_clicks`, anti-doublon par gabarit.
- Relance panier : `funnel_orders` (`status = 'pending'`, `created_at < now() - 2h`),
  marquage dans `metadata`.
- Preuve d'usage : `src/components/sales/ActiveUsersPanel.tsx`, données statiques,
  masquage auto si un témoignage `approved = true` existe pour la personne.
- Aucun changement de tarif (47 € jusqu'au 31/08/2026, V3 le 1er octobre),
  aucun envoi de masse sans ton feu vert.
