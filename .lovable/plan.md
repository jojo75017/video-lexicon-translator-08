## Diagnostic confirmé sur votre fichier

J’ai ouvert et converti `LEmprise_des_Ombres_KDP_3.docx` : **117 pages**.

Le sommaire existe, mais il est effectivement inutilisable :
- 23 chapitres annoncés, dont la majorité apparaît seulement comme « Chapitre 2 », « Chapitre 3 », etc., sans titre.
- Les titres des chapitres 5, 13 et 17 contiennent du texte de manuscrit et même un mauvais numéro (`Chapitre 13 – Chapitre 15…`, `Chapitre 17 – Chapitre 19…`).
- Trois chapitres sont exportés avec **« Chapitre en cours de rédaction »**, ce qui est interdit dans un fichier destiné à être vendu.
- Le chapitre 1 reprend le titre du livre comme titre de chapitre, puis répète encore ce titre au début du texte.
- Le sommaire est une liste statique sans numéros de page ni liens Word.

La cause visible dans le moteur actuel est qu’il conserve volontairement les chapitres vides dès qu’ils semblent avoir un titre, puis ajoute le marqueur « Chapitre en cours de rédaction ». Il construit aussi le sommaire à partir de données de chapitres déjà incohérentes au lieu de valider la correspondance numéro/titre/contenu.

## Correction prioritaire

### 1. Bloquer tout DOCX non publiable
Avant de générer le fichier, ajouter une validation stricte :
- aucun chapitre vide ;
- aucun titre générique manquant ;
- aucun titre ressemblant au début du contenu ;
- aucune incohérence de numéros (`Chapitre 13` contenant `Chapitre 15`) ;
- aucun placeholder, JSON, Markdown parasite ou texte tronqué.

Si une erreur existe, le téléchargement est bloqué et l’utilisateur voit la liste précise des chapitres à corriger/régénérer.

### 2. Reconstruire la source unique des chapitres
- Conserver le numéro prévu par le sommaire validé, sans renumérotation silencieuse.
- Faire correspondre chaque titre validé au bon contenu généré.
- Extraire un titre depuis le contenu uniquement s’il s’agit d’un vrai en-tête court et distinct, jamais depuis une phrase narrative.
- Supprimer la répétition du titre au début du corps.
- Ne jamais injecter « Chapitre en cours de rédaction » dans un export final.

### 3. Créer un vrai sommaire professionnel
- Une entrée pour chaque chapitre réellement présent, avec son titre complet.
- Table des matières Word dynamique avec liens et numéros de page, fondée sur de vrais styles `Heading 1`.
- Titres de chapitre identiques entre sommaire et corps du livre.
- Sections finales ajoutées seulement lorsqu’elles ont un contenu réel (Remerciements, Mot de l’auteur, etc.).

### 4. Ajouter un contrôle avant téléchargement
Dans l’aperçu DOCX :
- tableau `N° | Titre | Nombre de mots | État` ;
- alerte rouge pour chapitre vide ou titre invalide ;
- compteur « 23/23 chapitres prêts » ;
- bouton de téléchargement actif uniquement quand tout est valide.

### 5. Tests sur le cas réel
- Ajouter un test de régression reproduisant exactement les défauts de ce fichier.
- Générer un nouveau DOCX depuis les données corrigées.
- Valider sa structure XML, le convertir en PDF et inspecter visuellement la couverture, le sommaire, plusieurs débuts de chapitres et les dernières pages.

Une fois cet export stabilisé, je reprendrai le bloc final prévu : bouton vers Cover Studio Pro, téléchargement de la couverture et section complète Amazon KDP.