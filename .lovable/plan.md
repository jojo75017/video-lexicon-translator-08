# Accueil V3 : bandeau d'accroche + moteurs multi-modèles + sections de conviction

## Ce qui est garanti d'abord
- **`/ebook-planner` reste votre page de travail V2, intacte et toujours accessible.** Aucune suppression, aucun blocage, aucune redirection forcée depuis cette adresse. Le bouton « Ouvrir V3 » / « Revenir V2 » continue de fonctionner dans les deux sens.
- Les changements ne touchent que l'accueil V3 (`/v3`) et le choix de la page d'arrivée après connexion.

## Objectif
Restructurer l'accueil V3 dans cet ordre : bandeau d'accroche fort, grille des moteurs IA réellement utilisés, module des livres, puis les blocs de conviction (marché, avant/après, public, garantie, licence).

## Règle de nommage
- Nom affiché partout : **Ebookstudio V3**.
- Aucune mention d'un outil concurrent ni d'un nom emprunté (ni titres, ni textes, ni commentaires de code).
- Vocabulaire retenu : « anciens outils KDP », « une IA généraliste », « équipe d'IA spécialisées ».

## Partie 0 — Bandeau d'accroche (premier module)

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Pleine largeur, émeraude + or (charte V3)                           │
│                                                                      │
│  « Premier agent d'édition IA multi-modèle au monde »                │
│                                                                      │
│  « Transformez n'importe quelle idée de livre simple en un package   │
│    complet prêt pour Amazon : Kindle, livre broché, couverture,      │
│    livre audio et métadonnées. »                                     │
│                                                                      │
│  Pastilles : Kindle · Broché · Couverture · Audio · Métadonnées      │
│                    [ Découvrir les moteurs ]                         │
└──────────────────────────────────────────────────────────────────────┘
```

Titre en police grande mais mesurée (pas de hauteur d'écran complète), texte centré.

## Partie 1 — Section « Moteur de publication multi-modèles » (juste en dessous)

Même esprit que la capture de référence, mais **uniquement avec les moteurs réellement employés dans Ebookstudio V3**, tels que déjà déclarés dans `V3EngineBanner.tsx`.

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Chapeau : « Ebookstudio V3 ne repose pas sur un modèle d'IA unique. │
│  Il utilise un moteur de publication multi-modèles où chaque tâche   │
│  est confiée à une IA spécialisée. »                                 │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ RECHERCHE    │ │ RÉDACTION    │ │ VISUELS      │ │ MISE EN PAGE │
│ Gemini —     │ │ ChatGPT —    │ │ Génération   │ │ Cover Studio │
│ recherche    │ │ la plume     │ │ d'images IA  │ │ Pro — 300 DPI│
│ approfondie  │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ NARRATION    │ │ MÉTADONNÉES  │ │ INTERNATIONAL│ │ PARTENARIAT  │
│ Synthèse     │ │ Optimisation │ │ Traduction   │ │ KDP Pilot    │
│ vocale       │ │ KDP          │ │ 10 langues   │ │ Suivi des    │
│ premium      │ │              │ │              │ │ ventes &     │
└──────────────┘ └──────────────┘ └──────────────┘ │ concurrence  │
                                                   └──────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Trois bénéfices : autonomie réelle de l'IA · fichiers prêts pour KDP │
│ · un seul enchaînement de l'idée au fichier publiable                │
└──────────────────────────────────────────────────────────────────────┘
```

Chaque carte reste cliquable vers l'outil déjà en place (`/v3/studio`, `/v3/hub?tab=cover-pro`, `/v3/outils/audiobook`, `/kdp-keywords`, `/v3/outils/traduction`, `/v3/outils/espion-concurrents`, `/kdp-pilot`). Aucun logo de marque tierce ; icônes vectorielles uniquement.

## Partie 2 — Section « Avant / Après »

```text
┌──────────────────────────────────────────────────────────────────────┐
│  « Les anciens outils KDP séduisent cinq minutes,                    │
│    puis lâchent au moment de publier »                               │
└──────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────┐
│ AVANT — UNE SEULE IA          │  │ APRÈS — EBOOKSTUDIO V3        │
│ • Un texte, pas un flux       │  │ 1 Recherche & niche           │
│   de travail d'édition        │  │ 2 Écriture du manuscrit       │
│ • Du contenu, pas de          │  │ 3 Création des visuels        │
│   positionnement              │  │ 4 Conception de couverture    │
│ • Un classeur à livres,       │  │ 5 Voix (livre audio)          │
│   outil d'édition incomplet   │  │ 6 SEO & mots-clés KDP         │
│ • Un modèle d'IA unique,      │  │ 7 Traduction                  │
│   pas une équipe d'édition    │  │ 8 Publication & métadonnées   │
└───────────────────────────────┘  └───────────────────────────────┘
                    ↓  séparateur or  ↓
┌──────────────────────────────────────────────────────────────────────┐
│ « Pas une seule IA qui tente de tout faire.                          │
│   Une IA spécialisée pour chaque étape de votre livre. »             │
└──────────────────────────────────────────────────────────────────────┘
```

## Partie 3 — Section « Voici ce que prouve le marché »

```text
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 300 M+   │  │ 70 %     │  │ 67 M$    │  │ 17,67 Md$│  │ 58,5 Md$ │
│ clients  │  │ redev.   │  │ KU       │  │ eBook    │  │ audio    │
│ Amazon   │  │ KDP max  │  │ juin     │  │ 2031     │  │ 2033     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

Puce légale : les directives KDP d'Amazon autorisent le contenu généré par l'IA, mais il incombe aux éditeurs de vérifier la conformité et de divulguer le contenu généré par l'IA lorsque cela est requis.

Chute : « L'opportunité est énorme… mais publier des ouvrages de mauvaise qualité est risqué. Ebookstudio V3 aide les auteurs à abandonner les livres d'IA bon marché et génériques pour adopter un flux de travail d'édition complet et axé sur la qualité. »

## Partie 4 — Section « À qui cela s'adresse-t-il ? »

10 cartes : débutants KDP, auteurs pressés, marketeurs d'affiliation, indépendants, agences d'édition, coachs experts, créateurs de cours, créateurs de contenu, auteurs autoédités, porteurs d'idées qui n'écrivent pas.

Chute : « Si vous souhaitez créer un catalogue d'édition, Ebookstudio V3 vous fournit le système. »

## Partie 5 — Section « Garantie 30 jours »

Titre : « Vous êtes entièrement protégé par notre garantie de remboursement de 30 jours. »

Pendant 30 jours : rechercher des idées, générer des manuscrits, créer des couvertures, préparer les métadonnées, créer des brouillons de livres audio, tester les traductions, créer des ressources d'édition.

Chute : « Voyez à quel point votre flux de travail KDP devient plus rapide. Si ce produit ne vous convient pas, contactez-nous dans les 30 jours et vous serez remboursé. Pas de stress. Aucun risque. Aucun processus compliqué. Soit vous adorez le système… ou vous récupérez votre argent. »

## Partie 6 — Section « Licence commerciale à vie incluse »

Sous-titre : « Ebookstudio V3 n'est pas réservé à vos propres livres. Vous pouvez aussi l'utiliser pour proposer des services d'édition. »

Livrables : packs de livres Kindle, packs de brouillons audio, forfaits de couverture, rapports de recherche KDP, ensembles de descriptions, packs de mots-clés et catégories, packs de traduction, kits de marque d'auteur, plans de séries, packs d'eBooks magnétiques, packs de publication client.

Chute : « Des coachs, consultants, créateurs, experts locaux, chefs d'entreprise et entrepreneurs veulent un livre… mais ne savent pas comment faire les recherches, rédiger, concevoir, mettre en forme ou préparer le document. Avec Ebookstudio V3, vous devenez la personne qui les aide. Vous facturez ce service. Vous livrez plus rapidement. Vous conservez 100 % de ce que vous facturez. »

Note : licence commerciale incluse dans les deux forfaits (Plume et Édition), sans option payante supplémentaire.

## Partie 7 — Correctifs d'affichage (et respect de la V2)
1. Bandeau compact KDP Pilot conservé au-dessus du module des livres, code `PROMO15`.
2. Champs « Commencez votre livre » resserrés : une ligne sur ordinateur, paddings et historique réduits.
3. Page d'arrivée après connexion : `/v3`. **`/ebook-planner` reste accessible en permanence** par le bouton de bascule et par saisie directe de l'adresse ; rien n'y est retiré.
4. Un lien clair « Ouvrir l'espace de travail V2 » dans l'accueil V3, pour y retourner en un clic.
5. Rafraîchissement propre après reconnexion : purge unique des service workers et de Cache Storage (mécanisme déjà présent dans `sitePurge`/`chunkErrorRecovery`), garde-fou anti-boucle, sans toucher aux livres, clés API ni profils.

## Ordre final de l'accueil V3
1. Bandeau d'accroche « Premier agent d'édition IA multi-modèle au monde ».
2. Section « Moteur de publication multi-modèles » (nos 7 moteurs).
3. Bandeau compact KDP Pilot.
4. Module des livres : `V3StartBookBar` compact + `V3BriefRecap`.
5. Marché.
6. Avant / Après.
7. Public cible.
8. Garantie 30 jours.
9. Licence commerciale.
10. Pied de page.

## Vérification
- `/ebook-planner` s'ouvre normalement et tous ses onglets fonctionnent comme avant.
- Après reconnexion : arrivée sur `/v3`, bandeau d'accroche puis moteurs visibles en haut, champs réduits.
- Les cartes moteurs pointent vers des outils existants (aucun lien mort).
- Toutes les sections lisibles sur ordinateur et mobile, 100 % en français, aucune marque étrangère.
- Aucun rechargement en boucle.

## Détails techniques
- Nouveaux composants :
  - `src/components/v3public/V3HeroBanner.tsx`
  - `src/components/v3public/V3BeforeAfterPanel.tsx`
  - `src/components/v3public/V3MarketProofPanel.tsx`
  - `src/components/v3public/V3AudiencePanel.tsx`
  - `src/components/v3public/V3GuaranteePanel.tsx`
  - `src/components/v3public/V3CommercialLicensePanel.tsx`
- Réutilisation de `V3EngineGrid` (`src/components/v3public/V3EngineBanner.tsx`) pour la section moteurs, montée juste sous le bandeau d'accroche ; contenu des moteurs conservé tel quel (nos outils réels).
- Recomposition de `src/pages/v3public/V3HomePage.tsx` selon l'ordre ci-dessus ; aucune modification des pages V2 (`EbookPlanner*`) ni de `V2V3FloatingSwitch`.
- Styles alignés sur `src/styles/v3-public.css` (émeraude `#064e3b`, or `#c9a84c`, crème, `v3-serif`).
- Icônes `lucide-react` uniquement : aucun appel IA, aucune génération d'image, donc aucun crédit IA consommé.
