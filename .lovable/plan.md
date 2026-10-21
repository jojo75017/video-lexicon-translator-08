# Plan — Répartir les onglets en 3 formules et épurer le site

Rien n'est activé automatiquement : chaque étape se termine par votre validation. Les prix, les paiements, les tunnels, les formulaires et les droits des clients actuels (47 €, V2, abonnements, JVZoo) restent identiques.

## Étape 1 — Inventaire complet (lecture seule)
- Relever chaque onglet et chaque page réellement présents : menu du haut, barre latérale, Livres spéciaux, KDP, Outils, Studios, Compte, pages publiques.
- Pour chaque ligne, indiquer : nom affiché, adresse, à quoi ça sert, accès actuel (inclus / option payante / admin), utilisé ou non.
- Livrable : **une grille des 3 formules** (Starter 27 € / Auteur 97 € / Édition 197 €), en Word et PDF dans vos Fichiers, listant **tous** les onglets regroupés par famille (écrire, livres spéciaux, couverture, Ebookstudio KDP, vendre, audio, compte), avec une coche ou un cadenas par formule. Vous vous prononcez ensuite ligne par ligne.
- L’onglet « KDP » sera renommé **« Ebookstudio KDP »** (seulement le nom affiché, les adresses restent identiques) — appliqué à l’étape 4 après votre accord.

## Étape 2 — Proposition Starter / Auteur / Édition
Chaque ligne du tableau reçoit une colonne de décision : **Starter 27 €**, **Auteur 97 €**, **Édition 197 €**, **Option à part**, **Admin seulement** ou **Page à supprimer**.

Règles déjà fixées par vous :
- Starter : livres illimités, rédaction complète, sommaire, exports, guide KDP et infos de publication de base. Pas de BD.
- Auteur : tout Starter + BD + outils d'écriture avancés (plusieurs genres, correction, HumanizeAI, Guides pratiques).
- Édition : tout Auteur + Studio Couverture broché complet + impression pro, illustrations, audio, albums jeunesse.
- Points à trancher par vous, signalés en couleur : audiolivre, traductions, recherche Amazon, Brand Book, marketing.

## Étape 3 — Liste des pages à épurer
- Classer les pages en trois groupes : **à garder**, **à rediriger** (ancienne adresse vers la page actuelle, pour ne casser aucun lien d'email), **à supprimer**.
- Jamais supprimés : tunnels de vente, pages de paiement et de remerciement, formulaires, pages légales, pages liées aux emails Systeme.io et Resend, accès JVZoo.
- Livrable : liste à valider page par page.

## Étape 4 — Mise en place (seulement après votre accord écrit)
- Appliquer la répartition validée aux cadenas et à la grille des offres.
- Appliquer les redirections et suppressions validées.
- Vérifier sur ordinateur et téléphone avec un compte Starter, Auteur, Édition et un ancien client.
- Aucune publication sans votre « publie ».

## Détails techniques
- Sources lues pour l'inventaire : `v3ToolPlans.ts`, `v3ModuleAccess.ts`, `v3Features.ts`, menus (`v3HeaderMenu`, `modernSidebarSections`), `kdpTabPages.ts`, `specialBookTabs.ts`, `v2ToolsRegistry.ts`, déclaration des routes de l'application.
- Utilisation réelle estimée via les statistiques de visite du site quand elles existent.
- Étapes 1 à 3 : aucun fichier de l'application modifié.
