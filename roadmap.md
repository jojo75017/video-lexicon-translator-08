
## Suivi Paceto (01/09/2026)
- [x] Titres de chapitres persistés + relance individuelle
- [x] Lecture aérée (aperçu + application au manuscrit)
- [x] 4ᵉ de couverture retenue sauvegardée et insérée à l'export
- [ ] Signalé par Georges : « je n'ai plus ma page » — vérifié, aucune erreur de build/runtime ; cause probable = session déconnectée (redirection vers /connexion-abonne). À reconfirmer côté abonné.

## Vidéo V3 (02/09/2026)
- [ ] Vidéo animée 7 min sous-titrée (script docs/video-v3-script.md), muette, rendu Remotion par segments → MP4 /mnt/documents/
- [ ] Améliorations V3 : attendre le choix de Georges (parcours abonné / fiabilité / clés & coûts / onboarding / vitrine)

- [x] Vidéo V3 7 min sous-titrée rendue (/mnt/documents/ebookstudio-v3-presentation.mp4, 6:47, 1080p, muette)
- [x] Étape 1 couvertures : table cover_projects + bucket privé covers + couche d'accès isolée (tests RLS)
- [x] Étape 2 couvertures : page « Mes couvertures » (/v3/mes-couvertures + fiche projet), duplication métadonnées seules, tests réels
- [x] Étape 3 couvertures : upsell Cover Studio KDP Pro 67 € (droit réel, 3 générations incluses non renouvelables, coffre BYOK OpenAI chiffré serveur, génération sans texte en stockage privé, admin accorder/retirer)
- [x] Étape 3 validée par Georges (03/09/2026)
- [ ] BLOQUANT avant mise en production : paiement sandbox complet du produit 67 € avec un compte neuf → vérifier le webhook, l'attribution du droit `cover_studio_pro`, l'accès réel à l'éditeur et l'absence de droit avant paiement
- [x] Étape 4A couvertures : socle sécurisé de l'éditeur de première de couverture (canevas aux dimensions réelles, fond privé par URL signée, 3 textes, annuler/rétablir, autosave `fabric_json`, miniature privée)
- [x] Étape 4A validée par Georges (03/09/2026)
- [x] Étape 4B (partie 1) : moteur de calcul + configuration KDP broché (`src/lib/cover-editor/kdpPaperbackSpecs.ts`, panneau « Configuration KDP », persistance `kdp_config`/`kdp_geometry`/`kdp_rules_version`, 21 tests unitaires)
- [ ] Étape 4C couvertures (en attente de validation) : dos éditable, 4ᵉ de couverture, canevas couverture complète, exports PDF/JPEG, couverture rigide

- [x] Correction interface éditeur de couverture (03/09/2026) : bouton orange « Modifier cette couverture », outils toujours visibles (titre, sous-titre, auteur, couleur de fond, générer illustration), panneau propriétés (police, taille, couleur, gras/italique/alignement), bouton Enregistrer, textes de zone visibles pour le broché — testé et persistant après rechargement

- [x] Génération d’illustration branchée DANS le nouvel éditeur (/v3/mes-couvertures/:id) : panneau 5 champs (genre, ambiance, palette, à éviter, sujet), appel `cover-pro-generate` (OpenAI gpt-image-2 + crédits cover_pro_credits + clé chiffrée), image privée affichée immédiatement, plus aucun renvoi vers /v3/cover-studio-pro depuis l’éditeur
- [x] Navigation Studio couverture V4 clarifiée (05/09/2026) : bouton spécial permanent dans la barre latérale, bannière d’accueil compacte avec trois choix expliqués, accès « Mes couvertures » renommé et actions de création clarifiées
- [x] Page d’offre Studio couverture V4 (05/09/2026) : route dédiée `/v3/offre-couverture-v4`, description, objectifs, offre fixe 67 €, demande de devis, FAQ et accès distincts au paiement et à l’assistant
- [x] Accueil V3 rééquilibré (05/09/2026) : moins d’aplats verts, lancement compact encre/or, introduction papier et vidéo encadrée façon édition — module V4 inchangé
- [ ] Page d’upsell Ebook Version Longue V4 : page sombre dédiée, démonstration interactive et paiement unique 47 €
