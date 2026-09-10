# Page d'offre à 67 € — « Votre maison d'édition de couvertures »

## Objectif visible

Donner à la page `/v3/cover-pro` (offre Cover Studio KDP Pro à 67 €) la même identité éditoriale professionnelle que le module du hub : titre « Votre maison d'édition de couvertures » et sous-titre décrivant le parcours simple — créer l'illustration, ajouter ses textes, télécharger une couverture prête pour Kindle/Amazon.

## Modifications prévues

### 1. En-tête professionnel (`src/pages/v3/cover-studio-pro/CoverProPage.tsx`)

Remplacer l'en-tête actuel par :

- Badge conservé mais intitulé harmonisé : « Votre maison d'édition de couvertures ».
- Titre H1 : **Votre maison d'édition de couvertures**.
- Sous-titre : « Créez l'illustration, ajoutez vos textes et téléchargez une couverture prête pour Kindle et Amazon. »
- Conserver l'explication actuelle sur l'illustration haute résolution sans titre/logo et l'espace privé (raccourcie et intégrée au sous-titre).

### 2. Parcours visible en 3 étapes

Ajouter sous l'en-tête un petit parcours lisible, identique à l'esprit du module du hub :

```text
1. Illustration  →  2. Textes  →  3. Téléchargement
```

Présenté en pastilles discrètes, visible même sur l'état verrouillé (avant achat), pour que le prospect comprenne immédiatement ce qu'il obtient.

### 3. Carte de déverrouillage (état non-acheté)

Intitulé harmonisé avec la nouvelle identité :

- Titre : « Débloquer votre maison d'édition — 67 €, paiement unique ».
- Description inchangée : 3 générations offertes, puis clé API personnelle OpenAI, sans abonnement.
- Bouton : « Débloquer Cover Studio KDP Pro — 67 € » (inchangé, conserve le tunnel de paiement).

### 4. État déverrouillé

- Bandeau d'accès actif inchangé (crédits restants, lien Mes couvertures).
- Le panneau d'illustration (`CoverProIllustrationPanel.tsx`) conserve son titre fonctionnel « Illustration IA sans texte », mais une courte ligne sous le titre rappelle le parcours : « 1. Illustration · 2. Textes dans l'éditeur · 3. Téléchargement ».
- Le coffre de clés (`CoverProKeyVault`) reste inchangé.

## Détails techniques

- Modifications uniquement dans `src/pages/v3/cover-studio-pro/CoverProPage.tsx` (en-tête, parcours 3 étapes, intitulé de la carte verrouillée) et, mineure, dans `src/components/cover-studio-pro/CoverProIllustrationPanel.tsx` (ligne de rappel du parcours).
- Aucune modification du tunnel de paiement, du prix 67 €, du `priceId`, des crédits, de la sécurité, du chiffrement des clés, de la base, des calculs KDP, ni de l'ancien `/v3/cover-studio-pro`.
- Vérification navigateur sur `/v3/cover-pro` : titre et sous-titre affichés, parcours visible à 3 étapes, bouton 67 € toujours fonctionnel, état déverrouillé intact.

## Ce qui ne change pas

- Paiements Stripe/PayPal, tarification, accès, crédits, sécurité, base de données, calculs KDP, et ancien module de couverture.
