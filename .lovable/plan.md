# Une page de vente bâtie sur le modèle « Document de Référence »

Ce modèle convertit parce qu'il suit un ordre précis : agitation du problème → deux profils dans lesquels le lecteur se reconnaît → ancienne méthode vs nouvelle → preuve concrète → étapes → détail de la valeur ligne par ligne → témoignages → auteur → garantie → FAQ → dernier rappel de prix.

Je reprends cette **structure** et ce **ton (tutoiement, phrases courtes, une idée par ligne)**, mais avec **votre offre réelle** : EbookStudio, accès à vie 47 € (au lieu de 59 €) jusqu'au 31 août. Aucun chiffre, témoignage ou promesse inventé.

## Choix à confirmer

Par défaut je crée une **nouvelle page `/methode`** (le modèle complet, long format) et je garde `/commander` comme page de paiement où arrive le bouton. Si vous préférez que ce nouveau format **remplace directement `/commander`**, dites-le et je le fais à la place.

## Structure de la page (adaptée à EbookStudio)

```text
1  Cible + promesse : « AUTEURS, COACHS, FORMATEURS, EXPERTS »
   Transforme ton savoir en livre publié sur Amazon. Sans savoir écrire.
   Sans agence. Sans y passer six mois.
2  Prix ancré : 47 € / 59 € barré / -20 % · Accès immédiat · Garantie 30 jours
3  LE PROBLÈME → deux profils :
      « Tu as le sujet, mais la page reste blanche »
      « Tu sais quoi dire, mais pas le temps »
   Chute : ton livre reste dans ta tête. Il vaut 0 €.
4  L'ANCIENNE MÉTHODE  vs  LA NOUVELLE VOIE (2 colonnes, même rythme que le modèle)
5  CE QUE ÇA DONNE EN PRATIQUE : le déroulé réel d'un livre (idée → sommaire validé
   → chapitres rédigés et corrigés → couverture → fiche Amazon → publication)
6  COMMENT ÇA MARCHE en 4 étapes (Plan · Écrire · Habiller · Publier)
7  CE QUE TU REÇOIS — valeur détaillée ligne par ligne, uniquement les modules
   qui existent vraiment (15 agents, correction éditoriale, Cover Studio Pro,
   données KDP, audio, traduction 10 langues, Génie/sommaire IA)
   → Valeur totale affichée, puis « Ton accès aujourd'hui : 47 € »
8  Pas de témoignages (personne n'est rentré de vacances) → à la place, un bloc
   factuel « Ce que l'outil produit vraiment » : exemples de livres réels,
   captures des livrables (manuscrit, couverture, fiche Amazon). Le bloc
   témoignages sera ajouté dès que vous aurez des avis réels.
9  QUI EST DERRIÈRE ÇA : votre bio (10 ans d'auto-édition, catalogue thriller /
   romance / jeunesse sur Amazon KDP, EbookStudio pensé par un auteur pour les
   auteurs) + votre citation « transformer ses idées en ouvrages professionnels,
   sans se perdre dans la complexité technique. »

10 Garantie 30 jours, sans justification
11 FAQ (8 questions, adaptées : « ça marche dans mon domaine ? », « je n'écris pas
   bien », « faut-il une audience ? », « c'est de l'IA, Amazon l'accepte ? »…)
12 Rappel final + compte à rebours 31 août + bouton unique
```

Un seul bouton répété, toujours vers `/commander` — cohérent avec la règle « 1 promesse = 1 bouton » du tunnel déjà en place.

## Preuve et autorité

- **Aucun témoignage inventé.** Le bloc avis est remplacé par la preuve produit (livrables réels) et réactivé plus tard avec vos vrais avis.
- **Autorité assurée par votre bio** : elle remplace le rôle du « Damien Menu » du modèle — expérience de terrain d'auteur auto-édité, pas de chiffres de revenus non vérifiables.


## Détails techniques

- Nouvelle page `src/pages/launch/MethodePage.tsx` + route `/methode` dans `src/App.tsx`.
- Sections découpées en composants sous `src/components/launch/methode/` (Problème, AvantAprès, Étapes, Valeur, Témoignages, FAQ, RappelFinal).
- Réutilisation du compte à rebours et du bouton unique de `FicheShell.tsx` ; palette existante (crème #FBF8F3, vert #0F2E1F, or #D4AF37), pas de couleurs codées en dur hors tokens déjà utilisés.
- Métadonnées SEO (title < 60, description < 160), un seul H1, FAQ en JSON-LD.
- Lien ajouté dans la séquence email comme 6e fiche si vous voulez la tester en A/B contre `/fiche/histoire`.
