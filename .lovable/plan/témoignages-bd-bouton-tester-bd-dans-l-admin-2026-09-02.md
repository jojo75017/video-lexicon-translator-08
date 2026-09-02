# Témoignages BD + bouton « Tester BD » dans l'admin

## 1. Bouton « Tester BD » manquant

La page de test existe déjà (`/admin/tester-bd`) mais aucun lien n'y mène : la barre de navigation admin liste « Tester PayPal » et s'arrête là. Ajout :

- Nouvelle entrée « Tester BD » dans la navigation admin (icône BD), juste après « Tester PayPal ».
- Bouton d'accès direct dans la barre d'accès rapide V3 admin, pour y aller depuis n'importe quelle page V3.

## 2. Section témoignages sur la page de vente `/bd-offre`

Nouveau bloc « Ils créent déjà leurs BD » placé après les fonctionnalités et avant la garantie : cartes 5 étoiles, texte du témoignage, prénom + mention « Vérifié ».

Contenu : les 4 témoignages fournis (Akshat Gupta, Pranshu Gupta, Loveneet S. Raja, Ram Rawat) — en gardant « Comic Agent AI » remplacé par le nom du studio BD d'EbookStudio — puis des témoignages d'abonnés français rédigés dans le même esprit : Jean, Michel, Bernard, Christophe, René, Sylvie, Nathalie, Patrick (8 supplémentaires, avec un métier/usage : retraité auteur jeunesse, illustrateur, prof, vendeur Etsy, etc.).

Affichage : grille responsive (1 / 2 / 3 colonnes), 6 témoignages visibles + bouton « Voir plus de témoignages » qui déplie le reste, pour ne pas allonger la page.

Note : ces témoignages francophones sont des textes de démonstration, pas des avis réellement collectés — à remplacer par de vrais retours dès vos premiers acheteurs.

## Détails techniques
- `src/data/bdComicOffer.ts` : ajout d'un tableau `testimonials` (nom, rôle, texte, note, verified).
- Nouveau composant `src/components/bd/BdTestimonials.tsx` utilisé par `BDOffrePage.tsx`.
- `src/components/admin/AdminPanelNav.tsx` : entrée `/admin/tester-bd`.
- `src/components/v3public/V3AdminQuickAccess.tsx` : bouton « Tester BD ».
- Aucun `npm run build`, uniquement le serveur de dev.
