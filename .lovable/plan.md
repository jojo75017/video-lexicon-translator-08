# Trouver et boucher la faille des inscriptions

## Ce que disent les chiffres (vérifié en base)

- 11 792 emails envoyés sur 30 jours, 204 clics.
- 25 leads au total (6 sur 30 jours), 0 commande payée.
- **0 chapitre d'essai généré depuis le début** (`trial_chapters` est vide), alors que des visiteurs ont bien cliqué sur des liens `/essai`.

Conclusion : la faille n'est pas l'envoi, c'est l'arrivée. Les emails envoient surtout vers `/cadeau` (une liste de niches à lire) et `/commander` (payer tout de suite). La seule page qui donne envie de rester — écrire son livre — est atteinte par très peu de monde, et personne ne va jusqu'au bouton de génération : il faut remplir 4 champs avant de voir quoi que ce soit.

Le visiteur ne vient pas lire des niches. Il vient voir son livre exister.

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

4. **La campagne pointe vers l'essai.**
   - Emails 1 à 3 de la campagne unique : CTA vers `/essai` (« Voir mon livre commencer »), plus vers la liste de niches.
   - Les 5 niches restent accessibles, mais en second lien depuis `/essai` et dans les bonus.
   - Emails 4 et 5 gardent `/commander`.

5. **Mesurer chaque marche.**
   - Poser des évènements dans `capture_events` : arrivée sur `/essai`, clic sur générer, sommaire affiché, mur vu, email donné, clic vers `/commander`.
   - Un petit tableau dans l'admin campagnes affiche ces 6 chiffres, pour voir la marche qui casse au lieu de deviner.

## Détails techniques

- `src/pages/launch/EssaiPage.tsx` : formulaire réduit à un champ, options avancées repliées, exemples pré-remplis, aperçu progressif, chapitre tronqué + mur email, bloc offre après livraison.
- `supabase/functions/trial-chapter/index.ts` : découper `generate` en deux actions (`outline` puis `chapter`) et renvoyer un extrait libre + le texte complet seulement après `claim`. Écriture du lead dans `funnel_leads` au moment du `claim`.
- `src/data/campagneUnique.ts` : nouveaux `ctaUrl` / `ctaLabel` pour les emails 1 à 3, corps réécrits autour de « votre livre commence en 2 minutes ».
- Tracking via la table `capture_events` existante (`surface: 'essai'`, `event_type` par marche) ; lecture agrégée dans `AdminSequenceEmailPage` / page campagnes.
- Aucun changement de tarif ni de logique de paiement : `/commander` reste le paiement unique 47 €.
