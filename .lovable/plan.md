# Kit de démarrage V3 (PDF) à envoyer aux abonnés

Objectif : un PDF premium (Emerald & Gold, identité Ebookstudio) que l'abonné reçoit après paiement, qui l'emmène de la connexion jusqu'à son premier livre publié sur KDP, avec captures/visuels et liens cliquables vers les bons onglets de la V3.

## Contenu du PDF (16 pages)

1. Couverture — « Kit de démarrage Ebookstudio V3 » + promesse (votre premier livre prêt pour KDP en 7 jours)
2. Bienvenue + vos accès (page de connexion, mot de passe, mon email direct de support)
3. Le tour du studio : le header (Plan, Écrire, Habiller, Publier, Vendre) et la barre latérale
4. Onglet Fonctionnalités : la grille de 12 modules expliquée
5. Étape 1 — Réglage des clés (BYOK Gemini / OpenRouter) + pourquoi c'est votre garantie de coût
6. Étape 2 — Studio de recherche & niches (Audit ASIN, 600 niches, mots-clés Amazon)
7. Étape 3 — Le plan du livre (sommaire guidé par l'IA, personnages, bible d'univers)
8. Étape 4 — Écriture chapitre par chapitre (Gemini architecte + ChatGPT plume)
9. Étape 5 — Correction professionnelle (les 4 passes, ce que ça corrige vraiment)
10. Étape 6 — Habiller : Cover Studio Pro (couverture, dos, 4e de couverture)
11. Étape 7 — Publier : export Kindle / broché / Word + métadonnées KDP
12. Étape 8 — Vendre : description, mots-clés, obtenir ses premiers avis clients
13. Plan de 7 jours (une action par jour, cases à cocher)
14. Les 10 erreurs qui font refuser un livre sur KDP
15. Vos cadeaux : 10 niches offertes + guides
16. Support & FAQ (les 8 questions les plus posées + accès aux 300 Q/R)

Chaque page « étape » suit la même structure : à quoi ça sert → où cliquer → visuel → résultat attendu → temps estimé.

## Visuels

- Captures réelles des écrans V3 (accueil, Fonctionnalités, plan du livre, correcteur, Cover Studio, export KDP) prises automatiquement sur l'app.
- Visuels déjà présents dans le projet (bandeau moteurs multimodèles, mockups couvertures, showcase ebooks).
- Aucune image inventée, aucune fonctionnalité illustrée qui n'existe pas.

## Diffusion aux abonnés

- Le PDF est stocké dans le projet et accessible en téléchargement depuis une page dédiée `/v3/kit-demarrage` (bouton visible dans la barre latérale et dans l'encart de démarrage).
- L'email de bienvenue (envoyé après paiement) ajoute un bloc « Votre kit de démarrage PDF » avec le lien de téléchargement, à côté des identifiants et des 10 niches.
- Un envoi ponctuel aux abonnés déjà actifs : nouvelle lettre « Votre kit de démarrage est prêt » depuis le panneau d'administration des campagnes, ciblée sur les comptes payants uniquement.

## Détails techniques

- Génération : script Python (reportlab + Pillow), police Unicode DejaVu pour les accents, format A4, palette Emerald `#065F46` / Gold `#D4AF37`, fond `#FAFAFA`.
- Captures d'écran : Playwright en local sur les routes V3, en mode admin, recadrées par élément.
- Sortie livrée dans `/mnt/documents/kit-demarrage-ebookstudio-v3.pdf` (téléchargeable immédiatement) puis copiée dans `public/` pour le lien in-app, et uploadée en stockage pour le lien email.
- QA obligatoire : chaque page convertie en image et inspectée (débordements, texte coupé, contrastes, liens) avant livraison.
- Textes 100 % français, aucun mot latin ni faux latin.
