
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
- [ ] Étape 4B couvertures : dos + 4ᵉ de couverture, calcul KDP, fond perdu, exports PDF/JPEG (en attente de validation)

