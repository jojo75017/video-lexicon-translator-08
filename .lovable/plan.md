# Fiabiliser le parcours Paceto

## Objectif
Corriger les quatre blocages signalés sans changer le reste du workflow V2.

## Modifications
1. **Titres de chapitres**
   - Remplacer le modèle Gemini obsolète de l’appel direct par le modèle actuel.
   - Après une génération groupée, détecter les titres encore manquants et les relancer individuellement.
   - Ajouter une action explicite pour appliquer les titres au manuscrit, puis les sauvegarder dans le projet afin qu’ils restent après fermeture.

2. **Relecture lisible**
   - Ajouter dans l’aperçu une mise en paragraphes automatique non destructive pour les textes IA livrés en bloc.
   - Afficher le chapitre complet avec une typographie de lecture, des paragraphes aérés et des sauts cohérents avant validation.
   - Permettre d’appliquer cette mise en forme au manuscrit puis de la sauvegarder.

3. **Quatrième de couverture**
   - Conserver les trois propositions et la version choisie dans le projet.
   - Ajouter un bouton clair « Utiliser cette version ».
   - Inclure la version choisie comme dernière page de l’ebook lors de l’export, tout en précisant que la couverture imprimée KDP complète reste un fichier séparé.

4. **Vérification**
   - Tester la génération du titre manquant, la fermeture/réouverture du projet, l’aperçu lisible et l’export avec la quatrième de couverture.

## Détails techniques
- Les corrections réutiliseront la sauvegarde Lovable Cloud existante du projet Paceto.
- Les composants d’aperçu resteront compatibles avec les autres écrans qui les utilisent grâce à des callbacks optionnels.
- Aucune donnée fictive et aucun changement de tarification ou de workflow V3.
