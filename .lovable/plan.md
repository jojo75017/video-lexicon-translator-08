# Page de vente Ebook Comic Agent — version sombre haute conversion

Objectif : refondre la page d'offre unique 47 € du Studio BD en page de vente sombre, très lisible, orientée conversion, avec l'annonce V4 incluse.

## Emplacement retenu

La page garde son adresse actuelle `/bd-upsell` : c'est déjà l'étape « offre unique » du tunnel BD (17 € puis 47 €), elle est déjà reliée au paiement Stripe et PayPal qui fonctionne, et les emails et liens existants continuent donc de marcher. Aucune nouvelle route, aucun doublon.

Le bouton de refus mène à `/bd-studio` (l'espace de travail BD), qui est la destination logique juste après l'achat de base.

## Contenu de la page, dans l'ordre

```text
┌──────────────────────────────────────────────┐
│ BANDEAU  OFFRE SPÉCIALE UNIQUE — NE FERMEZ   │
│          PAS CETTE PAGE                      │
├──────────────────────────────────────────────┤
│ BADGE   PROCHAINEMENT V4 — MISE À JOUR       │
│         INCLUSE GRATUITEMENT                 │
│ TITRE   Débloquez l'Agent IA de création de  │
│         BD & livres illustrés automatisé     │
├──────────────────────────────────────────────┤
│ MOTEUR DE COHÉRENCE                          │
│  [fiche perso] [case 1] [case 2] [couv.]     │
│  « Fini les visages qui changent… »          │
├──────────────────────────────────────────────┤
│ 5 CARTES MODULES (fond sombre, accent néon)  │
├──────────────────────────────────────────────┤
│ OFFRE  197 € barré → 47 €                    │
│  ▸ OUI ! AJOUTER À MA COMMANDE (47 €)        │
│  ▸ Non merci, je passe à mon espace membre   │
│  Stripe · PayPal · Garantie 30 jours         │
└──────────────────────────────────────────────┘
```

1. Bandeau d'urgence en haut, pleine largeur.
2. Badge V4 « mise à jour incluse gratuitement » + titre percutant + une phrase de promesse.
3. Bloc « Moteur de cohérence » : une rangée de 4 vignettes montrant le même héros sur une fiche personnage, deux cases de BD et une couverture, avec la phrase « Fini les visages qui changent à chaque case : le Moteur de Cohérence verrouille vos héros du début à la fin. » Les visuels seront des exemples de démonstration que je génère, portant la mention « exemple de démonstration » pour rester honnête.
4. Cinq cartes de modules : Moteur de Cohérence Personnages, Créateur de Couvertures KDP/Etsy, Studio de Coloriage, Packs d'Activités Enfants, Suite Marketing. Chaque carte dit en une phrase ce que l'abonné obtient, sans promettre de fonction inexistante ; ce qui arrive en V4 est marqué « V4 ».
5. Bloc offre : 197 € barré, 47 € en évidence, liste de ce qui est inclus, gros bouton « OUI ! AJOUTER EBOOK COMIC AGENT À MA COMMANDE (47 €) », paiement Stripe intégré sur la page, alternative PayPal, puis le lien discret « Non merci, je refuse cette offre unique et je passe à mon espace membre. »
6. Rappels de confiance : Stripe, PayPal, garantie 30 jours satisfait ou remboursé.

## Design

- Fond ultra-sombre proche de `slate-950`, texte clair très lisible, boutons d'action lumineux orange/néon avec léger halo.
- Hiérarchie nette : titres larges, paragraphes courts, listes à puces coche.
- Entièrement lisible sur mobile : une colonne, boutons pleine largeur, bandeau et badge qui ne débordent pas.
- Pas d'animation agressive, pas de compte à rebours faux.

## Détails techniques

- Fichier réécrit : `src/pages/bd/BDUpsellPage.tsx` (présentation uniquement).
- Textes et liste des modules ajoutés dans `src/data/bdComicOffer.ts` (`proUpsell`), qui reste la source unique d'affichage. Le prix affiché barré 197 € y sera ajouté comme simple libellé.
- Paiement inchangé : appel existant à `v3-upsell-checkout` avec `packId: 'bd_comic_pro'` (Stripe embarqué) et `funnel-create-order` avec `bd_comic_pro_47` pour PayPal. Aucun montant, produit, prix ni fonction serveur modifié.
- Visuels de démonstration générés dans `src/assets/` puis importés normalement.
- Nouvelle feuille de style limitée à cette page via classes Tailwind ; aucune variable globale modifiée.
- Aucune modification de la base, des règles de sécurité, des calculs KDP, des autres modules ou du module couverture V4.

## Vérification

- Typage TypeScript.
- Contrôle navigateur en 1 280 px et en 390 px : bandeau, badge, bloc cohérence, 5 cartes, prix 47 €, bouton principal et lien de refus tous visibles, sans débordement horizontal.
- Clic sur le bouton principal : le formulaire de paiement Stripe s'ouvre bien sur la page.
- Clic sur le lien de refus : arrivée sur `/bd-studio`.
- Deux captures fournies : version bureau et version mobile.
