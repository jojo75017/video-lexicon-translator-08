Je suis en mode Plan, donc je ne peux pas générer le fichier maintenant. Passez en **mode Build** et je produis le PDF immédiatement.

## Ce que je vais livrer

Un **PDF paysage 16:9, 8 slides**, format présentation premium à offrir, déposé dans `/mnt/documents/EbookStudio_Pro_V2_Video4_Slides.pdf`.

## Charte visuelle (cohérente avec EbookStudio)
- Fond clair `#FAFAFA`, texte `#232F3E`
- Accent teal `#008296` (titres, onglets actifs)
- Accent orange `#FF9E2D` (CTA, puces, "lumière flash")
- Typo Helvetica bold pour titres XL, corps 18 pt
- Footer paginé "EbookStudio Pro V2 · Vidéo 4"
- Marque « EbookStudio Pro V2 » partout (zéro mention "EbookStudio" seul)

## Effet "flash lumière" (élégant, pas clinquant)
- Halo orange dégradé (3 cercles transparents) + cœur blanc + 12 rayons fins
- Posé sur le slide 2 (mockup tableau de bord) et en éléments décoratifs sur les slides cover/finale
- Discret, jamais sur du texte à lire

## Les 8 slides
1. **Cover** — fond sombre teal, titre XL « Rédigez votre ebook de 10 chapitres en un après-midi », 4 pills stats (10 ch / 5 onglets / 2-4 h / 15 agents), flash décoratif
2. **Le tableau de bord** — mockup stylisé Plan (5 onglets + 3 boutons + liste projets) avec **flash lumineux** posé sur l'angle du dashboard
3. **Onglet Mes Projets** — bullets + mockup formulaire création projet
4. **Onglet Planificateur** — bullets + mockup liste des 10 chapitres
5. **Workflow IA 15 Agents** — bandeau orange, grille 3×5 des agents P1→P15 reliés
6. **Onglet Couverture** — bullets + mockup 3D du livre teal/orange
7. **🎯 Outils KDP** — grille de 6 cartes (Description, Mots-clés A9, Catégories, Prix, Bio, Checklist)
8. **Récap & Export** — fond sombre, 3 étapes (PDF / EPUB / Pack ZIP), CTA orange « 6 étapes · 10 chapitres · 1 après-midi », teaser vidéo 5

## Technique
- ReportLab (canvas vectoriel pur, sans dépendance image)
- QA visuel automatique : conversion en JPG via `pdftoppm` puis inspection de chaque page (overflow, contraste, alignement) avant livraison
- Aucune modification du code projet — uniquement génération d'artefact dans `/mnt/documents/`

Dites « approuver » ou passez en Build et je lance la génération.
