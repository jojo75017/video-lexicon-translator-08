# Page /essai-gratuit-7-jours : correction définitive du contraste

## Constat vérifié en ligne
J'ai chargé https://ebookstudio.fr/essai-gratuit-7-jours dans un navigateur réel :
- La page répond bien (200), pas de 404.
- Mais elle s'affiche encore avec le fond noir/marron et les textes orange difficilement lisibles (capture faite à l'instant).

Le composant actuel demande bien un fond clair et les couleurs globales sont également claires. Pourtant, le navigateur reçoit encore l'ancien rendu sombre sur le domaine. Il faut donc rendre cette route indépendante du thème global et forcer l'abandon de l'ancienne version mise en cache, plutôt que de republier exactement le même code.

## Ce que je vais faire
1. Isoler cette page dans un thème clair dédié : fond blanc, cartes blanches, texte anthracite et textes secondaires suffisamment contrastés. Même si un thème sombre est actif ailleurs, il ne pourra plus assombrir cette route.
2. Renforcer la lisibilité des listes actuellement presque invisibles, des libellés, des champs et de la phrase de fin, tout en conservant le bouton orange.
3. Incrémenter la version de purge du cache du site afin que les navigateurs ayant mémorisé l'ancienne page récupèrent obligatoirement la nouvelle feuille de style.
4. Publier la nouvelle version sur ebookstudio.fr.
5. Recharger la page publiée dans un navigateur neuf et vérifier :
   - fond clair, texte foncé lisible,
   - formulaire prénom + email visible,
   - les deux cartes « Inclus pendant l'essai » / « Réservé aux abonnés » lisibles.
6. Vous confirmer avec une capture de la page en ligne, et non de l'aperçu.

## Message WhatsApp (à copier tel quel)
Salut 👋 L'essai gratuit 7 jours d'EbookStudio est ouvert : tu écris ton premier livre complet (sommaire IA + chapitres + correction pro), sans carte bancaire. C'est ici 👉 https://ebookstudio.fr/essai-gratuit-7-jours
