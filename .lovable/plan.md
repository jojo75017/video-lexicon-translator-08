# Refonte des emails « Offre 47 € » — version vendeuse

## Le constat
Les 5 emails actuels sont trop sobres : ils annoncent un prix, pas une transformation. Le lecteur ne voit ni ce qu'il va découvrir, ni ce qu'il obtient concrètement, ni pourquoi c'est maintenant. Résultat : 71 % d'ouvertures, presque aucun clic.

## Ce qui change dans chaque email
Chaque email passe de ~60 mots à un vrai email de vente structuré :

1. **Accroche** qui parle du problème du lecteur (le livre qu'il n'a jamais écrit), pas de l'outil.
2. **La promesse concrète** : « votre idée devient un livre complet, prêt à publier sur Amazon KDP, ce week-end ».
3. **Ce qu'il va découvrir en entrant** — la liste réelle et détaillée : plan chapitre par chapitre, rédaction complète, export Word/PDF aux normes KDP, couverture avec dos calculé au bon format, 4e de couverture, fiche Amazon (titre, description, 7 mots-clés, catégories), livres illustrés enfants 3-7 ans, traduction, studio de couverture pro, communauté, et la V3 incluse sans repayer.
4. **La preuve / le concret** : nombre d'outils réellement disponibles, formats KDP gérés, exemples de résultats — uniquement des faits vérifiables du produit, aucun faux témoignage ni chiffre inventé.
5. **Lever le doute** : paiement unique, pas d'abonnement, accès à vie, réponse personnelle de Georges.
6. **Un seul bouton, gros et visible**, répété deux fois (milieu + fin), avec un libellé d'action (« Voir tout ce que j'obtiens pour 47 € »).
7. **Rareté honnête** : tarif 47 € au lieu de 59 € jusqu'au 30 septembre.

## Les 5 emails de la séquence (angles distincts)
| Step | Angle | Promesse mise en avant |
|---|---|---|
| 1 (J+0) | La révélation complète | Tout ce qu'il y a derrière la porte : la liste intégrale des outils |
| 2 (J+2) | La transformation | « De 3 lignes d'idée à un manuscrit complet » — avant / après |
| 3 (J+5) | La démonstration | Les 5 étapes du workflow, ce que l'utilisateur voit à l'écran à chaque étape |
| 4 (J+7) | Les objections | « Je n'écris pas bien », « c'est technique », « et si ça ne me plaît pas » |
| 5 (J+10) | L'échéance | Dernier rappel : 47 € → 59 € le 30 septembre, ce qu'il perd en attendant |

## Design de l'email
Habillage plus premium mais toujours compatible boîtes mail (tables HTML, styles inline) :
- bandeau EbookStudio teal, badge « OFFRE 47 € AU LIEU DE 59 € »
- bloc prix mis en valeur
- liste de bénéfices avec pastilles ✓ lisibles
- bouton orange large (CTA), pleine largeur sur mobile
- bloc « Ce que vous obtenez » encadré
- pied de page : désinscription + mention légale, pixel de suivi conservé

## Détails techniques
- Réécriture du tableau `STEPS` dans `supabase/functions/send-sales-email/index.ts` : chaque step reçoit `heading`, `intro`, `bullets[]`, `proof`, `objection`, `cta`, `ps`.
- Refonte de la fonction `render()` : nouveau gabarit HTML (bloc prix, liste ✓, double CTA, encadré bénéfices), liens de tracking et pixel inchangés.
- Mise à jour des `subject` correspondants dans `src/data/canonicalEmailCampaign.ts` (les noms de templates `offre-47-unique-1..5` restent identiques pour ne pas casser l'anti-doublon ni les stats du tableau de bord Perf & CA).
- Redéploiement de `send-sales-email`, puis envoi de test sur ton adresse (mode `test`) avant toute relance de masse.
- Aucun envoi automatique déclenché par ce plan : le Step 2 du 7 août partira avec les nouveaux textes.

## À valider avec toi ensuite
Tu as dit vouloir me donner plus de détails : dès que tu me transmets les éléments réels (résultats obtenus, nombre d'utilisateurs, retours de bêta-testeurs, captures ou lien vidéo de démo), je les intègre comme preuve dans les emails 1, 3 et 4. Sans ces éléments, je n'invente rien et je reste sur les faits produit.
