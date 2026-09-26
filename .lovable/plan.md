# HumanizeAI dans la V3

## Résultat attendu
Transformer l’actuel Humaniseur IA en un espace HumanizeAI complet, accessible depuis un bouton prioritaire et depuis la barre des outils V3.

## Interface
- Créer un en-tête HumanizeAI avec deux onglets : **Humanisateur** et **Audit stylométrique**.
- Ajouter le choix clair/sombre et le sélecteur FR/EN dans cet espace.
- Humanisateur : import `.txt` et `.docx`, collage/effacement, compteurs mots/caractères/lecture, réglages du ton et de l’intensité, résultat côte à côte, copie, export DOCX et régénération.
- Audit : analyse d’un texte, scores lisibles (risque IA, perplexité, variation du rythme, tics d’écriture) et phrases signalées avec explication.
- Respecter l’identité EbookStudio existante plutôt qu’introduire une nouvelle palette violette.

## Accès visibles
- Renommer l’accès existant en **HumanizeAI** dans le menu latéral V3.
- Ajouter un bouton **HumanizeAI** bien visible dans la barre d’actions rapides.
- Ajouter HumanizeAI dans la barre « Tous les outils » et dans l’index des outils.
- Conserver l’adresse actuelle `/v3/outils/humanizer` pour éviter tout lien cassé.

## Fonctionnement
- Réutiliser les traitements IA réels déjà présents ; aucun score aléatoire ni faux résultat.
- Calculer localement uniquement les métriques objectives (longueurs de phrases, répétitions et expressions détectées), puis présenter les estimations comme telles.
- Conserver le sens et les faits du texte dans les consignes envoyées au moteur.
- Afficher clairement les erreurs et ne jamais inventer un résultat en cas d’échec.

## Vérification
- Vérifier les deux onglets, l’import, les réglages, la copie, l’export, le bouton et les deux barres d’accès.
- Contrôler l’affichage sur ordinateur et mobile, puis confirmer que l’application se construit sans erreur.
