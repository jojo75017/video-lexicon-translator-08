Je propose de corriger le problème en profondeur, pas avec un simple bouton en plus.

## Objectif
Rendre le module couverture honnête et utilisable commercialement : l’utilisateur choisit un registre, ajoute son propre prompt, obtient une image vraiment adaptée, et l’interface ne promet plus du “millimétré” si ce n’est pas réellement garanti.

## Plan d’implémentation

1. Remplacer le fonctionnement actuel des presets
- Supprimer l’idée de “maquette simple” comme solution mise en avant.
- Transformer les presets en vrais modèles de prompt éditorial : Thriller, Business, Fantasy, Wellness, Romance, Mémoire, Cuisine, Jeunesse, etc.
- Chaque preset affichera clairement : ambiance, palette, composition, type d’image attendu.

2. Ajouter un vrai champ “Prompt utilisateur” dans le modèle choisi
- Quand l’utilisateur clique sur un preset, il pourra écrire son intention : scène, symbole, décor, émotion, objets à voir, choses à éviter.
- Ce prompt sera fusionné avec le preset, le titre, le genre, le sous-titre et le brief KDP.
- Le prompt final sera visible avant génération, pour que l’utilisateur comprenne ce qui part à l’IA.

3. Renforcer la fonction IA de génération
- Modifier `generate-ai-cover` pour donner la priorité au preset + prompt utilisateur.
- Interdire explicitement les fonds génériques, les décors répétés, les images plates et les couvertures “template”.
- Demander une couverture photoréaliste, éditoriale, avec sujet central concret, composition de livre et typographie lisible.
- Garder le modèle Lovable AI existant, sans demander de nouvelle clé.

4. Rendre le résultat plus honnête côté KDP
- Remplacer les textes trop absolus comme “conforme”, “millimétré”, “prêt à publier” quand ils concernent une image IA.
- Utiliser une formulation honnête : “format calculé”, “base compatible KDP”, “à vérifier dans l’aperçu KDP Amazon”.
- Garder les vrais calculs de format, tranche, fond perdu et zone ISBN, mais ne pas promettre une validation finale Amazon automatique.

5. Corriger l’UX du studio couverture
- Mettre les presets visibles dès l’ouverture du studio, pas cachés dans les options avancées.
- Ajouter un workflow clair : choisir un modèle → compléter le prompt → générer.
- Remplacer le bouton “couverture simple” par une action discrète de secours, clairement nommée “maquette temporaire”, pour ne pas la vendre comme résultat final.

6. Vérification
- Vérifier que les presets sont visibles sur `/ebook-planner`.
- Vérifier que le prompt final contient bien le preset sélectionné et le prompt de l’utilisateur.
- Vérifier qu’aucun texte visible ne promet une précision “millimétrée” non garantie.

## Résultat attendu
Les clients ne verront plus une couverture générique ou mensongère : ils auront un vrai choix de registre, un champ de prompt personnel, une génération plus spécifique, et une communication honnête sur les limites KDP.