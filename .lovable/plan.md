# Faire apparaître Rachel, Patrick, Stéphane et Claude René — étape 1 seule

Tout le monde est en vacances : on ne leur envoie rien pour l'instant. On affiche
uniquement des faits d'usage, sans citation inventée, et on branchera leurs vrais
mots plus tard (à la rentrée) sans rien changer d'autre.

## Ce qui est ajouté

Un bloc sur la page de commande : **« Ils écrivent en ce moment avec EbookStudio »**,
avec quatre entrées :

- **Rachel D.** — V2, livre en cours de rédaction
- **Patrick L.** — V2, manuscrit en correction
- **Stéphane M.** — V2, préparation de l'export Amazon KDP
- **Claude René B.** — V2, échanges réguliers, livre en cours

Chaque entrée montre : le prénom + initiale, la version utilisée, l'étape en
cours. **Aucune phrase entre guillemets**, aucun avis attribué à quelqu'un qui ne
l'a pas écrit : c'est de la preuve d'usage, factuelle et défendable.

Le bloc est placé juste au-dessus du mur d'avis existant. Quand de vrais
témoignages validés arriveront, ils s'afficheront en dessous, et la personne
concernée disparaîtra automatiquement du bloc factuel pour éviter le doublon.

## Ce qui n'est pas fait dans cette étape

- Aucun email envoyé (ni à eux, ni à la liste).
- Aucun faux avis, aucune étoile, aucune note inventée.
- Aucun changement de tarif ni de contenu de la page de vente.

## Détails techniques

- Nouveau composant `src/components/sales/ActiveUsersPanel.tsx` : données
  statiques (prénom + initiale, version, étape en cours), style aligné sur
  `TestimonialsWall` (fond blanc, bordure `#efe3cf`, accent ambre, encre `#2A2118`).
- Il lit `book_testimonials` (`approved = true`) pour masquer une personne dont
  le témoignage réel est déjà publié — lecture seule, aucune écriture.
- Inséré au-dessus de `TestimonialsWall` dans `src/pages/v3public/V3CommanderPage.tsx`.
- Rien d'autre n'est modifié : pas de migration, pas de fonction Edge, pas d'envoi.
