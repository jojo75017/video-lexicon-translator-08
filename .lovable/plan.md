# Page spéciale « Version audio » (9,99 € par livre)

## Faisabilité
Oui, c'est possible. Existe déjà : le prix « Version audio d'un livre » (9,99 €, paiement unique), sa prise en charge dans le paiement Stripe, et la fonction serveur qui transforme le texte en voix Azure. Il manque la page dédiée, le guide de la clé Azure et le passage du bouton « M'avertir » à un vrai achat.

## Ce qui sera fait
1. **Nouvelle page `/v3/version-audio`** (abonnés connectés) :
   - présentation claire : ce que l'on obtient (MP3 unique + chapitres séparés, voix françaises naturelles), prix 9,99 € inchangé, présenté comme un geste ;
   - choix du livre dans « Mes livres » ;
   - bouton « Payer 9,99 € » avec le paiement intégré déjà utilisé ailleurs ;
   - après paiement : retour sur la page, livre débloqué, lancement de la conversion.
2. **Guide « Obtenir ma clé Azure Speech »** sur la même page, pas à pas :
   créer un compte Azure gratuit, créer la ressource « Speech », choisir la région (ex. France Central / West Europe), copier la clé et la région, les coller dans « Choisir mon IA · Clés API », bouton « Tester ma clé ». Rappel du coût Azure (environ 3 à 5 € pour 40 000 mots, offre gratuite 500 000 caractères/mois).
3. **Fenêtre actuelle** (capture) : « M'avertir » devient « Découvrir la version audio » et mène à la page ; la carte du livre aussi.
4. Lien ajouté dans le menu « Publier » / sidebar ; la page `/v3/outils/audiobook` existante reste et pointe vers ce parcours.

## Ce qui ne change pas
Prix, autres offres, tunnel /commander, emails (aucun envoi), aucune publication.

## Point à confirmer
Le déblocage après paiement s'appuie sur l'enregistrement d'achat existant ; je vérifierai qu'il marque bien le livre payé avant de lancer la conversion (sinon ajout d'un petit contrôle serveur).

## Technique
- Page `src/pages/v3public/V3VersionAudioPage.tsx`, route dans `App.tsx`, réutilise `v3-subscription-checkout` avec `priceId: v3_audio_single` et `metadata.bookId`.
- Clé Azure stockée comme les autres clés BYOK de l'abonné ; appel via `azure-speech-tts`.
- `AudiobookOfferCard.tsx` : bouton vers la nouvelle page.
