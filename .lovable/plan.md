# Rachel, Patrick, Stéphane, Claude René : les faire apparaître sans inventer leurs mots

## Ce que je peux faire, et ce que je ne ferai pas

Je ne vais pas écrire de faux avis signés de leur nom : un témoignage inventé
attribué à une personne réelle, c'est de la publicité trompeuse, et si l'un
d'eux le découvre sur la page de vente, tu perds le client et tu prends le
risque juridique. Ce n'est pas non plus ce qui fait acheter : un avis vague et
lisse ne convainc personne.

En revanche, ils sont réellement utilisateurs et tu as réellement des messages
d'eux. On peut donc les faire apparaître **vite et honnêtement**, en deux
temps : un affichage factuel immédiat, et leurs mots dès qu'ils confirment.

## Étape 1 — Affichage immédiat, factuel, sans citation inventée

Nouveau bloc sur la page de vente : « Ils écrivent en ce moment avec
EbookStudio », avec Rachel, Patrick, Stéphane et Claude René — prénom + initiale,
la version utilisée (V2), et ce qu'ils font réellement (livre en cours,
correction, export KDP). Aucune phrase entre guillemets, donc rien d'inventable
et rien de contestable. C'est de la preuve d'usage, pas du faux avis.

## Étape 2 — Leurs vrais mots, validés en un clic

Email court et personnel envoyé à ces quatre personnes uniquement (pas la liste),
avec un texte **déjà prérempli** à partir de ce qu'ils t'ont écrit : ils
n'ont qu'à corriger si besoin et valider. Un clic, 30 secondes.

- Rachel, Patrick, Stéphane : demande adaptée à la V2 (« vous êtes en plein
  travail, trois lignes suffisent »).
- Claude René : message vraiment personnel, puisque vous échangez beaucoup — je
  le rédige à part, ton direct, sans mise en page commerciale.

Dès qu'un témoignage est validé, il remplace automatiquement la simple mention
factuelle dans le bloc, avec les étoiles et la photo s'il en envoie une.

## Étape 3 — Ce dont j'ai besoin de toi

1. **L'email exact de Claude René** (le paceto…), que je ne peux pas deviner.
2. **Copier-coller de leurs messages** si tu les as sous la main : je préremplis
   leur témoignage avec leurs propres phrases, c'est ce qui convertit le mieux
   et c'est ce qu'ils valideront le plus vite.

Si tu n'as pas les messages, l'étape 1 part quand même tout de suite et
l'email de validation reste générique mais personnel.

## Détails techniques

- Bloc factuel : nouveau composant `V3ActiveUsersPanel.tsx` (données statiques,
  prénom + initiale, aucune citation), inséré au-dessus de `TestimonialsWall`
  dans `src/pages/v3public/V3CommanderPage.tsx`.
- Témoignages réels : rien de nouveau à créer, on réutilise `book_testimonials`
  (`approved = false` au dépôt) et `TestimonialsWall` qui n'affiche que
  `approved = true`. Le bloc factuel masque automatiquement une personne dont le
  témoignage validé est déjà affiché, pour éviter le doublon.
- Demande ciblée : nouveau mode `emails: [...]` déjà présent dans
  `send-testimonial-request`, appelé pour ces 4 adresses uniquement, avec un
  gabarit `demande-temoignage-perso` (texte prérempli passé en paramètre) et
  lien vers `/v3/temoignage?prefill=…`.
- Aucun envoi de masse, aucun changement de tarif, aucun avis publié sans
  validation de la personne.
