# Séquence 5 emails HTML — GetResponse

Objectif : créer 5 emails HTML prêts à coller dans GetResponse pour lancer EbookStudio aujourd'hui. Livraison sous forme de fichiers `.html` téléchargeables + un aperçu d'objet/preheader pour chaque email.

## Ton et cadre
- Tutoiement, ton chaleureux d'auteur à lecteur (cohérent avec la charte EbookStudio).
- HTML simple compatible GetResponse : `<p>`, `<strong>`, `<em>`, `<a>`, `<br>`, `<h2>`, table simple pour le bouton CTA. Pas de CSS externe.
- Couleurs charte : fond #FAFAFA, texte #232F3E, accent teal #008296, hover orange #FF9E2D.
- Largeur max 600px, responsive basique (table centrée).
- Signature : Georges — EbookStudio.

## Plan des 5 emails

1. **Email 1 — Présentation (pas de lien)**
   - Objet : « Bienvenue — un mot avant qu'on commence »
   - Préheader : « Je me présente, et ce qui arrive bientôt »
   - Corps : qui est Georges, pourquoi EbookStudio existe, à qui ça s'adresse, rassurance (pas de spam, désabonnement 1 clic), annonce qu'une **vidéo de démo complète** arrive très bientôt.
   - **Aucun lien d'achat, aucun CTA cliquable.** Juste du texte.

2. **Email 2 — La promesse**
   - Objet : « Écrire un livre en 1 journée, vraiment ? »
   - Le déclic : ce que l'IA permet aujourd'hui pour publier sur Amazon KDP.
   - 1 lien doux vers la page d'accueil ebookstudio.fr (pas encore l'offre).

3. **Email 3 — Démo / Vidéo**
   - Objet : « La vidéo est en ligne (5 min, regarde) »
   - Présente la vidéo de démo de l'outil, capture d'écran cliquable.
   - CTA : « Voir la démo ».

4. **Email 4 — Preuve & cas d'usage**
   - Objet : « 3 livres publiés ce mois-ci avec EbookStudio »
   - Mini cas concrets, types de niches qui marchent, lever les objections (« je ne sais pas écrire », « je n'ai pas le temps »).
   - CTA : « Découvrir l'outil ».

5. **Email 5 — Offre lancement**
   - Objet : « 67 € à vie — c'est maintenant »
   - Présentation de l'offre paiement unique 67 € (lifetime, pas d'abonnement, conforme à la mémoire projet).
   - Urgence douce, garantie, dernier rappel.
   - CTA principal : « Je prends EbookStudio à 67 € ».

## Détails techniques
- Génération via un script Node qui écrit 5 fichiers dans `/mnt/documents/getresponse/` :
  `email-1-presentation.html` … `email-5-offre.html`.
- Chaque fichier = HTML complet (`<!doctype>` + `<html>` + `<body>`) collable tel quel dans l'éditeur HTML brut de GetResponse.
- Un fichier `README.txt` listant pour chaque email : objet, préheader, jour d'envoi suggéré (J0, J+2, J+4, J+6, J+8).
- QA visuelle : conversion de chaque HTML en PNG (via headless) pour vérifier rendu avant livraison.

## Questions rapides avant génération
Si tu veux je peux ajuster, sinon je pars sur ces hypothèses :
- Lien démo vidéo = `https://ebookstudio.fr/demo` (à confirmer, sinon je mets `[LIEN_VIDEO]`).
- Lien offre = `https://ebookstudio.fr/offres`.
- Logo / image d'en-tête : aucun pour rester sobre et passer les filtres anti-spam (juste texte stylé).