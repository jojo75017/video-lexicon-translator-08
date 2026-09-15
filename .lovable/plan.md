# Réparer les onglets coupés dans l'en-tête V3

## Problème constaté (capture d'écran à l'appui)

Sur `/v3/create/illustre` (et toutes les pages V3) :
- La barre d'onglets (Accueil, Offre V3, Upsells, Créer, Écrire, Habiller, Publier, Vendre, Livres spéciaux, Forfaits, « Tous les outils ») contient trop d'éléments pour la largeur réelle : les derniers onglets sont **coupés à moitié** à droite de l'écran (« Tous les ou… », « Écrire un li… »).
- La cause : la barre masque ce qui dépasse (`overflow-x-clip`) au lieu de permettre le défilement, et aucun repli n'est prévu quand la largeur manque.
- La barre admin juste en dessous (Mode admin, Prospects, Emails…) subit le même sort sur les écrans plus étroits.

## Correctifs prévus

1. **Barre d'onglets** (`V3MainTabs.tsx`)
   - Permettre le défilement horizontal discret de la rangée d'onglets quand elle dépasse (défilement au doigt / à la souris, sans barre de défilement visible).
   - Empêcher le rétrécissement des boutons (`flex-shrink: 0`) pour que chaque onglet reste entier, jamais coupé.
   - Garder le bouton « Tous les outils » visible à droite (position fixe dans la rangée).

2. **Barre d'en-tête principale** (`V3Header.tsx`)
   - Vérifier que les boutons de droite (Ma bibliothèque, Écrire un livre) ne dépassent jamais : réduire les espacements sur les écrans intermédiaires, et laisser le menu hamburger prendre le relais plus tôt si nécessaire.

3. **Barre admin** (`V3AdminQuickAccess.tsx`)
   - Même traitement : défilement horizontal discret au lieu d'onglets coupés.

4. **Sécurité anti-débordement**
   - Ajouter une protection globale contre le défilement horizontal de la page (un élément large ne doit plus décaler tout l'en-tête).

## Vérifications

- Captures d'écran aux largeurs 1280 px, 1440 px et 1587 px : tous les onglets entièrement visibles ou accessibles par glissement.
- Aucun changement de contenu, de prix, de routes ou de base de données — uniquement l'affichage de l'en-tête.
