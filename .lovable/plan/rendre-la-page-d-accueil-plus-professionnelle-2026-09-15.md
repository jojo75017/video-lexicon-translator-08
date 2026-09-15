# Rendre la page d'accueil plus professionnelle

La page fonctionne, mais elle donne encore une impression « empilée » : beaucoup de bandeaux les uns sous les autres, des largeurs différentes, des émojis en titres et plusieurs promesses qui se répètent. Voici ce qui la ferait passer d'une bonne page à une page de maison d'édition.

## 1. Une seule largeur, un seul rythme

Aujourd'hui certaines sections font 1280 px, d'autres 1152 px, d'autres toute la largeur. On aligne tout sur la même largeur et les mêmes espacements verticaux. Effet immédiat : la page paraît dessinée, pas assemblée.

## 2. Moins de bandeaux, mieux hiérarchisés

Ordre proposé, du plus important au reste :

```text
1. Lancement 1er octobre (bande fine, sobre)
2. Titre + promesse + bouton principal
3. Vidéo de présentation (cadre éditorial)
4. Vos deux nouveautés : Couvertures + Studio BD & Jeunesse (côte à côte)
5. Comment ça marche (3 étapes)
6. Ce que vous obtenez / preuve / garantie
7. Auteur invité + blog
8. Dernier appel à l'action
```

Les bandeaux « clé Gemini », « migration V2 », « 25 agents », « KDP Pilot », « 15 agents », « 10 niches » ne disparaissent pas : ils sont regroupés dans deux encadrés propres (« Avant de commencer » et « Pour aller plus loin ») au lieu de six bandes colorées.

## 3. Titres sans émojis

Les titres passent en typographie éditoriale seule ; les émojis sont remplacés par de petites icônes discrètes. C'est le détail qui fait le plus « amateur » aujourd'hui.

## 4. Couleurs plus tenues

On garde ivoire / encre / vert profond / or, mais l'or reste un accent (filet, badge, bouton) au lieu de servir de fond de bandeau plein. Les blocs jaunes vifs deviennent des encadrés ivoire à filet or.

## 5. Boutons cohérents

Un seul bouton principal par écran visible, un seul style secondaire. Les autres liens deviennent des liens texte.

## Ce qui ne change pas

Aucun texte de prix, aucun montant, aucun paiement, aucune route, aucun module V4, aucune base de données ni sécurité. Seule la présentation de `/v3` est retouchée.

## Détails techniques

- `V3HomePage.tsx` : réordonnancement des sections, wrapper de largeur unique, regroupement des bandeaux annexes dans deux composants de présentation.
- `src/styles/v3-public.css` : classes de rythme vertical et d'encadré ivoire/or réutilisables ; l'or plein réservé aux accents.
- Composants existants réutilisés tels quels (`V3LaunchBanner`, `V3HeroBanner`, `V3PresentationVideo`, `V3CoverStudioBanner`, `BdComicNewsBanner`, `V3MarketProofPanel`, `V3GuaranteePanel`…) ; seuls les conteneurs et titres sont ajustés.
- `ReadingGate` conservé au même endroit logique.
- Vérifications : TypeScript, tests existants, captures Playwright à 1280 et 1571 px.
