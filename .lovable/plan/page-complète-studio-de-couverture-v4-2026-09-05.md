# Page complète Studio de couverture V4

## Objectif
Créer une véritable page d’offre à `/v3/offre-couverture-v4`, clairement séparée de l’assistant `/v3/couverture-express`. Elle doit expliquer le produit, ses objectifs, l’offre fixe à 67 €, la demande de devis personnalisé et conduire sans ambiguïté au paiement existant.

## Schéma de la page
```text
/v3/offre-couverture-v4
├── Ouverture éditoriale
│   ├── Studio de couverture V4
│   ├── Promesse claire et visuel de couvertures
│   ├── 67 € · paiement unique
│   └── Bouton « Acheter le Studio V4 — 67 € »
├── Description
│   └── Ce que le Studio permet réellement de créer
├── Objectifs
│   ├── Concevoir plus simplement
│   ├── Garder les textes modifiables
│   └── Obtenir des fichiers adaptés à la publication numérique
├── Parcours en 3 étapes
│   ├── Informations du livre
│   ├── Illustration et composition
│   └── Vérification et téléchargement
├── Contenu exact de l’offre
│   ├── Assistant guidé
│   ├── Illustration IA privée
│   ├── Modèles et éditeur avancé
│   ├── Bibliothèque de projets
│   ├── Export Kindle JPEG 1600 × 2560
│   ├── Export PNG et PDF de première de couverture
│   └── 3 générations incluses, puis clé OpenAI personnelle
├── Offre fixe
│   ├── Prix : 67 € une seule fois
│   ├── Résumé inclus / non inclus
│   └── Paiement intégré existant
├── Devis personnalisé
│   ├── Besoin, format, quantité et coordonnées
│   └── Envoi par le canal de contact déjà disponible dans le projet
├── Réassurance et questions fréquentes
└── Dernier bouton de paiement
```

## Direction visuelle validée
- Composition « Minimalist editorial » inspirée d’un catalogue de maison d’édition.
- Palette verrouillée : émeraude `#064E3B`, teal `#0F766E`, or `#D4AF37`, fond `#FAFAFA`.
- Titres Instrument Serif, textes Work Sans.
- Mise en page magazine, respirante, avec une photographie de couvertures dès le premier écran.
- Boutons explicites : paiement, demande de devis et accès à l’assistant ne seront jamais confondus.

## Mise en œuvre
- Créer la page dédiée et sa route protégée dans l’espace V3.
- Relier les boutons d’achat au tunnel 67 € déjà existant via `/v3/cover-pro?checkout=1` ; aucun nouveau produit ni prix.
- Relier la demande de devis au mécanisme de contact existant, sans toucher aux paiements, crédits ou droits d’accès.
- Modifier les liens « Découvrir l’offre 67 € » de l’accueil pour ouvrir cette nouvelle page ; conserver le bouton spécial de la barre latérale vers l’assistant.
- Utiliser uniquement les fonctions réellement disponibles et ne pas promettre le PDF broché, la couverture rigide ou l’import de manuscrit.

## Vérification
- Contrôler la page sur ordinateur et mobile : lisibilité, absence de chevauchement et présence du produit dès le premier écran.
- Vérifier séparément les trois destinations : paiement, demande de devis et assistant.
- Confirmer que le bouton de paiement ouvre bien le formulaire Stripe intégré existant, sans exposer l’éditeur ni rediriger vers l’accueil.
- Vérifier les erreurs visibles du formulaire de devis et son accusé de prise en compte.
