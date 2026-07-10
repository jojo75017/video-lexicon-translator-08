# Plan de reprise — manuscrit propre et uniforme

## Objectif
Produire un export livre sobre, professionnel et livrable :
- police uniforme à 12 pt ;
- marges KDP réelles et visibles ;
- format 6 × 9 correct ;
- table des matières claire avec titres ;
- chapitres propres, sans doublons ;
- aucun élément décoratif, badge, emoji, bloc parasite ou mise en page fantaisiste dans le manuscrit.

## Ce que je vais corriger

### 1. Mise en page KDP réelle
Dans l'export DOCX et PDF :
- format 6 × 9 pouces strict ;
- marges haut/bas/extérieur conformes ;
- marge intérieure de reliure selon le nombre de pages ;
- marges miroir conservées pour les pages gauche/droite ;
- interligne régulier et confortable.

### 2. Typographie uniforme
- Corps du texte par défaut : 12 pt.
- Une seule police sobre pour tout le manuscrit.
- Titres de chapitres uniformes.
- Sous-titres uniformes si présents.
- Pas de style aléatoire, pas de mélange visuel.

### 3. Table des matières lisible
- Afficher le titre « Table des matières ».
- Lister les chapitres avec leurs vrais titres, pas seulement des numéros.
- Ajouter les sous-titres uniquement s'ils sont réellement détectés proprement.
- Conserver les numéros de page à droite.

### 4. Chapitre 1 sans doublon
- Supprimer le titre répété au début du contenu du chapitre.
- Ne garder le titre qu'à deux endroits normaux :
  - dans la table des matières ;
  - en haut de la page du chapitre.

### 5. Export minimal, sans tralala
- Le fichier livre ne contiendra pas de rapport, score, badge, checklist, explication ou élément marketing.
- Le rapport éditorial reste séparé.
- Le DOCX/PDF livre doit être uniquement le manuscrit mis en page.

### 6. Vérification obligatoire
Après correction :
- générer un DOCX test ;
- inspecter le contenu XML pour confirmer les marges, la taille 12 pt, la table des matières et l'absence de doublon ;
- générer un PDF test si possible ;
- vérifier visuellement les pages PDF converties en images pour confirmer que les marges existent et que le texte n'est pas minuscule.

## Fichiers concernés
- `src/lib/bookperfect/exporters.ts`
- `src/lib/bookperfect/importManuscript.ts` si la détection des chapitres doit être durcie
- éventuellement `src/lib/manuscriptParser.ts` si le découpage titre/sous-titre est la source du problème

## Non inclus dans cette reprise
- Pas de nouvelle fonctionnalité.
- Pas de refonte UI.
- Pas de modification backend.
- Pas de changement de prix/offres.
- Le script vidéo sera repris après stabilisation de l'export livre, pour ne pas mélanger les problèmes.
