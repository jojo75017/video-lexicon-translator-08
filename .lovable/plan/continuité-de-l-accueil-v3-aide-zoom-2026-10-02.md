# Continuité de l’accueil V3 : aide Zoom

## Objectif
Ajouter, uniquement pour les abonnés connectés, un bloc d’aide immédiatement après les six rangées d’onglets défilants de l’accueil `/v3`.

## Contenu prévu
- Titre clair : « Vous êtes coincé ? Parlons-en ensemble ».
- Court texte rassurant : appel de 30 minutes avec le fondateur pour débloquer une étape, clarifier une fonction ou comprendre une analyse.
- Bouton principal « Réserver un appel Zoom (30 min) » ouvrant le lien de réservation existant dans un nouvel onglet.
- Aucun formulaire supplémentaire et aucune modification du parcours actuel.

## Présentation
- Continuer le style lumineux actuel de l’accueil : fond clair, orange de la marque, titre serif et bouton très visible.
- Faire une transition naturelle après les bandeaux défilants, sans carte promotionnelle agressive.
- Ajouter un petit repère visuel lié à l’accompagnement humain, adapté à l’ordinateur et au téléphone.

## Placement et visibilité
```text
Accueil abonné
  → Tableau de bord
  → Onglets défilants
  → Nouveau bloc d’aide Zoom
  → Suite actuelle de la page
```
- Le bloc s’affiche aux abonnés connectés.
- La page publique non connectée garde son contenu actuel sans ce bloc d’assistance abonné.

## Détails techniques
- Créer un bloc dédié réutilisant les styles et composants V3 existants.
- Utiliser le lien déjà présent : `https://calendly.com/boubetgeorges/nouvelle-reunion`.
- Enregistrer le clic avec le suivi Zoom déjà disponible.
- Vérifier le rendu connecté sur ordinateur et mobile, l’ouverture du lien, puis la validation automatique du projet.
- Ne pas publier.
