# Couvertures : ce que les anciens abonnés et Plume ont, sans tomber dans le payant

## Ce qui existe aujourd'hui
- **Ma couverture en 3 étapes** : déjà prévu pour les anciens abonnés comme « la qualité de votre V2 ».
- **Mes couvertures** : la bibliothèque de leurs couvertures.
- **L'éditeur de couverture brochée** (première, dos, quatrième, modèles, textes, exports PDF KDP et PNG 300 DPI).
- **Cover Studio Pro** : la génération d'illustration par IA, incluse dans Édition, payante (67 €) pour les autres.

Le problème : pour un ancien ou un Plume, ces outils ne sont pas présentés ensemble. Plusieurs écrans montrent surtout un bandeau « Débloquer » qui mène à la page à 67 €. La personne a l'impression de ne rien avoir.

## Ce que chacun aura, clairement

| | Anciens abonnés V2 | Plume | Édition / Maison |
|---|---|---|---|
| Couverture en 3 étapes (qualité V2) | Oui | Oui | Oui |
| Éditeur broché : modèles, textes, dos, 4e | Oui | Oui | Oui |
| Importer sa propre image | Oui | Oui | Oui |
| Luminosité, contraste, gras, justification | Oui | Oui | Oui |
| Exports PDF KDP + PNG 300 DPI | Oui | Oui | Oui |
| Mes couvertures | Oui | Oui | Oui |
| Illustration IA (Cover Studio Pro) | Achat 67 € ou passage à Édition | Achat 67 € ou passage à Édition | Inclus |

## Ce que je vais faire

1. **Une page d'entrée claire « Ma couverture »**, avec en haut une carte « Ce qui est inclus dans votre formule » (liste ci-dessus, cochée en vert) et trois gros boutons : « Créer en 3 étapes », « Ouvrir l'éditeur broché », « Mes couvertures ».
2. **Les boutons « Habiller », « Studio de couverture » et « Créer ma couverture »** mènent tous à cette page pour tout le monde. Aucun bouton du parcours normal n'ouvre la page payante.
3. **Dans l'éditeur, plus de mur « Débloquer »** : pour un ancien ou un Plume, le bandeau dit « Importez votre image ou utilisez un modèle : tout le reste est inclus. » Le lien vers l'illustration IA devient une petite mention discrète « Option : illustration IA », et non plus un blocage.
4. **Mes couvertures** affiche toutes les couvertures de la personne, quelle que soit sa formule. Aujourd'hui, la liste est vide pour ceux qui n'ont pas le Pro.
5. **L'offre à 67 €** reste dans la zone des options en bas de l'accueil et sur la page des forfaits. Elle n'apparaît plus jamais en plein parcours.
6. **Vérification à l'écran** avec trois comptes : un ancien abonné V2, un Plume et un Édition. Je vérifie que chacun peut créer, modifier et exporter une couverture sans voir de paiement.

Les prix, le paiement, les emails et le reste du site ne changent pas. Rien ne sera publié sans votre accord.

## Détails techniques
- `MesCouverturesPage.tsx` : supprimer le filtre `paidProjects` (lié à `coverPro.hasAccess`) qui masque les projets des abonnés non Pro.
- `CoverProAccessBar.tsx` et `IllustrationGeneratorPanel.tsx` : remplacer l'état `!hasAccess` (« Débloquer » vers `/v3/cover-pro`) par un message d'inclusion et un lien discret vers l'option.
- `V3StudioV4Page.tsx` devient la page d'entrée « Ma couverture » : carte des droits selon `useV3Entitlement` et `useCoverProAccess`, puis les liens vers `/v3/couverture-express`, l'éditeur broché et `/v3/mes-couvertures`.
- Les liens du menu, de la barre de gauche et du Raccourci rapide pointent déjà vers `/v3/studio-v4` : à confirmer, sans nouvelle route.
- Les droits côté serveur (`hasCoverProRight`) restent inchangés : seule la génération IA reste réservée.
