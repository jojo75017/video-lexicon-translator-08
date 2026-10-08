# Tunnel permanent à partir du 16 octobre 2026

## Décision validée
À partir du **16 octobre 2026**, l’offre d’entrée devient :

- **EbookStudio V3 — 47 € en paiement unique, accès à vie** ;
- **10 livres par mois, soit 120 livres par an** ;
- jusqu’à **40 chapitres par livre**, avec 30 ou moins conseillé ;
- aucune mensualité ;
- plus de compteur « 15 places » ni de date limite ;
- les clients et abonnés actuels conservent tous leurs droits.

## Brief à transmettre à Landaa

### 1. Page de vente principale
- Garder le prix **47 € une seule fois** et la promesse d’**accès à vie**.
- Retirer partout : « 15 places », « jusqu’au 15 octobre », compte à rebours, urgence de fermeture et mentions d’un futur abonnement obligatoire.
- Afficher clairement : **10 livres par mois — 120 livres par an**.
- Ne pas présenter Amazon KDP comme l’unique plateforme de publication.
- Bouton principal : **« J’accède à EbookStudio V3 à vie pour 47 € »**.
- Le bouton doit mener au bon de commande EbookStudio en conservant les paramètres de suivi (`utm_*`, `src`, `ref`).

### 2. Bon de commande à 47 €
- Produit principal : **EbookStudio V3 — accès à vie**.
- Prix : **47 €**, paiement unique.
- Conserver la case facultative **Pack Boost de Lancement — 17 €** si elle est déjà présente.
- Ne pas ajouter d’abonnement, de paiement récurrent ou d’autre formule.
- Après paiement accepté, envoyer automatiquement l’acheteur vers l’OTO 1.

### 3. OTO 1 après l’achat
- Titre : **Pack Édition Pro — accès à vie**.
- Prix : **97 €**, paiement unique.
- Deux choix très visibles :
  - **« Oui, j’ajoute le Pack Édition Pro à 97 € »** ;
  - **« Non merci, je continue sans le Pack Édition Pro »**.
- Ne jamais représenter le refus comme une perte de l’achat à 47 € : l’accès principal est déjà acquis.

### 4. Alternative après refus de l’OTO 1
- Proposer uniquement **Cover Studio Pro — 67 €**, paiement unique.
- Deux choix :
  - **« Oui, j’ajoute Cover Studio Pro à 67 € »** ;
  - **« Non merci, accéder à mon espace »**.
- Après acceptation ou refus, envoyer vers la page de confirmation et l’espace client.

### 5. Page de confirmation
- Confirmer séparément les achats réellement effectués : 47 €, Boost 17 €, Pack Édition Pro 97 € ou Cover Studio Pro 67 €.
- Bouton principal : **« Accéder à EbookStudio »**.
- Ne pas afficher d’OTO supplémentaire pour cette première version.

## Parcours final

```text
Page Landaa
    ↓
Commande EbookStudio 47 € (+ Boost 17 € facultatif)
    ↓ paiement confirmé
OTO Pack Édition Pro 97 €
    ├─ Oui → confirmation + espace client
    └─ Non → Cover Studio Pro 67 €
                  ├─ Oui → confirmation + espace client
                  └─ Non → confirmation + espace client
```

## Basculement EbookStudio à préparer
- À **00 h 00, heure de Paris, le 16 octobre**, supprimer la fermeture automatique du paiement à 47 € liée à la date et aux 15 places.
- Conserver le contrôle serveur du prix : aucun ancien lien ne doit pouvoir commander un autre montant.
- Remplacer les compteurs et messages de clôture sur `/commander`, les offres, le menu et les bandeaux par la présentation permanente.
- Faire pointer la racine publique vers la nouvelle page Landaa, tout en conservant les paramètres de suivi.
- Enchaîner le paiement confirmé vers l’OTO 97 €, puis vers l’alternative 67 € en cas de refus.
- Accorder les droits seulement après confirmation réelle de chaque paiement.
- Préserver les abonnements historiques et les achats antérieurs, sans migration forcée.
- Arrêter les relances propres à l’opération « 15 places jusqu’au 15 octobre » ; aucun email ne sera envoyé sans autorisation explicite.

## Contrôles avant mise en ligne
- Tester les quatre parcours : 47 € seul ; 47 € + Boost ; 47 € + 97 € ; 47 € + refus 97 € + 67 €.
- Vérifier les droits obtenus après chaque combinaison et l’absence de double débit.
- Vérifier les retours après paiement, les refus, l’actualisation de page et les anciens liens directs.
- Vérifier sur mobile et ordinateur que les prix, boutons et mentions « paiement unique » sont lisibles.
- Faire une dernière vérification le **15 octobre**, puis publier le basculement uniquement avec l’autorisation de Georges.

## Détails techniques
- Le système actuel ferme effectivement l’offre le 15 octobre à 23 h 59 et bloque aussi le paiement côté serveur : le changement doit donc être fait dans l’affichage **et** dans le contrôle de paiement.
- L’URL Landaa est centralisée dans EbookStudio ; une seule modification doit suffire pour la redirection publique.
- L’OTO 97 € existe déjà sous le droit `edition_pro`, et l’alternative Cover Studio Pro reste à 67 €.
- Aucun paiement « en un clic » n’est requis pour cette version : un paiement intégré classique peut être utilisé pour les options.
