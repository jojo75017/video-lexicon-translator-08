# Pack « 10 niches offertes » — déclencheur d'achat

## Pourquoi ça ne convertit pas aujourd'hui (constaté dans le code)

- Le seul cadeau existant (`Guide10NichesBlock`) envoie vers un **site externe** (`trafic-affiliation.com`). Le visiteur quitte Ebookstudio et ne revient pas sur la page de vente.
- Le bloc de capture générique (`InlineLeadCapture`) promet « 5 niches » et livre **par email** : le visiteur attend, se refroidit, et rien ne le ramène à l'achat.
- La page `/niches-600` contient déjà **600 niches réelles** (`src/data/niches600.ts` : mot-clé Amazon, BSR cible, concurrence, potentiel, prix). Cette valeur n'est jamais utilisée comme appât.

Conclusion : le cadeau existe, mais il ne crée ni gratification immédiate, ni continuité vers le paiement.

## Le nouveau mécanisme

Un pack de **10 niches offert, livré instantanément dans l'app**, qui se termine par l'offre payante.

```text
Accroche (peur de perdre du temps)
        v
 Champ email  ->  funnel-capture-lead (lead_magnet: "10-niches-offertes")
        v
/10-niches-offertes  : les 10 niches s'affichent TOUT DE SUITE
        v
  PDF telechargeable + "590 autres niches dans l'offre"
        v
       CTA achat -> /commander
```

Les 10 niches sont extraites de la base réelle des 600 (une par grande catégorie, tirage déterministe — aucune donnée inventée), avec mot-clé Amazon, BSR cible, niveau de concurrence, potentiel et prix constaté.

## Les accroches (angle : ne plus perdre son temps)

Titre principal retenu :

> **« Arrêtez d'écrire des livres que personne ne cherche. »**
> Voici 10 niches KDP où la demande existe déjà — vérifiées, avec les mots-clés exacts. Offertes, affichées immédiatement.

Variantes testées en A/B (une par surface) :

| Surface | Accroche |
|---|---|
| Page de vente `/commander` | « 3 mois d'écriture pour 4 ventes ? Le problème n'était pas votre livre : c'était la niche. » |
| Pop-up de sortie | « Avant de partir : vos 10 niches où la demande existe déjà (affichées en 5 secondes). » |
| Barre collante | « 10 niches KDP vérifiées — offertes. Ne perdez pas un livre de plus. » |
| Après inscription | « Bienvenue. Commencez par une niche qui se vend déjà — voici les 10. » |
| Accueil V3 abonnés | « Votre prochain livre mérite une niche validée. 10 niches prêtes, incluses. » |

Sous-accroches de renfort (utilisées en second niveau) :
- « Un livre publié dans une mauvaise niche, c'est 40 heures perdues. »
- « Les mots-clés sont dedans. Vous n'avez plus qu'à écrire. »
- « Gratuit, sans carte bancaire, affiché immédiatement. »

Bascule vers l'achat, en bas de la page cadeau :
> « Ces 10 niches, c'est l'échantillon. L'offre complète contient les **590 autres**, plus l'outil qui écrit, habille et publie le livre. Accès à vie 47 € jusqu'au 30/09/2026. »

## Les 4 emplacements

1. **Page de vente `/commander`** — bloc cadeau en haut, avant les prix : capte ceux qui hésitent au lieu de les perdre.
2. **Pop-up + barre collante** — sur tout le site public, accroches ci-dessus, variantes suivies en A/B.
3. **Après inscription / création de compte** — le pack s'affiche comme cadeau de bienvenue, suivi du CTA d'accès complet.
4. **Accueil V3 (abonnés)** — encart compact : les abonnés récupèrent aussi le pack (valeur perçue de l'abonnement).

## Nouvelle page cadeau `/10-niches-offertes`

- Les 10 niches en cartes lisibles (émoji catégorie, sous-niche, mot-clé Amazon, BSR cible, concurrence, potentiel /5, prix).
- Pour chaque niche : bouton **« Écrire ce livre »** qui pré-remplit le brief de création V3 — le cadeau devient un premier pas dans l'outil.
- Bouton **« Télécharger en PDF »** (généré côté client, charte Émeraude & Or).
- Bloc final de bascule vers `/commander` + rappel des 590 niches restantes.
- Accès direct sans email possible uniquement si l'email a déjà été capté (mémorisé localement) ; sinon la page renvoie vers le formulaire.

## Après inscription : l'email de bienvenue (à réparer)

Constaté dans le code : l'email de bienvenue existe (`send-welcome-email`) mais il envoie
seulement « Votre Guide KDP Gratuit » — **il ne contient ni les identifiants, ni un email
de contact**. Le code d'accès part d'une autre fonction (`send-access-code`). Et dans
`src/data/brevoOnboardingEmails.ts` le bouton de réponse pointe vers `mailto:nebookstudio.fr`
(adresse cassée, le `n` a mangé le `@`) : personne ne peut vous joindre depuis cet email.

Le nouvel email de bienvenue, un seul envoi, contient :

1. Le pack de 10 niches (bouton vers la page cadeau, consultable à vie).
2. **Ses accès** : email de connexion, code d'accès, lien direct vers `/v3`.
3. **Votre email de contact réel** en évidence : « Un souci ? Écrivez-moi directement à
   contact@ebookstudio.fr — je réponds personnellement. » (adresse à confirmer par vous).
4. Les 3 premières actions concrètes dans l'outil, pour éviter l'abandon au jour 1.
5. Rien de promotionnel : c'est un email de service, il doit arriver en boîte principale.

Le même contenu est affiché à l'écran juste après l'inscription (au cas où l'email tarde),
avec un bouton « Renvoyer mes accès » branché sur `resend-access-code`.

## Est-ce que ça va convertir ? Honnêtement

Le pack de niches ne fait pas tout : il répare **une** fuite (537 affichages pour 1 clic,
23 emails captés). Il faut s'attendre à des emails captés en nombre, et à une part d'achats
seulement si les trois autres pièces suivent : la gratification immédiate (cette page cadeau),
la preuve (aucun témoignage approuvé en base aujourd'hui), et la relance des 41 cliqueurs.
Le pack est la première pièce, pas la solution unique — et on mesurera réellement via
`capture_events` (affichage → clic → email) plutôt qu'à l'impression.

## Détails techniques

- Nouvelle page `src/pages/promo/Niches10OffertesPage.tsx` + route `/10-niches-offertes` dans `src/App.tsx` (les routes `/niches` et `/niches-600` existantes ne changent pas).
- Nouveau sélecteur `src/lib/niches10Pack.ts` : extraction déterministe de 10 niches depuis `src/data/niches600.ts` (une par catégorie, rotation stable — pas de `Math.random`).
- Nouveau composant réutilisable `src/components/marketing/Niches10Offer.tsx` (variantes `hero`, `compact`, `popup`) branché sur l'edge function existante `funnel-capture-lead` avec `lead_magnet: "10-niches-offertes"`, plus `trackCaptureEvent` pour l'A/B.
- Réécriture de `src/components/sales/Guide10NichesBlock.tsx` : le lien externe est remplacé par la livraison interne instantanée.
- Insertion : `V3CommanderPage.tsx` (haut de page), `LeadCapturePopup.tsx`, `StickySignupBar.tsx`, page d'inscription, `V3HomePage.tsx` (encart compact, sans alourdir la page).
- Email : `supabase/functions/send-welcome-email/index.ts` réécrit (accès + contact + pack), correction du `mailto:` cassé dans `src/data/brevoOnboardingEmails.ts`, écran de confirmation après inscription avec bouton « Renvoyer mes accès » (`resend-access-code`).
- Aucune modification de base de données : `funnel_leads.lead_magnet` et `capture_events` couvrent déjà le suivi.
- Vérification finale : parcours réel testé en navigateur — saisie email sur `/commander`, arrivée immédiate sur la page cadeau, PDF généré, CTA d'achat fonctionnel, et envoi de test de l'email de bienvenue.

