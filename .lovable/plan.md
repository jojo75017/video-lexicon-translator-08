Plan - Email A/B GetResponse 47 € : relance avec les templates et le lien du bouton

## Objectif
Permettre le lancement du test A/B GetResponse de l'offre d'été 47 € en fournissant les 2 templates HTML complets, avec le bouton CTA déjà pointé vers le bon lien.

## État actuel
Les templates suivants existent dans le projet :
- `public/email-templates/ab-ete-47-getresponse-A.html`
- `public/email-templates/ab-ete-47-getresponse-B.html`

Les deux templates contiennent déjà un bouton CTA pointant vers `https://www.ebookstudio.fr/commander` avec un paramètre de tracking différent pour chaque variante :
- Variante A : `https://www.ebookstudio.fr/commander?src=email-ab-47-a`
- Variante B : `https://www.ebookstudio.fr/commander?src=email-ab-47-b`

## Actions à réaliser

1. **Renvoyer les templates HTML à l'admin**  
   Envoyer les 2 fichiers complets sur `boubetgeorges@gmail.com` pour qu'il puisse les visualiser et les copier-coller dans GetResponse.

2. **Vérifier le lien du bouton dans les templates**  
   S'assurer que le lien pointe bien vers `https://www.ebookstudio.fr/commander` avec les paramètres `src=email-ab-47-a` et `src=email-ab-47-b`.

3. **Fournir la procédure GetResponse en 5 étapes**  
   - Objet A : « 47 € au lieu de 59 € (jusqu'au 30 septembre) »  
   - Objet B : « Elle ne savait pas écrire. Elle a quand même publié. »  
   - Contenu A : copier-coller le template A, bouton « Je prends l'accès à 47 € »  
   - Contenu B : copier-coller le template B, bouton « Voir l'offre et commencer »  
   - Destinataires : liste des ouvreurs  
   - Indicateur de victoire : Ouvertures (ou Clics si on veut tester le CTA)

4. **(Optionnel) Proposer un envoi direct depuis notre système**  
   Si GetResponse reste bloqué, utiliser la fonction `send-offre-47-serie` pour envoyer les 2 variantes directement depuis l'Edge Function, avec les mêmes liens trackés.

## Lien du bouton à retenir
`https://www.ebookstudio.fr/commander?src=email-ab-47-a` pour la variante A.
`https://www.ebookstudio.fr/commander?src=email-ab-47-b` pour la variante B.
