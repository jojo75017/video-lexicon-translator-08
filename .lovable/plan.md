# Trouver et boucher la faille des inscriptions

## Ce que disent les chiffres (vérifié en base, 30 derniers jours)

- 11 792 envois, **938 personnes ouvrent** sur 1 959 prospects actifs : environ 48 % d'ouverture, c'est très bon.
- Mais seulement **34 personnes cliquent** — moins de 4 % des ouvreurs. 204 clics au total.
- 25 leads depuis le début, 0 commande payée.
- **0 chapitre d'essai généré depuis le début** (`trial_chapters` est vide), alors que des visiteurs ont bien cliqué sur des liens `/essai`.

Donc, pour répondre franchement à la question « est-ce qu'on aura plus de clics ? » : les gens ouvrent déjà, le problème est ce qu'on leur propose dans l'email et ce qu'ils trouvent derrière le lien. Aujourd'hui on propose de lire une liste de niches ou d'aller payer. Personne ne clique pour ça.

Le visiteur ne vient pas lire des niches. Il vient voir son livre exister. On change donc les deux choses en même temps : la promesse dans l'email (le clic) et la page d'arrivée (l'inscription). Aucun des deux ne suffit seul.


## Le nouveau parcours

```text
Email  ──►  /essai  (1 seul champ : votre idée)
                │
                ▼
        Aperçu immédiat, sans email :
        titre + sous-titre + sommaire complet
        + les 2 premiers paragraphes du chapitre 1
                │
                ▼
        Mur doux : « Lire le chapitre 1 en entier »
        → email  → chapitre complet à l'écran + envoyé par mail
                │
                ▼
        « Écrire les chapitres 2 à 60 »
        → /commander (47 € à vie jusqu'au 30/09/2026)
```

Trois règles : on montre avant de demander, on ne demande qu'un email, on ne parle d'argent qu'après avoir livré quelque chose.

## Ce qui va changer

1. **`/essai` devient la page d'entrée du tunnel.**
   - Un seul champ obligatoire (l'idée) + un bouton. Public, ton et langue passent dans un bloc « Affiner » replié, facultatif.
   - Trois idées d'exemple cliquables pour partir en un clic.
   - Génération en deux temps : d'abord titre + sommaire (rapide, ça accroche), puis le chapitre 1 en arrière-plan.

2. **Mur d'inscription au bon endroit.**
   - Sommaire et début du chapitre visibles sans rien donner.
   - Le reste du chapitre est flouté avec un encart « Recevoir mon chapitre 1 complet » : email seul, déblocage immédiat à l'écran + envoi par mail.
   - Le lead part dans `funnel_leads` avec la source, et le tag campagne existant.

3. **Un seul discours d'offre.**
   - Sur `/essai`, remplacer « premier mois offert / ouverture le 1er octobre » par l'offre réelle : 47 € à vie jusqu'au 30 septembre 2026, puis abonnement mensuel 27 € ou 47 €.
   - Bloc offre affiché seulement après la livraison du chapitre.

4. **La campagne pointe vers l'essai — et donne une raison de cliquer.**
   - Emails 1 à 3 : CTA unique vers `/essai`, formulé comme un résultat personnel et gratuit, pas comme une lecture : « Donnez votre idée, je vous rends le chapitre 1 », « Votre sommaire complet en 2 minutes », « Voyez votre livre commencer ».
   - Objets réécrits sur la même promesse (le bénéfice dans l'objet, aucune mention de prix dans les trois premiers).
   - Un seul lien par email, répété 2 fois (texte + bouton) : c'est ce qui fait grimper le taux de clic quand l'ouverture est déjà bonne.
   - Les 5 niches restent accessibles, mais en second lien depuis `/essai` et dans les bonus.
   - Emails 4 et 5 gardent `/commander`.


5. **Le visiteur ne voit jamais la V3.**
   - `/essai` reste une page totalement autonome : son propre en-tête, aucun lien vers `/v3`, aucune barre latérale, aucun onglet du studio.
   - Un seul chemin de sortie : « Écrire la suite » → `/commander`. Le logo renvoie vers la page d'accueil publique, pas vers la V3.
   - Le visiteur reste dans « son application » : son idée, son sommaire, son chapitre. Rien d'autre à l'écran.

6. **Mesurer chaque marche.**
   - Poser des évènements dans `capture_events` : arrivée sur `/essai`, clic sur générer, sommaire affiché, mur vu, email donné, clic vers `/commander`.
   - Un petit tableau dans l'admin campagnes affiche ces 6 chiffres, pour voir la marche qui casse au lieu de deviner.

## Détails techniques

- `src/pages/launch/EssaiPage.tsx` : formulaire réduit à un champ, options avancées repliées, exemples pré-remplis, aperçu progressif, chapitre tronqué + mur email, bloc offre après livraison, et suppression de tout lien V3 (page isolée, hors `V3PublicLayout`).
- `supabase/functions/trial-chapter/index.ts` : découper `generate` en deux actions (`outline` puis `chapter`) et renvoyer un extrait libre + le texte complet seulement après `claim`. Écriture du lead dans `funnel_leads` au moment du `claim`.
- `src/data/campagneUnique.ts` : nouveaux `ctaUrl` / `ctaLabel` pour les emails 1 à 3, corps réécrits autour de « votre livre commence en 2 minutes ».
- Tracking via la table `capture_events` existante (`surface: 'essai'`, `event_type` par marche) ; lecture agrégée dans `AdminSequenceEmailPage` / page campagnes.
- Aucun changement de tarif ni de logique de paiement : `/commander` reste le paiement unique 47 €.
- Après implémentation : envoi d'un email de test de l'email 1 (nouveau CTA vers `/essai`) pour vérification.

