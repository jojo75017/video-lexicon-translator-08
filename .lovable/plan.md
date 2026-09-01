# Page introuvable : un seul bouton, plus de risque d'atterrir dans le générateur

## Le problème constaté

Sur la page « Où souhaitez-vous aller ? » (page introuvable), le bouton
« Déjà client » mène à `/connexion-abonne`. Or cette route renvoie
automatiquement toute personne déjà connectée vers `/ebook-planner`, c'est-à-dire
le générateur V2. Un visiteur curieux (ou toi-même connecté en admin) tombe donc
directement dans l'outil au lieu de rester sur le parcours de vente.

## La correction

- Suppression du bouton « Déjà client » de la page introuvable.
- Il ne reste qu'un seul bouton : **Découvrir l'offre** → `/commander`, centré et
  bien visible.
- Le texte d'accompagnement est ajusté en conséquence (plus de mention « choisissez
  l'accès adapté à votre situation », qui n'a plus de sens avec un seul choix).
- Aucun autre lien de connexion n'est ajouté : la page 404 devient purement
  commerciale, elle ne peut plus ouvrir le générateur.

## Détails techniques

- `src/pages/NotFoundPage.tsx` : retrait du `Link to="/connexion-abonne"` et de
  l'icône `LogIn`, passage du conteneur de boutons à un bouton unique centré.
- Aucune modification de routes, d'authentification ni du tunnel `/commander`.
