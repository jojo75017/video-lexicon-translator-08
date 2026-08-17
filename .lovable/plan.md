# Plan — Garantie « aucun mot perdu »

## Objectif
Le texte produit ou corrigé par l’IA ne doit jamais contenir moins de mots que le texte validé par l’auteur. Il peut être plus long afin d’atteindre l’objectif du chapitre, mais jamais plus court.

## Règle centrale
```text
Minimum obligatoire = maximum de :
- nombre de mots du texte validé par l’auteur ;
- objectif choisi pour le chapitre.

Résultat accepté seulement si : mots produits >= minimum obligatoire.
```

## Travaux prévus

1. **Créer un compteur de référence fiable**
   - Compter les mots exacts du récit intégral conservé, sans utiliser le résumé IA.
   - Enregistrer le nombre de mots validés comme valeur protégée avec le texte source.
   - Recalculer cette valeur à chaque nouveau souvenir ajouté ou modification validée.

2. **Afficher clairement la comparaison dans la colonne de droite**
   - Montrer séparément : `Vos mots validés`, `Objectif du chapitre` et `Mots produits par l’IA`.
   - Afficher un statut visible : `Longueur respectée` ou `Complément en cours`.
   - Ne jamais présenter le résumé du livre comme s’il s’agissait du récit complet.

3. **Bloquer toute réduction pendant la rédaction**
   - Transmettre au moteur de rédaction le texte intégral et son compteur de référence.
   - Fixer le minimum réel au plus grand nombre entre le texte confié et l’objectif choisi.
   - Après génération, compter le résultat côté serveur avant de l’accepter.
   - Si le texte est trop court, demander un complément ciblé qui conserve le premier texte, sans recommencer ni résumer.
   - Limiter les compléments et afficher une erreur explicite si la longueur ne peut pas être atteinte, plutôt que d’enregistrer un chapitre raccourci.

4. **Appliquer la même protection aux corrections**
   - Correction, polissage et réécriture ne pourront pas supprimer de mots sous le seuil validé.
   - Les faits, dates, lieux, personnes et souvenirs resteront obligatoires.
   - Le texte d’origine sera conservé tant que la version corrigée n’aura pas passé le contrôle de longueur.

5. **Préserver la règle dans tout le parcours**
   - Synchroniser Génie, colonne de droite, wizard et workflow sur le même texte et le même compteur.
   - Empêcher un ancien état ou un résumé IA de remplacer le récit intégral et sa longueur validée.
   - Conserver le réglage `mots par chapitre` choisi par l’auteur sans modification automatique.

## Vérifications
- Saisir plusieurs longs messages et confirmer que le total validé augmente exactement.
- Générer un chapitre et vérifier que son compteur est au moins égal au minimum obligatoire.
- Corriger puis polir ce chapitre et vérifier qu’aucune étape ne réduit son nombre de mots.
- Recharger la page et reprendre le projet : texte intégral et compteur doivent rester identiques.
- Tester une réponse IA volontairement trop courte et vérifier qu’elle n’est jamais enregistrée comme version finale.