# Nettoyage de l’accueil V3 des abonnés

## Résultat attendu

Transformer `/v3` connecté en tableau de bord utile, sans modifier la page publique `/commander`, les paiements, les textes du tunnel, les redirections ni la structure visuelle générale.

## Modifications

1. **Vidéo de présentation**
   - Remplacer le lecteur cassé si une source vidéo accessible est disponible.
   - Sinon, ne rendre le bloc qu’après chargement réel des métadonnées et le masquer entièrement en cas d’erreur ou de délai dépassé.
   - Adapter le bouton selon les projets du compte : « Créer un nouveau livre » dès qu’au moins un livre existe, sinon « Créer mon premier livre ».

2. **Nettoyage réservé aux abonnés**
   - Ne plus afficher les deux blocs « Réservez votre place » aux utilisateurs connectés.
   - Retirer seulement de leur accueil : garantie, comparatif, preuve de marché, opportunité KDP en euros, bandeau « moins de 30 minutes », bloc « EbookStudio change tout » et liste « Ebookstudio V3 vous aide à créer ».
   - Conserver les composants pour les autres pages et préserver tous les upsells, Zoom, nouveautés, caractéristiques, explications, outils, auteur, blog et cadeaux demandés.

3. **Modules et menu**
   - Retirer « 2 temps en cours de branchement ».
   - Pour le seul module réellement branché, conserver l’explication Gemini puis ChatGPT.
   - Pour les sept autres, afficher uniquement leur fonction actuelle, sans annoncer un fonctionnement futur.
   - Renommer « Offre 1er oct. » en « Offre à vie · 15 oct. », sans changer son lien.

4. **Chiffres cohérents**
   - Remplacer le total composite « possibilités » par une formulation sans chiffre.
   - Employer partout des libellés explicites : agents spécialisés par type de livre, agents du pipeline P1→P15 et modules de l’espace V3.
   - Vérifier chaque total dans ses tableaux de données ou sa liste de navigation avant modification.

## Vérifications

- Contrôler `/v3` avec une session abonnée sur ordinateur et mobile.
- Vérifier la vidéo ou son masquage propre, le libellé conditionnel du bouton, l’absence des blocs retirés et la continuité verticale de la page.
- Vérifier qu’aucune erreur de compilation ou d’exécution ne subsiste.

## Détail technique

- Les suppressions seront conditionnées par l’utilisateur connecté dans `V3HomePage`, afin de ne pas modifier les composants réutilisés ailleurs.
- L’état du lecteur sera fondé sur les événements réels du navigateur, sans faux chargement ni donnée simulée.
- Aucun fichier de paiement, de tarification ou de redirection ne sera modifié.